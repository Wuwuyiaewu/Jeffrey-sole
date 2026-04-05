const SECTIONS = [
  {
    id: "why",
    step: 1,
    color: "blue",
    title: "為什麼選 Tailwind CSS？",
    desc: "傳統 CSS 或 SCSS 在多人協作時，常見到 class 命名衝突、樣式覆蓋不知源頭、dead CSS 越積越多的問題。Tailwind 的 utility-first 方式讓樣式直接在 template 上表達，消除這些痛點。",
    content: {
      type: "compare",
      left: {
        label: "傳統 CSS 的問題",
        code: `/* 多人協作後的 CSS */
.card { ... }
.card-new { ... }        /* 別人新增的，不敢刪 */
.card-v2 { ... }         /* 重構後的，也不敢刪 */
.card-fix { ... }        /* 修 bug 加的 */

/* 哪個還在用？哪個可以刪？
   沒人知道，於是都留著 */`,
        note: "dead CSS 越積越多，樣式追蹤困難",
        bad: true,
      },
      right: {
        label: "Tailwind utility-first",
        code: `<!-- 樣式直接在 template 上，不需要額外 CSS 檔 -->
<div class="flex items-center gap-4 p-6 bg-white rounded-xl
            border border-neutral-200 hover:border-blue-500
            hover:shadow-md transition-all">
  ...
</div>

<!-- 刪掉 template 等於刪掉樣式，
     不會留下任何 dead CSS -->`,
        note: "樣式與結構共存，不用切換檔案",
        bad: false,
      },
    },
  },
  {
    id: "config",
    step: 2,
    color: "purple",
    title: "tailwind.config.js 設定",
    desc: "在雨林新零售與台達電子採購平台專案中，Tailwind 設定主要做三件事：限定掃描範圍、擴展品牌色系、設定自訂間距與字體。",
    content: {
      type: "steps",
      items: [
        {
          label: "tailwind.config.js",
          code: `/** @type {import('tailwindcss').Config} */
export default {
  // 只掃描這些路徑，build 時 purge 未使用的 class
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      // 品牌色系
      colors: {
        brand: {
          50:  '#f0f9ff',
          500: '#0ea5e9',
          900: '#0c4a6e',
        },
      },
      // 自訂字體
      fontFamily: {
        sans: ['Inter', 'Noto Sans TC', 'sans-serif'],
      },
      // 自訂陰影
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.08)',
      },
    },
  },

  plugins: [],
}`,
        },
      ],
    },
  },
  {
    id: "dark-mode",
    step: 3,
    color: "green",
    title: "Dark Mode 設定",
    desc: "Tailwind 支援 class-based 與 media-based 兩種 dark mode 策略。在有主題切換需求的後台系統中，選擇 class 策略，由 JavaScript 控制 html 上的 dark class，讓使用者能手動切換。",
    content: {
      type: "compare",
      left: {
        label: "media 策略（跟隨系統）",
        code: `// tailwind.config.js
export default {
  darkMode: 'media',  // 預設
}

// 跟隨 prefers-color-scheme
// 優點：零 JS，自動處理
// 缺點：使用者無法手動切換`,
        note: "無法提供手動切換功能",
        bad: true,
      },
      right: {
        label: "class 策略（手動控制）",
        code: `// tailwind.config.js
export default {
  darkMode: 'class',
}

// composable：useColorMode.ts
export function useColorMode() {
  const isDark = ref(
    localStorage.getItem('theme') === 'dark'
  )

  function toggle() {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  return { isDark, toggle }
}

// template 使用
<div class="bg-white dark:bg-slate-900 text-black dark:text-white">`,
        note: "使用者可手動切換並持久化偏好",
        bad: false,
      },
    },
  },
  {
    id: "component-pattern",
    step: 4,
    color: "orange",
    title: "元件樣式拆分策略",
    desc: "Tailwind class 很長，直接寫在 template 有時影響可讀性。在複雜元件中採用「拆出 class 物件」的模式，保持 template 乾淨，同時不失去 Tailwind 的可追蹤性。",
    content: {
      type: "compare",
      left: {
        label: "全部塞在 template（可讀性差）",
        code: `<button
  class="inline-flex items-center justify-center px-4 py-2
         text-sm font-semibold rounded-lg border-2 border-blue-500
         bg-blue-500 text-white hover:bg-blue-600
         hover:border-blue-600 active:scale-95
         disabled:opacity-50 disabled:cursor-not-allowed
         transition-all duration-150"
>
  送出
</button>`,
        note: "class 字串太長，難以 review",
        bad: true,
      },
      right: {
        label: "拆出 class 物件",
        code: `// 在 <script setup> 中定義
const btnClass = {
  base: 'inline-flex items-center justify-center px-4 py-2 rounded-lg',
  size: 'text-sm font-semibold',
  color: 'bg-blue-500 text-white border-2 border-blue-500',
  hover: 'hover:bg-blue-600 hover:border-blue-600',
  active: 'active:scale-95',
  disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
  animation: 'transition-all duration-150',
}

// template 合併
<button :class="Object.values(btnClass)">
  送出
</button>`,
        note: "分類清晰，易於局部修改",
        bad: false,
      },
    },
  },
  {
    id: "with-element-plus",
    step: 5,
    color: "blue",
    title: "與 Element Plus 並用",
    desc: "在採購平台中，Tailwind 負責頁面版型與自訂元件，Element Plus 負責表單、表格等複雜互動元件。兩者並用時需要處理 CSS Reset 衝突。",
    content: {
      type: "steps",
      items: [
        {
          label: "關閉 Tailwind Preflight（避免覆蓋 Element Plus）",
          code: `// tailwind.config.js
export default {
  corePlugins: {
    // 關閉 Tailwind 的 CSS Reset
    // 避免覆蓋 Element Plus 的基礎樣式
    preflight: false,
  },
}`,
        },
        {
          label: "CSS 載入順序",
          code: `// main.ts — Element Plus CSS 後載入，確保優先級
import 'element-plus/dist/index.css'
import '@/styles/tailwind.css'  // Tailwind utilities

// 或在 tailwind.css 中
@tailwind base;       /* 已關閉 preflight，這層等於空的 */
@tailwind components;
@tailwind utilities;  /* utilities 仍然有效 */`,
        },
      ],
    },
  },
];

