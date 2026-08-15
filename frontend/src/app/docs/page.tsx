'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ToastContainer } from '@/components/ToastContainer';
import { useToast } from '@/hooks/useToast';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { useTheme } from '@/hooks/useTheme';

interface EndpointParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
  location: 'query' | 'body';
  defaultVal?: string;
}

interface EndpointDoc {
  id: string;
  method: 'GET' | 'POST';
  path: string;
  title: string;
  description: string;
  category: 'Core' | 'Streaming' | 'Utility';
  params: EndpointParam[];
  sampleRequest: {
    curl: string;
    js: string;
    python: string;
  };
  sampleResponse: Record<string, unknown> | string;
  defaultTestInput: string;
}

const ENDPOINTS: EndpointDoc[] = [
  {
    id: 'search',
    method: 'GET',
    path: '/api/v1/search',
    title: 'Multi-Track Search',
    category: 'Core',
    description: 'Searches the audio index and returns the top matching choices with IDs, titles, artists, thumbnails, and durations.',
    params: [
      {
        name: 'q',
        type: 'string',
        required: true,
        location: 'query',
        description: 'Search query or song title (e.g. "Faded Alan Walker").',
        defaultVal: 'Alan Walker Faded'
      }
    ],
    sampleRequest: {
      curl: 'curl -X GET "https://crisper.onrender.com/api/v1/search?q=Faded+Alan+Walker"',
      js: `const res = await fetch('https://crisper.onrender.com/api/v1/search?q=' + encodeURIComponent('Faded Alan Walker'));
const data = await res.json();
console.log(data.results);`,
      python: `import requests

res = requests.get('https://crisper.onrender.com/api/v1/search', params={'q': 'Faded Alan Walker'})
print(res.json()['results'])`
    },
    sampleResponse: {
      success: true,
      query: "Faded Alan Walker",
      count: 8,
      results: [
        {
          id: "60ItHLz5WEA",
          title: "Alan Walker - Faded",
          channel: "Alan Walker",
          duration: "3:33",
          thumbnail: "https://i.ytimg.com/vi/60ItHLz5WEA/hq720.jpg"
        }
      ]
    },
    defaultTestInput: 'Alan Walker Faded'
  },
  {
    id: 'stream',
    method: 'GET',
    path: '/api/v1/stream',
    title: '5-Stage Live Progress Stream (SSE)',
    category: 'Streaming',
    description: 'Opens a Server-Sent Events (SSE) connection streaming real-time status across all 5 mastering stages, concluding with a 48-hour tmpfiles direct download URL.',
    params: [
      {
        name: 'input',
        type: 'string',
        required: true,
        location: 'query',
        description: 'Direct YouTube link or 11-character Video ID (e.g. "60ItHLz5WEA" or "-LESbtPT8uw").',
        defaultVal: '60ItHLz5WEA'
      },
      {
        name: 'quality',
        type: 'string',
        required: false,
        location: 'query',
        description: 'Audio bitrate quality profile. Default is "320kbps".',
        defaultVal: '320kbps'
      }
    ],
    sampleRequest: {
      curl: 'curl -N "https://crisper.onrender.com/api/v1/stream?input=60ItHLz5WEA"',
      js: `const eventSource = new EventSource('https://crisper.onrender.com/api/v1/stream?input=60ItHLz5WEA');

eventSource.onmessage = (e) => {
  const event = JSON.parse(e.data);
  console.log(\`[Step \${event.step}/5] \${event.stage}: \${event.message}\`);
  if (event.step === 5) {
    console.log('Direct Download URL (48h):', event.data.downloadUrl);
    eventSource.close();
  }
};`,
      python: `import requests
import json

response = requests.get('https://crisper.onrender.com/api/v1/stream', params={'input': '60ItHLz5WEA'}, stream=True)

for line in response.iter_lines():
    if line and line.startswith(b'data: '):
        data = json.loads(line[6:].decode('utf-8'))
        print(f"Step {data.get('step')}: {data.get('message')}")
        if data.get('step') == 5:
            print("Download Link:", data['data']['downloadUrl'])`
    },
    sampleResponse: `data: {"step":1,"stage":"resolving","message":"Resolving audio source for \\"60ItHLz5WEA\\"...","timestamp":"2026-08-15T18:00:01Z"}

data: {"step":2,"stage":"profiling","message":"Configuring 320kbps high-fidelity profile...","timestamp":"2026-08-15T18:00:04Z"}

data: {"step":3,"stage":"mastering","message":"Packaging and mastering audio stream...","timestamp":"2026-08-15T18:00:08Z"}

data: {"step":4,"stage":"uploading","message":"Uploading container to tmpfiles (48h lifetime)...","timestamp":"2026-08-15T18:00:18Z"}

data: {"step":5,"stage":"completed","message":"Audio stream container ready!","data":{"success":true,"title":"Alan Walker - Faded","filename":"Alan Walker - Faded.mp3","audioId":"60ItHLz5WEA","quality":"320kbps","sizeBytes":8192000,"sizeFormatted":"7.81 MB","downloadUrl":"https://tmpfiles.org/dl/wdwkSwFuQcFs/Alan_Walker_-_Faded.mp3","expiresIn":"48 Hours"},"timestamp":"2026-08-15T18:00:20Z"}`,
    defaultTestInput: '60ItHLz5WEA'
  },
  {
    id: 'process',
    method: 'POST',
    path: '/api/v1/process',
    title: 'Synchronous REST Master & 48h Upload',
    category: 'Core',
    description: 'Executes the entire 5-stage mastering pipeline synchronously in a single request and returns the direct 48-hour tmpfiles download URL and file metadata.',
    params: [
      {
        name: 'input',
        type: 'string',
        required: true,
        location: 'body',
        description: 'Direct YouTube video link or 11-char ID.',
        defaultVal: 'https://www.youtube.com/watch?v=60ItHLz5WEA'
      },
      {
        name: 'quality',
        type: 'string',
        required: false,
        location: 'body',
        description: 'Audio bitrate quality profile. Default: "320kbps".',
        defaultVal: '320kbps'
      }
    ],
    sampleRequest: {
      curl: `curl -X POST "https://crisper.onrender.com/api/v1/process" \\
  -H "Content-Type: application/json" \\
  -d '{"input": "https://www.youtube.com/watch?v=60ItHLz5WEA"}'`,
      js: `const res = await fetch('https://crisper.onrender.com/api/v1/process', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ input: 'https://www.youtube.com/watch?v=60ItHLz5WEA' })
});
const data = await res.json();
console.log(data.downloadUrl);`,
      python: `import requests

res = requests.post(
    'https://crisper.onrender.com/api/v1/process',
    json={'input': 'https://www.youtube.com/watch?v=60ItHLz5WEA'}
)
print(res.json()['downloadUrl'])`
    },
    sampleResponse: {
      success: true,
      title: "Alan Walker - Faded",
      filename: "Alan Walker - Faded.mp3",
      audioId: "60ItHLz5WEA",
      quality: "320kbps",
      sizeBytes: 8192000,
      sizeFormatted: "7.81 MB",
      downloadUrl: "https://tmpfiles.org/dl/wdwkSwFuQcFs/Alan_Walker_-_Faded.mp3",
      expiresIn: "48 Hours",
      uploadedAt: "2026-08-15T18:00:20.123Z"
    },
    defaultTestInput: 'https://www.youtube.com/watch?v=60ItHLz5WEA'
  },
  {
    id: 'unified',
    method: 'GET',
    path: '/api/v1/unified',
    title: 'Smart Unified Query / Link Router',
    category: 'Core',
    description: 'Auto-detects whether the given input is a search query or direct link. Returns search results for queries, or executes 5-stage cloud download for links/IDs.',
    params: [
      {
        name: 'input',
        type: 'string',
        required: true,
        location: 'query',
        description: 'Song title, YouTube URL, or 11-char Video ID.',
        defaultVal: 'Alan Walker Faded'
      }
    ],
    sampleRequest: {
      curl: 'curl -X GET "https://crisper.onrender.com/api/v1/unified?input=Alan+Walker+Faded"',
      js: `const res = await fetch('https://crisper.onrender.com/api/v1/unified?input=' + encodeURIComponent('Alan Walker Faded'));
const data = await res.json();
if (data.type === 'search') {
  console.log('Search matches:', data.results);
} else {
  console.log('Download URL:', data.downloadUrl);
}`,
      python: `import requests

res = requests.get('https://crisper.onrender.com/api/v1/unified', params={'input': 'Alan Walker Faded'})
print(res.json())`
    },
    sampleResponse: {
      type: "search",
      success: true,
      query: "Alan Walker Faded",
      count: 8,
      results: [
        {
          id: "60ItHLz5WEA",
          title: "Alan Walker - Faded",
          channel: "Alan Walker",
          duration: "3:33",
          thumbnail: "https://i.ytimg.com/vi/60ItHLz5WEA/hq720.jpg"
        }
      ]
    },
    defaultTestInput: 'Alan Walker Faded'
  },
  {
    id: 'info',
    method: 'GET',
    path: '/api/v1/info',
    title: 'Metadata & ID Validator',
    category: 'Utility',
    description: 'Validates any URL or query and returns verified YouTube video metadata (standard URL, thumbnail, video ID).',
    params: [
      {
        name: 'input',
        type: 'string',
        required: true,
        location: 'query',
        description: 'YouTube URL, video ID, or song name.',
        defaultVal: '60ItHLz5WEA'
      }
    ],
    sampleRequest: {
      curl: 'curl -X GET "https://crisper.onrender.com/api/v1/info?input=60ItHLz5WEA"',
      js: `const res = await fetch('https://crisper.onrender.com/api/v1/info?input=60ItHLz5WEA');
const data = await res.json();
console.log(data.videoId, data.standardUrl);`,
      python: `import requests

res = requests.get('https://crisper.onrender.com/api/v1/info', params={'input': '60ItHLz5WEA'})
print(res.json())`
    },
    sampleResponse: {
      success: true,
      videoId: "60ItHLz5WEA",
      standardUrl: "https://www.youtube.com/watch?v=60ItHLz5WEA",
      thumbnail: "https://i.ytimg.com/vi/60ItHLz5WEA/hqdefault.jpg"
    },
    defaultTestInput: '60ItHLz5WEA'
  },
  {
    id: 'health',
    method: 'GET',
    path: '/api/v1/health',
    title: 'Engine Health Check',
    category: 'Utility',
    description: 'Returns server status, engine version, and uptime to verify backend liveness.',
    params: [],
    sampleRequest: {
      curl: 'curl -X GET "https://crisper.onrender.com/api/v1/health"',
      js: `const res = await fetch('https://crisper.onrender.com/api/v1/health');
const data = await res.json();
console.log('Status:', data.status);`,
      python: `import requests

res = requests.get('https://crisper.onrender.com/api/v1/health')
print(res.json())`
    },
    sampleResponse: {
      status: "healthy",
      api: "Crisper Public Audio API v1",
      version: "1.0.0",
      timestamp: "2026-08-15T18:00:00.000Z",
      uptime: 3600
    },
    defaultTestInput: ''
  }
];

