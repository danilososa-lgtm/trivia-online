// src/components/Board.jsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import BoardScene from "./BoardScene";

function Board({ players, currentRound, currentPlayerId }) {
  return (
    <div className="board-wrapper">
      <div className="board">
        <Canvas
          shadows
          camera={{ position: [0, 8, 9.5], fov: 45 }}
        >
          <BoardScene
            players={players}
            currentRound={currentRound}
            currentPlayerId={currentPlayerId}
          />
        </Canvas>
      </div>
    </div>
  );
}

export default Board;
