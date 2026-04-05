import CodeBlock from "@/components/CodeBlock";

const CHART_TYPES_USAGE = `<!-- 風險總覽儀表板：三種圖表類型 -->

<!-- 1. 甜甜圈圖 — 客戶風險分佈（低 / 中 / 高） -->
<PrimeChart
  type="doughnut"
  :data="chartdoughnutData"
  :options="chartdoughnutOptions"
/>

<!-- 2. 水平長條圖 — 評級落差排名 -->
<PrimeChart
  type="bar"
  :data="chartBarData"
  :options="chartBarOptions"
/>

<!-- 3. 折線圖 — 風險趨勢（近 7 個月） -->
<PrimeChart
  type="line"
  :data="chartLineData"
  :options="chartLineOptions"
/>`;

const DATA_STRUCTURE = `// Chart.js 資料結構（PrimeChart 直接傳入）
// 與 ECharts 的 series/option 不同，Chart.js 使用 datasets 陣列

// ── 甜甜圈圖資料 ────────────────────────────────────────
const setDoughnutData = () => {
  const style = getComputedStyle(document.documentElement);
  return {
    // 無 labels（自定義 tooltip 顯示）
    datasets: [{
      data: [282000, 3360, 3360, 3360], // 各風險等級客戶數
      backgroundColor: [
        style.getPropertyValue('--low-risk-color'),    // CSS 變數
        style.getPropertyValue('--medium-risk-color'),
        style.getPropertyValue('--high-risk-color'),
      ],
    }],
  };
};

// ── 水平長條圖資料（indexAxis: 'y' 讓 X/Y 軸互換）────────
const setBarData = () => {
  const style = getComputedStyle(document.documentElement);
  return {
    labels: ['A+', 'A', 'B', 'C'],
    datasets: [{
      label: '評級落差',
      backgroundColor: style.getPropertyValue('--purple-blue-500'),
      data: [2, 50000, 320000, 5678123],
      maxBarThickness: 16,  // 限制長條寬度，保持整潔
    }],
  };
};

// ── 折線圖資料（支援多條線） ────────────────────────────
const setLineData = () => {
  const style = getComputedStyle(document.documentElement);
  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: '整體風險指數',
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: style.getPropertyValue('--cyan-500'),
        tension: 0.4,  // 平滑曲線（0 = 直線，1 = 最彎）
        fill: false,
      },
      {
        label: '行業基準',
        data: [28, 48, 40, 19, 86, 27, 90],
        borderColor: style.getPropertyValue('--gray-500'),
        tension: 0.4,
        fill: false,
      },
    ],
  };
};`;

const CSS_DOUGHNUT_CENTER = `/* 用 CSS ::before 在甜甜圈中心顯示文字標籤 */
/* 避免使用額外的 DOM 元素或 JavaScript 計算位置 */

.chart-back {
  position: relative;
  display: inline-block;
  width: 25%;

  /* 用偽元素在圓圈中心疊加文字 */
  &::before {
    position: absolute;
    top: 5px;
    z-index: -1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    font-size: 18px;
    font-weight: 700;
    color: #222;
    background-color: #fff;
    border-radius: 50%;
    content: '集團';  /* 預設文字，由 modifier class 覆寫 */
  }
}

/* 各子站用 BEM modifier 切換中心文字 */
.text-group::before      { content: '集團'; }
.text-bank::before       { content: '銀行'; }
.text-insurance::before  { content: '人壽'; }
.text-stock::before      { content: '證券'; }`;

