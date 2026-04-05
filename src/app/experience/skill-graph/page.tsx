"use client";

import dynamic from "next/dynamic";

const SkillGraph = dynamic(
  () => import("./_components/SkillGraph"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen items-center justify-center bg-[#030712] text-neutral-500 text-sm tracking-widest">
        載入圖譜中...
      </div>
    ),
  },
);

export default function SkillGraphPage() {
  return <SkillGraph />;
}
