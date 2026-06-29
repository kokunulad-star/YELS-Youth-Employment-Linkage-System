import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, DollarSign, BookOpen, Lightbulb, MapPin, Calendar, Search } from 'lucide-react'
import api from '../lib/api'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

const TYPE_META = {
  job:       { cls: 'badge-blue',   icon: <Briefcase size={12} />,    label: 'Job' },
  funding:   { cls: 'badge-green',  icon: <DollarSign size={12} />,   label: 'Funding' },
  training:  { cls: 'badge-amber',  icon: <BookOpen size={12} />,     label: 'Training' },
  innovation:{ cls: 'badge-purple', icon: <Lightbulb size={12} />,    label: 'Innovation' },
}

export default function Opportunities() {
  const { user } = useAuthStore()
  const [opps, setOpps] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ type: '', location: '', industry: '' })
  const [applying, setApplying] = useState(null)

  const fetchOpps = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filters.type) params.type = filters.type
      if (filters.location) params.location = filters.location
      if (filters.industry) params.industry = filters.industry
      const { data } = await api.get('/opportunities/', { params })
      setOpps(data)
    } catch { toast.error('Failed to load opportunities') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchOpps() }, [])

  const handleQuickApply = async (oppId) => {
    if (!user) return toast.error('Please login to apply')
    setApplying(oppId)
    try {
      await api.post('/applications/', { opportunity_id: oppId })
      toast.success('Application submitted!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Already applied or error occurred')
    } finally { setApplying(null) }
  }

  const meta = (type) => TYPE_META[type] || TYPE_META.job

  return (
    <div className="opp-page">
      <div className="page-container">
        {/* Header */}
        <div className="opp-page-header">
          <div>
            <h1>Opportunities</h1>
            <p>Discover jobs, training, funding, and innovation challenges</p>
          </div>
          <span className="opp-count-badge">{opps.length} found</span>
        </div>

        {/* Filter bar */}
        <div className="filter-bar">
          <div className="filter-search-wrap">
            <Search size={15} className="filter-search-icon" />
            <input
              className="filter-search-input"
              placeholder="Search by industry or keyword..."
              value={filters.industry}
              onChange={e => setFilters({ ...filters, industry: e.target.value })}
            />
          </div>
          <select
            className="filter-select"
            value={filters.type}
            onChange={e => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">All Types</option>
            <option value="job">Jobs</option>
            <option value="funding">Funding</option>
            <option value="training">Training</option>
          </select>
          <input
            className="filter-input"
            placeholder="Location..."
            value={filters.location}
            onChange={e => setFilters({ ...filters, location: e.target.value })}
          />
          <button className="btn btn-primary" onClick={fetchOpps}>
            <Search size={14} /> Search
          </button>
        </div>

        {/* Results */}
        {loading ? (
          <div className="cards-grid">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton-card" />)}
          </div>
        ) : opps.length === 0 ? (
          <div className="empty-state">
            <Briefcase size={48} style={{ margin: '0 auto 1rem', opacity: 0.25 }} />
            <p>No opportunities found. Try adjusting your filters.</p>
            <button className="btn btn-outline" onClick={() => { setFilters({ type: '', location: '', industry: '' }); fetchOpps() }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="cards-grid">
            {opps.map(opp => {
              const m = meta(opp.type)
              return (
                <div key={opp.id} className="opp-card">
                  <div className="opp-card-top">
                    <span className={`badge ${m.cls}`}>{m.icon} {m.label}</span>
                    <span className={`badge ${opp.status === 'open' ? 'badge-success' : 'badge-gray'}`}>
                      {opp.status}
                    </span>
                  </div>
                  <h3 className="opp-card-title">{opp.title}</h3>
                  <p className="opp-card-desc">{opp.description?.slice(0, 110)}...</p>
                  <div className="opp-card-meta">
                    {opp.location && <span><MapPin size={12} /> {opp.location}</span>}
                    {opp.deadline && <span><Calendar size={12} /> {new Date(opp.deadline).toLocaleDateString()}</span>}
                    {opp.industry && <span>🏭 {opp.industry}</span>}
                  </div>
                  {opp.salary_range && <div className="opp-card-highlight">💰 {opp.salary_range}</div>}
                  {opp.funding_amount && <div className="opp-card-highlight" style={{ color: 'var(--green)' }}>💵 ${Number(opp.funding_amount).toLocaleString()}</div>}
                  <div className="opp-card-footer">
                    <Link to={`/opportunities/${opp.id}`} className="btn btn-outline btn-sm">View Details</Link>
                    {user?.role === 'youth' && opp.status === 'open' && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleQuickApply(opp.id)}
                        disabled={applying === opp.id}
                      >
                        {applying === opp.id ? 'Applying...' : 'Quick Apply'}
                      </button>
                    )}
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
