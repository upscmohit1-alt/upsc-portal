export type NewsItem = {
  id: string;
  headline: string;
  timestamp: string;
  summary: string;
};

export const moreInNews: NewsItem[] = [
  {
    id: "governor-assent-ruling",
    headline: "Supreme Court limits Governor's discretionary powers and clarifies assent timeline under Article 200",
    timestamp: "2 hours ago",
    summary: "Ruling strengthens cooperative federalism by reducing executive delays in state legislation assent.",
  },
  {
    id: "ndc-2035-implementation",
    headline: "India's updated NDC 2035 targets trigger debate on policy ambition versus ground-level implementation readiness",
    timestamp: "4 hours ago",
    summary: "Focus remains on financing, state capacity, and sector-specific compliance pathways.",
  },
  {
    id: "india-eu-digital-trade",
    headline: "India-EU digital trade chapter enters critical phase around data flows and regulatory sovereignty concerns",
    timestamp: "6 hours ago",
    summary: "Negotiations may shape long-term digital governance space for emerging economies.",
  },
  {
    id: "gaganyaan-safety-milestone",
    headline: "Gaganyaan abort test validates crew safety framework ahead of India's human spaceflight milestones",
    timestamp: "8 hours ago",
    summary: "Crew escape architecture clears one of the core mission-risk checkpoints.",
  },
  {
    id: "rbi-liquidity-signals",
    headline: "RBI liquidity corridor communication shifts market expectations on short-term rates and credit signalling",
    timestamp: "10 hours ago",
    summary: "Bond yields and transmission channels react to revised liquidity stance.",
  },
  {
    id: "urban-heat-action",
    headline: "Urban heat action plans receive renewed policy urgency amid extreme temperature advisories across states",
    timestamp: "12 hours ago",
    summary: "Preparedness gaps in local governance and health systems remain visible.",
  },
];
