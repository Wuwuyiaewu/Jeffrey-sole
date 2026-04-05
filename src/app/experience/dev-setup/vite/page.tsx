const VITE_SECTIONS = [
  {
    step: 1,
    color: "blue",
    title: "為什麼選 Vite？",
    desc: "在加入 Vite 之前，專案使用 Webpack + Vue CLI，每次冷啟動需要等待完整的 bundle 編譯，開發體驗明顯受影響。",
    content: {
      type: "compare",
      left: {
        label: "Webpack 的問題",
        code: `# 冷啟動時間（中型專案）
npm run serve
→ 等待 15~40 秒

# 原因：先打包所有模組
entry → bundle all → dev server`,
        note: "每次改動都要等重新打包",
        bad: true,
      },
      right: {
        label: "Vite 的做法",
        code: `# Vite 冷啟動
npm run dev
→ 幾乎瞬間啟動

# 原因：原生 ESM，瀏覽器按需載入
dev server → 瀏覽器 request → 轉換單一模組`,
        note: "HMR 毫秒級更新，只處理變動的模組",
        bad: false,
      },
    },
  },
  {
    step: 2,
    color: "purple",
    title: "多環境打包設定",
    desc: "在雨林資料中心專案中，配置了 dev / sit / sit2 / uat / production 五層環境，每層對應不同的後端服務 URL 與功能開關。",
    content: {
      type: "steps",
      items: [
        {
          label: ".env 檔案結構",
          code: `.env.development      # 本地開發
.env.sit              # SIT 測試環境
.env.sit2             # SIT2 測試環境
.env.uat              # UAT 驗收環境
.env.production       # 正式環境`,
        },
        {
          label: "package.json build scripts",
          code: `"scripts": {
  "dev":        "vite --mode development",
  "build:sit":  "vite build --mode sit",
  "build:sit2": "vite build --mode sit2",
  "build:uat":  "vite build --mode uat",
  "build:prod": "vite build --mode production"
}`,
        },
        {
          label: ".env.sit 範例",
          code: `VITE_APP_ENV=sit
VITE_API_BASE_URL=https://api-sit.example.com
VITE_AUTH_URL=https://auth-sit.example.com
VITE_FEATURE_MOCK=false`,
        },
      ],
    },
  },
  {
    step: 3,
    color: "green",
    title: "unplugin-auto-import 自動引入",
    desc: "在 Vue 3 專案中，每個檔案手動 import ref、computed、onMounted 等 API 既繁瑣又容易遺漏。導入 unplugin-auto-import 後，這些全部自動處理。",
    content: {
      type: "compare",
      left: {
        label: "沒有 auto-import",
        code: `// 每個 .vue 都要手動寫
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'`,
        note: "每個檔案重複 import，容易遺漏",
        bad: true,
      },
      right: {
        label: "有 auto-import",
        code: `// vite.config.ts 設定一次
AutoImport({
  imports: ['vue', 'vue-router', 'pinia'],
  dts: 'src/auto-imports.d.ts'
})

// .vue 檔案直接使用，不用 import
const count = ref(0)
const router = useRouter()`,
        note: "自動生成 TypeScript 型別宣告，無需手動維護",
        bad: false,
      },
    },
  },
  {
    step: 4,
    color: "orange",
    title: "Vite SSG 靜態生成",
    desc: "履歷網站本身採用 Vite SSG（vite-ssg），在 build 時預先渲染所有路由為靜態 HTML，兼顧 SEO 與首屏速度，同時保留 Vue SPA 的互動能力。",
    content: {
      type: "steps",
      items: [
        {
          label: "一般 SPA vs SSG 差異",
          code: `# SPA (client-only)
請求 → 載入空 HTML → JS 執行 → 渲染內容
問題：爬蟲看不到內容、首屏白畫面

# SSG (vite-ssg)
build 時 → 預渲染每個路由為完整 HTML
請求 → 直接取得完整 HTML → JS hydration`,
        },
        {
          label: "main.ts 改動（只換一個函式）",
          code: `// 原本 SPA
import { createApp } from 'vue'
createApp(App).mount('#app')

// 改成 SSG
import { ViteSSG } from 'vite-ssg'
export const createApp = ViteSSG(App, { routes })`,
        },
      ],
    },
  },
];

import CodeBlock from "@/components/CodeBlock";

const colorMap: Record<string, { border: string; step: string; label: string; noteGood: string }> = {
  blue:   { border: "border-blue-500",   step: "bg-blue-500",   label: "text-blue-700",   noteGood: "text-blue-700" },
  purple: { border: "border-purple-500", step: "bg-purple-500", label: "text-purple-700", noteGood: "text-purple-700" },
  green:  { border: "border-green-500",  step: "bg-green-500",  label: "text-green-700",  noteGood: "text-green-700" },
  orange: { border: "border-orange-500", step: "bg-orange-500", label: "text-orange-700", noteGood: "text-orange-700" },
};

export default function VitePage() {
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
              <span className="text-sm font-medium tracking-wide">Dev Setup — Build Tool</span>
            </div>
            <h1 className="text-6xl font-black mb-6 tracking-tight">Vite</h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              多環境打包、Auto Import、SSG — 從實際專案中累積的設定經驗
            </p>
            <div className="flex justify-center gap-3 mt-6 flex-wrap">
              {["多環境打包", "unplugin-auto-import", "Vite SSG", "HMR"].map((tag) => (
                <span key={tag} className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-12">
        {VITE_SECTIONS.map((section) => {
          const c = colorMap[section.color];
          return (
            <div key={section.step} className={`bg-white border-l-4 ${c.border} p-8 rounded-lg shadow-sm`}>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">{section.title}</h3>
              <p className="text-stone-600 mb-6 leading-relaxed">{section.desc}</p>

              {section.content.type === "compare" && (
                <div className="grid md:grid-cols-2 gap-4">
                  {[section.content.left!, section.content.right!].map((side) => (
                    <div
                      key={side.label}
                      className={`rounded-lg p-5 border-2 ${side.bad ? "bg-stone-50 border-stone-200" : `bg-${section.color}-50 border-${section.color}-400`}`}
                    >
                      <div className={`text-sm font-bold mb-3 ${side.bad ? "text-stone-500" : c.label}`}>
                        {side.label}
                      </div>
                      <CodeBlock code={side.code} language="javascript" />
                      <div className={`mt-3 text-sm font-medium ${side.bad ? "text-red-600" : c.noteGood}`}>
                        {side.bad ? "✗ " : "✓ "}{side.note}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {section.content.type === "steps" && (
                <div className="space-y-4">
                  {section.content.items!.map((item, i) => (
                    <div key={i} className={`rounded-xl p-5 border-2 bg-${section.color}-50 border-${section.color}-200`}>
                      <div className={`text-sm font-bold mb-3 ${c.label}`}>{item.label}</div>
                      <CodeBlock code={item.code} language="javascript" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
