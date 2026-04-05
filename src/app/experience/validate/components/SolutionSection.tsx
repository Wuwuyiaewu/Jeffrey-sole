import CodeBlock from "@/components/CodeBlock";

const FIXED_VALIDATOR = `// ✅ 最佳實踐：自定義 Yup Validator Helper
import * as Yup from "yup";

// 1. 不使用 /g flag — regex 字面量每次 .test() 都是新的，無狀態問題
// 2. 使用 .forEach() 而非 .map() 執行副作用
export const getBarcodeValidator = () =>
  Yup.string().test("isBarcode", "條碼格式不正確或長度必須為 13 碼", (value) => {
    if (!value) return true; // 空值交給 .required() 處理

    const code = String(value);
    const validLengths = [8, 12, 13];

    // ✅ 不帶 /g：每次呼叫都是全新 regex，無 lastIndex 殘留
    if (!/^\\d+$/.test(code) || !validLengths.includes(code.length)) return false;

    const digits = code.split("").map(Number);
    const checkDigit = digits.pop()!;
    let checksum = 0;

    // ✅ 使用 .forEach()，語意清晰表達「副作用」
    digits.forEach((digit, index) => {
      checksum += code.length % 2 === 1
        ? index % 2 ? digit * 3 : digit
        : index % 2 ? digit : digit * 3;
    });

    const check = checksum % 10 === 0 ? 0 : 10 - (checksum % 10);
    return check === checkDigit;
  });

export const getUniformNumberValidator = () =>
  Yup.string().test("isUniformNumber", "統一編號格式不正確", (value) => {
    if (!value) return true;
    if (!/^\\d{8}$/.test(value)) return false;

    const weights = [1, 2, 1, 2, 1, 2, 4, 1];
    let total = 0;
    weights.forEach((w, i) => {
      const product = Number(value[i]) * w;
      total += Math.floor(product / 10) + (product % 10);
    });

    return total % 10 === 0 || (total % 10 === 9 && value[6] === "7");
  });`;

const SCHEMA_COMPOSITION = `// ✅ Schema Service 分層設計
// 思路：Base Schema（草稿儲存）→ Required Schema（送審提交）

import { getBarcodeValidator } from "@/utils/validate-helper";
import * as Yup from "yup";

// ── Layer 1：基礎 Schema（所有欄位皆可選，用於草稿自動儲存）──────────
export const getItemBaseSchema = () =>
  Yup.object({
    brandName:   Yup.string().nullable(),
    newItemName: Yup.string().nullable(),
    // EAN 條碼：即使選填，格式仍要正確
    ean: getBarcodeValidator().nullable(),
    // 製造商貨號
    publishItemNo: Yup.string().nullable(),
    coverPrice: Yup.number().nullable(),
    itemWeight:  Yup.number().nullable(),
    // 三層分類：shape 本身已能遞迴驗證，不需要額外 .test()
    category: Yup.object({
      primary:   Yup.object({ code: Yup.string(), name: Yup.string() }),
      secondary: Yup.object({ code: Yup.string(), name: Yup.string() }),
      minor:     Yup.object({ code: Yup.string(), name: Yup.string() }),
    }).nullable(),
  });

// ── Layer 2：送審 Schema（繼承 Base，覆寫為必填 + 跨欄位邏輯）────────
export const getItemRequiredSchema = () =>
  getItemBaseSchema().shape(
    {
      brandName:   Yup.string().nullable().required("此為必填"),
      newItemName: Yup.string().nullable().required("此為必填"),
      coverPrice:  Yup.number().nullable().required("此為必填"),
      itemWeight:  Yup.number().nullable().required("此為必填"),
      category: Yup.object({
        primary:   Yup.object({ code: Yup.string().required(), name: Yup.string().required() }).required(),
        secondary: Yup.object({ code: Yup.string().required(), name: Yup.string().required() }).required(),
        minor:     Yup.object({ code: Yup.string().required(), name: Yup.string().required() }).required(),
      }).required("分類為必填"),

      // ── 跨欄位驗證：EAN 與製造商貨號擇一必填 ─────────────────────────
      ean: getBarcodeValidator()
        .nullable()
        .when("publishItemNo", {
          is: (v: string | null) => !v,          // 若製造商貨號為空
          then: (schema) => schema.required("EAN 與製造商貨號至少填一項"),
          otherwise: (schema) => schema,
        }),
      publishItemNo: Yup.string()
        .nullable()
        .when("ean", {
          is: (v: string | null) => !v,           // 若 EAN 為空
          then: (schema) => schema.required("EAN 與製造商貨號至少填一項"),
          otherwise: (schema) => schema,
        }),
    },
    // ✅ 必須聲明相互依賴的欄位，避免 cyclic dependency 錯誤
    [["ean", "publishItemNo"]]
  );`;

