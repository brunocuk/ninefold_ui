// Gradske varijante landing stranice za lokalne pretrage
// (izrada web stranica zagreb / split / rijeka / pula / dubrovnik).

import { notFound } from 'next/navigation'
import LandingMono from '@/components/mono/LandingMono'
import { LANDINGS, CITIES } from '@/components/mono/landingData'

export function generateStaticParams() {
  return CITIES.map((c) => ({ grad: c.slug }))
}

export async function generateMetadata({ params }) {
  const { grad } = await params
  const data = LANDINGS[`izrada-web-stranica/${grad}`]
  if (!data) return { title: 'Stranica nije pronađena' }
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    alternates: {
      canonical: `https://www.ninefold.eu/izrada-web-stranica/${grad}`,
    },
  }
}

export default async function IzradaWebStranicaGradPage({ params }) {
  const { grad } = await params
  const slug = `izrada-web-stranica/${grad}`
  const data = LANDINGS[slug]
  if (!data) notFound()

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: data.h1,
      description: data.metaDescription,
      url: `https://www.ninefold.eu/${slug}`,
      provider: { '@id': 'https://www.ninefold.eu/#organization' },
      areaServed: { '@type': 'City', name: CITIES.find((c) => c.slug === grad)?.name },
      inLanguage: 'hr',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Izrada web stranica', item: 'https://www.ninefold.eu/izrada-web-stranica' },
        { '@type': 'ListItem', position: 2, name: data.h1, item: `https://www.ninefold.eu/${slug}` },
      ],
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingMono slug={slug} />
    </>
  )
}
