'use client'

// Service detail page in the Mono design language.
// Structure follows the inity service page: split hero with eyebrow chip and
// the service's CSS visual, features, numbered process, includes, related
// projects (when the CMS has them), other services, CTA.

import Link from 'next/link'
import {
  PANEL, BG, FG, BODY, MUTED, LINE, SIGNAL, MONO,
  Reveal, Eyebrow, Pill, MeetIcon, MonoPage, MonoCTA, MonoTestimonials, useCalPopup,
} from '@/components/mono/kit'
import { SERVICE_VISUALS } from '@/components/mono/serviceVisuals'
import { SERVICES, SERVICE_DETAILS } from '@/components/mono/serviceData'

export default function ServiceMono({ slug, projects, posts }) {
  return (
    <MonoPage>
      <ServiceContent slug={slug} projects={projects} posts={posts} />
    </MonoPage>
  )
}

function ServiceContent({ slug, projects = [], posts = [] }) {
  const openCal = useCalPopup()
  const meta = SERVICES.find((s) => s.slug === slug)
  const detail = SERVICE_DETAILS[slug]

  if (!meta || !detail) return null
  const others = SERVICES.filter((s) => s.slug !== slug)

  return (
    <>
      {/* Hero: split with the service visual */}
      <section className="mx-auto max-w-[1200px] px-5 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="grid items-center gap-10 md:grid-cols-[1.15fr_1fr] md:gap-16">
          <div>
            <Reveal>
              <span
                className="inline-block rounded-lg px-3 py-1.5 text-[11px] uppercase"
                style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED, border: `1px solid ${LINE}` }}
              >
                {detail.title}
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1
                className="mt-6 text-[clamp(2.2rem,4.5vw,3.4rem)] font-medium leading-[1.08]"
                style={{ letterSpacing: '-0.025em' }}
              >
                {detail.headline}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed" style={{ color: MUTED }}>
                {detail.sub}
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={openCal}
                  className="flex items-center gap-2 rounded-full pl-4 pr-6 py-3 text-sm font-medium transition-transform hover:scale-[1.03]"
                  style={{ background: FG, color: BG }}
                >
                  <MeetIcon size={16} />
                  Čujemo se
                </button>
                <Link
                  href="/work"
                  className="rounded-full px-6 py-3 text-sm transition-colors hover:text-white"
                  style={{ border: `1px solid ${LINE}`, color: MUTED }}
                >
                  Pogledaj radove
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <div
              className="h-[300px] overflow-hidden rounded-[28px] md:h-[380px]"
              style={{ background: '#111110', border: `1px solid ${LINE}` }}
            >
              <div className="h-full scale-110">{SERVICE_VISUALS[meta.visual]}</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-[1200px] px-5 pb-20 md:pb-28">
        <div className="grid gap-4 md:grid-cols-2">
          {detail.features.map((f, i) => (
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

      {/* Process */}
      <section className="mx-auto max-w-[1200px] px-5 pb-20 md:pb-28">
        <Reveal>
          <Eyebrow>Kako radimo</Eyebrow>
          <h2 className="mt-3 mb-10 text-3xl font-medium md:text-4xl" style={{ letterSpacing: '-0.02em' }}>
            Od dogovora do isporuke.
          </h2>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-4">
          {detail.steps.map((p, i) => (
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

      {/* Includes */}
      <section className="mx-auto max-w-[1200px] px-5 pb-20 md:pb-28">
        <Reveal>
          <p className="text-center text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>
            Uključeno u suradnju
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
            {detail.includes.map((item) => (
              <span
                key={item}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm"
                style={{ border: `1px solid ${LINE}`, color: BODY, background: PANEL }}
              >
                <span className="inline-block h-1 w-1 rounded-full" style={{ background: SIGNAL }} />
                {item}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Related projects */}
      {projects.length > 0 && (
        <section className="mx-auto max-w-[1200px] px-5 pb-20 md:pb-28">
          <Reveal>
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <Eyebrow>Radovi</Eyebrow>
                <h2 className="mt-3 text-3xl font-medium md:text-4xl" style={{ letterSpacing: '-0.02em' }}>
                  Iz ove usluge.
                </h2>
              </div>
              <Link
                href="/work"
                className="hidden shrink-0 rounded-full px-5 py-2.5 text-sm transition-colors hover:text-white md:block"
                style={{ border: `1px solid ${LINE}`, color: MUTED }}
              >
                Svi projekti →
              </Link>
            </div>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {projects.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 0.06}>
                <Link
                  href={`/work/${p.slug}`}
                  className="nf-card block h-full rounded-[24px] p-5"
                  style={{ background: PANEL, border: `1px solid ${LINE}` }}
                >
                  <div
                    className="nf-viswrap overflow-hidden rounded-2xl"
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
                  <div className="px-2 pb-2 pt-4">
                    <h3 className="text-lg font-medium leading-snug">{p.title}</h3>
                    <p className="mt-1.5 text-sm" style={{ color: MUTED }}>{p.tagline}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <MonoTestimonials />

      {/* Related blog posts */}
      {posts.length > 0 && (
        <section className="mx-auto max-w-[1200px] px-5 pb-20 md:pb-28">
          <Reveal>
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <Eyebrow>Čitaj više</Eyebrow>
                <h2 className="mt-3 text-3xl font-medium md:text-4xl" style={{ letterSpacing: '-0.02em' }}>
                  S bloga, bez žargona.
                </h2>
              </div>
              <Link
                href="/blog"
                className="hidden shrink-0 rounded-full px-5 py-2.5 text-sm transition-colors hover:text-white md:block"
                style={{ border: `1px solid ${LINE}`, color: MUTED }}
              >
                Svi članci →
              </Link>
            </div>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 0.06}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="nf-card flex h-full flex-col rounded-[24px] p-5"
                  style={{ background: PANEL, border: `1px solid ${LINE}` }}
                >
                  <p className="text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>
                    {p.category} · {p.readTime}
                  </p>
                  <h3 className="mt-3 text-lg font-medium leading-snug">{p.title}</h3>
                  <p className="nf-arrow mt-auto pt-5 text-sm" style={{ color: MUTED }}>
                    Pročitaj →
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Other services */}
      <section className="mx-auto max-w-[1200px] px-5 pb-20 md:pb-28">
        <Reveal>
          <Eyebrow>Ostale usluge</Eyebrow>
          <h2 className="mt-3 mb-10 text-3xl font-medium md:text-4xl" style={{ letterSpacing: '-0.02em' }}>
            Što još radimo.
          </h2>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {others.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 5) * 0.05}>
              <Link
                href={`/usluge/${s.slug}`}
                className="nf-card flex h-full flex-col justify-between rounded-[20px] p-5"
                style={{ background: PANEL, border: `1px solid ${LINE}` }}
              >
                <h3 className="text-base font-medium leading-snug">{s.title}</h3>
                <span className="nf-arrow mt-4 self-end text-sm" style={{ color: MUTED }}>↗</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <MonoCTA />
    </>
  )
}
