// app/services/web-design/page.jsx

import { Suspense } from 'react'
import WebDesignContent from './WebDesignContent'

export const metadata = {
  title: 'Web Design Services | Beautiful Interfaces That Convert',
  description: 'Professional web design services in Figma. User-centric designs, mobile-first approach, and conversion optimization. From landing pages to complex web applications.',
  openGraph: {
    title: 'Web Design Services | Beautiful Interfaces That Convert',
    description: 'Professional web design services in Figma. User-centric designs, mobile-first approach, and conversion optimization.',
    type: 'website',
  },
}

export default function WebDesignServicePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F0F0F]" />}>
      <WebDesignContent />
    </Suspense>
  )
}