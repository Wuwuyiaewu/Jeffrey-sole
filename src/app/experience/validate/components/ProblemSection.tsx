import CodeBlock from "@/components/CodeBlock";

const REGEX_G_BUG = `// ❌ 問題：regex 使用 /g flag，狀態殘留導致第二次呼叫失敗
export const getBarcodeValidator = () => {
  return Yup.string().test("isBarcode", "條碼格式不正確", (value) => {
    const code = \`\${value}\`;

    // /g flag 讓 RegExp 有 lastIndex 狀態
    // 第一次呼叫：lastIndex=0 → match → lastIndex=13
    // 第二次呼叫相同字串：lastIndex=13 → 從第14位開始找 → 找不到 → false ❌
    const digits = () => /^\\d{13}$/g.test(code);

    // ❌ .map() 用於副作用，應改用 .forEach()
    codeList.map((value, index) => {
      checksum += index % 2 ? digit * 3 : digit;
    });
  });
};`;

const SCHEMA_DUPLICATE = `// ❌ 問題：巢狀物件驗證邏輯重複定義兩次
itemCategorySelectOptionGroup: Yup.object({
  primaryCategory: Yup.object({ code: Yup.string().required() }).required(),
  secondaryCategory: Yup.object({ code: Yup.string().required() }).required(),
  minorCategory: Yup.object({ code: Yup.string().required() }).required(),
})
  .required()
  .test("itemCategorySelectOptionGroupErrors", "此為必填", (value) => {
    try {
      // ❌ 完全複製了上方的 shape 定義，validateSync 其實是多餘的
      Yup.object().shape({
        primaryCategory: Yup.object({ code: Yup.string().required() }).required(),
        secondaryCategory: Yup.object({ code: Yup.string().required() }).required(),
        minorCategory: Yup.object({ code: Yup.string().required() }).required(),
      }).validateSync(value, { recursive: true });
      return true;
    } catch (errors) {
      console.log(errors); // ❌ console.log 留在 production
      return false;
    }
  }),`;

const VEEVALIDATE_NO_ERROR = `<!-- ❌ 問題：Field 的 error 訊息沒有正確串接到 UI -->
<Field name="safeStorage" v-slot="{ field, handleChange }">
  <PrimeInputNumber
    v-bind="field"
    @input="(event) => { handleChange(event.value); }"
  />
</Field>

<!-- ❌ 這個 span 永遠是空的 — VeeValidate 不會自動填入 -->
<span class="error"></span>

<!-- ❌ Calendar 完全沒有包在 Field 裡，VeeValidate 無從追蹤 -->
<PrimeCalendar dateFormat="yy/mm/dd" />`;

const SCHEMA_TOO_THIN = `// ❌ 問題：YahooPlatform 的 Schema 只驗證一個欄位
// 但 template 中有多個標記 required 的欄位
const YahooSchema = Yup.object({
  proposal: Yup.string().nullable(true).required("此為必填"),
  // 缺少：newItemBrief、safeStorage、purchaseCost、centerPrice...
});`;

