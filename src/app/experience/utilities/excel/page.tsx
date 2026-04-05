import CodeBlock from "@/components/CodeBlock";

const EXCEL_IMPORT_WORKBOOK_CODE = `export async function importExcelWorkbook(
  file: File
): Promise<ExcelJS.Workbook> {
  const buffer = await file.arrayBuffer()
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(buffer)
  return workbook
}`;

const EXCEL_WORKSHEET_JSON_CODE = `// 回傳 { data, headersMap }
// headersMap: { 0: '名稱', 1: '數量', ... }
// data: [{ 0: 'A', 1: 10 }, ...]

const { data, headersMap } =
  worksheetToIndexedJson(sheet)

// 搭配 validateExcelData 做欄位驗證`;

const EXCEL_PARSE_JSON_CODE = `// 第一列自動作為 key，後續列作為值
const jsonData = await parseExcelToJson(file)
// => [{ 名稱: 'A零件', 數量: 10, 單價: 50 }, ...]`;

const EXCEL_GENERATE_HEADER_CODE = `// ExcelHeader 為 enum，值為 i18n key
// e.g. ExcelHeader.partName = 'PART_NAME'
const headerMap = generateHeaderMap(
  data,
  ExcelHeader
)
// => { partName: '零件名稱', qty: '數量' }`;

const EXCEL_MULTI_SHEET_CODE = `await exportToMultiSheetExcel([
  {
    name: '零件清單',
    data: partList,
    headerMap: generateHeaderMap(
      partList, PartHeader
    ),
  },
  {
    name: '供應商',
    data: vendorList,
    headerMap: generateHeaderMap(
      vendorList, VendorHeader
    ),
  },
], '匯出報表.xlsx')`;

const EXCEL_VALIDATE_CODE = `const errors = validateExcelData(
  data,
  headersMap,
  [
    {
      columnIndex: 0,
      validate: (v) => !!v,
      errorMessage: '名稱不得為空',
    },
    {
      columnIndex: 1,
      validate: (v) => !isNaN(Number(v)),
    },
  ]
)
// errors: ['第 3 列的「數量」欄位為空或格式錯誤']`;

const EXCEL_FILE_UPLOAD_CODE = `<FileUpload
  remoteSide="localPostFile"
  uploadUrl="/api/file/upload"
  contentType="multipart/form-data"
  accept=".xlsx"
  :sizeLimit="10"
  :validateLimit="5"
  @update:uploadRef="onExcelParsed"
  @update:uploadUuid="onUploaded"
/>

// 父層接收解析後的 JSON
const onExcelParsed = (json: ExcelSheetJson) => {
  // json 已是由 ExcelJS 轉換好的結構化資料
  validateExcelData(json.data, json.headersMap, rules)
}`;

