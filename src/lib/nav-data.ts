export type NavItem = {
  name: string;
  href: string;
  category: string;
};

export type ExperienceSection = {
  stage: number;
  title: string;
  enTitle: string;
  description: string;
  items: { name: string; href: string }[];
};

export const EXPERIENCE_SECTIONS: ExperienceSection[] = [
  {
    stage: 1,
    title: "數位骨架與美學感知",
    enTitle: "Foundations",
    description: "HTML5 語義化、CSS3 佈局、Tailwind CSS、響應式設計的工程基礎",
    items: [
      { name: "Tailwind CSS 實戰", href: "/experience/dev-setup/tailwind" },
    ],
  },
  {
    stage: 2,
    title: "動態邏輯與工程化",
    enTitle: "JavaScript & Logic",
    description: "Vite 現代化建置工具鏈、TypeScript 型別安全、ESLint / Prettier / Husky 品質守門",
    items: [
      { name: "Vite 建置工具", href: "/experience/dev-setup/vite" },
      { name: "ESLint", href: "/experience/environment-setup/eslint" },
      { name: "Stylelint", href: "/experience/environment-setup/stylelint" },
      { name: "Prettier", href: "/experience/environment-setup/prettier" },
      { name: "Husky + lint-staged", href: "/experience/environment-setup/husky" },
    ],
  },
  {
    stage: 3,
    title: "組件化與現代框架",
    enTitle: "Framework & Ecosystem",
    description: "Vue 3 / Pinia 狀態管理、Element Plus / PrimeVue 套件整合與二次封裝、Config-Driven 設計模式",
    items: [
      { name: "Pinia 多模組架構", href: "/experience/state-management/pinia" },
      { name: "Element Plus 總覽", href: "/experience/package-usage/element-plus" },
      { name: "Element Plus — Auto Import", href: "/experience/package-usage/element-plus/auto-import" },
      { name: "Element Plus — Form", href: "/experience/package-usage/element-plus/form" },
      { name: "Element Plus — Table", href: "/experience/package-usage/element-plus/table" },
      { name: "Element Plus — Theme", href: "/experience/package-usage/element-plus/theme" },
      { name: "PrimeVue 總覽", href: "/experience/package-usage/primevue" },
      { name: "PrimeVue — DataTable", href: "/experience/package-usage/primevue/datatable" },
      { name: "PrimeVue — Pass Through", href: "/experience/package-usage/primevue/pass-through" },
      { name: "PrimeVue — Theme", href: "/experience/package-usage/primevue/theme" },
      { name: "PrimeVue — Toast", href: "/experience/package-usage/primevue/toast" },
      { name: "Config-Driven 靜態渲染", href: "/experience/config-drive" },
      { name: "動態屬性設定", href: "/experience/dynamic-attributes" },
      { name: "元件排版", href: "/experience/component-layout" },
      { name: "元件動畫互動", href: "/blog" },
    ],
  },
  {
    stage: 4,
    title: "數據流與高效能整合",
    enTitle: "Data & Integration",
    description: "TanStack 生態系（Table / Query / Form）、Axios 多實例、Swagger 自動生成、Azure MSAL SSO 認證",
    items: [
      { name: "TanStack Table 實作", href: "/experience/tanstack-table" },
      { name: "TanStack Query 實作", href: "/experience/tanstack-query" },
      { name: "TanStack Form 實作", href: "/experience/tanstack-form" },
      { name: "VeeValidate + Yup 表單驗證", href: "/experience/validate" },
      { name: "Axios 多實例設計", href: "/experience/api-integration/axios" },
      { name: "Swagger 自動生成 API Client", href: "/experience/api-integration/swagger" },
      { name: "Azure MSAL SSO 認證", href: "/experience/api-integration/azure-msal" },
    ],
  },
  {
    stage: 5,
    title: "視覺化與進階工具",
    enTitle: "Visualization & Utilities",
    description: "ECharts / vis-network 資料視覺化、3D 技能圖譜、VueUse、Excel / PDF 匯出、vue-i18n 多語系",
    items: [
      { name: "Vue ECharts / Chart.js", href: "/experience/data-visualization/echarts" },
      { name: "vis-network 關聯圖", href: "/experience/data-visualization/vis-network" },
      { name: "技能圖譜 3D 展示", href: "/experience/skill-graph" },
      { name: "VueUse", href: "/experience/utilities/vueuse" },
      { name: "ExcelJS + XLSX", href: "/experience/utilities/excel" },
      { name: "html2canvas + jsPDF", href: "/experience/utilities/pdf" },
      { name: "vue-i18n 三語系", href: "/experience/utilities/i18n" },
    ],
  },
  {
    stage: 6,
    title: "工程卓越與部署",
    enTitle: "Engineering & Production",
    description: "Vitest 單元測試、Cypress E2E 測試、架構設計模式總結與 CI/CD 實踐",
    items: [
      { name: "Vitest 單元測試", href: "/experience/testing/vitest" },
      { name: "Cypress E2E 測試", href: "/experience/testing/cypress" },
      { name: "開發架構模式經驗", href: "/experience/architecture-patterns" },
    ],
  },
];

export const ALL_NAV_ITEMS: NavItem[] = EXPERIENCE_SECTIONS.flatMap((section) =>
  section.items.map((item) => ({
    ...item,
    category: `S${section.stage} ${section.enTitle}`,
  }))
);
