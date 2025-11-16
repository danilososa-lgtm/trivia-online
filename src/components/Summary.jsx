import React from "react";

function Summary({ players, rounds, onRestart }) {
  return (
    <div className="panel">
      <h2>Resumen del Tándem</h2>
      <p>
        Acá pueden revisar en conjunto las expectativas, contribuciones y desafíos
        que surgieron durante el juego.
      </p>

      <div className="summary-grid">
        {players.map((p) => (
          <div key={p.id} className="summary-card">
            <div className="summary-header" style={{ borderColor: p.color }}>
              <span className="color-dot" style={{ backgroundColor: p.color }} />
              <h3>{p.name}</h3>
            </div>
            <div className="summary-body">
              <p><strong>Expectativas:</strong><br />{p.expectativas || "—"}</p>
              <p><strong>Contribuciones:</strong><br />{p.contribucion || "—"}</p>
              <p><strong>Desafíos:</strong><br />{p.desafios || "—"}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="primary-btn" onClick={onRestart}>
        Jugar de nuevo
      </button>
    </div>
  );
}

export default Summary;
