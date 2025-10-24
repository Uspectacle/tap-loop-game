export type Position = {
  x: number;
  y: number;
};

export type Direction = "top" | "bottom" | "left" | "right";

export type Square = Position & {
  direction?: Direction;
};

export type Dimensions = Position;
