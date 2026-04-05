const SECTIONS = [
  {
    id: "why",
    step: 1,
    color: "blue",
    title: "為什麼需要 Husky + lint-staged？",
    desc: "ESLint 和 Prettier 設好了，但不強制執行的話，有人還是會 commit 未通過的代碼。Husky 在 git commit 前自動觸發 hook，lint-staged 只對這次有修改的檔案執行檢查，速度快且不影響未修改的代碼。",
    content: {
      type: "compare",
      left: {
        label: "沒有 pre-commit hook",
        code: `# 任何代碼都能 commit
git add .
git commit -m "fix: 修正採購流程"

# 問題在 CI 才被發現
→ Pipeline 跑 eslint 失敗
→ 要重新修、重新 push
→ 浪費 CI 資源和等待時間`,
        note: "問題留到 CI 才爆，浪費所有人時間",
        bad: true,
      },
      right: {
        label: "有 pre-commit hook",
        code: `# commit 時自動觸發
git commit -m "fix: 修正採購流程"

→ husky pre-commit hook 啟動
→ lint-staged 只對 staged 檔案執行
→ ESLint 發現錯誤，commit 被阻止
→ 開發者立即修正，再次 commit

# 問題在本機就被攔截`,
        note: "在最早的環節攔截，保護 main branch",
        bad: false,
      },
    },
  },
  {
    id: "setup",
    step: 2,
    color: "purple",
    title: "安裝與設定",
    desc: "Husky v9 的設定流程比過去更簡潔，不再需要在 package.json 裡寫 husky 設定，而是直接在 .husky/ 目錄下管理 hook 腳本。",
    content: {
      type: "steps",
      items: [
        {
          label: "安裝",
          code: `npm install -D husky lint-staged

# 初始化 Husky（建立 .husky/ 目錄）
npx husky init`,
        },
        {
          label: ".husky/pre-commit",
          code: `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged`,
        },
        {
          label: "package.json — lint-staged 設定",
          code: `{
  "lint-staged": {
    "*.{ts,tsx,vue}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,scss,vue}": [
      "stylelint --fix"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}`,
        },
        {
          label: "確保新成員 clone 後自動安裝 hooks",
          code: `// package.json
{
  "scripts": {
    "prepare": "husky"
  }
}

// npm install 完成後自動執行 prepare
// → husky 自動設定 .husky/ 目錄
// 新成員不需要手動執行任何指令`,
        },
      ],
    },
  },
  {
    id: "commit-msg",
    step: 3,
    color: "green",
    title: "commit-msg hook — 規範 commit 格式",
    desc: "除了 pre-commit，也可以加上 commit-msg hook，強制 commit message 符合 Conventional Commits 格式，讓 git log 更易讀，也方便自動生成 changelog。",
    content: {
      type: "compare",
      left: {
        label: "隨意的 commit message",
        code: `git commit -m "fix"
git commit -m "改了一些東西"
git commit -m "wip"
git commit -m "1234"
git commit -m "done"

# 一個月後看 git log
# 完全不知道每個 commit 做了什麼`,
        note: "git history 變成垃圾場",
        bad: true,
      },
      right: {
        label: "Conventional Commits 格式",
        code: `# .husky/commit-msg
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit $1

# commitlint.config.js
export default {
  extends: ['@commitlint/config-conventional'],
}

# 合法格式
git commit -m "feat: 新增採購單審核功能"
git commit -m "fix: 修正分頁計算錯誤"
git commit -m "refactor: 重構表單驗證邏輯"
git commit -m "chore: 更新依賴套件版本"`,
        note: "一眼看出每個 commit 的類型與範圍",
        bad: false,
      },
    },
  },
  {
    id: "bypass",
    step: 4,
    color: "orange",
    title: "緊急繞過（--no-verify）",
    desc: "偶爾確實需要在不通過 lint 的情況下 commit（例如暫存 WIP 或緊急修 hotfix），可以用 --no-verify 跳過。但這是例外，不是常態。",
    content: {
      type: "steps",
      items: [
        {
          label: "緊急情況才使用",
          code: `# 跳過所有 hooks（僅限緊急情況）
git commit -m "wip: 暫存進度" --no-verify

# 使用規範：
# 1. 只在本地 feature branch 使用
# 2. 最終 PR 前必須補回 lint 修正
# 3. 不允許在 commit 到 main/develop 時使用`,
        },
        {
          label: "更好的替代方案：git stash",
          code: `# 不想 commit 但要切換分支時
# 用 stash 代替 --no-verify

git stash push -m "wip: 採購流程修改中"

# 做完緊急事項後
git stash pop

# 這樣不需要繞過任何 hooks`,
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

export default function HuskyPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <header className="relative bg-gradient-to-br from-amber-900 via-amber-800 to-slate-900 text-white py-10 overflow-hidden">
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
            <h1 className="text-5xl font-black mb-6 tracking-tight">Husky + lint-staged</h1>
            <p className="text-xl text-amber-200 leading-relaxed">
              pre-commit hook — 問題在本機就被攔截，保護 main branch 品質
            </p>
            <div className="flex justify-center gap-3 mt-6 flex-wrap">
              {["pre-commit", "lint-staged", "commit-msg", "Conventional Commits"].map((tag) => (
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
