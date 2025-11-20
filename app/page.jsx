// app/page.jsx

import { Suspense } from 'react'
import HeroSection from '@/components/sections/HeroSection'
import FeaturesSection from '@/components/sections/FeaturesSection'
import WorkSection from '@/components/sections/WorkSection'
import ProcessSection from '@/components/sections/ProcessSection'
import PricingSection from '@/components/sections/PricingSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import ServicesSection from '@/components/sections/ServicesSection'
import StatsSection from '@/components/sections/StatsSection'
import CTASection from '@/components/sections/CTASection'
import BlogSection from '@/components/sections/BlogSection'

export const metadata = {
  title: 'NineFold | Web Development & Design in Croatia',
  description: 'Professional web development, design, and digital services in Zagreb. Custom websites, Shopify stores, and web applications built for performance and conversions.',
  openGraph: {
    title: 'NineFold | Web Development & Design in Croatia',
    description: 'Professional web development, design, and digital services in Zagreb. Custom websites, Shopify stores, and web applications built for performance and conversions.',
    type: 'website',
    locale: 'en_US',
    siteName: 'NineFold',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NineFold | Web Development & Design in Croatia',
    description: 'Professional web development, design, and digital services in Zagreb.',
  },
  alternates: {
    canonical: 'https://ninefold.eu',
  },
}

export default function HomePage() {
  return (
    <main className="bg-[#0A0A0A]">
      <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A]" />}>
        <HeroSection />
      </Suspense>
      
      <Suspense fallback={<div className="h-96 bg-[#0A0A0A]" />}>
        <FeaturesSection />
      </Suspense>
      
      <Suspense fallback={<div className="h-96 bg-[#0A0A0A]" />}>
        <WorkSection />
      </Suspense>
      
      <Suspense fallback={<div className="h-96 bg-[#0A0A0A]" />}>
        <ProcessSection />
      </Suspense>
      
      <Suspense fallback={<div className="h-96 bg-[#0A0A0A]" />}>
        <PricingSection />
      </Suspense>
      
      <Suspense fallback={<div className="h-96 bg-[#0A0A0A]" />}>
        <TestimonialsSection />
      </Suspense>
      
      <Suspense fallback={<div className="h-96 bg-[#0A0A0A]" />}>
        <ServicesSection />
      </Suspense>
      
      <Suspense fallback={<div className="h-96 bg-[#0A0A0A]" />}>
        <StatsSection />
      </Suspense>
      
      <Suspense fallback={<div className="h-96 bg-[#0A0A0A]" />}>
        <BlogSection />
      </Suspense>
      
      <Suspense fallback={<div className="h-96 bg-[#0A0A0A]" />}>
        <CTASection />
      </Suspense>
    </main>
  )
}