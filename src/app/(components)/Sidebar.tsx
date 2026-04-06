"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import clsx from "clsx";
import { User, Briefcase, FolderGit, Moon, Sun, FileText, Search, X, Network, Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ALL_NAV_ITEMS, type NavItem } from "@/lib/nav-data";

const SEARCH_MAX_RESULTS = 8;

const NAV_LINKS = [
  { href: "/about",      icon: User,      label: "About" },
  { href: "/experience", icon: Briefcase, label: "Experience" },
  { href: "/graph",      icon: Network,   label: "Roadmap" },
  { href: "/projects",   icon: FolderGit, label: "Projects" },
  { href: "/resume",     icon: FileText,  label: "Resume" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const results: NavItem[] = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return [];
    const lower = trimmed.toLowerCase();
    return ALL_NAV_ITEMS.filter(
      (item) =>
        item.name.toLowerCase().includes(lower) ||
        item.category.toLowerCase().includes(lower)
    ).slice(0, SEARCH_MAX_RESULTS);
  }, [query]);

  const showDropdown = isSearchFocused && query.trim().length > 0 && results.length > 0;

  useEffect(() => { setSelectedIndex(0); }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        setQuery("");
        setIsSearchFocused(false);
        searchRef.current?.blur();
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showDropdown) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = results[selectedIndex];
        if (item) {
          router.push(item.href);
          setQuery("");
          setIsSearchFocused(false);
          searchRef.current?.blur();
        }
      }
    },
    [showDropdown, results, selectedIndex, router]
  );

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close menu on route change (mobile)
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobile && isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobile, isMenuOpen]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <>
      {/* Mobile burger button */}
      {isMobile && (
        <button
          onClick={() => setIsMenuOpen(true)}
          aria-label="開啟選單"
          className="fixed top-4 left-4 z-50 flex items-center justify-center size-10 rounded-xl bg-[#f9f9fb] dark:bg-[#0b0d2a] border border-[#e5e7eb] dark:border-white/[0.08] shadow-sm text-[#6b7280] dark:text-[#8b8fb5] hover:text-[#0a0c10] dark:hover:text-[#c8caee] transition-colors"
        >
          <Menu className="size-5" />
        </button>
      )}

      {/* Overlay / mask */}
      {isMobile && isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed left-0 top-0 h-screen border-r transition-transform duration-300 z-50",
          "bg-[#f9f9fb] dark:bg-[#0b0d2a] border-[#e5e7eb] dark:border-white/[0.08] w-48",
          isMobile && !isMenuOpen && "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col justify-between">
          <div>
            {/* Logo area — brand gradient pill */}
            <div className="flex h-16 items-center justify-center border-b border-[#e5e7eb] dark:border-white/[0.08]">
              <span className="grid size-10 place-content-center rounded-xl text-xs font-bold text-white"
                style={{ background: "linear-gradient(135deg, #4242fa 0%, #f60d67 100%)" }}>
                L
              </span>
            </div>

            {/* Search */}
            <div className="px-2 pt-3 pb-1 relative">
              <div
                className={clsx(
                  "flex items-center gap-2 rounded-lg border px-2.5 py-1.5 transition-colors",
                  isSearchFocused
                    ? "border-[#4242fa] dark:border-[#6b6bff] bg-white dark:bg-[#1e2148]"
                    : "border-[#e5e7eb] dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.04] hover:border-[#4242fa]/40 dark:hover:border-[#6b6bff]/40",
                )}
              >
                <Search className="size-3.5 shrink-0 text-[#6b7280] dark:text-[#8b8fb5]" />
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 150)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="搜尋..."
                  aria-label="搜尋頁面"
                  className="min-w-0 flex-1 bg-transparent text-xs text-[#0a0c10] dark:text-[#c8caee] placeholder-[#6b7280] dark:placeholder-[#8b8fb5] outline-none"
                />
                {query ? (
                  <button
                    onMouseDown={(e) => { e.preventDefault(); setQuery(""); searchRef.current?.focus(); }}
                    aria-label="清除搜尋"
                    className="shrink-0 text-[#6b7280] hover:text-[#4242fa] dark:text-[#8b8fb5] dark:hover:text-[#6b6bff] transition-colors"
                  >
                    <X className="size-3" />
                  </button>
                ) : (
                  <kbd className="shrink-0 rounded border border-[#e5e7eb] dark:border-white/[0.1] bg-white dark:bg-white/[0.06] px-1 py-0.5 text-[9px] font-medium text-[#6b7280] dark:text-[#8b8fb5] leading-none">
                    ⌘K
                  </kbd>
                )}
              </div>

              {showDropdown && (
                <div
                  ref={dropdownRef}
                  className="absolute left-2 right-2 top-full mt-1 rounded-xl border border-[#e5e7eb] dark:border-white/[0.08] bg-white dark:bg-[#161938] overflow-hidden z-50"
                  style={{ boxShadow: "0 4px 12px rgba(10,12,16,0.08), 0 16px 32px rgba(10,12,16,0.1)" }}
                >
                  {results.map((item, idx) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => { setQuery(""); setIsSearchFocused(false); }}
                      className={clsx(
                        "flex flex-col px-3 py-2 transition-colors",
                        idx === selectedIndex
                          ? "bg-[#eeeeff] dark:bg-[#4242fa]/20"
                          : "hover:bg-[#f2f2f2] dark:hover:bg-white/[0.04]",
                      )}
                      onMouseEnter={() => setSelectedIndex(idx)}
                    >
                      <span className="text-xs font-medium text-[#0a0c10] dark:text-[#f5f5ff] leading-snug">{item.name}</span>
                      <span className="text-[10px] text-[#6b7280] dark:text-[#8b8fb5] truncate">{item.category.split("(")[0].trim()}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation */}
            <nav className="p-2 mt-2">
              <ul className="space-y-1">
                {NAV_LINKS.map(({ href, icon: Icon, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className={clsx(
                        "group relative flex items-center rounded-lg px-3 py-2.5 transition-all duration-150",
                        isActive(pathname, href)
                          ? "bg-[#4242fa]/10 dark:bg-[#6b6bff]/15 text-[#4242fa] dark:text-[#a5a8f0] font-semibold"
                          : "text-[#6b7280] dark:text-[#8b8fb5] hover:bg-[#f2f2f2] dark:hover:bg-white/[0.06] hover:text-[#0a0c10] dark:hover:text-[#c8caee]",
                      )}
                    >
                      <Icon className="size-5 shrink-0" />
                      <span className="ml-3 text-sm font-medium whitespace-nowrap">{label}</span>
                      {isActive(pathname, href) && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r bg-[#4242fa] dark:bg-[#6b6bff]" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Dark Mode toggle */}
          <div className="border-t border-[#e5e7eb] dark:border-white/[0.08] p-2">
            <button
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? "切換為亮色模式" : "切換為暗色模式"}
              className="group relative flex w-full items-center justify-center rounded-lg px-3 py-2.5 text-[#6b7280] dark:text-[#8b8fb5] hover:bg-[#f2f2f2] dark:hover:bg-white/[0.06] hover:text-[#0a0c10] dark:hover:text-[#c8caee] transition-colors"
            >
              {isDarkMode ? <Sun className="size-5 shrink-0" /> : <Moon className="size-5 shrink-0" />}
              <span className="ml-3 text-sm font-medium whitespace-nowrap">
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
