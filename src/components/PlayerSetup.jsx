import React from "react";

function PlayerSetup({ players, setPlayers }) {
  const toggleActive = (id) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, active: !p.active } : p
      )
    );
  };

  const changeName = (id, newName) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, name: newName } : p
      )
    );
  };

  return (
    <div className="panel">
      <h2>Configurar jugadores (máx. 6)</h2>
      <p>Activá los colores que van a jugar y poneles un nombre.</p>

      <div className="players-grid">
        {players.map((p) => (
          <div
            key={p.id}
            className={`player-card ${p.active ? "active" : ""}`}
          >
            <div
              className="color-dot"
              style={{ backgroundColor: p.color }}
            />
            <input
              type="text"
              value={p.name}
              onChange={(e) => changeName(p.id, e.target.value)}
            />
            <button onClick={() => toggleActive(p.id)}>
              {p.active ? "Quitar" : "Usar este color"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlayerSetup;
