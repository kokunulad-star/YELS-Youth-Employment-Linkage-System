# YELS — Development Roadmap

Tasks ranked from **simplest** to **most complex** implementation.

---

## Phase 1 — Quick Wins (1–2 hours each)

### 1. Add missing frontend routes

**Issue:** `YouthDashboard.jsx` links to `/profile/edit` and `/profile/setup`, and `PosterDashboard.jsx` links to `/opportunities/new`, but none of these routes exist in `App.jsx`. Clicking them returns a 404.

**Files to touch:**
- `frontend/src/App.jsx`

**Action:** Add placeholder route entries that redirect back to the dashboard or show a simple "Coming soon" page. This prevents broken links.

**Complexity:** ⭐

---

### 2. Add a global backend exception handler

**Issue:** All errors are raised inline via `HTTPException`. No centralized handler means inconsistent error responses.

**File to create/touch:**
- `backend/app/core/error_handler.py` (new)
- `backend/app/main.py` (register handler)

**Action:** Add a single `@app.exception_handler(Exception)` that catches unhandled exceptions and returns a consistent JSON shape:
```json
{ "detail": "Internal server error" }
```

**Complexity:** ⭐

---

### 3. Remove unused landing page CSS from `App.css`

**Issue:** `App.css` (~418 lines) holds the old landing page styles that are now duplicated or superseded by `index.css` (~1631 lines). Dead code adds maintenance overhead.

**Action:** Delete `App.css` and its import in `App.jsx` after confirming all styles exist in `index.css`.

**Complexity:** ⭐

---

### 4. Add Post Opportunity form page

**Issue:** `PosterDashboard` links to `/opportunities/new` but the route doesn't exist.

**Files to create/touch:**
- `frontend/src/pages/CreateOpportunity.jsx` (new)
- `frontend/src/App.jsx` (add route)

**Action:** Build a form with fields for title, description, type (job/funding/training), and type-specific fields (salary, amount, duration, etc.). POST to `/api/opportunities/`.

**Complexity:** ⭐⭐

---

## Phase 2 — Moderate (2–4 hours each)

### 5. Add youth profile edit/setup pages

**Issue:** Links to `/profile/edit` and `/profile/setup` lead nowhere.

**Files to create/touch:**
- `frontend/src/pages/ProfileSetup.jsx`
- `frontend/src/pages/ProfileEdit.jsx`
- `frontend/src/App.jsx`

**Action:** 
- `ProfileSetup` — form for first/last name, location, bio, DOB, gender, phone. POST to `/api/youth/profile`.
- `ProfileEdit` — pre-fill from `GET /api/youth/profile/me`, PUT on save.
- Also add education and skills management sections.

**Complexity:** ⭐⭐

---

### 6. Add youth search page for orgs/investors

**Issue:** Backend has `GET /api/youth/search?skills=&location=&education=` but no frontend page uses it.

**Files to create/touch:**
- `frontend/src/pages/SearchYouth.jsx` (new)
- `frontend/src/App.jsx` (add route)
- `frontend/src/components/Navbar.jsx` (add nav link for org/investor)

**Action:** Search form with filters (skills, location) → display results as profile cards with name, skills, bio.

**Complexity:** ⭐⭐

---

### 7. Add pagination to list endpoints

**Issue:** `GET /api/opportunities/`, `GET /api/users`, `GET /api/notifications/`, etc. return all records.

**Files to touch:**
- `backend/app/routers/opportunities.py`
- `backend/app/routers/admin.py`
- `backend/app/routers/notifications.py`
- `backend/app/routers/messages.py`
- `backend/app/routers/applications.py`
- `backend/app/routers/youth.py`

**Action:** Add `skip` and `limit` query params to list endpoints (default `skip=0, limit=100`). Return total count alongside results.

**Complexity:** ⭐⭐

---

## Phase 3 — Substantial (4–8 hours each)

### 8. Add password reset flow

**Issue:** No way for users to recover a forgotten password. If a user loses their password, they're locked out permanently.

