"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Stars, Line } from "@react-three/drei";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { EXPERIENCE_SECTIONS } from "@/lib/nav-data";

// ── 各分類色票 ────────────────────────────────────────────────────
const COLORS = [
  "#60a5fa", // blue
  "#34d399", // emerald
  "#a78bfa", // violet
  "#f472b6", // pink
  "#fb923c", // orange
  "#facc15", // yellow
  "#2dd4bf", // teal
  "#f87171", // red
  "#4ade80", // green
  "#818cf8", // indigo
  "#e879f9", // fuchsia
];

function getEnLabel(title: string) {
  return title.match(/\((.+?)\)/)?.[1] ?? title;
}

// ── 資料型別 ──────────────────────────────────────────────────────
type GraphNode = {
  id: string;
  label: string;
  enLabel: string;
  href?: string;
  pos: [number, number, number];
  isSection: boolean;
  color: string;
};

type GraphEdge = {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
};

// ── 計算節點 & 連線位置 ───────────────────────────────────────────
function buildGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const N = EXPERIENCE_SECTIONS.length;

  EXPERIENCE_SECTIONS.forEach((sec, si) => {
    const angle = (si / N) * Math.PI * 2 - Math.PI / 2;
    const R = 7.5;
    const sx = Math.cos(angle) * R;
    const sy = si % 2 === 0 ? 0.9 : -0.9;
    const sz = Math.sin(angle) * R;
    const color = COLORS[si % COLORS.length];

    nodes.push({
      id: `s${si}`,
      label: sec.title,
      enLabel: getEnLabel(sec.title),
      pos: [sx, sy, sz],
      isSection: true,
      color,
    });

    const M = sec.items.length;
    sec.items.forEach((item, ii) => {
      const spread = M > 5 ? 2.6 : 2.0;
      const iAngle = (ii / M) * Math.PI * 2 + angle + Math.PI / M;
      const ix = sx + Math.cos(iAngle) * spread;
      const iy = sy + Math.sin(iAngle) * 0.7;
      const iz = sz + Math.sin(iAngle) * spread;

      nodes.push({
        id: `i${si}-${ii}`,
        label: item.name,
        enLabel: item.name,
        href: item.href,
        pos: [ix, iy, iz],
        isSection: false,
        color,
      });

      edges.push({
        from: [sx, sy, sz],
        to: [ix, iy, iz],
        color,
      });
    });
  });

  return { nodes, edges };
}

const { nodes: NODES, edges: EDGES } = buildGraph();

// ── 單一節點元件 ──────────────────────────────────────────────────
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
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const target = hovered ? 1.45 : 1;
    meshRef.current.scale.x = THREE.MathUtils.lerp(
      meshRef.current.scale.x,
      target,
      delta * 12,
    );
    meshRef.current.scale.y = meshRef.current.scale.x;
    meshRef.current.scale.z = meshRef.current.scale.x;
  });

  const radius = node.isSection ? 0.38 : 0.13;

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
        <sphereGeometry args={[radius, 24, 24]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={hovered ? 3.5 : node.isSection ? 1.4 : 0.6}
          roughness={0.05}
          metalness={0.85}
        />
      </mesh>

      {/* 分類節點永遠顯示英文標籤 */}
      {node.isSection && (
        <Text
          position={[0, radius + 0.32, 0]}
          fontSize={0.23}
          color={node.color}
          anchorX="center"
          anchorY="bottom"
          outlineColor="#000000"
          outlineWidth={0.022}
        >
          {node.enLabel}
        </Text>
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
      <Stars
        radius={60}
        depth={40}
        count={4500}
        factor={3}
        fade
        speed={0.4}
      />
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={4} color="#ffffff" />
      <pointLight position={[12, 8, 10]} intensity={1.2} color="#4040ff" />
      <pointLight position={[-12, -8, -10]} intensity={1.2} color="#ff4060" />
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.3}
        enableDamping
        dampingFactor={0.06}
        minDistance={6}
        maxDistance={38}
      />

      {/* 連線 */}
      {EDGES.map((edge, i) => (
        <Line
          key={`e${i}`}
          points={[edge.from, edge.to]}
          color={edge.color}
          lineWidth={0.7}
          transparent
          opacity={0.28}
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

// ── 主要匯出 ──────────────────────────────────────────────────────
export default function SkillGraph() {
  const router = useRouter();
  const [hovered, setHovered] = useState<GraphNode | null>(null);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 頁面標題 */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none select-none">
        <h1 className="text-white text-2xl font-bold tracking-widest drop-shadow-lg">
          技能圖譜
        </h1>
        <p className="text-neutral-500 text-xs mt-1 tracking-widest uppercase">
          Skill Knowledge Graph
        </p>
      </div>

      {/* Hover 資訊面板 */}
      <div
        className={`absolute top-6 left-6 z-10 p-4 bg-black/80 border rounded-xl backdrop-blur-md transition-all duration-200 w-64 ${
          hovered
            ? "opacity-100 translate-y-0 border-neutral-600"
            : "opacity-0 translate-y-1 border-transparent pointer-events-none"
        }`}
      >
        {hovered && (
          <>
            <p
              className="text-[10px] font-semibold uppercase tracking-widest mb-2"
              style={{ color: hovered.color }}
            >
              {hovered.isSection ? "● Category" : "◦ Skill"}
            </p>
            <p className="text-sm text-white leading-snug break-words">
              {hovered.label}
            </p>
            {hovered.href ? (
              <p className="text-[11px] text-neutral-500 mt-2 truncate">
                → {hovered.href}
              </p>
            ) : (
              !hovered.isSection && (
                <p className="text-[11px] text-neutral-600 mt-2 italic">
                  說明頁建置中
                </p>
              )
            )}
          </>
        )}
      </div>

      {/* 操作提示 */}
      <div className="absolute bottom-6 right-6 z-10 text-right pointer-events-none select-none">
        <p className="text-[11px] text-neutral-600">拖曳旋轉 · 滾輪縮放</p>
        <p className="text-[11px] text-neutral-600 mt-0.5">
          點擊發光節點前往說明頁
        </p>
      </div>

      {/* 分類色票圖例 */}
      <div className="absolute bottom-6 left-6 z-10 space-y-1 pointer-events-none select-none">
        {EXPERIENCE_SECTIONS.map((sec, i) => (
          <div key={sec.title} className="flex items-center gap-1.5">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            <span className="text-[10px] text-neutral-500">
              {getEnLabel(sec.title)}
            </span>
          </div>
        ))}
      </div>

      <Canvas
        camera={{ position: [0, 7, 24], fov: 55 }}
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
