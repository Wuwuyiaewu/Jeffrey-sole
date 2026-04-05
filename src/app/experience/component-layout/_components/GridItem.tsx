import { FieldConfig } from "../_types";
import { FieldComponent } from "./FieldComponent";

interface Props {
  field: FieldConfig;
  index: number;
  maxColumns: number;
  value: string;
  onUpdate: (id: string, value: string) => void;
  moveItem: (index: number, dir: number) => void;
  onRemove: (id: string) => void;
}

export function GridItem({
  field,
  index,
  maxColumns,
  value,
  onUpdate,
  moveItem,
  onRemove,
}: Props) {
  return (
    <div
      style={{ gridColumn: `span ${Math.min(field.w, maxColumns)}` }}
      className="group relative"
    >
      <FieldComponent field={field} value={value} onChange={onUpdate} />

      <div className="absolute top-1 right-1 hidden group-hover:flex gap-1 bg-white p-1">
        <button onClick={() => moveItem(index, -1)}>←</button>
        <button onClick={() => moveItem(index, 1)}>→</button>
        <button onClick={() => onRemove(field.id)}>✕</button>
      </div>

      <div className="absolute bottom-1 right-1 text-xs text-gray-400">
        {field.w}/{maxColumns}
      </div>
    </div>
  );
}
