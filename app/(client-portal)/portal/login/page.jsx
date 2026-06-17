'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { portalSignIn, isPortalAuthenticated } from '@/lib/portalAuth';
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react';

export default function PortalLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isPortalAuthenticated()) {
      router.push('/portal');
    } else {
      setChecking(false);
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error: signInError } = await portalSignIn(email, password);

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push('/portal');
  };

  if (checking) {
    return (
      <div className="login-page">
        <div className="loading-screen">
          <Loader2 size={32} className="spin" />
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  }

  return (
    <div className="login-page">
      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          background: #0a0a0a !important;
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        body > header, body > footer, body > nav,
        #__next > header, #__next > footer,
        [role="banner"], [role="navigation"], [role="contentinfo"] {
          display: none !important;
        }
      `}</style>
      <style jsx>{styles}</style>

      {/* Left Side - Login Form */}
      <div className="left-panel">
        <div className="form-container">
          {/* Logo */}
          <div className="logo">
            <img src="/ninefold-icon.svg" alt="Ninefold" />
          </div>

          <h1 className="title">Logiraj se</h1>
          <p className="subtitle">Da vidiš što smo ti pripremili.</p>

          <form onSubmit={handleSubmit} className="form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="field">
              <label>Email</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tvoj@email.com"
                />
              </div>
            </div>

            <div className="field">
              <label>Lozinka</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="spin" />
                  Malo strpljenja...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <p className="help-text">
            Zaboravio lozinku?{' '}
            <a href="mailto:hello@ninefold.agency">Javi nam se</a>
          </p>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="right-panel">
        <div className="brand-content">
          <div className="brand-logo">Ninefold</div>
          <h2 className="brand-title">Tvoj kutak<br />za pregled svega.</h2>
          <p className="brand-description">
            Projekti, objave, feedback - sve na jednom mjestu. Bez čekanja na mailove.
          </p>

          <div className="feature-card">
            <div className="feature-title">Jednostavno i brzo</div>
            <p className="feature-text">
              Vidiš što radimo, klikneš odobreno, gotovo. Ako nešto ne štima - napišeš i riješimo.
            </p>
            <div className="feature-avatars">
              <div className="avatar" style={{ background: '#00FF94' }}>N</div>
              <div className="avatar" style={{ background: '#6366F1' }}>P</div>
              <div className="avatar" style={{ background: '#F59E0B' }}>B</div>
              <div className="avatar-count">+50</div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="decoration">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="bokeh bokeh-1"></div>
          <div className="bokeh bokeh-2"></div>
          <div className="bokeh bokeh-3"></div>
          <div className="glow"></div>
          <div className="grain"></div>
        </div>
      </div>
    </div>
  );
}

const styles = `
  .login-page {
    display: flex;
    min-height: 100vh;
    background: #0a0a0a;
  }

  .loading-screen {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #00FF94;
  }

  /* Left Panel */
  .left-panel {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    background: #0a0a0a;
  }

  .form-container {
    width: 100%;
    max-width: 400px;
  }

  .logo {
    width: 56px;
    height: 56px;
    margin-bottom: 40px;
    border-radius: 14px;
    background: #1a1a1a;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
  }

  .logo img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .title {
    font-size: 2rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 8px;
  }

  .subtitle {
    font-size: 1rem;
    color: #6B7280;
    margin-bottom: 40px;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .error-message {
    padding: 14px 16px;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 12px;
    color: #F87171;
    font-size: 0.9rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .field label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #9CA3AF;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input-icon {
    position: absolute;
    left: 16px;
    color: #4B5563;
    pointer-events: none;
  }

  .input-wrapper input {
    width: 100%;
    padding: 16px 16px 16px 48px;
    background: #111;
    border: 1px solid #222;
    border-radius: 12px;
    color: #fff;
    font-size: 1rem;
    transition: all 0.2s ease;
  }

  .input-wrapper input:focus {
    outline: none;
    border-color: #00FF94;
    background: #0a0a0a;
  }

  .input-wrapper input::placeholder {
    color: #4B5563;
  }

  .toggle-password {
    position: absolute;
    right: 16px;
    background: none;
    border: none;
    color: #4B5563;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease;
  }

  .toggle-password:hover {
    color: #9CA3AF;
  }

  .submit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 16px;
    background: #fff;
    color: #000;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: 8px;
  }

  .submit-btn:hover:not(:disabled) {
    background: #00FF94;
    transform: translateY(-1px);
  }

  .submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .help-text {
    margin-top: 32px;
    text-align: center;
    font-size: 0.875rem;
    color: #6B7280;
  }

  .help-text a {
    color: #00FF94;
    text-decoration: none;
    font-weight: 500;
  }

  .help-text a:hover {
    text-decoration: underline;
  }

  /* Right Panel */
  .right-panel {
    flex: 1;
    position: relative;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 60px;
    background:
      radial-gradient(ellipse at 20% 80%, rgba(0, 255, 148, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 20%, rgba(0, 255, 148, 0.05) 0%, transparent 40%),
      radial-gradient(ellipse at 50% 50%, rgba(20, 20, 20, 1) 0%, rgba(8, 8, 8, 1) 100%);
    overflow: hidden;
  }

  @media (min-width: 1024px) {
    .right-panel {
      display: flex;
    }
  }

  /* Vignette effect */
  .right-panel::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.4) 100%);
    pointer-events: none;
    z-index: 1;
  }

  .brand-content {
    position: relative;
    z-index: 10;
    max-width: 480px;
  }

  .brand-logo {
    font-size: 1.25rem;
    font-weight: 700;
    color: #00FF94;
    margin-bottom: 24px;
    letter-spacing: -0.02em;
  }

  .brand-title {
    font-size: 3rem;
    font-weight: 800;
    color: #fff;
    line-height: 1.1;
    margin-bottom: 20px;
    letter-spacing: -0.03em;
  }

  .brand-description {
    font-size: 1.1rem;
    color: #9CA3AF;
    line-height: 1.6;
    margin-bottom: 48px;
  }

  .feature-card {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    padding: 28px;
    backdrop-filter: blur(16px);
    box-shadow:
      0 0 0 1px rgba(0, 255, 148, 0.05),
      0 20px 40px rgba(0, 0, 0, 0.3);
  }

  .feature-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 12px;
  }

  .feature-text {
    font-size: 0.95rem;
    color: #9CA3AF;
    line-height: 1.5;
    margin-bottom: 20px;
  }

  .feature-avatars {
    display: flex;
    align-items: center;
  }

  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    font-weight: 700;
    color: #000;
    margin-left: -8px;
    border: 2px solid rgba(0, 0, 0, 0.5);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .avatar:first-child {
    margin-left: 0;
  }

  .avatar-count {
    margin-left: 12px;
    font-size: 0.9rem;
    font-weight: 600;
    color: #6B7280;
  }

  /* Decorative Elements */
  .decoration {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }

  .shape {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
  }

  .shape-1 {
    width: 600px;
    height: 600px;
    top: -250px;
    right: -150px;
    background: rgba(0, 255, 148, 0.15);
    animation: float 8s ease-in-out infinite;
  }

  .shape-2 {
    width: 400px;
    height: 400px;
    bottom: 50px;
    right: 150px;
    background: rgba(0, 200, 120, 0.08);
    animation: float 10s ease-in-out infinite reverse;
  }

  .shape-3 {
    width: 300px;
    height: 300px;
    bottom: -100px;
    left: -50px;
    background: rgba(0, 255, 148, 0.1);
    animation: float 12s ease-in-out infinite;
  }

  /* Bokeh lights */
  .bokeh {
    position: absolute;
    border-radius: 50%;
    filter: blur(2px);
    opacity: 0.6;
  }

  .bokeh-1 {
    width: 8px;
    height: 8px;
    top: 20%;
    right: 25%;
    background: #00FF94;
    box-shadow: 0 0 20px 5px rgba(0, 255, 148, 0.4);
    animation: pulse 4s ease-in-out infinite;
  }

  .bokeh-2 {
    width: 5px;
    height: 5px;
    top: 60%;
    right: 15%;
    background: #00FF94;
    box-shadow: 0 0 15px 3px rgba(0, 255, 148, 0.3);
    animation: pulse 5s ease-in-out infinite 1s;
  }

  .bokeh-3 {
    width: 6px;
    height: 6px;
    bottom: 30%;
    left: 20%;
    background: #00FF94;
    box-shadow: 0 0 18px 4px rgba(0, 255, 148, 0.35);
    animation: pulse 6s ease-in-out infinite 2s;
  }

  .glow {
    position: absolute;
    width: 800px;
    height: 800px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(0, 255, 148, 0.04) 0%, transparent 60%);
  }

  /* Film grain overlay */
  .grain {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    opacity: 0.035;
    mix-blend-mode: overlay;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0) translateX(0); }
    50% { transform: translateY(-20px) translateX(10px); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.2); }
  }

  /* Animations */
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .spin {
    animation: spin 1s linear infinite;
  }

  /* Mobile Adjustments */
  @media (max-width: 640px) {
    .left-panel {
      padding: 24px;
    }

    .title {
      font-size: 1.75rem;
    }

    .logo {
      margin-bottom: 32px;
    }
  }
`;
