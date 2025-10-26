"use client";

import { Direction, Path, Position } from "@/types";
import {
  getClickedPlayerPosition,
  getDirectionFromTouch,
} from "@/utils/controls";
import { moveInDirection } from "@/utils/segment";
import { useCallback, useEffect, useRef, useState } from "react";
import Grid from "../../components/Grid";
import "./Play.css";
import { useGame } from "@/context/GameContext";
import { copyURL } from "@/utils/url";

const Play: React.FC = () => {
  const { path, board, size, start, setPath, finished, navigateTo } = useGame();

  const [redoStack, setRedoStack] = useState<Path>([]);
  const touchStart = useRef<Position | null>(null);

  const reset = useCallback(() => {
    setPath([start]);
    setRedoStack([]);
  }, [start, setPath]);

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
        <p className={finished ? "highlight" : ""}>Steps: {path.length - 1}</p>
        <button onClick={redo} disabled={redoStack.length === 0}>
          Redo
        </button>
      </div>
    </>
  );
};

export default Play;
