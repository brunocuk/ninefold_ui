'use client'

// About page in the Mono design language.
// Structure follows the inity about page: hero, photo + stat bento,
// logo wall, story, values, process, team, CTA.

import { useEffect, useRef } from 'react'
import {
  PANEL, FG, BODY, MUTED, LINE, SIGNAL, MONO,
  Reveal, Eyebrow, MonoPage, MonoCTA, MonoTestimonials, MonoFAQ,
  TEAM, CLIENT_LOGOS,
} from '@/components/mono/kit'

const ABOUT_FAQS = [
  { q: 'Tko stoji iza Ninefolda?', a: 'Bruno Čukić i Petar Zirdum. Bruno radi web, Petar video i fotografiju. Sve što Ninefold isporuči prošlo je kroz ruke jednog od nas dvojice.' },
  { q: 'Koliko vas je?', a: 'Dvojica. To nije faza, to je odluka. Mali tim znači da pričaš s ljudima koji rade tvoj projekt, a ne s posrednicima.' },
  { q: 'Gdje ste locirani?', a: 'U Zagrebu. Studio i oprema su nam tu, a radimo s klijentima po cijeloj Hrvatskoj.' },
  { q: 'S kim tipično radite?', a: 'Mali i srednji biznisi koji žele ozbiljan web, video ili brend: saloni, sportski klubovi, restorani, građevinske firme, portali. Pogledaj radove, to je najbolji odgovor.' },
  { q: 'Radite li s klijentima izvan Zagreba?', a: 'Da. Web ionako radimo na daljinu, a za snimanja dođemo s opremom. Jadran ili Slavonija, svejedno.' },
  { q: 'Od kada postojite?', a: 'Od 2019. Sedam godina, 50+ projekata i hrpa naučenih lekcija.' },
]

// Big statement with scroll-driven word highlight, inity mission style.
const STATEMENT = 'Nismo najveća agencija u Zagrebu. Nismo ni najjeftiniji. Ali kad ti treba netko na koga se možeš osloniti, tu smo.'

function MissionStatement() {
  const rootRef = useRef(null)
  const wordsRef = useRef([])
  const words = STATEMENT.split(' ')

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      wordsRef.current.forEach((w) => { if (w) w.style.color = FG })
      return
    }
    let raf
    const tick = () => {
      const el = rootRef.current
      if (el) {
        const r = el.getBoundingClientRect()
        const vh = window.innerHeight
        const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.55)))
        const n = Math.floor(p * wordsRef.current.length)
        wordsRef.current.forEach((w, i) => {
          if (w) w.style.color = i < n ? FG : 'rgba(255,255,255,0.22)'
        })
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section className="mx-auto max-w-4xl px-5 pb-24 md:pb-32">
      <p
        ref={rootRef}
        className="text-center text-2xl font-medium leading-snug md:text-[2.4rem]"
        style={{ letterSpacing: '-0.02em' }}
      >
        {words.map((w, i) => (
          <span
            key={i}
            ref={(el) => { wordsRef.current[i] = el }}
            style={{ color: 'rgba(255,255,255,0.22)', transition: 'color .25s ease' }}
          >
            {w}{' '}
          </span>
        ))}
      </p>
    </section>
  )
}

// Bento cells: real photos and clips from our shoots plus stat cards.
// No stock, no AI. span = tailwind grid span classes on md+.
const BENTO = [
  { type: 'video', src: '/videos/about/studio-petar.mp4', span: 'md:col-span-1 md:row-span-2 row-span-2' },
  { type: 'photo', src: '/images/about/studio-shoot.webp', alt: 'Snimanje u studiju', span: 'col-span-2 md:col-span-2 md:row-span-2 row-span-2' },
  { type: 'photo', src: '/images/about/gimbal.webp', alt: 'Petar priprema gimbal', span: 'md:col-span-1 md:row-span-2 row-span-2' },
  { type: 'stat', value: '50+', label: 'isporučenih projekata', span: '' },
  { type: 'video', src: '/videos/about/pauza.mp4', span: 'md:col-span-1 md:row-span-2 row-span-2' },
  { type: 'photo', src: '/images/about/ured.webp', alt: 'U uredu', span: 'md:col-span-1 md:row-span-2 row-span-2' },
  { type: 'stat', value: '2019', label: 'godina osnivanja', span: '' },
  { type: 'photo', src: '/images/about/teren.webp', alt: 'Snimanje na terenu', span: '' },
  { type: 'stat', value: '99/100', label: 'prosječna ocjena klijenata', span: '' },
]

