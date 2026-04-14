const sideItems = [
  "Supreme Court limits Governor's discretionary powers — Art. 163 reinterpreted",
  "India's updated NDC 2035 targets — ambition vs. implementation gap",
  "India-EU FTA digital trade chapter — data flows and e-commerce rules",
  "ISRO Gaganyaan abort mission — human spaceflight safety milestones",
];

export default function HeroArticle() {
  return (
    <section className="pt-7">
      <div className="grid overflow-hidden rounded-md border border-borderTone/80 bg-white/75 backdrop-blur-md lg:grid-cols-[1fr_340px]">
        <article className="border-r border-borderTone p-8">
          <p className="mb-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-red before:h-0.5 before:w-5 before:bg-red before:content-['']">
            Today&apos;s lead article
          </p>
          <h1 className="mb-3 font-serif text-3xl font-bold leading-[1.28] text-blackish">
            RBI&apos;s Liquidity Framework Overhaul — What It Means for Monetary Transmission and the Indian Economy
          </h1>
          <p className="mb-5 text-[15px] leading-relaxed text-mid">
            The Reserve Bank of India&apos;s shift from a deficit to a neutral liquidity stance marks a decisive pivot in
            central banking. For UPSC aspirants, understanding the cascade effects on credit growth, inflation
            targeting, and bank lending rates is essential.
          </p>
          <button className="inline-flex items-center gap-2 rounded border border-blackish px-4 py-2 text-sm font-semibold hover:bg-blackish hover:text-white">
            Read full article →
          </button>
        </article>
        <aside>
          <div className="flex items-center justify-between border-b border-borderTone px-5 py-3 text-[10px] uppercase tracking-[0.12em] text-muted">
            <span>More today</span>
            <a href="#" className="text-[11px] font-semibold tracking-[0.05em] text-red">
              View all 25 →
            </a>
          </div>
          {sideItems.map((item, index) => (
            <div key={item} className="flex gap-3 border-b border-borderTone px-5 py-3.5 last:border-b-0 hover:bg-bgSoft">
              <div className="font-serif text-2xl font-bold leading-none text-[#ede9e2]">{`0${index + 2}`}</div>
              <p className="text-[13px] font-semibold leading-snug text-blackish">{item}</p>
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}
