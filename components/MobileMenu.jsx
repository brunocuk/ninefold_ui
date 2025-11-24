'use client'

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function MobileMenu({ isOpen, onClose }) {
  const pathname = usePathname()
  const [hoveredItem, setHoveredItem] = useState(null)
  const prefersReducedMotion = useReducedMotion()

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Work', href: '/work' },
    { label: 'Services', href: '/services', hasSubmenu: true },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Blog', href: '/blog' },
  ]

  const services = [
    { title: 'Web Design', href: '/services/web-design', description: 'Beautiful interfaces that convert' },
    { title: 'Web Development', href: '/services/web-development', description: 'Fast, scalable, future-proof' },
    { title: 'Content Creation', href: '/services/content-creation', description: 'Professional photos & videos' },
    { title: 'E-Commerce', href: '/services/e-commerce', description: 'Online stores that sell' },
    { title: 'Web Applications', href: '/services/web-applications', description: 'Custom software solutions' },
    { title: 'SEO Optimization', href: '/services/search-engine-optimization', description: 'Get found, rank higher' },
  ]

  const socialLinks = [
    { label: 'LINKEDIN', href: 'https://www.linkedin.com/company/ninefoldeu/' },
    { label: 'INSTAGRAM', href: 'https://www.instagram.com/ninefold_eu/' },
  ]

  // Bubble animation variants
  const bubbleVariants = {
    closed: { 
      scale: 0,
      opacity: 0,
      borderRadius: '100%',
      transition: { 
        duration: 0.6,
        ease: [0.76, 0, 0.24, 1]
      }
    },
    open: { 
      scale: 1,
      opacity: 1,
      borderRadius: '0%',
      transition: { 
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1]
      }
    }
  }

  const contentVariants = {
    closed: { 
      opacity: 0,
      transition: { 
        duration: 0.2
      }
    },
    open: { 
      opacity: 1,
      transition: { 
        delay: 0.35,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  }

  const itemVariants = {
    closed: { 
      opacity: 0, 
      y: 40,
      rotateX: -10
    },
    open: (i) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { 
        delay: 0.45 + i * 0.07,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  }

  const submenuVariants = {
    closed: { 
      opacity: 0,
      x: 30,
      transition: { 
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1]
      }
    },
    open: { 
      opacity: 1,
      x: 0,
      transition: { 
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  }

  const submenuItemVariants = {
    closed: { 
      opacity: 0, 
      x: 15
    },
    open: (i) => ({
      opacity: 1,
      x: 0,
      transition: { 
        delay: 0.1 + i * 0.05,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  }

  const headerVariants = {
    closed: { opacity: 0, y: -15 },
    open: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.5,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  }

  const footerVariants = {
    closed: { opacity: 0, y: 20 },
    open: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 1.1,
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  }

  const socialVariants = {
    closed: { opacity: 0, x: -15 },
    open: (i) => ({
      opacity: 1,
      x: 0,
      transition: { 
        delay: 1.25 + i * 0.04,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Animated bubble menu */}
          <motion.div
            variants={bubbleVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-40 overflow-hidden will-change-transform"
            style={{
              background: 'linear-gradient(135deg, #0F0F0F 0%, #0a0a0a 100%)',
              transformOrigin: 'top right',
            }}
          >
            {/* Animated gradient overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/15 via-transparent to-[#00FF94]/10 will-change-transform"
            />

            {/* Floating orbs */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.2 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: 0.7, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#00FF94] rounded-full blur-[120px] will-change-transform"
            />
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.15 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: 0.9, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#00CC78] rounded-full blur-[140px] will-change-transform"
            />

            {/* Content */}
            <motion.div 
              variants={contentVariants}
              className="relative h-full overflow-y-auto"
            >
              <div className="min-h-full p-6 md:p-12 pt-24 md:pt-32 max-w-7xl mx-auto">
                
                {/* Two column layout on desktop */}
                <div 
                  className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24"
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  
                  {/* Left side - Navigation */}
                  <nav className="mb-16 md:mb-24 lg:mb-0">
                    <motion.h3
                      variants={headerVariants}
                      className="text-[#00FF94] text-xs uppercase tracking-wider mb-6 font-mono font-bold will-change-transform"
                    >
                      Navigation
                    </motion.h3>
                    <div className="space-y-2">
                      {navItems.map((item, index) => {
                        const isActive = pathname === item.href
                        
                        return (
                          <motion.div
                            key={item.href}
                            custom={index}
                            variants={itemVariants}
                            onMouseEnter={() => item.hasSubmenu && setHoveredItem(item.label)}
                            className="will-change-transform"
                          >
                            <Link 
                              href={item.href} 
                              onClick={onClose}
                              className="group block overflow-hidden"
                            >
                              <motion.h2
                                whileHover={{ 
                                  x: 20,
                                  transition: { 
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 25
                                  }
                                }}
                                whileTap={{ 
                                  scale: 0.98,
                                  transition: { duration: 0.1 }
                                }}
                                className={`text-4xl md:text-6xl lg:text-7xl font-bold transition-colors duration-300 will-change-transform ${
                                  isActive ? 'text-[#00FF94]' : 'text-white group-hover:text-[#00FF94]'
                                }`}
                              >
                                {item.label}
                              </motion.h2>
                            </Link>
                          </motion.div>
                        )
                      })}
                    </div>
                  </nav>

                  {/* Right side - Services Submenu */}
                  <div className="hidden lg:block relative">
                    <AnimatePresence mode="wait">
                      {hoveredItem === 'Services' && (
                        <motion.div
                          variants={submenuVariants}
                          initial="closed"
                          animate="open"
                          exit="closed"
                          className="sticky top-32 will-change-transform"
                        >
                          <motion.h3
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="text-[#00FF94] text-xs uppercase tracking-wider mb-8 font-mono font-bold"
                          >
                            Our Services
                          </motion.h3>
                          
                          <div className="space-y-3">
                            {services.map((service, i) => (
                              <motion.div
                                key={service.href}
                                custom={i}
                                variants={submenuItemVariants}
                                className="will-change-transform"
                              >
                                <Link
                                  href={service.href}
                                  onClick={onClose}
                                  className="group/sub block p-5 rounded-xl bg-white/5 border border-white/10 hover:border-[#00FF94]/50 hover:bg-white/10 transition-all duration-300"
                                >
                                  <motion.div
                                    whileHover={{ 
                                      x: 5,
                                      transition: {
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 30
                                      }
                                    }}
                                    className="will-change-transform"
                                  >
                                    <h4 className="text-lg md:text-xl font-bold text-white group-hover/sub:text-[#00FF94] transition-colors mb-1">
                                      {service.title}
                                    </h4>
                                    <p className="text-sm text-[#88939D] group-hover/sub:text-white/80 transition-colors">
                                      {service.description}
                                    </p>
                                  </motion.div>
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Mobile submenu */}
                  <div className="lg:hidden col-span-1">
                    {navItems.map((item) => {
                      if (!item.hasSubmenu) return null
                      const isServicesHovered = hoveredItem === 'Services'
                      
                      return (
                        <AnimatePresence key={item.label} mode="wait">
                          {isServicesHovered && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden ml-8 mt-4 mb-8 space-y-2"
                            >
                              {services.map((service, i) => (
                                <motion.div
                                  key={service.href}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ 
                                    delay: i * 0.04, 
                                    duration: 0.4,
                                    ease: [0.16, 1, 0.3, 1]
                                  }}
                                  className="will-change-transform"
                                >
                                  <Link
                                    href={service.href}
                                    onClick={onClose}
                                    className="group/sub block"
                                  >
                                    <motion.div
                                      whileHover={{ 
                                        x: 10,
                                        transition: {
                                          type: "spring",
                                          stiffness: 400,
                                          damping: 30
                                        }
                                      }}
                                      className="flex items-center gap-3 will-change-transform"
                                    >
                                      <span className="w-2 h-2 rounded-full bg-[#00FF94]/50 group-hover/sub:bg-[#00FF94] transition-colors" />
                                      <span className="text-lg md:text-2xl text-white/70 group-hover/sub:text-[#00FF94] transition-colors font-medium">
                                        {service.title}
                                      </span>
                                    </motion.div>
                                  </Link>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )
                    })}
                  </div>
                </div>

                {/* Footer */}
                <motion.div 
                  variants={footerVariants}
                  className="border-t border-white/10 pt-8 mt-16 space-y-6 will-change-transform"
                >
                  {/* Contact */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="will-change-transform"
                  >
                    <p className="text-[#88939D] text-xs uppercase tracking-wider mb-3 font-mono">
                      Get in touch
                    </p>
                    <motion.a 
                      href="mailto:hello@ninefold.eu"
                      className="text-white hover:text-[#00FF94] transition-colors text-lg font-medium block"
                      whileHover={{ 
                        x: 5,
                        transition: {
                          type: "spring",
                          stiffness: 400,
                          damping: 30
                        }
                      }}
                    >
                      hello@ninefold.eu
                    </motion.a>
                    <motion.p 
                      className="text-[#88939D] text-sm mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.25, duration: 0.5 }}
                    >
                      Zagreb, Croatia
                    </motion.p>
                  </motion.div>

                  {/* Social */}
                  <div>
                    <motion.p 
                      className="text-[#88939D] text-xs uppercase tracking-wider mb-3 font-mono"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2, duration: 0.5 }}
                    >
                      Follow us
                    </motion.p>
                    <div className="flex flex-wrap gap-4">
                      {socialLinks.map((social, index) => (
                        <motion.a
                          key={social.href}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          custom={index}
                          variants={socialVariants}
                          whileHover={{ 
                            y: -3,
                            transition: {
                              type: "spring",
                              stiffness: 400,
                              damping: 30
                            }
                          }}
                          whileTap={{ scale: 0.95 }}
                          className="text-white hover:text-[#00FF94] transition-colors text-sm font-bold font-mono will-change-transform"
                        >
                          {social.label}
                        </motion.a>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}