import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Clock, CheckCircle, XCircle, User, Upload, Search, Bell } from 'lucide-react'
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

const TABS = [
  { id: 'overview',      label: 'Overview',      icon: <Briefcase size={15} /> },
  { id: 'applications',  label: 'My Applications', icon: <Clock size={15} /> },
  { id: 'profile',       label: 'My Profile',    icon: <User size={15} /> },
]

export default function YouthDashboard() {
  const { user } = useAuthStore()
  const [profile, setProfile] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('overview')

  useEffect(() => {
    Promise.all([
      api.get('/youth/profile/me').catch(() => null),
      api.get('/applications/my').catch(() => ({ data: [] })),
    ]).then(([pRes, aRes]) => {
      setProfile(pRes?.data || null)
      setApplications(aRes?.data || [])
    }).finally(() => setLoading(false))
  }, [])

  const handleCvUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    try {
      await api.post('/youth/profile/me/upload-cv', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('CV uploaded!')
    } catch { toast.error('Upload failed') }
  }

  const stats = [
    { label: 'Total Applied',  value: applications.length,                                         icon: <Briefcase size={20} />, bg: '#dbeafe', color: '#2563eb' },
    { label: 'Pending',        value: applications.filter(a => a.status === 'pending').length,      icon: <Clock size={20} />,     bg: '#fef3c7', color: '#f59e0b' },
    { label: 'Shortlisted',    value: applications.filter(a => a.status === 'shortlisted').length,  icon: <Bell size={20} />,      bg: '#ede9fe', color: '#7c3aed' },
    { label: 'Accepted',       value: applications.filter(a => a.status === 'accepted').length,     icon: <CheckCircle size={20} />,bg: '#d1fae5', color: '#10b981' },
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
            <div><div className="sidebar-user-name">Youth Account</div><div className="sidebar-user-role">{user?.role}</div></div>
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
                <div>
                  <div className="dash-stat-value">{s.value}</div>
                  <div className="dash-stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tab: Overview */}
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
                    <thead><tr><th>Opportunity</th><th>Applied</th><th>Status</th></tr></thead>
                    <tbody>
                      {applications.slice(0, 5).map(app => (
                        <tr key={app.id}>
                          <td><Link to={`/opportunities/${app.opportunity_id}`}>Opportunity #{app.opportunity_id}</Link></td>
                          <td>{new Date(app.applied_at).toLocaleDateString()}</td>
                          <td><span className={`badge ${STATUS_BADGE[app.status] || 'badge-gray'}`}>{app.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab: Applications */}
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
                    <thead><tr><th>Opportunity</th><th>Applied</th><th>Status</th><th>Last Updated</th></tr></thead>
                    <tbody>
                      {applications.map(app => (
                        <tr key={app.id}>
                          <td><Link to={`/opportunities/${app.opportunity_id}`} className="dash-link">#{app.opportunity_id}</Link></td>
                          <td>{new Date(app.applied_at).toLocaleDateString()}</td>
                          <td><span className={`badge ${STATUS_BADGE[app.status] || 'badge-gray'}`}>{app.status}</span></td>
                          <td>{new Date(app.updated_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab: Profile */}
          {tab === 'profile' && (
            <div>
              <div className="dash-section-title">My Profile</div>
              {profile ? (
                <div className="profile-card">
                  <div className="profile-card-header">
                    <div className="profile-avatar">{profile.first_name?.[0]}{profile.last_name?.[0]}</div>
                    <div>
                      <h2>{profile.first_name} {profile.last_name}</h2>
                      <p>{profile.location || 'Location not set'}</p>
                    </div>
                  </div>
                  {profile.bio && <p className="profile-bio">{profile.bio}</p>}
                  {profile.youth_skills?.length > 0 && (
                    <div className="profile-skills">
                      <h4>Skills</h4>
                      <div className="skills-list">
                        {profile.youth_skills.map(ys => (
                          <span key={ys.skill?.id} className="skill-tag">{ys.skill?.name}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="profile-actions">
                    <label className="btn btn-outline" style={{ cursor: 'pointer' }}>
                      <Upload size={14} /> Upload CV
                      <input type="file" accept=".pdf,.doc,.docx" hidden onChange={handleCvUpload} />
                    </label>
                    {profile.cv_url && (
                      <span className="badge badge-success">✓ CV Uploaded</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <User size={40} style={{ margin: '0 auto .75rem', opacity: .25 }} />
                  <p>You haven&apos;t set up your profile yet.</p>
                  <p style={{ fontSize: '.85rem', color: 'var(--text-muted)', marginTop: '.25rem' }}>
                    A complete profile helps employers find you.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
