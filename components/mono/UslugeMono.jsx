'use client'

// Services overview page (/usluge) in the Mono design language.

import Link from 'next/link'
import {
  PANEL, FG, BODY, MUTED, LINE, SIGNAL, MONO,
  Reveal, Eyebrow, MonoPage, MonoCTA, MonoTestimonials, MonoFAQ, SERVICE_FAQS,
} from '@/components/mono/kit'
import { SERVICE_VISUALS } from '@/components/mono/serviceVisuals'
import { SERVICES } from '@/components/mono/serviceData'

export default function UslugeMono() {
  return (
    <MonoPage>
      {/* Hero */}
      <section className="px-5 pt-24 pb-16 text-center md:pt-32 md:pb-20">
        <Reveal>
          <Eyebrow>Usluge</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h1
            className="mx-auto mt-6 max-w-4xl text-[clamp(2.4rem,6vw,4.5rem)] font-medium leading-[1.05]"
            style={{ letterSpacing: '-0.025em' }}
          >
            Što radimo.
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mx-auto mt-6 max-w-xl text-lg md:text-xl" style={{ color: MUTED }}>
            Web, video, fotografija i branding. I to je to.
            Bez sinergija, bez leveragea, bez "digitalnih transformacija".
          </p>
        </Reveal>
      </section>

      {/* Service cards */}
      <section className="mx-auto max-w-[1200px] px-5 pb-24 md:pb-32">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 0.05}>
              <Link
                href={`/usluge/${s.slug}`}
                className="nf-card flex h-full flex-col rounded-[24px] p-3 pb-6"
                style={{ background: PANEL, border: `1px solid ${LINE}` }}
              >
                <div
                  className="nf-viswrap mb-5 h-[180px] overflow-hidden rounded-2xl"
                  style={{ background: '#111110', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <div className="nf-vis h-full">{SERVICE_VISUALS[s.visual]}</div>
                </div>
                <div className="flex flex-1 flex-col px-4">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-medium">{s.title}</h3>
                    <span className="nf-arrow mt-1 text-sm" style={{ color: MUTED }}>↗</span>
                  </div>
                  <p className="mt-2.5 text-sm leading-relaxed" style={{ color: MUTED }}>
                    {s.note}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Process teaser */}
      <section className="mx-auto max-w-[1200px] px-5 pb-24 md:pb-32">
        <Reveal>
          <Eyebrow>Kako radimo</Eyebrow>
          <h2 className="mt-3 mb-10 text-3xl font-medium md:text-5xl" style={{ letterSpacing: '-0.02em' }}>
            Od poziva do lansiranja.
          </h2>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { step: '01', title: 'Razgovor', note: '30 minuta poziva. Prođemo ideju, budžet i rokove.' },
            { step: '02', title: 'Ponuda', note: 'U par dana dobiješ konkretnu ponudu. Bez skrivenih stavki.' },
            { step: '03', title: 'Izrada', note: 'Radimo, ti pratiš. Bez posrednika i bez tišine.' },
            { step: '04', title: 'Lansiranje', note: 'Testiramo, lansiramo i ne nestajemo nakon toga.' },
          ].map((p, i) => (
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

      <MonoFAQ items={SERVICE_FAQS} />

      <MonoCTA />
    </MonoPage>
  )
}
