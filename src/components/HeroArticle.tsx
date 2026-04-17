import McqEngine from "@/components/McqEngine";
import { moreInNews } from "@/lib/news-links";

export default function HeroArticle() {
  return (
    <section className="pt-7">
      <div className="grid overflow-hidden rounded-md border border-borderTone/80 bg-[#f8f2e9]/85 backdrop-blur-md lg:grid-cols-[4fr_3fr]">
        <div className="border-r border-borderTone/80">
          <article className="group border-b border-borderTone/70 p-8">
            <p className="mb-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-red before:h-0.5 before:w-5 before:bg-red before:content-['']">
              Today&apos;s lead article
            </p>
            <h1 className="mb-3 cursor-pointer font-serif text-[2rem] font-bold leading-[1.2] text-blackish transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-red group-hover:drop-shadow-[0_6px_12px_rgba(192,57,43,0.18)]">
              RBI Liquidity Reset and India&apos;s Credit Pulse
            </h1>
            <p className="mb-5 max-w-2xl text-[14px] leading-[1.7] text-mid">
              RBI&apos;s liquidity pivot may reshape inflation control, bank lending rates, and growth expectations, making it vital for Prelims and GS-III answers.
            </p>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="rounded border border-blue/25 bg-blueLight px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-blue">
                GS Paper III
              </span>
              <span className="rounded border border-saffron/30 bg-saffronLight px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-saffron">
                Economy
              </span>
              <span className="rounded border border-borderTone bg-[#f2ebdf] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
                15 Apr 2026
              </span>
            </div>
            <button className="inline-flex items-center gap-2 rounded border border-blackish px-4 py-2 text-sm font-semibold hover:bg-blackish hover:text-white">
              Read full article →
            </button>
          </article>
          <section className="p-8">
            <div className="mb-3 flex items-center justify-between border-b border-borderTone/70 pb-2 text-[10px] uppercase tracking-[0.12em] text-muted">
              <span>More in news</span>
              <a href="#" className="text-[11px] font-semibold tracking-[0.05em] text-red">
                View all 25 →
              </a>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {moreInNews.map((item) => (
                <article
                  key={item.headline}
                  id={`news-${item.id}`}
                  className="group scroll-mt-28 rounded border border-borderTone bg-bgSoft/70 p-3 transition-colors hover:border-saffron"
                >
                  <p className="mb-2 text-[11px] font-semibold text-muted">{item.timestamp}</p>
                  <h3 className="min-h-[4.8rem] text-[13px] font-semibold leading-snug text-blackish [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden">
                    {item.headline}
                  </h3>
                  <div className="mt-2 hidden items-start gap-2 text-[12px] leading-[1.55] text-mid group-hover:flex">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-saffron" />
                    <p>{item.summary}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
        <aside className="p-5">
          <McqEngine compact />
        </aside>
      </div>
    </section>
  );
}
