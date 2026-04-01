// app/contact/page.jsx

import { Suspense } from 'react'
import ContactContent from './ContactContent'

export const metadata = {
  title: 'Kontakt | NineFold - Kreativna Agencija Zagreb',
  description: 'Imate projekt na umu? Kontaktirajte naš kreativni tim u Zagrebu. Odgovaramo unutar 24 sata. Izgradimo nešto sjajno zajedno.',
  openGraph: {
    title: 'Kontakt | NineFold - Kreativna Agencija Zagreb',
    description: 'Imate projekt na umu? Kontaktirajte naš kreativni tim u Zagrebu. Odgovaramo unutar 24 sata.',
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