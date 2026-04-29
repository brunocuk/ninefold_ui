'use client';

import { useEffect, useState } from 'react';
import { getPortalUser } from '@/lib/portalAuth';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
  FileEdit,
  Plus,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  ExternalLink,
  Calendar,
  Filter,
} from 'lucide-react';

const STATUS_CONFIG = {
  submitted: { bg: '#FEF3C7', color: '#D97706', label: 'Poslano', icon: Clock },
  in_review: { bg: '#DBEAFE', color: '#2563EB', label: 'Na pregledu', icon: Eye },
  in_progress: { bg: '#E0E7FF', color: '#4F46E5', label: 'U obradi', icon: Clock },
  completed: { bg: '#D1FAE5', color: '#059669', label: 'Završeno', icon: CheckCircle2 },
  declined: { bg: '#FEE2E2', color: '#DC2626', label: 'Odbijeno', icon: AlertCircle },
};

const PRIORITY_CONFIG = {
  low: { bg: '#F3F4F6', color: '#6B7280', label: 'Nisko' },
  normal: { bg: '#DBEAFE', color: '#2563EB', label: 'Normalno' },
  high: { bg: '#FEF3C7', color: '#D97706', label: 'Visoko' },
  urgent: { bg: '#FEE2E2', color: '#DC2626', label: 'Hitno' },
};

export default function RequestsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    const currentUser = await getPortalUser();
    setUser(currentUser);

    if (!currentUser?.client_id) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('website_change_requests')
      .select('*')
      .eq('client_id', currentUser.client_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading requests:', error);
    } else {
      setRequests(data || []);
    }

    setLoading(false);
  };

  const filteredRequests = requests.filter((request) => {
    if (filterStatus !== 'all' && request.status !== filterStatus) return false;
    if (searchTerm && !request.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const openRequests = requests.filter((r) => ['submitted', 'in_review', 'in_progress'].includes(r.status)).length;

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
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <div>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: '800',
            color: '#111827',
            marginBottom: '4px',
          }}>
            Zahtjevi za izmjene
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>
            Pošaljite zahtjev za izmjenu na vašem webu
          </p>
        </div>

        <Link href="/portal/requests/new" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 20px',
          background: 'linear-gradient(135deg, #00ff94 0%, #00cc76 100%)',
          color: '#000',
          borderRadius: '10px',
          fontSize: '0.95rem',
          fontWeight: '700',
          textDecoration: 'none',
          boxShadow: '0 4px 14px rgba(0, 255, 148, 0.3)',
        }}>
          <Plus size={18} />
          Novi zahtjev
        </Link>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <div style={{
          background: '#fff',
          borderRadius: '14px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: '800',
            color: '#111827',
            marginBottom: '4px',
          }}>
            {requests.length}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>
            Ukupno
          </div>
        </div>

        <div style={{
          background: '#fff',
          borderRadius: '14px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: '800',
            color: '#D97706',
            marginBottom: '4px',
          }}>
            {openRequests}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>
            Aktivnih
          </div>
        </div>

        <div style={{
          background: '#fff',
          borderRadius: '14px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: '800',
            color: '#059669',
            marginBottom: '4px',
          }}>
            {requests.filter((r) => r.status === 'completed').length}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>
            Završenih
          </div>
        </div>
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
            placeholder="Pretraži zahtjeve..."
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
          <option value="submitted">Poslano</option>
          <option value="in_review">Na pregledu</option>
          <option value="in_progress">U obradi</option>
          <option value="completed">Završeno</option>
          <option value="declined">Odbijeno</option>
        </select>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '60px 20px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}>
          <FileEdit size={48} style={{ color: '#D1D5DB', marginBottom: '16px' }} />
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '8px',
          }}>
            {searchTerm || filterStatus !== 'all' ? 'Nema rezultata' : 'Nema zahtjeva'}
          </h3>
          <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '20px' }}>
            {searchTerm || filterStatus !== 'all'
              ? 'Pokušajte s drugim filterima'
              : 'Pošaljite prvi zahtjev za izmjenu'}
          </p>
          {!searchTerm && filterStatus === 'all' && (
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
            }}>
              <Plus size={18} />
              Novi zahtjev
            </Link>
          )}
        </div>
      ) : (
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
        }}>
          {filteredRequests.map((request, index) => {
            const status = STATUS_CONFIG[request.status] || STATUS_CONFIG.submitted;
            const priority = PRIORITY_CONFIG[request.priority] || PRIORITY_CONFIG.normal;
            const StatusIcon = status.icon;

            return (
              <div
                key={request.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  padding: '20px 24px',
                  borderBottom: index < filteredRequests.length - 1 ? '1px solid #F3F4F6' : 'none',
                  transition: 'background 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {/* Icon */}
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: status.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <StatusIcon size={22} style={{ color: status.color }} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '6px',
                    flexWrap: 'wrap',
                  }}>
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#111827',
                    }}>
                      {request.title}
                    </h3>
                    <span style={{
                      padding: '2px 8px',
                      background: priority.bg,
                      color: priority.color,
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                    }}>
                      {priority.label}
                    </span>
                  </div>

                  <p style={{
                    fontSize: '0.9rem',
                    color: '#6B7280',
                    lineHeight: '1.4',
                    marginBottom: '10px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}>
                    {request.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    flexWrap: 'wrap',
                  }}>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      background: status.bg,
                      color: status.color,
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                    }}>
                      {status.label}
                    </span>

                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.8rem',
                      color: '#9CA3AF',
                    }}>
                      <Calendar size={14} />
                      {new Date(request.created_at).toLocaleDateString('hr-HR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>

                    {request.page_url && (
                      <a
                        href={request.page_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.8rem',
                          color: '#00cc76',
                          textDecoration: 'none',
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={14} />
                        Stranica
                      </a>
                    )}
                  </div>

                  {/* Admin Notes */}
                  {request.admin_notes && (
                    <div style={{
                      marginTop: '12px',
                      padding: '12px',
                      background: '#F0FDF4',
                      borderRadius: '8px',
                      borderLeft: '3px solid #00ff94',
                    }}>
                      <div style={{
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#059669',
                        marginBottom: '4px',
                      }}>
                        Odgovor tima:
                      </div>
                      <p style={{
                        fontSize: '0.85rem',
                        color: '#374151',
                        lineHeight: '1.4',
                      }}>
                        {request.admin_notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
