"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

type TabItem = {
  key: string;
  label: string;
  element: React.ReactNode;
};

interface Props {
  tabs: TabItem[];
}

export default function TabsLayout({ tabs }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab = useMemo(() => {
    const tab = searchParams.get("tab");
    return tabs.some((t) => t.key === tab) ? tab : tabs[0].key;
  }, [searchParams, tabs]);

  const handleChange = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", key);

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <nav className="sticky top-0 bg-white border-b z-40">
        <div className="flex justify-center gap-2 py-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleChange(tab.key)}
              className={`px-6 py-3 font-semibold rounded-t-lg transition
                ${
                  activeTab === tab.key
                    ? "bg-stone-100 border-b-2 border-slate-900"
                    : "text-stone-600 hover:bg-stone-50"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        {tabs.find((t) => t.key === activeTab)?.element}
      </div>
    </>
  );
}
