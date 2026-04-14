import HeroArticle from "@/components/HeroArticle";
import McqEngine from "@/components/McqEngine";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Ticker from "@/components/Ticker";

export default function HomePage() {
  return (
    <main>
      <Ticker />
      <Navbar />

      <div className="bg-blackish/85 py-2.5 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1240px] items-center gap-4 px-6">
          <span className="text-[11px] uppercase tracking-[0.1em] text-white/45">Sunday, 13 April 2025</span>
          <div className="h-3.5 w-px bg-white/15" />
          <div className="flex gap-1.5 overflow-hidden">
            {["🔥 Today's MCQs", "Prelims 2025 Analysis", "Download Free Notes", "NCERT Summaries"].map((item, index) => (
              <span
                key={item}
                className={`cursor-pointer whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] ${
                  index === 0
                    ? "border-saffron text-saffron"
                    : "border-white/15 text-white/65 hover:border-white/30 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1240px] px-6">
        <HeroArticle />
        <div className="grid gap-9 py-8 lg:grid-cols-[1fr_300px]">
          <McqEngine />
          <Sidebar />
        </div>
      </div>
    </main>
  );
}
