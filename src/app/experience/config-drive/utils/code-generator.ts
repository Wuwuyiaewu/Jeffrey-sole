import { FieldConfig } from "../types";

/**
 * 生成 Before (傳統寫法) 的 Vue3 程式碼
 * 為每個欄位生成獨立的組件檔案
 */
export function generateBeforeCode(fields: FieldConfig[]): string {
  if (fields.length === 0) {
    return "// 尚未新增任何欄位";
  }

  const components = fields
    .map((field, index) => {
      const componentName = `${field.componentType}Field_${index + 1}`;
      let elementType = "el-input";
      let typeAttr = "";

      switch (field.componentType) {
        case "Input": elementType = "el-input"; break;
        case "Textarea": elementType = "el-input"; typeAttr = ' type="textarea"'; break;
        case "DatePicker": elementType = "el-date-picker"; break;
        case "Select": elementType = "el-select"; break;
        case "Checkbox": elementType = "el-checkbox"; break;
        case "Radio": elementType = "el-radio"; break;
      }

      return `<!-- ${componentName}.vue -->
<template>
  <div>
    <label>
      ${field.label}
    </label>
    <${elementType}${typeAttr}
      v-model="modelValue"
      placeholder="請輸入${field.label}"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
}>()
</script>`;
    })
    .join("\n\n" + "=".repeat(60) + "\n\n");

  // 生成父組件
  const parentComponent = `
<!-- PaymentForm.vue (父組件) -->
<template>
  <div class="space-y-6">
${fields
  .map((f, index) => {
    const componentName = `${f.componentType}Field_${index + 1}`;
    return `    <${componentName}
      v-model="form.${f.id}"
    />`;
  })
  .join("\n")}
  </div>
</template>

<script setup lang="ts">
${fields.map((f, index) => `import ${f.componentType}Field_${index + 1} from './components/${f.componentType}Field_${index + 1}.vue'`).join("\n")}

const form = reactive({
${fields.map((f) => `  ${f.id}: ''`).join(",\n")}
})
</script>

<!-- 
  比較：
  - 共有 ${fields.length} 個獨立元件檔案
  - 相似的元件會重複到
  - 修改時候要捲動滾輪去爬和改 ${fields.length} 個地方
  - 新增修改屬性也需要透過滾動爬改
-->`;

  return components + "\n\n" + "=".repeat(60) + "\n\n" + parentComponent;
}

/**
 * 生成 After (Config-Driven) 的 Vue3 程式碼
 */
export function generateAfterCode(fields: FieldConfig[]): string {
  if (fields.length === 0) {
    return "// 尚未新增任何欄位";
  }

  // 生成 Config 檔案
  const configFile = `// form-fields.ts (配置檔案)

export const FORM_FIELDS = [
${fields
  .map((field) => {
    return `  {
    id: '${field.id}',
    label: '${field.label}',
    component: '${field.componentType}',
  }`;
  })
  .join(",\n")}
]

// 所有表單結構集中在這裡，只需維護一個陣列`;

  // 生成組件檔案
  const componentFile = `
<!-- DynamicForm.vue (通用渲染組件) -->
<template>
  <div class="space-y-6">
    <div v-for="field in FORM_FIELDS" :key="field.id">
      <label class="block text-sm font-semibold mb-2">
        {{ field.label }}
      </label>
      <component
        :is="getComponent(field.component)"
        v-model="modelValue[field.id]"
        :placeholder="'請輸入 ' + field.label"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { FORM_FIELDS } from './form-fields'
import { resolveComponent } from 'vue'

const props = defineProps<{
  modelValue: Record<string, any>
}>()

const getComponent = (type: string) => {
  const map: Record<string, string> = {
    Input: 'el-input',
    Textarea: 'el-input',
    DatePicker: 'el-date-picker',
    Select: 'el-select',
    Checkbox: 'el-checkbox',
    Radio: 'el-radio'
  }
  return resolveComponent(map[type] || 'el-input')
}
</script>

<!-- 
  比較：
  - 只需 2 個檔案 (config 陣列 + template 渲染)
  - 新增欄位只需在陣列加一個物件
  - 組件只需寫一份乾淨的 v-for 結構，不用再重複處理 import 和標籤
-->`;

  return configFile + "\n\n" + "=".repeat(60) + "\n\n" + componentFile;
}

/**
 * 計算程式碼統計資訊
 */
export function getCodeStats(fields: FieldConfig[]) {
  const beforeLines = fields.length * 25 + 20; // 每個組件約 25 行 + 父組件 20 行
  const afterLines = fields.length * 8 + 25; // config 每個欄位 8 行 + 通用組件 25 行

  return {
    beforeFiles: fields.length + 1, // N 個子組件 + 1 個父組件
    afterFiles: 2, // 1 個 config + 1 個組件
    beforeLines,
    afterLines,
    reduction: Math.round((1 - afterLines / beforeLines) * 100),
  };
}
