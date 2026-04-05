// app/day-one/layout.tsx
import { ReactNode } from "react";

export default function DayOneLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      {children} {/* 頁面內容會渲染在這 */}
    </div>
  );
}
