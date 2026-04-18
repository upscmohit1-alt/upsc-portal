import { NextResponse } from 'next/server'
import Parser from 'rss-parser'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '@/lib/supabase'

const parser = new Parser()

const RSS_FEEDS = [
  { name: 'The Hindu',       url: 'https://www.thehindu.com/news/national/feeder/default.rss' },
  { name: 'Indian Express',  url: 'https://indianexpress.com/feed/' },
  { name: 'LiveMint',        url: 'https://www.livemint.com/rss/news' },
  { name: 'PIB',             url: 'https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3' },
  { name: 'BBC India',       url: 'https://feeds.bbci.co.uk/news/world/asia/india/rss.xml' },
  { name: 'Down To Earth',   url: 'https://www.downtoearth.org.in/rss' },
  { name: 'Frontline',       url: 'https://frontline.thehindu.com/rss/feeder/default.rss' },
  { name: 'Hindustan Times', url: 'https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml' },
  { name: 'Times of India',  url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms' },
  { name: 'Economic Times',  url: 'https://economictimes.indiatimes.com/rssfeedstopstories.cms' },
]

async function fetchAndSaveRSS() {
  const allItems: {
    url: string
    title: string
    source: string
    raw_content: string
    published_at: string
    status: string
  }[] = []

  for (const feed of RSS_FEEDS) {
    try {
      const parsed = await parser.parseURL(feed.url)
      for (const item of parsed.items.slice(0, 20)) {
        allItems.push({
          url: item.link || '',
          title: item.title || '',
          source: feed.name,
          raw_content: item.contentSnippet || item.content || item.summary || '',
          published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
          status: 'new'
        })
      }
    } catch (err) {
      console.error(`Failed to fetch ${feed.name}:`, err)
    }
  }

  await supabase
    .from('rss_items')
    .upsert(allItems, { onConflict: 'url', ignoreDuplicates: true })

  const { data } = await supabase
    .from('rss_items')
    .select()
    .eq('status', 'new')
    .limit(50)

  return data || []
}

async function scoreAndCluster(items: {
  url: string
  title: string
  source: string
  raw_content: string
}[]) {
  if (items.length === 0) return

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

  const headlines = items
    .map((item, i) => `${i}. [${item.source}] ${item.title}`)
    .join('\n')

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4000,
    messages: [{
      role: 'user',
      content: `You are a UPSC content curator. Analyze these news headlines and:
1. Score each for UPSC relevance (1-10). Score 7+ = relevant.
2. Group headlines that cover the SAME story from different sources.
3. Tag each relevant story as "prelims" or "mains" and assign GS paper (GS1/GS2/GS3/GS4).

Headlines:
${headlines}

Respond ONLY with a JSON array of clusters like this:
[
  {
    "headline": "Short combined headline for the story",
    "summary": "2-3 line summary of what happened",
    "category": "prelims or mains",
    "gs_paper": "GS1 or GS2 or GS3 or GS4",
    "relevance_score": 8,
    "item_indices": [0, 3, 7]
  }
]
Only include clusters with relevance_score >= 7. No other text.`
    }]
  })

  const raw = response.content[0].type === 'text' ? response.content[0].text : ''

  let clusters: {
    headline: string
    summary: string
    category: string
    gs_paper: string
    relevance_score: number
    item_indices: number[]
  }[] = []

  try {
    clusters = JSON.parse(raw.replace(/```json|```/g, '').trim())
  } catch {
    console.error('Failed to parse Claude cluster response')
    return
  }

  for (const cluster of clusters) {
    const clusterItems = cluster.item_indices.map((i) => items[i]).filter(Boolean)
    if (clusterItems.length === 0) continue

    const sources = [...new Set(clusterItems.map((i) => i.source))]
    const urls = clusterItems.map((i) => i.url)
    const combined = clusterItems.map((i) => `[${i.source}]\n${i.title}\n${i.raw_content}`).join('\n\n---\n\n')

    await supabase.from('story_clusters').insert({
      headline: cluster.headline,
      summary: cluster.summary,
      category: cluster.category,
      gs_paper: cluster.gs_paper,
      sources,
      urls,
      combined_content: combined,
      relevance_score: cluster.relevance_score,
      status: 'pending'
    })

    const itemUrls = clusterItems.map((i) => i.url)
    await supabase.from('rss_items').update({ status: 'relevant' }).in('url', itemUrls)
  }

  console.log(`Created ${clusters.length} clusters`)
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    console.log('Fetching RSS feeds...')
    const newItems = await fetchAndSaveRSS()
    console.log(`Fetched ${newItems.length} new items`)

    console.log('Scoring and clustering with Claude...')
    await scoreAndCluster(newItems)

    return NextResponse.json({ success: true, fetched: newItems.length })
  } catch (err) {
    console.error('Cron error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}