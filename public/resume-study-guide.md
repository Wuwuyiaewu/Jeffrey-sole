# 企業級 EC 採購系統前端技術研究與實踐指引

本導讀文件旨在深入分析基於 Vue 3 與 TypeScript 建構的企業級 EC 採購系統前端架構。透過結構化的 resume 格式整理、核心概念解析及實作練習，協助學習者掌握現代化前端開發的核心技術與設計模式。

---

## 第一部分：軟體工程師履歷專業摘要

### 1. 技術技能摘要 (Technical Skills Summary)

*   **核心框架**：Vue 3 (v3.4.38) Composition API、TypeScript (Strict Mode)。
*   **狀態管理**：Pinia (多模組架構)、TanStack Vue Query (伺服器狀態快取)。
*   **介面開發**：Element Plus、UnoCSS (原子化 CSS)、Sass/SCSS、Vueuse。
*   **表單與資料處理**：TanStack Vue Form (動態表單)、ExcelJS、XLSX、Day.js。
*   **工具與建置**：Vite (開發與打包)、Vite SSG、pnpm、Swagger TypeScript API (自動化 API Client 生成)。
*   **品質維護**：Vitest (單元測試)、ESLint、Stylelint、Prettier、Husky、lint-staged。

### 2. 核心技術描述 (Core Technology Description)

*   **類型安全架構**：全專案採用 TypeScript 嚴格模式，結合 Swagger TypeScript API 從 OpenAPI 規格自動生成 API Client，確保前後端資料交換的一致性與型別安全，涵蓋 AP、Auth、Consignment 等 6 個後端服務。
*   **進階狀態管理策略**：利用 Pinia 建立 7 個獨立 Store 模組處理業務狀態；並導入 TanStack Vue Query 實施伺服器狀態管理，設定 5 分鐘 staleTime 快取策略，並整合 i18n 進行全域錯誤處理。
*   **現代化樣式解決方案**：運用 UnoCSS 原子化框架搭配自訂快捷指令 (Shortcuts) 與響應式中斷點 (Breakpoints)，大幅減少 CSS 體積並提升開發效率。
*   **自動化開發流程**：整合 Unplugin 系列工具實現 Vue API 與元件的自動引入與註冊，並利用 Rollup Visualizer 進行 Bundle 大小優化分析。

### 3. 架構設計能力 (Architecture Design Capabilities)

*   **Config-Driven UI 模式**：設計高度抽象的配置驅動模式，透過 `field-config.ts` 與 `table-config.ts` 定義 UI。利用 TypeScript 辨別聯合型別 (Discriminated Unions) 確保型別安全，實現從設定檔動態生成表單與表格。
*   **Component Adapter 模式**：建立 Adapter 元件層包裝底層 UI 控制項（如 Input、Select、FileUpload），達成 UI 元件的高可替換性與系統彈性。
*   **高複用性邏輯抽象**：開發超過 16 個自訂 Composables，將表單驗證、分頁處理、Excel 操作及特定領域（AP、PCNEOL）的業務邏輯從 UI 層抽離。
*   **多服務模組化設計**：針對 8 個以上獨立後端領域服務（如 Sampling, Quotation, Vendor）建立專屬 Service 模組，並配置開發、測試與生產三層環境分層設定。

### 4. 履歷成就亮點 (Key Achievements)

*   **開發效率提升**：透過 Swagger 自動生成 6 個服務的 API Client，並導入 Auto-Import 機制自動生成 `.d.ts` 定義檔，優化開發者 IntelliSense 體驗。
*   **系統擴展性**：成功建構支援繁中、簡中、英文三種語系的國際化系統 (i18n)，並同步 Element Plus 元件本地化。
*   **複雜資料處理**：整合 ExcelJS 與 XLSX 實現前端複雜報表的解析與生成功能。
*   **程式碼品質保障**：建立完善的 Git hooks 流程，確保每次 Commit 前自動執行 Lint 檢查，並透過 Vitest 搭配 happy-dom 環境建立單元測試基礎。

