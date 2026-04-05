import CodeBlock from "@/components/CodeBlock";

const AXIOS_BEFORE_CODE = `const authAPI = axios.create({
  baseURL: '...authUrl',
  timeout: 5000
})
const vendorAPI = axios.create({
  baseURL: '...vendorUrl',
  timeout: 5000
})
// 重複 N 次...`;

const AXIOS_FACTORY_CODE = `function createAxiosInstance(
  baseURL: string
): AxiosInstance {
  return axios.create({
    baseURL,
    timeout: import.meta.env
              .VITE_API_TIMEOUT
  })
}

export const authURL =
  createAxiosInstance(authBaseURL)
export const vendorURL =
  createAxiosInstance(vendorBaseURL)`;

const AXIOS_UNLOADING_CODE = `// isLoadingMask = false → 打 API 時不顯示轉圈遮罩
export const unLoadingPcneolNrndAPI_req =
  createHttpInstanceRequest(
    unLoadingPcneolNrndURL,
    'unLoadingPcneolNrndAPI_req',
    false  // ← 不觸發 loading 遮罩
  )`;

const AXIOS_RESPONSE_INTERCEPTOR_CODE = `authAPI_req.interceptors.response.use(
  (response) => {
    stateStore.setLoading('authAPI_req', false) // ← 成功也要關掉 loading
    return response
  },
  async (error) => {
    return handleError(error, 'authAPI_req')
  }
)`;

const AXIOS_USAGE_CODE = `// 業務層只需要選擇 instance 和傳型別
const result = await FETCH<QuotationList>(
  '/api/quotation/list',
  'quotationAPI',    // ← 選擇對應的微服務實例
  { page: 1, size: 20 }
)

// 下載 Excel
await DOWNLOADPOST(
  '/api/ap/export',
  'report.xlsx',
  'apAPI',
  { startDate, endDate }
)`;

