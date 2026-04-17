import { Upload } from "@/components/ui/upload";
import GamificationAnalytics from "@/components/GamificationAnalytics";

export default function Sidebar() {
  return (
    <aside className="space-y-6">
      <div className="overflow-hidden rounded border border-white/20 bg-white/40 shadow-xl backdrop-blur-md">
        <div className="border-b border-borderTone bg-bg2 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
          My Progress
        </div>
        <div className="p-4">
          <div className="mb-4 grid grid-cols-2 gap-2.5">
            <div className="rounded border border-borderTone bg-bgSoft p-2 text-center">
              <p className="font-serif text-2xl font-bold text-blackish">68%</p>
              <p className="text-xs font-semibold text-green">↑ 4% this week</p>
              <p className="text-[10px] text-muted">Accuracy</p>
            </div>
            <div className="rounded border border-borderTone bg-bgSoft p-2 text-center">
              <p className="font-serif text-2xl font-bold text-blackish">142</p>
              <p className="text-xs font-semibold text-green">↑ 12 today</p>
              <p className="text-[10px] text-muted">MCQs done</p>
            </div>
          </div>
          <div className="space-y-2">
            {[
              ["Environment", "82%", "bg-green"],
              ["Polity", "74%", "bg-blue"],
              ["Economy", "58%", "bg-saffron"],
              ["Sci & Tech", "45%", "bg-teal"],
            ].map(([subject, pct, bar]) => (
              <div key={subject}>
                <div className="mb-1 flex justify-between text-xs text-mid">
                  <span>{subject}</span>
                  <span>{pct}</span>
                </div>
                <div className="h-1 overflow-hidden rounded bg-[#ede9e2]">
                  <div className={`h-full ${bar}`} style={{ width: pct }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <GamificationAnalytics />

      <div className="rounded border border-white/20 bg-white/40 p-4 text-center shadow-xl backdrop-blur-md">
        <h3 className="font-serif text-lg font-bold text-blackish">Daily Current Affairs</h3>
        <p className="mb-3 mt-1 text-xs text-mid">Get today&apos;s articles + MCQs in your inbox every morning.</p>
        <input className="mb-2 w-full rounded border border-white/25 bg-white/40 px-3 py-2 text-sm text-blackish placeholder:text-muted" placeholder="Your email address" />
        <button className="w-full rounded bg-saffron px-3 py-2 text-sm font-semibold text-white hover:bg-[#c06a20]">
          Subscribe — It&apos;s Free
        </button>
      </div>

      <div className="overflow-hidden rounded border border-white/20 bg-white/40 shadow-xl backdrop-blur-md">
        <div className="border-b border-borderTone bg-bg2 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
          Mains Answer Upload
        </div>
        <div className="p-4">
          <p className="mb-3 text-xs text-mid">
            Upload your handwritten mains answer for AI-based evaluation (placeholder flow).
          </p>
          <Upload />
        </div>
      </div>
    </aside>
  );
}
