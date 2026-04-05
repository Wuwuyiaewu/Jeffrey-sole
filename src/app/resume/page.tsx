import Link from "next/link";

type SkillItem = { name: string; href?: string };

const TECH_SKILLS: { category: string; items: SkillItem[] }[] = [
  {
    category: "核心框架",
    items: [
      { name: "Vue 3 (Composition API, <script setup>)" },
      { name: "TypeScript (Strict Mode)" },
      { name: "Vue Router 4" },
    ],
  },
  {
    category: "狀態管理",
    items: [
      { name: "Pinia (多模組架構)",                     href: "/experience/state-management/pinia" },
      { name: "TanStack Vue Query (伺服器狀態快取)",     href: "/experience/tanstack-query" },
    ],
  },
  {
    category: "UI / 樣式",
    items: [
      { name: "Element Plus",        href: "/experience/package-usage/element-plus" },
      { name: "PrimeVue 3",          href: "/experience/package-usage/primevue" },
      { name: "UnoCSS (原子化 CSS)" },
      { name: "Sass/SCSS (BEM 命名)" },
    ],
  },
  {
    category: "表單處理",
    items: [
      { name: "TanStack Vue Form",       href: "/experience/tanstack-form" },
      { name: "VeeValidate + Yup",            href: "/experience/validate" },
      { name: "Config-Driven 動態表單",   href: "/experience/config-drive" },
    ],
  },
  {
    category: "API 整合",
    items: [
      { name: "Axios (多實例 + Interceptors)",            href: "/experience/api-integration/axios" },
      { name: "Swagger TypeScript API (OpenAPI 自動生成)", href: "/experience/api-integration/swagger" },
      { name: "Azure MSAL Browser (SSO)",                 href: "/experience/api-integration/azure-msal" },
    ],
  },
  {
    category: "資料視覺化",
    items: [
      { name: "Vue ECharts",       href: "/experience/data-visualization/echarts" },
      { name: "Chart.js",          href: "/experience/data-visualization/echarts" },
      { name: "vis-network (關聯圖)", href: "/experience/data-visualization/vis-network" },
    ],
  },
  {
    category: "建置工具",
    items: [
      { name: "Vite (多環境打包)", href: "/experience/dev-setup/vite" },
      { name: "Vite SSG",          href: "/experience/dev-setup/vite" },
      { name: "pnpm" },
      { name: "unplugin-auto-import", href: "/experience/package-usage/element-plus/auto-import" },
    ],
  },
  {
    category: "測試",
    items: [
      { name: "Vitest",        href: "/experience/testing/vitest" },
      { name: "Cypress (E2E)", href: "/experience/testing/cypress" },
      { name: "happy-dom" },
    ],
  },
  {
    category: "程式碼品質",
    items: [
      { name: "ESLint",             href: "/experience/environment-setup/eslint" },
      { name: "Stylelint",          href: "/experience/environment-setup/stylelint" },
      { name: "Prettier",           href: "/experience/environment-setup/prettier" },
      { name: "Husky + lint-staged", href: "/experience/environment-setup/husky" },
      { name: "JSDoc 文件規範" },
    ],
  },
  {
    category: "工具函式庫",
    items: [
      { name: "VueUse",                href: "/experience/utilities/vueuse" },
      { name: "Day.js / date-and-time" },
      { name: "ExcelJS + XLSX",        href: "/experience/utilities/excel" },
      { name: "html2canvas + jsPDF",   href: "/experience/utilities/pdf" },
      { name: "vue-i18n (三語系)",      href: "/experience/utilities/i18n" },
      { name: "vuedraggable" },
    ],
  },
];

