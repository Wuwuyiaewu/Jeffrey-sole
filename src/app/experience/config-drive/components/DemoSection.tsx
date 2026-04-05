"use client";

import { useState, useMemo } from "react";
import { FieldConfig } from "../types";
import {
  generateBeforeCode,
  generateAfterCode,
  getCodeStats,
} from "../utils/code-generator";
import { ChevronDown, ChevronUp, Plus, RotateCcw } from "lucide-react";

// 簡單的 Input 元件
const Input = ({ placeholder, className = "" }: any) => (
  <div className="relative">
    <input
      type="text"
      placeholder={placeholder}
      className={`w-full px-3 py-2 border rounded-md bg-white ${className}`}
    />
  </div>
);

// 簡單的 Textarea 元件
const Textarea = ({ placeholder, className = "" }: any) => (
  <div className="relative">
    <textarea
      placeholder={placeholder}
      rows={3}
      className={`w-full px-3 py-2 border rounded-md bg-white ${className}`}
    />
  </div>
);

const DatePicker = ({ className = "" }: any) => (
  <div className="relative">
    <input
      type="date"
      className={`w-full px-3 py-2 border rounded-md bg-white text-stone-600 ${className}`}
    />
  </div>
);

const Select = ({ placeholder, className = "" }: any) => (
  <div className="relative">
    <select className={`w-full px-3 py-2 border rounded-md bg-white text-stone-600 ${className}`}>
      <option value="">{placeholder}</option>
      <option value="1">選項 1</option>
      <option value="2">選項 2</option>
    </select>
  </div>
);

const Checkbox = ({ placeholder, className = "" }: any) => (
  <div className="flex items-center gap-2 px-1 py-2">
    <input type="checkbox" className="w-5 h-5 rounded border-stone-300" />
    <span className="text-stone-700 font-medium">{placeholder}</span>
  </div>
);

const Radio = ({ className = "" }: any) => (
  <div className="flex items-center gap-4 px-1 py-2">
    <label className="flex items-center gap-2 text-stone-700 font-medium">
      <input type="radio" name="demo-radio" className="w-5 h-5 border-stone-300" />
      選項 A
    </label>
    <label className="flex items-center gap-2 text-stone-700 font-medium">
      <input type="radio" name="demo-radio" className="w-5 h-5 border-stone-300" />
      選項 B
    </label>
  </div>
);

const COMPONENT_MAP = {
  Input,
  Textarea,
  DatePicker,
  Select,
  Checkbox,
  Radio
};

const INITIAL_FIELD_CONFIG: FieldConfig = {
  id: "custom-field-1",
  label: "新欄位",
  componentType: "Input",
};

