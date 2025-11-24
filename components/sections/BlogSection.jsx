// components/sections/BlogSection.jsx

'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import Image from 'next/image'
import { blogPosts } from '@/content/blog'

export default function BlogSection() {
  const prefersReducedMotion = useReducedMotion()
  
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  // Get latest blog posts (limited to 3 for homepage)
  const latestPosts = blogPosts.slice(0, 3)

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <section ref={ref} className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
      
      {/* Subtle gradient glow */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />

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
          className="mb-20 will-change-transform"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-3xl">
              <motion.h2
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 will-change-transform"
              >
                Latest insights
              </motion.h2>
              
              <motion.p
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-xl md:text-2xl text-[#88939D] will-change-transform"
              >
                Thoughts on design, development, and building better digital experiences.
              </motion.p>
            </div>

            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex-shrink-0 will-change-transform"
            >
              <Link href="/blog">
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
                  className="px-6 py-3 border-2 border-[#88939D]/30 text-white font-semibold rounded-xl text-base hover:text-[#00FF94] transition-colors duration-300 flex items-center gap-2 will-change-transform group"
                >
                  View all articles
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {latestPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 1, 
                delay: 0.5 + index * 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="will-change-transform"
            >
              <Link href={`/blog/${post.slug}`}>
                <motion.div 
                  className="group relative cursor-pointer h-full"
                  whileHover={{ 
                    y: -8,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 25
                    }
                  }}
                >
                  
                  {/* Post Image Container */}
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-[#1A1A1A] border-2 border-[#88939D]/20 group-hover:border-[#00FF94] transition-all duration-500 will-change-transform">
                    
                    {/* Image or Placeholder */}
                    {post.thumbnail ? (
                      <motion.div
                        className="relative w-full h-full"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <Image
                          src={post.thumbnail}
                          alt={post.title}
                          fill
                          className="object-cover will-change-transform"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </motion.div>
                    ) : (
                      /* Placeholder with gradient */
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.svg 
                          className="w-16 h-16 text-white/5 group-hover:text-[#00FF94]/10 transition-colors duration-500"
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor" 
                          strokeWidth={1}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </motion.svg>
                      </div>
                    )}
                    
                    {/* Gradient overlay on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/10 via-[#00CC78]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />

                    {/* Category badge */}
                    <motion.div 
                      className="absolute top-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm border border-[#88939D]/30 rounded-lg text-white/80 text-xs font-medium z-10"
                      whileHover={{ 
                        scale: 1.05,
                        backgroundColor: 'rgba(0, 255, 148, 0.1)',
                        borderColor: '#00FF94',
                        transition: { duration: 0.3 }
                      }}
                    >
                      {post.category}
                    </motion.div>

                    {/* Read Article indicator on hover */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      className="absolute bottom-6 left-6 flex items-center gap-2 z-10 opacity-0 group-hover:opacity-100"
                      transition={{ 
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                    >
                      <motion.div 
                        className="w-2 h-2 rounded-full bg-[#00FF94]"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 2,
                          ease: "easeInOut"
                        }}
                      />
                      <span className="text-white text-sm font-semibold">Read article</span>
                    </motion.div>
                  </div>

                  {/* Post Info */}
                  <div className="space-y-3">
                    {/* Meta Info */}
                    <motion.div 
                      className="flex items-center gap-3 text-sm text-[#88939D] group-hover:text-[#00FF94] transition-colors duration-300"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <time dateTime={post.publishedAt}>
                        {formatDate(post.publishedAt)}
                      </time>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-[#00FF94] transition-colors duration-300 line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-[#88939D] leading-relaxed line-clamp-2 group-hover:text-white/70 transition-colors duration-300">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {post.tags.slice(0, 2).map((tag, i) => (
                        <motion.span
                          key={i}
                          whileHover={{ 
                            scale: 1.05,
                            borderColor: '#00FF94',
                            color: '#00FF94',
                            transition: { duration: 0.2 }
                          }}
                          className="px-3 py-1.5 bg-transparent border border-[#88939D]/30 rounded-lg text-xs text-[#88939D] font-medium transition-all duration-300 will-change-transform"
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 pt-20 border-t border-[#88939D]/20 will-change-transform"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Stay updated with our newsletter
              </h3>
              <p className="text-lg text-[#88939D]">
                Get the latest articles and insights delivered straight to your inbox.
              </p>
            </div>
            
            <Link href="/blog">
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
                className="px-8 py-5 bg-gradient-to-r from-[#00FF94] to-[#00CC78] text-black font-bold rounded-xl text-lg transition-all whitespace-nowrap will-change-transform shadow-lg shadow-[#00FF94]/20 hover:shadow-xl hover:shadow-[#00FF94]/30"
              >
                Explore all articles
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}