const SECTIONS = [
  {
    id: "why",
    step: 1,
    color: "blue",
    title: "Prettier 的定位",
    desc: "ESLint 管邏輯規則，Prettier 管格式排版。兩者分工明確：ESLint 告訴你「這樣寫有 bug」，Prettier 處理「引號、縮排、逗號、換行」等純格式問題，且完全自動修正，無需爭論。",
    content: {
      type: "compare",
      left: {
        label: "Prettier 處理前",
        code: `// 各種風格混雜
const obj = {name: 'Alice', age: 25, role: 'admin', active: true}

function handleSubmit(formData, options, callback) {
  if(formData.valid){
      doSomething(formData)
  }
}`,
        note: "縮排不一、空格隨意、行太長",
        bad: true,
      },
      right: {
        label: "Prettier 處理後",
        code: `// 自動格式化
const obj = {
  name: "Alice",
  age: 25,
  role: "admin",
  active: true,
};

function handleSubmit(formData, options, callback) {
  if (formData.valid) {
    doSomething(formData);
  }
}`,
        note: "存檔自動整理，零爭議",
        bad: false,
      },
    },
  },
  {
    id: "config",
    step: 2,
    color: "purple",
    title: "設定檔",
    desc: "Prettier 的設定刻意極簡，避免規則太多反而造成爭議。團隊統一幾個關鍵設定後，其餘交給 Prettier 自動決定。",
    content: {
      type: "steps",
      items: [
        {
          label: ".prettierrc",
          code: `{
  "semi": false,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "trailingComma": "es5",
  "vueIndentScriptAndStyle": true,
  "endOfLine": "lf"
}`,
        },
        {
          label: ".prettierignore",
          code: `# 自動生成的檔案不格式化
dist
node_modules
src/auto-imports.d.ts
src/components.d.ts
*.min.js
pnpm-lock.yaml`,
        },
      ],
    },
  },
  {
    id: "eslint-integration",
    step: 3,
    color: "green",
    title: "與 ESLint 整合（避免衝突）",
    desc: "ESLint 也有一些格式相關規則，和 Prettier 容易衝突。使用 eslint-config-prettier 關閉 ESLint 中與 Prettier 重疊的規則，讓兩者各司其職。",
    content: {
      type: "compare",
      left: {
        label: "沒有 eslint-config-prettier 的衝突",
        code: `// ESLint 說要有分號
// Prettier 說不要分號

// 結果：存檔後 Prettier 移除分號
// ESLint 立刻標紅錯誤
// 永遠無法同時滿足兩個工具`,
        note: "兩個工具互相打架，開發體驗很差",
        bad: true,
      },
      right: {
        label: "加入 eslint-config-prettier",
        code: `// eslint.config.js
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...tseslint.configs.recommended,
  // 放最後，關閉所有與 Prettier 衝突的 ESLint 規則
  eslintConfigPrettier,
]`,
        note: "Prettier 管格式，ESLint 管邏輯，不再衝突",
        bad: false,
      },
    },
  },
  {
    id: "vscode",
    step: 4,
    color: "orange",
    title: "VSCode 整合",
    desc: "透過 VSCode 設定，讓 Prettier 成為預設格式化工具，存檔時自動執行，無需手動觸發。",
    content: {
      type: "steps",
      items: [
        {
          label: ".vscode/settings.json",
          code: `{
  // Prettier 作為預設格式化工具
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  // 存檔時自動格式化
  "editor.formatOnSave": true,

  // 針對特定語言指定格式化工具
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}`,
        },
        {
          label: ".vscode/extensions.json（推薦安裝）",
          code: `{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "stylelint.vscode-stylelint"
  ]
}`,
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

export default function PrettierPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <header className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white py-10 overflow-hidden">
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
            <h1 className="text-6xl font-black mb-6 tracking-tight">Prettier</h1>
            <p className="text-xl text-emerald-200 leading-relaxed">
              格式化自動化 — 終止縮排爭議，讓 review 專注在邏輯
            </p>
            <div className="flex justify-center gap-3 mt-6 flex-wrap">
              {["格式化", "ESLint 整合", "存檔自動修正", "零爭議"].map((tag) => (
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
