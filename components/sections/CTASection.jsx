// components/sections/CTASection.jsx

'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'

export default function CTASection() {
  const prefersReducedMotion = useReducedMotion()
  
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  return (
    <section ref={ref} className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
      
      {/* Subtle gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-b from-[#00CC78]/15 via-[#00FF94]/8 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />

      {/* Noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12 text-center">
        
        {/* Main Content */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="will-change-transform"
        >
          {/* Main Headline */}
          <motion.h2
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight will-change-transform"
          >
            Let's build
            <br />
            your website
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl md:text-2xl text-[#88939D] mb-12 max-w-3xl mx-auto leading-relaxed will-change-transform"
          >
            Book a free 15-minute call. We'll discuss your project, give you a clear timeline, and if we're not the right fit — we'll tell you.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 will-change-transform"
          >
            {/* Primary CTA */}
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
                className="group px-10 py-5 bg-gradient-to-r from-[#00FF94] to-[#00CC78] text-black font-bold rounded-xl text-lg transition-all will-change-transform shadow-lg shadow-[#00FF94]/20 hover:shadow-xl hover:shadow-[#00FF94]/30 flex items-center gap-2"
              >
                Book a free call
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.button>
            </Link>

            {/* Secondary CTA */}
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
                className="px-10 py-5 border-2 border-[#88939D]/30 text-white font-bold rounded-xl text-lg transition-colors duration-300 hover:text-[#00FF94] will-change-transform"
              >
                See our work
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust Elements */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-[#88939D]"
          >
            {[
              { text: 'Free consultation (no sales pitch)' },
              { text: 'Clear pricing within 24 hours' },
              { text: '95+ PageSpeed guaranteed' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.7 + i * 0.1,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="flex items-center gap-2 will-change-transform"
              >
                <motion.svg 
                  className="w-5 h-5 text-[#00FF94]"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </motion.svg>
                <span>{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Contact Options */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 pt-12 border-t border-[#88939D]/20 will-change-transform"
        >
          <p className="text-[#88939D] mb-8 text-lg">
            Prefer to reach out directly?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch max-w-2xl mx-auto">
            
            {/* Email */}
            <motion.a
              href="mailto:hello@ninefold.eu"
              whileHover={{ 
                scale: 1.02, 
                borderColor: '#00FF94',
                y: -5,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }
              }}
              whileTap={{ 
                scale: 0.98,
                transition: { duration: 0.1 }
              }}
              className="flex-1 flex items-center gap-4 p-6 bg-transparent border-2 border-[#88939D]/20 rounded-xl hover:border-[#00FF94] transition-all duration-500 group will-change-transform"
            >
              <motion.div 
                className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00FF94] to-[#00CC78] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#00FF94]/20"
                whileHover={{ 
                  scale: 1.1,
                  rotate: 5,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                  }
                }}
              >
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </motion.div>
              <div className="text-left">
                <div className="text-xs text-[#88939D] mb-1 group-hover:text-[#00FF94] transition-colors duration-300">Email us</div>
                <div className="text-white font-semibold group-hover:text-[#00FF94] transition-colors duration-300">
                  hello@ninefold.eu
                </div>
              </div>
            </motion.a>

            {/* Phone */}
            <motion.a
              href="tel:+385915469266"
              whileHover={{ 
                scale: 1.02, 
                borderColor: '#00FF94',
                y: -5,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }
              }}
              whileTap={{ 
                scale: 0.98,
                transition: { duration: 0.1 }
              }}
              className="flex-1 flex items-center gap-4 p-6 bg-transparent border-2 border-[#88939D]/20 rounded-xl hover:border-[#00FF94] transition-all duration-500 group will-change-transform"
            >
              <motion.div 
                className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00FF94] to-[#00CC78] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#00FF94]/20"
                whileHover={{ 
                  scale: 1.1,
                  rotate: -5,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                  }
                }}
              >
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </motion.div>
              <div className="text-left">
                <div className="text-xs text-[#88939D] mb-1 group-hover:text-[#00FF94] transition-colors duration-300">Call us</div>
                <div className="text-white font-semibold group-hover:text-[#00FF94] transition-colors duration-300">
                  +385 91 546 9266
                </div>
              </div>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}