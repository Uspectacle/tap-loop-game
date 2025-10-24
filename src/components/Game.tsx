"use client";

import "@/styles/GameGrid.css";
import { Dimensions, Direction, Position } from "@/types";
import { addToPath } from "@/utils/game";
import { useCallback, useEffect, useState } from "react";
import Grid from "./Grid";

type Props = {
  dims: Dimensions;
};

const Game: React.FC<Props> = ({ dims }) => {
  const [path, setPath] = useState<Position[]>([{ x: 1, y: 1 }]);

  const reset = () => setPath((prev) => [prev[0]]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(reset, [dims]);

  const move = useCallback(
    (direction: Direction) => {
      setPath((prev) => addToPath(prev, direction, dims));
    },
    [dims]
  );

  /** Keyboard movement */
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") move("up");
      else if (e.key === "ArrowDown") move("down");
      else if (e.key === "ArrowLeft") move("left");
      else if (e.key === "ArrowRight") move("right");
    },
    [move]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const undo = () => {
    if (path.length > 1) setPath(path.slice(0, -1));
  };

  return (
    <div className="game-wrapper">
      <Grid path={path} dims={dims} />
      <div className="controls">
        <button onClick={undo}>Undo</button>
        <p>Steps: {path.length - 1}</p>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
};

export default Game;
