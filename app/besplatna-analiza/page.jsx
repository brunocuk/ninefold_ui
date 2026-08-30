// Lead magnet: besplatna analiza web stranice. Najniža stepenica prije
// "zatraži ponudu", landing i gradske stranice linkaju ovamo.

import AnalysisMono from '@/components/mono/AnalysisMono'
import { ANALYSIS } from '@/components/mono/analysisData'

export const metadata = {
  title: ANALYSIS.metaTitle,
  description: ANALYSIS.metaDescription,
  alternates: {
    canonical: 'https://www.ninefold.eu/besplatna-analiza',
  },
}

export default function BesplatnaAnalizaPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Besplatna analiza web stranice',
      description: ANALYSIS.metaDescription,
      url: 'https://www.ninefold.eu/besplatna-analiza',
      provider: { '@id': 'https://www.ninefold.eu/#organization' },
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
      inLanguage: 'hr',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: ANALYSIS.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AnalysisMono />
    </>
  )
}
