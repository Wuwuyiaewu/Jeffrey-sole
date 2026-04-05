"use client";

import { useState, useMemo, useRef, MouseEvent } from "react";
import CodeBlock from "@/components/CodeBlock";

const FORM_CONFIG_CODE = `const FORM_CONFIG = [
  {
    id: "f1",
    label: "申請金額",
    componentType: "Input",
    disabled: (ctx) => ctx.role !== 'user',
    visible: true,
    required: (ctx) => ctx.role === 'user',
  },
  {
    id: "f2",
    label: "審核意見",
    componentType: "Textarea",
    // 申請金額 > 財務設定的門檻 → 審核意見必填
    required: (ctx) => ctx.role === 'approver'
                    && ctx.amount > ctx.threshold,
    disabled: (ctx) => ctx.role !== 'approver',
    visible: (ctx) => ctx.role !== 'user',
  },
  {
    id: "f3",
    label: "必須審核金額",
    componentType: "Input",
    disabled: (ctx) => ctx.role !== 'finance',
    visible: (ctx) => ctx.role === 'finance' || ctx.role === 'admin',
    required: (ctx) => ctx.role === 'finance',
  }
]`;
import { DynamicFieldConfig, DemoContext } from "../types";

// Helper components map
const Input = ({ placeholder, disabled, className = "", value, onChange }: any) => (
  <div className="relative">
    <input
      type="text"
      placeholder={placeholder}
      disabled={disabled}
      value={value || ""}
      onChange={e => onChange?.(e.target.value)}
      className={`w-full px-3 py-2 border rounded-md disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed bg-white ${className}`}
    />
  </div>
);

const Textarea = ({ placeholder, disabled, className = "", value, onChange }: any) => (
  <div className="relative">
    <textarea
      placeholder={placeholder}
      disabled={disabled}
      value={value || ""}
      onChange={e => onChange?.(e.target.value)}
      rows={3}
      className={`w-full px-3 py-2 border rounded-md disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed bg-white ${className}`}
    />
  </div>
);

const COMPONENT_MAP = {
  Input,
  Textarea,
  DatePicker: Input,
  Select: Input,
  Checkbox: Input,
  Radio: Input
};

const INITIAL_FIELD_CONFIG: DynamicFieldConfig[] = [
  {
    id: "f1",
    label: "申請金額",
    componentType: "Input",
    // 申請金額：只有申請人能填寫
    disabled: (ctx) => ctx.role !== 'user',
    // 申請金額：所有人都看得到
    visible: true,
    // 申請金額：申請人必填
    required: (ctx) => ctx.role === 'user',
  },
  {
    id: "f2",
    label: "審核意見",
    componentType: "Textarea",
    // 審核意見：如果申請金額 > 財務設定的必須審核金額，且當前是審核者，就必填
    required: (ctx) => ctx.role === 'approver' && ctx.amount > ctx.threshold,
    // 審核意見：只有審核者能填寫
    disabled: (ctx) => ctx.role !== 'approver',
    // 審核意見：申請人不顯示，審核者、財務與管理員都會顯示
    visible: (ctx) => ctx.role !== 'user',
  },
  {
    id: "f3",
    label: "必須審核金額",
    componentType: "Input",
    // 必須審核金額：只有財務能填寫
    disabled: (ctx) => ctx.role !== 'finance',
    // 必須審核金額：只有財務與管理員顯示
    visible: (ctx) => ctx.role === 'finance' || ctx.role === 'admin',
    // 必須審核金額：財務必填
    required: (ctx) => ctx.role === 'finance',
  }
];

