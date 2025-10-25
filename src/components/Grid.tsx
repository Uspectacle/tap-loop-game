"use client";

import { useGame } from "@/context/GameContext";
import "./Grid.css";
import { getDirection } from "@/utils/segment";

type Props = {
  handleClick: (e: React.MouseEvent<HTMLDivElement>) => unknown;
};

const Grid: React.FC<Props> = ({ handleClick }) => {
  const {
    path,
    size,
    squares,
    pathSegments,
    finished,
    direction,
    player,
    everySquareTapped,
    obstacles,
  } = useGame();

  return (
    <div
      className="grid-wrapper"
      style={
        {
          "--cols": size.x,
          "--rows": size.y,
        } as React.CSSProperties
      }
    >
      <div className="grid" onClick={handleClick}>
        {/* Grid cells */}
        {squares.map((cell, i) => (
          <div key={i} className={`cell ${cell.tapped}`} />
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

        {/* Path segments */}
        {obstacles?.map(([from, to], i) => (
          <div
            key={i}
            className="obstacle"
            style={{
              left: `calc(var(--cell-width) * ${(from.x + to.x) / 2})`,
              top: `calc(var(--cell-height) * ${(from.y + to.y) / 2})`,
            }}
          />
        ))}

        {/* Player */}
        {path.length > 1 && !finished && (
          <div
            className={`player ${direction}`}
            style={{
              left: `calc(var(--cell-width) * ${player.x})`,
              top: `calc(var(--cell-height) * ${player.y})`,
            }}
          />
        )}

        {/* Start marker */}
        {finished || (
          <div
            className={`start ${everySquareTapped ? "pulse" : ""}`}
            style={{
              left: `calc(var(--cell-width) * ${path[0].x})`,
              top: `calc(var(--cell-height) * ${path[0].y})`,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Grid;
