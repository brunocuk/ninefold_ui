// app/work/[slug]/ProjectDetailsClient.jsx
"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { projects } from "@/content/projects";
import { useMobileOptimization } from "@/lib/useMobileOptimization";

export default function ProjectDetailsClient({ project }) {
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

  // Get related projects data
  const getRelatedProjects = () => {
    if (!project.relatedProjects || project.relatedProjects.length === 0)
      return [];

    return project.relatedProjects
      .map((relatedId) => projects.find((p) => p.id === relatedId))
      .filter(Boolean)
      .slice(0, 3);
  };

  const relatedProjects = getRelatedProjects();

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
                Work
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
                {project.category}
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
                <div className="text-sm mb-1">Client</div>
                <div className="text-white font-semibold">{project.client}</div>
              </div>
              <div>
                <div className="text-sm mb-1">Year</div>
                <div className="text-white font-semibold">{project.year}</div>
              </div>
              <div>
                <div className="text-sm mb-1">Duration</div>
                <div className="text-white font-semibold">
                  {project.duration}
                </div>
              </div>
            </motion.div>
            
            {/* LINK TO SITE */}
            <Link href={project.linkToSite}>
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
                View Live Website
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
          </div>
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94] to-transparent opacity-30" />
      </section>

      {/* Hero Media (Video or Image) */}
      <section className="relative py-12 lg:py-16 bg-[#0F0F0F]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
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
            className="relative rounded-2xl overflow-hidden border-2 border-[#88939D]/20 hover:border-[#00FF94]/50 transition-colors duration-500"
          >
            {project.heroVideo ? (
              // Video with mobile optimization
              <div className="relative aspect-video">
                {/* On mobile/slow connection: show thumbnail with play button */}
                {(shouldDisableVideos && !showVideo) ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={project.thumbnail || project.heroImage || '/images/placeholder.jpg'}
                      alt={project.title}
                      fill
                      className="object-cover"
                      priority
                    />
                    {/* Play button overlay */}
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
                  // Desktop or user opted to play - defer loading
                  isPageReady ? (
                    <video
                      ref={videoRef}
                      src={project.heroVideo}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      poster={project.thumbnail || project.heroImage}
                      onLoadedData={() => setVideoLoaded(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    // Show poster while page loads
                    <Image
                      src={project.thumbnail || project.heroImage || '/images/placeholder.jpg'}
                      alt={project.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  )
                )}
              </div>
            ) : project.heroImage ? (
              <div className="relative aspect-video">
                <Image
                  src={project.heroImage}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-[#00FF94]/20 to-[#00CC78]/10 flex items-center justify-center">
                <span className="text-[#88939D]">Project Hero Media</span>
              </div>
            )}
          </motion.div>
        </div>
      </section>

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
                  Overview
                </h2>
                <p className="text-lg text-[#88939D] leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Challenge */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  The Challenge
                </h3>
                <p className="text-lg text-[#88939D] leading-relaxed">
                  {project.challenge}
                </p>
              </div>

              {/* Solution */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Our Solution
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
                <h3 className="text-xl font-bold text-white mb-4">Services</h3>
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
                  Technologies
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
              Results & Impact
            </h2>
            <p className="text-xl text-[#88939D] max-w-3xl mx-auto">
              Measurable outcomes that demonstrate the value delivered
            </p>
          </motion.div>

          {/* Results Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {project.results.map((result, index) => (
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
                  <div className="text-5xl md:text-6xl font-bold text-[#00FF94] mb-3">
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
      {project.lighthouse && (
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
                Performance Metrics
              </h2>
              <p className="text-xl text-[#88939D] max-w-3xl mx-auto">
                Built for speed and optimized for search engines
              </p>
            </motion.div>

            {/* Lighthouse Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[
                {
                  score: project.lighthouse.performance,
                  label: "Performance",
                  color: "#00FF94",
                },
                {
                  score: project.lighthouse.accessibility,
                  label: "Accessibility",
                  color: "#00FF94",
                },
                {
                  score: project.lighthouse.bestPractices,
                  label: "Best Practices",
                  color: "#00FF94",
                },
                {
                  score: project.lighthouse.seo,
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
                Tested with{" "}
                <span className="text-white font-semibold">
                  Google Lighthouse
                </span>
              </p>
            </motion.div>
          </div>
        </section>
      )}

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
                Related Projects
              </h2>
              <p className="text-xl text-[#88939D]">Explore more of our work</p>
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
                        {relatedProject.thumbnail ? (
                          <Image
                            src={relatedProject.thumbnail}
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
                              {relatedProject.category}
                            </span>
                            <span>{relatedProject.client}</span>
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
                              View project
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
              Ready to start your project?
            </h2>
            <p className="text-xl text-[#88939D] mb-12 max-w-2xl mx-auto">
              Let's create something amazing together. Get in touch to discuss
              your next big idea.
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
                  Get in touch
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