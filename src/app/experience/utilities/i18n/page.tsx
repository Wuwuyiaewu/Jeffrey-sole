import CodeBlock from "@/components/CodeBlock";

const I18N_INIT_CODE = `import { createI18n } from 'vue-i18n'
import zhTw from './language/tw.json'
import en   from './language/en.json'
import zhCn from './language/cn.json'

const i18n = createI18n({
  legacy: false,        // Composition API 模式
  locale: 'zh-TW',     // 預設語言
  fallbackLocale: 'zh-TW',
  messages: {
    'zh-TW': zhTw,
    en,
    'zh-CN': zhCn
  }
})

export const t = i18n.global.t  // 供非組件模組使用
export default i18n`;

const I18N_VUE_USAGE_CODE = `<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <!-- 按鈕文案 -->
  <el-button>{{ t('COMMON_BUTTON_search') }}</el-button>
  <el-button>{{ t('COMMON_BUTTON_submit') }}</el-button>

  <!-- 錯誤提示 -->
  <el-form-item :label="t('VENDOR_CODE')">
    <span>{{ t('COMMON_MESSAGE_REQUIRED') }}</span>
  </el-form-item>

  <!-- 頁面標題 -->
  <h1>{{ t('AP_INQUIRY_CONFIRMED_INVOICE_QUERY') }}</h1>
</template>`;

const I18N_RESPONSE_CODE = `import { t } from '@/config/i18n'

function handleError(error, apiName) {
  const status = error.response?.status

  if (status === 400) {
    ElMessage.error(t('COMMON_MESSAGE_ERROR_400'))
    // → "參數無效" / "Invalid parameters" / "参数无效"
  }
  else if (status === 401) {
    ElMessage.error(t('COMMON_MESSAGE_ERROR_401'))
  }
  else if (status === 403) {
    // 清除狀態後重新登入
    stateStore.clearApp()
    ElMessage.error(t('COMMON_MESSAGE_ERROR_403'))
  }
  else if (status === 500) {
    router.push('/error')
    ElMessage.error(t('COMMON_MESSAGE_ERROR_500'))
  }
}`;

const I18N_REQUEST_CODE = `// _request.ts
instance.interceptors.request.use((config) => {
  // 從 stateStore 取得目前語言，注入至 HTTP Header
  config.headers['Accept-Language'] =
    stateStore.currentLanguage  // 'zh-TW' | 'en' | 'zh-CN'
  return config
})`;

