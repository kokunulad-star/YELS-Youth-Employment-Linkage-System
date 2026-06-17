import { Link, useNavigate } from 'react-router-dom'
import { Bell, LogOut, User, Menu, X } from 'lucide-react'
import { useState } from 'react'
import useAuthStore from '../store/authStore'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <span className="logo-icon">Y</span>
          <span className="logo-text">YELS</span>
        </Link>

        {/* Desktop links */}
        <div className="nav-links">
          <Link to="/opportunities">Opportunities</Link>
          {user?.role === 'youth' && <Link to="/dashboard/youth">Dashboard</Link>}
          {(user?.role === 'investor' || user?.role === 'organization') && (
            <Link to="/dashboard/poster">Dashboard</Link>
          )}
          {user?.role === 'admin' && <Link to="/dashboard/admin">Admin</Link>}
        </div>

        <div className="nav-actions">
          {user ? (
            <>
              <Link to="/notifications" className="icon-btn" title="Notifications">
                <Bell size={20} />
              </Link>
              <Link to="/messages" className="icon-btn" title="Messages">
                <User size={20} />
              </Link>
              <button onClick={handleLogout} className="btn btn-outline">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Log In</Link>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/opportunities" onClick={() => setMenuOpen(false)}>Opportunities</Link>
          {user ? (
            <>
              <Link to="/notifications" onClick={() => setMenuOpen(false)}>Notifications</Link>
              <Link to="/messages" onClick={() => setMenuOpen(false)}>Messages</Link>
              <button onClick={handleLogout} className="btn btn-outline w-full">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Log In</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
