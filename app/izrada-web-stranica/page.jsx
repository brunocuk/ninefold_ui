// Landing stranica za Google Ads kampanju "Search - Izrada web stranica".

import LandingMono from '@/components/mono/LandingMono'
import { LANDINGS } from '@/components/mono/landingData'

const data = LANDINGS['izrada-web-stranica']

export const metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  alternates: {
    canonical: 'https://www.ninefold.eu/izrada-web-stranica',
  },
}

export default function IzradaWebStranicaPage() {
  return <LandingMono slug="izrada-web-stranica" />
}
