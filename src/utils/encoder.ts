import { Board, Path, Position, Segment } from "@/types";

// Assumes all numbers < 36 for an equal-length digits

const toB36 = (n: number) => n.toString(36);
const fromB36 = (s: string) => parseInt(s, 36);

export const encodePosition = ({ x, y }: Position) => `${toB36(x)}${toB36(y)}`;

const decodePosition = (s: string): Position => {
  if (s.length < 2) throw new Error("Invalid position encoding");

  return { x: fromB36(s[0]), y: fromB36(s[1]) };
};

export const encodePath = (path: Path): string =>
  path.map(encodePosition).join("-");

export const decodePath = (str: string): Path =>
  str.split("-").map(decodePosition);

const encodeSegment = ([a, b]: Segment) =>
  `${encodePosition(a)}_${encodePosition(b)}`;

const decodeSegment = (s: string): Segment => {
  const [a, b] = s.split("_");
  return [decodePosition(a), decodePosition(b)];
};

export const encodeBoard = (b: Board): string => {
  const parts = [
    encodePosition(b.size),
    encodePosition(b.start),
    b.noSquares?.map(encodePosition).join(",") ?? "",
    b.obstacles?.map(encodeSegment).join(",") ?? "",
  ];
  return parts.join(":");
};

export const decodeBoard = (s: string): Board => {
  const [sizeStr, startStr, noSqStr, obsStr] = s.split(":");

  return {
    size: decodePosition(sizeStr),
    start: decodePosition(startStr),
    noSquares: noSqStr
      ? noSqStr.split(",").filter(Boolean).map(decodePosition)
      : undefined,
    obstacles: obsStr
      ? obsStr.split(",").filter(Boolean).map(decodeSegment)
      : undefined,
  };
};
