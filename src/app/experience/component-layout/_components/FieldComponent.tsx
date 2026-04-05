import { FieldConfig } from "../_types";

/**
 * 欄位組件 Props 介面
 */
interface FieldComponentProps {
  field: FieldConfig; // 欄位配置物件
  value: string; // 當前值
  onChange: (id: string, val: string) => void; // 值變更回調函數
}

/**
 * 欄位渲染組件
 * 根據 field.component 類型渲染對應的表單元素
 *
 * @component
 * @param {FieldComponentProps} props
 * @returns 對應類型的表單輸入元素
 *
 * 支援的類型：
 * - textarea: 多行文字框
 * - select: 下拉選單（需要 field.options）
 * - file: 檔案上傳
 * - input: 單行文字輸入（預設）
 */
export const FieldComponent: React.FC<FieldComponentProps> = ({
  field,
  value,
  onChange,
}) => {
  return (
    <div className="p-2 border">
      {/* 欄位標籤 */}
      <label className="block text-sm font-medium mb-1">{field.label}</label>

      {/* 根據組件類型渲染不同的輸入元素 */}
      {field.component === "textarea" ? (
        // 多行文字框
        <textarea
          className="w-full p-2 border"
          rows={2}
          value={value || field.defaultValue || ""}
          onChange={(e) => onChange(field.id, e.target.value)}
        />
      ) : field.component === "select" ? (
        // 下拉選單
        <select
          className="w-full p-2 border"
          value={value || field.defaultValue || ""}
          onChange={(e) => onChange(field.id, e.target.value)}
        >
          <option value="">請選擇</option>
          {/* 動態渲染選項 */}
          {field.options?.map((opt, idx) => (
            <option key={idx} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        // 單行輸入或檔案上傳
        <input
          type={field.component === "file" ? "file" : "text"}
          className="w-full p-2 border"
          // 檔案上傳不能設定 value
          value={
            field.component === "file"
              ? undefined
              : value || field.defaultValue || ""
          }
          onChange={(e) => onChange(field.id, e.target.value)}
        />
      )}
    </div>
  );
};
