"use client";
import { useState } from "react";
import { FieldConfig } from "../_types";

interface AddFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (field: FieldConfig) => void;
  maxColumns: number;
}

export const AddFieldModal: React.FC<AddFieldModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  maxColumns,
}) => {
  const [label, setLabel] = useState("");
  const [w, setW] = useState(1);
  const [component, setComponent] = useState<
    "input" | "textarea" | "select" | "file"
  >("input");

  if (!isOpen) return null;

  const handleAdd = () => {
    onAdd({
      id: crypto.randomUUID(),
      label,
      w,
      component,
      options:
        component === "select" ? [{ label: "選項1", value: "1" }] : undefined,
    });
    setLabel("");
    setW(1);
    setComponent("input");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-field-title"
        className="bg-white p-4 w-96 rounded shadow"
      >
        <h2 id="add-field-title" className="font-bold mb-2">新增欄位</h2>

        <label htmlFor="field-label" className="block text-sm">Label</label>
        <input
          id="field-label"
          className="border p-1 w-full mb-2"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />

        <label htmlFor="field-width" className="block text-sm">寬度 (1-{maxColumns})</label>
        <input
          id="field-width"
          type="number"
          className="border p-1 w-full mb-2"
          min={1}
          max={maxColumns}
          value={w}
          onChange={(e) => setW(Number(e.target.value))}
        />

        <label htmlFor="field-component" className="block text-sm">組件類型</label>
        <select
          id="field-component"
          className="border p-1 w-full mb-4"
          value={component}
          onChange={(e) =>
            setComponent(
              e.target.value as "input" | "textarea" | "select" | "file",
            )
          }
        >
          <option value="input">單行輸入</option>
          <option value="textarea">多行輸入</option>
          <option value="select">下拉選單</option>
          <option value="file">檔案上傳</option>
        </select>

        <div className="flex justify-end gap-2">
          <button className="border px-3 py-1" onClick={onClose}>
            取消
          </button>
          <button
            className="bg-blue-500 text-white px-3 py-1"
            onClick={handleAdd}
          >
            新增
          </button>
        </div>
      </div>
    </div>
  );
};
