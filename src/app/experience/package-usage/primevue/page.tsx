import Link from "next/link";

const ITEMS = [
  {
    step: 1,
    name: "DataTable",
    desc: "虛擬滾動、多選、欄位 resize、行內編輯 — 開箱即用的進階表格功能",
    href: "/experience/package-usage/primevue/datatable",
    color: "violet",
  },
  {
    step: 2,
    name: "Pass Through",
    desc: "精準注入 class 到每個內部 DOM 節點，解決深層 CSS 覆蓋的脆弱問題",
    href: "/experience/package-usage/primevue/pass-through",
    color: "green",
  },
  {
    step: 3,
    name: "Toast 通知系統",
    desc: "全域掛載一次，useToast() composable 在任何元件直接呼叫",
    href: "/experience/package-usage/primevue/toast",
    color: "orange",
  },
  {
    step: 4,
    name: "主題客製化",
    desc: "Unstyled 模式 + 全域 Pass Through，完全掌控視覺風格",
    href: "/experience/package-usage/primevue/theme",
    color: "violet",
  },
];

const stepColor: Record<string, string> = {
  violet: "bg-violet-500",
  green:  "bg-green-500",
  orange: "bg-orange-500",
};

const hoverBorder: Record<string, string> = {
  violet: "hover:border-violet-500",
  green:  "hover:border-green-500",
  orange: "hover:border-orange-500",
};

const hoverText: Record<string, string> = {
  violet: "group-hover:text-violet-600",
  green:  "group-hover:text-green-600",
  orange: "group-hover:text-orange-600",
};

export default function PrimeVueIndexPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <header className="relative bg-gradient-to-br from-violet-900 via-violet-800 to-slate-900 text-white py-10 overflow-hidden">
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
            <h1 className="text-6xl font-black mb-4 tracking-tight">PrimeVue</h1>
            <p className="text-xl text-violet-200">高度可客製化的 Vue 3 UI 元件庫 — 實戰整合心得</p>
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
