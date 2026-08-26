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

export default function IzradaWebShopaPage() {
  return <LandingMono slug="izrada-web-shopa" />
}