export default function I18nPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="relative bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 text-white py-10 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`,
            }}
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
              <span className="text-sm font-medium tracking-wide">Utilities Pattern</span>
            </div>
            <h1 className="text-6xl font-black mb-6 tracking-tight">vue-i18n 三語系</h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              以 Composition API 模式建立繁中 / 英文 / 簡中三語系，搭配 SCREAMING_SNAKE_CASE 命名規範統一管理全站文案
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">

        {/* 架構總覽 */}
        <section className="bg-white rounded-xl shadow-sm border border-stone-200 p-8">
          <h2 className="text-2xl font-black text-slate-900 mb-2">架構總覽</h2>
          <p className="text-stone-500 mb-6">一個設定檔搭配三個 JSON 語系檔，集中管理整個系統的多語文案</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { file: "i18n.ts", label: "初始化設定", color: "bg-violet-500", desc: "以 createI18n 建立實例，設定預設語言、fallback 策略，並 export 全域 t 函式" },
              { file: "tw.json", label: "繁體中文", color: "bg-blue-500", desc: "預設語言，作為 fallbackLocale，所有 key 的中文對應值" },
              { file: "en.json", label: "英文", color: "bg-emerald-500", desc: "英語文案，供外部廠商使用介面切換" },
              { file: "cn.json", label: "簡體中文", color: "bg-amber-500", desc: "簡體中文文案，對應中國大陸廠商使用需求" },
            ].map((item) => (
              <div key={item.file} className="rounded-lg border border-stone-200 overflow-hidden">
                <div className={`${item.color} text-white px-4 py-2 text-sm font-bold`}>{item.file}</div>
                <div className="p-4">
                  <div className="font-bold text-slate-700 mb-1">{item.label}</div>
                  <p className="text-xs text-stone-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Step 1 - 初始化 */}
        <div className="bg-white border-l-4 border-violet-500 p-8 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold mb-2 text-slate-900">i18n.ts — Composition API 模式初始化</h3>
          <p className="text-stone-600 mb-6">
            使用 <code className="bg-stone-100 px-1 rounded text-sm">legacy: false</code> 啟用 Composition API 模式，避免 Options API 的 <code className="bg-stone-100 px-1 rounded text-sm">$t</code> 全域污染；同時 export <code className="bg-stone-100 px-1 rounded text-sm">t</code> 函式供非組件的模組（如 Axios 攔截器）直接呼叫。
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-bold text-stone-500 mb-3">i18n.ts 完整設定</div>
              <CodeBlock code={I18N_INIT_CODE} language="typescript" />
            </div>
            <div className="space-y-3">
              {[
                { key: "legacy: false", color: "bg-violet-50 border-violet-200 text-violet-800", desc: "啟用 Composition API 模式，在 <script setup> 中使用 useI18n() 取得 t，不污染全域 $t" },
                { key: "locale: 'zh-TW'", color: "bg-blue-50 border-blue-200 text-blue-800", desc: "預設語言設為繁體中文，系統啟動時自動套用" },
                { key: "fallbackLocale: 'zh-TW'", color: "bg-emerald-50 border-emerald-200 text-emerald-800", desc: "若英文或簡中的 key 未翻譯，自動回退到繁中，避免顯示 key 字串" },
                { key: "export const t", color: "bg-amber-50 border-amber-200 text-amber-800", desc: "將 global.t 單獨 export，讓 Axios 攔截器等非 Vue 組件的地方也能用 i18n" },
              ].map((item) => (
                <div key={item.key} className={`rounded-lg p-3 border ${item.color}`}>
                  <code className="text-sm font-bold">{item.key}</code>
                  <p className="text-xs mt-1 leading-relaxed opacity-80">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2 - 命名規範 */}
        <div className="bg-white border-l-4 border-blue-500 p-8 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold mb-2 text-slate-900">JSON 命名規範 — SCREAMING_SNAKE_CASE 分層前綴</h3>
          <p className="text-stone-600 mb-6">
            所有翻譯 key 以 SCREAMING_SNAKE_CASE 命名，並以前綴區分功能層級，讓文案來源一目了然。
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
                {[
                  {
                    prefix: "COMMON_MESSAGE_*",
                    label: "共用訊息",
                    color: "border-rose-400 bg-rose-50",
                    labelColor: "text-rose-700",
                    examples: [
                      ["COMMON_MESSAGE_ERROR_400", "參數無效"],
                      ["COMMON_MESSAGE_ERROR_401", "此憑證已過期"],
                      ["COMMON_MESSAGE_ERROR_403", "拒絕存取，使用者沒有權限"],
                      ["COMMON_MESSAGE_ERROR_500", "HTTP請求失敗，請聯繫系統管理員"],
                      ["COMMON_MESSAGE_CONFIRM_SAVE", "是否確定存檔?"],
                      ["COMMON_MESSAGE_SUCCESS", "成功訊息"],
                    ],
                  },
                  {
                    prefix: "COMMON_BUTTON_*",
                    label: "共用按鈕",
                    color: "border-blue-400 bg-blue-50",
                    labelColor: "text-blue-700",
                    examples: [
                      ["COMMON_BUTTON_search", "查詢"],
                      ["COMMON_BUTTON_submit", "確認存檔"],
                      ["COMMON_BUTTON_reset", "條件重設"],
                      ["COMMON_BUTTON_PRINT", "列印"],
                      ["COMMON_BUTTON_REMOVE", "刪除"],
                      ["COMMON_BUTTON_RELEASE", "接收"],
                    ],
                  },
                  {
                    prefix: "COMMON_TEXT_*",
                    label: "共用文字",
                    color: "border-emerald-400 bg-emerald-50",
                    labelColor: "text-emerald-700",
                    examples: [
                      ["COMMON_TEXT_CONFIRM", "確定"],
                      ["COMMON_TEXT_CANCEL", "取消"],
                      ["COMMON_TEXT_LOGOUT", "登出"],
                      ["COMMON_TEXT_NOTHING", "查無資料"],
                      ["COMMON_TEXT_NEXT", "下一頁"],
                      ["COMMON_TEXT_PREV", "上一頁"],
                    ],
                  },
                  {
                    prefix: "業務模組前綴",
                    label: "模組專用文案",
                    color: "border-purple-400 bg-purple-50",
                    labelColor: "text-purple-700",
                    examples: [
                      ["AP_INQUIRY", "AP 查詢"],
                      ["QUOTATION_MAINTAIN", "報價維護"],
                      ["SAMPLE_MANAGEMENT", "送樣管理"],
                      ["CONSIGNMENT_MAINTAIN", "寄銷品報表"],
                      ["PCNEOL_PCNEOLNRND_APPLY", "PCNEOL & NRND (申請)"],
                      ["SYSTEM_DATA_MAINTAIN", "系統資料維護"],
                    ],
                  },
                ].map((group) => (
                  <div key={group.prefix} className={`rounded-lg p-5 border-2 ${group.color}`}>
                    <div className={`text-sm font-bold mb-1 ${group.labelColor}`}>{group.prefix}</div>
                    <div className="text-xs text-stone-500 mb-3">{group.label}</div>
                    <div className="space-y-1">
                      {group.examples.map(([key, val]) => (
                        <div key={key} className="flex items-start gap-2 text-xs">
                          <code className="bg-white px-1.5 py-0.5 rounded border border-stone-200 font-mono shrink-0 leading-relaxed">{key}</code>
                          <span className="text-stone-500 leading-relaxed">→ {val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {/* Step 3 - 在組件使用 */}
        <div className="bg-white border-l-4 border-emerald-500 p-8 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold mb-2 text-slate-900">在 Vue 組件中使用</h3>
          <p className="text-stone-600 mb-6">
            透過 <code className="bg-stone-100 px-1 rounded text-sm">useI18n()</code> 取得 <code className="bg-stone-100 px-1 rounded text-sm">t</code> 函式，template 直接呼叫，語言切換時所有文案即時響應。
          </p>
          <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-5 border-2 border-emerald-200">
            <div className="text-sm font-bold mb-3 text-emerald-900">Vue SFC 使用方式</div>
            <CodeBlock code={I18N_VUE_USAGE_CODE} language="html" />
          </div>
        </div>

        {/* Step 4 - 非組件使用（Axios 攔截器） */}
        <div className="bg-white border-l-4 border-rose-500 p-8 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold mb-2 text-slate-900">在非組件模組使用 — Axios 攔截器整合</h3>
          <p className="text-stone-600 mb-6">
            直接 import <code className="bg-stone-100 px-1 rounded text-sm">t</code> 讓 Axios response 攔截器在 HTTP 錯誤時顯示對應的多語錯誤訊息，不需傳入任何 context。
          </p>
          <div className="bg-rose-50 rounded-xl p-5 border-2 border-rose-200 mb-6">
            <div className="text-sm font-bold mb-3 text-rose-900">_response.ts — 攔截器直接使用 t()</div>
            <CodeBlock code={I18N_RESPONSE_CODE} language="javascript" />
          </div>
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <div className="text-sm font-bold text-amber-800 mb-2">Request 攔截器注入 Accept-Language</div>
            <CodeBlock code={I18N_REQUEST_CODE} language="javascript" />
          </div>
        </div>

        {/* 三語對照 */}
        <section className="bg-white rounded-xl shadow-sm border border-stone-200 p-8">
          <h2 className="text-2xl font-black text-slate-900 mb-2">三語對照示例</h2>
          <p className="text-stone-500 mb-6">相同 key 在三個語系 JSON 的對應值，切換語言時由 vue-i18n 自動替換</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-violet-50">
                  <th className="border border-violet-200 px-4 py-2 text-left font-bold text-violet-800">Key</th>
                  <th className="border border-violet-200 px-4 py-2 text-left font-bold text-blue-700">zh-TW（預設）</th>
                  <th className="border border-violet-200 px-4 py-2 text-left font-bold text-emerald-700">en</th>
                  <th className="border border-violet-200 px-4 py-2 text-left font-bold text-amber-700">zh-CN</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {[
                  ["COMMON_BUTTON_search", "查詢", "Search", "查询"],
                  ["COMMON_BUTTON_submit", "確認存檔", "Submit", "确认存档"],
                  ["COMMON_TEXT_CONFIRM", "確定", "Confirm", "确定"],
                  ["COMMON_TEXT_CANCEL", "取消", "Cancel", "取消"],
                  ["COMMON_MESSAGE_ERROR_400", "參數無效", "Invalid parameters", "参数无效"],
                  ["COMMON_MESSAGE_ERROR_500", "HTTP請求失敗，請聯繫系統管理員", "HTTP request failed, please contact admin", "HTTP请求失败，请联系系统管理员"],
                  ["COMMON_MESSAGE_CONFIRM_SAVE", "是否確定存檔?", "Confirm to save?", "是否确定存档?"],
                  ["COMMON_TEXT_NOTHING", "查無資料", "No data found", "查无数据"],
                ].map(([key, tw, en, cn]) => (
                  <tr key={key} className="even:bg-stone-50">
                    <td className="border border-stone-200 px-4 py-2 font-mono text-violet-700">{key}</td>
                    <td className="border border-stone-200 px-4 py-2 text-stone-700">{tw}</td>
                    <td className="border border-stone-200 px-4 py-2 text-stone-700">{en}</td>
                    <td className="border border-stone-200 px-4 py-2 text-stone-700">{cn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 整體效益 */}
        <section className="bg-slate-900 text-white rounded-xl p-8">
          <h2 className="text-2xl font-black mb-6">這套設計帶來的好處</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🌐",
                title: "非組件也能用 i18n",
                desc: "export const t 讓 Axios 攔截器、工具函式等非 Vue 組件的模組也能呼叫翻譯，不需繞過 Vue 的 provide/inject",
              },
              {
                icon: "📋",
                title: "前綴命名即文件",
                desc: "COMMON_MESSAGE / COMMON_BUTTON / COMMON_TEXT 前綴讓開發者一看 key 就知道用途，不需查表確認文案位置",
              },
              {
                icon: "🔁",
                title: "fallback 策略保底",
                desc: "fallbackLocale 設為繁中，新增功能只需先補 tw.json，英文和簡中未翻譯前不會顯示 key 字串，不影響使用者體驗",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white/10 rounded-lg p-5">
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="font-bold text-lg mb-2">{item.title}</div>
                <p className="text-slate-300 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
