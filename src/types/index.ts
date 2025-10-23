export interface Pos {
  x: number;
  y: number;
}

export interface TouchedSquare {
  x: number;
  y: number;
  direction: "top" | "bottom" | "left" | "right";
}

export type Direction = "up" | "down" | "left" | "right";

export type Dimensions = {
  y: number;
  x: number;
};
