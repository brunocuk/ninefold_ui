// app/usluge/fotografija/FotografijaContent.jsx

'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { useState } from 'react'

const service = {
  title: 'Fotografija',
  tagline: 'Slike koje govore',
  description: 'Profesionalna fotografija za web, e-commerce i marketing materijale. Produktna, lifestyle i korporativna fotografija — sve optimizirano za vašu digitalnu prisutnost.',

  icon: (
    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),

  features: [
    {
      title: 'Produktna Fotografija',
      description: 'Profesionalne fotografije proizvoda na bijeloj pozadini ili u stilu lifestyle snimanja za e-commerce.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      title: 'Lifestyle Fotografija',
      description: 'Proizvodi i usluge prikazani u realnim situacijama koje rezoniraju s vašom publikom.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Korporativna Fotografija',
      description: 'Profesionalne fotografije tima, headshots i snimanje poslovnih prostora.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      title: 'Interijerna Fotografija',
      description: 'Fotografije poslovnih prostora, restorana, hotela i interijera za web i marketing.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      title: 'Event Fotografija',
      description: 'Profesionalno dokumentiranje poslovnih događaja, konferencija i team buildinga.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Web Optimizacija',
      description: 'Sve fotografije isporučujemo u više veličina, optimizirane za web — spremne za upload.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ],

  process: [
    {
      number: '01',
      title: 'Konzultacije',
      description: 'Razgovaramo o vašim potrebama, stilu, količini i namjeni fotografija.',
      duration: '1-2 dana',
    },
    {
      number: '02',
      title: 'Planiranje',
      description: 'Izrađujemo shot listu, dogovaramo lokaciju, styling i logistiku.',
      duration: '2-5 dana',
    },
    {
      number: '03',
      title: 'Snimanje',
      description: 'Profesionalno snimanje s vrhunskom opremom i osvjetljenjem.',
      duration: '2-6 sati',
    },
    {
      number: '04',
      title: 'Odabir',
      description: 'Pregledavamo sirove fotografije i odabirete koje želite obrađene.',
      duration: '1-2 dana',
    },
    {
      number: '05',
      title: 'Obrada',
      description: 'Color correction, retuširanje i web optimizacija odabranih fotografija.',
      duration: '3-7 dana',
    },
    {
      number: '06',
      title: 'Isporuka',
      description: 'Finalne fotografije u svim formatima, spremne za korištenje.',
      duration: '1-2 dana',
    },
  ],

  benefits: [
    {
      title: 'Profesionalna Prezentacija',
      description: 'Kvalitetne fotografije odmah grade kredibilitet i povjerenje kod kupaca.',
    },
    {
      title: 'Bolje Konverzije',
      description: 'Profesionalna produktna fotografija može povećati prodaju za 30%+.',
    },
    {
      title: 'Diferencijacija',
      description: 'Custom fotografije umjesto stock slika — pokažite svoje stvarne proizvode i tim.',
    },
    {
      title: 'Spremno za Korištenje',
      description: 'Sve fotografije optimizirane za web u više veličina — samo uploadajte.',
    },
  ],

  photoTypes: [
    { name: 'Produktna (Bijela)', category: 'Produkt' },
    { name: 'Produktna (Lifestyle)', category: 'Produkt' },
    { name: 'Flat Lay', category: 'Produkt' },
    { name: 'Detail Shots', category: 'Produkt' },
    { name: 'Headshots', category: 'Korporativno' },
    { name: 'Timske Fotografije', category: 'Korporativno' },
    { name: 'Poslovni Prostor', category: 'Interijer' },
    { name: 'Restorani/Hoteli', category: 'Interijer' },
    { name: 'Konferencije', category: 'Eventi' },
    { name: 'Team Building', category: 'Eventi' },
    { name: 'Food Fotografija', category: 'Specijalizirano' },
    { name: 'Arhitektura', category: 'Specijalizirano' },
  ],

  pricing: {
    ranges: [
      {
        size: 'Polu-dan',
        price: '€400 - €800',
        description: 'Do 4 sata snimanja za manje projekte',
        features: ['Do 4 sata na lokaciji', 'Do 30 obrađenih fotografija', 'Osnovno retuširanje', 'Web optimizacija', 'Komercijalna prava']
      },
      {
        size: 'Cijeli Dan',
        price: '€1.000 - €2.000',
        description: 'Cjelodnevno snimanje za veće projekte',
        features: ['6-8 sati na lokaciji', 'Do 80 obrađenih fotografija', 'Napredno retuširanje', 'Više lokacija/setupa', 'Svi formati']
      },
      {
        size: 'E-commerce Paket',
        price: '€30 - €50/proizvod',
        description: 'Produktna fotografija za web shopove',
        features: ['3-5 kutova po proizvodu', 'Bijela pozadina', 'Konzistentno osvjetljenje', 'Web optimizacija', 'Bulk popusti dostupni']
      },
    ],
    note: 'Cijene ovise o lokaciji, broju proizvoda/osoba, kompleksnosti i potrebnom stylingu. Putni troškovi se obračunavaju za lokacije izvan Zagreba.',
  },

  faqs: [
    {
      question: 'Snimate li na lokaciji ili u studiju?',
      answer: 'Oboje! Za produktnu fotografiju tipično koristimo studio za konzistentne rezultate. Za lifestyle, korporativne i event fotografije dolazimo na vašu lokaciju.',
    },
    {
      question: 'Koliko fotografija dobivamo?',
      answer: 'Ovisno o paketu: polu-dan do 30, cijeli dan do 80 obrađenih fotografija. Za e-commerce, tipično 3-5 kutova po proizvodu.',
    },
    {
      question: 'Možemo li koristiti fotografije za sve namjene?',
      answer: 'Da! Dobivate puna komercijalna prava za web, društvene mreže, print i oglašavanje. Jasna licenca uključena.',
    },
    {
      question: 'Koliko traje cijeli proces?',
      answer: 'Od prvog kontakta do isporuke tipično 2-3 tjedna. Za hitne projekte moguća brža obrada uz dodatnu naknadu.',
    },
    {
      question: 'U kojim formatima isporučujete?',
      answer: 'JPG optimiziran za web u više veličina, plus high-res verzije za print. RAW datoteke dostupne uz dodatnu naknadu.',
    },
    {
      question: 'Nudite li i video usluge?',
      answer: 'Da! Često kombiniramo fotografiju i video na istom snimanju za maksimalnu efikasnost. Pogledajte našu uslugu Video i Animacija.',
    },
  ],
}

const relatedServices = [
  {
    title: 'Studio',
    slug: 'studio',
    description: 'Profesionalni fotografski studio',
  },
  {
    title: 'Video i Animacija',
    slug: 'video-animacija',
    description: 'Video sadržaj uz fotografije',
  },
  {
    title: 'Sadržaj i Društvene Mreže',
    slug: 'sadrzaj-drustvene-mreze',
    description: 'Content strategija za vizuale',
  },
]

export default function FotografijaContent() {
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
                    Dogovorite snimanje
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </span>
                </motion.button>
              </Link>
              <Link href="/work">
                <motion.button whileHover={{ scale: 1.02, borderColor: '#00FF94', transition: { type: "spring", stiffness: 400, damping: 30 } }} whileTap={{ scale: 0.98 }} className="px-8 py-5 bg-transparent border-2 border-[#88939D]/30 text-white font-bold rounded-xl text-lg transition-all duration-300 will-change-transform">
                  Pogledajte portfolio
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
              Što snimamo
            </motion.h2>
            <motion.p initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }} animate={featuresInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }} className="text-xl md:text-2xl text-[#88939D] max-w-3xl will-change-transform">
              Profesionalna fotografija za sve vaše digitalne i print potrebe.
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

      {/* Photo Types Section */}
      <section className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="mb-16 text-center will-change-transform">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Vrste fotografija</h2>
            <p className="text-lg md:text-xl text-[#88939D] max-w-2xl mx-auto">Od produkata do evenata — pokrivamo sve vaše vizualne potrebe.</p>
          </motion.div>

          <div className="flex flex-wrap gap-4 justify-center">
            {service.photoTypes.map((type, index) => (
              <motion.div key={index} initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }} whileHover={{ scale: 1.05, y: -3, borderColor: '#00FF94', transition: { type: "spring", stiffness: 400, damping: 30 } }} className="px-6 py-3 bg-transparent border-2 border-[#88939D]/20 rounded-xl transition-all duration-300 will-change-transform">
                <span className="font-medium text-white">{type.name}</span>
                <span className="text-xs text-[#88939D] ml-2">({type.category})</span>
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
                Zašto kvalitetne<br /><span className="text-[#00FF94]">fotografije</span>
              </h2>
              <p className="text-lg md:text-xl text-[#88939D] leading-relaxed">
                Slika govori tisuću riječi. Profesionalne fotografije grade povjerenje i povećavaju konverzije.
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
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Naš proces</h2>
            <p className="text-lg md:text-xl text-[#88939D]">Od dogovora do isporuke — jednostavan i efikasan workflow.</p>
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
            <p className="text-lg md:text-xl text-[#88939D] max-w-2xl mx-auto">Fleksibilni paketi prilagođeni vašim potrebama.</p>
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
            <p className="text-lg md:text-xl text-[#88939D]">Sve što trebate znati o našim foto uslugama.</p>
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
            <p className="text-lg md:text-xl text-[#88939D]">Maksimizirajte vrijednost fotografija s našim dodatnim uslugama.</p>
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
                        Saznajte više
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
              Spremni za profesionalne<br /><span className="text-[#00FF94]">fotografije?</span>
            </h2>
            <p className="text-lg md:text-xl text-[#88939D] mb-12 max-w-2xl mx-auto">Dogovorimo snimanje i stvorimo vizualni sadržaj koji predstavlja vašu tvrtku u najboljem svjetlu.</p>
            <Link href="/contact">
              <motion.button whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 30 } }} whileTap={{ scale: 0.98 }} className="group relative px-8 py-5 bg-gradient-to-r from-[#00FF94] to-[#00CC78] text-black font-bold rounded-xl text-lg overflow-hidden transition-all shadow-lg shadow-[#00FF94]/20 hover:shadow-xl hover:shadow-[#00FF94]/30 will-change-transform">
                <span className="relative z-10 flex items-center gap-2">
                  Zakažite besplatan poziv
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
