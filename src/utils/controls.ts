import { Position, Direction, Board } from "@/types";

export const SWIPE_THRESHOLD = 30;

export function getDirectionFromTouch(
  start: Position,
  end: Position
): Direction | null {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > SWIPE_THRESHOLD) return "right";
    if (dx < -SWIPE_THRESHOLD) return "left";
  } else {
    if (dy > SWIPE_THRESHOLD) return "bottom";
    if (dy < -SWIPE_THRESHOLD) return "top";
  }

  return null;
}

export function getClickedPosition(
  e: React.MouseEvent<HTMLDivElement>,
  board: Board
): Position {
  const rect = e.currentTarget.getBoundingClientRect();
  const cellWidth = rect.width / board.size.x;
  const cellHeight = rect.height / board.size.y;
  let x = Math.floor((e.clientX - rect.left) / cellWidth);
  let y = Math.floor((e.clientY - rect.top) / cellHeight);
  x = Math.max(0, Math.min(board.size.x - 1, x));
  y = Math.max(0, Math.min(board.size.y - 1, y));
  return { x, y };
}
