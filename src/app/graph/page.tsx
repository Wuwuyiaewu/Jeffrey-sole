"use client";

import dynamic from "next/dynamic";

const RoadmapGraph = dynamic(
  () => import("./_components/RoadmapGraph"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen items-center justify-center bg-[#030712] text-neutral-500 text-sm tracking-widest">
        載入路線圖...
      </div>
    ),
  },
);

export default function GraphPage() {
  return <RoadmapGraph />;
}
