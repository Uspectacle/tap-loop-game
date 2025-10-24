"use client";

import "@/styles/Game.css";
import { Dimensions, Direction, Position } from "@/types";
import { addToPath, getSquares, isSamePosition } from "@/utils/game";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Grid from "./Grid";

type Props = {
  dims: Dimensions;
};

const SWIPE_THRESHOLD = 30; // minimum px distance for swipe to count

const Game: React.FC<Props> = ({ dims }) => {
  const [path, setPath] = useState<Position[]>([{ x: 1, y: 1 }]);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const squares = useMemo(() => getSquares(path, dims), [path, dims]);
  const player = useMemo(() => path[path.length - 1], [path]);
  const noUnTapped = useMemo(
    () => squares.every(({ direction }) => direction),
    [squares]
  );
  const finished = useMemo(
    () => noUnTapped && isSamePosition(player, path[0]),
    [noUnTapped, player, path]
  );

  const reset = () => setPath((prev) => [prev[0]]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(reset, [dims]);

  const move = useCallback(
    (direction: Direction) => {
      if (!finished) {
        setPath((prev) => addToPath(prev, direction, dims));
      }
    },
    [dims, finished]
  );

  /** Keyboard movement (desktop) */
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") move("top");
      else if (e.key === "ArrowDown") move("bottom");
      else if (e.key === "ArrowLeft") move("left");
      else if (e.key === "ArrowRight") move("right");
    },
    [move]
  );

  /** Touch movement (mobile) */
  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!touchStart.current) return;

      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStart.current.x;
      const dy = touch.clientY - touchStart.current.y;

      // Horizontal swipe
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > SWIPE_THRESHOLD) move("right");
        else if (dx < -SWIPE_THRESHOLD) move("left");
      }
      // Vertical swipe
      else {
        if (dy > SWIPE_THRESHOLD) move("bottom");
        else if (dy < -SWIPE_THRESHOLD) move("top");
      }

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
    if (path.length > 1) setPath(path.slice(0, -1));
  };

  const onPositionClick = (target: Position) => {
    const player = path[path.length - 1];
    const dx = target.x - player.x;
    const dy = target.y - player.y;

    if (Math.abs(dx) === Math.abs(dy)) return;

    // Determine which axis is closer
    if (Math.abs(dx) < Math.abs(dy)) {
      // vertical move
      if (Math.abs(dx) > 1) return; // not close enough horizontally

      const direction = dy > 0 ? "bottom" : "top";
      const steps = Math.abs(dy);

      for (let i = 0; i < steps; i++) {
        move(direction);
      }
    } else {
      // horizontal move
      if (Math.abs(dy) > 1) return; // not close enough vertically

      const direction = dx > 0 ? "right" : "left";
      const steps = Math.abs(dx);

      for (let i = 0; i < steps; i++) {
        move(direction);
      }
    }
  };

  return (
    <>
      <Grid path={path} dims={dims} onPositionClick={onPositionClick} />
      <div className="controls">
        <button onClick={undo}>Undo</button>
        <p className={finished ? "highlight" : ""}>Steps: {path.length - 1}</p>
        <button onClick={reset}>Reset</button>
      </div>
    </>
  );
};

export default Game;
