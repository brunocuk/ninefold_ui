// app/blog/[slug]/page.jsx

import { notFound } from 'next/navigation'
import BlogPostMono from '@/components/mono/BlogPostMono'
import { blogPosts } from '@/content/blog'

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) return { title: 'Članak nije pronađen' }
  return {
    title: `${post.title} | Ninefold Blog`,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.metaDescription || post.excerpt,
      type: 'article',
      images: post.heroImage ? [{ url: post.heroImage }] : [],
    },
    alternates: {
      canonical: `https://www.ninefold.eu/blog/${slug}`,
    },
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) notFound()

  const related = blogPosts
    .filter((p) => p.slug !== slug)
    .sort((a, b) => {
      const sameCat = (p) => (p.category === post.category ? 0 : 1)
      return sameCat(a) - sameCat(b) || new Date(b.publishedAt) - new Date(a.publishedAt)
    })
    .slice(0, 3)
    .map(({ content, ...p }) => p)

  return <BlogPostMono post={post} related={related} />
}
