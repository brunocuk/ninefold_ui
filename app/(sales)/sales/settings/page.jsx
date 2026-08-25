'use client';

// Sales settings: change own password.

import { useEffect, useState } from 'react';
import { getSalesUser, changeSalesUserPassword } from '@/lib/salesAuth';
import {
  Panel, SectionLabel,
  FG, BODY, MUTED, SIGNAL, inputStyle, primaryBtn,
} from '../ui';
import { Eye, EyeOff, Loader2, Check } from 'lucide-react';

export default function SalesSettingsPage() {
  const [user, setUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getSalesUser().then(setUser);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (newPassword.length < 8) {
      setError('Nova lozinka mora imati barem 8 znakova.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Nove lozinke se ne podudaraju.');
      return;
    }

    setSaving(true);
    const { error: changeError } = await changeSalesUserPassword(user.id, currentPassword, newPassword);
    setSaving(false);

    if (changeError) {
      setError(changeError.message);
      return;
    }

    setSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <SectionLabel>Postavke</SectionLabel>
        <h1 className="mt-3 text-3xl font-medium" style={{ letterSpacing: '-0.02em' }}>
          Tvoj račun
        </h1>
        <p className="mt-1" style={{ color: MUTED }}>
          {user?.name} · {user?.email}
        </p>
      </div>

      <Panel className="max-w-md p-6">
        <h2 className="text-lg font-medium" style={{ color: FG }}>Promjena lozinke</h2>
        <p className="mt-1 text-sm" style={{ color: MUTED }}>
          Odaberi lozinku koju ćeš lakše zapamtiti.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          {error && (
            <div
              className="rounded-xl px-4 py-3 text-sm"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#F87171' }}
            >
              {error}
            </div>
          )}
          {success && (
            <div
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm"
              style={{ background: 'rgba(0,255,148,0.07)', border: '1px solid rgba(0,255,148,0.25)', color: SIGNAL }}
            >
              <Check size={15} />
              Lozinka promijenjena. Vrijedi od sljedeće prijave.
            </div>
          )}

          <label className="block">
            <span className="mb-2 block text-sm" style={{ color: BODY }}>Trenutna lozinka</span>
            <input
              type={showPasswords ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:border-white/25"
              style={inputStyle}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm" style={{ color: BODY }}>Nova lozinka</span>
            <input
              type={showPasswords ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              placeholder="Barem 8 znakova"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:border-white/25"
              style={inputStyle}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm" style={{ color: BODY }}>Potvrdi novu lozinku</span>
            <input
              type={showPasswords ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:border-white/25"
              style={inputStyle}
            />
          </label>

          <button
            type="button"
            onClick={() => setShowPasswords(!showPasswords)}
            className="flex items-center gap-2 self-start text-sm transition-colors hover:text-white"
            style={{ color: MUTED }}
          >
            {showPasswords ? <EyeOff size={15} /> : <Eye size={15} />}
            {showPasswords ? 'Sakrij lozinke' : 'Prikaži lozinke'}
          </button>

          <button
            type="submit"
            disabled={saving || !user}
            className="mt-1 flex items-center justify-center gap-2 px-6 py-3.5 text-sm transition-transform hover:scale-[1.01]"
            style={primaryBtn}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            Spremi novu lozinku
          </button>
        </form>
      </Panel>
    </div>
  );
}
