import { Board, Position } from "@/types";

export const isSamePosition = (positionA: Position, positionB: Position) => {
  return positionA.x === positionB.x && positionA.y === positionB.y;
};

export const isPosition = (positionA: Position) => (positionB: Position) =>
  isSamePosition(positionA, positionB);

export const isValidPlayerPosition = (
  position: Position,
  board: Board
): boolean => {
  if (position.x < 0) {
    return false;
  }

  if (position.y < 0) {
    return false;
  }

  if (position.x > board.size.x) {
    return false;
  }

  if (position.y > board.size.y) {
    return false;
  }

  return true;
};
