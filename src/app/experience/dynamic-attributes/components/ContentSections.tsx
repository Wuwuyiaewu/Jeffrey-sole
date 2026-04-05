// This file will house Problem, Solution, Benefits sections
import React from 'react';

export function SolutionSection() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 md:p-12">
        <h2 className="text-3xl font-bold mb-6 text-slate-900">核心解法：Context Resolver 模式</h2>
        <div className="prose prose-slate max-w-none text-lg text-slate-600 leading-relaxed space-y-6">
          <p>
            在前一章「靜態渲染多元組件」中，我們讓結構從 HTML 標籤海解脫出來。但真實世界的商業邏輯從來不純粹只有「展示」：
            <strong className="text-blue-600">這個欄位老闆要必填、那個欄位客人看不到、超過一萬元的申請需要寫備註...</strong>
          </p>
          <p>
            如果把它們通通寫進 Vue / React 的 Template 裡面（如 <code className="text-sm bg-slate-100 text-pink-600 px-2 py-0.5 rounded">v-if="role === 'admin' &amp;&amp; amount {'>'} 1000"</code>），就會造成視圖層 (View) 承載過多的業務邏輯，當這類判斷達到幾十個時，專案便會變得難以接手與測試。
          </p>
          
          <div className="bg-slate-50 border-l-4 border-blue-500 p-6 rounded-r-lg mt-8">
            <h3 className="text-xl font-bold text-slate-800 mb-4">抽取 Function Reference 的精髓</h3>
            <p className="text-base text-slate-600 mb-4">
              與其傳遞 Boolean，我們在 Config 中定義一個接收 <code className="font-mono text-sm bg-slate-200 px-1 rounded">ctx (Context)</code> 的純函數。
            </p>
            <ul className="space-y-3 text-base text-slate-600">
              <li className="flex gap-3">
                <span className="text-blue-500 font-bold">1.</span>
                <div>
                  <strong>定義 Context (上下文資料)</strong>：將目前使用者的角色、申請狀態或任何會影響畫面的「狀態」集結成一個 Object。
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-500 font-bold">2.</span>
                <div>
                  <strong>配置業務邏輯</strong>：在 Config 宣告 <code className="font-mono text-sm bg-slate-200 px-1 rounded">required: (ctx) ={'>'} ctx.role === 'admin'</code>。
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-500 font-bold">3.</span>
                <div>
                  <strong>透過 Resolver 計算結果</strong>：在通用的 Form 渲染元件裡，將 Context 傳入 Config 中定義的 function 裡執行，動態得出該欄位當下該不該 required 或 disabled。
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BenefitsSection() {
  return (
    <div className="space-y-8">
      {/* Core Benefits */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Benefit 1 */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold mb-4">邏輯高內聚、好尋找</h3>
          <div className="space-y-3 text-blue-50">
            <p className="leading-relaxed">
              <strong className="text-white">告別散落各地的 if/else</strong>
            </p>
            <p className="text-sm leading-relaxed">
              以前我們要找「為什麼這顆按鈕被反白了？」可能要翻遍好幾個 Computed，現在所有的權限判定、金額判定，全部都在同一個 Config 檔案裡被收斂完成。
            </p>
          </div>
        </div>

        {/* Benefit 2 */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-8 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold mb-4">視圖層保持絕對純粹</h3>
          <div className="space-y-3 text-purple-50">
            <p className="leading-relaxed">
              <strong className="text-white">Template 不再背負商業邏輯</strong>
            </p>
            <p className="text-sm leading-relaxed">
              Vue/React 元件只需要單純的負責接收 boolean 值並把皮（外觀）畫出來就好。商業邏輯被完全剝離到 JavaScript 的設定檔裡。這也是為什麼叫做 "Config-Driven"。
            </p>
          </div>
        </div>
      </div>
      
      {/* 延續擴展 */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8 border-2 border-indigo-200">
        <h3 className="text-xl font-bold mb-6 text-center text-indigo-900">延續：結合前面的配置概念</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="font-bold mb-3 text-purple-600">加入 attribute 各種屬性</div>
            <p className="text-sm text-stone-700 leading-relaxed">
              應對不同的需求、元件選擇可以加入不同的屬性配置進來，例如下拉選單可以動態決定是否開啟搜尋。
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="font-bold mb-3 text-pink-600">版型管理</div>
            <p className="text-sm text-stone-700 leading-relaxed">
              可以對區塊範圍做優先靜態版型管理，例如用 grid 或是 flex 布局，指定某個欄位佔據的跨度等。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
