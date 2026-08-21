'use client'

// Blog post page in the Mono design language.
// Renders the block-based content from content/blog.js.

import Link from 'next/link'
import {
  PANEL, FG, BODY, MUTED, LINE, SIGNAL, MONO,
  Reveal, Eyebrow, Pill, MonoPage, MonoCTA,
} from '@/components/mono/kit'

function formatDate(iso) {
  const d = new Date(iso)
  return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}.`
}

const CALLOUT_LABELS = { tip: 'Savjet', info: 'Info', warning: 'Pažnja' }

function Block({ block }) {
  if (block.type === 'heading') {
    const Tag = block.level === 3 ? 'h3' : 'h2'
    return (
      <Tag
        className={block.level === 3 ? 'mt-10 text-xl font-medium' : 'mt-12 text-2xl font-medium md:text-3xl'}
        style={{ letterSpacing: '-0.015em', color: FG }}
      >
        {block.content}
      </Tag>
    )
  }
  if (block.type === 'text') {
    return (
      <p className="mt-5 text-lg leading-relaxed" style={{ color: BODY }}>
        {block.content}
      </p>
    )
  }
  if (block.type === 'callout') {
    return (
      <div
        className="mt-8 rounded-2xl p-6"
        style={{ background: PANEL, border: `1px solid ${LINE}` }}
      >
        <p className="flex items-center gap-2 text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>
          <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: SIGNAL }} />
          {CALLOUT_LABELS[block.style] || 'Info'}
        </p>
        <p className="mt-3 leading-relaxed" style={{ color: BODY }}>
          {block.content}
        </p>
      </div>
    )
  }
  if (block.type === 'list') {
    const Tag = block.ordered ? 'ol' : 'ul'
    return (
      <Tag className="mt-5 flex flex-col gap-2.5">
        {block.items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-lg leading-relaxed" style={{ color: BODY }}>
            {block.ordered ? (
              <span className="mt-0.5 shrink-0 text-sm" style={{ fontFamily: MONO, color: MUTED }}>
                {String(i + 1).padStart(2, '0')}
              </span>
            ) : (
              <span className="mt-3 h-1 w-1 shrink-0 rounded-full" style={{ background: MUTED }} />
            )}
            {item}
          </li>
        ))}
      </Tag>
    )
  }
  return null
}

export default function BlogPostMono({ post, related }) {
  return (
    <MonoPage>
      {/* Header */}
      <section className="mx-auto max-w-3xl px-5 pt-24 md:pt-28">
        <Reveal>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm transition-colors hover:text-white"
            style={{ color: MUTED }}
          >
            ← Natrag na blog
          </Link>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-10 flex flex-wrap items-center gap-2">
            <Pill>{post.category}</Pill>
            <Pill>{post.readTime}</Pill>
            <Pill>{formatDate(post.publishedAt)}</Pill>
          </div>
          <h1
            className="mt-6 text-[clamp(2rem,4.5vw,3.2rem)] font-medium leading-[1.1]"
            style={{ letterSpacing: '-0.025em' }}
          >
            {post.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed" style={{ color: MUTED }}>
            {post.excerpt}
          </p>

          {post.author && (
            <div className="mt-7 flex items-center gap-3">
              {post.author.avatar && (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="h-9 w-9 rounded-full object-cover"
                />
              )}
              <div>
                <p className="text-sm font-medium">{post.author.name}</p>
                <p className="text-xs" style={{ color: MUTED }}>{post.author.role}</p>
              </div>
            </div>
          )}
        </Reveal>
      </section>

      {/* Hero image, natural ratio, no crop */}
      {post.heroImage && (
        <section className="mx-auto max-w-[1000px] px-5 pt-12">
          <Reveal>
            <div className="overflow-hidden rounded-[28px]" style={{ border: `1px solid ${LINE}` }}>
              <img src={post.heroImage} alt={post.title} className="block h-auto w-full" />
            </div>
          </Reveal>
        </section>
      )}

      {/* Content */}
      <section className="mx-auto max-w-3xl px-5 pb-24 pt-12 md:pb-32">
        <Reveal>
          <article>
            {(post.content || []).map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </article>
        </Reveal>

        {(post.tags || []).length > 0 && (
          <div className="mt-14 flex flex-wrap gap-2 border-t pt-8" style={{ borderColor: LINE }}>
            {post.tags.map((t) => (
              <Pill key={t}>{t}</Pill>
            ))}
          </div>
        )}
      </section>

      {/* Related */}
      {(related || []).length > 0 && (
        <section className="mx-auto max-w-[1200px] px-5 pb-24 md:pb-32">
          <Reveal>
            <Eyebrow>Još s bloga</Eyebrow>
            <h2 className="mt-3 mb-10 text-3xl font-medium md:text-4xl" style={{ letterSpacing: '-0.02em' }}>
              Možda te zanima.
            </h2>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((p, i) => (
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

      <MonoCTA />
    </MonoPage>
  )
}
