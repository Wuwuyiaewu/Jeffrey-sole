import Link from "next/link";

const ITEMS = [
  {
    name: "Vite 建置工具",
    desc: "多環境打包、unplugin-auto-import、SSG",
    href: "/experience/dev-setup/vite",
  },
  {
    name: "Tailwind CSS",
    desc: "Utility-first、Dark Mode、tailwind.config、與 Element Plus 並用",
    href: "/experience/dev-setup/tailwind",
  },
];

export default function DevSetupIndexPage() {
  return (
    <main className="p-12 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">開發設定</h1>
        <p className="text-gray-500">開發工具鏈、規範與協作設定</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ITEMS.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="p-6 rounded-xl border border-neutral-200 hover:border-blue-500 hover:bg-neutral-50 transition-all group"
          >
            <h2 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
              {item.name}
            </h2>
            <p className="text-sm text-neutral-500">{item.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
