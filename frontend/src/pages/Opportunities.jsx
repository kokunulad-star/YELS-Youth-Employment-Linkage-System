import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, DollarSign, BookOpen, MapPin, Calendar, Wifi } from 'lucide-react'
import api from '../lib/api'
import toast from 'react-hot-toast'

const TYPE_ICONS = {
  job: <Briefcase size={16} />,
  funding: <DollarSign size={16} />,
  training: <BookOpen size={16} />,
}

const TYPE_COLORS = {
  job: 'badge-blue',
  funding: 'badge-green',
  training: 'badge-amber',
}

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ type: '', location: '', industry: '' })

  const fetchOpportunities = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filters.type) params.type = filters.type
      if (filters.location) params.location = filters.location
      if (filters.industry) params.industry = filters.industry
      const { data } = await api.get('/opportunities/', { params })
      setOpportunities(data)
    } catch {
      toast.error('Failed to load opportunities')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOpportunities() }, [])

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Opportunities</h1>
          <p>Discover jobs, funding, and training programs tailored for you</p>
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">All Types</option>
            <option value="job">Jobs</option>
            <option value="funding">Funding</option>
            <option value="training">Training</option>
          </select>
          <input
            placeholder="Filter by location..."
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          />
          <input
            placeholder="Filter by industry..."
            value={filters.industry}
            onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
          />
          <button className="btn btn-primary" onClick={fetchOpportunities}>Search</button>
        </div>

        {/* Results */}
        {loading ? (
          <div className="loading-grid">
            {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton-card" />)}
          </div>
        ) : opportunities.length === 0 ? (
          <div className="empty-state">
            <p>No opportunities found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="cards-grid">
            {opportunities.map((opp) => (
              <Link to={`/opportunities/${opp.id}`} key={opp.id} className="opp-card">
                <div className="opp-card-header">
                  <span className={`badge ${TYPE_COLORS[opp.type]}`}>
                    {TYPE_ICONS[opp.type]} {opp.type}
                  </span>
                  {opp.is_remote && (
                    <span className="badge badge-purple"><Wifi size={12} /> Remote</span>
                  )}
                </div>
                <h3>{opp.title}</h3>
                <p className="opp-desc">{opp.description?.slice(0, 100)}...</p>
                <div className="opp-meta">
                  {opp.location && (
                    <span><MapPin size={13} /> {opp.location}</span>
                  )}
                  {opp.deadline && (
                    <span><Calendar size={13} /> {new Date(opp.deadline).toLocaleDateString()}</span>
                  )}
                </div>
                {opp.industry && <div className="opp-industry">{opp.industry}</div>}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
