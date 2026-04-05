import CodeBlock from "@/components/CodeBlock";

const TOOLTIP_PROBLEM = `// ❌ 問題：手動操作 DOM 實作自定義 tooltip，脆弱且難維護
const setDoughnutOptions = () => ({
  plugins: {
    tooltip: {
      enabled: false,
      // external callback 手動建立、定位、刪除 tooltip DOM 元素
      external: function (context: any) {
        let tooltipEl = document.getElementById('chartjs-tooltip');

        // 手動建立 DOM
        if (!tooltipEl) {
          tooltipEl = document.createElement('div');
          tooltipEl.id = 'chartjs-tooltip';
          document.body.appendChild(tooltipEl);
        }

        const tooltipModel = context.tooltip;

        // 手動控制顯示 / 隱藏
        if (tooltipModel?.opacity === 0) {
          tooltipEl.style.opacity = '0';
          return;
        }

        // 手動計算位置（用 canvas 位置 + tooltip offset）
        const position = context.chart.canvas.getBoundingClientRect();
        tooltipEl.style.opacity = '1';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
        tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';

        // 手動填充 HTML 內容
        tooltipEl.innerHTML = \`<table>...</table>\`;
      }
    }
  }
});

// ❌ 問題：
// 1. tooltipEl 掛在 document.body，元件銷毀後 DOM 不會自動清除（記憶體洩漏）
// 2. 位置計算依賴 window.pageXOffset（已廢棄，應用 window.scrollX）
// 3. innerHTML 直接賦值，有 XSS 風險（若資料來自 API）
// 4. any 型別：context: any 失去型別保護`;

const NO_RESIZE = `// ❌ 問題：沒有處理容器尺寸變化
// 當側邊欄展開/收合、視窗縮放時，圖表不會重新計算尺寸

onMounted(() => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
  // ← 沒有 ResizeObserver，圖表在容器尺寸改變時會錯位
});

// Chart.js 本身有 responsive: true 預設，
// 但只監聽 window resize，不監聽容器元素的尺寸變化
// 若父容器是動態寬度（Flexbox/Grid + 側邊欄切換），
// 需要手動觸發 chart.resize()`;

const STATIC_INIT = `// ❌ 問題：資料與選項在 onMounted 初始化後就固定了
// 若之後需要根據篩選條件更新圖表，沒有對應的更新機制

onMounted(() => {
  // 直接帶入硬編碼的假資料，沒有與 API 資料綁定
  chartdoughnutData.value = {
    datasets: [{
      data: ['282000', '3360', '3360', '3360'],
      // ❌ 數字存成字串，Chart.js 會嘗試轉換但可能造成排序異常
    }]
  };
});

// ❌ 其他問題：
// - data 的數字存成字串 '282000' 而非數字 282000
// - 無法根據日期篩選、子站切換等條件重新渲染圖表
// - 各圖表的 options 分散在多個 function，邏輯不統一`;

const MISSING_ACCESSIBILITY = `<!-- ❌ 問題：canvas 圖表缺少無障礙支援 -->
<PrimeChart
  type="doughnut"
  :data="chartdoughnutData"
  :options="chartdoughnutOptions"
/>
<!-- 螢幕閱讀器完全無法理解 canvas 的內容 -->

<!-- Chart.js 建議的做法是提供 fallback 內容： -->
<!-- <canvas>
  <table> <!-- 資料的文字替代呈現 -->
  </table>
</canvas> -->`;

export default function ProblemsSection() {
  return (
    <div className="space-y-10">
      <div className="bg-white rounded-xl border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">基礎用法的侷限</h2>
        <p className="text-slate-500 mb-8">
          在風險總覽儀表板初版中，圖表的基礎功能雖然能正常運作，
          但在幾個面向存在明顯的改進空間，這些問題在需求增長後逐漸浮現。
        </p>

        {/* Problem 1 */}
        <div className="mb-10">
          <div className="flex items-start gap-3 mb-4">
            <span className="shrink-0 mt-0.5 size-6 rounded-full bg-red-100 text-red-600 text-sm font-bold flex items-center justify-center">1</span>
            <div>
              <h3 className="text-lg font-bold text-slate-800">自定義 Tooltip：手動操作 DOM，有記憶體洩漏風險</h3>
              <p className="text-slate-500 mt-1 text-sm">
                Chart.js 的 <code className="bg-slate-100 px-1 rounded">external tooltip</code> 模式需要開發者自行管理 DOM 元素的建立、定位與銷毀。
                原始實作將 tooltip div 掛在 <code className="bg-slate-100 px-1 rounded">document.body</code>，
                元件被銷毀後這個 div 仍然存在，造成 DOM 洩漏。
              </p>
            </div>
          </div>
          <CodeBlock code={TOOLTIP_PROBLEM} language="typescript" />
        </div>

        {/* Problem 2 */}
        <div className="mb-10">
          <div className="flex items-start gap-3 mb-4">
            <span className="shrink-0 mt-0.5 size-6 rounded-full bg-red-100 text-red-600 text-sm font-bold flex items-center justify-center">2</span>
            <div>
              <h3 className="text-lg font-bold text-slate-800">沒有處理容器尺寸變化（Sidebar 展開/收合）</h3>
              <p className="text-slate-500 mt-1 text-sm">
                儀表板有可展開收合的側邊欄，當 Sidebar 狀態改變時，主內容區的寬度會變化。
                Chart.js 內建的 <code className="bg-slate-100 px-1 rounded">responsive: true</code> 只監聽 <code className="bg-slate-100 px-1 rounded">window resize</code>，
                不監聽容器元素本身的尺寸變化，導致圖表在 Sidebar 切換後不會自動調整。
              </p>
            </div>
          </div>
          <CodeBlock code={NO_RESIZE} language="typescript" />
        </div>

        {/* Problem 3 */}
        <div className="mb-10">
          <div className="flex items-start gap-3 mb-4">
            <span className="shrink-0 mt-0.5 size-6 rounded-full bg-red-100 text-red-600 text-sm font-bold flex items-center justify-center">3</span>
            <div>
              <h3 className="text-lg font-bold text-slate-800">資料靜態初始化：無法根據篩選條件更新圖表</h3>
              <p className="text-slate-500 mt-1 text-sm">
                所有圖表資料在 <code className="bg-slate-100 px-1 rounded">onMounted</code> 初始化後就固定，
                缺乏連接 API 資料與響應式更新的機制。
                另外資料中數字被存為字串（<code className="bg-slate-100 px-1 rounded">'282000'</code>），雖然 Chart.js 能強制轉換，但存在隱性風險。
              </p>
            </div>
          </div>
          <CodeBlock code={STATIC_INIT} language="typescript" />
        </div>

        {/* Problem 4 */}
        <div>
          <div className="flex items-start gap-3 mb-4">
            <span className="shrink-0 mt-0.5 size-6 rounded-full bg-red-100 text-red-600 text-sm font-bold flex items-center justify-center">4</span>
            <div>
              <h3 className="text-lg font-bold text-slate-800">canvas 圖表缺少無障礙（a11y）支援</h3>
              <p className="text-slate-500 mt-1 text-sm">
                <code className="bg-slate-100 px-1 rounded">&lt;canvas&gt;</code> 本身對螢幕閱讀器是不透明的黑盒子。
                原始實作沒有提供任何替代文字或 ARIA 屬性，視障使用者完全無法理解圖表內容。
              </p>
            </div>
          </div>
          <CodeBlock code={MISSING_ACCESSIBILITY} language="html" />
        </div>
      </div>
    </div>
  );
}
