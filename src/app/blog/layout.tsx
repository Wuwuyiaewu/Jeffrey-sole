import { ReactNode } from "react";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <section className="border rounded-md">{children}</section>;
}
