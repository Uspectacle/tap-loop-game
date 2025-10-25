import { Board, Path, Position, Segment } from "@/types";
import { isValidPlayerPosition } from "./position";
import { isValidPath } from "./segment";

// Assumes all numbers < 36 for an equal-length digits

const toB36 = (n: number) => n.toString(36);
const fromB36 = (s: string) => parseInt(s, 36);

export const encodePosition = ({ x, y }: Position) => `${toB36(x)}${toB36(y)}`;

const decodePosition = (s: string): Position => {
  if (s.length < 2) throw new Error("Invalid position encoding");

  return { x: fromB36(s[0]), y: fromB36(s[1]) };
};

export const encodePath = (path: Path): string =>
  path.map(encodePosition).join(".");

export const decodePath = (str: string | null, board: Board): Path => {
  try {
    const path = str!.split(".").map(decodePosition);

    if (!isValidPath(path, board)) {
      throw new Error("Invalid path");
    }

    return path;
  } catch {
    return [board.start];
  }
};

const encodeSegment = ([a, b]: Segment) =>
  `${encodePosition(a)}_${encodePosition(b)}`;

const decodeSegment = (s: string): Segment => {
  const [a, b] = s.split("_");
  return [decodePosition(a), decodePosition(b)];
};

const DEFAULT_BOARD: Board = {
  size: { x: 6, y: 7 },
  start: { x: 1, y: 1 },
  noSquares: [
    { x: 0, y: 0 },
    { x: 0, y: 7 - 1 },
    { x: 6 - 1, y: 0 },
    { x: 6 - 1, y: 7 - 1 },
  ],
  obstacles: [
    [
      { x: 5, y: 4 },
      { x: 4, y: 4 },
    ],
  ],
};

export const encodeBoard = (b: Board): string => {
  const parts = [
    encodePosition(b.size),
    encodePosition(b.start),
    b.noSquares?.map(encodePosition).join("-") ?? "",
    b.obstacles?.map(encodeSegment).join("-") ?? "",
  ];
  return parts.join("~");
};

export const decodeBoard = (s: string | null): Board => {
  try {
    const [sizeStr, startStr, noSqStr, obsStr] = s!.split("~");
    const size = decodePosition(sizeStr);
    const start = decodePosition(startStr);

    if (!isValidPlayerPosition(start, size)) {
      throw new Error("Invalid start position");
    }

    return {
      size,
      start,
      noSquares: noSqStr
        ? noSqStr.split("-").filter(Boolean).map(decodePosition)
        : undefined,
      obstacles: obsStr
        ? obsStr.split("-").filter(Boolean).map(decodeSegment)
        : undefined,
    };
  } catch {
    return DEFAULT_BOARD;
  }
};
