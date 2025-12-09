'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push('/crm');
    router.refresh();
  };

  return (
    <>
      <style jsx>{`
        .login-page {
          min-height: 100vh;
          background: #0F0F0F;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .login-card {
          background: #1a1a1a;
          border: 1px solid #2A2A2A;
          border-radius: 16px;
          padding: 50px;
          max-width: 440px;
          width: 100%;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
        }

        .logo {
          text-align: center;
          margin-bottom: 48px;
        }

        .logo-text {
          font-size: 2.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #00FF94 0%, #00DD7F 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 12px;
        }

        .subtitle {
          color: #8F8F8F;
          font-size: 1rem;
          font-weight: 500;
        }

        .form-group {
          margin-bottom: 24px;
        }

        label {
          display: block;
          margin-bottom: 10px;
          color: #C4C4C4;
          font-weight: 600;
          font-size: 0.95rem;
        }

        input {
          width: 100%;
          padding: 14px 16px;
          background: #0F0F0F;
          border: 1px solid #2A2A2A;
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        input:focus {
          outline: none;
          border-color: #00FF94;
          background: #0a0a0a;
          box-shadow: 0 0 0 3px rgba(0, 255, 148, 0.1);
        }

        input::placeholder {
          color: #666;
        }

        .btn {
          width: 100%;
          padding: 16px;
          background: #00FF94;
          color: #0F0F0F;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.05rem;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 8px;
        }

        .btn:hover:not(:disabled) {
          background: #00DD7F;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 255, 148, 0.3);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
          padding: 14px 16px;
          border-radius: 12px;
          margin-bottom: 24px;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .back-link {
          text-align: center;
          margin-top: 32px;
        }

        .back-link a {
          color: #00FF94;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .back-link a:hover {
          color: #00DD7F;
        }

        @media (max-width: 640px) {
          .login-card {
            padding: 40px 30px;
          }

          .logo-text {
            font-size: 2rem;
          }
        }
      `}</style>

      <div className="login-page">
        <div className="login-card">
          <div className="logo">
            <div className="logo-text">NineFold</div>
            <div className="subtitle">CRM Login</div>
          </div>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="back-link">
            <a href="/">← Back to website</a>
          </div>
        </div>
      </div>
    </>
  );
}