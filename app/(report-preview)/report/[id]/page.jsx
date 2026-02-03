// app/(report-preview)/report/[id]/page.jsx
// Monthly Maintenance Report Preview - Client-facing web view (Croatian)

'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const CROATIAN_MONTHS = [
  'Siječanj', 'Veljača', 'Ožujak', 'Travanj', 'Svibanj', 'Lipanj',
  'Srpanj', 'Kolovoz', 'Rujan', 'Listopad', 'Studeni', 'Prosinac'
];

export default function ReportPreview() {
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
    style.id = 'hide-header-footer';
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
      const styleEl = document.getElementById('hide-header-footer');
      if (styleEl) styleEl.remove();
    };
  }, [params.id, isPdfMode]);

  const loadReport = async () => {
    try {
      const { data, error } = await supabase
        .from('maintenance_reports')
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
            .from('maintenance_reports')
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
      const response = await fetch(`/api/maintenance-reports/${params.id}/pdf`);
      if (!response.ok) throw new Error('PDF generation failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      a.download = filenameMatch ? filenameMatch[1] : `Izvjestaj_${reportData.reference || 'MR'}.pdf`;
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

  const formatDuration = (seconds) => {
    if (!seconds) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  const getScoreColor = (score) => {
    if (score === null || score === undefined) return '#666';
    if (score >= 90) return '#00FF94';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score === null || score === undefined) return 'N/A';
    if (score >= 90) return 'Odlično';
    if (score >= 50) return 'Potrebno poboljšanje';
    return 'Loše';
  };

  const getChangeClass = (value) => {
    if (value === null || value === undefined) return '';
    return value >= 0 ? 'positive' : 'negative';
  };

  const formatChange = (value) => {
    if (value === null || value === undefined) return '-';
    return value >= 0 ? `+${value}%` : `${value}%`;
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
            border-top-color: #00FF94;
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

  const lighthouse = reportData.lighthouse || {};
  const analytics = reportData.analytics || {};
  const comparison = reportData.analytics_comparison || {};

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
          border-color: #00FF94;
        }

        .btn-download:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner-small {
          width: 16px;
          height: 16px;
          border: 2px solid #2A2A2A;
          border-top-color: #00FF94;
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
          background: rgba(0, 255, 148, 0.1);
          color: #00FF94;
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 24px;
          border: 1px solid rgba(0, 255, 148, 0.2);
        }

        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 16px;
          background: linear-gradient(135deg, #fff 0%, #00FF94 100%);
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
          color: #00FF94;
          font-family: monospace;
          font-weight: 600;
        }

        .meta-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .meta-card {
          background: #1a1a1a;
          border: 1px solid #2A2A2A;
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s ease;
        }

        .meta-card:hover {
          border-color: #00FF94;
          transform: translateY(-4px);
        }

        .meta-label {
          font-size: 0.85rem;
          color: #8F8F8F;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .meta-value {
          font-size: 1.3rem;
          color: #00FF94;
          font-weight: 700;
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

        /* Lighthouse Section */
        .lighthouse-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }

        @media (max-width: 900px) {
          .lighthouse-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .lighthouse-card {
          background: #1a1a1a;
          border: 1px solid #2A2A2A;
          border-radius: 20px;
          padding: 32px 24px;
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .lighthouse-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--score-color);
        }

        .lighthouse-card:hover {
          border-color: var(--score-color);
          transform: translateY(-4px);
        }

        .lighthouse-score {
          font-size: 3.5rem;
          font-weight: 900;
          line-height: 1;
          margin-bottom: 12px;
          color: var(--score-color);
        }

        .lighthouse-label {
          font-size: 1rem;
          color: #fff;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .lighthouse-status {
          font-size: 0.8rem;
          color: #8F8F8F;
        }

        /* Core Web Vitals */
        .vitals-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        @media (max-width: 640px) {
          .vitals-grid {
            grid-template-columns: 1fr;
          }
        }

        .vital-card {
          background: #1a1a1a;
          border: 1px solid #2A2A2A;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .vital-icon {
          width: 56px;
          height: 56px;
          background: rgba(0, 255, 148, 0.1);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .vital-info {
          flex: 1;
        }

        .vital-name {
          font-size: 0.9rem;
          color: #8F8F8F;
          margin-bottom: 4px;
        }

        .vital-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--vital-color, #00FF94);
        }

        .vital-status {
          font-size: 0.8rem;
          margin-top: 4px;
        }

        /* Analytics Section */
        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }

        @media (max-width: 900px) {
          .analytics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .analytics-grid {
            grid-template-columns: 1fr;
          }
        }

        .analytics-card {
          background: #1a1a1a;
          border: 1px solid #2A2A2A;
          border-radius: 20px;
          padding: 28px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .analytics-card:hover {
          border-color: #3b82f6;
          transform: translateY(-4px);
        }

        .analytics-value {
          font-size: 2.5rem;
          font-weight: 900;
          color: #3b82f6;
          line-height: 1;
          margin-bottom: 8px;
        }

        .analytics-label {
          font-size: 0.95rem;
          color: #8F8F8F;
          margin-bottom: 12px;
        }

        .analytics-change {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .analytics-change.positive {
          background: rgba(0, 255, 148, 0.15);
          color: #00FF94;
        }

        .analytics-change.negative {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
        }

        /* Secondary Stats */
        .secondary-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
        }

        .secondary-stat {
          background: #1a1a1a;
          border: 1px solid #2A2A2A;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }

        .secondary-stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 4px;
        }

        .secondary-stat-label {
          font-size: 0.8rem;
          color: #666;
        }

        /* Summary Section */
        .summary-text {
          background: #1a1a1a;
          border: 1px solid #2A2A2A;
          border-radius: 16px;
          padding: 32px;
          font-size: 1.1rem;
          line-height: 1.8;
          color: #C4C4C4;
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

          .meta-cards {
            grid-template-columns: 1fr;
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
          <span className="hero-badge">Mjesečni Izvještaj Održavanja</span>
          <h1 className="hero-title">{reportData.periodDisplay}</h1>
          <p className="hero-subtitle">
            Pripremljeno za {reportData.clientName}
            <br />
            <span className="hero-reference">{reportData.reference}</span>
          </p>

          <div className="meta-cards">
            <div className="meta-card">
              <div className="meta-label">Klijent</div>
              <div className="meta-value" style={{ fontSize: '1rem', color: '#fff' }}>
                {reportData.clientName}
              </div>
            </div>
            <div className="meta-card">
              <div className="meta-label">Ugovor</div>
              <div className="meta-value" style={{ fontSize: '1rem', color: '#fff' }}>
                {reportData.contractName}
              </div>
            </div>
            <div className="meta-card">
              <div className="meta-label">Razdoblje</div>
              <div className="meta-value" style={{ fontSize: '1rem', color: '#fff' }}>
                {formatDate(reportData.period_start)} - {formatDate(reportData.period_end)}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="content-wrapper">
          {/* Lighthouse Scores */}
          {(lighthouse.performance || lighthouse.accessibility || lighthouse.best_practices || lighthouse.seo) && (
            <section className="section">
              <h2 className="section-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00FF94" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                  <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                </svg>
                Lighthouse Rezultati
              </h2>

              <div className="lighthouse-grid">
                {lighthouse.performance !== null && lighthouse.performance !== undefined && (
                  <div className="lighthouse-card" style={{ '--score-color': getScoreColor(lighthouse.performance) }}>
                    <div className="lighthouse-score">{lighthouse.performance}</div>
                    <div className="lighthouse-label">Performance</div>
                    <div className="lighthouse-status">{getScoreLabel(lighthouse.performance)}</div>
                  </div>
                )}
                {lighthouse.accessibility !== null && lighthouse.accessibility !== undefined && (
                  <div className="lighthouse-card" style={{ '--score-color': getScoreColor(lighthouse.accessibility) }}>
                    <div className="lighthouse-score">{lighthouse.accessibility}</div>
                    <div className="lighthouse-label">Accessibility</div>
                    <div className="lighthouse-status">{getScoreLabel(lighthouse.accessibility)}</div>
                  </div>
                )}
                {lighthouse.best_practices !== null && lighthouse.best_practices !== undefined && (
                  <div className="lighthouse-card" style={{ '--score-color': getScoreColor(lighthouse.best_practices) }}>
                    <div className="lighthouse-score">{lighthouse.best_practices}</div>
                    <div className="lighthouse-label">Best Practices</div>
                    <div className="lighthouse-status">{getScoreLabel(lighthouse.best_practices)}</div>
                  </div>
                )}
                {lighthouse.seo !== null && lighthouse.seo !== undefined && (
                  <div className="lighthouse-card" style={{ '--score-color': getScoreColor(lighthouse.seo) }}>
                    <div className="lighthouse-score">{lighthouse.seo}</div>
                    <div className="lighthouse-label">SEO</div>
                    <div className="lighthouse-status">{getScoreLabel(lighthouse.seo)}</div>
                  </div>
                )}
              </div>

              {/* Core Web Vitals */}
              {(lighthouse.lcp || lighthouse.cls) && (
                <div className="vitals-grid">
                  {lighthouse.lcp && (
                    <div className="vital-card">
                      <div className="vital-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00FF94" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </div>
                      <div className="vital-info">
                        <div className="vital-name">Largest Contentful Paint (LCP)</div>
                        <div className="vital-value" style={{ '--vital-color': lighthouse.lcp <= 2.5 ? '#00FF94' : lighthouse.lcp <= 4 ? '#f59e0b' : '#ef4444' }}>
                          {lighthouse.lcp}s
                        </div>
                        <div className="vital-status" style={{ color: lighthouse.lcp <= 2.5 ? '#00FF94' : lighthouse.lcp <= 4 ? '#f59e0b' : '#ef4444' }}>
                          {lighthouse.lcp <= 2.5 ? 'Dobro' : lighthouse.lcp <= 4 ? 'Potrebno poboljšanje' : 'Loše'}
                        </div>
                      </div>
                    </div>
                  )}
                  {lighthouse.cls !== null && lighthouse.cls !== undefined && (
                    <div className="vital-card">
                      <div className="vital-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00FF94" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <line x1="3" y1="9" x2="21" y2="9" />
                          <line x1="9" y1="21" x2="9" y2="9" />
                        </svg>
                      </div>
                      <div className="vital-info">
                        <div className="vital-name">Cumulative Layout Shift (CLS)</div>
                        <div className="vital-value" style={{ '--vital-color': lighthouse.cls <= 0.1 ? '#00FF94' : lighthouse.cls <= 0.25 ? '#f59e0b' : '#ef4444' }}>
                          {lighthouse.cls}
                        </div>
                        <div className="vital-status" style={{ color: lighthouse.cls <= 0.1 ? '#00FF94' : lighthouse.cls <= 0.25 ? '#f59e0b' : '#ef4444' }}>
                          {lighthouse.cls <= 0.1 ? 'Dobro' : lighthouse.cls <= 0.25 ? 'Potrebno poboljšanje' : 'Loše'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {/* Google Analytics */}
          {(analytics.sessions || analytics.users || analytics.pageviews) && (
            <section className="section">
              <h2 className="section-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
                Google Analytics
              </h2>

              <div className="analytics-grid">
                {analytics.sessions !== null && analytics.sessions !== undefined && (
                  <div className="analytics-card">
                    <div className="analytics-value">{analytics.sessions.toLocaleString()}</div>
                    <div className="analytics-label">Sesije</div>
                    {comparison.sessions_change !== null && comparison.sessions_change !== undefined && (
                      <span className={`analytics-change ${getChangeClass(comparison.sessions_change)}`}>
                        {formatChange(comparison.sessions_change)}
                      </span>
                    )}
                  </div>
                )}
                {analytics.users !== null && analytics.users !== undefined && (
                  <div className="analytics-card">
                    <div className="analytics-value">{analytics.users.toLocaleString()}</div>
                    <div className="analytics-label">Korisnici</div>
                    {comparison.users_change !== null && comparison.users_change !== undefined && (
                      <span className={`analytics-change ${getChangeClass(comparison.users_change)}`}>
                        {formatChange(comparison.users_change)}
                      </span>
                    )}
                  </div>
                )}
                {analytics.pageviews !== null && analytics.pageviews !== undefined && (
                  <div className="analytics-card">
                    <div className="analytics-value">{analytics.pageviews.toLocaleString()}</div>
                    <div className="analytics-label">Pregledi Stranica</div>
                    {comparison.pageviews_change !== null && comparison.pageviews_change !== undefined && (
                      <span className={`analytics-change ${getChangeClass(comparison.pageviews_change)}`}>
                        {formatChange(comparison.pageviews_change)}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Secondary Stats */}
              {(analytics.bounce_rate || analytics.avg_session_duration || analytics.new_users_percentage) && (
                <div className="secondary-stats">
                  {analytics.bounce_rate !== null && analytics.bounce_rate !== undefined && (
                    <div className="secondary-stat">
                      <div className="secondary-stat-value">{analytics.bounce_rate}%</div>
                      <div className="secondary-stat-label">Bounce Rate</div>
                    </div>
                  )}
                  {analytics.avg_session_duration !== null && analytics.avg_session_duration !== undefined && (
                    <div className="secondary-stat">
                      <div className="secondary-stat-value">{formatDuration(analytics.avg_session_duration)}</div>
                      <div className="secondary-stat-label">Prosječno Trajanje</div>
                    </div>
                  )}
                  {analytics.new_users_percentage !== null && analytics.new_users_percentage !== undefined && (
                    <div className="secondary-stat">
                      <div className="secondary-stat-value">{analytics.new_users_percentage}%</div>
                      <div className="secondary-stat-label">Novi Korisnici</div>
                    </div>
                  )}
                </div>
              )}
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
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                Sažetak Mjeseca
              </h2>
              <div className="summary-text">
                {reportData.summary_text}
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
