import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Clock, CheckCircle, User, Upload, Search, Bell, Edit2, Save, X, FileText, CreditCard } from 'lucide-react'
import api from '../../lib/api'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

const STATUS_BADGE = {
  pending:     'badge-gray',
  shortlisted: 'badge-blue',
  interviewed: 'badge-amber',
  accepted:    'badge-success',
  rejected:    'badge-red',
}

const PAY_STATUS_BADGE = {
  completed: 'badge-success',
  pending:   'badge-amber',
  failed:    'badge-red',
}

const METHOD_LABEL = {
  mpesa: 'M-Pesa',
  card:  'Card',
  bank:  'Bank Transfer',
}

// ── Payment Modal ─────────────────────────────────────────────────────────────
function PaymentModal({ opp, onClose, onSuccess }) {
  const [method, setMethod] = useState('mpesa')
  const [reference, setReference] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const { data } = await api.post('/payments/', {
        opportunity_id: opp.id,
        method,
        reference: reference.trim() || undefined,
      })
      toast.success('Payment details submitted! Your enrollment will be confirmed shortly.')
      onSuccess(data)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Submission failed')
    } finally { setSubmitting(false) }
  }

  const price = opp.funding_amount ? `TZS ${Number(opp.funding_amount).toLocaleString()}` : ''

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Payment Details</h3>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-body">
          <div className="payment-program-info">
            <div className="payment-program-name">{opp.title}</div>
            {price && <div className="payment-amount">{price}</div>}
          </div>

          <p style={{ fontSize: '.875rem', color: 'var(--text-muted)', margin: '1rem 0 .5rem' }}>
            Make your payment using any of the methods below, then enter your transaction reference so we can confirm your enrollment.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <div className="payment-methods">
                {[
                  { value: 'mpesa', label: 'M-Pesa', emoji: '📱' },
                  { value: 'bank',  label: 'Bank',   emoji: '🏦' },
                  { value: 'card',  label: 'Card',   emoji: '💳' },
                ].map(m => (
                  <button key={m.value} type="button"
                    className={`payment-method-btn${method === m.value ? ' active' : ''}`}
                    onClick={() => setMethod(m.value)}
                  >
                    <span className="payment-method-emoji">{m.emoji}</span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {method === 'mpesa' && (
              <div className="payment-details-box">
                <div className="payment-details-row"><span>Lipa Number</span><strong>154678</strong></div>
                <div className="payment-details-row"><span>Name</span><strong>DATIVA LUCAS</strong></div>
                {price && <div className="payment-details-row"><span>Amount</span><strong>{price}</strong></div>}
              </div>
            )}

            {method === 'bank' && (
              <div>
                <div className="payment-details-box" style={{ marginBottom: '.75rem' }}>
                  <div className="payment-details-label">CRDB Bank</div>
                  <div className="payment-details-row"><span>Account Number</span><strong>0150694823001</strong></div>
                  <div className="payment-details-row"><span>Account Name</span><strong>YELS PLATFORM CO.</strong></div>
                  {price && <div className="payment-details-row"><span>Amount</span><strong>{price}</strong></div>}
                </div>
                <div className="payment-details-box">
                  <div className="payment-details-label">NMB Bank</div>
                  <div className="payment-details-row"><span>Account Number</span><strong>40271089500</strong></div>
                  <div className="payment-details-row"><span>Account Name</span><strong>YELS PLATFORM CO.</strong></div>
                  {price && <div className="payment-details-row"><span>Amount</span><strong>{price}</strong></div>}
                </div>
              </div>
            )}

            {method === 'card' && (
              <div className="payment-details-box">
                <div className="payment-details-row"><span>Card payments</span><strong>Contact admin for card details</strong></div>
              </div>
            )}

            <div className="form-group" style={{ marginTop: '1.25rem' }}>
              <label className="form-label">
                Transaction Reference <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(required)</span>
              </label>
              <input
                placeholder={method === 'mpesa' ? 'e.g. QJK7T3XY9Z' : 'e.g. Bank slip / receipt number'}
                value={reference}
                onChange={e => setReference(e.target.value)}
                required
                style={{ textTransform: method === 'mpesa' ? 'uppercase' : 'none' }}
              />
              <p style={{ fontSize: '.78rem', color: 'var(--text-muted)', marginTop: '.3rem' }}>
                Enter the reference number from your payment receipt or SMS confirmation.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '.75rem', marginTop: '1.25rem' }}>
              <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 1 }} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Payment Reference'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// ── Payments Tab ──────────────────────────────────────────────────────────────
