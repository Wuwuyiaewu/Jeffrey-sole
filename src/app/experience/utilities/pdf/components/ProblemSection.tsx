import CodeBlock from "@/components/CodeBlock";

const corsErrorCode = `// 截出來的 PDF 中，圖片區域是空白
// 或 console 出現：
// SecurityError: The canvas has been
// tainted by cross-origin data`;

const corsSolutionCode = `html2Canvas(element, {
  allowTaint: false, // 不允許污染 canvas
  useCORS: true,     // 圖片加上 crossorigin 屬性
})`;

const sizeCalcCode = `const imgWidth = 595.28; // A4 寬度固定值 (pt)
// 依照 canvas 的長寬比等比縮放高度
const imgHeight = (592.28 / canvas.width) * canvas.height;

// 建立 PDF 時用計算後的尺寸當頁面大小
const PDF = new JsPDF("p", "pt", [imgWidth, imgHeight + 30]);

// addImage 時加上邊距
PDF.addImage(pageData, "JPEG", 10, 10, imgWidth - 20, imgHeight + 10);`;

const downloadCode = `PDF.save(title + ".pdf");
// 直接觸發瀏覽器下載
return null;`;

const blobCode = `pdfItemInfoCard.value = PDF.output("blob");
return PDF.output("blob");
// 回傳 Blob，供後續 API 呼叫上傳`;

const loadingCode = `applicationStore.startLoading(); // 顯示全局 loading

const base64 = await html2Canvas(element, { ... })
  .then((canvas) => canvas.toDataURL("image/jpeg", quality));

applicationStore.stopLoading(); // 隱藏 loading
return base64;`;

export default function ProblemSection() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black mb-4 text-slate-900">遇到的問題</h2>
        <p className="text-lg text-stone-600">
          使用 html2canvas + jsPDF 時碰到的實際挑戰
        </p>
      </div>

      {/* 問題 1 */}
      <div className="mb-8 bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="bg-red-50 border-b border-red-100 px-8 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
            !
          </div>
          <h3 className="text-lg font-bold text-red-900">跨域圖片無法渲染（CORS）</h3>
        </div>
        <div className="p-8">
          <p className="text-stone-700 mb-4 leading-relaxed">
            當頁面上有來自其他 domain 的圖片（如 CDN、外部 API 回傳的圖片 URL），
            html2canvas 預設會因 CORS 限制無法繪製，導致截圖出現空白區塊。
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-bold text-red-700 mb-2">問題現象</div>
              <CodeBlock code={corsErrorCode} />
            </div>
            <div>
              <div className="text-sm font-bold text-green-700 mb-2">解法</div>
              <CodeBlock code={corsSolutionCode} />
              <p className="text-xs text-stone-600 mt-2">
                後端圖片來源也需要設定 <code className="bg-stone-100 px-1 rounded">Access-Control-Allow-Origin</code> header
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 問題 2 */}
      <div className="mb-8 bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="bg-orange-50 border-b border-orange-100 px-8 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
            !
          </div>
          <h3 className="text-lg font-bold text-orange-900">PDF 尺寸與比例計算</h3>
        </div>
        <div className="p-8">
          <p className="text-stone-700 mb-4 leading-relaxed">
            canvas 的像素尺寸與 PDF 的 pt 單位之間沒有固定換算，直接塞入會造成畫面被截斷或壓縮。
          </p>
          <div className="text-sm font-bold text-orange-700 mb-2">計算方式</div>
          <CodeBlock code={sizeCalcCode} />
        </div>
      </div>

      {/* 問題 3 */}
      <div className="mb-8 bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="bg-yellow-50 border-b border-yellow-100 px-8 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
            !
          </div>
          <h3 className="text-lg font-bold text-yellow-900">同一份 PDF 需要「下載」也需要「上傳給後端」</h3>
        </div>
        <div className="p-8">
          <p className="text-stone-700 mb-4 leading-relaxed">
            商品資料卡的 PDF 有兩個用途：
            使用者可以點擊下載存檔，同時系統也要將同一份 PDF 上傳至 BPM 流程平台。
            如果呼叫兩次轉換，效能浪費且截圖結果可能不一致。
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-bold text-yellow-700 mb-2">isForDownload = true</div>
              <CodeBlock code={downloadCode} />
            </div>
            <div>
              <div className="text-sm font-bold text-green-700 mb-2">isForDownload = false（給 BPM）</div>
              <CodeBlock code={blobCode} />
            </div>
          </div>
          <p className="text-stone-600 text-sm mt-4">
            透過 <code className="bg-stone-100 px-1 rounded">isForDownload</code> 旗標讓同一個 function 處理兩種需求，只執行一次截圖。
            <code className="bg-stone-100 px-1 rounded ml-1">pdfItemInfoCard</code> 作為 Vue ref 存放最後的 blob，方便跨組件取用。
          </p>
        </div>
      </div>

      {/* 問題 4 */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="bg-blue-50 border-b border-blue-100 px-8 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
            !
          </div>
          <h3 className="text-lg font-bold text-blue-900">使用者體驗：轉換中的 Loading 狀態</h3>
        </div>
        <div className="p-8">
          <p className="text-stone-700 mb-4 leading-relaxed">
            html2canvas 是非同步操作，在複雜頁面上可能需要數秒。
            若不加 loading 遮罩，使用者會以為點擊沒反應而重複點擊。
          </p>
          <CodeBlock code={loadingCode} />
          <p className="text-stone-600 text-sm mt-3">
            利用 Pinia store 的全局 loading 狀態，統一控制轉換前後的 UI 回饋。
          </p>
        </div>
      </div>
    </div>
  );
}
