'use client';

// Portal login in the Mono design language. Auth logic unchanged.

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { portalSignIn, isPortalAuthenticated } from '@/lib/portalAuth';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import {
  BG, PANEL, FG, BODY, MUTED, LINE, SIGNAL, MONO, SANS,
} from '@/components/mono/kit';

const inputStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: `1px solid ${LINE}`,
  color: FG,
};

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

    const { error: signInError } = await portalSignIn(email, password);

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push('/portal');
  };

  return (
    <div
      className="nf-page fixed inset-0 z-[1200] overflow-y-auto"
      style={{ background: BG, color: FG, fontFamily: SANS }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
      />
      <style>{`
        .nf-page { scrollbar-width: none; -ms-overflow-style: none; }
        .nf-page::-webkit-scrollbar { display: none; width: 0; height: 0; }
      `}</style>

      {checking ? (
        <div className="flex min-h-full items-center justify-center">
          <Loader2 size={28} className="animate-spin" style={{ color: MUTED }} />
        </div>
      ) : (
        <div className="grid min-h-full lg:grid-cols-2">
          {/* Left: form */}
          <div className="flex items-center justify-center px-6 py-16">
            <div className="w-full max-w-sm">
              <a href="/">
                <img src="/ninefold-logo.svg" alt="Ninefold" style={{ height: 16, width: 'auto' }} />
              </a>

              <h1 className="mt-12 text-3xl font-medium" style={{ letterSpacing: '-0.02em' }}>
                Logiraj se.
              </h1>
              <p className="mt-2" style={{ color: MUTED }}>
                Da vidiš što smo ti pripremili.
              </p>

              <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5">
                {error && (
                  <div
                    className="rounded-xl px-4 py-3 text-sm"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#F87171' }}
                  >
                    {error}
                  </div>
                )}

                <label className="block">
                  <span className="mb-2 block text-sm" style={{ color: BODY }}>Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="tvoj@email.com"
                    className="w-full rounded-xl px-4 py-3.5 text-sm outline-none transition-colors focus:border-white/25"
                    style={inputStyle}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm" style={{ color: BODY }}>Lozinka</span>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full rounded-xl px-4 py-3.5 pr-12 text-sm outline-none transition-colors focus:border-white/25"
                      style={inputStyle}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Sakrij lozinku' : 'Prikaži lozinku'}
                      className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors hover:text-white"
                      style={{ color: MUTED }}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-medium transition-transform hover:scale-[1.02]"
                  style={{
                    background: loading ? 'rgba(255,255,255,0.08)' : FG,
                    color: loading ? MUTED : BG,
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Malo strpljenja...
                    </>
                  ) : (
                    'Logiraj se'
                  )}
                </button>
              </form>

              <p className="mt-8 text-center text-sm" style={{ color: MUTED }}>
                Zaboravio lozinku?{' '}
                <a href="mailto:hello@ninefold.eu" className="transition-colors hover:text-white" style={{ color: BODY }}>
                  Javi nam se
                </a>
              </p>
            </div>
          </div>

          {/* Right: brand panel */}
          <div className="hidden items-center justify-center p-10 lg:flex">
            <div
              className="flex h-full w-full flex-col justify-center rounded-[28px] px-14"
              style={{ background: PANEL, border: `1px solid ${LINE}` }}
            >
              <p className="flex items-center gap-2 text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>
                <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: SIGNAL }} />
                Klijentski portal
              </p>
              <h2 className="mt-5 max-w-md text-4xl font-medium leading-[1.1]" style={{ letterSpacing: '-0.02em' }}>
                Tvoj kutak za pregled svega.
              </h2>
              <p className="mt-4 max-w-md text-lg" style={{ color: MUTED }}>
                Projekti, objave, računi i feedback. Sve na jednom mjestu, bez čekanja na mailove.
              </p>

              {/* Mini mockup: approval flow */}
              <div className="mt-10 flex max-w-md flex-col gap-2.5">
                <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${LINE}` }}>
                  <span className="text-sm" style={{ color: BODY }}>Nova objava čeka odobrenje</span>
                  <span className="text-[11px]" style={{ fontFamily: MONO, color: MUTED }}>09:38</span>
                </div>
                <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.09)', border: `1px solid ${LINE}` }}>
                  <span className="flex items-center gap-2 text-sm" style={{ color: FG }}>
                    <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: SIGNAL }} />
                    Odobreno. Ide van u petak.
                  </span>
                  <span className="text-[11px]" style={{ fontFamily: MONO, color: MUTED }}>09:41</span>
                </div>
                <p className="mt-2 self-center text-[10px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.16em', color: MUTED }}>
                  Klik, odobreno, gotovo
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
