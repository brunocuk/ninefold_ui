'use client'

// Mono design kit: shared tokens, primitives, page shell (nav + footer),
// and the big CTA card. Every redesigned page wraps itself in <MonoPage>.

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Lenis from 'lenis'

// ----- Tokens -----
export const BG = '#080808'
export const PANEL = '#0F0F0F'
export const FG = '#F2F2F2'          // headings: off-white, not pure white
export const BODY = '#C9C9C9'        // body text
export const MUTED = '#8E8E8E'       // secondary text
export const LINE = 'rgba(255,255,255,0.07)'
export const LIGHT = '#E5E5E1'       // light mat when needed
export const SIGNAL = '#00FF94'      // green: status dots and small signals only
export const MONO = 'ui-monospace, Menlo, monospace'
export const SANS = "'Space Grotesk', sans-serif"

// ----- Shared data -----
export const TEAM = [
  { name: 'Bruno Čukić', role: 'Web', bio: 'Radi web. Komunicira tako da prekine Petra u najgorem mogućem trenutku. Čudo da još surađuju.', photo: '/images/team/1.webp', linkedin: '#' },
  { name: 'Petar Zirdum', role: 'Video & Foto', bio: 'Snima i montira. Ima više hard diskova nego prijatelja. Prijatelji kažu da je to ok.', photo: '/images/team/2.webp', linkedin: '#' },
]

export const TESTIMONIALS = [
  { quote: 'Transformacija našeg weba premašila je naša očekivanja. Prešli smo s gotovo nikakvih online upita na preko 100 u samo dva mjeseca.', role: 'Vlasnik', company: 'Elit Projekt' },
  { quote: 'NineFold je savršeno uhvatio ono što naš studio čini posebnim. Prilagođeni videi za svakog umjetnika su briljantni - klijentima se sviđa što nas mogu upoznati prije nego dođu. Web ima pravu ravnotežu prikazivanja našeg profesionalnog rada uz zadržavanje te opuštene atmosfere koja nas definira.', role: 'Vlasnik', company: 'Radijona Tattoo' },
  { quote: 'Nova web stranica savršeno hvata premium pozicioniranje našeg branda, a prilagođeni konfiguratori napravili su ogromnu razliku u načinu na koji klijenti komuniciraju s našim proizvodima.', role: 'Suosnivač', company: 'Desk&Co' },
  { quote: 'NineFold je uzeo naše desetljeće iskustva u industriji i stvorio digitalnu prisutnost koja uistinu predstavlja tko smo. Sve naše želje prilikom stvaranja digitalnih platformi, nakon analize, NineFold je transformirao u smislenu komunikaciju i ponudio pravo rješenje i pravu reprezentaciju naših vrijednosti.', role: 'Vlasnik', company: 'The Office Company' },
]

export const CLIENT_LOGOS = [
  { src: '/images/clients/studio-one.svg', name: 'Studio One by Nina' },
  { src: '/images/clients/adriatic-padel-klub.svg', name: 'Adriatic Padel Klub' },
  { src: '/images/clients/matermag.svg', name: 'MaterMag' },
  { src: '/images/clients/elit-projekt.svg', name: 'Elit Projekt' },
  { src: '/images/clients/desk-and-co.svg', name: 'Desk&Co' },
  { src: '/images/clients/the-office-company.svg', name: 'The Office Company' },
  { src: '/images/clients/pizzeria-14.svg', name: 'Pizzeria 14' },
  { src: '/images/clients/radijona.svg', name: 'Radijona' },
  { src: '/images/clients/di-plan.svg', name: 'DI Plan' },
  { src: '/images/clients/otkup-auta.svg', name: 'Otkup Auta' },
  { src: '/images/clients/atria.png', name: 'Atria' },
  { src: '/images/clients/brendia-pro.svg', name: 'Brendia Pro' },
  { src: '/images/clients/coerver-coaching.svg', name: 'Coerver Coaching' },
  { src: '/images/clients/er1.svg', name: 'ER1' },
  { src: '/images/clients/fsb-doors.svg', name: 'FSB Doors' },
  { src: '/images/clients/habu.svg', name: 'Habu' },
  { src: '/images/clients/la-gym.svg', name: 'LA Gym' },
]

