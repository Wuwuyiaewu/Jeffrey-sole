import Link from "next/link";

const PACKAGES = [
  {
    id: "element-plus",
    name: "Element Plus",
    color: "blue",
    tagline: "Vue 3 企業級 UI 元件庫",
    href: "/experience/package-usage/element-plus",
    items: [
      { name: "按需引入設定", desc: "unplugin-vue-components + unplugin-auto-import", href: "/experience/package-usage/element-plus#auto-import" },
      { name: "Form 表單驗證", desc: "rules 定義、跨欄位驗證、手動觸發", href: "/experience/package-usage/element-plus#form" },
      { name: "Table 複雜場景", desc: "固定列、操作欄插槽、動態欄位切換", href: "/experience/package-usage/element-plus#table" },
      { name: "主題客製化", desc: "SCSS 變數統一覆蓋品牌色", href: "/experience/package-usage/element-plus#theme" },
    ],
  },
  {
    id: "primevue",
    name: "PrimeVue",
    color: "violet",
    tagline: "高度可客製化的 Vue 3 UI 元件庫",
    href: "/experience/package-usage/primevue",
    items: [
      { name: "DataTable", desc: "虛擬滾動、行內編輯、欄位 resize", href: "/experience/package-usage/primevue#datatable" },
      { name: "Pass Through", desc: "精準注入 class 到每個內部 DOM 節點", href: "/experience/package-usage/primevue#pass-through" },
      { name: "Toast 通知系統", desc: "全域掛載 + useToast() composable", href: "/experience/package-usage/primevue#toast" },
      { name: "主題客製化", desc: "Unstyled 模式與 PT 全面控制樣式", href: "/experience/package-usage/primevue#theme" },
    ],
  },
];

const colorMap: Record<string, { border: string; badge: string; title: string; dot: string }> = {
  blue:   { border: "border-blue-500",   badge: "bg-blue-50 text-blue-700 border-blue-200",   title: "text-blue-700",   dot: "bg-blue-500" },
  violet: { border: "border-violet-500", badge: "bg-violet-50 text-violet-700 border-violet-200", title: "text-violet-700", dot: "bg-violet-500" },
};

export default function PackageUsagePage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <header className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-10 overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`,
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
              <span className="text-sm font-medium tracking-wide">Package Usage — UI Libraries</span>
            </div>
            <h1 className="text-5xl font-black mb-4 tracking-tight">套件使用經驗</h1>
            <p className="text-xl text-slate-300">
              企業專案中 Element Plus 與 PrimeVue 的實戰整合心得
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-14">
        {PACKAGES.map((pkg) => {
          const c = colorMap[pkg.color];
          return (
            <section key={pkg.id}>
              {/* Package title row */}
              <div className={`flex items-center justify-between mb-5 border-l-4 ${c.border} pl-4`}>
                <div>
                  <h2 className={`text-2xl font-bold ${c.title}`}>{pkg.name}</h2>
                  <p className="text-sm text-neutral-500 mt-0.5">{pkg.tagline}</p>
                </div>
                <Link
                  href={pkg.href}
                  className={`text-sm font-medium px-4 py-1.5 rounded-full border ${c.badge} hover:opacity-80 transition-opacity`}
                >
                  查看全部 →
                </Link>
              </div>

              {/* Sub-item cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pkg.items.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-start gap-3 p-5 bg-white rounded-xl border border-neutral-200 hover:border-current hover:bg-neutral-50 transition-all group"
                  >
                    <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${c.dot}`} />
                    <div className="min-w-0">
                      <div className={`font-semibold group-hover:${c.title} transition-colors`}>{item.name}</div>
                      <div className="text-sm text-neutral-500 mt-0.5">{item.desc}</div>
                    </div>
                    <svg
                      className="ml-auto flex-shrink-0 w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-neutral-400"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        {/* 選型比較 */}
        <section>
          <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6 text-slate-900">選型依據比較</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left p-3 font-semibold text-slate-700 rounded-tl-lg">面向</th>
                    <th className="text-left p-3 font-semibold text-blue-700">Element Plus</th>
                    <th className="text-left p-3 font-semibold text-violet-700 rounded-tr-lg">PrimeVue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {[
                    { aspect: "學習曲線",    ep: "低，文件清晰直觀",             pv: "中，PT 機制需要時間熟悉" },
                    { aspect: "Form 驗證",   ep: "內建 rules，開箱即用",         pv: "需搭配 vee-validate 等第三方" },
                    { aspect: "DataTable",   ep: "基本功能，複雜需求需手工",     pv: "原生支援虛擬滾動、行內編輯、resize" },
                    { aspect: "主題客製",    ep: "SCSS 變數覆蓋，統一管理",      pv: "Pass Through 精準控制每個節點" },
                    { aspect: "Bundle Size", ep: "按需引入後適中",               pv: "Unstyled 模式可極度精簡" },
                    { aspect: "適用場景",    ep: "標準表單、後台管理系統",       pv: "複雜資料表格、高客製化需求" },
                  ].map((row) => (
                    <tr key={row.aspect} className="hover:bg-stone-50">
                      <td className="p-3 font-medium text-slate-700">{row.aspect}</td>
                      <td className="p-3 text-slate-600">{row.ep}</td>
                      <td className="p-3 text-slate-600">{row.pv}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
