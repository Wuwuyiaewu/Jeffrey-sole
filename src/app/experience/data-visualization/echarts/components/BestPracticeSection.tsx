import CodeBlock from "@/components/CodeBlock";

const COMPOSABLE_CHART = `// ✅ 最佳實踐：封裝成可複用的 Composable
// src/composables/useRiskChart.ts

import { ref, computed, watch, onUnmounted } from "vue";
import type { ChartData, ChartOptions } from "chart.js";

type RiskLevel = "low" | "medium" | "high";

interface RiskDistribution {
  low: number;
  medium: number;
  high: number;
}

export function useRiskDoughnutChart(data: Ref<RiskDistribution>) {
  // ── 從 CSS 變數讀取顏色（在 setup 階段讀取，而非 onMounted）──
  const getRiskColors = () => {
    const style = getComputedStyle(document.documentElement);
    return {
      low:    style.getPropertyValue("--low-risk-color").trim(),
      medium: style.getPropertyValue("--medium-risk-color").trim(),
      high:   style.getPropertyValue("--high-risk-color").trim(),
    };
  };

  // ── computed 讓資料變化時圖表自動更新 ──────────────────────
  const chartData = computed<ChartData<"doughnut">>(() => {
    const colors = getRiskColors();
    return {
      datasets: [{
        // ✅ 確保是 number[]，不是 string[]
        data: [data.value.low, data.value.medium, data.value.high],
        backgroundColor: [colors.low, colors.medium, colors.high],
        borderWidth: 0,
      }],
    };
  });

  const chartOptions = computed<ChartOptions<"doughnut">>(() => ({
    responsive: true,
    maintainAspectRatio: true,
    cutout: "75%",  // 控制中間空洞大小
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          // ✅ 用 callbacks 格式化 tooltip，不操作 DOM
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const pct = ((ctx.raw as number / total) * 100).toFixed(1);
            const labels = ["低風險", "中風險", "高風險"];
            return \` \${labels[ctx.dataIndex]}: \${(ctx.raw as number).toLocaleString()} 戶 (\${pct}%)\`;
          },
        },
      },
    },
  }));

  return { chartData, chartOptions };
}`;

const RESIZE_OBSERVER = `// ✅ 最佳實踐：用 ResizeObserver 監聽容器尺寸，
//    在 Sidebar 展開/收合後重新計算圖表大小

import { ref, onMounted, onUnmounted } from "vue";
import type { Chart } from "chart.js";

export function useChartResize(chartRef: Ref<Chart | null>) {
  const containerRef = ref<HTMLElement | null>(null);
  let observer: ResizeObserver | null = null;

  onMounted(() => {
    if (!containerRef.value) return;

    observer = new ResizeObserver(() => {
      // 容器尺寸改變時，通知 Chart.js 重新計算
      chartRef.value?.resize();
    });

    observer.observe(containerRef.value);
  });

  onUnmounted(() => {
    // ✅ 清理：元件銷毀時斷開觀察，防止記憶體洩漏
    observer?.disconnect();
    observer = null;
  });

  return { containerRef };
}

// ── 在元件中使用 ───────────────────────────────────────────
// <template>
//   <div ref="containerRef">
//     <PrimeChart ref="chartRef" type="doughnut" ... />
//   </div>
// </template>
//
// <script setup>
// const chartRef = ref(null);
// const { containerRef } = useChartResize(computed(() => chartRef.value?.chart));
// </script>`;

