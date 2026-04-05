# 前端技術履歷整理 - EC 採購系統 (Vue3)

## 專案概述

企業級 EC 採購系統前端，採用 Vue 3 + TypeScript 技術棧，具備多語系、多服務串接、動態表單生成等特性。

---

## 核心技術棧

### Frontend Framework
- **Vue 3** (v3.4.38) — Composition API + `<script setup>` 語法
- **Vue Router 4** (v4.4.5) — Hash history 模式，SPA 路由管理
- **TypeScript** (v5.9.2) — 嚴格模式，全專案類型安全

### UI / 樣式
- **Element Plus** (v2.8.4) — 企業級 Vue 3 UI 元件庫
- **UnoCSS** (v0.62.2) — 原子化 CSS 框架
  - 使用 presetUno、presetIcons、presetAttributify
  - 自訂 Shortcuts（button、layout、text）
  - 自訂斷點：xs(768px)、sm(1080px)、md(1280px)、lg(1680px)、xl(2400px)
- **Sass/SCSS** (v1.91.0) — CSS 預處理器
- **Font Awesome 4.7** — 圖示庫

### 狀態管理
- **Pinia** (v2.2.4) — Vue 3 官方推薦狀態管理
  - 7 個 Store 模組：auth、ap、consignment、pcneol、sampling、state、tanQuery
- **TanStack Vue Query** (@tanstack/vue-query v1.28.3) — 伺服器狀態管理
  - 5 分鐘 staleTime 快取策略
  - 與 i18n 整合的錯誤處理

### 表單處理
- **TanStack Vue Form** (@tanstack/vue-form v1.28.3)
  - Config-Driven 動態表單生成
  - TypeScript 型別安全的欄位配置

### API 串接
- **Axios** (v1.3.5) — HTTP Client
  - 多個 Axios 實例（auth、quotation、vendor、file、consignment、pcneol、AP、sampling）
  - 自定義 request/response interceptors
- **Swagger TypeScript API** (v13.2.7) — 從 OpenAPI 規格自動生成 TypeScript API Client
  - 涵蓋：AP、Auth、Consignment、Quotation、PCNEOL、Sampling 6 個後端服務

### 建置工具
- **Vite** (v4.5.3) — 開發伺服器與打包工具
  - Port: 8080
- **Vite SSG** (v0.23.7) — 靜態網站生成
- **unplugin-auto-import** — Vue / Vue Router 自動引入
- **unplugin-vue-components** — Element Plus + 自訂元件自動註冊
- **rollup-plugin-visualizer** — Bundle 大小分析
- **pnpm** (v9.2.0+) — 套件管理器

### 測試
- **Vitest** (v0.29.8) — 單元測試框架
  - Environment: happy-dom

### 程式碼品質
- **ESLint** (v9.34.0) + @antfu/eslint-config — JS/TS/Vue Lint
- **Stylelint** (v16.6.1) — CSS/SCSS Lint
- **Prettier** (v1.8.1) — 程式碼格式化
- **Husky** (v8.0.3) — Git hooks
- **lint-staged** (v13.2.0) — Commit 前自動 Lint

### 國際化 (i18n)
- **vue-i18n** (v9.3.0)
  - 支援：繁中（zh-TW，預設）、英文（en）、簡中（zh-CN）
  - Element Plus 元件同步本地化

### 工具函式庫
- **@vueuse/core** (v13.5.0) — Composition 工具集
- **dayjs** (v1.11.11) — 日期處理（支援 zh-tw、zh-cn、en locale）
- **ExcelJS** (v4.4.0) — Excel 生成
- **XLSX** (v0.18.5) — Excel 解析
- **uuid** (v11.1.0) — UUID 生成
- **nprogress** (v0.2.0) — 路由切換進度條
- **aieditor** (v1.1.7) — AI 富文字編輯器

---

## 架構設計亮點

### 1. Config-Driven UI 模式
- 透過 `field-config.ts` + `table-config.ts` 定義 UI 配置
- TypeScript 判別聯合型別（discriminated unions）確保型別安全
- 元件類型：`'input' | 'checkbox' | 'radio' | 'file' | 'select' | 'staticText' | 'date'`
- 可從設定檔動態生成整個表單/表格，無需手動撰寫每個元件

### 2. Component Adapter 模式
- 在 `src/views/tanQuery/components/` 下建立 Adapter 元件包裝 UI 控制項
- 包含：StaticTextAdapter、InputAdapter、CheckBoxAdapter、SelectAdapter、FileUploadAdapter、DatePickComponent
- 達到 UI 元件可替換、高度彈性

### 3. 自訂 Composables（16+ 個）
- 業務邏輯抽取：表單驗證、分頁、Excel 操作、API 請求管理
- 資料篩選、表格響應、Domain 邏輯（AP、PCNEOL、Sampling）
- 可複用工具函式（arrays、dates、types、values）

### 4. 多服務架構
- 8+ 個獨立 Service 模組對應不同後端領域：
  - ap-services、auth-services、pcneol-nrnd-services
  - sampling-services、consignment-services、quotation-services、vendor-services

### 5. Auto-Import + Auto-Register
- Unplugin 自動引入 Vue、Vue Router API
- 自動註冊 Element Plus 與自訂元件
- 自動生成 `.d.ts` 型別定義檔提升 IntelliSense

### 6. 動態屬性反射（Dynamic Property Mirror）
- 支援執行時期動態屬性綁定與反射
- 用於建立靈活、可配置的 UI 元件

### 7. 環境分層配置
- dev / qas / production 三層環境設定
- 多個後端服務 URL 透過 `.env` 管理

---

## 專案規模

| 項目 | 數量 |
|------|------|
| Composables | 16+ 個 |
| Pinia Store 模組 | 7 個 |
| Service 模組 | 8+ 個 |
| 主要功能模組 | 8 個（account、ap、consignment、maintain、pcneol、quotation、sampling、tanQuery） |
| 支援語言 | 3 種（zh-TW、en、zh-CN） |
| Swagger 自動生成 API | 6 個後端服務 |

---

## 適合用於履歷的關鍵技術關鍵字

- Vue 3 Composition API / `<script setup>`
- TypeScript（Strict Mode）
- Pinia 狀態管理
- TanStack Query（伺服器狀態、快取策略）
- TanStack Form（動態表單）
- Element Plus
- UnoCSS（原子化 CSS）
- Vite 建置優化
- Axios + 多服務 API 架構
- Swagger 自動生成 TypeScript Client
- Config-Driven UI 設計模式
- Component Adapter 模式
- Composable 抽象化
- ESLint / Stylelint / Husky 程式碼品質工具鏈
- vue-i18n 多語系
- ExcelJS 報表匯出
- Vitest 單元測試
