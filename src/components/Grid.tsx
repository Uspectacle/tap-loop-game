"use client";

import { useGame } from "@/context/GameContext";
import "./Grid.css";
import { getDirection } from "@/utils/segment";
import { useEffect, useState } from "react";

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
    size,
    squares,
    pathSegments,
    finished,
    path,
    everySquareTapped,
    obstacles,
    start,
  } = useGame();

  const [playIndex, setPlayIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (!finished) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlayIndex(path.length - 1);
      if (interval) clearInterval(interval);
    } else if (pathSegments.length) {
      // Loop through the path every 0.4s
      interval = setInterval(() => {
        setPlayIndex((prev) => (prev % pathSegments.length) + 1);
      }, 200);
    }

    // Cleanup interval when state changes
    return () => clearInterval(interval);
  }, [finished, path.length, pathSegments.length]);

  const playPath = path.slice(0, playIndex + 1);

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
          pathSegments.map(([from, to], i) => {
            const age =
              (playIndex - i + pathSegments.length - 1) % pathSegments.length;

            return (
              <div
                key={i}
                className={`path-line ${getDirection([from, to])}`}
                style={{
                  left: `calc(var(--cell-width) * ${from.x})`,
                  top: `calc(var(--cell-height) * ${from.y})`,
                  opacity: Math.max(Math.exp(-age / 20), 0.4),
                  height: `${Math.max(Math.exp(-age / 40) * 5, 3)}px`,
                }}
              />
            );
          })}

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
        {!noPath && !!pathSegments.length && (
          <div
            className={`player ${getDirection(playPath)}`}
            style={{
              left: `calc(var(--cell-width) * ${
                playPath[playPath.length - 1].x
              })`,
              top: `calc(var(--cell-height) * ${
                playPath[playPath.length - 1].y
              })`,
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
