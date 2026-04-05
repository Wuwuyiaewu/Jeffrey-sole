import CodeBlock from "@/components/CodeBlock";

const CUSTOM_METHOD = `// ✅ 進階：用 addMethod 擴充 Yup 本身（全域自定義方法）
// src/service/yup/methods.ts
import * as Yup from "yup";

declare module "yup" {
  interface StringSchema {
    // 宣告型別，讓 TypeScript 認識新方法
    numericLength(maxInt: number, maxDecimal?: number): StringSchema;
  }
}

export function addCustomValidation() {
  Yup.addMethod(
    Yup.string,
    "numericLength",
    function (maxInt: number, maxDecimal = 0) {
      return this.test("numericLength", "數值格式不正確", (value) => {
        if (!value) return true;
        const [intPart, decPart = ""] = value.split(".");
        return intPart.length <= maxInt && decPart.length <= maxDecimal;
      });
    }
  );
}

// 使用方式（在 _schema-service.ts 最頂層呼叫一次）：
// addCustomValidation();
//
// coverPrice: Yup.string().numericLength(11, 2)`;

const ASYNC_VALIDATOR = `// ✅ 非同步驗證：呼叫 API 確認唯一性（例如商品碼不重複）
const getSkuNoSchema = () =>
  Yup.string()
    .nullable()
    .test("skuNoUnique", "商品碼已存在", async (value) => {
      if (!value) return true;                // 空值不檢核
      if (!/^\\d+$/.test(value)) return false; // 格式先行同步檢核

      try {
        const { exists } = await checkSkuNoExists(value); // API call
        return !exists;
      } catch {
        // API 失敗時不阻擋使用者（樂觀策略），讓後端最終把關
        return true;
      }
    });

// 搭配 VeeValidate 的 debounce 避免每次按鍵都呼叫 API：
// <Field name="skuNo" :validate-on-input="false" :validate-on-blur="true" />`;

const TYPED_FORM = `// ✅ 全型別安全的表單：toTypedSchema + useForm
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/yup";
import { getYahooPlatformSchema } from "@/service/yahoo-schema";
import type { InferType } from "yup";

// 從 Schema 推斷出 TypeScript 型別，無需手寫 interface
type YahooFormValues = InferType<ReturnType<typeof getYahooPlatformSchema>>;

const { handleSubmit, errors, values, setFieldValue, resetForm } = useForm<YahooFormValues>({
  validationSchema: toTypedSchema(getYahooPlatformSchema()),
  initialValues: {
    brandName: null,
    safeStorage: null,
    startDate: null,
    endDate: null,
  },
});

const onSubmit = handleSubmit((values) => {
  // ✅ values 已是型別安全的 YahooFormValues，不需要 as any
  submitPlatformForm(values);
});

// 以程式方式設值（如從後端帶入資料）
const loadDraftData = (draft: Partial<YahooFormValues>) => {
  Object.entries(draft).forEach(([key, value]) => {
    setFieldValue(key as keyof YahooFormValues, value);
  });
};`;

const VALIDATION_TIMING = `<!-- ✅ 控制驗證觸發時機，改善使用者體驗 -->
<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/yup";

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(schema),
  // 只在 blur 後才驗證（避免使用者還在輸入就顯示錯誤）
  validateOnInput: false,
  validateOnBlur: true,
  // 送出後切換為 input 時即時驗證（讓使用者即時看到修正結果）
  validateOnModelUpdate: true,
});
</script>

<!-- 個別欄位也可覆寫全域設定 -->
<Field
  name="ean"
  :validate-on-input="false"
  :validate-on-blur="true"
/>`;

const SCHEMA_TESTING = `// ✅ 對 Schema 本身寫單元測試（不依賴 UI）
import { describe, it, expect } from "vitest";
import { getItemRequiredSchema } from "@/service/_schema-service";
import { getBarcodeValidator } from "@/utils/validate-helper";

describe("getBarcodeValidator", () => {
  const validator = getBarcodeValidator();

  it("accepts valid EAN-13", async () => {
    await expect(validator.validate("4901234567890")).resolves.toBe("4901234567890");
  });

  it("rejects invalid checksum", async () => {
    await expect(validator.validate("4901234567891")).rejects.toThrow();
  });

  it("returns true for empty value (optional field)", async () => {
    await expect(validator.validate("")).resolves.toBe("");
  });

  // ✅ 驗證 /g flag 修正：同一 validator 呼叫兩次應都成功
  it("passes on repeated calls with same value", async () => {
    await expect(validator.validate("4901234567890")).resolves.toBeTruthy();
    await expect(validator.validate("4901234567890")).resolves.toBeTruthy();
  });
});

describe("getItemRequiredSchema - cross-field ean/publishItemNo", () => {
  const schema = getItemRequiredSchema();

  it("requires at least one of ean or publishItemNo", async () => {
    const base = { brandName: "Brand", newItemName: "Item" };

    // 兩個都空 → 錯誤
    await expect(schema.validate({ ...base, ean: null, publishItemNo: null }))
      .rejects.toThrow("EAN 與製造商貨號至少填一項");

    // 只填 EAN → 成功
    await expect(schema.validate({ ...base, ean: "4901234567890", publishItemNo: null }))
      .resolves.toBeTruthy();
  });
});`;

