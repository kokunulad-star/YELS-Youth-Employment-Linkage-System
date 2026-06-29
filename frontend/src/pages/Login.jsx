import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Briefcase, TrendingUp, GraduationCap } from 'lucide-react'
import api from '../lib/api'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      login(data.access_token, { id: data.user_id, role: data.role })
      toast.success('Welcome back!')
      if (data.role === 'youth') navigate('/dashboard/youth')
      else if (data.role === 'admin') navigate('/dashboard/admin')
      else navigate('/dashboard/org')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid email or password')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      {/* Left panel */}
      <div className="auth-left">
        <div className="auth-left-logo">
          <div className="nav-logo-icon">Y</div>
          <span>YELS</span>
        </div>
        <h2>Welcome Back!</h2>
        <p>Sign in to access your dashboard, track applications, and discover new opportunities.</p>
        <div className="auth-benefits">
          {[
            { icon: <Briefcase size={18} />, title: 'View Your Applications', sub: 'Check real-time status updates' },
            { icon: <TrendingUp size={18} />, title: 'Discover Opportunities', sub: 'Jobs, funding, training & more' },
            { icon: <GraduationCap size={18} />, title: 'Grow Your Career', sub: 'Connect with mentors & investors' },
          ].map(b => (
            <div key={b.title} className="auth-benefit">
              <div className="auth-benefit-icon">{b.icon}</div>
              <div><strong>{b.title}</strong><span>{b.sub}</span></div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Sign in to YELS</h1>
            <p>Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={show ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  style={{ paddingRight: '2.75rem' }}
                />
                <span className="pw-toggle" onClick={() => setShow(!show)}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </span>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="auth-switch">
            Don&apos;t have an account? <Link to="/register">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