const TOOLTIP_TELEPORT = `<!-- ✅ 最佳實踐：用 Vue Teleport + v-show 取代手動 DOM tooltip -->
<!-- 無需操作 document，元件銷毀時 Teleport 自動清理 -->

<template>
  <div ref="containerRef" class="relative">
    <PrimeChart
      type="doughnut"
      :data="chartData"
      :options="chartOptions"
      @mousemove="onChartHover"
      @mouseleave="hideTooltip"
    />

    <!-- ✅ Teleport 到 body，保持 z-index 正確，但 Vue 管理生命週期 -->
    <Teleport to="body">
      <div
        v-show="tooltip.visible"
        class="fixed z-50 pointer-events-none bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-sm"
        :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
      >
        <p class="font-semibold text-slate-800">{{ tooltip.label }}</p>
        <p class="text-slate-500">{{ tooltip.value.toLocaleString() }} 戶</p>
        <p class="text-slate-500">佔比：{{ tooltip.percent }}%</p>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const tooltip = reactive({
  visible: false,
  x: 0,
  y: 0,
  label: "",
  value: 0,
  percent: "0",
});

const onChartHover = (event: MouseEvent, elements: ActiveElement[]) => {
  if (!elements.length) { tooltip.visible = false; return; }

  const el = elements[0];
  // ✅ 使用 scrollX/scrollY（pageXOffset 已廢棄）
  tooltip.x = event.clientX + window.scrollX + 12;
  tooltip.y = event.clientY + window.scrollY + 12;
  tooltip.visible = true;
  // 從 chartData 取對應資料填充...
};

const hideTooltip = () => { tooltip.visible = false; };
</script>`;

const TYPED_OPTIONS = `// ✅ 最佳實踐：用 Chart.js 的型別系統，不用 any
import type {
  ChartData,
  ChartOptions,
  TooltipItem,
  ActiveElement,
  Chart,
} from "chart.js";

// ── 型別化的圖表 Options 函式 ──────────────────────────────
const getLineOptions = (): ChartOptions<"line"> => {
  const style = getComputedStyle(document.documentElement);
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: style.getPropertyValue("--text-color") },
      },
      tooltip: {
        callbacks: {
          // ✅ TypeScript 知道 TooltipItem<"line"> 的結構
          label: (item: TooltipItem<"line">) =>
            \` \${item.dataset.label}: \${item.parsed.y.toLocaleString()}\`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: style.getPropertyValue("--text-color-secondary") },
        grid:  { color: style.getPropertyValue("--surface-border") },
      },
      y: {
        ticks: {
          color: style.getPropertyValue("--text-color-secondary"),
          // 格式化 Y 軸數字（如：50000 → 5萬）
          callback: (value) =>
            typeof value === "number" && value >= 10000
              ? \`\${(value / 10000).toFixed(0)}萬\`
              : value,
        },
        grid: { color: style.getPropertyValue("--surface-border") },
      },
    },
    // ✅ 點擊圖表元素觸發篩選
    onClick: (event: ChartEvent, elements: ActiveElement[], chart: Chart) => {
      if (elements.length) {
        const idx = elements[0].index;
        emit("bar-click", chart.data.labels?.[idx]);
      }
    },
  };
};`;

const WATCH_DATA = `// ✅ 最佳實踐：watch API 資料，自動更新圖表
// 讓圖表能響應篩選條件（日期範圍、子站切換）

import { watch, computed } from "vue";

// props 接收來自父層的篩選條件
const props = defineProps<{
  dateRange: [Date, Date];
  subsidiaryId: string;
}>();

// 根據篩選條件取得圖表資料
const { data: riskData, isLoading } = useQuery({
  queryKey: computed(() => ["risk-distribution", props.subsidiaryId, props.dateRange]),
  queryFn: () => fetchRiskDistribution(props.subsidiaryId, props.dateRange),
});

// ✅ computed 讓 chartData 自動跟隨 riskData 更新
// Vue 的響應式系統會在資料變化時觸發圖表重繪
const { chartData, chartOptions } = useRiskDoughnutChart(
  computed(() => riskData.value ?? { low: 0, medium: 0, high: 0 })
);`;

