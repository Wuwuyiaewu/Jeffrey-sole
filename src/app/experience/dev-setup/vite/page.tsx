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
    step: 3,
    color: "teal",
    title: "打包效能優化",
    desc: "透過手動分包、視覺化分析與資源內聯三項策略，顯著縮短生產環境的載入時間，並讓瀏覽器快取得以充分發揮效用。",
    content: {
      type: "steps",
      items: [
        {
          label: "Manual Chunks — 獨立打包大型套件",
          code: `// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor-ui':  ['element-plus'],
        'vendor-pdf': ['jspdf', 'jspdf-autotable'],
        'vendor-vue': ['vue', 'vue-router', 'pinia'],
      },
    },
  },
},
// 效果：主 chunk 大小從 1.2MB → 180KB
// 套件單獨快取，版本不變時瀏覽器直接命中`,
        },
        {
          label: "Rollup Visualizer — 視覺化找出冗餘代碼",
          code: `import { visualizer } from 'rollup-plugin-visualizer'

plugins: [
  visualizer({
    open:     true,       // build 後自動開啟報告
    filename: 'dist/stats.html',
    gzipSize: true,       // 顯示 gzip 後大小
    brotliSize: true,
  }),
]
// → 生成互動式 treemap，一眼看出哪個套件最肥`,
        },
        {
          label: "靜態資源優化 — Base64 內聯小圖示",
          code: `build: {
  assetsInlineLimit: 4096,  // < 4KB 的資源轉為 Base64
},
// 效果：小 icon / loading gif 不再發額外 HTTP 請求
// 超過 4KB 的圖片仍輸出為獨立檔案並帶 content hash`,
        },
      ],
    },
  },
  {
    step: 4,
    color: "sky",
    title: "CI/CD 自動化部署",
    desc: "配置 GitHub Actions 在每次 push 後自動觸發對應環境的 build，並部署至 GitHub Pages 或 Vercel，同時正確處理非根目錄的 Base URL 問題。",
    content: {
      type: "steps",
      items: [
        {
          label: "GitHub Actions Workflow",
          code: `# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run build:prod
        env:
          VITE_API_BASE_URL: \${{ secrets.PROD_API_URL }}
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist`,
        },
        {
          label: "Base URL 設定 — 非根目錄部署",
          code: `// vite.config.ts
export default defineConfig({
  // GitHub Pages: https://user.github.io/repo-name/
  base: process.env.NODE_ENV === 'production'
    ? '/repo-name/'
    : '/',
  // 或從環境變數讀取，更靈活：
  // base: process.env.VITE_BASE_URL ?? '/',
})

// 路由也要對應調整
createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})`,
        },
        {
          label: "注入 Git Hash — 線上版本追蹤",
          code: `// vite.config.ts
import { loadEnv } from 'vite'
import { execSync } from 'child_process'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const gitHash = execSync('git rev-parse --short HEAD')
                    .toString().trim()

  return {
    define: {
      __APP_VERSION__: JSON.stringify(env.npm_package_version),
      __GIT_HASH__:    JSON.stringify(gitHash),
      __BUILD_TIME__:  JSON.stringify(new Date().toISOString()),
    },
  }
})
// 頁面 footer 顯示：v1.2.0 (a3f9c12 · 2024-03-15)
// 使用者回報問題時可立即對應到具體 commit`,
        },
      ],
    },
  },
];

import CodeBlock from "@/components/CodeBlock";

const colorMap: Record<
  string,
  {
    accent: string;
    badge: string;
    label: string;
    noteGood: string;
    sideGood: string;
    stepBg: string;
  }
> = {
  blue: {
    accent: "border-t-blue-500",
    badge: "bg-blue-100 text-blue-700",
    label: "text-blue-700",
    noteGood: "text-blue-700",
    sideGood: "bg-blue-50 border-blue-300",
    stepBg: "bg-blue-500",
  },
  green: {
    accent: "border-t-green-500",
    badge: "bg-green-100 text-green-700",
    label: "text-green-700",
    noteGood: "text-green-700",
    sideGood: "bg-green-50 border-green-300",
    stepBg: "bg-green-500",
  },
  teal: {
    accent: "border-t-teal-500",
    badge: "bg-teal-100 text-teal-700",
    label: "text-teal-700",
    noteGood: "text-teal-700",
    sideGood: "bg-teal-50 border-teal-300",
    stepBg: "bg-teal-500",
  },
  sky: {
    accent: "border-t-sky-500",
    badge: "bg-sky-100 text-sky-700",
    label: "text-sky-700",
    noteGood: "text-sky-700",
    sideGood: "bg-sky-50 border-sky-300",
    stepBg: "bg-sky-500",
  },
};

export default function VitePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="relative bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 text-white py-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-white/25">
              <span className="w-2 h-2 rounded-full bg-sky-300" />
              <span className="text-sm font-medium tracking-wide text-sky-100">
                Dev Setup — Build Tool
              </span>
            </div>
            <h1 className="text-7xl font-black mb-6 tracking-tight drop-shadow-lg">
              Vite
            </h1>
            <p className="text-xl text-sky-100 leading-relaxed max-w-2xl mx-auto">
              Auto Import、打包效能優化、CI/CD — 從實際專案中累積的設定經驗
            </p>
            <div className="flex justify-center gap-2 mt-8 flex-wrap">
              {[
                "unplugin-auto-import",
                "HMR",
                "Manual Chunks",
                "CI/CD",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-white/15 border border-white/25 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-16 space-y-8">
        {VITE_SECTIONS.map((section) => {
          const c = colorMap[section.color];
          return (
            <div
              key={section.step}
              className={`bg-white rounded-2xl shadow-md border-t-4 ${c.accent} overflow-hidden`}
            >
              <div className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                      {section.title}
                    </h3>
                    <p className="text-slate-500 mt-2 leading-relaxed">
                      {section.desc}
                    </p>
                  </div>
                </div>

                {section.content.type === "compare" && (
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    {[section.content.left!, section.content.right!].map(
                      (side) => (
                        <div
                          key={side.label}
                          className={`rounded-xl p-5 border-2 ${side.bad ? "bg-slate-50 border-slate-200" : c.sideGood}`}
                        >
                          <div
                            className={`text-xs font-bold mb-3 uppercase tracking-wider ${side.bad ? "text-slate-400" : c.label}`}
                          >
                            {side.label}
                          </div>
                          <CodeBlock code={side.code} language="javascript" />
                          <div
                            className={`mt-3 text-sm font-semibold flex items-center gap-1.5 ${side.bad ? "text-red-500" : c.noteGood}`}
                          >
                            <span>{side.bad ? "✗" : "✓"}</span>
                            <span>{side.note}</span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}

                {section.content.type === "steps" && (
                  <div className="space-y-3 mt-6">
                    {section.content.items!.map((item, i) => (
                      <div
                        key={i}
                        className={`rounded-xl p-5 border-2 ${c.sideGood}`}
                      >
                        <div
                          className={`text-xs font-bold mb-3 uppercase tracking-wider ${c.label}`}
                        >
                          {item.label}
                        </div>
                        <CodeBlock code={item.code} language="javascript" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
