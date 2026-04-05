export default function BenefitsSection() {
  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black mb-4 text-slate-900">越大量的判斷撰寫</h2>
        <p className="text-lg text-stone-600">越能體現出 <strong className="text-blue-600">Config-Driven</strong> 的好處</p>
      </div>

      {/* Core Benefits */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Benefit 1 */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold mb-4">降低讀檔案的負擔</h3>
          <div className="space-y-3 text-blue-50">
            <p className="leading-relaxed">
              <strong className="text-white">資料結構一目了然</strong>
            </p>
            <p className="text-sm leading-relaxed">
              陣列配置就是表單的縮影，減少在落落長的 HTML 標籤中翻來覆去的找，更好掌握整個頁面結構。
            </p>
          </div>
        </div>

        {/* Benefit 2 */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-8 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold mb-4">修改成本較低</h3>
          <div className="space-y-3 text-purple-50">
            <p className="leading-relaxed">
              <strong className="text-white">新增刪除就是修改陣列</strong>
            </p>
            <p className="text-sm leading-relaxed">
              不需再寫 import、不需再複製貼上標籤，只要在陣列中加減物件就能在 UI 生效。
            </p>
          </div>
        </div>

        {/* Benefit 3 */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-8 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold mb-4">配置即文件</h3>
          <div className="space-y-3 text-green-50">
            <p className="leading-relaxed">
              <strong className="text-white">減少沒意義的註解</strong>
            </p>
            <p className="text-sm leading-relaxed">
              JSON 結構在開發上即可作為文件，可以方便和接手的同事說明方向。
            </p>
          </div>
        </div>

        {/* Benefit 4 */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-8 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold mb-4">動態擴充能力</h3>
          <div className="space-y-3 text-orange-50">
            <p className="leading-relaxed">
              <strong className="text-white">更高的重用性</strong>
            </p>
            <p className="text-sm leading-relaxed">
              因為是純 JSON 資料，未來可以輕易讓後端 API 提供表單配置，達到動態渲染不同客戶專屬表單的強大能力。
            </p>
          </div>
        </div>
      </div>

      {/* Future Possibilities */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8 border-2 border-indigo-200">
        <h3 className="text-xl font-bold mb-6 text-center text-indigo-900">後續擴展方向</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {/* <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="font-bold mb-3 text-indigo-600">後端驅動配置 (BFF)</div>
            <p className="text-sm text-stone-700 leading-relaxed">
              配置改由後端提供，允許系統在不重新佈署的情況下，動態調整表單欄位。
            </p>
          </div> */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="font-bold mb-3 text-purple-600">加入 attribute 各種屬性</div>
            <p className="text-sm text-stone-700 leading-relaxed">
              應對不同的需求、元件選擇可以加入不同的屬性配置進來。
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="font-bold mb-3 text-pink-600">版型管理</div>
            <p className="text-sm text-stone-700 leading-relaxed">
              可以對區塊範圍做優先靜態版型管理，例如用 grid 或是 flex 布局。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
