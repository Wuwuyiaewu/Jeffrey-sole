const SECTIONS = [
  {
    id: "why",
    step: 1,
    color: "blue",
    title: "為什麼用 ESLint？",
    desc: "團隊協作時，不同人的 coding style 差異大，容易在 code review 時花時間在格式爭議上。導入 ESLint 後，規則由工具強制執行，review 可以專注在邏輯本身。",
    content: {
      type: "compare",
      left: {
        label: "沒有 ESLint 的問題",
        code: `// 有人這樣寫
const x = condition ? a : b

// 有人這樣寫
if (condition) {
  x = a
} else {
  x = b
}

// 有人漏掉 await
async function fetchData() {
  const data = api.get('/users')  // 忘記 await！
}`,
        note: "風格不統一、潛在 bug 難被察覺",
        bad: true,
      },
      right: {
        label: "有 ESLint 的效果",
        code: `// eslint 直接在 IDE 標記錯誤
// no-floating-promises：偵測遺漏的 await
// vue/no-unused-vars：偵測未使用的變數
// @typescript-eslint/no-explicit-any：禁用 any

// 存檔時自動修正可修復的問題
// CI pipeline 中跑 eslint --max-warnings 0
// 確保 PR 不帶任何警告合入`,
        note: "工具強制，不用靠人工 review 風格",
        bad: false,
      },
    },
  },
  {
    id: "flat-config",
    step: 2,
    color: "purple",
    title: "Flat Config 設定（ESLint v9）",
    desc: "ESLint v9 引入 Flat Config，取代舊的 .eslintrc。設定更直覺，可以用 JS 模組語法組合多個規則集，不再依賴 extends 字串。",
    content: {
      type: "compare",
      left: {
        label: "舊格式（.eslintrc.js）",
        code: `// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/typescript/recommended',
  ],
  rules: {
    'vue/multi-word-component-names': 'off',
  },
}`,
        note: "extends 字串難追蹤來源，override 複雜",
        bad: true,
      },
      right: {
        label: "新格式（eslint.config.js）",
        code: `// eslint.config.js
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...tseslint.configs.recommended,
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
]`,
        note: "JS 模組語法，來源清晰，IDE 有完整提示",
        bad: false,
      },
    },
  },
  {
    id: "vue-rules",
    step: 3,
    color: "green",
    title: "Vue 3 + TypeScript 常用規則",
    desc: "在台達電子採購平台與雨林新零售專案中，整理出一套適合 Vue 3 + TypeScript 的規則組合，減少常見錯誤。",
    content: {
      type: "steps",
      items: [
        {
          label: "Vue 規則",
          code: `{
  rules: {
    // 元件命名：強制 multi-word（避免與 HTML 衝突）
    'vue/multi-word-component-names': 'error',

    // props 使用 defineProps with TypeScript
    'vue/define-props-declaration': ['error', 'type-based'],

    // emit 必須宣告
    'vue/define-emits-declaration': ['error', 'type-based'],

    // 禁止 v-html（XSS 風險）
    'vue/no-v-html': 'warn',

    // script setup 必須有 name（方便 devtools 追蹤）
    'vue/component-definition-name-casing': ['error', 'PascalCase'],
  }
}`,
        },
        {
          label: "TypeScript 規則",
          code: `{
  rules: {
    // 禁止 any（強制明確型別）
    '@typescript-eslint/no-explicit-any': 'warn',

    // 非同步函式的 Promise 必須被處理
    '@typescript-eslint/no-floating-promises': 'error',

    // 禁止不必要的型別斷言
    '@typescript-eslint/no-unnecessary-type-assertion': 'warn',

    // interface 優先（可擴展）
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
  }
}`,
        },
      ],
    },
  },
  {
    id: "ignore",
    step: 4,
    color: "orange",
    title: "忽略規則 vs 關閉規則",
    desc: "有些情況確實需要繞過規則，但要有清楚的紀錄。使用行內 disable comment 並附上原因，避免養成隨意關閉規則的習慣。",
    content: {
      type: "steps",
      items: [
        {
          label: "正確做法：行內 disable 附原因",
          code: `// 單行忽略（必須附原因）
const result = unsafeOperation() // eslint-disable-line @typescript-eslint/no-explicit-any -- 第三方 SDK 無型別

// 區塊忽略（必須附原因）
/* eslint-disable vue/no-v-html -- 後端回傳已消毒的 HTML 內容 */
<div v-html="sanitizedContent" />
/* eslint-enable vue/no-v-html */`,
        },
        {
          label: "在 eslint.config.js 針對特定目錄放寬",
          code: `// 測試檔案可以放寬部分規則
{
  files: ['**/*.test.ts', '**/*.spec.ts'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/multi-word-component-names': 'off',
  },
},

// 自動生成的程式碼直接排除
{
  ignores: ['src/auto-imports.d.ts', 'src/components.d.ts'],
},`,
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

export default function ESLintPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <header className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white py-10 overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`,
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
              <span className="text-sm font-medium tracking-wide">Environment Setup — Code Quality</span>
            </div>
            <h1 className="text-6xl font-black mb-6 tracking-tight">ESLint</h1>
            <p className="text-xl text-indigo-200 leading-relaxed">
              Flat Config、Vue 3 + TypeScript 規則整合 — 讓工具代替人工 review 風格
            </p>
            <div className="flex justify-center gap-3 mt-6 flex-wrap">
              {["Flat Config", "Vue 3", "TypeScript", "CI 整合"].map((tag) => (
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
                      <CodeBlock code={side.code} language="typescript" />
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
                      <CodeBlock code={item.code} language="typescript" />
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
