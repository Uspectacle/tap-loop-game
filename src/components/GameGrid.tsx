"use client";

import { useEffect, useState, useCallback } from "react";
import { Dimensions, Direction, Pos, TouchedSquare } from "../types";
import {
  addToPath,
  getDirection,
  getPathSegments,
  getTouchedSquares,
} from "../utils/game";
import "../styles/GameGrid.css";

type Props = {
  dims: Dimensions;
};

const GameGrid: React.FC<Props> = ({ dims }) => {
  const [path, setPath] = useState<Pos[]>([{ x: 1, y: 1 }]);
  const [direction, setDirection] = useState<Direction>("right");
  const [touched, setTouched] = useState<TouchedSquare[]>([]);

  const player = path[path.length - 1];

  const reset = () => setPath((prev) => [prev[0]]);

  useEffect(reset, [dims]);

  useEffect(() => {
    setTouched(getTouchedSquares(path, dims));
    setDirection(getDirection(path));
  }, [path, dims]);

  const move = useCallback(
    (direction: Direction) => {
      setPath((prev) => addToPath(prev, direction, dims));
      setDirection(direction);
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
      <div
        className="grid-container"
        style={{
          gridTemplateColumns: `repeat(${dims.x}, 40px)`,
          gridTemplateRows: `repeat(${dims.y}, 40px)`,
        }}
      >
        {Array.from({ length: dims.x * dims.y }).map((_, i) => (
          <div
            key={i}
            className="grid-cell"
            style={{
              top: `${1 + Math.floor(i / dims.x) * 41}px`,
              left: `${1 + (i % dims.x) * 41}px`,
            }}
          />
        ))}
        {touched.map((touchedCell, i) => (
          <div
            key={i}
            className={`grid-cell ${touchedCell.direction}`}
            style={{
              top: `${1 + touchedCell.y * 41}px`,
              left: `${1 + touchedCell.x * 41}px`,
            }}
          />
        ))}
        {getPathSegments(path).map(([from, to], i) => (
          <div
            key={i}
            className={`path-line ${getDirection([from, to])}`}
            style={{
              top: `${from.y * 41}px`,
              left: `${from.x * 41}px`,
            }}
          />
        ))}
        {path.length > 1 && (
          <div
            className={`player ${direction}`}
            style={{
              top: `${1 + player.y * 41}px`,
              left: `${1 + player.x * 41}px`,
            }}
          />
        )}
        <div
          className="start"
          style={{
            top: `${1 + path[0].y * 41}px`,
            left: `${1 + path[0].x * 41}px`,
          }}
        />
      </div>
      <div className="controls">
        <button onClick={undo}>Undo</button>
        <p>Steps: {path.length - 1}</p>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
};

export default GameGrid;
