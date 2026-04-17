import Link from "next/link";
import Navbar from "@/components/Navbar";
import Ticker from "@/components/Ticker";
import Footer from "@/components/Footer";
import { getEntryByDate } from "@/lib/daily-feed";

export default async function DailyMcqsDatePage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const entry = await getEntryByDate(date);

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
            <Link href="/daily-mcqs" className="text-xs font-semibold text-red">
              ← All days
            </Link>
          </div>
          <h1 className="font-serif text-3xl font-bold text-blackish">Daily MCQs — {entry?.label ?? date}</h1>
          <p className="mt-2 text-sm leading-[1.7] text-mid">
            {entry?.mcqSetTitle ??
              "No MCQ set found for this date yet. Please go back to day-wise listing and pick an available day."}
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
