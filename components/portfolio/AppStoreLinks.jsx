// components/portfolio/AppStoreLinks.jsx
// Displays App Store and Play Store download buttons for mobile app projects

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AppStoreLinks({ typeData, shouldReduceAnimations, shouldDisableHover }) {
  const { appStoreUrl, playStoreUrl, screenshots = {} } = typeData;

  if (!appStoreUrl && !playStoreUrl) {
    return null;
  }

  const iosScreenshots = screenshots.ios || [];
  const androidScreenshots = screenshots.android || [];
  const hasScreenshots = iosScreenshots.length > 0 || androidScreenshots.length > 0;

  return (
    <>
      {/* Download Links Section */}
      <section className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
        {/* Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#FF6B6B]/10 via-[#FF6B6B]/5 to-transparent rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: shouldReduceAnimations ? 0 : 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Download the App
            </h2>
            <p className="text-xl text-[#88939D] max-w-3xl mx-auto">
              Available on your favorite app store
            </p>
          </motion.div>

          {/* Store Buttons */}
          <motion.div
            initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: shouldReduceAnimations ? 0 : 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            {/* App Store Button */}
            {appStoreUrl && (
              <a
                href={appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 px-8 py-4 bg-black border-2 border-[#88939D]/30 rounded-2xl hover:border-white transition-all duration-300"
              >
                <svg viewBox="0 0 24 24" fill="white" className="w-10 h-10">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs text-[#88939D] group-hover:text-white transition-colors">Download on the</div>
                  <div className="text-xl font-semibold text-white">App Store</div>
                </div>
              </a>
            )}

            {/* Play Store Button */}
            {playStoreUrl && (
              <a
                href={playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 px-8 py-4 bg-black border-2 border-[#88939D]/30 rounded-2xl hover:border-[#3DDC84] transition-all duration-300"
              >
                <svg viewBox="0 0 24 24" className="w-10 h-10">
                  <path fill="#00F076" d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5Z" />
                  <path fill="#00D8E2" d="M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12Z" />
                  <path fill="#FFD54F" d="M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81Z" />
                  <path fill="#FF3D51" d="M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs text-[#88939D] group-hover:text-white transition-colors">Get it on</div>
                  <div className="text-xl font-semibold text-white">Google Play</div>
                </div>
              </a>
            )}
          </motion.div>
        </div>
      </section>

      {/* Screenshots Section */}
      {hasScreenshots && (
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
                App Screenshots
              </h2>
            </motion.div>

            {/* iOS Screenshots */}
            {iosScreenshots.length > 0 && (
              <div className="mb-16">
                <h3 className="text-xl font-semibold text-white mb-6 text-center">iOS</h3>
                <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
                  {iosScreenshots.map((screenshot, index) => (
                    <motion.div
                      key={index}
                      initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: shouldReduceAnimations ? 0 : 0.8,
                        delay: shouldReduceAnimations ? 0 : index * 0.1
                      }}
                      className="flex-shrink-0 snap-center"
                    >
                      <div className="relative w-64 aspect-[9/19.5] rounded-[2.5rem] overflow-hidden border-4 border-[#333] bg-black shadow-2xl">
                        <Image
                          src={screenshot}
                          alt={`iOS Screenshot ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Android Screenshots */}
            {androidScreenshots.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-6 text-center">Android</h3>
                <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
                  {androidScreenshots.map((screenshot, index) => (
                    <motion.div
                      key={index}
                      initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: shouldReduceAnimations ? 0 : 0.8,
                        delay: shouldReduceAnimations ? 0 : index * 0.1
                      }}
                      className="flex-shrink-0 snap-center"
                    >
                      <div className="relative w-64 aspect-[9/19.5] rounded-3xl overflow-hidden border-4 border-[#333] bg-black shadow-2xl">
                        <Image
                          src={screenshot}
                          alt={`Android Screenshot ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
