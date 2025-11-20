// app/services/content-creation/page.jsx

import { Suspense } from 'react'
import ContentCreationContent from './ContentCreationContent'

export const metadata = {
  title: 'Photography & Videography | Professional Content for Websites',
  description: 'Professional photography and videography for websites. Product shots, team photos, space photography, and brand videos optimized for web.',
  openGraph: {
    title: 'Photography & Videography | Professional Content for Websites',
    description: 'Professional photography and videography for websites. Product shots, team photos, space photography, and brand videos optimized for web.',
    type: 'website',
  },
}

export default function ContentCreationServicePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F0F0F]" />}>
      <ContentCreationContent />
    </Suspense>
  )
}