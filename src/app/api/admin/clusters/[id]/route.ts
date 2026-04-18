import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import Anthropic from '@anthropic-ai/sdk'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { action, contentType } = await request.json()
  const { id } = params

  if (action === 'rejected') {
    await supabase.from('story_clusters').update({ status: 'rejected' }).eq('id', id)
    return NextResponse.json({ success: true })
  }

  if (action === 'approved') {
    await supabase.from('story_clusters').update({ status: 'approved' }).eq('id', id)
    const { data: cluster } = await supabase.from('story_clusters').select('*').eq('id', id).single()
    if (cluster) generateContent(cluster, contentType)
  }

  return NextResponse.json({ success: true })
}

async function generateContent(cluster: {
  id: string
  headline: string
  combined_content: string
  category: string
  gs_paper: string
}, contentType: string) {
  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

    // Fetch the right prompt from Supabase
    const { data: promptRow } = await supabase
      .from('prompts')
      .select('prompt_text')
      .eq('content_type', contentType)
      .single()

    const promptText = promptRow?.prompt_text || 'Write a UPSC article in English based on this news. Respond with JSON: {"daily_news": "article", "mcqs": []}'

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: `${promptText}

News Story:
${cluster.combined_content}

GS Paper: ${cluster.gs_paper}`
      }]
    })

    const raw = response.content[0].type === 'text' ? response.content[0].text : ''
    const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim())

    await supabase.from('content_drafts').insert({
      cluster_id: cluster.id,
      daily_news: parsed.daily_news,
      mcqs: parsed.mcqs,
      type: contentType,
      status: 'pending'
    })
  } catch (err) {
    console.error('Content generation failed:', err)
  }
}