import CodeBlock from "@/components/CodeBlock";

const colorMap: Record<string, { border: string; step: string; label: string; noteGood: string; sideGood: string }> = {
  blue:   { border: "border-blue-500",   step: "bg-blue-500",   label: "text-blue-700",   noteGood: "text-blue-700",   sideGood: "bg-blue-50 border-blue-400" },
  purple: { border: "border-purple-500", step: "bg-purple-500", label: "text-purple-700", noteGood: "text-purple-700", sideGood: "bg-purple-50 border-purple-400" },
  green:  { border: "border-green-500",  step: "bg-green-500",  label: "text-green-700",  noteGood: "text-green-700",  sideGood: "bg-green-50 border-green-400" },
  orange: { border: "border-orange-500", step: "bg-orange-500", label: "text-orange-700", noteGood: "text-orange-700", sideGood: "bg-orange-50 border-orange-400" },
};

export default function TailwindPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <header className="relative bg-gradient-to-br from-cyan-900 via-cyan-800 to-slate-900 text-white py-10 overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`,
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
              <span className="text-sm font-medium tracking-wide">Dev Setup — CSS Framework</span>
            </div>
            <h1 className="text-6xl font-black mb-6 tracking-tight">Tailwind CSS</h1>
            <p className="text-xl text-cyan-200 leading-relaxed">
              Utility-first、Dark Mode、與 Element Plus 並用 — 消除 dead CSS，樣式與結構共存
            </p>
            <div className="flex justify-center gap-3 mt-6 flex-wrap">
              {["Utility-first", "Dark Mode", "tailwind.config", "與 Element Plus 並用"].map((tag) => (
                <span key={tag} className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-10">
        {SECTIONS.map((section) => {
          const c = colorMap[section.color];
          return (
            <div
              id={section.id}
              key={section.step}
              className={`bg-white border-l-4 ${c.border} p-8 rounded-lg shadow-sm scroll-mt-8`}
            >
              <h3 className="text-2xl font-bold mb-3 text-slate-900">{section.title}</h3>
              <p className="text-stone-600 mb-6 leading-relaxed">{section.desc}</p>

              {section.content.type === "compare" && (
                <div className="grid md:grid-cols-2 gap-4">
                  {[section.content.left!, section.content.right!].map((side) => (
                    <div
                      key={side.label}
                      className={`rounded-lg p-5 border-2 ${side.bad ? "bg-stone-50 border-stone-200" : c.sideGood}`}
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
                    <div key={i} className={`rounded-xl p-5 border-2 bg-stone-50 ${c.border}`}>
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
