import React, { useState, useEffect } from "react";

const FIELD_BY_ROUND = ["expectativas", "contribucion", "desafios"];
const LABEL_BY_ROUND = [
  "¿Cuáles son tus EXPECTATIVAS para este proyecto?",
  "¿Qué CONTRIBUCIONES podés aportar?",
  "¿Qué DESAFÍOS u obstáculos ves para alcanzar los objetivos?"
];

function TurnPanel({
  currentRound,
  roundLabel,
  players,
  currentPlayerIndex,
  onSaveAnswer,
  onNextTurn
}) {
  const player = players[currentPlayerIndex];
  const field = FIELD_BY_ROUND[currentRound];
  const label = LABEL_BY_ROUND[currentRound];

  const [text, setText] = useState(player[field] || "");

  useEffect(() => {
    setText(player[field] || "");
  }, [player, field]);

  const handleSave = () => {
    if (!text.trim()) return;
    onSaveAnswer(player.id, field, text.trim());
    onNextTurn();
  };

  return (
    <div className="panel turn-panel">
      <h2>Ronda: {roundLabel}</h2>
      <h3 style={{ color: player.color }}>Turno de: {player.name}</h3>

      <p className="hint">{label}</p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        placeholder="Escribí tu respuesta acá..."
      />

      <button className="primary-btn" onClick={handleSave}>
        Guardar y pasar al siguiente
      </button>
    </div>
  );
}

export default TurnPanel;
