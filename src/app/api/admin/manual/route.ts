import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  const { text, category } = await request.json()

  await supabase.from('story_clusters').insert({
    headline: text.slice(0, 100),
    summary: text.slice(0, 300),
    category,
    gs_paper: category === 'mains' ? 'GS2' : 'GS1',
    sources: ['Manual'],
    urls: [],
    combined_content: text,
    relevance_score: 10,
    status: 'pending',
    is_manual: true
  })

  return NextResponse.json({ success: true })
}