const VALUES = [
  { visual: 'offer', title: 'Radimo, ne prodajemo', note: 'Nećemo ti pričati o sinergijama i leverageu. Reći ćemo ti što možemo napraviti, koliko košta, i kad će biti gotovo.' },
  { visual: 'honest', title: 'Direktni smo', note: 'Ako nešto nema smisla, reći ćemo ti. Ako imamo bolju ideju, predložit ćemo. Nismo tu da klimamo glavom na sve.' },
  { visual: 'calendar', title: 'S nama je jednostavno', note: 'Bez formalnosti, bez nepotrebnih meetinga. Čuješ se s nama kad treba, dobiješ što je dogovoreno, i to je to.' },
  { visual: 'call', title: 'Tu smo kad treba', note: 'Nema čekanja tjedan dana na odgovor. Pišeš, javimo se. Zoveš, dignemo. Bez ghostanja nakon što potpišeš ugovor.' },
]

// ----- Value card illustrations (pure CSS, same language as homepage why-us) -----

function OfferVisual() {
  const rows = [
    ['ŠTO', 'Web + CMS'],
    ['KOLIKO', '4.200 €'],
    ['KAD', '6 tjedana'],
    ['SINERGIJE', '·'],
  ]
  return (
    <div className="flex h-full items-center justify-center px-6">
      <div className="w-full max-w-[280px] rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${LINE}` }}>
        {rows.map(([label, value], i) => (
          <div
            key={label}
            className="flex items-center justify-between py-2"
            style={{ borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
          >
            <span className="text-[10px]" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>{label}</span>
            <span className="text-sm" style={{ color: i === rows.length - 1 ? MUTED : FG }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function HonestVisual() {
  return (
    <div className="flex h-full items-center justify-center px-6">
      <div className="flex max-w-[300px] items-start gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
          style={{ background: '#1A1A19', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <img src="/ninefold-icon.svg" alt="" width="16" height="16" />
        </span>
        <div className="rounded-2xl rounded-tl-md px-4 py-3 text-sm leading-relaxed" style={{ background: 'rgba(255,255,255,0.07)', border: `1px solid ${LINE}`, color: BODY }}>
          Iskreno? Ova ideja neće upaliti. Imamo bolju, evo je u petak.
          <span className="mt-1.5 block text-[10px]" style={{ color: MUTED }}>Ninefold · bez uvijanja</span>
        </div>
      </div>
    </div>
  )
}

function CalendarVisual() {
  const days = ['PON', 'UTO', 'SRI', 'ČET', 'PET']
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6">
      <div className="grid w-full max-w-[300px] grid-cols-5 gap-1.5">
        {days.map((d) => (
          <div key={d} className="flex flex-col gap-1.5">
            <p className="text-center text-[9px]" style={{ fontFamily: MONO, letterSpacing: '0.1em', color: MUTED }}>{d}</p>
            <div
              className="flex h-16 flex-col items-stretch justify-start gap-1 rounded-lg p-1"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              {d === 'SRI' && (
                <span className="flex items-center justify-center gap-1 rounded px-1 py-1 text-[8px]" style={{ background: 'rgba(0,255,148,0.12)', color: '#9AF5CC' }}>
                  Poziv
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.16em', color: MUTED }}>
        Jedini sastanak ovaj tjedan
      </p>
    </div>
  )
}

function CallVisual() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <img src="/images/team/1.webp" alt="" className="h-12 w-12 rounded-full object-cover" style={{ objectPosition: 'center 25%' }} />
      <div className="text-center">
        <p className="text-sm font-medium" style={{ color: FG }}>Bruno · Ninefold</p>
        <p className="mt-1 text-[10px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.16em', color: MUTED }}>
          Dolazni poziv · 21:58
        </p>
      </div>
      <div className="mt-1 flex items-center gap-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full text-sm" style={{ background: 'rgba(255,255,255,0.08)', color: MUTED }}>
          ✕
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full text-sm" style={{ background: 'rgba(0,255,148,0.25)', color: '#9AF5CC' }}>
          ✓
        </span>
      </div>
    </div>
  )
}

const VALUE_VISUALS = { offer: <OfferVisual />, honest: <HonestVisual />, calendar: <CalendarVisual />, call: <CallVisual /> }

const PROCESS = [
  { step: '01', title: 'Razgovor', note: '30 minuta poziva. Prođemo ideju, budžet i rokove.', chips: ['30 minuta', 'Bez obveza'] },
  { step: '02', title: 'Ponuda', note: 'U par dana dobiješ konkretnu ponudu. Bez skrivenih stavki.', chips: ['Fiksna cijena', 'Jasan opseg'] },
  { step: '03', title: 'Izrada', note: 'Radimo, ti pratiš. Bez posrednika i bez tišine.', chips: ['Direktan kontakt', 'Redoviti update'] },
  { step: '04', title: 'Lansiranje', note: 'Testiramo, lansiramo i ne nestajemo nakon toga.', chips: ['Testiranje', 'Održavanje'] },
]

export default function AboutMono() {
  return (
    <MonoPage>
      {/* Hero */}
      <section className="px-5 pt-24 pb-16 text-center md:pt-32">
        <Reveal>
          <Eyebrow>O nama</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h1
            className="mx-auto mt-6 max-w-4xl text-[clamp(2.4rem,6vw,4.5rem)] font-medium leading-[1.05]"
            style={{ letterSpacing: '-0.025em' }}
          >
            Nas dvojica iz Zagreba.
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl" style={{ color: MUTED }}>
            Bruno radi web. Petar snima i fotografira. Nema account managera,
            nema juniora, nema "tima koji će se javiti". Samo nas dvojica i posao koji radimo.
          </p>
        </Reveal>
      </section>

      {/* Photo + stat bento */}
      <section className="mx-auto max-w-[1200px] px-5 pb-24 md:pb-32">
        <Reveal>
          <div
            className="grid grid-flow-dense grid-cols-2 auto-rows-[130px] gap-3 rounded-[28px] p-3 md:grid-cols-4 md:auto-rows-[175px] md:gap-4 md:p-4"
            style={{ background: PANEL, border: `1px solid ${LINE}` }}
          >
            {BENTO.map((cell, i) => {
              if (cell.type === 'photo') {
                return (
                  <div key={i} className={`overflow-hidden rounded-2xl ${cell.span}`}>
                    <img src={cell.src} alt={cell.alt} className="block h-full w-full object-cover" loading="lazy" />
                  </div>
                )
              }
              if (cell.type === 'video') {
                return (
                  <div key={i} className={`overflow-hidden rounded-2xl ${cell.span}`}>
                    <video
                      src={cell.src}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      className="block h-full w-full object-cover"
                    />
                  </div>
                )
              }
              return (
                <div
                  key={i}
                  className={`flex flex-col items-start justify-end rounded-2xl p-5 ${cell.span}`}
                  style={{ background: '#111110', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <p className="text-3xl font-medium md:text-4xl" style={{ letterSpacing: '-0.02em' }}>{cell.value}</p>
                  <p className="mt-2 text-sm" style={{ color: MUTED }}>{cell.label}</p>
                </div>
              )
            })}
          </div>
        </Reveal>
      </section>

      {/* Logo wall */}
      <section className="mx-auto max-w-[1200px] px-5 pb-24 md:pb-32">
        <Reveal>
          <p className="text-center text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>
            Vjeruje nam 50+ klijenata u Hrvatskoj
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
            {CLIENT_LOGOS.map((c) => (
              <img
                key={c.name}
                src={c.src}
                alt={c.name}
                title={c.name}
                className="h-7 w-auto transition-opacity hover:opacity-90 md:h-8"
                style={{ filter: 'brightness(0) invert(1)', opacity: 0.45 }}
              />
            ))}
          </div>
        </Reveal>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-[1200px] px-5 pb-24 md:pb-32">
        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <Reveal>
            <Eyebrow>Priča</Eyebrow>
            <h2 className="mt-3 text-3xl font-medium md:text-5xl" style={{ letterSpacing: '-0.02em' }}>
              Kako smo počeli.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col gap-6 text-lg leading-relaxed md:text-xl" style={{ color: BODY }}>
              <p>
                Ninefold postoji od 2019. Nismo imali veliki plan. Htjeli smo raditi
                dobre stvari za ljude koji cijene dobar rad.
              </p>
              <p>
                Sedam godina kasnije, i dalje isto. Nemamo filozofiju o "craftu" niti
                manifeste o dizajnu. Samo radimo, gledamo što ispadne, i obično ispadne dobro.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission statement */}
      <MissionStatement />

      {/* Values */}
      <section className="mx-auto max-w-[1200px] px-5 pb-24 md:pb-32">
        <Reveal>
          <Eyebrow>Kako razmišljamo</Eyebrow>
          <h2 className="mt-3 mb-12 text-3xl font-medium md:text-5xl" style={{ letterSpacing: '-0.02em' }}>
            Četiri stvari koje držimo.
          </h2>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={(i % 2) * 0.06}>
              <div
                className="nf-card flex h-full flex-col rounded-[28px] p-3 pb-7"
                style={{ background: PANEL, border: `1px solid ${LINE}` }}
              >
                <div
                  className="nf-viswrap mb-6 h-[230px] overflow-hidden rounded-3xl"
                  style={{ background: '#111110', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <div className="nf-vis h-full">{VALUE_VISUALS[v.visual]}</div>
                </div>
                <div className="px-5">
                  <h3 className="text-xl font-medium" style={{ letterSpacing: '-0.01em' }}>{v.title}</h3>
                  <p className="mt-3 leading-relaxed" style={{ color: MUTED }}>{v.note}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="mx-auto max-w-[1200px] px-5 pb-24 md:pb-32">
        <Reveal>
          <Eyebrow>Kako radimo</Eyebrow>
          <h2 className="mt-3 mb-12 text-3xl font-medium md:text-5xl" style={{ letterSpacing: '-0.02em' }}>
            Od poziva do lansiranja.
          </h2>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-4">
          {PROCESS.map((p, i) => (
            <Reveal key={p.step} delay={i * 0.06}>
              <div
                className="flex h-full flex-col rounded-[24px] p-6"
                style={{ background: PANEL, border: `1px solid ${LINE}` }}
              >
                <p className="text-[11px]" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>{p.step}</p>
                <h3 className="mt-4 text-lg font-medium">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: MUTED }}>{p.note}</p>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
                  {p.chips.map((chip) => (
                    <span
                      key={chip}
                      className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px]"
                      style={{ border: `1px solid ${LINE}`, color: BODY }}
                    >
                      <span className="inline-block h-1 w-1 rounded-full" style={{ background: SIGNAL }} />
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-[1200px] px-5 pb-24 md:pb-32">
        <Reveal>
          <Eyebrow>Ekipa</Eyebrow>
          <h2 className="mt-3 text-3xl font-medium md:text-5xl" style={{ letterSpacing: '-0.02em' }}>
            Bruno i Petar.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.06}>
              <div className="overflow-hidden rounded-[28px]" style={{ background: PANEL, border: `1px solid ${LINE}` }}>
                <div className="overflow-hidden" style={{ aspectRatio: '4/3' }}>
                  <img src={m.photo} alt={m.name} className="block h-full w-full object-cover" style={{ objectPosition: 'center 25%' }} />
                </div>
                <div className="p-6 md:p-7">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-baseline gap-3">
                      <h3 className="text-xl font-medium">{m.name}</h3>
                      <p className="text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>
                        {m.role}
                      </p>
                    </div>
                    {m.linkedin && (
                      <a
                        href={m.linkedin}
                        aria-label={`${m.name} na LinkedInu`}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors hover:text-white"
                        style={{ border: `1px solid ${LINE}`, color: MUTED }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4v15.5h-4V8zm7.5 0h3.8v2.2h.05c.53-1 1.83-2.2 3.77-2.2 4.03 0 4.78 2.65 4.78 6.1v9.4h-4V15c0-2.03-.04-4.64-2.83-4.64-2.83 0-3.27 2.2-3.27 4.48v8.66h-4V8z" /></svg>
                      </a>
                    )}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: MUTED }}>{m.bio}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <MonoTestimonials />

      <MonoFAQ items={ABOUT_FAQS} title="Pitanja o nama" />

      <MonoCTA />
    </MonoPage>
  )
}
