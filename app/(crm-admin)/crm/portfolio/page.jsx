// app/(crm-admin)/crm/portfolio/page.jsx
// Portfolio CMS Dashboard

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

const PROJECT_TYPES = {
  all: { label: 'Svi', color: '#00FF94' },
  video_production: { label: 'Video', color: '#E4405F' },
  social_media: { label: 'Social Media', color: '#1877F2' },
  web_development: { label: 'Web', color: '#00FF94' },
  web_app: { label: 'Web App', color: '#8b5cf6' },
  mobile_app: { label: 'Mobile App', color: '#FF6B6B' }
};

const STATUS_BADGES = {
  published: { label: 'Objavljeno', bg: '#00FF94', color: '#000' },
  draft: { label: 'Nacrt', bg: '#6b7280', color: '#fff' }
};

export default function PortfolioPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadProjects();
  }, [filter]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('portfolio_projects')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('project_type', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeStats = () => {
    const stats = { all: 0, video_production: 0, social_media: 0, web_development: 0, web_app: 0, mobile_app: 0 };
    for (const project of projects) {
      stats[project.project_type] = (stats[project.project_type] || 0) + 1;
      stats.all++;
    }
    return stats;
  };

  const toggleFeatured = async (id, currentValue) => {
    try {
      const { error } = await supabase
        .from('portfolio_projects')
        .update({ featured: !currentValue })
        .eq('id', id);

      if (error) throw error;
      setProjects(projects.map(p => p.id === id ? { ...p, featured: !currentValue } : p));
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  const togglePublished = async (id, currentValue) => {
    try {
      const { error } = await supabase
        .from('portfolio_projects')
        .update({ published: !currentValue })
        .eq('id', id);

      if (error) throw error;
      setProjects(projects.map(p => p.id === id ? { ...p, published: !currentValue } : p));
    } catch (error) {
      console.error('Error toggling published:', error);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Jeste li sigurni da želite obrisati "${title}"?`)) return;

    try {
      const { error } = await supabase
        .from('portfolio_projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Greška pri brisanju projekta');
    }
  };

  const typeStats = getTypeStats();
  const publishedCount = projects.filter(p => p.published).length;
  const featuredCount = projects.filter(p => p.featured).length;

  return (
    <>
      <style jsx global>{`
        .portfolio-page {
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .header {
          margin-bottom: 40px;
        }

        h1 {
          font-size: 2.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #00FF94 0%, #00CC76 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 10px;
        }

        .header-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .btn-primary {
          background: #00FF94;
          color: #000;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 700;
          transition: all 0.3s;
          display: inline-block;
        }

        .btn-primary:hover {
          box-shadow: 0 0 20px rgba(0, 255, 148, 0.4);
          transform: translateY(-2px);
        }

        /* Stats Cards */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 12px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          transition: all 0.3s;
          cursor: pointer;
          text-align: center;
        }

        .stat-card:hover {
          border-color: #00FF94;
          transform: translateY(-2px);
        }

        .stat-card.active {
          border-color: #00FF94;
          background: rgba(0, 255, 148, 0.05);
        }

        .stat-label {
          font-size: 0.75rem;
          color: #666;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 900;
          color: #00FF94;
          line-height: 1;
        }

        /* Summary Stats */
        .summary-stats {
          display: flex;
          gap: 24px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .summary-stat {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #888;
          font-size: 0.9rem;
        }

        .summary-stat span {
          color: #fff;
          font-weight: 700;
        }

        /* Projects Grid */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .project-card {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s;
        }

        .project-card:hover {
          border-color: #00FF94;
          transform: translateY(-4px);
        }

        .project-thumbnail {
          position: relative;
          aspect-ratio: 16 / 9;
          background: #222;
          overflow: hidden;
        }

        .project-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .project-badges {
          position: absolute;
          top: 12px;
          left: 12px;
          display: flex;
          gap: 6px;
        }

        .type-badge {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .featured-star {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid #333;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .featured-star:hover {
          background: rgba(0, 0, 0, 0.8);
          border-color: #FFD700;
        }

        .featured-star.active {
          background: #FFD700;
          border-color: #FFD700;
        }

        .featured-star svg {
          width: 16px;
          height: 16px;
        }

        .project-content {
          padding: 20px;
        }

        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 12px;
          gap: 12px;
        }

        .project-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
          margin: 0;
          line-height: 1.3;
        }

        .status-badge {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s;
        }

        .status-badge:hover {
          opacity: 0.8;
        }

        .project-client {
          font-size: 0.85rem;
          color: #888;
          margin-bottom: 12px;
        }

        .project-meta {
          display: flex;
          gap: 16px;
          font-size: 0.8rem;
          color: #666;
          padding-top: 12px;
          border-top: 1px solid #333;
          margin-bottom: 16px;
        }

        .project-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .btn-small {
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          border: 1px solid transparent;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
        }

        .btn-small svg {
          flex-shrink: 0;
          width: 14px;
          height: 14px;
        }

        .btn-view {
          background: rgba(0, 255, 148, 0.15);
          color: #00FF94;
          border-color: rgba(0, 255, 148, 0.3);
        }

        .btn-view:hover {
          background: rgba(0, 255, 148, 0.25);
          border-color: rgba(0, 255, 148, 0.5);
        }

        .btn-edit {
          background: rgba(59, 130, 246, 0.15);
          color: #3b82f6;
          border-color: rgba(59, 130, 246, 0.3);
        }

        .btn-edit:hover {
          background: rgba(59, 130, 246, 0.25);
          border-color: rgba(59, 130, 246, 0.5);
        }

        .btn-preview {
          background: rgba(139, 92, 246, 0.15);
          color: #8b5cf6;
          border-color: rgba(139, 92, 246, 0.3);
        }

        .btn-preview:hover {
          background: rgba(139, 92, 246, 0.25);
          border-color: rgba(139, 92, 246, 0.5);
        }

        .btn-delete {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.3);
        }

        .btn-delete:hover {
          background: rgba(239, 68, 68, 0.25);
          border-color: rgba(239, 68, 68, 0.5);
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: #1a1a1a;
          border: 2px dashed #333;
          border-radius: 12px;
        }

        .empty-state h2 {
          font-size: 1.8rem;
          margin-bottom: 15px;
          color: white;
        }

        .empty-state p {
          color: #888;
          margin-bottom: 25px;
          font-size: 1.1rem;
        }

        .loading {
          text-align: center;
          padding: 60px;
          font-size: 1.2rem;
          color: #00FF94;
        }

        .no-thumbnail {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #666;
        }
      `}</style>

      <div className="portfolio-page">
        <div className="header">
          <h1>Portfolio</h1>
          <p style={{ color: '#888' }}>Upravljajte radovima na web stranici</p>

          <div className="header-actions">
            <div></div>
            <Link href="/crm/portfolio/new" className="btn-primary">
              + Novi Projekt
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="stats-grid">
          {Object.entries(PROJECT_TYPES).map(([key, { label, color }]) => (
            <div
              key={key}
              className={`stat-card ${filter === key ? 'active' : ''}`}
              onClick={() => setFilter(key)}
            >
              <div className="stat-label">{label}</div>
              <div className="stat-value" style={{ color }}>
                {key === 'all' ? projects.length : typeStats[key] || 0}
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="summary-stats">
          <div className="summary-stat">
            Objavljeno: <span>{publishedCount}</span>
          </div>
          <div className="summary-stat">
            Istaknuto: <span>{featuredCount}</span>
          </div>
          <div className="summary-stat">
            Nacrti: <span>{projects.length - publishedCount}</span>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="loading">Učitavanje projekata...</div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#00FF94" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '20px' }}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <h2>Nema projekata</h2>
            <p>Dodajte prvi projekt u portfolio.</p>
            <Link href="/crm/portfolio/new" className="btn-primary">
              Dodaj Prvi Projekt
            </Link>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => {
              const typeStyle = PROJECT_TYPES[project.project_type] || PROJECT_TYPES.web_development;
              const statusStyle = project.published ? STATUS_BADGES.published : STATUS_BADGES.draft;

              return (
                <div key={project.id} className="project-card">
                  <div className="project-thumbnail">
                    {project.featured_image ? (
                      <img src={project.featured_image} alt={project.title} />
                    ) : (
                      <div className="no-thumbnail">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                    )}
                    <div className="project-badges">
                      <span
                        className="type-badge"
                        style={{ background: typeStyle.color, color: '#000' }}
                      >
                        {typeStyle.label}
                      </span>
                    </div>
                    <button
                      className={`featured-star ${project.featured ? 'active' : ''}`}
                      onClick={() => toggleFeatured(project.id, project.featured)}
                      title={project.featured ? 'Ukloni iz istaknutih' : 'Označi kao istaknuto'}
                    >
                      <svg viewBox="0 0 24 24" fill={project.featured ? '#000' : 'none'} stroke={project.featured ? '#000' : '#FFD700'} strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                  </div>

                  <div className="project-content">
                    <div className="project-header">
                      <h3 className="project-title">{project.title}</h3>
                      <span
                        className="status-badge"
                        style={{ background: statusStyle.bg, color: statusStyle.color }}
                        onClick={() => togglePublished(project.id, project.published)}
                        title={project.published ? 'Klikni za skrivanje' : 'Klikni za objavljivanje'}
                      >
                        {statusStyle.label}
                      </span>
                    </div>

                    <div className="project-client">{project.client_name}</div>

                    <div className="project-meta">
                      {project.year && <span>{project.year}</span>}
                      {project.duration && <span>{project.duration}</span>}
                    </div>

                    <div className="project-actions">
                      <Link href={`/crm/portfolio/${project.id}`} className="btn-small btn-view">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        Pregledaj
                      </Link>
                      <Link href={`/crm/portfolio/${project.id}?edit=true`} className="btn-small btn-edit">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Uredi
                      </Link>
                      {project.published && (
                        <a
                          href={`/work/${project.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-small btn-preview"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                          Vidi
                        </a>
                      )}
                      <button
                        className="btn-small btn-delete"
                        onClick={() => handleDelete(project.id, project.title)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                        Obriši
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
