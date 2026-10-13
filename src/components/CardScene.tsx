"use client";

import { ContactShadows, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import type { Group } from "three";

function MetalCard() {
  const ref = useRef<Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = -0.35 + Math.sin(t * 0.32) * 0.2;
    ref.current.rotation.x = 0.28 + Math.sin(t * 0.18) * 0.04;
    ref.current.position.y = Math.sin(t * 0.5) * 0.06;
  });

  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[3.37, 2.125, 0.05]} />
        <meshStandardMaterial
          color="#6d716f"
          metalness={0.78}
          roughness={0.28}
        />
      </mesh>
      <mesh position={[-1.18, 0.42, 0.03]}>
        <boxGeometry args={[0.42, 0.32, 0.012]} />
        <meshStandardMaterial
          color="#d4b56a"
          metalness={0.7}
          roughness={0.32}
        />
      </mesh>
      <Text
        position={[-1.32, -0.72, 0.032]}
        fontSize={0.22}
        letterSpacing={0.12}
        color="#f2f2f0"
        anchorX="left"
        anchorY="middle"
      >
        KAST
      </Text>
      <Text
        position={[1.32, -0.72, 0.032]}
        fontSize={0.11}
        color="#d0d0cc"
        anchorX="right"
        anchorY="middle"
      >
        PLATINUM
      </Text>
    </group>
  );
}

export function CardScene({ className }: { className?: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return <div className={className} />;
  }

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0.15, 5.1], fov: 30 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 5, 6]} intensity={2.8} />
        <directionalLight position={[-5, 1, 3]} intensity={0.9} color="#9fd9c8" />
        <MetalCard />
        <ContactShadows
          opacity={0.45}
          scale={10}
          blur={2.4}
          far={4}
          position={[0, -1.4, 0]}
        />
      </Canvas>
    </div>
  );
}
