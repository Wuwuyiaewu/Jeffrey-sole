"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Stars, Line } from "@react-three/drei";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { EXPERIENCE_SECTIONS } from "@/lib/nav-data";

// ── 6 階段色票（與 experience/page.tsx 同步）──────────────────────
const STAGE_COLORS: Record<number, string> = {
  1: "#38bdf8", // sky
  2: "#a78bfa", // violet
  3: "#34d399", // emerald
  4: "#fbbf24", // amber
  5: "#f472b6", // pink
  6: "#fb7185", // rose
};

// ── 型別 ──────────────────────────────────────────────────────────
type GraphNode = {
  id: string;
  label: string;
  subLabel?: string;
  href?: string;
  pos: [number, number, number];
  isStage: boolean;
  stage: number;
  color: string;
};

type GraphEdge = {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  isProgression: boolean;
};

// ── 計算圖形 ──────────────────────────────────────────────────────
function buildGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const stagePositions: [number, number, number][] = [];

  EXPERIENCE_SECTIONS.forEach((section, si) => {
    // 6 個階段沿 X 軸展開，奇偶 Y 方向交錯形成波浪
    const x = (si - 2.5) * 5.8;
    const yDir = si % 2 === 0 ? -1 : 1;
    const y = yDir * 1.4;
    const stagePos: [number, number, number] = [x, y, 0];
    stagePositions.push(stagePos);

    const color = STAGE_COLORS[section.stage];

    nodes.push({
      id: `stage-${section.stage}`,
      label: section.enTitle,
      subLabel: `Stage ${section.stage}`,
      pos: stagePos,
      isStage: true,
      stage: section.stage,
      color,
    });

    // 子項目扇形散布（只在 Y / Z 平面展開，避免與鄰近階段 X 重疊）
    const M = section.items.length;
    const R = Math.max(2.5, M * 0.30);
    const fanAngle = Math.min(Math.PI * 0.85, M * 0.19);

    section.items.forEach((item, ii) => {
      const t = M === 1 ? 0 : (ii / (M - 1) - 0.5) * 2;
      const angle = t * fanAngle;
      const itemPos: [number, number, number] = [
        x,
        y + yDir * (R * 0.38 + Math.cos(angle * 0.5) * 0.25),
        Math.sin(angle) * R,
      ];

      nodes.push({
        id: `item-${section.stage}-${ii}`,
        label: item.name,
        href: item.href,
        pos: itemPos,
        isStage: false,
        stage: section.stage,
        color,
      });

      edges.push({
        from: stagePos,
        to: itemPos,
        color,
        isProgression: false,
      });
    });
  });

  // 階段連線（表示學習進程）
  for (let i = 0; i < stagePositions.length - 1; i++) {
    edges.push({
      from: stagePositions[i],
      to: stagePositions[i + 1],
      color: "#ffffff",
      isProgression: true,
    });
  }

  return { nodes, edges };
}

const { nodes: NODES, edges: EDGES } = buildGraph();

// ── 節點元件 ──────────────────────────────────────────────────────
function NodeMesh({
  node,
  onHover,
  onLeave,
  onClick,
}: {
  node: GraphNode;
  onHover: (n: GraphNode) => void;
  onLeave: () => void;
  onClick: (n: GraphNode) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    // Scale lerp
    const target = hovered ? 1.55 : 1;
    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(meshRef.current.scale.x, target, delta * 11),
    );
    // Stage nodes: pulsing glow
    if (node.isStage && matRef.current) {
      const pulse = 1.8 + Math.sin(state.clock.elapsedTime * 1.6 + node.stage) * 0.35;
      matRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        matRef.current.emissiveIntensity,
        hovered ? 4.5 : pulse,
        delta * 6,
      );
    }
  });

  const radius = node.isStage ? 0.44 : 0.13;

  return (
    <group position={node.pos}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover(node);
          document.body.style.cursor = node.href ? "pointer" : "default";
        }}
        onPointerOut={() => {
          setHovered(false);
          onLeave();
          document.body.style.cursor = "default";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick(node);
        }}
      >
        <sphereGeometry args={[radius, 28, 28]} />
        <meshStandardMaterial
          ref={matRef}
          color={node.color}
          emissive={node.color}
          emissiveIntensity={node.isStage ? 1.8 : 0.55}
          roughness={0.04}
          metalness={0.82}
        />
      </mesh>

      {/* 階段節點常駐標籤 */}
      {node.isStage && (
        <>
          <Text
            position={[0, radius + 0.28, 0]}
            fontSize={0.21}
            color={node.color}
            anchorX="center"
            anchorY="bottom"
            outlineColor="#000000"
            outlineWidth={0.022}
          >
            {node.subLabel}
          </Text>
          <Text
            position={[0, radius + 0.54, 0]}
            fontSize={0.17}
            color="#e5e7eb"
            anchorX="center"
            anchorY="bottom"
            outlineColor="#000000"
            outlineWidth={0.018}
            maxWidth={3.2}
          >
            {node.label}
          </Text>
        </>
      )}
    </group>
  );
}

