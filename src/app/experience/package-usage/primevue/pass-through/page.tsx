import CodeBlock from "@/components/CodeBlock";

const PT_BEFORE_CODE = `/* 版本升級後 DOM 結構一變就壞 */
:deep(.p-datatable-header) {
  background: #your-color;
}
:deep(.p-column-header-content) {
  font-weight: 800;
}
/* 選擇器越寫越長，難以維護 */`;

const PT_AFTER_CODE = `<DataTable
  :pt="{
    header: { class: 'bg-slate-800 text-white' },
    headerCell: { class: 'font-black text-sm uppercase' },
    bodyRow: ({ context }) => ({
      class: context.selected
        ? 'bg-blue-50'
        : 'hover:bg-stone-50'
    }),
  }"
>
  ...
</DataTable>`;

export default function PassThroughPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <header className="relative bg-gradient-to-br from-green-900 via-green-800 to-slate-900 text-white py-10 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)` }} />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
            <span className="text-sm font-medium tracking-wide">PrimeVue</span>
          </div>
          <h1 className="text-5xl font-black mb-4 tracking-tight">Pass Through</h1>
          <p className="text-xl text-green-200">精準注入 class 到每個內部 DOM 節點，解決深層 CSS 覆蓋的脆弱問題</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-white border-l-4 border-green-500 p-8 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold mb-3 text-slate-900">Pass Through — 完全掌控樣式</h3>
          <p className="text-stone-600 mb-6 leading-relaxed">
            PrimeVue 3 引入 Pass Through（PT）機制，可以對每個元件內部的 DOM 節點直接注入 class 或 attribute，解決過去只能靠深層 CSS 覆蓋的問題。
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-lg p-5 border-2 bg-stone-50 border-stone-200">
              <div className="text-sm font-bold mb-3 text-stone-500">過去：深層 CSS 覆蓋（脆弱）</div>
              <CodeBlock code={PT_BEFORE_CODE} language="css" />
              <div className="mt-3 text-sm font-medium text-red-600">✗ 升版後常因內部 class 改名而失效</div>
            </div>
            <div className="rounded-lg p-5 border-2 bg-green-50 border-green-400">
              <div className="text-sm font-bold mb-3 text-green-700">Pass Through：直接注入</div>
              <CodeBlock code={PT_AFTER_CODE} language="html" />
              <div className="mt-3 text-sm font-medium text-green-700">✓ 明確對應 DOM 節點，升版不會失效</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
