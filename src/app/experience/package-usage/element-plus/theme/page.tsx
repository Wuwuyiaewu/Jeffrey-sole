import CodeBlock from "@/components/CodeBlock";

export default function ElementPlusThemePage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <header className="relative bg-gradient-to-br from-orange-900 via-orange-800 to-slate-900 text-white py-10 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)` }} />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
            <span className="text-sm font-medium tracking-wide">Element Plus</span>
          </div>
          <h1 className="text-5xl font-black mb-4 tracking-tight">主題客製化</h1>
          <p className="text-xl text-orange-200">SCSS 變數統一覆蓋，一處修改全元件套用品牌色</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-10">
        <div className="bg-white border-l-4 border-orange-500 p-8 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold mb-3 text-slate-900">主題客製化</h3>
          <p className="text-stone-600 mb-6 leading-relaxed">
            專案品牌色需要覆蓋 Element Plus 預設的藍色系。透過 SCSS 變數覆蓋機制，統一修改主色調，無需對每個元件單獨處理。
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-lg p-5 border-2 bg-stone-50 border-stone-200">
              <div className="text-sm font-bold mb-3 text-stone-500">手動對每個元件加 class（錯誤做法）</div>
              <CodeBlock code={`/* 每個元件都要個別覆蓋，很難維護 */
.el-button--primary {
  --el-button-bg-color: #your-color;
}
.el-tag--primary { ... }
.el-checkbox__input.is-checked { ... }
/* 覆蓋幾十個元件... */`} language="css" />
              <div className="mt-3 text-sm font-medium text-red-600">✗ 漏改某個元件、升版後常出問題</div>
            </div>
            <div className="rounded-lg p-5 border-2 bg-orange-50 border-orange-400">
              <div className="text-sm font-bold mb-3 text-orange-700">SCSS 變數統一覆蓋</div>
              <CodeBlock code={`// styles/element-plus.scss
@forward 'element-plus/theme-chalk/src/common/var.scss' with (
  $colors: (
    'primary': (
      'base': #your-brand-color,
    ),
  )
);

// vite.config.ts
css: {
  preprocessorOptions: {
    scss: {
      additionalData: \`@use "@/styles/element-plus.scss" as *;\`
    }
  }
}`} language="css" />
              <div className="mt-3 text-sm font-medium text-orange-700">✓ 一處修改，所有元件自動套用品牌色</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
