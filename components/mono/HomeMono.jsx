'use client'

// Homepage in the Mono design language (grew out of concept 6, "Mono").
// Neutral near-black, text is never pure white. The work carries the color.
// Hero band = infinite marquee (add images to SLIDER below).
// Case cards = inity-style: pills top-left, client center, big title bottom,
// large screenshot right - and they STACK on scroll (position: sticky).
// Signature: the logo's 45° fold cut into image panels.
// Font switcher (bottom-right) - round 2 of candidates.

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  BG, PANEL, FG, BODY, MUTED, LINE, SIGNAL, MONO,
  MeetIcon, Reveal, Eyebrow, Pill, MonoPage, MonoCTA,
  MonoTestimonials, MonoFAQ, useScrollStack, useCalPopup, TEAM, CLIENT_LOGOS, SERVICE_FAQS,
} from '@/components/mono/kit'
import { SERVICE_VISUALS } from '@/components/mono/serviceVisuals'
import { SERVICES } from '@/components/mono/serviceData'


// ----- HERO MARQUEE -----
// Dodaj nove slike ovdje (public/images/slider/ ili puni URL).
// narrow: true = uspravna (mobilna) slika.
const SLIDER = [
  { src: '/images/slider/studioone-web.webp', alt: 'Studio One by Nina · web' },
  { src: '/images/slider/theofficecompany-admin.webp', alt: 'The Office Company · admin' },
  { src: '/images/slider/matermag-web.webp', alt: 'MaterMag · web' },
  { src: '/images/slider/lagym-admin-dashboard.webp', alt: 'LA Gym · dashboard' },
  { src: '/images/slider/pizzeria14-web.webp', alt: 'Pizzeria 14 · web' },
  { src: '/images/slider/brendia-learning-platform.webp', alt: 'Brendia · platforma za učenje' },
  { src: '/images/slider/elitprojekt-web.webp', alt: 'Elit Projekt · web' },
  { src: '/images/slider/matermag-cms.webp', alt: 'MaterMag · custom CMS' },
  { src: '/images/slider/theofficecompany-web.webp', alt: 'The Office Company · web' },
]

const CASES = [
  {
    slug: 'studio-one-by-nina',
    client: 'Studio One by Nina',
    title: 'Dizajn i izrada weba za Studio One',
    tagline: 'Moderni frizerski salon u Zagrebu. Dizajn koji prati brend: toplo, precizno, bez viška.',
    type: 'Web',
    industry: 'Beauty',
    image: '/images/project/studioone/hero-desktop.jpg',
  },
  {
    slug: 'adriatic-padel-klub',
    client: 'Adriatic Padel Klub',
    title: 'Dizajn i izrada weba za Adriatic Padel',
    tagline: 'Premium padel na obali Jadrana. Rezervacije, tereni i klupski život na jednom mjestu.',
    type: 'Web',
    industry: 'Sport',
    image: 'https://pphvvkeajoonusbgrajd.supabase.co/storage/v1/object/public/portfolio/adriatic-padel-klub/1785309294660-adriaticpadelklub.webp',
  },
  {
    slug: 'matermag-digital-magazine',
    client: 'MaterMag',
    title: 'Custom CMS i portal za MaterMag',
    tagline: 'Lifestyle portal za moderne roditelje. Arhitektura sadržaja koja diše i CMS koji ne smeta.',
    type: 'Web',
    industry: 'Magazin',
    image: 'https://pphvvkeajoonusbgrajd.supabase.co/storage/v1/object/public/portfolio/matermag-digital-magazine/1785306621255-matermag.webp',
  },
]

const TOOLS = ['Next.js', 'React', 'Supabase', 'Tailwind', 'Vercel', 'Figma', 'Premiere Pro', 'DaVinci Resolve', 'After Effects', 'WordPress']

