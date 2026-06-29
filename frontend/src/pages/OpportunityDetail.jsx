import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { MapPin, Calendar, Briefcase, ArrowLeft, DollarSign, BookOpen } from 'lucide-react'
import api from '../lib/api'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

export default function OpportunityDetail() {
  const { id } = useParams()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [opp, setOpp] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cover, setCover] = useState('')
  const [applying, setApplying] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    api.get(`/opportunities/${id}`)
      .then(({ data }) => setOpp(data))
      .catch(() => { toast.error('Opportunity not found'); navigate('/opportunities') })
      .finally(() => setLoading(false))
  }, [id])

  const handleApply = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    setApplying(true)
    try {
      await api.post('/applications/', { opportunity_id: parseInt(id), cover_letter: cover })
      toast.success('Application submitted successfully!')
      setShowForm(false)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Could not apply')
    } finally { setApplying(false) }
  }

  if (loading) return (
    <div className="page-container" style={{ padding: '3rem 0' }}>
      <div className="skeleton" style={{ height: 400, borderRadius: '1rem' }} />
    </div>
  )

  if (!opp) return null

  const typeColor = { job: 'badge-blue', funding: 'badge-green', training: 'badge-amber' }[opp.type] || 'badge-blue'

  return (
    <div className="opp-detail-page">
      <div className="page-container">
        <Link to="/opportunities" className="back-link">
          <ArrowLeft size={15} /> Back to Opportunities
        </Link>

        <div className="opp-detail-card">
          {/* Header */}
          <div className="opp-detail-header">
            <div className="opp-detail-badges">
              <span className={`badge ${typeColor}`} style={{ textTransform: 'capitalize' }}>{opp.type}</span>
              {opp.is_remote && <span className="badge badge-purple">Remote</span>}
              <span className={`badge ${opp.status === 'open' ? 'badge-success' : 'badge-gray'}`}>{opp.status}</span>
            </div>
            <h1 className="opp-detail-title">{opp.title}</h1>
            <div className="opp-detail-meta">
              {opp.location && <span><MapPin size={14} /> {opp.location}</span>}
              {opp.deadline && <span><Calendar size={14} /> Deadline: {new Date(opp.deadline).toLocaleDateString()}</span>}
              {opp.industry && <span><Briefcase size={14} /> {opp.industry}</span>}
            </div>
            {opp.salary_range && <div className="opp-detail-highlight" style={{ color: 'var(--primary)' }}>💰 Salary: {opp.salary_range}</div>}
            {opp.funding_amount && <div className="opp-detail-highlight" style={{ color: 'var(--green)' }}>💵 Funding: ${Number(opp.funding_amount).toLocaleString()} — {opp.funding_type}</div>}
            {opp.duration && <div className="opp-detail-highlight" style={{ color: 'var(--accent)' }}>⏱ Duration: {opp.duration} · {opp.mode?.replace('_', ' ')}</div>}
          </div>

          {/* Body */}
          <div className="opp-detail-body">
            <h3>Description</h3>
            <p style={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{opp.description}</p>

            {opp.job_type && (
              <div className="opp-detail-extra-row">
                <span className="badge badge-blue" style={{ textTransform: 'capitalize' }}>{opp.job_type.replace('_', ' ')}</span>
              </div>
            )}

            {opp.required_skills?.length > 0 && (
              <div className="opp-skills-section">
                <h4>Required Skills</h4>
                <div className="opp-skills-list">
                  {opp.required_skills.map(s => (
                    <span key={s.id} className="skill-tag">{s.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Apply section */}
          <div className="opp-detail-footer">
            {user?.role === 'youth' && opp.status === 'open' ? (
              !showForm ? (
                <button className="btn btn-primary btn-lg" onClick={() => setShowForm(true)}>
                  Apply Now
                </button>
              ) : (
                <form onSubmit={handleApply} className="apply-form">
                  <h3>Submit Your Application</h3>
                  <div className="form-group">
                    <label className="form-label">Cover Letter <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                    <textarea
                      rows={5}
                      placeholder="Introduce yourself and explain why you're a great fit..."
                      value={cover}
                      onChange={e => setCover(e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '.75rem' }}>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={applying}>
                      {applying ? 'Submitting...' : 'Submit Application'}
                    </button>
                    <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              )
            ) : !user ? (
              <div className="auth-prompt">
                <p>Want to apply for this opportunity?</p>
                <div style={{ display: 'flex', gap: '.75rem', marginTop: '.75rem' }}>
                  <Link to="/login" className="btn btn-primary">Sign In</Link>
                  <Link to="/register" className="btn btn-outline">Create Account</Link>
                </div>
              </div>
            ) : user?.role !== 'youth' ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>Only youth accounts can apply for opportunities.</p>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>This opportunity is currently closed.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
