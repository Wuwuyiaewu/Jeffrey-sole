    
export default function ConfigDrivenPage() {
  return (
      <div className="mb-12 bg-white border-l-4 border-green-500 p-8 rounded-lg shadow-sm">
        <h3 className="text-2xl font-bold mb-4 text-slate-900">實現方式：動態渲染引擎</h3>
        <p className="text-stone-700 mb-6 leading-relaxed">
          一個通用的渲染函數，根據配置自動生成 UI
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-5 border-2 border-stone-200 text-center">
            <div className="font-bold text-sm mb-2 text-slate-900">讀取配置</div>
            <div className="text-xs text-stone-600 leading-relaxed">
              從 Config 陣列取得所有欄位定義
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border-2 border-stone-200 text-center">
            <div className="font-bold text-sm mb-2 text-slate-900">執行函數</div>
            <div className="text-xs text-stone-600 leading-relaxed">
              呼叫 getVisible、getDisabled 取得當前狀態
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border-2 border-stone-200 text-center">
            <div className="font-bold text-sm mb-2 text-slate-900">渲染組件</div>
            <div className="text-xs text-stone-600 leading-relaxed">
              動態載入對應組件並套用屬性
            </div>
          </div>
        </div>

        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-5">
          <div className="text-sm text-stone-700 leading-relaxed">
            組件不再關心「我該不該顯示」、「我能不能編輯」，<br/>
            只需要專注「如何漂亮地渲染」，所有邏輯由配置驅動
          </div>
        </div>
      </div>
  )
}