const VEEVALIDATE_BEST = `<!-- ✅ VeeValidate 正確整合模式（Vue 3 Composition API） -->
<template>
  <Form
    :validation-schema="schema"
    :initial-values="initialValues"
    @submit="onSubmit"
  >
    <!-- ✅ 一般輸入：useField 或直接用 Field + ErrorMessage -->
    <div class="field">
      <label for="brand-name">品牌名稱 <span class="required">*</span></label>
      <Field id="brand-name" name="brandName" as="input" />
      <ErrorMessage name="brandName" class="error-msg" />
    </div>

    <!-- ✅ 第三方元件（PrimeVue）：用 v-slot 橋接 -->
    <div class="field">
      <label for="safe-storage">安全庫存量 <span class="required">*</span></label>
      <Field name="safeStorage" v-slot="{ field, errorMessage }">
        <PrimeInputNumber
          v-bind="field"
          :class="{ 'p-invalid': errorMessage }"
          @input="(e) => field.onChange(e.value)"
        />
        <!-- ✅ 直接從 v-slot 拿 errorMessage，不靠外部 span -->
        <small v-if="errorMessage" class="error-msg">{{ errorMessage }}</small>
      </Field>
    </div>

    <!-- ✅ 日期選擇器：包在 Field 裡才能被 VeeValidate 追蹤 -->
    <div class="field">
      <label>生效時間 <span class="required">*</span></label>
      <Field name="startDate" v-slot="{ field, errorMessage }">
        <PrimeCalendar
          :model-value="field.value"
          :class="{ 'p-invalid': errorMessage }"
          date-format="yy/mm/dd"
          @date-select="field.onChange"
          @blur="field.onBlur"
        />
        <small v-if="errorMessage" class="error-msg">{{ errorMessage }}</small>
      </Field>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { Form, Field, ErrorMessage } from "vee-validate";
import { toTypedSchema } from "@vee-validate/yup";
import { getYahooPlatformSchema } from "@/service/yahoo-schema";

// ✅ toTypedSchema 讓 TypeScript 知道 values 的型別
const schema = toTypedSchema(getYahooPlatformSchema());

const onSubmit = (values: PlatformFormValues) => {
  // values 已通過驗證，型別安全
  console.log(values);
};
</script>`;

const PLATFORM_SCHEMA = `// ✅ 各平台 Schema 獨立定義，從 Base Schema 組合
// src/service/yahoo-schema.ts

import { getItemBaseSchema } from "./_schema-service";
import * as Yup from "yup";

export const getYahooPlatformSchema = () =>
  // 繼承商品基礎欄位，再加入 Yahoo 平台專屬欄位
  getItemBaseSchema().shape({
    // Yahoo 專屬必填
    proposal:     Yup.string().nullable().required("此為必填"),
    newItemBrief: Yup.string().nullable().required("賣場名稱為必填").max(100),
    safeStorage:  Yup.number().nullable().required("此為必填").min(0).integer(),
    purchaseCost: Yup.number().nullable().required("促銷進貨成本為必填").min(0),
    centerPrice:  Yup.number().nullable().required("購物中心促銷售價為必填").min(0),
    startDate:    Yup.date().nullable().required("生效時間為必填"),
    endDate:      Yup.date()
      .nullable()
      .required("結束時間為必填")
      // ✅ 跨欄位：結束時間必須晚於生效時間
      .when("startDate", (startDate, schema) =>
        startDate
          ? schema.min(startDate, "結束時間必須晚於生效時間")
          : schema
      ),
  });`;

