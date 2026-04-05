import CodeBlock from "@/components/CodeBlock";

const PROBLEM1_CODE = `import FieldA from './FieldA.vue'
import FieldB from './FieldB.vue'
import FieldC from './FieldC.vue'

<FieldA v-model="form.a" />
<FieldB v-model="form.b" />
<FieldC v-model="form.c" />`;

export default function ProblemSection() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black mb-4 text-slate-900">幾個開發中的麻煩</h2>
        <p className="text-lg text-stone-600"></p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Problem 1 */}
        <div className="bg-white border-l-4 border-red-500 p-8 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold mb-4 text-slate-900">大量重複的引入與渲染</h3>
          <p className="text-stone-700 mb-4 leading-relaxed">
            開發大型表單或頁面時，需要手動 import 幾十個甚至上百個組件，並在模板中寫滿重複的標籤與綁定。
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <CodeBlock code={PROBLEM1_CODE} language="html" />
            <div className="mt-3 text-red-700 font-bold text-sm">模板變得異常龐大，都是重複的結構</div>
          </div>
        </div>

        {/* Problem 2 */}
        <div className="bg-white border-l-4 border-orange-500 p-8 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold mb-4 text-slate-900">難以維護與閱讀</h3>
          <p className="text-stone-700 mb-4 leading-relaxed">
            表單結構與組件渲染混雜，要找特定欄位需要跨越整份文件。
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-red-500 font-bold text-xl">•</span>
              <span className="text-stone-700">模板行數動輒破千行</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-500 font-bold text-xl">•</span>
              <span className="text-stone-700">閱讀時需要不斷滾動尋找特定欄位</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-500 font-bold text-xl">•</span>
              <span className="text-stone-700">難以一眼看出整體的結構順序</span>
            </li>
          </ul>
        </div>

        {/* Problem 3 */}
        <div className="bg-white border-l-4 border-yellow-500 p-8 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold mb-4 text-slate-900">修改與調整不便</h3>
          <p className="text-stone-700 mb-4 leading-relaxed">
            重複的結構導致經常在複製貼上，改一個地方容易漏改其他細節。
          </p>
          <div className="space-y-3">
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
              <p className="text-sm text-stone-700">
                <span className="font-bold text-yellow-800">場景：</span> 
                需要調整多個欄位的顯示順序，必須在龐大的模板中剪下貼上大塊的 HTML 標籤。
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
              <p className="text-sm text-stone-700">
                <span className="font-bold text-yellow-800">場景：</span> 
                新增欄位時忘記綁定正確的變數，或是 import 路徑寫錯。
              </p>
            </div>
          </div>
        </div>

        {/* Problem 4 */}
        <div className="bg-white border-l-4 border-purple-500 p-8 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold mb-4 text-slate-900">擴展的麻煩</h3>
          <p className="text-stone-700 mb-4 leading-relaxed">
            組件數量增加時，範本檔案變得異常龐大，效能與閱讀體驗雙雙下降。
          </p>
          <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6">
            <div className="text-sm text-stone-600 mb-3 font-medium">代碼增長：</div>
            <div className="font-mono text-lg font-bold text-purple-700 mb-4">
              總代碼行數 = 欄位數量 × 每個組件的標籤行數
            </div>
            <div className="text-sm text-stone-600 bg-white rounded p-3 border border-purple-200">
              實際案例：30 個欄位 × 5 行 (包含標籤與屬性) = 
              <span className="text-red-600 font-bold ml-2">150 行重複結構</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
