'use client'

// Contact page in the Mono design language.
// Structure follows the inity contact page: intro + info cards on the left,
// rich form on the right (services, project type, budget), FAQ below.
// Submission stays on the existing Web3Forms setup.

import { useState } from 'react'
import {
  PANEL, BG, FG, BODY, MUTED, LINE, SIGNAL, MONO,
  Reveal, Eyebrow, MeetIcon, MonoPage, MonoFAQ, SERVICE_FAQS, useCalPopup,
} from '@/components/mono/kit'
import { trackConversion } from '@/components/CookieConsent'

const SERVICES = ['Web', 'Video', 'Fotografija', 'Branding', 'Društvene mreže', 'Studio', 'Nešto drugo']
const PROJECT_TYPES = ['Jednokratni projekt', 'Kontinuirana suradnja']
const BUDGETS = ['Do 2.000 €', '2.000–5.000 €', '5.000–10.000 €', '10.000 €+', 'Ne znam još']

const inputStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: `1px solid ${LINE}`,
  color: FG,
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm" style={{ color: BODY }}>
        {label} {required && <span style={{ color: MUTED }}>*</span>}
      </span>
      {children}
    </label>
  )
}

export default function ContactMono() {
  return (
    <MonoPage>
      <ContactContent />
    </MonoPage>
  )
}

