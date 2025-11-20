// app/blog/page.jsx

'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { blogPosts, getAllCategories } from '@/content/blog'

export default function BlogPage() {
  const [heroRef, heroInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  const [filterRef, filterInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  const [featuredRef, featuredInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  const [gridRef, gridInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Get categories from blog data
  const allCategories = getAllCategories()
  const categories = ['All', ...allCategories]

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  // Map blog posts to match the component's expected format
  const posts = blogPosts.map(post => ({
    id: post.slug, // Use slug as id for the link
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    author: post.author.name,
    date: formatDate(post.publishedAt),
    readTime: post.readTime,
    image: post.thumbnail,
    featured: post.featured,
    tags: post.tags,
  }))

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredPosts = posts.filter(post => post.featured)
  const regularPosts = filteredPosts.filter(post => !post.featured)

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
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-[#00CC78]/20 via-[#00FF94]/10 to-transparent rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-20">
          
          <div className="max-w-5xl">
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8"
            >
              <span className="inline-block px-4 py-2 bg-[#00FF94]/10 border border-[#00FF94]/30 rounded-full text-[#00FF94] text-sm font-mono uppercase tracking-wider">
                Our Blog
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[1.05] tracking-tight mb-8"
            >
              <span className="block text-white">
                Insights &
              </span>
              <span className="block text-white">
                <span className="text-[#00FF94]">inspiration</span>.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-xl md:text-2xl text-[#88939D] leading-relaxed max-w-3xl"
            >
              Thoughts on design, development, and building better digital experiences. 
              Stay updated with the latest trends and best practices.
            </motion.p>
          </div>
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94] to-transparent opacity-30" />
      </section>

      {/* Search & Filter Section */}
      <section ref={filterRef} className="relative py-12 bg-[#0F0F0F] border-b border-[#88939D]/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            
            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={filterInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-full lg:w-96"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-4 pl-12 bg-transparent border-2 border-[#88939D]/20 rounded-xl text-white placeholder-[#88939D] focus:border-[#00FF94] focus:outline-none transition-all"
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#88939D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </motion.div>

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={filterInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap gap-3 justify-center lg:justify-end"
            >
              {categories.map((category, index) => (
                <motion.button
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={filterInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.15 + index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setSelectedCategory(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-[#00FF94] to-[#00CC78] text-black'
                      : 'bg-transparent border-2 border-[#88939D]/20 text-[#88939D] hover:border-[#00FF94] hover:text-white'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {selectedCategory === 'All' && searchQuery === '' && (
        <section ref={featuredRef} className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
          
          {/* Subtle gradient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none" />

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
              animate={featuredInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mb-20"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={featuredInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
              >
                Featured Articles
              </motion.h2>
            </motion.div>

            {/* Featured Posts Grid */}
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
              {featuredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={featuredInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.4 + index * 0.15,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="group cursor-pointer"
                >
                  <Link href={`/blog/${post.id}`}>
                    <div className="relative h-full rounded-2xl bg-transparent border-2 border-[#88939D]/20 transition-all duration-300 hover:border-[#00FF94] overflow-hidden">
                      
                      {/* Hover gradient background */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/5 via-[#00CC78]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={false}
                      />

                      {/* Image */}
                      <div className="relative aspect-video bg-gradient-to-br from-[#1a1a1a] to-[#0F0F0F] overflow-hidden">
                        {post.image ? (
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-[#88939D]">
                            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <div className="absolute top-4 left-4 z-10">
                          <span className="px-3 py-1 bg-gradient-to-r from-[#00FF94] to-[#00CC78] text-black text-xs font-bold rounded-full uppercase">
                            Featured
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="relative z-10 p-8">
                        <div className="space-y-3">
                          
                          {/* Meta */}
                          <div className="flex items-center gap-3 text-sm text-[#88939D]">
                            <span className="px-2 py-1 bg-[#00FF94]/10 rounded text-[#00FF94] font-mono">{post.category}</span>
                            <span>{post.date}</span>
                            <span>•</span>
                            <span>{post.readTime}</span>
                          </div>
                          
                          {/* Title */}
                          <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-[#00FF94] transition-colors">
                            {post.title}
                          </h3>
                          
                          {/* Excerpt */}
                          <p className="text-[#88939D] leading-relaxed">
                            {post.excerpt}
                          </p>

                          {/* Author */}
                          <div className="flex items-center gap-3 pt-4 border-t border-[#88939D]/10">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00FF94] to-[#00CC78] flex items-center justify-center text-black font-bold text-sm">
                              {post.author.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-sm text-white">{post.author}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom gradient line accent */}
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts Grid */}
      <section ref={gridRef} className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
        
        {/* Subtle gradient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none" />

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
            animate={gridInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-20"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={gridInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              {selectedCategory === 'All' ? 'Latest Articles' : `${selectedCategory} Articles`}
            </motion.h2>
          </motion.div>

          {/* Posts Grid or Empty State */}
          {regularPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {regularPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={gridInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.2 + index * 0.1,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="group cursor-pointer"
                >
                  <Link href={`/blog/${post.id}`}>
                    <div className="relative h-full rounded-2xl bg-transparent border-2 border-[#88939D]/20 transition-all duration-300 hover:border-[#00FF94] overflow-hidden">
                      
                      {/* Hover gradient background */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/5 via-[#00CC78]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={false}
                      />

                      {/* Image */}
                      <div className="relative aspect-video bg-gradient-to-br from-[#1a1a1a] to-[#0F0F0F] overflow-hidden">
                        {post.image ? (
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-[#88939D]">
                            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="relative z-10 p-8">
                        <div className="space-y-3">
                          
                          {/* Meta */}
                          <div className="flex items-center gap-2 text-xs text-[#88939D]">
                            <span className="px-2 py-1 bg-[#00FF94]/10 rounded text-[#00FF94] font-mono">{post.category}</span>
                            <span>{post.readTime}</span>
                          </div>
                          
                          {/* Title */}
                          <h3 className="text-xl font-bold text-white group-hover:text-[#00FF94] transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          
                          {/* Excerpt */}
                          <p className="text-[#88939D] text-sm leading-relaxed line-clamp-2">
                            {post.excerpt}
                          </p>

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-3 border-t border-[#88939D]/10">
                            <span className="text-xs text-[#88939D]">{post.date}</span>
                            <span className="text-xs text-[#00FF94] font-medium group-hover:gap-1 flex items-center transition-all">
                              Read more
                              <svg className="w-4 h-4 ml-0 group-hover:ml-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom gradient line accent */}
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <svg className="w-16 h-16 mx-auto mb-4 text-[#88939D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-[#88939D] text-lg">No articles found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
        
        {/* Subtle gradient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none" />

        {/* Noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Never miss an
              <br />
              <span className="text-[#00FF94]">update</span>
            </h2>
            <p className="text-lg md:text-xl text-[#88939D] mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and get the latest articles delivered straight to your inbox.
            </p>

            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-4">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-4 bg-transparent border-2 border-[#88939D]/20 rounded-xl text-white placeholder-[#88939D] focus:border-[#00FF94] focus:outline-none transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-[#00FF94] to-[#00CC78] text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#00FF94]/20 transition-all"
              >
                Subscribe
              </motion.button>
            </form>

            <p className="text-xs text-[#88939D]">
              No spam, unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Bottom gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#00FF94] to-transparent opacity-30" />
    </div>
  )
}