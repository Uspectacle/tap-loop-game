export type Position = {
  x: number;
  y: number;
};

export type Direction = "top" | "bottom" | "left" | "right";

export type Square = Position & {
  tapped?: Direction | "noSquare";
};

export type Segment = [Position, Position];

export type Path = Position[];

export type Board = {
  size: Position;
  start: Position;
  noSquares?: Position[];
  obstacles?: Segment[];
};

export type Info = Board & {
  path: Path;
  squares: Square[];
  pathSegments: Segment[];
  player: Position;
  direction: Direction;
  everySquareTapped: boolean;
  finished: boolean;
};

export type Page = "edit" | "play";
