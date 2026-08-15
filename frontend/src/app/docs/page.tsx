'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ToastContainer } from '@/components/ToastContainer';
import { useToast } from '@/hooks/useToast';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { useTheme } from '@/hooks/useTheme';

export default function ApiDocsPage() {
  const { theme, toggleTheme, mounted } = useTheme();
  const { toasts, showToast, removeToast } = useToast();
  const audioEngine = useAudioEngine(showToast);

  const [testInput, setTestInput] = useState('Alan Walker Faded');
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

      <main className="app-main simple-docs-main">
        {/* Simple Header */}
        <section className="simple-docs-header">
          <div className="simple-badge-row">
            <span className="simple-badge">v1.0.0 Public API</span>
            <span className="simple-badge badge-accent">320kbps Audio Core</span>
            <span className="simple-badge">48h tmpfiles CDN</span>
            <span className="simple-badge">Free • Zero Auth</span>
          </div>

          <h1 className="simple-docs-title">Developer API Reference</h1>
          <p className="simple-docs-subtitle">
            One single, clean endpoint for song search and 320kbps direct cloud audio downloads.
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

        {/* The Core Logic: How It Works */}
        <section className="simple-card">
          <h2 className="card-title">How It Works (Single Endpoint)</h2>
          <p className="card-desc">
            Pass your input in the <code>input</code> query parameter. The engine automatically handles both search and download:
          </p>

          <div className="simple-rules-grid">
            <div className="rule-box">
              <div className="rule-badge">Case 1: Search Query</div>
              <h3>Pass a Song Name</h3>
              <p>Returns top 8 matching YouTube results with IDs, titles, artists, and durations.</p>
              <code>GET /api/v1/audio?input=Faded Alan Walker</code>
            </div>

            <div className="rule-box">
              <div className="rule-badge rule-badge-accent">Case 2: Direct Download</div>
              <h3>Pass a YouTube Link or ID</h3>
              <p>Masters 320kbps audio, uploads to tmpfiles, and returns a direct 48-hour download link.</p>
              <code>GET /api/v1/audio?input=60ItHLz5WEA</code>
            </div>
          </div>
        </section>

        {/* Live Interactive Tester */}
        <section className="simple-card">
          <h2 className="card-title">Live API Tester</h2>
          <p className="card-desc">
            Test the API right now in your browser with any song name or YouTube link:
          </p>

          <div className="tester-box">
            <div className="tester-input-row">
              <input
                type="text"
                className="tester-input"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="Enter song name (e.g. Faded) or YouTube URL..."
              />
              <button
                className="btn-test-submit"
                onClick={handleTest}
                disabled={isLoading}
              >
                {isLoading ? 'Running...' : 'Send Request'}
              </button>
            </div>

            {testOutput && (
              <div className="tester-output-box">
                <div className="output-header">
                  <span>Response JSON</span>
                  <button
                    className="btn-copy-sm"
                    onClick={() => copyToClipboard(testOutput, 'test-output')}
                  >
                    {copiedKey === 'test-output' ? '✓ Copied' : 'Copy JSON'}
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
              <span>2. Master & Download (48h tmpfiles Link)</span>
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
        </section>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link href="/" className="btn-back-home">
            ← Back to Studio Web App
          </Link>
        </div>
      </main>

      <Footer />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
