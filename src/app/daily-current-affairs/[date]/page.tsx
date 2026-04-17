import Link from "next/link";
import Navbar from "@/components/Navbar";
import Ticker from "@/components/Ticker";
import Footer from "@/components/Footer";
import { getArticlesByDate, getEntryByDate } from "@/lib/daily-feed";

export default async function DailyCurrentAffairsDatePage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const entry = await getEntryByDate(date);
  const articles = await getArticlesByDate(date);

  return (
    <main>
      <Ticker />
      <Navbar />
      <section className="mx-auto max-w-[1200px] px-6 py-8">
        <div className="rounded-md border border-borderTone/80 bg-[#f8f2e9]/85 p-8 backdrop-blur-md">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded border border-borderTone bg-[#efe6d8] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
              {entry?.label ?? date}
            </span>
            <Link href="/daily-current-affairs" className="text-xs font-semibold text-red">
              ← All days
            </Link>
          </div>
          <h1 className="font-serif text-3xl font-bold text-blackish">Current Affairs — {entry?.label ?? date}</h1>
          <p className="mt-2 text-sm leading-[1.7] text-mid">
            {entry?.currentAffairsTitle ??
              "No entry found for this date yet. Please return to day-wise listing and choose a published date."}
          </p>
        </div>

        <div className="mt-5 rounded-md border border-borderTone/80 bg-[#f8f2e9]/85 p-8 backdrop-blur-md">
          <div className="mb-3 flex items-center justify-between border-b border-borderTone/70 pb-2.5">
            <h2 className="font-serif text-xl font-bold text-blackish">Articles of the Day</h2>
            <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
              {articles.length} items
            </span>
          </div>

          {articles.length === 0 ? (
            <p className="text-sm text-mid">No articles published for this date yet.</p>
          ) : (
            <div className="space-y-2.5">
              {articles.map((article) => (
                <a
                  key={article.id}
                  href={article.url}
                  className="block rounded-md border border-borderTone/80 bg-bgSoft/80 p-4 transition hover:-translate-y-0.5 hover:border-blackish/40 hover:shadow-[0_8px_20px_rgba(17,16,16,0.08)]"
                >
                  <p className="font-serif text-lg font-bold leading-snug text-blackish">{article.heading}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded border border-saffron/30 bg-saffronLight px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-saffron">
                      {article.subject}
                    </span>
                    <span className="rounded border border-blue/25 bg-blueLight px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-blue">
                      {article.paper}
                    </span>
                    {article.isPrelims ? (
                      <span className="rounded border border-green/25 bg-greenLight px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-green">
                        Prelims
                      </span>
                    ) : null}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
