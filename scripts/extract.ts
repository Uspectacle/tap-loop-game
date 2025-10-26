import { Board, Path, Square } from "@/types";
import { decodeBoard, decodePath } from "@/utils/encoder";
import { isPosition, isValidSquarePosition } from "@/utils/position";
import { getPathSegments, isAlongX } from "@/utils/segment";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const getOrderedSquares = (path: Path, board: Board): Square[] => {
  const segments = getPathSegments(path);
  const squares: Square[] = [];

  segments.forEach((segment) => {
    if (isAlongX(segment)) {
      const x = segment[0].x;
      const y = Math.min(segment[0].y, segment[1].y);

      squares.push({ x: x - 1, y, tapped: "left" });
      squares.push({ x, y, tapped: "right" });
    } else {
      const x = Math.min(segment[0].x, segment[1].x);
      const y = segment[0].y;

      squares.push({ x, y: y - 1, tapped: "top" });
      squares.push({ x, y, tapped: "bottom" });
    }
  });

  return squares.filter(
    (square, i) =>
      isValidSquarePosition(square, board) &&
      i === squares.findIndex(isPosition(square))
  );
};

const makePositions = (urlStr: string) => {
  const searchParams = new URL(urlStr).searchParams;
  const board = decodeBoard(searchParams.get("b"));
  const path = decodePath(searchParams.get("p"), board);
  console.log(searchParams);
  const squares = getOrderedSquares(path, board);
  console.log(squares);

  return {
    positions: squares.map(({ x, y, tapped }) => ({
      x,
      y,
      direction: tapped,
    })),
  };
};

const main = async () => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  const url = process.argv[2];

  if (!url) {
    console.error("Please provide a URL as an argument");
    process.exit(1);
  }

  const resultsDir = path.join(path.resolve(__dirname, ".."), "results");
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  let fileNumber = 1;
  while (fs.existsSync(path.join(resultsDir, `positions_${fileNumber}.json`))) {
    fileNumber++;
  }

  const result = makePositions(url);

  fs.writeFileSync(
    path.join(resultsDir, `positions_${fileNumber}.json`),
    JSON.stringify(result, null, 2)
  );

  console.log(`Created results/positions_${fileNumber}.json`);
};

main();
