import Link from "next/link";
import { EXPERIENCE_SECTIONS } from "@/lib/nav-data";

export default function Home() {
  return (
    <main className="p-8 bg-white dark:bg-neutral-900 text-black dark:text-white min-h-screen">
      <section className="mb-8">
        <h2 className="sticky top-0 z-20 -mx-8 mb-8 w-screen bg-slate-900/75 px-8 py-5 backdrop-blur lg:relative lg:mx-0 lg:w-full lg:px-0 lg:bg-transparent lg:text-3xl lg:font-bold text-white lg:text-black dark:text-white">
          實務經驗與設計模式
        </h2>
      </section>
      <div className="space-y-12">
        {EXPERIENCE_SECTIONS.map((section) => (
          <div key={section.title}>
            <div className="mb-4 border-l-4 border-blue-500 pl-4">
              <h3 className="text-xl font-semibold">{section.title}</h3>
              <p className="text-sm text-neutral-500">{section.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.items.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all hover:border-blue-500 group/item"
                >
                  <span className="text-neutral-700 dark:text-neutral-300 group-hover/item:text-blue-500 transition-colors">
                    {item.name}
                  </span>
                  <svg
                    className="ml-auto w-4 h-4 opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
