import SolutionSection from "./components/SolutionSection";
import ProblemSection from "./components/ProblemSection";
import BenefitsSection from "./components/BenefitsSection";
import TabsLayout from "../../config-drive/components/TabsLayout";

const tabs = [
  {
    key: "solution",
    label: "設計想法",
    element: <SolutionSection />,
  },
  {
    key: "problem",
    label: "遇到的問題",
    element: <ProblemSection />,
  },
  {
    key: "benefits",
    label: "帶來幫助",
    element: <BenefitsSection />,
  },
];

export default function PdfPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-10 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`,
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
              <span className="text-sm font-medium tracking-wide">
                Utility Pattern · html2canvas + jsPDF
              </span>
            </div>
            <h1 className="text-6xl font-black mb-6 tracking-tight">
              DOM → PDF / Base64
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              將網頁畫面直接轉換為 PDF 或圖片，整合進業務流程
            </p>
          </div>
        </div>
      </header>

      <div className="tabs-container">
        <TabsLayout tabs={tabs} />
      </div>
    </main>
  );
}
