"use client";

import "@/styles/Grid.css";
import { Dimensions, Position } from "@/types";
import { getDirection, getPathSegments, getSquares } from "@/utils/game";
import { useMemo } from "react";

type Props = {
  path: Position[];
  dims: Dimensions;
};

const Grid: React.FC<Props> = ({ path, dims }) => {
  const squares = useMemo(() => getSquares(path, dims), [path, dims]);
  const pathSegments = useMemo(() => getPathSegments(path), [path]);
  const player = useMemo(() => path[path.length - 1], [path]);
  const direction = useMemo(() => getDirection(path), [path]);

  return (
    <div
      className="grid-wrapper"
      style={
        {
          "--cols": dims.x,
          "--rows": dims.y,
        } as React.CSSProperties
      }
    >
      <div className="grid">
        {/* Grid cells */}
        {squares.map((cell, i) => (
          <div key={i} className={`cell ${cell.direction}`} />
        ))}

        {/* Path segments */}
        {pathSegments.map(([from, to], i) => (
          <div
            key={i}
            className={`path-line ${getDirection([from, to])}`}
            style={{
              left: `calc(var(--cell-width) * ${from.x})`,
              top: `calc(var(--cell-height) * ${from.y})`,
              opacity: Math.max(Math.exp((i - pathSegments.length) / 20), 0.4),
              height: `${Math.max(
                Math.exp((i - pathSegments.length) / 40) * 5,
                3
              )}px`,
            }}
          />
        ))}

        {/* Player */}
        {path.length > 1 && (
          <div
            className={`player ${direction}`}
            style={{
              left: `calc(var(--cell-width) * ${player.x})`,
              top: `calc(var(--cell-height) * ${player.y} + var(--grid-gap))`,
            }}
          />
        )}

        {/* Start marker */}
        <div
          className="start"
          style={{
            left: `calc(var(--cell-width) * ${path[0].x})`,
            top: `calc(var(--cell-height) * ${path[0].y} + var(--grid-gap))`,
          }}
        />
      </div>
    </div>
  );
};

export default Grid;
