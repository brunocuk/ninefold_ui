// components/Footer.jsx

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-[#0F0F0F] overflow-hidden">
      
      {/* Noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-20">
        
        {/* Main Grid */}
        <div className="grid lg:grid-cols-12 gap-16 mb-16">
          
          {/* Left - Logo & Description */}
          <div className="lg:col-span-5 space-y-8">
            {/* Logo */}
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="inline-block cursor-pointer"
              >
                <img
                  src="/ninefold-logo.svg"
                  alt="Ninefold"
                  width="140"
                  height="20"
                  style={{ height: '20px', width: 'auto' }}
                />
              </motion.div>
            </Link>

            <p className="text-[#88939D] text-base leading-relaxed max-w-md">
              Radimo web, video, fotografiju i branding. I to je to.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 pt-4">
              <a 
                href="mailto:hello@ninefold.agency"
                className="block text-white hover:text-[#00FF94] transition-colors font-medium"
              >
                hello@ninefold.eu
              </a>
              <a 
                href="tel:+385915469266"
                className="block text-[#88939D] hover:text-[#00FF94] transition-colors"
              >
                +385 91 5469 266
              </a>
              <p className="text-[#88939D]">Zagreb, Croatia</p>
            </div>
          </div>

          {/* Right - Links in Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            
            {/* Explore */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-6">
                Istraži
              </h4>
              <nav className="space-y-3">
                {[
                  { label: 'Naslovna', href: '/' },
                  { label: 'O nama', href: '/about' },
                  { label: 'Radovi', href: '/work' },
                  { label: 'Usluge', href: '/usluge' },
                  { label: 'Kontakt', href: '/contact' },
                ].map((link) => (
                  <Link key={link.href} href={link.href}>
                    <div className="text-[#88939D] hover:text-white transition-colors text-sm">
                      {link.label}
                    </div>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-6">
                Poveži se
              </h4>
              <nav className="space-y-3">
                {[
                  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/ninefoldeu/' },
                  { label: 'Instagram', href: 'https://www.instagram.com/ninefold_eu/' },
                  { label: 'Dribbble', href: 'https://dribbble.com' },
                ].map((link) => (
                  <a 
                    key={link.href} 
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="text-[#88939D] hover:text-white transition-colors text-sm">
                      {link.label}
                    </div>
                  </a>
                ))}
              </nav>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-6">
                Pravno
              </h4>
              <nav className="space-y-3">
                {[
                  { label: 'Politika privatnosti', href: '/privacy' },
                  { label: 'Uvjeti korištenja', href: '/terms' },
                  { label: 'Kolačići', href: '/cookies' },
                ].map((link) => (
                  <Link key={link.href} href={link.href}>
                    <div className="text-[#88939D] hover:text-white transition-colors text-sm">
                      {link.label}
                    </div>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#88939D]/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#88939D] text-sm">
            © {currentYear} Ninefold. Sva prava pridržana.
          </p>
          <p className="text-[#88939D] text-sm">
            Napravljeno s ljubavlju u Zagrebu
          </p>
        </div>
      </div>
    </footer>
  )
}