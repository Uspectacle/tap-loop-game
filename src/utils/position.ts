import { Position } from "@/types";

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
