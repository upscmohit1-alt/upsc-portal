import Footer from "@/components/Footer";
import HeroArticle from "@/components/HeroArticle";
import Navbar from "@/components/Navbar";
import PyqSection from "@/components/PyqSection";
import Sidebar from "@/components/Sidebar";
import Ticker from "@/components/Ticker";
import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <Ticker />
      <Navbar />

      <div className="border-y border-black/20 bg-[#1a1714] py-2.5 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center gap-4 px-6">
          <span className="text-[11px] uppercase tracking-[0.1em] text-white/65">Sunday, 13 April 2025</span>
          <div className="h-3.5 w-px bg-white/25" />
          <div className="flex items-center gap-2">
            <Link
              href="/daily-current-affairs"
              className="rounded border border-saffron/60 bg-saffron/15 px-2.5 py-1 text-[11px] font-semibold text-saffron hover:bg-saffron/25"
            >
              Daily Current Affairs
            </Link>
            <Link
              href="/daily-mcqs"
              className="rounded border border-blue/45 bg-blue/15 px-2.5 py-1 text-[11px] font-semibold text-blueLight hover:bg-blue/25"
            >
              Daily MCQs
            </Link>
          </div>
          <div className="flex gap-1.5 overflow-hidden">
            {["🔥 Today's MCQs", "Prelims 2025 Analysis", "Download Free Notes", "NCERT Summaries"].map((item, index) => (
              <span
                key={item}
                className={`cursor-pointer whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] ${
                  index === 0
                    ? "border-saffron text-saffron"
                    : "border-white/20 text-white/75 hover:border-white/35 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-6">
        <HeroArticle />
        <div className="mt-8 grid gap-9 border-t border-borderTone/70 pt-8 lg:grid-cols-[1fr_300px]">
          <div>
            <section className="rounded-md border border-borderTone/80 bg-[#f8f2e9]/85 p-8 backdrop-blur-md">
              <div className="mb-3 flex items-end justify-between border-b border-borderTone/70 pb-2.5">
                <h2 className="font-serif text-xl font-bold text-blackish">More in News</h2>
                <a className="text-xs font-semibold tracking-wide text-red" href="#">
                  Full archive →
                </a>
              </div>
              <p className="text-sm leading-[1.7] text-mid">
                Track the top policy, economy, environment and governance updates curated for quick revision. Each brief
                links to source-backed explainers and topic-wise MCQs.
              </p>
            </section>
            <PyqSection />
          </div>
          <Sidebar />
        </div>
      </div>
      <Footer />
    </main>
  );
}
