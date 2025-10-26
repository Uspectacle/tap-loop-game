"use client";

import Grid from "@/components/Grid";
import { useGame } from "@/context/GameContext";
import {
  getClickedPlayerPosition,
  getClickedSquareOrSegment,
} from "@/utils/controls";
import {
  adjustSize,
  moveStart,
  toggleSegment,
  toggleSquare,
} from "@/utils/edit";
import { copyURL } from "@/utils/url";
import { useCallback, useRef, useState } from "react";
import "./Edit.css";

const Edit: React.FC = () => {
  const { size, setBoard, navigateTo } = useGame();

  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const didDragRef = useRef(false);

  /** Start dragging the start position */
  const onStartDrag = useCallback(
    (e: React.MouseEvent) => {
      if (isDraggingStart) return;
      e.stopPropagation();

      didDragRef.current = false; // reset drag detection
      setIsDraggingStart(true);
    },
    [isDraggingStart]
  );

  /** Handle mouse movement while dragging */
  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDraggingStart) return;
      e.stopPropagation();

      didDragRef.current = true;

      const start = getClickedPlayerPosition(e, size);
      setBoard(moveStart(start));
    },
    [isDraggingStart, setBoard, size]
  );

  /** Finish dragging */
  const onMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (!isDraggingStart) return;
      e.stopPropagation();

      setIsDraggingStart(false);

      // Wait a tick to prevent click firing right after drag release
      setTimeout(() => {
        didDragRef.current = false;
      }, 50);
    },
    [isDraggingStart]
  );

  /** Handle normal clicks (toggle squares/segments) */
  const onClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();

      // Prevent accidental click after drag
      if (isDraggingStart || didDragRef.current) {
        return;
      }

      const target = getClickedSquareOrSegment(e, size);
      if (Array.isArray(target)) {
        setBoard(toggleSegment(target));
      } else if (target) {
        setBoard(toggleSquare(target));
      }
    },
    [setBoard, size, isDraggingStart]
  );

  return (
    <>
      <div className="controls">
        <button onClick={() => navigateTo("play")}>Play Board</button>
        <button onClick={copyURL}>Copy URL</button>
      </div>

      {/* Top row controls */}
      <div className="edit-wrapper">
        <div className="edit-buttons row">
          <button
            onClick={() => setBoard(adjustSize("top", 1))}
            disabled={size.y >= 30}
          >
            + Row
          </button>
          <button
            onClick={() => setBoard(adjustSize("top", -1))}
            disabled={size.y <= 1}
          >
            - Row
          </button>
        </div>

        <div className="edit-sub-wrapper">
          {/* Left column controls */}
          <div className="edit-buttons column">
            <button
              onClick={() => setBoard(adjustSize("left", 1))}
              disabled={size.x >= 30}
            >
              + Col
            </button>
            <button
              onClick={() => setBoard(adjustSize("left", -1))}
              disabled={size.x <= 1}
            >
              - Col
            </button>
          </div>

          {/* Main grid */}
          <Grid
            onClick={onClick}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onStartDrag={onStartDrag}
            noPath
          />

          {/* Right column controls */}
          <div className="edit-buttons column">
            <button
              onClick={() => setBoard(adjustSize("right", 1))}
              disabled={size.x >= 30}
            >
              + Col
            </button>
            <button
              onClick={() => setBoard(adjustSize("right", -1))}
              disabled={size.x <= 1}
            >
              - Col
            </button>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="edit-buttons row">
          <button
            onClick={() => setBoard(adjustSize("bottom", 1))}
            disabled={size.y >= 30}
          >
            + Row
          </button>
          <button
            onClick={() => setBoard(adjustSize("bottom", -1))}
            disabled={size.y <= 1}
          >
            - Row
          </button>
        </div>
      </div>
    </>
  );
};

export default Edit;
