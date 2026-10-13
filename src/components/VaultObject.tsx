"use client";

import {
  ContactShadows,
  Environment,
  RoundedBox,
  Text,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CanvasTexture,
  ExtrudeGeometry,
  RepeatWrapping,
  Shape,
  SRGBColorSpace,
  type Group,
} from "three";

export type VaultPhase = "ready" | "unlock" | "crank" | "open";

const W = 1.86;
const H = 2.42;
const D = 1.78;
const T = 0.14;
const STEEL = "#1c1c1e";
const STEEL_HI = "#2a2a2e";
const GOLD = "#c9a227";
const BAR_W = 0.23;
const BAR_H = 0.108;
const BAR_L = 0.56;
const BAR_GAP = 0.026;
const PYRAMIDS: Record<number, number[]> = {
  8: [4, 3, 1],
  10: [4, 3, 2, 1],
  12: [5, 4, 3],
};

let grainTex: CanvasTexture | null | undefined;
let barGeo: ExtrudeGeometry | null | undefined;

function grain() {
  if (grainTex !== undefined) return grainTex;
  if (typeof document === "undefined") {
    grainTex = null;
    return grainTex;
  }
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    grainTex = null;
    return grainTex;
  }
  const img = ctx.createImageData(256, 256);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = 112 + Math.random() * 36;
    img.data[i] = n;
    img.data[i + 1] = n;
    img.data[i + 2] = n;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.wrapS = RepeatWrapping;
  tex.wrapT = RepeatWrapping;
  tex.repeat.set(2.4, 2.4);
  tex.anisotropy = 4;
  grainTex = tex;
  return grainTex;
}

function goldBarGeo() {
  if (barGeo !== undefined) return barGeo;
  const shape = new Shape();
  shape.moveTo(-BAR_W / 2, -BAR_H / 2);
  shape.lineTo(BAR_W / 2, -BAR_H / 2);
  shape.lineTo(BAR_W / 2 - 0.032, BAR_H / 2);
  shape.lineTo(-(BAR_W / 2 - 0.032), BAR_H / 2);
  shape.closePath();
  const geo = new ExtrudeGeometry(shape, {
    depth: BAR_L,
    bevelEnabled: true,
    bevelThickness: 0.007,
    bevelSize: 0.006,
    bevelSegments: 2,
  });
  geo.center();
  barGeo = geo;
  return barGeo;
}

type LiveBar = {
  id: string;
  layer: number;
  col: number;
  x: number;
  y: number;
  z: number;
  leaving: boolean;
  delay: number;
  settle: boolean;
};

function pyramid(count: number): Omit<LiveBar, "leaving" | "delay" | "settle">[] {
  const rows = PYRAMIDS[count] ?? PYRAMIDS[10];
  const floor = -(H / 2 - T) + 0.06;
  const pitch = BAR_W + BAR_GAP;
  const slots: Omit<LiveBar, "leaving" | "delay" | "settle">[] = [];
  rows.forEach((n, layer) => {
    for (let col = 0; col < n; col += 1) {
      slots.push({
        id: `${layer}-${col}`,
        layer,
        col,
        x: (col - (n - 1) / 2) * pitch,
        y: floor + BAR_H / 2 + layer * (BAR_H + 0.008),
        z: 0.02,
      });
    }
  });
  return slots;
}

function GoldBar({
  id,
  x,
  y,
  z,
  leaving,
  delay,
  settle,
  onGone,
}: LiveBar & { onGone: (id: string) => void }) {
  const ref = useRef<Group>(null);
  const { clock } = useThree();
  const born = useRef<number | null>(null);
  const leaveStart = useRef<number | null>(null);
  const pos = useRef({ x, y: settle ? y : y + 0.5, z });
  const scl = useRef(settle ? 1 : 0.12);
  const appeared = useRef(settle);
  const gone = useRef(false);

  useEffect(() => {
    if (leaving) {
      if (leaveStart.current === null) leaveStart.current = clock.elapsedTime;
      return;
    }
    leaveStart.current = null;
    gone.current = false;
  }, [leaving, clock]);

  useFrame(() => {
    const node = ref.current;
    if (!node) return;
    if (born.current === null) born.current = clock.elapsedTime;

    if (leaving && leaveStart.current !== null) {
      const u = ease((clock.elapsedTime - leaveStart.current - delay) / 0.4);
      if (u > 0) {
        pos.current.x = lerp(pos.current.x, x, 0.18);
        pos.current.y = lerp(pos.current.y, y + 0.42, 0.15);
        pos.current.z = lerp(pos.current.z, z, 0.18);
        scl.current = lerp(scl.current, 0.05, 0.2);
      }
      if (u >= 1 && !gone.current) {
        gone.current = true;
        onGone(id);
      }
    } else if (!appeared.current) {
      const u = ease((clock.elapsedTime - born.current - delay) / 0.5);
      if (u > 0) {
        const lift = 0.5 * (1 - u);
        pos.current.x = lerp(pos.current.x, x, 0.24);
        pos.current.y = lerp(pos.current.y, y + lift, 0.24);
        pos.current.z = lerp(pos.current.z, z, 0.24);
        scl.current = lerp(scl.current, 1, 0.22);
      }
      if (u >= 1) appeared.current = true;
    } else {
      pos.current.x = lerp(pos.current.x, x, 0.14);
      pos.current.y = lerp(pos.current.y, y, 0.14);
      pos.current.z = lerp(pos.current.z, z, 0.14);
      scl.current = lerp(scl.current, 1, 0.16);
    }

    node.position.set(pos.current.x, pos.current.y, pos.current.z);
    node.scale.setScalar(scl.current);
  });

  return (
    <group ref={ref}>
      <mesh geometry={goldBarGeo() ?? undefined}>
        <meshPhysicalMaterial
          color={GOLD}
          metalness={0.92}
          roughness={0.22}
          envMapIntensity={1.15}
          clearcoat={0.28}
          clearcoatRoughness={0.32}
        />
      </mesh>
    </group>
  );
}

