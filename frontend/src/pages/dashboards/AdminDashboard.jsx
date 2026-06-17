import { useState, useEffect } from 'react'
import { Users, Tag, ToggleLeft, ToggleRight, Trash2, Plus } from 'lucide-react'
import api from '../../lib/api'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [skills, setSkills] = useState([])
  const [newSkill, setNewSkill] = useState('')
  const [tab, setTab] = useState('users')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/admin/users'),
      api.get('/admin/skills'),
    ]).then(([usersRes, skillsRes]) => {
      setUsers(usersRes.data)
      setSkills(skillsRes.data)
    }).catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false))
  }, [])

  const toggleUser = async (id, isActive) => {
    try {
      await api.patch(`/admin/users/${id}/${isActive ? 'deactivate' : 'activate'}`)
      setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: !isActive } : u))
      toast.success(`User ${isActive ? 'deactivated' : 'activated'}`)
    } catch {
      toast.error('Action failed')
    }
  }

  const addSkill = async (e) => {
    e.preventDefault()
    if (!newSkill.trim()) return
    try {
      const { data } = await api.post('/admin/skills', { name: newSkill.trim() })
      setSkills(prev => [...prev, data])
      setNewSkill('')
      toast.success('Skill added')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to add skill')
    }
  }

  const deleteSkill = async (id) => {
    try {
      await api.delete(`/admin/skills/${id}`)
      setSkills(prev => prev.filter(s => s.id !== id))
      toast.success('Skill deleted')
    } catch {
      toast.error('Delete failed')
    }
  }

  if (loading) return <div className="page"><div className="container"><p>Loading...</p></div></div>

  return (
    <div className="page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage users and platform skills</p>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <Users size={24} />
            <div><strong>{users.length}</strong><span>Total Users</span></div>
          </div>
          <div className="stat-card">
            <Tag size={24} />
            <div><strong>{skills.length}</strong><span>Skills</span></div>
          </div>
          <div className="stat-card">
            <Users size={24} />
            <div>
              <strong>{users.filter(u => u.role === 'youth').length}</strong>
              <span>Youth</span>
            </div>
          </div>
          <div className="stat-card">
            <Users size={24} />
            <div>
              <strong>{users.filter(u => u.is_active).length}</strong>
              <span>Active Users</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button className={`tab ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>
            Users ({users.length})
          </button>
          <button className={`tab ${tab === 'skills' ? 'active' : ''}`} onClick={() => setTab('skills')}>
            Skills ({skills.length})
          </button>
        </div>

        {/* Users */}
        {tab === 'users' && (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td>{u.email}</td>
                    <td><span className="badge badge-blue">{u.role}</span></td>
                    <td>
                      <span className={`badge ${u.is_active ? 'badge-success' : 'badge-red'}`}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn-sm ${u.is_active ? 'btn-outline' : 'btn-primary'}`}
                        onClick={() => toggleUser(u.id, u.is_active)}
                      >
                        {u.is_active ? <><ToggleRight size={14} /> Deactivate</> : <><ToggleLeft size={14} /> Activate</>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Skills */}
        {tab === 'skills' && (
          <div>
            <form onSubmit={addSkill} className="add-skill-form">
              <input
                placeholder="New skill name..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                <Plus size={16} /> Add Skill
              </button>
            </form>
            <div className="skills-manage-list">
              {skills.map((s) => (
                <div key={s.id} className="skill-manage-item">
                  <span className="skill-tag">{s.name}</span>
                  <button className="icon-btn danger" onClick={() => deleteSkill(s.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
