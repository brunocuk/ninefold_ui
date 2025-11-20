// app/services/seo/page.jsx

import { Suspense } from 'react'
import SEOContent from './SEOContent'

export const metadata = {
  title: 'SEO Services | Technical SEO & Optimization',
  description: 'Technical SEO built into every website we create. Fast performance, clean code, proper meta tags, and schema markup for better search rankings.',
  openGraph: {
    title: 'SEO Services | Technical SEO & Optimization',
    description: 'Technical SEO built into every website we create. Fast performance, clean code, proper meta tags, and schema markup for better search rankings.',
    type: 'website',
  },
}

export default function SEOPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F0F0F]" />}>
      <SEOContent />
    </Suspense>
  )
}