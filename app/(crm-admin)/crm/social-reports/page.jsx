// app/(crm-admin)/crm/social-reports/page.jsx
// Monthly Social Media Reports Dashboard

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

const CROATIAN_MONTHS = [
  'Siječanj', 'Veljača', 'Ožujak', 'Travanj', 'Svibanj', 'Lipanj',
  'Srpanj', 'Kolovoz', 'Rujan', 'Listopad', 'Studeni', 'Prosinac'
];

const STATUS_BADGES = {
  draft: { label: 'Nacrt', bg: '#6b7280', color: '#fff' },
  generated: { label: 'Generiran', bg: '#3b82f6', color: '#fff' },
  sent: { label: 'Poslan', bg: '#00FF94', color: '#000' }
};

const PLATFORM_COLORS = {
  instagram: '#E4405F',
  facebook: '#1877F2',
  linkedin: '#0A66C2',
  tiktok: '#000000'
};

export default function SocialReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());

  useEffect(() => {
    loadReports();
  }, [filter, yearFilter]);

  const loadReports = async () => {
    setLoading(true);
    try {
      let query = supabase
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
        .eq('report_year', yearFilter)
        .order('report_month', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStats = () => {
    const stats = { draft: 0, generated: 0, sent: 0 };
    for (const report of reports) {
      stats[report.status] = (stats[report.status] || 0) + 1;
    }
    return stats;
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

  const handleDelete = async (id) => {
    if (!confirm('Jeste li sigurni da želite obrisati ovaj izvještaj?')) return;

    try {
      const { error } = await supabase
        .from('social_media_reports')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setReports(reports.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting report:', error);
      alert('Greška pri brisanju izvještaja');
    }
  };

  const getActivePlatforms = (platforms) => {
    if (!platforms) return [];
    return Object.keys(platforms).filter(p => platforms[p]?.followers || platforms[p]?.posts);
  };

  const statusStats = getStatusStats();
  const years = [2024, 2025, 2026, 2027];

  return (
    <>
      <style jsx global>{`
        .reports-page {
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .header {
          margin-bottom: 40px;
        }

        h1 {
          font-size: 2.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #E4405F 0%, #3b82f6 50%, #00FF94 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 10px;
        }

        .header-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .btn-primary {
          background: #00FF94;
          color: #000;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 700;
          transition: all 0.3s;
          display: inline-block;
        }

        .btn-primary:hover {
          box-shadow: 0 0 20px rgba(0, 255, 148, 0.4);
          transform: translateY(-2px);
        }

        /* Stats Cards */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 24px;
          transition: all 0.3s;
          cursor: pointer;
        }

        .stat-card:hover {
          border-color: #00FF94;
          transform: translateY(-4px);
        }

        .stat-card.active {
          border-color: #00FF94;
          background: rgba(0, 255, 148, 0.05);
        }

        .stat-label {
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 900;
          color: #00FF94;
          line-height: 1;
        }

        /* Filters */
        .filters {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .filter-select {
          padding: 10px 16px;
          background: #1a1a1a;
          border: 1px solid #333;
          color: #fff;
          border-radius: 8px;
          font-size: 0.9rem;
          cursor: pointer;
        }

        .filter-select:focus {
          outline: none;
          border-color: #00FF94;
        }

        /* Reports List */
        .reports-grid {
          display: grid;
          gap: 16px;
        }

        .report-card {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 24px;
          transition: all 0.3s;
        }

        .report-card:hover {
          border-color: #00FF94;
        }

        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 16px;
          gap: 16px;
        }

        .report-info h3 {
          font-size: 1.3rem;
          color: #fff;
          margin-bottom: 8px;
        }

        .report-reference {
          font-size: 0.85rem;
          color: #E4405F;
          font-weight: 600;
          font-family: monospace;
        }

        .report-client {
          font-size: 0.9rem;
          color: #888;
          margin-top: 6px;
        }

        .status-badge {
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .report-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          padding-top: 16px;
          border-top: 1px solid #333;
          margin-bottom: 16px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail-label {
          font-size: 0.75rem;
          color: #666;
          text-transform: uppercase;
        }

        .detail-value {
          font-size: 0.95rem;
          font-weight: 600;
          color: #fff;
        }

        .detail-value.highlight {
          color: #00FF94;
        }

        .platform-badges {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .platform-badge {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .report-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .btn-small {
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          border: 1px solid transparent;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
        }

        .btn-small svg {
          flex-shrink: 0;
          width: 14px;
          height: 14px;
        }

        .btn-view {
          background: rgba(0, 255, 148, 0.15);
          color: #00FF94;
          border-color: rgba(0, 255, 148, 0.3);
        }

        .btn-view:hover {
          background: rgba(0, 255, 148, 0.25);
          border-color: rgba(0, 255, 148, 0.5);
        }

        .btn-pdf {
          background: rgba(139, 92, 246, 0.15);
          color: #8b5cf6;
          border-color: rgba(139, 92, 246, 0.3);
        }

        .btn-pdf:hover {
          background: rgba(139, 92, 246, 0.25);
          border-color: rgba(139, 92, 246, 0.5);
        }

        .btn-send {
          background: rgba(59, 130, 246, 0.15);
          color: #3b82f6;
          border-color: rgba(59, 130, 246, 0.3);
        }

        .btn-send:hover {
          background: rgba(59, 130, 246, 0.25);
          border-color: rgba(59, 130, 246, 0.5);
        }

        .btn-delete {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.3);
        }

        .btn-delete:hover {
          background: rgba(239, 68, 68, 0.25);
          border-color: rgba(239, 68, 68, 0.5);
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: #1a1a1a;
          border: 2px dashed #333;
          border-radius: 12px;
        }

        .empty-state h2 {
          font-size: 1.8rem;
          margin-bottom: 15px;
          color: white;
        }

        .empty-state p {
          color: #888;
          margin-bottom: 25px;
          font-size: 1.1rem;
        }

        .loading {
          text-align: center;
          padding: 60px;
          font-size: 1.2rem;
          color: #00FF94;
        }
      `}</style>

      <div className="reports-page">
        <div className="header">
          <h1>Social Media Izvještaji</h1>
          <p style={{ color: '#888' }}>Generiraj i šalji mjesečne izvještaje društvenih mreža klijentima</p>

          <div className="header-actions">
            <div></div>
            <Link href="/crm/social-reports/new" className="btn-primary">
              + Generiraj Izvještaj
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div
            className={`stat-card ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            <div className="stat-label">Ukupno</div>
            <div className="stat-value">{reports.length}</div>
          </div>

          <div
            className={`stat-card ${filter === 'draft' ? 'active' : ''}`}
            onClick={() => setFilter('draft')}
          >
            <div className="stat-label">Nacrti</div>
            <div className="stat-value">{statusStats.draft}</div>
          </div>

          <div
            className={`stat-card ${filter === 'generated' ? 'active' : ''}`}
            onClick={() => setFilter('generated')}
          >
            <div className="stat-label">Generirani</div>
            <div className="stat-value">{statusStats.generated}</div>
          </div>

          <div
            className={`stat-card ${filter === 'sent' ? 'active' : ''}`}
            onClick={() => setFilter('sent')}
          >
            <div className="stat-label">Poslani</div>
            <div className="stat-value">{statusStats.sent}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters">
          <select
            className="filter-select"
            value={yearFilter}
            onChange={(e) => setYearFilter(parseInt(e.target.value))}
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Reports List */}
        {loading ? (
          <div className="loading">Učitavanje izvještaja...</div>
        ) : reports.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#E4405F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '20px' }}>
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <h2>Nema izvještaja za {yearFilter}</h2>
            <p>Generiraj prvi mjesečni izvještaj društvenih mreža za svoje klijente.</p>
            <Link href="/crm/social-reports/new" className="btn-primary">
              Generiraj Prvi Izvještaj
            </Link>
          </div>
        ) : (
          <div className="reports-grid">
            {reports.map((report) => {
              const clientName = report.recurring_contracts?.clients?.company ||
                report.recurring_contracts?.clients?.name ||
                'Nepoznat klijent';
              const contractName = report.recurring_contracts?.name || '';
              const statusStyle = STATUS_BADGES[report.status] || STATUS_BADGES.draft;
              const activePlatforms = getActivePlatforms(report.platforms);

              return (
                <div key={report.id} className="report-card">
                  <div className="report-header">
                    <div className="report-info">
                      <h3>{CROATIAN_MONTHS[report.report_month - 1]} {report.report_year}</h3>
                      <div className="report-reference">{report.reference}</div>
                      <div className="report-client">{clientName} - {contractName}</div>
                    </div>
                    <span
                      className="status-badge"
                      style={{ background: statusStyle.bg, color: statusStyle.color }}
                    >
                      {statusStyle.label}
                    </span>
                  </div>

                  <div className="report-details">
                    <div className="detail-item">
                      <span className="detail-label">Objave</span>
                      <span className="detail-value highlight">{report.posts_published || 0}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Doseg</span>
                      <span className="detail-value">{(report.total_reach || 0).toLocaleString()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Engagement</span>
                      <span className="detail-value">{(report.total_engagement || 0).toLocaleString()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Rast pratitelja</span>
                      <span className="detail-value" style={{ color: (report.follower_growth || 0) >= 0 ? '#00FF94' : '#ef4444' }}>
                        {(report.follower_growth || 0) >= 0 ? '+' : ''}{report.follower_growth || 0}
                      </span>
                    </div>
                    {activePlatforms.length > 0 && (
                      <div className="detail-item">
                        <span className="detail-label">Platforme</span>
                        <div className="platform-badges">
                          {activePlatforms.map(platform => (
                            <span
                              key={platform}
                              className="platform-badge"
                              style={{
                                background: PLATFORM_COLORS[platform] || '#333',
                                color: '#fff'
                              }}
                            >
                              {platform}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="detail-item">
                      <span className="detail-label">Pregledi</span>
                      <span className="detail-value">{report.view_count || 0}</span>
                    </div>
                  </div>

                  <div className="report-actions">
                    <Link href={`/crm/social-reports/${report.id}`} className="btn-small btn-view">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      Pregledaj
                    </Link>
                    <a
                      href={`/api/social-media-reports/${report.id}/pdf`}
                      className="btn-small btn-pdf"
                      target="_blank"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                      </svg>
                      PDF
                    </a>
                    <Link href={`/crm/social-reports/${report.id}?send=true`} className="btn-small btn-send">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                      Pošalji
                    </Link>
                    <button
                      className="btn-small btn-delete"
                      onClick={() => handleDelete(report.id)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                      Obriši
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
