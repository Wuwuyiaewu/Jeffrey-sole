import CodeBlock from "@/components/CodeBlock";

const SWAGGER_SCRIPTS_CODE = `"swagger:ap":          "npx swagger-typescript-api generate
    -p https://ec-qas.deltaww.com/api/ap/v2/api-docs
    -o ./swagger -n ap.ts",

"swagger:auth":        "npx swagger-typescript-api generate
    -p https://ec-qas.deltaww.com/api/auth/v2/api-docs
    -o ./swagger -n auth.ts",

"swagger:quotation":   "npx swagger-typescript-api generate
    -p https://ec-qas.deltaww.com/api/quotation/v2/api-docs
    -o ./swagger -n quotation.ts",

"swagger:pcneol":      "npx swagger-typescript-api generate
    -p https://ec-qas.deltaww.com/api/pcneol/v2/api-docs
    -o ./swagger -n pcneol.ts",

"swagger:consignment": "npx swagger-typescript-api generate
    -p https://ec-qas.deltaww.com/api/consignment/v2/api-docs
    -o ./swagger -n consignment.ts",

"swagger:sampling":    "npx swagger-typescript-api generate
    -p http://localhost:8001/v2/api-docs
    -o ./swagger -n sampling.ts",

"swagger:all": "pnpm run swagger:pcneol && pnpm run swagger:quotation
    && pnpm run swagger:auth && pnpm run swagger:consignment
    && pnpm run swagger:ap && pnpm run swagger:sampling"`;

const SWAGGER_REQUEST_INTERFACE_CODE = `/** ConfirmedInvoiceQueryRequest */
export interface ConfirmedInvoiceQueryRequest {
  companyCode?: string;
  /** @format date */
  invoiceDateForm?: string;
  /** @format date */
  invoiceDateTo?: string;
  invoiceType?:
    | "NORMAL"
    | "CG"
    | "ERS"
    | "PPV";
  status?:
    | "ONE" | "TWO" | "THREE"
    | "FORE" | "FIVE" | "SIX"
    | "SEVEN" | "A" | "R" | "NA";
}`;

const SWAGGER_RESPONSE_INTERFACE_CODE = `/** ClearRemittedPaymentSearchResponse */
export interface
  ClearRemittedPaymentSearchResponse {
  paymentItemList?: PaymentItem[];
  totalAmountList?: TotalAmount[];
}

/** PaymentItem */
export interface PaymentItem {
  companyCode?: string;
  amount?: number;
  currency?: string;
  /** @format date */
  paymentDate?: string;
}`;

const SWAGGER_USAGE_CODE = `import type {
  ConfirmedInvoiceQueryRequest,
  ConfirmedInvoiceQueryResponse,
} from '@/swagger/ap'

// Request 型別約束 + Response 自動推導
const result = await POST<
  ConfirmedInvoiceQueryRequest,  // ← body 型別
  ConfirmedInvoiceQueryResponse  // ← 回傳型別
>(
  '/api/ap/confirmed-invoice/query',
  'apAPI',
  { companyCode: 'TW01', invoiceType: 'NORMAL' }
)

// result 已知是 ConfirmedInvoiceQueryResponse
// IDE 可以直接 autocomplete 所有欄位`;

const SWAGGER_BEFORE_CODE = `// 型別不明確，靠人工維護
const result = await POST<any, any>(
  '/api/ap/confirmed-invoice/query',
  'apAPI',
  { companyCode: 'TW01' }
)

// 欄位名稱打錯？
// 後端改欄位？ → 執行期才爆炸`;

const SWAGGER_AFTER_CODE = `import type {
  ConfirmedInvoiceQueryRequest
} from '@/swagger/ap'

// 型別完全從後端文件推導
const result = await POST<
  ConfirmedInvoiceQueryRequest,
  ConfirmedInvoiceQueryResponse
>(...)

// 後端改欄位 → 重跑 swagger:ap
// → TypeScript 立即標紅錯誤`;

