// components/sections/StatsSection.jsx

"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

function Counter({ from = 0, to, duration = 2, suffix = "", prefix = "" }) {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [ref, inView] = useInView({ threshold: 0.5, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, { duration, ease: "easeOut" });
      return controls.stop;
    }
  }, [inView, count, to, duration]);

  return (
    <motion.span ref={ref}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </motion.span>
  );
}

export default function StatsSection() {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const stats = [
    {
      value: 20,
      suffix: "+",
      label: "Projects delivered",
      description: "Successful projects across industries",
    },
    {
      value: 98,
      suffix: "%",
      label: "Client satisfaction",
      description: "Clients who would recommend us",
    },
    {
      value: 0.5,
      prefix: "<",
      suffix: "s",
      label: "Avg. Load Time",
      description: "First Contentful Paint",
    },
    {
      value: 100,
      suffix: "%",
      label: "On-time delivery",
      description: "We respect deadlines and budgets",
    },
  ];

  return (
    <section
      ref={ref}
      className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden"
    >
      {/* Subtle gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none" />

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
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-3xl"
          >
            Proven track record
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl md:text-2xl text-[#88939D] max-w-3xl"
          >
            The numbers speak for themselves. Here's what we've achieved.
          </motion.p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: 0.6 + index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative h-full p-6 lg:p-8 rounded-2xl bg-transparent border-2 border-[#88939D]/20 hover:border-[#00FF94] transition-all duration-300 overflow-hidden">
                {/* Hover gradient background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/5 via-[#00CC78]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Animated Number */}
                  <div className="mb-4">
                    <motion.div className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#00FF94]">
                      <Counter
                        to={stat.value}
                        duration={2.5}
                        suffix={stat.suffix}
                        prefix={stat.prefix}
                      />
                    </motion.div>
                  </div>

                  {/* Label */}
                  <h3 className="text-base lg:text-lg font-semibold text-white mb-2">
                    {stat.label}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[#88939D] leading-relaxed">
                    {stat.description}
                  </p>
                </div>

                {/* Bottom gradient line accent */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-8 p-8 lg:p-12 rounded-2xl border-2 border-[#88939D]/20"
        >
          {[
            { label: "Average project value", value: "€5K+" },
            { label: "Response time", value: "< 24h" },
            { label: "Client rating", value: "4.9/5" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 1.4 + i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-center"
            >
              <div className="text-2xl md:text-3xl font-bold text-white mb-2">
                {item.value}
              </div>
              <div className="text-sm text-[#88939D]">{item.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 pt-20 border-t border-[#88939D]/20"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-2xl">
  <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
    The website your business deserves
  </h3>
  <p className="text-lg text-[#88939D]">
    Lightning-fast performance, beautiful design, and full-service support. Join businesses who've already made the switch.
  </p>
</div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-5 bg-gradient-to-r from-[#00FF94] to-[#00CC78] text-black font-bold rounded-xl text-lg transition-all whitespace-nowrap"
            >
              Join them
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
