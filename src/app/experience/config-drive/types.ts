export interface FieldConfig {
  id: string;
  label: string;
  componentType: "Input" | "Textarea" | "DatePicker" | "Select" | "Checkbox" | "Radio";
}