export default function BestPracticeSection() {
  return (
    <div className="space-y-10">
      <div className="bg-white rounded-xl border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">最佳實踐：改良後的設計模式</h2>
        <p className="text-slate-500 mb-8">
          針對基礎用法的四個侷限，整理出對應的改良方式，
          目標是讓圖表元件具備響應式更新、正確的資源清理，以及更好的型別安全。
        </p>

        {/* BP 1 */}
        <section className="mb-12">
          <div className="flex items-start gap-3 mb-4">
            <span className="shrink-0 mt-0.5 size-7 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold flex items-center justify-center">A</span>
            <div>
              <h3 className="text-lg font-bold text-slate-800">封裝成 Composable，讓資料驅動圖表更新</h3>
              <p className="text-slate-500 text-sm mt-1">
                將圖表資料與選項的組裝邏輯抽出為 <code className="bg-slate-100 px-1 rounded">useRiskDoughnutChart</code>，
                用 <code className="bg-slate-100 px-1 rounded">computed</code> 包裝 chartData，
                當外部資料（API 回應、篩選條件）改變時，圖表自動重繪，不需要手動呼叫任何更新方法。
              </p>
            </div>
          </div>
          <CodeBlock code={COMPOSABLE_CHART} language="typescript" />
        </section>

        {/* BP 2 */}
        <section className="mb-12">
          <div className="flex items-start gap-3 mb-4">
            <span className="shrink-0 mt-0.5 size-7 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold flex items-center justify-center">B</span>
            <div>
              <h3 className="text-lg font-bold text-slate-800">ResizeObserver 監聽容器，處理 Sidebar 切換</h3>
              <p className="text-slate-500 text-sm mt-1">
                <code className="bg-slate-100 px-1 rounded">ResizeObserver</code> 監聽容器元素本身的尺寸（非 window），
                當 Sidebar 展開收合造成容器寬度變化時，主動呼叫 <code className="bg-slate-100 px-1 rounded">chart.resize()</code>。
                在 <code className="bg-slate-100 px-1 rounded">onUnmounted</code> 中呼叫 <code className="bg-slate-100 px-1 rounded">observer.disconnect()</code> 防止記憶體洩漏。
              </p>
            </div>
          </div>
          <CodeBlock code={RESIZE_OBSERVER} language="typescript" />
        </section>

        {/* BP 3 */}
        <section className="mb-12">
          <div className="flex items-start gap-3 mb-4">
            <span className="shrink-0 mt-0.5 size-7 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold flex items-center justify-center">C</span>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Vue Teleport 取代手動 DOM Tooltip</h3>
              <p className="text-slate-500 text-sm mt-1">
                用 Vue 的 <code className="bg-slate-100 px-1 rounded">Teleport</code> 將 tooltip 渲染到 body，
                由 Vue 的響應式系統控制顯示與內容，元件銷毀時 Teleport 自動清理，不會留下孤立的 DOM 節點。
                定位改用 <code className="bg-slate-100 px-1 rounded">scrollX/scrollY</code>（<code className="bg-slate-100 px-1 rounded">pageXOffset</code> 已廢棄）。
              </p>
            </div>
          </div>
          <CodeBlock code={TOOLTIP_TELEPORT} language="html" />
        </section>

        {/* BP 4 */}
        <section className="mb-12">
          <div className="flex items-start gap-3 mb-4">
            <span className="shrink-0 mt-0.5 size-7 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold flex items-center justify-center">D</span>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Chart.js 型別化：告別 <code className="text-sm bg-slate-100 px-1.5 py-0.5 rounded">any</code></h3>
              <p className="text-slate-500 text-sm mt-1">
                Chart.js 提供完整的 TypeScript 型別定義（<code className="bg-slate-100 px-1 rounded">ChartData&lt;"line"&gt;</code>、<code className="bg-slate-100 px-1 rounded">ChartOptions&lt;"bar"&gt;</code>、<code className="bg-slate-100 px-1 rounded">TooltipItem&lt;T&gt;</code>）。
                使用這些型別後，options 填錯欄位名稱、callback 參數用錯型別，TypeScript 編譯期就會報錯。
              </p>
            </div>
          </div>
          <CodeBlock code={TYPED_OPTIONS} language="typescript" />
        </section>

        {/* BP 5 */}
        <section>
          <div className="flex items-start gap-3 mb-4">
            <span className="shrink-0 mt-0.5 size-7 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold flex items-center justify-center">E</span>
            <div>
              <h3 className="text-lg font-bold text-slate-800">TanStack Query + computed 讓篩選器驅動圖表</h3>
              <p className="text-slate-500 text-sm mt-1">
                將 <code className="bg-slate-100 px-1 rounded">queryKey</code> 設為 <code className="bg-slate-100 px-1 rounded">computed</code>，
                當日期範圍或子站 ID 改變時，TanStack Query 自動重新請求資料，
                搭配上面的 Composable 模式，圖表自動重繪，不需要任何手動 watch 或命令式更新。
              </p>
            </div>
          </div>
          <CodeBlock code={WATCH_DATA} language="typescript" />
        </section>
      </div>
    </div>
  );
}
