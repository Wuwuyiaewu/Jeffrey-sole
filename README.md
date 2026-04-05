# 我的前端履歷專案

這是一個使用 Next.js、TypeScript 和 shadcn/ui 建構的現代化線上履歷專案。它不僅僅是一份靜態的個人介紹，更是我前端技能的實際展示，包括對複雜佈局、響應式設計和 API 整合的掌握。

## 技術棧 (Technology Stack)

- **框架**: Next.js 14+ (App Router)
- **語言**: TypeScript
- **UI 元件**: shadcn/ui
- **樣式**: Tailwind CSS
- **程式碼品質**: Biome (Formatter & Linter)
- **套件管理**: pnpm

## 專案目標

將此專案改造為一份能夠充分展示我的前端開發經驗、專案成果與技術深度的互動式線上履歷。

## 如何開始 (Getting Started)

1.  **安裝依賴**:
    ```bash
    pnpm install
    ```

2.  **啟動開發伺服器**:
    ```bash
    pnpm run dev
    ```
    然後在瀏覽器中打開 `http://localhost:3000`。

3.  **生產環境建置**:
    ```bash
    # 建置專案
    pnpm run build

    # 啟動生產伺服器
    pnpm run start
    ```

## 專案結構導覽

-   `src/app/`: 專案的核心，所有頁面和路由都在這裡定義 (使用 App Router)。
    -   `src/app/layout.tsx`: 全局的根佈局檔案。
    -   `src/app/@sidebar/page.tsx`: **平行路由** 的範例，用於渲染側邊欄區塊。
    -   `src/app/(components)/`: **路由群組**，用於存放不影響 URL 的共用元件（例如頁首）。
-   `src/components/ui/`: 由 `shadcn/ui` 管理的 UI 元件。
-   `src/lib/`: 存放共用的輔助函式、類型定義或數據獲取邏輯（例如 `posts.ts`）。
-   `public/`: 存放靜態資源，例如圖片、SVG 圖標等。
-   `biome.json`: Biome (程式碼格式化與檢查工具) 的設定檔。

## 修改建議

1.  **個人資訊**:
    -   修改 `src/app/about/page.tsx` 來更新您的個人簡介。
    -   修改 `src/app/experience/page.tsx` 來列出您的工作經驗。
2.  **專案展示**:
    -   `src/app/projects/page.tsx` 是展示您作品集的地方。
    -   您可以參考 `src/app/blog/[slug]/page.tsx` 的模式，為每個專案建立詳細的介紹頁面。
3.  **數據內容**:
    -   查看 `src/lib/posts.ts`，了解內容是如何被載入的。您可以修改它來從本地 Markdown 檔案或 Headless CMS（如 Contentful, Sanity）讀取您的履歷資料。
4.  **調整樣式**:
    -   全域樣式可以在 `src/app/globals.css` 中調整。
    -   大部分樣式應使用 Tailwind CSS 的 utility classes 直接在元件的 `className` 中編寫。