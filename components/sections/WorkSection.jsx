// components/sections/WorkSection.jsx

'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import Image from 'next/image'
import { getFeaturedProjects } from '@/content/projects'
import { useMobileOptimization } from '@/lib/useMobileOptimization'

export default function WorkSection() {
  const {
    shouldReduceAnimations,
    shouldDisableHover,
    prefersReducedMotion
  } = useMobileOptimization()
  
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  // Get featured projects (limited to 4 for homepage)
  const projects = getFeaturedProjects().slice(0, 4)

  return (
    <section ref={ref} className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">

      {/* Subtle gradient glow */}
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none" />

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
          initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: shouldReduceAnimations ? 0 : 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-3xl">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Selected work
              </h2>

              <p className="text-xl md:text-2xl text-[#88939D]">
                Real projects, real results. See how we've helped businesses grow online.
              </p>
            </div>

            <div className="flex-shrink-0">
              <Link href="/work">
                <button className="px-6 py-3 border-2 border-[#88939D]/30 text-white font-semibold rounded-xl text-base hover:text-[#00FF94] hover:border-[#00FF94] transition-colors duration-300 flex items-center gap-2">
                  View all projects
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: shouldReduceAnimations ? 0 : 1,
                delay: shouldReduceAnimations ? 0 : 0.5 + index * 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              <Link href={`/work/${project.slug}`}>
                <div className="group relative cursor-pointer">

                  {/* Project Image Container */}
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-[#1A1A1A] border-2 border-[#88939D]/20 group-hover:border-[#00FF94] transition-all duration-500">

                    {/* Image or Placeholder */}
                    {project.thumbnail ? (
                      <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      /* Placeholder with gradient */
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-[8rem] font-black text-white/5 group-hover:text-[#00FF94]/10 transition-colors duration-500">
                          0{index + 1}
                        </div>
                      </div>
                    )}

                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/10 via-[#00CC78]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Year badge */}
                    <div className="absolute top-4 right-4 px-4 py-2 bg-black/60 backdrop-blur-sm border border-[#88939D]/30 rounded-lg text-white/80 text-sm font-medium z-10">
                      {project.year}
                    </div>

                    {/* View Project indicator on hover */}
                    <div className="absolute bottom-6 left-6 flex items-center gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-2 h-2 rounded-full bg-[#00FF94]" />
                      <span className="text-white text-sm font-semibold">View project</span>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="space-y-3">
                    {/* Category */}
                    <p className="text-sm uppercase tracking-wider text-[#88939D] font-medium transition-colors duration-300 group-hover:text-[#00FF94]">
                      {project.category}
                    </p>

                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-[#00FF94] transition-colors duration-300">
                      {project.title}
                    </h3>

                    {/* Tagline/Description */}
                    <p className="text-[#88939D] leading-relaxed transition-colors duration-300 group-hover:text-white/80">
                      {project.tagline}
                    </p>

                    {/* Services (as tags) */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.services.slice(0, 3).map((service, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-transparent border border-[#88939D]/30 rounded-lg text-xs text-[#88939D] font-medium hover:border-[#00FF94] hover:text-[#00FF94] transition-all duration-300"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: shouldReduceAnimations ? 0 : 1, delay: shouldReduceAnimations ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 pt-20 border-t border-[#88939D]/20"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Let's build something great
              </h3>
              <p className="text-lg text-[#88939D]">
                Ready to start your project? Get in touch and let's discuss how we can help.
              </p>
            </div>

            <Link href="/contact">
              <button className="px-8 py-5 bg-gradient-to-r from-[#00FF94] to-[#00CC78] text-black font-bold rounded-xl text-lg transition-all whitespace-nowrap shadow-lg shadow-[#00FF94]/20 hover:shadow-xl hover:shadow-[#00FF94]/30">
                Start your project
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}