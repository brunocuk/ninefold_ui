// lib/useScrollAnimation.js

'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Basic scroll animation - fade in from bottom
export function useScrollAnimation() {
  const elementRef = useRef(null)

  useEffect(() => {
    if (!elementRef.current) return

    gsap.fromTo(
      elementRef.current,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: elementRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return elementRef
}

// Fade in with custom delay
export function useFadeIn(delay = 0) {
  const elementRef = useRef(null)

  useEffect(() => {
    if (!elementRef.current) return

    gsap.fromTo(
      elementRef.current,
      { 
        opacity: 0, 
        y: 30 
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: elementRef.current,
          start: 'top 85%',
        },
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [delay])

  return elementRef
}

// Slide in from left or right
export function useSlideIn(direction = 'left', delay = 0) {
  const elementRef = useRef(null)

  useEffect(() => {
    if (!elementRef.current) return

    const fromVars = {
      opacity: 0,
      x: direction === 'left' ? -100 : 100,
    }

    gsap.fromTo(
      elementRef.current,
      fromVars,
      {
        opacity: 1,
        x: 0,
        duration: 1,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: elementRef.current,
          start: 'top 85%',
        },
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [direction, delay])

  return elementRef
}

// Parallax effect
export function useParallax(speed = 0.5) {
  const elementRef = useRef(null)

  useEffect(() => {
    if (!elementRef.current) return

    gsap.to(elementRef.current, {
      yPercent: -50 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: elementRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [speed])

  return elementRef
}

// Scale on scroll
export function useScaleIn(delay = 0) {
  const elementRef = useRef(null)

  useEffect(() => {
    if (!elementRef.current) return

    gsap.fromTo(
      elementRef.current,
      { 
        opacity: 0, 
        scale: 0.8 
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: elementRef.current,
          start: 'top 85%',
        },
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [delay])

  return elementRef
}

// Stagger animation for multiple children
export function useStagger(staggerAmount = 0.1) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const children = containerRef.current.children

    gsap.fromTo(
      children,
      { 
        opacity: 0, 
        y: 30 
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: staggerAmount,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [staggerAmount])

  return containerRef
}