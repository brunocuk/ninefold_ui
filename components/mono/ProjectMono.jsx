'use client'

// Project detail page in the Mono design language.
// Structure follows the inity case study page (Atrij): back link, two-column
// header with meta, hero media panel, sticky sidebar + overview, screenshots,
// Izazov / Rješenje, custom sections, results, testimonial, related projects.

import Link from 'next/link'
import {
  PANEL, BG, FG, BODY, MUTED, LINE, SIGNAL, MONO,
  Reveal, Eyebrow, Pill, MeetIcon, MonoPage, MonoCTA, CalButton,
} from '@/components/mono/kit'

const TYPE_LABELS = {
  video_production: 'Video',
  social_media: 'Social Media',
  web_development: 'Web',
  web_app: 'Web App',
  mobile_app: 'Mobile App',
}

// Service detail pages related to a project, for SEO cross-linking. Primary
// match comes from project_type; the rest from keywords in the free-text
// services list (CMS entries mix Croatian and English naming).
const TYPE_TO_SERVICE = {
  web_development: 'web-digitalno',
  web_app: 'web-digitalno',
  mobile_app: 'web-digitalno',
  video_production: 'video-animacija',
  social_media: 'sadrzaj-drustvene-mreze',
}

const KEYWORD_SERVICES = [
  [/photo|fotograf/i, 'fotografija'],
  [/video|animac/i, 'video-animacija'],
  [/brand|brend|logo|identitet/i, 'strategija-branding'],
  [/social|mrež|drustv|društv/i, 'sadrzaj-drustvene-mreze'],
]

const SERVICE_LABELS = {
  'web-digitalno': 'Web i aplikacije',
  'video-animacija': 'Video i animacija',
  'fotografija': 'Fotografija',
  'strategija-branding': 'Strategija i branding',
  'sadrzaj-drustvene-mreze': 'Sadržaj i društvene mreže',
}

function getRelatedServiceSlugs(project) {
  const slugs = []
  const primary = TYPE_TO_SERVICE[project.project_type]
  if (primary) slugs.push(primary)
  for (const [re, slug] of KEYWORD_SERVICES) {
    if (!slugs.includes(slug) && (project.services || []).some((s) => re.test(s))) {
      slugs.push(slug)
    }
  }
  return slugs
}

function getDomain(url) {
  if (!url) return null
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return null
  }
}

