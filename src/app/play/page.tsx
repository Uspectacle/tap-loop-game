"use client";

import { Board, Direction, Position } from "@/types";
import { decodeBoard } from "@/utils/encoder";
import { getInfo } from "@/utils/info";
import { moveInDirection } from "@/utils/segment";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Grid from "../../components/Grid";
import "./Play.css";

type Props = {
  board: Board;
};

const SWIPE_THRESHOLD = 30; // minimum px distance for swipe to count

const Play: React.FC<Props> = () => {
  const searchParams = useSearchParams();
  const board = decodeBoard(searchParams.get("b"));

  const [path, setPath] = useState<Position[]>([board.start]);
  const touchStart = useRef<Position | null>(null);
  const info = useMemo(() => getInfo(path, board), [path, board]);

  const reset = () => setPath((prev) => [prev[0]]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(reset, [board]);

  const move = useCallback(
    (direction: Direction) => {
      if (!info.finished) {
        setPath((prev) => moveInDirection(prev, direction, board));
      }
    },
    [board, info.finished]
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

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cellWidth = rect.width / board.size.x;
    const cellHeight = rect.height / board.size.y;
    const x = Math.round((e.clientX - rect.left) / cellWidth);
    const y = Math.round((e.clientY - rect.top) / cellHeight);

    onPositionClick({ x, y });
  };

  return (
    <>
      <Grid handleClick={handleClick} {...info} />
      <div className="controls">
        <button onClick={undo}>Undo</button>
        <p className={info.finished ? "highlight" : ""}>
          Steps: {path.length - 1}
        </p>
        <button onClick={reset}>Reset</button>
      </div>
    </>
  );
};

export default Play;
