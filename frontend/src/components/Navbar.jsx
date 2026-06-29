import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LogOut, Menu, X, LayoutDashboard, Bell, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import useAuthStore from '../store/authStore'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/'); setOpen(false) }

  const dashPath =
    user?.role === 'youth' ? '/dashboard/youth' :
    user?.role === 'organization' ? '/dashboard/org' :
    user?.role === 'admin' ? '/dashboard/admin' : '/'

  const isActive = (p) => pathname === p || pathname.startsWith(p + '/') ? 'nav-active' : ''

  return (
    <nav className="navbar">
      <div className="nav-inner">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <div className="nav-logo-icon">Y</div>
          <span>YELS</span>
        </Link>

        {/* Desktop links */}
        <div className="nav-links">
          <Link to="/" className={isActive('/')}>Home</Link>
          <Link to="/opportunities" className={isActive('/opportunities')}>Opportunities</Link>
          {user && (
            <Link to={dashPath} className={pathname.startsWith('/dashboard') ? 'nav-active' : ''}>
              Dashboard
            </Link>
          )}
          {user && (
            <Link to="/messages" className={isActive('/messages')}>Messages</Link>
          )}
        </div>

        {/* Desktop actions */}
        <div className="nav-actions">
          {user ? (
            <>
              <Link to="/notifications" className="btn btn-ghost btn-sm" title="Notifications">
                <Bell size={16} />
              </Link>
              <Link to="/messages" className="btn btn-ghost btn-sm" title="Messages">
                <MessageCircle size={16} />
              </Link>
              <div className="nav-role-chip">
                <span className="nav-role-dot" />
                <span style={{ textTransform: 'capitalize' }}>{user.role}</span>
              </div>
              <Link to={dashPath} className="btn btn-outline btn-sm">
                <LayoutDashboard size={14} /> Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                <LogOut size={14} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Log In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="nav-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="nav-mobile">
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/opportunities" onClick={() => setOpen(false)}>Opportunities</Link>
          {user ? (
            <>
              <Link to={dashPath} onClick={() => setOpen(false)}>Dashboard</Link>
              <Link to="/messages" onClick={() => setOpen(false)}>Messages</Link>
              <Link to="/notifications" onClick={() => setOpen(false)}>Notifications</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>Log In</Link>
              <Link to="/register" onClick={() => setOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
