// app/work/page.jsx

'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { projects, getAllCategories } from '@/content/projects'

export default function WorkPage() {
  const prefersReducedMotion = useReducedMotion()
  
  const [heroRef, heroInView] = useInView({
    threshold: 0.15,
    triggerOnce: true,
  })

  const [filterRef, filterInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  const [featuredRef, featuredInView] = useInView({
    threshold: 0.15,
    triggerOnce: true,
  })

  const [gridRef, gridInView] = useInView({
    threshold: 0.15,
    triggerOnce: true,
  })

  const [selectedCategory, setSelectedCategory] = useState('All')
  const [hoveredProject, setHoveredProject] = useState(null)

  // Get categories from projects data
  const allCategories = getAllCategories()
  const categories = ['All', ...allCategories]

  // Filter projects by category
  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory)

  const featuredProjects = filteredProjects.filter(p => p.featured)
  const regularProjects = filteredProjects.filter(p => !p.featured)

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
                Our Work
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[1.05] tracking-tight mb-8 will-change-transform"
            >
              <span className="block text-white">
                Projects we're
              </span>
              <span className="block text-white">
                proud of<span className="text-[#00FF94]">.</span>
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl md:text-2xl text-[#88939D] leading-relaxed max-w-3xl will-change-transform"
            >
              A showcase of our recent work—from stunning websites to powerful web applications. 
              Each project tells a story of collaboration, innovation, and results.
            </motion.p>
          </div>
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94] to-transparent opacity-30" />
      </section>

      {/* Filter Section */}
      <section ref={filterRef} className="relative py-12 bg-[#0F0F0F] border-b border-[#88939D]/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={filterInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-3 justify-center will-change-transform"
          >
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
                animate={filterInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.04, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ 
                  scale: 1.05,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                  }
                }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 will-change-transform ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-[#00FF94] to-[#00CC78] text-black shadow-lg shadow-[#00FF94]/20'
                    : 'bg-transparent border-2 border-[#88939D]/20 text-[#88939D] hover:border-[#00FF94] hover:text-white'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section ref={featuredRef} className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
          
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
              animate={featuredInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-20 will-change-transform"
            >
              <motion.h2
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                animate={featuredInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 will-change-transform"
              >
                Featured Work
              </motion.h2>
            </motion.div>

            {/* Featured Projects */}
            <div className="space-y-32">
              {featuredProjects.map((project, index) => (
                <motion.article
                  key={project.id}
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
                  animate={featuredInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ 
                    duration: 1, 
                    delay: 0.3 + index * 0.15,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="group will-change-transform"
                >
                  <Link href={`/work/${project.slug}`}>
                    <div className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                      
                      {/* Image */}
                      <div className={`relative ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                        <motion.div
                          whileHover={{ 
                            scale: 1.02,
                            transition: {
                              type: "spring",
                              stiffness: 300,
                              damping: 25
                            }
                          }}
                          className="relative aspect-[4/3] bg-gradient-to-br from-[#1a1a1a] to-[#0F0F0F] rounded-2xl overflow-hidden border-2 border-[#88939D]/20 group-hover:border-[#00FF94] transition-all duration-500 will-change-transform"
                        >
                          {project.thumbnail ? (
                            <motion.div
                              className="relative w-full h-full"
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            >
                              <Image
                                src={project.thumbnail}
                                alt={project.title}
                                fill
                                className="object-cover will-change-transform"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                              />
                            </motion.div>
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-[#88939D]">
                              <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                          {/* Bottom gradient line accent */}
                          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </motion.div>

                        {/* Featured Badge */}
                        <motion.div 
                          className="absolute -top-4 -right-4 px-4 py-2 bg-gradient-to-r from-[#00FF94] to-[#00CC78] text-black font-bold text-sm rounded-full z-10 shadow-lg shadow-[#00FF94]/30"
                          initial={{ scale: 0, rotate: -10 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ duration: 0.5, delay: 0.5 + index * 0.15, type: "spring", stiffness: 300 }}
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
                          Featured
                        </motion.div>
                      </div>

                      {/* Content */}
                      <div className={index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                        <div className="space-y-6">
                          
                          {/* Category & Year */}
                          <div className="flex items-center gap-3 text-sm">
                            <span className="px-3 py-1 bg-transparent border-2 border-[#00FF94]/30 rounded-full text-[#00FF94] font-mono">
                              {project.category}
                            </span>
                            <span className="text-[#88939D]">{project.year}</span>
                          </div>

                          {/* Title */}
                          <h3 className="text-4xl md:text-5xl font-bold text-white group-hover:text-[#00FF94] transition-colors duration-300">
                            {project.title}
                          </h3>

                          {/* Description */}
                          <p className="text-[#88939D] text-lg md:text-xl leading-relaxed group-hover:text-white/70 transition-colors duration-300">
                            {project.description}
                          </p>

                          {/* Services */}
                          <div>
                            <p className="text-sm text-[#88939D] uppercase tracking-wider font-mono mb-3">
                              Services
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {project.services.map((service, i) => (
                                <motion.span
                                  key={i}
                                  whileHover={{
                                    scale: 1.05,
                                    borderColor: '#00FF94',
                                    color: '#00FF94',
                                    transition: {
                                      type: "spring",
                                      stiffness: 400,
                                      damping: 30
                                    }
                                  }}
                                  className="px-3 py-1 bg-transparent border-2 border-[#88939D]/20 rounded-full text-white text-sm transition-colors duration-300 cursor-default will-change-transform"
                                >
                                  {service}
                                </motion.span>
                              ))}
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-4 pt-6">
                            {project.results.slice(0, 3).map((stat, i) => (
                              <motion.div 
                                key={i} 
                                className="text-center p-4 bg-transparent border-2 border-[#88939D]/20 rounded-xl hover:border-[#00FF94]/30 transition-all duration-500 will-change-transform"
                                whileHover={{
                                  y: -3,
                                  scale: 1.05,
                                  transition: {
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 25
                                  }
                                }}
                              >
                                <motion.div 
                                  className="text-2xl md:text-3xl font-bold text-[#00FF94] mb-1"
                                  whileHover={{
                                    scale: 1.1,
                                    transition: {
                                      type: "spring",
                                      stiffness: 400,
                                      damping: 30
                                    }
                                  }}
                                >
                                  {stat.metric}
                                </motion.div>
                                <div className="text-xs text-[#88939D] uppercase tracking-wider">
                                  {stat.label}
                                </div>
                              </motion.div>
                            ))}
                          </div>

                          {/* CTA */}
                          <motion.div 
                            className="flex items-center gap-2 text-[#00FF94] font-medium pt-4 group-hover:gap-3 transition-all duration-300"
                            whileHover={{
                              x: 5,
                              transition: {
                                type: "spring",
                                stiffness: 400,
                                damping: 30
                              }
                            }}
                          >
                            View Case Study
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Projects Grid */}
      {regularProjects.length > 0 && (
        <section ref={gridRef} className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
          
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
              animate={gridInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-20 will-change-transform"
            >
              <motion.h2
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                animate={gridInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 will-change-transform"
              >
                {selectedCategory === 'All' ? 'More Projects' : `${selectedCategory} Projects`}
              </motion.h2>
            </motion.div>

            {/* Projects Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {regularProjects.map((project, index) => (
                <motion.article
                  key={project.id}
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
                  animate={gridInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ 
                    duration: 1, 
                    delay: 0.2 + index * 0.08,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                  className="group cursor-pointer will-change-transform"
                >
                  <Link href={`/work/${project.slug}`}>
                    <motion.div 
                      className="relative h-full rounded-2xl bg-transparent border-2 border-[#88939D]/20 transition-all duration-500 hover:border-[#00FF94] overflow-hidden will-change-transform"
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
                        className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/5 via-[#00CC78]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        initial={false}
                      />

                      {/* Image */}
                      <div className="relative aspect-[4/3] bg-gradient-to-br from-[#1a1a1a] to-[#0F0F0F] overflow-hidden">
                        {project.thumbnail ? (
                          <Image
                            src={project.thumbnail}
                            alt={project.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-[#88939D]">
                            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}

                        {/* Overlay with Arrow */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 bg-black/80 flex items-center justify-center"
                        >
                          <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ 
                              scale: hoveredProject === project.id ? 1 : 0.8,
                              rotate: hoveredProject === project.id ? 0 : -10
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 25
                            }}
                            className="w-16 h-16 rounded-full bg-gradient-to-r from-[#00FF94] to-[#00CC78] flex items-center justify-center shadow-xl shadow-[#00FF94]/50"
                          >
                            <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </motion.div>
                        </motion.div>
                      </div>

                      {/* Content */}
                      <div className="relative z-10 p-8">
                        <div className="space-y-3">
                          
                          {/* Category & Year */}
                          <div className="flex items-center gap-2 text-sm group-hover:text-[#00FF94] transition-colors duration-300">
                            <span className="px-2 py-1 bg-[#00FF94]/10 rounded text-[#00FF94] font-mono">
                              {project.category}
                            </span>
                            <span className="text-[#88939D]">{project.year}</span>
                          </div>

                          {/* Title */}
                          <h3 className="text-2xl font-bold text-white group-hover:text-[#00FF94] transition-colors duration-300">
                            {project.title}
                          </h3>

                          {/* Tagline */}
                          <p className="text-[#88939D] leading-relaxed line-clamp-2 group-hover:text-white/70 transition-colors duration-300">
                            {project.tagline}
                          </p>

                          {/* Mini Stats */}
                          <div className="flex gap-4 pt-3 text-sm border-t border-[#88939D]/10">
                            {project.results.slice(0, 2).map((stat, i) => (
                              <motion.div 
                                key={i}
                                whileHover={{
                                  scale: 1.1,
                                  transition: {
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 30
                                  }
                                }}
                              >
                                <span className="text-[#00FF94] font-bold">{stat.metric}</span>
                                <span className="text-[#88939D] ml-1 text-xs">{stat.label}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Bottom gradient line accent */}
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </motion.div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

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

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border-t border-[#88939D]/20 pt-20"
          >
            <div className="max-w-2xl">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to start your project?
              </h3>
              <p className="text-lg text-[#88939D]">
                Let's create something amazing together. Get in touch and let's discuss 
                how we can bring your vision to life.
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

              <Link href="/services">
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
                  View services
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