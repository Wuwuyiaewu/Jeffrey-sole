import { FieldConfig } from "../_types";

interface DebugPanelProps {
  layout: FieldConfig[];
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ layout }) => {
  return (
    <div className="mt-8 p-4 bg-gray-100 font-mono text-sm">
      <h3 className="font-bold mb-2">配置資料</h3>
      <pre className="text-xs">
        {JSON.stringify(
          layout.map((i) => ({ id: i.id, label: i.label, w: i.w })),
          null,
          2,
        )}
      </pre>
    </div>
  );
};
