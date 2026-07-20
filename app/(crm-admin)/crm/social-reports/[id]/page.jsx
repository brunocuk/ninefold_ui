// app/(crm-admin)/crm/social-reports/[id]/page.jsx
// View and manage social media report

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/Toast';

const CROATIAN_MONTHS = [
  'Siječanj', 'Veljača', 'Ožujak', 'Travanj', 'Svibanj', 'Lipanj',
  'Srpanj', 'Kolovoz', 'Rujan', 'Listopad', 'Studeni', 'Prosinac'
];

const STATUS_BADGES = {
  draft: { label: 'Nacrt', bg: '#6b7280', color: '#fff' },
  generated: { label: 'Objavljen', bg: '#3b82f6', color: '#fff' },
  sent: { label: 'Poslan', bg: '#00FF94', color: '#000' }
};

const PLATFORM_CONFIG = {
  instagram: { label: 'Instagram', color: '#E4405F', icon: '📸' },
  facebook: { label: 'Facebook', color: '#1877F2', icon: '👍' },
  linkedin: { label: 'LinkedIn', color: '#0A66C2', icon: '💼' },
  tiktok: { label: 'TikTok', color: '#000000', icon: '🎵' }
};

const CONTENT_LABELS = {
  fotografija: 'Fotografija',
  talkingHead: 'Talking Head',
  videoCarousel: 'Video Carousel',
  staticCarousel: 'Static Carousel',
  reel: 'Reel/Short',
  story: 'Story'
};

const CONTENT_TYPE_KEYS = [
  { key: 'fotografija', label: 'Fotografija', icon: '📷' },
  { key: 'talkingHead', label: 'Talking Head', icon: '🎤' },
  { key: 'videoCarousel', label: 'Video Carousel', icon: '🎬' },
  { key: 'staticCarousel', label: 'Static Carousel', icon: '🖼️' },
  { key: 'reel', label: 'Reel/Short', icon: '📱' },
  { key: 'story', label: 'Story', icon: '⏱️' },
];

const PLATFORM_LIST = [
  { key: 'instagram', label: 'Instagram', color: '#E4405F', icon: '📸' },
  { key: 'facebook', label: 'Facebook', color: '#1877F2', icon: '👍' },
  { key: 'linkedin', label: 'LinkedIn', color: '#0A66C2', icon: '💼' },
  { key: 'tiktok', label: 'TikTok', color: '#000000', icon: '🎵' },
];

const HR_SHORT_MONTHS = ['sij', 'velj', 'ožu', 'tra', 'svi', 'lip', 'srp', 'kol', 'ruj', 'lis', 'stu', 'pro'];
const formatPeriodRange = (start, end) => {
  if (!start || !end) return '';
  const [sy, sm, sd] = start.split('-').map(Number);
  const [ey, em, ed] = end.split('-').map(Number);
  const left = `${sd}. ${HR_SHORT_MONTHS[sm - 1]}${sy !== ey ? ' ' + sy + '.' : ''}`;
  const right = `${ed}. ${HR_SHORT_MONTHS[em - 1]} ${ey}.`;
  return `${left} – ${right}`;
};

