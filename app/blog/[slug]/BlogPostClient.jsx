// app/blog/[slug]/BlogPostClient.jsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import Image from 'next/image';
import { blogPosts } from '@/content/blog';

export default function BlogPostClient({ post }) {
  const prefersReducedMotion = useReducedMotion();
  
  const [heroRef, heroInView] = useInView({
    threshold: 0.15,
    triggerOnce: true,
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get related posts data
  const getRelatedPosts = () => {
    if (!post.relatedPosts || post.relatedPosts.length === 0) return [];
    
    return post.relatedPosts
      .map(relatedId => blogPosts.find(p => p.id === relatedId))
      .filter(Boolean)
      .slice(0, 3);
  };

  const relatedPosts = getRelatedPosts();

  const renderContent = (section, index) => {
    switch (section.type) {
      case 'text':
        return (
          <p key={index} className="text-lg text-[#88939D] leading-relaxed mb-6">
            {section.content}
          </p>
        );
      
      case 'heading':
        const HeadingTag = `h${section.level}`;
        const headingClass = section.level === 2 
          ? 'text-3xl md:text-4xl font-bold text-white mb-6 mt-12'
          : 'text-2xl md:text-3xl font-bold text-white mb-4 mt-8';
        
        return (
          <HeadingTag key={index} className={headingClass}>
            {section.content}
          </HeadingTag>
        );
      
      case 'quote':
        return (
          <blockquote key={index} className="my-8 pl-6 border-l-4 border-[#00FF94]">
            <p className="text-xl text-white italic mb-2">{section.content}</p>
            {section.author && (
              <cite className="text-sm text-[#88939D] not-italic">— {section.author}</cite>
            )}
          </blockquote>
        );
      
      case 'list':
        const ListTag = section.ordered ? 'ol' : 'ul';
        const listClass = section.ordered 
          ? 'list-decimal list-inside space-y-2 mb-6 text-[#88939D]'
          : 'space-y-3 mb-6';
        
        return (
          <ListTag key={index} className={listClass}>
            {section.items.map((item, i) => (
              <li key={i} className={section.ordered ? '' : 'flex items-start gap-3'}>
                {!section.ordered && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00FF94] mt-2 flex-shrink-0" />
                )}
                <span className="text-[#88939D]">{item}</span>
              </li>
            ))}
          </ListTag>
        );
      
      case 'code':
        return (
          <div key={index} className="my-6">
            <div className="bg-[#0a0a0a] rounded-xl border-2 border-[#88939D]/20 overflow-hidden">
              <div className="px-4 py-2 bg-[#88939D]/10 border-b border-[#88939D]/20 flex items-center justify-between">
                <span className="text-xs text-[#88939D] font-mono">{section.language}</span>
                <button className="text-xs text-[#00FF94] hover:text-[#00CC78] transition-colors">
                  Copy
                </button>
              </div>
              <pre className="p-6 overflow-x-auto">
                <code className="text-sm text-[#88939D] font-mono">
                  {section.content}
                </code>
              </pre>
            </div>
          </div>
        );
      
      case 'callout':
        const calloutStyles = {
          info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
          tip: 'bg-[#00FF94]/10 border-[#00FF94]/30 text-[#00FF94]',
          warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
          danger: 'bg-red-500/10 border-red-500/30 text-red-400',
        };
        
        return (
          <div 
            key={index} 
            className={`my-6 p-6 rounded-xl border-2 ${calloutStyles[section.style] || calloutStyles.info}`}
          >
            <p className="text-sm leading-relaxed">{section.content}</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 bg-[#0F0F0F] overflow-hidden">
        
        {/* Subtle noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Gradient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-[#00CC78]/20 via-[#00FF94]/10 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 lg:px-12">
          
          {/* Breadcrumb */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 text-sm text-[#88939D] mb-8 will-change-transform"
          >
            <Link href="/blog" className="hover:text-[#00FF94] transition-colors">
              Blog
            </Link>
            <span>/</span>
            <span className="text-white">{post.title}</span>
          </motion.div>

          {/* Category Badge */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block mb-6 will-change-transform"
          >
            <span className="px-4 py-2 rounded-full border border-[#00FF94]/30 bg-[#00FF94]/5 text-[#00FF94] text-sm font-medium">
              {post.category}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(2.5rem,6vw,4rem)] font-bold leading-[1.1] tracking-tight mb-6 text-white will-change-transform"
          >
            {post.title}
          </motion.h1>

          {/* Excerpt */}
          <motion.p
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl text-[#88939D] mb-8 leading-relaxed will-change-transform"
          >
            {post.excerpt}
          </motion.p>

          {/* Meta Info */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-6 flex-wrap will-change-transform"
          >
            {/* Author */}
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00FF94] to-[#00CC78] relative overflow-hidden"
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
                {post.author.avatar && (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                )}
              </motion.div>
              <div>
                <div className="text-white font-semibold">{post.author.name}</div>
                <div className="text-sm text-[#88939D]">{post.author.role}</div>
              </div>
            </div>

            <div className="h-6 w-px bg-[#88939D]/30" />

            {/* Date */}
            <time dateTime={post.publishedAt} className="text-[#88939D]">
              {formatDate(post.publishedAt)}
            </time>

            <div className="h-6 w-px bg-[#88939D]/30" />

            {/* Read Time */}
            <div className="text-[#88939D]">{post.readTime}</div>
          </motion.div>
        </div>
      </section>

      {/* Hero Image */}
      <section className="relative py-12 bg-[#0F0F0F]">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[16/9] rounded-2xl overflow-hidden border-2 border-[#88939D]/20 hover:border-[#00FF94]/50 transition-colors duration-500 group will-change-transform"
          >
            {post.heroImage ? (
              <motion.div
                className="relative w-full h-full"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image
                  src={post.heroImage}
                  alt={post.title}
                  fill
                  className="object-cover will-change-transform"
                  priority
                />
              </motion.div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#00FF94]/20 to-[#00CC78]/10 flex items-center justify-center">
                <span className="text-[#88939D]">Hero Image</span>
              </div>
            )}
            
            {/* Gradient overlay on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/10 via-[#00CC78]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              initial={false}
            />
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <article className="relative py-16 lg:py-24 bg-[#0F0F0F]">
        
        {/* Background */}
        <div 
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {post.content.map((section, index) => renderContent(section, index))}
          </motion.div>
        </div>
      </article>

      {/* Tags Section */}
      <section className="relative py-16 bg-[#0F0F0F] border-t border-[#88939D]/20">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="text-sm font-semibold text-[#88939D] mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <motion.span
                  key={index}
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.05,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    borderColor: '#00FF94',
                    color: '#00FF94',
                    transition: { duration: 0.2 }
                  }}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#88939D] text-sm transition-all cursor-pointer will-change-transform"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Author Bio */}
      <section className="relative py-16 bg-[#0F0F0F] border-t border-[#88939D]/20">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ 
              y: -3,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 25
              }
            }}
            className="flex items-start gap-6 p-8 rounded-2xl border-2 border-[#88939D]/20 hover:border-[#00FF94]/50 bg-[#0F0F0F]/50 transition-colors duration-500 will-change-transform group"
          >
            <motion.div 
              className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00FF94] to-[#00CC78] flex-shrink-0 relative overflow-hidden"
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
              {post.author.avatar && (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              )}
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#00FF94] transition-colors duration-300">
                Written by {post.author.name}
              </h3>
              <p className="text-[#88939D] mb-4">{post.author.role}</p>
              <p className="text-[#88939D] group-hover:text-white/70 transition-colors duration-300">
                Passionate about creating amazing web experiences and sharing knowledge with the community.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <section className="relative py-24 lg:py-32 bg-[#0F0F0F] border-t border-[#88939D]/20">
          
          {/* Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none will-change-transform" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
            
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center mb-16 will-change-transform"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Related Articles
              </h2>
              <p className="text-xl text-[#88939D]">
                Continue exploring our latest insights
              </p>
            </motion.div>

            {/* Related posts grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {relatedPosts.map((relatedPost, index) => (
                <motion.article
                  key={relatedPost.slug}
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 1, 
                    delay: index * 0.1,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="group cursor-pointer will-change-transform"
                >
                  <Link href={`/blog/${relatedPost.slug}`}>
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
                      <div className="relative aspect-video bg-gradient-to-br from-[#1a1a1a] to-[#0F0F0F] overflow-hidden">
                        {relatedPost.thumbnail ? (
                          <motion.div
                            className="relative w-full h-full"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                          >
                            <Image
                              src={relatedPost.thumbnail}
                              alt={relatedPost.title}
                              fill
                              className="object-cover will-change-transform"
                            />
                          </motion.div>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-[#88939D]">
                            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="relative z-10 p-6">
                        <div className="space-y-3">
                          {/* Category & Read Time */}
                          <div className="flex items-center gap-2 text-xs text-[#88939D]">
                            <span className="px-2 py-1 bg-[#00FF94]/10 rounded text-[#00FF94] font-mono">
                              {relatedPost.category}
                            </span>
                            <span>{relatedPost.readTime}</span>
                          </div>

                          {/* Title */}
                          <h3 className="text-xl font-bold text-white group-hover:text-[#00FF94] transition-colors duration-300 line-clamp-2">
                            {relatedPost.title}
                          </h3>
                          
                          {/* Excerpt */}
                          <p className="text-[#88939D] text-sm leading-relaxed line-clamp-2 group-hover:text-white/70 transition-colors duration-300">
                            {relatedPost.excerpt}
                          </p>

                          {/* Read More */}
                          <div className="pt-3 border-t border-[#88939D]/10">
                            <span className="text-xs text-[#00FF94] font-medium group-hover:gap-1 flex items-center transition-all">
                              Read more
                              <svg className="w-4 h-4 ml-0 group-hover:ml-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
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
      <section className="relative py-24 lg:py-32 bg-[#0F0F0F]">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to start your project?
            </h2>
            <p className="text-xl text-[#88939D] mb-12 max-w-2xl mx-auto">
              Let's build something amazing together. Get in touch to discuss your ideas.
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
                whileTap={{ 
                  scale: 0.98,
                  transition: { duration: 0.1 }
                }}
                className="group relative px-8 py-5 bg-gradient-to-r from-[#00FF94] to-[#00CC78] text-black font-bold rounded-xl text-lg overflow-hidden transition-all will-change-transform shadow-lg shadow-[#00FF94]/20 hover:shadow-xl hover:shadow-[#00FF94]/30"
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
  );
}