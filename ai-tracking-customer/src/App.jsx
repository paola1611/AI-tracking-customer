import { useState, useEffect } from 'react'

const API = 'http://localhost:3001'

const CATEGORY_STYLES = [
  { keywords: ['customer', 'client', 'satisfaction', 'support', 'service'], classes: 'bg-blue-50 text-blue-700 border-blue-200' },
  { keywords: ['billing', 'payment', 'invoice', 'finance', 'cost', 'pricing', 'budget'], classes: 'bg-amber-50 text-amber-700 border-amber-200' },
  { keywords: ['operations', 'operational', 'logistics', 'process', 'workflow'], classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { keywords: ['sales', 'revenue', 'growth', 'lead', 'conversion'], classes: 'bg-violet-50 text-violet-700 border-violet-200' },
  { keywords: ['product', 'feature', 'roadmap', 'design', 'ux'], classes: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { keywords: ['technical', 'engineering', 'bug', 'infrastructure', 'performance', 'security'], classes: 'bg-orange-50 text-orange-700 border-orange-200' },
  { keywords: ['marketing', 'campaign', 'brand', 'content', 'seo'], classes: 'bg-pink-50 text-pink-700 border-pink-200' },
  { keywords: ['hr', 'hiring', 'people', 'team', 'onboarding', 'training'], classes: 'bg-teal-50 text-teal-700 border-teal-200' },
]

function categoryStyle(category = '') {
  const lower = category.toLowerCase()
  const match = CATEGORY_STYLES.find(({ keywords }) => keywords.some(k => lower.includes(k)))
  return match ? match.classes : 'bg-slate-50 text-slate-600 border-slate-200'
}

function CategoryBadge({ category, size = 'sm' }) {
  const base = size === 'sm'
    ? 'inline-block border text-xs font-semibold px-3 py-1 rounded-full'
    : 'inline-block border text-sm font-semibold px-3.5 py-1.5 rounded-full'
  return (
    <span className={`${base} ${categoryStyle(category)}`}>
      {category}
    </span>
  )
}

export default function App() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => { fetchSubmissions() }, [])

  async function fetchSubmissions() {
    try {
      const res = await fetch(`${API}/submissions`)
      setSubmissions(await res.json())
    } catch {}
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch(`${API}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong.'); return }
      setResult(data)
      setText('')
      fetchSubmissions()
    } catch {
      setError('Could not reach the server. Is it running on port 3001?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* Accent top strip */}
      <div className="h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400" />

      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 px-6">
        <div className="max-w-5xl mx-auto h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-900 tracking-tight">Stakeholder Analyzer</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* Page title */}
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Analyze a Request</h1>
          <p className="text-sm text-gray-500 mt-1">
            Paste an unstructured stakeholder request and get structured business insights instantly.
          </p>
        </div>

        {/* Input card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={5}
            placeholder="e.g. The sales team needs better tooling to track customer follow-ups and reduce churn. Currently using spreadsheets which causes data loss and missed opportunities…"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white resize-none transition-all duration-150"
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !text.trim()}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-sm transition-all duration-150"
            >
              {loading
                ? <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                : <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
              }
              {loading ? 'Analyzing…' : 'Analyze'}
            </button>
            {loading && (
              <span className="text-xs text-gray-400">This may take a few seconds</span>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            <svg className="h-4 w-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            </svg>
            {error}
          </div>
        )}

        {/* Result card */}
        {result && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

            {/* Result header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 ring-4 ring-emerald-50" />
              <h2 className="text-sm font-semibold text-gray-900">Analysis Result</h2>
              <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                Just now
              </span>
            </div>

            <div className="p-6 space-y-6">

              {/* Category */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-widest w-20 shrink-0">Category</span>
                <CategoryBadge category={result.category} size="md" />
              </div>

              <div className="h-px bg-gray-100" />

              {/* Issues + Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-rose-500 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block" />
                    Key Issues
                  </p>
                  <ul className="space-y-2">
                    {result.key_issues.map((issue, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 bg-rose-50/60 rounded-lg px-3 py-2 border border-rose-100">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    Suggested Actions
                  </p>
                  <ul className="space-y-2">
                    {result.suggested_actions.map((action, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 bg-emerald-50/60 rounded-lg px-3 py-2 border border-emerald-100">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submissions table */}
        {submissions.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <h2 className="text-sm font-semibold text-gray-900">All Submissions</h2>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                {submissions.length}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {[
                      { label: 'Request',            cls: 'w-72' },
                      { label: 'Category',           cls: 'w-36' },
                      { label: 'Key Issues',         cls: 'w-64' },
                      { label: 'Suggested Actions',  cls: 'w-64' },
                      { label: 'Date',               cls: 'w-28' },
                    ].map(({ label, cls }) => (
                      <th key={label} className={`${cls} px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider`}>
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s, idx) => (
                    <tr
                      key={s.id}
                      className={`align-top transition-colors duration-100 hover:bg-indigo-50/40 ${idx !== submissions.length - 1 ? 'border-b border-gray-100' : ''}`}
                    >

                      {/* Request — 2-line clamp with tooltip for full text */}
                      <td className="px-6 py-4 w-72">
                        <p
                          className="text-xs text-gray-700 leading-relaxed overflow-hidden"
                          style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}
                          title={s.request_text}
                        >
                          {s.request_text}
                        </p>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 w-36">
                        <CategoryBadge category={s.category} />
                      </td>

                      {/* Key Issues */}
                      <td className="px-6 py-4 w-64">
                        <ul className="space-y-2">
                          {s.key_issues.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-gray-600 leading-snug">
                              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </td>

                      {/* Suggested Actions */}
                      <td className="px-6 py-4 w-64">
                        <ul className="space-y-2">
                          {s.suggested_actions.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-gray-600 leading-snug">
                              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 w-28">
                        <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                          {new Date(s.created_at).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </span>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
