// components/sections/TestimonialsSection.jsx

'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function TestimonialsSection() {
  const prefersReducedMotion = useReducedMotion()
  
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const testimonials = [
    {
      quote: "The transformation of our website exceeded our expectations. We went from barely receiving any inquiries online to getting over 100 in just two months.",
      author: "Božidar Jurišić",
      role: "Owner",
      company: "Elit Projekt",
      avatar: "BJ",
    },
    {
      quote: "NineFold delivered exactly what we needed, exactly when we needed it. The September 1st deadline was critical for our PR launch, and they met it without compromising quality.",
      author: "Saša Perko",
      role: "CEO",
      company: "DI Plan",
      avatar: "SP",
    },
    {
      quote: "The new website perfectly captures our brand's premium positioning, and the custom configurators have made a huge difference in how clients engage with our products.",
      author: "Mirko Koren",
      role: "Co-Founder",
      company: "Desk&Co",
      avatar: "MK",
    },
    {
      quote: "NineFold took our decade of industry expertise and created a digital presence that truly represents who we are. The time and effort they invested was remarkable.",
      author: "Leonardo Zovko",
      role: "Owner",
      company: "The Office Company",
      avatar: "LZ",
    },
  ]

  return (
    <section ref={ref} className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
      
      {/* Subtle gradient glow */}
      <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />

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
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 will-change-transform"
        >
          <motion.h2
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-3xl will-change-transform"
          >
            What clients say
          </motion.h2>
          
          <motion.p
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl md:text-2xl text-[#88939D] max-w-3xl will-change-transform"
          >
            Real feedback from real clients who trusted us with their projects.
          </motion.p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 1, 
                delay: 0.45 + index * 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="group relative will-change-transform"
            >
              {/* Card */}
              <motion.div 
                className="relative h-full p-8 lg:p-10 rounded-2xl bg-transparent border-2 border-[#88939D]/20 hover:border-[#00FF94] transition-all duration-500 overflow-hidden will-change-transform"
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

                {/* Quote icon */}
                <motion.div 
                  className="absolute top-8 right-8 text-[#00FF94]/10 group-hover:text-[#00FF94]/20 transition-colors duration-500"
                  initial={{ scale: 0, rotate: -45 }}
                  animate={inView ? { scale: 1, rotate: 0 } : {}}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.6 + index * 0.1,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                >
                  <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </motion.div>

                {/* Content */}
                <div className="relative z-10">
                  
                  {/* Quote */}
                  <motion.p 
                    className="text-lg md:text-xl text-white leading-relaxed mb-8 group-hover:text-white/95 transition-colors duration-300"
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ 
                      duration: 0.8, 
                      delay: 0.7 + index * 0.1,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                  >
                    "{testimonial.quote}"
                  </motion.p>

                  {/* Author info */}
                  <motion.div 
                    className="flex items-center gap-4 pt-6 border-t border-[#88939D]/20 group-hover:border-[#00FF94]/30 transition-colors duration-500"
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.8 + index * 0.1,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                  >
                    {/* Avatar */}
                    <motion.div 
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00FF94] to-[#00CC78] flex items-center justify-center text-black font-bold text-sm flex-shrink-0 shadow-lg shadow-[#00FF94]/20 will-change-transform"
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
                      {testimonial.avatar}
                    </motion.div>

                    {/* Name & role */}
                    <div>
                      <h4 className="text-white font-semibold text-base mb-1 group-hover:text-[#00FF94] transition-colors duration-300">
                        {testimonial.author}
                      </h4>
                      <p className="text-[#88939D] text-sm group-hover:text-white/60 transition-colors duration-300">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Bottom gradient line accent */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 p-8 lg:p-12 rounded-2xl border-2 border-[#88939D]/20 hover:border-[#00FF94]/50 transition-all duration-500 will-change-transform group/stats"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/5 via-transparent to-[#00CC78]/5 opacity-0 group-hover/stats:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
            initial={false}
          />
          
          {[
            { value: '98%', label: 'Satisfaction rate' },
            { value: '20+', label: 'Projects delivered' },
            { value: '0.5s', label: 'Avg. Page Load' },
            { value: '100%', label: 'On-time delivery' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.7, 
                delay: 1.0 + i * 0.08,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="text-center relative z-10 will-change-transform"
            >
              <motion.div 
                className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover/stats:text-[#00FF94] transition-colors duration-300"
                whileHover={{ 
                  scale: 1.1,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                  }
                }}
              >
                {stat.value}
              </motion.div>
              <div className="text-sm text-[#88939D] group-hover/stats:text-white/60 transition-colors duration-300">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 pt-20 border-t border-[#88939D]/20 will-change-transform"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to join them?
              </h3>
              <p className="text-lg text-[#88939D]">
                Let's discuss your project and create something amazing together.
              </p>
            </div>
            
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
              className="px-8 py-5 bg-gradient-to-r from-[#00FF94] to-[#00CC78] text-black font-bold rounded-xl text-lg transition-all whitespace-nowrap will-change-transform shadow-lg shadow-[#00FF94]/20 hover:shadow-xl hover:shadow-[#00FF94]/30"
            >
              Start your project
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}