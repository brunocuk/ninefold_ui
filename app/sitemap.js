// app/sitemap.js
// Dynamic sitemap: pages from code, projects from the CMS, posts from content.

import { createClient } from '@supabase/supabase-js'
import { blogPosts } from '@/content/blog'
import { SERVICES } from '@/components/mono/serviceData'

const baseUrl = 'https://www.ninefold.eu'

export default async function sitemap() {
  const now = new Date().toISOString()

  const staticRoutes = ['', '/about', '/usluge', '/work', '/contact', '/blog'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }))

  const serviceRoutes = SERVICES.map((s) => ({
    url: `${baseUrl}/usluge/${s.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  let projectRoutes = []
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    const { data } = await supabase
      .from('portfolio_projects')
      .select('slug, updated_at')
      .eq('published', true)
    projectRoutes = (data || []).map((p) => ({
      url: `${baseUrl}/work/${p.slug}`,
      lastModified: p.updated_at || now,
      changeFrequency: 'monthly',
      priority: 0.6,
    }))
  } catch {
    // CMS unreachable at build time: ship the sitemap without project URLs.
  }

  const blogRoutes = blogPosts.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: p.publishedAt || now,
    changeFrequency: 'weekly',
    priority: 0.5,
  }))

  return [...staticRoutes, ...serviceRoutes, ...projectRoutes, ...blogRoutes]
}
