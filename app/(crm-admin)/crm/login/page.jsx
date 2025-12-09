'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugLogs, setDebugLogs] = useState([]);

  const addLog = (message) => {
    setDebugLogs(prev => [...prev, `${new Date().toISOString().split('T')[1].split('.')[0]} - ${message}`]);
    console.log('[DEBUG]', message);
  };

  const inspectString = (str, label) => {
    addLog(`${label}: length=${str.length}`);
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      const code = str.charCodeAt(i);
      if (code > 127) {
        addLog(`  [!] Non-ASCII at position ${i}: char='${char}' code=${code}`);
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setDebugLogs([]);

    try {
      addLog('=== LOGIN ATTEMPT STARTED ===');
      
      // Check environment variables
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      addLog(`Env check: URL=${supabaseUrl ? 'SET' : 'MISSING'}, Key=${supabaseKey ? 'SET' : 'MISSING'}`);
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing environment variables');
      }

      // Inspect environment variables for non-ASCII characters
      inspectString(supabaseUrl, 'SUPABASE_URL');
      inspectString(supabaseKey, 'SUPABASE_KEY');
      
      // Inspect email and password
      inspectString(email, 'EMAIL');
      inspectString(password, 'PASSWORD');

      // Build the request manually
      const endpoint = `${supabaseUrl}/auth/v1/token?grant_type=password`;
      addLog(`Endpoint: ${endpoint}`);

      const headers = {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
      };

      // Inspect headers
      addLog('Inspecting headers...');
      Object.entries(headers).forEach(([key, value]) => {
        inspectString(key, `Header key: ${key}`);
        inspectString(value, `Header value: ${key}`);
      });

      const body = JSON.stringify({
        email: email,
        password: password,
      });

      addLog(`Body length: ${body.length}`);
      inspectString(body, 'BODY');

      addLog('Attempting fetch...');

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: body,
      });

      addLog(`Fetch completed! Status: ${response.status}`);

      const data = await response.json();
      addLog(`Response received: ${JSON.stringify(data).substring(0, 100)}...`);

      if (!response.ok) {
        throw new Error(data.error_description || data.msg || 'Login failed');
      }

      addLog('Login successful! Redirecting...');
      
      // Store token
      if (typeof window !== 'undefined') {
        localStorage.setItem('supabase.auth.token', JSON.stringify(data));
      }

      router.push('/crm');
      router.refresh();

    } catch (err) {
      addLog(`ERROR: ${err.message}`);
      addLog(`Error stack: ${err.stack?.substring(0, 200)}`);
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

        .container {
          max-width: 1200px;
          width: 100%;
          display: grid;
          grid-template-columns: 400px 1fr;
          gap: 20px;
        }

        .login-card {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 40px;
        }

        .debug-panel {
          background: #000;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 20px;
          overflow-y: auto;
          max-height: 80vh;
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

        .debug-title {
          color: #0f0;
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 15px;
          font-family: monospace;
        }

        .debug-log {
          color: #0f0;
          font-size: 0.75rem;
          font-family: monospace;
          white-space: pre-wrap;
          word-break: break-all;
          line-height: 1.4;
          margin-bottom: 8px;
          padding: 4px;
          background: #0a0a0a;
          border-left: 2px solid #0f0;
          padding-left: 8px;
        }

        .debug-log-error {
          color: #f00;
          border-left-color: #f00;
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

        @media (max-width: 1024px) {
          .container {
            grid-template-columns: 1fr;
          }
          
          .debug-panel {
            order: 2;
            max-height: 400px;
          }
        }
      `}</style>

      <div className="login-page">
        <div className="container">
          <div className="login-card">
            <div className="logo">
              <div className="logo-text">NineFold</div>
              <div className="subtitle">CRM Login - Debug Mode</div>
            </div>

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
                {loading ? 'Analyzing...' : 'Login & Debug'}
              </button>
            </form>

            <div className="back-link">
              <a href="/">Back to website</a>
            </div>
          </div>

          <div className="debug-panel">
            <div className="debug-title">DEBUG CONSOLE</div>
            {debugLogs.length === 0 ? (
              <div className="debug-log">
                Waiting for login attempt...
              </div>
            ) : (
              debugLogs.map((log, index) => (
                <div 
                  key={index} 
                  className={`debug-log ${log.includes('ERROR') ? 'debug-log-error' : ''}`}
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}