'use client'

// Work page in the Mono design language.
// Structure follows the inity projects page: muted hero, featured projects
// as stacking cards, then a two-column grid for the rest. All CMS-driven.

import { useRef } from 'react'
import Link from 'next/link'
import {
  PANEL, FG, BODY, MUTED, LINE, SIGNAL, MONO,
  Reveal, Eyebrow, Pill, MonoPage, MonoCTA, useScrollStack,
} from '@/components/mono/kit'

const TYPE_LABELS = {
  video_production: 'Video',
  social_media: 'Social Media',
  web_development: 'Web',
  web_app: 'Web App',
  mobile_app: 'Mobile App',
}

export default function WorkMono({ projects }) {
  return (
    <MonoPage>
      <WorkContent projects={projects} />
    </MonoPage>
  )
}

function WorkContent({ projects }) {
  const stackRef = useRef(null)
  useScrollStack(stackRef)

  const featured = (projects || []).filter((p) => p.featured)
  const rest = (projects || []).filter((p) => !p.featured)

  return (
    <>
      {/* Hero */}
      <section className="px-5 pt-24 pb-16 text-center md:pt-32 md:pb-20">
        <Reveal>
          <Eyebrow>Radovi</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h1
            className="mx-auto mt-6 max-w-4xl text-[clamp(2.4rem,6vw,4.5rem)] font-medium leading-[1.05]"
            style={{ letterSpacing: '-0.025em' }}
          >
            Što smo radili.
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mx-auto mt-6 max-w-xl text-lg md:text-xl" style={{ color: MUTED }}>
            Od 2019. isporučili smo 50+ projekata.
            Ovo su neki od njih, pravi screenshotovi, pravi rezultati.
          </p>
        </Reveal>
      </section>

      <div>
        {/* Featured: stacking cards */}
        {featured.length > 0 && (
          <section className="mx-auto max-w-[1200px] px-5 pb-16 md:pb-20">
            <div ref={stackRef}>
              {featured.map((p, i) => (
                <div key={p.slug} className="sticky mb-8 last:mb-0" style={{ top: 84 + i * 14 }}>
                  <Link
                    href={`/work/${p.slug}`}
                    className="group block"
                    style={{ transformOrigin: 'center top', willChange: 'transform, filter' }}
                  >
                    <article
                      className="grid gap-8 rounded-[28px] p-6 md:min-h-[72vh] md:grid-cols-[1fr_1.15fr] md:p-10"
                      style={{ background: PANEL, border: '1px solid rgba(255,255,255,0.09)', boxShadow: '0 -18px 50px rgba(0,0,0,0.55)' }}
                    >
                      <div className="flex flex-col">
                        <div className="flex flex-wrap items-center gap-2">
                          <Pill>🇭🇷 Hrvatska</Pill>
                          <Pill>{TYPE_LABELS[p.project_type] || p.project_type}</Pill>
                          {p.year && <Pill>{p.year}</Pill>}
                        </div>

                        <p
                          className="mt-10 text-[11px] uppercase md:mt-0 md:pt-16"
                          style={{ fontFamily: MONO, letterSpacing: '0.16em', color: MUTED }}
                        >
                          {p.title}
                        </p>

                        <div className="mt-10 md:mt-auto">
                          <h3 className="max-w-md text-[1.7rem] font-medium leading-tight md:text-[2.2rem]" style={{ letterSpacing: '-0.02em' }}>
                            {p.tagline}
                          </h3>
                          <p className="mt-4 max-w-md leading-relaxed" style={{ color: MUTED }}>
                            {(p.services || []).slice(0, 4).join(' · ')}
                          </p>
                          <p className="mt-6 flex items-center gap-2 text-sm" style={{ color: MUTED }}>
                            <span
                              className="inline-block h-1.5 w-1.5 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                              style={{ background: SIGNAL }}
                            />
                            <span className="transition-colors group-hover:text-white">Pogledaj projekt →</span>
                          </p>
                        </div>
                      </div>

                      <div className="overflow-hidden rounded-2xl">
                        <img
                          src={p.featured_image}
                          alt={p.title}
                          className="block h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
                          style={{ aspectRatio: '16/11' }}
                        />
                      </div>
                    </article>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* The rest: two-column grid */}
        {rest.length > 0 && (
          <section className="mx-auto max-w-[1200px] px-5 pb-24 md:pb-32">
            <div className="grid gap-4 md:grid-cols-2 md:gap-5">
              {rest.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 2) * 0.06}>
                  <Link
                    href={`/work/${p.slug}`}
                    className="nf-card block h-full rounded-[28px] p-6 md:p-8"
                    style={{ background: PANEL, border: `1px solid ${LINE}` }}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Pill>🇭🇷 Hrvatska</Pill>
                      <Pill>{TYPE_LABELS[p.project_type] || p.project_type}</Pill>
                      {p.year && <Pill>{p.year}</Pill>}
                    </div>
                    <h3 className="mt-6 text-2xl font-medium leading-tight" style={{ letterSpacing: '-0.015em' }}>
                      {p.title}
                    </h3>
                    <p className="mt-2 leading-relaxed" style={{ color: MUTED }}>
                      {p.tagline}
                    </p>
                    <div
                      className="nf-viswrap mt-6 overflow-hidden rounded-2xl"
                      style={{ background: '#111110', border: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <img
                        src={p.featured_image}
                        alt={p.title}
                        className="nf-vis block w-full object-cover object-top"
                        style={{ aspectRatio: '16/10' }}
                        loading="lazy"
                      />
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>

      <MonoCTA />
    </>
  )
}