export default function BestPracticeSection() {
  return (
    <div className="space-y-10">
      <div className="bg-white rounded-xl border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">最佳實踐整理</h2>
        <p className="text-slate-500 mb-8">
          除了修正既有問題，這裡整理了在實際電商後台開發中，
          讓 VeeValidate + Yup 達到最高可維護性的進階模式。
        </p>

        {/* BP 1 */}
        <section className="mb-12">
          <div className="flex items-start gap-3 mb-4">
            <span className="shrink-0 mt-0.5 size-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center">1</span>
            <div>
              <h3 className="text-lg font-bold text-slate-800">用 <code className="text-sm bg-slate-100 px-1.5 py-0.5 rounded">addMethod</code> 擴充 Yup 全域方法</h3>
              <p className="text-slate-500 text-sm mt-1">
                當多個 Schema 需要相同的自定義邏輯時，用 <code className="bg-slate-100 px-1 rounded">Yup.addMethod</code> 注入為內建方法，
                並透過 TypeScript Declaration Merging 讓型別也知道新方法的存在。
                這樣任何地方都能直接呼叫 <code className="bg-slate-100 px-1 rounded">.numericLength()</code>，不需要手動 import helper。
              </p>
            </div>
          </div>
          <CodeBlock code={CUSTOM_METHOD} language="typescript" />
        </section>

        {/* BP 2 */}
        <section className="mb-12">
          <div className="flex items-start gap-3 mb-4">
            <span className="shrink-0 mt-0.5 size-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center">2</span>
            <div>
              <h3 className="text-lg font-bold text-slate-800">非同步驗證 + 樂觀策略</h3>
              <p className="text-slate-500 text-sm mt-1">
                Yup <code className="bg-slate-100 px-1 rounded">.test()</code> 的 callback 支援 async，可直接呼叫 API 做唯一性檢查。
                建議 API 失敗時回傳 <code className="bg-slate-100 px-1 rounded">true</code>（樂觀策略），讓後端最終把關，避免 API 不穩定時阻擋使用者操作。
              </p>
            </div>
          </div>
          <CodeBlock code={ASYNC_VALIDATOR} language="typescript" />
        </section>

        {/* BP 3 */}
        <section className="mb-12">
          <div className="flex items-start gap-3 mb-4">
            <span className="shrink-0 mt-0.5 size-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center">3</span>
            <div>
              <h3 className="text-lg font-bold text-slate-800">全型別安全：<code className="text-sm bg-slate-100 px-1.5 py-0.5 rounded">InferType</code> + <code className="text-sm bg-slate-100 px-1.5 py-0.5 rounded">toTypedSchema</code></h3>
              <p className="text-slate-500 text-sm mt-1">
                從 Yup Schema 直接推斷出 TypeScript 型別，不需要手寫重複的 interface。
                <code className="bg-slate-100 px-1 rounded">InferType&lt;Schema&gt;</code> 讓型別定義成為 Schema 的衍生品，
                Schema 改了，型別自動跟著改，永遠同步。
              </p>
            </div>
          </div>
          <CodeBlock code={TYPED_FORM} language="typescript" />
        </section>

        {/* BP 4 */}
        <section className="mb-12">
          <div className="flex items-start gap-3 mb-4">
            <span className="shrink-0 mt-0.5 size-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center">4</span>
            <div>
              <h3 className="text-lg font-bold text-slate-800">控制驗證觸發時機，改善使用者體驗</h3>
              <p className="text-slate-500 text-sm mt-1">
                預設 VeeValidate 在每次 input 都觸發驗證，會讓使用者還在輸入到一半就看到錯誤訊息。
                最佳實踐是「首次送出前只在 blur 驗證，送出後切為 input 即時驗證」，
                讓修正過程得到即時反饋。
              </p>
            </div>
          </div>
          <CodeBlock code={VALIDATION_TIMING} language="html" />
        </section>

        {/* BP 5 */}
        <section>
          <div className="flex items-start gap-3 mb-4">
            <span className="shrink-0 mt-0.5 size-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center">5</span>
            <div>
              <h3 className="text-lg font-bold text-slate-800">對 Schema 寫單元測試（脫離 UI 驗證邏輯）</h3>
              <p className="text-slate-500 text-sm mt-1">
                Schema 是純邏輯，可以不需要 UI 就直接測試。
                特別是自定義 validator 的邊界情況（如 <code className="bg-slate-100 px-1 rounded">/g</code> flag 的重複呼叫問題）、
                跨欄位邏輯，都應有對應的 Vitest 測試。
              </p>
            </div>
          </div>
          <CodeBlock code={SCHEMA_TESTING} language="typescript" />
        </section>
      </div>
    </div>
  );
}
