import CodeBlock from "@/components/CodeBlock";

export default function AutoImportPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <header className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white py-10 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)` }} />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
            <span className="text-sm font-medium tracking-wide">Element Plus</span>
          </div>
          <h1 className="text-5xl font-black mb-4 tracking-tight">按需引入設定</h1>
          <p className="text-xl text-blue-200">unplugin-vue-components + unplugin-auto-import</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-10">
        <div className="bg-white border-l-4 border-blue-500 p-8 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold mb-3 text-slate-900">全量引入 vs 按需引入</h3>
          <p className="text-stone-600 mb-6 leading-relaxed">
            初期直接全量引入 Element Plus，打包體積過大。改用 unplugin-vue-components + unplugin-auto-import 後，只有實際使用的元件才會被打包進去。
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-lg p-5 border-2 bg-stone-50 border-stone-200">
              <div className="text-sm font-bold mb-3 text-stone-500">全量引入（早期做法）</div>
              <CodeBlock code={`// main.ts
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

app.use(ElementPlus)

// 問題：整包引入，bundle 增加約 700KB+`} language="typescript" />
              <div className="mt-3 text-sm font-medium text-red-600">✗ 首屏體積過大，頁面載入明顯變慢</div>
            </div>
            <div className="rounded-lg p-5 border-2 bg-blue-50 border-blue-400">
              <div className="text-sm font-bold mb-3 text-blue-700">按需引入（正式做法）</div>
              <CodeBlock code={`// vite.config.ts
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

plugins: [
  AutoImport({ resolvers: [ElementPlusResolver()] }),
  Components({ resolvers: [ElementPlusResolver()] }),
]`} language="typescript" />
              <div className="mt-3 text-sm font-medium text-blue-700">✓ 只打包用到的元件，bundle 大幅縮小</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
