// src/components/BoardScene.jsx
import React from "react";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import Bike from "./Bike";

// Radios de los anillos del tablero
const RADII = [4.0, 2.9, 1.8]; // Expectativas, Contribución, Desafíos
const MAX_SLOTS = 6;

const RING_COLORS = {
  expectativas: "#ffd84d",   // amarillo
  contribucion: "#3e80ff",   // azul
  desafios: "#ff4d4d"        // rojo
};

const ROUND_KEY = ["expectativas", "contribucion", "desafios"];

// Calcula posición objetivo local (X, Y, Z) en el plano del tablero
function getTargetPosition(ringIndex, slotIndex) {
  const radius = RADII[ringIndex] ?? RADII[0];
  const step = (Math.PI * 2) / MAX_SLOTS;
  const angle = slotIndex * step + Math.PI / 2; // arranca arriba

  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const y = 0.4; // altura sobre el tablero

  return new THREE.Vector3(x, y, z);
}

export default function BoardScene({
  players,
  currentRound,
  currentPlayerId
}) {
  const roundKey = ROUND_KEY[currentRound] ?? "expectativas";

  return (
    <>
      {/* Color de fondo del canvas */}
      <color attach="background" args={["#2f2f36"]} />

      {/* LUCES */}
      <ambientLight intensity={0.7} />
      <directionalLight
        castShadow
        intensity={1.1}
        position={[6, 10, 5]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <spotLight
        position={[-6, 10, -4]}
        angle={0.6}
        intensity={0.6}
        penumbra={0.4}
      />

      {/* GRUPO DEL TABLERO + BICIS (se rota todo para vista isométrica) */}
      <group rotation={[-Math.PI / 3.2, Math.PI / 4, 0]} position={[0, 0, 0]}>
        {/* BASE REDONDA */}
        <mesh receiveShadow>
          <cylinderGeometry args={[5, 5, 0.4, 64]} />
          <meshStandardMaterial color="#2c2c33" />
        </mesh>

        {/* “Diamante” central translúcido */}
        <mesh position={[0, 0.21, 0]} rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[4.2, 4.2, 0.05]} />
          <meshStandardMaterial
            color="#000000"
            transparent
            opacity={0.16}
          />
        </mesh>

        {/* ANILLO EXTERIOR – EXPECTATIVAS */}
        <mesh position={[0, 0.22, 0]}>
          <ringGeometry args={[3.5, 4.7, 72]} />
          <meshStandardMaterial
            color={RING_COLORS.expectativas}
            emissive={
              roundKey === "expectativas"
                ? RING_COLORS.expectativas
                : "#000000"
            }
            emissiveIntensity={roundKey === "expectativas" ? 0.5 : 0}
          />
        </mesh>

        {/* ANILLO MEDIO – CONTRIBUCIÓN */}
        <mesh position={[0, 0.23, 0]}>
          <ringGeometry args={[2.4, 3.4, 72]} />
          <meshStandardMaterial
            color={RING_COLORS.contribucion}
            emissive={
              roundKey === "contribucion"
                ? RING_COLORS.contribucion
                : "#000000"
            }
            emissiveIntensity={roundKey === "contribucion" ? 0.5 : 0}
          />
        </mesh>

        {/* ANILLO INTERIOR – DESAFÍOS */}
        <mesh position={[0, 0.24, 0]}>
          <ringGeometry args={[1.3, 2.0, 72]} />
          <meshStandardMaterial
            color={RING_COLORS.desafios}
            emissive={
              roundKey === "desafios"
                ? RING_COLORS.desafios
                : "#000000"
            }
            emissiveIntensity={roundKey === "desafios" ? 0.5 : 0}
          />
        </mesh>

        {/* CENTRO BLANCO */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1, 1, 0.35, 48]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* TEXTOS 3D (muy sencillos, estilo tablero) */}
        <Text
          position={[0, 0.6, 4.9]}
          fontSize={0.45}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          EXPECTATIVAS
        </Text>

        <Text
          position={[0, 0.6, -4.9]}
          rotation={[0, Math.PI, 0]}
          fontSize={0.45}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          EXPECTATIVAS
        </Text>

        <Text
          position={[-4.9, 0.6, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          fontSize={0.4}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          CONTRIBUCIÓN
        </Text>

        <Text
          position={[4.9, 0.6, 0]}
          rotation={[0, Math.PI / 2, 0]}
          fontSize={0.4}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          CONTRIBUCIÓN
        </Text>

        <Text
          position={[3.2, 0.6, 3.2]}
          rotation={[0, Math.PI / 4, 0]}
          fontSize={0.38}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          DESAFÍOS
        </Text>

        <Text
          position={[-3.2, 0.6, -3.2]}
          rotation={[0, -3 * Math.PI / 4, 0]}
          fontSize={0.38}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          DESAFÍOS
        </Text>

        {/* BICICLETAS DE CADA JUGADOR */}
        {players.map((p, index) => {
          if (p.maxRoundReached < 0) return null;

          const ringIndex = Math.min(p.maxRoundReached, 2);
          const slotIndex = index; // 0..5 una por color

          const target = getTargetPosition(ringIndex, slotIndex);
          const isActive =
            p.id === currentPlayerId &&
            p.maxRoundReached === currentRound;

          return (
            <Bike
              key={p.id}
              color={p.color}
              target={target}
              isActive={isActive}
            />
          );
        })}
      </group>

      {/* CONTROLES DE CÁMARA ESTILO JUEGO DE MESA */}
      <OrbitControls
        enablePan={false}
        minDistance={6}
        maxDistance={9}
        maxPolarAngle={Math.PI / 2}
        target={[0, 0, 0]}
      />
    </>
  );
}
