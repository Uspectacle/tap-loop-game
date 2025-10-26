import { Board, Direction, Position, Segment, Square } from "@/types";
import {
  clampPlayerPosition,
  isPosition,
  isValidPlayerPosition,
  isValidSquarePosition,
} from "./position";
import { isSegment, isValidSegment } from "./segment";

export const adjustSize = (direction: Direction, delta: number) => {
  return (board: Board) => {
    const newSize = { ...board.size };
    const newStart = { ...board.start };
    let newNoSquares = [...(board.noSquares || [])];
    let newObstacles = [...(board.obstacles || [])];

    if (direction === "right") {
      newSize.x += delta;
    } else if (direction === "left") {
      newSize.x += delta;
      newStart.x += delta;
      newNoSquares = newNoSquares.map((s) => ({ ...s, x: s.x + delta }));
      newObstacles = newObstacles.map(([from, to]) => [
        { x: from.x + delta, y: from.y },
        { x: to.x + delta, y: to.y },
      ]);
    } else if (direction === "bottom") {
      newSize.y += delta;
    } else if (direction === "top") {
      newSize.y += delta;
      newStart.y += delta;
      newNoSquares = newNoSquares.map((s) => ({ ...s, y: s.y + delta }));
      newObstacles = newObstacles.map(([from, to]) => [
        { x: from.x, y: from.y + delta },
        { x: to.x, y: to.y + delta },
      ]);
    }

    // Ensure minimum size
    if (newSize.x < 1 || newSize.y < 1) return board;

    // Filter out invalid squares and obstacles
    const tempBoard = {
      size: newSize,
      start: clampPlayerPosition(newStart, newSize),
    };

    newNoSquares = newNoSquares.filter((square) =>
      isValidSquarePosition(square, tempBoard)
    );
    newObstacles = newObstacles.filter((segment) =>
      isValidSegment(segment, tempBoard)
    );

    return {
      ...tempBoard,
      noSquares: newNoSquares,
      obstacles: newObstacles,
    };
  };
};

export const toggleSquare = (square: Square) => {
  return (board: Board) => {
    const noSquares = board.noSquares || [];
    const index = noSquares.findIndex(isPosition(square));

    if (index >= 0) {
      return {
        ...board,
        noSquares: noSquares.filter((_, i) => i !== index),
      };
    }
    return { ...board, noSquares: [...noSquares, square] };
  };
};

export const toggleSegment = (segment: Segment) => {
  return (board: Board) => {
    const obstacles = board.obstacles || [];
    const index = obstacles.findIndex(isSegment(segment));

    if (index >= 0) {
      return {
        ...board,
        obstacles: obstacles.filter((_, i) => i !== index),
      };
    } else {
      return { ...board, obstacles: [...obstacles, segment] };
    }
  };
};

export const moveStart = (start: Position) => {
  return (board: Board) => {
    if (isValidPlayerPosition(start, board.size)) {
      return { ...board, start };
    }

    return board;
  };
};
