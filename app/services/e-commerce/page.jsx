// app/services/ecommerce/page.jsx

import { Suspense } from 'react'
import EcommerceContent from './EcommerceContent'

export const metadata = {
  title: 'Shopify Development | E-Commerce Store Design & Setup',
  description: 'Custom Shopify stores built for conversions. Professional theme development, payment integration, and store optimization for growing online businesses.',
  openGraph: {
    title: 'Shopify Development | E-Commerce Store Design & Setup',
    description: 'Custom Shopify stores built for conversions. Professional theme development, payment integration, and store optimization for growing online businesses.',
    type: 'website',
  },
}

export default function EcommerceServicePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F0F0F]" />}>
      <EcommerceContent />
    </Suspense>
  )
}