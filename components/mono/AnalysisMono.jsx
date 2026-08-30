'use client'

// Lead magnet stranica: besplatna analiza web stranice. Minimalna forma
// (URL + mail) kao najniža stepenica prije "zatraži ponudu": svaka prijava
// je topli lead koji nam je sam dao svoju stranicu na uvid.

import { useState } from 'react'
import Link from 'next/link'
import {
  PANEL, BG, FG, BODY, MUTED, LINE, SIGNAL, MONO,
  Reveal, Eyebrow, MonoPage, MonoFAQ, MonoCTA, WhatsAppIcon, waLink,
} from '@/components/mono/kit'
import { trackConversion, trackEvent } from '@/components/CookieConsent'
import { ANALYSIS } from '@/components/mono/analysisData'

const inputStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: `1px solid ${LINE}`,
  color: FG,
}

function scrollToForm() {
  document.getElementById('analiza')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function AnalysisMono() {
  return (
    <MonoPage>
      <AnalysisContent />
    </MonoPage>
  )
}

function AnalysisContent() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-[860px] px-5 pt-24 pb-16 text-center md:pt-32 md:pb-20">
        <Reveal>
          <span
            className="inline-block rounded-lg px-3 py-1.5 text-[11px] uppercase"
            style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED, border: `1px solid ${LINE}` }}
          >
            Besplatno · Bez obveza
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <h1
            className="mt-6 text-[clamp(2.4rem,5.5vw,4rem)] font-medium leading-[1.06]"
            style={{ letterSpacing: '-0.025em' }}
          >
            {ANALYSIS.h1}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed" style={{ color: MUTED }}>
            {ANALYSIS.sub}
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={scrollToForm}
              className="rounded-full px-7 py-3.5 text-sm font-medium transition-transform hover:scale-[1.03]"
              style={{ background: FG, color: BG }}
            >
              Zatraži analizu
            </button>
            <a
              href={waLink('Pozdrav! Zanima me besplatna analiza moje web stranice.')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('whatsapp_click', { location: 'analiza-hero' })}
              className="flex items-center gap-2 rounded-full px-6 py-3.5 text-sm transition-colors hover:text-white"
              style={{ border: `1px solid ${LINE}`, color: BODY }}
            >
              <WhatsAppIcon size={16} />
              Piši nam na WhatsApp
            </a>
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {['Odgovor u 48 sati', 'Radi je čovjek, ne program', 'Nula obveze'].map((p) => (
              <span key={p} className="flex items-center gap-2 text-xs" style={{ color: MUTED }}>
                <span className="inline-block h-1 w-1 rounded-full" style={{ background: SIGNAL }} />
                {p}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Što provjeravamo */}
      <section className="mx-auto max-w-[1200px] px-5 pb-20 md:pb-28">
        <Reveal>
          <Eyebrow>Što dobivaš</Eyebrow>
          <h2 className="mt-3 mb-10 text-3xl font-medium md:text-4xl" style={{ letterSpacing: '-0.02em' }}>
            Četiri stvari koje prolazimo na tvojoj stranici.
          </h2>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2">
          {ANALYSIS.checks.map((c, i) => (
            <Reveal key={c.title} delay={(i % 2) * 0.06}>
              <div
                className="nf-card h-full rounded-[24px] p-7 md:p-8"
                style={{ background: PANEL, border: `1px solid ${LINE}` }}
              >
                <h3 className="text-xl font-medium" style={{ letterSpacing: '-0.01em' }}>{c.title}</h3>
                <p className="mt-3 leading-relaxed" style={{ color: MUTED }}>{c.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Kako ide */}
      <section className="mx-auto max-w-[1200px] px-5 pb-20 md:pb-28">
        <Reveal>
          <Eyebrow>Kako ide</Eyebrow>
          <h2 className="mt-3 mb-10 text-3xl font-medium md:text-4xl" style={{ letterSpacing: '-0.02em' }}>
            Trideset sekundi tvog vremena.
          </h2>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {ANALYSIS.steps.map((p, i) => (
            <Reveal key={p.step} delay={i * 0.06}>
              <div className="h-full rounded-[24px] p-6" style={{ background: PANEL, border: `1px solid ${LINE}` }}>
                <p className="text-[11px]" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>{p.step}</p>
                <h3 className="mt-4 text-lg font-medium">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: MUTED }}>{p.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Forma */}
      <section id="analiza" className="mx-auto max-w-[1200px] px-5 pb-20 md:pb-28">
        <div className="grid gap-10 md:grid-cols-[1fr_1.25fr] md:gap-16">
          <div>
            <Reveal>
              <Eyebrow>Prijava</Eyebrow>
              <h2 className="mt-3 text-3xl font-medium md:text-5xl" style={{ letterSpacing: '-0.02em' }}>
                Zatraži svoju analizu
              </h2>
              <p className="mt-4 max-w-md text-lg" style={{ color: MUTED }}>
                Dva polja i gotovo. Analiza stiže na mail u roku 48 sati.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8 flex flex-col gap-4">
                <a
                  href={waLink('Pozdrav! Zanima me besplatna analiza moje web stranice.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('whatsapp_click', { location: 'analiza-forma' })}
                  className="nf-card block w-full rounded-2xl p-6 text-left"
                  style={{ background: PANEL, border: `1px solid ${LINE}` }}
                >
                  <p className="text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>
                    Draži ti je razgovor?
                  </p>
                  <p className="mt-2 flex items-center gap-2.5 text-lg font-medium">
                    <WhatsAppIcon size={18} />
                    Piši nam na WhatsApp
                  </p>
                </a>
                <div className="flex items-center gap-3 rounded-2xl p-5" style={{ background: PANEL, border: `1px solid ${LINE}` }}>
                  <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: SIGNAL }} />
                  <p className="text-sm" style={{ color: MUTED }}>
                    Tvoj mail koristimo samo da ti pošaljemo analizu. Bez newslettera, bez spama.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <AnalysisForm />
          </Reveal>
        </div>
      </section>

      <MonoFAQ items={ANALYSIS.faqs} />

      <MonoCTA />
    </>
  )
}

function AnalysisForm() {
  const [form, setForm] = useState({ url: '', email: '', name: '' })
  const [status, setStatus] = useState(null) // null | 'sending' | 'success' | 'error'

  const canSubmit = form.url.trim() && form.email.trim() && status !== 'sending'

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
          name: form.name || 'Nije navedeno',
          email: form.email,
          website: form.url,
          landing: ANALYSIS.slug,
          subject: `Zahtjev za besplatnu analizu · ${form.url}`,
          from_name: 'Ninefold Besplatna Analiza',
        }),
      })
      const json = await res.json()
      if (json.success) {
        trackConversion('contact')
        setStatus('success')
        setForm({ url: '', email: '', name: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[28px] p-6 md:p-9"
      style={{ background: PANEL, border: `1px solid ${LINE}` }}
    >
      <label className="block">
        <span className="mb-2 block text-sm" style={{ color: BODY }}>
          Adresa tvoje stranice <span style={{ color: MUTED }}>*</span>
        </span>
        <input
          type="text"
          inputMode="url"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          placeholder="www.tvoja-stranica.hr"
          className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-white/25"
          style={inputStyle}
          required
        />
      </label>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm" style={{ color: BODY }}>
            Email <span style={{ color: MUTED }}>*</span>
          </span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="tvoj@email.com"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-white/25"
            style={inputStyle}
            required
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm" style={{ color: BODY }}>Ime</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nije obavezno"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-white/25"
            style={inputStyle}
          />
        </label>
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
          {status === 'sending' ? 'Šaljem...' : 'Pošalji na analizu'}
        </button>

        {status === 'success' && (
          <p className="flex items-center gap-2 text-sm" style={{ color: BODY }}>
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: SIGNAL }} />
            Zaprimljeno. Analiza stiže na mail u roku 48 sati.
          </p>
        )}
        {status === 'error' && (
          <p className="text-sm" style={{ color: '#F87171' }}>
            Nešto je puklo. Probaj ponovo ili piši direktno na hello@ninefold.eu
          </p>
        )}
      </div>
    </form>
  )
}
