// app/layout.jsx

import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SmoothScroll from '@/components/SmoothScroll'
import GradualBlur from '@/components/GradualBlur'
import ScrollToTop from '@/components/ScrollToTop'

export const metadata = {
  title: 'Ninefold - Premium Web Development',
  description: 'We build exceptional digital products for ambitious companies.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>
        <ScrollToTop /> {/* Try OUTSIDE and BEFORE SmoothScroll */}
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
      </body>
    </html>
  )
}