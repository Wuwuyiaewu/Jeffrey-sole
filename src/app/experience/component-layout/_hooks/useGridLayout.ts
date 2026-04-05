"use client";

import { useState, useCallback, useMemo } from "react";
import { FieldConfig } from "../_types";

export function useGridLayout(initialLayout: FieldConfig[] = []) {
  const [layout, setLayout] = useState<FieldConfig[]>(initialLayout);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [maxColumns, setMaxColumns] = useState(4);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* ========================
     Actions
  ======================== */

  const handleUpdate = useCallback((id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleAddField = useCallback((field: FieldConfig) => {
    setLayout((prev) => [...prev, field]);
  }, []);

  const handleRemove = useCallback((id: string) => {
    setLayout((prev) => prev.filter((f) => f.id !== id));
    setFormData((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }, []);

  const moveItem = useCallback((index: number, dir: number) => {
    setLayout((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }, []);

  const handleClearAll = useCallback(() => {
    setLayout([]);
    setFormData({});
  }, []);

  const handleClearFormData = useCallback(() => {
    setFormData({});
  }, []);

  const handleReset = useCallback(() => {
    setLayout(initialLayout);
    setFormData({});
  }, []);

  /* ========================
     Derived Props
  ======================== */

  const headerProps = useMemo(
    () => ({
      maxColumns,
      setMaxColumns,
      onClearFormData: handleClearFormData,
      onReset: handleReset,
      onClearAll: handleClearAll,
      onOpenModal: () => setIsModalOpen(true),
    }),
    [maxColumns, handleClearFormData, handleReset, handleClearAll],
  );

  const gridProps = useMemo(
    () => ({
      layout,
      maxColumns,
      formData,
      onUpdate: handleUpdate,
      moveItem,
      onRemove: handleRemove,
    }),
    [layout, maxColumns, formData, handleUpdate, moveItem, handleRemove],
  );

  const modalProps = useMemo(
    () => ({
      isOpen: isModalOpen,
      onClose: () => setIsModalOpen(false),
      onAdd: handleAddField,
      maxColumns,
    }),
    [isModalOpen, handleAddField, maxColumns],
  );

  return {
    layout,
    headerProps,
    gridProps,
    modalProps,
  };
}
