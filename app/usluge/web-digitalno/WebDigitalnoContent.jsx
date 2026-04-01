// app/usluge/web-digitalno/WebDigitalnoContent.jsx

'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { useState } from 'react'

const service = {
  title: 'Web i Aplikacije',
  tagline: 'Web stranice i aplikacije koje konvertiraju',
  description: 'Brze, moderne web stranice, web aplikacije i mobilne aplikacije. Od dizajna do razvoja, SEO optimizacije i kontinuiranog održavanja — sve na jednom mjestu.',

  icon: (
    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),

  features: [
    {
      title: 'Web Dizajn',
      description: 'Moderni, responzivni dizajni prilagođeni vašem brandu i optimizirani za konverzije.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
    },
    {
      title: 'Web i Aplikacije',
      description: 'Next.js, React i moderne tehnologije za brzinu i skalabilnost.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      title: 'E-commerce',
      description: 'Shopify, WooCommerce i custom web shopovi koji prodaju.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      title: 'Web Aplikacije',
      description: 'Custom web aplikacije, SaaS platforme, CRM sustavi i digitalni alati za vaše poslovanje.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    },
    {
      title: 'Mobilne Aplikacije',
      description: 'React Native i cross-platform mobilne aplikacije za iOS i Android.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'SEO Optimizacija',
      description: 'Tehnička i sadržajna SEO optimizacija za bolju vidljivost na Google-u.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      title: 'Održavanje',
      description: 'Kontinuirano održavanje, sigurnosne nadogradnje i tehnička podrška.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ],

  process: [
    {
      number: '01',
      title: 'Discovery',
      description: 'Analiziramo vaše ciljeve, konkurenciju, ciljnu publiku i tehničke zahtjeve.',
      duration: '1 tjedan',
    },
    {
      number: '02',
      title: 'Wireframing',
      description: 'Planiramo strukturu i korisničko iskustvo prije vizualnog dizajna.',
      duration: '1 tjedan',
    },
    {
      number: '03',
      title: 'Dizajn',
      description: 'Izrađujemo vizualni dizajn svih stranica s iteracijama do savršenstva.',
      duration: '2-3 tjedna',
    },
    {
      number: '04',
      title: 'Razvoj',
      description: 'Kodiramo web stranicu s fokusom na brzinu, SEO i pristupačnost.',
      duration: '3-6 tjedana',
    },
    {
      number: '05',
      title: 'Testiranje',
      description: 'Testiramo na svim uređajima, optimiziramo performanse i ispravljamo bugove.',
      duration: '1 tjedan',
    },
    {
      number: '06',
      title: 'Lansiranje',
      description: 'Objavljujemo web stranicu, postavljamo analitiku i predajemo vama.',
      duration: '2-3 dana',
    },
  ],

  benefits: [
    {
      title: 'Brzina',
      description: 'PageSpeed 95+ garantirano. Spore web stranice gube kupce — vaša neće biti spora.',
    },
    {
      title: 'Konverzije',
      description: 'Dizajn usmjeren na konverzije, s jasnim CTA-ovima i optimiziranim korisničkim putevima.',
    },
    {
      title: 'SEO',
      description: 'Tehnički ispravna struktura, brzo učitavanje i optimizirani sadržaj za Google.',
    },
    {
      title: 'Sigurnost',
      description: 'SSL certifikati, redovite nadogradnje i sigurnosne prakse po industriji.',
    },
  ],

  techStack: [
    { name: 'Next.js', category: 'Frontend' },
    { name: 'React', category: 'Frontend' },
    { name: 'TailwindCSS', category: 'Frontend' },
    { name: 'TypeScript', category: 'Frontend' },
    { name: 'Framer Motion', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Supabase', category: 'Backend' },
    { name: 'PostgreSQL', category: 'Backend' },
    { name: 'Vercel', category: 'Hosting' },
    { name: 'Shopify', category: 'E-commerce' },
    { name: 'WooCommerce', category: 'E-commerce' },
    { name: 'Stripe', category: 'Plaćanja' },
  ],

  pricing: {
    ranges: [
      {
        size: 'Landing Page',
        price: '€1.500 - €3.000',
        description: 'Jednostranična prezentacija za proizvod ili uslugu',
        features: ['1 stranica', 'Responzivni dizajn', 'SEO osnove', 'Kontakt forma', 'Google Analytics', 'SSL certifikat']
      },
      {
        size: 'Business Web',
        price: '€4.000 - €8.000',
        description: 'Profesionalna web stranica za tvrtke',
        features: ['5-10 stranica', 'Custom dizajn', 'CMS sustav', 'Blog sekcija', 'SEO optimizacija', 'Hosting 1 godina', 'Tehnička podrška']
      },
      {
        size: 'E-commerce',
        price: '€8.000 - €20.000+',
        description: 'Kompletan web shop spreman za prodaju',
        features: ['Neograničeno proizvoda', 'Shopify/Custom', 'Integracija plaćanja', 'Upravljanje zalihama', 'Email marketing', 'Analitika prodaje', 'Obuka za korištenje']
      },
    ],
    note: 'Cijene ovise o broju stranica, kompleksnosti funkcionalnosti i integracija. Web aplikacije i custom rješenja kotiraju se zasebno. Mjesečno održavanje od €150/mj.',
  },

  faqs: [
    {
      question: 'Koliko traje izrada web stranice?',
      answer: 'Landing page 2-4 tjedna, business web 6-10 tjedana, e-commerce 10-16 tjedana. Ovisno o kompleksnosti i brzini feedbacka s vaše strane.',
    },
    {
      question: 'Mogu li sam uređivati sadržaj?',
      answer: 'Da! Implementiramo user-friendly CMS sustave (Sanity, Contentful, ili WordPress) koji vam omogućuju jednostavno uređivanje teksta, slika i ostaloga bez tehničkog znanja.',
    },
    {
      question: 'Što je s hostingom i domenom?',
      answer: 'Možemo preuzeti kompletnu brigu o hostingu i domeni, ili raditi s vašim postojećim pružateljem. Preporučujemo Vercel za Next.js projekte zbog performansi.',
    },
    {
      question: 'Radite li redizajn postojećih stranica?',
      answer: 'Apsolutno! Analiziramo trenutnu stranicu, identificiramo probleme i predlažemo optimalna rješenja — bilo da je riječ o vizualnom osvježenju ili kompletnoj izradi iznova.',
    },
    {
      question: 'Kakva je garancija brzine?',
      answer: 'Garantiramo PageSpeed score 95+ za sve naše projekte. Ako ga ne postignemo, radimo besplatne optimizacije dok ga ne dostignemo.',
    },
    {
      question: 'Nudite li održavanje nakon lansiranja?',
      answer: 'Da, nudimo mjesečne pakete održavanja koji uključuju sigurnosne nadogradnje, backup, tehničku podršku i manje izmjene sadržaja.',
    },
  ],
}

const relatedServices = [
  {
    title: 'Strategija i Branding',
    slug: 'strategija-branding',
    description: 'Brand identitet prije web stranice',
  },
  {
    title: 'Fotografija',
    slug: 'fotografija',
    description: 'Profesionalne fotografije za web',
  },
  {
    title: 'Video i Animacija',
    slug: 'video-animacija',
    description: 'Video sadržaj za web stranice',
  },
]

export default function WebDigitalnoContent() {
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
                    Zatražite ponudu
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </span>
                </motion.button>
              </Link>
              <Link href="/work">
                <motion.button whileHover={{ scale: 1.02, borderColor: '#00FF94', transition: { type: "spring", stiffness: 400, damping: 30 } }} whileTap={{ scale: 0.98 }} className="px-8 py-5 bg-transparent border-2 border-[#88939D]/30 text-white font-bold rounded-xl text-lg transition-all duration-300 will-change-transform">
                  Pogledajte radove
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
              Kompletna digitalna rješenja od dizajna do objave i održavanja.
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

      {/* Tech Stack Section */}
      <section className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="mb-16 text-center will-change-transform">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Tehnologije</h2>
            <p className="text-lg md:text-xl text-[#88939D] max-w-2xl mx-auto">Moderni tech stack za brze i skalabilne web stranice.</p>
          </motion.div>

          <div className="flex flex-wrap gap-4 justify-center">
            {service.techStack.map((tech, index) => (
              <motion.div key={index} initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }} whileHover={{ scale: 1.05, y: -3, borderColor: '#00FF94', transition: { type: "spring", stiffness: 400, damping: 30 } }} className="px-6 py-3 bg-transparent border-2 border-[#88939D]/20 rounded-xl transition-all duration-300 will-change-transform">
                <span className="font-medium text-white">{tech.name}</span>
                <span className="text-xs text-[#88939D] ml-2">({tech.category})</span>
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
                Vaša web stranica je najvažniji prodajni alat. Mi je gradimo da radi za vas 24/7.
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
            <p className="text-lg md:text-xl text-[#88939D]">Od ideje do objave — transparentan i efikasan workflow.</p>
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
            <p className="text-lg md:text-xl text-[#88939D] max-w-2xl mx-auto">Transparentne cijene za različite potrebe i budžete.</p>
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
            <p className="text-lg md:text-xl text-[#88939D]">Sve što trebate znati o našim web uslugama.</p>
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
            <p className="text-lg md:text-xl text-[#88939D]">Kompletna digitalna transformacija s našim dodatnim uslugama.</p>
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
              Spremni za web stranicu koja<br /><span className="text-[#00FF94]">konvertira?</span>
            </h2>
            <p className="text-lg md:text-xl text-[#88939D] mb-12 max-w-2xl mx-auto">Razgovarajmo o vašem projektu i stvorimo digitalnu prisutnost koja donosi rezultate.</p>
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
