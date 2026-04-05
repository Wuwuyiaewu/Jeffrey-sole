export type BoolOrFn = boolean | ((ctx: any) => boolean);

export interface DynamicFieldConfig {
  id: string;
  label: string;
  componentType: "Input" | "Textarea" | "DatePicker" | "Select" | "Checkbox" | "Radio";
  required?: BoolOrFn;
  disabled?: BoolOrFn;
  visible?: BoolOrFn;
}

export interface DemoContext {
  role: string;
  amount: number;
  threshold: number;
}
