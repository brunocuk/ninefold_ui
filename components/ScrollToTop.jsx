// components/ScrollToTop.jsx
'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    // Disable browser scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    const scrollToTop = () => {
      // Method 1: Try Lenis
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true })
      }
      
      // Method 2: Force native scroll regardless
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }

    // Execute immediately
    scrollToTop()

    // Wait for Lenis to initialize and try again multiple times
    const attempts = [0, 10, 50, 100, 200]
    const timeouts = attempts.map(delay => 
      setTimeout(scrollToTop, delay)
    )

    // Cleanup
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout))
    }
  }, [pathname])

  return null
}