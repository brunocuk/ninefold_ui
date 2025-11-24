// components/sections/HeroSection.jsx

'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="relative min-h-screen flex items-center bg-[#0F0F0F] overflow-hidden">
      
      {/* Subtle noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none will-change-transform"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Gradient glow - optimized for GPU */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-[#00CC78]/20 via-[#00FF94]/10 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-20">
        
        <div className="max-w-5xl">

          {/* Main headline */}
          <motion.h1
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1.2, 
              delay: 0.1, 
              ease: [0.16, 1, 0.3, 1] // Smoother custom easing
            }}
            className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[1.05] tracking-tight mb-8 will-change-transform"
          >
            <span className="block text-white">
              Custom websites
            </span>
            <span className="block text-white">
              that drive{' '}
              <span className="text-[#00FF94]">results</span>.
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1, 
              delay: 0.3, 
              ease: [0.16, 1, 0.3, 1]
            }}
            className="text-xl md:text-2xl text-[#88939D] leading-relaxed max-w-3xl mb-12 will-change-transform"
          >
            No templates. No page builders. Just clean code and purposeful design 
            crafted specifically for your business.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1, 
              delay: 0.5, 
              ease: [0.16, 1, 0.3, 1]
            }}
            className="flex flex-col sm:flex-row gap-4 mb-20"
          >
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 30 
                }}
                className="group relative px-8 py-5 bg-gradient-to-r from-[#00FF94] to-[#00CC78] text-black font-bold rounded-xl text-lg overflow-hidden transition-all will-change-transform"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start a project
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 ease-out" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </motion.button>
            </Link>

            <Link href="/work">
              <motion.button
                whileHover={{ scale: 1.02, borderColor: '#00FF94' }}
                whileTap={{ scale: 0.98 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 30,
                  borderColor: { duration: 0.3 }
                }}
                className="px-8 py-5 bg-transparent border-2 border-[#88939D]/30 text-white font-bold rounded-xl text-lg will-change-transform"
              >
                View our work
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1, 
              delay: 0.7, 
              ease: [0.16, 1, 0.3, 1]
            }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-[#88939D]/20 pt-12"
          >
            {[
              { value: '20+', label: 'Projects Delivered' },
              { value: '99/100', label: 'Performance Score' },
              { value: '0.5s', label: 'Avg. Page Load' },
              { value: '100%', label: 'On-Time Delivery' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.9 + i * 0.08,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="will-change-transform"
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
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
  )
}