const ARCHITECTURE_HIGHLIGHTS = [
  {
    title: "Config-Driven UI 模式",
    description:
      "透過 field-config.ts + table-config.ts 定義 UI 配置，TypeScript 判別聯合型別（Discriminated Unions）確保型別安全，可從設定檔動態生成整個表單／表格，無需手動撰寫每個元件。",
    tags: ["TypeScript", "Discriminated Unions", "動態表單"],
  },
  {
    title: "Component Adapter 模式",
    description:
      "建立 StaticTextAdapter、InputAdapter、SelectAdapter、FileUploadAdapter 等適配層，包裝底層 Element Plus 控制項，達到 UI 元件可替換、高度彈性的設計。",
    tags: ["Adapter Pattern", "Element Plus", "解耦設計"],
  },
  {
    title: "自訂 Composables（16+ 個）",
    description:
      "業務邏輯抽取：表單驗證、分頁處理、Excel 操作、API 請求管理；覆蓋 AP、PCNEOL、Sampling 等領域邏輯，從 UI 層完整分離，提升可測試性與複用性。",
    tags: ["Composition API", "邏輯抽離", "可測試性"],
  },
  {
    title: "多服務模組化架構",
    description:
      "8+ 個獨立 Service 模組對應不同後端領域（AP、Auth、Consignment、Quotation、PCNEOL、Sampling、Vendor），搭配 dev / qas / production 三層環境分層配置。",
    tags: ["微服務整合", "環境分層", "模組化"],
  },
  {
    title: "Swagger 自動化 API Client",
    description:
      "串接多個後端服務的 OpenAPI 規格，自動生成 TypeScript Client，消除手動定義型別的風險，確保前後端介面一致性。跨三個專案持續應用此架構。",
    tags: ["OpenAPI", "Swagger", "型別安全"],
  },
  {
    title: "企業級資料視覺化",
    description:
      "整合 Vue ECharts、Chart.js 實作多種圖表，搭配 vis-network 建構風險關聯圖（節點與邊的互動式圖形），支援動態節點篩選與展開。",
    tags: ["ECharts", "vis-network", "互動圖表"],
  },
];

type WorkExperience = {
  role: string;
  company: string;
  period: string;
  projectTitle: string;
  projectDesc: string;
  achievements: { text: string; detail: string }[];
  techStack: string[];
};

