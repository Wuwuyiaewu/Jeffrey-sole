import Link from "next/link";

const ITEMS = [
  {
    step: 1,
    name: "按需引入設定",
    desc: "unplugin-vue-components + unplugin-auto-import，大幅縮小 bundle 體積",
    href: "/experience/package-usage/element-plus/auto-import",
    color: "blue",
  },
  {
    step: 2,
    name: "Form 表單驗證",
    desc: "rules 定義、自訂驗證器、跨欄位比對、手動觸發與重置",
    href: "/experience/package-usage/element-plus/form",
    color: "purple",
  },
  {
    step: 3,
    name: "Table 複雜場景",
    desc: "固定列、操作欄插槽、動態欄位顯示切換",
    href: "/experience/package-usage/element-plus/table",
    color: "green",
  },
  {
    step: 4,
    name: "主題客製化",
    desc: "SCSS 變數統一覆蓋，一處修改全元件套用品牌色",
    href: "/experience/package-usage/element-plus/theme",
    color: "orange",
  },
];

const stepColor: Record<string, string> = {
  blue:   "bg-blue-500",
  purple: "bg-purple-500",
  green:  "bg-green-500",
  orange: "bg-orange-500",
};

const hoverBorder: Record<string, string> = {
  blue:   "hover:border-blue-500",
  purple: "hover:border-purple-500",
  green:  "hover:border-green-500",
  orange: "hover:border-orange-500",
};

const hoverText: Record<string, string> = {
  blue:   "group-hover:text-blue-600",
  purple: "group-hover:text-purple-600",
  green:  "group-hover:text-green-600",
  orange: "group-hover:text-orange-600",
};

export default function ElementPlusIndexPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <header className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white py-10 overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`,
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
              <span className="text-sm font-medium tracking-wide">Package Usage — Vue 3 UI Library</span>
            </div>
            <h1 className="text-6xl font-black mb-4 tracking-tight">Element Plus</h1>
            <p className="text-xl text-blue-200">Vue 3 企業級 UI 元件庫 — 實戰整合心得</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ITEMS.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-start gap-4 p-6 bg-white rounded-xl border border-neutral-200 ${hoverBorder[item.color]} hover:shadow-md transition-all`}
            >
              <div className={`flex-shrink-0 w-10 h-10 ${stepColor[item.color]} text-white rounded-full flex items-center justify-center font-bold text-lg`}>
                {item.step}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className={`font-semibold text-lg mb-1 transition-colors ${hoverText[item.color]}`}>
                  {item.name}
                </h2>
                <p className="text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
              </div>
              <svg
                className="flex-shrink-0 w-4 h-4 mt-1 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-neutral-400"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
