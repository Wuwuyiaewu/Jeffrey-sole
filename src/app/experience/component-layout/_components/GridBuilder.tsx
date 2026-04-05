import { FieldConfig } from "../_types";
import { GridItem } from "./GridItem";

interface Props {
  layout: FieldConfig[];
  maxColumns: number;
  formData: Record<string, string>;
  onUpdate: (id: string, value: string) => void;
  moveItem: (index: number, dir: number) => void;
  onRemove: (id: string) => void;
}

export function GridBuilder({
  layout,
  maxColumns,
  formData,
  onUpdate,
  moveItem,
  onRemove,
}: Props) {
  return (
    <div
      className="grid gap-4 border p-4"
      style={{
        gridTemplateColumns: `repeat(${maxColumns}, 1fr)`,
        gridAutoFlow: "row dense",
      }}
    >
      {layout.map((field, index) => (
        <GridItem
          key={field.id}
          field={field}
          index={index}
          maxColumns={maxColumns}
          value={formData[field.id]}
          onUpdate={onUpdate}
          moveItem={moveItem}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
