// app/work/[slug]/ProjectDetailsClient.jsx
"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useMobileOptimization } from "@/lib/useMobileOptimization";
import ProjectTypeRenderer from "@/components/portfolio/ProjectTypeRenderer";

// Map project_type to display labels
const PROJECT_TYPE_LABELS = {
  video_production: 'Video produkcija',
  social_media: 'Social media',
  web_development: 'Web razvoj',
  web_app: 'Web aplikacija',
  mobile_app: 'Mobilna aplikacija'
};

function getDomain(url) {
  try {
    return new URL(url).host.replace('www.', '');
  } catch {
    return '';
  }
}

// Minimal dark browser chrome around a screenshot — dots only, no URL bar
function BrowserFrame({ url, children }) {
  return (
    <div className="rounded-xl overflow-hidden bg-[#0C0C0C] ring-1 ring-white/[0.06] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.95)]">
      <div className="flex items-center gap-2 px-5 py-3.5 bg-[#0C0C0C]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#2A2A2A]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#2A2A2A]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#2A2A2A]" />
      </div>
      {children}
    </div>
  );
}

// Minimal phone frame around a mobile screenshot
function PhoneFrame({ src, alt, className = '' }) {
  return (
    <div className={`w-[230px] md:w-[260px] shrink-0 rounded-[2.2rem] border border-white/12 bg-[#131313] p-2.5 shadow-[0_40px_70px_-15px_rgba(0,0,0,0.85)] ${className}`}>
      <div className="rounded-[1.7rem] overflow-hidden relative">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full bg-black/80 z-10" />
        <img src={src} alt={alt} className="w-full block" loading="lazy" />
      </div>
    </div>
  );
}

