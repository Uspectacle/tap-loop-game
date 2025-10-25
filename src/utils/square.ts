import { Board, Direction, Path, Square } from "@/types";
import { encodePosition } from "./encoder";
import { getPathSegments, isAlongX } from "./segment";
import { isPosition } from "./position";

const getBoardSquares = (board: Board): Square[] => {
  return Array.from({ length: board.size.y }).flatMap((_, y) =>
    Array.from({ length: board.size.x }).map((_, x) => ({ x, y }))
  );
};

const getTapMap = (path: Path) => {
  const segments = getPathSegments(path);
  const tapMap = new Map<string, Direction>();

  segments.forEach((segment) => {
    if (isAlongX(segment)) {
      const x = segment[0].x;
      const y = Math.min(segment[0].y, segment[1].y);

      tapMap.set(encodePosition({ x: x - 1, y }), "left");
      tapMap.set(encodePosition({ x, y }), "right");
    } else {
      const x = Math.min(segment[0].x, segment[1].x);
      const y = segment[0].y;

      tapMap.set(encodePosition({ x, y: y - 1 }), "top");
      tapMap.set(encodePosition({ x, y }), "bottom");
    }
  });

  return tapMap;
};

export const getSquares = (path: Path, board: Board): Square[] => {
  const squares = getBoardSquares(board);
  const tapMap = getTapMap(path);

  return squares.map((square) => ({
    ...square,
    tapped: board.noSquares?.some(isPosition(square))
      ? "noSquare"
      : tapMap.get(encodePosition(square)),
  }));
};
