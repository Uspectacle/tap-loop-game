"use client";

import Game from "@/components/Game";
import "@/styles/App.css";
import { useState } from "react";

const App: React.FC = () => {
  const [sizeX, setSizeX] = useState(6);
  const [sizeY, setSizeY] = useState(7);

  return (
    <div className="layout">
      <main className="main">
        <h1>Tap Loop Game</h1>
        <p>Find the smallest loop taping every cells</p>
        <div className="size-options">
          <label>
            Rows:
            <input
              type="number"
              value={sizeY}
              onChange={(e) => setSizeY(parseInt(e.target.value) || 1)}
              min={2}
              max={20}
            />
          </label>
          <label>
            Columns:
            <input
              type="number"
              value={sizeX}
              onChange={(e) => setSizeX(parseInt(e.target.value) || 1)}
              min={2}
              max={20}
            />
          </label>
        </div>
        <Game
          board={{
            size: { x: sizeX, y: sizeY },
            start: { x: 1, y: 1 },
            noSquares: [
              { x: 0, y: 0 },
              { x: 0, y: sizeY - 1 },
              { x: sizeX - 1, y: 0 },
              { x: sizeX - 1, y: sizeY - 1 },
            ],
            obstacles: [
              [
                { x: 0, y: 0 },
                { x: 0, y: 1 },
              ],
              [
                { x: 5, y: 4 },
                { x: 4, y: 4 },
              ],
            ],
          }}
        />
      </main>
    </div>
  );
};

export default App;
