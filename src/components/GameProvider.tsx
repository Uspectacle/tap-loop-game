"use client";

import { GameContext } from "@/context/GameContext";
import type { Board, Page, Path } from "@/types";
import {
  decodeBoard,
  decodePath,
  encodeBoard,
  encodePath,
} from "@/utils/encoder";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function GameProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialBoard = decodeBoard(searchParams.get("b"));
  const initialPathParam = searchParams.get("p");

  const [board, setBoard] = useState<Board>(() => initialBoard);
  const [path, setPath] = useState<Path>(() =>
    decodePath(initialPathParam, initialBoard)
  );

  const isUpdatingRef = useRef(false);

  useEffect(() => {
    if (!board || isUpdatingRef.current) return;

    const encodedPath = encodePath(path);
    const encodedBoard = encodeBoard(board);

    const params = new URLSearchParams(window.location.search);
    const currentPath = params.get("p");
    const currentBoard = params.get("b");

    if (currentPath === encodedPath && currentBoard === encodedBoard) return;

    isUpdatingRef.current = true;

    params.set("p", encodedPath);
    params.set("b", encodedBoard);

    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params.toString()}`
    );

    isUpdatingRef.current = false;
  }, [path, board]);

  const navigateTo = (page: Page) => {
    const params = new URLSearchParams();
    params.set("p", encodePath(path));
    params.set("b", encodeBoard(board));

    router.push(`/${page}?${params.toString()}`, { scroll: false });
  };

  return (
    <GameContext.Provider
      value={{ board, setBoard, path, setPath, navigateTo }}
    >
      {children}
    </GameContext.Provider>
  );
}
