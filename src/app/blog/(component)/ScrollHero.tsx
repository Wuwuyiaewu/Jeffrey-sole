"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = [
  {
    id: 1,
    num: "01",
    title: "架構設計",
    tags: ["architecture-patterns", "config-drive", "component-layout"],
    side: "left" as const,
    href: "/experience/architecture-patterns",
  },
  {
    id: 2,
    num: "02",
    title: "狀態管理",
    tags: ["state-management", "tanstack-query", "pinia"],
    side: "right" as const,
    href: "/experience/state-management",
  },
  {
    id: 3,
    num: "03",
    title: "資料視覺化",
    tags: ["data-visualization", "echarts", "vis-network"],
    side: "left" as const,
    href: "/experience/data-visualization",
  },
  {
    id: 4,
    num: "04",
    title: "表單 & 驗證",
    tags: ["tanstack-form", "validate", "field-mapping"],
    side: "right" as const,
    href: "/experience/validate",
  },
  {
    id: 5,
    num: "05",
    title: "API 整合",
    tags: ["api-integration", "axios", "azure-msal"],
    side: "left" as const,
    href: "/experience/api-integration",
  },
  {
    id: 6,
    num: "06",
    title: "開發工具",
    tags: ["dev-setup", "testing", "utilities"],
    side: "right" as const,
    href: "/experience/dev-setup",
  },
];

export default function ScrollHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trunkRef = useRef<HTMLDivElement>(null);
  const branchRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=2400",
          scrub: 1,
          pin: true,
          pinType: "transform",
          anticipatePin: 1,
        },
      });

      // 主幹線由上而下展開
      tl.fromTo(
        trunkRef.current,
        { scaleY: 0, transformOrigin: "top center" },
        { scaleY: 1, ease: "none", duration: 6 },
        0,
      );

      // 每個分支依序長出
      SECTIONS.forEach((section, i) => {
        const card = branchRefs.current[i];
        const dot = dotRefs.current[i];
        const isLeft = section.side === "left";

        // 圓點先出現
        tl.fromTo(
          dot,
          { opacity: 0, scale: 0 },
          { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2)" },
          i * 1 + 0.3,
        );

        // 卡片從側邊滑入
        tl.fromTo(
          card,
          { opacity: 0, x: isLeft ? -60 : 60 },
          { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" },
          i * 1 + 0.4,
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="h-screen bg-[#0A0A0A] overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="flex flex-col items-center gap-2 pt-10 pb-6">
        <span className="text-xs font-mono text-[#4A9FD8] bg-[#1E3A5F] px-4 py-1.5 rounded-full tracking-widest">
          GSAP · ScrollTrigger
        </span>
        <h2 className="text-3xl font-bold text-white tracking-tight">
          我的技術經驗
        </h2>
        <p className="text-[#555] text-xs font-mono">
          向下捲動 → 依 trigger 長出分支
        </p>
      </div>

      {/* Timeline */}
      <div className="relative flex-1 max-w-3xl mx-auto w-full px-4 pb-8">
        {/* 主幹線 */}
        <div
          ref={trunkRef}
          className="absolute left-1/2 -translate-x-1/2 w-[2px] top-0 bottom-0 bg-[#1E3A5F]"
        />

        {/* 六個分支 */}
        <div className="h-full flex flex-col justify-around">
          {SECTIONS.map((section, i) => (
            <div key={section.id} className="relative flex items-center">
              {/* 左側 */}
              <div className="w-[46%] flex justify-end pr-5">
                {section.side === "left" ? (
                  <a
                    href={section.href}
                    ref={(el) => {
                      branchRefs.current[i] = el as HTMLDivElement | null;
                    }}
                    className="w-full p-4 bg-[#111111] border border-[#1E3A5F] rounded-lg hover:border-[#4A9FD8] transition-colors cursor-pointer group"
                  >
                    <BranchCard section={section} />
                  </a>
                ) : (
                  <div className="w-full" />
                )}
              </div>

              {/* 中心圓點 */}
              <div className="w-[8%] flex justify-center z-10">
                <div
                  ref={(el) => {
                    dotRefs.current[i] = el;
                  }}
                  className="w-3 h-3 rounded-full bg-[#4A9FD8] ring-[3px] ring-[#0A0A0A] shadow-[0_0_10px_#4A9FD860]"
                />
              </div>

              {/* 右側 */}
              <div className="w-[46%] pl-5">
                {section.side === "right" ? (
                  <a
                    href={section.href}
                    ref={(el) => {
                      branchRefs.current[i] = el as HTMLDivElement | null;
                    }}
                    className="block w-full p-4 bg-[#111111] border border-[#1E3A5F] rounded-lg hover:border-[#4A9FD8] transition-colors cursor-pointer"
                  >
                    <BranchCard section={section} />
                  </a>
                ) : (
                  <div className="w-full" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BranchCard({ section }: { section: (typeof SECTIONS)[number] }) {
  return (
    <>
      <div className="flex items-center gap-2 mb-2">
        <span className="w-6 h-6 flex items-center justify-center rounded-full bg-[#1E3A5F] text-[#4A9FD8] text-[9px] font-mono shrink-0">
          {section.num}
        </span>
        <span className="text-white font-bold text-sm">{section.title}</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {section.tags.map((tag) => (
          <span
            key={tag}
            className="text-[#4A9FD8] text-[10px] font-mono bg-[#1A2E45] px-1.5 py-0.5 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    </>
  );
}
