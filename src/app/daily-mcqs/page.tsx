import Link from "next/link";
import Navbar from "@/components/Navbar";
import Ticker from "@/components/Ticker";
import Footer from "@/components/Footer";
import { getDailyEntries } from "@/lib/daily-feed";

export default async function DailyMcqsPage() {
  const dailyEntries = await getDailyEntries();

  return (
    <main>
      <Ticker />
      <Navbar />
      <section className="mx-auto max-w-[1200px] px-6 py-8">
        <div className="rounded-md border border-borderTone/80 bg-[#f8f2e9]/85 p-8 backdrop-blur-md">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-red">Practice Hub</p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-blackish">Daily MCQs — Day Wise</h1>
          <p className="mt-2 text-sm text-mid">
            Select the date button to open that day&apos;s MCQ set and practice subject-tagged questions in exam format.
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {dailyEntries.map((entry) => (
            <Link
              key={entry.date}
              href={`/daily-mcqs/${entry.date}`}
              className="rounded-md border border-borderTone/80 bg-[#f8f2e9]/85 p-4 transition hover:border-blackish/50 hover:bg-[#f4ebdf]"
            >
              <span className="inline-flex rounded border border-borderTone bg-[#efe6d8] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
                {entry.label}
              </span>
              <p className="mt-2 font-serif text-lg font-bold text-blackish">Open {entry.label} MCQ Set</p>
              <p className="mt-1 text-sm text-mid">{entry.mcqSetTitle}</p>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
