# crisper — Studio-Grade 320kbps Audio Engine

A modern, high-performance web application designed for **Vercel** (Frontend) and **Render** (Node.js Audio Core Backend) providing seamless 320kbps studio-grade audio search, choice selection, mastering, and direct streaming.

---

## 🏗️ Architecture

```
[ User Browser ]
       │
       ▼ (1) Fast CDN & Rose Glassmorphic UI
[ Vercel Frontend (client/) ]
       │
       ▼ (2) GET /api/search (8 Choices Grid) or POST /api/convert
[ Render Audio Core (server/) ]
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
cd server
npm install
npx playwright install chromium
npm run dev
```
* The backend will start on `http://localhost:3000`.
* Health check: `http://localhost:3000/api/health`.

### 2. Run the Frontend
Open `client/index.html` directly or run a local static server (e.g. `npx serve client -p 5000`).

---

## 🌐 1-Click Deployment Guide

### A. Deploy Backend to Render (Native Node.js, Zero Docker)
1. Push this repository to GitHub.
2. Log in to [render.com](https://render.com).
3. Click **New +** $\to$ **Web Service** $\to$ Connect your GitHub repo.
4. Set the following settings:
   * **Root Directory:** `server`
   * **Environment:** `Node`
   * **Build Command:** `npm install && npx playwright install chromium`
   * **Start Command:** `npm start`
   * **Plan:** `Free`
5. In **Environment Variables**, add:
   * `PLAYWRIGHT_BROWSERS_PATH` = `0`
6. Click **Create Web Service**.
7. Copy your live Render URL (e.g., `https://free-music-downloader.onrender.com`).

---

### B. Deploy Frontend to Vercel
1. Log in to [vercel.com](https://vercel.com).
2. Click **Add New...** $\to$ **Project** $\to$ Import your GitHub repository.
3. Keep default settings.
4. Click **Deploy**.
5. Open your Vercel site, click the **crisper Engine Status** pill in the top-right header, and paste your Render URL.