function ContactContent() {
  const openCal = useCalPopup()
  const [form, setForm] = useState({ name: '', company: '', email: '', message: '' })
  const [services, setServices] = useState([])
  const [projectType, setProjectType] = useState('')
  const [budget, setBudget] = useState('')
  const [status, setStatus] = useState(null) // null | 'sending' | 'success' | 'error'

  const toggleService = (s) =>
    setServices((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))

  const canSubmit = form.name.trim() && form.email.trim() && status !== 'sending'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: '55bd9170-5a04-47a7-a2a4-f6eeb07fb66d',
          name: form.name,
          email: form.email,
          company: form.company || 'Nije navedeno',
          services: services.join(', ') || 'Nije navedeno',
          project_type: projectType || 'Nije navedeno',
          budget: budget || 'Nije navedeno',
          message: form.message || '(bez poruke)',
          subject: `Nova poruka s ninefold.eu · ${form.name}`,
          from_name: 'Ninefold Contact Form',
        }),
      })
      const data = await res.json()
      if (data.success) {
        trackConversion('contact')
        setStatus('success')
        setForm({ name: '', company: '', email: '', message: '' })
        setServices([])
        setProjectType('')
        setBudget('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <section className="mx-auto max-w-[1200px] px-5 pt-24 pb-24 md:pt-32 md:pb-32">
        <div className="grid gap-12 md:grid-cols-[1fr_1.25fr] md:gap-16">
          {/* Left: intro + info cards */}
          <div>
            <Reveal>
              <Eyebrow>Kontakt</Eyebrow>
              <h1
                className="mt-4 text-[clamp(2.4rem,5vw,3.8rem)] font-medium leading-[1.05]"
                style={{ letterSpacing: '-0.025em' }}
              >
                Čujemo se.
              </h1>
              <p className="mt-5 max-w-md text-lg" style={{ color: MUTED }}>
                Napiši nam što te muči ili što gradiš. Odgovaramo unutar 24 sata,
                i to netko od nas dvojice, ne autoresponder.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-col gap-4">
                <button
                  onClick={openCal}
                  className="nf-card block w-full rounded-2xl p-6 text-left"
                  style={{ background: PANEL, border: `1px solid ${LINE}` }}
                >
                  <p className="text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>
                    Draži ti je poziv?
                  </p>
                  <p className="mt-2 flex items-center gap-2.5 text-lg font-medium">
                    <MeetIcon size={18} />
                    Rezerviraj termin
                  </p>
                </button>

                <a
                  href="mailto:hello@ninefold.eu"
                  className="nf-card block rounded-2xl p-6"
                  style={{ background: PANEL, border: `1px solid ${LINE}` }}
                >
                  <p className="text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>
                    Email
                  </p>
                  <p className="mt-2 text-lg font-medium">hello@ninefold.eu</p>
                </a>

                <div className="rounded-2xl p-6" style={{ background: PANEL, border: `1px solid ${LINE}` }}>
                  <p className="text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>
                    Lokacija
                  </p>
                  <p className="mt-2 text-lg font-medium">Poljačka ul. 56, Zagreb</p>
                </div>

                <div className="flex items-center gap-3 rounded-2xl p-5" style={{ background: PANEL, border: `1px solid ${LINE}` }}>
                  <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: SIGNAL }} />
                  <p className="text-sm" style={{ color: MUTED }}>
                    Odgovor unutar 24 sata. Obično brže.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: the form */}
          <Reveal delay={0.15}>
            <form
              onSubmit={handleSubmit}
              className="rounded-[28px] p-6 md:p-9"
              style={{ background: PANEL, border: `1px solid ${LINE}` }}
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Ime i prezime" required>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Tvoje ime"
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-white/25"
                    style={inputStyle}
                    required
                  />
                </Field>
                <Field label="Firma">
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="Ime firme (ako postoji)"
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-white/25"
                    style={inputStyle}
                  />
                </Field>
              </div>

              <div className="mt-5">
                <Field label="Email" required>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="tvoj@email.com"
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-white/25"
                    style={inputStyle}
                    required
                  />
                </Field>
              </div>

              <div className="mt-7">
                <p className="mb-3 text-sm" style={{ color: BODY }}>
                  Što te zanima? <span style={{ color: MUTED }}>(odaberi sve što paše)</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {SERVICES.map((s) => {
                    const on = services.includes(s)
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleService(s)}
                        className="rounded-full px-4 py-2 text-sm transition-colors"
                        style={{
                          background: on ? FG : 'rgba(255,255,255,0.04)',
                          color: on ? BG : BODY,
                          border: `1px solid ${on ? 'transparent' : LINE}`,
                        }}
                      >
                        {s}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="mt-7">
                <p className="mb-3 text-sm" style={{ color: BODY }}>Tip projekta</p>
                <div className="flex flex-wrap gap-2">
                  {PROJECT_TYPES.map((t) => {
                    const on = projectType === t
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setProjectType(on ? '' : t)}
                        className="flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors"
                        style={{
                          background: on ? FG : 'rgba(255,255,255,0.04)',
                          color: on ? BG : BODY,
                          border: `1px solid ${on ? 'transparent' : LINE}`,
                        }}
                      >
                        <span
                          className="inline-block h-1.5 w-1.5 rounded-full"
                          style={{ background: on ? SIGNAL : 'rgba(255,255,255,0.2)' }}
                        />
                        {t}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="mt-7">
                <Field label="Okvirni budžet">
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full appearance-none rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-white/25"
                    style={{ ...inputStyle, color: budget ? FG : MUTED }}
                  >
                    <option value="" style={{ color: '#111' }}>Odaberi raspon (nije obavezno)</option>
                    {BUDGETS.map((b) => (
                      <option key={b} value={b} style={{ color: '#111' }}>{b}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="mt-5">
                <Field label="Reci nam nešto više">
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Što gradiš, koji je rok, što te muči..."
                    rows={4}
                    className="w-full resize-none rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-white/25"
                    style={inputStyle}
                  />
                </Field>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="rounded-full px-7 py-3.5 text-sm font-medium transition-all"
                  style={{
                    background: canSubmit ? FG : 'rgba(255,255,255,0.08)',
                    color: canSubmit ? BG : MUTED,
                    cursor: canSubmit ? 'pointer' : 'not-allowed',
                  }}
                >
                  {status === 'sending' ? 'Šaljem...' : 'Pošalji poruku'}
                </button>

                {status === 'success' && (
                  <p className="flex items-center gap-2 text-sm" style={{ color: BODY }}>
                    <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: SIGNAL }} />
                    Poruka poslana. Javimo se unutar 24 sata.
                  </p>
                )}
                {status === 'error' && (
                  <p className="text-sm" style={{ color: '#F87171' }}>
                    Nešto je puklo. Probaj ponovo ili piši direktno na hello@ninefold.eu
                  </p>
                )}
              </div>
            </form>
          </Reveal>
        </div>
      </section>

      <MonoFAQ items={SERVICE_FAQS} />
    </>
  )
}
