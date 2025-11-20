// app/privacy/page.jsx

import { Suspense } from 'react'
import PrivacyContent from './PrivacyContent'

export const metadata = {
  title: 'Privacy Policy | NineFold - Progmatiq vl. Bruno Čukić',
  description: 'Learn how NineFold (Progmatiq vl. Bruno Čukić) collects, uses, and protects your personal data. GDPR-compliant privacy policy.',
  openGraph: {
    title: 'Privacy Policy | NineFold',
    description: 'Learn how NineFold collects, uses, and protects your personal data.',
    type: 'website',
  },
}

export default function PrivacyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F0F0F]" />}>
      <PrivacyContent />
    </Suspense>
  )
}