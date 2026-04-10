// app/(report-preview)/social-report/[id]/page.jsx
// Monthly Social Media Report Preview - Client-facing web view (Croatian)

'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const CROATIAN_MONTHS = [
  'Siječanj', 'Veljača', 'Ožujak', 'Travanj', 'Svibanj', 'Lipanj',
  'Srpanj', 'Kolovoz', 'Rujan', 'Listopad', 'Studeni', 'Prosinac'
];

const PLATFORM_CONFIG = {
  instagram: { label: 'Instagram', color: '#E4405F', gradient: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' },
  facebook: { label: 'Facebook', color: '#1877F2', gradient: 'linear-gradient(45deg, #1877F2, #3b5998)' },
  linkedin: { label: 'LinkedIn', color: '#0A66C2', gradient: 'linear-gradient(45deg, #0A66C2, #004182)' },
  tiktok: { label: 'TikTok', color: '#000000', gradient: 'linear-gradient(45deg, #00f2ea, #ff0050)' }
};

const CONTENT_LABELS = {
  fotografija: { label: 'Fotografija', icon: '📷' },
  talkingHead: { label: 'Talking Head', icon: '🎤' },
  videoCarousel: { label: 'Video Carousel', icon: '🎬' },
  staticCarousel: { label: 'Static Carousel', icon: '🖼️' },
  reel: { label: 'Reel/Short', icon: '📱' },
  story: { label: 'Story', icon: '⏱️' }
};

export default function SocialReportPreview() {
  const params = useParams();
  const searchParams = useSearchParams();
  const isPdfMode = searchParams.get('pdf') === 'true';
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  useEffect(() => {
    loadReport();

    // Force hide header/footer
    const style = document.createElement('style');
    style.id = 'hide-header-footer-social';
    style.innerHTML = `
      body > header,
      body > footer,
      body > nav,
      #__next > header,
      #__next > footer,
      #__next > nav,
      [data-testid="header"],
      [data-testid="footer"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        height: 0 !important;
        overflow: hidden !important;
        position: absolute !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const styleEl = document.getElementById('hide-header-footer-social');
      if (styleEl) styleEl.remove();
    };
  }, [params.id, isPdfMode]);

  const loadReport = async () => {
    try {
      const { data, error } = await supabase
        .from('social_media_reports')
        .select(`
          *,
          recurring_contracts (
            id,
            name,
            clients (
              id,
              name,
              company
            )
          )
        `)
        .eq('id', params.id)
        .single();

      if (error) throw error;

      if (data) {
        // Increment view count if not in PDF mode
        if (!isPdfMode) {
          await supabase
            .from('social_media_reports')
            .update({ view_count: (data.view_count || 0) + 1 })
            .eq('id', params.id);
        }

        setReportData({
          ...data,
          clientName: data.recurring_contracts?.clients?.company ||
            data.recurring_contracts?.clients?.name || 'Klijent',
          contractName: data.recurring_contracts?.name || '',
          monthName: CROATIAN_MONTHS[data.report_month - 1],
          periodDisplay: `${CROATIAN_MONTHS[data.report_month - 1]} ${data.report_year}`
        });
      }
    } catch (error) {
      console.error('Error loading report:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      const response = await fetch(`/api/social-media-reports/${params.id}/pdf`);
      if (!response.ok) throw new Error('PDF generation failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      a.download = filenameMatch ? filenameMatch[1] : `SocialMedia_${reportData.reference || 'SMR'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Greška pri generiranju PDF-a. Pokušajte ponovo.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('hr-HR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <style jsx>{`
          .loading-screen {
            min-height: 100vh;
            background: #0F0F0F;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .spinner {
            width: 50px;
            height: 50px;
            border: 3px solid #1a1a1a;
            border-top-color: #E4405F;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0F0F0F',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px', fontWeight: '900' }}>404</h1>
        <p style={{ color: '#8F8F8F' }}>Izvještaj nije pronađen</p>
      </div>
    );
  }

  const platforms = reportData.platforms || {};
  const contentDelivered = reportData.content_delivered || {};
  const contentPlanned = reportData.content_planned || {};
  const topPosts = reportData.top_posts || [];

  return (
    <>
      <style jsx>{`
        @import url('https://api.fontshare.com/v2/css?f[]=nohemi@400,500,600,700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: #0F0F0F;
        }

        .report-page {
          font-family: 'Nohemi', sans-serif;
          background: #0F0F0F;
          color: #fff;
          min-height: 100vh;
        }

        /* Top Navigation */
        .top-nav {
          position: sticky;
          top: 0;
          background: rgba(15, 15, 15, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #1a1a1a;
          z-index: 100;
          animation: slide-down 0.6s ease-out;
        }

        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 24px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
        }

        .nav-actions {
          display: flex;
          gap: 12px;
        }

        .btn {
          padding: 12px 24px;
          border-radius: 100px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: none;
          font-family: 'Nohemi', sans-serif;
        }

        .btn-download {
          background: transparent;
          color: #fff;
          border: 1px solid #2A2A2A;
        }

        .btn-download:hover {
          background: #1a1a1a;
          border-color: #E4405F;
        }

        .btn-download:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner-small {
          width: 16px;
          height: 16px;
          border: 2px solid #2A2A2A;
          border-top-color: #E4405F;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        /* Hero Section */
        .hero {
          max-width: 1400px;
          margin: 0 auto;
          padding: 80px 40px;
          animation: fade-in-up 0.8s ease-out;
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hero-badge {
          display: inline-block;
          background: linear-gradient(45deg, rgba(228, 64, 95, 0.2), rgba(59, 130, 246, 0.2));
          color: #E4405F;
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 24px;
          border: 1px solid rgba(228, 64, 95, 0.3);
        }

        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 16px;
          background: linear-gradient(135deg, #fff 0%, #E4405F 50%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: #8F8F8F;
          margin-bottom: 48px;
        }

        .hero-reference {
          color: #E4405F;
          font-family: monospace;
          font-weight: 600;
        }

        /* Stats Hero Cards */
        .stats-hero {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 60px;
        }

        @media (max-width: 900px) {
          .stats-hero {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 500px) {
          .stats-hero {
            grid-template-columns: 1fr;
          }
        }

        .stat-hero-card {
          background: #1a1a1a;
          border: 1px solid #2A2A2A;
          border-radius: 20px;
          padding: 28px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .stat-hero-card:hover {
          border-color: #E4405F;
          transform: translateY(-4px);
        }

        .stat-hero-value {
          font-size: 2.5rem;
          font-weight: 900;
          color: #00FF94;
          line-height: 1;
          margin-bottom: 8px;
        }

        .stat-hero-label {
          font-size: 0.85rem;
          color: #8F8F8F;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Main Content */
        .content-wrapper {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px 80px;
        }

        .section {
          margin-bottom: 60px;
          animation: fade-in-up 1s ease-out backwards;
        }

        .section:nth-child(2) { animation-delay: 0.2s; }
        .section:nth-child(3) { animation-delay: 0.3s; }
        .section:nth-child(4) { animation-delay: 0.4s; }

        .section-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        /* Content Delivery Grid */
        .content-delivery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
        }

        .content-card {
          background: #1a1a1a;
          border: 1px solid #2A2A2A;
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .content-card:hover {
          border-color: #00FF94;
        }

        .content-icon {
          font-size: 2rem;
          margin-bottom: 12px;
        }

        .content-label {
          font-size: 0.9rem;
          color: #888;
          margin-bottom: 16px;
        }

        .content-comparison {
          display: flex;
          justify-content: center;
          gap: 24px;
        }

        .content-stat {
          text-align: center;
        }

        .content-stat-value {
          font-size: 1.5rem;
          font-weight: 700;
        }

        .content-stat-label {
          font-size: 0.7rem;
          color: #666;
          text-transform: uppercase;
        }

        /* Platform Cards */
        .platform-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .platform-card {
          background: #1a1a1a;
          border: 1px solid #2A2A2A;
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .platform-card:hover {
          transform: translateY(-4px);
        }

        .platform-header {
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .platform-icon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: #fff;
        }

        .platform-info {
          flex: 1;
        }

        .platform-name {
          font-size: 1.2rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 4px;
        }

        .platform-followers {
          font-size: 1.5rem;
          font-weight: 900;
          color: #fff;
        }

        .platform-change {
          font-size: 0.9rem;
          font-weight: 600;
          margin-left: 8px;
        }

        .platform-metrics {
          padding: 0 24px 24px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .platform-metric {
          background: #0a0a0a;
          border-radius: 12px;
          padding: 16px;
          text-align: center;
        }

        .platform-metric-value {
          font-size: 1.2rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 4px;
        }

        .platform-metric-label {
          font-size: 0.7rem;
          color: #666;
          text-transform: uppercase;
        }

        /* Top Posts */
        .top-posts-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .top-post-card {
          background: #1a1a1a;
          border: 1px solid #2A2A2A;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          gap: 20px;
          align-items: flex-start;
          transition: all 0.3s ease;
        }

        .top-post-card:hover {
          border-color: #f59e0b;
        }

        .top-post-rank {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 1.2rem;
          color: #000;
          flex-shrink: 0;
        }

        .top-post-content {
          flex: 1;
        }

        .top-post-badges {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }

        .top-post-badge {
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .top-post-description {
          color: #ccc;
          line-height: 1.6;
          margin-bottom: 12px;
        }

        .top-post-stats {
          display: flex;
          gap: 24px;
        }

        .top-post-stat {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #888;
          font-size: 0.9rem;
        }

        .top-post-stat strong {
          color: #fff;
        }

        /* Paid Ads */
        .paid-ads-card {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05));
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 20px;
          padding: 32px;
        }

        .paid-ads-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
        }

        .paid-ads-item {
          text-align: center;
        }

        .paid-ads-value {
          font-size: 2rem;
          font-weight: 900;
          color: #f59e0b;
          margin-bottom: 4px;
        }

        .paid-ads-label {
          font-size: 0.8rem;
          color: #888;
          text-transform: uppercase;
        }

        /* Highlights & Recommendations */
        .highlights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 24px;
        }

        @media (max-width: 800px) {
          .highlights-grid {
            grid-template-columns: 1fr;
          }
        }

        .highlight-card {
          background: #1a1a1a;
          border: 1px solid #2A2A2A;
          border-radius: 16px;
          padding: 28px;
        }

        .highlight-card.success {
          border-left: 4px solid #00FF94;
        }

        .highlight-card.info {
          border-left: 4px solid #3b82f6;
        }

        .highlight-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .highlight-list {
          list-style: none;
        }

        .highlight-list li {
          padding: 12px 0;
          border-bottom: 1px solid #2A2A2A;
          color: #C4C4C4;
          display: flex;
          align-items: start;
          gap: 12px;
          line-height: 1.6;
        }

        .highlight-list li:last-child {
          border-bottom: none;
        }

        .highlight-number {
          width: 24px;
          height: 24px;
          background: #00FF94;
          color: #0F0F0F;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .recommendation-number {
          width: 24px;
          height: 24px;
          background: #3b82f6;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        /* Summary */
        .summary-card {
          background: #1a1a1a;
          border: 1px solid #2A2A2A;
          border-radius: 16px;
          padding: 32px;
        }

        .summary-text {
          color: #C4C4C4;
          font-size: 1.1rem;
          line-height: 1.8;
        }

        /* Footer */
        .report-footer {
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px;
          border-top: 1px solid #2A2A2A;
          text-align: center;
        }

        .footer-logo {
          font-size: 1.5rem;
          font-weight: 700;
          color: #00FF94;
          margin-bottom: 16px;
        }

        .footer-text {
          color: #8F8F8F;
          font-size: 0.9rem;
          line-height: 1.8;
        }

        .footer-contact {
          margin-top: 16px;
          color: #fff;
        }

        .footer-contact a {
          color: #00FF94;
          text-decoration: none;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .nav-container {
            padding: 20px;
          }

          .hero {
            padding: 60px 20px;
          }

          .content-wrapper {
            padding: 0 20px 60px;
          }
        }

        @media (max-width: 640px) {
          .nav-container {
            flex-direction: column;
            gap: 16px;
            padding: 16px;
          }

          .nav-actions {
            width: 100%;
            flex-direction: column;
          }

          .btn {
            width: 100%;
            justify-content: center;
          }

          .hero-title {
            font-size: 2rem;
          }
        }

        /* PDF Mode */
        .pdf-mode .top-nav {
          display: none;
        }
      `}</style>

      <div className={`report-page ${isPdfMode ? 'pdf-mode' : ''}`}>
        {/* Top Navigation */}
        <nav className="top-nav">
          <div className="nav-container">
            <div className="logo">NineFold</div>
            <div className="nav-actions">
              {!isPdfMode && (
                <button
                  onClick={downloadPdf}
                  disabled={downloadingPdf}
                  className="btn btn-download"
                >
                  {downloadingPdf ? (
                    <>
                      <span className="spinner-small"></span>
                      Generiranje PDF-a...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Preuzmi PDF
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero">
          <span className="hero-badge">Mjesečni Izvještaj Društvenih Mreža</span>
          <h1 className="hero-title">{reportData.periodDisplay}</h1>
          <p className="hero-subtitle">
            Pripremljeno za {reportData.clientName}
            <br />
            <span className="hero-reference">{reportData.reference}</span>
          </p>

          {/* Stats Overview */}
          <div className="stats-hero">
            <div className="stat-hero-card">
              <div className="stat-hero-value">{reportData.posts_published || 0}</div>
              <div className="stat-hero-label">Objave</div>
            </div>
            <div className="stat-hero-card">
              <div className="stat-hero-value">{(reportData.total_reach || 0).toLocaleString()}</div>
              <div className="stat-hero-label">Ukupni Doseg</div>
            </div>
            <div className="stat-hero-card">
              <div className="stat-hero-value">{(reportData.total_engagement || 0).toLocaleString()}</div>
              <div className="stat-hero-label">Engagement</div>
            </div>
            <div className="stat-hero-card">
              <div className="stat-hero-value" style={{ color: (reportData.follower_growth || 0) >= 0 ? '#00FF94' : '#ef4444' }}>
                {(reportData.follower_growth || 0) >= 0 ? '+' : ''}{reportData.follower_growth || 0}
              </div>
              <div className="stat-hero-label">Rast Pratitelja</div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="content-wrapper">
          {/* Content Delivery */}
          {Object.keys(contentDelivered).length > 0 && (
            <section className="section">
              <h2 className="section-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00FF94" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
                Isporučeni Sadržaj
              </h2>
              <div className="content-delivery-grid">
                {Object.keys(contentDelivered).map(key => {
                  const config = CONTENT_LABELS[key] || { label: key, icon: '📄' };
                  const delivered = contentDelivered[key] || 0;
                  const planned = contentPlanned[key] || 0;
                  return (
                    <div key={key} className="content-card">
                      <div className="content-icon">{config.icon}</div>
                      <div className="content-label">{config.label}</div>
                      <div className="content-comparison">
                        <div className="content-stat">
                          <div className="content-stat-value" style={{ color: '#666' }}>{planned}</div>
                          <div className="content-stat-label">Plan</div>
                        </div>
                        <div className="content-stat">
                          <div className="content-stat-value" style={{ color: delivered >= planned ? '#00FF94' : '#f59e0b' }}>
                            {delivered}
                          </div>
                          <div className="content-stat-label">Isporučeno</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Platform Metrics */}
          {Object.keys(platforms).length > 0 && (
            <section className="section">
              <h2 className="section-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
                Metrike Po Platformi
              </h2>
              <div className="platform-grid">
                {Object.entries(platforms).map(([key, data]) => {
                  const config = PLATFORM_CONFIG[key];
                  if (!config || !data) return null;

                  return (
                    <div key={key} className="platform-card" style={{ borderTopColor: config.color, borderTopWidth: '3px' }}>
                      <div className="platform-header">
                        <div className="platform-icon" style={{ background: config.gradient || config.color }}>
                          {key === 'instagram' && '📸'}
                          {key === 'facebook' && '👍'}
                          {key === 'linkedin' && '💼'}
                          {key === 'tiktok' && '🎵'}
                        </div>
                        <div className="platform-info">
                          <div className="platform-name">{config.label}</div>
                          <div>
                            <span className="platform-followers">{(data.followers || 0).toLocaleString()}</span>
                            {data.follower_change && (
                              <span className="platform-change" style={{ color: data.follower_change >= 0 ? '#00FF94' : '#ef4444' }}>
                                {data.follower_change >= 0 ? '+' : ''}{data.follower_change}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="platform-metrics">
                        {data.posts && (
                          <div className="platform-metric">
                            <div className="platform-metric-value">{data.posts}</div>
                            <div className="platform-metric-label">Objave</div>
                          </div>
                        )}
                        {(data.reach || data.views) && (
                          <div className="platform-metric">
                            <div className="platform-metric-value">{(data.reach || data.views || 0).toLocaleString()}</div>
                            <div className="platform-metric-label">{data.views ? 'Pregledi' : 'Doseg'}</div>
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
            </section>
          )}

          {/* Top Posts */}
          {topPosts.length > 0 && (
            <section className="section">
              <h2 className="section-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                Top Objave Mjeseca
              </h2>
              <div className="top-posts-list">
                {topPosts.map((post, i) => {
                  const platformConfig = PLATFORM_CONFIG[post.platform];
                  return (
                    <div key={i} className="top-post-card">
                      <div className="top-post-rank">{i + 1}</div>
                      <div className="top-post-content">
                        <div className="top-post-badges">
                          <span
                            className="top-post-badge"
                            style={{ background: platformConfig?.color || '#333', color: '#fff' }}
                          >
                            {platformConfig?.label || post.platform}
                          </span>
                          <span className="top-post-badge" style={{ background: '#2A2A2A', color: '#fff' }}>
                            {post.type}
                          </span>
                        </div>
                        {post.description && (
                          <div className="top-post-description">{post.description}</div>
                        )}
                        <div className="top-post-stats">
                          {post.reach && (
                            <div className="top-post-stat">
                              Doseg: <strong>{post.reach.toLocaleString()}</strong>
                            </div>
                          )}
                          {post.engagement && (
                            <div className="top-post-stat">
                              Engagement: <strong>{post.engagement.toLocaleString()}</strong>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Paid Ads */}
          {reportData.paid_ads_enabled && (
            <section className="section">
              <h2 className="section-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                Plaćeni Oglasi
              </h2>
              <div className="paid-ads-card">
                <div className="paid-ads-grid">
                  {reportData.paid_ads_spend && (
                    <div className="paid-ads-item">
                      <div className="paid-ads-value">€{reportData.paid_ads_spend}</div>
                      <div className="paid-ads-label">Potrošnja</div>
                    </div>
                  )}
                  {reportData.paid_ads_impressions && (
                    <div className="paid-ads-item">
                      <div className="paid-ads-value">{reportData.paid_ads_impressions.toLocaleString()}</div>
                      <div className="paid-ads-label">Impresije</div>
                    </div>
                  )}
                  {reportData.paid_ads_clicks && (
                    <div className="paid-ads-item">
                      <div className="paid-ads-value">{reportData.paid_ads_clicks.toLocaleString()}</div>
                      <div className="paid-ads-label">Klikovi</div>
                    </div>
                  )}
                  {reportData.paid_ads_conversions && (
                    <div className="paid-ads-item">
                      <div className="paid-ads-value">{reportData.paid_ads_conversions}</div>
                      <div className="paid-ads-label">Konverzije</div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Summary */}
          {reportData.summary_text && (
            <section className="section">
              <h2 className="section-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8F8F8F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                Sažetak Mjeseca
              </h2>
              <div className="summary-card">
                <p className="summary-text">{reportData.summary_text}</p>
              </div>
            </section>
          )}

          {/* Highlights & Recommendations */}
          {((reportData.highlights && reportData.highlights.length > 0) ||
            (reportData.recommendations && reportData.recommendations.length > 0)) && (
            <section className="section">
              <div className="highlights-grid">
                {reportData.highlights && reportData.highlights.length > 0 && (
                  <div className="highlight-card success">
                    <h3 className="highlight-title">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00FF94" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      Istaknuto Ovaj Mjesec
                    </h3>
                    <ul className="highlight-list">
                      {reportData.highlights.map((item, i) => (
                        <li key={i}>
                          <span className="highlight-number">{i + 1}</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {reportData.recommendations && reportData.recommendations.length > 0 && (
                  <div className="highlight-card info">
                    <h3 className="highlight-title">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="9" y1="18" x2="15" y2="18" />
                        <line x1="10" y1="22" x2="14" y2="22" />
                        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
                      </svg>
                      Preporuke
                    </h3>
                    <ul className="highlight-list">
                      {reportData.recommendations.map((item, i) => (
                        <li key={i}>
                          <span className="recommendation-number">{i + 1}</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <footer className="report-footer">
          <div className="footer-logo">NineFold</div>
          <div className="footer-text">
            Hvala Vam na povjerenju.<br />
            Za sva pitanja i dodatne informacije, slobodno nas kontaktirajte.
          </div>
          <div className="footer-contact">
            <a href="mailto:hello@ninefold.eu">hello@ninefold.eu</a> · <a href="https://ninefold.eu">ninefold.eu</a>
          </div>
        </footer>
      </div>
    </>
  );
}
