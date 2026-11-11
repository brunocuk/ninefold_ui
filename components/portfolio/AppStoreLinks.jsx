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
  const showPlatformLabels = iosScreenshots.length > 0 && androidScreenshots.length > 0;

  const screenshotRow = (items, label, rounded) => (
    <div className={label ? 'mb-16' : ''}>
      {label && (
        <h3
          className="mb-6 text-center font-mono text-xs uppercase tracking-[0.22em]"
          style={{ color: '#8E8E8E' }}
        >
          {label}
        </h3>
      )}
      <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
        {items.map((screenshot, index) => (
          <motion.div
            key={index}
            initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: shouldReduceAnimations ? 0 : 0.8,
              delay: shouldReduceAnimations ? 0 : index * 0.08,
            }}
            className="flex-shrink-0 snap-center"
          >
            <div
              className={`relative w-64 aspect-[9/19.5] ${rounded} overflow-hidden bg-black`}
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <Image
                src={screenshot}
                alt={`Screenshot aplikacije ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Download Links Section */}
      <section className="relative overflow-hidden bg-[#0F0F0F] py-24 lg:py-32">
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
          <motion.div
            initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: shouldReduceAnimations ? 0 : 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 text-center"
          >
            <p
              className="mb-4 flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-[0.22em]"
              style={{ color: '#8E8E8E' }}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: '#00FF94' }} />
              Dostupna na storeovima
            </p>
            <h2 className="text-4xl font-medium md:text-5xl" style={{ color: '#F2F2F2', letterSpacing: '-0.015em' }}>
              Preuzmi aplikaciju
            </h2>
          </motion.div>

          {/* Store Buttons */}
          <motion.div
            initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: shouldReduceAnimations ? 0 : 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center gap-6 sm:flex-row"
          >
            {/* App Store Button */}
            {appStoreUrl && (
              <a
                href={appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl bg-black px-8 py-4 transition-all duration-300"
                style={{ border: '1px solid rgba(255,255,255,0.12)' }}
                onMouseEnter={(e) => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.3)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.12)'; }}
              >
                <svg viewBox="0 0 24 24" fill="#F2F2F2" className="h-10 w-10">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs transition-colors" style={{ color: '#8E8E8E' }}>Preuzmi na</div>
                  <div className="text-xl font-medium" style={{ color: '#F2F2F2' }}>App Storeu</div>
                </div>
              </a>
            )}

            {/* Play Store Button */}
            {playStoreUrl && (
              <a
                href={playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl bg-black px-8 py-4 transition-all duration-300"
                style={{ border: '1px solid rgba(255,255,255,0.12)' }}
                onMouseEnter={(e) => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.3)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.12)'; }}
              >
                <svg viewBox="0 0 24 24" className="h-10 w-10">
                  <path fill="#00F076" d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5Z" />
                  <path fill="#00D8E2" d="M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12Z" />
                  <path fill="#FFD54F" d="M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81Z" />
                  <path fill="#FF3D51" d="M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs transition-colors" style={{ color: '#8E8E8E' }}>Preuzmi na</div>
                  <div className="text-xl font-medium" style={{ color: '#F2F2F2' }}>Google Playu</div>
                </div>
              </a>
            )}
          </motion.div>
        </div>
      </section>

      {/* Screenshots Section */}
      {hasScreenshots && (
        <section className="relative overflow-hidden bg-[#080808] py-24 lg:py-32">
          <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
            <motion.div
              initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: shouldReduceAnimations ? 0 : 1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-16 text-center"
            >
              <h2 className="text-4xl font-medium md:text-5xl" style={{ color: '#F2F2F2', letterSpacing: '-0.015em' }}>
                Aplikacija izbliza
              </h2>
            </motion.div>

            {iosScreenshots.length > 0 &&
              screenshotRow(iosScreenshots, showPlatformLabels ? 'iOS' : null, 'rounded-[2.5rem]')}
            {androidScreenshots.length > 0 &&
              screenshotRow(androidScreenshots, showPlatformLabels ? 'Android' : null, 'rounded-3xl')}
          </div>
        </section>
      )}
    </>
  );
}
