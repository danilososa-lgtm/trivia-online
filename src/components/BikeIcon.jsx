// src/components/BikeIcon.jsx
import React from "react";

function BikeIcon({ color, active }) {
  return (
    <svg
      viewBox="0 0 80 50"
      className={`bike-icon ${active ? "bike-icon--active" : ""}`}
    >
      {/* Sombra debajo */}
      <ellipse
        cx="40"
        cy="42"
        rx="18"
        ry="5"
        fill="rgba(0,0,0,0.45)"
      />

      {/* Ruedas (caricaturescas, grandes) */}
      <circle className="bike-wheel" cx="20" cy="32" r="9" />
      <circle className="bike-wheel" cx="60" cy="32" r="9" />

      {/* Llantas internas */}
      <circle cx="20" cy="32" r="4" fill="#111" />
      <circle cx="60" cy="32" r="4" fill="#111" />

      {/* Cuadro curvo (caricaturesco) */}
      <path
        d="M20 32 C 26 22, 30 18, 38 18
           C 46 18, 50 24, 54 30
           L 60 32"
        fill="none"
        stroke={color}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Tubo del asiento */}
      <path
        d="M34 18 L30 10"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
      />

      {/* Asiento */}
      <path
        d="M24 10 L34 10"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Manubrio */}
      <path
        d="M42 18 L50 10"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M48 8 L54 8"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Pedal y biela */}
      <circle cx="38" cy="24" r="3.2" fill="#111" />
      <path
        d="M38 24 L42 28"
        stroke="#ddd"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="44" cy="30" r="2.1" fill="#ddd" />
    </svg>
  );
}

export default BikeIcon;
