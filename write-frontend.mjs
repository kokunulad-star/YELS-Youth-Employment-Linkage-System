import fs from 'fs';
import path from 'path';
const src = 'C:/Users/HomePC/Desktop/YELS-Youth-Employment-Linkage-System/frontend/src';
function w(rel, content) {
  const full = path.join(src, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log('wrote:', rel);
}

const CSS = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
:root{--primary:#2563eb;--primary-dark:#1d4ed8;--primary-light:#dbeafe;--green:#10b981;--green-dark:#059669;--green-light:#d1fae5;--accent:#f59e0b;--accent-light:#fef3c7;--purple:#7c3aed;--purple-light:#ede9fe;--red:#ef4444;--red-light:#fee2e2;--text:#4b5563;--text-h:#111827;--text-muted:#9ca3af;--bg:#fff;--bg-alt:#f9fafb;--bg-alt2:#f3f4f6;--border:#e5e7eb;--sidebar:#1e3a5f;--shadow:0 1px 3px rgba(0,0,0,.1),0 1px 2px rgba(0,0,0,.06);--shadow-md:0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -2px rgba(0,0,0,.06);--shadow-lg:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.06);--radius:.75rem;--radius-sm:.375rem;--radius-lg:1rem;--sans:'Inter',system-ui,sans-serif;--transition:150ms ease}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:var(--sans);font-size:16px;line-height:1.6;color:var(--text);background:var(--bg);-webkit-font-smoothing:antialiased}
a{text-decoration:none;color:inherit}
img{max-width:100%;display:block}
button{font-family:inherit;cursor:pointer;border:none;background:none}
input,textarea,select{font-family:inherit;font-size:inherit}
ul{list-style:none}
h1{font-size:clamp(1.75rem,4vw,2.5rem);font-weight:800;color:var(--text-h);line-height:1.2}
h2{font-size:clamp(1.4rem,3vw,2rem);font-weight:700;color:var(--text-h);line-height:1.3}
h3{font-size:1.2rem;font-weight:600;color:var(--text-h)}
h4{font-size:1rem;font-weight:600;color:var(--text-h)}
p{color:var(--text)}
.container{max-width:1200px;margin:0 auto;padding:0 1.5rem}
.container-narrow{max-width:860px;margin:0 auto;padding:0 1.5rem}
.btn{display:inline-flex;align-items:center;gap:.4rem;padding:.55rem 1.25rem;border-radius:var(--radius-sm);font-size:.9rem;font-weight:600;transition:all var(--transition);cursor:pointer;border:2px solid transparent;white-space:nowrap}
.btn:disabled{opacity:.6;cursor:not-allowed}
.btn-primary{background:var(--primary);color:#fff;border-color:var(--primary)}
.btn-primary:hover{background:var(--primary-dark);border-color:var(--primary-dark)}
.btn-outline{background:transparent;color:var(--primary);border-color:var(--primary)}
.btn-outline:hover{background:var(--primary-light)}
.btn-green{background:var(--green);color:#fff;border-color:var(--green)}
.btn-green:hover{background:var(--green-dark)}
.btn-danger{background:var(--red);color:#fff;border-color:var(--red)}
.btn-danger:hover{background:#dc2626}
.btn-ghost{background:transparent;color:var(--text)}
.btn-ghost:hover{background:var(--bg-alt)}
.btn-sm{padding:.35rem .75rem;font-size:.8rem}
.btn-lg{padding:.75rem 1.75rem;font-size:1rem}
.btn-full{width:100%;justify-content:center}
.form-group{display:flex;flex-direction:column;gap:.4rem;margin-bottom:1rem}
.form-label{font-size:.875rem;font-weight:600;color:var(--text-h)}
.form-group input,.form-group select,.form-group textarea{width:100%;padding:.6rem .875rem;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:.9rem;color:var(--text-h);background:var(--bg);transition:border-color var(--transition),box-shadow var(--transition);outline:none}
.form-group input:focus,.form-group select:focus,.form-group textarea:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(37,99,235,.12)}
.form-group textarea{resize:vertical;min-height:100px}
.form-error{font-size:.78rem;color:var(--red)}
.form-row{display:flex;gap:1rem}
.form-row .form-group{flex:1}
.card{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:1.5rem;box-shadow:var(--shadow)}
.card-hover{transition:box-shadow var(--transition),transform var(--transition)}
.card-hover:hover{box-shadow:var(--shadow-lg);transform:translateY(-2px)}
.badge{display:inline-flex;align-items:center;gap:.25rem;padding:.2rem .6rem;border-radius:9999px;font-size:.75rem;font-weight:600;white-space:nowrap}
.badge-primary{background:var(--primary-light);color:var(--primary)}
.badge-blue{background:#dbeafe;color:#1e40af}
.badge-green{background:var(--green-light);color:#065f46}
.badge-amber{background:var(--accent-light);color:#92400e}
.badge-red{background:var(--red-light);color:#991b1b}
.badge-gray{background:#f3f4f6;color:#374151}
.badge-purple{background:var(--purple-light);color:#5b21b6}
.badge-success{background:var(--green-light);color:#065f46}
.status-pending{background:#fef3c7;color:#92400e}
.status-shortlisted{background:var(--primary-light);color:#1e40af}
.status-interviewed{background:var(--purple-light);color:#5b21b6}
.status-accepted{background:var(--green-light);color:#065f46}
.status-rejected{background:var(--red-light);color:#991b1b}
`;
w('index.css', CSS);

const CSS2 = `
.navbar{position:sticky;top:0;z-index:100;background:var(--bg);border-bottom:1px solid var(--border);box-shadow:0 1px 4px rgba(0,0,0,.06)}
.nav-inner{max-width:1200px;margin:0 auto;padding:0 1.5rem;height:64px;display:flex;align-items:center;gap:1.5rem}
.logo{display:flex;align-items:center;gap:.5rem;font-weight:800;font-size:1.2rem;color:var(--text-h);flex-shrink:0}
.logo-icon{width:36px;height:36px;background:var(--primary);color:#fff;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:1rem;flex-shrink:0}
.nav-links{display:flex;align-items:center;gap:.25rem;flex:1}
.nav-links a{padding:.4rem .75rem;border-radius:var(--radius-sm);font-size:.875rem;font-weight:500;color:var(--text);transition:color var(--transition),background var(--transition)}
.nav-links a:hover,.nav-links a.active{color:var(--primary);background:var(--primary-light)}
.nav-actions{display:flex;align-items:center;gap:.5rem;margin-left:auto}
.icon-btn{display:flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:var(--radius-sm);color:var(--text);transition:color var(--transition),background var(--transition);cursor:pointer}
.icon-btn:hover{color:var(--primary);background:var(--primary-light)}
.user-chip{display:flex;align-items:center;gap:.5rem;padding:.35rem .75rem;border-radius:9999px;background:var(--bg-alt);border:1px solid var(--border);cursor:pointer;font-size:.85rem;font-weight:600;color:var(--text-h)}
.user-chip .avatar{width:28px;height:28px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700}
.menu-toggle{display:none;padding:.4rem;color:var(--text-h);margin-left:.5rem}
.mobile-menu{display:none;flex-direction:column;border-top:1px solid var(--border);background:var(--bg);padding:1rem 1.5rem;gap:.5rem}
.mobile-menu a,.mobile-menu button{display:block;padding:.6rem 0;font-size:.95rem;color:var(--text-h);font-weight:500;border-bottom:1px solid var(--bg-alt);background:none;text-align:left;width:100%}
.dash-layout{display:flex;min-height:calc(100vh - 64px)}
.sidebar{width:240px;min-width:240px;background:var(--sidebar);display:flex;flex-direction:column;padding:1.5rem 0;position:sticky;top:64px;height:calc(100vh - 64px);overflow-y:auto}
.sidebar-section{padding:.5rem 1rem .25rem;font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-top:.75rem}
.sidebar-link{display:flex;align-items:center;gap:.75rem;padding:.65rem 1.25rem;color:rgba(148,184,216,.85);font-size:.875rem;font-weight:500;transition:color var(--transition),background var(--transition);cursor:pointer;background:none;border:none;width:100%;text-align:left;position:relative}
.sidebar-link:hover{color:#fff;background:var(--sidebar-hover)}
.sidebar-link.active{color:#fff;background:rgba(37,99,235,.35)}
.sidebar-link.active::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--primary);border-radius:0 2px 2px 0}
.sidebar-bottom{margin-top:auto;padding:1rem;border-top:1px solid rgba(255,255,255,.1)}
.dash-main{flex:1;background:var(--bg-alt);overflow-y:auto;min-width:0}
.dash-header{background:var(--bg);border-bottom:1px solid var(--border);padding:1.25rem 2rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap}
.dash-header h1{font-size:1.4rem}
.dash-content{padding:2rem}
`;
fs.appendFileSync(path.join(src,'index.css'), CSS2);

const CSS3 = `
.stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:2rem}
.stat-card{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:1.25rem 1.5rem;display:flex;align-items:center;gap:1rem;box-shadow:var(--shadow)}
.stat-icon{width:48px;height:48px;border-radius:var(--radius);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.stat-icon-blue{background:var(--primary-light);color:var(--primary)}
.stat-icon-green{background:var(--green-light);color:var(--green)}
.stat-icon-amber{background:var(--accent-light);color:var(--accent)}
.stat-icon-purple{background:var(--purple-light);color:var(--purple)}
.stat-icon-red{background:var(--red-light);color:var(--red)}
.stat-value{font-size:1.6rem;font-weight:800;color:var(--text-h);line-height:1}
.stat-label{font-size:.8rem;color:var(--text-muted);margin-top:.2rem}
.table-wrap{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow)}
.table-scroll{overflow-x:auto}
table{width:100%;border-collapse:collapse}
thead{background:var(--bg-alt)}
th{padding:.75rem 1rem;text-align:left;font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--text-muted);border-bottom:1px solid var(--border);white-space:nowrap}
td{padding:.875rem 1rem;font-size:.875rem;color:var(--text);border-bottom:1px solid var(--border);vertical-align:middle}
tbody tr:last-child td{border-bottom:none}
tbody tr:hover{background:var(--bg-alt)}
.tabs{display:flex;gap:.25rem;border-bottom:2px solid var(--border);margin-bottom:1.5rem}
.tab-btn{padding:.6rem 1.1rem;font-size:.875rem;font-weight:600;color:var(--text-muted);background:none;border:none;border-bottom:2px solid transparent;margin-bottom:-2px;cursor:pointer;transition:color var(--transition),border-color var(--transition);display:flex;align-items:center;gap:.4rem}
.tab-btn:hover{color:var(--text-h)}
.tab-btn.active{color:var(--primary);border-bottom-color:var(--primary)}
.empty-state{text-align:center;padding:3rem 1rem;color:var(--text-muted)}
.empty-state svg{margin:0 auto 1rem;opacity:.4}
.empty-state p{margin-bottom:1rem}
.filter-bar{display:flex;align-items:center;gap:.75rem;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:1rem 1.25rem;margin-bottom:2rem;flex-wrap:wrap;box-shadow:var(--shadow)}
.filter-bar input,.filter-bar select{padding:.5rem .875rem;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:.875rem;color:var(--text-h);background:var(--bg-alt);outline:none;min-width:140px}
.filter-bar input:focus,.filter-bar select:focus{border-color:var(--primary)}
.filter-search{flex:1;min-width:220px}
.cards-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem}
.opp-card{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:1.5rem;display:flex;flex-direction:column;gap:.75rem;box-shadow:var(--shadow);transition:box-shadow var(--transition),transform var(--transition);color:inherit;cursor:pointer}
.opp-card:hover{box-shadow:var(--shadow-lg);transform:translateY(-2px)}
.opp-card h3{font-size:1rem;color:var(--text-h);line-height:1.4}
.opp-meta{display:flex;flex-wrap:wrap;gap:.75rem}
.opp-meta span{font-size:.78rem;color:var(--text-muted);display:flex;align-items:center;gap:.25rem}
.opp-desc{font-size:.85rem;color:var(--text);line-height:1.5;flex:1}
.opp-card-footer{display:flex;justify-content:space-between;align-items:center;margin-top:auto}
`;
fs.appendFileSync(path.join(src,'index.css'), CSS3);

const CSS4 = `
.hero{background:linear-gradient(135deg,#1e3a8a 0%,#2563eb 45%,#4f46e5 100%);padding:5rem 0 4rem;overflow:hidden;position:relative}
.hero::after{content:'';position:absolute;inset:0;background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/svg%3E");pointer-events:none}
.hero .container{display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center;position:relative;z-index:1}
.hero-content{color:#fff}
.hero-badge{display:inline-flex;align-items:center;gap:.5rem;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.2);color:#e0f2fe;padding:.3rem .9rem;border-radius:9999px;font-size:.8rem;font-weight:600;margin-bottom:1.25rem}
.hero-content h1{color:#fff;font-size:clamp(2rem,5vw,3rem);line-height:1.15;margin-bottom:1.25rem}
.hero-content h1 span{color:#93c5fd}
.hero-content p{color:rgba(255,255,255,.8);font-size:1.1rem;margin-bottom:2rem;line-height:1.7;max-width:480px}
.hero-actions{display:flex;gap:.75rem;flex-wrap:wrap}
.hero-actions .btn-white{background:#fff;color:var(--primary);border-color:#fff;font-weight:700}
.hero-actions .btn-white:hover{background:#f0f9ff}
.hero-actions .btn-outline-white{background:transparent;color:#fff;border:2px solid rgba(255,255,255,.5);font-weight:600;display:inline-flex;align-items:center;gap:.4rem;padding:.55rem 1.25rem;border-radius:var(--radius-sm);font-size:.9rem;transition:all var(--transition);cursor:pointer}
.hero-actions .btn-outline-white:hover{border-color:#fff;background:rgba(255,255,255,.1)}
.hero-visual{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
.hero-card{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);backdrop-filter:blur(12px);border-radius:var(--radius);padding:1.25rem;color:#fff;display:flex;flex-direction:column;gap:.35rem;transition:transform .3s,box-shadow .3s}
.hero-card:hover{transform:translateY(-4px);box-shadow:0 12px 30px rgba(0,0,0,.25)}
.hero-card-icon{width:42px;height:42px;border-radius:var(--radius-sm);background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;margin-bottom:.5rem}
.hero-card strong{font-size:.95rem;font-weight:700}
.hero-card small{font-size:.75rem;color:rgba(255,255,255,.7)}
.hero-card-number{font-size:1.5rem;font-weight:800}
.hero-card-wide{grid-column:span 2}
.features{padding:5rem 0;background:var(--bg-alt)}
.section-header{text-align:center;margin-bottom:3rem}
.section-header h2{margin-bottom:.5rem}
.section-header p{color:var(--text-muted);font-size:1.05rem}
.features-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1.5rem}
.feature-card{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:1.75rem;transition:box-shadow var(--transition),transform var(--transition);display:flex;gap:1.25rem;align-items:flex-start}
.feature-card:hover{box-shadow:var(--shadow-lg);transform:translateY(-3px)}
.feature-icon{width:52px;height:52px;border-radius:var(--radius);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.feature-card h3{margin-bottom:.4rem}
.feature-card p{font-size:.875rem;color:var(--text);line-height:1.65}
.steps{padding:5rem 0;background:var(--bg)}
.steps-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2rem}
.step-card{text-align:center;padding:2rem 1.5rem}
.step-number{width:56px;height:56px;border-radius:50%;background:var(--primary);color:#fff;font-size:1.25rem;font-weight:800;display:flex;align-items:center;justify-content:center;margin:0 auto 1.25rem;border:4px solid var(--bg);box-shadow:0 0 0 2px var(--primary)}
.step-card h3{margin-bottom:.5rem}
.step-card p{font-size:.875rem;color:var(--text)}
.services{padding:5rem 0;background:linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 100%)}
.services .section-header h2{color:#fff}
.services .section-header p{color:rgba(255,255,255,.7)}
.services-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.25rem}
.service-card{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.15);border-radius:var(--radius);padding:1.75rem 1.5rem;text-align:center;transition:box-shadow var(--transition),transform var(--transition);backdrop-filter:blur(8px)}
.service-card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.3);background:rgba(255,255,255,.18)}
.service-icon{width:64px;height:64px;border-radius:var(--radius);background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;margin:0 auto 1rem}
.service-card h3{color:#fff;margin-bottom:.5rem}
.service-card p{font-size:.85rem;color:rgba(255,255,255,.7);line-height:1.6}
.cta-section{background:linear-gradient(135deg,var(--primary) 0%,#4f46e5 100%);padding:5rem 0;text-align:center}
.cta-section h2{color:#fff;margin-bottom:1rem}
.cta-section p{color:rgba(255,255,255,.8);margin-bottom:2rem;font-size:1.05rem}
.footer{background:#111827;color:#9ca3af;padding:4rem 0 2rem}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:3rem;margin-bottom:3rem}
.footer-brand .logo{color:#fff;margin-bottom:1rem}
.footer-brand p{font-size:.875rem;line-height:1.7;color:#9ca3af}
.footer-col h4{color:#fff;font-size:.875rem;font-weight:700;margin-bottom:1rem}
.footer-col a{display:block;font-size:.875rem;color:#9ca3af;margin-bottom:.6rem;transition:color var(--transition)}
.footer-col a:hover{color:#fff}
.footer-bottom{border-top:1px solid #374151;padding-top:1.5rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem}
.footer-bottom p{font-size:.85rem;color:#6b7280}
`;
fs.appendFileSync(path.join(src,'index.css'), CSS4);

const CSS5 = `
.auth-page{min-height:calc(100vh - 64px);display:flex;background:var(--bg-alt)}
.auth-left{width:420px;min-width:420px;background:linear-gradient(160deg,#1e3a8a 0%,#2563eb 60%,#4f46e5 100%);padding:3rem;display:flex;flex-direction:column;justify-content:center;color:#fff}
.auth-left .logo{color:#fff;margin-bottom:2.5rem}
.auth-left h2{font-size:1.6rem;font-weight:800;color:#fff;margin-bottom:1rem}
.auth-left p{color:rgba(255,255,255,.8);line-height:1.7;margin-bottom:2rem}
.auth-benefits{display:flex;flex-direction:column;gap:1rem}
.auth-benefit{display:flex;align-items:flex-start;gap:.75rem}
.auth-benefit-icon{width:34px;height:34px;border-radius:var(--radius-sm);background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.auth-benefit-text strong{display:block;color:#fff;font-size:.875rem}
.auth-benefit-text span{font-size:.78rem;color:rgba(255,255,255,.65)}
.auth-right{flex:1;display:flex;align-items:center;justify-content:center;padding:2rem}
.auth-card{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-lg);padding:2.5rem;width:100%;max-width:440px;box-shadow:var(--shadow-lg)}
.auth-card-wide{max-width:580px}
.auth-header{margin-bottom:2rem}
.auth-header h1{font-size:1.5rem;margin-bottom:.35rem}
.auth-header p{color:var(--text-muted);font-size:.9rem}
.auth-switch{text-align:center;font-size:.875rem;color:var(--text-muted);margin-top:1.5rem}
.auth-switch a{color:var(--primary);font-weight:600}
.role-selector{display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem;margin-top:.5rem}
.role-option{display:flex;flex-direction:column;align-items:center;gap:.35rem;padding:1rem .75rem;border:2px solid var(--border);border-radius:var(--radius);background:var(--bg);cursor:pointer;transition:all var(--transition);text-align:center}
.role-option:hover{border-color:var(--primary);background:var(--primary-light)}
.role-option.selected{border-color:var(--primary);background:var(--primary-light);box-shadow:0 0 0 3px rgba(37,99,235,.15)}
.role-option-icon{width:40px;height:40px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;margin-bottom:.25rem}
.role-option strong{font-size:.85rem;color:var(--text-h);display:block}
.role-option small{font-size:.72rem;color:var(--text-muted)}
.role-option.selected strong{color:var(--primary)}
.input-wrap{position:relative}
.input-wrap input{padding-right:2.75rem}
.input-toggle{position:absolute;right:.75rem;top:50%;transform:translateY(-50%);color:var(--text-muted);cursor:pointer;display:flex;align-items:center}
.input-toggle:hover{color:var(--text-h)}
.forgot-link{font-size:.82rem;color:var(--primary);font-weight:600;text-align:right;display:block;margin-top:.25rem}
.forgot-link:hover{text-decoration:underline}
.divider{display:flex;align-items:center;gap:1rem;margin:1.25rem 0}
.divider::before,.divider::after{content:'';flex:1;height:1px;background:var(--border)}
.divider span{font-size:.8rem;color:var(--text-muted)}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
.skeleton{background:linear-gradient(90deg,var(--bg-alt) 25%,#e9edf2 50%,var(--bg-alt) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:var(--radius-sm)}
.skeleton-card{border-radius:var(--radius);height:220px;background:linear-gradient(90deg,var(--bg-alt) 25%,#e9edf2 50%,var(--bg-alt) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite}
@media(max-width:1024px){.hero .container{grid-template-columns:1fr}.hero-visual{display:none}.services-grid{grid-template-columns:repeat(2,1fr)}.features-grid{grid-template-columns:1fr}.stats-row{grid-template-columns:repeat(2,1fr)}.cards-grid{grid-template-columns:repeat(2,1fr)}.footer-grid{grid-template-columns:1fr 1fr}.sidebar{width:200px;min-width:200px}}
@media(max-width:768px){.nav-links{display:none}.menu-toggle{display:flex}.mobile-menu{display:flex}.auth-left{display:none}.auth-card{max-width:100%}.dash-layout{flex-direction:column}.sidebar{width:100%;height:auto;position:relative;top:0}.stats-row{grid-template-columns:repeat(2,1fr)}.cards-grid{grid-template-columns:1fr}.steps-grid{grid-template-columns:1fr}.services-grid{grid-template-columns:1fr}.footer-grid{grid-template-columns:1fr}}
@media(max-width:480px){.stats-row{grid-template-columns:1fr}.role-selector{grid-template-columns:1fr}}
`;
fs.appendFileSync(path.join(src,'index.css'), CSS5);

// ── Navbar ───────────────────────────────────────────────────────────────────
w('components/Navbar.jsx', `import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Bell, LogOut, Menu, X, Briefcase } from 'lucide-react'
import { useState } from 'react'
import useAuthStore from '../store/authStore'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/'); setOpen(false) }
  const active = (p) => pathname === p ? 'active' : ''

  const dashLink = user?.role === 'youth' ? '/dashboard/youth'
    : user?.role === 'organization' ? '/dashboard/org'
    : user?.role === 'admin' ? '/dashboard/admin' : '/'

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="logo">
          <div className="logo-icon">Y</div>
          <span>YELS</span>
        </Link>
        <div className="nav-links">
          <Link to="/" className={active('/')}>Home</Link>
          <Link to="/opportunities" className={active('/opportunities')}>Opportunities</Link>
          {user && <Link to={dashLink} className={pathname.startsWith('/dashboard') ? 'active' : ''}>Dashboard</Link>}
        </div>
        <div className="nav-actions">
          {user ? (
            <>
              <div className="user-chip">
                <div className="avatar">{user.role?.[0]?.toUpperCase()}</div>
                <span style={{textTransform:'capitalize'}}>{user.role}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-outline btn-sm"><LogOut size={15}/> Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Log In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </div>
        <button className="menu-toggle icon-btn" onClick={() => setOpen(!open)}>
          {open ? <X size={22}/> : <Menu size={22}/>}
        </button>
      </div>
      {open && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/opportunities" onClick={() => setOpen(false)}>Opportunities</Link>
          {user ? (
            <>
              <Link to={dashLink} onClick={() => setOpen(false)}>Dashboard</Link>
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
`);

// ── ProtectedRoute ───────────────────────────────────────────────────────────
w('components/ProtectedRoute.jsx', `import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}
`);

// ── Landing ──────────────────────────────────────────────────────────────────
w('pages/Landing.jsx', `import { Link } from 'react-router-dom'
import { Briefcase, GraduationCap, TrendingUp, Lightbulb, ArrowRight, CheckCircle, Users, Award, Globe } from 'lucide-react'

const SERVICES = [
  { icon: <Briefcase size={28} color="#fff"/>, title: 'Job Opportunities', desc: 'Browse hundreds of full-time, part-time, and internship openings matched to your skills.', color: '#2563eb' },
  { icon: <GraduationCap size={28} color="#fff"/>, title: 'Training & Mentorship', desc: 'Access accredited training programs and connect with experienced mentors.', color: '#10b981' },
  { icon: <TrendingUp size={28} color="#fff"/>, title: 'Funding & Business Ideas', desc: 'Submit your business idea and apply for grants, loans, or equity funding.', color: '#f59e0b' },
  { icon: <Lightbulb size={28} color="#fff"/>, title: 'Innovation Initiatives', desc: 'Enter innovation challenges, competitions, and startup accelerator programs.', color: '#7c3aed' },
]

const STEPS = [
  { n: '01', title: 'Create Your Profile', desc: 'Sign up as Youth or Organization and complete your profile in minutes.' },
  { n: '02', title: 'Discover Opportunities', desc: 'Browse jobs, training, funding, and innovation challenges all in one place.' },
  { n: '03', title: 'Apply & Track', desc: 'Submit applications and track every stage of your application in real-time.' },
]

const STATS = [
  { value: '2,400+', label: 'Youth Registered', icon: <Users size={24}/>, bg: '#dbeafe', color: '#2563eb' },
  { value: '380+', label: 'Opportunities Posted', icon: <Briefcase size={24}/>, bg: '#d1fae5', color: '#10b981' },
  { value: '96', label: 'Partner Organizations', icon: <Globe size={24}/>, bg: '#ede9fe', color: '#7c3aed' },
  { value: '850+', label: 'Success Stories', icon: <Award size={24}/>, bg: '#fef3c7', color: '#f59e0b' },
]

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <span className="hero-badge">🚀 Youth Empowerment Platform</span>
            <h1>Connect. Grow.<br/><span>Succeed.</span></h1>
            <p>YELS bridges unemployed graduates and youth with jobs, funding, mentorship, training, and innovation opportunities — all in one digital platform.</p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-white btn-lg">Get Started Free</Link>
              <Link to="/opportunities" className="btn-outline-white btn-lg">Browse Opportunities <ArrowRight size={16}/></Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-icon"><Briefcase size={22} color="#93c5fd"/></div>
              <div className="hero-card-number">380+</div>
              <strong>Open Jobs</strong>
              <small>Updated daily</small>
            </div>
            <div className="hero-card">
              <div className="hero-card-icon"><TrendingUp size={22} color="#86efac"/></div>
              <div className="hero-card-number">96</div>
              <strong>Investors</strong>
              <small>Ready to fund</small>
            </div>
            <div className="hero-card">
              <div className="hero-card-icon"><GraduationCap size={22} color="#fde68a"/></div>
              <div className="hero-card-number">120+</div>
              <strong>Training Programs</strong>
              <small>Free & paid</small>
            </div>
            <div className="hero-card">
              <div className="hero-card-icon"><Lightbulb size={22} color="#c4b5fd"/></div>
              <div className="hero-card-number">48</div>
              <strong>Innovation Challenges</strong>
              <small>Open now</small>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{padding:'3rem 0',background:'#fff',borderBottom:'1px solid #e5e7eb'}}>
        <div className="container">
          <div className="stats-row">
            {STATS.map(s => (
              <div className="stat-card" key={s.label}>
                <div className="stat-icon" style={{background:s.bg,color:s.color}}>{s.icon}</div>
                <div><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="services">
        <div className="container">
          <div className="section-header">
            <h2>Our Core Services</h2>
            <p>Everything youth need to launch and grow their careers and businesses</p>
          </div>
          <div className="services-grid">
            {SERVICES.map(s => (
              <div className="service-card" key={s.title}>
                <div className="service-icon" style={{background:s.color+'33'}}>{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="steps">
        <div className="container">
          <div className="section-header">
            <h2>How YELS Works</h2>
            <p>Three simple steps to unlock your potential</p>
          </div>
          <div className="steps-grid">
            {STEPS.map(s => (
              <div className="step-card" key={s.n}>
                <div className="step-number">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose YELS?</h2>
            <p>A complete ecosystem built specifically for youth and organizations</p>
          </div>
          <div className="features-grid">
            {[
              { icon: '🎯', title: 'One Platform, All Opportunities', desc: 'Jobs, training, funding, and innovation challenges — no need to visit multiple sites.', bg:'#dbeafe',color:'#2563eb' },
              { icon: '📊', title: 'Real-Time Application Tracking', desc: 'Know exactly where you stand — from pending to accepted — at every stage.', bg:'#d1fae5',color:'#10b981' },
              { icon: '🤝', title: 'Direct Connections', desc: 'Communicate directly with employers, investors, and organizations.', bg:'#ede9fe',color:'#7c3aed' },
              { icon: '🔒', title: 'Secure & Trusted', desc: 'Your data is protected. Only verified organizations can post opportunities.', bg:'#fef3c7',color:'#f59e0b' },
            ].map(f => (
              <div className="feature-card card-hover" key={f.title}>
                <div className="feature-icon" style={{background:f.bg,color:f.color,fontSize:'1.5rem'}}>{f.icon}</div>
                <div><h3>{f.title}</h3><p>{f.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Take the Next Step?</h2>
          <p>Join thousands of youth already using YELS to build their futures.</p>
          <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
            <Link to="/register" className="btn btn-white btn-lg" style={{background:'#fff',color:'#2563eb',border:'2px solid #fff',fontWeight:700,display:'inline-flex',alignItems:'center',gap:'.4rem',padding:'.75rem 1.75rem',borderRadius:'var(--radius-sm)',fontSize:'1rem',cursor:'pointer'}}>Create Free Account</Link>
            <Link to="/opportunities" className="btn-outline-white btn-lg">Explore Opportunities</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo" style={{color:'#fff',display:'flex',alignItems:'center',gap:'.5rem',fontWeight:800,fontSize:'1.2rem',marginBottom:'1rem'}}>
                <div className="logo-icon">Y</div><span>YELS</span>
              </div>
              <p>Youth Investment, Entrepreneurship & Employment Linkage System — connecting graduates to their future.</p>
            </div>
            <div className="footer-col">
              <h4>Platform</h4>
              <Link to="/opportunities">Browse Opportunities</Link>
              <Link to="/register">Sign Up</Link>
              <Link to="/login">Login</Link>
            </div>
            <div className="footer-col">
              <h4>Services</h4>
              <Link to="/opportunities?type=job">Jobs</Link>
              <Link to="/opportunities?type=training">Training</Link>
              <Link to="/opportunities?type=funding">Funding</Link>
            </div>
            <div className="footer-col">
              <h4>For You</h4>
              <Link to="/register">For Youth</Link>
              <Link to="/register">For Organizations</Link>
              <Link to="/register">For Admin</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 YELS. All rights reserved.</p>
            <p>Youth Investment, Entrepreneurship & Employment Linkage System</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
`);

// ── Register ─────────────────────────────────────────────────────────────────
w('pages/Register.jsx', `import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, User, Briefcase, Building2, Shield } from 'lucide-react'
import api from '../lib/api'
import toast from 'react-hot-toast'

const ROLES = [
  { value:'youth', label:'Youth', desc:'Find jobs, funding & training', icon:<User size={20} color="#2563eb"/>, bg:'#dbeafe' },
  { value:'organization', label:'Organization', desc:'Post opportunities & hire', icon:<Building2 size={20} color="#10b981"/>, bg:'#d1fae5' },
]

export default function Register() {
  const [form, setForm] = useState({ email:'', password:'', confirm:'', role:'' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const set = (k,v) => setForm(f => ({...f,[k]:v}))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.role) return toast.error('Please select your role')
    if (form.password !== form.confirm) return toast.error('Passwords do not match')
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters')
    setLoading(true)
    try {
      await api.post('/auth/register', { email:form.email, password:form.password, role:form.role })
      toast.success('Account created! Please log in.')
      navigate('/login')
    } catch(err) {
      toast.error(err.response?.data?.detail || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="logo" style={{color:'#fff',display:'flex',alignItems:'center',gap:'.5rem',fontWeight:800,fontSize:'1.2rem',marginBottom:'2.5rem'}}>
          <div className="logo-icon">Y</div><span>YELS</span>
        </div>
        <h2>Join YELS Today</h2>
        <p>Thousands of youth are already using YELS to find jobs, funding, training, and innovation opportunities.</p>
        <div className="auth-benefits">
          {[
            {icon:'💼', title:'Access 380+ Opportunities', sub:'Jobs, training, funding & more'},
            {icon:'📈', title:'Track Your Applications', sub:'Real-time status updates'},
            {icon:'🤝', title:'Connect Directly', sub:'With employers and investors'},
            {icon:'🆓', title:'Completely Free for Youth', sub:'No hidden charges'},
          ].map(b => (
            <div className="auth-benefit" key={b.title}>
              <div className="auth-benefit-icon" style={{fontSize:'1.1rem'}}>{b.icon}</div>
              <div className="auth-benefit-text"><strong>{b.title}</strong><span>{b.sub}</span></div>
            </div>
          ))}
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card auth-card-wide">
          <div className="auth-header">
            <h1>Create your account</h1>
            <p>Fill in the details below to get started</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">I am a...</label>
              <div className="role-selector">
                {ROLES.map(r => (
                  <button type="button" key={r.value}
                    className={"role-option" + (form.role===r.value?' selected':'')}
                    onClick={() => set('role',r.value)}>
                    <div className="role-option-icon" style={{background:r.bg}}>{r.icon}</div>
                    <strong>{r.label}</strong>
                    <small>{r.desc}</small>
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={e=>set('email',e.target.value)} required/>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrap">
                  <input type={show?'text':'password'} placeholder="Min. 8 characters" value={form.password} onChange={e=>set('password',e.target.value)} required minLength={8}/>
                  <span className="input-toggle" onClick={()=>setShow(!show)}>{show?<EyeOff size={16}/>:<Eye size={16}/>}</span>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input type={show?'text':'password'} placeholder="Repeat password" value={form.confirm} onChange={e=>set('confirm',e.target.value)} required/>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  )
}
`);

// ── Login ────────────────────────────────────────────────────────────────────
w('pages/Login.jsx', `import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import api from '../lib/api'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

export default function Login() {
  const [form, setForm] = useState({ email:'', password:'' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      login(data.access_token, { id:data.user_id, role:data.role })
      toast.success('Welcome back!')
      if (data.role==='youth') navigate('/dashboard/youth')
      else if (data.role==='admin') navigate('/dashboard/admin')
      else navigate('/dashboard/org')
    } catch(err) {
      toast.error(err.response?.data?.detail || 'Invalid email or password')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="logo" style={{color:'#fff',display:'flex',alignItems:'center',gap:'.5rem',fontWeight:800,fontSize:'1.2rem',marginBottom:'2.5rem'}}>
          <div className="logo-icon">Y</div><span>YELS</span>
        </div>
        <h2>Welcome Back!</h2>
        <p>Sign in to access your dashboard, track applications, and discover new opportunities.</p>
        <div className="auth-benefits">
          {[
            {icon:'📋', title:'View Your Applications', sub:'Check real-time status'},
            {icon:'🔔', title:'Stay Updated', sub:'Get opportunity alerts'},
            {icon:'💬', title:'Direct Messaging', sub:'Talk to employers'},
          ].map(b => (
            <div className="auth-benefit" key={b.title}>
              <div className="auth-benefit-icon" style={{fontSize:'1.1rem'}}>{b.icon}</div>
              <div className="auth-benefit-text"><strong>{b.title}</strong><span>{b.sub}</span></div>
            </div>
          ))}
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Sign in to YELS</h1>
            <p>Enter your credentials to continue</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrap">
                <input type={show?'text':'password'} placeholder="••••••••" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/>
                <span className="input-toggle" onClick={()=>setShow(!show)}>{show?<EyeOff size={16}/>:<Eye size={16}/>}</span>
              </div>
              <span className="forgot-link">Forgot password?</span>
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="auth-switch">Don&apos;t have an account? <Link to="/register">Create one free</Link></p>
        </div>
      </div>
    </div>
  )
}
`);

// ── Opportunities ─────────────────────────────────────────────────────────────
w('pages/Opportunities.jsx', `import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, DollarSign, BookOpen, Lightbulb, MapPin, Calendar, Search, Filter } from 'lucide-react'
import api from '../lib/api'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'

const TYPE_META = {
  job:      { color:'badge-blue',   icon:<Briefcase size={13}/>,  label:'Job' },
  funding:  { color:'badge-green',  icon:<DollarSign size={13}/>, label:'Funding' },
  training: { color:'badge-amber',  icon:<BookOpen size={13}/>,   label:'Training' },
  innovation:{ color:'badge-purple',icon:<Lightbulb size={13}/>,  label:'Innovation' },
}

function OppCard({ opp, onApply, applying }) {
  const meta = TYPE_META[opp.type] || TYPE_META.job
  return (
    <div className="opp-card">
      <div style={{display:'flex',alignItems:'center',gap:'.5rem',flexWrap:'wrap'}}>
        <span className={"badge "+meta.color}>{meta.icon} {meta.label}</span>
        {opp.is_remote && <span className="badge badge-gray">Remote</span>}
        <span className={"badge "+(opp.status==='open'?'badge-success':'badge-red')} style={{marginLeft:'auto'}}>{opp.status}</span>
      </div>
      <h3>{opp.title}</h3>
      <p className="opp-desc">{opp.description?.slice(0,120)}...</p>
      <div className="opp-meta">
        {opp.location && <span><MapPin size={12}/>{opp.location}</span>}
        {opp.deadline && <span><Calendar size={12}/>Deadline: {new Date(opp.deadline).toLocaleDateString()}</span>}
        {opp.industry && <span>🏭 {opp.industry}</span>}
      </div>
      {opp.salary_range && <div style={{fontSize:'.85rem',fontWeight:600,color:'var(--primary)'}}>💰 {opp.salary_range}</div>}
      {opp.funding_amount && <div style={{fontSize:'.85rem',fontWeight:600,color:'var(--green)'}}>💵 Funding: \${Number(opp.funding_amount).toLocaleString()}</div>}
      <div className="opp-card-footer">
        <Link to={"/opportunities/"+opp.id} className="btn btn-ghost btn-sm">View Details</Link>
        {onApply && <button className="btn btn-primary btn-sm" onClick={()=>onApply(opp.id)} disabled={applying===opp.id}>{applying===opp.id?'Applying...':'Quick Apply'}</button>}
      </div>
    </div>
  )
}

export default function Opportunities() {
  const { user } = useAuthStore()
  const [opps, setOpps] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ type:'', location:'', industry:'' })
  const [applying, setApplying] = useState(null)

  const fetch = async () => {
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

  useEffect(() => { fetch() }, [])

  const handleApply = async (oppId) => {
    if (!user) return toast.error('Please login to apply')
    setApplying(oppId)
    try {
      await api.post('/applications/', { opportunity_id: oppId })
      toast.success('Application submitted!')
    } catch(err) {
      toast.error(err.response?.data?.detail || 'Application failed')
    } finally { setApplying(null) }
  }

  return (
    <div style={{minHeight:'calc(100vh - 64px)',background:'var(--bg-alt)',padding:'2rem 0'}}>
      <div className="container">
        <div style={{marginBottom:'2rem'}}>
          <h1>Opportunities</h1>
          <p style={{color:'var(--text-muted)',marginTop:'.35rem'}}>Discover jobs, training, funding, and innovation challenges</p>
        </div>
        <div className="filter-bar">
          <div style={{position:'relative',flex:1,minWidth:'220px'}}>
            <Search size={16} style={{position:'absolute',left:'.75rem',top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)'}}/>
            <input placeholder="Search by industry..." value={filters.industry} onChange={e=>setFilters({...filters,industry:e.target.value})} style={{paddingLeft:'2.25rem',width:'100%'}}/>
          </div>
          <select value={filters.type} onChange={e=>setFilters({...filters,type:e.target.value})}>
            <option value="">All Types</option>
            <option value="job">Jobs</option>
            <option value="funding">Funding</option>
            <option value="training">Training</option>
          </select>
          <input placeholder="Location..." value={filters.location} onChange={e=>setFilters({...filters,location:e.target.value})} style={{minWidth:'140px'}}/>
          <button className="btn btn-primary" onClick={fetch}><Search size={15}/> Search</button>
        </div>
        {loading ? (
          <div className="cards-grid">{[1,2,3,4,5,6].map(i=><div key={i} className="skeleton-card"/>)}</div>
        ) : opps.length===0 ? (
          <div className="empty-state card">
            <Briefcase size={48} style={{margin:'0 auto 1rem',opacity:.3}}/>
            <p>No opportunities found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="cards-grid">
            {opps.map(opp=><OppCard key={opp.id} opp={opp} onApply={user?.role==='youth'?handleApply:null} applying={applying}/>)}
          </div>
        )}
      </div>
    </div>
  )
}
`);

// ── OpportunityDetail ─────────────────────────────────────────────────────────
w('pages/OpportunityDetail.jsx', `import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Calendar, Briefcase, ArrowLeft } from 'lucide-react'
import api from '../lib/api'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

export default function OpportunityDetail() {
  const { id } = useParams()
  const { user } = useAuthStore()
  const [opp, setOpp] = useState(null)
  const [cover, setCover] = useState('')
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)

  useEffect(()=>{ api.get("/opportunities/"+id).then(r=>setOpp(r.data)).catch(()=>toast.error('Not found')).finally(()=>setLoading(false)) },[id])

  const handleApply = async (e) => {
    e.preventDefault()
    if (!user) return toast.error('Please login to apply')
    setApplying(true)
    try {
      await api.post('/applications/', { opportunity_id: Number(id), cover_letter: cover })
      toast.success('Application submitted!')
    } catch(err) { toast.error(err.response?.data?.detail || 'Failed') }
    finally { setApplying(false) }
  }

  if (loading) return <div className="container" style={{padding:'4rem 0'}}><div className="skeleton" style={{height:'400px'}}/></div>
  if (!opp) return <div className="container" style={{padding:'4rem 0',textAlign:'center'}}><p>Opportunity not found.</p><Link to="/opportunities" className="btn btn-primary" style={{marginTop:'1rem'}}>Back</Link></div>

  return (
    <div style={{background:'var(--bg-alt)',minHeight:'calc(100vh - 64px)',padding:'2rem 0'}}>
      <div className="container-narrow">
        <Link to="/opportunities" style={{display:'inline-flex',alignItems:'center',gap:'.4rem',color:'var(--text-muted)',fontSize:'.875rem',marginBottom:'1.5rem'}}><ArrowLeft size={16}/>Back to Opportunities</Link>
        <div className="card" style={{marginBottom:'1.5rem'}}>
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'1rem',flexWrap:'wrap',marginBottom:'1.25rem'}}>
            <div>
              <span className="badge badge-blue" style={{marginBottom:'.5rem',textTransform:'capitalize'}}>{opp.type}</span>
              <h1 style={{fontSize:'1.6rem',marginBottom:'.5rem'}}>{opp.title}</h1>
              <div style={{display:'flex',flexWrap:'wrap',gap:'1rem',fontSize:'.875rem',color:'var(--text-muted)'}}>
                {opp.location && <span style={{display:'flex',alignItems:'center',gap:'.3rem'}}><MapPin size={14}/>{opp.location}</span>}
                {opp.deadline && <span style={{display:'flex',alignItems:'center',gap:'.3rem'}}><Calendar size={14}/>Deadline: {new Date(opp.deadline).toLocaleDateString()}</span>}
                {opp.industry && <span style={{display:'flex',alignItems:'center',gap:'.3rem'}}><Briefcase size={14}/>{opp.industry}</span>}
              </div>
            </div>
            <span className={"badge "+(opp.status==='open'?'badge-success':'badge-red')} style={{fontSize:'.85rem'}}>{opp.status}</span>
          </div>
          {opp.salary_range && <p style={{color:'var(--primary)',fontWeight:600,marginBottom:'.75rem'}}>💰 {opp.salary_range}</p>}
          {opp.funding_amount && <p style={{color:'var(--green)',fontWeight:600,marginBottom:'.75rem'}}>💵 Funding Available: \${Number(opp.funding_amount).toLocaleString()}</p>}
          <h3 style={{marginBottom:'.75rem'}}>Description</h3>
          <p style={{lineHeight:1.75,whiteSpace:'pre-wrap'}}>{opp.description}</p>
          {opp.required_skills?.length > 0 && (
            <div style={{marginTop:'1.5rem'}}>
              <h4 style={{marginBottom:'.5rem'}}>Required Skills</h4>
              <div style={{display:'flex',flexWrap:'wrap',gap:'.5rem'}}>
                {opp.required_skills.map(s=><span key={s.id} className="badge badge-gray">{s.name}</span>)}
              </div>
            </div>
          )}
        </div>
        {user?.role==='youth' && opp.status==='open' && (
          <div className="card">
            <h3 style={{marginBottom:'1rem'}}>Apply for this Opportunity</h3>
            <form onSubmit={handleApply}>
              <div className="form-group">
                <label className="form-label">Cover Letter (optional)</label>
                <textarea placeholder="Tell them why you are a great fit..." value={cover} onChange={e=>setCover(e.target.value)} style={{minHeight:'120px'}}/>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" disabled={applying}>{applying?'Submitting...':'Submit Application'}</button>
            </form>
          </div>
        )}
        {!user && <div className="card" style={{textAlign:'center',padding:'2rem'}}><p style={{marginBottom:'1rem'}}>Please login to apply for this opportunity</p><Link to="/login" className="btn btn-primary">Login to Apply</Link></div>}
      </div>
    </div>
  )
}
`);

// ── Sidebar Component ─────────────────────────────────────────────────────────
w('components/Sidebar.jsx', `import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import useAuthStore from '../store/authStore'

export default function Sidebar({ links, active, onSelect }) {
  const { logout } = useAuthStore()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/') }
  return (
    <aside className="sidebar">
      <div style={{padding:'1.25rem 1.25rem 1rem',borderBottom:'1px solid rgba(255,255,255,.1)',marginBottom:'.5rem'}}>
        <div className="logo" style={{color:'#fff',display:'flex',alignItems:'center',gap:'.5rem',fontWeight:800,fontSize:'1.1rem'}}>
          <div className="logo-icon">Y</div><span>YELS</span>
        </div>
      </div>
      <nav style={{flex:1}}>
        {links.map(link => (
          link.section
            ? <div key={link.section} className="sidebar-section">{link.section}</div>
            : <button key={link.id} className={"sidebar-link"+(active===link.id?' active':'')} onClick={()=>onSelect(link.id)}>
                {link.icon}<span>{link.label}</span>
              </button>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <button className="sidebar-link" onClick={handleLogout} style={{width:'100%'}}><LogOut size={16}/><span>Logout</span></button>
      </div>
    </aside>
  )
}
`);
