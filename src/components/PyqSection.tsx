import { Globe2, Landmark, Leaf, Microscope, ScrollText, TrendingUp } from "lucide-react";

const subjects = [
  { name: "Polity", icon: Landmark, count: "180 PYQs", tone: "text-blue bg-blueLight border-blue/25" },
  { name: "Economy", icon: TrendingUp, count: "165 PYQs", tone: "text-saffron bg-saffronLight border-saffron/25" },
  { name: "Environment", icon: Leaf, count: "140 PYQs", tone: "text-green bg-greenLight border-green/25" },
  { name: "History", icon: ScrollText, count: "210 PYQs", tone: "text-red bg-redLight border-red/25" },
  { name: "Geography", icon: Globe2, count: "155 PYQs", tone: "text-[#1a5f7a] bg-[#e8f4f8] border-[#1a5f7a]/25" },
  { name: "Science & Tech", icon: Microscope, count: "120 PYQs", tone: "text-teal bg-tealLight border-teal/25" },
];

const pyqItems = [
  {
    year: "2024",
    subject: "Economy",
    text: "Open Market Operations by RBI are best described as buying/selling of government securities to influence system liquidity.",
  },
  {
    year: "2023",
    subject: "Polity",
    text: "Governor reserving a Bill for President's consideration under Article 200 and implications for cooperative federalism.",
  },
  {
    year: "2022",
    subject: "Environment",
    text: "NDC commitments: difference between emission intensity reduction and absolute emission reduction targets.",
  },
  {
    year: "2021",
    subject: "Science & Tech",
    text: "Crew escape systems and launch abort protocols in human spaceflight programmes.",
  },
];

export default function PyqSection() {
  return (
    <section className="mt-6 rounded-md border border-borderTone/80 bg-[#f8f2e9]/85 p-8 backdrop-blur-md">
      <div className="mb-4 flex items-end justify-between border-b border-borderTone/70 pb-2.5">
        <h2 className="font-serif text-xl font-bold text-blackish">Detailed PYQ Section</h2>
        <a className="text-xs font-semibold tracking-wide text-red" href="#">
          View full PYQ bank →
        </a>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => {
          const Icon = subject.icon;
          return (
            <button
              key={subject.name}
              className={`flex items-center gap-2 rounded border px-3 py-2 text-left transition hover:border-blackish/50 ${subject.tone}`}
            >
              <Icon className="h-4 w-4" />
              <div>
                <p className="text-sm font-semibold">{subject.name}</p>
                <p className="text-[11px] opacity-80">{subject.count}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-5 space-y-2">
        {pyqItems.map((item) => (
          <article
            key={`${item.year}-${item.subject}`}
            className="rounded border border-borderTone/70 bg-bgSoft/80 px-4 py-3"
          >
            <div className="mb-1 flex items-center gap-2">
              <span className="rounded border border-borderTone bg-[#f2ebdf] px-2 py-0.5 text-[10px] font-semibold text-muted">
                {item.year}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-mid">{item.subject}</span>
            </div>
            <p className="text-sm leading-[1.7] text-blackish">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