export default function DemoSection() {
  const [configs] = useState<DynamicFieldConfig[]>(INITIAL_FIELD_CONFIG);
  const [ctx, setCtx] = useState<DemoContext>({ role: 'user', amount: 5000, threshold: 10000 });

  // 模擬當前填寫的表單資料
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleAmountChange = (val: string) => {
    const num = Number(val);
    setCtx(prev => ({ ...prev, amount: isNaN(num) ? 0 : num }));
    setFormData(prev => ({ ...prev, f1: val }));
  };

  const handleThresholdChange = (val: string) => {
    const num = Number(val);
    setCtx(prev => ({ ...prev, threshold: isNaN(num) ? 0 : num }));
    setFormData(prev => ({ ...prev, f3: val }));
  };

  // 處理 Middle Click Scroll
  const scrollRef1 = useRef<HTMLDivElement>(null);
  const scrollRef2 = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>, ref: any) => {
    // 1 代表中鍵 (0 是左鍵, 2 是右鍵)
    if (e.button !== 1) return;
    e.preventDefault();
    
    const scroller = ref.current;
    if (!scroller) return;

    let startX = e.pageX - scroller.offsetLeft;
    let startY = e.pageY - scroller.offsetTop;
    let scrollLeft = scroller.scrollLeft;
    let scrollTop = scroller.scrollTop;

    const handleMouseMove = (moveEvent: globalThis.MouseEvent) => {
      moveEvent.preventDefault();
      const x = moveEvent.pageX - scroller.offsetLeft;
      const y = moveEvent.pageY - scroller.offsetTop;
      const walkX = (x - startX) * 1.5;
      const walkY = (y - startY) * 1.5;
      scroller.scrollLeft = scrollLeft - walkX;
      scroller.scrollTop = scrollTop - walkY;
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // 解析 configs 的當前狀態
  const resolvedFields = useMemo(() => {
    return configs.map(config => {
      // @ts-ignore
      const isReq = typeof config.required === 'function' ? config.required(ctx) : !!config.required;
      // @ts-ignore
      const isDis = typeof config.disabled === 'function' ? config.disabled(ctx) : !!config.disabled;
      // @ts-ignore
      const isVis = typeof config.visible === 'function' ? config.visible(ctx) : (config.visible === false ? false : true);

      return {
        ...config,
        bindProps: { required: isReq, disabled: isDis, visible: isVis }
      }
    })
  }, [configs, ctx]);

  return (
    <div className="flex flex-col gap-12 max-w-7xl mx-auto">
      {/* 區塊 1：Context 操作與畫面預覽 */}
      <div className="grid lg:grid-cols-2 gap-6 relative">
        {/* Context Controller */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6 border-b pb-3">
            <h3 className="text-xl font-bold text-slate-900">
              1. 當前 Context 情境
            </h3>
            <span className="text-xs tracking-wider text-slate-400 font-mono bg-slate-100 px-2 py-1 rounded">
               Global Context
            </span>
          </div>

          <div className="space-y-5 flex-1">
             <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">登入角色 (Role)</label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 bg-slate-100/50 p-1.5 rounded-lg border border-slate-200">
                  <button 
                    onClick={() => setCtx({...ctx, role: 'user'})}
                    className={`py-2 px-1 text-sm font-semibold rounded-md transition-all ${ctx.role === 'user' ? 'bg-white shadow border border-slate-200 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    申請人
                  </button>
                  <button 
                    onClick={() => setCtx({...ctx, role: 'approver'})}
                    className={`py-2 px-1 text-sm font-semibold rounded-md transition-all ${ctx.role === 'approver' ? 'bg-white shadow border border-slate-200 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    審核主管
                  </button>
                  <button 
                    onClick={() => setCtx({...ctx, role: 'finance'})}
                    className={`py-2 px-1 text-sm font-semibold rounded-md transition-all ${ctx.role === 'finance' ? 'bg-white shadow border border-slate-200 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    財務
                  </button>
                  <button 
                    onClick={() => setCtx({...ctx, role: 'admin'})}
                    className={`py-2 px-1 text-sm font-semibold rounded-md transition-all ${ctx.role === 'admin' ? 'bg-white shadow border border-slate-200 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    管理員
                  </button>
                </div>
             </div>
             
             <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
               <div className="text-sm font-medium text-slate-700 mb-2">情境資料</div>
               <pre className="text-sm text-slate-600 font-mono">
{JSON.stringify(ctx, null, 2)}
               </pre>
             </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6 border-b pb-3">
             <h3 className="text-xl font-bold text-slate-900">
              2. 即時畫面預覽
            </h3>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-normal shrink-0">
               Live Render
            </span>
          </div>

          <div className="p-6 bg-slate-50 rounded-lg border border-slate-100 flex-1 flex flex-col justify-center min-h-[250px]">
             {resolvedFields.filter(f => f.bindProps.visible).length === 0 ? (
                <div className="text-stone-400 text-sm text-center">此情境下沒有任何可見欄位</div>
             ) : (
                <div className="w-full space-y-4">
                  {resolvedFields.map((field) => {
                    if (!field.bindProps.visible) return null;
                    const Component = COMPONENT_MAP[field.componentType as keyof typeof COMPONENT_MAP] || Input;

                    return (
                      <div key={field.id} className="flex flex-col gap-1.5 p-4 rounded-lg bg-white shadow-sm border border-stone-100 transition-all duration-300">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                          {field.label}
                          {field.bindProps.required && <span className="text-red-500 font-black">*</span>}
                          {field.bindProps.disabled && <span className="text-[10px] font-medium text-stone-500 bg-stone-100 border border-stone-200 px-1.5 py-0.5 rounded-sm ml-2">唯讀模式</span>}
                        </label>
                        <Component 
                          disabled={field.bindProps.disabled} 
                          placeholder={`請輸入${field.label}...`}
                          value={field.id === 'f1' ? ctx.amount.toString() : field.id === 'f3' ? ctx.threshold.toString() : formData[field.id]}
                          onChange={(v: string) => {
                            if (field.id === 'f1') handleAmountChange(v);
                            else if (field.id === 'f3') handleThresholdChange(v);
                            else setFormData({...formData, [field.id]: v});
                          }}
                        />
                        {field.id === 'f2' && field.bindProps.required && (
                          <div className="text-xs text-red-500 mt-1 pl-1">因申請金額 ({ctx.amount.toLocaleString()}) &gt; 必須審核金額 ({ctx.threshold.toLocaleString()})，請務必填寫審核意見</div>
                        )}
                      </div>
                    );
                  })}
                </div>
             )}
          </div>
        </div>
      </div>

      {/* 區塊 2：JSON 與解析 Props 對比 */}
      <div className="grid lg:grid-cols-2 gap-6 relative">
        <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-slate-800 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xl border-4 border-white tracking-widest uppercase">
          Resolver 解析
        </div>

        <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 overflow-hidden flex flex-col">
          <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
              Config 抽象化定義 (原始宣告)
            </h3>
          </div>
          <div
            className="p-4 flex-1 cursor-move overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            style={{ maxHeight: '400px' }}
            ref={scrollRef1}
            onMouseDown={(e) => handleMouseDown(e, scrollRef1)}
          >
            <CodeBlock code={FORM_CONFIG_CODE} language="typescript" />
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 overflow-hidden flex flex-col">
          <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              計算後的 Component Props (實際渲染依據)
            </h3>
          </div>
          <div 
            className="p-4 flex-1 cursor-move overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            style={{ maxHeight: '400px' }}
            ref={scrollRef2}
            onMouseDown={(e) => handleMouseDown(e, scrollRef2)}
          >
            <pre 
              className="text-sm text-emerald-100 font-mono leading-relaxed select-none overflow-visible"
            >
{JSON.stringify(resolvedFields.map(f => ({
  id: f.id, 
  bindProps: f.bindProps
})), null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
