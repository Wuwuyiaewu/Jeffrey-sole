import Link from "next/link";
const ITEMS = [
  { name: "ESLint", href: "/experience/environment-setup/eslint" },
  { name: "Stylelint", href: "/experience/environment-setup/stylelint" },
  { name: "Prettier", href: "/experience/environment-setup/prettier" },
  { name: "Husky + lint-staged", href: "/experience/environment-setup/husky" },
];
export default function EnvironmentSetupPage() {
  return (
    <main className="p-12 space-y-8">
      <div><h1 className="text-4xl font-bold mb-2">環境設定</h1><p className="text-gray-500">程式碼品質管控工具設定</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ITEMS.map((item) => (
          <Link key={item.name} href={item.href} className="p-6 rounded-xl border border-neutral-200 hover:border-blue-500 hover:bg-neutral-50 transition-all group">
            <h2 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">{item.name}</h2>
          </Link>
        ))}
      </div>
    </main>
  );
}
