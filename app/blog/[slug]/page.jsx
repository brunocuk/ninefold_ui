// app/blog/[slug]/page.jsx
// This should be a SERVER component for better SEO

import { notFound } from 'next/navigation';
import { getBlogPostBySlug } from '@/content/blog';
import BlogPostClient from './BlogPostClient';

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | NineFold Blog`,
    description: post.metaDescription || post.excerpt,
    
    // Open Graph for social sharing
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: [
        {
          url: post.heroImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.heroImage],
    },
    
    // Additional metadata
    keywords: post.tags.join(', '),
    authors: [{ name: post.author.name }],
    
    // Canonical URL
    alternates: {
      canonical: `https://ninefold.agency/blog/${post.slug}`,
    },
  };
}

// Generate static params for all blog posts (for static generation)
export async function generateStaticParams() {
  const { blogPosts } = await import('@/content/blog');
  
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  
  if (!post) {
    notFound();
  }

  // JSON-LD Structured Data for Google
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.heroImage,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'NineFold',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ninefold.agency/logo.png',
      },
    },
    keywords: post.tags.join(', '),
    articleSection: post.category,
    wordCount: post.content.reduce((count, section) => {
      if (section.type === 'text') {
        return count + section.content.split(' ').length;
      }
      return count;
    }, 0),
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Client Component for Interactivity */}
      <BlogPostClient post={post} />
    </>
  );
}