import { Position, Direction, Segment, Square } from "@/types";
import { isValidSegment } from "./segment";
import { clampPlayerPosition } from "./position";

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

const getClickedPosition = (
  e: React.MouseEvent<HTMLDivElement>,
  size: Position
): Position => {
  const rect = e.currentTarget.children.item(0)!.getBoundingClientRect();
  const cellWidth = rect.width / size.x;
  const cellHeight = rect.height / size.y;
  const x = (e.clientX - rect.left) / cellWidth;
  const y = (e.clientY - rect.top) / cellHeight;

  return { x, y };
};

const getPlayerPosition = (click: Position, size: Position): Position => {
  return clampPlayerPosition(
    { x: Math.round(click.x), y: Math.round(click.y) },
    size
  );
};

export const getClickedPlayerPosition = (
  e: React.MouseEvent<HTMLDivElement>,
  size: Position
): Position => {
  return getPlayerPosition(getClickedPosition(e, size), size);
};

const getSegmentPosition = (click: Position, size: Position): Segment => {
  const x = Math.floor(Math.max(0, Math.min(size.x, click.x)));
  const y = Math.floor(Math.max(0, Math.min(size.y, click.y)));

  const dx = click.x % 1;
  const dy = click.y % 1;

  if (dx + dy > 1) {
    if (dx > dy) {
      return [
        { x: x + 1, y },
        { x: x + 1, y: y + 1 },
      ];
    }
    return [
      { x, y: y + 1 },
      { x: x + 1, y: y + 1 },
    ];
  }

  if (dx > dy) {
    return [
      { x, y },
      { x: x + 1, y },
    ];
  }

  return [
    { x, y },
    { x, y: y + 1 },
  ];
};

const getSquarePosition = (click: Position, size: Position): Square => {
  const x = Math.max(0, Math.min(size.x - 1, click.x));
  const y = Math.max(0, Math.min(size.y - 1, click.y));

  return { x: Math.floor(x), y: Math.floor(y) };
};

const isCenteredOnSquare = (
  click: Position,
  size: Position,
  margin: number = 0.2
): boolean => {
  if (click.x < 0 || click.x > size.x) {
    return false;
  }
  if (click.y < 0 || click.y > size.y) {
    return false;
  }

  const dx = click.x % 1;
  const dy = click.y % 1;

  if (dx > 1 - margin || dx < margin) {
    return false;
  }

  if (dy > 1 - margin || dy < margin) {
    return false;
  }

  return true;
};

export const getClickedSquareOrSegment = (
  e: React.MouseEvent<HTMLDivElement>,
  size: Position
): Square | Segment | undefined => {
  const click = getClickedPosition(e, size);

  if (isCenteredOnSquare(click, size)) {
    return getSquarePosition(click, size);
  }

  const segment = getSegmentPosition(click, size);

  return isValidSegment(segment, { size, start: { x: 0, y: 0 } })
    ? segment
    : undefined;
};