function Coat({
  color = STEEL,
  roughness = 0.62,
  metalness = 0.2,
}: {
  color?: string;
  roughness?: number;
  metalness?: number;
}) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={roughness}
      metalness={metalness}
      roughnessMap={grain() ?? undefined}
      clearcoat={0.18}
      clearcoatRoughness={0.52}
      envMapIntensity={0.55}
      sheen={0.08}
      sheenColor="#8a8a8e"
    />
  );
}

function Chrome({ color = "#6a6a70" }: { color?: string }) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={0.22}
      metalness={0.88}
      clearcoat={0.45}
      clearcoatRoughness={0.2}
      envMapIntensity={0.9}
    />
  );
}

function lerp(a: number, b: number, n: number) {
  return a + (b - a) * n;
}

function comboAngle(t: number) {
  const keys = [
    [0, 0],
    [0.26, 318],
    [0.34, 318],
    [0.62, 102],
    [0.72, 102],
    [1, 246],
  ] as const;
  const p = Math.min(1, Math.max(0, t));
  for (let i = 1; i < keys.length; i += 1) {
    if (p <= keys[i][0]) {
      const [t0, a0] = keys[i - 1];
      const [t1, a1] = keys[i];
      const u = (p - t0) / (t1 - t0);
      const s = u * u * (3 - 2 * u);
      return ((a0 + (a1 - a0) * s) * Math.PI) / 180;
    }
  }
  return (246 * Math.PI) / 180;
}

function ease(t: number) {
  const p = Math.min(1, Math.max(0, t));
  return p * p * (3 - 2 * p);
}

function Bolt({
  position,
  flip = false,
  scale = 1,
}: {
  position: [number, number, number];
  flip?: boolean;
  scale?: number;
}) {
  return (
    <group position={position} rotation={flip ? [0, Math.PI, 0] : [0, 0, 0]} scale={scale}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.032, 0.032, 0.034, 16]} />
        <Chrome color="#3a3a3e" />
      </mesh>
      <mesh position={[0, 0, 0.016]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.012, 6]} />
        <Chrome color="#2e2e32" />
      </mesh>
    </group>
  );
}

function Hinge({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.038, 0.038, 0.18, 18]} />
        <Chrome color="#3a3a40" />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.016, 0.016, 0.22, 12]} />
        <Chrome color="#4a4a50" />
      </mesh>
    </group>
  );
}

