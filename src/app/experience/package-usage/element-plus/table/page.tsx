import CodeBlock from "@/components/CodeBlock";

export default function ElementPlusTablePage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <header className="relative bg-gradient-to-br from-green-900 via-green-800 to-slate-900 text-white py-10 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)` }} />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
            <span className="text-sm font-medium tracking-wide">Element Plus</span>
          </div>
          <h1 className="text-5xl font-black mb-4 tracking-tight">Table 複雜場景</h1>
          <p className="text-xl text-green-200">固定列、操作欄插槽、動態欄位顯示切換</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-10">
        <div className="bg-white border-l-4 border-green-500 p-8 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold mb-3 text-slate-900">Table 複雜場景應用</h3>
          <p className="text-stone-600 mb-6 leading-relaxed">
            在供需模擬專案中，表格需要支援固定列、排序、自訂 header、槽位插入操作按鈕，以及動態欄位顯示切換等需求。
          </p>
          <div className="space-y-4">
            {[
              {
                label: "固定列 + 自訂操作欄",
                code: `<el-table :data="tableData" border stripe>
  <el-table-column
    prop="orderNo"
    label="訂單編號"
    fixed="left"
    width="150"
  />
  <el-table-column prop="amount" label="金額" sortable />
  <el-table-column prop="status" label="狀態">
    <template #default="{ row }">
      <el-tag :type="row.status === 'done' ? 'success' : 'warning'">
        {{ row.status }}
      </el-tag>
    </template>
  </el-table-column>
  <el-table-column label="操作" fixed="right" width="120">
    <template #default="{ row }">
      <el-button size="small" @click="handleEdit(row)">編輯</el-button>
    </template>
  </el-table-column>
</el-table>`,
              },
              {
                label: "動態欄位顯示切換",
                code: `// 讓使用者選擇要顯示哪些欄位
const visibleColumns = ref(['orderNo', 'amount', 'status'])

const allColumns = [
  { key: 'orderNo', label: '訂單編號' },
  { key: 'amount',  label: '金額' },
  { key: 'status',  label: '狀態' },
  { key: 'creator', label: '建立人' },
]

// template 中動態渲染
<el-table-column
  v-for="col in allColumns.filter(c => visibleColumns.includes(c.key))"
  :key="col.key"
  :prop="col.key"
  :label="col.label"
/>`,
              },
            ].map((item, i) => (
              <div key={i} className="rounded-xl p-5 border-2 bg-stone-50 border-green-500">
                <div className="text-sm font-bold mb-3 text-green-700">{item.label}</div>
                <CodeBlock code={item.code} language="html" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
