# crisper — Studio-Grade 320kbps Audio Engine & Developer API

A modern, high-performance web application and public REST/SSE API providing seamless 320kbps studio-grade audio search, choice selection, 5-stage progress streaming, mastering, and 48-hour cloud delivery via **tmpfiles.org**.

---

## 🔌 Developer API Reference (`/api/v1`)

Base URL: `https://crisper.onrender.com/api/v1` (or your custom Render backend URL)

### 1. Multi-Track Search
Search YouTube for tracks and receive top matching results with metadata.

* **Endpoint:** `GET /api/v1/search?q={query}`
* **Example:** `curl "https://crisper.onrender.com/api/v1/search?q=Faded+Alan+Walker"`
* **Response:**
```json
{
  "success": true,
  "query": "Faded Alan Walker",
  "count": 8,
  "results": [
    {
      "id": "60ItHLz5WEA",
      "title": "Alan Walker - Faded",
      "channel": "Alan Walker",
      "duration": "3:33",
      "thumbnail": "https://i.ytimg.com/vi/60ItHLz5WEA/hq720.jpg"
    }
  ]
}
```

---

### 2. Unified Query / Link Router
Pass either a plain search phrase or a direct YouTube URL / ID. Automatically detects whether to return search results or trigger 48h cloud download.

* **Endpoint:** `GET /api/v1/unified?input={query_or_url}` or `POST /api/v1/unified`
* **If Search Query:** Returns `{ type: "search", count: 8, results: [...] }`
* **If Direct URL or ID:** Returns `{ type: "download", success: true, downloadUrl: "https://tmpfiles.org/dl/...", expiresIn: "48 Hours", ... }`

---

### 3. Real-Time 5-Stage Live Progress Stream (SSE)
Streams Server-Sent Events (SSE) in real-time across all 5 mastering stages.

* **Endpoint:** `GET /api/v1/stream?input={url_or_id}`
* **Example:** `curl -N "https://crisper.onrender.com/api/v1/stream?input=60ItHLz5WEA"`
* **Live Event Stream:**
```text
data: {"step":1,"stage":"resolving","message":"Resolving audio source for \"60ItHLz5WEA\"...","timestamp":"..."}

data: {"step":2,"stage":"profiling","message":"Configuring 320kbps high-fidelity profile...","timestamp":"..."}

data: {"step":3,"stage":"mastering","message":"Packaging and mastering audio stream...","timestamp":"..."}

data: {"step":4,"stage":"uploading","message":"Uploading container to tmpfiles (48h lifetime)...","timestamp":"..."}

data: {"step":5,"stage":"completed","message":"Audio stream container ready!","data":{"success":true,"title":"Alan Walker - Faded","filename":"Alan Walker - Faded.mp3","audioId":"60ItHLz5WEA","quality":"320kbps","sizeBytes":8192000,"sizeFormatted":"7.81 MB","downloadUrl":"https://tmpfiles.org/dl/wdwkSwFuQcFs/Alan_Walker_-_Faded.mp3","expiresIn":"48 Hours"},"timestamp":"..."}
```

---

### 4. Standard Synchronous REST Processing
Runs all 5 stages in a single HTTP request and returns the final 48h tmpfiles download link.

* **Endpoint:** `POST /api/v1/process`
* **Headers:** `Content-Type: application/json`
* **Body:**
```json
{
  "input": "https://www.youtube.com/watch?v=60ItHLz5WEA",
  "quality": "320kbps"
}
```
* **Response:**
```json
{
  "success": true,
  "title": "Alan Walker - Faded",
  "filename": "Alan Walker - Faded.mp3",
  "audioId": "60ItHLz5WEA",
  "quality": "320kbps",
  "sizeBytes": 8192000,
  "sizeFormatted": "7.81 MB",
  "downloadUrl": "https://tmpfiles.org/dl/wdwkSwFuQcFs/Alan_Walker_-_Faded.mp3",
  "expiresIn": "48 Hours",
  "uploadedAt": "2026-08-15T17:52:59.386Z"
}
```

---

### 5. Media Info Validation
* **Endpoint:** `GET /api/v1/info?input={url_or_id}`
* **Response:**
```json
{
  "success": true,
  "videoId": "60ItHLz5WEA",
  "standardUrl": "https://www.youtube.com/watch?v=60ItHLz5WEA",
  "thumbnail": "https://i.ytimg.com/vi/60ItHLz5WEA/hqdefault.jpg"
}
```

---

## 🚀 Quick Start (Local Development)

### 1. Start Backend
```bash
cd backend
npm install
npx playwright install chromium
npm run dev
```
* Port: `http://localhost:3000`
* API Base: `http://localhost:3000/api/v1`

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
* Port: `http://localhost:5000`

---

## 🌐 Deployment

### A. Deploy Backend to Render
1. Push repository to GitHub.
2. In Render, create **Web Service** with Root Directory: `backend`.
3. Build Command: `npm install && npx playwright install chromium`
4. Start Command: `npm start`
5. Environment Variables:
   * `PLAYWRIGHT_BROWSERS_PATH` = `0`
   * `NODE_ENV` = `production`

### B. Deploy Frontend to Vercel
1. In Vercel, import repository with Root Directory: `frontend`.
2. Environment Variable:
   * `NEXT_PUBLIC_BACKEND_URL` = `https://your-backend.onrender.com`
3. Click **Deploy**.
