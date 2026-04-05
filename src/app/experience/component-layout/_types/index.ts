// ===== 型別定義 =====
/**
 * 組件類型枚舉
 * - input: 單行文字輸入框
 * - textarea: 多行文字輸入框
 * - select: 下拉選單
 * - file: 檔案上傳
 */
export type ComponentType = "input" | "textarea" | "select" | "file";

/**
 * 下拉選單選項介面
 * @property label - 顯示給使用者的文字
 * @property value - 實際儲存的值
 */
export interface SelectOption {
  label: string;
  value: string;
}

/**
 * 欄位配置介面
 * @property id - 欄位唯一識別碼（必須唯一，用作 React key）
 * @property label - 欄位顯示標籤
 * @property w - 欄位寬度（佔用幾個格子，1 到 maxColumns）
 * @property component - 組件類型
 * @property defaultValue - 預設值（選填，用於 input 和 textarea）
 * @property options - 下拉選項陣列（選填，僅用於 select）
 */
export interface FieldConfig {
  id: string;
  label: string;
  w: number;
  component: ComponentType;
  defaultValue?: string;
  options?: SelectOption[];
}

export interface FieldRuntime extends FieldConfig {
  value?: string;
}
