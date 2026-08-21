// app/about/page.jsx

import AboutMono from '@/components/mono/AboutMono'

export const metadata = {
  title: 'O nama | Ninefold',
  description: 'Nas dvojica iz Zagreba. Bruno radi web, Petar snima i fotografira. Bez account managera, bez juniora, samo posao koji radimo.',
  alternates: {
    canonical: 'https://www.ninefold.eu/about',
  },
}

export default function AboutPage() {
  return <AboutMono />
}
