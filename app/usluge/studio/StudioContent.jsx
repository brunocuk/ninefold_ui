// app/usluge/studio/StudioContent.jsx

'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { useState } from 'react'

const service = {
  title: 'Studio',
  tagline: 'Vaš prostor za kreativnost',
  description: 'Profesionalno opremljen studio za video snimanje, podcast produkciju i fotografiju. Koristimo ga za naše projekte, a dostupan je i za najam — s ili bez naše produkcijske podrške.',

  icon: (
    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  ),

  features: [
    {
      title: 'Podcast Snimanje',
      description: 'Profesionalni mikrofoni, zvučna izolacija i oprema za snimanje podcasta vrhunske kvalitete.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
    },
    {
      title: 'Video Snimanje',
      description: 'Profesionalne kamere, rasvjeta i pozadine za korporativne videe, intervjue i edukativni sadržaj.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Fotografski Set',
      description: 'Studijska rasvjeta, pozadine i oprema za produktnu, portretnu i korporativnu fotografiju.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: 'Najam Studija',
      description: 'Iznajmite studio za vlastite projekte — po satu ili cijeli dan, s ili bez naše tehničke podrške.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Livestream',
      description: 'Oprema i setup za profesionalni livestream događanja, webinara i online prezentacija.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg>
      ),
    },
    {
      title: 'Postprodukcija',
      description: 'Montaža, miksanje zvuka i finalizacija vašeg podcast ili video sadržaja u studiju.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
    },
  ],

  studioFeatures: [
    'Zvučna izolacija',
    'Profesionalni mikrofoni (Shure, Rode)',
    'Multi-kamera setup',
    'LED rasvjetni paneli',
    'Teleprompter',
    'Zelena pozadina (green screen)',
    'Razne studijske pozadine',
    'Klimatizacija',
    'Wi-Fi',
    'Kuhinja i čekaonica',
  ],

  process: [
    {
      number: '01',
      title: 'Rezervacija',
      description: 'Kontaktirajte nas s datumom, trajanjem i vrstom projekta. Provjeravamo dostupnost i šaljemo ponudu.',
      duration: '1 dan',
    },
    {
      number: '02',
      title: 'Priprema',
      description: 'Dogovaramo tehničke detalje, opremu i eventualnu produkcijsku podršku za vaš projekt.',
      duration: '1-2 dana',
    },
    {
      number: '03',
      title: 'Snimanje',
      description: 'Dolazite u studio, sve je spremno. Mi smo tu za tehničku podršku ako je potrebna.',
      duration: 'Po dogovoru',
    },
    {
      number: '04',
      title: 'Postprodukcija',
      description: 'Opcionalno — možemo preuzeti montažu, miksanje i finalizaciju vašeg sadržaja.',
      duration: '3-7 dana',
    },
  ],

  benefits: [
    {
      title: 'Profesionalna oprema',
      description: 'Vrhunska oprema koju ne morate kupovati — kamere, mikrofoni, rasvjeta, sve je uključeno.',
    },
    {
      title: 'Fleksibilnost',
      description: 'Iznajmite samo prostor ili dodajte našu produkcijsku ekipu — kako vam odgovara.',
    },
    {
      title: 'Lokacija',
      description: 'Studio u Zagrebu, lako dostupan s parkingom i svim potrebnim sadržajima.',
    },
    {
      title: 'Podrška',
      description: 'Tehnička pomoć uvijek dostupna. Ne morate biti stručnjak za opremu.',
    },
  ],

  pricing: {
    ranges: [
      {
        size: 'Po satu',
        price: '€50 - €80/sat',
        description: 'Idealno za kratke sessione i podcast epizode',
        features: ['Pristup studiju', 'Osnovna oprema', 'Wi-Fi i klima', 'Min. 2 sata']
      },
      {
        size: 'Pola dana',
        price: '€200 - €300',
        description: 'Do 4 sata snimanja',
        features: ['Pristup studiju', 'Sva oprema', 'Tehnička podrška', 'Kava i osvježenje']
      },
      {
        size: 'Cijeli dan',
        price: '€350 - €500',
        description: 'Do 8 sati snimanja',
        features: ['Ekskluzivni pristup', 'Sva oprema', 'Tehničar uključen', 'Kava i osvježenje', 'Pomoć pri setupu']
      },
    ],
    note: 'Cijene ovise o potrebnoj opremi i razini produkcijske podrške. Postprodukcija (montaža, miksanje) naplaćuje se zasebno. Popusti za redovite klijente.',
  },

  faqs: [
    {
      question: 'Što je uključeno u najam studija?',
      answer: 'Osnovni najam uključuje pristup prostoru, osnovnu rasvjetu i klimatizaciju. Profesionalni mikrofoni, kamere i dodatna oprema dostupni su uz doplatu ili u paketu pola/cijeli dan.',
    },
    {
      question: 'Trebam li donijeti vlastitu opremu?',
      answer: 'Ne morate — imamo svu potrebnu opremu. Ali ako preferirate vlastitu opremu, slobodno je donesite. Studio je kompatibilan sa svim standardnim formatima.',
    },
    {
      question: 'Mogu li snimati podcast bez iskustva?',
      answer: 'Apsolutno! Naš tehničar može voditi cijeli proces — vi samo dođete, sjednete i pričate. Brinemo se za zvuk, snimanje i sve tehničke detalje.',
    },
    {
      question: 'Koliko osoba može biti u studiju?',
      answer: 'Studio komforno prima do 4 osobe za podcast/intervju format. Za veće produkcije, kontaktirajte nas za prilagođena rješenja.',
    },
    {
      question: 'Nudite li postprodukciju?',
      answer: 'Da! Možemo preuzeti kompletnu postprodukciju — montažu videa, miksanje zvuka, dodavanje glazbe, grafike i pripremu za objavu.',
    },
    {
      question: 'Kako rezervirati studio?',
      answer: 'Pošaljite nam upit s preferiranim datumom i vrstom projekta. Odgovaramo unutar 24 sata s dostupnošću i ponudom.',
    },
  ],

  relatedServices: [
    {
      title: 'Video i Animacija',
      slug: 'video-animacija',
      description: 'Profesionalna video produkcija za sve platforme.',
    },
    {
      title: 'Fotografija',
      slug: 'fotografija',
      description: 'Studijska i lokacijska fotografija za vaš brand.',
    },
    {
      title: 'Sadržaj i Društvene Mreže',
      slug: 'sadrzaj-drustvene-mreze',
      description: 'Content strategija i upravljanje društvenim mrežama.',
    },
  ],
}

