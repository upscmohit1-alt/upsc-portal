import { NextResponse } from "next/server";
import { callSupabaseRpc, fetchAdminDailyEntries } from "@/lib/supabase-admin";

type AdminAction =
  | {
      action: "upsertEntryDraft";
      payload: {
        entryDate: string;
        label: string;
        currentAffairsTitle: string;
        mcqSetTitle: string;
      };
    }
  | {
      action: "addArticleDraft";
      payload: {
        entryDate: string;
        heading: string;
        subject: string;
        paper: string;
        isPrelims: boolean;
        articleUrl: string;
      };
    }
  | {
      action: "cloneDailyPack";
      payload: {
        fromDate: string;
        toDate: string;
      };
    }
  | {
      action: "publishDailyPack";
      payload: {
        entryDate: string;
        publish: boolean;
      };
    };

export async function GET() {
  try {
    const entries = await fetchAdminDailyEntries();
    return NextResponse.json({ ok: true, entries });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AdminAction;

    switch (body.action) {
      case "upsertEntryDraft": {
        const p = body.payload;
        await callSupabaseRpc("upsert_daily_entry_draft", {
          p_entry_date: p.entryDate,
          p_label: p.label,
          p_current_affairs_title: p.currentAffairsTitle,
          p_mcq_set_title: p.mcqSetTitle,
        });
        return NextResponse.json({ ok: true });
      }
      case "addArticleDraft": {
        const p = body.payload;
        await callSupabaseRpc("add_daily_article_draft", {
          p_entry_date: p.entryDate,
          p_heading: p.heading,
          p_subject: p.subject,
          p_paper: p.paper,
          p_is_prelims: p.isPrelims,
          p_article_url: p.articleUrl,
        });
        return NextResponse.json({ ok: true });
      }
      case "cloneDailyPack": {
        const p = body.payload;
        await callSupabaseRpc("clone_daily_pack", {
          p_from_date: p.fromDate,
          p_to_date: p.toDate,
        });
        return NextResponse.json({ ok: true });
      }
      case "publishDailyPack": {
        const p = body.payload;
        await callSupabaseRpc("publish_daily_pack", {
          p_entry_date: p.entryDate,
          p_publish: p.publish,
        });
        return NextResponse.json({ ok: true });
      }
      default:
        return NextResponse.json({ ok: false, error: "Unsupported action" }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
