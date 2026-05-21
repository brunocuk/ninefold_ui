'use client';

import { useEffect, useState } from 'react';
import { getPortalUser } from '@/lib/portalAuth';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';

const PLATFORM_COLORS = {
  instagram: { bg: '#FCE4EC', color: '#E4405F', label: 'Instagram' },
  facebook: { bg: '#E3F2FD', color: '#1877F2', label: 'Facebook' },
  linkedin: { bg: '#E8EAF6', color: '#0A66C2', label: 'LinkedIn' },
  tiktok: { bg: '#F5F5F5', color: '#000000', label: 'TikTok' },
};

const STATUS_STYLES = {
  pending: { bg: '#FEF3C7', color: '#D97706', label: 'Čeka odobrenje', icon: Clock },
  approved: { bg: '#D1FAE5', color: '#059669', label: 'Odobreno', icon: CheckCircle2 },
  revision_requested: { bg: '#FEE2E2', color: '#DC2626', label: 'Treba izmjene', icon: AlertCircle },
  published: { bg: '#E0E7FF', color: '#4F46E5', label: 'Objavljeno', icon: CheckCircle2 },
};

const CONTENT_TYPE_LABELS = {
  post: 'Post',
  story: 'Story',
  reel: 'Reel',
  carousel: 'Carousel',
};

// Helper to get thumbnail URL from various sources
const getThumbnailUrl = (url) => {
  if (!url) return null;

  // Google Drive
  const driveFileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFileMatch) {
    return `https://drive.google.com/uc?export=view&id=${driveFileMatch[1]}`;
  }
  const driveOpenMatch = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (driveOpenMatch) {
    return `https://drive.google.com/uc?export=view&id=${driveOpenMatch[1]}`;
  }

  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (youtubeMatch) {
    return `https://img.youtube.com/vi/${youtubeMatch[1]}/mqdefault.jpg`;
  }

  // Direct URL
  return url;
};

