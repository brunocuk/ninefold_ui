'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPortalUser } from '@/lib/portalAuth';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Heart,
  Send,
  Share2,
  Bookmark,
  MoreHorizontal,
  Play,
  Loader2,
  X,
} from 'lucide-react';

const PLATFORM_CONFIG = {
  instagram: {
    color: '#E4405F',
    bg: '#FCE4EC',
    label: 'Instagram',
  },
  facebook: {
    color: '#1877F2',
    bg: '#E3F2FD',
    label: 'Facebook',
  },
  linkedin: {
    color: '#0A66C2',
    bg: '#E8EAF6',
    label: 'LinkedIn',
  },
  tiktok: {
    color: '#000000',
    bg: '#F5F5F5',
    label: 'TikTok',
  },
};

const STATUS_CONFIG = {
  pending: { bg: '#FEF3C7', color: '#D97706', label: 'Čeka odobrenje', icon: Clock },
  approved: { bg: '#D1FAE5', color: '#059669', label: 'Odobreno', icon: CheckCircle2 },
  revision_requested: { bg: '#FEE2E2', color: '#DC2626', label: 'Treba izmjene', icon: AlertCircle },
  published: { bg: '#E0E7FF', color: '#4F46E5', label: 'Objavljeno', icon: CheckCircle2 },
};