export default function ProjectDetailsClient({ project, relatedProjects = [] }) {
  const {
    shouldReduceAnimations,
    shouldDisableVideos,
    shouldDisableHover,
    prefersReducedMotion
  } = useMobileOptimization();

  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isPageReady, setIsPageReady] = useState(false);
  const videoRef = useRef(null);

  // Defer video loading until page is interactive
  useEffect(() => {
    const timer = setTimeout(() => setIsPageReady(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  const [heroRef, heroInView] = useInView({
    threshold: 0.15,
    triggerOnce: true,
  });

  const [overviewRef, overviewInView] = useInView({
    threshold: 0.15,
    triggerOnce: true,
  });

  const [resultsRef, resultsInView] = useInView({
    threshold: 0.15,
    triggerOnce: true,
  });

  // Get lighthouse data from type_data if it's a web project
  const lighthouse = project.type_data?.lighthouse || null;

  // Screenshot sets captured from the live site (scripts/capture-site.mjs)
  // featured_image is reserved for cards on /work — never shown here.
  const shots = project.type_data?.screenshots || null;
  const heroShot = shots?.desktop?.[0] || null;
  const extraDesktopShots = (shots?.desktop || []).slice(1);
  const mobileShots = shots?.mobile || [];
  const siteDomain = getDomain(project.live_site_url);
  const hasHeroMedia = Boolean(project.hero_video || heroShot || project.hero_image);

  // Accent-aware backgrounds — every project gets panels in its own color
  const accent = project.accent_color || '#00FF94';
  const ribbedStyle = {
    backgroundImage: `repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.02) 5px, rgba(0,0,0,0.30) 13px, rgba(255,255,255,0.05) 21px, rgba(0,0,0,0.12) 26px), linear-gradient(115deg, ${accent} 0%, color-mix(in srgb, ${accent} 45%, #000) 38%, #0D0D0D 78%, #050505 100%)`,
  };
  const stageStyle = {
    background: `radial-gradient(ellipse at 72% 25%, ${accent}1A 0%, transparent 55%), linear-gradient(160deg, #141414 0%, #0F0F0F 100%)`,
  };

  const renderSection = (section, index) => {
    if (section.type === "text") {
      return (
        <div key={index} className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {section.title}
          </h2>
          <p className="text-lg text-[#88939D] leading-relaxed">
            {section.content}
          </p>
        </div>
      );
    }

    if (section.type === "two-column") {
      return (
        <div key={index} className="grid md:grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">
              {section.left.title}
            </h3>
            <ul className="space-y-3">
              {section.left.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00FF94] mt-2 flex-shrink-0" />
                  <span className="text-[#88939D]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">
              {section.right.title}
            </h3>
            <ul className="space-y-3">
              {section.right.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00FF94] mt-2 flex-shrink-0" />
                  <span className="text-[#88939D]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] overflow-x-hidden">
      <style>{`
        .nfpd-cut { clip-path: polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 0 100%); }
        .nfpd-scrollshot { position: relative; aspect-ratio: 16/9.6; overflow: hidden; }
        .nfpd-scrollshot img {
          width: 100%; display: block;
          transform: translateY(0);
          transition: transform 1.2s ease;
        }
        .nfpd-scrollgroup:hover .nfpd-scrollshot img {
          transform: translateY(calc(-100% + 320px));
          transition: transform 25s linear;
        }
        @media (prefers-reduced-motion: reduce) {
          .nfpd-scrollshot img { transition: none; }
        }
      `}</style>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center bg-[#0F0F0F] overflow-hidden"
      >
        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Gradient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-[#00CC78]/20 via-[#00FF94]/10 to-transparent rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <div className="max-w-5xl">
            {/* Breadcrumb */}
            <motion.div
              initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: shouldReduceAnimations ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2 text-sm text-[#88939D] mb-8"
            >
              <Link
                href="/work"
                className="hover:text-[#00FF94] transition-colors duration-300"
              >
                Radovi
              </Link>
              <span>/</span>
              <span className="text-white">{project.title}</span>
            </motion.div>

            {/* Category Badge */}
            <motion.div
              initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
              animate={heroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: shouldReduceAnimations ? 0 : 0.8,
                delay: shouldReduceAnimations ? 0 : 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block mb-6"
            >
              <span className="px-4 py-2 rounded-full border border-[#00FF94]/30 bg-[#00FF94]/5 text-[#00FF94] text-sm font-medium">
                {PROJECT_TYPE_LABELS[project.project_type] || project.project_type}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: shouldReduceAnimations ? 0 : 1.2, delay: shouldReduceAnimations ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(2.5rem,7vw,5rem)] font-bold leading-[1.05] tracking-tight mb-6 text-white"
            >
              {project.title}
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: shouldReduceAnimations ? 0 : 1,
                delay: shouldReduceAnimations ? 0 : 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-xl md:text-2xl text-[#00FF94] mb-8"
            >
              {project.tagline}
            </motion.p>

            {/* Meta Info */}
            <motion.div
              initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: shouldReduceAnimations ? 0 : 1,
                delay: shouldReduceAnimations ? 0 : 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-wrap gap-8 text-[#88939D]"
            >
              <div>
                <div className="text-sm mb-1">Klijent</div>
                <div className="text-white font-semibold">{project.client_name}</div>
              </div>
              {project.year && (
                <div>
                  <div className="text-sm mb-1">Godina</div>
                  <div className="text-white font-semibold">{project.year}</div>
                </div>
              )}
              {project.duration && (
                <div>
                  <div className="text-sm mb-1">Trajanje</div>
                  <div className="text-white font-semibold">
                    {project.duration}
                  </div>
                </div>
              )}
            </motion.div>

            {/* LINK TO SITE */}
            {project.live_site_url && (
            <Link href={project.live_site_url}>
              <motion.div
                initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: shouldReduceAnimations ? 0 : 1,
                  delay: shouldReduceAnimations ? 0 : 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={shouldDisableHover ? undefined : {
                  x: 5,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                  }
                }}
                className="flex items-center gap-2 text-[#00FF94] font-medium pt-4 group cursor-pointer"
              >
                Pogledaj live stranicu
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </motion.div>
            </Link>
            )}
          </div>
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94] to-transparent opacity-30" />
      </section>

      {/* Hero Media — staged showcase */}
      {hasHeroMedia && (
      <section className="relative py-12 lg:py-16 bg-[#0F0F0F]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: shouldReduceAnimations ? 0 : 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {project.hero_video && (
              // Video — full-width, cinematic, no border box
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9)]">
                {(shouldDisableVideos && !showVideo) ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={project.featured_image || project.hero_image || '/images/placeholder.jpg'}
                      alt={project.title}
                      fill
                      className="object-cover"
                      priority
                    />
                    <button
                      onClick={() => setShowVideo(true)}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/30 transition-colors"
                      aria-label="Play video"
                    >
                      <div className="w-20 h-20 rounded-full bg-[#00FF94] flex items-center justify-center shadow-lg shadow-[#00FF94]/30">
                        <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </button>
                  </div>
                ) : (
                  isPageReady ? (
                    <video
                      ref={videoRef}
                      src={project.hero_video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      poster={project.featured_image || project.hero_image}
                      onLoadedData={() => setVideoLoaded(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={project.featured_image || project.hero_image || '/images/placeholder.jpg'}
                      alt={project.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  )
                )}
              </div>
            )}

            {heroShot ? (
              // Raw desktop capture — flat, centered on a ribbed accent-colored panel
              <div
                className={`nfpd-cut relative px-5 md:px-16 py-12 md:py-20 overflow-hidden ${project.hero_video ? 'mt-8 lg:mt-12' : ''}`}
                style={ribbedStyle}
              >
                <div className="relative max-w-4xl mx-auto">
                  <BrowserFrame url={siteDomain}>
                    <img src={heroShot} alt={project.title} className="w-full block" />
                  </BrowserFrame>
                </div>
              </div>
            ) : project.hero_image ? (
              // Hero Slika — finished artwork, shown clean without extra framing
              <div className={`relative rounded-2xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9)] ${project.hero_video ? 'mt-8 lg:mt-12' : ''}`}>
                <img src={project.hero_image} alt={project.title} className="w-full block" />
              </div>
            ) : null}
          </motion.div>
        </div>
      </section>
      )}

      {/* Overview Section */}
      <section
        ref={overviewRef}
        className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden"
      >
        {/* Background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Left Column - Challenge & Solution */}
            <motion.div
              initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, x: -30 }}
              animate={overviewInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: shouldReduceAnimations ? 0 : 1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-2 space-y-12"
            >
              {/* Description */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  O projektu
                </h2>
                <p className="text-lg text-[#88939D] leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Challenge */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Izazov
                </h3>
                <p className="text-lg text-[#88939D] leading-relaxed">
                  {project.challenge}
                </p>
              </div>

              {/* Solution */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Rješenje
                </h3>
                <p className="text-lg text-[#88939D] leading-relaxed">
                  {project.solution}
                </p>
              </div>
            </motion.div>

            {/* Right Column - Services & Tech */}
            <motion.div
              initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, x: 30 }}
              animate={overviewInView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: shouldReduceAnimations ? 0 : 1,
                delay: shouldReduceAnimations ? 0 : 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="space-y-8"
            >
              {/* Services */}
              <motion.div
                className="p-8 rounded-2xl border-2 border-[#88939D]/20 bg-[#0F0F0F]/50 transition-all duration-500 hover:border-[#00FF94]"
                whileHover={shouldDisableHover ? undefined : {
                  y: -5,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }
                }}
              >
                <h3 className="text-xl font-bold text-white mb-4">Usluge</h3>
                <div className="flex flex-wrap gap-2">
                  {project.services.map((service, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full bg-[#00FF94]/10 border border-[#00FF94]/30 text-[#00FF94] text-sm cursor-default"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Technologies */}
              <motion.div
                className="p-8 rounded-2xl border-2 border-[#88939D]/20 bg-[#0F0F0F]/50 transition-all duration-500 hover:border-[#00FF94]"
                whileHover={shouldDisableHover ? undefined : {
                  y: -5,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }
                }}
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  Tehnologije
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#88939D] text-sm hover:text-white hover:border-[#00FF94] transition-colors duration-300 cursor-default"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Desktop Screenshots Section */}
      {(shots?.full || extraDesktopShots.length > 0) && (
        <section className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
            <motion.div
              initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: shouldReduceAnimations ? 0 : 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-12"
            >
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">Desktop</h2>
                <p className="text-lg text-[#88939D]">Stranica kakvu vide posjetitelji — puna širina, pravi pikseli</p>
              </div>
              {shots?.full && (
                <span className="text-sm text-[#00FF94] hidden md:block">
                  Pređi mišem preko prvog okvira za scroll kroz cijeli site
                </span>
              )}
            </motion.div>

            <div className="space-y-10">
              {shots?.full && (
                <motion.div
                  initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: shouldReduceAnimations ? 0 : 1, ease: [0.16, 1, 0.3, 1] }}
                  className="nfpd-scrollgroup nfpd-cut p-5 md:p-10"
                  style={stageStyle}
                >
                  <BrowserFrame url={siteDomain}>
                    <div className="nfpd-scrollshot">
                      <img src={shots.full} alt={`${project.title} — full page`} loading="lazy" />
                    </div>
                  </BrowserFrame>
                </motion.div>
              )}

              {extraDesktopShots.length > 0 && (
                <div className="grid md:grid-cols-2 gap-8">
                  {extraDesktopShots.map((shot, index) => (
                    <motion.div
                      key={index}
                      initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: shouldReduceAnimations ? 0 : 1,
                        delay: shouldReduceAnimations ? 0 : index * 0.1,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="nfpd-cut p-5 md:p-8"
                      style={stageStyle}
                    >
                      <BrowserFrame url={siteDomain}>
                        <img src={shot} alt={`${project.title} — screenshot ${index + 2}`} className="w-full block" loading="lazy" />
                      </BrowserFrame>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Mobile Screenshots Section */}
      {mobileShots.length > 0 && (
        <section className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
            <motion.div
              initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: shouldReduceAnimations ? 0 : 1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">Mobile</h2>
              <p className="text-lg text-[#88939D]">Gdje je većina posjetitelja zapravo</p>
            </motion.div>

            <div className="nfpd-cut px-6 py-14 md:py-20" style={stageStyle}>
              <div className="flex flex-wrap justify-center items-start gap-8 md:gap-14">
                {mobileShots.map((shot, index) => (
                  <motion.div
                    key={index}
                    initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: shouldReduceAnimations ? 0 : 1,
                      delay: shouldReduceAnimations ? 0 : index * 0.15,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={index % 2 === 1 ? 'md:mt-16' : ''}
                  >
                    <PhoneFrame src={shot} alt={`${project.title} — mobile ${index + 1}`} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Results Section */}
      <section
        ref={resultsRef}
        className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden"
      >
        {/* Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
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
            animate={resultsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: shouldReduceAnimations ? 0 : 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Rezultati
            </h2>
            <p className="text-xl text-[#88939D] max-w-3xl mx-auto">
              Brojke koje pokazuju da je posao odrađen kako treba
            </p>
          </motion.div>

          {/* Results Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {(project.results || []).map((result, index) => (
              <motion.div
                key={index}
                initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, y: 40 }}
                animate={resultsInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: shouldReduceAnimations ? 0 : 1,
                  delay: shouldReduceAnimations ? 0 : index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={shouldDisableHover ? undefined : {
                  y: -5,
                  scale: 1.02,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }
                }}
                className="group relative p-8 rounded-2xl bg-transparent border-2 border-[#88939D]/20 transition-all duration-500 hover:border-[#00FF94] overflow-hidden text-center"
              >
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/5 via-[#00CC78]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="text-4xl lg:text-5xl font-bold tracking-tight leading-none text-[#00FF94] mb-3">
                    {result.metric}
                  </div>
                  <div className="text-[#88939D] group-hover:text-white/70 transition-colors duration-300">{result.label}</div>
                </div>

                {/* Bottom gradient line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lighthouse Performance Stats */}
      {lighthouse && (
        <section className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
          {/* Background elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
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
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: shouldReduceAnimations ? 0 : 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Performanse
              </h2>
              <p className="text-xl text-[#88939D] max-w-3xl mx-auto">
                Izgrađeno za brzinu i optimizirano za tražilice
              </p>
            </motion.div>

            {/* Lighthouse Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[
                {
                  score: lighthouse.performance,
                  label: "Performance",
                  color: "#00FF94",
                },
                {
                  score: lighthouse.accessibility,
                  label: "Accessibility",
                  color: "#00FF94",
                },
                {
                  score: lighthouse.bestPractices,
                  label: "Best Practices",
                  color: "#00FF94",
                },
                {
                  score: lighthouse.seo,
                  label: "SEO",
                  color: "#00FF94",
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: shouldReduceAnimations ? 0 : 1,
                    delay: shouldReduceAnimations ? 0 : index * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={shouldDisableHover ? undefined : {
                    y: -5,
                    scale: 1.02,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 25
                    }
                  }}
                  className="group relative p-8 rounded-2xl bg-transparent border-2 border-[#88939D]/20 transition-all duration-500 hover:border-[#00FF94] overflow-hidden"
                >
                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/5 via-[#00CC78]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10 flex flex-col items-center text-center">
                    {/* Circular Progress */}
                    <div className="relative w-24 h-24 mb-4">
                      {/* Background circle */}
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="44"
                          stroke="#88939D"
                          strokeWidth="8"
                          fill="none"
                          opacity="0.1"
                        />
                        {/* Progress circle */}
                        <circle
                          cx="48"
                          cy="48"
                          r="44"
                          stroke={stat.color}
                          strokeWidth="8"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 44}`}
                          strokeDashoffset={`${
                            2 * Math.PI * 44 * (1 - stat.score / 100)
                          }`}
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      {/* Score text */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {stat.score}
                        </span>
                      </div>
                    </div>

                    {/* Label */}
                    <div className="text-[#88939D] font-medium group-hover:text-white/70 transition-colors duration-300">
                      {stat.label}
                    </div>
                  </div>

                  {/* Bottom gradient line */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              ))}
            </div>

            {/* Lighthouse Logo/Badge */}
            <motion.div
              initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: shouldReduceAnimations ? 0 : 0.8, delay: shouldReduceAnimations ? 0 : 0.4 }}
              className="mt-12 text-center"
            >
              <p className="text-sm text-[#88939D]">
                Testirano alatom{" "}
                <span className="text-white font-semibold">
                  Google Lighthouse
                </span>
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Type-Specific Content (Video embeds, Social metrics, App store links, etc.) */}
      <ProjectTypeRenderer
        project={project}
        shouldReduceAnimations={shouldReduceAnimations}
        shouldDisableHover={shouldDisableHover}
      />

      {/* Content Sections */}
      <section className="relative py-24 lg:py-32 bg-[#0F0F0F]">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 space-y-24">
          {project.sections.map((section, index) => (
            <motion.div
              key={index}
              initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: shouldReduceAnimations ? 0 : 1, ease: [0.16, 1, 0.3, 1] }}
            >
              {renderSection(section, index)}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonial Section */}
      {project.testimonial && (
        <section className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
          {/* Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12">
            <motion.div
              initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: shouldReduceAnimations ? 0 : 1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={shouldDisableHover ? undefined : {
                y: -5,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }
              }}
              className="p-12 rounded-2xl border-2 border-[#00FF94]/30 bg-[#00FF94]/5"
            >
              <div className="text-6xl text-[#00FF94] mb-6">"</div>
              <p className="text-2xl text-white leading-relaxed mb-8">
                {project.testimonial.quote}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00FF94] to-[#00CC78]" />
                <div>
                  <div className="font-bold text-white">
                    {project.testimonial.author}
                  </div>
                  <div className="text-[#88939D]">
                    {project.testimonial.role}, {project.testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Related Projects Section */}
      {relatedProjects.length > 0 && (
        <section className="relative py-24 lg:py-32 bg-[#0F0F0F] border-t border-[#88939D]/20">
          {/* Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
            <motion.div
              initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: shouldReduceAnimations ? 0 : 1 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Povezani projekti
              </h2>
              <p className="text-xl text-[#88939D]">Pogledaj još naših radova</p>
            </motion.div>

            {/* Related projects grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {relatedProjects.map((relatedProject, index) => (
                <motion.article
                  key={relatedProject.slug}
                  initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: shouldReduceAnimations ? 0 : 1,
                    delay: shouldReduceAnimations ? 0 : index * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group cursor-pointer"
                >
                  <Link href={`/work/${relatedProject.slug}`}>
                    <motion.div
                      className="relative h-full rounded-2xl bg-transparent border-2 border-[#88939D]/20 transition-all duration-500 hover:border-[#00FF94] overflow-hidden"
                      whileHover={shouldDisableHover ? undefined : {
                        y: -8,
                        transition: {
                          type: "spring",
                          stiffness: 300,
                          damping: 25
                        }
                      }}
                    >
                      {/* Hover gradient background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/5 via-[#00CC78]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Image */}
                      <div className="relative aspect-video bg-gradient-to-br from-[#1a1a1a] to-[#0F0F0F] overflow-hidden">
                        {relatedProject.featured_image ? (
                          <Image
                            src={relatedProject.featured_image}
                            alt={relatedProject.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-[#88939D]">
                            <svg
                              className="w-12 h-12"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="relative z-10 p-6">
                        <div className="space-y-3">
                          {/* Category */}
                          <div className="flex items-center gap-2 text-xs text-[#88939D] group-hover:text-[#00FF94] transition-colors duration-300">
                            <span className="px-2 py-1 bg-[#00FF94]/10 rounded text-[#00FF94] font-mono">
                              {PROJECT_TYPE_LABELS[relatedProject.project_type] || relatedProject.project_type}
                            </span>
                            <span>{relatedProject.client_name}</span>
                          </div>

                          {/* Title */}
                          <h3 className="text-xl font-bold text-white group-hover:text-[#00FF94] transition-colors duration-300 line-clamp-2">
                            {relatedProject.title}
                          </h3>

                          {/* Tagline */}
                          <p className="text-[#88939D] text-sm leading-relaxed line-clamp-2 group-hover:text-white/70 transition-colors duration-300">
                            {relatedProject.tagline}
                          </p>

                          {/* View Project */}
                          <div className="pt-3 border-t border-[#88939D]/10">
                            <span className="text-xs text-[#00FF94] font-medium group-hover:gap-1 flex items-center transition-all">
                              Pogledaj projekt
                              <svg
                                className="w-4 h-4 ml-0 group-hover:ml-1 transition-all duration-300"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9 5l7 7-7 7"
                                />
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
            initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: shouldReduceAnimations ? 0 : 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Imaš projekt?
            </h2>
            <p className="text-xl text-[#88939D] mb-12 max-w-2xl mx-auto">
              Javi se pa vidimo što možemo napraviti zajedno.
              Bez prodajnog pitcha, bez obaveza.
            </p>
            <Link href="/contact">
              <motion.button
                whileHover={shouldDisableHover ? undefined : {
                  scale: 1.02,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                  }
                }}
                whileTap={shouldDisableHover ? undefined : {
                  scale: 0.98,
                  transition: { duration: 0.1 }
                }}
                className="group relative px-8 py-5 bg-gradient-to-r from-[#00FF94] to-[#00CC78] text-black font-bold rounded-xl text-lg overflow-hidden transition-all shadow-lg shadow-[#00FF94]/20 hover:shadow-xl hover:shadow-[#00FF94]/30"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Čujemo se
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
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