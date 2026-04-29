'use client';

import { useEffect, useState } from 'react';
import { getPortalUser } from '@/lib/portalAuth';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
  FolderKanban,
  Calendar,
  Clock,
  CheckCircle2,
  ArrowRight,
  Search,
} from 'lucide-react';

const STATUS_CONFIG = {
  pending: { bg: '#FEF3C7', color: '#D97706', label: 'Čeka početak' },
  active: { bg: '#DBEAFE', color: '#2563EB', label: 'U tijeku' },
  in_progress: { bg: '#DBEAFE', color: '#2563EB', label: 'U tijeku' },
  review: { bg: '#E0E7FF', color: '#4F46E5', label: 'Na pregledu' },
  completed: { bg: '#D1FAE5', color: '#059669', label: 'Završeno' },
  on_hold: { bg: '#F3F4F6', color: '#6B7280', label: 'Na čekanju' },
};

export default function ProjectsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [milestones, setMilestones] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const currentUser = await getPortalUser();
    setUser(currentUser);

    if (!currentUser?.client_id) {
      setLoading(false);
      return;
    }

    // Fetch projects
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('client_id', currentUser.client_id)
      .order('created_at', { ascending: false });

    if (projectsError) {
      console.error('Error loading projects:', projectsError);
    } else {
      setProjects(projectsData || []);

      // Fetch milestones for each project
      if (projectsData?.length > 0) {
        const projectIds = projectsData.map((p) => p.id);
        const { data: milestonesData } = await supabase
          .from('project_milestones')
          .select('*')
          .in('project_id', projectIds)
          .order('sort_order', { ascending: true });

        // Group milestones by project_id
        const grouped = {};
        (milestonesData || []).forEach((m) => {
          if (!grouped[m.project_id]) {
            grouped[m.project_id] = [];
          }
          grouped[m.project_id].push(m);
        });
        setMilestones(grouped);
      }
    }

    setLoading(false);
  };

  const filteredProjects = projects.filter((project) => {
    if (filterStatus !== 'all' && project.status !== filterStatus) return false;
    if (searchTerm && !project.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getMilestoneProgress = (projectId) => {
    const projectMilestones = milestones[projectId] || [];
    if (projectMilestones.length === 0) return null;
    const completed = projectMilestones.filter((m) => m.status === 'completed').length;
    return { completed, total: projectMilestones.length };
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
        <div style={{ color: '#6B7280' }}>Učitavanje...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: '800',
          color: '#111827',
          marginBottom: '4px',
        }}>
          Projekti
        </h1>
        <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>
          Pratite napredak vaših aktivnih projekata
        </p>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px',
      }}>
        <div style={{
          position: 'relative',
          flex: '1 1 250px',
          maxWidth: '400px',
        }}>
          <Search size={18} style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9CA3AF',
          }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pretraži projekte..."
            style={{
              width: '100%',
              padding: '12px 12px 12px 44px',
              background: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: '10px',
              fontSize: '0.95rem',
              outline: 'none',
            }}
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: '12px 16px',
            background: '#fff',
            border: '1px solid #E5E7EB',
            borderRadius: '10px',
            fontSize: '0.9rem',
            color: '#374151',
            cursor: 'pointer',
          }}
        >
          <option value="all">Svi statusi</option>
          <option value="active">U tijeku</option>
          <option value="in_progress">U tijeku</option>
          <option value="pending">Čeka početak</option>
          <option value="completed">Završeno</option>
          <option value="on_hold">Na čekanju</option>
        </select>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '60px 20px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}>
          <FolderKanban size={48} style={{ color: '#D1D5DB', marginBottom: '16px' }} />
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '8px',
          }}>
            Nema projekata
          </h3>
          <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>
            {searchTerm || filterStatus !== 'all'
              ? 'Nema rezultata za zadane filtere'
              : 'Vaši projekti će se pojaviti ovdje'}
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '20px',
        }}>
          {filteredProjects.map((project) => {
            const status = STATUS_CONFIG[project.status] || STATUS_CONFIG.pending;
            const progress = getMilestoneProgress(project.id);

            return (
              <Link
                key={project.id}
                href={`/portal/projects/${project.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: '#fff',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: '2px solid transparent',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#00ff94';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, rgba(0, 255, 148, 0.15) 0%, rgba(0, 204, 118, 0.15) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <FolderKanban size={24} style={{ color: '#00cc76' }} />
                    </div>
                    <span style={{
                      padding: '6px 12px',
                      background: status.bg,
                      color: status.color,
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                    }}>
                      {status.label}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    color: '#111827',
                    marginBottom: '8px',
                  }}>
                    {project.name}
                  </h3>

                  {project.description && (
                    <p style={{
                      fontSize: '0.9rem',
                      color: '#6B7280',
                      lineHeight: '1.5',
                      marginBottom: '16px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}>
                      {project.description}
                    </p>
                  )}

                  {/* Progress */}
                  {progress && (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                      }}>
                        <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                          Napredak
                        </span>
                        <span style={{
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          color: '#111827',
                        }}>
                          {progress.completed}/{progress.total} koraka
                        </span>
                      </div>
                      <div style={{
                        height: '8px',
                        background: '#E5E7EB',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${(progress.completed / progress.total) * 100}%`,
                          background: 'linear-gradient(90deg, #00ff94 0%, #00cc76 100%)',
                          borderRadius: '4px',
                          transition: 'width 0.3s ease',
                        }} />
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div style={{
                    marginTop: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '16px',
                    borderTop: '1px solid #F3F4F6',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.85rem',
                      color: '#9CA3AF',
                    }}>
                      <Calendar size={16} />
                      {new Date(project.created_at).toLocaleDateString('hr-HR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: '#00cc76',
                    }}>
                      Detalji
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