export default function SocialReportDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showSendModal, setShowSendModal] = useState(searchParams.get('send') === 'true');
  const [sendEmail, setSendEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    loadReport();
  }, [params.id]);

  const loadReport = async () => {
    try {
      const response = await fetch(`/api/social-media-reports/${params.id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Report not found');
      }

      setReport(result.data);

      // Pre-fill email from client
      if (result.data.recurring_contracts?.clients?.email) {
        setSendEmail(result.data.recurring_contracts.clients.email);
      }
    } catch (error) {
      console.error('Error loading report:', error);
      showToast('Greška pri učitavanju izvještaja', 'error');
      router.push('/crm/social-reports');
    } finally {
      setLoading(false);
    }
  };

  const handleSendReport = async () => {
    if (!sendEmail) {
      showToast('Molimo unesite email adresu', 'error');
      return;
    }

    setSending(true);

    try {
      const response = await fetch(`/api/social-media-reports/${params.id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: sendEmail,
          recipientName: report.recurring_contracts?.clients?.company ||
            report.recurring_contracts?.clients?.name
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Greška pri slanju');
      }

      showToast('Izvještaj uspješno poslan!', 'success');
      setShowSendModal(false);
      loadReport(); // Refresh to get updated status
    } catch (error) {
      console.error('Error sending report:', error);
      showToast(error.message, 'error');
    } finally {
      setSending(false);
    }
  };

  const handlePublishToggle = async () => {
    const newStatus = report.status === 'generated' ? 'draft' : 'generated';
    setPublishing(true);
    try {
      const response = await fetch(`/api/social-media-reports/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Greška');
      setReport(result.data);
      showToast(
        newStatus === 'generated' ? 'Objavljeno u portalu' : 'Uklonjeno iz portala',
        'success'
      );
    } catch (error) {
      console.error('Error publishing report:', error);
      showToast(error.message, 'error');
    } finally {
      setPublishing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('hr-HR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#00FF94' }}>
        Učitavanje izvještaja...
      </div>
    );
  }

  if (!report) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#ef4444' }}>
        Izvještaj nije pronađen
      </div>
    );
  }

  if (isEditing) {
    return (
      <SocialReportEditForm
        report={report}
        onCancel={() => setIsEditing(false)}
        onSaved={(updated) => {
          setReport(updated);
          setIsEditing(false);
          showToast('Izvještaj ažuriran', 'success');
        }}
      />
    );
  }

  const clientName = report.recurring_contracts?.clients?.company ||
    report.recurring_contracts?.clients?.name || 'Nepoznat klijent';
  const statusStyle = STATUS_BADGES[report.status] || STATUS_BADGES.draft;
  const platforms = report.platforms || {};
  const contentDelivered = report.content_delivered || {};
  const contentPlanned = report.content_planned || {};
  const topPosts = report.top_posts || [];

  return (
    <>
      <style jsx>{`
        .report-detail {
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .header {
          margin-bottom: 30px;
        }

        .back-link {
          color: #666;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          transition: color 0.2s;
        }

        .back-link:hover {
          color: #00FF94;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: start;
          flex-wrap: wrap;
          gap: 20px;
        }

        h1 {
          font-size: 2rem;
          font-weight: 900;
          color: #fff;
          margin-bottom: 8px;
        }

        .report-reference {
          font-size: 1rem;
          color: #E4405F;
          font-family: monospace;
          font-weight: 600;
        }

        .header-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s;
          border: none;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }

        .btn svg {
          flex-shrink: 0;
        }

        .btn-primary {
          background: #00FF94;
          color: #000;
        }

        .btn-primary:hover {
          box-shadow: 0 0 20px rgba(0, 255, 148, 0.4);
        }

        .btn-secondary {
          background: #333;
          color: #fff;
        }

        .btn-secondary:hover {
          background: #444;
        }

        .status-badge {
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
        }

        .card {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 20px;
        }

        .card-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .stat-card {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 900;
          color: #00FF94;
          line-height: 1;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 0.8rem;
          color: #888;
          text-transform: uppercase;
        }

        /* Content Delivery */
        .content-grid-display {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
        }

        .content-item {
          background: #0a0a0a;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 16px;
          text-align: center;
        }

        .content-item-icon {
          font-size: 1.5rem;
          margin-bottom: 8px;
        }

        .content-item-label {
          font-size: 0.8rem;
          color: #888;
          margin-bottom: 8px;
        }

        .content-item-values {
          display: flex;
          justify-content: center;
          gap: 16px;
        }

        .content-value {
          text-align: center;
        }

        .content-value-number {
          font-size: 1.3rem;
          font-weight: 700;
        }

        .content-value-label {
          font-size: 0.65rem;
          color: #666;
          text-transform: uppercase;
        }

        /* Platform Cards */
        .platform-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }

        .platform-card {
          background: #0a0a0a;
          border: 1px solid #333;
          border-radius: 12px;
          overflow: hidden;
        }

        .platform-header {
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .platform-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }

        .platform-name {
          font-weight: 600;
          color: #fff;
          flex: 1;
        }

        .platform-followers {
          text-align: right;
        }

        .platform-followers-count {
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
        }

        .platform-followers-change {
          font-size: 0.8rem;
          font-weight: 600;
        }

        .platform-metrics {
          padding: 0 16px 16px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .platform-metric {
          text-align: center;
          padding: 8px;
          background: #1a1a1a;
          border-radius: 6px;
        }

        .platform-metric-value {
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
        }

        .platform-metric-label {
          font-size: 0.65rem;
          color: #666;
          text-transform: uppercase;
        }

        /* Top Posts */
        .top-post-item {
          padding: 16px 0;
          border-bottom: 1px solid #333;
          display: flex;
          gap: 16px;
        }

        .top-post-item:last-child {
          border-bottom: none;
        }

        .top-post-badge {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .top-post-content {
          flex: 1;
        }

        .top-post-description {
          color: #ccc;
          margin-bottom: 8px;
        }

        .top-post-stats {
          display: flex;
          gap: 16px;
          font-size: 0.85rem;
          color: #888;
        }

        /* Paid Ads */
        .paid-ads-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 12px;
        }

        .paid-ads-item {
          background: #0a0a0a;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 16px;
          text-align: center;
        }

        .paid-ads-value {
          font-size: 1.3rem;
          font-weight: 700;
          color: #f59e0b;
        }

        .paid-ads-label {
          font-size: 0.7rem;
          color: #666;
          text-transform: uppercase;
          margin-top: 4px;
        }

        /* Summary */
        .summary-text {
          color: #ccc;
          line-height: 1.7;
          white-space: pre-wrap;
        }

        /* Highlights & Recommendations */
        .list-items {
          list-style: none;
          padding: 0;
        }

        .list-items li {
          padding: 10px 0;
          border-bottom: 1px solid #333;
          color: #ccc;
          display: flex;
          align-items: start;
          gap: 10px;
        }

        .list-items li:last-child {
          border-bottom: none;
        }

        .list-number {
          width: 24px;
          height: 24px;
          background: #00FF94;
          color: #000;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .list-number.blue {
          background: #3b82f6;
          color: #fff;
        }

        /* Info Sidebar */
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #333;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-label {
          color: #666;
          font-size: 0.9rem;
        }

        .info-value {
          color: #fff;
          font-weight: 500;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 32px;
          max-width: 500px;
          width: 90%;
        }

        .modal-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 0.85rem;
          color: #999;
          margin-bottom: 8px;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          background: #0a0a0a;
          border: 1px solid #333;
          border-radius: 8px;
          color: #fff;
          font-size: 1rem;
        }

        .form-input:focus {
          outline: none;
          border-color: #00FF94;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
        }
      `}</style>

      <div className="report-detail">
        <div className="header">
          <Link href="/crm/social-reports" className="back-link">
            ← Natrag na izvještaje
          </Link>

          <div className="header-content">
            <div>
              <h1>{formatPeriodRange(report.period_start, report.period_end) || `${CROATIAN_MONTHS[report.report_month - 1]} ${report.report_year}`}</h1>
              <div className="report-reference">{report.reference}</div>
              <p style={{ color: '#888', marginTop: '8px' }}>{clientName}</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span
                className="status-badge"
                style={{ background: statusStyle.bg, color: statusStyle.color }}
              >
                {statusStyle.label}
              </span>

              <div className="header-actions">
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-secondary"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Uredi
                </button>
                <a
                  href={`/social-report/${report.id}`}
                  target="_blank"
                  className="btn btn-secondary"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Pregled
                </a>
                <a
                  href={`/api/social-media-reports/${report.id}/pdf`}
                  target="_blank"
                  className="btn btn-secondary"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  PDF
                </a>
                {report.status !== 'sent' && (
                  <button
                    onClick={handlePublishToggle}
                    className="btn btn-secondary"
                    disabled={publishing}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {report.status === 'generated' ? (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </>
                      ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </>
                      )}
                    </svg>
                    {publishing
                      ? '...'
                      : report.status === 'generated' ? 'Sakrij iz portala' : 'Objavi u portalu'}
                  </button>
                )}
                <button
                  onClick={() => setShowSendModal(true)}
                  className="btn btn-primary"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  Pošalji
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{report.posts_published || 0}</div>
            <div className="stat-label">Objave</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{(report.total_reach || 0).toLocaleString()}</div>
            <div className="stat-label">Ukupni Doseg</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{(report.total_engagement || 0).toLocaleString()}</div>
            <div className="stat-label">Engagement</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: (report.follower_growth || 0) >= 0 ? '#00FF94' : '#ef4444' }}>
              {(report.follower_growth || 0) >= 0 ? '+' : ''}{report.follower_growth || 0}
            </div>
            <div className="stat-label">Rast Pratitelja</div>
          </div>
        </div>

        <div className="content-grid">
          <div>
            {/* Content Delivery */}
            {Object.keys(contentDelivered).length > 0 && (
              <div className="card">
                <div className="card-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00FF94" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <line x1="9" y1="15" x2="15" y2="15" />
                  </svg>
                  Isporučeni Sadržaj
                </div>
                <div className="content-grid-display">
                  {Object.keys(contentDelivered).map(key => (
                    <div key={key} className="content-item">
                      <div className="content-item-label">{CONTENT_LABELS[key] || key}</div>
                      <div className="content-item-values">
                        <div className="content-value">
                          <div className="content-value-number" style={{ color: '#888' }}>
                            {contentPlanned[key] || 0}
                          </div>
                          <div className="content-value-label">Plan</div>
                        </div>
                        <div className="content-value">
                          <div className="content-value-number" style={{ color: '#00FF94' }}>
                            {contentDelivered[key] || 0}
                          </div>
                          <div className="content-value-label">Isporučeno</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Platform Metrics */}
            {Object.keys(platforms).length > 0 && (
              <div className="card">
                <div className="card-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                  Metrike Po Platformi
                </div>
                <div className="platform-grid">
                  {Object.entries(platforms).map(([key, data]) => {
                    const config = PLATFORM_CONFIG[key];
                    if (!config || !data) return null;

                    return (
                      <div key={key} className="platform-card">
                        <div className="platform-header">
                          <div className="platform-icon" style={{ background: config.color }}>
                            {config.icon}
                          </div>
                          <div className="platform-name">{config.label}</div>
                          <div className="platform-followers">
                            <div className="platform-followers-count">
                              {(data.followers || 0).toLocaleString()}
                            </div>
                            {data.follower_change && (
                              <div className="platform-followers-change" style={{ color: data.follower_change >= 0 ? '#00FF94' : '#ef4444' }}>
                                {data.follower_change >= 0 ? '+' : ''}{data.follower_change}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="platform-metrics">
                          {data.posts && (
                            <div className="platform-metric">
                              <div className="platform-metric-value">{data.posts}</div>
                              <div className="platform-metric-label">Objave</div>
                            </div>
                          )}
                          {data.reach && (
                            <div className="platform-metric">
                              <div className="platform-metric-value">{data.reach.toLocaleString()}</div>
                              <div className="platform-metric-label">Doseg</div>
                            </div>
                          )}
                          {data.views && (
                            <div className="platform-metric">
                              <div className="platform-metric-value">{data.views.toLocaleString()}</div>
                              <div className="platform-metric-label">Pregledi</div>
                            </div>
                          )}
                          {data.engagement && (
                            <div className="platform-metric">
                              <div className="platform-metric-value">{data.engagement.toLocaleString()}</div>
                              <div className="platform-metric-label">Engagement</div>
                            </div>
                          )}
                          {data.engagement_rate && (
                            <div className="platform-metric">
                              <div className="platform-metric-value">{data.engagement_rate}%</div>
                              <div className="platform-metric-label">Eng. Rate</div>
                            </div>
                          )}
                          {data.impressions && (
                            <div className="platform-metric">
                              <div className="platform-metric-value">{data.impressions.toLocaleString()}</div>
                              <div className="platform-metric-label">Impresije</div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Top Posts */}
            {topPosts.length > 0 && (
              <div className="card">
                <div className="card-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  Top Objave
                </div>
                {topPosts.map((post, i) => {
                  const platformConfig = PLATFORM_CONFIG[post.platform];
                  return (
                    <div key={i} className="top-post-item">
                      <span
                        className="top-post-badge"
                        style={{ background: platformConfig?.color || '#333', color: '#fff' }}
                      >
                        {post.type}
                      </span>
                      <div className="top-post-content">
                        <div className="top-post-description">{post.description || 'Bez opisa'}</div>
                        <div className="top-post-stats">
                          {post.reach && <span>Doseg: {post.reach.toLocaleString()}</span>}
                          {post.engagement && <span>Engagement: {post.engagement.toLocaleString()}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Paid Ads */}
            {report.paid_ads_enabled && (
              <div className="card">
                <div className="card-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  Plaćeni Oglasi
                </div>
                <div className="paid-ads-grid">
                  {report.paid_ads_spend && (
                    <div className="paid-ads-item">
                      <div className="paid-ads-value">€{report.paid_ads_spend}</div>
                      <div className="paid-ads-label">Potrošnja</div>
                    </div>
                  )}
                  {report.paid_ads_impressions && (
                    <div className="paid-ads-item">
                      <div className="paid-ads-value">{report.paid_ads_impressions.toLocaleString()}</div>
                      <div className="paid-ads-label">Impresije</div>
                    </div>
                  )}
                  {report.paid_ads_clicks && (
                    <div className="paid-ads-item">
                      <div className="paid-ads-value">{report.paid_ads_clicks.toLocaleString()}</div>
                      <div className="paid-ads-label">Klikovi</div>
                    </div>
                  )}
                  {report.paid_ads_conversions && (
                    <div className="paid-ads-item">
                      <div className="paid-ads-value">{report.paid_ads_conversions}</div>
                      <div className="paid-ads-label">Konverzije</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Summary */}
            {report.summary_text && (
              <div className="card">
                <div className="card-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  Sažetak
                </div>
                <p className="summary-text">{report.summary_text}</p>
              </div>
            )}

            {/* Highlights */}
            {report.highlights && report.highlights.length > 0 && (
              <div className="card">
                <div className="card-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00FF94" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  Istaknuto
                </div>
                <ul className="list-items">
                  {report.highlights.map((h, i) => (
                    <li key={i}>
                      <span className="list-number">{i + 1}</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {report.recommendations && report.recommendations.length > 0 && (
              <div className="card">
                <div className="card-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="9" y1="18" x2="15" y2="18" />
                    <line x1="10" y1="22" x2="14" y2="22" />
                    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
                  </svg>
                  Preporuke
                </div>
                <ul className="list-items">
                  {report.recommendations.map((r, i) => (
                    <li key={i}>
                      <span className="list-number blue">{i + 1}</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Info Sidebar */}
          <div>
            <div className="card">
              <div className="card-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                Informacije
              </div>

              <div className="info-row">
                <span className="info-label">Klijent</span>
                <span className="info-value">{clientName}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Ugovor</span>
                <span className="info-value">{report.recurring_contracts?.name || '-'}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Razdoblje</span>
                <span className="info-value">
                  {formatPeriodRange(report.period_start, report.period_end)}
                </span>
              </div>

              {report.avg_engagement_rate && (
                <div className="info-row">
                  <span className="info-label">Prosj. Eng. Rate</span>
                  <span className="info-value" style={{ color: '#00FF94' }}>{report.avg_engagement_rate}%</span>
                </div>
              )}

              <div className="info-row">
                <span className="info-label">Pregledi</span>
                <span className="info-value">{report.view_count || 0}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Kreirano</span>
                <span className="info-value">{formatDate(report.created_at)}</span>
              </div>

              {report.sent_at && (
                <>
                  <div className="info-row">
                    <span className="info-label">Poslano</span>
                    <span className="info-value">{formatDate(report.sent_at)}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Primatelj</span>
                    <span className="info-value">{report.sent_to}</span>
                  </div>
                </>
              )}
            </div>

            {report.notes && (
              <div className="card">
                <div className="card-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                  Napomene
                </div>
                <p style={{ color: '#ccc', lineHeight: '1.6' }}>{report.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Send Modal */}
      {showSendModal && (
        <div className="modal-overlay" onClick={() => setShowSendModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00FF94" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              Pošalji Izvještaj
            </div>

            <div className="form-group">
              <label className="form-label">Email Adresa Primatelja</label>
              <input
                type="email"
                value={sendEmail}
                onChange={(e) => setSendEmail(e.target.value)}
                className="form-input"
                placeholder="email@example.com"
              />
            </div>

            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              Izvještaj će biti poslan kao email s linkom na web pregled.
              Primatelj može preuzeti PDF verziju iz emaila.
            </p>

            <div className="modal-actions">
              <button
                onClick={() => setShowSendModal(false)}
                className="btn btn-secondary"
              >
                Odustani
              </button>
              <button
                onClick={handleSendReport}
                className="btn btn-primary"
                disabled={sending}
              >
                {sending ? 'Slanje...' : 'Pošalji'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Edit form for an existing social media report
function SocialReportEditForm({ report, onCancel, onSaved }) {
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);

  const toStr = (v) => (v === null || v === undefined ? '' : String(v));
  const initContent = (obj) => {
    const r = {};
    for (const ct of CONTENT_TYPE_KEYS) r[ct.key] = toStr(obj?.[ct.key]);
    return r;
  };
  const initPlatforms = () => {
    const base = {};
    for (const p of PLATFORM_LIST) {
      const d = report.platforms?.[p.key] || {};
      base[p.key] = {
        followers: toStr(d.followers),
        follower_change: toStr(d.follower_change),
        posts: toStr(d.posts),
        reach: toStr(d.reach),
        impressions: toStr(d.impressions),
        views: toStr(d.views),
        engagement: toStr(d.engagement),
        engagement_rate: toStr(d.engagement_rate),
      };
    }
    return base;
  };

  const [form, setForm] = useState({
    status: report.status || 'draft',
    content_planned: initContent(report.content_planned),
    content_delivered: initContent(report.content_delivered),
    posts_published: toStr(report.posts_published),
    platforms: initPlatforms(),
    top_posts: (report.top_posts || []).map(tp => ({
      platform: tp.platform || 'instagram',
      type: tp.type || 'post',
      reach: toStr(tp.reach),
      engagement: toStr(tp.engagement),
      description: tp.description || '',
    })),
    paid_ads_enabled: report.paid_ads_enabled || false,
    paid_ads_spend: toStr(report.paid_ads_spend),
    paid_ads_impressions: toStr(report.paid_ads_impressions),
    paid_ads_clicks: toStr(report.paid_ads_clicks),
    paid_ads_conversions: toStr(report.paid_ads_conversions),
    summary_text: report.summary_text || '',
    highlights: report.highlights?.length ? [...report.highlights] : ['', '', ''],
    recommendations: report.recommendations?.length ? [...report.recommendations] : ['', '', ''],
  });

  const setField = (name, value) => setForm(p => ({ ...p, [name]: value }));
  const setContent = (section, key, value) =>
    setForm(p => ({ ...p, [section]: { ...p[section], [key]: value } }));
  const setPlatform = (pk, field, value) =>
    setForm(p => ({ ...p, platforms: { ...p.platforms, [pk]: { ...p.platforms[pk], [field]: value } } }));
  const setTopPost = (i, field, value) =>
    setForm(p => {
      const arr = [...p.top_posts];
      arr[i] = { ...arr[i], [field]: value };
      return { ...p, top_posts: arr };
    });
  const addTopPost = () =>
    setForm(p => ({ ...p, top_posts: [...p.top_posts, { platform: 'instagram', type: 'post', reach: '', engagement: '', description: '' }] }));
  const removeTopPost = (i) =>
    setForm(p => ({ ...p, top_posts: p.top_posts.filter((_, idx) => idx !== i) }));
  const setListItem = (field, i, value) =>
    setForm(p => {
      const arr = [...p[field]];
      arr[i] = value;
      return { ...p, [field]: arr };
    });
  const addListItem = (field) => setForm(p => ({ ...p, [field]: [...p[field], ''] }));
  const removeListItem = (field, i) =>
    setForm(p => ({ ...p, [field]: p[field].filter((_, idx) => idx !== i) }));

  const num = (v) => (v === '' || v === null || v === undefined ? null : (parseInt(v) || 0));
  const fnum = (v) => (v === '' || v === null || v === undefined ? null : (parseFloat(v) || 0));

  const calculateTotals = () => {
    let totalReach = 0, totalImpressions = 0, totalEngagement = 0, followerGrowth = 0;
    const rates = [];
    for (const p of PLATFORM_LIST) {
      const d = form.platforms[p.key];
      if (d) {
        totalReach += parseInt(d.reach) || 0;
        totalImpressions += parseInt(d.impressions) || parseInt(d.views) || 0;
        totalEngagement += parseInt(d.engagement) || 0;
        followerGrowth += parseInt(d.follower_change) || 0;
        if (d.engagement_rate) rates.push(parseFloat(d.engagement_rate));
      }
    }
    const avg = rates.length ? (rates.reduce((a, b) => a + b, 0) / rates.length).toFixed(2) : null;
    return { totalReach, totalImpressions, totalEngagement, followerGrowth, avgEngagementRate: avg };
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const totals = calculateTotals();

      const contentDelivered = {};
      const contentPlanned = {};
      for (const ct of CONTENT_TYPE_KEYS) {
        if (form.content_delivered[ct.key] !== '') contentDelivered[ct.key] = parseInt(form.content_delivered[ct.key]) || 0;
        if (form.content_planned[ct.key] !== '') contentPlanned[ct.key] = parseInt(form.content_planned[ct.key]) || 0;
      }

      const platforms = {};
      for (const p of PLATFORM_LIST) {
        const d = form.platforms[p.key];
        const hasData = Object.values(d).some(v => v !== '');
        if (hasData) {
          platforms[p.key] = {
            followers: num(d.followers),
            follower_change: num(d.follower_change),
            posts: num(d.posts),
            reach: num(d.reach),
            impressions: num(d.impressions),
            views: num(d.views),
            engagement: num(d.engagement),
            engagement_rate: fnum(d.engagement_rate),
          };
        }
      }

      const topPosts = form.top_posts
        .filter(tp => tp.description || tp.reach || tp.engagement)
        .map(tp => ({
          platform: tp.platform,
          type: tp.type,
          reach: num(tp.reach),
          engagement: num(tp.engagement),
          description: tp.description || null,
        }));

      const payload = {
        status: form.status,
        content_planned: contentPlanned,
        content_delivered: contentDelivered,
        posts_published: form.posts_published ? parseInt(form.posts_published) : 0,
        platforms,
        total_reach: totals.totalReach,
        total_impressions: totals.totalImpressions,
        total_engagement: totals.totalEngagement,
        avg_engagement_rate: totals.avgEngagementRate ? parseFloat(totals.avgEngagementRate) : null,
        follower_growth: totals.followerGrowth,
        top_posts: topPosts,
        paid_ads_enabled: form.paid_ads_enabled,
        paid_ads_spend: form.paid_ads_spend ? parseFloat(form.paid_ads_spend) : null,
        paid_ads_impressions: form.paid_ads_impressions ? parseInt(form.paid_ads_impressions) : null,
        paid_ads_clicks: form.paid_ads_clicks ? parseInt(form.paid_ads_clicks) : null,
        paid_ads_conversions: form.paid_ads_conversions ? parseInt(form.paid_ads_conversions) : null,
        summary_text: form.summary_text || null,
        highlights: form.highlights.filter(h => h.trim()),
        recommendations: form.recommendations.filter(r => r.trim()),
      };

      const response = await fetch(`/api/social-media-reports/${report.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Greška pri spremanju');

      onSaved(result.data);
    } catch (error) {
      console.error('Error saving report:', error);
      showToast(error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="edit-report">
      <style jsx>{`
        .edit-report { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .edit-header {
          display: flex; justify-content: space-between; align-items: flex-end;
          flex-wrap: wrap; gap: 16px; margin-bottom: 24px;
        }
        .edit-header h1 { font-size: 1.8rem; font-weight: 900; color: #fff; margin-bottom: 6px; }
        .edit-header .ref { color: #E4405F; font-family: monospace; font-weight: 600; }
        .actions { display: flex; gap: 12px; }
        .card {
          background: #1a1a1a; border: 1px solid #333; border-radius: 12px;
          padding: 24px; margin-bottom: 20px;
        }
        .section-title {
          font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 20px;
          padding-bottom: 12px; border-bottom: 1px solid #333;
        }
        .form-group { margin-bottom: 20px; }
        .form-label {
          display: block; font-size: 0.85rem; font-weight: 600; color: #999;
          margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;
        }
        .form-input, .form-select, .form-textarea {
          width: 100%; padding: 12px 16px; background: #0a0a0a; border: 1px solid #333;
          border-radius: 8px; color: #fff; font-size: 1rem; transition: border-color 0.2s;
        }
        .form-input:focus, .form-select:focus, .form-textarea:focus { outline: none; border-color: #00FF94; }
        .form-textarea { min-height: 120px; resize: vertical; }
        .form-row-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        @media (max-width: 640px) { .form-row-2 { grid-template-columns: 1fr; } }
        .content-grid-inputs {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px;
        }
        .content-item { background: #0a0a0a; border: 1px solid #333; border-radius: 8px; padding: 12px; }
        .content-item-header {
          display: flex; align-items: center; gap: 8px; margin-bottom: 8px;
          font-size: 0.85rem; color: #fff;
        }
        .content-inputs { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .content-input {
          padding: 8px; background: #1a1a1a; border: 1px solid #333; border-radius: 6px;
          color: #fff; font-size: 0.85rem; width: 100%;
        }
        .content-input:focus { outline: none; border-color: #00FF94; }
        .content-input-label { font-size: 0.7rem; color: #666; text-align: center; margin-top: 4px; }
        .platform-block { border-top: 1px solid #222; padding-top: 16px; margin-top: 16px; }
        .platform-block:first-of-type { border-top: none; padding-top: 0; margin-top: 0; }
        .platform-block-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .platform-icon {
          width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center;
          justify-content: center; font-size: 1.1rem; flex-shrink: 0;
        }
        .platform-name { font-weight: 600; color: #fff; }
        .platform-metrics {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px;
        }
        .platform-metrics .form-group { margin-bottom: 0; }
        .top-post-card {
          background: #0a0a0a; border: 1px solid #333; border-radius: 8px; padding: 16px; margin-bottom: 12px;
        }
        .top-post-header { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px; margin-bottom: 12px; }
        .top-post-header .form-group { margin-bottom: 0; }
        @media (max-width: 640px) { .top-post-header { grid-template-columns: 1fr 1fr; } }
        .checkbox-wrapper {
          display: flex; align-items: center; gap: 12px; padding: 16px; background: #0a0a0a;
          border: 1px solid #333; border-radius: 8px; cursor: pointer;
        }
        .checkbox-wrapper input { width: 20px; height: 20px; accent-color: #00FF94; }
        .checkbox-label { color: #fff; font-weight: 500; }
        .list-inputs { display: flex; flex-direction: column; gap: 10px; }
        .list-input-row { display: flex; align-items: center; gap: 10px; }
        .list-input-row > span {
          width: 24px; height: 24px; background: #00FF94; color: #000; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; font-size: 0.8rem;
          font-weight: 700; flex-shrink: 0;
        }
        .list-input-row > span.blue-num { background: #3b82f6; color: #fff; }
        .sub { font-size: 0.95rem; margin: 24px 0 16px; }
        .sub.green { color: #00FF94; }
        .sub.blue { color: #3b82f6; }
        .icon-btn {
          width: 32px; height: 32px; flex-shrink: 0; background: #2a1a1a; border: 1px solid #4a2a2a;
          border-radius: 8px; color: #ef4444; font-size: 1.2rem; cursor: pointer; line-height: 1;
        }
        .icon-btn:hover { background: #3a1a1a; }
        .add-btn {
          margin-top: 12px; padding: 8px 16px; background: transparent; border: 1px dashed #444;
          border-radius: 8px; color: #888; font-size: 0.85rem; font-weight: 600; cursor: pointer;
        }
        .add-btn:hover { border-color: #00FF94; color: #00FF94; }
        .remove-btn {
          margin-top: 4px; padding: 6px 12px; background: transparent; border: 1px solid #4a2a2a;
          border-radius: 6px; color: #ef4444; font-size: 0.8rem; cursor: pointer;
        }
        .remove-btn:hover { background: #2a1a1a; }
        .edit-footer {
          display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;
          padding-top: 20px; border-top: 1px solid #333;
        }
        .btn {
          padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 1rem; cursor: pointer;
          transition: all 0.3s; border: none; display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-primary { background: #00FF94; color: #000; }
        .btn-primary:hover { box-shadow: 0 0 20px rgba(0, 255, 148, 0.4); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }
        .btn-secondary { background: #333; color: #fff; }
        .btn-secondary:hover { background: #444; }
      `}</style>

      <div className="edit-header">
        <div>
          <h1>Uredi izvještaj</h1>
          <div className="ref">{report.reference}</div>
        </div>
        <div className="actions">
          <button className="btn btn-secondary" onClick={onCancel} disabled={saving}>Odustani</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Spremanje...' : 'Spremi izmjene'}
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="card">
        <h3 className="section-title">Status</h3>
        <select className="form-select" value={form.status} onChange={(e) => setField('status', e.target.value)}>
          <option value="draft">Nacrt</option>
          <option value="generated">Generiran</option>
          <option value="sent">Poslan</option>
        </select>
      </div>

      {/* Content */}
      <div className="card">
        <h3 className="section-title">Isporučeni Sadržaj</h3>
        <div className="content-grid-inputs">
          {CONTENT_TYPE_KEYS.map((ct) => (
            <div key={ct.key} className="content-item">
              <div className="content-item-header"><span>{ct.icon}</span>{ct.label}</div>
              <div className="content-inputs">
                <div>
                  <input type="number" min="0" className="content-input" value={form.content_planned[ct.key]}
                    onChange={(e) => setContent('content_planned', ct.key, e.target.value)} placeholder="0" />
                  <div className="content-input-label">Plan</div>
                </div>
                <div>
                  <input type="number" min="0" className="content-input" value={form.content_delivered[ct.key]}
                    onChange={(e) => setContent('content_delivered', ct.key, e.target.value)} placeholder="0" />
                  <div className="content-input-label">Isporučeno</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="form-group" style={{ marginTop: '20px', marginBottom: 0 }}>
          <label className="form-label">Ukupno Objavljenih Postova</label>
          <input type="number" min="0" className="form-input" value={form.posts_published}
            onChange={(e) => setField('posts_published', e.target.value)} placeholder="npr. 24" />
        </div>
      </div>

      {/* Platforms */}
      <div className="card">
        <h3 className="section-title">Metrike Po Platformi</h3>
        {PLATFORM_LIST.map((p) => {
          const d = form.platforms[p.key];
          const isTikTok = p.key === 'tiktok';
          return (
            <div key={p.key} className="platform-block">
              <div className="platform-block-header">
                <div className="platform-icon" style={{ background: p.color }}>{p.icon}</div>
                <span className="platform-name">{p.label}</span>
              </div>
              <div className="platform-metrics">
                <div className="form-group"><label className="form-label">Pratitelji</label>
                  <input type="number" min="0" className="form-input" value={d.followers} onChange={(e) => setPlatform(p.key, 'followers', e.target.value)} placeholder="0" /></div>
                <div className="form-group"><label className="form-label">Promjena</label>
                  <input type="number" className="form-input" value={d.follower_change} onChange={(e) => setPlatform(p.key, 'follower_change', e.target.value)} placeholder="+/-" /></div>
                <div className="form-group"><label className="form-label">Objave</label>
                  <input type="number" min="0" className="form-input" value={d.posts} onChange={(e) => setPlatform(p.key, 'posts', e.target.value)} placeholder="0" /></div>
                {!isTikTok ? (
                  <>
                    <div className="form-group"><label className="form-label">Doseg</label>
                      <input type="number" min="0" className="form-input" value={d.reach} onChange={(e) => setPlatform(p.key, 'reach', e.target.value)} placeholder="0" /></div>
                    <div className="form-group"><label className="form-label">Impresije</label>
                      <input type="number" min="0" className="form-input" value={d.impressions} onChange={(e) => setPlatform(p.key, 'impressions', e.target.value)} placeholder="0" /></div>
                  </>
                ) : (
                  <div className="form-group"><label className="form-label">Pregledi</label>
                    <input type="number" min="0" className="form-input" value={d.views} onChange={(e) => setPlatform(p.key, 'views', e.target.value)} placeholder="0" /></div>
                )}
                <div className="form-group"><label className="form-label">Engagement</label>
                  <input type="number" min="0" className="form-input" value={d.engagement} onChange={(e) => setPlatform(p.key, 'engagement', e.target.value)} placeholder="0" /></div>
                <div className="form-group"><label className="form-label">Eng. Rate %</label>
                  <input type="number" step="0.01" min="0" className="form-input" value={d.engagement_rate} onChange={(e) => setPlatform(p.key, 'engagement_rate', e.target.value)} placeholder="0.00" /></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Top Posts */}
      <div className="card">
        <h3 className="section-title">Top Objave</h3>
        {form.top_posts.map((post, i) => (
          <div key={i} className="top-post-card">
            <div className="top-post-header">
              <div className="form-group"><label className="form-label">Platforma</label>
                <select className="form-select" value={post.platform} onChange={(e) => setTopPost(i, 'platform', e.target.value)}>
                  {PLATFORM_LIST.map((pp) => <option key={pp.key} value={pp.key}>{pp.label}</option>)}
                </select></div>
              <div className="form-group"><label className="form-label">Tip</label>
                <select className="form-select" value={post.type} onChange={(e) => setTopPost(i, 'type', e.target.value)}>
                  <option value="post">Post</option>
                  <option value="reel">Reel</option>
                  <option value="story">Story</option>
                  <option value="carousel">Carousel</option>
                  <option value="video">Video</option>
                </select></div>
              <div className="form-group"><label className="form-label">Doseg</label>
                <input type="number" min="0" className="form-input" value={post.reach} onChange={(e) => setTopPost(i, 'reach', e.target.value)} placeholder="0" /></div>
              <div className="form-group"><label className="form-label">Engagement</label>
                <input type="number" min="0" className="form-input" value={post.engagement} onChange={(e) => setTopPost(i, 'engagement', e.target.value)} placeholder="0" /></div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Opis</label>
              <input type="text" className="form-input" value={post.description} onChange={(e) => setTopPost(i, 'description', e.target.value)} placeholder="Kratki opis sadržaja..." /></div>
            <button type="button" className="remove-btn" onClick={() => removeTopPost(i)}>Ukloni</button>
          </div>
        ))}
        <button type="button" className="add-btn" onClick={addTopPost}>+ Dodaj objavu</button>
      </div>

      {/* Paid Ads */}
      <div className="card">
        <h3 className="section-title">Plaćeni Oglasi</h3>
        <label className="checkbox-wrapper">
          <input type="checkbox" checked={form.paid_ads_enabled} onChange={(e) => setField('paid_ads_enabled', e.target.checked)} />
          <span className="checkbox-label">Uključi sekciju plaćenih oglasa</span>
        </label>
        {form.paid_ads_enabled && (
          <div className="form-row-2" style={{ marginTop: '20px' }}>
            <div className="form-group"><label className="form-label">Potrošnja (EUR)</label>
              <input type="number" min="0" step="0.01" className="form-input" value={form.paid_ads_spend} onChange={(e) => setField('paid_ads_spend', e.target.value)} placeholder="npr. 500" /></div>
            <div className="form-group"><label className="form-label">Impresije</label>
              <input type="number" min="0" className="form-input" value={form.paid_ads_impressions} onChange={(e) => setField('paid_ads_impressions', e.target.value)} placeholder="npr. 50000" /></div>
            <div className="form-group"><label className="form-label">Klikovi</label>
              <input type="number" min="0" className="form-input" value={form.paid_ads_clicks} onChange={(e) => setField('paid_ads_clicks', e.target.value)} placeholder="npr. 1500" /></div>
            <div className="form-group"><label className="form-label">Konverzije</label>
              <input type="number" min="0" className="form-input" value={form.paid_ads_conversions} onChange={(e) => setField('paid_ads_conversions', e.target.value)} placeholder="npr. 50" /></div>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="card">
        <h3 className="section-title">Sažetak</h3>
        <div className="form-group">
          <label className="form-label">Pregled Aktivnosti</label>
          <textarea className="form-textarea" rows={5} value={form.summary_text}
            onChange={(e) => setField('summary_text', e.target.value)} placeholder="Kratki sažetak social media aktivnosti tijekom mjeseca..." />
        </div>

        <h4 className="sub green">✨ Istaknuto</h4>
        <div className="list-inputs">
          {form.highlights.map((h, i) => (
            <div key={i} className="list-input-row">
              <span>{i + 1}</span>
              <input type="text" className="form-input" value={h} onChange={(e) => setListItem('highlights', i, e.target.value)} placeholder={`Istaknuta stavka ${i + 1}...`} />
              <button type="button" className="icon-btn" onClick={() => removeListItem('highlights', i)}>×</button>
            </div>
          ))}
        </div>
        <button type="button" className="add-btn" onClick={() => addListItem('highlights')}>+ Dodaj</button>

        <h4 className="sub blue" style={{ marginTop: '24px' }}>💡 Preporuke</h4>
        <div className="list-inputs">
          {form.recommendations.map((r, i) => (
            <div key={i} className="list-input-row">
              <span className="blue-num">{i + 1}</span>
              <input type="text" className="form-input" value={r} onChange={(e) => setListItem('recommendations', i, e.target.value)} placeholder={`Preporuka ${i + 1}...`} />
              <button type="button" className="icon-btn" onClick={() => removeListItem('recommendations', i)}>×</button>
            </div>
          ))}
        </div>
        <button type="button" className="add-btn" onClick={() => addListItem('recommendations')}>+ Dodaj</button>
      </div>

      <div className="edit-footer">
        <button className="btn btn-secondary" onClick={onCancel} disabled={saving}>Odustani</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Spremanje...' : 'Spremi izmjene'}
        </button>
      </div>
    </div>
  );
}
