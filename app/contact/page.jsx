// app/contact/page.jsx

import { Suspense } from 'react'
import ContactContent from './ContactContent'

export const metadata = {
  title: 'Contact Us | Get in Touch - NineFold',
  description: 'Have a project in mind? Contact our web development team in Zagreb, Croatia. We respond within 24 hours. Let\'s build something great together.',
  openGraph: {
    title: 'Contact Us | Get in Touch - NineFold',
    description: 'Have a project in mind? Contact our web development team in Zagreb, Croatia. We respond within 24 hours.',
    type: 'website',
  },
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F0F0F]" />}>
      <ContactContent />
    </Suspense>
  )
}