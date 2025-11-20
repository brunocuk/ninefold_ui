// components/sections/ServicesSection.jsx

'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'

export default function ServicesSection() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const services = [
    {
      title: 'Web Design',
      description: 'Beautiful, user-centric designs that captivate and convert. Interfaces that users love and remember.',
      features: [
        'UI/UX Design',
        'Responsive Design',
        'Design Systems',
        'Prototyping',
      ],
    },
    {
      title: 'Web Development',
      description: 'Custom-coded websites built with modern technologies. Fast, secure, and scalable solutions.',
      features: [
        'React & Next.js',
        'Custom CMS',
        'API Integration',
        'Performance Optimization',
      ],
    },
    {
      title: 'E-Commerce',
      description: 'Online stores that drive sales. Complete shopping experiences from product catalogs to checkout.',
      features: [
        'Shopify Development',
        'Payment Integration',
        'Inventory Management',
        'Analytics Setup',
      ],
    },
    {
      title: 'Web Applications',
      description: 'Complex web apps that solve real problems. From SaaS platforms to custom internal tools.',
      features: [
        'SaaS Development',
        'Database Design',
        'User Authentication',
        'Cloud Deployment',
      ],
    },
    {
      title: 'Search Engine Optimization',
      description: 'Drive organic traffic and increase visibility with strategic SEO. From technical optimization to content strategy.',
      features: [
        'Technical SEO',
        'Keyword Research',
        'On-Page Optimization',
        'Content Strategy',
      ],
    },
    {
      title: 'Content Creation',
      description: 'Professional photography and videography specifically designed for websites.',
      features: [
        'Product shots',
        'Team photos',
        'Space photography',
        'Brand videos',
      ],
    },
  ]

  return (
    <section ref={ref} className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
      
      {/* Subtle gradient glow */}
      <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none" />

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
            What we do
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl md:text-2xl text-[#88939D] max-w-3xl"
          >
            End-to-end digital solutions tailored to your business needs.
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.8, 
                delay: 0.6 + index * 0.1,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative h-full p-8 rounded-2xl bg-transparent border-2 border-[#88939D]/20 hover:border-[#00FF94] transition-all duration-300 overflow-hidden">
                
                {/* Hover gradient background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/5 via-[#00CC78]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />

                {/* Content */}
                <div className="relative z-10">
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[#88939D] leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Features list */}
                  <ul className="space-y-2.5 mb-6">
                    {service.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-sm text-[#88939D]"
                      >
                        <svg className="w-4 h-4 text-[#00FF94] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Learn More Link */}
                  <Link href={`/services/${service.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <motion.div
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#88939D] group-hover:text-[#00FF94] transition-colors duration-300"
                      whileHover={{ x: 5 }}
                    >
                      Learn more
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </motion.div>
                  </Link>
                </div>

                {/* Bottom gradient line accent */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 pt-20 border-t border-[#88939D]/20"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Need something custom?
              </h3>
              <p className="text-lg text-[#88939D]">
                We build tailored solutions for unique challenges. Let's discuss your specific needs.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-5 bg-gradient-to-r from-[#00FF94] to-[#00CC78] text-black font-bold rounded-xl text-lg transition-all whitespace-nowrap"
                >
                  Get in touch
                </motion.button>
              </Link>
              
              <Link href="/services">
                <motion.button
                  whileHover={{ scale: 1.02, borderColor: '#00FF94' }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-5 bg-transparent border-2 border-[#88939D]/30 text-white font-bold rounded-xl text-lg transition-all whitespace-nowrap"
                >
                  All services
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}