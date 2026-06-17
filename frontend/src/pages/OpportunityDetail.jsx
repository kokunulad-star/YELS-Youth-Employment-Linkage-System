import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Calendar, Briefcase, DollarSign, BookOpen, Wifi } from 'lucide-react'
import api from '../lib/api'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

export default function OpportunityDetail() {
  const { id } = useParams()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [opp, setOpp] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    api.get(`/opportunities/${id}`)
      .then(({ data }) => setOpp(data))
      .catch(() => toast.error('Opportunity not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleApply = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    setApplying(true)
    try {
      await api.post('/applications/', {
        opportunity_id: parseInt(id),
        cover_letter: coverLetter,
      })
      toast.success('Application submitted!')
      setShowForm(false)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Could not apply')
    } finally {
      setApplying(false)
    }
  }

  if (loading) return <div className="page"><div className="container"><p>Loading...</p></div></div>
  if (!opp) return <div className="page"><div className="container"><p>Not found.</p></div></div>

  return (
    <div className="page">
      <div className="container container-narrow">
        <div className="detail-card">
          <div className="detail-header">
            <div className="detail-badges">
              <span className={`badge badge-${opp.type === 'job' ? 'blue' : opp.type === 'funding' ? 'green' : 'amber'}`}>
                {opp.type}
              </span>
              {opp.is_remote && <span className="badge badge-purple"><Wifi size={12} /> Remote</span>}
              <span className={`badge ${opp.status === 'open' ? 'badge-success' : 'badge-gray'}`}>
                {opp.status}
              </span>
            </div>
            <h1>{opp.title}</h1>
            <div className="detail-meta">
              {opp.location && <span><MapPin size={14} /> {opp.location}</span>}
              {opp.deadline && <span><Calendar size={14} /> Deadline: {new Date(opp.deadline).toLocaleDateString()}</span>}
              {opp.industry && <span><Briefcase size={14} /> {opp.industry}</span>}
            </div>
          </div>

          <div className="detail-body">
            <h3>Description</h3>
            <p>{opp.description}</p>

            {/* Job specific */}
            {opp.type === 'job' && (
              <div className="detail-extras">
                {opp.salary_range && <div><strong>Salary:</strong> {opp.salary_range}</div>}
                {opp.job_type && <div><strong>Job Type:</strong> {opp.job_type.replace('_', ' ')}</div>}
              </div>
            )}

            {/* Funding specific */}
            {opp.type === 'funding' && (
              <div className="detail-extras">
                {opp.funding_amount && <div><strong>Amount:</strong> ${Number(opp.funding_amount).toLocaleString()}</div>}
                {opp.funding_type && <div><strong>Type:</strong> {opp.funding_type}</div>}
              </div>
            )}

            {/* Training specific */}
            {opp.type === 'training' && (
              <div className="detail-extras">
                {opp.duration && <div><strong>Duration:</strong> {opp.duration}</div>}
                {opp.mode && <div><strong>Mode:</strong> {opp.mode.replace('_', ' ')}</div>}
              </div>
            )}

            {/* Required Skills */}
            {opp.required_skills?.length > 0 && (
              <div className="skills-section">
                <h4>Required Skills</h4>
                <div className="skills-list">
                  {opp.required_skills.map((s) => (
                    <span key={s.id} className="skill-tag">{s.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Apply button — only for youth */}
          {user?.role === 'youth' && opp.status === 'open' && (
            <div className="detail-actions">
              {!showForm ? (
                <button className="btn btn-primary btn-lg" onClick={() => setShowForm(true)}>
                  Apply Now
                </button>
              ) : (
                <form onSubmit={handleApply} className="apply-form">
                  <h4>Your Application</h4>
                  <div className="form-group">
                    <label>Cover Letter (optional)</label>
                    <textarea
                      rows={5}
                      placeholder="Introduce yourself and explain why you're a good fit..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                    />
                  </div>
                  <div className="form-row">
                    <button type="submit" className="btn btn-primary" disabled={applying}>
                      {applying ? 'Submitting...' : 'Submit Application'}
                    </button>
                    <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {!user && (
            <div className="detail-actions">
              <p>Want to apply? <a href="/login">Sign in</a> or <a href="/register">create an account</a>.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
