import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import toast from 'react-hot-toast'

const ROLES = [
  { value: 'youth', label: '👩‍💻 Youth', desc: 'Looking for jobs, funding, or training' },
  { value: 'investor', label: '📊 Investor', desc: 'Want to fund young talent' },
  { value: 'organization', label: '🏢 Organization', desc: 'Hiring or offering training' },
]

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', role: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.role) return toast.error('Please select a role')
    setLoading(true)
    try {
      await api.post('/auth/register', form)
      toast.success('Account created! Please log in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-header">
          <Link to="/" className="logo">
            <span className="logo-icon">Y</span>
            <span className="logo-text">YELS</span>
          </Link>
          <h1>Create your account</h1>
          <p>Join YELS and connect with opportunities</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Role selection */}
          <div className="form-group">
            <label>I am a...</label>
            <div className="role-selector">
              {ROLES.map((r) => (
                <button
                  type="button"
                  key={r.value}
                  className={`role-option ${form.role === r.value ? 'selected' : ''}`}
                  onClick={() => setForm({ ...form, role: r.value })}
                >
                  <strong>{r.label}</strong>
                  <small>{r.desc}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={8}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
