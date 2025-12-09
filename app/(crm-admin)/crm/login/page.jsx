'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debug, setDebug] = useState('');

  const testRawFetch = async () => {
    setDebug('Testing raw fetch...');
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      setDebug(`URL: ${url ? 'SET' : 'MISSING'}, Key: ${key ? 'SET' : 'MISSING'}`);
      
      const response = await fetch(
        `${url}/auth/v1/token?grant_type=password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': key,
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();
      setDebug(`Success! Response: ${JSON.stringify(data).substring(0, 100)}`);
      
      if (response.ok) {
        setError('');
        router.push('/crm');
      } else {
        setError(data.error_description || data.msg || 'Login failed');
      }
    } catch (err) {
      setDebug(`Error: ${err.message}`);
      setError(err.message);
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setDebug('');

    await testRawFetch();
  };

  return (
    <>
      <style jsx>{`
        .login-page {
          min-height: 100vh;
          background: #0a0a0a;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .login-card {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 40px;
          max-width: 400px;
          width: 100%;
        }

        .logo {
          text-align: center;
          margin-bottom: 40px;
        }

        .logo-text {
          font-size: 2rem;
          font-weight: 900;
          background: linear-gradient(135deg, #00FF94 0%, #00CC76 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          color: #888;
          text-align: center;
          margin-top: 10px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          color: #aaa;
          font-weight: 600;
          font-size: 0.9rem;
        }

        input {
          width: 100%;
          padding: 12px 15px;
          background: #0a0a0a;
          border: 1px solid #333;
          border-radius: 8px;
          color: white;
          font-size: 1rem;
        }

        input:focus {
          outline: none;
          border-color: #00FF94;
          box-shadow: 0 0 0 3px rgba(0, 255, 148, 0.1);
        }

        .btn {
          width: 100%;
          padding: 14px;
          background: #00FF94;
          color: #000;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn:hover:not(:disabled) {
          box-shadow: 0 0 20px rgba(0, 255, 148, 0.4);
          transform: translateY(-2px);
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .error {
          background: #fee;
          border: 1px solid #f88;
          color: #c00;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 0.9rem;
        }

        .debug {
          background: #1a1a1a;
          border: 1px solid #333;
          color: #0f0;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 0.8rem;
          font-family: monospace;
          white-space: pre-wrap;
          word-break: break-all;
        }

        .back-link {
          text-align: center;
          margin-top: 20px;
        }

        .back-link a {
          color: #00FF94;
          text-decoration: none;
          font-size: 0.9rem;
        }

        .back-link a:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="login-page">
        <div className="login-card">
          <div className="logo">
            <div className="logo-text">NineFold</div>
            <div className="subtitle">CRM Login (Debug Mode)</div>
          </div>

          {debug && (
            <div className="debug">
              {debug}
            </div>
          )}

          {error && (
            <div className="error">
              Error: {error}
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
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                required
              />
            </div>

            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Testing...' : 'Login (Debug)'}
            </button>
          </form>

          <div className="back-link">
            <a href="/">Back to website</a>
          </div>
        </div>
      </div>
    </>
  );
}