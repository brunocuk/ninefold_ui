// app/crm/projects/page.jsx
// Projects List - View all projects

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function ProjectsPage() {
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
        .from('projects')
        .select(`
          *,
          clients (
            name,
            company
          )
        `)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
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

  const getStatusBadge = (status) => {
    const styles = {
      planning: { bg: '#3b82f6', text: 'Planning' },
      design: { bg: '#8b5cf6', text: 'Design' },
      development: { bg: '#f59e0b', text: 'Development' },
      testing: { bg: '#06b6d4', text: 'Testing' },
      deployed: { bg: '#00FF94', text: 'Deployed' },
      completed: { bg: '#10b981', text: 'Completed' }
    };

    const style = styles[status] || styles.planning;

    return (
      <span style={{
        background: style.bg,
        color: ['deployed'].includes(status) ? '#000' : '#fff',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '0.8rem',
        fontWeight: '700'
      }}>
        {style.text}
      </span>
    );
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#00FF94';
    if (progress >= 50) return '#f59e0b';
    return '#3b82f6';
  };

  return (
    <>
      <style jsx>{`
        .projects-page {
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        h1 {
          font-size: 2.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #00FF94 0%, #00CC76 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
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

        .filters {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 10px 20px;
          border: 2px solid #333;
          background: #1a1a1a;
          color: #888;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .filter-btn:hover {
          border-color: #00FF94;
          color: #00FF94;
        }

        .filter-btn.active {
          background: #00FF94;
          color: #000;
          border-color: #00FF94;
        }

        .projects-grid {
          display: grid;
          gap: 20px;
        }

        .project-card {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 25px;
          transition: all 0.3s;
          cursor: pointer;
        }

        .project-card:hover {
          border-color: #00FF94;
          box-shadow: 0 0 20px rgba(0, 255, 148, 0.1);
          transform: translateX(5px);
        }

        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 15px;
        }

        .project-info h3 {
          font-size: 1.3rem;
          margin-bottom: 8px;
          color: white;
        }

        .client-name {
          font-size: 0.95rem;
          color: #00FF94;
          font-weight: 600;
        }

        .project-meta {
          font-size: 0.9rem;
          color: #888;
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
          margin-top: 8px;
        }

        .project-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin: 20px 0;
        }

        .detail-item {
          background: #0a0a0a;
          padding: 12px;
          border-radius: 8px;
        }

        .detail-label {
          font-size: 0.75rem;
          color: #666;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-value {
          font-size: 1rem;
          font-weight: 700;
          color: #00FF94;
        }

        .progress-bar {
          background: #0a0a0a;
          border-radius: 8px;
          height: 8px;
          overflow: hidden;
          margin-top: 15px;
        }

        .progress-fill {
          height: 100%;
          transition: width 0.3s, background 0.3s;
          border-radius: 8px;
        }

        .progress-text {
          font-size: 0.85rem;
          color: #888;
          margin-top: 5px;
          text-align: right;
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

        @media (max-width: 768px) {
          h1 {
            font-size: 2rem;
          }

          .header {
            flex-direction: column;
            gap: 20px;
            align-items: flex-start;
          }
        }
      `}</style>

      <div className="projects-page">
        <div className="header">
          <div>
            <h1>Projects</h1>
            <p style={{color: '#888', marginTop: '5px'}}>
              Track active work and deliverables
            </p>
          </div>
          <Link href="/crm/projects/new" className="btn-primary">
            + New Project
          </Link>
        </div>

        <div className="filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({projects.length})
          </button>
          <button
            className={`filter-btn ${filter === 'planning' ? 'active' : ''}`}
            onClick={() => setFilter('planning')}
          >
            📋 Planning
          </button>
          <button
            className={`filter-btn ${filter === 'design' ? 'active' : ''}`}
            onClick={() => setFilter('design')}
          >
            🎨 Design
          </button>
          <button
            className={`filter-btn ${filter === 'development' ? 'active' : ''}`}
            onClick={() => setFilter('development')}
          >
            💻 Development
          </button>
          <button
            className={`filter-btn ${filter === 'testing' ? 'active' : ''}`}
            onClick={() => setFilter('testing')}
          >
            🧪 Testing
          </button>
          <button
            className={`filter-btn ${filter === 'deployed' ? 'active' : ''}`}
            onClick={() => setFilter('deployed')}
          >
            🚀 Deployed
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <div style={{fontSize: '4rem', marginBottom: '20px'}}>🚀</div>
            <h2>No projects yet</h2>
            <p>
              {filter === 'all'
                ? "Start tracking your first project."
                : `No projects in "${filter}" status.`
              }
            </p>
            {filter === 'all' && (
              <Link href="/crm/projects/new" className="btn-primary">
                Create First Project
              </Link>
            )}
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/crm/projects/${project.id}`}
                style={{textDecoration: 'none'}}
              >
                <div className="project-card">
                  <div className="project-header">
                    <div className="project-info">
                      <h3>{project.name}</h3>
                      {project.clients && (
                        <div className="client-name">
                          🏢 {project.clients.company || project.clients.name}
                        </div>
                      )}
                      <div className="project-meta">
                        {project.project_type && <span>📦 {project.project_type}</span>}
                        {project.deadline && (
                          <span>📅 Due {new Date(project.deadline).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    {getStatusBadge(project.status)}
                  </div>

                  <div className="project-details">
                    <div className="detail-item">
                      <div className="detail-label">Total Value</div>
                      <div className="detail-value">
                        €{project.total_value.toLocaleString()}
                      </div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Paid</div>
                      <div className="detail-value">
                        €{(project.paid_amount || 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Remaining</div>
                      <div className="detail-value">
                        €{(project.total_value - (project.paid_amount || 0)).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{
                        width: `${project.progress}%`,
                        background: getProgressColor(project.progress)
                      }}
                    />
                  </div>
                  <div className="progress-text">
                    {project.progress}% complete
                  </div>

                  {project.description && (
                    <div style={{
                      color: '#aaa',
                      fontSize: '0.9rem',
                      marginTop: '15px',
                      lineHeight: '1.5'
                    }}>
                      {project.description.length > 120
                        ? project.description.substring(0, 120) + '...'
                        : project.description
                      }
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}