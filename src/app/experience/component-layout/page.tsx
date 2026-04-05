import "server-only";
import GridBuilderWrapper from "./_components/GridBuilderWrapper";
import { FieldConfig } from "./_types";
import ConfigSection from "./_components/ConfigSection";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Page() {
  const initialLayout: FieldConfig[] = []; // 或預設值
  return (
    <main className="min-h-screen bg-stone-50 pb-20">
      {/* Header */}
      <header className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 text-white py-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`,
            }}
          />
        </div>

        <div className="container mx-auto px-6 relative z-10 max-w-6xl">
          <Link
            href="/experience"
            className="inline-flex items-center text-indigo-200 hover:text-white mb-8 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回列表
          </Link>
          <div className="max-w-4xl">
            <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
              <span className="text-sm font-medium tracking-wide">
                Advanced Grid Layout
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              Config-Driven Grid System
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 mb-8 leading-relaxed max-w-3xl">
              這是 Config-Drive 思想的延伸應用。我們不只把「內容」放到 Config 中，更進一步把「佈局 (Layout)」抽象化。
              <br className="hidden md:block" />
              如此一來，即可透過設定檔（JSON/Schema）動態決定網格的欄數、跨欄與排列順序，無需手寫 HTML 結構。
            </p>
            <div className="flex gap-4 flex-wrap">
              <div className="bg-white/5 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/10">
                <span className="text-indigo-200 text-sm block mb-1">適合場景</span>
                <span className="font-semibold text-white">動態儀表板、客製化表單</span>
              </div>
              <div className="bg-white/5 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/10">
                <span className="text-indigo-200 text-sm block mb-1">核心優勢</span>
                <span className="font-semibold text-white">佈局邏輯與元件完全解耦</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Demo Section */}
      <div className="p-8 max-w-7xl mx-auto mt-8 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-8 border-b border-gray-100 pb-6">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">互動展示：動態網格編輯器</h2>
          <p className="text-gray-500">
            在下方體驗如何只改動右側的設置，就能動態產生複雜的版面配置，甚至支援拖曳排序。
          </p>
        </div>
        <ConfigSection />
        <GridBuilderWrapper initialLayout={initialLayout} />
      </div>
    </main>
  );
}