function SplitSection({ eyebrow, title, children }) {
  return (
    <section className="mx-auto max-w-[1200px] px-5 pb-20 md:pb-28">
      <div className="grid gap-8 md:grid-cols-[1fr_1.4fr] md:gap-16">
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="mt-3 text-3xl font-medium md:text-4xl" style={{ letterSpacing: '-0.02em' }}>
            {title}
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="text-lg leading-relaxed" style={{ color: BODY }}>
            {children}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default function ProjectMono({ project, relatedProjects }) {
  const shots = project.type_data?.screenshots || null
  const heroShot = shots?.desktop?.[0] || null
  const extraDesktop = (shots?.desktop || []).slice(1)
  const mobileShots = shots?.mobile || []
  const lighthouse = project.type_data?.lighthouse || null
  const domain = getDomain(project.live_site_url)
  const typeLabel = TYPE_LABELS[project.project_type] || project.project_type
  const heroMedia = project.hero_video || heroShot || project.hero_image

  return (
    <MonoPage>
      {/* Back + header */}
      <section className="mx-auto max-w-[1200px] px-5 pt-24 md:pt-28">
        <Reveal>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-sm transition-colors hover:text-white"
            style={{ color: MUTED }}
          >
            ← Natrag na radove
          </Link>
        </Reveal>

        <div className="mt-10 grid gap-10 md:grid-cols-[1.2fr_1fr] md:gap-16">
          <Reveal delay={0.05}>
            <h1
              className="text-[clamp(2.2rem,5vw,3.6rem)] font-medium leading-[1.08]"
              style={{ letterSpacing: '-0.025em' }}
            >
              {project.title}
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="text-lg leading-relaxed md:text-xl" style={{ color: BODY }}>
              {project.tagline}
            </p>
            <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-3">
              <div>
                <p className="text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>
                  Klijent
                </p>
                {project.live_site_url ? (
                  <a
                    href={project.live_site_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-sm transition-colors hover:text-white"
                    style={{ color: BODY }}
                  >
                    {project.client_name} <span style={{ color: MUTED }}>↗</span>
                  </a>
                ) : (
                  <p className="mt-2 text-sm" style={{ color: BODY }}>{project.client_name}</p>
                )}
              </div>
              <div>
                <p className="text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>
                  Tip
                </p>
                <p className="mt-2 text-sm" style={{ color: BODY }}>{typeLabel}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>
                  Godina
                </p>
                <p className="mt-2 text-sm" style={{ color: BODY }}>{project.year}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Hero media */}
      {heroMedia && (
        <section className="mx-auto max-w-[1200px] px-5 pt-14 pb-16 md:pb-20">
          <Reveal>
            <div
              className="overflow-hidden rounded-[28px]"
              style={{ background: PANEL, border: `1px solid ${LINE}` }}
            >
              {project.hero_video ? (
                <video
                  src={project.hero_video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="block w-full"
                />
              ) : (
                <img src={heroMedia} alt={project.title} className="block w-full" />
              )}
            </div>
          </Reveal>

          {lighthouse && (
            <Reveal delay={0.08}>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
                {[
                  ['Performance', lighthouse.performance],
                  ['Accessibility', lighthouse.accessibility],
                  ['Best Practices', lighthouse.best],
                  ['SEO', lighthouse.seo],
                ].filter(([, v]) => v != null).map(([label, value]) => (
                  <span
                    key={label}
                    className="flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs"
                    style={{ border: `1px solid ${LINE}`, color: BODY }}
                  >
                    <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: SIGNAL }} />
                    {label} · {value}
                  </span>
                ))}
              </div>
            </Reveal>
          )}
        </section>
      )}

      {/* Sidebar + overview */}
      <section className="mx-auto max-w-[1200px] px-5 pb-20 md:pb-28">
        <div className="grid gap-10 md:grid-cols-[1fr_1.8fr] md:gap-16">
          <div className="md:sticky md:top-24 md:self-start">
            <Reveal>
              {(project.services || []).length > 0 && (
                <div>
                  <p className="text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>
                    Usluge
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.services.map((s) => (
                      <Pill key={s}>{s}</Pill>
                    ))}
                  </div>
                  {getRelatedServiceSlugs(project).length > 0 && (
                    <div className="mt-4 flex flex-col gap-1.5">
                      {getRelatedServiceSlugs(project).map((slug) => (
                        <Link
                          key={slug}
                          href={`/usluge/${slug}`}
                          className="text-sm transition-colors hover:text-white"
                          style={{ color: BODY }}
                        >
                          {SERVICE_LABELS[slug]} →
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {(project.technologies || []).length > 0 && (
                <div className="mt-8">
                  <p className="text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>
                    Tehnologije
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.technologies.map((t) => (
                      <Pill key={t}>{t}</Pill>
                    ))}
                  </div>
                </div>
              )}

              {project.duration && (
                <div className="mt-8">
                  <p className="text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>
                    Trajanje
                  </p>
                  <p className="mt-2 text-sm" style={{ color: BODY }}>{project.duration}</p>
                </div>
              )}

              {domain && (
                <div className="mt-8">
                  <p className="text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>
                    Live
                  </p>
                  <a
                    href={project.live_site_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-sm transition-colors hover:text-white"
                    style={{ color: BODY }}
                  >
                    {domain} <span style={{ color: MUTED }}>↗</span>
                  </a>
                </div>
              )}
            </Reveal>
          </div>

          <Reveal delay={0.08}>
            <Eyebrow>O projektu</Eyebrow>
            <div className="mt-4 flex flex-col gap-5 text-lg leading-relaxed" style={{ color: BODY }}>
              {(project.description || '').split('\n').filter(Boolean).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Extra desktop screenshots */}
      {extraDesktop.length > 0 && (
        <section className="mx-auto max-w-[1200px] px-5 pb-20 md:pb-28">
          <div className={`grid gap-5 ${extraDesktop.length > 1 ? 'md:grid-cols-2' : ''}`}>
            {extraDesktop.map((src, i) => (
              <Reveal key={src} delay={(i % 2) * 0.06}>
                <div
                  className="overflow-hidden rounded-[24px]"
                  style={{ background: PANEL, border: `1px solid ${LINE}` }}
                >
                  <img src={src} alt={`${project.title} · ekran ${i + 2}`} className="block w-full" loading="lazy" />
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Challenge */}
      {project.challenge && (
        <SplitSection eyebrow="Izazov" title="Odakle smo krenuli.">
          {project.challenge.split('\n').filter(Boolean).map((p, i) => (
            <p key={i} className={i > 0 ? 'mt-5' : ''}>{p}</p>
          ))}
        </SplitSection>
      )}

      {/* Inline mini CTA */}
      <section className="mx-auto max-w-[1200px] px-5 pb-20 md:pb-28">
        <Reveal>
          <div
            className="flex flex-col items-start justify-between gap-5 rounded-[24px] p-7 md:flex-row md:items-center md:p-8"
            style={{ background: PANEL, border: `1px solid ${LINE}` }}
          >
            <div>
              <p className="flex items-center gap-2 text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>
                <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: SIGNAL }} />
                Slobodni termini · Q4 2026
              </p>
              <h3 className="mt-2 text-xl font-medium md:text-2xl" style={{ letterSpacing: '-0.015em' }}>
                Imaš sličan projekt u glavi?
              </h3>
            </div>
            <CalButton className="shrink-0" size={16} />
          </div>
        </Reveal>
      </section>

      {/* Solution */}
      {project.solution && (
        <SplitSection eyebrow="Rješenje" title="Što smo napravili.">
          {project.solution.split('\n').filter(Boolean).map((p, i) => (
            <p key={i} className={i > 0 ? 'mt-5' : ''}>{p}</p>
          ))}
        </SplitSection>
      )}

      {/* Custom sections */}
      {(project.sections || []).map((section, i) => {
        if (section.type === 'text') {
          return (
            <SplitSection key={i} eyebrow="Detalji" title={section.title}>
              <p>{section.content}</p>
            </SplitSection>
          )
        }
        if (section.type === 'two-column') {
          return (
            <section key={i} className="mx-auto max-w-[1200px] px-5 pb-20 md:pb-28">
              <div className="grid gap-5 md:grid-cols-2">
                {[section.left, section.right].filter(Boolean).map((col, j) => (
                  <Reveal key={j} delay={j * 0.06}>
                    <div
                      className="h-full rounded-[24px] p-7 md:p-8"
                      style={{ background: PANEL, border: `1px solid ${LINE}` }}
                    >
                      <h3 className="text-xl font-medium" style={{ letterSpacing: '-0.01em' }}>{col.title}</h3>
                      <p className="mt-3 leading-relaxed" style={{ color: MUTED }}>{col.content}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>
          )
        }
        return null
      })}

      {/* Mobile screenshots */}
      {mobileShots.length > 0 && (
        <section className="mx-auto max-w-[1200px] px-5 pb-20 md:pb-28">
          <Reveal>
            <p className="mb-6 text-center text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>
              Na mobitelu
            </p>
          </Reveal>
          <div className="flex flex-wrap items-start justify-center gap-5">
            {mobileShots.map((src, i) => (
              <Reveal key={src} delay={i * 0.05}>
                <div
                  className="w-[220px] overflow-hidden rounded-[24px] md:w-[260px]"
                  style={{ background: PANEL, border: `1px solid ${LINE}`, padding: 8 }}
                >
                  <img src={src} alt={`${project.title} · mobilni prikaz ${i + 1}`} className="block w-full rounded-2xl" loading="lazy" />
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Results */}
      {(project.results || []).length > 0 && (
        <section className="mx-auto max-w-[1200px] px-5 pb-20 md:pb-28">
          <Reveal>
            <div
              className="grid grid-cols-2 gap-y-10 rounded-[28px] px-6 py-10 text-center md:py-12"
              style={{ border: `1px solid ${LINE}`, gridTemplateColumns: `repeat(${Math.min(project.results.length, 4)}, minmax(0, 1fr))` }}
            >
              {project.results.map((r, i) => (
                <div key={i}>
                  <p className="text-3xl font-medium md:text-4xl" style={{ letterSpacing: '-0.02em' }}>{r.metric}</p>
                  <p className="mt-2 text-sm" style={{ color: MUTED }}>{r.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* Testimonial */}
      {project.testimonial?.quote && (
        <section className="mx-auto max-w-4xl px-5 pb-20 text-center md:pb-28">
          <Reveal>
            <Eyebrow>Klijent kaže</Eyebrow>
            <blockquote className="mx-auto mt-8 max-w-3xl text-xl font-medium leading-snug md:text-[1.65rem]" style={{ letterSpacing: '-0.015em' }}>
              „{project.testimonial.quote}“
            </blockquote>
            <p className="mt-5 text-sm" style={{ color: MUTED }}>
              {[project.testimonial.author, project.testimonial.role, project.testimonial.company].filter(Boolean).join(' · ')}
            </p>
          </Reveal>
        </section>
      )}

      {/* Related projects */}
      {(relatedProjects || []).length > 0 && (
        <section className="mx-auto max-w-[1200px] px-5 pb-20 md:pb-28">
          <Reveal>
            <Eyebrow>Slični projekti</Eyebrow>
            <h2 className="mt-3 mb-10 text-3xl font-medium md:text-4xl" style={{ letterSpacing: '-0.02em' }}>
              Pogledaj još.
            </h2>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {relatedProjects.map((p, i) => (
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
                    <p className="text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>
                      {TYPE_LABELS[p.project_type] || p.project_type}
                    </p>
                    <h3 className="mt-2 text-lg font-medium leading-snug">{p.title}</h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <MonoCTA />
    </MonoPage>
  )
}
