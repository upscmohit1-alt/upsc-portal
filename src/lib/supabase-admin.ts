type JsonRecord = Record<string, unknown>;

function getSupabaseAdminConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return { url, serviceRoleKey };
}

export async function callSupabaseRpc<T>(fnName: string, args: JsonRecord): Promise<T> {
  const { url, serviceRoleKey } = getSupabaseAdminConfig();
  const endpoint = `${url}/rest/v1/rpc/${fnName}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
    body: JSON.stringify(args),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`RPC ${fnName} failed: ${text}`);
  }

  return (await response.json()) as T;
}

export async function fetchAdminDailyEntries() {
  const { url, serviceRoleKey } = getSupabaseAdminConfig();
  const endpoint =
    `${url}/rest/v1/daily_entries?` +
    "select=entry_date,label,published,updated_at&order=entry_date.desc&limit=20";

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Fetching admin daily entries failed: ${text}`);
  }

  return (await response.json()) as Array<{
    entry_date: string;
    label: string;
    published: boolean;
    updated_at: string;
  }>;
}
