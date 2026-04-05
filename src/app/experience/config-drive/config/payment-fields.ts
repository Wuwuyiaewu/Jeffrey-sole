import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Role } from "../resolver.types";
import React from "react";

// 1. 定義欄位配置的介面
export interface FieldConfig {
  id: string;
  label: string;
  placeholder?: string;
  component: React.ElementType; // 對應 Vue 的 markRaw
}

// 2. 實作配置列表
export const PAYMENT_FIELDS: FieldConfig[] = [
  {
    id: "amount",
    label: "申請金額",
    placeholder: "請輸入金額",
    component: Input,
  },
  {
    id: "description",
    label: "商品說明",
    placeholder: "請簡述商品內容...",
    component: Textarea,
  },
  {
    id: "approverComment",
    label: "審核人意見",
    placeholder: "請輸入核准或駁回理由",
    component: Textarea,
  },
];
