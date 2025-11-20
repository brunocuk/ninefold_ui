// app/cookie-policy/page.jsx

import { Suspense } from 'react'
import CookiePolicyContent from './CookiePolicyContent'

export const metadata = {
  title: 'Cookie Policy | NineFold - Progmatiq v.l. Bruno Čukić',
  description: 'Learn about how NineFold uses cookies and similar technologies on our website. GDPR-compliant cookie policy.',
  openGraph: {
    title: 'Cookie Policy | NineFold',
    description: 'Learn about how NineFold uses cookies and similar technologies on our website.',
    type: 'website',
  },
}

export default function CookiePolicyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F0F0F]" />}>
      <CookiePolicyContent />
    </Suspense>
  )
}