const WORK_EXPERIENCES: WorkExperience[] = [
  {
    role: "前端工程師",
    company: "[待補充：公司名稱]",
    period: "[待補充：在職期間]",
    projectTitle: "企業級 EC 採購系統（Vue 3 + TypeScript）",
    projectDesc:
      "企業內部採購管理平台，整合 8 個以上後端微服務，支援報價、委寄、採樣、廠商管理等核心業務流程，具備繁中、英文、簡中三語切換。",
    achievements: [
      {
        text: "設計 Config-Driven UI 架構",
        detail:
          "透過 field-config.ts / table-config.ts 配置驅動表單與表格生成，搭配 TypeScript Discriminated Unions 確保型別安全",
      },
      {
        text: "建立 Swagger 自動生成 API Client 流程",
        detail:
          "串接 6 個後端服務的 OpenAPI 規格，自動生成 TypeScript Client，消除手動定義型別的風險",
      },
      {
        text: "導入 TanStack Vue Query 伺服器狀態管理",
        detail:
          "設計 5 分鐘 staleTime 快取策略，整合 vue-i18n 進行全域錯誤處理",
      },
      {
        text: "開發 16+ 個自訂 Composables",
        detail:
          "將表單驗證、分頁邏輯、Excel 操作及 AP、PCNEOL、Sampling 等業務領域邏輯從 UI 層抽離，提升可測試性與複用性",
      },
      {
        text: "建立 Component Adapter 模式",
        detail:
          "開發 StaticTextAdapter、InputAdapter、SelectAdapter、FileUploadAdapter 等適配層，實現底層 UI 庫可替換設計",
      },
      {
        text: "實現前端複雜 Excel 報表功能",
        detail:
          "整合 ExcelJS 與 XLSX，支援複雜格式報表的生成與解析，滿足企業採購作業的資料匯出需求",
      },
      {
        text: "建置完整程式碼品質工具鏈",
        detail:
          "配置 ESLint、Stylelint、Prettier、Husky + lint-staged，確保每次 Commit 自動執行 Lint 檢查",
      },
      {
        text: "完成三語系國際化系統",
        detail:
          "以 vue-i18n 實現繁中 / 英文 / 簡中切換，並同步 Element Plus 元件本地化設定",
      },
    ],
    techStack: [
      "Vue 3",
      "TypeScript",
      "Pinia",
      "TanStack Vue Query",
      "TanStack Vue Form",
      "Element Plus",
      "UnoCSS",
      "Vite",
      "Axios",
      "Swagger TypeScript API",
      "vue-i18n",
      "Vitest",
      "Husky",
    ],
  },
  {
    role: "前端工程師",
    company: "[待補充：公司名稱]",
    period: "[待補充：在職期間]",
    projectTitle: "國泰 CRC 風險管理系統（Vue 3 + TypeScript）",
    projectDesc:
      "企業風險控管平台，涵蓋客戶風險、表單風險、風險概覽、風險關聯圖等核心功能模組，整合多維度資料視覺化與複雜關聯圖展示。",
    achievements: [
      {
        text: "實作互動式風險關聯圖",
        detail:
          "使用 vis-network 建構節點與邊的互動式風險關聯圖（riskRelationship），支援動態節點展開與篩選",
      },
      {
        text: "整合多元資料視覺化",
        detail:
          "結合 Vue ECharts 與 Chart.js 實作風險概覽（riskOverview）的多種圖表，呈現風險趨勢與分布",
      },
      {
        text: "前端 PDF / Excel 報表匯出",
        detail:
          "整合 html2canvas + jsPDF 實現頁面截圖轉 PDF，搭配 XLSX 支援資料表匯出功能",
      },
      {
        text: "建立 Swagger 自動生成 API Client",
        detail:
          "串接後端 OpenAPI 規格自動生成 TypeScript Client，確保型別安全一致性",
      },
      {
        text: "多模組業務系統開發",
        detail:
          "負責 customerRisk、formRisk、platformManagement、riskCommunication 等功能模組的前端開發與維護",
      },
      {
        text: "表單驗證系統整合",
        detail:
          "以 VeeValidate + Yup schema 實現複雜業務表單的前端驗證，確保資料完整性",
      },
    ],
    techStack: [
      "Vue 3",
      "TypeScript",
      "Pinia",
      "PrimeVue 3",
      "Axios",
      "Swagger TypeScript API",
      "Vue ECharts",
      "Chart.js",
      "vis-network",
      "VeeValidate",
      "Yup",
      "html2canvas",
      "jsPDF",
      "XLSX",
      "Day.js",
      "Lodash",
    ],
  },
  {
    role: "前端工程師",
    company: "[待補充：公司名稱]",
    period: "[待補充：在職期間]",
    projectTitle: "雨林資料中心管理平台（Vue 3 + TypeScript）",
    projectDesc:
      "企業電商資料中心管理系統，涵蓋電商路徑、商品資訊、排程活動、管理設定等模組，支援 Azure AD SSO 單一登入，並具備完整的多環境部署流程（dev / sit / uat / production）。",
    achievements: [
      {
        text: "整合 Azure MSAL Browser 實現 SSO 單一登入",
        detail:
          "串接 Azure Active Directory，實現企業級 OAuth 2.0 / OIDC 認證流程，支援 SSOLoginView 自動導向",
      },
      {
        text: "建立多環境分層部署配置",
        detail:
          "配置 dev / sit / sit2 / uat / production 五層環境，每層獨立 .env 設定，對應不同後端服務 URL",
      },
      {
        text: "導入 Cypress E2E 測試 + Vitest 單元測試",
        detail:
          "建立完整測試金字塔，Cypress 負責端對端流程驗證，Vitest 負責業務邏輯單元測試",
      },
      {
        text: "實作拖曳排序功能",
        detail:
          "使用 vuedraggable 實現排程活動（schedule-activity）等模組的列表拖曳排序互動",
      },
      {
        text: "建立嚴格的專案開發規範",
        detail:
          "制定檔案命名規則（BEM / kebab-case）、JSDoc 文件標準、模組分層架構（api/models/composables/stores），確保大型團隊協作一致性",
      },
      {
        text: "PDF 報表生成功能",
        detail:
          "整合 html2canvas + html2pdf.js 實現複雜頁面內容的 PDF 匯出功能",
      },
    ],
    techStack: [
      "Vue 3",
      "TypeScript",
      "Pinia",
      "PrimeVue 3",
      "PrimeFlex",
      "Axios",
      "Swagger TypeScript API",
      "Azure MSAL Browser",
      "VeeValidate",
      "Yup",
      "VueUse",
      "vuedraggable",
      "Vitest",
      "Cypress",
      "Husky",
      "html2canvas",
      "jsPDF",
    ],
  },
];