// Helper to parse media URLs (Google Drive, YouTube, Vimeo, direct)
const parseMediaUrl = (url) => {
  if (!url) return null;

  // Google Drive file link
  const driveFileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFileMatch) {
    return {
      type: 'drive',
      id: driveFileMatch[1],
      imageUrl: `https://drive.google.com/uc?export=view&id=${driveFileMatch[1]}`,
      embedUrl: `https://drive.google.com/file/d/${driveFileMatch[1]}/preview`,
    };
  }

  // Google Drive open link
  const driveOpenMatch = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (driveOpenMatch) {
    return {
      type: 'drive',
      id: driveOpenMatch[1],
      imageUrl: `https://drive.google.com/uc?export=view&id=${driveOpenMatch[1]}`,
      embedUrl: `https://drive.google.com/file/d/${driveOpenMatch[1]}/preview`,
    };
  }

  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (youtubeMatch) {
    return {
      type: 'youtube',
      id: youtubeMatch[1],
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
      thumbnailUrl: `https://img.youtube.com/vi/${youtubeMatch[1]}/mqdefault.jpg`,
    };
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return {
      type: 'vimeo',
      id: vimeoMatch[1],
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  // Direct URL (check if video)
  const isVideo = url.includes('.mp4') || url.includes('.mov') || url.includes('.webm');
  return {
    type: isVideo ? 'video' : 'image',
    url: url,
  };
};

export default function ContentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [content, setContent] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionFeedback, setRevisionFeedback] = useState('');
  const [approvalComment, setApprovalComment] = useState('');

  useEffect(() => {
    loadContent();
  }, [params.id]);

  const loadContent = async () => {
    const currentUser = await getPortalUser();
    setUser(currentUser);

    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !data) {
      console.error('Error loading content:', error);
    } else {
      setContent(data);

      // Fetch client data for social handles
      if (data.client_id) {
        const { data: clientData } = await supabase
          .from('clients')
          .select('company, instagram_handle, facebook_page_name, linkedin_page_name, tiktok_handle')
          .eq('id', data.client_id)
          .single();

        if (clientData) {
          setClient(clientData);
        }
      }
    }

    setLoading(false);
  };

  const handleApprove = async () => {
    setSubmitting(true);

    const { error } = await supabase
      .from('content_items')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: user?.id,
        client_feedback: approvalComment || null,
      })
      .eq('id', params.id);

    if (error) {
      console.error('Error approving:', error);
      alert('Greška pri odobravanju. Pokušajte ponovo.');
    } else {
      setContent({ ...content, status: 'approved', approved_at: new Date().toISOString() });
    }

    setSubmitting(false);
  };

  const handleRequestRevision = async () => {
    if (!revisionFeedback.trim()) {
      alert('Molimo unesite što treba izmijeniti.');
      return;
    }

    setSubmitting(true);

    const { error } = await supabase
      .from('content_items')
      .update({
        status: 'revision_requested',
        client_feedback: revisionFeedback,
      })
      .eq('id', params.id);

    if (error) {
      console.error('Error requesting revision:', error);
      alert('Greška pri slanju zahtjeva. Pokušajte ponovo.');
    } else {
      setContent({ ...content, status: 'revision_requested', client_feedback: revisionFeedback });
      setShowRevisionModal(false);
      setRevisionFeedback('');
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
        <div style={{ color: '#6B7280' }}>Učitavanje...</div>
      </div>
    );
  }

  if (!content) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#111827', marginBottom: '12px' }}>
          Sadržaj nije pronađen
        </h2>
        <Link href="/portal/content" style={{ color: '#00cc76', fontWeight: '600' }}>
          ← Natrag na sadržaj
        </Link>
      </div>
    );
  }

  // Support both platforms array and legacy platform field
  const contentPlatforms = content.platforms?.length > 0
    ? content.platforms
    : (content.platform ? [content.platform] : ['instagram']);
  const status = STATUS_CONFIG[content.status] || STATUS_CONFIG.pending;
  const StatusIcon = status.icon;

  const mediaUrl = content.media_urls?.[0];
  const parsedMedia = parseMediaUrl(mediaUrl);
  const isCarousel = content.content_type === 'carousel' && content.media_urls?.length > 1;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Link
          href="/portal/content"
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
          Natrag na sadržaj
        </Link>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '16px',
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
              flexWrap: 'wrap',
            }}>
              {contentPlatforms.map((p) => {
                const pConfig = PLATFORM_CONFIG[p] || PLATFORM_CONFIG.instagram;
                return (
                  <span
                    key={p}
                    style={{
                      background: pConfig.bg,
                      color: pConfig.color,
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                    }}
                  >
                    {pConfig.label}
                  </span>
                );
              })}
              <span style={{
                color: '#6B7280',
                fontSize: '0.9rem',
                textTransform: 'capitalize',
              }}>
                {content.content_type}
              </span>
            </div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#111827',
            }}>
              Pregled sadržaja
            </h1>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: status.bg,
            color: status.color,
            borderRadius: '10px',
            fontSize: '0.9rem',
            fontWeight: '600',
          }}>
            <StatusIcon size={18} />
            {status.label}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '24px',
      }}>
        {/* Platform Mockup */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '16px',
          }}>
            {contentPlatforms.length > 1 ? 'Pregledi po platformama' : `Pregled na ${PLATFORM_CONFIG[contentPlatforms[0]]?.label || 'platformi'}`}
          </h3>

          {/* Instagram Style Mockup */}
          {contentPlatforms.includes('instagram') && (
            <>
            {contentPlatforms.length > 1 && (
              <div style={{ textAlign: 'center', marginBottom: '12px', marginTop: '8px' }}>
                <span style={{ background: '#FCE4EC', color: '#E4405F', padding: '4px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600' }}>Instagram</span>
              </div>
            )}
            <div style={{
              maxWidth: '340px',
              margin: '0 auto',
              background: '#fff',
              border: '1px solid #DBDBDB',
              borderRadius: '8px',
              overflow: 'hidden',
            }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px',
                borderBottom: '1px solid #EFEFEF',
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00ff94 0%, #00cc76 100%)',
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{client?.instagram_handle || client?.company || 'Account'}</div>
                </div>
                <MoreHorizontal size={20} style={{ color: '#262626' }} />
              </div>

              {/* Media */}
              <div style={{
                position: 'relative',
                aspectRatio: '1',
                background: '#000',
              }}>
                {parsedMedia ? (
                  parsedMedia.type === 'drive' ? (
                    <iframe
                      src={parsedMedia.embedUrl}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      allow="autoplay"
                    />
                  ) : parsedMedia.type === 'youtube' ? (
                    <iframe
                      src={parsedMedia.embedUrl}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : parsedMedia.type === 'vimeo' ? (
                    <iframe
                      src={parsedMedia.embedUrl}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      allow="autoplay; fullscreen"
                      allowFullScreen
                    />
                  ) : parsedMedia.type === 'video' ? (
                    <video
                      src={parsedMedia.url}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      controls
                    />
                  ) : (
                    <img
                      src={parsedMedia.url}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#F5F5F5',
                    color: '#9CA3AF',
                  }}>
                    Nema medija
                  </div>
                )}
                {isCarousel && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                  }}>
                    1/{content.media_urls.length}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ padding: '12px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '10px',
                }}>
                  <Heart size={24} style={{ color: '#262626' }} />
                  <MessageSquare size={24} style={{ color: '#262626' }} />
                  <Send size={24} style={{ color: '#262626' }} />
                  <div style={{ flex: 1 }} />
                  <Bookmark size={24} style={{ color: '#262626' }} />
                </div>

                <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
                  123 sviđanja
                </div>

                <div style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                  <span style={{ fontWeight: '600' }}>{client?.instagram_handle || client?.company || 'Account'}</span>{' '}
                  {content.caption}
                </div>

                {content.hashtags?.length > 0 && (
                  <div style={{ fontSize: '0.85rem', color: '#00376B', marginTop: '4px' }}>
                    {content.hashtags.map((tag) => `#${tag}`).join(' ')}
                  </div>
                )}
              </div>
            </div>
            </>
          )}

          {/* Facebook Style Mockup */}
          {contentPlatforms.includes('facebook') && (
            <>
            {contentPlatforms.length > 1 && (
              <div style={{ textAlign: 'center', marginBottom: '12px', marginTop: '24px' }}>
                <span style={{ background: '#E3F2FD', color: '#1877F2', padding: '4px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600' }}>Facebook</span>
              </div>
            )}
            <div style={{
              maxWidth: '500px',
              margin: '0 auto',
              background: '#fff',
              border: '1px solid #E4E6EB',
              borderRadius: '8px',
              overflow: 'hidden',
            }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px',
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00ff94 0%, #00cc76 100%)',
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600' }}>{client?.facebook_page_name || client?.company || 'Page'}</div>
                  <div style={{ fontSize: '0.75rem', color: '#65676B' }}>
                    {new Date(content.scheduled_date).toLocaleDateString('hr-HR')} · 🌐
                  </div>
                </div>
                <MoreHorizontal size={20} style={{ color: '#65676B' }} />
              </div>

              {/* Caption */}
              {content.caption && (
                <div style={{ padding: '0 12px 12px', fontSize: '0.95rem', lineHeight: '1.4' }}>
                  {content.caption}
                  {content.hashtags?.length > 0 && (
                    <span style={{ color: '#1877F2' }}>
                      {' '}{content.hashtags.map((tag) => `#${tag}`).join(' ')}
                    </span>
                  )}
                </div>
              )}

              {/* Media */}
              {parsedMedia && (
                <div style={{
                  aspectRatio: '16/9',
                  background: '#000',
                }}>
                  {parsedMedia.type === 'drive' ? (
                    <iframe
                      src={parsedMedia.embedUrl}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      allow="autoplay"
                    />
                  ) : parsedMedia.type === 'youtube' ? (
                    <iframe
                      src={parsedMedia.embedUrl}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : parsedMedia.type === 'vimeo' ? (
                    <iframe
                      src={parsedMedia.embedUrl}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      allow="autoplay; fullscreen"
                      allowFullScreen
                    />
                  ) : parsedMedia.type === 'video' ? (
                    <video
                      src={parsedMedia.url}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      controls
                    />
                  ) : (
                    <img
                      src={parsedMedia.url}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}
                </div>
              )}

              {/* Reactions */}
              <div style={{
                padding: '12px',
                borderTop: '1px solid #E4E6EB',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#65676B',
                fontSize: '0.9rem',
              }}>
                <div>👍 ❤️ 42</div>
                <div>5 komentara · 2 dijeljenja</div>
              </div>
            </div>
            </>
          )}

          {/* LinkedIn Style Mockup */}
          {contentPlatforms.includes('linkedin') && (
            <>
            {contentPlatforms.length > 1 && (
              <div style={{ textAlign: 'center', marginBottom: '12px', marginTop: '24px' }}>
                <span style={{ background: '#E8EAF6', color: '#0A66C2', padding: '4px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600' }}>LinkedIn</span>
              </div>
            )}
            <div style={{
              maxWidth: '500px',
              margin: '0 auto',
              background: '#fff',
              border: '1px solid #E0E0E0',
              borderRadius: '8px',
              overflow: 'hidden',
            }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '16px',
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00ff94 0%, #00cc76 100%)',
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#000' }}>{client?.linkedin_page_name || client?.company || 'Company'}</div>
                  <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '2px' }}>
                    {client?.company || ''}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#999' }}>
                    {new Date(content.scheduled_date).toLocaleDateString('hr-HR')} · 🌐
                  </div>
                </div>
              </div>

              {/* Caption */}
              {content.caption && (
                <div style={{ padding: '0 16px 16px', fontSize: '0.9rem', lineHeight: '1.5', color: '#333' }}>
                  {content.caption}
                  {content.hashtags?.length > 0 && (
                    <div style={{ color: '#0A66C2', marginTop: '8px' }}>
                      {content.hashtags.map((tag) => `#${tag}`).join(' ')}
                    </div>
                  )}
                </div>
              )}

              {/* Media */}
              {parsedMedia && (
                <div style={{
                  aspectRatio: '16/9',
                  background: '#000',
                }}>
                  {parsedMedia.type === 'drive' ? (
                    <iframe
                      src={parsedMedia.embedUrl}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      allow="autoplay"
                    />
                  ) : parsedMedia.type === 'youtube' ? (
                    <iframe
                      src={parsedMedia.embedUrl}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : parsedMedia.type === 'vimeo' ? (
                    <iframe
                      src={parsedMedia.embedUrl}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      allow="autoplay; fullscreen"
                      allowFullScreen
                    />
                  ) : parsedMedia.type === 'video' ? (
                    <video
                      src={parsedMedia.url}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      controls
                    />
                  ) : (
                    <img
                      src={parsedMedia.url}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}
                </div>
              )}

              {/* Engagement */}
              <div style={{
                padding: '12px 16px',
                borderTop: '1px solid #E0E0E0',
                color: '#666',
                fontSize: '0.8rem',
              }}>
                👍 ❤️ 🎉 28 · 4 komentara
              </div>
            </div>
            </>
          )}

          {/* TikTok Style Mockup */}
          {contentPlatforms.includes('tiktok') && (
            <>
            {contentPlatforms.length > 1 && (
              <div style={{ textAlign: 'center', marginBottom: '12px', marginTop: '24px' }}>
                <span style={{ background: '#F5F5F5', color: '#000000', padding: '4px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600' }}>TikTok</span>
              </div>
            )}
            <div style={{
              maxWidth: '300px',
              margin: '0 auto',
              background: '#000',
              borderRadius: '12px',
              overflow: 'hidden',
              aspectRatio: '9/16',
              position: 'relative',
            }}>
              {/* Media */}
              {parsedMedia ? (
                parsedMedia.type === 'drive' ? (
                  <iframe
                    src={parsedMedia.embedUrl}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    allow="autoplay"
                  />
                ) : parsedMedia.type === 'youtube' ? (
                  <iframe
                    src={parsedMedia.embedUrl}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : parsedMedia.type === 'vimeo' ? (
                  <iframe
                    src={parsedMedia.embedUrl}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  />
                ) : parsedMedia.type === 'video' ? (
                  <video
                    src={parsedMedia.url}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    controls
                  />
                ) : (
                  <img
                    src={parsedMedia.url}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666',
                }}>
                  Nema medija
                </div>
              )}

              {/* Overlay */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '80px 12px 16px',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                color: '#fff',
              }}>
                <div style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
                  @{client?.tiktok_handle || client?.company?.toLowerCase().replace(/\s+/g, '') || 'account'}
                </div>
                <div style={{ fontSize: '0.85rem', lineHeight: '1.4', opacity: 0.9 }}>
                  {content.caption?.slice(0, 100)}
                  {content.caption?.length > 100 && '...'}
                </div>
                {content.hashtags?.length > 0 && (
                  <div style={{ fontSize: '0.8rem', color: '#FE2C55', marginTop: '6px' }}>
                    {content.hashtags.slice(0, 3).map((tag) => `#${tag}`).join(' ')}
                  </div>
                )}
              </div>

              {/* Right sidebar icons */}
              <div style={{
                position: 'absolute',
                right: '8px',
                bottom: '100px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                alignItems: 'center',
              }}>
                <div style={{ textAlign: 'center', color: '#fff' }}>
                  <Heart size={28} />
                  <div style={{ fontSize: '0.7rem', marginTop: '4px' }}>2.3K</div>
                </div>
                <div style={{ textAlign: 'center', color: '#fff' }}>
                  <MessageSquare size={28} />
                  <div style={{ fontSize: '0.7rem', marginTop: '4px' }}>89</div>
                </div>
                <div style={{ textAlign: 'center', color: '#fff' }}>
                  <Share2 size={28} />
                  <div style={{ fontSize: '0.7rem', marginTop: '4px' }}>12</div>
                </div>
              </div>
            </div>
            </>
          )}
        </div>

        {/* Details & Actions */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}>
          {/* Schedule Info */}
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '16px',
            }}>
              Detalji objave
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                background: '#F9FAFB',
                borderRadius: '10px',
              }}>
                <Calendar size={20} style={{ color: '#00cc76' }} />
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>Datum objave</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#111827' }}>
                    {new Date(content.scheduled_date).toLocaleDateString('hr-HR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </div>

              {content.scheduled_time && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  background: '#F9FAFB',
                  borderRadius: '10px',
                }}>
                  <Clock size={20} style={{ color: '#00cc76' }} />
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>Vrijeme</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#111827' }}>
                      {content.scheduled_time.slice(0, 5)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Caption */}
          {content.caption && (
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '12px',
              }}>
                Tekst objave
              </h3>
              <p style={{
                fontSize: '0.95rem',
                lineHeight: '1.6',
                color: '#374151',
                whiteSpace: 'pre-wrap',
              }}>
                {content.caption}
              </p>

              {content.hashtags?.length > 0 && (
                <div style={{
                  marginTop: '12px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                }}>
                  {content.hashtags.map((tag, i) => (
                    <span key={i} style={{
                      padding: '4px 10px',
                      background: '#E0E7FF',
                      color: '#4F46E5',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                    }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Previous Feedback */}
          {content.client_feedback && content.status !== 'pending' && (
            <div style={{
              background: content.status === 'revision_requested' ? '#FEF2F2' : '#F0FDF4',
              borderRadius: '16px',
              padding: '24px',
              border: `1px solid ${content.status === 'revision_requested' ? '#FECACA' : '#BBF7D0'}`,
            }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '12px',
              }}>
                {content.status === 'revision_requested' ? 'Vaš feedback' : 'Vaš komentar'}
              </h3>
              <p style={{
                fontSize: '0.95rem',
                lineHeight: '1.6',
                color: '#374151',
              }}>
                {content.client_feedback}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {content.status === 'pending' && (
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '12px',
              }}>
                Odobrenje
              </h3>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  color: '#6B7280',
                  marginBottom: '8px',
                }}>
                  Komentar (opcionalno)
                </label>
                <textarea
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  placeholder="Npr. Super, idemo s time!"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    resize: 'vertical',
                    outline: 'none',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#00ff94'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
              }}>
                <button
                  onClick={handleApprove}
                  disabled={submitting}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '14px 20px',
                    background: 'linear-gradient(135deg, #00ff94 0%, #00cc76 100%)',
                    color: '#000',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.7 : 1,
                    boxShadow: '0 4px 14px rgba(0, 255, 148, 0.3)',
                  }}
                >
                  {submitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={18} />
                  )}
                  Odobri
                </button>

                <button
                  onClick={() => setShowRevisionModal(true)}
                  disabled={submitting}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '14px 20px',
                    background: '#FEF2F2',
                    color: '#DC2626',
                    border: '2px solid #FECACA',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.7 : 1,
                  }}
                >
                  <AlertCircle size={18} />
                  Zatraži izmjene
                </button>
              </div>
            </div>
          )}

          {/* Already approved/rejected message */}
          {content.status === 'approved' && (
            <div style={{
              background: '#F0FDF4',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #BBF7D0',
              textAlign: 'center',
            }}>
              <CheckCircle2 size={40} style={{ color: '#059669', marginBottom: '12px' }} />
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '700',
                color: '#059669',
                marginBottom: '8px',
              }}>
                Sadržaj odobren
              </h3>
              <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>
                Odobreno {content.approved_at && new Date(content.approved_at).toLocaleDateString('hr-HR')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Revision Modal */}
      {showRevisionModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#111827',
              }}>
                Zatraži izmjene
              </h3>
              <button
                onClick={() => setShowRevisionModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9CA3AF',
                  padding: '4px',
                }}
              >
                <X size={24} />
              </button>
            </div>

            <p style={{
              fontSize: '0.95rem',
              color: '#6B7280',
              marginBottom: '20px',
            }}>
              Opišite što treba promijeniti kako bismo mogli brzo ažurirati sadržaj.
            </p>

            <textarea
              value={revisionFeedback}
              onChange={(e) => setRevisionFeedback(e.target.value)}
              placeholder="Npr. Molim promijenite fotografiju, tekst je ok..."
              rows={5}
              style={{
                width: '100%',
                padding: '14px',
                border: '2px solid #E5E7EB',
                borderRadius: '12px',
                fontSize: '0.95rem',
                resize: 'vertical',
                outline: 'none',
                marginBottom: '20px',
              }}
              onFocus={(e) => e.target.style.borderColor = '#DC2626'}
              onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
            />

            <div style={{
              display: 'flex',
              gap: '12px',
            }}>
              <button
                onClick={() => setShowRevisionModal(false)}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: '#F3F4F6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Odustani
              </button>
              <button
                onClick={handleRequestRevision}
                disabled={submitting || !revisionFeedback.trim()}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px',
                  background: '#DC2626',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  cursor: submitting || !revisionFeedback.trim() ? 'not-allowed' : 'pointer',
                  opacity: submitting || !revisionFeedback.trim() ? 0.6 : 1,
                }}
              >
                {submitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  'Pošalji zahtjev'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