function VaultRig({
  phase,
  bars,
}: {
  phase: VaultPhase;
  bars: number;
}) {
  const root = useRef<Group>(null);
  const door = useRef<Group>(null);
  const wheel = useRef<Group>(null);
  const unlockAt = useRef(0);
  const openAt = useRef(0);
  const { clock } = useThree();

  useEffect(() => {
    if (phase === "unlock") unlockAt.current = clock.elapsedTime;
    if (phase === "open") openAt.current = clock.elapsedTime;
  }, [phase, clock]);

  useFrame(() => {
    if (!root.current || !door.current || !wheel.current) return;

    const openT =
      phase === "open"
        ? openAt.current === 0
          ? 1
          : ease((clock.elapsedTime - openAt.current) / 1.5)
        : 0;

    root.current.rotation.y = -0.38 + openT * 0.28;
    root.current.rotation.x = 0.07 + openT * -0.03;
    root.current.position.x = openT * -0.32;
    door.current.rotation.y = openT * 2.35;

    if (phase === "ready") {
      wheel.current.rotation.z = lerp(wheel.current.rotation.z, 0, 0.12);
    } else {
      const t =
        unlockAt.current === 0 && phase === "open"
          ? 1
          : (clock.elapsedTime - unlockAt.current) / 2.5;
      wheel.current.rotation.z = -comboAngle(t);
    }
  });

  const keypadDots = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
        return { x: Math.cos(a) * 0.048, y: Math.sin(a) * 0.048 };
      }),
    [],
  );

  const spokes = useMemo(
    () => Array.from({ length: 6 }, (_, i) => (i / 6) * Math.PI * 2),
    [],
  );

  const bolts = useMemo(() => [-0.86, -0.43, 0, 0.43, 0.86], []);

  const doorW = W - T * 2.05;
  const doorH = H - T * 2.05;

  const innerRivets = useMemo(() => {
    const hx = (doorW - 0.06) / 2 - 0.08;
    const hy = (doorH - 0.06) / 2 - 0.08;
    const rows = [-hy, -hy / 2, 0, hy / 2, hy];
    const mid = [-hx / 2, 0, hx / 2];
    const pts: [number, number][] = [];
    for (const x of [-hx, hx]) {
      for (const y of rows) pts.push([x, y]);
    }
    for (const x of mid) {
      pts.push([x, hy], [x, -hy]);
    }
    return pts;
  }, [doorW, doorH]);

  const [live, setLive] = useState<LiveBar[]>(() =>
    pyramid(bars).map((slot) => ({
      ...slot,
      leaving: false,
      delay: 0,
      settle: true,
    })),
  );

  useEffect(() => {
    const next = pyramid(bars);
    const quiet =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (quiet) {
      setLive(
        next.map((slot) => ({
          ...slot,
          leaving: false,
          delay: 0,
          settle: true,
        })),
      );
      return;
    }

    setLive((prev) => {
      const nextById = new Map(next.map((slot) => [slot.id, slot]));
      const result: LiveBar[] = prev.map((bar) => {
        const slot = nextById.get(bar.id);
        if (slot) {
          return { ...bar, ...slot, leaving: false };
        }
        return {
          ...bar,
          leaving: true,
          delay: (3 - bar.layer) * 0.055 + bar.col * 0.04,
        };
      });
      let enter = 0;
      next.forEach((slot) => {
        if (prev.some((bar) => bar.id === slot.id)) return;
        result.push({
          ...slot,
          leaving: false,
          settle: false,
          delay: slot.layer * 0.05 + enter * 0.05,
        });
        enter += 1;
      });
      return result;
    });
  }, [bars]);

  return (
    <group ref={root} position={[0, 0.08, 0]}>
      <mesh position={[-(W / 2 - T / 2), 0, 0]}>
        <boxGeometry args={[T, H, D]} />
        <Coat />
      </mesh>
      <mesh position={[W / 2 - T / 2, 0, 0]}>
        <boxGeometry args={[T, H, D]} />
        <Coat color={STEEL_HI} roughness={0.58} />
      </mesh>
      <mesh position={[0, H / 2 - T / 2, 0]}>
        <boxGeometry args={[W, T, D]} />
        <Coat color={STEEL_HI} roughness={0.56} />
      </mesh>
      <mesh position={[0, -(H / 2 - T / 2), 0]}>
        <boxGeometry args={[W, T, D]} />
        <Coat />
      </mesh>
      <mesh position={[0, 0, -(D / 2 - T / 2)]}>
        <boxGeometry args={[W - T * 2, H - T * 2, T]} />
        <Coat />
      </mesh>

      <mesh position={[0, (H - T) / 2, D / 2 - 0.04]}>
        <boxGeometry args={[W, T, 0.08]} />
        <Coat />
      </mesh>
      <mesh position={[0, -(H - T) / 2, D / 2 - 0.04]}>
        <boxGeometry args={[W, T, 0.08]} />
        <Coat />
      </mesh>
      <mesh position={[-(W - T) / 2, 0, D / 2 - 0.04]}>
        <boxGeometry args={[T, H - T * 2, 0.08]} />
        <Coat />
      </mesh>
      <mesh position={[(W - T) / 2, 0, D / 2 - 0.04]}>
        <boxGeometry args={[T, H - T * 2, 0.08]} />
        <Coat />
      </mesh>

      <mesh position={[0, -(H / 2 - T) + 0.03, 0.02]}>
        <boxGeometry args={[W - T * 2.15, 0.06, D - T * 2.1]} />
        <Coat color="#161618" roughness={0.7} />
      </mesh>

      <RoundedBox
        args={[W + 0.16, 0.11, D + 0.12]}
        radius={0.018}
        smoothness={4}
        position={[0, -(H / 2) - 0.055, 0]}
      >
        <Coat color="#151517" roughness={0.7} />
      </RoundedBox>

      {live.map((bar) => (
        <GoldBar
          key={bar.id}
          {...bar}
          onGone={(id) => {
            setLive((prev) => prev.filter((item) => item.id !== id));
          }}
        />
      ))}

      <group ref={door} position={[W / 2 - T, 0, D / 2 - 0.01]}>
        <RoundedBox
          args={[doorW, doorH, 0.11]}
          radius={0.02}
          smoothness={4}
          position={[-doorW / 2, 0, 0.02]}
        >
          <Coat color="#1a1a1c" roughness={0.6} />
        </RoundedBox>
        <RoundedBox
          args={[doorW - 0.04, doorH - 0.04, 0.045]}
          radius={0.016}
          smoothness={4}
          position={[-doorW / 2, 0, -0.048]}
        >
          <Coat />
        </RoundedBox>
        {innerRivets.map(([x, y]) => (
          <Bolt
            key={`in-${x}-${y}`}
            flip
            scale={0.82}
            position={[-doorW / 2 + x, y, -0.074]}
          />
        ))}

        <mesh position={[-doorW / 2, 0, 0.078]}>
          <planeGeometry args={[doorW - 0.08, doorH - 0.08]} />
          <meshPhysicalMaterial
            color="#161618"
            roughness={0.68}
            metalness={0.16}
            transparent
            opacity={0.18}
            envMapIntensity={0.3}
          />
        </mesh>

        <Text
          position={[-doorW / 2, 0.9, 0.09]}
          fontSize={0.075}
          letterSpacing={0.14}
          color="#2c2c2e"
          anchorX="center"
          anchorY="middle"
        >
          KAST
        </Text>

        <group position={[-doorW / 2, 0.38, 0.09]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.078, 0.078, 0.018, 32]} />
            <Coat color="#121214" roughness={0.42} metalness={0.35} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.002]}>
            <torusGeometry args={[0.068, 0.006, 10, 28]} />
            <Chrome color="#3a3a3e" />
          </mesh>
          {keypadDots.map((dot) => (
            <mesh key={`${dot.x}-${dot.y}`} position={[dot.x, dot.y, 0.014]}>
              <sphereGeometry args={[0.009, 12, 12]} />
              <Chrome color="#4a4a50" />
            </mesh>
          ))}
          <mesh position={[0.12, 0, 0.012]}>
            <cylinderGeometry args={[0.016, 0.016, 0.01, 16]} />
            <Chrome color="#3a3a40" />
          </mesh>
        </group>

        <group ref={wheel} position={[-doorW / 2, -0.32, 0.1]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.048, 0.048, 0.04, 24]} />
            <Chrome color="#3e3e44" />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.018]}>
            <cylinderGeometry args={[0.028, 0.028, 0.02, 16]} />
            <Chrome color="#4a4a50" />
          </mesh>
          {spokes.map((a) => (
            <group key={a} rotation={[0, 0, a]}>
              <mesh position={[0, 0.125, 0]} rotation={[0.12, 0, 0]}>
                <capsuleGeometry args={[0.013, 0.18, 4, 8]} />
                <Chrome color="#3a3a40" />
              </mesh>
              <mesh position={[0, 0.228, 0.01]}>
                <sphereGeometry args={[0.016, 12, 12]} />
                <Chrome color="#4a4a50" />
              </mesh>
            </group>
          ))}
        </group>

        {bolts.map((y) => (
          <Bolt key={y} position={[-doorW + 0.075, y, 0.08]} />
        ))}
      </group>

      <Hinge position={[W / 2 - 0.02, 0.7, D / 2]} />
      <Hinge position={[W / 2 - 0.02, -0.7, D / 2]} />
    </group>
  );
}