export default function AxiosPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-10 overflow-hidden">
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
              <span className="text-sm font-medium tracking-wide">API Integration Pattern</span>
            </div>
            <h1 className="text-6xl font-black mb-6 tracking-tight">Axios 多實例設計</h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              分層架構管理多個微服務端點，統一攔截器與錯誤處理
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">

        {/* 架構總覽 */}
        <section className="bg-white rounded-xl shadow-sm border border-stone-200 p-8">
          <h2 className="text-2xl font-black text-slate-900 mb-2">架構總覽</h2>
          <p className="text-stone-500 mb-6">將 Axios 分成四個職責清晰的層級</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { file: "_instance.ts", label: "建立實例", color: "bg-blue-500", desc: "用工廠函式針對各微服務建立不同 baseURL 的 axios 實例" },
              { file: "_request.ts", label: "請求攔截", color: "bg-purple-500", desc: "為每個實例掛載 request interceptor，注入 token、語言、loading 狀態" },
              { file: "_response.ts", label: "回應攔截", color: "bg-rose-500", desc: "統一處理 HTTP 錯誤碼（400/401/403/500），觸發重新登入或跳轉" },
              { file: "index.ts", label: "公開 API", color: "bg-emerald-500", desc: "Export FETCH / POST / PUT / DELETE / DOWNLOAD 等泛型方法供業務層使用" },
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

        {/* Step 1 - 多實例 */}
        <div className="bg-white border-l-4 border-blue-500 p-8 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold mb-2 text-slate-900">_instance.ts — 工廠函式建立多實例</h3>
          <p className="text-stone-600 mb-6">用一個 <code className="bg-stone-100 px-1 rounded text-sm">createAxiosInstance(baseURL)</code> 工廠函式，為每條業務線建立獨立的 AxiosInstance，各自對應不同的微服務 URL 與 timeout。</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-stone-50 rounded-lg p-5 border-2 border-stone-200">
              <div className="text-sm font-bold text-stone-500 mb-3">直接重複建立</div>
              <CodeBlock code={AXIOS_BEFORE_CODE} language="typescript" />
              <div className="text-red-600 mt-3 text-sm font-bold">重複邏輯，難以維護</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-5 border-2 border-blue-500">
              <div className="text-sm font-bold text-blue-700 mb-3">工廠函式封裝</div>
              <CodeBlock code={AXIOS_FACTORY_CODE} language="typescript" />
              <div className="text-blue-700 mt-3 text-sm font-bold">集中管理，易於擴展</div>
            </div>
          </div>
        </div>

        {/* Step 2 - 請求攔截 */}
        <div className="bg-white border-l-4 border-purple-500 p-8 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold mb-2 text-slate-900">_request.ts — 統一請求攔截器</h3>
          <p className="text-stone-600 mb-6">
            <code className="bg-stone-100 px-1 rounded text-sm">createHttpInstanceRequest(instance, apiName, isLoadingMask)</code> 為每個實例掛上 request interceptor，統一注入以下設定：
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {[
              { label: "Authorization", desc: "從 Cookie 取得 JWT Token，寫入 Bearer header", color: "text-purple-700 bg-purple-50 border-purple-200" },
              { label: "Accept-Language", desc: "從 stateStore 取得目前語言設定（i18n 多語系支援）", color: "text-blue-700 bg-blue-50 border-blue-200" },
              { label: "Cache-Control", desc: "設定 max-age=3600，控制快取行為", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
              { label: "Loading Mask", desc: "透過 stateStore.setLoading() 控制請求期間的 loading 遮罩", color: "text-rose-700 bg-rose-50 border-rose-200" },
            ].map((item) => (
              <div key={item.label} className={`rounded-lg p-4 border ${item.color}`}>
                <div className="font-bold text-sm mb-1">{item.label}</div>
                <div className="text-xs leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-5 border-2 border-purple-200">
            <div className="text-sm font-bold mb-3 text-purple-900">特殊設計：無 Loading 實例</div>
            <CodeBlock code={AXIOS_UNLOADING_CODE} language="typescript" />
          </div>
        </div>

        {/* Step 3 - 回應攔截 */}
        <div className="bg-white border-l-4 border-rose-500 p-8 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold mb-2 text-slate-900">_response.ts — 統一錯誤處理</h3>
          <p className="text-stone-600 mb-6">
            共用 <code className="bg-stone-100 px-1 rounded text-sm">handleError(error, apiName)</code> 函式，依 HTTP 狀態碼對應不同行為，每個 instance 各自掛上 response interceptor 調用它。
          </p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-rose-50">
                  <th className="border border-rose-200 px-4 py-2 text-left font-bold text-rose-800">HTTP 狀態碼</th>
                  <th className="border border-rose-200 px-4 py-2 text-left font-bold text-rose-800">處理行為</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs">
                {[
                  ["400", "顯示 i18n 錯誤訊息 COMMON_MESSAGE_ERROR_400"],
                  ["401", "顯示 i18n 錯誤訊息 COMMON_MESSAGE_ERROR_401"],
                  ["403", "清除 App 狀態 → 自動或手動重新登入（依環境變數判斷）"],
                  ["404", "顯示 i18n 錯誤訊息 COMMON_MESSAGE_ERROR_404"],
                  ["413", "顯示 i18n 錯誤訊息 COMMON_MESSAGE_ERROR_413（檔案過大）"],
                  ["500", "顯示錯誤訊息 → router.push 至錯誤頁面"],
                  ["其他", "console.warn 未知錯誤 + 顯示 500 訊息"],
                ].map(([code, action]) => (
                  <tr key={code} className="even:bg-stone-50">
                    <td className="border border-stone-200 px-4 py-2 font-bold text-rose-700">{code}</td>
                    <td className="border border-stone-200 px-4 py-2 text-stone-600 font-sans">{action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-rose-50 rounded-lg p-5 border border-rose-200">
            <div className="text-sm font-bold text-rose-800 mb-3">成功回應同步清除 Loading</div>
            <CodeBlock code={AXIOS_RESPONSE_INTERCEPTOR_CODE} language="typescript" />
          </div>
        </div>

        {/* Step 4 - 公開方法 */}
        <div className="bg-white border-l-4 border-emerald-500 p-8 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold mb-2 text-slate-900">index.ts — 泛型 HTTP 方法</h3>
          <p className="text-stone-600 mb-6">
            透過 <code className="bg-stone-100 px-1 rounded text-sm">useInstanceMap</code> 讓業務層選擇對應實例，所有方法都使用 TypeScript 泛型確保型別安全。
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {[
              {
                name: "標準 CRUD",
                methods: ["FETCH<T>", "POST<T,R>", "PUT<T,R>", "DELETE<R>"],
                color: "border-emerald-400 bg-emerald-50",
                labelColor: "text-emerald-700",
              },
              {
                name: "Blob / 檔案",
                methods: ["DOWNLOAD", "DOWNLOADPOST", "BLOBPOST", "PRINTPOST"],
                color: "border-amber-400 bg-amber-50",
                labelColor: "text-amber-700",
              },
              {
                name: "FormData 上傳",
                methods: ["POSTFormData", "POSTFormDataWithDescription"],
                color: "border-blue-400 bg-blue-50",
                labelColor: "text-blue-700",
              },
              {
                name: "無 Loading 請求",
                methods: ["FETCHUnloading<T>"],
                color: "border-purple-400 bg-purple-50",
                labelColor: "text-purple-700",
              },
            ].map((group) => (
              <div key={group.name} className={`rounded-lg p-5 border-2 ${group.color}`}>
                <div className={`text-sm font-bold mb-3 ${group.labelColor}`}>{group.name}</div>
                <div className="flex flex-wrap gap-2">
                  {group.methods.map((m) => (
                    <code key={m} className="bg-white text-xs px-2 py-1 rounded border border-stone-200 font-mono">{m}</code>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-5 border-2 border-emerald-200">
            <div className="text-sm font-bold mb-3 text-emerald-900">業務層使用方式</div>
            <CodeBlock code={AXIOS_USAGE_CODE} language="typescript" />
          </div>
        </div>

        {/* 整體效益 */}
        <section className="bg-slate-900 text-white rounded-xl p-8">
          <h2 className="text-2xl font-black mb-6">這套設計帶來的好處</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🔒",
                title: "關注點分離",
                desc: "instance 建立 / 請求設定 / 回應處理 / 業務呼叫 各層獨立，改一處不影響其他層",
              },
              {
                icon: "📦",
                title: "擴展性高",
                desc: "新增微服務只需在 _instance.ts 新增一行，再到 _request / _response 掛上攔截器即可",
              },
              {
                icon: "🛡️",
                title: "統一錯誤處理",
                desc: "業務層不用寫 catch，所有 HTTP 錯誤都由 handleError 集中消化，包含自動登入與頁面跳轉",
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
