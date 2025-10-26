import { Board, Path } from "@/types";
import { encodeBoard, encodePath, decodePath } from "./encoder";

export interface HighscoreEntry {
  boardKey: string;
  pathKey: string;
  pathLength: number;
}

// Abstraction layer - swap implementation here later for shared DB
class HighscoreService {
  private storageKey = "tap_loop_highscore";

  private getAllScores(): Record<string, string> {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  private saveAllScores(scores: Record<string, string>): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(scores));
    } catch (error) {
      console.error("Failed to save highscore:", error);
    }
  }

  getBestPath(board: Board): Path | null {
    const boardKey = encodeBoard(board);
    const scores = this.getAllScores();
    const pathKey = scores[boardKey];

    if (!pathKey) return null;

    try {
      return decodePath(pathKey, board);
    } catch {
      return null;
    }
  }

  saveBestPath(board: Board, path: Path): boolean {
    const boardKey = encodeBoard(board);
    const pathKey = encodePath(path);
    const scores = this.getAllScores();

    scores[boardKey] = pathKey;
    this.saveAllScores(scores);
    return true;
  }

  getBestPathLength(board: Board): number | null {
    const bestPath = this.getBestPath(board);
    return bestPath ? bestPath.length - 1 : null;
  }
}

// Export singleton instance
export const highscoreService = new HighscoreService();

// Utility functions for components
export const getBestScore = (board: Board): number | null => {
  return highscoreService.getBestPathLength(board);
};

export const saveBestScore = (board: Board, path: Path): void => {
  highscoreService.saveBestPath(board, path);
};

export const getBestScorePath = (board: Board): Path | null => {
  return highscoreService.getBestPath(board);
};

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