// ── 3D 場景 ───────────────────────────────────────────────────────
function Scene({
  onHover,
  onLeave,
  onNavigate,
}: {
  onHover: (n: GraphNode) => void;
  onLeave: () => void;
  onNavigate: (href: string) => void;
}) {
  return (
    <>
      <color attach="background" args={["#030712"]} />
      <Stars radius={90} depth={60} count={5500} factor={3} fade speed={0.3} />
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0, 6]} intensity={3.5} color="#ffffff" />
      <pointLight position={[-15, 5, 8]} intensity={1.8} color="#4040ff" />
      <pointLight position={[15, -5, 8]} intensity={1.8} color="#ff3060" />

      <OrbitControls
        autoRotate
        autoRotateSpeed={0.22}
        enableDamping
        dampingFactor={0.06}
        minDistance={8}
        maxDistance={55}
        target={[0, 0, 0]}
      />

      {/* 邊 */}
      {EDGES.map((edge, i) => (
        <Line
          key={`e${i}`}
          points={[edge.from, edge.to]}
          color={edge.color}
          lineWidth={edge.isProgression ? 2.0 : 0.65}
          transparent
          opacity={edge.isProgression ? 0.58 : 0.22}
        />
      ))}

      {/* 節點 */}
      {NODES.map((node) => (
        <NodeMesh
          key={node.id}
          node={node}
          onHover={onHover}
          onLeave={onLeave}
          onClick={(n) => {
            if (n.href) onNavigate(n.href);
          }}
        />
      ))}
    </>
  );
}

// ── 主元件 ───────────────────────────────────────────────────────
export default function RoadmapGraph() {
  const router = useRouter();
  const [hovered, setHovered] = useState<GraphNode | null>(null);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 標題 */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none select-none">
        <h1 className="text-white text-2xl font-bold tracking-widest drop-shadow-lg">
          開發路線圖
        </h1>
        <p className="text-neutral-500 text-xs mt-1 tracking-widest uppercase">
          Frontend Roadmap · 6 Stages
        </p>
      </div>

      {/* Hover 資訊面板 */}
      <div
        className={`absolute top-6 left-6 z-10 p-4 bg-black/80 border rounded-xl backdrop-blur-md transition-all duration-200 w-64 ${
          hovered
            ? "opacity-100 translate-y-0 border-neutral-700"
            : "opacity-0 translate-y-1 border-transparent pointer-events-none"
        }`}
      >
        {hovered && (
          <>
            <p
              className="text-[10px] font-semibold uppercase tracking-widest mb-2"
              style={{ color: hovered.color }}
            >
              {hovered.isStage
                ? `● Stage ${hovered.stage} — ${hovered.label}`
                : `◦ Stage ${hovered.stage} / Skill`}
            </p>
            <p className="text-sm text-white leading-snug break-words">
              {hovered.isStage ? hovered.subLabel : hovered.label}
            </p>
            {hovered.href ? (
              <p className="text-[11px] text-neutral-500 mt-2 truncate">
                → {hovered.href}
              </p>
            ) : (
              !hovered.isStage && (
                <p className="text-[11px] text-neutral-600 mt-2 italic">
                  說明頁建置中
                </p>
              )
            )}
          </>
        )}
      </div>

      {/* 階段圖例 */}
      <div className="absolute bottom-6 left-6 z-10 space-y-1 pointer-events-none select-none">
        {EXPERIENCE_SECTIONS.map((sec) => (
          <div key={sec.stage} className="flex items-center gap-2">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: STAGE_COLORS[sec.stage] }}
            />
            <span className="text-[10px] text-neutral-500">
              S{sec.stage} · {sec.enTitle}
            </span>
          </div>
        ))}
      </div>

      {/* 操作提示 */}
      <div className="absolute bottom-6 right-6 z-10 text-right pointer-events-none select-none">
        <p className="text-[11px] text-neutral-600">拖曳旋轉 · 滾輪縮放</p>
        <p className="text-[11px] text-neutral-600 mt-0.5">
          點擊技能節點前往說明頁
        </p>
      </div>

      <Canvas
        camera={{ position: [0, 6, 30], fov: 65 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <Scene
          onHover={setHovered}
          onLeave={() => setHovered(null)}
          onNavigate={(href) => router.push(href)}
        />
      </Canvas>
    </div>
  );
}
