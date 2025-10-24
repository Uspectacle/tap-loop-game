"use client";

import { Dimensions, Position } from "@/types";
import { getDirection, getPathSegments, getTouchedSquares } from "@/utils/game";
import "@/styles/GameGrid.css";
import { useMemo } from "react";

type Props = {
  path: Position[];
  dims: Dimensions;
};

const Grid: React.FC<Props> = ({ path, dims }) => {
  const touchedSquares = useMemo(
    () => getTouchedSquares(path, dims),
    [path, dims]
  );
  const pathSegments = useMemo(() => getPathSegments(path), [path]);
  const player = useMemo(() => path[path.length - 1], [path]);
  const direction = useMemo(() => getDirection(path), [path]);

  return (
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
      {touchedSquares.map((touchedCell, i) => (
        <div
          key={i}
          className={`grid-cell ${touchedCell.direction}`}
          style={{
            top: `${1 + touchedCell.y * 41}px`,
            left: `${1 + touchedCell.x * 41}px`,
          }}
        />
      ))}
      {pathSegments.map(([from, to], i) => (
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
  );
};

export default Grid;
