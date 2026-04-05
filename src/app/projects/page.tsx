const PROJECTS = [
  { name: "台達供需模擬" },
  { name: "台達電子採購平台" },
  { name: "雨林新零售" },
  { name: "國泰風險管理" },
];

export default function ProjectsPage() {
  return (
    <main className="p-8 bg-white dark:bg-neutral-900 text-black dark:text-white min-h-screen max-w-4xl">
      <section>
        <h1 className="text-3xl font-bold mb-6">專案實例示範</h1>
        <div className="grid gap-4">
          {PROJECTS.map((p) => (
            <div key={p.name} className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded">
              {p.name}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
