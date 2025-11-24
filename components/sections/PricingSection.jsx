// components/sections/PricingSection.jsx

'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'

export default function PricingSection() {
  const prefersReducedMotion = useReducedMotion()
  
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const pricingTiers = [
    {
      name: 'Essential',
      price: '€2,900',
      description: 'Professional web presence for small businesses and startups.',
      features: [
        '5-8 page website',
        'Responsive design (mobile-first)',
        'Contact forms',
        'SEO foundation & setup',
        'Google Analytics & My Business',
        'Professional copywriting',
        '4-6 week delivery',
        '30 days post-launch support',
      ],
      popular: false,
      examples: 'Similar to: Pizzeria 14, Top Hill',
    },
    {
      name: 'Professional',
      price: '€5,500',
      description: 'Full-service solution with CMS and advanced features.',
      features: [
        '8-15 page website',
        'Strapi CMS integration',
        'Custom animations',
        'Third-party integrations',
        'Complete SEO strategy',
        'Content management',
        '6-8 week delivery',
        '30 days post-launch support',
      ],
      popular: true,
      examples: 'Similar to: Radijona Tattoo, Otkup Auta',
    },
    {
      name: 'Premium',
      price: '€9,500+',
      description: 'Comprehensive digital solution with custom development.',
      features: [
        'Unlimited pages',
        'Custom CMS & functionality',
        'Multiple integrations',
        'Multilingual support',
        'Performance optimization (97-100 scores)',
        'Complete content strategy',
        'Photography & videography',
        '8-10 week delivery',
        '60 days post-launch support',
      ],
      popular: false,
      examples: 'Similar to: Desk&Co, DI Plan, Elit Projekt',
    },
  ]

  return (
    <section ref={ref} className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
      
      {/* Subtle gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />

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
          <motion.h2
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 will-change-transform"
          >
            Simple, transparent pricing
          </motion.h2>
          
          <motion.p
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl md:text-2xl text-[#88939D] max-w-3xl mx-auto will-change-transform"
          >
            Choose the package that fits your needs, or let's build something custom.
          </motion.p>
        </motion.div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Standard Pricing Tiers */}
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 1, 
                delay: 0.45 + index * 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="relative group will-change-transform"
            >
              {/* Popular badge */}
              {tier.popular && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#00FF94] to-[#00CC78] text-black text-xs font-bold rounded-full z-10 shadow-lg shadow-[#00FF94]/30"
                >
                  Most Popular
                </motion.div>
              )}

              {/* Card */}
              <motion.div 
                className={`relative h-full p-8 rounded-2xl transition-all duration-500 flex flex-col will-change-transform ${
                  tier.popular 
                    ? 'bg-transparent border-2 border-[#00FF94] shadow-lg shadow-[#00FF94]/10' 
                    : 'bg-transparent border-2 border-[#88939D]/20 hover:border-[#00FF94]'
                }`}
                whileHover={{ 
                  y: -8,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }
                }}
              >
                
                {/* Hover gradient background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/5 via-[#00CC78]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  initial={false}
                />

                {/* Content - grows to push button to bottom */}
                <div className="relative z-10 flex flex-col flex-grow">
                  
                  {/* Tier name */}
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#00FF94] transition-colors duration-300">
                    {tier.name}
                  </h3>

                  {/* Price */}
                  <div className="mb-4">
                    <motion.span 
                      className="text-4xl md:text-5xl font-bold text-white"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      {tier.price}
                    </motion.span>
                  </div>

                  {/* Description */}
                  <p className="text-[#88939D] text-sm mb-6 leading-relaxed group-hover:text-white/70 transition-colors duration-300">
                    {tier.description}
                  </p>

                  {/* Features list - flex-grow pushes button down */}
                  <ul className="space-y-3 mb-8 flex-grow">
                    {tier.features.map((feature, i) => (
                      <motion.li 
                        key={i} 
                        className="flex items-start gap-3 text-sm text-[#88939D] group-hover:text-white/60 transition-colors duration-300"
                        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ 
                          duration: 0.5, 
                          delay: 0.6 + index * 0.1 + i * 0.03,
                          ease: [0.16, 1, 0.3, 1]
                        }}
                      >
                        <svg className="w-5 h-5 text-[#00FF94] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* CTA button - always at bottom */}
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
                      className={`w-full py-4 font-bold rounded-xl text-base transition-all will-change-transform ${
                        tier.popular
                          ? 'bg-gradient-to-r from-[#00FF94] to-[#00CC78] text-black shadow-lg shadow-[#00FF94]/20 hover:shadow-xl hover:shadow-[#00FF94]/30'
                          : 'bg-white/5 border-2 border-[#88939D]/30 text-white hover:border-[#00FF94]'
                      }`}
                    >
                      Get started
                    </motion.button>
                  </Link>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            </motion.div>
          ))}

          {/* Custom Pricing Card */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ 
              duration: 1, 
              delay: 0.75,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="relative group will-change-transform"
          >
            {/* Card */}
            <motion.div 
              className="relative h-full p-8 rounded-2xl bg-transparent border-2 border-[#88939D]/20 hover:border-[#00FF94] transition-all duration-500 flex flex-col will-change-transform"
              whileHover={{ 
                y: -8,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }
              }}
            >
              
              {/* Hover gradient background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/5 via-[#00CC78]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                initial={false}
              />

              {/* Content */}
              <div className="relative z-10 flex flex-col flex-grow">
                
                {/* Tier name */}
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#00FF94] transition-colors duration-300">
                  Custom
                </h3>

                {/* Price */}
                <div className="mb-4">
                  <motion.span 
                    className="text-4xl md:text-5xl font-bold text-white"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    Let's talk
                  </motion.span>
                </div>

                {/* Description */}
                <p className="text-[#88939D] text-sm mb-6 leading-relaxed group-hover:text-white/70 transition-colors duration-300">
                  Need something unique? We'll build exactly what you need.
                </p>

                {/* Features list - flex-grow pushes button down */}
                <ul className="space-y-3 mb-8 flex-grow">
                  {[
                    'Tailored to your needs',
                    'Unlimited pages',
                    'Custom features',
                    'Advanced integrations',
                    'Dedicated support',
                    'Scalable architecture',
                    'Everything you need',
                  ].map((feature, i) => (
                    <motion.li 
                      key={i} 
                      className="flex items-start gap-3 text-sm text-[#88939D] group-hover:text-white/60 transition-colors duration-300"
                      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ 
                        duration: 0.5, 
                        delay: 0.9 + i * 0.03,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                    >
                      <svg className="w-5 h-5 text-[#00FF94] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA button - always at bottom */}
                <Link href="/contact">
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
                    className="w-full py-4 bg-white/5 border-2 border-[#88939D]/30 text-white font-bold rounded-xl text-base transition-colors duration-300 hover:border-[#00FF94] will-change-transform"
                  >
                    Contact us
                  </motion.button>
                </Link>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom note */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 text-center will-change-transform"
        >
          <p className="text-[#88939D] text-sm">
            All prices are starting points. Final cost depends on your specific requirements.
          </p>
          <p className="text-[#88939D] text-sm mt-2">
            Payment plans available. No hidden fees.
          </p>
        </motion.div>
      </div>
    </section>
  )
}