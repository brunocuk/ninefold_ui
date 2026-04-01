// app/usluge/sadrzaj-drustvene-mreze/SadrzajDrustveneContent.jsx

'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { useState } from 'react'

const service = {
  title: 'Sadržaj i Društvene Mreže',
  tagline: 'Sadržaj koji angažira',
  description: 'Content strategija, copywriting i upravljanje društvenim mrežama. Kreiramo sadržaj koji privlači pravu publiku, gradi povjerenje i pokreće akciju.',

  icon: (
    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  ),

  features: [
    {
      title: 'Content Strategija',
      description: 'Razvijamo cjelovitu strategiju sadržaja usklađenu s vašim poslovnim ciljevima.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: 'Copywriting',
      description: 'Tekstovi koji prodaju — od web stranica do oglasa, emailova i brošura.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
    },
    {
      title: 'Social Media Management',
      description: 'Kompletno upravljanje vašim profilima na Instagram, Facebook, LinkedIn i TikTok.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
    },
    {
      title: 'Content Creation',
      description: 'Kreiranje vizualnog i tekstualnog sadržaja za sve platforme i formate.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Email Marketing',
      description: 'Newsletteri, automatizirane sekvence i kampanje koje pretvaraju pretplatnike u kupce.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'SEO Sadržaj',
      description: 'Blog članci i web sadržaj optimiziran za tražilice i konverzije.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
  ],

  process: [
    {
      number: '01',
      title: 'Analiza',
      description: 'Analiziramo vaš brand, konkurenciju, ciljnu publiku i trenutnu prisutnost.',
      duration: '1 tjedan',
    },
    {
      number: '02',
      title: 'Strategija',
      description: 'Razvijamo content strategiju s temama, formatima i kalendarom objava.',
      duration: '1-2 tjedna',
    },
    {
      number: '03',
      title: 'Kreacija',
      description: 'Pišemo tekstove, dizajniramo vizuale i pripremamo sadržaj za objavu.',
      duration: 'Kontinuirano',
    },
    {
      number: '04',
      title: 'Objava',
      description: 'Objavljujemo sadržaj prema kalendaru i optimiziramo za svaku platformu.',
      duration: 'Kontinuirano',
    },
    {
      number: '05',
      title: 'Angažman',
      description: 'Odgovaramo na komentare, poruke i gradimo zajednicu oko vašeg branda.',
      duration: 'Kontinuirano',
    },
    {
      number: '06',
      title: 'Izvještavanje',
      description: 'Mjesečna analiza performansi s preporukama za optimizaciju.',
      duration: 'Mjesečno',
    },
  ],

  benefits: [
    {
      title: 'Konzistentnost',
      description: 'Redovit, kvalitetan sadržaj gradi prepoznatljivost i povjerenje kod publike.',
    },
    {
      title: 'Ušteda Vremena',
      description: 'Prepustite kreaciju sadržaja nama dok se vi fokusirate na poslovanje.',
    },
    {
      title: 'Stručnost',
      description: 'Strategija temeljena na podacima i najbolje prakse za svaku platformu.',
    },
    {
      title: 'Mjerljivi Rezultati',
      description: 'Jasne metrike i izvještaji koji pokazuju povrat investicije.',
    },
  ],

  contentTypes: [
    { name: 'Instagram Posts', category: 'Social' },
    { name: 'Instagram Stories', category: 'Social' },
    { name: 'Instagram Reels', category: 'Social' },
    { name: 'Facebook Posts', category: 'Social' },
    { name: 'LinkedIn Članci', category: 'Social' },
    { name: 'TikTok Video', category: 'Social' },
    { name: 'Blog Članci', category: 'Web' },
    { name: 'Web Copy', category: 'Web' },
    { name: 'Landing Pages', category: 'Web' },
    { name: 'Email Newsletteri', category: 'Email' },
    { name: 'Email Sekvence', category: 'Email' },
    { name: 'Ad Copy', category: 'Oglasi' },
  ],

  pricing: {
    ranges: [
      {
        size: 'Starter',
        price: '€500 - €800/mj',
        description: 'Za male tvrtke koje tek grade prisutnost',
        features: ['8 objava mjesečno', '1 platforma', 'Osnovne grafike', 'Mjesečni izvještaj', 'Email podrška']
      },
      {
        size: 'Growth',
        price: '€1.200 - €2.000/mj',
        description: 'Za tvrtke koje žele aktivno rasti',
        features: ['16 objava mjesečno', '2-3 platforme', 'Custom grafike', 'Stories/Reels', 'Community management', 'Mjesečni izvještaj + poziv']
      },
      {
        size: 'Premium',
        price: '€2.500 - €4.000+/mj',
        description: 'Sveobuhvatna content strategija',
        features: ['Neograničeno objava', 'Sve platforme', 'Video sadržaj', 'Blog članci', 'Email marketing', 'Influencer outreach', 'Tjedni pozivi']
      },
    ],
    note: 'Cijene ovise o broju platformi, frekvenciji objava i kompleksnosti sadržaja. Jednokratni projekti (web copy, brand voice) kotiraju se zasebno.',
  },

  faqs: [
    {
      question: 'Koliko objava trebam mjesečno?',
      answer: 'Ovisno o platformi i ciljevima: Instagram 3-5 tjedno, LinkedIn 2-3 tjedno, TikTok 1-2 dnevno. Kvaliteta je važnija od kvantitete — radije manje kvalitetnih nego više prosječnih.',
    },
    {
      question: 'Pišete li vi sve tekstove?',
      answer: 'Da, naš tim copywritera piše sav sadržaj. Šaljemo vam na odobrenje prije objave ili možete prepustiti autonomiju nama uz mjesečne check-ine.',
    },
    {
      question: 'Kako surađujemo?',
      answer: 'Početni onboarding call, zatim mjesečni planovi i content kalendari koje odobravate. Koristimo Notion ili vaš preferirani alat za suradnju.',
    },
    {
      question: 'Upravljate li i plaćenim oglasima?',
      answer: 'Fokus je na organskom sadržaju, ali možemo koordinirati s vašim paid timom ili preporučiti partnere za oglašavanje.',
    },
    {
      question: 'Koliko brzo vidimo rezultate?',
      answer: 'Social media je maraton, ne sprint. Očekujte prve značajne pomake u 3-6 mjeseci konzistentnog rada. Brže rezultate donosi kombinacija s plaćenim oglasima.',
    },
    {
      question: 'Što ako nismo zadovoljni sadržajem?',
      answer: 'Revizije su uključene u sve pakete. Ako nešto ne odgovara brand voiceu ili viziji, jednostavno javite i prilagodimo.',
    },
  ],
}

const relatedServices = [
  {
    title: 'Studio',
    slug: 'studio',
    description: 'Podcast snimanje i video produkcija',
  },
  {
    title: 'Video i Animacija',
    slug: 'video-animacija',
    description: 'Video sadržaj za društvene mreže',
  },
  {
    title: 'Fotografija',
    slug: 'fotografija',
    description: 'Vizuali za vaš content',
  },
]

export default function SadrzajDrustveneContent() {
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

            <motion.h1 initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} className="text-[clamp(2.5rem,7vw,5rem)] font-bold leading-[1.05] tracking-tight mb-6 will-change-transform">
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
                    Započnite suradnju
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </span>
                </motion.button>
              </Link>
              <Link href="/work">
                <motion.button whileHover={{ scale: 1.02, borderColor: '#00FF94', transition: { type: "spring", stiffness: 400, damping: 30 } }} whileTap={{ scale: 0.98 }} className="px-8 py-5 bg-transparent border-2 border-[#88939D]/30 text-white font-bold rounded-xl text-lg transition-all duration-300 will-change-transform">
                  Pogledajte primjere
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
              Što nudimo
            </motion.h2>
            <motion.p initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }} animate={featuresInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }} className="text-xl md:text-2xl text-[#88939D] max-w-3xl will-change-transform">
              Kompletne content usluge od strategije do implementacije.
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

      {/* Content Types Section */}
      <section className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="mb-16 text-center will-change-transform">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Vrste sadržaja</h2>
            <p className="text-lg md:text-xl text-[#88939D] max-w-2xl mx-auto">Od social media do emaila — pokrivamo sve formate i platforme.</p>
          </motion.div>

          <div className="flex flex-wrap gap-4 justify-center">
            {service.contentTypes.map((type, index) => (
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
                Zašto raditi<br /><span className="text-[#00FF94]">s nama</span>
              </h2>
              <p className="text-lg md:text-xl text-[#88939D] leading-relaxed">
                Sadržaj je kralj — ali samo ako je strateški osmišljen, konzistentan i kvalitetan.
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
            <p className="text-lg md:text-xl text-[#88939D]">Od strategije do kontinuirane optimizacije.</p>
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
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Mjesečni paketi</h2>
            <p className="text-lg md:text-xl text-[#88939D] max-w-2xl mx-auto">Fleksibilni paketi prilagođeni vašim potrebama i budžetu.</p>
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
            <p className="text-lg md:text-xl text-[#88939D]">Sve što trebate znati o našim content uslugama.</p>
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
            <p className="text-lg md:text-xl text-[#88939D]">Obogatite svoj sadržaj s našim dodatnim uslugama.</p>
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
              Spremni za sadržaj koji<br /><span className="text-[#00FF94]">radi za vas?</span>
            </h2>
            <p className="text-lg md:text-xl text-[#88939D] mb-12 max-w-2xl mx-auto">Razgovarajmo o vašim content potrebama i stvorimo strategiju koja donosi rezultate.</p>
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