export const SERVICE_FAQS = [
  { q: 'Koliko košta web stranica?', a: 'Iskreno, ovisi. Jednostavniji web ide od par tisuća eura, kompleksniji projekti više. Nakon prvog razgovora dobiješ točnu ponudu, bez skrivenih stavki.' },
  { q: 'Koliko traje izrada?', a: 'Većina projekata traje 4–8 tjedana od prvog razgovora do lansiranja. Najviše ovisi o tome koliko brzo stižu materijali i povratne informacije s tvoje strane.' },
  { q: 'Trebam samo video ili samo fotografiju, može?', a: 'Može. Sve radimo i zasebno: video, fotografija, branding ili web. Najbolje ispadne kad se stvari rade zajedno, ali ništa ne moraš uzeti u paketu.' },
  { q: 'Već imam web, može li se samo osvježiti?', a: 'Može. Pogledamo što ima smisla zadržati, što baciti, i predložimo redizajn koji ne kreće od nule ako ne mora.' },
  { q: 'Kako izgleda suradnja?', a: 'Prvo razgovor, pa ponuda, pa posao. Tijekom projekta imaš direktan kontakt s nama dvojicom, bez posrednika i bez čekanja tjedan dana na mail.' },
  { q: 'Održavate li stranice nakon lansiranja?', a: 'Da. Imamo pakete održavanja: tehnička briga, izmjene sadržaja i mjesečni izvještaji. A ako nešto pukne u 22h, javi se, vjerojatno smo budni.' },
]

// ----- Primitives -----

export function MeetIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 87.5 72" aria-hidden="true">
      <path fill="#00832d" d="M49.5 36l8.53 9.75 11.47 7.33 2-17.02-2-16.64-11.69 6.44z" />
      <path fill="#0066da" d="M0 51.5V66c0 3.315 2.685 6 6 6h14.5l3-10.96-3-9.54-9.95-3z" />
      <path fill="#e94235" d="M20.5 0L0 20.5l10.55 3 9.95-3 2.95-9.41z" />
      <path fill="#2684fc" d="M20.5 20.5H0v31h20.5z" />
      <path fill="#00ac47" d="M82.6 8.68L69.5 19.42v33.66l13.16 10.79c1.97 1.54 4.85.135 4.85-2.37V11c0-2.535-2.945-3.925-4.91-2.32zM49.5 36v15.5h-29V72h43c3.315 0 6-2.685 6-6V52.08z" />
      <path fill="#ffba00" d="M63.5 0h-43v20.5h29V36l20-16.57V6c0-3.315-2.685-6-6-6z" />
    </svg>
  )
}

export function Reveal({ children, delay = 0, className = '', style = {} }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setShown(true); return }
    const el = ref.current
    if (!el) return
    // Above the fold: reveal on load, don't wait for scroll.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
      const t = setTimeout(() => setShown(true), 60)
      return () => clearTimeout(t)
    }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect() } },
      { threshold: 0.12 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(24px)',
        transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

export function Eyebrow({ children }) {
  return (
    <p className="text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>
      {children}
    </p>
  )
}

export function Pill({ children }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs"
      style={{ border: `1px solid ${LINE}`, color: BODY, background: 'rgba(255,255,255,0.04)' }}
    >
      {children}
    </span>
  )
}

// ----- Scroll context: pages can reach the scroll container -----

const MonoScrollCtx = createContext({ current: null })
export function useMonoScroll() {
  return useContext(MonoScrollCtx)
}

// ----- Cal.com booking popup -----
export const CAL_URL = 'https://cal.com/ninefoldeu/uvodni-razgovor'

