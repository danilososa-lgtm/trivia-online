// src/components/Board.jsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import boardImg from "../assets/board-magic.png";

// Ajustá los imports a los nombres reales de tus archivos de bicis
import bikeYellow from "../assets/bikes/bike-yellow.png";
import bikeRed from "../assets/bikes/bike-red.png";
import bikeBlue from "../assets/bikes/bike-blue.png";
import bikeGreen from "../assets/bikes/bike-green.png";
import bikeOrange from "../assets/bikes/bike-orange.png";
import bikePurple from "../assets/bikes/bike-purple.png";

// Mapeo de color → sprite de bicicleta
// IMPORTANTE: cambiá los HEX para que coincidan con los colores reales de tus jugadores
const COLOR_TO_BIKE = {
  "#fbbc04": bikeYellow, // amarillo
  "#ea4335": bikeRed,    // rojo
  "#4285f4": bikeBlue,   // azul
  "#34a853": bikeGreen,  // verde
  "#ff6d00": bikeOrange, // naranja
  "#aa00ff": bikePurple  // violeta
};

// Distancia al centro por ronda (en %)
const RADII = [40, 28, 16]; // 0: expectativas, 1: contribución, 2: desafíos

function Board({ players, currentRound, currentPlayerId }) {
  const [rotation, setRotation] = useState(0);

  const totalSpinsRef = useRef(0);
  const prevRoundRef = useRef(currentRound);

  // Calcula posiciones radiales de las bicis (sin rotación de ruleta aún)
  const positions = useMemo(() => {
    const n = Math.max(players.length, 1);
    const anglePerSlot = (2 * Math.PI) / n;

    return players.map((player, index) => {
      const stage = Math.max(
        0,
        Math.min(2, player.maxRoundReached ?? 0)
      ); // clamp 0..2

      const radius = RADII[stage];

      // Distribuimos a los jugadores alrededor del círculo.
      // -Math.PI/2 = arriba (12 en punto)
      const angle = -Math.PI / 2 + anglePerSlot * index;

      const cx = 50;
      const cy = 57; // un poquito más abajo por composición del tablero

      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);

      return {
        left: `${x}%`,
        top: `${y}%`
      };
    });
  }, [players]);

  // Efecto de ruleta: gira cuando cambia el turno y más fuerte cuando cambia la ronda
  useEffect(() => {
    if (!players.length) return;

    const activeIndex = players.findIndex(
      (p) => p.id === currentPlayerId
    );

    if (activeIndex === -1) return;

    const n = players.length;
    const anglePerSlotDeg = 360 / n;

    const wasRound = prevRoundRef.current;
    const isRoundChange = currentRound !== wasRound;

    // Giros extra: 1 por turno, 3 cuando cambia de ronda
    const extraSpins = isRoundChange ? 3 : 1;
    totalSpinsRef.current += extraSpins;

    // Queremos que el jugador activo quede ARRIBA (12 en punto)
    // Con la fórmula de arriba, el slot 0 ya está en 12,
    // así que rotamos la ruleta -anglePerSlotDeg * activeIndex
    const baseAngleForActive = -anglePerSlotDeg * activeIndex;

    const newRotation =
      totalSpinsRef.current * 360 + baseAngleForActive;

    setRotation(newRotation);

    prevRoundRef.current = currentRound;
  }, [players, currentPlayerId, currentRound]);

  return (
    <div className="board-wrapper">
      <div className="board-frame">
        <div
          className="board-wheel"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Fondo del tablero */}
          <img
            src={boardImg}
            alt="Tablero Tándem"
            className="board-bg"
          />

          {/* Capa de efectos mágicos */}
          <div className="board-effects">
            <div
              className={`board-glow board-glow--round-${currentRound}`}
            />
            <div className="board-particles board-particles--a" />
            <div className="board-particles board-particles--b" />
          </div>

          {/* Bicicletas (giran junto con el tablero) */}
          {players.map((player, index) => {
            const bikeSrc =
              COLOR_TO_BIKE[player.color] || bikeYellow;
            const isActive = player.id === currentPlayerId;

            return (
              <img
                key={player.id}
                src={bikeSrc}
                alt={`Bicicleta de ${player.name || "Jugador"}`}
                className={
                  "bike-token" +
                  (isActive ? " bike-token--active" : "")
                }
                style={positions[index]}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Board;
