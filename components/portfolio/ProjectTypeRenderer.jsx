// components/portfolio/ProjectTypeRenderer.jsx
// Switch component that renders type-specific content based on project_type

'use client';

import VideoProductionDetails from './VideoProductionDetails';
import SocialMediaDetails from './SocialMediaDetails';
import AppStoreLinks from './AppStoreLinks';

export default function ProjectTypeRenderer({ project, shouldReduceAnimations, shouldDisableHover }) {
  const { project_type, type_data } = project;

  if (!type_data || Object.keys(type_data).length === 0) {
    return null;
  }

  switch (project_type) {
    case 'video_production':
      return (
        <VideoProductionDetails
          typeData={type_data}
          shouldReduceAnimations={shouldReduceAnimations}
          shouldDisableHover={shouldDisableHover}
        />
      );

    case 'social_media':
      return (
        <SocialMediaDetails
          typeData={type_data}
          shouldReduceAnimations={shouldReduceAnimations}
          shouldDisableHover={shouldDisableHover}
        />
      );

    case 'mobile_app':
      return (
        <AppStoreLinks
          typeData={type_data}
          shouldReduceAnimations={shouldReduceAnimations}
          shouldDisableHover={shouldDisableHover}
        />
      );

    case 'web_app':
      // Web apps might have a demo URL
      if (type_data.demoUrl) {
        return (
          <section className="relative py-16 bg-[#0F0F0F]">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
              <a
                href={type_data.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white font-bold rounded-xl text-lg shadow-lg shadow-[#8b5cf6]/30 hover:shadow-xl hover:shadow-[#8b5cf6]/40 transition-all"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Try the Demo
              </a>
            </div>
          </section>
        );
      }
      return null;

    case 'web_development':
      // Lighthouse scores are handled separately in the main component
      return null;

    default:
      return null;
  }
}
