// components/SmoothScroll.jsx

'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null)

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    // Store lenis instance in ref
    lenisRef.current = lenis

    // Make Lenis accessible globally for ScrollToTop component
    window.lenis = lenis

    // Animation frame for Lenis
    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Cleanup on unmount
    return () => {
      lenis.destroy()
      window.lenis = null
    }
  }, [])

  return <>{children}</>
}