export default function BenefitsSection() {
  const benefits = [
    {
      icon: "🛡️",
      title: "驗證邏輯集中，不散落各處",
      description:
        "所有驗證規則都在 Schema Service 層，元件只需掛上 schema 不需要自己寫 if-else。新人閱讀元件時不會看到驗證邏輯，閱讀 Schema 時看到的就是完整的業務規則。",
      tags: ["可維護性", "可讀性"],
    },
    {
      icon: "♻️",
      title: "Schema 可組合，避免重複定義",
      description:
        "Base Schema 可被 Required Schema 繼承，Required Schema 可被各平台 Schema 繼承。新增平台只需寫差異欄位，不需要複製整個 Schema 結構。修改一個共通欄位，所有平台自動生效。",
      tags: ["DRY", "可擴展性"],
    },
    {
      icon: "🔒",
      title: "跨欄位商業邏輯在 Schema 層維護",
      description:
        "「EAN 與製造商貨號擇一必填」「結束時間必須晚於生效時間」等跨欄位規則，用 .when() 寫在 Schema 裡，不需要在 @submit handler 或 watch 裡手動判斷，不會因遺漏而造成漏洞。",
      tags: ["業務邏輯", "正確性"],
    },
    {
      icon: "🔷",
      title: "從 Schema 推斷型別，永遠同步",
      description:
        "用 Yup 的 InferType 從 Schema 推斷 TypeScript 型別，不需要手寫重複的 interface。Schema 欄位改了型別自動更新，TypeScript 會在編譯期指出所有用到該型別的地方。",
      tags: ["型別安全", "TypeScript"],
    },
    {
      icon: "🧪",
      title: "驗證邏輯可獨立測試",
      description:
        "Schema 是純邏輯，可以完全脫離 UI 用 Vitest 測試。特別是 EAN-13 checksum 計算、統一編號加權、跨欄位規則等複雜邏輯，能夠驗證邊界情況，防止 regression。",
      tags: ["可測試性", "品質保障"],
    },
    {
      icon: "✨",
      title: "使用者體驗：錯誤訊息正確顯示",
      description:
        "所有第三方元件（PrimeInputNumber、PrimeCalendar）都包在 VeeValidate Field 裡，錯誤訊息透過 v-slot 直接取得而非空白 span，讓使用者能清楚知道哪個欄位有問題。",
      tags: ["UX", "使用者體驗"],
    },
  ];

  const tagColors: Record<string, string> = {
    可維護性: "bg-blue-100 text-blue-700",
    可讀性: "bg-sky-100 text-sky-700",
    DRY: "bg-purple-100 text-purple-700",
    可擴展性: "bg-violet-100 text-violet-700",
    業務邏輯: "bg-orange-100 text-orange-700",
    正確性: "bg-red-100 text-red-700",
    型別安全: "bg-emerald-100 text-emerald-700",
    TypeScript: "bg-teal-100 text-teal-700",
    可測試性: "bg-indigo-100 text-indigo-700",
    品質保障: "bg-cyan-100 text-cyan-700",
    UX: "bg-pink-100 text-pink-700",
    使用者體驗: "bg-rose-100 text-rose-700",
  };

  return (
    <div className="space-y-10">
      <div className="bg-white rounded-xl border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">帶來的幫助</h2>
        <p className="text-slate-500 mb-8">
          從發現問題、設計架構到落地最佳實踐，這套模式在電商後台的多平台表單系統中帶來了明確的改善。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-xl border border-slate-200 p-6 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl shrink-0">{b.icon}</span>
                <div>
                  <h3 className="font-bold text-slate-800 mb-2">{b.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-3">{b.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {b.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${tagColors[tag] ?? "bg-slate-100 text-slate-600"}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-10 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
          <h3 className="text-lg font-bold mb-4">整體架構回顧</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-slate-400 mb-2 text-xs uppercase tracking-wide">Validator Helpers</p>
              <p className="text-slate-200 leading-relaxed">
                集中管理 EAN-13、統一編號等自定義規則。修正 <code className="bg-white/10 px-1 rounded">/g</code> flag 隱患，提供可組合的 Yup 方法。
              </p>
            </div>
            <div>
              <p className="text-slate-400 mb-2 text-xs uppercase tracking-wide">Schema Service 分層</p>
              <p className="text-slate-200 leading-relaxed">
                Base → Required → Platform 三層繼承，跨欄位邏輯用 <code className="bg-white/10 px-1 rounded">.when()</code>，型別用 <code className="bg-white/10 px-1 rounded">InferType</code> 推斷。
              </p>
            </div>
            <div>
              <p className="text-slate-400 mb-2 text-xs uppercase tracking-wide">VeeValidate 整合</p>
              <p className="text-slate-200 leading-relaxed">
                第三方元件用 <code className="bg-white/10 px-1 rounded">v-slot</code> 橋接，<code className="bg-white/10 px-1 rounded">toTypedSchema</code> 保證型別安全，Schema 獨立 Vitest 測試覆蓋。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