function PaymentsTab() {
  const [payments, setPayments]   = useState([])
  const [paidOpps, setPaidOpps]   = useState([])       // opportunity_ids already paid
  const [trainingOpps, setTrainingOpps] = useState([]) // paid training programs available
  const [payingOpp, setPayingOpp] = useState(null)     // opp being paid for
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/payments/my').catch(() => ({ data: [] })),
      api.get('/opportunities/?type=training').catch(() => ({ data: [] })),
    ]).then(([pRes, oRes]) => {
      const myPayments = pRes.data || []
      setPayments(myPayments)
      setPaidOpps(myPayments.filter(p => p.status === 'completed').map(p => p.opportunity_id))
      // Only show training opps that have a price (funding_amount > 0)
      setTrainingOpps((oRes.data || []).filter(o => o.funding_amount && Number(o.funding_amount) > 0))
    }).finally(() => setLoading(false))
  }, [])

  const handleSuccess = (newPayment) => {
    setPayments(prev => [newPayment, ...prev])
    setPaidOpps(prev => [...prev, newPayment.opportunity_id])
    setPayingOpp(null)
  }

  if (loading) return <div className="spinner" style={{ margin: '3rem auto' }} />

  return (
    <div>
      {payingOpp && (
        <PaymentModal
          opp={payingOpp}
          onClose={() => setPayingOpp(null)}
          onSuccess={handleSuccess}
        />
      )}

      {/* Available paid programs */}
      {trainingOpps.length > 0 && (
        <>
          <div className="dash-section-title">Available Paid Programs</div>
          <div className="payments-programs-grid">
            {trainingOpps.map(opp => {
              const paid = paidOpps.includes(opp.id)
              return (
                <div key={opp.id} className="payment-program-card">
                  <div className="payment-program-card-type">
                    <span className="badge badge-amber">Training</span>
                    {opp.industry && <span style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>{opp.industry}</span>}
                  </div>
                  <div className="payment-program-card-title">{opp.title}</div>
                  {opp.duration && <div style={{ fontSize: '.82rem', color: 'var(--text-muted)', marginBottom: '.5rem' }}>⏱ {opp.duration}</div>}
                  <div className="payment-program-card-price">TZS {Number(opp.funding_amount).toLocaleString()}</div>
                  {paid ? (
                    <span className="badge badge-success" style={{ marginTop: '.75rem' }}>✓ Enrolled</span>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ marginTop: '.75rem', width: '100%' }}
                      onClick={() => setPayingOpp(opp)}
                    >
                      <CreditCard size={13} /> Pay & Enroll
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Payment history */}
      <div className="dash-section-title" style={{ marginTop: trainingOpps.length > 0 ? '2rem' : 0 }}>Payment History</div>
      {payments.length === 0 ? (
        <div className="empty-state">
          <CreditCard size={40} style={{ color: 'var(--text-muted)', marginBottom: '.75rem' }} />
          <p>No payments yet.</p>
          <p style={{ fontSize: '.85rem', color: 'var(--text-muted)' }}>Payments for paid programs will appear here.</p>
        </div>
      ) : (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Program</th>
                <th>Amount (TZS)</th>
                <th>Method</th>
                <th>Reference</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id}>
                  <td style={{ color: 'var(--text-muted)' }}>#{p.id}</td>
                  <td style={{ fontWeight: 600 }}>{p.opportunity_title || `Program #${p.opportunity_id}`}</td>
                  <td>{Number(p.amount).toLocaleString()}</td>
                  <td>{METHOD_LABEL[p.method] || p.method}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '.82rem' }}>{p.reference || '—'}</td>
                  <td>{new Date(p.paid_at).toLocaleDateString()}</td>
                  <td><span className={`badge ${PAY_STATUS_BADGE[p.status] || 'badge-gray'}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const TABS = [
  { id: 'applications', label: 'My Applications',  icon: <Clock size={15} /> },
  { id: 'overview',     label: 'Overview',         icon: <Briefcase size={15} /> },
  { id: 'payments',     label: 'Payments',         icon: <CreditCard size={15} /> },
  { id: 'profile',      label: 'My Profile',       icon: <User size={15} /> },
]

const EMPTY_FORM = {
  first_name: '', last_name: '', phone: '', location: 'Dar es Salaam',
  bio: '', gender: '', date_of_birth: '',
  linkedin_url: '', github_url: '', portfolio_url: '',
}

export default function YouthDashboard() {
  const { user } = useAuthStore()
  const [profile, setProfile]           = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading]           = useState(true)
  const [tab, setTab]                   = useState('overview')
  const [editing, setEditing]           = useState(false)
  const [form, setForm]                 = useState(EMPTY_FORM)
  const [saving, setSaving]             = useState(false)

  useEffect(() => {
    Promise.all([
      api.get('/youth/profile/me').catch(() => null),
      api.get('/applications/my').catch(() => ({ data: [] })),
    ]).then(([pRes, aRes]) => {
      const p = pRes?.data || null
      setProfile(p)
      setApplications(aRes?.data || [])
      if (p) populateForm(p)
    }).finally(() => setLoading(false))
  }, [])

  const populateForm = (p) => {
    setForm({
      first_name:    p.first_name    || '',
      last_name:     p.last_name     || '',
      phone:         p.phone         || '',
      location:      p.location      || 'Dar es Salaam',
      bio:           p.bio           || '',
      gender:        p.gender        || '',
      date_of_birth: p.date_of_birth || '',
      linkedin_url:  p.linkedin_url  || '',
      github_url:    p.github_url    || '',
      portfolio_url: p.portfolio_url || '',
    })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.first_name.trim() || !form.last_name.trim()) {
      return toast.error('First name and last name are required')
    }
    setSaving(true)
    try {
      const payload = { ...form }
      if (!payload.gender) delete payload.gender
      if (!payload.date_of_birth) delete payload.date_of_birth

      let res
      if (profile) {
        res = await api.put('/youth/profile/me', payload)
      } else {
        res = await api.post('/youth/profile', payload)
      }
      setProfile(res.data)
      populateForm(res.data)
      setEditing(false)
      toast.success(profile ? 'Profile updated!' : 'Profile created!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to save profile')
    } finally { setSaving(false) }
  }

  const stats = [
    { label: 'Total Applied', value: applications.length,                                        icon: <Briefcase size={20} />, bg: '#dbeafe', color: '#2563eb' },
    { label: 'Pending',       value: applications.filter(a => a.status === 'pending').length,     icon: <Clock size={20} />,     bg: '#fef3c7', color: '#f59e0b' },
    { label: 'Shortlisted',   value: applications.filter(a => a.status === 'shortlisted').length, icon: <Bell size={20} />,      bg: '#ede9fe', color: '#7c3aed' },
    { label: 'Accepted',      value: applications.filter(a => a.status === 'accepted').length,    icon: <CheckCircle size={20} />,bg: '#d1fae5', color: '#10b981' },
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
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="nav-logo-icon">Y</div>
          <span>YELS</span>
        </div>
        <div className="sidebar-section">Youth Portal</div>
        {TABS.map(t => (
          <button key={t.id} className={`sidebar-link${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
            {t.icon} <span>{t.label}</span>
          </button>
        ))}
        <div className="sidebar-section">Explore</div>
        <Link to="/opportunities" className="sidebar-link">
          <Search size={15} /> <span>Browse Opportunities</span>
        </Link>
        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{user?.role?.[0]?.toUpperCase()}</div>
            <div>
              <div className="sidebar-user-name">{profile ? `${profile.first_name} ${profile.last_name}` : 'Youth Account'}</div>
              <div className="sidebar-user-role">{user?.role}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="dash-main">
        <div className="dash-topbar">
          <div>
            <h1 className="dash-title">Youth Dashboard</h1>
            <p className="dash-sub">Track your applications and manage your profile</p>
          </div>
          <Link to="/opportunities" className="btn btn-primary"><Search size={14} /> Find Opportunities</Link>
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

          {/* No profile warning banner */}
          {!profile && tab !== 'profile' && (
            <div className="profile-warning-banner">
              <User size={16} />
              <span>Complete your profile before applying for opportunities.</span>
              <button className="btn btn-primary btn-sm" onClick={() => { setTab('profile'); setEditing(true) }}>
                Set Up Profile
              </button>
            </div>
          )}

          {/* ── Overview ── */}
          {tab === 'overview' && (
            <div>
              <div className="dash-section-title">Recent Applications</div>
              {applications.length === 0 ? (
                <div className="empty-state">
                  <Briefcase size={40} style={{ margin: '0 auto .75rem', opacity: .25 }} />
                  <p>No applications yet.</p>
                  <Link to="/opportunities" className="btn btn-primary" style={{ marginTop: '.5rem' }}>Browse Opportunities</Link>
                </div>
              ) : (
                <div className="dash-table-wrap">
                  <table className="dash-table">
                    <thead><tr><th>Opportunity</th><th>Applied</th><th>Status</th><th>Document</th></tr></thead>
                    <tbody>
                      {applications.slice(0, 5).map(app => (
                        <tr key={app.id}>
                          <td><Link to={`/opportunities/${app.opportunity_id}`}>Opportunity #{app.opportunity_id}</Link></td>
                          <td>{new Date(app.applied_at).toLocaleDateString()}</td>
                          <td><span className={`badge ${STATUS_BADGE[app.status] || 'badge-gray'}`}>{app.status}</span></td>
                          <td>
                            {app.document_url
                              ? <a href={`http://localhost:8000${app.document_url}`} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm"><FileText size={12} /> View</a>
                              : <span style={{ color: 'var(--text-muted)', fontSize: '.82rem' }}>—</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Applications ── */}
          {tab === 'applications' && (
            <div>
              <div className="dash-section-title">All Applications ({applications.length})</div>
              {applications.length === 0 ? (
                <div className="empty-state">
                  <p>No applications yet. <Link to="/opportunities">Browse opportunities</Link> to get started.</p>
                </div>
              ) : (
                <div className="dash-table-wrap">
                  <table className="dash-table">
                    <thead><tr><th>Opportunity</th><th>Applied</th><th>Status</th><th>Updated</th><th>Document</th></tr></thead>
                    <tbody>
                      {applications.map(app => (
                        <tr key={app.id}>
                          <td><Link to={`/opportunities/${app.opportunity_id}`} className="dash-link">#{app.opportunity_id}</Link></td>
                          <td>{new Date(app.applied_at).toLocaleDateString()}</td>
                          <td><span className={`badge ${STATUS_BADGE[app.status] || 'badge-gray'}`}>{app.status}</span></td>
                          <td>{new Date(app.updated_at).toLocaleDateString()}</td>
                          <td>
                            {app.document_url
                              ? <a href={`http://localhost:8000${app.document_url}`} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm"><FileText size={12} /> View</a>
                              : <span style={{ color: 'var(--text-muted)', fontSize: '.82rem' }}>—</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Profile ── */}
          {tab === 'profile' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div className="dash-section-title" style={{ marginBottom: 0 }}>My Profile</div>
                {profile && !editing && (
                  <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>
                    <Edit2 size={13} /> Edit Profile
                  </button>
                )}
              </div>

              {/* ── View mode ── */}
              {profile && !editing && (
                <div className="profile-card">
                  <div className="profile-card-header">
                    <div className="profile-avatar" style={{ fontSize: '1.5rem' }}>
                      {profile.first_name?.[0]}{profile.last_name?.[0]}
                    </div>
                    <div>
                      <h2>{profile.first_name} {profile.last_name}</h2>
                      <p style={{ color: 'var(--text-muted)' }}>{profile.location || 'Location not set'}</p>
                      {profile.phone && <p style={{ fontSize: '.85rem', color: 'var(--text-muted)' }}>📞 {profile.phone}</p>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', marginTop: '.5rem' }}>
                    {profile.github_url    && <a href={profile.github_url}    target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">GitHub</a>}
                    {profile.portfolio_url && <a href={profile.portfolio_url} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">Portfolio</a>}
                  </div>
                  {profile.youth_skills?.length > 0 && (
                    <div className="profile-skills" style={{ marginTop: '1rem' }}>
                      <h4>Skills</h4>
                      <div className="skills-list">
                        {profile.youth_skills.map(ys => (
                          <span key={ys.skill?.id} className="skill-tag">{ys.skill?.name}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Create / Edit form ── */}
              {(!profile || editing) && (
                <div className="post-form-card">
                  {!profile && (
                    <div style={{ marginBottom: '1.25rem', padding: '.75rem 1rem', background: '#eff6ff', borderRadius: 'var(--radius-sm)', border: '1px solid #bfdbfe', color: '#1d4ed8', fontSize: '.875rem' }}>
                      You need to complete your profile before you can apply for opportunities.
                    </div>
                  )}
                  <form onSubmit={handleSave}>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">First Name *</label>
                        <input placeholder="e.g. John" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Last Name *</label>
                        <input placeholder="e.g. Doe" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} required />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Phone</label>
                        <input placeholder="+255 700 000 000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Gender</label>
                        <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Date of Birth</label>
                        <input type="date" value={form.date_of_birth} onChange={e => setForm({ ...form, date_of_birth: e.target.value })} />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <input value={form.location} disabled style={{ background: 'var(--bg-subtle,#f4f4f5)', color: 'var(--text-muted)' }} />
                    </div>

<div className="form-row">
                      <div className="form-group">
                        <label className="form-label">GitHub URL</label>
                        <input placeholder="https://github.com/..." value={form.github_url} onChange={e => setForm({ ...form, github_url: e.target.value })} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '.75rem', marginTop: '1.5rem' }}>
                      <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                        <Save size={15} /> {saving ? 'Saving...' : profile ? 'Save Changes' : 'Create Profile'}
                      </button>
                      {editing && profile && (
                        <button type="button" className="btn btn-ghost" onClick={() => { setEditing(false); populateForm(profile) }}>
                          <X size={15} /> Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ── Payments ── */}
          {tab === 'payments' && (
            <PaymentsTab />
          )}
        </div>
      </main>
    </div>
  )
}
