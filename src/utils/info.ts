import { Board, Info, Path } from "@/types";
import { isSamePosition } from "./position";
import { getSquares } from "./square";
import { getDirection, getPathSegments } from "./segment";

export const getInfo = (path: Path, board: Board): Info => {
  const squares = getSquares(path, board);
  const player = path[path.length - 1];
  const everySquareTapped = squares.every(({ tapped }) => tapped);

  return {
    ...board,
    path,
    squares,
    pathSegments: getPathSegments(path),
    player: path[path.length - 1],
    direction: getDirection(path),
    everySquareTapped,
    finished: everySquareTapped && isSamePosition(player, path[0]),
  };
};
