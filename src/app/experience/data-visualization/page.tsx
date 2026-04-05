import Link from "next/link";
import { ALL_NAV_ITEMS } from "@/lib/nav-data";

const ITEMS = ALL_NAV_ITEMS.filter((item) =>
  item.href.startsWith("/experience/data-visualization/")
);

export default function DataVisualizationPage() {
  return (
    <main className="p-12 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">資料視覺化</h1>
        <p className="text-gray-500">圖表與互動式關聯圖實作</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ITEMS.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="p-6 rounded-xl border border-neutral-200 hover:border-blue-500 hover:bg-neutral-50 transition-all group"
          >
            <h2 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
              {item.name}
            </h2>
          </Link>
        ))}
      </div>
    </main>
  );
}
