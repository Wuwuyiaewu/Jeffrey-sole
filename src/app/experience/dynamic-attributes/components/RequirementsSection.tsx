"use client";
import { useRouter, useSearchParams } from "next/navigation";
import CodeBlock from "@/components/CodeBlock";

const REQUIREMENTS_TEMPLATE_CODE = `<el-input
  v-if="role !== 'user'"
  :disabled="role !== 'approver'"
  :required="role === 'approver' && amount > 10000"
/>`;

export function RequirementsSection() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToDemo = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", "demo");
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-8">
      {/* 痛點情境 */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 md:p-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">📋</span>
          <h2 className="text-3xl font-bold text-slate-900">需求情境</h2>
        </div>

        <div className="prose prose-slate max-w-none text-lg text-slate-600 leading-relaxed space-y-6">
          <p>
            假設你正在開發一套<strong className="text-slate-800">「費用申請系統」</strong>。同一張表單會被不同角色使用——
            <strong className="text-blue-600">申請人</strong>填寫金額、
            <strong className="text-purple-600">審核主管</strong>撰寫審核意見、
            <strong className="text-emerald-600">財務</strong>確認核准金額、
            <strong className="text-orange-600">管理員</strong>則擁有全域檢視權限。
          </p>

          <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg">
            <h3 className="text-lg font-bold text-red-800 mb-3">❗ 痛點：商業邏輯散落在 Template 各處</h3>
            <p className="text-base text-red-700 mb-3">
              每個欄位的「顯示 / 隱藏」「必填 / 選填」「可編輯 / 唯讀」都受到<strong>當前角色</strong>與<strong>表單資料</strong>兩個維度的影響。
              傳統作法是在 Template 裡直接寫：
            </p>
            <CodeBlock code={REQUIREMENTS_TEMPLATE_CODE} language="html" />
            <p className="text-sm text-red-600 mt-3">
              當這類判斷累積到 20、30 個欄位時，Template 會變成<strong>一堆 if/else 的地獄</strong>，新人完全無法從視圖層讀懂商業規則。
            </p>
          </div>
        </div>
      </div>

      {/* 需求規格表 */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 md:p-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">📊</span>
          <h2 className="text-3xl font-bold text-slate-900">需求規格</h2>
        </div>
        <p className="text-slate-500 mb-6 text-base">
          以下是費用申請表單中，三個核心欄位在不同角色 / 條件下的屬性規則。
          <strong className="text-slate-700">這正是互動展示所要對照的內容。</strong>
        </p>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-4 py-3 font-bold text-slate-700 border-b border-slate-200">
                  欄位
                </th>
                <th className="px-4 py-3 font-bold text-slate-700 border-b border-slate-200">
                  角色 / 條件
                </th>
                <th className="px-4 py-3 font-bold text-slate-700 border-b border-slate-200 text-center">
                  <span className="inline-flex items-center gap-1 text-emerald-600">👁 顯示</span>
                </th>
                <th className="px-4 py-3 font-bold text-slate-700 border-b border-slate-200 text-center">
                  <span className="inline-flex items-center gap-1 text-amber-600">🔒 唯讀</span>
                </th>
                <th className="px-4 py-3 font-bold text-slate-700 border-b border-slate-200 text-center">
                  <span className="inline-flex items-center gap-1 text-red-600">* 必填</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* 申請金額 */}
              <tr className="hover:bg-slate-50/50">
                <td rowSpan={4} className="px-4 py-3 font-semibold text-slate-800 border-r border-slate-100 align-top">
                  申請金額
                </td>
                <td className="px-4 py-3 text-blue-600 font-medium">申請人</td>
                <td className="px-4 py-3 text-center"><Badge color="green">✓</Badge></td>
                <td className="px-4 py-3 text-center"><Badge color="gray">—</Badge></td>
                <td className="px-4 py-3 text-center"><Badge color="red">✓</Badge></td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="px-4 py-3 text-purple-600 font-medium">審核主管</td>
                <td className="px-4 py-3 text-center"><Badge color="green">✓</Badge></td>
                <td className="px-4 py-3 text-center"><Badge color="amber">🔒</Badge></td>
                <td className="px-4 py-3 text-center"><Badge color="gray">—</Badge></td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="px-4 py-3 text-emerald-600 font-medium">財務</td>
                <td className="px-4 py-3 text-center"><Badge color="green">✓</Badge></td>
                <td className="px-4 py-3 text-center"><Badge color="amber">🔒</Badge></td>
                <td className="px-4 py-3 text-center"><Badge color="gray">—</Badge></td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="px-4 py-3 text-orange-600 font-medium">管理員</td>
                <td className="px-4 py-3 text-center"><Badge color="green">✓</Badge></td>
                <td className="px-4 py-3 text-center"><Badge color="amber">🔒</Badge></td>
                <td className="px-4 py-3 text-center"><Badge color="gray">—</Badge></td>
              </tr>

              {/* 審核意見 */}
              <tr className="hover:bg-slate-50/50 bg-slate-50/30">
                <td rowSpan={4} className="px-4 py-3 font-semibold text-slate-800 border-r border-slate-100 align-top">
                  審核意見
                </td>
                <td className="px-4 py-3 text-blue-600 font-medium">申請人</td>
                <td className="px-4 py-3 text-center"><Badge color="gray">隱藏</Badge></td>
                <td className="px-4 py-3 text-center"><Badge color="gray">—</Badge></td>
                <td className="px-4 py-3 text-center"><Badge color="gray">—</Badge></td>
              </tr>
              <tr className="hover:bg-slate-50/50 bg-slate-50/30">
                <td className="px-4 py-3 text-purple-600 font-medium">
                  審核主管
                  <span className="block text-xs text-slate-400 mt-0.5">金額 ≤ 10,000</span>
                </td>
                <td className="px-4 py-3 text-center"><Badge color="green">✓</Badge></td>
                <td className="px-4 py-3 text-center"><Badge color="gray">—</Badge></td>
                <td className="px-4 py-3 text-center"><Badge color="gray">—</Badge></td>
              </tr>
              <tr className="hover:bg-slate-50/50 bg-slate-50/30">
                <td className="px-4 py-3 text-purple-600 font-medium">
                  審核主管
                  <span className="block text-xs text-red-400 mt-0.5 font-semibold">金額 &gt; 10,000</span>
                </td>
                <td className="px-4 py-3 text-center"><Badge color="green">✓</Badge></td>
                <td className="px-4 py-3 text-center"><Badge color="gray">—</Badge></td>
                <td className="px-4 py-3 text-center"><Badge color="red">✓</Badge></td>
              </tr>
              <tr className="hover:bg-slate-50/50 bg-slate-50/30">
                <td className="px-4 py-3 text-emerald-600 font-medium">財務 / 管理員</td>
                <td className="px-4 py-3 text-center"><Badge color="green">✓</Badge></td>
                <td className="px-4 py-3 text-center"><Badge color="amber">🔒</Badge></td>
                <td className="px-4 py-3 text-center"><Badge color="gray">—</Badge></td>
              </tr>

              {/* 必須審核金額 */}
              <tr className="hover:bg-slate-50/50">
                <td rowSpan={4} className="px-4 py-3 font-semibold text-slate-800 border-r border-slate-100 align-top">
                  必須審核金額
                </td>
                <td className="px-4 py-3 text-blue-600 font-medium">申請人</td>
                <td className="px-4 py-3 text-center"><Badge color="gray">隱藏</Badge></td>
                <td className="px-4 py-3 text-center"><Badge color="gray">—</Badge></td>
                <td className="px-4 py-3 text-center"><Badge color="gray">—</Badge></td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="px-4 py-3 text-purple-600 font-medium">審核主管</td>
                <td className="px-4 py-3 text-center"><Badge color="gray">隱藏</Badge></td>
                <td className="px-4 py-3 text-center"><Badge color="gray">—</Badge></td>
                <td className="px-4 py-3 text-center"><Badge color="gray">—</Badge></td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="px-4 py-3 text-emerald-600 font-medium">財務</td>
                <td className="px-4 py-3 text-center"><Badge color="green">✓</Badge></td>
                <td className="px-4 py-3 text-center"><Badge color="gray">—</Badge></td>
                <td className="px-4 py-3 text-center"><Badge color="red">✓</Badge></td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="px-4 py-3 text-orange-600 font-medium">管理員</td>
                <td className="px-4 py-3 text-center"><Badge color="green">✓</Badge></td>
                <td className="px-4 py-3 text-center"><Badge color="amber">🔒</Badge></td>
                <td className="px-4 py-3 text-center"><Badge color="gray">—</Badge></td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm text-slate-400 mt-4 text-center">
          表中「—」代表該屬性在此條件下不適用（欄位被隱藏時，唯讀與必填無意義）
        </p>
      </div>

      {/* 互動展示引導 */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-blue-200 text-center">
        <h3 className="text-xl font-bold text-blue-900 mb-3">
          🎯 理解規則後，實際操作看看
        </h3>
        <p className="text-base text-blue-700 mb-6 max-w-2xl mx-auto">
          下一個 Tab「互動展示」中，你可以<strong>切換角色</strong>和<strong>調整金額</strong>，
          即時觀察上述規則如何透過 <code className="text-sm bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-mono">Context Resolver</code> 動態算出每個欄位的狀態。
        </p>
        <button
            onClick={goToDemo}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            前往互動展示
            <span className="text-lg">→</span>
          </button>
      </div>
    </div>
  );
}

// 小型 Badge 元件
function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  const styles: Record<string, string> = {
    green: 'bg-emerald-100 text-emerald-700',
    red: 'bg-red-100 text-red-700',
    amber: 'bg-amber-100 text-amber-700',
    gray: 'bg-slate-100 text-slate-400',
  };

  return (
    <span className={`inline-flex items-center justify-center text-xs font-semibold px-2 py-0.5 rounded-full ${styles[color] || styles.gray}`}>
      {children}
    </span>
  );
}
