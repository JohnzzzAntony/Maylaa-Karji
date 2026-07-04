"use client";

type Brand = { id: string; name: string; slug: string; country: string; description: string; logoColor: string };

export function BrandMarquee({ brands }: { brands: Brand[] }) {
  const doubled = [...brands, ...brands, ...brands];
  return (
    <section className="overflow-hidden border-y border-border bg-cream/40 py-10">
      <div className="mb-6 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">The Houses We Curate</p>
        <h2 className="mt-1 font-serif text-2xl">A Maison for Every Story</h2>
      </div>
      <div className="relative">
        <div className="flex w-max animate-marquee items-center gap-12 hover:[animation-play-state:paused]">
          {doubled.map((b, i) => (
            <a
              key={`${b.id}-${i}`}
              href="#products"
              className="group flex shrink-0 items-center gap-3 transition"
            >
              <div
                className="grid h-12 w-12 place-items-center rounded-full border-2 transition group-hover:scale-110"
                style={{ borderColor: b.logoColor, color: b.logoColor }}
              >
                <span className="font-serif text-lg font-bold">{b.name.charAt(0)}</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-serif text-lg font-medium text-foreground transition group-hover:text-gold">{b.name}</span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{b.country}</span>
              </div>
            </a>
          ))}
        </div>
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-cream/60 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-cream/60 to-transparent" />
      </div>
    </section>
  );
}
