import { Board, Path } from "@/types";
import { encodeBoard, encodePath, decodePath } from "./encoder";
import { ref, get, set } from "firebase/database";
import { db } from "@/lib/firebase";

export interface HighscoreEntry {
  boardKey: string;
  pathKey: string;
  pathLength: number;
}

class HighscoreService {
  private basePath = "highscore";

  async getBestPath(board: Board): Promise<Path | null> {
    const boardKey = encodeBoard(board);
    const pathRef = ref(db, `${this.basePath}/${boardKey}`);

    try {
      const snapshot = await get(pathRef);
      if (!snapshot.exists()) return null;
      const pathKey = snapshot.val();
      return decodePath(pathKey, board);
    } catch (error) {
      console.error("Failed to load highscore:", error);
      return null;
    }
  }

  async saveBestPath(board: Board, path: Path): Promise<boolean> {
    const boardKey = encodeBoard(board);
    const pathKey = encodePath(path);
    const pathRef = ref(db, `${this.basePath}/${boardKey}`);

    try {
      await set(pathRef, pathKey);
      return true;
    } catch (error) {
      console.error("Failed to save highscore:", error);
      return false;
    }
  }

  async getBestPathLength(board: Board): Promise<number | null> {
    const bestPath = await this.getBestPath(board);
    return bestPath ? bestPath.length - 1 : null;
  }
}

export const highscoreService = new HighscoreService();

// Utility wrappers
export const getBestScore = async (board: Board): Promise<number | null> =>
  highscoreService.getBestPathLength(board);

export const saveBestScore = async (
  board: Board,
  path: Path
): Promise<boolean> => highscoreService.saveBestPath(board, path);

export const getBestScorePath = async (board: Board): Promise<Path | null> =>
  highscoreService.getBestPath(board);

export const shouldSaveScore = (
  currentPathLength: number,
  bestScore: number | null
): boolean => {
  if (bestScore === null) return true;
  return currentPathLength < bestScore;
};

export const isNewHighscore = (
  currentPathLength: number,
  bestScore: number | null
): boolean => {
  if (bestScore === null) return true;
  return currentPathLength < bestScore;
};

export const isTiedScore = (
  currentPathLength: number,
  bestScore: number | null
): boolean => {
  if (bestScore === null) return false;
  return currentPathLength === bestScore;
};