export default function ExcelPage() {
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
              <span className="text-sm font-medium tracking-wide">Utility — Excel 處理</span>
            </div>
            <h1 className="text-6xl font-black mb-6 tracking-tight">ExcelJS + XLSX</h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              封裝 Excel 匯入解析、多 Sheet 匯出樣式、欄位驗證，整合 Element Plus 上傳元件
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">

        {/* 架構總覽 */}
        <section className="bg-white rounded-xl shadow-sm border border-stone-200 p-8">
          <h2 className="text-2xl font-black text-slate-900 mb-2">架構總覽</h2>
          <p className="text-stone-500 mb-6">將 Excel 操作拆成四個職責清晰的模組</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Import 匯入", color: "bg-blue-500", desc: "將 .xlsx 檔案讀入為 ExcelJS Workbook，轉換成 JSON 陣列供業務層使用" },
              { label: "Export 匯出", color: "bg-emerald-500", desc: "支援多 Sheet、i18n headerMap、標題背景色、字體、欄寬等完整樣式設定" },
              { label: "Validate 驗證", color: "bg-rose-500", desc: "逐列逐欄對資料做必填 / 格式 / 欄位名稱一致性等多層驗證" },
              { label: "FileUpload 整合", color: "bg-purple-500", desc: "封裝 Element Plus el-upload，beforeUpload hook 自動轉 JSON 並 emit 至父層" },
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

        {/* Step 1 — 匯入解析 */}
        <div className="bg-white border-l-4 border-blue-500 p-8 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold mb-2 text-slate-900">匯入 — importExcelWorkbook & parseExcelToJson</h3>
          <p className="text-stone-600 mb-6">
            先用 <code className="bg-stone-100 px-1 rounded text-sm">File.arrayBuffer()</code> 取得二進位資料，再透過 ExcelJS 載入 Workbook，最後逐列轉為 JSON 陣列。
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 rounded-lg p-5 border-2 border-blue-200">
              <div className="text-sm font-bold text-blue-700 mb-3">importExcelWorkbook — 取得 Workbook</div>
              <CodeBlock code={EXCEL_IMPORT_WORKBOOK_CODE} language="typescript" />
            </div>
            <div className="bg-blue-50 rounded-lg p-5 border-2 border-blue-200">
              <div className="text-sm font-bold text-blue-700 mb-3">worksheetToIndexedJson — 保留欄位對應表</div>
              <CodeBlock code={EXCEL_WORKSHEET_JSON_CODE} language="javascript" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200">
            <div className="text-sm font-bold mb-3 text-blue-900">parseExcelToJson — 直接轉為具名 key JSON</div>
            <CodeBlock code={EXCEL_PARSE_JSON_CODE} language="javascript" />
          </div>
        </div>

        {/* Step 2 — 多 Sheet 匯出 */}
        <div className="bg-white border-l-4 border-emerald-500 p-8 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold mb-2 text-slate-900">匯出 — exportToMultiSheetExcel + generateHeaderMap</h3>
          <p className="text-stone-600 mb-6">
            透過 <code className="bg-stone-100 px-1 rounded text-sm">SheetInput[]</code> 一次定義多張工作表，<code className="bg-stone-100 px-1 rounded text-sm">headerMap</code> 支援 i18n key 動態對應欄位顯示名稱。
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-emerald-50 rounded-lg p-5 border-2 border-emerald-200">
              <div className="text-sm font-bold text-emerald-700 mb-3">generateHeaderMap — 自動產生 headerMap</div>
              <CodeBlock code={EXCEL_GENERATE_HEADER_CODE} language="typescript" />
            </div>
            <div className="bg-emerald-50 rounded-lg p-5 border-2 border-emerald-200">
              <div className="text-sm font-bold text-emerald-700 mb-3">多 Sheet 匯出呼叫方式</div>
              <CodeBlock code={EXCEL_MULTI_SHEET_CODE} language="typescript" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border-2 border-emerald-200">
            <div className="text-sm font-bold mb-3 text-emerald-900">addDataToSheet — 套用的樣式設定</div>
            <div className="grid md:grid-cols-3 gap-3">
              {[
                { label: "標題列背景", desc: "fgColor: FFF2CC（淺黃），僅第 1 列套用" },
                { label: "字體", desc: "Times New Roman + bold，靠右對齊、垂直置中" },
                { label: "數字格式", desc: "整數 → '0'，小數 → '0.###'，文字 → '@'" },
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-lg p-3 border border-emerald-200">
                  <div className="font-bold text-emerald-800 text-sm mb-1">{item.label}</div>
                  <div className="text-xs text-stone-500">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3 — 驗證 */}
        <div className="bg-white border-l-4 border-rose-500 p-8 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold mb-2 text-slate-900">驗證 — validateExcelData & 欄位名稱檢查</h3>
          <p className="text-stone-600 mb-6">
            搭配 <code className="bg-stone-100 px-1 rounded text-sm">ColumnRule[]</code> 定義每欄的驗證邏輯，並提供欄位名稱存在性、空白欄位頭、必填 Frontend/Backend 群組等多層驗證。
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-rose-50 rounded-lg p-5 border-2 border-rose-200">
              <div className="text-sm font-bold text-rose-700 mb-3">validateExcelData — 逐列逐欄驗證</div>
              <CodeBlock code={EXCEL_VALIDATE_CODE} language="typescript" />
            </div>
            <div className="bg-rose-50 rounded-lg p-5 border-2 border-rose-200">
              <div className="text-sm font-bold text-rose-700 mb-3">其他驗證工具函式</div>
              <div className="space-y-3 text-xs">
                {[
                  { fn: "validateExistingKeys", desc: "檢查資料中是否出現未定義的欄位 key，或重複出現的欄位（後綴 _1, _2...）" },
                  { fn: "validateEmptyKeys", desc: "偵測 __EMPTY 開頭的 key（代表 Excel 有無標題欄位），收集錯誤原因" },
                  { fn: "validateEndRequiredKeys", desc: "支援 Frontend / Backend 群組必填邏輯：只要其中一組有資料就必須填齊整組" },
                ].map((item) => (
                  <div key={item.fn} className="bg-white rounded p-3 border border-rose-100">
                    <code className="text-rose-700 font-mono font-bold">{item.fn}</code>
                    <p className="text-stone-500 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step 4 — FileUpload 整合 */}
        <div className="bg-white border-l-4 border-purple-500 p-8 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold mb-2 text-slate-900">FileUpload 元件 — beforeUpload 自動解析</h3>
          <p className="text-stone-600 mb-6">
            封裝 Element Plus <code className="bg-stone-100 px-1 rounded text-sm">el-upload</code>，在 <code className="bg-stone-100 px-1 rounded text-sm">beforeUpload</code> hook 中自動完成副檔名驗證、大小限制、ExcelJS 解析並 emit 至父層。
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-purple-50 rounded-lg p-5 border-2 border-purple-200">
              <div className="text-sm font-bold text-purple-700 mb-3">beforeUpload 流程</div>
              <div className="space-y-2 text-xs">
                {[
                  "1. 計算檔案大小（MB）",
                  "2. 驗證副檔名是否在 accept 清單內",
                  "3. 超過 sizeLimit → 阻擋並顯示錯誤",
                  "4. 超過 validateLimit → 顯示警告並 emit",
                  "5. .xlsx → importExcelWorkbook + convertWorkbookToJson",
                  "6. emit('update:uploadRef', jsonData) 傳給父層",
                ].map((step) => (
                  <div key={step} className="flex items-start gap-2">
                    <span className="text-purple-400 mt-0.5">▸</span>
                    <span className="text-stone-600">{step}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-5 border-2 border-purple-200">
              <div className="text-sm font-bold text-purple-700 mb-3">Props 設計</div>
              <div className="space-y-2">
                {[
                  { prop: "remoteSide", desc: "選擇上傳行為：ecQasPostFile / localPostFile" },
                  { prop: "sizeLimit", desc: "阻擋上傳的大小上限（MB），預設 10" },
                  { prop: "validateLimit", desc: "超過此大小顯示警告並 emit 提示父層" },
                  { prop: "accept", desc: "允許的副檔名，預設 .xlsx" },
                  { prop: "drag", desc: "是否啟用拖曳上傳模式" },
                ].map((item) => (
                  <div key={item.prop} className="flex gap-2 text-xs">
                    <code className="text-purple-700 font-mono font-bold flex-shrink-0">{item.prop}</code>
                    <span className="text-stone-500">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5 border-2 border-purple-200">
            <div className="text-sm font-bold mb-3 text-purple-900">父層使用方式</div>
            <CodeBlock code={EXCEL_FILE_UPLOAD_CODE} language="html" />
          </div>
        </div>

        {/* 整體效益 */}
        <section className="bg-slate-900 text-white rounded-xl p-8">
          <h2 className="text-2xl font-black mb-6">這套設計帶來的好處</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "職責分離",
                desc: "Import / Export / Validate / UI 元件各自獨立，業務層只需呼叫對應函式，不需了解 ExcelJS API 細節",
              },
              {
                title: "i18n 無縫整合",
                desc: "generateHeaderMap 透過 enum → i18n key 映射，匯出欄位名稱自動跟著語系切換，不需手動維護多份欄位名稱",
              },
              {
                title: "前端驗證提前攔截",
                desc: "在 beforeUpload 就完成格式驗證與 JSON 解析，錯誤即時顯示給使用者，減少無效的 API 請求",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white/10 rounded-lg p-5">
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