export default function ProblemSection() {
  return (
    <div className="space-y-10">
      <div className="bg-white rounded-xl border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">遇到的問題</h2>
        <p className="text-slate-500 mb-8">
          在實際使用 VeeValidate + Yup 的過程中，遭遇了幾個不易發覺的陷阱，這些問題在 Code Review 或上線後才逐漸浮現。
        </p>

        {/* Problem 1 */}
        <div className="mb-10">
          <div className="flex items-start gap-3 mb-4">
            <span className="shrink-0 mt-0.5 size-6 rounded-full bg-red-100 text-red-600 text-sm font-bold flex items-center justify-center">1</span>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Regex <code className="text-sm bg-slate-100 px-1.5 py-0.5 rounded">/g</code> flag 造成的狀態殘留 Bug</h3>
              <p className="text-slate-500 mt-1 text-sm">
                在 <code className="bg-slate-100 px-1 rounded">validate-helper.ts</code> 的條碼驗證中，regex 使用了 <code className="bg-slate-100 px-1 rounded">/g</code> 旗標。
                帶有 <code className="bg-slate-100 px-1 rounded">/g</code> 的 RegExp 實例會保存 <code className="bg-slate-100 px-1 rounded">lastIndex</code> 狀態，
                導致第一次呼叫成功後，第二次呼叫相同字串卻回傳 <code className="bg-slate-100 px-1 rounded">false</code>。
                另外，使用 <code className="bg-slate-100 px-1 rounded">.map()</code> 執行副作用也是不良習慣。
              </p>
            </div>
          </div>
          <CodeBlock code={REGEX_G_BUG} language="typescript" />
        </div>

        {/* Problem 2 */}
        <div className="mb-10">
          <div className="flex items-start gap-3 mb-4">
            <span className="shrink-0 mt-0.5 size-6 rounded-full bg-red-100 text-red-600 text-sm font-bold flex items-center justify-center">2</span>
            <div>
              <h3 className="text-lg font-bold text-slate-800">巢狀物件 Schema 重複定義</h3>
              <p className="text-slate-500 mt-1 text-sm">
                在 <code className="bg-slate-100 px-1 rounded">_schema-service.ts</code> 中，三層分類的驗證邏輯在 <code className="bg-slate-100 px-1 rounded">.shape()</code> 裡寫了一次，
                又在 <code className="bg-slate-100 px-1 rounded">.test()</code> 裡用 <code className="bg-slate-100 px-1 rounded">validateSync</code> 再寫一次。
                外層的 Yup shape 本身已能遞迴驗證，<code className="bg-slate-100 px-1 rounded">.test()</code> 的包裝是多餘的，
                且 catch 中的 <code className="bg-slate-100 px-1 rounded">console.log</code> 會在 production 環境輸出。
              </p>
            </div>
          </div>
          <CodeBlock code={SCHEMA_DUPLICATE} language="typescript" />
        </div>

        {/* Problem 3 */}
        <div className="mb-10">
          <div className="flex items-start gap-3 mb-4">
            <span className="shrink-0 mt-0.5 size-6 rounded-full bg-red-100 text-red-600 text-sm font-bold flex items-center justify-center">3</span>
            <div>
              <h3 className="text-lg font-bold text-slate-800">VeeValidate 錯誤訊息沒有正確串接</h3>
              <p className="text-slate-500 mt-1 text-sm">
                在 <code className="bg-slate-100 px-1 rounded">YahooPlatform.vue</code> 中，錯誤顯示用的是空白的 <code className="bg-slate-100 px-1 rounded">&lt;span class="error"&gt;</code>，
                而不是 VeeValidate 的 <code className="bg-slate-100 px-1 rounded">&lt;ErrorMessage&gt;</code>。
                此外，日期選擇器 <code className="bg-slate-100 px-1 rounded">PrimeCalendar</code> 沒有包在 <code className="bg-slate-100 px-1 rounded">&lt;Field&gt;</code> 裡，
                VeeValidate 完全無法追蹤其值與錯誤狀態。
              </p>
            </div>
          </div>
          <CodeBlock code={VEEVALIDATE_NO_ERROR} language="html" />
        </div>

        {/* Problem 4 */}
        <div>
          <div className="flex items-start gap-3 mb-4">
            <span className="shrink-0 mt-0.5 size-6 rounded-full bg-red-100 text-red-600 text-sm font-bold flex items-center justify-center">4</span>
            <div>
              <h3 className="text-lg font-bold text-slate-800">平台 Schema 驗證規則過於薄弱</h3>
              <p className="text-slate-500 mt-1 text-sm">
                <code className="bg-slate-100 px-1 rounded">YahooPlatform</code> 的 <code className="bg-slate-100 px-1 rounded">YahooSchema</code> 只驗證了一個欄位，
                但 template 中標記 <code className="bg-slate-100 px-1 rounded">required</code> 的欄位有七個以上。
                這意味著使用者送出不完整的表單時，前端不會提示任何錯誤——驗證責任完全落在後端。
              </p>
            </div>
          </div>
          <CodeBlock code={SCHEMA_TOO_THIN} language="typescript" />
        </div>
      </div>
    </div>
  );
}
