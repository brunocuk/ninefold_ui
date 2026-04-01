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
  title: 'NineFold | Kreativna Agencija Zagreb - Web, Video, Branding',
  description: 'Full-service kreativna agencija iz Zagreba. Branding, web razvoj, video produkcija i fotografija - sve pod jednim krovom.',
  openGraph: {
    title: 'NineFold | Kreativna Agencija Zagreb - Web, Video, Branding',
    description: 'Full-service kreativna agencija iz Zagreba. Branding, web razvoj, video produkcija i fotografija - sve pod jednim krovom.',
    type: 'website',
    locale: 'hr_HR',
    siteName: 'NineFold',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NineFold | Kreativna Agencija Zagreb',
    description: 'Full-service kreativna agencija iz Zagreba. Branding, web, video i fotografija.',
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