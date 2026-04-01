// app/usluge/page.jsx

'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'

export default function UslugePage() {
  const prefersReducedMotion = useReducedMotion()

  const [heroRef, heroInView] = useInView({
    threshold: 0.15,
    triggerOnce: true,
  })

  const services = [
    {
      number: '01',
      title: 'Strategija i Branding',
      slug: 'strategija-branding',
      tagline: 'Brandovi koji se pamte',
      description: 'Gradimo snažne brand identitete koji se ističu. Od istraživanja i strategije do kompletnog vizualnog sustava — stvaramo brandove koji ostavljaju trajan dojam.',
      features: ['Vizualni identitet', 'Pozicioniranje branda', 'Naming i tagline', 'Brand strategija', 'Dizajn sustav'],
      icon: (
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
        </svg>
      ),
    },
    {
      number: '02',
      title: 'Web i Aplikacije',
      slug: 'web-digitalno',
      tagline: 'Brzo, sigurno, skalabilno',
      description: 'Munjevito brze web stranice i aplikacije izgrađene s React i Next.js. Postižemo 95+ PageSpeed rezultate jer brzina nije opcija — ključna je za konverzije i SEO.',
      features: ['Web dizajn', 'Web razvoj', 'Web aplikacije', 'Mobilne aplikacije', 'E-commerce', 'SEO'],
      icon: (
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      number: '03',
      title: 'Video i Animacija',
      slug: 'video-animacija',
      tagline: 'Priče koje pokreću',
      description: 'TV reklame, korporativni video i sadržaj za društvene mreže. Profesionalna produkcija od ideje do finala — snimanje, montaža, color grading i motion graphics.',
      features: ['TV reklame', 'Korporativni video', 'Video za društvene mreže', 'Drone snimanje', 'Motion graphics', 'Postprodukcija'],
      icon: (
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
        </svg>
      ),
    },
    {
      number: '04',
      title: 'Fotografija',
      slug: 'fotografija',
      tagline: 'Slike koje prodaju',
      description: 'Profesionalna fotografija za web i marketing. Produktna, lifestyle, korporativna i interijerna fotografija — sve optimizirano za web i spremno za korištenje.',
      features: ['Produktna fotografija', 'Lifestyle fotografija', 'Korporativna fotografija', 'Interijerna fotografija', 'Web optimizacija'],
      icon: (
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
        </svg>
      ),
    },
    {
      number: '05',
      title: 'Sadržaj i Društvene Mreže',
      slug: 'sadrzaj-drustvene-mreze',
      tagline: 'Sadržaj koji angažira',
      description: 'Content strategija i kreacija za sve platforme. Od copywritinga do upravljanja kampanjama — sadržaj koji pretvara pratitelje u kupce.',
      features: ['Content strategija', 'Social media sadržaj', 'Copywriting', 'Upravljanje kampanjama', 'Analitika i izvještaji'],
      icon: (
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
      ),
    },
    {
      number: '06',
      title: 'Studio',
      slug: 'studio',
      tagline: 'Vaš prostor za kreativnost',
      description: 'Profesionalno opremljen studio za video snimanje, podcast produkciju i fotografiju. Dostupan za najam ili vaše projekte s našom produkcijskom podrškom.',
      features: ['Podcast snimanje', 'Video snimanje', 'Fotografski set', 'Najam studija', 'Livestream', 'Postprodukcija'],
      icon: (
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-[#0F0F0F]">

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center bg-[#0F0F0F] overflow-hidden">

        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Gradient glow in background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-[#00CC78]/20 via-[#00FF94]/10 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-20">

          <div className="max-w-5xl">
            {/* Label */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8 will-change-transform"
            >
              <span className="inline-block px-4 py-2 bg-[#00FF94]/10 border border-[#00FF94]/30 rounded-full text-[#00FF94] text-sm font-mono uppercase tracking-wider">
                Što Radimo
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[1.05] tracking-tight mb-6 will-change-transform"
            >
              <span className="block text-white">
                Usluge
              </span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl md:text-2xl text-[#00FF94] mb-8 will-change-transform"
            >
              Sve što vam treba za uspjeh — pod jednim krovom
            </motion.p>

            {/* Description */}
            <motion.p
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-xl text-[#88939D] leading-relaxed max-w-3xl will-change-transform"
            >
              Od strategije i brandinga do web razvoja, video produkcije i fotografije — kompletna kreativna rješenja koja stvarno funkcioniraju.
            </motion.p>
          </div>
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94] to-transparent opacity-30" />
      </section>

      {/* Services - Each Full Height */}
      {services.map((service, index) => {
        const ServiceSection = () => {
          const [ref, inView] = useInView({
            threshold: 0.3,
            triggerOnce: false,
          })

          return (
            <section
              ref={ref}
              className="relative min-h-screen flex items-center overflow-hidden"
            >
              {/* Dynamic gradient background */}
              <motion.div
                animate={{
                  opacity: inView ? 0.2 : 0,
                }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#00FF94]/30 via-[#00CC78]/10 to-transparent rounded-full blur-[150px] will-change-transform"
              />

              {/* Noise texture */}
              <div
                className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
              />

              <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-20">
                <div className="grid lg:grid-cols-[1fr,1.2fr] gap-12 lg:gap-20 items-center">

                  {/* Left - Content */}
                  <motion.div
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -50 }}
                    animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="will-change-transform"
                  >
                    {/* Icon */}
                    <motion.div
                      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
                      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{
                        scale: 1.1,
                        rotate: 5,
                        transition: {
                          type: "spring",
                          stiffness: 400,
                          damping: 30
                        }
                      }}
                      className="w-16 h-16 text-[#00FF94] mb-8 will-change-transform"
                    >
                      {service.icon}
                    </motion.div>

                    {/* Number */}
                    <div className="text-sm font-mono text-[#88939D] mb-4">
                      {service.number}
                    </div>

                    {/* Title */}
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                      {service.title}
                    </h2>

                    {/* Tagline */}
                    <p className="text-xl md:text-2xl text-[#00FF94] mb-6">
                      {service.tagline}
                    </p>

                    {/* Description */}
                    <p className="text-lg text-[#88939D] leading-relaxed mb-8">
                      {service.description}
                    </p>

                    {/* CTA */}
                    <Link href={"/usluge/" + service.slug}>
                      <motion.button
                        whileHover={{
                          scale: 1.05,
                          transition: {
                            type: "spring",
                            stiffness: 400,
                            damping: 30
                          }
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="group px-8 py-4 bg-gradient-to-r from-[#00FF94] to-[#00CC78] text-black font-bold rounded-xl text-lg shadow-lg shadow-[#00FF94]/20 hover:shadow-xl hover:shadow-[#00FF94]/30 transition-shadow duration-300 will-change-transform"
                      >
                        <span className="flex items-center gap-2">
                          Saznajte više
                          <svg
                            className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </motion.button>
                    </Link>
                  </motion.div>

                  {/* Right - Features Card */}
                  <motion.div
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 50 }}
                    animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="will-change-transform"
                  >
                    <motion.div
                      className="relative p-10 lg:p-12 rounded-3xl border-2 border-[#88939D]/20 bg-[#0A0A0A] overflow-hidden transition-all duration-500 hover:border-[#00FF94] will-change-transform"
                      whileHover={{
                        y: -5,
                        transition: {
                          type: "spring",
                          stiffness: 300,
                          damping: 25
                        }
                      }}
                    >

                      {/* Card glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/5 via-transparent to-transparent" />

                      <div className="relative z-10">
                        <h3 className="text-sm uppercase tracking-wider text-[#88939D] font-mono mb-8">
                          Što je uključeno
                        </h3>

                        <div className="space-y-4">
                          {service.features.map((feature, i) => (
                            <motion.div
                              key={i}
                              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                              transition={{ duration: 0.5, delay: 0.4 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                              whileHover={{
                                x: 5,
                                borderColor: 'rgba(0, 255, 148, 0.5)',
                                transition: {
                                  type: "spring",
                                  stiffness: 400,
                                  damping: 30
                                }
                              }}
                              className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 transition-all duration-300 will-change-transform"
                            >
                              <motion.svg
                                className="w-5 h-5 text-[#00FF94] flex-shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                                whileHover={{
                                  scale: 1.2,
                                  transition: {
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 30
                                  }
                                }}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </motion.svg>
                              <span className="text-white text-lg">{feature}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom gradient line */}
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94]/50 to-transparent" />
                    </motion.div>
                  </motion.div>
                </div>
              </div>


            </section>
          )
        }

        return <ServiceSection key={service.number} />
      })}

      {/* Final CTA */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-[#00FF94]/20 via-[#00CC78]/10 to-transparent rounded-full blur-[200px] will-change-transform" />
        </div>

        {/* Noise */}
        <div
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="will-change-transform"
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8">
              Izgradimo nešto
              <br />
              <span className="text-[#00FF94]">izvrsno zajedno</span>
            </h2>
            <p className="text-xl md:text-2xl text-[#88939D] mb-12 max-w-3xl mx-auto">
              Spremni za početak projekta? Razgovarajmo o vašim potrebama i kreirajmo rješenje koje donosi rezultate.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/contact">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 30
                    }
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-6 bg-gradient-to-r from-[#00FF94] to-[#00CC78] text-black font-bold rounded-xl text-xl shadow-lg shadow-[#00FF94]/20 hover:shadow-xl hover:shadow-[#00FF94]/30 transition-shadow duration-300 will-change-transform"
                >
                  Započnite projekt
                </motion.button>
              </Link>
              <Link href="/work">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    borderColor: 'rgba(0, 255, 148, 0.5)',
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 30
                    }
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-6 bg-white/5 border-2 border-white/10 text-white font-bold rounded-xl text-xl transition-all duration-300 will-change-transform"
                >
                  Pogledajte naše radove
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#00FF94] to-transparent opacity-30" />
    </div>
  )
}
