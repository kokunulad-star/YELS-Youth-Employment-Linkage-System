import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, User, Building2 } from 'lucide-react'
import api from '../lib/api'
import toast from 'react-hot-toast'

const ROLES = [
  { value: 'youth', label: 'Youth', desc: 'Find jobs, funding & training', icon: <User size={20} />, bg: '#dbeafe', color: '#2563eb' },
  { value: 'organization', label: 'Organization', desc: 'Post opportunities & hire', icon: <Building2 size={20} />, bg: '#d1fae5', color: '#10b981' },
]

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', confirm: '', role: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.role) return toast.error('Please select your role')
    if (form.password !== form.confirm) return toast.error('Passwords do not match')
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters')
    setLoading(true)
    try {
      await api.post('/auth/register', { email: form.email, password: form.password, role: form.role })
      toast.success('Account created! Please log in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed')
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
        <h2>Join YELS Today</h2>
        <p>Thousands of youth are already using YELS to find jobs, funding, training, and innovation opportunities.</p>
        <div className="auth-benefits">
          {[
            { icon: '💼', title: 'Access 380+ Opportunities', sub: 'Jobs, training, funding & more' },
            { icon: '📈', title: 'Track Your Applications', sub: 'Real-time status updates' },
            { icon: '🤝', title: 'Connect Directly', sub: 'With employers and investors' },
            { icon: '🆓', title: 'Completely Free for Youth', sub: 'No hidden charges' },
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
        <div className="auth-card auth-card-wide">
          <div className="auth-header">
            <h1>Create your account</h1>
            <p>Fill in the details below to get started</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Role */}
            <div className="form-group">
              <label className="form-label">I am a...</label>
              <div className="role-selector">
                {ROLES.map(r => (
                  <button
                    type="button"
                    key={r.value}
                    className={'role-option' + (form.role === r.value ? ' selected' : '')}
                    onClick={() => set('role', r.value)}
                  >
                    <div className="role-option-icon" style={{ background: r.bg, color: r.color }}>{r.icon}</div>
                    <strong>{r.label}</strong>
                    <small>{r.desc}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={show ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={e => set('password', e.target.value)}
                    required
                    minLength={8}
                    style={{ paddingRight: '2.75rem' }}
                  />
                  <span className="pw-toggle" onClick={() => setShow(!show)}>
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </span>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type={show ? 'text' : 'password'}
                  placeholder="Repeat password"
                  value={form.confirm}
                  onChange={e => set('confirm', e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
