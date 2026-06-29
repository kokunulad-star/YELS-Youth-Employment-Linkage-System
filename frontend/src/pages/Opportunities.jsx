import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, DollarSign, BookOpen, Lightbulb, MapPin, Calendar } from 'lucide-react'
import api from '../lib/api'
import toast from 'react-hot-toast'

const FIXED_LOCATION = 'Dar es Salaam'

const TYPE_META = {
  job:       { cls: 'badge-blue',   icon: <Briefcase size={12} />,  label: 'Job' },
  funding:   { cls: 'badge-green',  icon: <DollarSign size={12} />, label: 'Funding' },
  training:  { cls: 'badge-amber',  icon: <BookOpen size={12} />,   label: 'Training' },
  innovation:{ cls: 'badge-purple', icon: <Lightbulb size={12} />,  label: 'Innovation' },
}

export default function Opportunities() {
  const [opps, setOpps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/opportunities/', { params: { location: FIXED_LOCATION } })
      .then(({ data }) => setOpps(data))
      .catch(() => toast.error('Failed to load opportunities'))
      .finally(() => setLoading(false))
  }, [])

  const meta = (type) => TYPE_META[type] || TYPE_META.job

  return (
    <div className="opp-page">
      <div className="page-container">

        {/* Header */}
        <div className="opp-page-header">
          <div>
            <h1>Available Opportunities</h1>
            <p>
              Browse open opportunities in{' '}
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                <MapPin size={13} style={{ verticalAlign: 'middle' }} /> {FIXED_LOCATION}
              </span>
            </p>
          </div>
          <span className="opp-count-badge">{opps.length} available</span>
        </div>

        {/* Results */}
        {loading ? (
          <div className="cards-grid">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton-card" />)}
          </div>
        ) : opps.length === 0 ? (
          <div className="empty-state">
            <Briefcase size={48} style={{ margin: '0 auto 1rem', opacity: 0.25 }} />
            <p>No opportunities available at the moment. Check back soon.</p>
          </div>
        ) : (
          <div className="cards-grid">
            {opps.map(opp => {
              const m = meta(opp.type)
              return (
                <div key={opp.id} className="opp-card">
                  <div className="opp-card-top">
                    <span className={`badge ${m.cls}`}>{m.icon} {m.label}</span>
                    <span className="badge badge-success">Open</span>
                  </div>
                  <h3 className="opp-card-title">{opp.title}</h3>
                  <p className="opp-card-desc">{opp.description?.slice(0, 120)}...</p>
                  <div className="opp-card-meta">
                    {opp.location && <span><MapPin size={12} /> {opp.location}</span>}
                    {opp.deadline && <span><Calendar size={12} /> {new Date(opp.deadline).toLocaleDateString()}</span>}
                    {opp.industry && <span>🏭 {opp.industry}</span>}
                  </div>
                  {opp.salary_range   && <div className="opp-card-highlight">💰 {opp.salary_range}</div>}
                  {opp.funding_amount && <div className="opp-card-highlight" style={{ color: 'var(--green)' }}>💵 ${Number(opp.funding_amount).toLocaleString()}</div>}
                  <div className="opp-card-footer">
                    <Link to={`/opportunities/${opp.id}`} className="btn btn-primary btn-sm">
                      View & Apply
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
