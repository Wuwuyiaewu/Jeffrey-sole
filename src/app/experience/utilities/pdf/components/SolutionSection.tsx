import CodeBlock from "@/components/CodeBlock";

const getHtmlBase64Code = `export const getHtmlBase64 = async (id: string, quality = 0.9) => {
  const applicationStore = useApplicationStore();
  const toCanvasElement = document.getElementById(id);

  if (toCanvasElement) {
    applicationStore.startLoading();
    const base64 = await html2Canvas(toCanvasElement, {
      allowTaint: false,
      useCORS: true, // 允許跨域圖片
    }).then((canvas) => canvas.toDataURL("image/jpeg", quality));

    applicationStore.stopLoading();
    return base64;
  }
  return null;
};`;

const getItemCardPdfCode = `export const getItemCardPdf = async (
  idStr: string,
  isForDownload: boolean,
  title?: string
) => {
  const toCanvasElement = document.getElementById(idStr);

  if (toCanvasElement) {
    const blob = await html2Canvas(toCanvasElement, {
      allowTaint: false,
      useCORS: true,
    }).then((canvas) => {
      const imgWidth = 595.28; // A4 寬度 (pt)
      const imgHeight = (592.28 / canvas.width) * canvas.height;
      const pageData = canvas.toDataURL("image/jpeg", 1.0);

      const PDF = new JsPDF("p", "pt", [imgWidth, imgHeight + 30]);
      PDF.addImage(pageData, "JPEG", 10, 10, imgWidth - 20, imgHeight + 10);

      if (isForDownload) {
        PDF.save(title + ".pdf"); // 直接觸發下載
        return null;
      }
      return PDF.output("blob"); // 回傳 Blob 給 BPM
    });
  }
};`;

export default function SolutionSection() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black mb-4 text-slate-900">設計想法</h2>
        <p className="text-lg text-stone-600">
          透過 html2canvas 擷取 DOM 畫面，再用 jsPDF 封裝成 PDF，讓前端直接產出可下載或可傳送的文件
        </p>
      </div>

      {/* 兩個 Utility 功能說明 */}
      <div className="mb-12 bg-white border-l-4 border-blue-500 p-8 rounded-lg shadow-sm">
        <h3 className="text-2xl font-bold mb-4 text-slate-900">getHtmlBase64 — 截圖轉 Base64</h3>
        <p className="text-stone-700 mb-6 leading-relaxed">
          傳入 DOM element 的 <code className="bg-stone-100 px-1 rounded text-sm">id</code>，
          利用 html2canvas 轉成 canvas 後，再以 <code className="bg-stone-100 px-1 rounded text-sm">toDataURL</code> 輸出
          JPEG base64 字串。主要用於需要「圖片預覽」或「上傳圖片」的場景。
        </p>

        <CodeBlock code={getHtmlBase64Code} />

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-sm font-bold text-blue-700 mb-1">參數</div>
            <div className="text-sm text-stone-700">
              <code className="bg-white px-1 rounded">id</code> — DOM element id<br />
              <code className="bg-white px-1 rounded">quality</code> — 圖片品質 0~1（預設 0.9）
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-sm font-bold text-blue-700 mb-1">回傳</div>
            <div className="text-sm text-stone-700">
              <code className="bg-white px-1 rounded">string | null</code> — JPEG base64 字串
            </div>
          </div>
        </div>
      </div>

      {/* Step 2 */}
      <div className="mb-12 bg-white border-l-4 border-purple-500 p-8 rounded-lg shadow-sm">
        <h3 className="text-2xl font-bold mb-4 text-slate-900">getItemCardPdf — 轉 PDF（下載 or Blob）</h3>
        <p className="text-stone-700 mb-6 leading-relaxed">
          同樣擷取 DOM，但會計算比例後產生 A4 尺寸的 PDF。
          可根據 <code className="bg-stone-100 px-1 rounded text-sm">isForDownload</code> 旗標決定
          「直接下載」或「回傳 Blob 給後端 BPM 系統」。
        </p>

        <CodeBlock code={getItemCardPdfCode} />

        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="text-sm font-bold text-purple-700 mb-1">isForDownload = true</div>
            <div className="text-sm text-stone-700">觸發瀏覽器下載，不回傳</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="text-sm font-bold text-purple-700 mb-1">isForDownload = false</div>
            <div className="text-sm text-stone-700">回傳 Blob，供 API 上傳至 BPM</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="text-sm font-bold text-purple-700 mb-1">pdfItemInfoCard</div>
            <div className="text-sm text-stone-700">Vue ref，跨組件共享最後產生的 Blob</div>
          </div>
        </div>
      </div>

      {/* 流程圖 */}
      <div className="bg-gradient-to-br from-slate-50 to-stone-100 rounded-xl p-8 border border-stone-200">
        <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">整體流程</h3>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {[
            { label: "DOM Element", color: "bg-slate-200 text-slate-800" },
            { label: "→", color: "" },
            { label: "html2canvas", color: "bg-blue-100 text-blue-800" },
            { label: "→", color: "" },
            { label: "Canvas", color: "bg-green-100 text-green-800" },
            { label: "→", color: "" },
            { label: "toDataURL", color: "bg-yellow-100 text-yellow-800" },
            { label: "→", color: "" },
            { label: "jsPDF / Base64", color: "bg-purple-100 text-purple-800" },
            { label: "→", color: "" },
            { label: "下載 / Blob / 預覽", color: "bg-red-100 text-red-800" },
          ].map((step, i) =>
            step.color ? (
              <span
                key={i}
                className={`px-3 py-2 rounded-lg text-sm font-semibold ${step.color}`}
              >
                {step.label}
              </span>
            ) : (
              <span key={i} className="text-stone-400 font-bold text-lg">
                {step.label}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
}