export function VaultObject({
  phase,
  bars,
}: {
  phase: VaultPhase;
  bars: number;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="vault-stage" aria-hidden="true" />;
  }

  return (
    <div className="vault-stage" aria-hidden="true">
      <Canvas
        camera={{ position: [0.55, 0.28, 6.4], fov: 26 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 8, 16]} />
        <Environment preset="studio" environmentIntensity={0.38} />
        <hemisphereLight args={["#c4c0ba", "#08080a", 0.22]} />
        <ambientLight intensity={0.12} />
        <directionalLight
          position={[-2.4, 2.8, 4.8]}
          intensity={0.85}
          color="#e8e4dc"
        />
        <directionalLight
          position={[4.2, 1.6, 2.1]}
          intensity={2.8}
          color="#e8a040"
        />
        <spotLight
          position={[3.4, 2.4, 2.6]}
          intensity={1.15}
          angle={0.38}
          penumbra={0.85}
          color="#f2b35a"
        />
        <group scale={0.84}>
          <VaultRig phase={phase} bars={bars} />
          <ContactShadows
            opacity={0.55}
            scale={6.5}
            blur={3.4}
            far={3.2}
            color="#000000"
            position={[0, -1.35, 0]}
          />
        </group>
      </Canvas>
    </div>
  );
}
