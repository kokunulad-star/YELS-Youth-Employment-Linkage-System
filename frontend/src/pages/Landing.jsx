import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="app">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <span className="hero-badge">Youth Employment Initiative</span>
            <h1>Bridging Youth to <span className="highlight">Opportunities</span></h1>
            <p>
              YELS connects young talent with employers, investors, and training programs.
              One platform for jobs, funding, and skills development.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-lg">Join as Youth</Link>
              <Link to="/register" className="btn btn-outline btn-lg">I'm an Employer</Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card hero-card-1">
              <span className="card-icon">💼</span>
              <strong>Jobs</strong>
              <small>Full-time &amp; Internships</small>
            </div>
            <div className="hero-card hero-card-2">
              <span className="card-icon">💰</span>
              <strong>Funding</strong>
              <small>Grants &amp; Investment</small>
            </div>
            <div className="hero-card hero-card-3">
              <span className="card-icon">📚</span>
              <strong>Training</strong>
              <small>Skills Development</small>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <div className="container">
          <h2>Everything You Need to Grow</h2>
          <p className="section-sub">A complete ecosystem for youth employment and entrepreneurship</p>
          <div className="features-grid">
            {[
              { icon: '🔍', title: 'Smart Matching', desc: 'Skills-based matching connects youth with the right jobs, funding, and training.' },
              { icon: '📄', title: 'Digital Profiles', desc: 'Showcase your CV, education, skills, and portfolio all in one place.' },
              { icon: '📊', title: 'Track Applications', desc: 'Follow your application status in real-time with full transparency.' },
              { icon: '💬', title: 'Direct Messaging', desc: 'Connect directly with employers and investors through the platform.' },
              { icon: '📈', title: 'Funding Access', desc: 'Discover grants, loans, and equity opportunities tailored to your venture.' },
              { icon: '🏆', title: 'Skill Recognition', desc: 'List and validate your skills to stand out to the right opportunities.' },
            ].map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <h2>Three Roles, One Mission</h2>
          <p className="section-sub">YELS brings everyone together on a single platform</p>
          <div className="roles-grid">
            <div className="role-card role-youth">
              <div className="role-icon">👩‍💻</div>
              <h3>Youth</h3>
              <p>Create your profile, discover opportunities, apply and track applications.</p>
              <ul>
                <li>Build a rich digital profile</li>
                <li>Search and apply to opportunities</li>
                <li>Track application status</li>
                <li>Connect with employers</li>
              </ul>
            </div>
            <div className="role-card role-investor">
              <div className="role-icon">📊</div>
              <h3>Investors</h3>
              <p>Discover and fund promising young talent. Post funding opportunities.</p>
              <ul>
                <li>Post funding opportunities</li>
                <li>Browse youth profiles</li>
                <li>Review applications</li>
                <li>Direct messaging</li>
              </ul>
            </div>
            <div className="role-card role-org">
              <div className="role-icon">🏢</div>
              <h3>Organizations</h3>
              <p>Find skilled youth for jobs and training programs.</p>
              <ul>
                <li>Post job and training opportunities</li>
                <li>Search for talent by skill</li>
                <li>Manage applications</li>
                <li>Build your employer brand</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          <p>Join YELS today and take the next step in your career journey.</p>
          <Link to="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">
                <span className="logo-icon">Y</span>
                <span className="logo-text">YELS</span>
              </div>
              <p>Youth Employment Linkage System — bridging youth to opportunities.</p>
            </div>
            <div className="footer-links">
              <div className="footer-col">
                <h4>Platform</h4>
                <Link to="/opportunities">Opportunities</Link>
                <Link to="/register">Sign Up</Link>
              </div>
              <div className="footer-col">
                <h4>For Users</h4>
                <Link to="/register">For Youth</Link>
                <Link to="/register">For Investors</Link>
                <Link to="/register">For Organizations</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 YELS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
