import { Dimensions, Direction, Pos, TouchedSquare } from "../types";

const DIRECTION_MAP = new Map<Direction, Pos>([
  ["up", { x: 0, y: -1 }],
  ["down", { x: 0, y: 1 }],
  ["left", { x: -1, y: 0 }],
  ["right", { x: 1, y: 0 }],
]);

const nextPosition = (
  position: Pos,
  direction: Direction,
  dims: Dimensions
) => {
  const { x, y } = DIRECTION_MAP.get(direction)!;

  return {
    x: clamp(position.x + x, 0, dims.x),
    y: clamp(position.y + y, 0, dims.y),
  };
};

export const getDirection = (path: Pos[]) => {
  if (path.length < 2) {
    return "right";
  }

  const prevPos = path[path.length - 2];
  const lastPos = path[path.length - 1];

  if (lastPos.x > prevPos.x) return "right";
  if (lastPos.x < prevPos.x) return "left";
  if (lastPos.y > prevPos.y) return "down";
  return "up";
};

const isSamePosition = (positionA: Pos, positionB: Pos) => {
  return positionA.x === positionB.x && positionA.y === positionB.y;
};

const clamp = (val: number, min: number, max: number) =>
  Math.max(min, Math.min(max, val));

export const addToPath = (
  path: Pos[],
  direction: Direction,
  dims: Dimensions
) => {
  const prevPos = path[path.length - 1];
  const newPos = nextPosition(prevPos, direction, dims);
  if (!isSamePosition(prevPos, newPos)) {
    return [...path, newPos];
  }

  return path;
};

const getTouchableSquares = (
  from: Pos,
  to: Pos,
  dims: Dimensions
): TouchedSquare[] => {
  const touchableSquares: TouchedSquare[] = [];

  const dx = to.x - from.x;
  const dy = to.y - from.y;

  // Left Right move
  if (dx) {
    const y = to.y;
    const x = dx > 0 ? from.x : to.x;

    if (y > 0) {
      touchableSquares.push({ y: y - 1, x, direction: "top" });
    }

    if (y < dims.y) {
      touchableSquares.push({ y, x, direction: "bottom" });
    }
  }

  // Up or Down move
  if (dy) {
    const x = to.x;
    const y = dy > 0 ? from.y : to.y;

    if (x > 0) {
      touchableSquares.push({ x: x - 1, y, direction: "left" });
    }

    if (x < dims.x) {
      touchableSquares.push({ x, y, direction: "right" });
    }
  }

  return touchableSquares;
};

const deduplicate = (touchedSquares: TouchedSquare[]): TouchedSquare[] => {
  const seen = new Set<string>();

  return touchedSquares.filter(({ x, y }) => {
    const key = `${x}, ${y}`;

    if (seen.has(key)) return false;

    seen.add(key);

    return true;
  });
};

export const getTouchedSquares = (
  path: Pos[],
  dims: Dimensions
): TouchedSquare[] =>
  deduplicate(
    getPathSegments(path).flatMap(([from, to]) =>
      getTouchableSquares(from, to, dims)
    )
  );

export const getPathSegments = (path: Pos[]): [Pos, Pos][] =>
  path.slice(1).map((to, i) => [path[i], to]);
