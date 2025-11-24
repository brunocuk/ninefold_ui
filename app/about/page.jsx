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
      title: 'Performance First',
      description: 'Every website we build is optimized for speed. 99/100 Lighthouse scores aren\'t a goal—they\'re the standard. Fast websites convert better, rank higher, and keep visitors engaged.',
    },
    {
      number: '02',
      title: 'Deadlines Matter',
      description: 'When we commit to a timeline, we deliver. Whether it\'s a 4-week launch or a hard PR deadline, you can count on us to meet it without compromising quality.',
    },
    {
      number: '03',
      title: 'Real Partnership',
      description: 'Your success is our success. We work as an extension of your team, not just a vendor. From the first conversation to long after launch, we\'re here to support your growth.',
    },
    {
      number: '04',
      title: 'Honest Communication',
      description: 'No jargon, no surprises, no hidden costs. We speak plainly about what\'s possible, what it takes, and what you can expect. Transparency builds trust.',
    },
  ]

  const stats = [
    { value: '20+', label: 'Projects delivered' },
    { value: '2019', label: 'Started building' },
    { value: '99/100', label: 'Avg. performance' },
    { value: 'Zagreb', label: 'Based in Croatia' },
  ]

  const team = [
    {
      name: 'Bruno Čukić',
      role: 'Founder & Lead Developer',
      bio: 'Writes code that doesn\'t break. Allergic to slow websites. Will argue about React for hours.',
      id: "1"
    },
    {
      name: 'Petar',
      role: 'Content Creator',
      bio: 'Points camera, magic happens. Your products will never look this good again. Brings the vibes.',
      id: "2"
    },
    {
      name: 'Development Team',
      role: 'Specialized Developers',
      bio: 'Senior devs on speed dial for when things get complicated. Backend wizards and API whisperers.',
      id: "3"
    },
    {
      name: 'Coffee',
      role: 'Chief Motivation Officer',
      bio: 'Powers every line of code. Makes impossible deadlines possible. Consumed in dangerous quantities.',
      id: "4"
    },
    {
      name: 'Debugging Porsche',
      role: 'Problem Solver',
      bio: 'Lives on Bruno\'s desk. Witnesses every bug fix and breakthrough. Never complains about working late.',
      id: "5"
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
                About Us
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
                Fast websites that
              </span>
              <span className="block text-white">
                businesses can{' '}
                <span className="text-[#00FF94]">rely on</span>.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl md:text-2xl text-[#88939D] leading-relaxed max-w-3xl mb-12 will-change-transform"
            >
              A specialized web development studio from Zagreb, building high-performance 
              websites for Croatian businesses who refuse to compromise on quality.
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
                Six years of refining
                <br />
                our craft.
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
                NineFold started in 2019 with a simple observation: too many Croatian businesses 
                were stuck with slow, outdated websites that looked good but didn't perform. 
                They'd invested money but couldn't rely on their sites long-term.
              </motion.p>
              <motion.p
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
                animate={storyInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                What began as building websites evolved into mastering the craft of web development. 
                Year after year, project after project, we pushed ourselves to deliver faster, 
                cleaner, more reliable work. We learned what separates good websites from great ones 
                and it's rarely what clients expect.
              </motion.p>
              <motion.p
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
                animate={storyInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                Today, we specialize in high performance websites that consistently score 97-100 
                on performance tests. Not because we chase metrics, but because speed and reliability 
                are the foundations of everything that matters online: user experience, conversions, 
                search rankings, and long term value.
              </motion.p>
              <motion.p
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
                animate={storyInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                We're not trying to be the biggest studio in Zagreb. We're focused on being the most 
                reliable, the one you call when quality and performance aren't negotiable. Every project 
                is an opportunity to prove that great web development is worth investing in.
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
              What we stand for
            </motion.h2>
            
            <motion.p
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={valuesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl md:text-2xl text-[#88939D] max-w-3xl will-change-transform"
            >
              The non-negotiables that guide every project we take on.
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
              The team behind
              <br />
              your <span className="text-[#00FF94]">success</span>
            </motion.h2>
            
            <motion.p
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={teamInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl md:text-2xl text-[#88939D] max-w-3xl will-change-transform"
            >
              A focused team dedicated to delivering exceptional results for every client.
            </motion.p>
          </motion.div>

          {/* Team Cards */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.id}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
                animate={teamInView ? { opacity: 1, y: 0 } : {}}
                transition={{ 
                  duration: 1, 
                  delay: 0.45 + index * 0.1,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="group relative will-change-transform"
              >
                {/* Card */}
                <motion.div 
                  className="relative h-full rounded-2xl bg-transparent border-2 border-[#88939D]/20 transition-all duration-500 hover:border-[#00FF94] overflow-hidden will-change-transform"
                  whileHover={{ 
                    y: -8,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 25
                    }
                  }}
                >
                  
                  {/* Image */}
                  <div className="relative aspect-[3/4] bg-gradient-to-br from-[#1a1a1a] to-[#0F0F0F] overflow-hidden">
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
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                      />
                    </motion.div>
                    
                    {/* Hover gradient overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/10 via-[#00CC78]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      initial={false}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#00FF94] transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-[#00FF94] text-sm mb-3 uppercase tracking-wider font-mono">
                      {member.role}
                    </p>
                    <p className="text-[#88939D] leading-relaxed group-hover:text-white/70 transition-colors duration-300">
                      {member.bio}
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
                Ready to build something great?
              </h3>
              <p className="text-lg text-[#88939D]">
                Let's talk about your project and how we can help you succeed online.
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
                    Start your project
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
                  View our work
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