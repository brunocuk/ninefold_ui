// app/usluge/strategija-branding/StrategijaBrandingContent.jsx

'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { useState } from 'react'

const service = {
  title: 'Strategija i Branding',
  tagline: 'Identitet koji se pamti',
  description: 'Od vizualnog identiteta do cjelovite brand strategije. Gradimo brandove koji se ističu, povezuju s publikom i ostavljaju trajni dojam.',

  icon: (
    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
    </svg>
  ),

  features: [
    {
      title: 'Brand Strategija',
      description: 'Definiramo vašu poziciju na tržištu, ciljnu publiku, vrijednosti i ton komunikacije.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      title: 'Vizualni Identitet',
      description: 'Logotip, tipografija, boje i vizualni elementi koji definiraju vaš brand.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      title: 'Naming',
      description: 'Kreativni nazivi za brandove, proizvode i usluge koji rezoniraju s publikom.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      ),
    },
    {
      title: 'Brand Book',
      description: 'Kompletna dokumentacija identiteta s pravilima primjene za konzistentnu komunikaciju.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      title: 'Rebranding',
      description: 'Osvježenje postojećeg branda za novo doba, bez gubitka prepoznatljivosti.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
    {
      title: 'Brand Collateral',
      description: 'Posjetnice, memorandumi, brošure i svi materijali potrebni za profesionalnu prezentaciju.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
  ],

  process: [
    {
      number: '01',
      title: 'Discovery',
      description: 'Dubinska analiza vašeg poslovanja, konkurencije, tržišta i ciljne publike.',
      duration: '1-2 tjedna',
    },
    {
      number: '02',
      title: 'Strategija',
      description: 'Definiranje pozicioniranja, vrijednosti, osobnosti branda i ključnih poruka.',
      duration: '1-2 tjedna',
    },
    {
      number: '03',
      title: 'Kreativni Koncept',
      description: 'Razvoj vizualnih smjerova i prezentacija koncepata za odabir.',
      duration: '2-3 tjedna',
    },
    {
      number: '04',
      title: 'Dizajn',
      description: 'Izrada kompletnog vizualnog identiteta prema odabranom smjeru.',
      duration: '2-3 tjedna',
    },
    {
      number: '05',
      title: 'Aplikacija',
      description: 'Primjena identiteta na sve potrebne materijale i touchpointe.',
      duration: '1-2 tjedna',
    },
    {
      number: '06',
      title: 'Dokumentacija',
      description: 'Izrada brand booka s detaljnim pravilima za konzistentnu primjenu.',
      duration: '1 tjedan',
    },
  ],

  benefits: [
    {
      title: 'Diferencijacija',
      description: 'Istaknite se od konkurencije s jedinstvenim identitetom koji privlači pravu publiku.',
    },
    {
      title: 'Povjerenje',
      description: 'Profesionalni brand gradi kredibilitet i povjerenje kod potencijalnih klijenata.',
    },
    {
      title: 'Konzistentnost',
      description: 'Jasna pravila osiguravaju prepoznatljivu komunikaciju na svim kanalima.',
    },
    {
      title: 'Dugoročna Vrijednost',
      description: 'Investicija u brand koja se isplati godinama kroz prepoznatljivost i lojalnost.',
    },
  ],

  brandElements: [
    { name: 'Logotip', category: 'Identitet' },
    { name: 'Paleta Boja', category: 'Identitet' },
    { name: 'Tipografija', category: 'Identitet' },
    { name: 'Ikonografija', category: 'Identitet' },
    { name: 'Fotografski Stil', category: 'Identitet' },
    { name: 'Ilustracije', category: 'Identitet' },
    { name: 'Posjetnice', category: 'Materijali' },
    { name: 'Memorandum', category: 'Materijali' },
    { name: 'Omotnice', category: 'Materijali' },
    { name: 'Prezentacije', category: 'Materijali' },
    { name: 'Social Media Kit', category: 'Digital' },
    { name: 'Email Potpis', category: 'Digital' },
  ],

  pricing: {
    ranges: [
      {
        size: 'Logo Paket',
        price: '€1.500 - €3.000',
        description: 'Logotip i osnovni elementi identiteta',
        features: ['Dizajn logotipa', '3 konceptualna smjera', 'Primarna paleta boja', 'Osnovna tipografija', 'Datoteke u svim formatima']
      },
      {
        size: 'Brand Identitet',
        price: '€4.000 - €8.000',
        description: 'Kompletan vizualni identitet',
        features: ['Brand strategija', 'Logotip sustav', 'Paleta boja', 'Tipografija', 'Ikonografija', 'Brand book', 'Osnovni materijali']
      },
      {
        size: 'Full Branding',
        price: '€10.000 - €25.000+',
        description: 'Sveobuhvatan brand projekt',
        features: ['Dubinska strategija', 'Naming (opcionalno)', 'Kompletan identitet', 'Svi materijali', 'Digital assets', 'Detaljna dokumentacija', 'Implementacijska podrška']
      },
    ],
    note: 'Cijene ovise o kompleksnosti projekta, opsegu materijala i industriji. Svaki projekt je jedinstven — kontaktirajte nas za personaliziranu ponudu.',
  },

  faqs: [
    {
      question: 'Koliko traje izrada branda?',
      answer: 'Kompletan brand projekt tipično traje 6-12 tjedana, ovisno o opsegu. Logo paket 2-4 tjedna, a manji projekti mogu biti brži.',
    },
    {
      question: 'Što dobivamo na kraju projekta?',
      answer: 'Sve datoteke logotipa (AI, EPS, SVG, PNG, JPG), brand book s pravilima primjene, sve dogovorene materijale u print i digital formatima.',
    },
    {
      question: 'Koliko revizija je uključeno?',
      answer: 'Svaki paket uključuje definirani broj revizija (tipično 2-3 po fazi). Važno nam je doći do rezultata s kojim ste zadovoljni.',
    },
    {
      question: 'Radite li samo s novim brandovima?',
      answer: 'Ne, radimo i rebranding postojećih brandova. Analiziramo što funkcionira, što treba promijeniti i kako zadržati prepoznatljivost uz osvježenje.',
    },
    {
      question: 'Možete li nam pomoći s implementacijom?',
      answer: 'Apsolutno! Možemo primijeniti brand na web stranice, društvene mreže, ambalaže i sve ostale materijale. Nudimo i pakete kontinuirane podrške.',
    },
    {
      question: 'Što ako nam se ne svidi nijedan koncept?',
      answer: 'Naš proces uključuje dubinsko istraživanje i međufaze odobravanja. Ako ste aktivno uključeni u proces, finalni rezultat uvijek odgovara očekivanjima.',
    },
  ],
}

const relatedServices = [
  {
    title: 'Web i Aplikacije',
    slug: 'web-digitalno',
    description: 'Web stranice koje reflektiraju vaš brand',
  },
  {
    title: 'Fotografija',
    slug: 'fotografija',
    description: 'Vizualni sadržaj za brand materijale',
  },
  {
    title: 'Video i Animacija',
    slug: 'video-animacija',
    description: 'Video sadržaj koji prenosi brand priču',
  },
]

export default function StrategijaBrandingContent() {
  const prefersReducedMotion = useReducedMotion()

  const [heroRef, heroInView] = useInView({ threshold: 0.15, triggerOnce: true })
  const [featuresRef, featuresInView] = useInView({ threshold: 0.15, triggerOnce: true })
  const [processRef, processInView] = useInView({ threshold: 0.15, triggerOnce: true })
  const [pricingRef, pricingInView] = useInView({ threshold: 0.15, triggerOnce: true })
  const [faqRef, faqInView] = useInView({ threshold: 0.15, triggerOnce: true })

  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="min-h-screen bg-[#0F0F0F]">

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center bg-[#0F0F0F] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-[#00CC78]/20 via-[#00FF94]/10 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <div className="max-w-5xl">
            <motion.div initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="flex items-center gap-2 text-sm text-[#88939D] mb-8 will-change-transform">
              <Link href="/usluge" className="hover:text-[#00FF94] transition-colors duration-300">Usluge</Link>
              <span>/</span>
              <span className="text-white">{service.title}</span>
            </motion.div>

            <motion.div initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }} animate={heroInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} whileHover={{ scale: 1.1, rotate: 5, transition: { type: "spring", stiffness: 400, damping: 30 } }} className="w-20 h-20 text-[#00FF94] mb-8 will-change-transform">
              {service.icon}
            </motion.div>

            <motion.h1 initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[1.05] tracking-tight mb-6 will-change-transform">
              <span className="block text-white">{service.title}</span>
            </motion.h1>

            <motion.p initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }} className="text-xl md:text-2xl text-[#00FF94] mb-8 will-change-transform">
              {service.tagline}
            </motion.p>

            <motion.p initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }} className="text-lg md:text-xl text-[#88939D] leading-relaxed max-w-3xl mb-12 will-change-transform">
              {service.description}
            </motion.p>

            <motion.div initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col sm:flex-row gap-4 will-change-transform">
              <Link href="/contact">
                <motion.button whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 30 } }} whileTap={{ scale: 0.98 }} className="group relative px-8 py-5 bg-gradient-to-r from-[#00FF94] to-[#00CC78] text-black font-bold rounded-xl text-lg overflow-hidden transition-all shadow-lg shadow-[#00FF94]/20 hover:shadow-xl hover:shadow-[#00FF94]/30 will-change-transform">
                  <span className="relative z-10 flex items-center gap-2">
                    Čujemo se
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </span>
                </motion.button>
              </Link>
              <Link href="/work">
                <motion.button whileHover={{ scale: 1.02, borderColor: '#00FF94', transition: { type: "spring", stiffness: 400, damping: 30 } }} whileTap={{ scale: 0.98 }} className="px-8 py-5 bg-transparent border-2 border-[#88939D]/30 text-white font-bold rounded-xl text-lg transition-all duration-300 will-change-transform">
                  Pogledaj radove
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94] to-transparent opacity-30" />
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }} animate={featuresInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="mb-20 will-change-transform">
            <motion.h2 initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }} animate={featuresInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }} className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 will-change-transform">
              Što radimo
            </motion.h2>
            <motion.p initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }} animate={featuresInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }} className="text-xl md:text-2xl text-[#88939D] max-w-3xl will-change-transform">
              Logo, identitet, cijela priča. Što god ti treba.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {service.features.map((feature, index) => (
              <motion.div key={index} initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }} animate={featuresInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.4 + index * 0.08, ease: [0.16, 1, 0.3, 1] }} className="group relative will-change-transform">
                <motion.div className="relative h-full p-8 lg:p-10 rounded-2xl bg-transparent border-2 border-[#88939D]/20 transition-all duration-500 hover:border-[#00FF94] overflow-hidden will-change-transform" whileHover={{ y: -5, transition: { type: "spring", stiffness: 300, damping: 25 } }}>
                  <motion.div className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/5 via-[#00CC78]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" initial={false} />
                  <div className="relative z-10">
                    <motion.div className="w-12 h-12 text-[#00FF94] mb-6" whileHover={{ scale: 1.2, rotate: 10, transition: { type: "spring", stiffness: 400, damping: 30 } }}>
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#00FF94] transition-colors duration-300">{feature.title}</h3>
                    <p className="text-[#88939D] leading-relaxed group-hover:text-white/70 transition-colors duration-300">{feature.description}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Elements Section */}
      <section className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="mb-16 text-center will-change-transform">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Elementi branda</h2>
            <p className="text-lg md:text-xl text-[#88939D] max-w-2xl mx-auto">Evo od čega se brand sastoji.</p>
          </motion.div>

          <div className="flex flex-wrap gap-4 justify-center">
            {service.brandElements.map((element, index) => (
              <motion.div key={index} initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }} whileHover={{ scale: 1.05, y: -3, borderColor: '#00FF94', transition: { type: "spring", stiffness: 400, damping: 30 } }} className="px-6 py-3 bg-transparent border-2 border-[#88939D]/20 rounded-xl transition-all duration-300 will-change-transform">
                <span className="font-medium text-white">{element.name}</span>
                <span className="text-xs text-[#88939D] ml-2">({element.category})</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="will-change-transform">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Zašto<br /><span className="text-[#00FF94]">brand</span>
              </h2>
              <p className="text-lg md:text-xl text-[#88939D] leading-relaxed">
                Dobar brand = ljudi te pamte. Tako jednostavno.
              </p>
            </motion.div>

            <motion.div initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} className="space-y-6 will-change-transform">
              {service.benefits.map((benefit, index) => (
                <motion.div key={index} initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 + index * 0.08 }} whileHover={{ x: 5, borderColor: '#00FF94', transition: { type: "spring", stiffness: 300, damping: 25 } }} className="flex gap-4 p-6 bg-transparent border-2 border-[#88939D]/20 rounded-xl transition-all duration-300 will-change-transform">
                  <motion.div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00FF94]/10 border border-[#00FF94]/30 flex items-center justify-center mt-1" whileHover={{ scale: 1.2, transition: { type: "spring", stiffness: 400, damping: 30 } }}>
                    <svg className="w-4 h-4 text-[#00FF94]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </motion.div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">{benefit.title}</h4>
                    <p className="text-[#88939D]">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section ref={processRef} className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12">
          <motion.div initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }} animate={processInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="mb-20 text-center will-change-transform">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Kako radimo</h2>
            <p className="text-lg md:text-xl text-[#88939D]">Od istraživanja do implementacije. Korak po korak.</p>
          </motion.div>

          <div className="space-y-6">
            {service.process.map((step, index) => (
              <motion.div key={index} initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -30 }} animate={processInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1, delay: 0.2 + index * 0.08, ease: [0.16, 1, 0.3, 1] }} className="group will-change-transform">
                <motion.div className="relative flex gap-6 p-8 bg-transparent border-2 border-[#88939D]/20 rounded-2xl hover:border-[#00FF94] transition-all duration-500 overflow-hidden will-change-transform" whileHover={{ x: 5, transition: { type: "spring", stiffness: 300, damping: 25 } }}>
                  <motion.div className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/5 via-[#00CC78]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" initial={false} />
                  <motion.div className="relative z-10 flex-shrink-0 w-16 h-16 rounded-full bg-[#00FF94]/10 border-2 border-[#00FF94]/30 flex items-center justify-center text-[#00FF94] font-bold text-xl font-mono" whileHover={{ scale: 1.1, rotate: 10, transition: { type: "spring", stiffness: 400, damping: 30 } }}>
                    {step.number}
                  </motion.div>
                  <div className="relative z-10 flex-1">
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <h3 className="text-2xl font-bold text-white group-hover:text-[#00FF94] transition-colors duration-300">{step.title}</h3>
                      <span className="text-sm text-[#88939D] font-mono">{step.duration}</span>
                    </div>
                    <p className="text-[#88939D] leading-relaxed group-hover:text-white/70 transition-colors duration-300">{step.description}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingRef} className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }} animate={pricingInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="mb-20 text-center will-change-transform">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Okvirne cijene</h2>
            <p className="text-lg md:text-xl text-[#88939D] max-w-2xl mx-auto">Ovisi o projektu, ali evo otprilike.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {service.pricing.ranges.map((range, index) => (
              <motion.div key={index} initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }} animate={pricingInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.2 + index * 0.1, ease: [0.16, 1, 0.3, 1] }} className="group relative will-change-transform">
                <motion.div className="relative h-full p-8 lg:p-10 rounded-2xl bg-transparent border-2 border-[#88939D]/20 transition-all duration-500 hover:border-[#00FF94] overflow-hidden text-center will-change-transform" whileHover={{ y: -8, scale: 1.02, transition: { type: "spring", stiffness: 300, damping: 25 } }}>
                  <motion.div className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/5 via-[#00CC78]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" initial={false} />
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#00FF94] transition-colors duration-300">{range.size}</h3>
                    <motion.div className="text-4xl md:text-5xl font-bold text-[#00FF94] mb-6" whileHover={{ scale: 1.1, transition: { type: "spring", stiffness: 400, damping: 30 } }}>{range.price}</motion.div>
                    <p className="text-[#88939D] mb-6 group-hover:text-white/70 transition-colors duration-300">{range.description}</p>
                    <div className="space-y-3 mb-6 text-left">
                      {range.features.map((feature, i) => (
                        <motion.div key={i} className="flex items-center gap-2 text-sm text-[#88939D]" initial={{ opacity: 0, x: -10 }} animate={pricingInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: 0.4 + index * 0.1 + i * 0.05 }}>
                          <svg className="w-5 h-5 text-[#00FF94] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          <span>{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              </motion.div>
            ))}
          </div>

          <motion.p initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }} animate={pricingInView ? { opacity: 1 } : {}} transition={{ duration: 0.8, delay: 0.6 }} className="text-center text-[#88939D] max-w-2xl mx-auto">{service.pricing.note}</motion.p>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={faqRef} className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

        <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-12">
          <motion.div initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }} animate={faqInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="mb-16 text-center will-change-transform">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Česta pitanja</h2>
            <p className="text-lg md:text-xl text-[#88939D]">Evo odgovora na najčešće.</p>
          </motion.div>

          <div className="space-y-4">
            {service.faqs.map((faq, index) => (
              <motion.div key={index} initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }} animate={faqInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 + index * 0.05, ease: [0.16, 1, 0.3, 1] }} className="border-2 border-[#88939D]/20 rounded-2xl overflow-hidden hover:border-[#00FF94]/30 transition-colors duration-300 will-change-transform">
                <motion.button onClick={() => setOpenFaq(openFaq === index ? null : index)} whileHover={{ backgroundColor: 'rgba(0, 255, 148, 0.05)', transition: { duration: 0.2 } }} className="w-full p-6 lg:p-8 flex items-center justify-between text-left bg-transparent transition-colors">
                  <span className="font-bold text-lg lg:text-xl pr-4 text-white">{faq.question}</span>
                  <motion.svg animate={{ rotate: openFaq === index ? 180 : 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="w-6 h-6 text-[#00FF94] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></motion.svg>
                </motion.button>
                {openFaq === index && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="px-6 lg:px-8 pb-6 lg:pb-8 text-[#88939D] leading-relaxed">{faq.answer}</motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="mb-16 text-center will-change-transform">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Povezane usluge</h2>
            <p className="text-lg md:text-xl text-[#88939D]">Možda ti treba i ovo.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {relatedServices.map((related, index) => (
              <motion.div key={index} initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }} className="group will-change-transform">
                <Link href={`/usluge/${related.slug}`} className="block relative h-full p-8 lg:p-10 bg-transparent border-2 border-[#88939D]/20 rounded-2xl hover:border-[#00FF94] transition-all duration-500 overflow-hidden will-change-transform">
                  <motion.div whileHover={{ y: -5, transition: { type: "spring", stiffness: 300, damping: 25 } }} className="relative h-full">
                    <motion.div className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/5 via-[#00CC78]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" initial={false} />
                    <div className="relative z-10 text-center">
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#00FF94] transition-colors duration-300">{related.title}</h3>
                      <p className="text-[#88939D] group-hover:text-white/70 transition-colors duration-300">{related.description}</p>
                      <div className="flex items-center justify-center gap-2 text-[#00FF94] font-medium mt-6 group-hover:gap-3 transition-all duration-300">
                        Više o ovome
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <motion.div initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Trebaš<br /><span className="text-[#00FF94]">brand?</span>
            </h2>
            <p className="text-lg md:text-xl text-[#88939D] mb-12 max-w-2xl mx-auto">Javi se. Skužit ćemo što ti treba.</p>
            <Link href="/contact">
              <motion.button whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 30 } }} whileTap={{ scale: 0.98 }} className="group relative px-8 py-5 bg-gradient-to-r from-[#00FF94] to-[#00CC78] text-black font-bold rounded-xl text-lg overflow-hidden transition-all shadow-lg shadow-[#00FF94]/20 hover:shadow-xl hover:shadow-[#00FF94]/30 will-change-transform">
                <span className="relative z-10 flex items-center gap-2">
                  Čujemo se
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#00FF94] to-transparent opacity-30" />
    </div>
  )
}
