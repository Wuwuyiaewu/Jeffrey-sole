import DemoSection from "./components/DemoSection";
import { SolutionSection, BenefitsSection } from "./components/ContentSections";
import { RequirementsSection } from "./components/RequirementsSection";
import TabsLayout from "@/components/TabsLayout";

const tabs = [
  { key: "requirements", label: "需求文件", element: <RequirementsSection /> },
  { key: "demo", label: "互動展示", element: <DemoSection /> },
  { key: "solution", label: "核心解法", element: <SolutionSection /> },
  { key: "benefits", label: "帶來幫助", element: <BenefitsSection /> },
];

export default function DynamicAttributesPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      {/* Header */}
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
          <div className="max-w-3xl">
            <h1 className="text-6xl font-black mb-6 tracking-tight">
              動態屬性設定{" "}
              <span className="text-4xl text-slate-400">Dynamic Attributes</span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              將 isRequired, isDisabled, isVisible 等狀態抽離為動態函式 (Function Reference)，讓屬性能依賴 Context (上下文情境) 即時算出結果。
            </p>
          </div>
        </div>
      </header>

      <TabsLayout tabs={tabs} />
    </main>
  );
}