export default function OverviewSection() {
  return (
    <div className="space-y-10">
      <div className="bg-white rounded-xl border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">使用的圖表技術</h2>
        <p className="text-slate-500 mb-8">
          在國泰金控風險總覽儀表板（Risk Overview Dashboard）中，
          使用 <strong className="text-slate-800">PrimeVue 的 PrimeChart</strong> 元件包裝 <strong className="text-slate-800">Chart.js</strong>，
          實作三種圖表類型，視覺化呈現企業客戶的信用風險分佈與趨勢。
        </p>

        {/* Tech stack */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            {
              title: "Chart.js",
              subtitle: "核心圖表引擎",
              desc: "透過 PrimeVue PrimeChart 元件包裝使用，設定方式沿用 Chart.js 原生 datasets/options 結構",
              color: "border-pink-200 bg-pink-50",
              badge: "bg-pink-100 text-pink-700",
            },
            {
              title: "PrimeVue PrimeChart",
              subtitle: "Vue 3 包裝層",
              desc: "以 Vue 元件封裝 Chart.js，支援 :pt（Passthrough）API 控制內層 canvas 的 CSS，無需手動操作 DOM",
              color: "border-blue-200 bg-blue-50",
              badge: "bg-blue-100 text-blue-700",
            },
            {
              title: "CSS Custom Properties",
              subtitle: "動態主題色彩",
              desc: "從 CSS 變數讀取顏色（--low-risk-color 等），讓圖表顏色跟隨全站主題，不硬編碼 hex",
              color: "border-emerald-200 bg-emerald-50",
              badge: "bg-emerald-100 text-emerald-700",
            },
          ].map((item) => (
            <div key={item.title} className={`rounded-xl border p-5 ${item.color}`}>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.badge}`}>
                {item.subtitle}
              </span>
              <h3 className="font-bold text-slate-800 mt-2 mb-1">{item.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Chart types */}
        <section className="mb-10">
          <h3 className="text-lg font-bold text-slate-800 mb-4">使用的三種圖表</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              {
                type: "Doughnut",
                name: "甜甜圈圖",
                use: "客戶風險分佈（低 / 中 / 高）",
                detail: "四個子站各一個甜甜圈圖，中心文字用 CSS ::before 偽元素疊加，不需要 JS 定位",
                icon: "◎",
              },
              {
                type: "Bar (horizontal)",
                name: "水平長條圖",
                use: "評級落差排名",
                detail: "indexAxis: 'y' 將 X/Y 軸互換，maxBarThickness 限制長條寬度，視覺更整潔",
                icon: "▬",
              },
              {
                type: "Line",
                name: "折線圖",
                use: "風險趨勢（近 7 個月）",
                detail: "tension: 0.4 平滑曲線，多條線對比，顏色來自 CSS 變數，支援 dark mode",
                icon: "∿",
              },
            ].map((chart) => (
              <div key={chart.type} className="rounded-lg border border-slate-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl text-slate-400 font-mono">{chart.icon}</span>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{chart.name}</p>
                    <p className="text-xs text-slate-400">{chart.type}</p>
                  </div>
                </div>
                <p className="text-xs font-semibold text-blue-600 mb-1">{chart.use}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{chart.detail}</p>
              </div>
            ))}
          </div>
          <CodeBlock code={CHART_TYPES_USAGE} language="html" />
        </section>

        {/* Data structure */}
        <section className="mb-10">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Chart.js 資料結構與設定</h3>
          <p className="text-sm text-slate-500 mb-4">
            與 ECharts 的 <code className="bg-slate-100 px-1 rounded">series</code> / <code className="bg-slate-100 px-1 rounded">option</code> 不同，
            Chart.js 採用 <code className="bg-slate-100 px-1 rounded">datasets</code> 陣列結構，
            各圖表類型的差異主要在 <code className="bg-slate-100 px-1 rounded">options</code> 設定。
          </p>
          <CodeBlock code={DATA_STRUCTURE} language="typescript" />
        </section>

        {/* CSS technique */}
        <section>
          <h3 className="text-lg font-bold text-slate-800 mb-4">CSS 技巧：偽元素做甜甜圈中心文字</h3>
          <p className="text-sm text-slate-500 mb-4">
            四個子站的甜甜圈圖需要在中心顯示不同文字（集團、銀行、人壽、證券）。
            避免用 JS 計算位置或額外的 DOM 包裝，改用 <code className="bg-slate-100 px-1 rounded">::before</code> 偽元素 + BEM modifier class，
            讓 CSS 控制文字切換，元件保持無狀態。
          </p>
          <CodeBlock code={CSS_DOUGHNUT_CENTER} language="css" />
        </section>
      </div>
    </div>
  );
}
