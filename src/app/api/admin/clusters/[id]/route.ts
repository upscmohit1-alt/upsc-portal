import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { action } = await request.json()
  const { id } = params

  await supabase.from('story_clusters').update({ status: action }).eq('id', id)

  if (action === 'approved') {
    const { data: cluster } = await supabase.from('story_clusters').select('*').eq('id', id).single()
    if (cluster) {
      generateContent(cluster) // fire and forget
    }
  }

  return NextResponse.json({ success: true })
}

async function generateContent(cluster: any) {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: `You are a UPSC content expert. Based on this news story, create:
1. A structured daily news article for UPSC aspirants (400-500 words) with sections: What Happened, Background, Significance for UPSC, Key Facts to Remember
2. Exactly 5 MCQs with 4 options each, correct answer index (0-3), and explanation

News Story:
${cluster.combined_content}

Category: ${cluster.category}
GS Paper: ${cluster.gs_paper}

Respond ONLY with this JSON (no other text):
{
  "daily_news": "full article text here",
  "mcqs": [
    {
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correct_index": 0,
      "explanation": "..."
    }
  ]
}`
      }]
    })

    const raw = response.content[0].type === 'text' ? response.content[0].text : ''
    const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim())

    await supabase.from('content_drafts').insert({
      cluster_id: cluster.id,
      daily_news: parsed.daily_news,
      mcqs: parsed.mcqs,
      type: cluster.category,
      status: 'pending'
    })
  } catch (err) {
    console.error('Content generation failed:', err)
  }
}