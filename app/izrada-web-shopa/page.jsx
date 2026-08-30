// Landing stranica za Google Ads oglase na "izrada web shopa / web trgovine".

import LandingMono from '@/components/mono/LandingMono'
import { LANDINGS } from '@/components/mono/landingData'

const data = LANDINGS['izrada-web-shopa']

export const metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  alternates: {
    canonical: 'https://www.ninefold.eu/izrada-web-shopa',
  },
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: data.h1,
    description: data.metaDescription,
    url: 'https://www.ninefold.eu/izrada-web-shopa',
    provider: { '@id': 'https://www.ninefold.eu/#organization' },
    areaServed: { '@type': 'Country', name: 'Hrvatska' },
    inLanguage: 'hr',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  },
]

export default function IzradaWebShopaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingMono slug="izrada-web-shopa" />
    </>
  )
}
