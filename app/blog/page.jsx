// app/blog/page.jsx

import BlogMono from '@/components/mono/BlogMono'
import { blogPosts } from '@/content/blog'

export const metadata = {
  title: 'Blog | Ninefold',
  description: 'Misli o webu, dizajnu i videu. Kad nam dođe inspiracija.',
  alternates: {
    canonical: 'https://www.ninefold.eu/blog',
  },
}

export default function BlogPage() {
  // Strip content blocks so the list page ships only card data.
  const posts = [...blogPosts]
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .map(({ content, ...p }) => p)

  return <BlogMono posts={posts} />
}
