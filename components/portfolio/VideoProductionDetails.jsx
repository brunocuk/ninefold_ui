// components/portfolio/VideoProductionDetails.jsx
// Displays video embeds and showreel for video production projects

'use client';

import { motion } from 'framer-motion';

function getVideoEmbedUrl(url) {
  // Convert YouTube watch URLs to embed URLs
  if (url.includes('youtube.com/watch')) {
    const videoId = new URL(url).searchParams.get('v');
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  // Convert Vimeo URLs to embed URLs
  if (url.includes('vimeo.com/')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
    return `https://player.vimeo.com/video/${videoId}`;
  }
  return url;
}

export default function VideoProductionDetails({ typeData, shouldReduceAnimations, shouldDisableHover }) {
  const { videoEmbeds = [], showreelUrl } = typeData;

  if (!showreelUrl && videoEmbeds.length === 0) {
    return null;
  }

  return (
    <section className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
      {/* Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#E4405F]/10 via-[#E4405F]/5 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceAnimations ? 0 : 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Video Showreel
          </h2>
          <p className="text-xl text-[#88939D] max-w-3xl mx-auto">
            Watch the finished work in action
          </p>
        </motion.div>

        {/* Showreel (main video) */}
        {showreelUrl && (
          <motion.div
            initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: shouldReduceAnimations ? 0 : 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16"
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-[#88939D]/20 hover:border-[#E4405F]/50 transition-colors duration-500">
              <iframe
                src={getVideoEmbedUrl(showreelUrl)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Showreel"
              />
            </div>
          </motion.div>
        )}

        {/* Additional Videos Grid */}
        {videoEmbeds.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {videoEmbeds.map((video, index) => (
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
                className="group"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-[#88939D]/20 hover:border-[#E4405F]/50 transition-colors duration-500">
                  <iframe
                    src={getVideoEmbedUrl(video.url)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={video.title || `Video ${index + 1}`}
                  />
                </div>
                {video.title && (
                  <p className="mt-3 text-center text-[#88939D] font-medium">
                    {video.title}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
