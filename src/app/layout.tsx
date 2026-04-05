import "./globals.css";
import type { ReactNode } from "react";
import Sidebar from "./(components)/Sidebar";
import Providers from "./providers";
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Providers>
          {/* 💻 Desktop Layout */}
          <div className="flex w-full">
            <Sidebar />
            <main className="ml-48 flex-1 w-full overflow-x-hidden">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
