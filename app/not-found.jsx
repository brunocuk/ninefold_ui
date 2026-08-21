'use client'

// 404 in the Mono design language.

import Link from 'next/link'
import {
  BG, FG, MUTED, LINE, SIGNAL, MONO,
  Reveal, MonoPage, CalButton,
} from '@/components/mono/kit'

export default function NotFound() {
  return (
    <MonoPage>
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-5 py-24 text-center">
        <Reveal>
          <span
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs"
            style={{ border: `1px solid ${LINE}`, color: MUTED, fontFamily: MONO, letterSpacing: '0.06em' }}
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: SIGNAL }} />
            GREŠKA · 404
          </span>
        </Reveal>

        <Reveal delay={0.08}>
          <h1
            className="mt-8 max-w-3xl text-[clamp(2.4rem,6vw,4.5rem)] font-medium leading-[1.05]"
            style={{ letterSpacing: '-0.025em' }}
          >
            Ova stranica ne postoji.
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mx-auto mt-6 max-w-md text-lg" style={{ color: MUTED }}>
            Ili je nikad nije bilo, ili smo je preselili.
            Svejedno, evo ti izlaz.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="rounded-full px-6 py-3 text-sm font-medium transition-transform hover:scale-[1.03]"
              style={{ background: FG, color: BG }}
            >
              Na naslovnicu
            </Link>
            <Link
              href="/work"
              className="rounded-full px-6 py-3 text-sm transition-colors hover:text-white"
              style={{ border: `1px solid ${LINE}`, color: MUTED }}
            >
              Pogledaj radove
            </Link>
            <CalButton label="Čujemo se" size={15} />
          </div>
        </Reveal>
      </section>
    </MonoPage>
  )
}
