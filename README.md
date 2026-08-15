# crisper — Studio-Grade 320kbps Audio Engine & Developer API

A modern web application and lightweight REST API providing seamless 320kbps audio search and direct 48-hour cloud delivery via **tmpfiles.org**.

---

## 🔌 Single Unified API Endpoint

Base URL: `https://crisper.onrender.com/api/v1/audio`

Pass your search query or YouTube link in the `input` parameter:

### Case 1: Search Songs
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

### Case 2: Master & Download (48h Direct Link)
* **Request:** `GET /api/v1/audio?input=60ItHLz5WEA` (or full YouTube URL)
* **cURL:** `curl "https://crisper.onrender.com/api/v1/audio?input=60ItHLz5WEA"`
* **Response:**
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

## 🚀 Quick Start (Local Development)

### 1. Start Backend
```bash
cd backend
npm install
npx playwright install chromium
npm run dev
```
* Backend runs on `http://localhost:3000`.

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
* Frontend runs on `http://localhost:5000`.
