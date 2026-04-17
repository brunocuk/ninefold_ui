// components/portfolio/SocialMediaDetails.jsx
// Displays platform metrics and content samples for social media projects

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const PLATFORM_COLORS = {
  instagram: '#E4405F',
  facebook: '#1877F2',
  linkedin: '#0A66C2',
  tiktok: '#000000',
  twitter: '#1DA1F2',
  youtube: '#FF0000'
};

const PLATFORM_ICONS = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  )
};

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export default function SocialMediaDetails({ typeData, shouldReduceAnimations, shouldDisableHover }) {
  const { platforms = [], campaignMetrics = {}, contentSamples = [] } = typeData;

  const hasMetrics = campaignMetrics.reach || campaignMetrics.engagement || campaignMetrics.impressions;

  if (platforms.length === 0 && !hasMetrics && contentSamples.length === 0) {
    return null;
  }

  return (
    <>
      {/* Campaign Metrics */}
      {hasMetrics && (
        <section className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#E4405F]/10 via-[#1877F2]/5 to-transparent rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
            <motion.div
              initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: shouldReduceAnimations ? 0 : 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Campaign Performance
              </h2>
              <p className="text-xl text-[#88939D] max-w-3xl mx-auto">
                Social media impact at a glance
              </p>
            </motion.div>

            {/* Platforms */}
            {platforms.length > 0 && (
              <div className="flex justify-center gap-4 mb-12">
                {platforms.map((platform, index) => {
                  const platformKey = platform.toLowerCase();
                  return (
                    <motion.div
                      key={platform}
                      initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: shouldReduceAnimations ? 0 : 0.5,
                        delay: shouldReduceAnimations ? 0 : index * 0.1
                      }}
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: PLATFORM_COLORS[platformKey] || '#666' }}
                    >
                      {PLATFORM_ICONS[platformKey] || (
                        <span className="text-sm font-bold">{platform.charAt(0).toUpperCase()}</span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Metrics Grid */}
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {campaignMetrics.reach && (
                <motion.div
                  initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: shouldReduceAnimations ? 0 : 1, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative p-8 rounded-2xl bg-transparent border-2 border-[#88939D]/20 hover:border-[#E4405F] transition-all duration-500 text-center overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#E4405F]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="text-5xl md:text-6xl font-bold text-[#E4405F] mb-3">
                      {formatNumber(campaignMetrics.reach)}
                    </div>
                    <div className="text-[#88939D] text-lg font-medium">Reach</div>
                  </div>
                </motion.div>
              )}

              {campaignMetrics.impressions && (
                <motion.div
                  initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: shouldReduceAnimations ? 0 : 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative p-8 rounded-2xl bg-transparent border-2 border-[#88939D]/20 hover:border-[#1877F2] transition-all duration-500 text-center overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1877F2]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="text-5xl md:text-6xl font-bold text-[#1877F2] mb-3">
                      {formatNumber(campaignMetrics.impressions)}
                    </div>
                    <div className="text-[#88939D] text-lg font-medium">Impressions</div>
                  </div>
                </motion.div>
              )}

              {campaignMetrics.engagement && (
                <motion.div
                  initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: shouldReduceAnimations ? 0 : 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative p-8 rounded-2xl bg-transparent border-2 border-[#88939D]/20 hover:border-[#00FF94] transition-all duration-500 text-center overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="text-5xl md:text-6xl font-bold text-[#00FF94] mb-3">
                      {formatNumber(campaignMetrics.engagement)}
                    </div>
                    <div className="text-[#88939D] text-lg font-medium">Engagement</div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Content Samples */}
      {contentSamples.length > 0 && (
        <section className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
            <motion.div
              initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: shouldReduceAnimations ? 0 : 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Content Samples
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contentSamples.map((sample, index) => (
                <motion.div
                  key={index}
                  initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: shouldReduceAnimations ? 0 : 1,
                    delay: shouldReduceAnimations ? 0 : index * 0.1,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="relative aspect-square rounded-xl overflow-hidden border-2 border-[#88939D]/20 hover:border-[#E4405F]/50 transition-colors duration-500"
                >
                  {sample.type === 'image' ? (
                    <Image
                      src={sample.url}
                      alt={sample.caption || `Content sample ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <video
                      src={sample.url}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                      onMouseEnter={(e) => e.target.play()}
                      onMouseLeave={(e) => e.target.pause()}
                    />
                  )}
                  {sample.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-white text-sm">{sample.caption}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
