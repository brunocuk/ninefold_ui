// lib/useMobileOptimization.js
'use client'

import { useState, useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Hook for mobile performance optimizations
 * Detects mobile devices, reduced motion preference, and provides optimized animation settings
 *
 * IMPORTANT: Initial state matches server render (all false) to avoid hydration mismatch.
 * Client-side detection happens after mount in useEffect.
 */
export function useMobileOptimization() {
  const prefersReducedMotion = useReducedMotion()
  const [hasMounted, setHasMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [isSlowConnection, setIsSlowConnection] = useState(false)

  useEffect(() => {
    // Mark as mounted - this triggers client-side only updates
    setHasMounted(true)

    // Check for mobile viewport
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Check for touch device
    const checkTouch = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches
      )
    }

    // Check for slow connection
    const checkConnection = () => {
      if ('connection' in navigator) {
        const connection = navigator.connection
        const slowTypes = ['slow-2g', '2g', '3g']
        const isSlowType = slowTypes.includes(connection.effectiveType)
        const isSlowDownlink = connection.downlink < 1.5 // Mbps
        setIsSlowConnection(isSlowType || isSlowDownlink || connection.saveData)
      }
    }

    checkMobile()
    checkTouch()
    checkConnection()

    window.addEventListener('resize', checkMobile)

    // Listen for connection changes
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', checkConnection)
    }

    return () => {
      window.removeEventListener('resize', checkMobile)
      if ('connection' in navigator) {
        navigator.connection.removeEventListener('change', checkConnection)
      }
    }
  }, [])

  // Should we reduce animations?
  const shouldReduceAnimations = prefersReducedMotion || isMobile || isTouchDevice

  // Should we disable videos?
  const shouldDisableVideos = isMobile || isSlowConnection

  // Should we disable hover effects? (No hover on touch devices)
  const shouldDisableHover = isTouchDevice

  return {
    isMobile,
    isTouchDevice,
    isSlowConnection,
    prefersReducedMotion,
    shouldReduceAnimations,
    shouldDisableVideos,
    shouldDisableHover,
  }
}

/**
 * Get optimized motion props based on device capabilities
 * Returns simplified or no animations for mobile/touch devices
 */
export function getOptimizedMotionProps(shouldReduceAnimations, defaultProps = {}) {
  if (shouldReduceAnimations) {
    // Return simplified or static props for mobile
    return {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      whileHover: undefined,
      whileTap: undefined,
      transition: { duration: 0 },
    }
  }
  return defaultProps
}

/**
 * Conditional will-change-transform class
 * Only applies on desktop for better GPU optimization
 */
export function getWillChangeClass(shouldReduceAnimations) {
  return shouldReduceAnimations ? '' : 'will-change-transform'
}
