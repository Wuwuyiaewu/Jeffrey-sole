import CodeBlock from "@/components/CodeBlock";

export default function PrimeVueThemePage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <header className="relative bg-gradient-to-br from-violet-900 via-violet-800 to-slate-900 text-white py-10 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)` }} />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
            <span className="text-sm font-medium tracking-wide">PrimeVue</span>
          </div>
          <h1 className="text-5xl font-black mb-4 tracking-tight">主題客製化</h1>
          <p className="text-xl text-violet-200">Unstyled 模式 + 全域 Pass Through，完全掌控視覺風格</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-white border-l-4 border-violet-500 p-8 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold mb-3 text-slate-900">主題客製化</h3>
          <p className="text-stone-600 mb-6 leading-relaxed">
            PrimeVue 提供 Unstyled 模式，讓整個元件庫完全不帶預設樣式，搭配 Tailwind CSS 透過 Pass Through 全面掌控視覺呈現，品牌一致性最高。
          </p>
          <div className="space-y-4">
            {[
              {
                label: "啟用 Unstyled 模式",
                code: `// main.ts
import PrimeVue from 'primevue/config'

app.use(PrimeVue, {
  unstyled: true,
  // 不再載入任何 PrimeVue 預設 CSS
})`,
              },
              {
                label: "全域 PT 設定（統一風格）",
                code: `// 在 PrimeVue 設定中統一定義所有元件的 PT
app.use(PrimeVue, {
  unstyled: true,
  pt: {
    button: {
      root: { class: 'px-4 py-2 rounded-lg font-semibold transition-colors' },
    },
    inputtext: {
      root: { class: 'border border-stone-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500' },
    },
    datatable: {
      header: { class: 'bg-slate-800 text-white px-4 py-3' },
      headerCell: { class: 'text-sm font-semibold uppercase tracking-wide' },
    },
  },
})`,
              },
              {
                label: "局部覆蓋全域 PT",
                code: `<!-- 某個頁面需要不同風格時，局部覆蓋 -->
<DataTable
  :pt="{
    header: { class: 'bg-blue-700 text-white' },
  }"
>
  ...
</DataTable>`,
              },
            ].map((item, i) => (
              <div key={i} className="rounded-xl p-5 border-2 bg-stone-50 border-violet-500">
                <div className="text-sm font-bold mb-3 text-violet-700">{item.label}</div>
                <CodeBlock code={item.code} language="html" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
