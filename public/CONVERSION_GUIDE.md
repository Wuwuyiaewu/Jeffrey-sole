分析
http://localhost:3000/resume
這一頁裡面應該可以整理出我有幾項工作經驗到

const EXPERIENCE_SECTIONS = [
  {
    title: "設計模式 (Design Patterns)",
    description: "針對不同組件與場景的抽象化實作",
    items: [
      { name: "靜態渲染多元組件", href: "/experience/config-drive" },
      { name: "動態屬性設定", href: "/experience/dynamic-attributes" },
      { name: "元件排版", href: "/experience/component-layout" },
      { name: "元件動畫互動", href: "/blog" },
    ],
  },
  {
    title: "整合設計 (Integrated Design)",
    description: "基於 TanStack 生態系的元件實作",
    items: [
      { name: "TanStack Form 實作", href: "/experience/tanstack-form" },
      { name: "TanStack Query 實作", href: "/experience/tanstack-query" },
      { name: "TanStack Table 實作", href: "/experience/tanstack-table" },
    ],
  },
];

幫我規劃出路由路徑  後續內容先不要做
例如環境設定 開發設定 套件使用經驗 開發架構模式經驗