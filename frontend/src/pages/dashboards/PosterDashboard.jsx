import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Users, Eye } from 'lucide-react'
import api from '../../lib/api'
import toast from 'react-hot-toast'
import useAuthStore from '../../store/authStore'

const STATUS_OPTIONS = ['pending', 'shortlisted', 'interviewed', 'accepted', 'rejected']

export default function PosterDashboard() {
  const { user } = useAuthStore()
  const [opportunities, setOpportunities] = useState([])
  const [selectedOpp, setSelectedOpp] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('opportunities')

  useEffect(() => {
    api.get('/opportunities/').then(({ data }) => {
      // only show mine
      setOpportunities(data.filter(o => o.posted_by === user?.id))
    }).catch(() => toast.error('Failed to load opportunities'))
      .finally(() => setLoading(false))
  }, [])

  const loadApplications = async (oppId) => {
    setSelectedOpp(oppId)
    try {
      const { data } = await api.get(`/applications/opportunity/${oppId}`)
      setApplications(data)
      setTab('applications')
    } catch {
      toast.error('Failed to load applications')
    }
  }

  const updateStatus = async (appId, status) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status })
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a))
      toast.success('Status updated')
    } catch {
      toast.error('Update failed')
    }
  }

  if (loading) return <div className="page"><div className="container"><p>Loading...</p></div></div>

  return (
    <div className="page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Poster Dashboard</h1>
            <p>Manage your posted opportunities and review applications</p>
          </div>
          <Link to="/opportunities/new" className="btn btn-primary">
            <Plus size={16} /> Post Opportunity
          </Link>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button className={`tab ${tab === 'opportunities' ? 'active' : ''}`} onClick={() => setTab('opportunities')}>
            My Opportunities ({opportunities.length})
          </button>
          {selectedOpp && (
            <button className={`tab ${tab === 'applications' ? 'active' : ''}`} onClick={() => setTab('applications')}>
              Applications ({applications.length})
            </button>
          )}
        </div>

        {/* Opportunities */}
        {tab === 'opportunities' && (
          <div className="table-wrapper">
            {opportunities.length === 0 ? (
              <div className="empty-state">
                <p>No opportunities posted yet.</p>
                <Link to="/opportunities/new" className="btn btn-primary">Post Your First Opportunity</Link>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Deadline</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {opportunities.map((opp) => (
                    <tr key={opp.id}>
                      <td>{opp.title}</td>
                      <td><span className="badge badge-blue">{opp.type}</span></td>
                      <td><span className={`badge ${opp.status === 'open' ? 'badge-success' : 'badge-gray'}`}>{opp.status}</span></td>
                      <td>{opp.deadline ? new Date(opp.deadline).toLocaleDateString() : '—'}</td>
                      <td>
                        <button className="btn-sm btn-outline" onClick={() => loadApplications(opp.id)}>
                          <Users size={14} /> View Applications
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Applications */}
        {tab === 'applications' && (
          <div className="table-wrapper">
            {applications.length === 0 ? (
              <div className="empty-state"><p>No applications received yet.</p></div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Applicant ID</th>
                    <th>Applied</th>
                    <th>Status</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td>Youth #{app.youth_id}</td>
                      <td>{new Date(app.applied_at).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge badge-${app.status === 'accepted' ? 'success' : app.status === 'rejected' ? 'red' : 'blue'}`}>
                          {app.status}
                        </span>
                      </td>
                      <td>
                        <select
                          value={app.status}
                          onChange={(e) => updateStatus(app.id, e.target.value)}
                          className="select-sm"
                        >
                          {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
