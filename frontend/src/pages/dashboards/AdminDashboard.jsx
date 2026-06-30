import { useState, useEffect } from 'react'
import { Users, Tag, ToggleLeft, ToggleRight, Trash2, Plus, BarChart2, Shield, Briefcase, XCircle, CheckCircle, FileText, ClipboardList, CreditCard } from 'lucide-react'
import api from '../../lib/api'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

const TABS = [
  { id: 'overview',      label: 'Overview',        icon: <BarChart2 size={15} /> },
  { id: 'applications',  label: 'Applications',    icon: <ClipboardList size={15} /> },
  { id: 'users',         label: 'Users',           icon: <Users size={15} /> },
  { id: 'opportunities', label: 'Opportunities',   icon: <Briefcase size={15} /> },
  { id: 'post',          label: 'Post Opportunity', icon: <Plus size={15} /> },
  { id: 'skills',        label: 'Skills',          icon: <Tag size={15} /> },
  { id: 'payments',      label: 'Payments',        icon: <CreditCard size={15} /> },
]

const EMPTY_OPP = {
  title: '', description: '', type: 'job', industry: '',
  deadline: '', salary_range: '', funding_amount: '', duration: '', is_remote: false, skill_ids: []
}

const STATUS_BADGE = { open: 'badge-success', closed: 'badge-red', draft: 'badge-gray' }
const TYPE_BADGE   = { job: 'badge-blue', funding: 'badge-green', training: 'badge-amber' }

