"use client";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, Html, Stars, Sparkles } from "@react-three/drei";

function GlowingOrb({ position, color, scale = 1 }: { position: [number, number, number], color: string, scale?: number }) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={2}>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial emissive={color} emissiveIntensity={1.5} color={color} transparent opacity={0.7} />
        <pointLight color={color} intensity={2} distance={5} />
      </mesh>
    </Float>
  );
}

function GlowingRune({ position, color, scale = 1 }: { position: [number, number, number], color: string, scale?: number }) {
  // Just a torus for a rune-like effect
  return (
    <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5}>
      <mesh position={position} scale={scale} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.12, 16, 100]} />
        <meshStandardMaterial emissive={color} emissiveIntensity={2} color={color} transparent opacity={0.5} />
        <pointLight color={color} intensity={1.5} distance={4} />
      </mesh>
    </Float>
  );
}

function GlowingCrystal({ position, color, scale = 1 }: { position: [number, number, number], color: string, scale?: number }) {
  // A simple cone for a crystal effect
  return (
    <Float speed={1.2} rotationIntensity={1.5} floatIntensity={1.2}>
      <mesh position={position} scale={scale} rotation={[0, 0, Math.PI / 4]}>
        <coneGeometry args={[0.4, 1.2, 8]} />
        <meshStandardMaterial emissive={color} emissiveIntensity={2.5} color={color} transparent opacity={0.7} />
        <pointLight color={color} intensity={1.2} distance={3} />
      </mesh>
    </Float>
  );
}

const Mystical3DBackground = () => {
  // Only render on client
  if (typeof window === "undefined") return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none" }}>
      <Canvas camera={{ position: [0, 0, 7], fov: 60 }} gl={{ alpha: true }}>
        {/* Starfield and sparkles */}
        <Stars radius={40} depth={60} count={1200} factor={2} fade speed={1} />
        <Sparkles count={80} scale={20} size={2} color="#8A2BE2" speed={0.5} opacity={0.2} />
        <ambientLight intensity={0.3} />
        {/* Glowing mystical objects */}
        <GlowingOrb position={[-3, 2, -2]} color="#00FF7F" scale={1.2} />
        <GlowingRune position={[2.5, 1.5, -1]} color="#8A2BE2" scale={1.1} />
        <GlowingCrystal position={[-2, -1.5, -1]} color="#00FF7F" scale={1.1} />
        <GlowingOrb position={[3, -2, -2]} color="#8A2BE2" scale={0.9} />
        <GlowingRune position={[0, 2.8, -2]} color="#00FF7F" scale={0.8} />
        <GlowingCrystal position={[0, -2.5, -2]} color="#8A2BE2" scale={0.7} />
        {/* No controls for user interaction, just floating */}
      </Canvas>
    </div>
  );
};

export default Mystical3DBackground; 