export default function ApiDocsPage() {
  const { theme, toggleTheme, mounted } = useTheme();
  const { toasts, showToast, removeToast } = useToast();
  const audioEngine = useAudioEngine(showToast);

  const [activeTab, setActiveTab] = useState<Record<string, 'curl' | 'js' | 'python'>>({
    search: 'curl',
    stream: 'curl',
    process: 'curl',
    unified: 'curl',
    info: 'curl',
    health: 'curl',
  });

  const [testInputs, setTestInputs] = useState<Record<string, string>>({
    search: 'Alan Walker Faded',
    stream: '60ItHLz5WEA',
    process: 'https://www.youtube.com/watch?v=60ItHLz5WEA',
    unified: 'Alan Walker Faded',
    info: '60ItHLz5WEA',
    health: '',
  });

  const [testOutputs, setTestOutputs] = useState<Record<string, string>>({});
  const [loadingEndpoints, setLoadingEndpoints] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const baseUrl = audioEngine.baseUrl || 'https://crisper.onrender.com';

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    showToast('Copied to clipboard!', 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const executeTest = async (endpoint: EndpointDoc) => {
    const inputVal = testInputs[endpoint.id] || '';
    setLoadingEndpoints((prev) => ({ ...prev, [endpoint.id]: true }));
    setTestOutputs((prev) => ({ ...prev, [endpoint.id]: 'Executing request...' }));

    const url = `${baseUrl}${endpoint.path}`;

    try {
      if (endpoint.id === 'search') {
        const res = await fetch(`${url}?q=${encodeURIComponent(inputVal)}`);
        const json = await res.json();
        setTestOutputs((prev) => ({ ...prev, [endpoint.id]: JSON.stringify(json, null, 2) }));
      } else if (endpoint.id === 'info') {
        const res = await fetch(`${url}?input=${encodeURIComponent(inputVal)}`);
        const json = await res.json();
        setTestOutputs((prev) => ({ ...prev, [endpoint.id]: JSON.stringify(json, null, 2) }));
      } else if (endpoint.id === 'health') {
        const res = await fetch(url);
        const json = await res.json();
        setTestOutputs((prev) => ({ ...prev, [endpoint.id]: JSON.stringify(json, null, 2) }));
      } else if (endpoint.id === 'unified') {
        const res = await fetch(`${url}?input=${encodeURIComponent(inputVal)}`);
        const json = await res.json();
        setTestOutputs((prev) => ({ ...prev, [endpoint.id]: JSON.stringify(json, null, 2) }));
      } else if (endpoint.id === 'process') {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: inputVal, quality: '320kbps' }),
        });
        const json = await res.json();
        setTestOutputs((prev) => ({ ...prev, [endpoint.id]: JSON.stringify(json, null, 2) }));
      } else if (endpoint.id === 'stream') {
        setTestOutputs((prev) => ({ ...prev, [endpoint.id]: 'Connecting to Server-Sent Events stream...\n' }));
        const res = await fetch(`${url}?input=${encodeURIComponent(inputVal)}`);
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let logs = '';

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            logs += chunk;
            setTestOutputs((prev) => ({ ...prev, [endpoint.id]: logs }));
          }
        }
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Request failed';
      setTestOutputs((prev) => ({
        ...prev,
        [endpoint.id]: `Error: ${errMsg}\nMake sure backend is online at ${baseUrl}`,
      }));
    } finally {
      setLoadingEndpoints((prev) => ({ ...prev, [endpoint.id]: false }));
    }
  };

  return (
    <>
      <Header
        status={audioEngine.backendStatus}
        statusText={audioEngine.backendStatusText}
        onCheckHealth={() => {
          audioEngine.checkHealth();
          showToast(`Checking engine at: ${audioEngine.baseUrl}`, 'info');
        }}
        theme={theme}
        onToggleTheme={toggleTheme}
        themeMounted={mounted}
      />

      <main className="app-main docs-main">
        {/* Hero Section */}
        <section className="docs-hero-section">
          <div className="docs-badge-row">
            <span className="docs-pill-badge">v1.0.0 Public API</span>
            <span className="docs-pill-badge badge-accent">320kbps Audio Core</span>
            <span className="docs-pill-badge">48h tmpfiles CDN</span>
            <span className="docs-pill-badge">100% Free • Zero Auth Required</span>
          </div>

          <h1 className="docs-hero-title">Developer API Reference</h1>
          <p className="docs-hero-subtitle">
            Integrate studio-grade 320kbps audio extraction, YouTube track searching, and 5-stage progress streaming directly into your Discord bots, Telegram apps, or web services.
          </p>

          {/* Quick Base URL Pill */}
          <div className="docs-base-url-card">
            <span className="url-label">Production Base URL</span>
            <code className="url-code">{baseUrl}/api/v1</code>
            <button
              className="copy-url-btn"
              onClick={() => copyToClipboard(`${baseUrl}/api/v1`, 'base-url')}
            >
              {copiedKey === 'base-url' ? '✓ Copied' : 'Copy Base URL'}
            </button>
          </div>
        </section>

        {/* Documentation Layout: Sidebar + Main Content */}
        <div className="docs-layout-grid">
          {/* Sticky Sidebar Navigation */}
          <aside className="docs-sidebar">
            <div className="sidebar-section-title">Getting Started</div>
            <a href="#overview" className="sidebar-link active">Overview & Limits</a>
            <a href="#base-url" className="sidebar-link">Base URL & Headers</a>

            <div className="sidebar-section-title">Endpoints (v1)</div>
            {ENDPOINTS.map((ep) => (
              <a key={ep.id} href={`#${ep.id}`} className="sidebar-link sidebar-endpoint-link">
                <span className={`method-tag method-${ep.method.toLowerCase()}`}>{ep.method}</span>
                <span className="sidebar-endpoint-name">{ep.title}</span>
              </a>
            ))}

            <div className="sidebar-action-box">
              <Link href="/" className="btn-back-studio">
                ← Open Studio Web App
              </Link>
            </div>
          </aside>

          {/* Main API Documentation Content */}
          <div className="docs-content">
            {/* Overview Card */}
            <section id="overview" className="docs-card-section">
              <h2>Overview & Features</h2>
              <div className="docs-features-grid">
                <div className="feature-item">
                  <div className="feature-icon">⚡</div>
                  <h3>5-Stage Live Progress</h3>
                  <p>Stream real-time progress via Server-Sent Events (SSE) so your users know what step is running.</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">☁️</div>
                  <h3>48-Hour Cloud Storage</h3>
                  <p>Mastered audio containers are uploaded to tmpfiles.org with direct 48-hour download links.</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🎵</div>
                  <h3>320kbps Studio Mastering</h3>
                  <p>High-fidelity audio stream resolution with automatic title cleaning and RFC 5987 headers.</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🔓</div>
                  <h3>Zero Friction / Free</h3>
                  <p>No API keys, token exchanges, or registration required. Ready for instant cURL and scripting.</p>
                </div>
              </div>
            </section>

            {/* Endpoints List */}
            {ENDPOINTS.map((endpoint) => (
              <section key={endpoint.id} id={endpoint.id} className="docs-endpoint-card">
                <div className="endpoint-header">
                  <div className="endpoint-title-row">
                    <span className={`method-badge method-${endpoint.method.toLowerCase()}`}>
                      {endpoint.method}
                    </span>
                    <code className="endpoint-route">{endpoint.path}</code>
                    <span className="endpoint-category-pill">{endpoint.category}</span>
                  </div>
                  <h3 className="endpoint-name">{endpoint.title}</h3>
                  <p className="endpoint-desc">{endpoint.description}</p>
                </div>

                {/* Parameters Table */}
                {endpoint.params.length > 0 && (
                  <div className="endpoint-section">
                    <h4 className="section-heading">Parameters</h4>
                    <div className="table-wrapper">
                      <table className="params-table">
                        <thead>
                          <tr>
                            <th>Parameter</th>
                            <th>Type</th>
                            <th>In</th>
                            <th>Required</th>
                            <th>Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {endpoint.params.map((p) => (
                            <tr key={p.name}>
                              <td><code>{p.name}</code></td>
                              <td><span className="type-badge">{p.type}</span></td>
                              <td><span className="loc-badge">{p.location}</span></td>
                              <td>
                                {p.required ? (
                                  <span className="req-badge req-true">required</span>
                                ) : (
                                  <span className="req-badge req-false">optional</span>
                                )}
                              </td>
                              <td>{p.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Code Generator & Snippets */}
                <div className="endpoint-section">
                  <div className="code-header-row">
                    <h4 className="section-heading">Example Request</h4>
                    <div className="lang-tabs">
                      {(['curl', 'js', 'python'] as const).map((lang) => (
                        <button
                          key={lang}
                          className={`lang-tab ${activeTab[endpoint.id] === lang ? 'active' : ''}`}
                          onClick={() =>
                            setActiveTab((prev) => ({ ...prev, [endpoint.id]: lang }))
                          }
                        >
                          {lang === 'curl' ? 'cURL' : lang === 'js' ? 'JavaScript' : 'Python'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="code-block-box">
                    <div className="code-box-header">
                      <span className="code-lang-label">
                        {activeTab[endpoint.id]?.toUpperCase()}
                      </span>
                      <button
                        className="copy-code-btn"
                        onClick={() =>
                          copyToClipboard(
                            endpoint.sampleRequest[activeTab[endpoint.id] || 'curl'],
                            `code-${endpoint.id}`
                          )
                        }
                      >
                        {copiedKey === `code-${endpoint.id}` ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                    <pre className="code-pre">
                      <code>{endpoint.sampleRequest[activeTab[endpoint.id] || 'curl']}</code>
                    </pre>
                  </div>
                </div>

                {/* Live Interactive Playground */}
                <div className="endpoint-section playground-section">
                  <h4 className="section-heading">Interactive Playground (Test Live)</h4>
                  <div className="playground-form">
                    {endpoint.params.length > 0 && (
                      <div className="playground-input-group">
                        <label className="input-label">
                          Input ({endpoint.params[0].name}):
                        </label>
                        <input
                          type="text"
                          className="playground-input"
                          value={testInputs[endpoint.id] || ''}
                          onChange={(e) =>
                            setTestInputs((prev) => ({
                              ...prev,
                              [endpoint.id]: e.target.value,
                            }))
                          }
                          placeholder={`Enter ${endpoint.params[0].name}...`}
                        />
                      </div>
                    )}

                    <button
                      className="btn-execute-request"
                      disabled={loadingEndpoints[endpoint.id]}
                      onClick={() => executeTest(endpoint)}
                    >
                      {loadingEndpoints[endpoint.id] ? (
                        <span className="exec-loading">
                          <span className="spinner-small" /> Running...
                        </span>
                      ) : (
                        `Execute ${endpoint.method} Request`
                      )}
                    </button>
                  </div>

                  {testOutputs[endpoint.id] && (
                    <div className="playground-response-box">
                      <div className="response-header">
                        <span className="response-title">Live Response Output</span>
                        <button
                          className="copy-code-btn"
                          onClick={() =>
                            copyToClipboard(testOutputs[endpoint.id], `out-${endpoint.id}`)
                          }
                        >
                          {copiedKey === `out-${endpoint.id}` ? '✓ Copied' : 'Copy Output'}
                        </button>
                      </div>
                      <pre className="response-pre">
                        <code>{testOutputs[endpoint.id]}</code>
                      </pre>
                    </div>
                  )}
                </div>

                {/* Example Response Schema */}
                <div className="endpoint-section">
                  <h4 className="section-heading">Sample Response</h4>
                  <div className="code-block-box">
                    <pre className="code-pre">
                      <code>
                        {typeof endpoint.sampleResponse === 'string'
                          ? endpoint.sampleResponse
                          : JSON.stringify(endpoint.sampleResponse, null, 2)}
                      </code>
                    </pre>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
