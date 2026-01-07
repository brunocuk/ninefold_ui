// app/layout.jsx

import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SmoothScroll from '@/components/SmoothScroll'
import GradualBlur from '@/components/GradualBlur'
import ScrollToTop from '@/components/ScrollToTop'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'

export const metadata = {
  title: 'Ninefold - Premium Web Development',
  description: 'We build exceptional digital products for ambitious companies.',
  charset: 'utf-8',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        {/* CookieYes Banner */}
        <Script
          id="cookieyes"
          src="https://cdn-cookieyes.com/client_data/2be5e4cbd1c23f337d9871196dfe9816/script.js"
          strategy="afterInteractive"
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
        <Analytics />
      </body>
    </html>
  )
}