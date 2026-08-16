import React from 'react';
import Link from 'next/link';

export const ApiSpotlight: React.FC = () => {
  return (
    <section id="api" className="info-section api-spotlight">
      <div className="api-content-split">
        <div className="api-text">
          <h2>Built for Developers</h2>
          <p>Crisper isn't just a web app. It's powered by a robust, open REST API that you can hook into today.</p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--c-crimson)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '12px'}}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>
              Single endpoint for search and extraction
            </li>
            <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--c-crimson)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '12px'}}><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path><circle cx="12" cy="12" r="2"></circle><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path><path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1"></path></svg>
              Real-time SSE progress events
            </li>
            <li style={{ display: 'flex', alignItems: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--c-crimson)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '12px'}}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              No API keys required
            </li>
          </ul>
          <Link href="/docs" className="btn-secondary">
            Read API Documentation &rarr;
          </Link>
        </div>
        <div className="api-code-window">
          <div className="window-header">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
            <span className="window-title">bash</span>
          </div>
          <pre>
            <code>
              <span className="code-comment"># Search and extract music via terminal</span><br/>
              <span className="code-keyword">curl</span> "https://crisper.onrender.com/api/v1/audio?input=Faded"
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
};
