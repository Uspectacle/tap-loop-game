"use client";

import { useState } from "react";
import Game from "@/components/Game";
import "@/styles/App.css";

const App: React.FC = () => {
  const [rows, setRows] = useState(6);
  const [cols, setCols] = useState(7);

  return (
    <div className="layout">
      <h1>Tap Loop Game</h1>
      <p>Find the smallest loop taping every cells</p>
      <div className="size-options">
        <label>
          Rows:
          <input
            type="number"
            value={rows}
            onChange={(e) => setRows(parseInt(e.target.value) || 1)}
            min={2}
            max={20}
          />
        </label>
        <label>
          Columns:
          <input
            type="number"
            value={cols}
            onChange={(e) => setCols(parseInt(e.target.value) || 1)}
            min={2}
            max={20}
          />
        </label>
      </div>
      <Game dims={{ x: cols, y: rows }} />
    </div>
  );
};

export default App;
