# crisper — Studio-Grade 320kbps Audio Engine

A modern, high-performance web application designed for **Vercel** (Frontend) and **Render** (Node.js Audio Core Backend) providing seamless 320kbps studio-grade audio search, choice selection, mastering, and direct streaming.

---

## 🏗️ Architecture

```
[ User Browser ]
       │
       ▼ (1) Fast CDN & Glassmorphic UI
[ Vercel Frontend (frontend/) ]
       │
       ▼ (2) GET /api/search (8 Choices Grid) or POST /api/convert
[ Render Audio Core (backend/) ]
       │
       ├── Resolves High-Fidelity Audio Stream
       ├── Masters 320kbps Studio Audio Profile
       └── Streams .mp3 container directly to client
       │
       ▼ (3) Direct 320kbps Audio Stream
[ User Receives Mastered Track ]
```

---

## 🚀 Quick Start (Local Development)

### 1. Start the Backend Server
```bash
cd backend
npm install
npx playwright install chromium
npm run dev
```
* The backend will start on `http://localhost:3000`.
* Health check: `http://localhost:3000/api/health`.

### 2. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
* The frontend will start on `http://localhost:5000`.

---

## 🌐 Deployment Configuration

### A. Deploy Backend to Render (Native Node.js, Zero Docker)
1. Push this repository to GitHub.
2. Log in to [render.com](https://render.com).
3. Click **New +** $\to$ **Web Service** $\to$ Connect your GitHub repo.
4. Set the following settings:
   * **Root Directory:** `backend`
   * **Environment:** `Node`
   * **Build Command:** `npm install && npx playwright install chromium`
   * **Start Command:** `npm start`
   * **Plan:** `Free`
5. In **Environment Variables**, add:
   * `PLAYWRIGHT_BROWSERS_PATH` = `0`
   * `NODE_ENV` = `production`
6. Click **Create Web Service**.
7. Copy your live Render URL (e.g., `https://your-service-name.onrender.com`).

---

### B. Deploy Frontend to Vercel
1. Log in to [vercel.com](https://vercel.com).
2. Click **Add New...** $\to$ **Project** $\to$ Import your GitHub repository.
3. In **Root Directory**, choose `frontend` (or leave default if deploying root with monorepo setup).
4. In **Environment Variables**, add:
   * `NEXT_PUBLIC_BACKEND_URL` = `https://your-service-name.onrender.com` (Your Render backend URL)
5. Click **Deploy**.

---

### B. Deploy Frontend to Vercel
1. Log in to [vercel.com](https://vercel.com).
2. Click **Add New...** $\to$ **Project** $\to$ Import your GitHub repository.
3. Keep default settings.
4. Click **Deploy**.
5. Open your Vercel site, click the **crisper Engine Status** pill in the top-right header, and paste your Render URL.
