import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { action } = await request.json()
  const { id } = params

  if (action === 'approved') {
    const { data: draft } = await supabase.from('content_drafts').select('*, story_clusters(*)').eq('id', id).single()

    if (draft) {
      const slug = draft.story_clusters.headline.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60) + '-' + Date.now()
      await supabase.from('published_posts').insert({
        draft_id: id,
        cluster_id: draft.cluster_id,
        title: draft.story_clusters.headline,
        daily_news: draft.daily_news,
        mcqs: draft.mcqs,
        category: draft.type,
        gs_paper: draft.story_clusters.gs_paper,
        sources: draft.story_clusters.sources,
        slug
      })
      await supabase.from('content_drafts').update({ status: 'approved', published_at: new Date().toISOString() }).eq('id', id)
    }
  } else {
    await supabase.from('content_drafts').update({ status: 'rejected' }).eq('id', id)
  }

  return NextResponse.json({ success: true })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { daily_news, mcqs } = await request.json()
  await supabase.from('content_drafts')
    .update({ daily_news, mcqs })
    .eq('id', params.id)
  return NextResponse.json({ success: true })
}