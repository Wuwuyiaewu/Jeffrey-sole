// lib/hooks/useActiveSection.ts
import { useEffect, useState } from "react";

export function useActiveSection(
  sections: string[],
  defaultSection = "about" // 這裡給 server render 一個固定值
) {
  const [activeId, setActiveId] = useState(defaultSection);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveId(entry.target.id);
      });
    });

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  return activeId;
}
