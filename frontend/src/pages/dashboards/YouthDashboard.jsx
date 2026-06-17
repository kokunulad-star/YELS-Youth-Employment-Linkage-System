import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Clock, CheckCircle, XCircle, User, Upload } from 'lucide-react'
import api from '../../lib/api'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  pending: 'badge-gray',
  shortlisted: 'badge-blue',
  interviewed: 'badge-amber',
  accepted: 'badge-success',
  rejected: 'badge-red',
}

export default function YouthDashboard() {
  const [profile, setProfile] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('applications')

  useEffect(() => {
    Promise.all([
      api.get('/youth/profile/me').catch(() => null),
      api.get('/applications/my').catch(() => []),
    ]).then(([profileRes, appsRes]) => {
      setProfile(profileRes?.data || null)
      setApplications(appsRes?.data || [])
    }).finally(() => setLoading(false))
  }, [])

  const handleCvUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const form = new FormData()
    form.append('file', file)
    try {
      await api.post('/youth/profile/me/upload-cv', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      toast.success('CV uploaded!')
    } catch {
      toast.error('Upload failed')
    }
  }

  if (loading) return <div className="page"><div className="container"><p>Loading...</p></div></div>

  return (
    <div className="page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>My Dashboard</h1>
            <p>Track your applications and manage your profile</p>
          </div>
          <Link to="/opportunities" className="btn btn-primary">Browse Opportunities</Link>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <Briefcase size={24} />
            <div>
              <strong>{applications.length}</strong>
              <span>Total Applications</span>
            </div>
          </div>
          <div className="stat-card">
            <Clock size={24} />
            <div>
              <strong>{applications.filter(a => a.status === 'pending').length}</strong>
              <span>Pending</span>
            </div>
          </div>
          <div className="stat-card">
            <CheckCircle size={24} />
            <div>
              <strong>{applications.filter(a => a.status === 'accepted').length}</strong>
              <span>Accepted</span>
            </div>
          </div>
          <div className="stat-card">
            <XCircle size={24} />
            <div>
              <strong>{applications.filter(a => a.status === 'rejected').length}</strong>
              <span>Rejected</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button className={`tab ${tab === 'applications' ? 'active' : ''}`} onClick={() => setTab('applications')}>
            Applications
          </button>
          <button className={`tab ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>
            My Profile
          </button>
        </div>

        {/* Applications Tab */}
        {tab === 'applications' && (
          <div className="table-wrapper">
            {applications.length === 0 ? (
              <div className="empty-state">
                <p>No applications yet. <Link to="/opportunities">Browse opportunities</Link> to get started.</p>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Opportunity</th>
                    <th>Applied</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td>
                        <Link to={`/opportunities/${app.opportunity_id}`}>
                          Opportunity #{app.opportunity_id}
                        </Link>
                      </td>
                      <td>{new Date(app.applied_at).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${STATUS_COLORS[app.status]}`}>
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {tab === 'profile' && (
          <div className="profile-section">
            {profile ? (
              <div className="profile-card">
                <div className="profile-info">
                  <div className="avatar">{profile.first_name?.[0]}{profile.last_name?.[0]}</div>
                  <div>
                    <h3>{profile.first_name} {profile.last_name}</h3>
                    <p>{profile.location || 'No location set'}</p>
                  </div>
                </div>
                <p>{profile.bio || 'No bio added yet.'}</p>
                <div className="skills-list">
                  {profile.youth_skills?.map((ys) => (
                    <span key={ys.skill?.id} className="skill-tag">{ys.skill?.name}</span>
                  ))}
                </div>
                <div className="profile-actions">
                  <label className="btn btn-outline" style={{ cursor: 'pointer' }}>
                    <Upload size={16} /> Upload CV
                    <input type="file" accept=".pdf,.doc,.docx" hidden onChange={handleCvUpload} />
                  </label>
                  <Link to="/profile/edit" className="btn btn-primary">Edit Profile</Link>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p>You haven't set up your profile yet.</p>
                <Link to="/profile/setup" className="btn btn-primary">Set Up Profile</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
