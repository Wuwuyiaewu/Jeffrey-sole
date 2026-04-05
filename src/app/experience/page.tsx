import Link from "next/link";
import { EXPERIENCE_SECTIONS } from "@/lib/nav-data";

// 每個階段的色調
const STAGE_COLORS: Record<
  number,
  { border: string; badge: string; dot: string }
> = {
  1: {
    border: "border-sky-400",
    badge: "bg-sky-950/60 text-sky-300 border-sky-700",
    dot: "bg-sky-400",
  },
  2: {
    border: "border-violet-400",
    badge: "bg-violet-950/60 text-violet-300 border-violet-700",
    dot: "bg-violet-400",
  },
  3: {
    border: "border-emerald-400",
    badge: "bg-emerald-950/60 text-emerald-300 border-emerald-700",
    dot: "bg-emerald-400",
  },
  4: {
    border: "border-amber-400",
    badge: "bg-amber-950/60 text-amber-300 border-amber-700",
    dot: "bg-amber-400",
  },
  5: {
    border: "border-pink-400",
    badge: "bg-pink-950/60 text-pink-300 border-pink-700",
    dot: "bg-pink-400",
  },
  6: {
    border: "border-rose-400",
    badge: "bg-rose-950/60 text-rose-300 border-rose-700",
    dot: "bg-rose-400",
  },
};

export default function ExperiencePage() {
  return (
    <main className="p-8 bg-white dark:bg-neutral-900 text-black dark:text-white min-h-screen max-w-4xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold mb-1">開發經驗路線圖</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          依照 2026 前端職能框架整理，從基礎到生產的六個遞進階段
        </p>
      </div>

      <div className="relative">
        {/* 垂直時間軸線 */}
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-neutral-200 dark:bg-neutral-700 hidden sm:block" />

        <div className="space-y-10">
          {EXPERIENCE_SECTIONS.map((section) => {
            const color = STAGE_COLORS[section.stage];
            return (
              <div key={section.stage} className="relative sm:pl-12">
                {/* 時間軸節點 */}
                <div
                  className={`absolute left-0 top-1 hidden sm:flex size-10 items-center justify-center rounded-full border-2 ${color.border} bg-white dark:bg-neutral-900 text-xs font-bold`}
                  style={{ zIndex: 1 }}
                >
                  <span className="text-neutral-700 dark:text-neutral-300">
                    {section.stage}
                  </span>
                </div>

                {/* 階段標題 */}
                <div className="mb-4">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${color.badge}`}
                    >
                      Stage {section.stage}
                    </span>
                    <h2 className="text-lg font-semibold">{section.title}</h2>
                    <span className="text-sm text-neutral-400 dark:text-neutral-500">
                      {section.enTitle}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {section.description}
                  </p>
                </div>

                {/* 項目 Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {section.items.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="group flex items-center gap-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 px-3.5 py-2.5 hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-all"
                    >
                      <span
                        className={`size-1.5 shrink-0 rounded-full ${color.dot} opacity-70 group-hover:opacity-100`}
                      />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-black dark:group-hover:text-white transition-colors leading-snug">
                        {item.name}
                      </span>
                      <svg
                        className="ml-auto size-3.5 text-neutral-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
