// app/about/page.jsx

'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import Image from 'next/image'

export default function AboutPage() {
  const prefersReducedMotion = useReducedMotion()
  
  const [heroRef, heroInView] = useInView({
    threshold: 0.15,
    triggerOnce: true,
  })

  const [storyRef, storyInView] = useInView({
    threshold: 0.15,
    triggerOnce: true,
  })

  const [valuesRef, valuesInView] = useInView({
    threshold: 0.15,
    triggerOnce: true,
  })

  const [teamRef, teamInView] = useInView({
    threshold: 0.15,
    triggerOnce: true,
  })

  const values = [
    {
      number: '01',
      title: 'Kvaliteta na prvom mjestu',
      description: 'Svaki projekt koji radimo mora biti na najvišoj razini. Od web stranica do video produkcije - kompromis na kvaliteti nije opcija. Rezultati govore sami za sebe.',
    },
    {
      number: '02',
      title: 'Poštujemo rokove',
      description: 'Kad se obvežemo na rok, isporučujemo. Bilo da je riječ o lansiranju za 4 tjedna ili strogom PR roku, možete računati na nas bez kompromisa na kvaliteti.',
    },
    {
      number: '03',
      title: 'Pravo partnerstvo',
      description: 'Vaš uspjeh je naš uspjeh. Radimo kao produžetak vašeg tima, ne samo kao dobavljač. Od prvog razgovora do dugo nakon završetka projekta, tu smo za vas.',
    },
    {
      number: '04',
      title: 'Iskrena komunikacija',
      description: 'Bez žargona, bez iznenađenja, bez skrivenih troškova. Govorimo jasno o mogućnostima, zahtjevima i očekivanjima. Transparentnost gradi povjerenje.',
    },
  ]

  const stats = [
    { value: '100+', label: 'Isporučenih projekata' },
    { value: '2019', label: 'Godina osnivanja' },
    { value: '99/100', label: 'Prosječna ocjena' },
    { value: 'Zagreb', label: 'Sjedište u Hrvatskoj' },
  ]

  const team = [
    {
      name: 'Bruno Čukić',
      role: 'Web Development',
      bio: 'Živi u kodu od 2019. Opsjednut brzinom, čistim dizajnom i pikselima na pravom mjestu. Vjerojatno debugira nešto upravo sad.',
      id: "1"
    },
    {
      name: 'Petar Zirdum',
      role: 'Video & Foto',
      bio: 'Vidi kadrove gdje drugi vide kaos. Pretvara proizvode u zvijezde i brendove u priče koje se pamte.',
      id: "2"
    },
  ]

  const clients = [
    { name: 'Klijent 1' },
    { name: 'Klijent 2' },
    { name: 'Klijent 3' },
    { name: 'Klijent 4' },
    { name: 'Klijent 5' },
    { name: 'Klijent 6' },
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
                O nama
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[1.05] tracking-tight mb-8 will-change-transform"
            >
              <span className="block text-white">
                Kreativna agencija
              </span>
              <span className="block text-white">
                na koju se možete{' '}
                <span className="text-[#00FF94]">osloniti</span>.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl md:text-2xl text-[#88939D] leading-relaxed max-w-3xl mb-12 will-change-transform"
            >
              Full-service kreativna agencija iz Zagreba. Branding, web, video produkcija i fotografija
              za hrvatske tvrtke koje ne prihvaćaju kompromise na kvaliteti.
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-[#88939D]/20 pt-12"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.8 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="will-change-transform"
                >
                  <motion.div 
                    className="text-4xl md:text-5xl font-bold text-white mb-2"
                    whileHover={{ 
                      scale: 1.05,
                      color: '#00FF94',
                      transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 30
                      }
                    }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-[#88939D]">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94] to-transparent opacity-30" />
      </section>

      {/* Story Section */}
      <section ref={storyRef} className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
        
        {/* Subtle gradient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />

        {/* Noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="max-w-4xl">
            {/* Section Header */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
              animate={storyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-12 will-change-transform"
            >
              <motion.h2
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                animate={storyInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 will-change-transform"
              >
                Šest godina usavršavanja
                <br />
                našeg zanata.
              </motion.h2>
            </motion.div>

            {/* Story content */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
              animate={storyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 text-lg md:text-xl text-[#88939D] leading-relaxed will-change-transform"
            >
              <motion.p
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
                animate={storyInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                NineFold je osnovan 2019. godine s jednostavnim zapažanjem: previše hrvatskih tvrtki
                bilo je zaglavljeno sa sporim, zastarjelim web stranicama koje su izgledale dobro,
                ali nisu funkcionirale. Uložili su novac, ali se nisu mogli dugoročno osloniti na svoje stranice.
              </motion.p>
              <motion.p
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
                animate={storyInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                Ono što je počelo kao izrada web stranica preraslo je u sveobuhvatnu kreativnu agenciju.
                Danas nudimo sve pod jednim krovom: strategiju i branding, web razvoj, video produkciju,
                fotografiju i upravljanje društvenim mrežama. Naučili smo što odvaja dobar rad od izvrsnog.
              </motion.p>
              <motion.p
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
                animate={storyInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                Danas se specijaliziramo za cjelovita kreativna rješenja - od prvog brainstorminga
                do finalne isporuke. Kombiniramo strateško razmišljanje s tehničkom izvrsnošću
                jer znamo da pravi rezultati dolaze samo kad sve komponente rade zajedno.
              </motion.p>
              <motion.p
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
                animate={storyInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                Ne pokušavamo biti najveća agencija u Zagrebu. Fokusirani smo na to da budemo
                najpouzdaniji partner kojeg zovete kad kvaliteta nije upitna. Svaki projekt je
                prilika da dokažemo da se ulaganje u pravi kreativni tim višestruko isplati.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section ref={valuesRef} className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
        
        {/* Subtle gradient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />

        {/* Noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          
          {/* Section Header */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-20 will-change-transform"
          >
            <motion.h2
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={valuesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-3xl will-change-transform"
            >
              Naše vrijednosti
            </motion.h2>

            <motion.p
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={valuesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl md:text-2xl text-[#88939D] max-w-3xl will-change-transform"
            >
              Principi koji vode svaki projekt na kojem radimo.
            </motion.p>
          </motion.div>

          {/* Value Cards */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.number}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ 
                  duration: 1, 
                  delay: 0.45 + index * 0.12,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="group relative will-change-transform"
              >
                {/* Card */}
                <motion.div 
                  className="relative h-full p-8 lg:p-10 rounded-2xl bg-transparent border-2 border-[#88939D]/20 transition-all duration-500 hover:border-[#00FF94] overflow-hidden will-change-transform"
                  whileHover={{ 
                    y: -5,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 25
                    }
                  }}
                >
                  
                  {/* Hover gradient background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/5 via-[#00CC78]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    initial={false}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    
                    {/* Number badge */}
                    <motion.div 
                      className="inline-flex items-center gap-3 mb-6"
                      whileHover={{ 
                        scale: 1.1,
                        transition: {
                          type: "spring",
                          stiffness: 400,
                          damping: 30
                        }
                      }}
                    >
                      <div className="text-3xl font-bold font-mono text-[#00FF94]">
                        {value.number}
                      </div>
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 group-hover:text-[#00FF94] transition-colors duration-300">
                      {value.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[#88939D] leading-relaxed group-hover:text-white/70 transition-colors duration-300">
                      {value.description}
                    </p>
                  </div>

                  {/* Bottom gradient line accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section ref={teamRef} className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
        
        {/* Subtle gradient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />

        {/* Noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          
          {/* Section Header */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-20 will-change-transform"
          >
            <motion.h2
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={teamInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-3xl will-change-transform"
            >
              Tim iza vašeg
              <br />
              <span className="text-[#00FF94]">uspjeha</span>
            </motion.h2>

            <motion.p
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={teamInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl md:text-2xl text-[#88939D] max-w-3xl will-change-transform"
            >
              Fokusiran tim posvećen isporuci izvanrednih rezultata za svakog klijenta.
            </motion.p>
          </motion.div>

          {/* Team Cards */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={member.id}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
                animate={teamInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 1,
                  delay: 0.45 + index * 0.15,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="group will-change-transform"
              >
                <motion.div
                  className="relative h-full rounded-2xl bg-[#1a1a1a]/50 border-2 border-[#88939D]/20 overflow-hidden transition-all duration-500 hover:border-[#00FF94]/60 hover:shadow-2xl hover:shadow-[#00FF94]/20"
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  {/* Image */}
                  <div className="relative aspect-[4/5] bg-gradient-to-br from-[#1a1a1a] to-[#0F0F0F] overflow-hidden">
                    <motion.div
                      className="relative w-full h-full"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Image
                        src={`/images/team/${member.id}.webp`}
                        alt={member.name}
                        fill
                        className="object-cover will-change-transform"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </motion.div>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

                    {/* Green glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/10 via-transparent to-[#00CC78]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Content */}
                  <div className="relative p-8">
                    <h3 className="text-2xl lg:text-3xl font-bold mb-2 text-white group-hover:text-[#00FF94] transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-[#00FF94] text-sm mb-4 uppercase tracking-wider font-mono">
                      {member.role}
                    </p>
                    <p className="text-[#88939D] leading-relaxed group-hover:text-white/70 transition-colors duration-300">
                      {member.bio}
                    </p>
                  </div>

                  {/* Bottom gradient line accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00FF94] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">

        {/* Subtle gradient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />

        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">

          {/* Section Header */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, threshold: 0.15 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16 will-change-transform"
          >
            <motion.h2
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, threshold: 0.15 }}
              transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 will-change-transform"
            >
              Radili smo s <span className="text-[#00FF94]">najboljima</span>
            </motion.h2>

            <motion.p
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, threshold: 0.15 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl md:text-2xl text-[#88939D] max-w-2xl mx-auto will-change-transform"
            >
              Ponosni smo na suradnju s vodećim hrvatskim brendovima.
            </motion.p>
          </motion.div>

          {/* Client Logos Grid */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, threshold: 0.15 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8"
          >
            {clients.map((client, index) => (
              <motion.div
                key={client.name}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, threshold: 0.15 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5 + index * 0.1,
                  ease: [0.16, 1, 0.3, 1]
                }}
                whileHover={{
                  scale: 1.05,
                  borderColor: 'rgba(0, 255, 148, 0.5)',
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                  }
                }}
                className="flex items-center justify-center p-8 rounded-xl bg-[#1a1a1a]/50 border border-[#88939D]/10 hover:bg-[#1a1a1a] transition-all duration-300 will-change-transform"
              >
                <span className="text-xl font-bold text-[#88939D]/50 group-hover:text-white transition-colors">
                  {client.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">

        {/* Subtle gradient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />

        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border-t border-[#88939D]/20 pt-20">
            <div className="max-w-2xl">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Spremni izgraditi nešto sjajno?
              </h3>
              <p className="text-lg text-[#88939D]">
                Razgovarajmo o vašem projektu i kako vam možemo pomoći da uspijete.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <motion.button
                  whileHover={{ 
                    scale: 1.02,
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 30
                    }
                  }}
                  whileTap={{ 
                    scale: 0.98,
                    transition: { duration: 0.1 }
                  }}
                  className="group relative px-8 py-5 bg-gradient-to-r from-[#00FF94] to-[#00CC78] text-black font-bold rounded-xl text-lg overflow-hidden transition-all will-change-transform shadow-lg shadow-[#00FF94]/20 hover:shadow-xl hover:shadow-[#00FF94]/30"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Započnite projekt
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </motion.button>
              </Link>

              <Link href="/work">
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    borderColor: '#00FF94',
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 30
                    }
                  }}
                  whileTap={{
                    scale: 0.98,
                    transition: { duration: 0.1 }
                  }}
                  className="px-8 py-5 bg-transparent border-2 border-[#88939D]/30 text-white font-bold rounded-xl text-lg transition-colors duration-300 hover:text-[#00FF94] will-change-transform"
                >
                  Pogledajte radove
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#00FF94] to-transparent opacity-30" />
    </div>
  )
}