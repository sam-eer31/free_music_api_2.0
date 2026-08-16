# crisper — Studio-Grade 320kbps Audio Engine & Developer API

A modern web application and lightweight REST/SSE API providing seamless 320kbps audio search, 5-stage mastering, and direct 48-hour cloud delivery via **tmpfiles.org**.

---

## 🔌 Single Unified API Endpoint

Base URL: `https://crisper.onrender.com/api/v1/audio`

Pass your search query or YouTube link in the `input` parameter:

### 1. Search Songs
* **Request:** `GET /api/v1/audio?input=Faded+Alan+Walker`
* **cURL:** `curl "https://crisper.onrender.com/api/v1/audio?input=Faded+Alan+Walker"`
* **Response:**
```json
{
  "type": "search",
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

### 2. Master & Download (One-Shot JSON)
* **Request:** `GET /api/v1/audio?input=60ItHLz5WEA` (or full YouTube URL)
* **cURL:** `curl "https://crisper.onrender.com/api/v1/audio?input=60ItHLz5WEA"`

#### Processing Pipeline:
1. **Stage 1 (Resolving):** Resolves track ID and extracts metadata.
2. **Stage 2 (Profiling):** Configures 320kbps studio profile.
3. **Stage 3 (Mastering):** Captures and masters audio stream into MP3 container.
4. **Stage 4 (Upload):** Uploads container to `tmpfiles.org` (48-hour lifetime CDN).
5. **Stage 5 (Return):** Cleans local disk and returns direct download URL.

#### Final Return Payload (200 OK):
```json
{
  "type": "download",
  "success": true,
  "title": "Alan Walker - Faded",
  "filename": "Alan Walker - Faded.mp3",
  "audioId": "60ItHLz5WEA",
  "quality": "320kbps",
  "sizeBytes": 8192000,
  "sizeFormatted": "7.81 MB",
  "downloadUrl": "https://tmpfiles.org/dl/wdwkSwFuQcFs/Alan_Walker_-_Faded.mp3",
  "expiresIn": "48 Hours",
  "uploadedAt": "2026-08-15T18:00:20.123Z"
}
```

---

### 3. Live 5-Stage Progress Stream (SSE)
Add `&stream=true` to receive live Server-Sent Events for each stage as it executes in real-time.

* **Request:** `GET /api/v1/audio?input=60ItHLz5WEA&stream=true`
* **cURL:** `curl -N "https://crisper.onrender.com/api/v1/audio?input=60ItHLz5WEA&stream=true"`
* **Live Event Stream Output:**
```text
data: {"step":1,"stage":"resolving","message":"Resolving audio source...","timestamp":"..."}

data: {"step":2,"stage":"profiling","message":"Configuring 320kbps high-fidelity profile...","timestamp":"..."}

data: {"step":3,"stage":"mastering","message":"Packaging and mastering audio stream...","timestamp":"..."}

data: {"step":4,"stage":"uploading","message":"Uploading container to tmpfiles (48h)...","timestamp":"..."}

data: {"step":5,"stage":"completed","downloadUrl":"https://tmpfiles.org/dl/wdwkSwFuQcFs/Alan_Walker_-_Faded.mp3","expiresIn":"48 Hours"}
```

---

## 🚀 Quick Start (Local Development)

### 🪟 Windows (1-Click Batch Scripts)
1. **Setup**: Double-click `setup.bat` (installs backend & frontend dependencies, creates folders, and downloads Playwright Chromium).
2. **Run**: Double-click `run.bat` (launches backend on `:3000`, frontend on `:5000`, and opens your browser to `http://localhost:5000`).

---

### 💻 Manual Setup (Linux / macOS / CLI)

#### 1. Start Backend
```bash
cd backend
npm install
npx playwright install chromium
npm run dev
```
* Backend runs on `http://localhost:3000`.

#### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
* Frontend runs on `http://localhost:5000`.

