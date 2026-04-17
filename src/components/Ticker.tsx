"use client";

import { moreInNews } from "@/lib/news-links";

export default function Ticker() {
  const tickerItems = moreInNews.slice(0, 5);
  const loop = [...tickerItems, ...tickerItems];

  const jumpToNews = (id: string) => {
    const target = document.getElementById(`news-${id}`);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.classList.remove("news-flash");
    window.setTimeout(() => target.classList.add("news-flash"), 120);
    window.setTimeout(() => target.classList.remove("news-flash"), 1400);
  };

  return (
    <div className="relative overflow-hidden bg-blackish py-2">
      <div className="animate-[ticker_40s_linear_infinite] whitespace-nowrap">
        {loop.map((item, index) => (
          <button
            key={`${item.id}-${index}`}
            type="button"
            onClick={() => jumpToNews(item.id)}
            className="inline-flex items-center gap-2 px-8 text-xs text-white/75 transition-colors hover:text-white"
          >
            {index % 5 === 0 ? (
              <span className="rounded-sm bg-red px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                New
              </span>
            ) : (
              <span className="h-1 w-1 rounded-full bg-saffron" />
            )}
            {item.headline}
          </button>
        ))}
      </div>
    </div>
  );
}
