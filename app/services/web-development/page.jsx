// app/services/web-development/page.jsx

import { Suspense } from 'react'
import WebDevelopmentContent from './WebDevelopmentContent'

export const metadata = {
  title: 'Web Development Services | Fast, Scalable, Future-Proof Websites',
  description: 'Custom web development with React and Next.js. Lightning-fast performance, 97-100 Lighthouse scores, and clean maintainable code. From simple sites to complex web applications.',
  openGraph: {
    title: 'Web Development Services | Fast, Scalable, Future-Proof Websites',
    description: 'Custom web development with React and Next.js. Lightning-fast performance, 97-100 Lighthouse scores, and clean maintainable code.',
    type: 'website',
  },
}

export default function WebDevelopmentServicePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F0F0F]" />}>
      <WebDevelopmentContent />
    </Suspense>
  )
}