// app/layout.jsx

import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SmoothScroll from '@/components/SmoothScroll'
import GradualBlur from '@/components/GradualBlur'
import ScrollToTop from '@/components/ScrollToTop'
import CookieConsent from '@/components/CookieConsent'
import { Analytics } from '@vercel/analytics/react'

export const metadata = {
  metadataBase: new URL('https://www.ninefold.eu'),
  title: 'Ninefold | Kreativna Agencija Zagreb - Web, Video, Branding',
  description: 'Kreativna agencija iz Zagreba. Web, video, fotografija i branding, sve pod jednim krovom.',
  charset: 'utf-8',
}

// Sitewide Organization schema so Google connects every page to the brand.
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://www.ninefold.eu/#organization',
  name: 'Ninefold',
  url: 'https://www.ninefold.eu',
  logo: 'https://www.ninefold.eu/ninefold-icon.svg',
  email: 'hello@ninefold.eu',
  description: 'Kreativna agencija iz Zagreba. Web, video, fotografija i branding, sve pod jednim krovom.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Zagreb',
    addressCountry: 'HR',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="hr" className="dark">
      <head>
        <meta charSet="utf-8" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body>
        <ScrollToTop />
        <SmoothScroll>
          <Header />
          {children}
          <Footer />
        </SmoothScroll>

        <GradualBlur
          target="page"
          position="bottom"
          height="6rem"
          strength={2}
          divCount={5}
          curve="bezier"
          exponential={true}
          opacity={1}
        />
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  )
}