import CodeBlock from "@/components/CodeBlock";

export default function ElementPlusFormPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <header className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-slate-900 text-white py-10 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)` }} />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
            <span className="text-sm font-medium tracking-wide">Element Plus</span>
          </div>
          <h1 className="text-5xl font-black mb-4 tracking-tight">Form 表單驗證</h1>
          <p className="text-xl text-purple-200">rules 定義、自訂驗證器、跨欄位比對、手動觸發</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-10">
        <div className="bg-white border-l-4 border-purple-500 p-8 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold mb-3 text-slate-900">Form 表單驗證整合</h3>
          <p className="text-stone-600 mb-6 leading-relaxed">
            在台達電子採購平台中，表單欄位多且驗證規則複雜（必填、長度限制、格式驗證、跨欄位比對）。搭配 el-form 的 rules 機制，統一管理驗證邏輯。
          </p>
          <div className="space-y-4">
            {[
              {
                label: "rules 定義方式",
                code: `const rules = reactive<FormRules>({
  email: [
    { required: true, message: '請輸入 Email', trigger: 'blur' },
    { type: 'email', message: '格式不正確', trigger: 'blur' },
  ],
  amount: [
    { required: true, message: '請輸入金額', trigger: 'blur' },
    { validator: checkPositiveNumber, trigger: 'blur' },
  ],
})

// 自訂驗證器
function checkPositiveNumber(rule, value, callback) {
  if (value <= 0) callback(new Error('金額必須大於 0'))
  else callback()
}`,
              },
              {
                label: "跨欄位驗證（確認密碼）",
                code: `const rules = reactive<FormRules>({
  confirmPassword: [{
    validator: (rule, value, callback) => {
      if (value !== formData.password) {
        callback(new Error('兩次密碼不一致'))
      } else {
        callback()
      }
    },
    trigger: 'blur',
  }],
})`,
              },
              {
                label: "手動觸發驗證 + 重置",
                code: `const formRef = ref<FormInstance>()

// 送出前驗證
async function onSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  // 送 API...
}

// 重置表單與驗證狀態
function onReset() {
  formRef.value?.resetFields()
}`,
              },
            ].map((item, i) => (
              <div key={i} className="rounded-xl p-5 border-2 bg-stone-50 border-purple-500">
                <div className="text-sm font-bold mb-3 text-purple-700">{item.label}</div>
                <CodeBlock code={item.code} language="typescript" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
