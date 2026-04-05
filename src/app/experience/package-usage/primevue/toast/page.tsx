import CodeBlock from "@/components/CodeBlock";

export default function PrimeVueToastPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <header className="relative bg-gradient-to-br from-orange-900 via-orange-800 to-slate-900 text-white py-10 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)` }} />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
            <span className="text-sm font-medium tracking-wide">PrimeVue</span>
          </div>
          <h1 className="text-5xl font-black mb-4 tracking-tight">Toast 通知系統</h1>
          <p className="text-xl text-orange-200">全域掛載一次，useToast() composable 在任何元件直接呼叫</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-white border-l-4 border-orange-500 p-8 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold mb-3 text-slate-900">Toast 通知系統</h3>
          <p className="text-stone-600 mb-6 leading-relaxed">
            PrimeVue 的 Toast 需要在 app root 掛載一次，之後透過 useToast() composable 在任何地方呼叫，統一管理通知訊息。
          </p>
          <div className="space-y-4">
            {[
              {
                label: "App.vue 掛載一次 Toast",
                code: `<!-- App.vue -->
<template>
  <Toast />   <!-- 全域掛載一次 -->
  <RouterView />
</template>`,
              },
              {
                label: "任何元件直接呼叫",
                code: `import { useToast } from 'primevue/usetoast'

const toast = useToast()

async function onSave() {
  try {
    await saveProduct(form)
    toast.add({
      severity: 'success',
      summary: '儲存成功',
      detail: '資料已更新',
      life: 3000,
    })
  } catch {
    toast.add({
      severity: 'error',
      summary: '儲存失敗',
      detail: '請稍後再試',
    })
  }
}`,
              },
            ].map((item, i) => (
              <div key={i} className="rounded-xl p-5 border-2 bg-stone-50 border-orange-500">
                <div className="text-sm font-bold mb-3 text-orange-700">{item.label}</div>
                <CodeBlock code={item.code} language="html" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
