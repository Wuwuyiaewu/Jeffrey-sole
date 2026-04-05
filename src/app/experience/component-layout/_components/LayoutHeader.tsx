interface Props {
  maxColumns: number;
  setMaxColumns: (n: number) => void;
  onClearFormData: () => void;
  onReset: () => void;
  onClearAll: () => void;
  onOpenModal: () => void;
}

export function LayoutHeader({
  maxColumns,
  setMaxColumns,
  onClearFormData,
  onReset,
  onClearAll,
  onOpenModal,
}: Props) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">區域矩陣配置</h1>
        <p className="text-gray-600">彈性欄位系統</p>
      </div>

      <div className="flex gap-2 items-center">
        <label className="text-sm font-medium">欄位數:</label>
        <select
          className="border p-2"
          value={maxColumns}
          onChange={(e) => setMaxColumns(parseInt(e.target.value))}
        >
          {[2, 3, 4, 6, 8, 12].map((n) => (
            <option key={n} value={n}>
              {n} 欄
            </option>
          ))}
        </select>

        <div className="h-8 w-px bg-gray-300 mx-2" />

        <button onClick={onClearFormData} className="btn-orange">
          清除資料
        </button>

        <button onClick={onReset} className="btn-blue">
          還原預設
        </button>

        <button onClick={onClearAll} className="btn-red">
          清除全部
        </button>

        <div className="h-8 w-px bg-gray-300 mx-2" />

        <button
          onClick={onOpenModal}
          className="bg-blue-500 text-white px-4 py-2"
        >
          + 新增欄位
        </button>
      </div>
    </div>
  );
}
