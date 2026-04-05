"use client";

import React, { useState } from "react";
import { useForm } from "@tanstack/react-form-nextjs";
import { useQuery } from "@tanstack/react-query";

// --- 型別定義 ---
export interface ECFormItem {
  item: number;
  formNo: string;
  deltaPartNo: string;
  partDescription: string;
  vendorName: string;
  applyDate: string;
  status: string;
  currentUser: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// 接收來自 Server 端預抓的資料
export default function ECQueryContent({ 
  initialData 
}: { 
  initialData: PaginatedResponse<ECFormItem> 
}) {
  // 1. 狀態管理
  const [searchParams, setSearchParams] = useState({
    status: "ALL",
    applyDateFrom: "",
    applyDateTo: "",
  });

  // 2. TanStack Query
  const { data, isLoading, isError } = useQuery<PaginatedResponse<ECFormItem>>({
    queryKey: ["ecForms", searchParams],
    queryFn: async () => {
      const res = await fetch("http://localhost:8001/formQuery/search?page=0&size=10", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "authorization": `Bearer ${process.env.NEXT_PUBLIC_AUTH0_TOKEN}`,
          "selected-group-code": "230001"
        },
        body: JSON.stringify({
          ...searchParams,
          currentUserList: [],
          deltaPartNos: [],
          formNoList: [],
          plantList: [],
          vnCodeList: [],
          productCodeList: [],
          qtrFormNoList: [],
          toolingIdList: [],
          vendorPartNos: []
        }),
      });
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    },
    // 關鍵：如果目前的參數是預設值，就用 SSR 傳進來的資料，不用再噴一次 API
    initialData: (searchParams.status === "ALL" && !searchParams.applyDateFrom) ? initialData : undefined,
    staleTime: 1000 * 60 * 5, // 5 分鐘內視為新鮮
  });

  const form = useForm({
    defaultValues: searchParams,
    onSubmit: async ({ value }) => {
      setSearchParams(value);
    },
  });

  return (
    <div className="p-4">
      {/* ... 這裡保留你原本的 JSX (Form 和 Table) ... */}
      <h1 className="text-xl font-bold mb-4">採樣查詢系統 (SSR 版)</h1>
      
      <form
        onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }}
        className="flex gap-4 mb-6 items-end border p-4 rounded bg-white shadow-sm"
      >
        <form.Field name="status">
          {(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700">狀態</label>
              <select 
                className="border rounded p-1 mt-1 block w-full bg-white text-black"
                value={field.state.value} 
                onChange={(e) => field.handleChange(e.target.value)}
              >
                <option value="ALL">全部 (ALL)</option>
                <option value="Complete">已完成 (Complete)</option>
                <option value="Releasing">發行中 (Releasing)</option>
              </select>
            </div>
          )}
        </form.Field>
        <button type="submit" className="bg-blue-600 text-white px-6 py-1.5 rounded">搜尋</button>
      </form>

      {/* 表格部分 */}
      <div className="overflow-x-auto border rounded">
        <table className="w-full border-collapse bg-white text-black">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 border">Item</th>
              <th className="p-2 border">Form No</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.content.map((item) => (
              <tr key={item.formNo}>
                <td className="p-2 border">{item.item}</td>
                <td className="p-2 border">{item.formNo}</td>
                <td className="p-2 border">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}