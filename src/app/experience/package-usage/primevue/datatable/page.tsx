import CodeBlock from "@/components/CodeBlock";

export default function PrimeVueDataTablePage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <header className="relative bg-gradient-to-br from-violet-900 via-violet-800 to-slate-900 text-white py-10 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)` }} />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
            <span className="text-sm font-medium tracking-wide">PrimeVue</span>
          </div>
          <h1 className="text-5xl font-black mb-4 tracking-tight">DataTable</h1>
          <p className="text-xl text-violet-200">虛擬滾動、多選、行內編輯、欄位 resize</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-10">
        {/* Section 1: why */}
        <div className="bg-white border-l-4 border-violet-500 p-8 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold mb-3 text-slate-900">為什麼在某些專案選 PrimeVue DataTable</h3>
          <p className="text-stone-600 mb-6 leading-relaxed">
            雨林新零售專案需要高度客製化的 DataTable（虛擬滾動、多選、欄位 resize、行內編輯），Element Plus 的 table 擴充性有限，改用 PrimeVue DataTable 後彈性大幅提升。
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-lg p-5 border-2 bg-stone-50 border-stone-200">
              <div className="text-sm font-bold mb-3 text-stone-500">Element Plus Table 的限制</div>
              <CodeBlock code={`<!-- 行內編輯需要自己管理 editing 狀態 -->
<!-- 虛擬滾動支援有限 -->
<!-- 欄位 resize 需要額外處理 -->

<el-table :data="data">
  <el-table-column>
    <template #default="{ row, $index }">
      <el-input v-if="editingRow === $index" />
      <span v-else>{{ row.value }}</span>
    </template>
  </el-table-column>
</el-table>`} language="html" />
              <div className="mt-3 text-sm font-medium text-red-600">✗ 複雜互動需大量手工處理</div>
            </div>
            <div className="rounded-lg p-5 border-2 bg-violet-50 border-violet-400">
              <div className="text-sm font-bold mb-3 text-violet-700">PrimeVue DataTable 開箱即用</div>
              <CodeBlock code={`<!-- 原生支援：虛擬滾動、行內編輯、欄位 resize -->
<DataTable
  :value="data"
  editMode="cell"
  resizableColumns
  scrollable
  :virtualScrollerOptions="{ itemSize: 46 }"
  v-model:selection="selected"
  selectionMode="multiple"
>
  <Column field="name" header="Name" />
  <Column field="price" header="Price" />
</DataTable>`} language="html" />
              <div className="mt-3 text-sm font-medium text-violet-700">✓ 複雜功能直接透過 prop 啟用</div>
            </div>
          </div>
        </div>

        {/* Section 2: cell edit */}
        <div className="bg-white border-l-4 border-blue-500 p-8 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold mb-3 text-slate-900">DataTable 行內編輯</h3>
          <p className="text-stone-600 mb-6 leading-relaxed">
            在採購資料維護頁面，需要讓使用者直接在表格內編輯欄位，編輯完成後才送 API 更新，避免每列都要開 Dialog。
          </p>
          <div className="space-y-4">
            {[
              {
                label: "cell edit 模式",
                code: `<DataTable
  :value="products"
  editMode="cell"
  @cell-edit-complete="onCellEditComplete"
>
  <Column field="name" header="商品名稱" style="width:25%">
    <template #editor="{ data, field }">
      <InputText v-model="data[field]" autofocus />
    </template>
  </Column>
  <Column field="price" header="單價" style="width:15%">
    <template #editor="{ data, field }">
      <InputNumber v-model="data[field]" mode="currency" currency="TWD" />
    </template>
  </Column>
</DataTable>`,
              },
              {
                label: "onCellEditComplete 處理",
                code: `function onCellEditComplete(event) {
  const { data, newValue, field, originalEvent } = event

  // 驗證（空值拒絕）
  if (newValue === '' || newValue === null) {
    originalEvent.preventDefault()
    return
  }

  // 更新資料 & 呼叫 API
  data[field] = newValue
  updateProduct({ id: data.id, [field]: newValue })
}`,
              },
            ].map((item, i) => (
              <div key={i} className="rounded-xl p-5 border-2 bg-stone-50 border-blue-500">
                <div className="text-sm font-bold mb-3 text-blue-700">{item.label}</div>
                <CodeBlock code={item.code} language="html" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
