"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  // 使用 useState 確保在 Client 端切換頁面時，QueryClient 不會被重新建立
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1分鐘內資料視為新鮮，不重複抓取
            retry: 1, // 失敗重試一次
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