---

## 第二部分：短答練習題 (Short-answer Quiz)

1.  **本系統如何解決前後端 API 型別不一致的問題？**
    *   *參考答案*：透過 `Swagger TypeScript API` 從 OpenAPI 規格自動生成 TypeScript API Client，確保前端呼叫端點與資料結構與後端規格完全同步。
2.  **在樣式開發上，本專案如何兼顧效能與開發速度？**
    *   *參考答案*：採用 `UnoCSS` 原子化框架減少 CSS 冗餘，並透過自訂 `Shortcuts` 定義常用元件樣式，同時設定自訂斷點處理響應式佈局。
3.  **說明本專案中 TanStack Vue Query 的主要用途為何？**
    *   *參考答案*：用於伺服器狀態管理，實施 5 分鐘的 `staleTime` 快取策略，並處理與多語系整合的錯誤提示。
4.  **什麼是 Config-Driven UI 模式？其在專案中的實踐方式為何？**
    *   *參考答案*：這是一種透過資料配置來驅動介面產生的模式。專案透過定義好的 `field-config.ts` 與 `table-config.ts` 配置檔，結合 TypeScript 型別檢查，動態生成各種表單元件，減少手動撰寫重複的樣板程式碼。
5.  **專案使用了哪些工具來確保程式碼品質與 Commit 規範？**
    *   *參考答案*：使用了 ESLint、Stylelint、Prettier、Husky (Git hooks) 以及 lint-staged。

---

## 第三部分：深度思考申論題 (Essay Questions)

1.  **探討 Component Adapter 模式在企業級系統中的重要性。**
    *   *引導方向*：思考當未來 UI 庫（如從 Element Plus 更換為其他庫）或業務邏輯變更時，Adapter 層如何作為緩衝，減少對業務頁面 (Views) 的直接衝擊，以及如何透過 Adapter 統一控制項的行為。
2.  **分析採用 Vite SSG 與 Vite 組合對 EC 系統可能產生的優勢。**
    *   *引導方向*：從載入速度、SEO（搜尋引擎最佳化）以及靜態資源部署的便利性角度進行分析。
3.  **評估 Composable 模式對大型 Vue 專案維護性的影響。**
    *   *引導方向*：結合專案中 16 個以上的 Composables，討論業務邏輯（如表單驗證、Excel 處理）與 UI 分離後，對測試、邏輯重用及程式碼清晰度的具體幫助。

---

## 第四部分：關鍵術語表 (Glossary)

| 術語 | 定義與說明 |
| :--- | :--- |
| **Composition API** | Vue 3 提供的一組 API，允許開發者使用函數式的方式組織元件邏輯，提升代碼重用性。 |
| **TypeScript Strict Mode** | 強制執行更嚴格的類型檢查，能有效預防執行時期錯誤，提高代碼穩定度。 |
| **Atomic CSS (UnoCSS)** | 一種 CSS 設計方法，透過細粒度的單一功能類別來構建介面，具備極高的載入效能與一致性。 |
| **Stale-While-Revalidate** | TanStack Query 等工具使用的快取策略，允許在背景更新資料的同時先顯示舊（stale）資料。 |
| **Interceptors** | Axios 提供的一種機制，可在請求發出前或回應接收後進行全域性的攔截與處理（如加入 Token）。 |
| **Static Site Generation (SSG)** | 在建置階段就預先將網頁渲染成 HTML 檔案，提升頁面首次加載速度。 |
| **Git Hooks (Husky)** | 在 Git 特定生命週期（如 Commit, Push）觸發的指令，常用於強制執行 Lint 或測試。 |
| **Discriminated Unions** | TypeScript 特性，利用一個共同的屬性（如 `type`）來精確區分聯合型別中的不同成員，常用於 Config 配置。 |