const WHY = [
  { visual: 'chat', title: 'Pričaš s nama, ne s accountom', note: 'Nema middlemana. Nema ljudi koji ti prodaju nešto što netko drugi mora napraviti. Pričaš direktno s ekipom koja radi tvoj projekt.' },
  { visual: 'hub', title: 'Sve pod jednim krovom', note: 'Web, video, foto i branding. Ne trebaš tri agencije i ne moraš svakoj ispočetka prepričavati istu priču.' },
  { visual: 'ping', title: 'Tu smo kad treba', note: 'Nema čekanja tjedan dana na odgovor. Pišeš, javimo se. Zoveš, dignemo. Bez ghostanja nakon što potpišeš ugovor.' },
  { visual: 'trust', title: 'Najbolje ispadne kad nam vjeruješ', note: 'Kad nas klijenti puste da radimo, rezultati su najbolji. Zato i kažemo: daj nam povjerenje, mi ćemo dati sve od sebe.' },
]

const BLOG = [
  { slug: 'koliko-kosta-izrada-web-stranice', category: 'Web', title: 'Koliko košta izrada web stranice u Hrvatskoj?', excerpt: 'Konkretni rasponi cijena za 2026., što ih diže, koji su skriveni troškovi i kako ne preplatiti.' },
  { slug: 'zasto-web-stranica-ne-dovodi-klijente', category: 'Web', title: 'Zašto tvoja web stranica ne dovodi klijente (7 razloga)', excerpt: 'U 90% slučajeva problem je jedan od ovih sedam, i većinu možeš provjeriti sam u pet minuta.' },
  { slug: 'lokalni-seo-vodic', category: 'SEO', title: 'Lokalni SEO: kako izaći prvi na Googleu u svom gradu', excerpt: 'Kad netko utipka \'frizer Zagreb\', Google odluči tko dobiva posao. Evo kako da to budeš ti.' },
]

// ----- Why-us card illustrations (pure CSS mini-mockups, inity style) -----

function ChatVisual() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 px-5 md:px-7">
      <div className="flex max-w-[85%] items-end gap-2.5 self-start">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium" style={{ background: 'rgba(255,255,255,0.08)', color: BODY }}>
          K
        </span>
        <div className="rounded-2xl rounded-bl-md px-4 py-2.5 text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${LINE}`, color: BODY }}>
          Može li se dodati online plaćanje?
          <span className="mt-1 block text-[10px]" style={{ color: MUTED }}>Klijent · 14:02</span>
        </div>
      </div>
      <div className="flex max-w-[85%] flex-row-reverse items-end gap-2.5 self-end">
        <img src="/images/team/1.webp" alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" style={{ objectPosition: 'center 25%' }} />
        <div className="rounded-2xl rounded-br-md px-4 py-2.5 text-sm" style={{ background: 'rgba(255,255,255,0.09)', border: `1px solid ${LINE}`, color: FG }}>
          Može. Prijedlog ti šaljem do večeras.
          <span className="mt-1 block text-[10px]" style={{ color: MUTED }}>Bruno · 14:05</span>
        </div>
      </div>
    </div>
  )
}

function HubVisual() {
  const chips = [
    ['Web', '12%', '16%'],
    ['Video', '66%', '13%'],
    ['Foto', '14%', '68%'],
    ['Brand', '64%', '70%'],
  ]
  return (
    <div className="relative h-full overflow-hidden">
      <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ border: `1px solid rgba(255,255,255,0.06)` }} />
      <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ border: `1px solid rgba(255,255,255,0.04)` }} />
      <div
        className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl"
        style={{ background: '#1A1A19', border: `1px solid rgba(255,255,255,0.1)` }}
      >
        <img src="/ninefold-icon.svg" alt="" width="26" height="26" />
      </div>
      {chips.map(([label, left, top]) => (
        <span
          key={label}
          className="absolute rounded-full px-3.5 py-1.5 text-xs"
          style={{ left, top, background: '#161615', border: `1px solid ${LINE}`, color: BODY }}
        >
          {label}
        </span>
      ))}
    </div>
  )
}

