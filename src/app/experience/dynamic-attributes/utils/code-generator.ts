import { DynamicFieldConfig } from "../types";

export function generateVueStaticCode(fields: DynamicFieldConfig[]): string {
  if (fields.length === 0) return "// 尚未新增任何欄位";

  const components = fields.map((field, index) => {
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

    // 傳統寫法的 if/else 生成 (簡化模擬)
    let requiredAttr = "";
    let disabledAttr = "";
    let vIfAttr = "";

    if (field.required && typeof field.required === 'function') {
      requiredAttr = `\n      :required="checkRequired()"`;
    } else if (field.required) {
      requiredAttr = `\n      required`;
    }

    if (field.disabled && typeof field.disabled === 'function') {
      disabledAttr = `\n      :disabled="checkDisabled()"`;
    } else if (field.disabled) {
      disabledAttr = `\n      disabled`;
    }
    
    if (field.visible === false) {
       vIfAttr = ` v-if="false"`;
    } else if (typeof field.visible === 'function') {
       vIfAttr = `\n      v-if="checkVisible()"`;
    }

    return `<!-- ${componentName}.vue -->
<template>
  <div${vIfAttr}>
    <label>
      ${field.label}
    </label>
    <${elementType}${typeAttr}
      v-model="modelValue"${requiredAttr}${disabledAttr}
      placeholder="請輸入${field.label}"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: any,
  role: string,
  amount: number
}>()

// 傳統在元件內的各種判斷邏輯
${typeof field.required === 'function' ? `const checkRequired = () => {\n  // 複雜的權限或金額判斷\n  return props.role === 'admin' || props.amount > 1000;\n}\n` : ''}
${typeof field.disabled === 'function' ? `const checkDisabled = () => {\n  return props.role === 'guest';\n}\n` : ''}
${typeof field.visible === 'function' ? `const checkVisible = () => {\n  return props.amount > 5000;\n}\n` : ''}
</script>`;
  }).join("\n\n" + "=".repeat(60) + "\n\n");

  return components;
}

export function generateVueConfigCode(fields: DynamicFieldConfig[]): string {
  const code = `// logic-resolver.ts
export const createRequiredResolver = (ctx) => {
  return (configRequired) => {
    if (typeof configRequired === 'function') return configRequired(ctx);
    return !!configRequired;
  }
}

export const createVisibleResolver = (ctx) => {
  return (configVisible) => {
    if (typeof configVisible === 'function') return configVisible(ctx);
    if (typeof configVisible === 'boolean') return configVisible;
    return true; // 預設顯示
  }
}

// ============================================================

// config.ts
export const FORM_CONFIG = [
${fields.map(f => {
  
  let reqStr = "false";
  if (typeof f.required === 'function') reqStr = `(ctx) => ${f.required.toString().replace(/ctx\./g, 'ctx.').substring(f.required.toString().indexOf('=>') + 3)}`;
  else if (f.required) reqStr = "true";

  let visStr = "true";
  if (typeof f.visible === 'function') visStr = `(ctx) => ${f.visible.toString().substring(f.visible.toString().indexOf('=>') + 3)}`;
  else if (f.visible === false) visStr = "false";

  let disStr = "false";
  if (typeof f.disabled === 'function') disStr = `(ctx) => ${f.disabled.toString().substring(f.disabled.toString().indexOf('=>') + 3)}`;
  else if (f.disabled) disStr = "true";

  return `  {
    id: '${f.id}',
    label: '${f.label}',
    component: '${f.componentType}',
    required: ${reqStr},
    visible: ${visStr},
    disabled: ${disStr}
  }`;
}).join(",\n")}
]

// ============================================================

// Form.vue
<template>
  <div class="space-y-6">
    <!-- 經過 Transformer 解析好的 Fields -->
    <template v-for="field in processedFields" :key="field.id">
      <div v-show="field.bindProps.isVisible">
        <label>
          <span v-if="field.bindProps.required" class="text-red-500">*</span> 
          {{ field.label }}
        </label>
        <component
          :is="getComponent(field.component)"
          v-model="modelValue[field.id]"
          :disabled="field.bindProps.disabled"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { FORM_CONFIG } from './config'
import { createRequiredResolver, createVisibleResolver } from './logic-resolver'

const props = defineProps<{ role: string, amount: number }>()

const resolverCtx = computed(() => ({
  role: props.role,
  amount: props.amount
}))

const processedFields = computed(() => {
  const ctx = resolverCtx.value;
  const isRequired = createRequiredResolver(ctx);
  const isVisible = createVisibleResolver(ctx);
  // ... isDisabled 同理 ...

  return FORM_CONFIG.map(config => {
    return {
      ...config,
      bindProps: {
        required: isRequired(config.required),
        visible: isVisible(config.visible),
        // disabled: isDisabled(config.disabled)
      }
    }
  })
})
</script>
`;

  return code;
}
