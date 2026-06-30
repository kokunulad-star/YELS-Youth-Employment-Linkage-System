import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { MapPin, Calendar, Briefcase, ArrowLeft, Upload, FileText, X, CreditCard, CheckCircle } from 'lucide-react'
import api from '../lib/api'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

const MAX_SIZE = 5 * 1024 * 1024
const ALLOWED = ['.pdf', '.doc', '.docx']

// ── Payment Modal ─────────────────────────────────────────────────────────────
function PaymentModal({ opp, onClose, onSuccess }) {
  const [method, setMethod]       = useState('mpesa')
  const [reference, setReference] = useState('')
  const [paying, setPaying]       = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setPaying(true)
    try {
      await api.post('/payments/', {
        opportunity_id: opp.id,
        method,
        reference: reference.trim() || undefined,
      })
      toast.success('Payment details submitted! Your enrollment will be confirmed shortly.')
      onSuccess()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Submission failed')
    } finally { setPaying(false) }
  }

  const price = opp.funding_amount ? `TZS ${Number(opp.funding_amount).toLocaleString()}` : ''

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Payment Details</h3>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="payment-program-info">
            <div className="payment-program-name">{opp.title}</div>
            {price && <div className="payment-amount">{price}</div>}
          </div>

          <p style={{ fontSize: '.875rem', color: 'var(--text-muted)', margin: '1rem 0 .5rem' }}>
            Make your payment using any of the methods below, then enter your transaction reference so we can confirm your enrollment.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Method selector */}
            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <div className="payment-methods">
                {[
                  { value: 'mpesa', label: 'M-Pesa', emoji: '📱' },
                  { value: 'bank',  label: 'Bank',   emoji: '🏦' },
                  { value: 'card',  label: 'Card',   emoji: '💳' },
                ].map(m => (
                  <button key={m.value} type="button"
                    className={`payment-method-btn${method === m.value ? ' active' : ''}`}
                    onClick={() => setMethod(m.value)}
                  >
                    <span className="payment-method-emoji">{m.emoji}</span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Account details — read only */}
            {method === 'mpesa' && (
              <div className="payment-details-box">
                <div className="payment-details-row"><span>Lipa Number</span><strong>154678</strong></div>
                <div className="payment-details-row"><span>Name</span><strong>DATIVA LUCAS</strong></div>
                {price && <div className="payment-details-row"><span>Amount</span><strong>{price}</strong></div>}
              </div>
            )}

            {method === 'bank' && (
              <div>
                <div className="payment-details-box" style={{ marginBottom: '.75rem' }}>
                  <div className="payment-details-label">CRDB Bank</div>
                  <div className="payment-details-row"><span>Account Number</span><strong>0150694823001</strong></div>
                  <div className="payment-details-row"><span>Account Name</span><strong>YELS PLATFORM CO.</strong></div>
                  {price && <div className="payment-details-row"><span>Amount</span><strong>{price}</strong></div>}
                </div>
                <div className="payment-details-box">
                  <div className="payment-details-label">NMB Bank</div>
                  <div className="payment-details-row"><span>Account Number</span><strong>40271089500</strong></div>
                  <div className="payment-details-row"><span>Account Name</span><strong>YELS PLATFORM CO.</strong></div>
                  {price && <div className="payment-details-row"><span>Amount</span><strong>{price}</strong></div>}
                </div>
              </div>
            )}

            {method === 'card' && (
              <div className="payment-details-box">
                <div className="payment-details-row"><span>Card payments</span><strong>Contact admin for card details</strong></div>
              </div>
            )}

            {/* Reference input */}
            <div className="form-group" style={{ marginTop: '1.25rem' }}>
              <label className="form-label">
                Transaction Reference <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(required)</span>
              </label>
              <input
                placeholder={method === 'mpesa' ? 'e.g. QJK7T3XY9Z' : 'e.g. Bank slip / receipt number'}
                value={reference}
                onChange={e => setReference(e.target.value)}
                required
                style={{ textTransform: method === 'mpesa' ? 'uppercase' : 'none' }}
              />
              <p style={{ fontSize: '.78rem', color: 'var(--text-muted)', marginTop: '.3rem' }}>
                Enter the reference number from your payment receipt or SMS confirmation.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '.75rem', marginTop: '1.25rem' }}>
              <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 1 }} disabled={paying}>
                {paying ? 'Submitting...' : 'Submit Payment Reference'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function OpportunityDetail() {
  const { id }      = useParams()
  const { user }    = useAuthStore()
  const navigate    = useNavigate()
  const fileRef     = useRef(null)

  const [opp, setOpp]               = useState(null)
  const [loading, setLoading]       = useState(true)
  const [docFile, setDocFile]       = useState(null)
  const [applying, setApplying]     = useState(false)
  const [showForm, setShowForm]     = useState(false)
  const [applied, setApplied]       = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [paid, setPaid]             = useState(false)

  useEffect(() => {
    api.get(`/opportunities/${id}`)
      .then(({ data }) => setOpp(data))
      .catch(() => { toast.error('Opportunity not found'); navigate('/opportunities') })
      .finally(() => setLoading(false))
  }, [id])

  // Check existing payment for training programs
  useEffect(() => {
    if (!opp || user?.role !== 'youth') return
    if (opp.type === 'training') {
      api.get(`/payments/check/${opp.id}`)
        .then(({ data }) => setPaid(Boolean(data)))
        .catch(() => {})
    }
  }, [opp?.id])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const ext = '.' + file.name.split('.').pop().toLowerCase()
    if (!ALLOWED.includes(ext)) { toast.error('Only PDF, DOC, or DOCX files are allowed'); e.target.value = ''; return }
    if (file.size > MAX_SIZE) { toast.error('File must not exceed 5 MB'); e.target.value = ''; return }
    setDocFile(file)
  }

  const removeFile = () => { setDocFile(null); if (fileRef.current) fileRef.current.value = '' }

  const handleApply = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    setApplying(true)
    try {
      const fd = new FormData()
      fd.append('opportunity_id', id)
      if (docFile) fd.append('document', docFile)
      await api.post('/applications/', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Application submitted!')
      setShowForm(false)
      setDocFile(null)
      setApplied(true)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Could not submit application')
    } finally { setApplying(false) }
  }

  if (loading) return (
    <div className="page-container" style={{ padding: '3rem 0' }}>
      <div className="skeleton" style={{ height: 400, borderRadius: '1rem' }} />
    </div>
  )

  if (!opp) return null

  // Training with a price set by admin
  const isTraining    = opp.type === 'training'
  const hasFee        = isTraining && opp.funding_amount && Number(opp.funding_amount) > 0
  const priceLabel    = hasFee ? `TZS ${Number(opp.funding_amount).toLocaleString()}` : null
  const typeColor     = { job: 'badge-blue', funding: 'badge-green', training: 'badge-amber' }[opp.type] || 'badge-blue'

  return (
    <div className="opp-detail-page">
      {showPayment && (
        <PaymentModal
          opp={opp}
          onClose={() => setShowPayment(false)}
          onSuccess={() => { setPaid(true); setShowPayment(false) }}
        />
      )}

      <div className="page-container">
        <Link to="/opportunities" className="back-link"><ArrowLeft size={15} /> Back to Opportunities</Link>

        <div className="opp-detail-card">
          {/* ── Header ── */}
          <div className="opp-detail-header">
            <div className="opp-detail-badges">
              <span className={`badge ${typeColor}`} style={{ textTransform: 'capitalize' }}>{opp.type}</span>
              {opp.is_remote && <span className="badge badge-purple">Remote</span>}
              <span className={`badge ${opp.status === 'open' ? 'badge-success' : 'badge-red'}`}>{opp.status}</span>
              {hasFee && (
                <span className="badge badge-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <CreditCard size={11} /> {priceLabel}
                </span>
              )}
            </div>
            <h1 className="opp-detail-title">{opp.title}</h1>
            <div className="opp-detail-meta">
              {opp.location && <span><MapPin size={14} /> {opp.location}</span>}
              {opp.deadline && <span><Calendar size={14} /> Deadline: {new Date(opp.deadline).toLocaleDateString()}</span>}
              {opp.industry && <span><Briefcase size={14} /> {opp.industry}</span>}
            </div>
            {opp.salary_range && <div className="opp-detail-highlight" style={{ color: 'var(--primary)' }}>💰 Salary: {opp.salary_range}</div>}
            {opp.duration     && <div className="opp-detail-highlight" style={{ color: 'var(--accent)' }}>⏱ Duration: {opp.duration}{opp.mode ? ` · ${opp.mode.replace('_', ' ')}` : ''}</div>}
          </div>

          {/* ── Body ── */}
          <div className="opp-detail-body">
            <h3>Description</h3>
            <p style={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{opp.description}</p>

            {opp.job_type && (
              <div className="opp-detail-extra-row">
                <span className="badge badge-blue" style={{ textTransform: 'capitalize' }}>{opp.job_type.replace('_', ' ')}</span>
              </div>
            )}

            {opp.required_skills?.length > 0 && (
              <div className="opp-skills-section">
                <h4>Required Skills</h4>
                <div className="opp-skills-list">
                  {opp.required_skills.map(s => <span key={s.id} className="skill-tag">{s.name}</span>)}
                </div>
              </div>
            )}
          </div>

          {/* ── Footer: apply / payment ── */}
          <div className="opp-detail-footer">
            {user?.role === 'youth' && opp.status === 'open' ? (
              <>
                {!applied ? (
                  /* Step 1 — apply form */
                  !showForm ? (
                    <button className="btn btn-primary btn-lg" onClick={() => setShowForm(true)}>Apply Now</button>
                  ) : (
                    <form onSubmit={handleApply} className="apply-form">
                      <h3>Submit Your Application</h3>
                      <div className="form-group">
                        <label className="form-label">
                          Upload Document <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(PDF, DOC, DOCX — max 5 MB)</span>
                        </label>
                        {!docFile ? (
                          <label className="file-upload-area">
                            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" hidden onChange={handleFileChange} />
                            <Upload size={22} style={{ opacity: .4 }} />
                            <span>Click to upload or drag & drop</span>
                            <small>PDF, DOC, DOCX · Max 5 MB</small>
                          </label>
                        ) : (
                          <div className="file-preview">
                            <FileText size={18} style={{ color: 'var(--primary)' }} />
                            <span className="file-preview-name">{docFile.name}</span>
                            <span className="file-preview-size">({(docFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                            <button type="button" className="file-remove-btn" onClick={removeFile}><X size={14} /></button>
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '.75rem', marginTop: '1rem' }}>
                        <button type="submit" className="btn btn-primary btn-lg" disabled={applying}>
                          {applying ? 'Submitting...' : 'Submit Application'}
                        </button>
                        <button type="button" className="btn btn-outline" onClick={() => { setShowForm(false); removeFile() }}>Cancel</button>
                      </div>
                    </form>
                  )
                ) : (
                  /* Step 2 — post submission */
                  <div className="apply-success-box">
                    <div className="apply-success-icon"><CheckCircle size={28} color="#10b981" /></div>
                    <div style={{ flex: 1 }}>
                      <div className="apply-success-title">Application submitted!</div>

                      {/* Payment button — training programs only */}
                      {isTraining && !paid && (
                        <div className="payment-prompt">
                          <p>
                            {hasFee
                              ? 'This training program requires a fee. Complete your enrollment by making the payment.'
                              : 'This training program requires payment to confirm your enrollment.'}
                          </p>
                          <button className="btn btn-primary btn-lg" onClick={() => setShowPayment(true)}>
                            <CreditCard size={15} />
                            {hasFee ? ` Pay ${priceLabel} to Enroll` : ' Pay to Enroll'}
                          </button>
                        </div>
                      )}

                      {isTraining && paid && (
                        <div className="payment-done">
                          <CheckCircle size={16} color="#10b981" />
                          <span>Payment complete — you're enrolled!</span>
                        </div>
                      )}

                      {!isTraining && (
                        <p style={{ color: 'var(--text-muted)', fontSize: '.9rem', marginTop: '.5rem' }}>
                          You will be notified once your application is reviewed.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : !user ? (
              <div className="auth-prompt">
                <p>Want to apply for this opportunity?</p>
                <div style={{ display: 'flex', gap: '.75rem', marginTop: '.75rem' }}>
                  <Link to="/login" className="btn btn-primary">Sign In</Link>
                  <Link to="/register" className="btn btn-outline">Create Account</Link>
                </div>
              </div>
            ) : user?.role !== 'youth' ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>Only youth accounts can apply for opportunities.</p>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>This opportunity is currently closed.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
