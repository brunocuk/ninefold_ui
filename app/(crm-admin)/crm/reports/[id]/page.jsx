// app/(crm-admin)/crm/reports/[id]/page.jsx
// View and manage maintenance report

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
  generated: { label: 'Generiran', bg: '#3b82f6', color: '#fff' },
  sent: { label: 'Poslan', bg: '#00FF94', color: '#000' }
};

export default function ReportDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showSendModal, setShowSendModal] = useState(searchParams.get('send') === 'true');
  const [sendEmail, setSendEmail] = useState('');

  useEffect(() => {
    loadReport();
  }, [params.id]);

  const loadReport = async () => {
    try {
      const response = await fetch(`/api/maintenance-reports/${params.id}`);
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
      router.push('/crm/reports');
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
      const response = await fetch(`/api/maintenance-reports/${params.id}/send`, {
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

  const getScoreColor = (score) => {
    if (!score && score !== 0) return '#888';
    if (score >= 90) return '#00FF94';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const formatChange = (value) => {
    if (value === null || value === undefined) return null;
    return value >= 0 ? `+${value}%` : `${value}%`;
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

  const clientName = report.recurring_contracts?.clients?.company ||
    report.recurring_contracts?.clients?.name || 'Nepoznat klijent';
  const statusStyle = STATUS_BADGES[report.status] || STATUS_BADGES.draft;
  const lighthouse = report.lighthouse || {};
  const analytics = report.analytics || {};
  const analyticsComparison = report.analytics_comparison || {};

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
          color: #00FF94;
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

        /* Lighthouse Scores */
        .lighthouse-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        @media (max-width: 768px) {
          .lighthouse-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .lighthouse-item {
          text-align: center;
          padding: 20px 12px;
          background: #0a0a0a;
          border-radius: 10px;
          border: 1px solid #333;
        }

        .lighthouse-score {
          font-size: 2.5rem;
          font-weight: 900;
          line-height: 1;
          margin-bottom: 6px;
        }

        .lighthouse-label {
          font-size: 0.75rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Core Web Vitals */
        .vitals-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-top: 16px;
        }

        .vital-item {
          padding: 16px;
          background: #0a0a0a;
          border-radius: 10px;
          border: 1px solid #333;
        }

        .vital-label {
          font-size: 0.75rem;
          color: #888;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .vital-value {
          font-size: 1.2rem;
          font-weight: 700;
          color: #fff;
        }

        /* Analytics Stats */
        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        @media (max-width: 768px) {
          .analytics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .analytics-item {
          text-align: center;
          padding: 20px 12px;
          background: #0a0a0a;
          border-radius: 10px;
          border: 1px solid #333;
        }

        .analytics-value {
          font-size: 1.8rem;
          font-weight: 900;
          color: #3b82f6;
          line-height: 1;
          margin-bottom: 4px;
        }

        .analytics-label {
          font-size: 0.75rem;
          color: #888;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .analytics-change {
          font-size: 0.85rem;
          font-weight: 700;
        }

        /* Summary Text */
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
          <Link href="/crm/reports" className="back-link">
            ← Natrag na izvještaje
          </Link>

          <div className="header-content">
            <div>
              <h1>{CROATIAN_MONTHS[report.report_month - 1]} {report.report_year}</h1>
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
                <a
                  href={`/report/${report.id}`}
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
                  href={`/api/maintenance-reports/${report.id}/pdf`}
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

        <div className="content-grid">
          <div>
            {/* Lighthouse Scores */}
            {(lighthouse.performance || lighthouse.accessibility || lighthouse.best_practices || lighthouse.seo) && (
              <div className="card">
                <div className="card-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00FF94" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                  </svg>
                  Lighthouse Rezultati
                </div>
                <div className="lighthouse-grid">
                  {lighthouse.performance !== null && lighthouse.performance !== undefined && (
                    <div className="lighthouse-item">
                      <div className="lighthouse-score" style={{ color: getScoreColor(lighthouse.performance) }}>
                        {lighthouse.performance}
                      </div>
                      <div className="lighthouse-label">Performance</div>
                    </div>
                  )}
                  {lighthouse.accessibility !== null && lighthouse.accessibility !== undefined && (
                    <div className="lighthouse-item">
                      <div className="lighthouse-score" style={{ color: getScoreColor(lighthouse.accessibility) }}>
                        {lighthouse.accessibility}
                      </div>
                      <div className="lighthouse-label">Accessibility</div>
                    </div>
                  )}
                  {lighthouse.best_practices !== null && lighthouse.best_practices !== undefined && (
                    <div className="lighthouse-item">
                      <div className="lighthouse-score" style={{ color: getScoreColor(lighthouse.best_practices) }}>
                        {lighthouse.best_practices}
                      </div>
                      <div className="lighthouse-label">Best Practices</div>
                    </div>
                  )}
                  {lighthouse.seo !== null && lighthouse.seo !== undefined && (
                    <div className="lighthouse-item">
                      <div className="lighthouse-score" style={{ color: getScoreColor(lighthouse.seo) }}>
                        {lighthouse.seo}
                      </div>
                      <div className="lighthouse-label">SEO</div>
                    </div>
                  )}
                </div>

                {/* Core Web Vitals */}
                {(lighthouse.lcp || lighthouse.cls) && (
                  <div className="vitals-grid">
                    {lighthouse.lcp && (
                      <div className="vital-item">
                        <div className="vital-label">LCP (Largest Contentful Paint)</div>
                        <div className="vital-value">{lighthouse.lcp}s</div>
                      </div>
                    )}
                    {lighthouse.cls !== null && lighthouse.cls !== undefined && (
                      <div className="vital-item">
                        <div className="vital-label">CLS (Cumulative Layout Shift)</div>
                        <div className="vital-value">{lighthouse.cls}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Analytics Stats */}
            {(analytics.sessions || analytics.users || analytics.pageviews) && (
              <div className="card">
                <div className="card-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                  Google Analytics
                </div>
                <div className="analytics-grid">
                  {analytics.sessions !== null && analytics.sessions !== undefined && (
                    <div className="analytics-item">
                      <div className="analytics-value">{analytics.sessions.toLocaleString()}</div>
                      <div className="analytics-label">Sesije</div>
                      {analyticsComparison.sessions_change !== null && analyticsComparison.sessions_change !== undefined && (
                        <div className="analytics-change" style={{ color: analyticsComparison.sessions_change >= 0 ? '#00FF94' : '#ef4444' }}>
                          {formatChange(analyticsComparison.sessions_change)}
                        </div>
                      )}
                    </div>
                  )}
                  {analytics.users !== null && analytics.users !== undefined && (
                    <div className="analytics-item">
                      <div className="analytics-value">{analytics.users.toLocaleString()}</div>
                      <div className="analytics-label">Korisnici</div>
                      {analyticsComparison.users_change !== null && analyticsComparison.users_change !== undefined && (
                        <div className="analytics-change" style={{ color: analyticsComparison.users_change >= 0 ? '#00FF94' : '#ef4444' }}>
                          {formatChange(analyticsComparison.users_change)}
                        </div>
                      )}
                    </div>
                  )}
                  {analytics.pageviews !== null && analytics.pageviews !== undefined && (
                    <div className="analytics-item">
                      <div className="analytics-value">{analytics.pageviews.toLocaleString()}</div>
                      <div className="analytics-label">Pregledi stranica</div>
                      {analyticsComparison.pageviews_change !== null && analyticsComparison.pageviews_change !== undefined && (
                        <div className="analytics-change" style={{ color: analyticsComparison.pageviews_change >= 0 ? '#00FF94' : '#ef4444' }}>
                          {formatChange(analyticsComparison.pageviews_change)}
                        </div>
                      )}
                    </div>
                  )}
                  {analytics.bounce_rate !== null && analytics.bounce_rate !== undefined && (
                    <div className="analytics-item">
                      <div className="analytics-value">{analytics.bounce_rate}%</div>
                      <div className="analytics-label">Bounce Rate</div>
                    </div>
                  )}
                  {analytics.avg_session_duration !== null && analytics.avg_session_duration !== undefined && (
                    <div className="analytics-item">
                      <div className="analytics-value">{analytics.avg_session_duration}s</div>
                      <div className="analytics-label">Prosj. trajanje</div>
                    </div>
                  )}
                  {analytics.new_users_percentage !== null && analytics.new_users_percentage !== undefined && (
                    <div className="analytics-item">
                      <div className="analytics-value">{analytics.new_users_percentage}%</div>
                      <div className="analytics-label">Novi korisnici</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Summary Text */}
            {report.summary_text && (
              <div className="card">
                <div className="card-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
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
                  {report.period_start} - {report.period_end}
                </span>
              </div>

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
