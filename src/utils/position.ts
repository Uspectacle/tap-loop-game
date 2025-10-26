import { Board, Position, Square } from "@/types";

export const isSamePosition = (positionA: Position, positionB: Position) => {
  return positionA.x === positionB.x && positionA.y === positionB.y;
};

export const isPosition = (positionA: Position) => (positionB: Position) =>
  isSamePosition(positionA, positionB);

export const isValidPlayerPosition = (
  position: Position,
  size: Position
): boolean => {
  if (position.x < 0) {
    return false;
  }

  if (position.y < 0) {
    return false;
  }

  if (position.x > size.x) {
    return false;
  }

  if (position.y > size.y) {
    return false;
  }

  return true;
};

export const isValidSquarePosition = (
  square: Square | undefined,
  { size, noSquares }: Board
): square is Square => {
  if (!square) {
    return false;
  }

  if (square.x < 0) {
    return false;
  }

  if (square.y < 0) {
    return false;
  }

  if (square.x >= size.x) {
    return false;
  }

  if (square.y >= size.y) {
    return false;
  }

  return !noSquares?.some(isPosition(square));
};

export const clampPlayerPosition = (
  position: Position,
  size: Position
): Position => {
  const x = Math.max(0, Math.min(size.x, position.x));
  const y = Math.max(0, Math.min(size.y, position.y));

  return { x, y };
};