export default function StudioContent() {
  const prefersReducedMotion = useReducedMotion()
  const [openFaq, setOpenFaq] = useState(null)

  const [heroRef, heroInView] = useInView({ threshold: 0.15, triggerOnce: true })
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [equipmentRef, equipmentInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [benefitsRef, benefitsInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [processRef, processInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [pricingRef, pricingInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [faqRef, faqInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [relatedRef, relatedInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [ctaRef, ctaInView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <div className="min-h-screen bg-[#0F0F0F]">

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center bg-[#0F0F0F] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-[#00CC78]/20 via-[#00FF94]/10 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="mb-6 will-change-transform"
              >
                <Link href="/usluge" className="inline-flex items-center gap-2 text-[#88939D] hover:text-[#00FF94] transition-colors duration-300">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Sve usluge
                </Link>
              </motion.div>

              <motion.div
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="mb-8 will-change-transform"
              >
                <span className="inline-block px-4 py-2 bg-[#00FF94]/10 border border-[#00FF94]/30 rounded-full text-[#00FF94] text-sm font-mono uppercase tracking-wider">
                  {service.title}
                </span>
              </motion.div>

              <motion.h1
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.1] tracking-tight mb-6 will-change-transform"
              >
                <span className="text-white">{service.tagline.split(' ').slice(0, -1).join(' ')} </span>
                <span className="text-[#00FF94]">{service.tagline.split(' ').slice(-1)}</span>
              </motion.h1>

              <motion.p
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-xl text-[#88939D] leading-relaxed mb-8 will-change-transform"
              >
                {service.description}
              </motion.p>

              <motion.div
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row gap-4 will-change-transform"
              >
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative px-8 py-4 bg-gradient-to-r from-[#00FF94] to-[#00CC78] text-black font-bold rounded-xl text-lg overflow-hidden transition-all will-change-transform shadow-lg shadow-[#00FF94]/20 hover:shadow-xl hover:shadow-[#00FF94]/30"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Rezervirajte studio
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </motion.button>
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
              animate={heroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative hidden lg:block will-change-transform"
            >
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/20 to-[#00CC78]/10 rounded-3xl" />
                <div className="absolute inset-4 border-2 border-[#00FF94]/30 rounded-2xl flex items-center justify-center">
                  <div className="w-32 h-32 text-[#00FF94]">
                    {service.icon}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94] to-transparent opacity-30" />
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16 will-change-transform"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Što možete snimati u <span className="text-[#00FF94]">našem studiju</span>
            </h2>
            <p className="text-xl text-[#88939D] max-w-3xl mx-auto">
              Od podcasta do profesionalnih video produkcija — studio je opremljen za sve vrste projekata.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative will-change-transform"
              >
                <motion.div
                  className="relative h-full p-8 rounded-2xl bg-transparent border-2 border-[#88939D]/20 transition-all duration-500 hover:border-[#00FF94] overflow-hidden"
                  whileHover={{ y: -5 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/5 via-[#00CC78]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-[#00FF94]/10 flex items-center justify-center text-[#00FF94] mb-6 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00FF94] transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-[#88939D] leading-relaxed group-hover:text-white/70 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment Section */}
      <section ref={equipmentRef} className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            animate={equipmentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16 will-change-transform"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Oprema <span className="text-[#00FF94]">studija</span>
            </h2>
            <p className="text-xl text-[#88939D] max-w-3xl mx-auto">
              Sve što vam treba za profesionalnu produkciju — bez kupovanja skupe opreme.
            </p>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
            animate={equipmentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap justify-center gap-4"
          >
            {service.studioFeatures.map((item, index) => (
              <motion.span
                key={item}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
                animate={equipmentInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                className="px-6 py-3 bg-transparent border-2 border-[#88939D]/20 rounded-full text-white hover:border-[#00FF94] hover:text-[#00FF94] transition-all duration-300 cursor-default"
              >
                {item}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section ref={benefitsRef} className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16 will-change-transform"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Zašto naš <span className="text-[#00FF94]">studio</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
                animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-center p-6"
              >
                <h3 className="text-xl font-bold text-[#00FF94] mb-3">{benefit.title}</h3>
                <p className="text-[#88939D]">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section ref={processRef} className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            animate={processInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16 will-change-transform"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Kako <span className="text-[#00FF94]">funkcionira</span>
            </h2>
            <p className="text-xl text-[#88939D] max-w-3xl mx-auto">
              Jednostavan proces od rezervacije do gotovog sadržaja.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {service.process.map((step, index) => (
              <motion.div
                key={step.number}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
                animate={processInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 + index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <div className="text-6xl font-bold text-[#00FF94]/20 mb-4">{step.number}</div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-[#88939D] mb-2">{step.description}</p>
                <span className="text-sm text-[#00FF94]">{step.duration}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingRef} className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            animate={pricingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16 will-change-transform"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Cijene <span className="text-[#00FF94]">najma</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {service.pricing.ranges.map((tier, index) => (
              <motion.div
                key={tier.size}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
                animate={pricingInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 + index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className={`relative p-8 rounded-2xl border-2 ${index === 2 ? 'border-[#00FF94]' : 'border-[#88939D]/20'} transition-all duration-500 hover:border-[#00FF94]`}
              >
                {index === 2 && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#00FF94] text-black text-sm font-bold rounded-full">
                    Najpopularnije
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-2">{tier.size}</h3>
                <div className="text-3xl font-bold text-[#00FF94] mb-4">{tier.price}</div>
                <p className="text-[#88939D] mb-6">{tier.description}</p>
                <ul className="space-y-3">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-white">
                      <svg className="w-5 h-5 text-[#00FF94] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={pricingInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-center text-[#88939D] max-w-3xl mx-auto"
          >
            {service.pricing.note}
          </motion.p>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={faqRef} className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16 will-change-transform"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Česta <span className="text-[#00FF94]">pitanja</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {service.faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                animate={faqInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="border-2 border-[#88939D]/20 rounded-2xl overflow-hidden hover:border-[#00FF94]/50 transition-colors duration-300"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4"
                >
                  <span className="text-lg font-medium text-white">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-[#00FF94] flex-shrink-0"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === index ? 'auto' : 0, opacity: openFaq === index ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 text-[#88939D] leading-relaxed">{faq.answer}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section ref={relatedRef} className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            animate={relatedInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16 will-change-transform"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Povezane <span className="text-[#00FF94]">usluge</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {service.relatedServices.map((related, index) => (
              <motion.div
                key={related.slug}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
                animate={relatedInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link href={`/usluge/${related.slug}`}>
                  <motion.div
                    className="group relative h-full p-8 rounded-2xl border-2 border-[#88939D]/20 transition-all duration-500 hover:border-[#00FF94]"
                    whileHover={{ y: -5 }}
                  >
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00FF94] transition-colors duration-300">
                      {related.title}
                    </h3>
                    <p className="text-[#88939D] mb-4">{related.description}</p>
                    <span className="inline-flex items-center gap-2 text-[#00FF94] font-medium">
                      Saznajte više
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border-t border-[#88939D]/20 pt-20"
          >
            <div className="max-w-2xl">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Spremni rezervirati studio?
              </h3>
              <p className="text-lg text-[#88939D]">
                Javite nam se s vašim datumom i vrstom projekta. Odgovaramo unutar 24 sata.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative px-8 py-5 bg-gradient-to-r from-[#00FF94] to-[#00CC78] text-black font-bold rounded-xl text-lg overflow-hidden transition-all will-change-transform shadow-lg shadow-[#00FF94]/20 hover:shadow-xl hover:shadow-[#00FF94]/30"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Rezervirajte termin
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#00FF94] to-transparent opacity-30" />
    </div>
  )
}