export default function SwaggerPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="relative bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white py-10 overflow-hidden">
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
            <h1 className="text-6xl font-black mb-6 tracking-tight">Swagger 自動生成 API Client</h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              以 swagger-typescript-api 將後端 OpenAPI 文件轉換成 TypeScript 型別，消除手動維護介面的成本
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">

        {/* 架構總覽 */}
        <section className="bg-white rounded-xl shadow-sm border border-stone-200 p-8">
          <h2 className="text-2xl font-black text-slate-900 mb-2">工作流程總覽</h2>
          <p className="text-stone-500 mb-6">一條指令從後端 API 文件產生完整的 TypeScript 型別定義</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "後端 Swagger 文件", color: "bg-slate-500", desc: "後端以 Spring Boot 暴露 /v2/api-docs，描述所有 endpoint、request/response 結構" },
              { label: "swagger-typescript-api", color: "bg-emerald-500", desc: "讀取 OpenAPI JSON，依 schema 自動產生對應的 TypeScript interface 與 enum" },
              { label: "生成 .ts 型別檔", color: "bg-blue-500", desc: "每個微服務對應一個獨立的 .ts 檔（ap.ts、auth.ts、quotation.ts…）" },
              { label: "業務層引用", color: "bg-purple-500", desc: "Axios 的 FETCH<T>、POST<T,R> 等泛型方法直接引用生成的型別，享有完整型別保護" },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-stone-200 overflow-hidden">
                <div className={`${item.color} text-white px-4 py-2 text-sm font-bold`}>{item.label}</div>
                <div className="p-4">
                  <p className="text-xs text-stone-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Step 1 - package.json 腳本 */}
        <div className="bg-white border-l-4 border-emerald-500 p-8 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold mb-2 text-slate-900">package.json — 為每個微服務定義生成腳本</h3>
          <p className="text-stone-600 mb-6">
            專案共有六條微服務，每條都在 <code className="bg-stone-100 px-1 rounded text-sm">package.json</code> 對應一個 <code className="bg-stone-100 px-1 rounded text-sm">swagger:*</code> 腳本，一鍵更新全部則執行 <code className="bg-stone-100 px-1 rounded text-sm">swagger:all</code>。
          </p>
          <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 mb-6">
            <div className="text-sm font-bold text-stone-600 mb-3">package.json scripts</div>
            <CodeBlock code={SWAGGER_SCRIPTS_CODE} language="javascript" />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { flag: "-p", desc: "API 文件來源 URL（指向後端 /v2/api-docs）" },
              { flag: "-o", desc: "輸出目錄，統一放在專案根目錄的 ./swagger/" },
              { flag: "-n", desc: "輸出檔名，與微服務名稱一致方便辨識" },
            ].map((item) => (
              <div key={item.flag} className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <code className="text-emerald-700 font-bold text-sm">{item.flag}</code>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2 - 生成結果 */}
        <div className="bg-white border-l-4 border-blue-500 p-8 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold mb-2 text-slate-900">生成的 .ts 型別檔結構</h3>
          <p className="text-stone-600 mb-6">
            工具依 Swagger schema 自動產生 <code className="bg-stone-100 px-1 rounded text-sm">interface</code>、<code className="bg-stone-100 px-1 rounded text-sm">enum</code> 及型別別名，所有欄位都帶有 JSDoc 格式（包含 <code className="bg-stone-100 px-1 rounded text-sm">@format</code>），讓 IDE 能直接提示型別來源。
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-bold text-stone-500 mb-3">Request Interface 範例</div>
              <CodeBlock code={SWAGGER_REQUEST_INTERFACE_CODE} language="typescript" />
            </div>
            <div>
              <div className="text-sm font-bold text-stone-500 mb-3">Response Interface 範例</div>
              <CodeBlock code={SWAGGER_RESPONSE_INTERFACE_CODE} language="typescript" />
            </div>
          </div>
          <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-sm font-bold text-blue-800 mb-2">生成的微服務型別檔一覽</div>
            <div className="flex flex-wrap gap-2">
              {["ap.ts", "auth.ts", "consignment.ts", "pcneol.ts", "quotation.ts", "sampling.ts"].map((file) => (
                <code key={file} className="bg-white text-blue-700 text-xs px-3 py-1 rounded border border-blue-200 font-mono">{file}</code>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3 - 與 Axios 整合 */}
        <div className="bg-white border-l-4 border-purple-500 p-8 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold mb-2 text-slate-900">與 Axios 泛型方法整合</h3>
          <p className="text-stone-600 mb-6">
            生成的型別直接帶入 Axios 的泛型方法，Request 與 Response 都有完整的型別推導，編譯期就能發現欄位錯誤。
          </p>
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-5 border-2 border-purple-200 mb-6">
            <div className="text-sm font-bold mb-3 text-purple-900">業務層使用方式</div>
            <CodeBlock code={SWAGGER_USAGE_CODE} language="typescript" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-red-50 rounded-lg p-5 border-2 border-red-200">
              <div className="text-sm font-bold text-red-700 mb-3">未使用 Swagger 型別</div>
              <CodeBlock code={SWAGGER_BEFORE_CODE} language="typescript" />
              <div className="text-red-600 mt-3 text-sm font-bold">型別不安全，維護成本高</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-5 border-2 border-purple-500">
              <div className="text-sm font-bold text-purple-700 mb-3">使用 Swagger 生成型別</div>
              <CodeBlock code={SWAGGER_AFTER_CODE} language="typescript" />
              <div className="text-purple-700 mt-3 text-sm font-bold">編譯期型別保護，自動同步</div>
            </div>
          </div>
        </div>

        {/* Step 4 - 更新流程 */}
        <div className="bg-white border-l-4 border-amber-500 p-8 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold mb-2 text-slate-900">後端 API 更新時的協作流程</h3>
          <p className="text-stone-600 mb-6">
            後端更新 API 後，前端只需一條指令重新生成型別，TypeScript 編譯器會自動標示所有需要調整的地方。
          </p>
          <div className="space-y-3">
            {[
              { step: "1", color: "bg-slate-700", label: "後端部署新版 API 至 QAS 環境", desc: "後端將 /v2/api-docs 更新，新增、修改或移除 endpoint 與 schema" },
              { step: "2", color: "bg-emerald-600", label: "前端執行 pnpm run swagger:all", desc: "一條指令重新抓取所有微服務的 API 文件，覆蓋 ./swagger/ 目錄下的型別檔" },
              { step: "3", color: "bg-blue-600", label: "TypeScript 編譯器標示差異", desc: "若後端改了欄位名稱或型別，IDE 立即在使用處顯示紅線，快速定位需要調整的程式碼" },
              { step: "4", color: "bg-purple-600", label: "修正業務層程式碼", desc: "依 TypeScript 錯誤逐一修正，不需要人工比對 API 文件，大幅降低遺漏風險" },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4 p-4 bg-stone-50 rounded-lg border border-stone-200">
                <div className={`flex-shrink-0 w-8 h-8 ${item.color} text-white rounded-full flex items-center justify-center text-sm font-bold`}>{item.step}</div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">{item.label}</div>
                  <div className="text-xs text-stone-500 mt-1 leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 整體效益 */}
        <section className="bg-slate-900 text-white rounded-xl p-8">
          <h2 className="text-2xl font-black mb-6">這套設計帶來的好處</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "⚡",
                title: "消除手動維護型別",
                desc: "六個微服務的 Request / Response 型別全由工具自動生成，後端改文件前端只需重跑指令，不再手寫 interface",
              },
              {
                icon: "🛡️",
                title: "編譯期型別安全",
                desc: "Axios 泛型方法與生成型別結合，欄位名稱錯誤、型別不符在 build 階段就會報錯，而非在 production 才爆炸",
              },
              {
                icon: "📐",
                title: "統一多服務型別管理",
                desc: "所有型別集中在 ./swagger/ 目錄，命名與微服務一一對應，新人能快速找到每個 API 對應的型別來源",
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
