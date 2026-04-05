import CodeBlock from "@/components/CodeBlock";

const TRADITIONAL_CODE = `import InputA from './InputA'
import InputB from './InputB'
import InputC from './InputC'

<InputA />
<InputB />
<InputC />`;

const CONFIG_DRIVEN_CODE = `Config 陣列：
[
  { component: 'InputA' },
  { component: 'InputB' },
  { component: 'InputC' }
]

用陣列與 v-for 動態生成 ↑`;

const CONFIG_EXAMPLE_CODE = `{
  id: "amount",
  label: "申請金額",
  component: "Input"
}`;

export default function SolutionSection() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black mb-4 text-slate-900">Config-Driven 設計想法</h2>
        <p className="text-lg text-stone-600">將散落的邏輯集中到配置檔案，讓程式碼變得簡潔優雅</p>
      </div>

      {/* Step 1 */}
      <div className="mb-12 bg-white border-l-4 border-blue-500 p-8 rounded-lg shadow-sm">
        <h3 className="text-2xl font-bold mb-4 text-slate-900">主要概念：資料源頭配置</h3>
        <p className="text-stone-700 mb-6 leading-relaxed">
          將適合歸納在一起的欄位「邏輯」與「配置」統一定義在一個地方
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Traditional */}
          <div className="bg-stone-50 rounded-lg p-5 border-2 border-stone-200">
            <div className="text-sm font-bold text-stone-500 mb-3">比較直覺的做法</div>
            <CodeBlock code={TRADITIONAL_CODE} language="html" />
            <div className="text-red-600 mt-3 text-sm font-bold">多次重覆</div>
          </div>

          {/* Config-Driven */}
          <div className="bg-blue-50 rounded-lg p-5 border-2 border-blue-500">
            <div className="text-sm font-bold text-blue-700 mb-3">Config-Driven</div>
            <CodeBlock code={CONFIG_DRIVEN_CODE} language="javascript" />
            <div className="text-blue-700 mt-3 text-sm font-bold">只寫一次</div>
          </div>
        </div>
      </div>

      {/* Step 2 */}
      <div className="mb-12 bg-white border-l-4 border-purple-500 p-8 rounded-lg shadow-sm">
        <h3 className="text-2xl font-bold mb-4 text-slate-900">設計模式：函數式配置</h3>
        <p className="text-stone-700 mb-6 leading-relaxed">
          用 JSON 陣列替代寫死的標籤，讓結構具備靈活性
        </p>

        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-purple-200">
          <div className="text-sm font-bold mb-3 text-purple-900">實際配置範例：</div>
          <CodeBlock code={CONFIG_EXAMPLE_CODE} language="javascript" />
          <div className="mt-5 flex items-start gap-3 bg-white rounded-lg p-4 border border-purple-200">
            <div className="text-sm text-stone-700 leading-relaxed">
              <span className="font-bold text-purple-900">關鍵地方：</span>
              不用手動 import 每一個組件，只要在陣列新增一行配置即可動態渲染
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
