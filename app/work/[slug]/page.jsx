// app/work/[slug]/page.jsx
// Server component for SEO

import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import ProjectDetailsClient from './ProjectDetailsClient';

// Create Supabase client for server component
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Map project_type to display labels
const PROJECT_TYPE_LABELS = {
  video_production: 'Video Production',
  social_media: 'Social Media',
  web_development: 'Web Development',
  web_app: 'Web App',
  mobile_app: 'Mobile App'
};

// Fetch project by slug
async function getProjectBySlug(slug) {
  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error || !data) return null;
  return data;
}

// Fetch related projects
async function getRelatedProjects(relatedIds) {
  if (!relatedIds || relatedIds.length === 0) return [];

  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('id, slug, title, tagline, client_name, project_type, featured_image, results')
    .in('id', relatedIds)
    .eq('published', true)
    .limit(3);

  if (error) return [];
  return data || [];
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  const heroImage = project.hero_image || project.featured_image;

  return {
    title: `${project.title} - ${project.client_name} | NineFold Work`,
    description: project.description,

    // Open Graph for social sharing
    openGraph: {
      title: project.title,
      description: project.description,
      type: 'website',
      images: heroImage ? [
        {
          url: heroImage,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ] : [],
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: heroImage ? [heroImage] : [],
    },

    // Additional metadata
    keywords: [
      ...(project.services || []),
      ...(project.technologies || []),
      PROJECT_TYPE_LABELS[project.project_type] || project.project_type
    ].join(', '),

    // Canonical URL
    alternates: {
      canonical: `https://ninefold.agency/work/${project.slug}`,
    },
  };
}

// Generate static params for all projects (for static generation)
export async function generateStaticParams() {
  const { data: projects } = await supabase
    .from('portfolio_projects')
    .select('slug')
    .eq('published', true);

  return (projects || []).map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  // Fetch related projects
  const relatedProjects = await getRelatedProjects(project.related_projects);

  // JSON-LD Structured Data for Google
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    image: project.hero_image || project.featured_image,
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
      name: PROJECT_TYPE_LABELS[project.project_type] || project.project_type,
    },
    client: {
      '@type': 'Organization',
      name: project.client_name,
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
      <ProjectDetailsClient project={project} relatedProjects={relatedProjects} />
    </>
  );
}