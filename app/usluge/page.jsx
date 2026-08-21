// app/usluge/page.jsx

import UslugeMono from '@/components/mono/UslugeMono'

export const metadata = {
  title: 'Usluge | Ninefold',
  description: 'Web, video, fotografija i branding. I to je to. Sve usluge Ninefold agencije iz Zagreba.',
  alternates: {
    canonical: 'https://www.ninefold.eu/usluge',
  },
}

export default function UslugePage() {
  return <UslugeMono />
}
