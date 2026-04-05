export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Dark hero header — JoshWComeau brand dark section */}
      <header
        className="w-full py-20 px-8"
        style={{ background: "linear-gradient(135deg, #0d0f32 60%, #1a1050 100%)" }}
      >
        <div className="content-wrapper">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#6b6bff] mb-3">
            Frontend Engineer
          </p>
          <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold leading-tight text-white mb-5">
            關於我
          </h1>
          <p className="text-lg text-[#c8caee] max-w-2xl leading-relaxed">
            專注於 React / Next.js 系統架構，擅長運用 Config-driven Pattern 提升組件複用性。
          </p>
        </div>
      </header>

      {/* Body content */}
      <div className="content-wrapper py-16">
        <section className="prose max-w-none">
          <p className="text-xl leading-relaxed text-[var(--foreground)]">
            持續深耕前端工程，從元件設計到系統整合，致力於打造高品質、可維護的使用者體驗。
          </p>
        </section>
      </div>
    </main>
  );
}
