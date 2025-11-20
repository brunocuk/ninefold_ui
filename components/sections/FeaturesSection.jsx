// components/sections/FeaturesSection.jsx

'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function FeaturesSection() {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  const features = [
    {
      title: 'Lightning Fast Performance',
      description: 'Optimized code and modern architecture ensure your site loads instantly. Every millisecond matters for conversions and SEO.',
      metrics: ['< 1s', 'Load time']
    },
    {
      title: 'Pixel-Perfect Design',
      description: 'Custom interfaces crafted with attention to every detail. Beautiful aesthetics that work flawlessly across all devices.',
      metrics: ['100%', 'Responsive']
    },
    {
      title: 'Built to Scale',
      description: 'Robust, maintainable code that grows with your business. Add features without starting from scratch.',
      metrics: ['∞', 'Scalable']
    },
  ]

  return (
    <section ref={ref} className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
      
      {/* Subtle gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none" />

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
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-3xl"
          >
            Why work with us?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl md:text-2xl text-[#88939D] max-w-3xl"
          >
            We build websites that perform. No bloat, no shortcuts, just clean code and purposeful design.
          </motion.p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.8, 
                delay: 0.6 + index * 0.15,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative h-full p-8 lg:p-10 rounded-2xl bg-transparent border-2 border-[#88939D]/20 transition-all duration-300 hover:border-[#00FF94] overflow-hidden">
                
                {/* Hover gradient background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/5 via-[#00CC78]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />

                {/* Content */}
                <div className="relative z-10">
                  
                  {/* Metric badge */}
                  <div className="inline-flex items-center gap-3 mb-6">
                    <div className="text-3xl font-bold text-[#00FF94]">
                      {feature.metrics[0]}
                    </div>
                    <div className="text-sm text-[#88939D] uppercase tracking-wider">
                      {feature.metrics[1]}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[#88939D] leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom gradient line accent */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom section with CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 pt-20 border-t border-[#88939D]/20"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to get started?
              </h3>
              <p className="text-lg text-[#88939D]">
                Let's discuss your project and see how we can help you succeed.
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-5 bg-gradient-to-r from-[#00FF94] to-[#00CC78] text-black font-bold rounded-xl text-lg transition-all whitespace-nowrap"
            >
              Schedule a call
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}