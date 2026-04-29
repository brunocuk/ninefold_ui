'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPortalUser } from '@/lib/portalAuth';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
  ArrowLeft,
  FolderKanban,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Users,
  FileText,
  ExternalLink,
} from 'lucide-react';

const STATUS_CONFIG = {
  pending: { bg: '#FEF3C7', color: '#D97706', label: 'Čeka početak' },
  active: { bg: '#DBEAFE', color: '#2563EB', label: 'U tijeku' },
  in_progress: { bg: '#DBEAFE', color: '#2563EB', label: 'U tijeku' },
  review: { bg: '#E0E7FF', color: '#4F46E5', label: 'Na pregledu' },
  completed: { bg: '#D1FAE5', color: '#059669', label: 'Završeno' },
  on_hold: { bg: '#F3F4F6', color: '#6B7280', label: 'Na čekanju' },
};

const MILESTONE_STATUS_CONFIG = {
  pending: { icon: Circle, color: '#9CA3AF' },
  in_progress: { icon: Clock, color: '#2563EB' },
  completed: { icon: CheckCircle2, color: '#059669' },
};

export default function ProjectDetailPage() {
  const params = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [changeRequests, setChangeRequests] = useState([]);

  useEffect(() => {
    loadProject();
  }, [params.id]);

  const loadProject = async () => {
    const currentUser = await getPortalUser();
    setUser(currentUser);

    // Fetch project
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .single();

    if (projectError || !projectData) {
      console.error('Error loading project:', projectError);
      setLoading(false);
      return;
    }

    setProject(projectData);

    // Fetch milestones
    const { data: milestonesData } = await supabase
      .from('project_milestones')
      .select('*')
      .eq('project_id', params.id)
      .order('sort_order', { ascending: true });

    setMilestones(milestonesData || []);

    // Fetch related change requests
    if (currentUser?.client_id) {
      const { data: requestsData } = await supabase
        .from('website_change_requests')
        .select('*')
        .eq('client_id', currentUser.client_id)
        .order('created_at', { ascending: false })
        .limit(5);

      setChangeRequests(requestsData || []);
    }

    setLoading(false);
  };

  const completedMilestones = milestones.filter((m) => m.status === 'completed').length;
  const progress = milestones.length > 0 ? (completedMilestones / milestones.length) * 100 : 0;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
        <div style={{ color: '#6B7280' }}>Učitavanje...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#111827', marginBottom: '12px' }}>
          Projekt nije pronađen
        </h2>
        <Link href="/portal/projects" style={{ color: '#00cc76', fontWeight: '600' }}>
          ← Natrag na projekte
        </Link>
      </div>
    );
  }

  const status = STATUS_CONFIG[project.status] || STATUS_CONFIG.pending;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Link
          href="/portal/projects"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#6B7280',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: '500',
            marginBottom: '16px',
          }}
        >
          <ArrowLeft size={18} />
          Natrag na projekte
        </Link>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '16px',
        }}>
          <div>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: '800',
              color: '#111827',
              marginBottom: '8px',
            }}>
              {project.name}
            </h1>
            {project.description && (
              <p style={{
                color: '#6B7280',
                fontSize: '0.95rem',
                maxWidth: '600px',
                lineHeight: '1.5',
              }}>
                {project.description}
              </p>
            )}
          </div>

          <span style={{
            padding: '10px 18px',
            background: status.bg,
            color: status.color,
            borderRadius: '10px',
            fontSize: '0.9rem',
            fontWeight: '700',
          }}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <div style={{
          background: '#fff',
          borderRadius: '14px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '12px',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(0, 255, 148, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <CheckCircle2 size={20} style={{ color: '#00cc76' }} />
            </div>
          </div>
          <div style={{
            fontSize: '1.75rem',
            fontWeight: '800',
            color: '#111827',
            lineHeight: '1',
            marginBottom: '4px',
          }}>
            {Math.round(progress)}%
          </div>
          <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>
            Napredak
          </div>
        </div>

        <div style={{
          background: '#fff',
          borderRadius: '14px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '12px',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#DBEAFE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <FolderKanban size={20} style={{ color: '#2563EB' }} />
            </div>
          </div>
          <div style={{
            fontSize: '1.75rem',
            fontWeight: '800',
            color: '#111827',
            lineHeight: '1',
            marginBottom: '4px',
          }}>
            {completedMilestones}/{milestones.length}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>
            Koraka završeno
          </div>
        </div>

        <div style={{
          background: '#fff',
          borderRadius: '14px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '12px',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#E0E7FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Calendar size={20} style={{ color: '#4F46E5' }} />
            </div>
          </div>
          <div style={{
            fontSize: '1rem',
            fontWeight: '700',
            color: '#111827',
            lineHeight: '1.3',
            marginBottom: '4px',
          }}>
            {new Date(project.created_at).toLocaleDateString('hr-HR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>
            Početak projekta
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px',
      }}>
        {/* Milestones */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}>
          <h2 style={{
            fontSize: '1.1rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <CheckCircle2 size={20} style={{ color: '#00cc76' }} />
            Koraci projekta
          </h2>

          {milestones.length === 0 ? (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#9CA3AF',
            }}>
              <FolderKanban size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
              <p style={{ fontSize: '0.9rem' }}>
                Koraci projekta će se pojaviti ovdje
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {milestones.map((milestone, index) => {
                const milestoneStatus = MILESTONE_STATUS_CONFIG[milestone.status] || MILESTONE_STATUS_CONFIG.pending;
                const StatusIcon = milestoneStatus.icon;
                const isLast = index === milestones.length - 1;

                return (
                  <div key={milestone.id} style={{ display: 'flex', gap: '14px' }}>
                    {/* Timeline */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: milestone.status === 'completed' ? '#D1FAE5' : '#F3F4F6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <StatusIcon size={18} style={{ color: milestoneStatus.color }} />
                      </div>
                      {!isLast && (
                        <div style={{
                          width: '2px',
                          flex: 1,
                          minHeight: '24px',
                          background: milestone.status === 'completed' ? '#00ff94' : '#E5E7EB',
                          margin: '6px 0',
                        }} />
                      )}
                    </div>

                    {/* Content */}
                    <div style={{
                      flex: 1,
                      paddingBottom: isLast ? 0 : '20px',
                    }}>
                      <div style={{
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        color: milestone.status === 'completed' ? '#059669' : '#111827',
                        marginBottom: '4px',
                        textDecoration: milestone.status === 'completed' ? 'line-through' : 'none',
                      }}>
                        {milestone.title}
                      </div>
                      {milestone.description && (
                        <p style={{
                          fontSize: '0.85rem',
                          color: '#6B7280',
                          lineHeight: '1.4',
                          marginBottom: '6px',
                        }}>
                          {milestone.description}
                        </p>
                      )}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '0.8rem',
                        color: '#9CA3AF',
                      }}>
                        {milestone.due_date && (
                          <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}>
                            <Calendar size={14} />
                            {new Date(milestone.due_date).toLocaleDateString('hr-HR', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        )}
                        {milestone.completed_at && (
                          <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: '#059669',
                          }}>
                            <CheckCircle2 size={14} />
                            Završeno {new Date(milestone.completed_at).toLocaleDateString('hr-HR')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions & Info */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}>
          {/* Project Info */}
          {(project.start_date || project.end_date || project.total_value) && (
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            }}>
              <h2 style={{
                fontSize: '1.1rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '16px',
              }}>
                Informacije
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {project.start_date && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    background: '#F9FAFB',
                    borderRadius: '10px',
                  }}>
                    <span style={{ fontSize: '0.9rem', color: '#6B7280' }}>Početak</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#111827' }}>
                      {new Date(project.start_date).toLocaleDateString('hr-HR')}
                    </span>
                  </div>
                )}
                {project.end_date && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    background: '#F9FAFB',
                    borderRadius: '10px',
                  }}>
                    <span style={{ fontSize: '0.9rem', color: '#6B7280' }}>Očekivani završetak</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#111827' }}>
                      {new Date(project.end_date).toLocaleDateString('hr-HR')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Related Requests */}
          {changeRequests.length > 0 && (
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}>
                <h2 style={{
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  color: '#111827',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  <FileText size={20} style={{ color: '#00cc76' }} />
                  Vaši zahtjevi
                </h2>
                <Link href="/portal/requests" style={{
                  fontSize: '0.85rem',
                  color: '#00cc76',
                  fontWeight: '600',
                  textDecoration: 'none',
                }}>
                  Vidi sve
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {changeRequests.slice(0, 3).map((request) => (
                  <Link
                    key={request.id}
                    href={`/portal/requests`}
                    style={{
                      display: 'block',
                      padding: '12px',
                      background: '#F9FAFB',
                      borderRadius: '10px',
                      textDecoration: 'none',
                    }}
                  >
                    <div style={{
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '4px',
                    }}>
                      {request.title}
                    </div>
                    <div style={{
                      fontSize: '0.8rem',
                      color: '#6B7280',
                    }}>
                      {new Date(request.created_at).toLocaleDateString('hr-HR')}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Submit Request */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(0, 255, 148, 0.1) 0%, rgba(0, 204, 118, 0.1) 100%)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(0, 255, 148, 0.3)',
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '8px',
            }}>
              Trebate izmjenu?
            </h3>
            <p style={{
              fontSize: '0.9rem',
              color: '#6B7280',
              marginBottom: '16px',
              lineHeight: '1.5',
            }}>
              Pošaljite zahtjev za izmjenu i mi ćemo ga obraditi što prije.
            </p>
            <Link href="/portal/requests/new" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #00ff94 0%, #00cc76 100%)',
              color: '#000',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: '700',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(0, 255, 148, 0.3)',
            }}>
              <FileText size={18} />
              Novi zahtjev
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