**Files to create/touch:**
- `backend/app/routers/auth.py` (add endpoints)
- `backend/app/schemas/auth.py` (add schemas)
- `backend/requirements.txt` (add email library if not present)
- `backend/app/core/email.py` (new — email sending helper)
- `backend/.env.example` (add SMTP config vars)
- `backend/app/config.py` (add SMTP settings)
- `frontend/src/pages/ForgotPassword.jsx` (new)
- `frontend/src/pages/ResetPassword.jsx` (new)
- `frontend/src/App.jsx` (add routes)
- `frontend/src/components/Navbar.jsx` (add "Forgot Password?" link)

**Action:**
- **Backend:**
  - `POST /api/auth/forgot-password` — accepts email, generates a short-lived JWT reset token, sends email with reset link
  - `POST /api/auth/reset-password` — accepts token + new password, validates token, updates password hash
  - Add `RESET_TOKEN_EXPIRE_MINUTES=30` to config
  - Add SMTP settings to `.env.example` (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`)
  - Create email helper that sends HTML emails via `smtplib` or `aiofiles`
- **Frontend:**
  - `ForgotPassword` — email input form, posts to `/api/auth/forgot-password`, shows success message
  - `ResetPassword` — reads token from URL query param, shows new password + confirm form, posts to `/api/auth/reset-password`
  - Add "Forgot password?" link on login page

**Complexity:** ⭐⭐⭐

---

### 9. Add email verification on registration

**Issue:** Users can register with any email without proving ownership. This allows fake/spam accounts and prevents reliable email-based communication.

**Files to create/touch:**
- `backend/app/routers/auth.py` (modify register, add verify endpoint)
- `backend/app/schemas/auth.py` (add schemas)
- `backend/app/core/email.py` (reuse from password reset)
- `backend/app/models/user.py` (add `email_verified` column)
- `db/schema.sql` (add column)
- `frontend/src/pages/VerifyEmail.jsx` (new)
- `frontend/src/App.jsx` (add route)

**Action:**
- **Backend:**
  - Add `email_verified: bool = False` column to User model
  - Modify `POST /api/auth/register` to also send a verification email with a JWT token
  - `GET /api/auth/verify-email?token=...` — validates token, sets `email_verified = True`
  - Optionally block login until email is verified (configurable via setting)
- **Frontend:**
  - `VerifyEmail` page that reads token from URL, calls verify endpoint, shows success/error
  - Show a "Verify your email" banner on dashboard if not yet verified
  - Add "Resend verification email" button

**Complexity:** ⭐⭐⭐

---

### 10. Add refresh token rotation

**Issue:** Current JWT tokens are valid for 60 minutes with no way to refresh. If a token is compromised, it's valid until expiry. Users must log in again after expiry.

**Files to create/touch:**
- `backend/app/routers/auth.py` (add refresh endpoint)
- `backend/app/schemas/auth.py` (add schemas)
- `backend/app/core/security.py` (add refresh token logic)
- `backend/app/config.py` (add refresh config)
- `backend/.env.example` (add vars)
- `frontend/src/lib/api.js` (add interceptor logic)

**Action:**
- **Backend:**
  - `POST /api/auth/refresh` — accepts refresh token, validates it, issues a new access token + new refresh token (rotation)
  - Access token: short-lived (15 min), Refresh token: long-lived (7 days)
  - Store refresh token hash in DB or as a separate table for revocation support
  - Blacklist old refresh tokens on rotation to prevent replay attacks
- **Frontend:**
  - Add response interceptor in `api.js`: on 401, attempt silent refresh via `/api/auth/refresh`
  - If refresh succeeds, retry the original request
  - If refresh fails, redirect to login
  - Store refresh token in `localStorage` alongside access token

**Complexity:** ⭐⭐⭐

---

### 11. Set up Alembic migrations

**Issue:** `alembic/versions/` is empty. The app relies on `Base.metadata.create_all()` which is unsafe for production (no change tracking, no rollback).

**Action:**
```bash
cd backend
alembic revision --autogenerate -m "initial schema"
alembic upgrade head
```
Then update `main.py` to remove the `create_all()` call and document migration workflow.

**Complexity:** ⭐⭐⭐

---

### 12. Add "Business Ideas" / Pitch feature

**Issue:** Proposal mentions youth showcasing business ideas to attract investors. Current system only has a generic bio.

**Files to create/touch:**
- `backend/app/models/business_idea.py`
- `backend/app/schemas/business_idea.py`
- `backend/app/routers/business_ideas.py`
- `backend/app/main.py`
- `db/schema.sql` (add table)
- `frontend/src/pages/MyIdeas.jsx`
- `frontend/src/pages/InvestorBrowseIdeas.jsx`

**Action:**
- **New DB table:** `business_ideas` (id, youth_id, title, description, funding_goal, category, status)
- **Backend API:** CRUD for youth to manage ideas, list endpoint for investors to browse
- **Frontend:** Youth dashboard gets "My Ideas" tab; investor dashboard gets "Browse Ideas" tab

**Complexity:** ⭐⭐⭐

---

### 13. Add tests

**Issue:** Zero tests in the entire project.

**Action:**
- **Backend:** Install `pytest`, `httpx` (for TestClient), `pytest-cov`. Write tests for:
  - Auth (register, login, invalid credentials)
  - CRUD for each major resource (youth profile, opportunities, applications)
  - Role-based access control (youth can't post opportunities, etc.)
  - Edge cases (duplicate email, missing fields, expired tokens)
- **Frontend:** Install `vitest`, `@testing-library/react`. Write tests for:
  - Login/Register form validation
  - Dashboard rendering with mock data
  - Protected route redirects

**Complexity:** ⭐⭐⭐

---

### 14. Add rate limiting on auth endpoints

**Issue:** Login/register endpoints have no brute-force protection.

**File to touch:**
- `backend/app/main.py`
- `backend/requirements.txt` (add `slowapi` or similar)

**Action:** Use `slowapi` to limit `/api/auth/login` and `/api/auth/register` to 5 requests per minute per IP.

**Complexity:** ⭐⭐⭐

---

## Phase 4 — Polish (variable effort)

| Task | Notes |
|---|---|
| Improve mobile responsiveness | Test and tweak all pages at 320px–768px |
| Add loading skeletons | Replace generic "Loading..." text with skeleton components |
| Add empty states | Design illustrations or better messaging for empty lists |
| Error toast improvements | Show more specific error messages from API |
| API response caching | Add `Cache-Control` headers or ETags for read endpoints |
| Accessibility audit | Add `aria-` labels, keyboard navigation, focus management |
| SEO tags | Add `react-helmet-async` for per-page meta titles/descriptions |
| Production deployment config | Dockerfile, nginx config, environment-specific settings |
| Database indexing | Add indexes on foreign keys and frequently-queried columns (`status`, `type`, `created_at`) |

---

## Summary by Priority

```
Priority    Task                         Effort    Impact
─────────────────────────────────────────────────────────
High        Missing routes (404 fix)       ⭐        High
High        Profile edit/setup pages       ⭐⭐       High
High        Post Opportunity form          ⭐⭐       High
High        Password reset                 ⭐⭐⭐      High
High        Email verification             ⭐⭐⭐      High
Medium      Refresh token rotation         ⭐⭐⭐      Medium
Medium      Youth search page              ⭐⭐       Medium
Medium      Pagination                     ⭐⭐       Medium
Medium      Tests                          ⭐⭐⭐      High
Medium      Alembic migrations             ⭐⭐⭐      Medium
Medium      Business ideas feature         ⭐⭐⭐      Medium
Low         Rate limiting                  ⭐⭐⭐      Low
Low         Global error handler           ⭐        Low
Low         Dead CSS cleanup               ⭐        Low
```

---

## Quickest Path to a Shippable MVP

1. Add missing routes (prevent 404s)
2. Build Profile Setup & Edit pages
3. Build Post Opportunity form
4. Add youth search page
5. Add pagination
6. Set up Alembic migrations
7. Write core backend tests

This covers all critical user flows and production readiness in ~20 hours of work.
