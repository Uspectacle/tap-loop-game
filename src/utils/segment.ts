import { Board, Direction, Path, Position, Segment } from "@/types";
import { isSamePosition, isValidPlayerPosition } from "./position";

const DIRECTION_MAP = new Map<Direction, Position>([
  ["top", { x: 0, y: -1 }],
  ["bottom", { x: 0, y: 1 }],
  ["left", { x: -1, y: 0 }],
  ["right", { x: 1, y: 0 }],
]);

const followDirection = (
  position: Position,
  direction: Direction
): Position => {
  const { x, y } = DIRECTION_MAP.get(direction)!;

  return {
    x: position.x + x,
    y: position.y + y,
  };
};

export const isAlongX = (segment: Segment) => segment[0].x === segment[1].x;

export const getPathSegments = (path: Path): Segment[] =>
  path.slice(1).map((to, i) => [path[i], to]);

const isSameSegment = (segmentA: Segment, segmentB: Segment): boolean => {
  return (
    (isSamePosition(segmentA[0], segmentB[0]) &&
      isSamePosition(segmentA[1], segmentB[1])) ||
    (isSamePosition(segmentA[0], segmentB[1]) &&
      isSamePosition(segmentA[1], segmentB[0]))
  );
};

export const isSegment = (segmentA: Segment) => (segmentB: Segment) =>
  isSameSegment(segmentA, segmentB);

export const isValidSegment = (
  segment: Segment | undefined,
  board: Board
): segment is Segment => {
  if (!segment) {
    return false;
  }

  if (board.obstacles?.some(isSegment(segment))) {
    return false;
  }

  return segment.every((position) =>
    isValidPlayerPosition(position, board.size)
  );
};

export const isValidPath = (path: Path, board: Board): boolean => {
  if (!isSamePosition(path[0], board.start)) {
    return false;
  }

  return getPathSegments(path).every((segment) =>
    isValidSegment(segment, board)
  );
};

export const getDirection = (path: Path): Direction => {
  if (path.length < 2) {
    return "right";
  }

  const prevPos = path[path.length - 2];
  const lastPos = path[path.length - 1];

  if (lastPos.x > prevPos.x) return "right";
  if (lastPos.x < prevPos.x) return "left";
  if (lastPos.y > prevPos.y) return "bottom";
  return "top";
};

export const moveInDirection = (
  direction: Direction,
  path: Path,
  board: Board
) => {
  const position = path[path.length - 1];
  const nextPosition = followDirection(position, direction);

  if (!isValidSegment([position, nextPosition], board)) {
    return undefined;
  }

  return nextPosition;
};
