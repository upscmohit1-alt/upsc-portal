const tickerItems = [
  "RBI reduces repo rate by 25bps to 6.25% — implications for monetary policy",
  "Supreme Court upholds validity of Electoral Bonds scheme with conditions",
  "India's GDP growth projected at 7.2% for FY2025-26 by IMF",
  "ISRO's GSAT-20 satellite successfully launched from Florida",
  "New Forest Conservation Rules 2024 — key changes and criticisms",
];

export default function Ticker() {
  const loop = [...tickerItems, ...tickerItems];
  return (
    <div className="relative overflow-hidden bg-blackish py-2">
      <div className="animate-[ticker_40s_linear_infinite] whitespace-nowrap">
        {loop.map((item, index) => (
          <span key={`${item}-${index}`} className="inline-flex items-center gap-2 px-8 text-xs text-white/75">
            {index % 5 === 0 ? (
              <span className="rounded-sm bg-red px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                New
              </span>
            ) : (
              <span className="h-1 w-1 rounded-full bg-saffron" />
            )}
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
