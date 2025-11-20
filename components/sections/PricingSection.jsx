// components/sections/PricingSection.jsx

'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'

export default function PricingSection() {
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none" />

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
          className="mb-20 text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            Simple, transparent pricing
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl md:text-2xl text-[#88939D] max-w-3xl mx-auto"
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
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.8, 
                delay: 0.6 + index * 0.1,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="relative group"
            >
              {/* Popular badge */}
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#00FF94] to-[#00CC78] text-black text-xs font-bold rounded-full z-10">
                  Most Popular
                </div>
              )}

              {/* Card */}
              <div className={`relative h-full p-8 rounded-2xl transition-all duration-300 flex flex-col ${
                tier.popular 
                  ? 'bg-transparent border-2 border-[#00FF94]' 
                  : 'bg-transparent border-2 border-[#88939D]/20 hover:border-[#00FF94]'
              }`}>
                
                {/* Hover gradient background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/5 via-[#00CC78]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                  initial={false}
                />

                {/* Content - grows to push button to bottom */}
                <div className="relative z-10 flex flex-col flex-grow">
                  
                  {/* Tier name */}
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {tier.name}
                  </h3>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-4xl md:text-5xl font-bold text-white">
                      {tier.price}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-[#88939D] text-sm mb-6 leading-relaxed">
                    {tier.description}
                  </p>

                  {/* Features list - flex-grow pushes button down */}
                  <ul className="space-y-3 mb-8 flex-grow">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[#88939D]">
                        <svg className="w-5 h-5 text-[#00FF94] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA button - always at bottom */}
                  <Link href="/contact">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-4 font-bold rounded-xl text-base transition-all ${
                        tier.popular
                          ? 'bg-gradient-to-r from-[#00FF94] to-[#00CC78] text-black'
                          : 'bg-white/5 border-2 border-[#88939D]/30 text-white hover:border-[#00FF94]'
                      }`}
                    >
                      Get started
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Custom Pricing Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ 
              duration: 0.8, 
              delay: 0.9,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="relative group"
          >
            {/* Card */}
            <div className="relative h-full p-8 rounded-2xl bg-transparent border-2 border-[#88939D]/20 hover:border-[#00FF94] transition-all duration-300 flex flex-col">
              
              {/* Hover gradient background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/5 via-[#00CC78]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                initial={false}
              />

              {/* Content */}
              <div className="relative z-10 flex flex-col flex-grow">
                
                {/* Tier name */}
                <h3 className="text-2xl font-bold text-white mb-2">
                  Custom
                </h3>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-4xl md:text-5xl font-bold text-white">
                    Let's talk
                  </span>
                </div>

                {/* Description */}
                <p className="text-[#88939D] text-sm mb-6 leading-relaxed">
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
                    <li key={i} className="flex items-start gap-3 text-sm text-[#88939D]">
                      <svg className="w-5 h-5 text-[#00FF94] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA button - always at bottom */}
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.02, borderColor: '#00FF94' }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-white/5 border-2 border-[#88939D]/30 text-white font-bold rounded-xl text-base transition-all hover:border-[#00FF94]"
                  >
                    Contact us
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 text-center"
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