export default function AdminDashboard() {
  const { user } = useAuthStore()
  const [users, setUsers]       = useState([])
  const [skills, setSkills]     = useState([])
  const [opps, setOpps]         = useState([])
  const [apps, setApps]         = useState([])
  const [newSkill, setNewSkill] = useState('')
  const [tab, setTab]           = useState('overview')
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [form, setForm]         = useState(EMPTY_OPP)
  const [posting, setPosting]   = useState(false)

  useEffect(() => {
    Promise.all([
      api.get('/admin/users'),
      api.get('/admin/skills'),
      api.get('/admin/opportunities'),
      api.get('/admin/applications'),
    ])
      .then(([u, s, o, a]) => { setUsers(u.data); setSkills(s.data); setOpps(o.data); setApps(a.data) })
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false))
  }, [])

  // ── Users ──────────────────────────────────────────────────────────────────
  const toggleUser = async (id, isActive) => {
    try {
      await api.patch(`/admin/users/${id}/${isActive ? 'deactivate' : 'activate'}`)
      setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: !isActive } : u))
      toast.success(`User ${isActive ? 'deactivated' : 'activated'}`)
    } catch { toast.error('Action failed') }
  }

  // ── Skills ─────────────────────────────────────────────────────────────────
  const addSkill = async (e) => {
    e.preventDefault()
    if (!newSkill.trim()) return
    try {
      const { data } = await api.post('/admin/skills', { name: newSkill.trim() })
      setSkills(prev => [...prev, data])
      setNewSkill('')
      toast.success('Skill added')
    } catch (err) { toast.error(err.response?.data?.detail || 'Failed') }
  }

  const deleteSkill = async (id) => {
    try {
      await api.delete(`/admin/skills/${id}`)
      setSkills(prev => prev.filter(s => s.id !== id))
      toast.success('Skill deleted')
    } catch { toast.error('Delete failed') }
  }

  // ── Opportunities ──────────────────────────────────────────────────────────
  const handlePost = async (e) => {
    e.preventDefault()
    setPosting(true)
    try {
      const payload = { ...form }
      if (payload.funding_amount) payload.funding_amount = parseFloat(payload.funding_amount)
      else delete payload.funding_amount
      if (!payload.deadline) delete payload.deadline
      const { data } = await api.post('/admin/opportunities', payload)
      setOpps(prev => [data, ...prev])
      setForm(EMPTY_OPP)
      toast.success('Opportunity posted!')
      setTab('opportunities')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to post')
    } finally { setPosting(false) }
  }

  const toggleOppStatus = async (id, status) => {
    const action = status === 'open' ? 'close' : 'open'
    try {
      await api.patch(`/admin/opportunities/${id}/${action}`)
      setOpps(prev => prev.map(o => o.id === id ? { ...o, status: action === 'close' ? 'closed' : 'open' } : o))
      toast.success(`Opportunity ${action === 'close' ? 'closed' : 'reopened'}`)
    } catch { toast.error('Action failed') }
  }

  const deleteOpp = async (id) => {
    if (!window.confirm('Delete this opportunity? This cannot be undone.')) return
    try {
      await api.delete(`/admin/opportunities/${id}`)
      setOpps(prev => prev.filter(o => o.id !== id))
      toast.success('Opportunity deleted')
    } catch { toast.error('Delete failed') }
  }

  // ── Applications ───────────────────────────────────────────────────────────
  const handleAppAction = async (id, action) => {
    try {
      const { data } = await api.patch(`/admin/applications/${id}/${action}`)
      setApps(prev => prev.map(a => a.id === id ? data : a))
      toast.success(`Application ${action === 'approve' ? 'approved' : 'rejected'}`)
    } catch { toast.error('Action failed') }
  }

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  )

  const stats = [
    { label: 'Total Users',    value: users.length,                                          bg: '#dbeafe', color: '#2563eb', icon: <Users size={20} /> },
    { label: 'Youth',          value: users.filter(u => u.role === 'youth').length,           bg: '#d1fae5', color: '#10b981', icon: <Users size={20} /> },
    { label: 'Opportunities',  value: opps.length,                                            bg: '#fef3c7', color: '#f59e0b', icon: <Briefcase size={20} /> },
    { label: 'Applications',   value: apps.length,                                            bg: '#ede9fe', color: '#7c3aed', icon: <ClipboardList size={20} /> },
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
        <div className="sidebar-section">Administration</div>
        {TABS.map(t => (
          <button key={t.id} className={`sidebar-link${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
            {t.icon} <span>{t.label}</span>
          </button>
        ))}
        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="sidebar-avatar" style={{ background: '#ef4444' }}>A</div>
            <div><div className="sidebar-user-name">Admin</div><div className="sidebar-user-role">{user?.role}</div></div>
          </div>
        </div>
      </aside>

      <main className="dash-main">
        <div className="dash-topbar">
          <div>
            <h1 className="dash-title">Admin Dashboard</h1>
            <p className="dash-sub">Manage users, opportunities, and platform configuration</p>
          </div>
          <button className="btn btn-primary" onClick={() => setTab('post')}><Plus size={14} /> Post Opportunity</button>
        </div>

        <div className="dash-content">
          {/* Stats */}
          <div className="dash-stats">
            {stats.map(s => (
              <div key={s.label} className="dash-stat-card">
                <div className="dash-stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                <div><div className="dash-stat-value">{s.value}</div><div className="dash-stat-label">{s.label}</div></div>
              </div>
            ))}
          </div>

          {/* ── Overview ── */}
          {tab === 'overview' && (
            <div>
              <div className="dash-section-title">Recent Opportunities</div>
              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead><tr><th>Title</th><th>Type</th><th>Status</th><th>Location</th></tr></thead>
                  <tbody>
                    {opps.slice(0, 5).map(o => (
                      <tr key={o.id}>
                        <td style={{ fontWeight: 600 }}>{o.title}</td>
                        <td><span className={`badge ${TYPE_BADGE[o.type] || 'badge-blue'}`} style={{ textTransform: 'capitalize' }}>{o.type}</span></td>
                        <td><span className={`badge ${STATUS_BADGE[o.status] || 'badge-gray'}`}>{o.status}</span></td>
                        <td>{o.location || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Applications ── */}
          {tab === 'applications' && (
            <div>
              <div className="dash-section-title">All Applications ({apps.length})</div>
              {apps.length === 0 ? (
                <div className="empty-state"><p>No applications submitted yet.</p></div>
              ) : (
                <div className="dash-table-wrap">
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Applicant</th>
                        <th>Opportunity</th>
                        <th>Applied</th>
                        <th>Document</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apps.map(a => (
                        <tr key={a.id}>
                          <td style={{ color: 'var(--text-muted)' }}>#{a.id}</td>
                          <td style={{ fontWeight: 600 }}>{a.applicant_name || `Youth #${a.youth_id}`}</td>
                          <td>{a.opportunity_title || `Opp #${a.opportunity_id}`}</td>
                          <td>{new Date(a.applied_at).toLocaleDateString()}</td>
                          <td>
                            {a.document_url
                              ? <a href={`http://localhost:8000${a.document_url}`} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm"><FileText size={12} /> View</a>
                              : <span style={{ color: 'var(--text-muted)', fontSize: '.82rem' }}>—</span>}
                          </td>
                          <td>
                            <span className={`badge ${
                              a.status === 'accepted' ? 'badge-success' :
                              a.status === 'rejected' ? 'badge-red' :
                              a.status === 'shortlisted' ? 'badge-blue' :
                              a.status === 'interviewed' ? 'badge-amber' : 'badge-gray'
                            }`} style={{ textTransform: 'capitalize' }}>{a.status}</span>
                          </td>
                          <td style={{ display: 'flex', gap: '.4rem' }}>
                            {a.status !== 'accepted' && (
                              <button
                                className="btn btn-sm btn-green"
                                onClick={() => handleAppAction(a.id, 'approve')}
                                title="Approve"
                              >
                                <CheckCircle size={13} /> Approve
                              </button>
                            )}
                            {a.status !== 'rejected' && (
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleAppAction(a.id, 'reject')}
                                title="Reject"
                              >
                                <XCircle size={13} /> Reject
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Users ── */}
          {tab === 'users' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div className="dash-section-title" style={{ marginBottom: 0 }}>All Users ({filteredUsers.length})</div>
                <input
                  className="dash-search"
                  placeholder="Search by email or role..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead><tr><th>#</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id}>
                        <td style={{ color: 'var(--text-muted)' }}>#{u.id}</td>
                        <td>{u.email}</td>
                        <td><span className="badge badge-blue" style={{ textTransform: 'capitalize' }}>{u.role}</span></td>
                        <td><span className={`badge ${u.is_active ? 'badge-success' : 'badge-red'}`}>{u.is_active ? 'Active' : 'Inactive'}</span></td>
                        <td>
                          <button
                            className={`btn btn-sm ${u.is_active ? 'btn-danger' : 'btn-green'}`}
                            onClick={() => toggleUser(u.id, u.is_active)}
                          >
                            {u.is_active ? <><ToggleRight size={13} /> Deactivate</> : <><ToggleLeft size={13} /> Activate</>}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── All Opportunities ── */}
          {tab === 'opportunities' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div className="dash-section-title" style={{ marginBottom: 0 }}>All Opportunities ({opps.length})</div>
                <button className="btn btn-primary btn-sm" onClick={() => setTab('post')}><Plus size={13} /> Post New</button>
              </div>
              {opps.length === 0 ? (
                <div className="empty-state"><p>No opportunities yet.</p></div>
              ) : (
                <div className="dash-table-wrap">
                  <table className="dash-table">
                    <thead>
                      <tr><th>Title</th><th>Type</th><th>Status</th><th>Location</th><th>Deadline</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {opps.map(o => (
                        <tr key={o.id}>
                          <td style={{ fontWeight: 600 }}>{o.title}</td>
                          <td><span className={`badge ${TYPE_BADGE[o.type] || 'badge-blue'}`} style={{ textTransform: 'capitalize' }}>{o.type}</span></td>
                          <td><span className={`badge ${STATUS_BADGE[o.status] || 'badge-gray'}`}>{o.status}</span></td>
                          <td>{o.location || '—'}</td>
                          <td>{o.deadline ? new Date(o.deadline).toLocaleDateString() : '—'}</td>
                          <td style={{ display: 'flex', gap: '.4rem' }}>
                            <button
                              className={`btn btn-sm ${o.status === 'open' ? 'btn-danger' : 'btn-green'}`}
                              onClick={() => toggleOppStatus(o.id, o.status)}
                              title={o.status === 'open' ? 'Close' : 'Reopen'}
                            >
                              {o.status === 'open' ? <XCircle size={13} /> : <CheckCircle size={13} />}
                              {o.status === 'open' ? ' Close' : ' Open'}
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => deleteOpp(o.id)}
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Post Opportunity ── */}
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
                      <label className="form-label">Industry</label>
                      <input placeholder="e.g. Technology" value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Deadline</label>
                      <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
                    </div>
                  </div>

                  <div style={{ marginTop: '1.5rem', display: 'flex', gap: '.75rem' }}>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={posting}>{posting ? 'Posting...' : 'Post Opportunity'}</button>
                    <button type="button" className="btn btn-ghost" onClick={() => setForm(EMPTY_OPP)}>Reset</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ── Skills ── */}
          {tab === 'skills' && (
            <div>
              <div className="dash-section-title">Skills Management</div>
              <form onSubmit={addSkill} className="skill-add-form">
                <input
                  placeholder="New skill name (e.g. Python, Graphic Design)..."
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                />
                <button type="submit" className="btn btn-primary"><Plus size={15} /> Add Skill</button>
              </form>
              {skills.length === 0 ? (
                <div className="empty-state"><p>No skills added yet.</p></div>
              ) : (
                <div className="skills-grid">
                  {skills.map(s => (
                    <div key={s.id} className="skill-item">
                      <span className="skill-tag">{s.name}</span>
                      <button className="skill-delete-btn" onClick={() => deleteSkill(s.id)} title="Delete skill">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Payments ── */}
          {tab === 'payments' && (
            <div>
              <div className="dash-section-title">Payments</div>
              <div className="empty-state">
                <CreditCard size={40} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
                <p>No payment records yet.</p>
                <p style={{ fontSize: '.85rem', color: 'var(--text-muted)' }}>Payment transactions will appear here once processed.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
