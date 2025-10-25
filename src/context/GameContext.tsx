"use client";

import type { Board, Page, Path } from "@/types";
import { isSamePosition } from "@/utils/position";
import { getDirection, getPathSegments } from "@/utils/segment";
import { getSquares } from "@/utils/square";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

type GameContextType = {
  board: Board;
  setBoard: Dispatch<SetStateAction<Board>>;
  path: Path;
  setPath: Dispatch<SetStateAction<Path>>;
  navigateTo: (page: Page) => void;
};

export const GameContext = createContext<GameContextType | undefined>(
  undefined
);
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used inside GameProvider");
  }
  const { path, board } = context;

  const squares = getSquares(path, board);
  const player = path[path.length - 1];
  const everySquareTapped = squares.every(({ tapped }) => tapped);

  return {
    ...context,
    ...board,
    squares,
    pathSegments: getPathSegments(path),
    player: path[path.length - 1],
    direction: getDirection(path),
    everySquareTapped,
    finished: everySquareTapped && isSamePosition(player, path[0]),
  };
}
