// app/usluge/[slug]/page.jsx
// Related projects fetched server-side so they are in the HTML for SEO.

import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import ServiceMono from '@/components/mono/ServiceMono'
import { SERVICE_DETAILS } from '@/components/mono/serviceData'
import { blogPosts } from '@/content/blog'

export const revalidate = 3600

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export function generateStaticParams() {
  return Object.keys(SERVICE_DETAILS).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const detail = SERVICE_DETAILS[slug]
  if (!detail) return { title: 'Usluga nije pronađena' }
  return {
    title: `${detail.title} | Ninefold`,
    description: detail.metaDescription,
    alternates: {
      canonical: `https://www.ninefold.eu/usluge/${slug}`,
    },
  }
}

export default async function ServicePage({ params }) {
  const { slug } = await params
  const detail = SERVICE_DETAILS[slug]
  if (!detail) notFound()

  let projects = []
  if (detail.projectType) {
    const { data } = await supabase
      .from('portfolio_projects')
      .select('slug, title, tagline, project_type, featured_image')
      .eq('published', true)
      .eq('project_type', detail.projectType)
      .order('featured', { ascending: false })
      .order('display_order', { ascending: true })
      .limit(3)
    projects = data || []
  }

  const posts = (detail.blogSlugs || [])
    .map((s) => blogPosts.find((p) => p.slug === s))
    .filter(Boolean)
    .map(({ slug: postSlug, title, category, readTime }) => ({ slug: postSlug, title, category, readTime }))

  const url = `https://www.ninefold.eu/usluge/${slug}`
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: detail.title,
      description: detail.metaDescription,
      url,
      provider: { '@id': 'https://www.ninefold.eu/#organization' },
      areaServed: { '@type': 'Country', name: 'Hrvatska' },
      inLanguage: 'hr',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Usluge', item: 'https://www.ninefold.eu/usluge' },
        { '@type': 'ListItem', position: 2, name: detail.title, item: url },
      ],
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServiceMono slug={slug} projects={projects} posts={posts} />
    </>
  )
}
