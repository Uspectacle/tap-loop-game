"use client";

import { useGame } from "@/context/GameContext";
import "./Grid.css";
import { getDirection } from "@/utils/segment";

type Props = {
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => unknown;
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => unknown;
  onMouseUp?: (e: React.MouseEvent<HTMLDivElement>) => unknown;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => unknown;
  onStartDrag?: (e: React.MouseEvent<HTMLDivElement>) => unknown;
  startDragging?: boolean;
  noPath?: boolean;
};

const Grid: React.FC<Props> = ({
  onClick,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onStartDrag,
  startDragging,
  noPath,
}) => {
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
    start,
  } = useGame();

  return (
    <div
      className="grid-wrapper"
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      style={
        {
          "--cols": size.x,
          "--rows": size.y,
        } as React.CSSProperties
      }
    >
      <div className="grid">
        {/* Grid cells */}
        {squares.map((cell, i) => (
          <div
            key={i}
            className={`cell ${
              noPath && cell.tapped !== "noSquare" ? "noPath" : cell.tapped
            }`}
          />
        ))}

        {/* Path segments */}
        {!noPath &&
          pathSegments.map(([from, to], i) => (
            <div
              key={i}
              className={`path-line ${getDirection([from, to])}`}
              style={{
                left: `calc(var(--cell-width) * ${from.x})`,
                top: `calc(var(--cell-height) * ${from.y})`,
                opacity: Math.max(
                  Math.exp((i - pathSegments.length) / 20),
                  0.4
                ),
                height: `${Math.max(
                  Math.exp((i - pathSegments.length) / 40) * 5,
                  3
                )}px`,
              }}
            />
          ))}

        {/* Obstacles */}
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

        {/* Player  */}
        {!noPath && path.length > 1 && !finished && (
          <div
            className={`player ${direction}`}
            style={{
              left: `calc(var(--cell-width) * ${player.x})`,
              top: `calc(var(--cell-height) * ${player.y})`,
            }}
          />
        )}

        {/* Start marker */}
        {(noPath || !finished) && (
          <div
            className={`start ${!noPath && everySquareTapped ? "pulse" : ""}`}
            style={{
              left: `calc(var(--cell-width) * ${start.x})`,
              top: `calc(var(--cell-height) * ${start.y})`,
              cursor: noPath
                ? startDragging
                  ? "grabbing"
                  : "grab"
                : undefined,
              zIndex: noPath ? 20 : undefined,
            }}
            onMouseDown={onStartDrag}
          />
        )}
      </div>
    </div>
  );
};

export default Grid;
