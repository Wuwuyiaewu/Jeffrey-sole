import "./globals.css";
import type { ReactNode } from "react";
import { Newsreader, Inter, Funnel_Sans } from "next/font/google";
import Sidebar from "./(components)/Sidebar";
import Providers from "./providers";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const funnelSans = Funnel_Sans({
  subsets: ["latin"],
  variable: "--font-funnel-sans",
  display: "swap",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${inter.variable} ${funnelSans.variable}`}
    >
      <body className="min-h-screen">
        <Providers>
          {/* 💻 Desktop Layout */}
          <div className="flex w-full">
            <Sidebar />
            <main className="md:ml-48 flex-1 w-full overflow-x-hidden bg-white dark:bg-neutral-900 text-black dark:text-white">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
