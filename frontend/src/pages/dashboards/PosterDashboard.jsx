import { useState, useEffect } from 'react'
import { Briefcase, Users, Plus, BarChart2, CheckCircle } from 'lucide-react'
import api from '../../lib/api'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['pending', 'shortlisted', 'interviewed', 'accepted', 'rejected']
const STATUS_BADGE = { pending: 'badge-gray', shortlisted: 'badge-blue', interviewed: 'badge-amber', accepted: 'badge-success', rejected: 'badge-red' }

const TABS = [
  { id: 'overview',      label: 'Overview',        icon: <BarChart2 size={15} /> },
  { id: 'opportunities', label: 'My Opportunities', icon: <Briefcase size={15} /> },
  { id: 'applications',  label: 'Applications',     icon: <Users size={15} /> },
  { id: 'post',          label: 'Post Opportunity', icon: <Plus size={15} /> },
]

const EMPTY_OPP = { title: '', description: '', type: 'job', location: '', industry: '', deadline: '', salary_range: '', funding_amount: '', duration: '', is_remote: false }

export default function OrgDashboard() {
  const { user } = useAuthStore()
  const [opps, setOpps] = useState([])
  const [apps, setApps] = useState([])
  const [selectedOpp, setSelectedOpp] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('overview')
  const [form, setForm] = useState(EMPTY_OPP)
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    api.get('/opportunities/')
      .then(({ data }) => setOpps(data.filter(o => o.posted_by === user?.id)))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  const loadApps = async (oppId) => {
    setSelectedOpp(oppId)
    try {
      const { data } = await api.get(`/applications/opportunity/${oppId}`)
      setApps(data)
      setTab('applications')
    } catch { toast.error('Failed to load applications') }
  }

  const updateStatus = async (appId, status) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status })
      setApps(prev => prev.map(a => a.id === appId ? { ...a, status } : a))
      toast.success('Status updated')
    } catch { toast.error('Update failed') }
  }

  const handlePost = async (e) => {
    e.preventDefault()
    setPosting(true)
    try {
      const payload = { ...form }
      if (payload.funding_amount) payload.funding_amount = parseFloat(payload.funding_amount)
      else delete payload.funding_amount
      if (!payload.deadline) delete payload.deadline
      const { data } = await api.post('/opportunities/', payload)
      setOpps(prev => [data, ...prev])
      setForm(EMPTY_OPP)
      toast.success('Opportunity posted!')
      setTab('opportunities')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to post')
    } finally { setPosting(false) }
  }

  const stats = [
    { label: 'Posted',      value: opps.length,                                       icon: <Briefcase size={20} />, bg: '#dbeafe', color: '#2563eb' },
    { label: 'Open',        value: opps.filter(o => o.status === 'open').length,       icon: <CheckCircle size={20} />,bg: '#d1fae5', color: '#10b981' },
    { label: 'Total Apps',  value: apps.length,                                        icon: <Users size={20} />,     bg: '#ede9fe', color: '#7c3aed' },
  ]

  if (loading) return (
    <div className="dash-layout">
      <div className="dash-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div className="spinner" />
      </div>
    </div>
  )

  return (
    <div className="dash-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="nav-logo-icon">Y</div>
          <span>YELS</span>
        </div>
        <div className="sidebar-section">Organization</div>
        {TABS.map(t => (
          <button key={t.id} className={`sidebar-link${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
            {t.icon} <span>{t.label}</span>
          </button>
        ))}
        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="sidebar-avatar" style={{ background: '#10b981' }}>O</div>
            <div><div className="sidebar-user-name">Organization</div><div className="sidebar-user-role">{user?.role}</div></div>
          </div>
        </div>
      </aside>

      <main className="dash-main">
        <div className="dash-topbar">
          <div>
            <h1 className="dash-title">Organization Dashboard</h1>
            <p className="dash-sub">Manage your opportunities and review applications</p>
          </div>
          <button className="btn btn-primary" onClick={() => setTab('post')}><Plus size={14} /> Post Opportunity</button>
        </div>

        <div className="dash-content">
          <div className="dash-stats">
            {stats.map(s => (
              <div key={s.label} className="dash-stat-card">
                <div className="dash-stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                <div><div className="dash-stat-value">{s.value}</div><div className="dash-stat-label">{s.label}</div></div>
              </div>
            ))}
          </div>

          {/* Overview */}
          {tab === 'overview' && (
            <div>
              <div className="dash-section-title">Recent Opportunities</div>
              {opps.length === 0 ? (
                <div className="empty-state">
                  <Briefcase size={40} style={{ margin: '0 auto .75rem', opacity: .25 }} />
                  <p>No opportunities posted yet.</p>
                  <button className="btn btn-primary" style={{ marginTop: '.5rem' }} onClick={() => setTab('post')}>Post First Opportunity</button>
                </div>
              ) : (
                <div className="dash-table-wrap">
                  <table className="dash-table">
                    <thead><tr><th>Title</th><th>Type</th><th>Status</th><th>Deadline</th><th>Actions</th></tr></thead>
                    <tbody>
                      {opps.slice(0, 5).map(opp => (
                        <tr key={opp.id}>
                          <td>{opp.title}</td>
                          <td><span className="badge badge-blue" style={{ textTransform: 'capitalize' }}>{opp.type}</span></td>
                          <td><span className={`badge ${opp.status === 'open' ? 'badge-success' : 'badge-gray'}`}>{opp.status}</span></td>
                          <td>{opp.deadline ? new Date(opp.deadline).toLocaleDateString() : '—'}</td>
                          <td><button className="btn btn-outline btn-sm" onClick={() => loadApps(opp.id)}><Users size={13} /> View Apps</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Opportunities */}
          {tab === 'opportunities' && (
            <div>
              <div className="dash-section-title">All Opportunities ({opps.length})</div>
              <div className="dash-table-wrap">
                {opps.length === 0 ? (
                  <div className="empty-state"><p>No opportunities yet.</p></div>
                ) : (
                  <table className="dash-table">
                    <thead><tr><th>Title</th><th>Type</th><th>Status</th><th>Location</th><th>Deadline</th><th>Actions</th></tr></thead>
                    <tbody>
                      {opps.map(opp => (
                        <tr key={opp.id}>
                          <td style={{ fontWeight: 600 }}>{opp.title}</td>
                          <td><span className="badge badge-blue" style={{ textTransform: 'capitalize' }}>{opp.type}</span></td>
                          <td><span className={`badge ${opp.status === 'open' ? 'badge-success' : 'badge-gray'}`}>{opp.status}</span></td>
                          <td>{opp.location || '—'}</td>
                          <td>{opp.deadline ? new Date(opp.deadline).toLocaleDateString() : '—'}</td>
                          <td><button className="btn btn-outline btn-sm" onClick={() => loadApps(opp.id)}><Users size={13} /> Applications</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* Applications */}
          {tab === 'applications' && (
            <div>
              <div className="dash-section-title">
                Applications {selectedOpp ? `for Opportunity #${selectedOpp}` : ''}
              </div>
              {apps.length === 0 ? (
                <div className="empty-state"><p>No applications received yet.</p></div>
              ) : (
                <div className="dash-table-wrap">
                  <table className="dash-table">
                    <thead><tr><th>Applicant</th><th>Applied</th><th>Status</th><th>Update Status</th></tr></thead>
                    <tbody>
                      {apps.map(app => (
                        <tr key={app.id}>
                          <td>Youth #{app.youth_id}</td>
                          <td>{new Date(app.applied_at).toLocaleDateString()}</td>
                          <td><span className={`badge ${STATUS_BADGE[app.status] || 'badge-gray'}`}>{app.status}</span></td>
                          <td>
                            <select
                              className="dash-select"
                              value={app.status}
                              onChange={e => updateStatus(app.id, e.target.value)}
                            >
                              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Post Opportunity */}
          {tab === 'post' && (
            <div>
              <div className="dash-section-title">Post New Opportunity</div>
              <div className="post-form-card">
                <form onSubmit={handlePost}>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Title *</label>
                      <input placeholder="e.g. Software Developer" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Type *</label>
                      <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                        <option value="job">Job</option>
                        <option value="funding">Funding</option>
                        <option value="training">Training</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description *</label>
                    <textarea rows={4} placeholder="Describe the opportunity in detail..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <input placeholder="e.g. Nairobi, Kenya" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Industry</label>
                      <input placeholder="e.g. Technology" value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Deadline</label>
                      <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
                    </div>
                  </div>
                  {form.type === 'job' && (
                    <div className="form-group">
                      <label className="form-label">Salary Range</label>
                      <input placeholder="e.g. KES 50,000 – 80,000" value={form.salary_range} onChange={e => setForm({ ...form, salary_range: e.target.value })} />
                    </div>
                  )}
                  {form.type === 'funding' && (
                    <div className="form-group">
                      <label className="form-label">Funding Amount ($)</label>
                      <input type="number" placeholder="e.g. 5000" value={form.funding_amount} onChange={e => setForm({ ...form, funding_amount: e.target.value })} />
                    </div>
                  )}
                  {form.type === 'training' && (
                    <div className="form-group">
                      <label className="form-label">Duration</label>
                      <input placeholder="e.g. 3 months" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
                    </div>
                  )}
                  <label className="form-check">
                    <input type="checkbox" checked={form.is_remote} onChange={e => setForm({ ...form, is_remote: e.target.checked })} />
                    <span>Remote opportunity</span>
                  </label>
                  <div style={{ marginTop: '1.5rem', display: 'flex', gap: '.75rem' }}>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={posting}>{posting ? 'Posting...' : 'Post Opportunity'}</button>
                    <button type="button" className="btn btn-ghost" onClick={() => setForm(EMPTY_OPP)}>Reset</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