export default function SolutionSection() {
  return (
    <div className="space-y-10">
      <div className="bg-white rounded-xl border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">設計想法與核心解法</h2>
        <p className="text-slate-500 mb-8">
          針對上述四個問題，整理出對應的最佳實踐模式，目標是讓驗證邏輯可維護、可組合、不重複。
        </p>

        {/* Solution 1 */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="shrink-0 size-7 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold flex items-center justify-center">A</span>
            <h3 className="text-lg font-bold text-slate-800">修正 Custom Validator：無 <code className="text-sm bg-slate-100 px-1.5 py-0.5 rounded">/g</code> Flag + 正確副作用</h3>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-200 text-sm text-slate-600 space-y-1">
            <p><strong className="text-slate-800">核心規則：</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Yup <code className="bg-white px-1 rounded">.test()</code> 的 callback 可能被多次呼叫（如陣列驗證），regex 不帶 <code className="bg-white px-1 rounded">/g</code> 確保每次都是新 pattern</li>
              <li>只用於計算副作用的迴圈改用 <code className="bg-white px-1 rounded">.forEach()</code>，而非 <code className="bg-white px-1 rounded">.map()</code></li>
              <li>空值提前 <code className="bg-white px-1 rounded">return true</code>，讓必填邏輯交給 <code className="bg-white px-1 rounded">.required()</code> 統一管理</li>
            </ul>
          </div>
          <CodeBlock code={FIXED_VALIDATOR} language="typescript" />
        </section>

        {/* Solution 2 */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="shrink-0 size-7 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold flex items-center justify-center">B</span>
            <h3 className="text-lg font-bold text-slate-800">Schema 分層設計：Base → Required → Platform</h3>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-200 text-sm text-slate-600">
            <p className="font-semibold text-slate-800 mb-2">架構思路：</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">BaseSchema（草稿儲存）</span>
              <span className="text-slate-400">→ .shape()</span>
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">RequiredSchema（送審提交）</span>
              <span className="text-slate-400">→ .shape()</span>
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium">YahooSchema / MomoSchema...</span>
            </div>
            <p className="mt-3 text-slate-500">
              Yup 的 <code className="bg-white px-1 rounded">.shape()</code> 會深合並（deep merge）欄位，不需要複製所有欄位，只需覆寫有差異的部分。
              巢狀物件的 shape 本身即可遞迴驗證，<strong className="text-slate-700">不需要額外的 <code className="bg-white px-1 rounded">.test()</code></strong>。
            </p>
          </div>
          <CodeBlock code={SCHEMA_COMPOSITION} language="typescript" />
        </section>

        {/* Solution 3 */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="shrink-0 size-7 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold flex items-center justify-center">C</span>
            <h3 className="text-lg font-bold text-slate-800">VeeValidate 正確整合第三方元件</h3>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-200 text-sm text-slate-600">
            <p className="font-semibold text-slate-800 mb-2">三個關鍵點：</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>第三方元件用 <code className="bg-white px-1 rounded">v-slot="&#123; field, errorMessage &#125;"</code> 橋接，不要用空白的 <code className="bg-white px-1 rounded">&lt;span&gt;</code></li>
              <li>日期選擇器等非標準輸入，必須包在 <code className="bg-white px-1 rounded">&lt;Field&gt;</code> 裡，手動觸發 <code className="bg-white px-1 rounded">onChange / onBlur</code></li>
              <li>使用 <code className="bg-white px-1 rounded">toTypedSchema()</code> 讓 form values 有 TypeScript 型別推斷</li>
            </ul>
          </div>
          <CodeBlock code={VEEVALIDATE_BEST} language="html" />
        </section>

        {/* Solution 4 */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="shrink-0 size-7 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold flex items-center justify-center">D</span>
            <h3 className="text-lg font-bold text-slate-800">各平台 Schema 完整定義 + 跨欄位時間驗證</h3>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-200 text-sm text-slate-600">
            <p className="text-slate-500">
              每個平台（Yahoo / Momo / Shopee）從 Base Schema 組合，只需宣告該平台的差異欄位。
              跨欄位邏輯（如「結束時間必須晚於生效時間」）用 <code className="bg-white px-1 rounded">.when()</code> 在 Schema 層處理，不放在元件的 <code className="bg-white px-1 rounded">@submit</code> 裡。
            </p>
          </div>
          <CodeBlock code={PLATFORM_SCHEMA} language="typescript" />
        </section>
      </div>
    </div>
  );
}
