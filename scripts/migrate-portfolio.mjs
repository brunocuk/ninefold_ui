#!/usr/bin/env node

/**
 * Migration Script: Import existing projects from content/projects.js to Supabase
 *
 * Usage:
 *   node scripts/migrate-portfolio.mjs
 *
 * Before running:
 *   1. Make sure the portfolio_projects table exists in Supabase
 *   2. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY env vars
 *      OR run from project root where .env.local is loaded
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

dotenv.config({ path: join(projectRoot, '.env.local') });
dotenv.config({ path: join(projectRoot, '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Map old category to new project_type
const categoryToType = {
  'Web Design & Development': 'web_development',
  'Restaurant & Hospitality': 'web_development',
  'Creative & Lifestyle': 'web_development',
  'Automotive & Services': 'web_development',
  'Hospitality & Vacation Rentals': 'web_development',
  'Logistics & Transport': 'web_development',
};

// Read projects from the JS file
async function loadProjects() {
  // Dynamic import of the projects file
  const projectsModule = await import(join(projectRoot, 'content', 'projects.js'));
  return projectsModule.projects;
}

// Transform old project format to new schema
function transformProject(oldProject) {
  return {
    slug: oldProject.slug,
    title: oldProject.title,
    tagline: oldProject.tagline || null,
    client_name: oldProject.client,
    project_type: categoryToType[oldProject.category] || 'web_development',
    year: oldProject.year || null,
    duration: oldProject.duration || null,
    description: oldProject.description || null,
    challenge: oldProject.challenge || null,
    solution: oldProject.solution || null,
    featured_image: oldProject.thumbnail || null,
    hero_video: oldProject.heroVideo || null,
    hero_image: oldProject.heroImage || null,
    gallery: [], // Old format doesn't have gallery
    accent_color: oldProject.color || '#00FF94',
    results: oldProject.results || [],
    services: oldProject.services || [],
    technologies: oldProject.technologies || [],
    testimonial: oldProject.testimonial && oldProject.testimonial.quote
      ? oldProject.testimonial
      : null,
    sections: oldProject.sections || [],
    type_data: oldProject.lighthouse
      ? { lighthouse: oldProject.lighthouse }
      : {},
    published: true, // All existing projects are published
    featured: oldProject.featured || false,
    display_order: oldProject.id || 0, // Use old ID as display order
    live_site_url: oldProject.linkToSite || null,
    related_projects: [], // Will need to be updated after all projects are inserted
  };
}

async function migrate() {
  console.log('Starting migration...');
  console.log('Loading projects from content/projects.js...');

  const projects = await loadProjects();
  console.log(`Found ${projects.length} projects to migrate.`);

  // Check for existing projects
  const { data: existing, error: existingError } = await supabase
    .from('portfolio_projects')
    .select('slug');

  if (existingError) {
    console.error('Error checking existing projects:', existingError);
    process.exit(1);
  }

  const existingSlugs = new Set((existing || []).map(p => p.slug));

  let inserted = 0;
  let skipped = 0;
  const idMap = {}; // Map old ID to new UUID

  for (const project of projects) {
    if (existingSlugs.has(project.slug)) {
      console.log(`  Skipping "${project.title}" (already exists)`);
      skipped++;
      continue;
    }

    const transformed = transformProject(project);
    console.log(`  Migrating "${project.title}"...`);

    const { data, error } = await supabase
      .from('portfolio_projects')
      .insert(transformed)
      .select()
      .single();

    if (error) {
      console.error(`    Error inserting "${project.title}":`, error.message);
    } else {
      console.log(`    Success! ID: ${data.id}`);
      idMap[project.id] = data.id;
      inserted++;
    }
  }

  console.log('\nMigration complete!');
  console.log(`  Inserted: ${inserted}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Total: ${projects.length}`);

  // Note about related projects
  if (inserted > 0) {
    console.log('\nNote: Related projects were not linked. To link them, you would need to:');
    console.log('  1. Update each project\'s related_projects array with the new UUIDs');
    console.log('  2. Old ID to new UUID mapping:');
    for (const [oldId, newUuid] of Object.entries(idMap)) {
      console.log(`     ${oldId} -> ${newUuid}`);
    }
  }
}

migrate().catch(console.error);
