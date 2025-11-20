// app/work/[slug]/page.jsx
// Server component for SEO

import { notFound } from 'next/navigation';
import { getProjectBySlug } from '@/content/projects';
import ProjectDetailsClient from './ProjectDetailsClient';

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  
  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.title} - ${project.client} | NineFold Work`,
    description: project.description,
    
    // Open Graph for social sharing
    openGraph: {
      title: project.title,
      description: project.description,
      type: 'website',
      images: [
        {
          url: project.heroImage,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: [project.heroImage],
    },
    
    // Additional metadata
    keywords: [...project.services, ...project.technologies, project.category].join(', '),
    
    // Canonical URL
    alternates: {
      canonical: `https://ninefold.agency/work/${project.slug}`,
    },
  };
}

// Generate static params for all projects (for static generation)
export async function generateStaticParams() {
  const { projects } = await import('@/content/projects');
  
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  
  if (!project) {
    notFound();
  }

  // JSON-LD Structured Data for Google
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    image: project.heroImage,
    author: {
      '@type': 'Organization',
      name: 'NineFold',
    },
    publisher: {
      '@type': 'Organization',
      name: 'NineFold',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ninefold.agency/logo.png',
      },
    },
    datePublished: project.year,
    about: {
      '@type': 'Thing',
      name: project.category,
    },
    client: {
      '@type': 'Organization',
      name: project.client,
    },
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Client Component for Interactivity */}
      <ProjectDetailsClient project={project} />
    </>
  );
}