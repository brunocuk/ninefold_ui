'use client';

import { useEffect, useState } from 'react';
import { getPortalUser } from '@/lib/portalAuth';
import { usePortalTheme, themes } from '@/lib/portalTheme';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
  Calendar,
  CheckCircle2,
  Clock,
  FileEdit,
  FolderKanban,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Coffee,
  PartyPopper,
  Send,
  ArrowUpRight,
  Instagram,
  Facebook,
  Linkedin,
} from 'lucide-react';

export default function PortalDashboard() {
  const { theme } = usePortalTheme();
  const t = themes[theme];

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pendingContent: 0,
    activeProjects: 0,
    openRequests: 0,
    unreadMessages: 0,
  });
  const [upcomingContent, setUpcomingContent] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [clientData, setClientData] = useState(null);

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    const currentUser = await getPortalUser();
    setUser(currentUser);

    if (!currentUser?.client_id) {
      setLoading(false);
      return;
    }

    try {
      const [contentRes, projectsRes, requestsRes, messagesRes, clientRes] = await Promise.all([
        supabase.from('content_items').select('id', { count: 'exact', head: true })
          .eq('client_id', currentUser.client_id).eq('status', 'pending'),
        supabase.from('projects').select('id', { count: 'exact', head: true })
          .eq('client_id', currentUser.client_id).in('status', ['active', 'in_progress']),
        supabase.from('website_change_requests').select('id', { count: 'exact', head: true })
          .eq('client_id', currentUser.client_id).in('status', ['submitted', 'in_review', 'in_progress']),
        supabase.from('portal_messages').select('id', { count: 'exact', head: true })
          .eq('client_id', currentUser.client_id).eq('sender_type', 'admin').is('read_at', null),
        supabase.from('clients').select('company, instagram_handle, facebook_page_name, linkedin_page_name, tiktok_handle')
          .eq('id', currentUser.client_id).single(),
      ]);

      if (clientRes.data) {
        setClientData(clientRes.data);
      }

      setStats({
        pendingContent: contentRes.count || 0,
        activeProjects: projectsRes.count || 0,
        openRequests: requestsRes.count || 0,
        unreadMessages: messagesRes.count || 0,
      });

      const today = new Date().toISOString().split('T')[0];
      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const { data: contentData } = await supabase.from('content_items')
        .select('*').eq('client_id', currentUser.client_id)
        .gte('scheduled_date', today).lte('scheduled_date', nextWeek)
        .order('scheduled_date', { ascending: true }).limit(5);

      setUpcomingContent(contentData || []);

      const { data: activityData } = await supabase.from('portal_messages')
        .select('*').eq('client_id', currentUser.client_id)
        .order('created_at', { ascending: false }).limit(5);

      setRecentActivity(activityData || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Dobro jutro';
    if (hour < 18) return 'Hej';
    return 'Dobra večer';
  };

  const getPlatformColor = (platform) => {
    const colors = { instagram: '#E4405F', facebook: '#1877F2', linkedin: '#0A66C2', tiktok: '#000' };
    return colors[platform] || '#6e6e73';
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === today.toDateString()) return 'Danas';
    if (date.toDateString() === tomorrow.toDateString()) return 'Sutra';
    return date.toLocaleDateString('hr-HR', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const totalItems = stats.pendingContent + stats.activeProjects + stats.openRequests + stats.unreadMessages;
  const hasNoData = totalItems === 0 && upcomingContent.length === 0 && recentActivity.length === 0;

  // Check which social accounts are connected
  const connectedAccounts = [];
  if (clientData?.instagram_handle) connectedAccounts.push({ platform: 'instagram', handle: clientData.instagram_handle, color: '#E4405F' });
  if (clientData?.facebook_page_name) connectedAccounts.push({ platform: 'facebook', handle: clientData.facebook_page_name, color: '#1877F2' });
  if (clientData?.linkedin_page_name) connectedAccounts.push({ platform: 'linkedin', handle: clientData.linkedin_page_name, color: '#0A66C2' });
  if (clientData?.tiktok_handle) connectedAccounts.push({ platform: 'tiktok', handle: clientData.tiktok_handle, color: '#000000' });

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{
          width: '24px', height: '24px',
          border: `2px solid ${t.border}`,
          borderTopColor: t.accent,
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <style jsx>{`
        .dashboard { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Welcome Banner */
        .welcome-banner {
          background: linear-gradient(135deg, ${theme === 'light' ? '#1c1c1e' : '#2c2c2e'} 0%, ${theme === 'light' ? '#2c2c2e' : '#1c1c1e'} 100%);
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 32px;
          position: relative;
          overflow: hidden;
        }
        .welcome-banner::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -10%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(0, 255, 148, 0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .welcome-content {
          position: relative;
          z-index: 1;
        }
        .welcome-greeting {
          font-size: 0.85rem;
          color: #00FF94;
          font-weight: 500;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .welcome-name {
          font-size: 1.75rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 8px;
        }
        .welcome-subtitle {
          color: #a1a1a6;
          font-size: 0.95rem;
          max-width: 400px;
        }

        /* Stats Grid - REDESIGNED: Simple numbers only */
        .stats-grid {
          display: flex;
          gap: 48px;
          margin-bottom: 32px;
          padding: 24px 0;
          border-bottom: 1px solid ${t.border};
        }
        @media (max-width: 800px) {
          .stats-grid { gap: 32px; flex-wrap: wrap; }
        }

        .stat-item {
          text-decoration: none;
        }
        .stat-item:hover .stat-value {
          color: ${t.accent};
        }
        .stat-value {
          font-size: 2.5rem;
          font-weight: 600;
          color: ${t.text};
          line-height: 1;
          margin-bottom: 6px;
          transition: color 0.15s;
        }
        .stat-value.needs-action {
          color: ${t.accent};
        }
        .stat-label {
          font-size: 0.85rem;
          color: ${t.textSecondary};
        }

        /* Main Grid */
        .main-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }
        @media (max-width: 900px) { .main-grid { grid-template-columns: 1fr; } }

        .card {
          background: ${t.bgCard};
          border: 1px solid ${t.border};
          border-radius: 16px;
          padding: 24px;
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .card-title {
          font-size: 1rem;
          font-weight: 600;
          color: ${t.text};
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .card-link {
          font-size: 0.8rem !important;
          color: #000 !important;
          background: #00FF94 !important;
          text-decoration: none !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 6px !important;
          font-weight: 600 !important;
          padding: 8px 16px !important;
          border-radius: 8px !important;
          transition: all 0.15s !important;
        }
        .card-link:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px rgba(0, 255, 148, 0.3) !important;
        }

        /* Empty State */
        .empty-state {
          padding: 40px 20px;
          text-align: center;
        }
        .empty-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          background: ${theme === 'light' ? '#f5f5f7' : '#2c2c2e'};
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }
        .empty-title {
          font-size: 1rem;
          font-weight: 600;
          color: ${t.text};
          margin-bottom: 6px;
        }
        .empty-text {
          font-size: 0.85rem;
          color: ${t.textMuted};
          margin-bottom: 16px;
        }
        .empty-btn {
          display: inline-flex !important;
          align-items: center !important;
          gap: 8px !important;
          padding: 12px 20px !important;
          background: #00FF94 !important;
          color: #000 !important;
          border-radius: 10px !important;
          font-size: 0.85rem !important;
          font-weight: 600 !important;
          text-decoration: none !important;
          transition: all 0.2s !important;
        }
        .empty-btn:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px rgba(0, 255, 148, 0.3) !important;
        }

        /* Content Items */
        .content-list { display: flex; flex-direction: column; gap: 10px; }
        .content-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px;
          background: ${t.bgInput};
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.15s;
        }
        .content-item:hover {
          background: ${theme === 'light' ? '#ebebed' : '#3c3c3e'};
          transform: translateX(4px);
        }
        .content-bar { width: 4px; height: 36px; border-radius: 2px; flex-shrink: 0; }
        .content-info { flex: 1; min-width: 0; }
        .content-title {
          font-size: 0.9rem;
          font-weight: 500;
          color: ${t.text};
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .content-meta {
          font-size: 0.75rem;
          color: ${t.textMuted};
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .status-badge {
          font-size: 0.65rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 6px;
          flex-shrink: 0;
        }

        /* Activity Items */
        .activity-list { display: flex; flex-direction: column; gap: 12px; }
        .activity-item {
          display: flex;
          gap: 12px;
          padding: 14px;
          background: ${t.bgInput};
          border-radius: 12px;
          transition: background 0.15s;
        }
        .activity-item:hover { background: ${theme === 'light' ? '#ebebed' : '#3c3c3e'}; }
        .activity-item.unread {
          background: ${theme === 'light' ? 'rgba(0, 255, 148, 0.08)' : 'rgba(0, 255, 148, 0.05)'};
          border-left: 3px solid ${t.accent};
        }
        .activity-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: ${theme === 'light' ? '#e5e5e7' : '#3c3c3e'};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 600;
          color: ${t.text};
          flex-shrink: 0;
        }
        .activity-avatar.admin {
          background: ${t.accent};
          color: #000;
        }
        .activity-content { flex: 1; min-width: 0; }
        .activity-name { font-size: 0.9rem; font-weight: 500; color: ${t.text}; margin-bottom: 3px; }
        .activity-text {
          font-size: 0.8rem;
          color: ${t.textSecondary};
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .activity-time { font-size: 0.7rem; color: ${t.textMuted}; margin-top: 6px; }

        /* CTA Card */
        .cta-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 28px 32px;
          background: linear-gradient(135deg, #00FF94 0%, #00cc76 100%);
          border-radius: 16px;
          text-decoration: none;
          transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(0, 255, 148, 0.25);
        }
        .cta-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0, 255, 148, 0.35);
        }
        .cta-text {
          font-size: 1.1rem;
          font-weight: 600;
          color: #000;
        }
        .cta-arrow {
          width: 48px;
          height: 48px;
          background: #000;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #00FF94;
          flex-shrink: 0;
        }

        /* Connected Accounts */
        .connected-accounts {
          margin-bottom: 24px;
        }
        .connected-accounts-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }
        .connected-accounts-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: ${t.textSecondary};
        }
        .accounts-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .account-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 18px;
          background: ${t.bgCard};
          border: 1px solid ${t.border};
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.15s;
        }
        .account-badge:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .account-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .account-info {
          display: flex;
          flex-direction: column;
        }
        .account-platform {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: ${t.textMuted};
          font-weight: 600;
        }
        .account-handle {
          font-size: 0.9rem;
          font-weight: 500;
          color: ${t.text};
        }

        /* All Good State */
        .all-good {
          background: linear-gradient(135deg, ${theme === 'light' ? '#f0fdf4' : 'rgba(0, 255, 148, 0.05)'} 0%, ${t.bgCard} 100%);
          border: 1px solid ${theme === 'light' ? '#bbf7d0' : 'rgba(0, 255, 148, 0.2)'};
          border-radius: 16px;
          padding: 32px;
          text-align: center;
          margin-bottom: 24px;
        }
        .all-good-icon {
          width: 72px;
          height: 72px;
          border-radius: 20px;
          background: ${t.accent};
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }
        .all-good h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: ${t.text};
          margin-bottom: 8px;
        }
        .all-good p {
          color: ${t.textSecondary};
          font-size: 0.95rem;
          max-width: 320px;
          margin: 0 auto;
        }
      `}</style>

      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-content">
          <div className="welcome-greeting">
            <Coffee size={16} />
            {getGreeting()}
          </div>
          <h1 className="welcome-name">{user?.name || 'Dobrodošli'}</h1>
          <p className="welcome-subtitle">
            {hasNoData
              ? 'Tvoj portal je spreman. Čim počnemo raditi, ovdje ćeš vidjeti sve što se događa.'
              : 'Evo pregleda tvojih projekata i aktivnosti.'}
          </p>
        </div>
      </div>

      {/* Stats - Simple numbers */}
      <div className="stats-grid">
        <Link href="/portal/content" className="stat-item">
          <div className={`stat-value ${stats.pendingContent > 0 ? 'needs-action' : ''}`}>
            {stats.pendingContent}
          </div>
          <div className="stat-label">Za odobrenje</div>
        </Link>

        <Link href="/portal/projects" className="stat-item">
          <div className="stat-value">{stats.activeProjects}</div>
          <div className="stat-label">Aktivnih projekata</div>
        </Link>

        <Link href="/portal/requests" className="stat-item">
          <div className="stat-value">{stats.openRequests}</div>
          <div className="stat-label">Otvorenih zahtjeva</div>
        </Link>

        <Link href="/portal/messages" className="stat-item">
          <div className={`stat-value ${stats.unreadMessages > 0 ? 'needs-action' : ''}`}>
            {stats.unreadMessages}
          </div>
          <div className="stat-label">Novih poruka</div>
        </Link>
      </div>

      {/* Connected Accounts */}
      {connectedAccounts.length > 0 && (
        <div className="connected-accounts">
          <div className="connected-accounts-header">
            <div className="connected-accounts-title">Povezani profili</div>
          </div>
          <div className="accounts-grid">
            {connectedAccounts.map((account) => (
              <div key={account.platform} className="account-badge">
                <div className="account-icon" style={{ background: account.color }}>
                  {account.platform === 'instagram' && <Instagram size={18} color="#fff" />}
                  {account.platform === 'facebook' && <Facebook size={18} color="#fff" />}
                  {account.platform === 'linkedin' && <Linkedin size={18} color="#fff" />}
                  {account.platform === 'tiktok' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  )}
                </div>
                <div className="account-info">
                  <span className="account-platform">{account.platform}</span>
                  <span className="account-handle">
                    {account.platform === 'instagram' || account.platform === 'tiktok' ? '@' : ''}{account.handle}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Good State - when everything is at 0 */}
      {hasNoData && (
        <div className="all-good">
          <div className="all-good-icon">
            <PartyPopper size={32} color="#000" />
          </div>
          <h3>Sve je pod kontrolom!</h3>
          <p>Nemaš ništa za odobriti niti otvorenih zahtjeva. Uživaj u miru.</p>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="main-grid">
        {/* Upcoming Content */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <Calendar size={20} style={{ color: t.accent }} />
              Nadolazeći sadržaj
            </h2>
            <Link href="/portal/content" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              background: '#00FF94',
              color: '#000',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}>
              Kalendar <ArrowRight size={14} />
            </Link>
          </div>

          {upcomingContent.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Calendar size={28} style={{ color: t.textMuted }} />
              </div>
              <div className="empty-title">Nema planiranog sadržaja</div>
              <div className="empty-text">Sadržaj za društvene mreže će se pojaviti ovdje kada ga pripremimo.</div>
            </div>
          ) : (
            <div className="content-list">
              {upcomingContent.map((item) => (
                <Link key={item.id} href={`/portal/content/${item.id}`} className="content-item">
                  <div className="content-bar" style={{ background: getPlatformColor(item.platform) }} />
                  <div className="content-info">
                    <div className="content-title">
                      {item.caption?.slice(0, 50) || `${item.content_type} za ${item.platform}`}
                    </div>
                    <div className="content-meta">
                      <span style={{ textTransform: 'capitalize' }}>{item.platform}</span>
                      <span>·</span>
                      <span>{formatDate(item.scheduled_date)}</span>
                    </div>
                  </div>
                  <span className="status-badge" style={{
                    background: item.status === 'pending' ? 'rgba(251, 191, 36, 0.15)' : 'rgba(52, 199, 89, 0.15)',
                    color: item.status === 'pending' ? '#d97706' : '#059669'
                  }}>
                    {item.status === 'pending' ? 'Čeka' : 'Odobreno'}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <MessageSquare size={20} style={{ color: t.accent }} />
              Poruke
            </h2>
            <Link href="/portal/messages" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              background: '#00FF94',
              color: '#000',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}>
              Sve poruke <ArrowRight size={14} />
            </Link>
          </div>

          {recentActivity.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <MessageSquare size={28} style={{ color: t.textMuted }} />
              </div>
              <div className="empty-title">Još nema poruka</div>
              <div className="empty-text">Ovdje ćeš vidjeti komunikaciju s našim timom.</div>
              <Link href="/portal/messages" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: '#00FF94',
                color: '#000',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}>
                <Send size={16} />
                Pošalji prvu poruku
              </Link>
            </div>
          ) : (
            <div className="activity-list">
              {recentActivity.map((activity) => (
                <div key={activity.id} className={`activity-item ${!activity.read_at ? 'unread' : ''}`}>
                  <div className={`activity-avatar ${activity.sender_type === 'admin' ? 'admin' : ''}`}>
                    {activity.sender_name?.charAt(0)?.toUpperCase() || 'N'}
                  </div>
                  <div className="activity-content">
                    <div className="activity-name">{activity.sender_name}</div>
                    <div className="activity-text">{activity.message.slice(0, 60)}</div>
                    <div className="activity-time">
                      {new Date(activity.created_at).toLocaleDateString('hr-HR', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Card */}
      <Link href="/portal/requests/new" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '28px 32px',
        background: 'linear-gradient(135deg, #00FF94 0%, #00cc76 100%)',
        borderRadius: '16px',
        textDecoration: 'none',
        boxShadow: '0 4px 20px rgba(0, 255, 148, 0.25)',
        marginTop: '24px',
      }}>
        <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#000' }}>
          Imaš ideju ili treba ti izmjena na webu? Javi nam.
        </span>
        <div style={{
          width: '48px',
          height: '48px',
          background: '#000',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#00FF94',
          flexShrink: 0,
        }}>
          <ArrowUpRight size={20} />
        </div>
      </Link>
    </div>
  );
}
