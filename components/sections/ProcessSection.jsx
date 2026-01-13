// components/sections/ProcessSection.jsx

'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'

export default function ProcessSection() {
  const prefersReducedMotion = useReducedMotion()
  
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const steps = [
    {
      number: '01',
      title: "Discovery & strategy",
      description: 'We start by understanding your business goals, target audience, and what success looks like for your project.',
      details: [
        'Stakeholder interviews and research',
        'Competitive analysis and market positioning',
        'Technical requirements and constraints',
        'Success metrics and KPIs definition',
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      number: '02',
      title: 'Design & prototype',
      description: 'We transform insights into beautiful, user-centered designs that bring your brand to life.',
      details: [
        'Wireframes and user flow mapping',
        'High-fidelity mockups and prototypes',
        'Design system and style guide',
        'Interactive prototypes for feedback',
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      number: '03',
      title: 'Development & testing',
      description: 'Clean code meets cutting-edge technology. We build fast, secure, and scalable solutions.',
      details: [
        'Front-end and back-end development',
        'Performance optimization and SEO',
        'Cross-browser and device testing',
        'Security audits and quality assurance',
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      number: '04',
      title: 'Launch & support',
      description: 'Your site goes live, but our partnership continues. We ensure everything runs smoothly.',
      details: [
        'Deployment and performance monitoring',
        'Team training and documentation',
        'Ongoing maintenance and updates',
        'Analytics setup and optimization',
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
  ]

  return (
    <section ref={ref} className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
      
      {/* Subtle gradient glow */}
      <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />

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
          className="mb-20 text-center will-change-transform"
        >
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block mb-6 will-change-transform"
          >
            <span className="px-4 py-2 bg-[#00FF94]/10 border border-[#00FF94]/30 rounded-full text-[#00FF94] text-sm font-mono uppercase tracking-wider">
              Our Process
            </span>
          </motion.div>

          <motion.h2
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 will-change-transform"
          >
            How we deliver on time, every time
          </motion.h2>

          <motion.p
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl md:text-2xl text-[#88939D] max-w-3xl mx-auto will-change-transform"
          >
            A clear 4-step process. No surprises. You'll know exactly where your project stands at every stage.
          </motion.p>
        </motion.div>

        {/* Process Steps with Timeline */}
        <div className="relative">
          
          {/* Vertical Timeline Line (Desktop) */}
          <motion.div 
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block absolute left-[60px] top-0 bottom-0 w-px bg-gradient-to-b from-[#00FF94]/50 via-[#00CC78]/30 to-[#00FF94]/50 origin-top will-change-transform"
          />

          <div className="space-y-8 lg:space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -40 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ 
                  duration: 1, 
                  delay: 0.5 + index * 0.12,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="group relative will-change-transform"
              >
                {/* Timeline dot (Desktop) */}
                <div className="hidden lg:flex absolute left-[44px] top-8 w-8 h-8 items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: 1 } : {}}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.7 + index * 0.12,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className="w-4 h-4 rounded-full bg-gradient-to-br from-[#00FF94] to-[#00CC78] shadow-lg shadow-[#00FF94]/50 will-change-transform"
                  />
                  <motion.div
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2,
                      delay: 0.7 + index * 0.12,
                      ease: "easeInOut"
                    }}
                    className="absolute w-4 h-4 rounded-full bg-[#00FF94] will-change-transform"
                  />
                </div>

                {/* Card */}
                <motion.div 
                  className="lg:ml-24 relative rounded-2xl bg-[#0F0F0F] border-2 border-[#88939D]/20 hover:border-[#00FF94]/50 transition-all duration-500 overflow-hidden will-change-transform"
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
                    className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/5 via-transparent to-[#00CC78]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    initial={false}
                  />

                  {/* Top gradient line */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Content */}
                  <div className="relative z-10 p-8 lg:p-10">
                    
                    <div className="grid lg:grid-cols-[1fr,2fr] gap-8 lg:gap-12">
                      
                      {/* Left Column - Number & Icon */}
                      <div className="flex gap-3">
                        
                        {/* Number Badge */}
                        <motion.div 
                          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00FF94]/10 to-[#00CC78]/10 border border-[#00FF94]/30 group-hover:border-[#00FF94] transition-colors duration-500 will-change-transform"
                          whileHover={{ 
                            scale: 1.05,
                            rotate: 5,
                            transition: {
                              type: "spring",
                              stiffness: 400,
                              damping: 30
                            }
                          }}
                        >
                          <span className="text-3xl font-black text-[#00FF94]">
                            {step.number}
                          </span>
                        </motion.div>

                        {/* Icon */}
                        <motion.div 
                          className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-white/5 text-[#00FF94] group-hover:bg-[#00FF94]/10 transition-colors duration-500 will-change-transform"
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
                          {step.icon}
                        </motion.div>

                        {/* Mobile/Tablet Number Display */}
                        <div className="lg:hidden text-7xl font-black text-white/5">
                          {step.number}
                        </div>
                      </div>

                      {/* Right Column - Content */}
                      <div className="space-y-6">
                        
                        {/* Title */}
                        <h3 className="text-3xl md:text-4xl font-bold text-white group-hover:text-[#00FF94] transition-colors duration-500">
                          {step.title}
                        </h3>

                        {/* Description */}
                        <p className="text-lg md:text-xl text-[#88939D] leading-relaxed transition-colors duration-500 group-hover:text-white/80">
                          {step.description}
                        </p>

                        {/* Details List */}
                        <ul className="space-y-3 pt-4">
                          {step.details.map((detail, i) => (
                            <motion.li
                              key={i}
                              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -20 }}
                              animate={inView ? { opacity: 1, x: 0 } : {}}
                              transition={{ 
                                duration: 0.6, 
                                delay: 0.7 + index * 0.12 + i * 0.04,
                                ease: [0.16, 1, 0.3, 1]
                              }}
                              className="flex items-start gap-3 text-[#88939D] group-hover:text-white/70 transition-colors duration-300 will-change-transform"
                            >
                              <svg className="w-5 h-5 text-[#00FF94] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              <span>{detail}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Bottom gradient line */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-24 pt-20 border-t border-[#88939D]/20 will-change-transform"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to get started?
              </h3>
              <p className="text-lg text-[#88939D]">
                Let's discuss your project and create a tailored plan for success
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
                  className="group px-8 py-5 bg-gradient-to-r from-[#00FF94] to-[#00CC78] text-black font-bold rounded-xl text-lg transition-all whitespace-nowrap flex items-center gap-2 will-change-transform shadow-lg shadow-[#00FF94]/20 hover:shadow-xl hover:shadow-[#00FF94]/30"
                >
                  Book a free call
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
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
                  className="px-8 py-5 bg-transparent border-2 border-[#88939D]/30 text-white font-bold rounded-xl text-lg transition-colors duration-300 whitespace-nowrap hover:text-[#00FF94] will-change-transform"
                >
                  See our work
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}