export default function ContentCalendarPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPlatform, setFilterPlatform] = useState('all');

  useEffect(() => {
    loadContent();
  }, [currentMonth]);

  const loadContent = async () => {
    const currentUser = await getPortalUser();
    setUser(currentUser);

    if (!currentUser?.client_id) {
      setLoading(false);
      return;
    }

    // Get first and last day of month
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('client_id', currentUser.client_id)
      .gte('scheduled_date', firstDay.toISOString().split('T')[0])
      .lte('scheduled_date', lastDay.toISOString().split('T')[0])
      .order('scheduled_date', { ascending: true });

    if (error) {
      console.error('Error loading content:', error);
    } else {
      setContent(data || []);
    }

    setLoading(false);
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = (firstDay.getDay() + 6) % 7; // Monday = 0

    const days = [];

    // Previous month's days
    for (let i = 0; i < startingDay; i++) {
      const prevMonthDay = new Date(year, month, -startingDay + i + 1);
      days.push({ date: prevMonthDay, isCurrentMonth: false });
    }

    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

    // Next month's days to fill the grid
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }

    return days;
  };

  const getContentForDate = (date) => {
    // Format as YYYY-MM-DD using local timezone (not UTC)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    return content.filter((item) => item.scheduled_date === dateStr);
  };

  const filteredContent = content.filter((item) => {
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    if (filterPlatform !== 'all' && item.platform !== filterPlatform) return false;
    return true;
  });

  const pendingCount = content.filter((c) => c.status === 'pending').length;

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
        alignItems: 'center',
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
            Sadržaj
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>
            Pregledajte i odobrite planirani sadržaj za društvene mreže
          </p>
        </div>

        {pendingCount > 0 && (
          <div style={{
            background: '#FEF3C7',
            color: '#D97706',
            padding: '10px 16px',
            borderRadius: '10px',
            fontSize: '0.9rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <Clock size={18} />
            {pendingCount} {pendingCount === 1 ? 'objava čeka' : 'objava čeka'} odobrenje
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '24px',
      }}>
        {/* Month Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <button
            onClick={() => navigateMonth(-1)}
            style={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: '10px',
              cursor: 'pointer',
              color: '#374151',
              transition: 'all 0.2s ease',
            }}
          >
            <ChevronLeft size={20} />
          </button>
          <div style={{
            fontSize: '1.1rem',
            fontWeight: '700',
            color: '#111827',
            minWidth: '160px',
            textAlign: 'center',
          }}>
            {currentMonth.toLocaleDateString('hr-HR', { month: 'long', year: 'numeric' })}
          </div>
          <button
            onClick={() => navigateMonth(1)}
            style={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: '10px',
              cursor: 'pointer',
              color: '#374151',
              transition: 'all 0.2s ease',
            }}
          >
            <ChevronRight size={20} />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            style={{
              padding: '10px 16px',
              background: '#F3F4F6',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              color: '#374151',
              fontSize: '0.9rem',
              fontWeight: '600',
            }}
          >
            Danas
          </button>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            style={{
              padding: '10px 14px',
              background: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: '10px',
              fontSize: '0.9rem',
              color: '#374151',
              cursor: 'pointer',
            }}
          >
            <option value="all">Sve platforme</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="linkedin">LinkedIn</option>
            <option value="tiktok">TikTok</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '10px 14px',
              background: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: '10px',
              fontSize: '0.9rem',
              color: '#374151',
              cursor: 'pointer',
            }}
          >
            <option value="all">Svi statusi</option>
            <option value="pending">Čeka odobrenje</option>
            <option value="approved">Odobreno</option>
            <option value="revision_requested">Treba izmjene</option>
            <option value="published">Objavljeno</option>
          </select>

          {/* View Toggle */}
          <div style={{
            display: 'flex',
            background: '#F3F4F6',
            borderRadius: '10px',
            padding: '4px',
          }}>
            <button
              onClick={() => setViewMode('calendar')}
              style={{
                padding: '8px 14px',
                background: viewMode === 'calendar' ? '#fff' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: viewMode === 'calendar' ? '#111827' : '#6B7280',
                boxShadow: viewMode === 'calendar' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <Calendar size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '8px 14px',
                background: viewMode === 'list' ? '#fff' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: viewMode === 'list' ? '#111827' : '#6B7280',
                boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              Lista
            </button>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}>
          {/* Day Headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '1px',
            marginBottom: '8px',
          }}>
            {['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned'].map((day) => (
              <div key={day} style={{
                padding: '12px',
                textAlign: 'center',
                fontSize: '0.8rem',
                fontWeight: '700',
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '1px',
            background: '#E5E7EB',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            {getDaysInMonth().map((day, index) => {
              const dayContent = getContentForDate(day.date).filter((item) => {
                if (filterStatus !== 'all' && item.status !== filterStatus) return false;
                if (filterPlatform !== 'all' && item.platform !== filterPlatform) return false;
                return true;
              });
              const isToday = day.date.toDateString() === new Date().toDateString();

              return (
                <div
                  key={index}
                  style={{
                    background: day.isCurrentMonth ? '#fff' : '#F9FAFB',
                    minHeight: '120px',
                    padding: '8px',
                  }}
                >
                  <div style={{
                    fontSize: '0.85rem',
                    fontWeight: isToday ? '700' : '500',
                    color: day.isCurrentMonth ? (isToday ? '#00cc76' : '#111827') : '#9CA3AF',
                    marginBottom: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: isToday ? '28px' : 'auto',
                    height: isToday ? '28px' : 'auto',
                    background: isToday ? 'rgba(0, 255, 148, 0.15)' : 'transparent',
                    borderRadius: '50%',
                  }}>
                    {day.date.getDate()}
                  </div>

                  {/* Content items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {dayContent.slice(0, 3).map((item) => {
                      const platform = PLATFORM_COLORS[item.platform] || PLATFORM_COLORS.instagram;
                      const status = STATUS_STYLES[item.status] || STATUS_STYLES.pending;

                      return (
                        <Link
                          key={item.id}
                          href={`/portal/content/${item.id}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 6px',
                            background: platform.bg,
                            borderRadius: '6px',
                            fontSize: '0.7rem',
                            fontWeight: '600',
                            color: platform.color,
                            textDecoration: 'none',
                            borderLeft: `3px solid ${status.color}`,
                          }}
                        >
                          <span style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            {platform.label}
                          </span>
                        </Link>
                      );
                    })}
                    {dayContent.length > 3 && (
                      <div style={{
                        fontSize: '0.7rem',
                        color: '#6B7280',
                        fontWeight: '600',
                        paddingLeft: '6px',
                      }}>
                        +{dayContent.length - 3} više
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}>
          {filteredContent.length === 0 ? (
            <div style={{
              padding: '60px 20px',
              textAlign: 'center',
              color: '#9CA3AF',
            }}>
              <Calendar size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p style={{ fontSize: '1rem', marginBottom: '8px' }}>
                Nema sadržaja za ovaj mjesec
              </p>
              <p style={{ fontSize: '0.9rem' }}>
                Planirani sadržaj će se pojaviti ovdje
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredContent.map((item) => {
                const platform = PLATFORM_COLORS[item.platform] || PLATFORM_COLORS.instagram;
                const status = STATUS_STYLES[item.status] || STATUS_STYLES.pending;
                const StatusIcon = status.icon;

                return (
                  <Link
                    key={item.id}
                    href={`/portal/content/${item.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px',
                      background: '#F9FAFB',
                      borderRadius: '12px',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      borderLeft: `4px solid ${platform.color}`,
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#F9FAFB'}
                    >
                      {/* Thumbnail */}
                      {item.media_urls?.[0] ? (
                        <div style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          flexShrink: 0,
                          background: '#E5E7EB',
                        }}>
                          <img
                            src={getThumbnailUrl(item.media_urls[0])}
                            alt=""
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        </div>
                      ) : (
                        <div style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '10px',
                          background: platform.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <span style={{
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            color: platform.color,
                          }}>
                            {platform.label.slice(0, 2)}
                          </span>
                        </div>
                      )}

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '6px',
                        }}>
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: platform.color,
                            background: platform.bg,
                            padding: '2px 8px',
                            borderRadius: '6px',
                          }}>
                            {platform.label}
                          </span>
                          <span style={{
                            fontSize: '0.75rem',
                            color: '#6B7280',
                          }}>
                            {CONTENT_TYPE_LABELS[item.content_type] || item.content_type}
                          </span>
                        </div>
                        <div style={{
                          fontSize: '0.95rem',
                          fontWeight: '600',
                          color: '#111827',
                          marginBottom: '4px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {item.caption?.slice(0, 60) || 'Bez opisa'}
                          {item.caption?.length > 60 && '...'}
                        </div>
                        <div style={{
                          fontSize: '0.85rem',
                          color: '#6B7280',
                        }}>
                          {new Date(item.scheduled_date).toLocaleDateString('hr-HR', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                          })}
                          {item.scheduled_time && ` u ${item.scheduled_time.slice(0, 5)}`}
                        </div>
                      </div>

                      {/* Status */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 14px',
                        background: status.bg,
                        color: status.color,
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        flexShrink: 0,
                      }}>
                        <StatusIcon size={16} />
                        {status.label}
                      </div>

                      {/* View Icon */}
                      <Eye size={20} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Platform Legend */}
      <div style={{
        marginTop: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        justifyContent: 'center',
      }}>
        {Object.entries(PLATFORM_COLORS).map(([key, value]) => (
          <div key={key} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            color: '#6B7280',
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '3px',
              background: value.color,
            }} />
            {value.label}
          </div>
        ))}
      </div>
    </div>
  );
}
