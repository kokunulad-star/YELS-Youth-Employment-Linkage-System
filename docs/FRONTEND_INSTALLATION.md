# YELS Frontend Installation Guide

## Prerequisites

| Requirement | Linux | Windows |
|---|---|---|
| **Node.js 18+** | `node --version` | [nodejs.org](https://nodejs.org) |
| **npm 9+** | `npm --version` | Included with Node.js |
| **Git** (optional) | `git --version` | [git-scm.com](https://git-scm.com) |

> The backend server must be running on `http://localhost:8000` for the frontend to work. See [BACKEND_INSTALLATION.md](./BACKEND_INSTALLATION.md).

---

## 1. Install Node.js

### Linux (Ubuntu/Debian)

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verify:

```bash
node --version   # v22.x or higher
npm --version    # 10.x or higher
```

### Windows

1. Download the **LTS installer** from https://nodejs.org
2. Run the installer — ensure **"Add to PATH"** is checked
3. Restart your terminal

Verify:

```cmd
node --version
npm --version
```

---

## 2. Navigate to Frontend

```bash
cd /path/to/YELS-Youth-Employment-Linkage-System/frontend
```

---

## 3. Install Dependencies

```bash
npm install
```

This installs all packages from `package.json`, including:

- `react` / `react-dom` — UI framework
- `react-router-dom` — routing
- `axios` — HTTP client for API calls
- `zustand` — state management
- `@tanstack/react-query` — server state & caching
- `react-hook-form` + `zod` — form validation
- `lucide-react` — icons
- `react-hot-toast` — notifications
- `vite` — build tool & dev server

---

## 4. Configure Environment (Optional)

The frontend proxies API requests to the backend. This is already configured in `vite.config.js`:

```js
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
  },
}
```

No `.env` file is needed for development — all `/api/*` requests automatically forward to `localhost:8000`.

If your backend runs on a different host/port, update the `target` in `vite.config.js`.

---

## 5. Start the Dev Server

```bash
npm run dev
```

Expected output:

```
VITE v8.0.12  ready in 200ms
➜  Local:   http://localhost:3000
```

---

## 6. Build for Production

```bash
npm run build
```

Output goes to the `dist/` folder. Preview with:

```bash
npm run preview
```

---

## 7. Frontend Pages

| Route | Page | Description |
|---|---|---|
| `/` | Landing | Marketing / hero page |
| `/login` | Login | User authentication |
| `/register` | Register | New user signup |
| `/opportunities` | Opportunities | Browse job/funding/training listings |
| `/opportunities/:id` | Opportunity Detail | Full posting details |
| `/messages` | Messages | Direct messaging |
| `/notifications` | Notifications | In-app alerts |
| `/dashboard/youth` | Youth Dashboard | Youth profile & applications |
| `/dashboard/poster` | Poster Dashboard | Org/investor opportunities & applicants |
| `/dashboard/admin` | Admin Dashboard | User & skills management |

---

## 8. Verify Full Stack

1. Start the backend: `uvicorn app.main:app --reload --port 8000`
2. Start the frontend: `npm run dev`
3. Open http://localhost:3000 in your browser
4. Register a new user → login → navigate the dashboard

API calls from the frontend (`/api/*`) are automatically proxied to the backend.

---

## Troubleshooting

| Error | Solution |
|---|---|
| `npm: command not found` | Install Node.js and npm |
| `ERR_OSSL_EVP_UNSUPPORTED` | Use Node.js 18+ or set `NODE_OPTIONS=--openssl-legacy-provider` |
| `Module not found` | Run `npm install` and ensure no `package-lock.json` conflicts |
| `ECONNREFUSED` on API calls | Ensure backend is running on port 8000 |
| CORS errors | Check that backend CORS allows `localhost:3000` (configured in `backend/app/main.py`) |
| Port 3000 already in use | Change port in `vite.config.js` → `server.port: 3001` |

## Stopping the Server

Press `Ctrl+C` in the terminal.
