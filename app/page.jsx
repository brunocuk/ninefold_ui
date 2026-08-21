// app/page.jsx

import HomeMono from '@/components/mono/HomeMono'

export const metadata = {
  title: 'Ninefold | Kreativna Agencija Zagreb - Web, Video, Branding',
  description: 'Kreativna agencija iz Zagreba. Web, video, fotografija i branding, sve pod jednim krovom.',
  openGraph: {
    title: 'Ninefold | Kreativna Agencija Zagreb - Web, Video, Branding',
    description: 'Kreativna agencija iz Zagreba. Web, video, fotografija i branding, sve pod jednim krovom.',
    type: 'website',
    locale: 'hr_HR',
    siteName: 'Ninefold',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ninefold | Kreativna Agencija Zagreb',
    description: 'Kreativna agencija iz Zagreba. Web, video, fotografija i branding.',
  },
  alternates: {
    canonical: 'https://www.ninefold.eu',
  },
}

export default function HomePage() {
  return <HomeMono />
}
