import TabsLayout from "@/components/TabsLayout";
import OverviewSection from "./components/OverviewSection";
import ProblemsSection from "./components/ProblemsSection";
import BestPracticeSection from "./components/BestPracticeSection";
import BenefitsSection from "./components/BenefitsSection";

const tabs = [
  { key: "overview",      label: "技術概覽",    element: <OverviewSection /> },
  { key: "problems",      label: "基礎用法的侷限", element: <ProblemsSection /> },
  { key: "best-practice", label: "最佳實踐",    element: <BestPracticeSection /> },
  { key: "benefits",      label: "帶來幫助",    element: <BenefitsSection /> },
];

export default function EchartsPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <header className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-10 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)",
            }}
          />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
              <span className="text-sm font-medium tracking-wide">Data Visualization</span>
            </div>
            <h1 className="text-5xl font-black mb-6 tracking-tight">
              Chart.js{" "}
              <span className="text-3xl text-slate-400">via PrimeVue PrimeChart</span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed mb-6">
              在國泰金控風險總覽儀表板（Risk Overview Dashboard）中實作三種圖表類型——
              甜甜圈圖呈現客戶風險分佈、水平長條圖顯示評級落差排名、折線圖追蹤風險趨勢，
              並以 CSS 變數驅動圖表配色，支援全站主題系統。
            </p>
            <div className="flex flex-wrap gap-3">
              {["Chart.js", "PrimeVue PrimeChart", "Vue 3 Composition API", "CSS 變數主題", "ResizeObserver", "TypeScript"].map((tag) => (
                <span
                  key={tag}
                  className="bg-white/10 border border-white/20 px-3 py-1 rounded-full text-sm text-slate-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      <TabsLayout tabs={tabs} />
    </main>
  );
}