function PingVisual() {
  return (
    <div className="flex h-full flex-col justify-center gap-2.5 px-5 md:px-8">
      <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${LINE}` }}>
        <span className="text-sm" style={{ color: BODY }}>Stranica nam je pala 😩</span>
        <span className="text-[11px]" style={{ fontFamily: MONO, color: MUTED }}>21:47</span>
      </div>
      <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.09)', border: `1px solid ${LINE}` }}>
        <span className="flex items-center gap-2 text-sm" style={{ color: FG }}>
          <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: SIGNAL }} />
          Vidimo. Rješavamo.
        </span>
        <span className="text-[11px]" style={{ fontFamily: MONO, color: MUTED }}>21:52</span>
      </div>
      <p className="mt-2 self-center text-[10px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.16em', color: MUTED }}>
        Odgovor u 5 minuta
      </p>
    </div>
  )
}

function TrustVisual() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 px-5 md:px-10">
      <div className="flex items-center justify-between rounded-xl px-4 py-3.5" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${LINE}` }}>
        <span className="text-sm" style={{ color: MUTED }}>Mikromenadžment</span>
        <span className="relative h-6 w-11 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full" style={{ background: 'rgba(255,255,255,0.35)' }} />
        </span>
      </div>
      <div className="flex items-center justify-between rounded-xl px-4 py-3.5" style={{ background: 'rgba(255,255,255,0.07)', border: `1px solid ${LINE}` }}>
        <span className="text-sm" style={{ color: FG }}>Povjerenje</span>
        <span className="relative h-6 w-11 rounded-full" style={{ background: 'rgba(0,255,148,0.35)' }}>
          <span className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full" style={{ background: FG }} />
        </span>
      </div>
    </div>
  )
}

const WHY_VISUALS = { chat: <ChatVisual />, hub: <HubVisual />, ping: <PingVisual />, trust: <TrustVisual /> }


export default function HomeMono() {
  return (
    <MonoPage>
      <HomeContent />
    </MonoPage>
  )
}

