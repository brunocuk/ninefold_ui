// app/contact/page.jsx

import ContactMono from '@/components/mono/ContactMono'

export const metadata = {
  title: 'Kontakt | Ninefold',
  description: 'Javi se. Odgovaramo unutar 24 sata, i to netko od nas dvojice, ne autoresponder.',
  alternates: {
    canonical: 'https://www.ninefold.eu/contact',
  },
}

export default function ContactPage() {
  return <ContactMono />
}
