'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const numberVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateX: -90 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden flex items-center justify-center">
      {/* Animated background gradient */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/10 via-transparent to-[#00FF94]/5"
      />

      {/* Floating orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00FF94] rounded-full blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        style={{
          x: -mousePosition.x,
          y: -mousePosition.y,
        }}
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#00FF94] rounded-full blur-[140px]"
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 148, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 148, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
      >
        {/* 404 Number */}
        <motion.div
          variants={numberVariants}
          className="mb-8 relative"
        >
          <motion.h1
            className="text-[150px] md:text-[200px] lg:text-[280px] font-black leading-none"
            style={{
              background: 'linear-gradient(135deg, #00FF94 0%, #00CC77 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            404
          </motion.h1>
          
          {/* Glowing effect behind number */}
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 blur-3xl"
            style={{
              background: 'radial-gradient(circle, #00FF94 0%, transparent 70%)',
            }}
          />
        </motion.div>

        {/* Error message */}
        <motion.div variants={itemVariants} className="space-y-4 mb-12">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white">
            Page Not Found
          </h2>
          <p className="text-lg md:text-xl text-[#88939D] max-w-2xl mx-auto">
            Oops! The page you're looking for seems to have wandered off into the digital void.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-[#00FF94] text-black font-bold rounded-lg text-lg shadow-lg shadow-[#00FF94]/20 hover:shadow-[#00FF94]/40 transition-shadow"
            >
              Go Home
            </motion.button>
          </Link>
          
          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-lg text-lg hover:bg-white/10 hover:border-[#00FF94]/50 transition-all"
            >
              Contact Us
            </motion.button>
          </Link>
        </motion.div>

        {/* Additional links */}
        <motion.div
          variants={itemVariants}
          className="mt-12 flex flex-wrap justify-center gap-6 text-sm"
        >
          {[
            { label: 'Home', href: '/' },
            { label: 'Work', href: '/work' },
            { label: 'Services', href: '/services' },
            { label: 'About', href: '/about' },
            { label: 'Blog', href: '/blog' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[#88939D] hover:text-[#00FF94] transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
        </motion.div>
      </motion.div>

      {/* Animated particles - only render after mount */}
      {mounted && [...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#00FF94] rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0,
          }}
          animate={{
            y: [null, Math.random() * -200 - 100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}