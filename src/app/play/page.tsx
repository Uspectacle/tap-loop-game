"use client";

import { Direction, Path, Position } from "@/types";
import {
  getClickedPlayerPosition,
  getDirectionFromTouch,
} from "@/utils/controls";
import { isValidPath, moveInDirection } from "@/utils/segment";
import { useCallback, useEffect, useRef, useState } from "react";
import Grid from "../../components/Grid";
import "./Play.css";
import { useGame } from "@/context/GameContext";
import { copyURL } from "@/utils/url";
import {
  getBestScore,
  saveBestScore,
  isNewHighscore,
  isTiedScore,
} from "@/utils/highscore";
import { encodeBoard, encodePath } from "@/utils/encoder";

const Play: React.FC = () => {
  const { path, board, size, start, setPath, finished, navigateTo } = useGame();

  const [redoStack, setRedoStack] = useState<Path>([]);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [justSavedHighscore, setJustSavedHighscore] = useState(false);
  const touchStart = useRef<Position | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setJustSavedHighscore(false);
  }, [path]);

  useEffect(() => {
    getBestScore(board).then((best) => setBestScore(best));
  }, [board]);

  // Check if we should save when path is finished
  useEffect(() => {
    if (finished && !justSavedHighscore) {
      const currentLength = path.length - 1;

      if (isNewHighscore(currentLength, bestScore)) {
        saveBestScore(board, path);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setBestScore(currentLength);
        setJustSavedHighscore(true);
      }
    }
  }, [finished, path, bestScore, board, justSavedHighscore]);

  const reset = useCallback(() => {
    setPath([start]);
    setRedoStack([]);
  }, [start, setPath]);

  useEffect(() => {
    if (!isValidPath(path, board)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      reset();
    }
  }, [board, path, reset]);

  const move = useCallback(
    (direction: Direction, iteration: number = 1) => {
      if (finished) return;

      const newPath: Position[] = [...path];

      for (let index = 0; index < iteration; index++) {
        const nextPosition = moveInDirection(direction, newPath, board);

        if (!nextPosition) {
          break;
        }

        newPath.push(nextPosition);
      }

      if (newPath.length !== path.length) {
        setRedoStack([]);
        setPath(newPath);
      }
    },
    [path, setPath, board, finished]
  );

  /** Keyboard */
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") move("top");
      else if (e.key === "ArrowDown") move("bottom");
      else if (e.key === "ArrowLeft") move("left");
      else if (e.key === "ArrowRight") move("right");
    },
    [move]
  );

  /** Touch swipe */
  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!touchStart.current) return;
      const touch = e.changedTouches[0];
      const direction = getDirectionFromTouch(touchStart.current, {
        x: touch.clientX,
        y: touch.clientY,
      });

      if (direction) move(direction);
      touchStart.current = null;
    },
    [move]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleKey, handleTouchStart, handleTouchEnd]);

  const undo = () => {
    if (path.length > 1) {
      const next = path[path.length - 1];

      setRedoStack((prev) => [...prev, next]);
      setPath((prev) => prev.slice(0, -1));
    }
  };

  const redo = () => {
    if (redoStack.length) {
      const next = redoStack[redoStack.length - 1];

      setRedoStack((prev) => prev.slice(0, -1));
      setPath((prev) => [...prev, next]);
    }
  };

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = getClickedPlayerPosition(e, size);
    const player = path[path.length - 1];
    const dx = target.x - player.x;
    const dy = target.y - player.y;

    if (Math.abs(dx) === Math.abs(dy)) return;

    const [direction, iteration]: [Direction, number] =
      Math.abs(dx) > Math.abs(dy)
        ? dx > 0
          ? ["right", dx]
          : ["left", -dx]
        : dy > 0
        ? ["bottom", dy]
        : ["top", -dy];

    move(direction, iteration);
  };

  const openBestScore = () => {
    if (bestScore === null) return;

    const boardKey = encodeBoard(board);
    const pathKey = encodePath(path);
    const url = new URL(window.location.href);
    url.searchParams.set("b", boardKey);
    url.searchParams.set("p", pathKey);

    window.open(url.toString(), "_blank");
  };

  return (
    <>
      <div className="controls">
        <button onClick={() => navigateTo("edit")}>Edit Board</button>
        <button onClick={reset} disabled={path.length <= 1}>
          Reset
        </button>
        <button onClick={copyURL}>Copy URL</button>
      </div>

      <Grid onClick={onClick} />

      <div className="controls">
        <button onClick={undo} disabled={path.length <= 1}>
          Undo
        </button>
        <div className="score-display">
          <p className={finished ? "highlight" : ""}>
            Steps: {path.length - 1}
          </p>
          {finished && isTiedScore(path.length - 1, bestScore) ? (
            justSavedHighscore ? (
              <p className="celebration new-highscore">🎉 New Highscore! 🎉</p>
            ) : (
              <p className="celebration tied-score">🏆 Tied Best Score! 🏆</p>
            )
          ) : bestScore ? (
            <button onClick={openBestScore} className="best-score-link">
              Best: {bestScore}
            </button>
          ) : (
            <p className="new-board">New board discovered!</p>
          )}
        </div>
        <button onClick={redo} disabled={redoStack.length === 0}>
          Redo
        </button>
      </div>
    </>
  );
};

export default Play;