function HomeContent() {
  const openCal = useCalPopup()
  const stackRef = useRef(null)


  useScrollStack(stackRef)

  return (
    <>

        {/* ----- Hero ----- */}
        <section className="px-5 pt-24 pb-16 md:pt-32 md:pb-20 text-center">
          <Reveal>
            <span
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs"
              style={{ border: `1px solid ${LINE}`, color: MUTED, fontFamily: MONO, letterSpacing: '0.06em' }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: SIGNAL }} />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: SIGNAL }} />
              </span>
              PRIMAMO PROJEKTE · Q4 2026
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1
              className="mx-auto mt-8 max-w-4xl text-[clamp(2.6rem,7vw,5rem)] font-medium leading-[1.04]"
              style={{ letterSpacing: '-0.025em' }}
            >
              Još jedna agencija
              <br />
              iz Zagreba.
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mx-auto mt-6 max-w-xl text-lg md:text-xl" style={{ color: MUTED }}>
              Ali ova ti neće slati newsletter svaki tjedan.
              <br />
              Radimo web, video i fotografiju. I to je to.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-9 flex items-center justify-center gap-3">
              <button
                onClick={openCal}
                className="flex items-center gap-2 rounded-full pl-5 pr-6 py-3 text-sm font-medium transition-transform hover:scale-[1.03]"
                style={{ background: FG, color: BG }}
              >
                <MeetIcon size={16} />
                Čujemo se
              </button>
              <a
                href="#radovi"
                className="rounded-full px-6 py-3 text-sm transition-colors hover:text-white"
                style={{ border: `1px solid ${LINE}`, color: MUTED }}
              >
                Pogledaj radove
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.32}>
            <div
              className="mx-auto mt-12 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[13px]"
              style={{ color: MUTED }}
            >
              <span>50+ isporučenih projekata</span>
              <span className="hidden md:inline" style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
              <span>Odgovor unutar 24 sata</span>
              <span className="hidden md:inline" style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
              <span>Ocjena klijenata 4.9/5</span>
            </div>
          </Reveal>
        </section>

        {/* ----- Infinite marquee (the work carries the color) ----- */}
        <section className="overflow-hidden pb-24 md:pb-32">
          <Reveal>
            <div className="nf-marquee flex w-max items-center gap-5 pr-5">
              {[...SLIDER, ...SLIDER].map((s, i) => (
                <div key={i} className="flex shrink-0 flex-col gap-3">
                  <div className="h-[340px] overflow-hidden rounded-2xl md:h-[520px]">
                    <img src={s.src} alt={s.alt} className="block h-full w-auto object-cover" />
                  </div>
                  <p className="pl-1 text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.12em', color: MUTED }}>
                    {s.alt}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 text-center text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>
              Pravi projekti, pravi screenshotovi. Ništa generirano.
            </p>
          </Reveal>
        </section>

        {/* ----- Client logo wall ----- */}
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

        {/* ----- Case cards - sticky stack ----- */}
        <section id="radovi" className="mx-auto max-w-[1200px] px-5 pb-24 md:pb-32">
          <Reveal>
            <div className="mb-12 flex items-end justify-between gap-6">
              <div>
                <Eyebrow>Radovi</Eyebrow>
                <h2 className="mt-3 text-3xl font-medium md:text-5xl" style={{ letterSpacing: '-0.02em' }}>
                  Što smo radili
                </h2>
              </div>
              <Link
                href="/work"
                className="hidden shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm transition-colors hover:text-white md:flex"
                style={{ border: `1px solid ${LINE}`, color: MUTED }}
              >
                Svi projekti →
              </Link>
            </div>
          </Reveal>

          <div ref={stackRef}>
            {CASES.map((c, i) => (
              <div key={c.slug} className="sticky mb-8 last:mb-0" style={{ top: 84 + i * 14 }}>
                <Link
                  href={`/work/${c.slug}`}
                  className="group block"
                  style={{ transformOrigin: 'center top', willChange: 'transform, filter' }}
                >
                  <article
                    className="grid gap-8 rounded-[28px] p-6 md:min-h-[72vh] md:grid-cols-[1fr_1.15fr] md:p-10"
                    style={{ background: PANEL, border: `1px solid rgba(255,255,255,0.09)`, boxShadow: '0 -18px 50px rgba(0,0,0,0.55)' }}
                  >
                    <div className="flex flex-col">
                      <div className="flex flex-wrap items-center gap-2">
                        <Pill>🇭🇷 Hrvatska</Pill>
                        <Pill>{c.industry}</Pill>
                      </div>

                      <p
                        className="mt-10 text-[11px] uppercase md:mt-0 md:pt-16"
                        style={{ fontFamily: MONO, letterSpacing: '0.16em', color: MUTED }}
                      >
                        {c.client}
                      </p>

                      <div className="mt-10 md:mt-auto">
                        <h3 className="max-w-md text-[1.7rem] font-medium leading-tight md:text-[2.2rem]" style={{ letterSpacing: '-0.02em' }}>
                          {c.title}
                        </h3>
                        <p className="mt-4 max-w-md leading-relaxed" style={{ color: MUTED }}>
                          {c.tagline}
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
                        src={c.image}
                        alt={c.client}
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

        {/* ----- Services ----- */}
        <section id="usluge" className="mx-auto max-w-[1200px] px-5 pb-24 md:pb-32">
          <Reveal>
            <Eyebrow>Usluge</Eyebrow>
            <h2 className="mt-3 mb-12 text-3xl font-medium md:text-5xl" style={{ letterSpacing: '-0.02em' }}>
              Što radimo
            </h2>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {SERVICES.map((s, i) => (
              <Reveal key={s.title} delay={(i % 3) * 0.05}>
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
                      <span className="nf-arrow mt-1 text-sm" style={{ color: MUTED }}>
                        ↗
                      </span>
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

        {/* ----- Tools row ----- */}
        <section className="mx-auto max-w-[1200px] px-5 pb-24 md:pb-32">
          <Reveal>
            <p className="text-center text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>
              Alati s kojima radimo
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
              {TOOLS.map((t) => (
                <span
                  key={t}
                  className="rounded-xl px-4 py-2.5 text-sm transition-colors hover:text-white"
                  style={{ border: `1px solid ${LINE}`, color: MUTED, background: PANEL }}
                >
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ----- Team ----- */}
        <section id="onama" className="mx-auto max-w-[1200px] px-5 pb-24 md:pb-32">
          <Reveal>
            <Eyebrow>Ekipa</Eyebrow>
            <h2 className="mt-3 text-3xl font-medium md:text-5xl" style={{ letterSpacing: '-0.02em' }}>
              Nas dvojica. To je cijela agencija.
            </h2>
            <p className="mt-4 max-w-xl text-lg" style={{ color: MUTED }}>
              Bez account managera, bez juniora na tvom projektu. Ono što vidiš, to i dobiješ.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {TEAM.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.06}>
                <div className="overflow-hidden rounded-[28px]" style={{ background: PANEL, border: `1px solid ${LINE}` }}>
                  <div className="overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    <img src={m.photo} alt={m.name} className="block h-full w-full object-cover" style={{ objectPosition: 'center 25%' }} />
                  </div>
                  <div className="p-6 md:p-7">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-xl font-medium">{m.name}</h3>
                      <p className="text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>
                        {m.role}
                      </p>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed" style={{ color: MUTED }}>
                      {m.bio}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ----- Why us ----- */}
        <section className="mx-auto max-w-[1200px] px-5 pb-24 md:pb-32">
          <Reveal>
            <Eyebrow>Zašto mi</Eyebrow>
            <h2 className="mt-3 mb-12 text-3xl font-medium md:text-5xl" style={{ letterSpacing: '-0.02em' }}>
              Zašto raditi s nama
            </h2>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2">
            {WHY.map((wItem, i) => (
              <Reveal key={wItem.title} delay={(i % 2) * 0.06}>
                <div
                  className="nf-card flex h-full flex-col rounded-[28px] p-3 pb-7"
                  style={{ background: PANEL, border: `1px solid ${LINE}` }}
                >
                  <div
                    className="nf-viswrap mb-6 h-[230px] overflow-hidden rounded-3xl"
                    style={{ background: '#111110', border: `1px solid rgba(255,255,255,0.05)` }}
                  >
                    <div className="nf-vis h-full">{WHY_VISUALS[wItem.visual]}</div>
                  </div>
                  <div className="px-5">
                    <h3 className="text-xl font-medium" style={{ letterSpacing: '-0.01em' }}>{wItem.title}</h3>
                    <p className="mt-3 leading-relaxed" style={{ color: MUTED }}>
                      {wItem.note}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <MonoTestimonials />

        {/* ----- Stats strip ----- */}
        <section className="mx-auto max-w-[1200px] px-5 pb-24 md:pb-32">
          <Reveal>
            <div
              className="grid grid-cols-2 gap-y-10 rounded-[28px] px-6 py-10 text-center md:grid-cols-4 md:py-12"
              style={{ border: `1px solid ${LINE}` }}
            >
              {[
                ['50+', 'isporučenih projekata'],
                ['98%', 'zadovoljstvo klijenata'],
                ['0.5s', 'prosječno učitavanje'],
                ['100%', 'isporuka na vrijeme'],
              ].map(([v, l]) => (
                <div key={l}>
                  <p className="text-3xl font-medium md:text-4xl" style={{ letterSpacing: '-0.02em' }}>{v}</p>
                  <p className="mt-2 text-sm" style={{ color: MUTED }}>{l}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ----- Blog ----- */}
        <section className="mx-auto max-w-[1200px] px-5 pb-24 md:pb-32">
          <Reveal>
            <div className="mb-12 flex items-end justify-between gap-6">
              <div>
                <Eyebrow>Blog</Eyebrow>
                <h2 className="mt-3 text-3xl font-medium md:text-5xl" style={{ letterSpacing: '-0.02em' }}>
                  Novo s bloga
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
            {BLOG.map((b, i) => (
              <Reveal key={b.slug} delay={(i % 3) * 0.05}>
                <Link
                  href={`/blog/${b.slug}`}
                  className="group flex h-full flex-col rounded-2xl p-6 transition-colors hover:border-white/20 md:p-7"
                  style={{ background: PANEL, border: `1px solid ${LINE}` }}
                >
                  <p className="text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>
                    {b.category}
                  </p>
                  <h3 className="mt-3 text-lg font-medium leading-snug">{b.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: MUTED }}>
                    {b.excerpt}
                  </p>
                  <p className="mt-auto pt-5 text-sm transition-colors group-hover:text-white" style={{ color: BODY }}>
                    Pročitaj →
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        <MonoFAQ items={SERVICE_FAQS} />

        <MonoCTA />

    </>
  )
}
