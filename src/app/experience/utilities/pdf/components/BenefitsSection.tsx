export default function BenefitsSection() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black mb-4 text-slate-900">帶來幫助</h2>
        <p className="text-lg text-stone-600">
          這套 utility 在實際專案中解決的問題
        </p>
      </div>

      {/* 主要效益 */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm text-center">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📄</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">不依賴後端產生 PDF</h3>
          <p className="text-sm text-stone-600 leading-relaxed">
            前端直接將畫面轉成 PDF，不需要後端額外開發 PDF 產生 API，節省溝通與開發成本。
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm text-center">
          <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔗</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">整合 BPM 流程</h3>
          <p className="text-sm text-stone-600 leading-relaxed">
            透過 <code className="bg-stone-100 px-1 rounded">Blob</code> 回傳，
            直接對接後端 BPM 平台 API，讓「填表 → 產 PDF → 送簽」形成完整流程。
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">♻️</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">一函數、兩用途</h3>
          <p className="text-sm text-stone-600 leading-relaxed">
            <code className="bg-stone-100 px-1 rounded">isForDownload</code> 旗標讓同一個 utility 同時支援「使用者下載」與「系統上傳」，不重複截圖。
          </p>
        </div>
      </div>

      {/* 使用情境 */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-8 mb-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">實際使用情境</h3>
        <div className="space-y-4">
          {[
            {
              title: "商品資料卡 PDF 產出",
              desc: "採購人員填寫商品基本資料後，系統自動將當前頁面畫面轉成 PDF，同時觸發下載 並 上傳至 BPM 等待主管簽核。",
              tags: ["getItemCardPdf", "isForDownload: false", "BPM 上傳"],
              color: "border-blue-300 bg-blue-50",
              tagColor: "bg-blue-100 text-blue-700",
            },
            {
              title: "截圖預覽 / Base64 上傳",
              desc: "需要將頁面局部畫面轉成圖片上傳至後端，例如簽核通過後留存當下的畫面紀錄。",
              tags: ["getHtmlBase64", "quality: 0.9", "base64 上傳"],
              color: "border-purple-300 bg-purple-50",
              tagColor: "bg-purple-100 text-purple-700",
            },
          ].map((item, i) => (
            <div key={i} className={`rounded-lg p-6 border-2 ${item.color}`}>
              <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
              <p className="text-stone-700 text-sm leading-relaxed mb-3">{item.desc}</p>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className={`text-xs px-2 py-1 rounded font-mono ${item.tagColor}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 技術 Stack */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-8 text-white">
        <h3 className="text-xl font-bold mb-6">技術 Stack</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="text-slate-400 text-sm font-semibold mb-3 uppercase tracking-wide">前端 Library</div>
            <div className="space-y-2">
              {[
                { name: "html2canvas", desc: "DOM → Canvas 截圖" },
                { name: "jsPDF", desc: "Canvas → PDF 封裝" },
                { name: "Vue 3 + Pinia", desc: "狀態管理（loading、blob ref）" },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <code className="bg-white/10 px-2 py-1 rounded text-sm">{item.name}</code>
                  <span className="text-slate-400 text-sm">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-sm font-semibold mb-3 uppercase tracking-wide">關鍵設定</div>
            <div className="space-y-2">
              {[
                { key: "useCORS: true", desc: "處理跨域圖片" },
                { key: "allowTaint: false", desc: "避免 canvas 被污染" },
                { key: "A4 = 595.28pt", desc: "PDF 標準寬度換算" },
                { key: "PDF.output(\"blob\")", desc: "回傳二進制供 API 上傳" },
              ].map((item) => (
                <div key={item.key} className="flex items-center gap-3">
                  <code className="bg-white/10 px-2 py-1 rounded text-xs">{item.key}</code>
                  <span className="text-slate-400 text-sm">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