export default function DemoSection() {
  const [currentConfig, setCurrentConfig] =
    useState<FieldConfig>(INITIAL_FIELD_CONFIG);
  const [configs, setConfigs] = useState<FieldConfig[]>([]);
  const [beforeCollapsed, setBeforeCollapsed] = useState(false);
  const [afterCollapsed, setAfterCollapsed] = useState(false);

  // 生成 JSON 預覽
  const jsonPreview = useMemo(() => {
    return JSON.stringify(configs, null, 2);
  }, [configs]);

  // 生成 Before/After 程式碼
  const beforeCode = useMemo(
    () => generateBeforeCode(configs),
    [configs],
  );
  const afterCode = useMemo(
    () => generateAfterCode(configs),
    [configs],
  );

  // 程式碼統計
  const stats = useMemo(() => getCodeStats(configs), [configs]);

  // 新增欄位
  const handleAddConfig = () => {
    const newEntry: FieldConfig = {
      ...currentConfig,
      id: `${currentConfig.id}-${configs.length + 1}`,
    };
    setConfigs([...configs, newEntry]);
  };

  // 重設
  const handleReset = () => {
    setConfigs([]);
    setCurrentConfig(INITIAL_FIELD_CONFIG);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black mb-4 text-slate-900">
          互動展示：看設計如何運作
        </h2>
        <p className="text-lg text-stone-600">
          調整參數，比較 Config-Driven 與直接撰寫元件的差異
        </p>
      </div>

      {/* Playground */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* 參數編輯區 */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-stone-200">
          <h3 className="text-xl font-bold mb-6 text-slate-900 border-b pb-3">
            欄位參數編輯
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                欄位標籤
              </label>
              <Input
                value={currentConfig.label}
                onChange={(e: any) =>
                  setCurrentConfig({ ...currentConfig, label: e.target.value })
                }
                placeholder="例如：申請金額"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  元件類型
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-md bg-white"
                  value={currentConfig.componentType}
                  onChange={(e) =>
                    setCurrentConfig({
                      ...currentConfig,
                      componentType: e.target.value as any,
                    })
                  }
                >
                  <option value="Input">Input</option>
                  <option value="Textarea">Textarea</option>
                  <option value="DatePicker">DatePicker</option>
                  <option value="Select">Select</option>
                  <option value="Checkbox">Checkbox</option>
                  <option value="Radio">Radio</option>
                </select>
              </div>
            </div>



            <div className="flex gap-3 pt-4">
              <button
                onClick={handleAddConfig}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                新增到 Config
              </button>

              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-2 bg-stone-200 text-stone-700 px-6 py-3 rounded-lg font-semibold hover:bg-stone-300 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                重設
              </button>
            </div>
          </div>
        </div>

        {/* JSON 預覽 */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-stone-200 overflow-hidden">
          <div className="bg-stone-100 px-6 py-3 border-b flex justify-between items-center">
            <span className="font-mono text-sm font-semibold text-stone-700">
              config-driven.json
            </span>
            <span className="text-xs text-stone-500 italic">Read Only</span>
          </div>
          <pre className="p-6 font-mono text-sm overflow-auto h-96 bg-stone-50">
            <code className="text-stone-800">
              {configs.length === 0 ? "// 請新增欄位以生成配置" : jsonPreview}
            </code>
          </pre>
        </div>
      </div>

      {/* Before/After 程式碼對比 */}
      {configs.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border-2 border-stone-200 overflow-hidden">
          <div className="bg-stone-100 px-6 py-4 border-b">
            <h3 className="text-xl font-bold text-slate-900">程式碼對比</h3>
            <p className="text-sm text-stone-600 mt-1">
              左右對照：直接寫入判斷 vs Config-Driven（{stats.beforeFiles} 個檔案 →{" "}
              {stats.afterFiles} 個檔案，減少 {stats.reduction}%）
            </p>
          </div>

          <div className="grid md:grid-cols-2 divide-x divide-stone-200">
            {/* Before */}
            <div className="bg-red-50/50">
              <button
                onClick={() => setBeforeCollapsed(!beforeCollapsed)}
                className="w-full px-6 py-4 flex items-center justify-between bg-red-100 hover:bg-red-200 transition-colors"
              >
                <span className="font-bold text-red-900">Before (直接寫入判斷)</span>
                {beforeCollapsed ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronUp className="w-5 h-5" />
                )}
              </button>

              {!beforeCollapsed && (
                <pre className="p-6 font-mono text-xs overflow-auto h-96 bg-white/50">
                  <code className="text-stone-800 leading-relaxed whitespace-pre-wrap">
                    {beforeCode}
                  </code>
                </pre>
              )}
            </div>

            {/* After */}
            <div className="bg-green-50/50">
              <button
                onClick={() => setAfterCollapsed(!afterCollapsed)}
                className="w-full px-6 py-4 flex items-center justify-between bg-green-100 hover:bg-green-200 transition-colors"
              >
                <span className="font-bold text-green-900">After (Config-Driven)</span>
                {afterCollapsed ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronUp className="w-5 h-5" />
                )}
              </button>

              {!afterCollapsed && (
                <pre className="p-6 font-mono text-xs overflow-auto h-96 bg-white/50">
                  <code className="text-stone-800 leading-relaxed whitespace-pre-wrap">
                    {afterCode}
                  </code>
                </pre>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Live Preview */}
      {configs.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border-2 border-stone-200 p-8">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Live Preview
            </h3>
          </div>

          <div className="space-y-6 bg-stone-50 p-8 rounded-lg border-2 border-stone-300">
            {configs.map((field) => {
              const PreviewComponent = COMPONENT_MAP[field.componentType];

              return (
                <div key={field.id}>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">
                    {field.label}
                  </label>
                  <PreviewComponent placeholder={`請輸入${field.label}`} />
                </div>
              );
            })}
          </div>

          <div className="mt-6 bg-blue-50 border-2 border-blue-300 rounded-lg p-5">
            <div className="font-bold text-blue-900 mb-2">差異整理：</div>
            <ul className="text-sm text-blue-900 space-y-2">
              <li>- 子元件可以透過 config 生成而不需要</li>
              <li>- 所有邏輯都來自同一份配置，不需要在每個元件裡寫判斷</li>
              <li>- Before 透過 import 不同子組件達成組裝</li>
              <li>- After 透過動態渲染達成組裝</li>
            </ul>
          </div>
        </div>
      )}

      {/* Empty State */}
      {configs.length === 0 && (
        <div className="bg-stone-100 rounded-xl border-2 border-dashed border-stone-300 p-16 text-center">
          <h4 className="text-xl font-bold text-stone-600 mb-2">
            尚未新增任何欄位
          </h4>
          <p className="text-stone-500">
            在左上方調整參數並點擊「新增到 Config」
          </p>
        </div>
      )}
    </div>
  );
}
