"use client";

import { FormEvent, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Ticker from "@/components/Ticker";
import Footer from "@/components/Footer";

type EntryRow = {
  entry_date: string;
  label: string;
  published: boolean;
  updated_at: string;
};

async function runAdminAction(body: unknown) {
  const response = await fetch("/api/admin/daily", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok || !data.ok) {
    throw new Error(data.error ?? "Action failed");
  }
}

export default function AdminDailyPage() {
  const [entries, setEntries] = useState<EntryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>("");

  const [entryDate, setEntryDate] = useState("");
  const [entryLabel, setEntryLabel] = useState("");
  const [currentAffairsTitle, setCurrentAffairsTitle] = useState("");
  const [mcqSetTitle, setMcqSetTitle] = useState("");

  const [articleDate, setArticleDate] = useState("");
  const [articleHeading, setArticleHeading] = useState("");
  const [articleSubject, setArticleSubject] = useState("Economy");
  const [articlePaper, setArticlePaper] = useState("GS-III");
  const [articleIsPrelims, setArticleIsPrelims] = useState(false);
  const [articleUrl, setArticleUrl] = useState("#");

  const [cloneFromDate, setCloneFromDate] = useState("");
  const [cloneToDate, setCloneToDate] = useState("");

  const [publishDate, setPublishDate] = useState("");
  const [publishState, setPublishState] = useState(true);

  const loadEntries = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/daily", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error ?? "Failed to fetch entries");
      setEntries(data.entries);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadEntries();
  }, []);

  const run = async (task: () => Promise<void>, success: string) => {
    setMessage("");
    try {
      await task();
      setMessage(success);
      await loadEntries();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unknown error");
    }
  };

  const onCreateDraft = async (event: FormEvent) => {
    event.preventDefault();
    await run(
      () =>
        runAdminAction({
          action: "upsertEntryDraft",
          payload: {
            entryDate,
            label: entryLabel,
            currentAffairsTitle,
            mcqSetTitle,
          },
        }),
      "Draft day entry saved."
    );
  };

  const onAddArticle = async (event: FormEvent) => {
    event.preventDefault();
    await run(
      () =>
        runAdminAction({
          action: "addArticleDraft",
          payload: {
            entryDate: articleDate,
            heading: articleHeading,
            subject: articleSubject,
            paper: articlePaper,
            isPrelims: articleIsPrelims,
            articleUrl,
          },
        }),
      "Draft article added."
    );
  };

  const onClonePack = async (event: FormEvent) => {
    event.preventDefault();
    await run(
      () =>
        runAdminAction({
          action: "cloneDailyPack",
          payload: { fromDate: cloneFromDate, toDate: cloneToDate },
        }),
      "Daily pack cloned."
    );
  };

  const onPublishPack = async (event: FormEvent) => {
    event.preventDefault();
    await run(
      () =>
        runAdminAction({
          action: "publishDailyPack",
          payload: { entryDate: publishDate, publish: publishState },
        }),
      publishState ? "Day published." : "Day unpublished."
    );
  };

  return (
    <main>
      <Ticker />
      <Navbar />
      <section className="mx-auto max-w-[1200px] px-6 py-8">
        <div className="rounded-md border border-borderTone/80 bg-[#f8f2e9]/85 p-8 backdrop-blur-md">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-red">Admin Console</p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-blackish">Daily Content Admin</h1>
          <p className="mt-2 text-sm text-mid">
            Create draft day entries, add articles, clone yesterday&apos;s pack, then publish/unpublish.
          </p>
          {message ? <p className="mt-3 text-sm font-semibold text-blue">{message}</p> : null}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <form onSubmit={onCreateDraft} className="rounded-md border border-borderTone/80 bg-[#f8f2e9]/85 p-4">
            <h2 className="mb-3 font-serif text-xl font-bold text-blackish">1) Draft Day Entry</h2>
            <div className="space-y-2">
              <input value={entryDate} onChange={(e) => setEntryDate(e.target.value)} placeholder="YYYY-MM-DD" className="w-full rounded border border-borderTone bg-bgSoft px-3 py-2 text-sm" />
              <input value={entryLabel} onChange={(e) => setEntryLabel(e.target.value)} placeholder="Label (e.g., 16 Apr 2026)" className="w-full rounded border border-borderTone bg-bgSoft px-3 py-2 text-sm" />
              <input value={currentAffairsTitle} onChange={(e) => setCurrentAffairsTitle(e.target.value)} placeholder="Current affairs day title" className="w-full rounded border border-borderTone bg-bgSoft px-3 py-2 text-sm" />
              <input value={mcqSetTitle} onChange={(e) => setMcqSetTitle(e.target.value)} placeholder="MCQ day title" className="w-full rounded border border-borderTone bg-bgSoft px-3 py-2 text-sm" />
            </div>
            <button className="mt-3 rounded border border-blackish px-3 py-2 text-sm font-semibold hover:bg-blackish hover:text-white">
              Save Draft Entry
            </button>
          </form>

          <form onSubmit={onAddArticle} className="rounded-md border border-borderTone/80 bg-[#f8f2e9]/85 p-4">
            <h2 className="mb-3 font-serif text-xl font-bold text-blackish">2) Add Draft Article</h2>
            <div className="space-y-2">
              <input value={articleDate} onChange={(e) => setArticleDate(e.target.value)} placeholder="YYYY-MM-DD" className="w-full rounded border border-borderTone bg-bgSoft px-3 py-2 text-sm" />
              <input value={articleHeading} onChange={(e) => setArticleHeading(e.target.value)} placeholder="Article heading" className="w-full rounded border border-borderTone bg-bgSoft px-3 py-2 text-sm" />
              <div className="grid grid-cols-2 gap-2">
                <input value={articleSubject} onChange={(e) => setArticleSubject(e.target.value)} placeholder="Subject" className="w-full rounded border border-borderTone bg-bgSoft px-3 py-2 text-sm" />
                <input value={articlePaper} onChange={(e) => setArticlePaper(e.target.value)} placeholder="Paper (e.g., GS-II)" className="w-full rounded border border-borderTone bg-bgSoft px-3 py-2 text-sm" />
              </div>
              <input value={articleUrl} onChange={(e) => setArticleUrl(e.target.value)} placeholder="Article URL" className="w-full rounded border border-borderTone bg-bgSoft px-3 py-2 text-sm" />
              <label className="inline-flex items-center gap-2 text-sm text-mid">
                <input type="checkbox" checked={articleIsPrelims} onChange={(e) => setArticleIsPrelims(e.target.checked)} />
                Mark as Prelims
              </label>
            </div>
            <button className="mt-3 rounded border border-blackish px-3 py-2 text-sm font-semibold hover:bg-blackish hover:text-white">
              Add Draft Article
            </button>
          </form>

          <form onSubmit={onClonePack} className="rounded-md border border-borderTone/80 bg-[#f8f2e9]/85 p-4">
            <h2 className="mb-3 font-serif text-xl font-bold text-blackish">3) Clone Day Pack</h2>
            <div className="space-y-2">
              <input value={cloneFromDate} onChange={(e) => setCloneFromDate(e.target.value)} placeholder="From date (YYYY-MM-DD)" className="w-full rounded border border-borderTone bg-bgSoft px-3 py-2 text-sm" />
              <input value={cloneToDate} onChange={(e) => setCloneToDate(e.target.value)} placeholder="To date (YYYY-MM-DD)" className="w-full rounded border border-borderTone bg-bgSoft px-3 py-2 text-sm" />
            </div>
            <button className="mt-3 rounded border border-blackish px-3 py-2 text-sm font-semibold hover:bg-blackish hover:text-white">
              Clone Pack
            </button>
          </form>

          <form onSubmit={onPublishPack} className="rounded-md border border-borderTone/80 bg-[#f8f2e9]/85 p-4">
            <h2 className="mb-3 font-serif text-xl font-bold text-blackish">4) Publish Toggle</h2>
            <div className="space-y-2">
              <input value={publishDate} onChange={(e) => setPublishDate(e.target.value)} placeholder="Date (YYYY-MM-DD)" className="w-full rounded border border-borderTone bg-bgSoft px-3 py-2 text-sm" />
              <label className="inline-flex items-center gap-2 text-sm text-mid">
                <input type="checkbox" checked={publishState} onChange={(e) => setPublishState(e.target.checked)} />
                Publish this day
              </label>
            </div>
            <button className="mt-3 rounded border border-blackish px-3 py-2 text-sm font-semibold hover:bg-blackish hover:text-white">
              Save Publish State
            </button>
          </form>
        </div>

        <div className="mt-6 rounded-md border border-borderTone/80 bg-[#f8f2e9]/85 p-4">
          <div className="mb-2 flex items-center justify-between border-b border-borderTone/70 pb-2">
            <h2 className="font-serif text-xl font-bold text-blackish">Recent Day Status</h2>
            <button
              onClick={() => void loadEntries()}
              className="rounded border border-borderTone px-2.5 py-1 text-xs font-semibold text-mid hover:border-blackish hover:text-blackish"
            >
              Refresh
            </button>
          </div>
          {loading ? (
            <p className="text-sm text-mid">Loading entries...</p>
          ) : (
            <div className="space-y-2">
              {entries.map((entry) => (
                <div key={entry.entry_date} className="flex items-center justify-between rounded border border-borderTone/70 bg-bgSoft/80 px-3 py-2 text-sm">
                  <div>
                    <p className="font-semibold text-blackish">{entry.label}</p>
                    <p className="text-xs text-mid">{entry.entry_date}</p>
                  </div>
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-semibold ${
                      entry.published ? "bg-greenLight text-green" : "bg-[#efe6d8] text-muted"
                    }`}
                  >
                    {entry.published ? "Published" : "Draft"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
