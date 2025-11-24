// app/services/page.jsx

'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'

export default function ServicesPage() {
  const prefersReducedMotion = useReducedMotion()
  
  const [heroRef, heroInView] = useInView({
    threshold: 0.15,
    triggerOnce: true,
  })

  const services = [
    {
      number: '01',
      title: 'Web Design',
      slug: 'web-design',
      tagline: 'Interfaces that convert',
      description: 'Beautiful, user-centric designs that capture your brand and engage your audience. Every pixel crafted with purpose, every interaction designed for maximum impact.',
      features: ['UI/UX Design', 'Responsive Design', 'Design Systems', 'Prototyping', 'User Testing'],
      icon: (
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
        </svg>
      ),
    },
    {
      number: '02',
      title: 'Web Development',
      slug: 'web-development',
      tagline: 'Fast, scalable, future-proof',
      description: 'Lightning-fast websites built with React and Next.js. We consistently achieve 97-100 Lighthouse scores because speed isn\'t optional—it\'s essential for conversions and SEO.',
      features: ['React & Next.js', 'Performance Optimization', 'CMS Integration', 'Third-party APIs', 'Hosting Setup'],
      icon: (
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      number: '03',
      title: 'Content Creation',
      slug: 'content-creation',
      tagline: 'Visuals that make sites shine',
      description: 'Professional photography and videography specifically designed for web. Because even the best website can\'t reach its potential without great content—from product shots to brand storytelling.',
      features: ['Website Photography', 'Custom Videos', 'Product Photography', 'E-commerce Visuals', 'Brand Content'],
      icon: (
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      number: '04',
      title: 'E-Commerce',
      slug: 'e-commerce',
      tagline: 'Online stores that sell',
      description: 'Complete e-commerce solutions with beautiful product pages, seamless checkout, payment processing, and inventory management. Plus professional product photography to showcase your offerings.',
      features: ['Product Catalogs', 'Payment Integration', 'Checkout Flow', 'Order Management', 'Product Photos'],
      icon: (
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      number: '05',
      title: 'Web Applications',
      slug: 'web-applications',
      tagline: 'Software that solves problems',
      description: 'Custom web applications for complex business needs. From SaaS platforms to internal tools, we build software that scales with clean code and user experiences that make complex tasks simple.',
      features: ['SaaS Platforms', 'User Dashboards', 'Real-time Features', 'Database Design', 'Cloud Deployment'],
      icon: (
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      number: '06',
      title: 'SEO Optimization',
      slug: 'search-engine-optimization',
      tagline: 'Get found, rank higher',
      description: 'Strategic SEO implementation from technical optimization to content strategy. We build your site to rank well from day one and give you the tools to maintain and improve your position.',
      features: ['Technical SEO', 'Content Optimization', 'Performance Tuning', 'Analytics Setup', 'Strategy'],
      icon: (
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    }
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
                What We Do
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[1.05] tracking-tight mb-6 will-change-transform"
            >
              <span className="block text-white">
                Services
              </span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl md:text-2xl text-[#00FF94] mb-8 will-change-transform"
            >
              Everything you need to succeed online
            </motion.p>

            {/* Description */}
            <motion.p
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-xl text-[#88939D] leading-relaxed max-w-3xl will-change-transform"
            >
              From design and development to content creation and optimization—complete digital solutions that actually work.
            </motion.p>
          </div>
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94] to-transparent opacity-30" />
      </section>

      {/* Services - Each Full Height */}
      {services.map((service, index) => {
        const ServiceSection = () => {
          const [ref, inView] = useInView({
            threshold: 0.3,
            triggerOnce: false,
          })

          return (
            <section
              ref={ref}
              className="relative min-h-screen flex items-center overflow-hidden"
            >
              {/* Dynamic gradient background */}
              <motion.div
                animate={{
                  opacity: inView ? 0.2 : 0,
                }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#00FF94]/30 via-[#00CC78]/10 to-transparent rounded-full blur-[150px] will-change-transform"
              />

              {/* Noise texture */}
              <div 
                className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
              />

              <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-20">
                <div className="grid lg:grid-cols-[1fr,1.2fr] gap-12 lg:gap-20 items-center">
                  
                  {/* Left - Content */}
                  <motion.div
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -50 }}
                    animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="will-change-transform"
                  >
                    {/* Icon */}
                    <motion.div
                      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
                      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{
                        scale: 1.1,
                        rotate: 5,
                        transition: {
                          type: "spring",
                          stiffness: 400,
                          damping: 30
                        }
                      }}
                      className="w-16 h-16 text-[#00FF94] mb-8 will-change-transform"
                    >
                      {service.icon}
                    </motion.div>

                    {/* Number */}
                    <div className="text-sm font-mono text-[#88939D] mb-4">
                      {service.number}
                    </div>

                    {/* Title */}
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                      {service.title}
                    </h2>

                    {/* Tagline */}
                    <p className="text-xl md:text-2xl text-[#00FF94] mb-6">
                      {service.tagline}
                    </p>

                    {/* Description */}
                    <p className="text-lg text-[#88939D] leading-relaxed mb-8">
                      {service.description}
                    </p>

                    {/* CTA */}
                    <Link href={"/services/" + service.slug}>
                      <motion.button
                        whileHover={{ 
                          scale: 1.05,
                          transition: {
                            type: "spring",
                            stiffness: 400,
                            damping: 30
                          }
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="group px-8 py-4 bg-gradient-to-r from-[#00FF94] to-[#00CC78] text-black font-bold rounded-xl text-lg shadow-lg shadow-[#00FF94]/20 hover:shadow-xl hover:shadow-[#00FF94]/30 transition-shadow duration-300 will-change-transform"
                      >
                        <span className="flex items-center gap-2">
                          Learn More
                          <svg 
                            className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor" 
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </motion.button>
                    </Link>
                  </motion.div>

                  {/* Right - Features Card */}
                  <motion.div
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 50 }}
                    animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="will-change-transform"
                  >
                    <motion.div 
                      className="relative p-10 lg:p-12 rounded-3xl border-2 border-[#88939D]/20 bg-[#0A0A0A] overflow-hidden transition-all duration-500 hover:border-[#00FF94] will-change-transform"
                      whileHover={{
                        y: -5,
                        transition: {
                          type: "spring",
                          stiffness: 300,
                          damping: 25
                        }
                      }}
                    >
                      
                      {/* Card glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/5 via-transparent to-transparent" />

                      <div className="relative z-10">
                        <h3 className="text-sm uppercase tracking-wider text-[#88939D] font-mono mb-8">
                          What's Included
                        </h3>
                        
                        <div className="space-y-4">
                          {service.features.map((feature, i) => (
                            <motion.div
                              key={i}
                              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                              transition={{ duration: 0.5, delay: 0.4 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                              whileHover={{
                                x: 5,
                                borderColor: 'rgba(0, 255, 148, 0.5)',
                                transition: {
                                  type: "spring",
                                  stiffness: 400,
                                  damping: 30
                                }
                              }}
                              className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 transition-all duration-300 will-change-transform"
                            >
                              <motion.svg 
                                className="w-5 h-5 text-[#00FF94] flex-shrink-0" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor" 
                                strokeWidth={2}
                                whileHover={{
                                  scale: 1.2,
                                  transition: {
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 30
                                  }
                                }}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </motion.svg>
                              <span className="text-white text-lg">{feature}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom gradient line */}
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94]/50 to-transparent" />
                    </motion.div>
                  </motion.div>
                </div>
              </div>

              
            </section>
          )
        }

        return <ServiceSection key={service.number} />
      })}

      {/* Final CTA */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-[#00FF94]/20 via-[#00CC78]/10 to-transparent rounded-full blur-[200px] will-change-transform" />
        </div>

        {/* Noise */}
        <div 
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="will-change-transform"
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8">
              Let's build something
              <br />
              <span className="text-[#00FF94]">amazing together</span>
            </h2>
            <p className="text-xl md:text-2xl text-[#88939D] mb-12 max-w-3xl mx-auto">
              Ready to start your project? Let's talk about your needs and create a custom solution that delivers results.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/contact">
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 30
                    }
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-6 bg-gradient-to-r from-[#00FF94] to-[#00CC78] text-black font-bold rounded-xl text-xl shadow-lg shadow-[#00FF94]/20 hover:shadow-xl hover:shadow-[#00FF94]/30 transition-shadow duration-300 will-change-transform"
                >
                  Start your project
                </motion.button>
              </Link>
              <Link href="/work">
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    borderColor: 'rgba(0, 255, 148, 0.5)',
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 30
                    }
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-6 bg-white/5 border-2 border-white/10 text-white font-bold rounded-xl text-xl transition-all duration-300 will-change-transform"
                >
                  View our work
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#00FF94] to-transparent opacity-30" />
    </div>
  )
}