const PROJECT_SCALE = [
  { label: "Composables", value: "16+" },
  { label: "Pinia Store 模組", value: "7" },
  { label: "Service 模組", value: "8+" },
  { label: "主要功能模組", value: "8" },
  { label: "支援語言", value: "3 種" },
  { label: "Swagger 自動生成 API", value: "6 個" },
];

export default function ResumePage() {
  return (
    <main className="p-8 bg-white dark:bg-neutral-900 text-black dark:text-white min-h-screen max-w-4xl">
      {/* Professional Summary */}
      <section id="summary" className="mb-16 scroll-mt-16">
        <h1 className="text-3xl font-bold mb-2">前端工程師</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
          Frontend Engineer — Vue 3 / TypeScript / Enterprise Systems
        </p>
        <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 p-5 rounded-r-lg">
          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
            具備前端開發經驗的工程師，專注於{" "}
            <strong>Vue 3 / TypeScript</strong>{" "}
            企業級系統開發。熟悉從架構設計到功能交付的完整開發流程，擅長設計{" "}
            <strong>Config-Driven UI</strong>、<strong>Component Adapter</strong>{" "}
            等可擴展架構模式。具備企業級多語系、多服務 API
            整合、資料視覺化、SSO 認證及複雜表單系統的實戰經驗，並具備完整的 CI/CD 程式碼品質工具鏈建置能力。
          </p>
        </div>
      </section>

      {/* Work Experience */}
      <section id="experience" className="mb-16 scroll-mt-16">
        <h2 className="text-2xl font-bold mb-8 pb-2 border-b border-neutral-200 dark:border-neutral-700">
          工作經歷
        </h2>

        <div className="space-y-12">
          {WORK_EXPERIENCES.map((exp, idx) => (
            <div key={exp.projectTitle} className="relative">
              {/* Timeline indicator */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                <h3 className="text-xl font-semibold">{exp.role}</h3>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  {exp.period}
                </span>
              </div>
              <p className="text-blue-600 dark:text-blue-400 font-medium mb-4">
                {exp.company}
              </p>

              {/* Project title */}
              <div className="mb-4">
                <h4 className="font-semibold text-lg mb-1">
                  {exp.projectTitle}
                </h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  {exp.projectDesc}
                </p>
              </div>

              {/* Achievements */}
              <ul className="space-y-3">
                {exp.achievements.map((item) => (
                  <li key={item.text} className="flex gap-3">
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-blue-500" />
                    <div>
                      <span className="font-medium">{item.text}</span>
                      <span className="text-neutral-600 dark:text-neutral-400">
                        {" "}
                        — {item.detail}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Tech stack tags */}
              <div className="mt-5 flex flex-wrap gap-2">
                {exp.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded text-xs font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* EC project scale stats (first project only) */}
              {idx === 0 && (
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {PROJECT_SCALE.map((item) => (
                    <div
                      key={item.label}
                      className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg text-center"
                    >
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {item.value}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Divider between experiences */}
              {idx < WORK_EXPERIENCES.length - 1 && (
                <div className="mt-12 border-b border-dashed border-neutral-200 dark:border-neutral-700" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Technical Skills */}
      <section id="skills" className="mb-16 scroll-mt-16">
        <h2 className="text-2xl font-bold mb-8 pb-2 border-b border-neutral-200 dark:border-neutral-700">
          技術技能
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TECH_SKILLS.map((group) => (
            <div
              key={group.category}
              className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg"
            >
              <h3 className="font-semibold text-sm text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item) =>
                  item.href ? (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 rounded text-xs hover:bg-blue-100 dark:hover:bg-blue-900/60 hover:underline transition-colors"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <span
                      key={item.name}
                      className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 rounded text-xs opacity-60"
                    >
                      {item.name}
                    </span>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture Highlights */}
      <section id="architecture" className="mb-16 scroll-mt-16">
        <h2 className="text-2xl font-bold mb-8 pb-2 border-b border-neutral-200 dark:border-neutral-700">
          架構設計亮點
        </h2>

        <div className="space-y-4">
          {ARCHITECTURE_HIGHLIGHTS.map((item) => (
            <div
              key={item.title}
              className="group p-5 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
            >
              <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 leading-relaxed">
                {item.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
