// app/terms/page.jsx

import { Suspense } from 'react'
import TermsContent from './TermsContent'

export const metadata = {
  title: 'Terms and Conditions | NineFold - Progmatiq vl. Bruno Čukić',
  description: 'Terms and conditions for using NineFold web development services. Read our service agreement and legal terms.',
  openGraph: {
    title: 'Terms and Conditions | NineFold',
    description: 'Terms and conditions for using NineFold web development services.',
    type: 'website',
  },
}

export default function TermsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F0F0F]" />}>
      <TermsContent />
    </Suspense>
  )
}