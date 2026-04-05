import { Suspense } from "react";
import TabsLayout from "@/components/TabsLayout";
import ProblemSection from "./components/ProblemSection";
import SolutionSection from "./components/SolutionSection";
import BestPracticeSection from "./components/BestPracticeSection";
import BenefitsSection from "./components/BenefitsSection";

const tabs = [
  { key: "problem",       label: "遇到的問題",  element: <ProblemSection /> },
  { key: "solution",      label: "設計想法",    element: <SolutionSection /> },
  { key: "best-practice", label: "最佳實踐",    element: <BestPracticeSection /> },
  { key: "benefits",      label: "帶來幫助",    element: <BenefitsSection /> },
];

export default function ValidatePage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <header className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-10 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
              <span className="text-sm font-medium tracking-wide">Form Validation</span>
            </div>
            <h1 className="text-5xl font-black mb-6 tracking-tight">
              VeeValidate + Yup{" "}
              <span className="text-3xl text-slate-400">表單驗證</span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed mb-6">
              在電商後台多平台商品上架系統中，設計可組合的 Schema Service 層——
              從發現 regex <code className="text-slate-400 text-lg">/g</code> flag 隱患、巢狀 Schema 重複定義，
              到建立 Base → Required → Platform 三層繼承架構。
            </p>
            <div className="flex flex-wrap gap-3">
              {["VeeValidate", "Yup", "Schema Composition", "TypeScript InferType", "Cross-field Validation"].map((tag) => (
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

      <Suspense>
        <TabsLayout tabs={tabs} />
      </Suspense>
    </main>
  );
}
