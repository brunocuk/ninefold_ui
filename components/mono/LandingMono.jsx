'use client'

// Kampanjske landing stranice u Mono jeziku (izrada web stranica / web shopa).
// Ista struktura za obje: hero s cijenom, logo zid, prednosti, paketi s cijenama,
// proces, testimonijali, FAQ, upit forma. Sve gura na jednu od dvije konverzije:
// rezerviran poziv ili poslana forma.

import { useState } from 'react'
import Link from 'next/link'
import {
  PANEL, BG, FG, BODY, MUTED, LINE, SIGNAL, MONO,
  Reveal, Eyebrow, MeetIcon, MonoPage, MonoFAQ, MonoTestimonials, MonoCTA,
  CLIENT_LOGOS, useCalPopup,
} from '@/components/mono/kit'
import { trackConversion } from '@/components/CookieConsent'
import { LANDINGS } from '@/components/mono/landingData'

const inputStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: `1px solid ${LINE}`,
  color: FG,
}

function formatPrice(n) {
  return `${n.toLocaleString('hr-HR')} €`
}

function scrollToForm() {
  document.getElementById('upit')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function LandingMono({ slug }) {
  return (
    <MonoPage>
      <LandingContent slug={slug} />
    </MonoPage>
  )
}

function LandingContent({ slug }) {
  const openCal = useCalPopup()
  const [selectedPackage, setSelectedPackage] = useState('')
  const data = LANDINGS[slug]
  if (!data) return null

  const pickPackage = (name) => {
    setSelectedPackage(name)
    scrollToForm()
  }

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-[860px] px-5 pt-24 pb-16 text-center md:pt-32 md:pb-20">
        <Reveal>
          <span
            className="inline-block rounded-lg px-3 py-1.5 text-[11px] uppercase"
            style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED, border: `1px solid ${LINE}` }}
          >
            {data.chip}
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <h1
            className="mt-6 text-[clamp(2.4rem,5.5vw,4rem)] font-medium leading-[1.06]"
            style={{ letterSpacing: '-0.025em' }}
          >
            {data.h1}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed" style={{ color: MUTED }}>
            {data.sub}
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={openCal}
              className="flex items-center gap-2 rounded-full pl-4 pr-6 py-3.5 text-sm font-medium transition-transform hover:scale-[1.03]"
              style={{ background: FG, color: BG }}
            >
              <MeetIcon size={16} />
              Rezerviraj besplatni poziv
            </button>
            <button
              onClick={scrollToForm}
              className="rounded-full px-6 py-3.5 text-sm transition-colors hover:text-white"
              style={{ border: `1px solid ${LINE}`, color: BODY }}
            >
              Zatraži ponudu
            </button>
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {data.heroPills.map((p) => (
              <span key={p} className="flex items-center gap-2 text-xs" style={{ color: MUTED }}>
                <span className="inline-block h-1 w-1 rounded-full" style={{ background: SIGNAL }} />
                {p}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Logo zid */}
      <section className="mx-auto max-w-[1200px] px-5 pb-20 md:pb-28">
        <Reveal>
          <p className="text-center text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>
            Vjeruje nam 50+ klijenata u Hrvatskoj
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-10 gap-y-7">
            {CLIENT_LOGOS.slice(0, 10).map((c) => (
              <img
                key={c.name}
                src={c.src}
                alt={c.name}
                title={c.name}
                className="h-6 w-auto transition-opacity hover:opacity-90 md:h-7"
                style={{ filter: 'brightness(0) invert(1)', opacity: 0.45 }}
              />
            ))}
          </div>
        </Reveal>
      </section>

      {/* Prednosti */}
      <section className="mx-auto max-w-[1200px] px-5 pb-20 md:pb-28">
        <div className="grid gap-4 md:grid-cols-2">
          {data.benefits.map((f, i) => (
            <Reveal key={f.title} delay={(i % 2) * 0.06}>
              <div
                className="nf-card h-full rounded-[24px] p-7 md:p-8"
                style={{ background: PANEL, border: `1px solid ${LINE}` }}
              >
                <h3 className="text-xl font-medium" style={{ letterSpacing: '-0.01em' }}>{f.title}</h3>
                <p className="mt-3 leading-relaxed" style={{ color: MUTED }}>{f.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Gradska sekcija (samo na gradskim varijantama) */}
      {data.citySection && (
        <section className="mx-auto max-w-[860px] px-5 pb-20 md:pb-28">
          <Reveal>
            <Eyebrow>Lokalno</Eyebrow>
            <h2 className="mt-3 text-3xl font-medium md:text-4xl" style={{ letterSpacing: '-0.02em' }}>
              {data.citySection.title}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="mt-6 flex flex-col gap-5">
              {data.citySection.paragraphs.map((p, i) => (
                <p key={i} className="text-lg leading-relaxed" style={{ color: BODY }}>
                  {p}
                </p>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* Paketi i cijene */}
      <section className="mx-auto max-w-[1200px] px-5 pb-20 md:pb-28">
        <Reveal>
          <Eyebrow>Cijene</Eyebrow>
          <h2 className="mt-3 text-3xl font-medium md:text-5xl" style={{ letterSpacing: '-0.02em' }}>
            {data.packagesTitle}
          </h2>
          <p className="mt-4 max-w-xl text-lg" style={{ color: MUTED }}>
            {data.packagesSub}
          </p>
        </Reveal>
        <div className={`mt-10 grid gap-4 ${data.packages.length === 3 ? 'md:grid-cols-3' : 'mx-auto max-w-3xl md:grid-cols-2'}`}>
          {data.packages.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.06}>
              <div
                className="nf-card flex h-full flex-col rounded-[24px] p-7"
                style={{
                  background: PANEL,
                  border: `1px solid ${p.highlight ? 'rgba(255,255,255,0.18)' : LINE}`,
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-medium">{p.name}</h3>
                  {p.badge && (
                    <span
                      className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] uppercase"
                      style={{ fontFamily: MONO, letterSpacing: '0.1em', border: `1px solid ${LINE}`, color: BODY }}
                    >
                      <span className="inline-block h-1 w-1 rounded-full" style={{ background: SIGNAL }} />
                      {p.badge}
                    </span>
                  )}
                </div>
                <p className="mt-4 text-3xl font-medium" style={{ letterSpacing: '-0.02em' }}>
                  {p.price != null ? formatPrice(p.price) : p.priceNote}
                </p>
                <p className="mt-1.5 text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.12em', color: MUTED }}>
                  Izrada · {p.duration}
                </p>
                <p className="mt-4 text-sm leading-relaxed" style={{ color: MUTED }}>{p.tagline}</p>
                <ul className="mt-5 flex flex-col gap-2.5 text-sm" style={{ color: BODY }}>
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <span className="mt-[7px] inline-block h-1 w-1 shrink-0 rounded-full" style={{ background: SIGNAL }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => pickPackage(p.name)}
                  className="mt-7 rounded-full py-3 text-sm font-medium transition-transform hover:scale-[1.02]"
                  style={
                    p.highlight
                      ? { background: FG, color: BG }
                      : { border: `1px solid ${LINE}`, color: BODY }
                  }
                >
                  Zatraži ponudu
                </button>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <p className="mt-6 text-sm leading-relaxed" style={{ color: MUTED }}>
            {data.packagesNote}
          </p>
        </Reveal>
      </section>

      {/* Proces */}
      <section className="mx-auto max-w-[1200px] px-5 pb-20 md:pb-28">
        <Reveal>
          <Eyebrow>Kako radimo</Eyebrow>
          <h2 className="mt-3 mb-10 text-3xl font-medium md:text-4xl" style={{ letterSpacing: '-0.02em' }}>
            Od dogovora do isporuke.
          </h2>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-4">
          {data.steps.map((p, i) => (
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

      <MonoTestimonials />

      <MonoFAQ items={data.faqs} />

      {/* Gradovi (interno povezivanje lokalnih varijanti) */}
      {data.cityLinks && (
        <section className="mx-auto max-w-[1200px] px-5 pb-20 md:pb-28">
          <Reveal>
            <div className="rounded-[24px] p-7 md:p-8" style={{ background: PANEL, border: `1px solid ${LINE}` }}>
              <p className="text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>
                Izrada web stranica po gradovima
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {data.cityLinks.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="rounded-full px-4 py-2 text-sm transition-colors hover:text-white"
                    style={{ border: `1px solid ${LINE}`, color: BODY }}
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* Upit forma */}
      <section id="upit" className="mx-auto max-w-[1200px] px-5 pb-24 md:pb-32">
        <div className="grid gap-10 md:grid-cols-[1fr_1.25fr] md:gap-16">
          <div>
            <Reveal>
              <Eyebrow>Upit</Eyebrow>
              <h2 className="mt-3 text-3xl font-medium md:text-5xl" style={{ letterSpacing: '-0.02em' }}>
                {data.formTitle}
              </h2>
              <p className="mt-4 max-w-md text-lg" style={{ color: MUTED }}>
                {data.formSub}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8 flex flex-col gap-4">
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
                <div className="flex items-center gap-3 rounded-2xl p-5" style={{ background: PANEL, border: `1px solid ${LINE}` }}>
                  <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: SIGNAL }} />
                  <p className="text-sm" style={{ color: MUTED }}>
                    Odgovor unutar 24 sata. Obično brže.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <LandingForm
              data={data}
              selectedPackage={selectedPackage}
              onSelectPackage={setSelectedPackage}
            />
          </Reveal>
        </div>
      </section>

      <MonoCTA />
    </>
  )
}

function LandingForm({ data, selectedPackage, onSelectPackage }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState(null) // null | 'sending' | 'success' | 'error'

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
          phone: form.phone || 'Nije naveden',
          package: selectedPackage || 'Nije odabran',
          message: form.message || '(bez poruke)',
          landing: data.slug,
          subject: selectedPackage
            ? `${data.formSubject} · ${selectedPackage} · ${form.name}`
            : `${data.formSubject} · ${form.name}`,
          from_name: 'Ninefold Landing Form',
        }),
      })
      const json = await res.json()
      if (json.success) {
        trackConversion('contact')
        setStatus('success')
        setForm({ name: '', email: '', phone: '', message: '' })
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
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm" style={{ color: BODY }}>
            Ime i prezime <span style={{ color: MUTED }}>*</span>
          </span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Tvoje ime"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-white/25"
            style={inputStyle}
            required
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm" style={{ color: BODY }}>Telefon</span>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="Broj mobitela (nije obavezno)"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-white/25"
            style={inputStyle}
          />
        </label>
      </div>

      <div className="mt-5">
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
      </div>

      <div className="mt-7">
        <p className="mb-3 text-sm" style={{ color: BODY }}>
          Koji te paket zanima? <span style={{ color: MUTED }}>(nije obavezno)</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {data.packages.map((p) => {
            const on = selectedPackage === p.name
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => onSelectPackage(on ? '' : p.name)}
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
                {p.name}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-5">
        <label className="block">
          <span className="mb-2 block text-sm" style={{ color: BODY }}>Reci nam nešto više</span>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Čime se baviš, što trebaš, koji je rok..."
            rows={4}
            className="w-full resize-none rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-white/25"
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
          {status === 'sending' ? 'Šaljem...' : 'Pošalji upit'}
        </button>

        {status === 'success' && (
          <p className="flex items-center gap-2 text-sm" style={{ color: BODY }}>
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: SIGNAL }} />
            Upit poslan. Javimo se unutar 24 sata.
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
