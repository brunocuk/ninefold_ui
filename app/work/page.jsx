// app/work/page.jsx
// Projects are fetched server-side so the full list is in the HTML for SEO.

import { createClient } from '@supabase/supabase-js'
import WorkMono from '@/components/mono/WorkMono'

export const revalidate = 3600

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export const metadata = {
  title: 'Radovi | Ninefold',
  description: 'Projekti koje smo radili: web stranice, aplikacije, video produkcija i branding za klijente po cijeloj Hrvatskoj.',
  alternates: {
    canonical: 'https://www.ninefold.eu/work',
  },
}

export default async function WorkPage() {
  const { data } = await supabase
    .from('portfolio_projects')
    .select('id, slug, title, tagline, year, project_type, services, featured_image, featured, display_order')
    .eq('published', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })

  return <WorkMono projects={data || []} />
}
