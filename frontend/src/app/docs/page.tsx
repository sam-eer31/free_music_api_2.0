'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/hooks/useToast';
import { useAudioEngine } from '@/hooks/useAudioEngine';

export default function ApiDocsPage() {
  const { showToast } = useToast();
  const audioEngine = useAudioEngine();

  const [testInput, setTestInput] = useState('60ItHLz5WEA');
  const [isStreamEnabled, setIsStreamEnabled] = useState(false);
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const publicEndpointUrl = 'https://crisper.onrender.com/api/v1/audio';
  const executeUrl = `${audioEngine.baseUrl || 'https://crisper.onrender.com'}/api/v1/audio`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    showToast('Copied to clipboard!', 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTest = async () => {
    if (!testInput.trim()) {
      showToast('Please enter a query or link to test', 'error');
      return;
    }

    setIsLoading(true);

    if (isStreamEnabled) {
      setTestOutput('Connecting to Server-Sent Events stream...\n');
      try {
        const streamUrl = `${executeUrl}?input=${encodeURIComponent(testInput.trim())}&stream=true`;
        const res = await fetch(streamUrl);
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let logs = '';

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            logs += chunk;
            setTestOutput(logs);
          }
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Streaming request failed';
        setTestOutput((prev) => `${prev || ''}\nError: ${msg}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      setTestOutput('Processing request...');
      try {
        const res = await fetch(`${executeUrl}?input=${encodeURIComponent(testInput.trim())}`);
        const json = await res.json();
        setTestOutput(JSON.stringify(json, null, 2));
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Request failed';
        setTestOutput(`Error: ${msg}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="simple-docs-main">
      {/* Simple Header */}
      <section className="simple-docs-header">
        <div className="simple-badge-row">
          <span className="simple-badge">v1.0.0 Public API</span>
          <span className="simple-badge badge-accent">High-Fidelity Audio Core</span>
          <span className="simple-badge">48h tmpfiles CDN</span>
          <span className="simple-badge">Free • Zero Auth</span>
        </div>

          <h1 className="simple-docs-title">Developer API Reference</h1>
          <p className="simple-docs-subtitle">
            One single, clean endpoint for song search, synchronous download, and real-time 5-stage progress streaming.
          </p>

          <div className="simple-base-card">
            <span className="base-tag">Endpoint</span>
            <code className="base-url">{publicEndpointUrl}</code>
            <button
              className="btn-copy-base"
              onClick={() => copyToClipboard(publicEndpointUrl, 'base-url')}
            >
              {copiedKey === 'base-url' ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </section>

        {/* The 3 Core Modes */}
        <section className="simple-card">
          <h2 className="card-title">How It Works (3 Modes on 1 Endpoint)</h2>
          <p className="card-desc">
            Pass your input in the <code>input</code> parameter. Add <code>&stream=true</code> if you want real-time progress events:
          </p>

          <div className="simple-rules-grid simple-rules-3-col">
            <div className="rule-box">
              <div className="rule-badge">1. Search Mode</div>
              <h3>Search Songs</h3>
              <p>Pass a song name. Returns top 8 matching YouTube results with IDs and metadata.</p>
              <code>GET /api/v1/audio?input=Faded Alan Walker</code>
            </div>

            <div className="rule-box">
              <div className="rule-badge rule-badge-accent">2. Direct Mode</div>
              <h3>Master & Download</h3>
              <p>Pass a video link or ID. Runs all 5 stages and returns the 48h tmpfiles download link JSON.</p>
              <code>GET /api/v1/audio?input=60ItHLz5WEA</code>
            </div>

            <div className="rule-box">
              <div className="rule-badge rule-badge-stream">3. Live Stream</div>
              <h3>5-Stage Progress (SSE)</h3>
              <p>Add <code>&stream=true</code> to stream live real-time progress events for each stage.</p>
              <code>GET /api/v1/audio?input=60ItHLz5WEA&stream=true</code>
            </div>
          </div>
        </section>

        {/* The 5-Stage Processing Pipeline */}
        <section className="simple-card">
          <h2 className="card-title">The 5-Stage Audio Processing Pipeline</h2>
          <p className="card-desc">
            When a track ID or link is processed, the backend executes this exact 5-stage pipeline:
          </p>

          <div className="pipeline-steps-grid">
            <div className="pipeline-step-item">
              <div className="step-num">1</div>
              <div className="step-content">
                <h4>Stage 1: Resolving Source</h4>
                <p>Validates track ID and extracts audio stream metadata.</p>
              </div>
            </div>
            <div className="pipeline-step-item">
              <div className="step-num">2</div>
              <div className="step-content">
                <h4>Stage 2: 320kbps Profile</h4>
                <p>Configures studio-grade high-fidelity bitrate profile.</p>
              </div>
            </div>
            <div className="pipeline-step-item">
              <div className="step-num">3</div>
              <div className="step-content">
                <h4>Stage 3: Mastering Stream</h4>
                <p>Captures, cleans metadata, and packages the MP3 container.</p>
              </div>
            </div>
            <div className="pipeline-step-item">
              <div className="step-num">4</div>
              <div className="step-content">
                <h4>Stage 4: tmpfiles Cloud Upload</h4>
                <p>Transfers container to tmpfiles.org for 48-hour fast CDN hosting.</p>
              </div>
            </div>
            <div className="pipeline-step-item">
              <div className="step-num">5</div>
              <div className="step-content">
                <h4>Stage 5: Cleanup & Return</h4>
                <p>Deletes server temporary file and returns the direct download link.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final Return Payload & Schema */}
        <section className="simple-card">
          <h2 className="card-title">Response Schemas</h2>

          <div className="code-example-block">
            <div className="code-example-header">
              <span>Direct Download Response (200 OK)</span>
              <button
                className="btn-copy-sm"
                onClick={() =>
                  copyToClipboard(
                    `{\n  "type": "download",\n  "success": true,\n  "title": "Alan Walker - Faded",\n  "filename": "Alan Walker - Faded.mp3",\n  "audioId": "60ItHLz5WEA",\n  "quality": "320kbps",\n  "sizeBytes": 8192000,\n  "sizeFormatted": "7.81 MB",\n  "downloadUrl": "https://tmpfiles.org/dl/wdwkSwFuQcFs/Alan_Walker_-_Faded.mp3",\n  "expiresIn": "48 Hours",\n  "uploadedAt": "2026-08-15T18:00:20.123Z"\n}`,
                    'resp-success'
                  )
                }
              >
                {copiedKey === 'resp-success' ? '✓ Copied' : 'Copy JSON'}
              </button>
            </div>
            <pre className="code-example-pre">
              <code>{`{
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
}`}</code>
            </pre>
          </div>

          <div className="code-example-block" style={{ marginTop: '1rem' }}>
            <div className="code-example-header">
              <span>Live Stream Event Stream Format (&stream=true)</span>
              <button
                className="btn-copy-sm"
                onClick={() =>
                  copyToClipboard(
                    `data: {"step":1,"stage":"resolving","message":"Resolving audio source..."}\n\ndata: {"step":2,"stage":"profiling","message":"Configuring 320kbps profile..."}\n\ndata: {"step":3,"stage":"mastering","message":"Mastering audio stream..."}\n\ndata: {"step":4,"stage":"uploading","message":"Uploading to tmpfiles (48h)..."}\n\ndata: {"step":5,"stage":"completed","data":{"downloadUrl":"https://tmpfiles.org/dl/..."}}`,
                    'resp-sse'
                  )
                }
              >
                {copiedKey === 'resp-sse' ? '✓ Copied' : 'Copy Events'}
              </button>
            </div>
            <pre className="code-example-pre">
              <code>{`data: {"step":1,"stage":"resolving","message":"Resolving audio source..."}

data: {"step":2,"stage":"profiling","message":"Configuring 320kbps high-fidelity profile..."}

data: {"step":3,"stage":"mastering","message":"Packaging and mastering audio stream..."}

data: {"step":4,"stage":"uploading","message":"Uploading container to tmpfiles (48h)..."}

data: {"step":5,"stage":"completed","downloadUrl":"https://tmpfiles.org/dl/wdwkSwFuQcFs/Alan_Walker_-_Faded.mp3"}`}</code>
            </pre>
          </div>
        </section>

        {/* Live Interactive Tester */}
        <section className="simple-card">
          <h2 className="card-title">Live API Tester</h2>
          <p className="card-desc">
            Test queries, direct links, or live SSE streaming right now in your browser:
          </p>

          <div className="tester-box">
            <div className="tester-input-row">
              <input
                type="text"
                className="tester-input"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="Enter song name (e.g. Faded) or YouTube URL / ID..."
              />
              <button
                className="btn-test-submit"
                onClick={handleTest}
                disabled={isLoading}
              >
                {isLoading ? 'Running...' : 'Send Request'}
              </button>
            </div>

            <div className="tester-toggle-row">
              <label className="stream-toggle-label">
                <input
                  type="checkbox"
                  checked={isStreamEnabled}
                  onChange={(e) => setIsStreamEnabled(e.target.checked)}
                />
                <span>Enable 5-Stage Live Stream (<code>&stream=true</code>)</span>
              </label>
            </div>

            {testOutput && (
              <div className="tester-output-box">
                <div className="output-header">
                  <span>Response Output {isStreamEnabled ? '(SSE Event Stream)' : '(JSON)'}</span>
                  <button
                    className="btn-copy-sm"
                    onClick={() => copyToClipboard(testOutput, 'test-output')}
                  >
                    {copiedKey === 'test-output' ? '✓ Copied' : 'Copy Output'}
                  </button>
                </div>
                <pre className="output-pre">
                  <code>{testOutput}</code>
                </pre>
              </div>
            )}
          </div>
        </section>

        {/* Quick cURL Examples */}
        <section className="simple-card">
          <h2 className="card-title">cURL Quick Examples</h2>

          <div className="code-example-block">
            <div className="code-example-header">
              <span>1. Search Songs</span>
              <button
                className="btn-copy-sm"
                onClick={() =>
                  copyToClipboard(
                    `curl "https://crisper.onrender.com/api/v1/audio?input=Alan+Walker+Faded"`,
                    'curl-search'
                  )
                }
              >
                {copiedKey === 'curl-search' ? '✓ Copied' : 'Copy cURL'}
              </button>
            </div>
            <pre className="code-example-pre">
              <code>{`curl "https://crisper.onrender.com/api/v1/audio?input=Alan+Walker+Faded"`}</code>
            </pre>
          </div>

          <div className="code-example-block" style={{ marginTop: '1rem' }}>
            <div className="code-example-header">
              <span>2. Master & Download (One-Shot JSON)</span>
              <button
                className="btn-copy-sm"
                onClick={() =>
                  copyToClipboard(
                    `curl "https://crisper.onrender.com/api/v1/audio?input=60ItHLz5WEA"`,
                    'curl-download'
                  )
                }
              >
                {copiedKey === 'curl-download' ? '✓ Copied' : 'Copy cURL'}
              </button>
            </div>
            <pre className="code-example-pre">
              <code>{`curl "https://crisper.onrender.com/api/v1/audio?input=60ItHLz5WEA"`}</code>
            </pre>
          </div>

          <div className="code-example-block" style={{ marginTop: '1rem' }}>
            <div className="code-example-header">
              <span>3. Live 5-Stage Stream (SSE)</span>
              <button
                className="btn-copy-sm"
                onClick={() =>
                  copyToClipboard(
                    `curl -N "https://crisper.onrender.com/api/v1/audio?input=60ItHLz5WEA&stream=true"`,
                    'curl-stream'
                  )
                }
              >
                {copiedKey === 'curl-stream' ? '✓ Copied' : 'Copy cURL'}
              </button>
            </div>
            <pre className="code-example-pre">
              <code>{`curl -N "https://crisper.onrender.com/api/v1/audio?input=60ItHLz5WEA&stream=true"`}</code>
            </pre>
          </div>
        </section>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link href="/" className="btn-back-home">
            ← Back to Studio Web App
          </Link>
        </div>
    </div>
  );
}
