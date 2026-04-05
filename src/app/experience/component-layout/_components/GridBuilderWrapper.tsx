"use client";

import { useGridLayout } from "../_hooks/useGridLayout";
import { FieldConfig } from "../_types";
import { LayoutHeader, GridBuilder, DebugPanel, AddFieldModal } from "./index";

export default function GridBuilderWrapper({
  initialLayout,
}: {
  initialLayout: FieldConfig[];
}) {
  const grid = useGridLayout(initialLayout);

  return (
    <>
      <LayoutHeader {...grid.headerProps} />
      <GridBuilder {...grid.gridProps} />
      <DebugPanel layout={grid.layout} />
      <AddFieldModal {...grid.modalProps} />
    </>
  );
}
