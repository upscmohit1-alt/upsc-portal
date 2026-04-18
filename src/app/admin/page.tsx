'use client'
import { useEffect, useState } from 'react'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'upsc2025admin'

type Cluster = {
  id: string
  headline: string
  summary: string
  category: string
  gs_paper: string
  sources: string[]
  relevance_score: number
  status: string
}

type Draft = {
  id: string
  daily_news: string
  mcqs: { question: string; options: string[]; correct_index: number; explanation: string }[]
  type: string
  status: string
  story_clusters: { headline: string; sources: string[] }
}

type Prompt = {
  id: string
  name: string
  content_type: string
  prompt_text: string
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)
  const [tab, setTab] = useState<'queue' | 'drafts' | 'manual' | 'prompts'>('queue')
  const [clusters, setClusters] = useState<Cluster[]>([])
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [manualText, setManualText] = useState('')
  const [manualCategory, setManualCategory] = useState('mains')
  const [manualLoading, setManualLoading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [expandedDraft, setExpandedDraft] = useState<string | null>(null)
  const [editingPrompt, setEditingPrompt] = useState<string | null>(null)
  const [editedText, setEditedText] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const fetchClusters = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/clusters')
    const data = await res.json()
    setClusters(data)
    setLoading(false)
  }

  const fetchDrafts = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/drafts')
    const data = await res.json()
    setDrafts(data)
    setLoading(false)
  }

  const fetchPrompts = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/prompts')
    const data = await res.json()
    setPrompts(data)
    setLoading(false)
  }

  useEffect(() => {
    if (!authed) return
    if (tab === 'queue') fetchClusters()
    if (tab === 'drafts') fetchDrafts()
    if (tab === 'prompts') fetchPrompts()
  }, [tab, authed])

  const handleLogin = () => {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setError(false) }
    else setError(true)
  }

  const handleCluster = async (id: string, action: 'approved' | 'rejected', contentType?: string) => {
    const key = id + (contentType || '')
    setActionLoading(key)
    await fetch(`/api/admin/clusters/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, contentType })
    })
    if (action === 'approved') showToast(`✅ Generating ${contentType?.replace('_', ' ')} content...`)
    else { showToast('❌ Story rejected'); setClusters(prev => prev.filter(c => c.id !== id)) }
    setActionLoading(null)
  }

  const handleDraft = async (id: string, action: 'approved' | 'rejected') => {
    setActionLoading(id)
    await fetch(`/api/admin/drafts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    })
    if (action === 'approved') showToast('🚀 Published to your portal!')
    else showToast('❌ Draft rejected')
    setDrafts(prev => prev.filter(d => d.id !== id))
    setActionLoading(null)
  }

  const handleManual = async () => {
    if (!manualText.trim()) return
    setManualLoading(true)
    const res = await fetch('/api/admin/manual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: manualText, category: manualCategory })
    })
    if (res.ok) { showToast('✅ Story added! Go to News Queue to approve it.'); setManualText('') }
    setManualLoading(false)
  }

  const handleSavePrompt = async (id: string) => {
    await fetch(`/api/admin/prompts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt_text: editedText })
    })
    setPrompts(prev => prev.map(p => p.id === id ? { ...p, prompt_text: editedText } : p))
    setEditingPrompt(null)
    showToast('✅ Prompt saved!')
  }

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif' }}>
        <div style={{ background: '#0f1829', border: '1px solid #1e2d4a', borderRadius: 12, padding: 40, width: 360 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: '#f59e0b', textTransform: 'uppercase', marginBottom: 8 }}>CrashCourse UPSC</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 24 }}>Admin Access</div>
          <input type="password" placeholder="Enter password" value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', background: '#0a0f1e', border: `1px solid ${error ? '#ef4444' : '#1e2d4a'}`, color: '#e8e0d0', padding: '12px 14px', borderRadius: 6, fontSize: 14, boxSizing: 'border-box', marginBottom: 12 }}
          />
          {error && <div style={{ color: '#ef4444', fontSize: 12, marginBottom: 12 }}>Incorrect password</div>}
          <button onClick={handleLogin}
            style={{ width: '100%', background: '#f59e0b', color: '#0a0f1e', border: 'none', padding: '12px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
            Login →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', color: '#e8e0d0', fontFamily: 'Georgia, serif' }}>
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, background: '#1a2744', border: '1px solid #f59e0b', color: '#f59e0b', padding: '12px 20px', borderRadius: 8, zIndex: 999, fontSize: 14 }}>{toast}</div>
      )}

      {/* Header */}
      <div style={{ borderBottom: '1px solid #1e2d4a', padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 3, color: '#f59e0b', textTransform: 'uppercase', marginBottom: 4 }}>CrashCourse UPSC</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>Content Admin</div>
        </div>
        <button onClick={() => { if (tab === 'queue') fetchClusters(); else if (tab === 'drafts') fetchDrafts(); showToast('Refreshed!') }}
          style={{ background: '#f59e0b', color: '#0a0f1e', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
          ↻ Refresh
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #1e2d4a', padding: '0 32px', overflowX: 'auto' }}>
        {(['queue', 'drafts', 'manual', 'prompts'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '16px 20px', border: 'none', background: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
            color: tab === t ? '#f59e0b' : '#6b7a99', fontSize: 13, fontWeight: tab === t ? 700 : 400,
            borderBottom: tab === t ? '2px solid #f59e0b' : '2px solid transparent', letterSpacing: 1
          }}>
            {t === 'queue' ? `📰 News Queue ${clusters.length > 0 ? `(${clusters.length})` : ''}` :
             t === 'drafts' ? `✍️ Drafts ${drafts.length > 0 ? `(${drafts.length})` : ''}` :
             t === 'manual' ? '➕ Add Manually' : '⚙️ Prompts'}
          </button>
        ))}
      </div>

      <div style={{ padding: '24px 32px', maxWidth: 960, margin: '0 auto' }}>

        {/* NEWS QUEUE */}
        {tab === 'queue' && (
          <div>
            {loading ? <div style={{ color: '#6b7a99', textAlign: 'center', padding: 60 }}>Loading stories...</div> :
             clusters.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, color: '#6b7a99' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <div>No pending stories. Click Refresh or trigger a fetch.</div>
              </div>
             ) : clusters.map(cluster => (
              <div key={cluster.id} style={{ background: '#0f1829', border: '1px solid #1e2d4a', borderRadius: 10, padding: 20, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                      <span style={{ background: cluster.category === 'mains' ? '#1a3a5c' : '#1a3a2a', color: cluster.category === 'mains' ? '#60a5fa' : '#4ade80', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>{cluster.category}</span>
                      <span style={{ background: '#2a1f0a', color: '#f59e0b', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{cluster.gs_paper}</span>
                      <span style={{ color: '#4a5568', fontSize: 11, padding: '3px 0' }}>Score: {cluster.relevance_score}/10</span>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 8, lineHeight: 1.4 }}>{cluster.headline}</div>
                    <div style={{ fontSize: 13, color: '#8899aa', marginBottom: 10, lineHeight: 1.6 }}>{cluster.summary}</div>
                    <div style={{ fontSize: 11, color: '#4a5568' }}>Sources: {cluster.sources?.join(' · ')}</div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 140 }}>
                    <button
                      disabled={actionLoading === cluster.id + 'mains_article'}
                      onClick={() => handleCluster(cluster.id, 'approved', 'mains_article')}
                      style={{ background: '#1a3a5c', color: '#60a5fa', border: '1px solid #1e4a7c', padding: '9px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>
                      {actionLoading === cluster.id + 'mains_article' ? '...' : '📝 Mains Article'}
                    </button>
                    <button
                      disabled={actionLoading === cluster.id + 'prelims_news'}
                      onClick={() => handleCluster(cluster.id, 'approved', 'prelims_news')}
                      style={{ background: '#1a3a2a', color: '#4ade80', border: '1px solid #1e4a2e', padding: '9px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>
                      {actionLoading === cluster.id + 'prelims_news' ? '...' : '📋 Prelims News'}
                    </button>
                    <button
                      disabled={actionLoading === cluster.id + 'prelims_mcq'}
                      onClick={() => handleCluster(cluster.id, 'approved', 'prelims_mcq')}
                      style={{ background: '#2a1f0a', color: '#f59e0b', border: '1px solid #4a3a1a', padding: '9px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>
                      {actionLoading === cluster.id + 'prelims_mcq' ? '...' : '❓ Prelims MCQs'}
                    </button>
                    <button
                      disabled={!!actionLoading}
                      onClick={() => handleCluster(cluster.id, 'rejected')}
                      style={{ background: '#1a0a0a', color: '#f87171', border: '1px solid #7f1d1d', padding: '9px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>
                      ❌ Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DRAFTS */}
        {tab === 'drafts' && (
          <div>
            {loading ? <div style={{ color: '#6b7a99', textAlign: 'center', padding: 60 }}>Loading drafts...</div> :
             drafts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, color: '#6b7a99' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✍️</div>
                <div>No drafts yet. Approve stories from News Queue first.</div>
              </div>
             ) : drafts.map(draft => (
              <div key={draft.id} style={{ background: '#0f1829', border: '1px solid #1e2d4a', borderRadius: 10, padding: 20, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      <span style={{ background: '#2a1f0a', color: '#f59e0b', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>{draft.type?.replace('_', ' ')}</span>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{draft.story_clusters?.headline || 'Draft'}</div>
                    <div style={{ fontSize: 11, color: '#6b7a99', marginBottom: 12 }}>Sources: {draft.story_clusters?.sources?.join(' · ')}</div>
                    <button onClick={() => setExpandedDraft(expandedDraft === draft.id ? null : draft.id)}
                      style={{ background: 'none', border: '1px solid #1e2d4a', color: '#60a5fa', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
                      {expandedDraft === draft.id ? '▲ Hide Preview' : '▼ Preview Content'}
                    </button>
                    {expandedDraft === draft.id && (
                      <div style={{ marginTop: 16 }}>
                        {draft.daily_news && (
                          <div style={{ background: '#0a0f1e', border: '1px solid #1e2d4a', borderRadius: 8, padding: 16, marginBottom: 12 }}>
                            <div style={{ fontSize: 11, color: '#f59e0b', letterSpacing: 2, marginBottom: 10, textTransform: 'uppercase' }}>Article</div>
                            <div style={{ fontSize: 13, color: '#c0cce0', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{draft.daily_news}</div>
                          </div>
                        )}
                        {draft.mcqs?.length > 0 && (
                          <div style={{ background: '#0a0f1e', border: '1px solid #1e2d4a', borderRadius: 8, padding: 16 }}>
                            <div style={{ fontSize: 11, color: '#f59e0b', letterSpacing: 2, marginBottom: 12, textTransform: 'uppercase' }}>MCQs ({draft.mcqs.length})</div>
                            {draft.mcqs.map((mcq, i) => (
                              <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: i < draft.mcqs.length - 1 ? '1px solid #1e2d4a' : 'none' }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#e8e0d0', marginBottom: 8, whiteSpace: 'pre-wrap' }}>Q{i + 1}. {mcq.question}</div>
                                {mcq.options?.map((opt, j) => (
                                  <div key={j} style={{ fontSize: 12, color: j === mcq.correct_index ? '#4ade80' : '#8899aa', padding: '3px 0' }}>{String.fromCharCode(65 + j)}) {opt}</div>
                                ))}
                                <div style={{ fontSize: 12, color: '#60a5fa', marginTop: 8 }}>💡 {mcq.explanation}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 110 }}>
                    <button disabled={actionLoading === draft.id} onClick={() => handleDraft(draft.id, 'approved')}
                      style={{ background: '#166534', color: '#4ade80', border: '1px solid #166534', padding: '10px 16px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
                      {actionLoading === draft.id ? '...' : '🚀 Publish'}
                    </button>
                    <button disabled={actionLoading === draft.id} onClick={() => handleDraft(draft.id, 'rejected')}
                      style={{ background: '#1a0a0a', color: '#f87171', border: '1px solid #7f1d1d', padding: '10px 16px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
                      ❌ Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MANUAL */}
        {tab === 'manual' && (
          <div style={{ maxWidth: 700 }}>
            <div style={{ fontSize: 14, color: '#8899aa', marginBottom: 16, lineHeight: 1.7 }}>
              Paste any news article URL or full text that RSS missed.
            </div>
            <select value={manualCategory} onChange={e => setManualCategory(e.target.value)}
              style={{ background: '#0f1829', border: '1px solid #1e2d4a', color: '#e8e0d0', padding: '10px 14px', borderRadius: 6, fontSize: 13, marginBottom: 12, width: '100%' }}>
              <option value="mains">Mains</option>
              <option value="prelims">Prelims</option>
            </select>
            <textarea value={manualText} onChange={e => setManualText(e.target.value)}
              placeholder="Paste article URL or full article text here..."
              rows={10}
              style={{ width: '100%', background: '#0f1829', border: '1px solid #1e2d4a', color: '#e8e0d0', padding: 16, borderRadius: 6, fontSize: 13, lineHeight: 1.7, resize: 'vertical', boxSizing: 'border-box' }}
            />
            <button onClick={handleManual} disabled={manualLoading || !manualText.trim()}
              style={{ marginTop: 12, background: '#f59e0b', color: '#0a0f1e', border: 'none', padding: '12px 28px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 14, opacity: manualLoading ? 0.7 : 1 }}>
              {manualLoading ? 'Adding...' : '➕ Add to Queue'}
            </button>
          </div>
        )}

        {/* PROMPTS */}
        {tab === 'prompts' && (
          <div>
            <div style={{ fontSize: 14, color: '#8899aa', marginBottom: 20, lineHeight: 1.7 }}>
              Edit the prompts Claude uses to generate each content type. Changes take effect immediately on next generation.
            </div>
            {loading ? <div style={{ color: '#6b7a99', textAlign: 'center', padding: 60 }}>Loading prompts...</div> :
             prompts.map(prompt => (
              <div key={prompt.id} style={{ background: '#0f1829', border: '1px solid #1e2d4a', borderRadius: 10, padding: 20, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{prompt.name}</span>
                    <span style={{ marginLeft: 10, background: '#2a1f0a', color: '#f59e0b', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{prompt.content_type}</span>
                  </div>
                  {editingPrompt === prompt.id ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleSavePrompt(prompt.id)}
                        style={{ background: '#166534', color: '#4ade80', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>
                        💾 Save
                      </button>
                      <button onClick={() => setEditingPrompt(null)}
                        style={{ background: '#1a0a0a', color: '#f87171', border: '1px solid #7f1d1d', padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => { setEditingPrompt(prompt.id); setEditedText(prompt.prompt_text) }}
                      style={{ background: 'none', border: '1px solid #1e2d4a', color: '#60a5fa', padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
                      ✏️ Edit
                    </button>
                  )}
                </div>
                {editingPrompt === prompt.id ? (
                  <textarea value={editedText} onChange={e => setEditedText(e.target.value)}
                    rows={14}
                    style={{ width: '100%', background: '#0a0f1e', border: '1px solid #f59e0b', color: '#e8e0d0', padding: 14, borderRadius: 6, fontSize: 12, lineHeight: 1.7, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'monospace' }}
                  />
                ) : (
                  <div style={{ fontSize: 12, color: '#6b7a99', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontFamily: 'monospace', background: '#0a0f1e', padding: 14, borderRadius: 6, maxHeight: 200, overflowY: 'auto' }}>
                    {prompt.prompt_text}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}