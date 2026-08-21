'use client'

// Blog list page in the Mono design language.
// Receives trimmed posts (no content blocks) from the server route.

import Link from 'next/link'
import {
  PANEL, FG, BODY, MUTED, LINE, MONO,
  Reveal, Eyebrow, Pill, MonoPage, MonoCTA,
} from '@/components/mono/kit'

function formatDate(iso) {
  const d = new Date(iso)
  return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}.`
}

export default function BlogMono({ posts }) {
  const featured = posts.find((p) => p.featured) || posts[0]
  const rest = posts.filter((p) => p.slug !== featured?.slug)

  return (
    <MonoPage>
      {/* Hero */}
      <section className="px-5 pt-24 pb-16 text-center md:pt-32 md:pb-20">
        <Reveal>
          <Eyebrow>Blog</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h1
            className="mx-auto mt-6 max-w-4xl text-[clamp(2.4rem,6vw,4.5rem)] font-medium leading-[1.05]"
            style={{ letterSpacing: '-0.025em' }}
          >
            Ponekad nešto napišemo.
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mx-auto mt-6 max-w-xl text-lg md:text-xl" style={{ color: MUTED }}>
            Misli o webu, dizajnu i videu. Kad nam dođe inspiracija.
          </p>
        </Reveal>
      </section>

      {/* Featured post */}
      {featured && (
        <section className="mx-auto max-w-[1200px] px-5 pb-16 md:pb-20">
          <Reveal>
            <Link href={`/blog/${featured.slug}`} className="group block">
              <article
                className="grid gap-8 rounded-[28px] p-6 md:grid-cols-[1fr_1.15fr] md:p-10"
                style={{ background: PANEL, border: '1px solid rgba(255,255,255,0.09)' }}
              >
                <div className="flex flex-col">
                  <div className="flex flex-wrap items-center gap-2">
                    <Pill>{featured.category}</Pill>
                    <Pill>{featured.readTime}</Pill>
                  </div>
                  <div className="mt-10 md:mt-auto">
                    <h2 className="max-w-md text-[1.7rem] font-medium leading-tight md:text-[2.1rem]" style={{ letterSpacing: '-0.02em' }}>
                      {featured.title}
                    </h2>
                    <p className="mt-4 max-w-md leading-relaxed" style={{ color: MUTED }}>
                      {featured.excerpt}
                    </p>
                    <p className="mt-5 text-sm" style={{ color: MUTED }}>
                      {featured.author?.name} · {formatDate(featured.publishedAt)}
                    </p>
                  </div>
                </div>
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src={featured.heroImage || featured.thumbnail}
                    alt={featured.title}
                    className="block h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    style={{ aspectRatio: '16/10' }}
                  />
                </div>
              </article>
            </Link>
          </Reveal>
        </section>
      )}

      {/* Post grid */}
      <section className="mx-auto max-w-[1200px] px-5 pb-24 md:pb-32">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 0.05}>
              <Link
                href={`/blog/${p.slug}`}
                className="nf-card flex h-full flex-col rounded-[24px] p-3 pb-6"
                style={{ background: PANEL, border: `1px solid ${LINE}` }}
              >
                <div
                  className="nf-viswrap mb-5 overflow-hidden rounded-2xl"
                  style={{ background: '#111110', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    className="nf-vis block w-full object-cover"
                    style={{ aspectRatio: '16/10' }}
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-1 flex-col px-4">
                  <p className="text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>
                    {p.category} · {p.readTime}
                  </p>
                  <h3 className="mt-3 text-lg font-medium leading-snug">{p.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed" style={{ color: MUTED }}>
                    {p.excerpt.length > 120 ? p.excerpt.slice(0, 117) + '...' : p.excerpt}
                  </p>
                  <p className="mt-auto pt-4 text-sm transition-colors group-hover:text-white" style={{ color: BODY }}>
                    Pročitaj →
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <MonoCTA />
    </MonoPage>
  )
}
