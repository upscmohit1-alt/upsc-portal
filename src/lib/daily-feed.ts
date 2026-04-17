export type DailyEntry = {
  date: string;
  label: string;
  currentAffairsTitle: string;
  mcqSetTitle: string;
};

export type DailyArticle = {
  id: string;
  date: string;
  heading: string;
  subject: string;
  paper: string;
  isPrelims: boolean;
  url: string;
};

const fallbackDailyEntries: DailyEntry[] = [
  {
    date: "2026-04-15",
    label: "15 Apr 2026",
    currentAffairsTitle: "RBI liquidity update, SC federal ruling, and NDC implementation signals",
    mcqSetTitle: "Daily 10 MCQs: Economy + Polity mixed practice",
  },
  {
    date: "2026-04-14",
    label: "14 Apr 2026",
    currentAffairsTitle: "India-EU digital trade talks and climate adaptation governance",
    mcqSetTitle: "Daily 10 MCQs: International Relations + Environment",
  },
  {
    date: "2026-04-13",
    label: "13 Apr 2026",
    currentAffairsTitle: "Gaganyaan safety milestone and state-federal constitutional developments",
    mcqSetTitle: "Daily 10 MCQs: Science & Tech + Polity",
  },
  {
    date: "2026-04-12",
    label: "12 Apr 2026",
    currentAffairsTitle: "Growth projections, fiscal outlook and social sector implementation",
    mcqSetTitle: "Daily 10 MCQs: Economy + Society",
  },
];

const fallbackDailyArticles: DailyArticle[] = [
  {
    id: "ca-2026-04-15-1",
    date: "2026-04-15",
    heading: "RBI shifts liquidity stance: transmission signals for credit and inflation",
    subject: "Economy",
    paper: "GS-III",
    isPrelims: true,
    url: "#",
  },
  {
    id: "ca-2026-04-15-2",
    date: "2026-04-15",
    heading: "Governor assent timeline and federal accountability after Supreme Court ruling",
    subject: "Polity",
    paper: "GS-II",
    isPrelims: false,
    url: "#",
  },
  {
    id: "ca-2026-04-15-3",
    date: "2026-04-15",
    heading: "NDC implementation gap: climate ambition versus state-level execution",
    subject: "Environment",
    paper: "GS-III",
    isPrelims: true,
    url: "#",
  },
  {
    id: "ca-2026-04-14-1",
    date: "2026-04-14",
    heading: "India-EU digital trade chapter: data flows, policy space and sovereignty",
    subject: "International Relations",
    paper: "GS-II",
    isPrelims: false,
    url: "#",
  },
  {
    id: "ca-2026-04-14-2",
    date: "2026-04-14",
    heading: "Climate adaptation finance for states: policy architecture and bottlenecks",
    subject: "Environment",
    paper: "GS-III",
    isPrelims: true,
    url: "#",
  },
];

type DailyEntryRow = {
  entry_date: string;
  label: string | null;
  current_affairs_title: string | null;
  mcq_set_title: string | null;
};

type DailyArticleRow = {
  id: string;
  entry_date: string;
  heading: string | null;
  subject: string | null;
  paper: string | null;
  is_prelims: boolean | null;
  article_url: string | null;
};

function mapRowToEntry(row: DailyEntryRow): DailyEntry {
  return {
    date: row.entry_date,
    label: row.label ?? row.entry_date,
    currentAffairsTitle: row.current_affairs_title ?? "No current affairs title available for this date.",
    mcqSetTitle: row.mcq_set_title ?? "No MCQ set title available for this date.",
  };
}

function mapRowToArticle(row: DailyArticleRow): DailyArticle {
  return {
    id: row.id,
    date: row.entry_date,
    heading: row.heading ?? "Untitled article",
    subject: row.subject ?? "General Studies",
    paper: row.paper ?? "GS",
    isPrelims: row.is_prelims ?? false,
    url: row.article_url ?? "#",
  };
}

async function fetchDailyEntriesFromSupabase(): Promise<DailyEntry[] | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const apiKey = supabaseServiceRoleKey || supabaseAnonKey;

  if (!supabaseUrl || !apiKey) {
    return null;
  }

  const query =
    "select=entry_date,label,current_affairs_title,mcq_set_title&published=eq.true&order=entry_date.desc&limit=60";
  const endpoint = `${supabaseUrl}/rest/v1/daily_entries?${query}`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const rows = (await response.json()) as DailyEntryRow[];
    if (!Array.isArray(rows) || rows.length === 0) return null;
    return rows.map(mapRowToEntry);
  } catch {
    return null;
  }
}

async function fetchDailyArticlesFromSupabase(date: string): Promise<DailyArticle[] | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const apiKey = supabaseServiceRoleKey || supabaseAnonKey;

  if (!supabaseUrl || !apiKey) {
    return null;
  }

  const query = [
    "select=id,entry_date,heading,subject,paper,is_prelims,article_url",
    `entry_date=eq.${date}`,
    "published=eq.true",
    "order=created_at.asc",
    "limit=60",
  ].join("&");
  const endpoint = `${supabaseUrl}/rest/v1/daily_articles?${query}`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const rows = (await response.json()) as DailyArticleRow[];
    if (!Array.isArray(rows) || rows.length === 0) return null;
    return rows.map(mapRowToArticle);
  } catch {
    return null;
  }
}

export async function getDailyEntries(): Promise<DailyEntry[]> {
  const fromDb = await fetchDailyEntriesFromSupabase();
  return fromDb ?? fallbackDailyEntries;
}

export async function getEntryByDate(date: string): Promise<DailyEntry | undefined> {
  const entries = await getDailyEntries();
  return entries.find((item) => item.date === date);
}

export async function getArticlesByDate(date: string): Promise<DailyArticle[]> {
  const fromDb = await fetchDailyArticlesFromSupabase(date);
  if (fromDb) return fromDb;
  return fallbackDailyArticles.filter((item) => item.date === date);
}