const CalCtx = createContext(() => {})
export function useCalPopup() {
  return useContext(CalCtx)
}

// Scroll-stack: pinned cards scale down and blur as the next slides over.
// Attach to the direct parent of the sticky card wrappers.
export function useScrollStack(stackRef) {
  const containerRef = useMonoScroll()
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const container = containerRef.current
    const stack = stackRef.current
    if (!container || !stack) return
    let raf
    const tick = () => {
      // Re-read every frame: cards can arrive async (CMS fetch).
      const wrappers = [...stack.children]
      const vh = container.clientHeight
      wrappers.forEach((w, i) => {
        const card = w.firstElementChild
        if (!card) return
        if (i === wrappers.length - 1) return
        const nextTop = wrappers[i + 1].getBoundingClientRect().top
        const start = vh
        const end = 84 + (i + 1) * 14
        const p = Math.min(1, Math.max(0, (start - nextTop) / (start - end)))
        card.style.transform = `scale(${(1 - p * 0.06).toFixed(4)})`
        card.style.filter = `blur(${(p * 2.2).toFixed(2)}px) brightness(${(1 - p * 0.18).toFixed(3)})`
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [containerRef, stackRef])
}

// ----- Page shell -----

const NAV_LINKS = [
  ['Radovi', '/work'],
  ['Usluge', '/usluge'],
  ['O nama', '/about'],
  ['Blog', '/blog'],
  ['Kontakt', '/contact'],
  ['Portal', '/portal/login'],
]

export function MonoPage({ children }) {
  const containerRef = useRef(null)
  const contentRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)     // mounted
  const [menuVisible, setMenuVisible] = useState(false) // drives the transition

  const openMenu = () => {
    setMenuOpen(true)
    requestAnimationFrame(() => requestAnimationFrame(() => setMenuVisible(true)))
  }
  const closeMenu = () => {
    setMenuVisible(false)
    setTimeout(() => setMenuOpen(false), 380)
  }

  const [calOpen, setCalOpen] = useState(false)
  const [calVisible, setCalVisible] = useState(false)
  const openCal = () => {
    setCalOpen(true)
    requestAnimationFrame(() => requestAnimationFrame(() => setCalVisible(true)))
  }
  const closeCal = () => {
    setCalVisible(false)
    setTimeout(() => setCalOpen(false), 300)
  }

  useEffect(() => {
    const lenis = new Lenis({ wrapper: containerRef.current, content: contentRef.current })
    lenis.on('scroll', ({ scroll }) => setScrolled(scroll > 40))
    let raf
    const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); lenis.destroy() }
  }, [])

  return (
    <div
      ref={containerRef}
      data-lenis-prevent
      className="nf-page fixed inset-0 z-[1200] overflow-y-auto overflow-x-hidden"
      style={{ background: BG, color: FG, fontFamily: SANS }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
      />
      <style>{`
        .nf-page { scrollbar-width: none; -ms-overflow-style: none; }
        .nf-page::-webkit-scrollbar { display: none; width: 0; height: 0; }
        @keyframes nf-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .nf-marquee { animation: nf-marquee 140s linear infinite; }
        .nf-card { transition: transform .5s cubic-bezier(.16,1,.3,1), border-color .35s ease; }
        .nf-card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.16) !important; }
        .nf-card .nf-vis { transition: transform .6s cubic-bezier(.16,1,.3,1); }
        .nf-card:hover .nf-vis { transform: scale(1.03); }
        .nf-card .nf-viswrap { transition: background .35s ease; }
        .nf-card:hover .nf-viswrap { background: #151514 !important; }
        .nf-card .nf-arrow { transition: transform .35s cubic-bezier(.16,1,.3,1), color .35s ease; }
        .nf-card:hover .nf-arrow { transform: translate(3px, -3px); color: #F2F2F2; }
        @media (prefers-reduced-motion: reduce) {
          .nf-marquee { animation: none !important }
          .nf-mmenu, .nf-mmenu * { transition: none !important }
          .nf-card, .nf-card .nf-vis, .nf-card .nf-arrow, .nf-card .nf-viswrap { transition: none !important }
          .nf-card:hover { transform: none }
          .nf-card:hover .nf-vis { transform: none }
        }
      `}</style>

      <div ref={contentRef}>
        {/* Nav: full width at top, merges into one pill on scroll */}
        <header className="sticky top-0 z-50 px-4 pt-3">
          <div
            className="mx-auto flex items-center justify-between transition-all duration-500"
            style={{
              maxWidth: scrolled ? 860 : 1200,
              background: scrolled ? 'rgba(15,15,15,0.85)' : 'transparent',
              backdropFilter: scrolled ? 'blur(16px)' : 'none',
              border: `1px solid ${scrolled ? 'rgba(255,255,255,0.08)' : 'transparent'}`,
              borderRadius: 999,
              padding: scrolled ? '6px 6px 6px 20px' : '6px 0px',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <Link href="/">
              <img src="/ninefold-logo.svg" alt="Ninefold" style={{ height: 14, width: 'auto' }} />
            </Link>

            <nav
              className="hidden items-center gap-1 rounded-full px-2 py-1 transition-all duration-500 md:flex"
              style={{
                background: scrolled ? 'transparent' : 'rgba(15,15,15,0.7)',
                border: `1px solid ${scrolled ? 'transparent' : LINE}`,
                backdropFilter: scrolled ? 'none' : 'blur(14px)',
              }}
            >
              {NAV_LINKS.map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="rounded-full px-3.5 py-1.5 text-sm transition-colors hover:text-white"
                  style={{ color: BODY }}
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={openCal}
                className="flex items-center gap-2 rounded-full pl-3.5 pr-4 py-2 text-sm font-medium transition-transform hover:scale-[1.03]"
                style={{ background: FG, color: BG }}
              >
                <MeetIcon size={15} />
                Čujemo se
              </button>
              <button
                onClick={openMenu}
                aria-label="Otvori izbornik"
                className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-full md:hidden"
                style={{ border: `1px solid ${LINE}`, background: 'rgba(15,15,15,0.7)' }}
              >
                <span className="block h-px w-4" style={{ background: FG }} />
                <span className="block h-px w-4" style={{ background: FG }} />
              </button>
            </div>
          </div>
        </header>

        {/* Mobile menu overlay */}
        {menuOpen && (
          <div
            className="nf-mmenu fixed inset-0 z-[100] flex flex-col md:hidden"
            style={{
              background: BG,
              opacity: menuVisible ? 1 : 0,
              transition: 'opacity .35s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <div
              className="flex items-center justify-between px-5 pt-5"
              style={{
                opacity: menuVisible ? 1 : 0,
                transform: menuVisible ? 'none' : 'translateY(-10px)',
                transition: menuVisible
                  ? 'opacity .45s cubic-bezier(0.16,1,0.3,1) .05s, transform .45s cubic-bezier(0.16,1,0.3,1) .05s'
                  : 'opacity .25s ease, transform .25s ease',
              }}
            >
              <Link href="/" onClick={closeMenu}>
                <img src="/ninefold-logo.svg" alt="Ninefold" style={{ height: 14, width: 'auto' }} />
              </Link>
              <button
                onClick={closeMenu}
                aria-label="Zatvori izbornik"
                className="flex h-9 w-9 items-center justify-center rounded-full text-lg"
                style={{ border: `1px solid ${LINE}`, color: FG }}
              >
                ✕
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center gap-1 px-8">
              <p
                className="mb-4 text-[11px] uppercase"
                style={{
                  fontFamily: MONO,
                  letterSpacing: '0.14em',
                  color: MUTED,
                  opacity: menuVisible ? 1 : 0,
                  transition: menuVisible ? 'opacity .5s ease .1s' : 'opacity .2s ease',
                }}
              >
                Izbornik
              </p>
              {[['Naslovnica', '/'], ...NAV_LINKS].map(([label, href], i) => (
                <Link
                  key={label}
                  href={href}
                  onClick={closeMenu}
                  className="py-2.5 text-3xl font-medium"
                  style={{
                    color: FG,
                    letterSpacing: '-0.02em',
                    opacity: menuVisible ? 1 : 0,
                    transform: menuVisible ? 'none' : 'translateY(22px)',
                    transition: menuVisible
                      ? `opacity .55s cubic-bezier(0.16,1,0.3,1) ${0.08 + i * 0.045}s, transform .55s cubic-bezier(0.16,1,0.3,1) ${0.08 + i * 0.045}s`
                      : 'opacity .25s ease, transform .25s ease',
                  }}
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div
              className="flex flex-col gap-4 px-8 pb-10"
              style={{
                opacity: menuVisible ? 1 : 0,
                transform: menuVisible ? 'none' : 'translateY(16px)',
                transition: menuVisible
                  ? 'opacity .55s cubic-bezier(0.16,1,0.3,1) .35s, transform .55s cubic-bezier(0.16,1,0.3,1) .35s'
                  : 'opacity .25s ease, transform .25s ease',
              }}
            >
              <button
                onClick={() => { closeMenu(); openCal() }}
                className="flex items-center justify-center gap-2.5 rounded-full py-3.5 text-sm font-medium"
                style={{ background: FG, color: BG }}
              >
                <MeetIcon size={16} />
                Čujemo se
              </button>
              <p className="flex items-center justify-center gap-2 text-xs" style={{ color: MUTED }}>
                <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: SIGNAL }} />
                Zagreb · dostupni za nove projekte
              </p>
            </div>
          </div>
        )}

        <MonoScrollCtx.Provider value={containerRef}>
          <CalCtx.Provider value={openCal}>
            {children}
          </CalCtx.Provider>
        </MonoScrollCtx.Provider>

        {/* Cal.com booking popup */}
        {calOpen && (
          <div
            className="fixed inset-0 z-[1300] flex items-center justify-center p-4"
            style={{
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(8px)',
              opacity: calVisible ? 1 : 0,
              transition: 'opacity .3s cubic-bezier(0.16,1,0.3,1)',
            }}
            onClick={closeCal}
          >
            <div
              className="w-full max-w-[900px] overflow-hidden rounded-[28px]"
              style={{
                background: PANEL,
                border: '1px solid rgba(255,255,255,0.1)',
                transform: calVisible ? 'none' : 'translateY(16px) scale(0.985)',
                transition: 'transform .35s cubic-bezier(0.16,1,0.3,1)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${LINE}` }}>
                <p className="flex items-center gap-2 text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>
                  <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: SIGNAL }} />
                  Rezerviraj poziv · 30 min
                </p>
                <button
                  onClick={closeCal}
                  aria-label="Zatvori"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-base transition-colors hover:text-white"
                  style={{ border: `1px solid ${LINE}`, color: MUTED }}
                >
                  ✕
                </button>
              </div>
              <iframe
                src={`${CAL_URL}?embed=true&theme=dark&layout=month_view`}
                title="Rezerviraj poziv"
                className="block w-full"
                style={{ height: 'min(72vh, 640px)', border: 'none', background: BG }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="px-5 pb-10 pt-16" style={{ borderTop: `1px solid ${LINE}` }}>
          <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-[1.15fr_0.8fr_1fr_1fr]">
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl p-6" style={{ background: PANEL, border: `1px solid ${LINE}` }}>
                <img src="/ninefold-logo.svg" alt="Ninefold" width="120" height="18" style={{ height: 16, width: 'auto' }} />
                <p className="mt-4 text-sm" style={{ color: MUTED }}>
                  Web, video i branding iz Zagreba.
                </p>
                <a href="mailto:hello@ninefold.eu" className="mt-2 block text-sm transition-colors hover:text-white" style={{ color: BODY }}>
                  hello@ninefold.eu
                </a>
                <div className="mt-5 flex items-center gap-2">
                  {[
                    ['Instagram', <svg key="ig" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" /></svg>],
                    ['LinkedIn', <svg key="li" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4v15.5h-4V8zm7.5 0h3.8v2.2h.05c.53-1 1.83-2.2 3.77-2.2 4.03 0 4.78 2.65 4.78 6.1v9.4h-4V15c0-2.03-.04-4.64-2.83-4.64-2.83 0-3.27 2.2-3.27 4.48v8.66h-4V8z" /></svg>],
                    ['TikTok', <svg key="tt" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>],
                  ].map(([label, icon]) => (
                    <a
                      key={label}
                      href="#"
                      aria-label={label}
                      className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:text-white"
                      style={{ border: `1px solid ${LINE}`, color: MUTED }}
                    >
                      {icon}
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl p-5" style={{ background: PANEL, border: `1px solid ${LINE}` }}>
                <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: SIGNAL }} />
                <p className="text-xs leading-relaxed" style={{ color: MUTED }}>
                  Zagreb, Hrvatska. Trenutno dostupni za nove projekte.
                </p>
              </div>
            </div>

            {[
              ['Stranice', [['Naslovnica', '/'], ['Radovi', '/work'], ['Blog', '/blog'], ['O nama', '/about'], ['Kontakt', '/contact'], ['Klijentski portal', '/portal/login']]],
              ['Projekti', [['Studio One by Nina', '/work/studio-one-by-nina'], ['Adriatic Padel Klub', '/work/adriatic-padel-klub'], ['MaterMag', '/work/matermag-digital-magazine'], ['Svi projekti →', '/work']]],
              ['Usluge', [['Web i aplikacije', '/usluge/web-digitalno'], ['Video i animacija', '/usluge/video-animacija'], ['Fotografija', '/usluge/fotografija'], ['Strategija i branding', '/usluge/strategija-branding'], ['Društvene mreže', '/usluge/sadrzaj-drustvene-mreze'], ['Studio', '/usluge/studio']]],
            ].map(([heading, links]) => (
              <div key={heading}>
                <p className="text-sm font-medium" style={{ color: FG }}>{heading}</p>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {links.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="text-sm transition-colors hover:text-white" style={{ color: MUTED }}>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            className="mx-auto mt-14 flex max-w-[1200px] flex-col items-start justify-between gap-4 pt-6 md:flex-row md:items-center"
            style={{ borderTop: `1px solid ${LINE}` }}
          >
            <p className="text-sm" style={{ color: MUTED }}>© 2026 Ninefold. Sva prava pridržana.</p>
            <button
              onClick={() => containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-sm transition-colors hover:text-white"
              style={{ color: MUTED }}
            >
              Natrag na vrh ↑
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}

// ----- Testimonials: avatar-picker carousel -----

export function MonoTestimonials() {
  const [active, setActive] = useState(0)
  return (
    <section className="mx-auto max-w-4xl px-5 pb-24 text-center md:pb-32">
      <Reveal>
        <Eyebrow>Klijenti</Eyebrow>
        <blockquote
          className="mx-auto mt-8 flex min-h-[14rem] max-w-3xl items-center justify-center text-xl font-medium leading-snug md:min-h-[12rem] md:text-[1.65rem]"
          style={{ letterSpacing: '-0.015em' }}
        >
          „{TESTIMONIALS[active].quote}“
        </blockquote>
        <p className="mt-4 text-sm" style={{ color: MUTED }}>
          {TESTIMONIALS[active].role} · {TESTIMONIALS[active].company}
        </p>
        <div className="mt-8 inline-flex items-center gap-2 rounded-full p-1.5" style={{ border: `1px solid ${LINE}` }}>
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.company}
              onClick={() => setActive(i)}
              aria-label={t.company}
              className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-medium transition-colors"
              style={{
                background: active === i ? FG : 'transparent',
                color: active === i ? BG : MUTED,
                border: active === i ? '1px solid transparent' : `1px solid ${LINE}`,
              }}
            >
              {t.company.split(/[\s&]+/).slice(0, 2).map((wd) => wd[0]).join('')}
            </button>
          ))}
        </div>
      </Reveal>
    </section>
  )
}

// ----- FAQ accordion (items differ per page) -----

export function MonoFAQ({ items, eyebrow = 'FAQ', title = 'Česta pitanja' }) {
  const [open, setOpen] = useState(0)
  return (
    <section className="mx-auto max-w-3xl px-5 pb-24 md:pb-32">
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-3 text-3xl font-medium md:text-5xl" style={{ letterSpacing: '-0.02em' }}>
          {title}
        </h2>
      </Reveal>
      <div className="mt-10">
        {items.map((f, i) => (
          <Reveal key={f.q} delay={Math.min(i * 0.04, 0.2)}>
            <div style={{ borderBottom: `1px solid ${LINE}` }}>
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left text-base font-medium transition-colors hover:text-white md:text-lg"
                style={{ color: open === i ? FG : BODY }}
              >
                {f.q}
                <span className="shrink-0 text-xl" style={{ color: MUTED }}>
                  {open === i ? '−' : '+'}
                </span>
              </button>
              {open === i && (
                <p className="pb-6 pr-10 leading-relaxed" style={{ color: MUTED }}>
                  {f.a}
                </p>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

// ----- Big CTA card (shared page ending) -----

// Button that opens the cal.com popup, styled like the primary Meet button.
export function CalButton({ label = 'Rezerviraj poziv', className = '', size = 17 }) {
  const openCal = useCalPopup()
  return (
    <button
      onClick={openCal}
      className={`inline-flex items-center gap-2.5 rounded-full pl-4 pr-6 py-3.5 text-sm font-medium transition-transform hover:scale-[1.03] ${className}`}
      style={{ background: FG, color: BG }}
    >
      <MeetIcon size={size} />
      {label}
    </button>
  )
}

export function MonoCTA() {
  return (
    <section id="cta" className="mx-auto max-w-[1200px] px-5 pb-24 md:pb-32">
      <Reveal>
        <div
          className="relative overflow-hidden rounded-[28px] p-8 md:p-14"
          style={{ background: PANEL, border: `1px solid ${LINE}` }}
        >
          <img
            src="/images/chrome-ninefold-logo.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute hidden md:block"
            style={{ width: 520, right: -70, top: '50%', transform: 'translateY(-50%) rotate(-8deg)', filter: 'drop-shadow(0 24px 60px rgba(0,0,0,0.6))' }}
          />

          <div className="relative max-w-xl">
            <p className="flex items-center gap-2 text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>
              <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: SIGNAL }} />
              Slobodni termini · Q4 2026
            </p>
            <h3 className="mt-4 text-3xl font-medium md:text-4xl" style={{ letterSpacing: '-0.02em' }}>
              Imaš projekt u glavi?
            </h3>
            <p className="mt-3 text-lg" style={{ color: MUTED }}>
              Besplatnih 30 minuta razgovora: prođemo ideju, rokove i budžet.
            </p>

            <CalButton className="mt-7" />

            <p className="mt-9 text-sm" style={{ color: BODY }}>Što možeš očekivati:</p>
            <ul className="mt-3 flex flex-col gap-2.5 text-sm" style={{ color: MUTED }}>
              {[
                '30 minuta s Brunom ili Petrom, ne sa "sales timom"',
                'Prođemo ideju, rokove i budžet',
                'Odeš s konkretnim prijedlozima (besplatno)',
                'Nula obveze da radiš s nama',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <span style={{ color: BODY }}>→</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
