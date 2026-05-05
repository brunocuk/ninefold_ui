'use client';

import { useState } from 'react';
import { usePortalTheme, themes } from '@/lib/portalTheme';
import { getPortalUserSync, changePortalUserPassword } from '@/lib/portalAuth';
import { Eye, EyeOff, Lock, Check } from 'lucide-react';

export default function SettingsPage() {
  const { theme } = usePortalTheme();
  const t = themes[theme];
  const user = getPortalUserSync();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Sva polja su obavezna');
      return;
    }

    if (newPassword.length < 8) {
      setError('Nova lozinka mora imati najmanje 8 znakova');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Nove lozinke se ne podudaraju');
      return;
    }

    if (currentPassword === newPassword) {
      setError('Nova lozinka mora biti različita od trenutne');
      return;
    }

    setLoading(true);

    const { error: changeError } = await changePortalUserPassword(
      user.id,
      currentPassword,
      newPassword
    );

    setLoading(false);

    if (changeError) {
      setError(changeError.message);
      return;
    }

    setSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <>
      <style jsx>{`
        .settings-page {
          max-width: 600px;
        }

        .page-title {
          font-size: 1.75rem;
          font-weight: 600;
          color: ${t.text};
          margin-bottom: 8px;
        }

        .page-subtitle {
          font-size: 0.95rem;
          color: ${t.textSecondary};
          margin-bottom: 32px;
        }

        .settings-card {
          background: ${t.bgCard};
          border: 1px solid ${t.border};
          border-radius: 16px;
          padding: 24px;
        }

        .card-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: ${t.text};
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .card-description {
          font-size: 0.85rem;
          color: ${t.textSecondary};
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 500;
          color: ${t.text};
          margin-bottom: 8px;
        }

        .input-wrapper {
          position: relative;
        }

        .form-input {
          width: 100%;
          padding: 12px 44px 12px 14px;
          background: ${t.bg};
          border: 1px solid ${t.border};
          border-radius: 10px;
          font-size: 0.95rem;
          color: ${t.text};
          outline: none;
          transition: border-color 0.2s ease;
        }

        .form-input:focus {
          border-color: ${t.accent};
        }

        .form-input::placeholder {
          color: ${t.textSecondary};
          opacity: 0.6;
        }

        .toggle-visibility {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: ${t.textSecondary};
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .toggle-visibility:hover {
          color: ${t.text};
        }

        .error-message {
          background: rgba(255, 59, 48, 0.1);
          border: 1px solid rgba(255, 59, 48, 0.2);
          color: #ff3b30;
          padding: 12px 14px;
          border-radius: 10px;
          font-size: 0.9rem;
          margin-bottom: 20px;
        }

        .success-message {
          background: rgba(0, 255, 148, 0.1);
          border: 1px solid rgba(0, 255, 148, 0.2);
          color: #00FF94;
          padding: 12px 14px;
          border-radius: 10px;
          font-size: 0.9rem;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .submit-btn {
          width: 100%;
          padding: 14px 20px;
          background: #00FF94;
          border: none;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 600;
          color: #000;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .submit-btn:hover:not(:disabled) {
          background: #00CC75;
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .password-hint {
          font-size: 0.8rem;
          color: ${t.textSecondary};
          margin-top: 6px;
        }
      `}</style>

      <div className="settings-page">
        <h1 className="page-title">Postavke</h1>
        <p className="page-subtitle">Upravljaj svojim računom</p>

        <div className="settings-card">
          <h2 className="card-title">
            <Lock size={20} />
            Promijeni lozinku
          </h2>
          <p className="card-description">
            Preporučujemo korištenje lozinke koju ne koristiš na drugim stranicama
          </p>

          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

            {success && (
              <div className="success-message">
                <Check size={18} />
                Lozinka je uspješno promijenjena
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Trenutna lozinka</label>
              <div className="input-wrapper">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  className="form-input"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Unesi trenutnu lozinku"
                />
                <button
                  type="button"
                  className="toggle-visibility"
                  onClick={() => setShowCurrent(!showCurrent)}
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Nova lozinka</label>
              <div className="input-wrapper">
                <input
                  type={showNew ? 'text' : 'password'}
                  className="form-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Unesi novu lozinku"
                />
                <button
                  type="button"
                  className="toggle-visibility"
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="password-hint">Najmanje 8 znakova</p>
            </div>

            <div className="form-group">
              <label className="form-label">Potvrdi novu lozinku</label>
              <div className="input-wrapper">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className="form-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ponovi novu lozinku"
                />
                <button
                  type="button"
                  className="toggle-visibility"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Spremanje...' : 'Spremi novu lozinku'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
