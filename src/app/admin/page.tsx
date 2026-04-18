'use client'
import { useEffect, useState } from 'react'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'upsc2025admin'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)
  const [tab, setTab] = useState<'queue' | 'drafts' | 'manual'>('queue')
  const [clusters, setClusters] = useState<any[]>([])
  const [drafts, setDrafts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [manualText, setManualText] = useState('')
  const [manualCategory, setManualCategory] = useState('mains')
  const [manualLoading, setManualLoading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [expandedDraft, setExpandedDraft] = useState<string | null>(null)

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

  useEffect(() => {
    if (!authed) return
    if (tab === 'queue') fetchClusters()
    if (tab === 'drafts') fetchDrafts()
  }, [tab, authed])

  const handleLogin = () => {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setError(false) }
    else setError(true)
  }

  const handleCluster = async (id: string, action: 'approved' | 'rejected') => {
    setActionLoading(id)
    await fetch(`/api/admin/clusters/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    })
    if (action === 'approved') showToast('✅ Approved! Claude is generating content...')
    else showToast('❌ Story rejected')
    setClusters(prev => prev.filter(c => c.id !== id))
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

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif' }}>
        <div style={{ background: '#0f1829', border: '1px solid #1e2d4a', borderRadius: 12, padding: 40, width: 360 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: '#f59e0b', textTransform: 'uppercase', marginBottom: 8 }}>CrashCourse UPSC</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 24 }}>Admin Access</div>
          <input
            type="password"
            placeholder="Enter password"
            value={pw}
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
      <div style={{ borderBottom: '1px solid #1e2d4a', padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 3, color: '#f59e0b', textTransform: 'uppercase', marginBottom: 4 }}>CrashCourse UPSC</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>Content Admin</div>
        </div>
        <button onClick={() => { fetchClusters(); showToast('Refreshed!') }}
          style={{ background: '#f59e0b', color: '#0a0f1e', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
          ↻ Refresh
        </button>
      </div>
      <div style={{ display: 'flex', borderBottom: '1px solid #1e2d4a', padding: '0 32px' }}>
        {(['queue', 'drafts', 'manual'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '16px 24px', border: 'none', background: 'none', cursor: 'pointer',
            color: tab === t ? '#f59e0b' : '#6b7a99', fontSize: 14, fontWeight: tab === t ? 700 : 400,
            borderBottom: tab === t ? '2px solid #f59e0b' : '2px solid transparent',
            textTransform: 'capitalize', letterSpacing: 1
          }}>
            {t === 'queue' ? `📰 News Queue ${clusters.length > 0 ? `(${clusters.length})` : ''}` :
             t === 'drafts' ? `✍️ Drafts ${drafts.length > 0 ? `(${drafts.length})` : ''}` :
             '➕ Add Manually'}
          </button>
        ))}
      </div>
      <div style={{ padding: '24px 32px', maxWidth: 900, margin: '0 auto' }}>
        {tab === 'queue' && (
          <div>
            {loading ? <div style={{ color: '#6b7a99', textAlign: 'center', padding: 60 }}>Loading stories...</div> :
             clusters.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, color: '#6b7a99' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <div>No pending stories.</div>
              </div>
             ) : clusters.map(cluster => (
              <div key={cluster.id} style={{ background: '#0f1829', border: '1px solid #1e2d4a', borderRadius: 10, padding: 20, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                      <span style={{ background: cluster.category === 'mains' ? '#1a3a5c' : '#1a3a2a', color: cluster.category === 'mains' ? '#60a5fa' : '#4ade80', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>{cluster.category}</span>
                      <span style={{ background: '#2a1f0a', color: '#f59e0b', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{cluster.gs_paper}</span>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 8, lineHeight: 1.4 }}>{cluster.headline}</div>
                    <div style={{ fontSize: 13, color: '#8899aa', marginBottom: 10, lineHeight: 1.6 }}>{cluster.summary}</div>
                    <div style={{ fontSize: 11, color: '#4a5568' }}>Sources: {cluster.sources?.join(' · ')}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 110 }}>
                    <button disabled={actionLoading === cluster.id} onClick={() => handleCluster(cluster.id, 'approved')}
                      style={{ background: '#166534', color: '#4ade80', border: '1px solid #166534', padding: '10px 16px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
                      {actionLoading === cluster.id ? '...' : '✅ Approve'}
                    </button>
                    <button disabled={actionLoading === cluster.id} onClick={() => handleCluster(cluster.id, 'rejected')}
                      style={{ background: '#1a0a0a', color: '#f87171', border: '1px solid #7f1d1d', padding: '10px 16px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
                      ❌ Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{draft.story_clusters?.headline || 'Draft'}</div>
                    <div style={{ fontSize: 11, color: '#6b7a99', marginBottom: 12 }}>Sources: {draft.story_clusters?.sources?.join(' · ')}</div>
                    <button onClick={() => setExpandedDraft(expandedDraft === draft.id ? null : draft.id)}
                      style={{ background: 'none', border: '1px solid #1e2d4a', color: '#60a5fa', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
                      {expandedDraft === draft.id ? '▲ Hide Preview' : '▼ Preview Content'}
                    </button>
                    {expandedDraft === draft.id && (
                      <div style={{ marginTop: 16 }}>
                        <div style={{ background: '#0a0f1e', border: '1px solid #1e2d4a', borderRadius: 8, padding: 16, marginBottom: 12 }}>
                          <div style={{ fontSize: 11, color: '#f59e0b', letterSpacing: 2, marginBottom: 10, textTransform: 'uppercase' }}>Daily News Article</div>
                          <div style={{ fontSize: 13, color: '#c0cce0', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{draft.daily_news}</div>
                        </div>
                        {draft.mcqs?.length > 0 && (
                          <div style={{ background: '#0a0f1e', border: '1px solid #1e2d4a', borderRadius: 8, padding: 16 }}>
                            <div style={{ fontSize: 11, color: '#f59e0b', letterSpacing: 2, marginBottom: 12, textTransform: 'uppercase' }}>MCQs ({draft.mcqs.length})</div>
                            {draft.mcqs.map((mcq: any, i: number) => (
                              <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: i < draft.mcqs.length - 1 ? '1px solid #1e2d4a' : 'none' }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#e8e0d0', marginBottom: 8 }}>Q{i + 1}. {mcq.question}</div>
                                {mcq.options?.map((opt: string, j: number) => (
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
      </div>
    </div>
  )
}