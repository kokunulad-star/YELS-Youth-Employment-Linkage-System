import { Link } from 'react-router-dom'
import { Briefcase, GraduationCap, TrendingUp, Lightbulb, ArrowRight, Users, Globe, Award, CheckCircle } from 'lucide-react'

const SERVICES = [
  { icon: <Briefcase size={28} />, title: 'Job Opportunities', desc: 'Browse full-time, part-time, and internship openings matched to your skills and location.', color: '#2563eb', bg: '#dbeafe' },
  { icon: <GraduationCap size={28} />, title: 'Training & Mentorship', desc: 'Access accredited training programs and connect with experienced industry mentors.', color: '#10b981', bg: '#d1fae5' },
  { icon: <TrendingUp size={28} />, title: 'Funding & Business Ideas', desc: 'Submit your business idea and apply for grants, loans, or equity funding opportunities.', color: '#f59e0b', bg: '#fef3c7' },
  { icon: <Lightbulb size={28} />, title: 'Innovation Initiatives', desc: 'Enter innovation challenges, hackathons, competitions, and startup accelerator programs.', color: '#7c3aed', bg: '#ede9fe' },
]

const STATS = [
  { value: '2,400+', label: 'Youth Registered', icon: <Users size={22} />, bg: '#dbeafe', color: '#2563eb' },
  { value: '380+', label: 'Opportunities Posted', icon: <Briefcase size={22} />, bg: '#d1fae5', color: '#10b981' },
  { value: '96', label: 'Partner Organizations', icon: <Globe size={22} />, bg: '#ede9fe', color: '#7c3aed' },
  { value: '850+', label: 'Success Stories', icon: <Award size={22} />, bg: '#fef3c7', color: '#f59e0b' },
]

const STEPS = [
  { n: '1', title: 'Create Your Profile', desc: 'Sign up as Youth or Organization and complete your profile in minutes — it\'s free.' },
  { n: '2', title: 'Discover Opportunities', desc: 'Browse jobs, training, funding, and innovation challenges all in one place.' },
  { n: '3', title: 'Apply & Track Progress', desc: 'Submit applications and follow every stage from pending to accepted in real-time.' },
]

export default function Landing() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="lp-hero">
        <div className="lp-container">
          <div className="lp-hero-inner">
            <div className="lp-hero-content">
              <span className="lp-hero-badge">🚀 Youth Empowerment Platform</span>
              <h1 className="lp-hero-title">Connect. Grow.<br /><span>Succeed.</span></h1>
              <p className="lp-hero-desc">
                YELS bridges unemployed graduates and youth with jobs, funding, mentorship,
                training, and innovation opportunities — all in one digital platform.
              </p>
              <div className="lp-hero-actions">
                <Link to="/register" className="lp-btn-white">Get Started Free</Link>
                <Link to="/opportunities" className="lp-btn-ghost">
                  Browse Opportunities <ArrowRight size={16} />
                </Link>
              </div>
            </div>
            <div className="lp-hero-cards">
              {[
                { icon: <Briefcase size={20} color="#93c5fd" />, num: '380+', label: 'Open Jobs', sub: 'Updated daily' },
                { icon: <TrendingUp size={20} color="#86efac" />, num: '96', label: 'Investors', sub: 'Ready to fund' },
                { icon: <GraduationCap size={20} color="#fde68a" />, num: '120+', label: 'Training Programs', sub: 'Free & paid' },
                { icon: <Lightbulb size={20} color="#c4b5fd" />, num: '48', label: 'Challenges', sub: 'Open now' },
              ].map(c => (
                <div key={c.label} className="lp-hero-card">
                  <div className="lp-hcard-icon">{c.icon}</div>
                  <div className="lp-hcard-num">{c.num}</div>
                  <strong>{c.label}</strong>
                  <small>{c.sub}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="lp-stats">
        <div className="lp-container">
          <div className="lp-stats-grid">
            {STATS.map(s => (
              <div key={s.label} className="lp-stat-item">
                <div className="lp-stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                <div className="lp-stat-value">{s.value}</div>
                <div className="lp-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="lp-services">
        <div className="lp-container">
          <div className="lp-section-header">
            <h2>Our Core Services</h2>
            <p>Everything youth need to launch and grow their careers and businesses</p>
          </div>
          <div className="lp-services-grid">
            {SERVICES.map(s => (
              <div key={s.title} className="lp-service-card">
                <div className="lp-service-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <Link to="/opportunities" className="lp-service-link">Explore <ArrowRight size={14} /></Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="lp-steps">
        <div className="lp-container">
          <div className="lp-section-header">
            <h2>How YELS Works</h2>
            <p>Three simple steps to unlock your potential</p>
          </div>
          <div className="lp-steps-grid">
            {STEPS.map(s => (
              <div key={s.n} className="lp-step-card">
                <div className="lp-step-num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why YELS ── */}
      <section className="lp-features">
        <div className="lp-container">
          <div className="lp-section-header">
            <h2>Why Choose YELS?</h2>
            <p>A complete ecosystem built for youth and organizations</p>
          </div>
          <div className="lp-features-grid">
            {[
              { icon: '🎯', title: 'One Platform, All Opportunities', desc: 'Jobs, training, funding, and innovation challenges — no need to visit multiple sites.', bg: '#dbeafe', color: '#2563eb' },
              { icon: '📊', title: 'Real-Time Application Tracking', desc: 'Know exactly where you stand — pending, shortlisted, interviewed, or accepted.', bg: '#d1fae5', color: '#10b981' },
              { icon: '🤝', title: 'Direct Connections', desc: 'Communicate directly with employers, investors, and training organizations.', bg: '#ede9fe', color: '#7c3aed' },
              { icon: '🔒', title: 'Secure & Trusted', desc: 'Your data is protected. Only verified organizations can post opportunities.', bg: '#fef3c7', color: '#f59e0b' },
            ].map(f => (
              <div key={f.title} className="lp-feature-card">
                <div className="lp-feature-icon" style={{ background: f.bg, color: f.color }}>{f.icon}</div>
                <div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                  <ul className="lp-feature-list">
                    <li><CheckCircle size={14} /> Free for youth</li>
                    <li><CheckCircle size={14} /> Easy to use</li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-slim">
            <div className="lp-footer-logo">
              <div className="nav-logo-icon">Y</div>
              <span>YELS</span>
            </div>
            <div className="lp-footer-slim-links">
              <Link to="/opportunities">Opportunities</Link>
              <Link to="/register">Sign Up</Link>
              <Link to="/login">Login</Link>
              <Link to="/opportunities">Jobs</Link>
              <Link to="/opportunities">Training</Link>
              <Link to="/opportunities">Funding</Link>
            </div>
          </div>
          <div className="lp-footer-bottom">
            <p>© 2026 YELS. All rights reserved.</p>
            <p>Youth Investment, Entrepreneurship &amp; Employment Linkage System</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
