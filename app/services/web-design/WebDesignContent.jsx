// app/services/web-design/WebDesignContent.jsx

'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { useState } from 'react'

const service = {
  title: 'Web Design',
  tagline: 'Beautiful interfaces that convert',
  description: 'We create stunning, conversion-focused designs that captivate your audience and drive results. Every pixel serves a purpose, every interaction designed to guide users toward action.',
  
  icon: (
    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
    </svg>
  ),
  
  features: [
    {
      title: 'User-Centric Design',
      description: 'Intuitive interfaces designed around your users\' needs and behaviors. We create seamless experiences that make complex actions feel effortless.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      title: 'Mobile-First Approach',
      description: 'Designed for mobile from the start, then enhanced for larger screens. Your site will look stunning and perform flawlessly on every device.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Design Systems',
      description: 'Scalable design systems built in Figma that maintain consistency across all pages and make future updates seamless.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      title: 'Brand-Aligned Visuals',
      description: 'Eye-catching aesthetics that perfectly reflect your brand identity and resonate with your target audience.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343" />
        </svg>
      ),
    },
    {
      title: 'Interactive Prototypes',
      description: 'Clickable Figma prototypes that let you experience the design before development begins. See exactly how your site will work.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      title: 'Conversion Optimization',
      description: 'Designs optimized for conversions with clear CTAs, strategic layouts, and psychology-backed design patterns.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ],
  
  process: [
    {
      number: '01',
      title: 'Discovery & Strategy',
      description: 'Deep dive into your business goals, target audience, and competitive landscape. We define what success looks like and create a design strategy to get there.',
      duration: '1-2 weeks',
    },
    {
      number: '02',
      title: 'Sitemap & User Flows',
      description: 'Map out the structure and navigation of your site. We design user journeys that guide visitors smoothly from landing to conversion.',
      duration: '1 week',
    },
    {
      number: '03',
      title: 'Wireframing',
      description: 'Low-fidelity wireframes establish layout, content hierarchy, and functionality without visual distractions. Get the structure right first.',
      duration: '1-2 weeks',
    },
    {
      number: '04',
      title: 'Visual Design',
      description: 'High-fidelity designs in Figma bringing your brand to life with color, typography, imagery, and sophisticated interactions.',
      duration: '2-3 weeks',
    },
    {
      number: '05',
      title: 'Interactive Prototypes',
      description: 'Clickable prototypes that demonstrate how everything works—navigation, interactions, animations, and transitions.',
      duration: '1 week',
    },
    {
      number: '06',
      title: 'Design Handoff',
      description: 'Complete design files, component library, style guide, and developer documentation for seamless implementation.',
      duration: '1 week',
    },
  ],
  
  benefits: [
    {
      title: 'Increased Conversions',
      description: 'Strategic design with clear CTAs and optimized user flows leads to measurably higher conversion rates.',
    },
    {
      title: 'Professional Credibility',
      description: 'Polished design immediately establishes trust and positions your brand as a serious industry player.',
    },
    {
      title: 'Lower Bounce Rates',
      description: 'Intuitive, engaging interfaces keep users on your site longer and encourage deeper exploration.',
    },
    {
      title: 'Competitive Edge',
      description: 'Stand out in crowded markets with unique, memorable design that captures attention and sticks in minds.',
    },
  ],

  pricing: {
    ranges: [
      { 
        size: 'Landing Page', 
        price: '€900 - €1,500', 
        description: 'Single high-converting page for campaigns or product launches',
        features: ['Custom design in Figma', 'Mobile responsive', 'Up to 5 sections', '2 revision rounds', 'Design handoff files']
      },
      { 
        size: 'Multi-Page Site', 
        price: '€1,500 - €3,000', 
        description: 'Complete website design with multiple pages and design system',
        features: ['5-10 pages designed', 'Full design system', 'Interactive prototype', '3 revision rounds', 'Developer handoff']
      },
      { 
        size: 'Web Application', 
        price: '€3,000+', 
        description: 'Complex UI/UX for web apps, dashboards, and SaaS platforms',
        features: ['Unlimited pages', 'Complete design system', 'User testing', 'Unlimited revisions', 'Ongoing support']
      },
    ],
    note: 'Pricing varies based on complexity, number of pages, custom features, and timeline. All packages include Figma files and design documentation.',
  },
  
  faqs: [
    {
      question: 'Do you design in Figma or another tool?',
      answer: 'We design exclusively in Figma. It\'s the industry standard, makes collaboration seamless, allows for interactive prototypes, and ensures your developers can extract everything they need for pixel-perfect implementation.',
    },
    {
      question: 'How long does the design process take?',
      answer: 'Typical timelines: landing pages take 2-3 weeks, multi-page websites take 4-8 weeks, and complex web applications take 8-12+ weeks depending on scope. We provide detailed timelines after the discovery phase.',
    },
    {
      question: 'What files do we receive?',
      answer: 'You receive the complete Figma design file with all components, styles, and assets. Plus exported images, icons, design system documentation, and a style guide for developers.',
    },
    {
      question: 'Can you redesign our existing website?',
      answer: 'Absolutely! We analyze your current site, identify what works and what doesn\'t, preserve your best-performing elements, and create a fresh design that improves conversion and user experience.',
    },
    {
      question: 'Do you also do the development?',
      answer: 'Yes! While this is the design service page, we can handle both design and development as a complete package. Many clients prefer this for seamless execution and faster timelines.',
    },
    {
      question: 'How many revisions are included?',
      answer: 'Landing pages include 2 rounds, multi-page sites include 3 rounds, and web applications include unlimited revisions. We work iteratively so you\'re involved throughout the process.',
    },
  ],
}

const relatedServices = [
  { 
    title: 'Web Development', 
    slug: 'web-development',
    description: 'Turn designs into blazing-fast, production-ready websites',
  },
  { 
    title: 'Content Creation', 
    slug: 'content-creation',
    description: 'Professional photos and videos to fill your beautiful design',
  },
  { 
    title: 'E-Commerce', 
    slug: 'e-commerce',
    description: 'Design online stores that turn browsers into buyers',
  },
]

export default function WebDesignContent() {
  const prefersReducedMotion = useReducedMotion()
  
  const [heroRef, heroInView] = useInView({
    threshold: 0.15,
    triggerOnce: true,
  })

  const [featuresRef, featuresInView] = useInView({
    threshold: 0.15,
    triggerOnce: true,
  })

  const [processRef, processInView] = useInView({
    threshold: 0.15,
    triggerOnce: true,
  })

  const [pricingRef, pricingInView] = useInView({
    threshold: 0.15,
    triggerOnce: true,
  })

  const [faqRef, faqInView] = useInView({
    threshold: 0.15,
    triggerOnce: true,
  })

  const [openFaq, setOpenFaq] = useState(null)

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
            {/* Breadcrumb */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2 text-sm text-[#88939D] mb-8 will-change-transform"
            >
              <Link href="/services" className="hover:text-[#00FF94] transition-colors duration-300">
                Services
              </Link>
              <span>/</span>
              <span className="text-white">{service.title}</span>
            </motion.div>

            {/* Icon */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
              animate={heroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{
                scale: 1.1,
                rotate: 5,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 30
                }
              }}
              className="w-20 h-20 text-[#00FF94] mb-8 will-change-transform"
            >
              {service.icon}
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[1.05] tracking-tight mb-6 will-change-transform"
            >
              <span className="block text-white">
                {service.title}
              </span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl md:text-2xl text-[#00FF94] mb-8 will-change-transform"
            >
              {service.tagline}
            </motion.p>

            {/* Description */}
            <motion.p
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-xl text-[#88939D] leading-relaxed max-w-3xl mb-12 will-change-transform"
            >
              {service.description}
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row gap-4 will-change-transform"
            >
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
                  whileTap={{ scale: 0.98 }}
                  className="group relative px-8 py-5 bg-gradient-to-r from-[#00FF94] to-[#00CC78] text-black font-bold rounded-xl text-lg overflow-hidden transition-all shadow-lg shadow-[#00FF94]/20 hover:shadow-xl hover:shadow-[#00FF94]/30 will-change-transform"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start a project
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
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
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-5 bg-transparent border-2 border-[#88939D]/30 text-white font-bold rounded-xl text-lg transition-all duration-300 will-change-transform"
                >
                  View examples
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94] to-transparent opacity-30" />
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
        
        {/* Subtle gradient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />

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
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-20 will-change-transform"
          >
            <motion.h2
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 will-change-transform"
            >
              What's included
            </motion.h2>
            
            <motion.p
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl md:text-2xl text-[#88939D] max-w-3xl will-change-transform"
            >
              Comprehensive design services that turn visitors into customers.
            </motion.p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {service.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ 
                  duration: 1, 
                  delay: 0.4 + index * 0.08,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="group relative will-change-transform"
              >
                <motion.div 
                  className="relative h-full p-8 lg:p-10 rounded-2xl bg-transparent border-2 border-[#88939D]/20 transition-all duration-500 hover:border-[#00FF94] overflow-hidden will-change-transform"
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

                  {/* Content */}
                  <div className="relative z-10">
                    <motion.div 
                      className="w-12 h-12 text-[#00FF94] mb-6"
                      whileHover={{
                        scale: 1.2,
                        rotate: 10,
                        transition: {
                          type: "spring",
                          stiffness: 400,
                          damping: 30
                        }
                      }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#00FF94] transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-[#88939D] leading-relaxed group-hover:text-white/70 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>

                  {/* Bottom gradient line accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
        
        {/* Subtle gradient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />

        {/* Noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Title */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="will-change-transform"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Why invest in
                <br />
                <span className="text-[#00FF94]">great design?</span>
              </h2>
              <p className="text-lg md:text-xl text-[#88939D] leading-relaxed">
                Professional design isn't just aesthetics—it's strategic investment that drives measurable business results and separates you from competition.
              </p>
            </motion.div>

            {/* Right - Benefits */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 will-change-transform"
            >
              {service.benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.3 + index * 0.08 }}
                  whileHover={{
                    x: 5,
                    borderColor: '#00FF94',
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 25
                    }
                  }}
                  className="flex gap-4 p-6 bg-transparent border-2 border-[#88939D]/20 rounded-xl transition-all duration-300 will-change-transform"
                >
                  <motion.div 
                    className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00FF94]/10 border border-[#00FF94]/30 flex items-center justify-center mt-1"
                    whileHover={{
                      scale: 1.2,
                      transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 30
                      }
                    }}
                  >
                    <svg className="w-4 h-4 text-[#00FF94]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">{benefit.title}</h4>
                    <p className="text-[#88939D]">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section ref={processRef} className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
        
        {/* Subtle gradient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />

        {/* Noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12">
          
          {/* Section Header */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            animate={processInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-20 text-center will-change-transform"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Our design process
            </h2>
            <p className="text-lg md:text-xl text-[#88939D]">
              A proven approach refined over dozens of projects.
            </p>
          </motion.div>

          {/* Process Steps */}
          <div className="space-y-6">
            {service.process.map((step, index) => (
              <motion.div
                key={index}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -30 }}
                animate={processInView ? { opacity: 1, x: 0 } : {}}
                transition={{ 
                  duration: 1, 
                  delay: 0.2 + index * 0.08,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="group will-change-transform"
              >
                <motion.div 
                  className="relative flex gap-6 p-8 bg-transparent border-2 border-[#88939D]/20 rounded-2xl hover:border-[#00FF94] transition-all duration-500 overflow-hidden will-change-transform"
                  whileHover={{
                    x: 5,
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

                  <motion.div 
                    className="relative z-10 flex-shrink-0 w-16 h-16 rounded-full bg-[#00FF94]/10 border-2 border-[#00FF94]/30 flex items-center justify-center text-[#00FF94] font-bold text-xl font-mono"
                    whileHover={{
                      scale: 1.1,
                      rotate: 10,
                      transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 30
                      }
                    }}
                  >
                    {step.number}
                  </motion.div>
                  <div className="relative z-10 flex-1">
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <h3 className="text-2xl font-bold text-white group-hover:text-[#00FF94] transition-colors duration-300">
                        {step.title}
                      </h3>
                      <span className="text-sm text-[#88939D] font-mono">{step.duration}</span>
                    </div>
                    <p className="text-[#88939D] leading-relaxed group-hover:text-white/70 transition-colors duration-300">{step.description}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingRef} className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
        
        {/* Subtle gradient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />

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
            animate={pricingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-20 text-center will-change-transform"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Investment ranges
            </h2>
            <p className="text-lg md:text-xl text-[#88939D] max-w-2xl mx-auto">
              Transparent pricing based on scope. Design-only services.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {service.pricing.ranges.map((range, index) => (
              <motion.div
                key={index}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
                animate={pricingInView ? { opacity: 1, y: 0 } : {}}
                transition={{ 
                  duration: 1, 
                  delay: 0.2 + index * 0.1,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="group relative will-change-transform"
              >
                <motion.div 
                  className="relative h-full p-8 lg:p-10 rounded-2xl bg-transparent border-2 border-[#88939D]/20 transition-all duration-500 hover:border-[#00FF94] overflow-hidden text-center will-change-transform"
                  whileHover={{
                    y: -8,
                    scale: 1.02,
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

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#00FF94] transition-colors duration-300">{range.size}</h3>
                    <motion.div 
                      className="text-4xl md:text-5xl font-bold text-[#00FF94] mb-6"
                      whileHover={{
                        scale: 1.1,
                        transition: {
                          type: "spring",
                          stiffness: 400,
                          damping: 30
                        }
                      }}
                    >
                      {range.price}
                    </motion.div>
                    <p className="text-[#88939D] mb-6 group-hover:text-white/70 transition-colors duration-300">{range.description}</p>
                    
                    {/* Features List */}
                    <div className="space-y-3 mb-6 text-left">
                      {range.features.map((feature, i) => (
                        <motion.div 
                          key={i} 
                          className="flex items-center gap-2 text-sm text-[#88939D]"
                          initial={{ opacity: 0, x: -10 }}
                          animate={pricingInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ duration: 0.5, delay: 0.4 + index * 0.1 + i * 0.05 }}
                        >
                          <svg className="w-5 h-5 text-[#00FF94] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom gradient line accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Pricing Note */}
          <motion.p
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={pricingInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center text-[#88939D] max-w-2xl mx-auto"
          >
            {service.pricing.note}
          </motion.p>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={faqRef} className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
        
        {/* Subtle gradient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />

        {/* Noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-12">
          
          {/* Section Header */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16 text-center will-change-transform"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Common questions
            </h2>
            <p className="text-lg md:text-xl text-[#88939D]">
              Everything you need to know about our web design services.
            </p>
          </motion.div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {service.faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                animate={faqInView ? { opacity: 1, y: 0 } : {}}
                transition={{ 
                  duration: 0.7, 
                  delay: 0.2 + index * 0.05,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="border-2 border-[#88939D]/20 rounded-2xl overflow-hidden hover:border-[#00FF94]/30 transition-colors duration-300 will-change-transform"
              >
                <motion.button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  whileHover={{
                    backgroundColor: 'rgba(0, 255, 148, 0.05)',
                    transition: { duration: 0.2 }
                  }}
                  className="w-full p-6 lg:p-8 flex items-center justify-between text-left bg-transparent transition-colors"
                >
                  <span className="font-bold text-lg lg:text-xl pr-4 text-white">{faq.question}</span>
                  <motion.svg
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="w-6 h-6 text-[#00FF94] flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </motion.button>
                {openFaq === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="px-6 lg:px-8 pb-6 lg:pb-8 text-[#88939D] leading-relaxed"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
        
        {/* Subtle gradient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />

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
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16 text-center will-change-transform"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Related services
            </h2>
            <p className="text-lg md:text-xl text-[#88939D]">
              Complete your project with our complementary services.
            </p>
          </motion.div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {relatedServices.map((related, index) => (
              <motion.div
                key={index}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 1, 
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="group will-change-transform"
              >
                <Link
                  href={`/services/${related.slug}`}
                  className="block relative h-full p-8 lg:p-10 bg-transparent border-2 border-[#88939D]/20 rounded-2xl hover:border-[#00FF94] transition-all duration-500 overflow-hidden will-change-transform"
                >
                  <motion.div
                    whileHover={{
                      y: -5,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 25
                      }
                    }}
                    className="relative h-full"
                  >
                    {/* Hover gradient background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/5 via-[#00CC78]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      initial={false}
                    />

                    <div className="relative z-10 text-center">
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#00FF94] transition-colors duration-300">
                        {related.title}
                      </h3>
                      <p className="text-[#88939D] group-hover:text-white/70 transition-colors duration-300">
                        {related.description}
                      </p>
                      <div className="flex items-center justify-center gap-2 text-[#00FF94] font-medium mt-6 group-hover:gap-3 transition-all duration-300">
                        Learn more
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>

                    {/* Bottom gradient line accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
        
        {/* Subtle gradient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />

        {/* Noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Ready to create something
              <br />
              <span className="text-[#00FF94]">extraordinary?</span>
            </h2>
            <p className="text-lg md:text-xl text-[#88939D] mb-12 max-w-2xl mx-auto">
              Let's discuss your project and create a design that drives real results.
            </p>
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
                whileTap={{ scale: 0.98 }}
                className="group relative px-8 py-5 bg-gradient-to-r from-[#00FF94] to-[#00CC78] text-black font-bold rounded-xl text-lg overflow-hidden transition-all shadow-lg shadow-[#00FF94]/20 hover:shadow-xl hover:shadow-[#00FF94]/30 will-change-transform"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get in touch
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Bottom gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#00FF94] to-transparent opacity-30" />
    </div>
  )
}