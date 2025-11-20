// app/services/web-apps/page.jsx

import { Suspense } from 'react'
import WebAppsContent from './WebAppsContent'

export const metadata = {
  title: 'Web Applications Development | Custom Software Solutions',
  description: 'Custom web applications built with React and Next.js. From SaaS platforms to internal tools, we build scalable software that solves real business problems.',
  openGraph: {
    title: 'Web Applications Development | Custom Software Solutions',
    description: 'Custom web applications built with React and Next.js. From SaaS platforms to internal tools, we build scalable software that solves real business problems.',
    type: 'website',
  },
}

export default function WebAppsServicePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F0F0F]" />}>
      <WebAppsContent />
    </Suspense>
  )
}