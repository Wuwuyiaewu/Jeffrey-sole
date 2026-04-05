const SECTIONS = [
  {
    id: "why",
    step: 1,
    color: "blue",
    title: "為什麼用 Stylelint？",
    desc: "CSS 屬性順序隨意、class 命名不一致，在多人協作的專案中很常見。Stylelint 可以強制 CSS 屬性排序、驗證 BEM 命名規則，讓樣式代碼也有一致的標準。",
    content: {
      type: "compare",
      left: {
        label: "沒有規範的 CSS",
        code: `.card {
  color: red;
  width: 200px;
  display: flex;
  background: white;
  position: relative;
  font-size: 14px;
  z-index: 10;
  margin: 0;
  /* 屬性隨意排列，難以快速定位 */
}`,
        note: "每個人順序不同，難以維護",
        bad: true,
      },
      right: {
        label: "Stylelint 強制屬性排序",
        code: `.card {
  /* 定位 */
  position: relative;
  z-index: 10;
  /* 盒模型 */
  display: flex;
  width: 200px;
  margin: 0;
  /* 視覺 */
  background: white;
  color: red;
  font-size: 14px;
}`,
        note: "分組排序，定位 → 盒模型 → 視覺，一眼定位屬性",
        bad: false,
      },
    },
  },
  {
    id: "config",
    step: 2,
    color: "purple",
    title: "設定檔",
    desc: "Stylelint 設定搭配 stylelint-order 外掛，強制屬性排序規則；並針對 Vue SFC 的 <style> 區塊，加入 stylelint-config-standard-vue 支援。",
    content: {
      type: "steps",
      items: [
        {
          label: "安裝",
          code: `npm install -D stylelint stylelint-order stylelint-config-standard stylelint-config-standard-vue`,
        },
        {
          label: ".stylelintrc.json",
          code: `{
  "extends": [
    "stylelint-config-standard",
    "stylelint-config-standard-vue"
  ],
  "plugins": ["stylelint-order"],
  "rules": {
    "order/properties-order": [
      "position", "top", "right", "bottom", "left", "z-index",
      "display", "flex", "flex-direction", "flex-wrap",
      "align-items", "justify-content", "gap",
      "width", "min-width", "max-width",
      "height", "min-height", "max-height",
      "margin", "padding",
      "background", "border", "border-radius",
      "color", "font-size", "font-weight", "line-height",
      "opacity", "cursor", "transition"
    ],
    "selector-class-pattern": null
  }
}`,
        },
        {
          label: "package.json script",
          code: `{
  "scripts": {
    "lint:style": "stylelint \"src/**/*.{css,scss,vue}\" --fix"
  }
}`,
        },
      ],
    },
  },
  {
    id: "bem",
    step: 3,
    color: "green",
    title: "BEM 命名驗證",
    desc: "在採用 BEM（Block Element Modifier）命名規則的專案中，Stylelint 可以透過 selector-class-pattern 規則，強制所有 class 符合 BEM 格式。",
    content: {
      type: "compare",
      left: {
        label: "不符合 BEM 的命名",
        code: `/* 各種隨意命名方式 */
.cardTitle { ... }      /* camelCase */
.card_title { ... }     /* 單底線 */
.CardTitle { ... }      /* PascalCase */
.card-title-wrap { ... } /* 語意不清 */`,
        note: "看不出 block / element / modifier 關係",
        bad: true,
      },
      right: {
        label: "BEM pattern 驗證",
        code: `// .stylelintrc.json
{
  "rules": {
    "selector-class-pattern": [
      "^[a-z][a-z0-9]*(__[a-z][a-z0-9]*)?(--[a-z][a-z0-9]*)?$",
      {
        "message": "class 命名必須符合 BEM 格式",
        "resolveNestedSelectors": true
      }
    ]
  }
}

/* 符合規則 */
.card { }
.card__title { }
.card__title--highlighted { }`,
        note: "正規表達式強制 block__element--modifier 格式",
        bad: false,
      },
    },
  },
  {
    id: "vscode",
    step: 4,
    color: "orange",
    title: "VSCode 整合",
    desc: "安裝 VSCode Stylelint 擴充套件後，可以在 Vue SFC 的 <style> 區塊即時顯示錯誤，並在存檔時自動修正。",
    content: {
      type: "steps",
      items: [
        {
          label: ".vscode/settings.json",
          code: `{
  // 啟用 Vue 檔案的 Stylelint 驗證
  "stylelint.validate": ["css", "scss", "vue"],

  // 存檔時自動修正
  "editor.codeActionsOnSave": {
    "source.fixAll.stylelint": "explicit"
  }
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

export default function StylelintPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <header className="relative bg-gradient-to-br from-pink-900 via-pink-800 to-slate-900 text-white py-10 overflow-hidden">
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
            <h1 className="text-6xl font-black mb-6 tracking-tight">Stylelint</h1>
            <p className="text-xl text-pink-200 leading-relaxed">
              CSS 屬性排序、BEM 命名驗證 — 讓樣式代碼也有統一標準
            </p>
            <div className="flex justify-center gap-3 mt-6 flex-wrap">
              {["屬性排序", "BEM 驗證", "Vue SFC", "VSCode 整合"].map((tag) => (
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
                      <CodeBlock code={side.code} language="css" />
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
                      <CodeBlock code={item.code} language="css" />
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
