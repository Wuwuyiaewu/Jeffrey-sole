export default function BenefitsSection() {
  const benefits = [
    {
      icon: "📊",
      title: "掌握三種核心圖表的實際應用場景",
      description:
        "在真實的金融風險儀表板中，理解了甜甜圈圖（分佈比例）、水平長條圖（排名對比）、折線圖（趨勢追蹤）各自適合的資訊類型，而不只是看文件做 demo。",
      tags: ["實戰經驗", "圖表選型"],
    },
    {
      icon: "🎨",
      title: "CSS 變數驅動圖表主題色彩",
      description:
        "使用 getComputedStyle 讀取 CSS 自定義屬性（--low-risk-color 等）來設定圖表顏色，讓圖表顏色跟隨全站主題系統，支援 light/dark mode 切換，不硬編碼 hex 值。",
      tags: ["主題系統", "CSS 變數"],
    },
    {
      icon: "🔍",
      title: "發現並理解基礎用法的技術債",
      description:
        "識別出 /g flag 類似問題的 DOM 管理隱患：external tooltip 把節點掛在 document.body 造成記憶體洩漏、window.pageXOffset 廢棄 API 的使用、數字存為字串等問題。",
      tags: ["技術債識別", "Code Review"],
    },
    {
      icon: "📐",
      title: "CSS 偽元素替代 JS 定位",
      description:
        "四個甜甜圈圖需要各自的中心文字，用 ::before + BEM modifier class 切換不同文字，完全不需要 JS 計算 canvas 位置，元件保持無狀態、可獨立渲染。",
      tags: ["CSS 技巧", "無 JS 方案"],
    },
    {
      icon: "🔄",
      title: "理解 Chart.js vs PrimeVue 包裝的差異",
      description:
        "PrimeChart 的 :pt（Passthrough）API 讓我能控制底層 canvas 的 CSS 類別，但也明白了它只是薄薄的包裝層，所有的 data/options 結構仍然是 Chart.js 原生格式，遇到問題要查 Chart.js 文件而非 PrimeVue。",
      tags: ["技術理解", "封裝層知識"],
    },
    {
      icon: "📏",
      title: "理解 Chart.js responsive 的侷限，學習 ResizeObserver",
      description:
        "Chart.js 的 responsive: true 只監聽 window resize，對 Flexbox/Grid 動態容器無效。了解到 ResizeObserver 是正確解法，並在元件 onUnmounted 中 disconnect 防止洩漏。",
      tags: ["ResizeObserver", "響應式設計"],
    },
  ];

  const tagColors: Record<string, string> = {
    實戰經驗: "bg-blue-100 text-blue-700",
    圖表選型: "bg-sky-100 text-sky-700",
    主題系統: "bg-purple-100 text-purple-700",
    "CSS 變數": "bg-violet-100 text-violet-700",
    技術債識別: "bg-red-100 text-red-700",
    "Code Review": "bg-orange-100 text-orange-700",
    "CSS 技巧": "bg-emerald-100 text-emerald-700",
    "無 JS 方案": "bg-teal-100 text-teal-700",
    技術理解: "bg-indigo-100 text-indigo-700",
    封裝層知識: "bg-cyan-100 text-cyan-700",
    ResizeObserver: "bg-pink-100 text-pink-700",
    響應式設計: "bg-rose-100 text-rose-700",
  };

  return (
    <div className="space-y-10">
      <div className="bg-white rounded-xl border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">帶來的幫助</h2>
        <p className="text-slate-500 mb-8">
          在國泰金控風險總覽儀表板的開發過程中，從零到實作出可運作的圖表，
          再到識別改進空間，收穫了對 Chart.js 生態系更完整的認識。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-xl border border-slate-200 p-6 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl shrink-0">{b.icon}</span>
                <div>
                  <h3 className="font-bold text-slate-800 mb-2">{b.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-3">{b.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {b.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${tagColors[tag] ?? "bg-slate-100 text-slate-600"}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h3 className="font-bold text-slate-800">基礎用法 vs 最佳實踐</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-3 text-left font-semibold text-slate-600 w-1/3">面向</th>
                  <th className="px-6 py-3 text-left font-semibold text-red-600 w-1/3">原始做法</th>
                  <th className="px-6 py-3 text-left font-semibold text-emerald-600 w-1/3">改良做法</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  ["自定義 Tooltip", "手動建立 DOM，掛在 body", "Vue Teleport + reactive 狀態"],
                  ["容器 Resize", "只靠 window resize（失效）", "ResizeObserver + chart.resize()"],
                  ["資料更新", "onMounted 靜態初始化", "computed + TanStack Query"],
                  ["型別安全", "context: any", "ChartOptions<'doughnut'>"],
                  ["中心文字", "需要 JS 定位", "CSS ::before + BEM class"],
                  ["顏色主題", "—（已使用 CSS 變數）", "同上 + dark mode 自動支援"],
                ].map(([aspect, before, after]) => (
                  <tr key={aspect} className="hover:bg-slate-50/50">
                    <td className="px-6 py-3 font-medium text-slate-700">{aspect}</td>
                    <td className="px-6 py-3 text-slate-500">{before}</td>
                    <td className="px-6 py-3 text-slate-700">{after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
