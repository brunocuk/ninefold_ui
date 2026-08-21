// app/terms/page.jsx

import { Suspense } from 'react'
import TermsContent from './TermsContent'
import { MonoPage } from '@/components/mono/kit'

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
    <Suspense fallback={<div className="min-h-screen" />}>
      <MonoPage>
        <TermsContent />
      </MonoPage>
    </Suspense>
  )
}