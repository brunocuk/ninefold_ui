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
      name: 'Starter',
      price: '€1,900',
      tagline: 'Launch your online presence',
      description: 'Perfect for freelancers, consultants, restaurants, and businesses starting out.',
      features: [
        'Single-page scrolling website',
        'Mobile-first responsive design',
        'Contact form with notifications',
        'Basic SEO setup',
        'Google Analytics integration',
        '2 rounds of revisions',
        '2-3 week delivery',
        '14 days post-launch support',
      ],
      popular: false,
      guarantee: '95+ PageSpeed Guaranteed',
    },
    {
      name: 'Business',
      price: '€3,900',
      tagline: 'For businesses that need control',
      description: 'Multi-page website with CMS so you can update content yourself.',
      features: [
        'Up to 8 custom pages',
        'CMS included — edit anytime',
        'Mobile-first responsive',
        'Full SEO foundation',
        'Google Analytics + Search Console',
        'Blog-ready structure',
        '3 rounds of revisions',
        '4-5 week delivery',
        '30 days post-launch support',
      ],
      popular: true,
      guarantee: '95+ PageSpeed + On-Time Delivery',
    },
    {
      name: 'Pro',
      price: '€7,500+',
      tagline: 'When you need custom functionality',
      description: 'For businesses needing custom admin panels, dashboards, or integrations.',
      features: [
        'Unlimited pages',
        'Custom admin panel',
        'User authentication (if needed)',
        'Third-party integrations',
        'Multilingual support',
        'Advanced SEO strategy',
        '5 rounds of revisions',
        '6-8 week delivery',
        '60 days post-launch support',
      ],
      popular: false,
      guarantee: '95+ PageSpeed + On-Time + Priority Support',
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
            Simple pricing. Serious websites.
          </motion.h2>

          <motion.p
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl md:text-2xl text-[#88939D] max-w-3xl mx-auto will-change-transform"
          >
            Pick a package. Get a timeline. Know exactly what you're paying.
          </motion.p>
        </motion.div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          
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
                  <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-[#00FF94] transition-colors duration-300">
                    {tier.name}
                  </h3>

                  {/* Tagline */}
                  <p className="text-[#00FF94] text-xs font-medium mb-3 uppercase tracking-wide">
                    {tier.tagline}
                  </p>

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

                  {/* Guarantee badge */}
                  <div className="mb-4 py-2 px-3 bg-[#00FF94]/10 border border-[#00FF94]/30 rounded-lg">
                    <p className="text-[#00FF94] text-xs font-medium text-center">
                      {tier.guarantee}
                    </p>
                  </div>

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
                      Book a free call
                    </motion.button>
                  </Link>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            </motion.div>
          ))}

        </div>

        {/* Our Guarantee Box */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 max-w-4xl mx-auto will-change-transform"
        >
          <div className="relative p-8 md:p-10 rounded-2xl border-2 border-[#00FF94]/30 bg-gradient-to-br from-[#00FF94]/5 to-transparent">
            <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
              Our Guarantee
            </h3>

            <div className="grid md:grid-cols-3 gap-8">
              {/* 95+ PageSpeed */}
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#00FF94]/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#00FF94]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">95+ PageSpeed Score</h4>
                <p className="text-[#88939D] text-sm leading-relaxed">
                  Your website will score 95+ on Google PageSpeed. If it doesn't, we'll optimize it until it does — at no extra cost.
                </p>
              </div>

              {/* On-Time Delivery */}
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#00FF94]/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#00FF94]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">On-Time Delivery</h4>
                <p className="text-[#88939D] text-sm leading-relaxed">
                  We'll deliver on the agreed date. If we're late, you get 10% off your final invoice. No excuses.
                </p>
              </div>

              {/* No Hidden Fees */}
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#00FF94]/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#00FF94]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">No Hidden Fees</h4>
                <p className="text-[#88939D] text-sm leading-relaxed">
                  The price you see is the price you pay. We scope everything upfront — no surprise invoices.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom note */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 text-center will-change-transform"
        >
          <p className="text-[#88939D] text-sm">
            Need something different? <Link href="/contact" className="text-[#00FF94] hover:underline">Let's talk</Link> about a custom solution.
          </p>
        </motion.div>
      </div>
    </section>
  )
}