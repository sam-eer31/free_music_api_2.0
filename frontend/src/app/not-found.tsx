import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="app-main" style={{ textAlign: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="glass-panel" style={{ padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <div className="badge-tag">
          <span className="badge-dot" />
          <span>404 Error</span>
        </div>
        <h2 className="hero-title" style={{ fontSize: '2.5rem' }}>
          Page <span className="hero-title-pink">Not Found</span>
        </h2>
        <p className="hero-subtitle">
          The audio stream or page you are looking for does not exist.
        </p>
        <Link href="/" className="btn-shift-trigger" style={{ maxWidth: '240px', textDecoration: 'none' }}>
          Return Home
        </Link>
      </div>
    </main>
  );
}
