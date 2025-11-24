// app/services/ecommerce/EcommerceContent.jsx

'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { useState } from 'react'

const service = {
  title: 'Shopify Development',
  tagline: 'Online stores that sell',
  description: 'Custom Shopify stores built for conversions. We design, develop, and optimize Shopify themes that turn browsers into buyers—with fast performance and seamless checkout.',
  
  icon: (
    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  
  features: [
    {
      title: 'Custom Theme Development',
      description: 'Unique Shopify themes built from scratch to match your brand. No templates—just custom design and development tailored to your products.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      title: 'Payment Integration',
      description: 'Shopify Payments, Stripe, PayPal, and more. Multi-currency support and buy-now-pay-later options like Klarna and Afterpay.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
    {
      title: 'Product Setup',
      description: 'Complete product catalog setup with optimized images, SEO-friendly descriptions, variants, and collections that help customers find what they need.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      title: 'Checkout Optimization',
      description: 'Streamlined checkout flow designed to reduce cart abandonment. One-click checkout, guest checkout, and mobile-optimized payment.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      title: 'App Integration',
      description: 'Connect with Klaviyo for email marketing, Google Analytics for tracking, ShipStation for fulfillment, and any other apps your business needs.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 010 2H6v10h4a1 1 0 010 2H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v12a1 1 0 01-1 1h-4a1 1 0 010-2h3V6h-3a1 1 0 01-1-1z" />
        </svg>
      ),
    },
    {
      title: 'Performance Optimization',
      description: 'Fast-loading stores that rank well in Google. Image optimization, code cleanup, and performance tuning for better conversions.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ],
  
  process: [
    {
      number: '01',
      title: 'Store Strategy',
      description: 'We analyze your products, target customers, and competitors to plan a store that converts. Define collections, navigation, and user flow.',
      duration: '1 week',
    },
    {
      number: '02',
      title: 'Design & Branding',
      description: 'Custom Shopify theme design that matches your brand. Product page layouts, homepage design, and mobile-first approach.',
      duration: '2-3 weeks',
    },
    {
      number: '03',
      title: 'Theme Development',
      description: 'Building your custom Shopify theme with clean Liquid code, integrated apps, and optimized performance.',
      duration: '3-4 weeks',
    },
    {
      number: '04',
      title: 'Product Setup',
      description: 'Upload and optimize your products with SEO-friendly descriptions, high-quality images, variants, and organized collections.',
      duration: '1-2 weeks',
    },
    {
      number: '05',
      title: 'Testing & Launch',
      description: 'Comprehensive testing of checkout, payments, mobile experience, and integrations. Then go live with monitoring.',
      duration: '1 week',
    },
    {
      number: '06',
      title: 'Growth & Optimization',
      description: 'Post-launch support, conversion optimization, and ongoing improvements based on analytics and customer behavior.',
      duration: 'Ongoing',
    },
  ],
  
  benefits: [
    {
      title: 'Higher Conversions',
      description: 'Optimized product pages, streamlined checkout, and fast performance turn more visitors into paying customers.',
    },
    {
      title: 'Professional Branding',
      description: 'Custom design that stands out from template stores. Build trust and credibility with professional presentation.',
    },
    {
      title: 'Easy Management',
      description: 'Shopify\'s admin makes it simple to add products, process orders, and manage inventory—even if you\'re not technical.',
    },
    {
      title: 'Scale Ready',
      description: 'Built on Shopify\'s reliable infrastructure. Handle traffic spikes, add products, and grow without technical headaches.',
    },
  ],

  shopifyTools: [
    { name: 'Shopify', category: 'Platform' },
    { name: 'Shopify Plus', category: 'Enterprise' },
    { name: 'Liquid', category: 'Theme Code' },
    { name: 'Shopify Payments', category: 'Payments' },
    { name: 'Stripe', category: 'Payments' },
    { name: 'PayPal', category: 'Payments' },
    { name: 'Klaviyo', category: 'Email Marketing' },
    { name: 'Google Analytics', category: 'Analytics' },
    { name: 'Meta Pixel', category: 'Tracking' },
    { name: 'ShipStation', category: 'Fulfillment' },
    { name: 'Judge.me', category: 'Reviews' },
    { name: 'Yotpo', category: 'Reviews' },
  ],

  pricing: {
    ranges: [
      { 
        size: 'Starter Store', 
        price: '€5,000 - €8,000', 
        description: 'Small stores with up to 50 products',
        features: ['Custom theme design', 'Up to 50 products', 'Payment integration', 'Mobile responsive', 'SEO setup', '3 months support']
      },
      { 
        size: 'Standard Store', 
        price: '€8,000 - €15,000', 
        description: 'Full-featured stores for growing businesses',
        features: ['Custom theme development', 'Unlimited products', 'App integrations', 'Email marketing setup', 'Analytics configuration', '6 months support']
      },
      { 
        size: 'Advanced Store', 
        price: '€15,000+', 
        description: 'Complex stores with custom features',
        features: ['Shopify Plus setup', 'Custom app development', 'Advanced integrations', 'Multi-store support', 'Wholesale portal', '12 months support']
      },
    ],
    note: 'Does not include Shopify monthly fees (€29-299+) or app subscriptions. Price varies based on product count, custom features, and integrations.',
  },
  
  faqs: [
    {
      question: 'Why Shopify and not a custom solution?',
      answer: 'Shopify handles hosting, security, payments, and updates—so you can focus on selling. It\'s reliable, scalable, and has an ecosystem of apps for anything you need. For most businesses, Shopify is the best choice. If you need a fully custom e-commerce platform, check out our Web Applications service.',
    },
    {
      question: 'Can you work with my existing Shopify store?',
      answer: 'Yes! We can redesign your theme, add custom features, improve performance, or help with Shopify migrations. We work with stores at any stage.',
    },
    {
      question: 'How long does it take to launch?',
      answer: 'Typical timeline is 6-10 weeks from kickoff to launch. This includes design, development, product setup, and testing. Timeline depends on product count and custom features needed.',
    },
    {
      question: 'Do I need to provide product photos?',
      answer: 'Yes, you\'ll need to provide product images. We can optimize and edit them for web use, but we don\'t offer product photography. We can recommend photographers if needed.',
    },
    {
      question: 'What about ongoing costs?',
      answer: 'Shopify charges monthly fees starting at €29/month (Basic) up to €299+/month (Plus). Apps have their own subscriptions (typically €10-50/month each). Transaction fees apply unless you use Shopify Payments.',
    },
    {
      question: 'Can you help with marketing after launch?',
      answer: 'We focus on the technical side—building your store and setting up tools like email marketing and analytics. For ongoing marketing, we can recommend specialists or agencies who handle ads, email campaigns, and SEO.',
    },
  ],
}

const relatedServices = [
  { 
    title: 'Web Design', 
    slug: 'web-design',
    description: 'Conversion-focused designs for your store',
  },
  { 
    title: 'Web Applications', 
    slug: 'web-applications',
    description: 'Need a custom e-commerce platform? Build it from scratch',
  },
  { 
    title: 'SEO', 
    slug: 'search-engine-optimization',
    description: 'Technical SEO to help your store rank in Google',
  },
]

export default function EcommerceContent() {
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
              Everything you need to launch a professional Shopify store.
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

      {/* Shopify Tools Section */}
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
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Shopify ecosystem
            </h2>
            <p className="text-lg md:text-xl text-[#88939D] max-w-2xl mx-auto">
              We integrate your store with the best apps and tools in the Shopify ecosystem.
            </p>
          </motion.div>

          {/* Tools Grid */}
          <div className="flex flex-wrap gap-4 justify-center">
            {service.shopifyTools.map((tool, index) => (
              <motion.div
                key={index}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.04,
                  ease: [0.16, 1, 0.3, 1]
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -3,
                  borderColor: '#00FF94',
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                  }
                }}
                className="px-6 py-3 bg-transparent border-2 border-[#88939D]/20 rounded-xl transition-all duration-300 will-change-transform"
              >
                <span className="font-medium text-white">{tool.name}</span>
                <span className="text-xs text-[#88939D] ml-2">({tool.category})</span>
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
                Why build on
                <br />
                <span className="text-[#00FF94]">Shopify?</span>
              </h2>
              <p className="text-lg md:text-xl text-[#88939D] leading-relaxed">
                Shopify handles hosting, security, and payments so you can focus on selling. It's the most reliable e-commerce platform for growing businesses.
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
              Our process
            </h2>
            <p className="text-lg md:text-xl text-[#88939D]">
              From strategy to launch, we guide you through every step of building your Shopify store.
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
              Shopify store packages for businesses at every stage of growth.
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
              Everything you need to know about Shopify development.
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
              Complete solutions for your online store.
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
              Ready to launch your
              <br />
              <span className="text-[#00FF94]">Shopify store?</span>
            </h2>
            <p className="text-lg md:text-xl text-[#88939D] mb-12 max-w-2xl mx-auto">
              Let's build a custom Shopify store that turns browsers into buyers and grows with your business.
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