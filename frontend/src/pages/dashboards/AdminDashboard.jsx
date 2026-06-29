import { useState, useEffect } from 'react'
import { Users, Tag, ToggleLeft, ToggleRight, Trash2, Plus, BarChart2, Shield } from 'lucide-react'
import api from '../../lib/api'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

const TABS = [
  { id: 'overview', label: 'Overview',  icon: <BarChart2 size={15} /> },
  { id: 'users',    label: 'Users',     icon: <Users size={15} /> },
  { id: 'skills',   label: 'Skills',    icon: <Tag size={15} /> },
]

export default function AdminDashboard() {
  const { user } = useAuthStore()
  const [users, setUsers] = useState([])
  const [skills, setSkills] = useState([])
  const [newSkill, setNewSkill] = useState('')
  const [tab, setTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    Promise.all([api.get('/admin/users'), api.get('/admin/skills')])
      .then(([u, s]) => { setUsers(u.data); setSkills(s.data) })
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false))
  }, [])

  const toggleUser = async (id, isActive) => {
    try {
      await api.patch(`/admin/users/${id}/${isActive ? 'deactivate' : 'activate'}`)
      setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: !isActive } : u))
      toast.success(`User ${isActive ? 'deactivated' : 'activated'}`)
    } catch { toast.error('Action failed') }
  }

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

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  )

  const stats = [
    { label: 'Total Users',    value: users.length,                                bg: '#dbeafe', color: '#2563eb', icon: <Users size={20} /> },
    { label: 'Youth',          value: users.filter(u => u.role === 'youth').length,  bg: '#d1fae5', color: '#10b981', icon: <Users size={20} /> },
    { label: 'Organizations',  value: users.filter(u => u.role === 'organization').length, bg: '#fef3c7', color: '#f59e0b', icon: <Shield size={20} /> },
    { label: 'Skills Listed',  value: skills.length,                               bg: '#ede9fe', color: '#7c3aed', icon: <Tag size={20} /> },
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
            <p className="dash-sub">Manage users and platform configuration</p>
          </div>
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
              <div className="dash-section-title">User Breakdown</div>
              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead><tr><th>Role</th><th>Count</th><th>Active</th></tr></thead>
                  <tbody>
                    {['youth', 'organization', 'admin'].map(role => {
                      const roleUsers = users.filter(u => u.role === role)
                      return (
                        <tr key={role}>
                          <td><span className="badge badge-blue" style={{ textTransform: 'capitalize' }}>{role}</span></td>
                          <td>{roleUsers.length}</td>
                          <td>{roleUsers.filter(u => u.is_active).length}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Users */}
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
                            {u.is_active
                              ? <><ToggleRight size={13} /> Deactivate</>
                              : <><ToggleLeft size={13} /> Activate</>}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Skills */}
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
        </div>
      </main>
    </div>
  )
}
