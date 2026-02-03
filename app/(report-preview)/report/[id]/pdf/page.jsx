// app/(report-preview)/report/[id]/pdf/page.jsx
// Dedicated PDF Template for Monthly Maintenance Reports - Professional A4 Style

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const CROATIAN_MONTHS = [
  'Siječanj', 'Veljača', 'Ožujak', 'Travanj', 'Svibanj', 'Lipanj',
  'Srpanj', 'Kolovoz', 'Rujan', 'Listopad', 'Studeni', 'Prosinac'
];

export default function ReportPdfTemplate() {
  const params = useParams();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();

    // Hide header, footer, and cookie consent from root layout
    const style = document.createElement('style');
    style.id = 'hide-layout-elements';
    style.innerHTML = `
      body > header,
      body > footer,
      body > nav,
      #__next > header,
      #__next > footer,
      #__next > nav,
      [data-testid="header"],
      [data-testid="footer"],
      header,
      footer,
      .cky-consent-container,
      .cky-consent-bar,
      .cky-btn-revisit-wrapper,
      #cky-consent,
      [data-cky-tag],
      .cky-overlay {
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
      const styleEl = document.getElementById('hide-layout-elements');
      if (styleEl) styleEl.remove();
    };
  }, [params.id]);

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
    if (score >= 90) return '#00CC76';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score === null || score === undefined) return 'N/A';
    if (score >= 90) return 'Odlično';
    if (score >= 50) return 'Potrebno poboljšanje';
    return 'Loše';
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'white',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      }}>
        <p>Učitavanje...</p>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'white',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      }}>
        <p>Izvještaj nije pronađen</p>
      </div>
    );
  }

  const lighthouse = reportData.lighthouse || {};
  const analytics = reportData.analytics || {};
  const comparison = reportData.analytics_comparison || {};

  // Styles
  const styles = {
    document: {
      width: '210mm',
      minHeight: '297mm',
      padding: '15mm 20mm',
      background: 'white',
      position: 'relative',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: '11px',
      lineHeight: '1.5',
      color: '#1a1a1a',
      boxSizing: 'border-box'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '30px',
      paddingBottom: '20px',
      borderBottom: '1px solid #e5e5e5'
    },
    logo: {
      width: '50px',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    companyInfo: {
      textAlign: 'right'
    },
    companyName: {
      fontSize: '14px',
      fontWeight: '700',
      color: '#1a1a1a',
      marginBottom: '2px'
    },
    companyDetails: {
      fontSize: '10px',
      color: '#666',
      lineHeight: '1.6'
    },
    documentTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1a1a1a',
      marginBottom: '8px',
      marginTop: '0'
    },
    documentSubtitle: {
      fontSize: '14px',
      color: '#00CC76',
      fontWeight: '600',
      marginBottom: '30px'
    },
    infoSection: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '40px',
      marginBottom: '40px'
    },
    infoBlockTitle: {
      fontSize: '10px',
      fontWeight: '600',
      color: '#666',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '12px',
      marginTop: '0'
    },
    infoRow: {
      display: 'flex',
      marginBottom: '6px'
    },
    infoLabel: {
      fontSize: '10px',
      fontWeight: '600',
      color: '#1a1a1a',
      minWidth: '100px'
    },
    infoValue: {
      fontSize: '10px',
      color: '#444'
    },
    clientName: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#1a1a1a',
      marginBottom: '8px'
    },
    sectionTitle: {
      fontSize: '12px',
      fontWeight: '700',
      color: '#1a1a1a',
      marginBottom: '16px',
      marginTop: '0',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      paddingBottom: '8px',
      borderBottom: '2px solid #1a1a1a'
    },
    // Lighthouse Section
    lighthouseGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '12px',
      marginBottom: '20px'
    },
    lighthouseCard: {
      background: '#f8f8f8',
      borderRadius: '8px',
      padding: '16px',
      textAlign: 'center',
      borderTop: '3px solid'
    },
    lighthouseScore: {
      fontSize: '28px',
      fontWeight: '700',
      marginBottom: '4px'
    },
    lighthouseLabel: {
      fontSize: '9px',
      color: '#666',
      textTransform: 'uppercase',
      letterSpacing: '0.3px',
      marginBottom: '2px'
    },
    lighthouseStatus: {
      fontSize: '8px',
      color: '#888'
    },
    vitalsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '12px',
      marginBottom: '30px'
    },
    vitalCard: {
      background: '#f8f8f8',
      borderRadius: '8px',
      padding: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '14px'
    },
    vitalIcon: {
      fontSize: '20px'
    },
    vitalName: {
      fontSize: '9px',
      color: '#666',
      marginBottom: '2px'
    },
    vitalValue: {
      fontSize: '16px',
      fontWeight: '700'
    },
    vitalStatus: {
      fontSize: '8px'
    },
    // Analytics Section
    analyticsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '12px',
      marginBottom: '20px'
    },
    analyticsCard: {
      background: '#f8f8f8',
      borderRadius: '8px',
      padding: '16px',
      textAlign: 'center'
    },
    analyticsValue: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#3b82f6',
      marginBottom: '4px'
    },
    analyticsLabel: {
      fontSize: '9px',
      color: '#666',
      textTransform: 'uppercase',
      marginBottom: '6px'
    },
    analyticsChange: {
      fontSize: '10px',
      fontWeight: '600',
      padding: '3px 8px',
      borderRadius: '10px',
      display: 'inline-block'
    },
    secondaryStats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '12px',
      marginBottom: '30px'
    },
    secondaryStat: {
      background: '#f8f8f8',
      borderRadius: '8px',
      padding: '12px',
      textAlign: 'center'
    },
    secondaryStatValue: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#1a1a1a',
      marginBottom: '2px'
    },
    secondaryStatLabel: {
      fontSize: '8px',
      color: '#888',
      textTransform: 'uppercase'
    },
    // Summary
    summaryBox: {
      background: '#f8f8f8',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '30px'
    },
    summaryText: {
      fontSize: '10px',
      color: '#444',
      lineHeight: '1.7'
    },
    // Highlights
    highlightsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
      marginBottom: '30px'
    },
    highlightBox: {
      background: '#f0fdf4',
      borderRadius: '8px',
      padding: '16px',
      borderLeft: '3px solid #00CC76'
    },
    recommendBox: {
      background: '#eff6ff',
      borderRadius: '8px',
      padding: '16px',
      borderLeft: '3px solid #3b82f6'
    },
    highlightTitle: {
      fontSize: '10px',
      fontWeight: '700',
      color: '#1a1a1a',
      marginBottom: '12px',
      textTransform: 'uppercase',
      letterSpacing: '0.3px'
    },
    highlightList: {
      listStyle: 'none',
      padding: '0',
      margin: '0'
    },
    highlightItem: {
      fontSize: '10px',
      color: '#444',
      padding: '6px 0',
      borderBottom: '1px solid rgba(0,0,0,0.05)',
      display: 'flex',
      gap: '8px'
    },
    highlightNumber: {
      width: '16px',
      height: '16px',
      background: '#00CC76',
      color: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '8px',
      fontWeight: '700',
      flexShrink: '0'
    },
    recommendNumber: {
      width: '16px',
      height: '16px',
      background: '#3b82f6',
      color: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '8px',
      fontWeight: '700',
      flexShrink: '0'
    },
    // Footer
    footer: {
      marginTop: '40px',
      paddingTop: '20px',
      borderTop: '1px solid #e5e5e5',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    footerLogo: {
      fontSize: '12px',
      fontWeight: '700',
      color: '#00CC76'
    },
    footerText: {
      fontSize: '9px',
      color: '#888',
      textAlign: 'right'
    }
  };

  const hasLighthouse = lighthouse.performance || lighthouse.accessibility || lighthouse.best_practices || lighthouse.seo;
  const hasVitals = lighthouse.lcp || lighthouse.cls !== null && lighthouse.cls !== undefined;
  const hasAnalytics = analytics.sessions || analytics.users || analytics.pageviews;
  const hasSecondaryStats = analytics.bounce_rate || analytics.avg_session_duration || analytics.new_users_percentage;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { background: white; }
        @page { size: A4; margin: 0; }
      `}</style>

      <div style={styles.document}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>
            <img src="/favicon.ico" alt="Ninefold" width="40" height="40" style={{ borderRadius: '8px' }} />
          </div>
          <div style={styles.companyInfo}>
            <div style={styles.companyName}>PROGMATIQ, VL. BRUNO ČUKIĆ</div>
            <div style={styles.companyDetails}>
              Glavna 12, 10360 Sesvete, Croatia<br />
              www.ninefold.eu hello@ninefold.eu +385913333447<br />
              <strong style={{ color: '#1a1a1a' }}>OIB</strong> 50299147291
            </div>
          </div>
        </div>

        {/* Document Title */}
        <h1 style={styles.documentTitle}>MJESEČNI IZVJEŠTAJ ODRŽAVANJA</h1>
        <div style={styles.documentSubtitle}>{reportData.periodDisplay} • {reportData.reference}</div>

        {/* Info Section */}
        <div style={styles.infoSection}>
          <div>
            <h3 style={styles.infoBlockTitle}>Klijent</h3>
            <div style={styles.clientName}>{reportData.clientName}</div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>UGOVOR</span>
              <span style={styles.infoValue}>{reportData.contractName}</span>
            </div>
          </div>
          <div>
            <h3 style={styles.infoBlockTitle}>Razdoblje</h3>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>OD</span>
              <span style={styles.infoValue}>{formatDate(reportData.period_start)}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>DO</span>
              <span style={styles.infoValue}>{formatDate(reportData.period_end)}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>GENERIRANO</span>
              <span style={styles.infoValue}>{formatDate(reportData.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Lighthouse Scores */}
        {hasLighthouse && (
          <>
            <h2 style={styles.sectionTitle}>🚀 Lighthouse Rezultati</h2>
            <div style={styles.lighthouseGrid}>
              {lighthouse.performance !== null && lighthouse.performance !== undefined && (
                <div style={{ ...styles.lighthouseCard, borderTopColor: getScoreColor(lighthouse.performance) }}>
                  <div style={{ ...styles.lighthouseScore, color: getScoreColor(lighthouse.performance) }}>
                    {lighthouse.performance}
                  </div>
                  <div style={styles.lighthouseLabel}>Performance</div>
                  <div style={styles.lighthouseStatus}>{getScoreLabel(lighthouse.performance)}</div>
                </div>
              )}
              {lighthouse.accessibility !== null && lighthouse.accessibility !== undefined && (
                <div style={{ ...styles.lighthouseCard, borderTopColor: getScoreColor(lighthouse.accessibility) }}>
                  <div style={{ ...styles.lighthouseScore, color: getScoreColor(lighthouse.accessibility) }}>
                    {lighthouse.accessibility}
                  </div>
                  <div style={styles.lighthouseLabel}>Accessibility</div>
                  <div style={styles.lighthouseStatus}>{getScoreLabel(lighthouse.accessibility)}</div>
                </div>
              )}
              {lighthouse.best_practices !== null && lighthouse.best_practices !== undefined && (
                <div style={{ ...styles.lighthouseCard, borderTopColor: getScoreColor(lighthouse.best_practices) }}>
                  <div style={{ ...styles.lighthouseScore, color: getScoreColor(lighthouse.best_practices) }}>
                    {lighthouse.best_practices}
                  </div>
                  <div style={styles.lighthouseLabel}>Best Practices</div>
                  <div style={styles.lighthouseStatus}>{getScoreLabel(lighthouse.best_practices)}</div>
                </div>
              )}
              {lighthouse.seo !== null && lighthouse.seo !== undefined && (
                <div style={{ ...styles.lighthouseCard, borderTopColor: getScoreColor(lighthouse.seo) }}>
                  <div style={{ ...styles.lighthouseScore, color: getScoreColor(lighthouse.seo) }}>
                    {lighthouse.seo}
                  </div>
                  <div style={styles.lighthouseLabel}>SEO</div>
                  <div style={styles.lighthouseStatus}>{getScoreLabel(lighthouse.seo)}</div>
                </div>
              )}
            </div>

            {/* Core Web Vitals */}
            {hasVitals && (
              <div style={styles.vitalsGrid}>
                {lighthouse.lcp && (
                  <div style={styles.vitalCard}>
                    <div style={styles.vitalIcon}>⏱️</div>
                    <div>
                      <div style={styles.vitalName}>Largest Contentful Paint (LCP)</div>
                      <div style={{ ...styles.vitalValue, color: lighthouse.lcp <= 2.5 ? '#00CC76' : lighthouse.lcp <= 4 ? '#f59e0b' : '#ef4444' }}>
                        {lighthouse.lcp}s
                      </div>
                      <div style={{ ...styles.vitalStatus, color: lighthouse.lcp <= 2.5 ? '#00CC76' : lighthouse.lcp <= 4 ? '#f59e0b' : '#ef4444' }}>
                        {lighthouse.lcp <= 2.5 ? 'Dobro' : lighthouse.lcp <= 4 ? 'Potrebno poboljšanje' : 'Loše'}
                      </div>
                    </div>
                  </div>
                )}
                {lighthouse.cls !== null && lighthouse.cls !== undefined && (
                  <div style={styles.vitalCard}>
                    <div style={styles.vitalIcon}>📐</div>
                    <div>
                      <div style={styles.vitalName}>Cumulative Layout Shift (CLS)</div>
                      <div style={{ ...styles.vitalValue, color: lighthouse.cls <= 0.1 ? '#00CC76' : lighthouse.cls <= 0.25 ? '#f59e0b' : '#ef4444' }}>
                        {lighthouse.cls}
                      </div>
                      <div style={{ ...styles.vitalStatus, color: lighthouse.cls <= 0.1 ? '#00CC76' : lighthouse.cls <= 0.25 ? '#f59e0b' : '#ef4444' }}>
                        {lighthouse.cls <= 0.1 ? 'Dobro' : lighthouse.cls <= 0.25 ? 'Potrebno poboljšanje' : 'Loše'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Google Analytics */}
        {hasAnalytics && (
          <>
            <h2 style={styles.sectionTitle}>📊 Google Analytics</h2>
            <div style={styles.analyticsGrid}>
              {analytics.sessions !== null && analytics.sessions !== undefined && (
                <div style={styles.analyticsCard}>
                  <div style={styles.analyticsValue}>{analytics.sessions.toLocaleString()}</div>
                  <div style={styles.analyticsLabel}>Sesije</div>
                  {comparison.sessions_change !== null && comparison.sessions_change !== undefined && (
                    <span style={{
                      ...styles.analyticsChange,
                      background: comparison.sessions_change >= 0 ? '#dcfce7' : '#fee2e2',
                      color: comparison.sessions_change >= 0 ? '#16a34a' : '#dc2626'
                    }}>
                      {comparison.sessions_change >= 0 ? '+' : ''}{comparison.sessions_change}%
                    </span>
                  )}
                </div>
              )}
              {analytics.users !== null && analytics.users !== undefined && (
                <div style={styles.analyticsCard}>
                  <div style={styles.analyticsValue}>{analytics.users.toLocaleString()}</div>
                  <div style={styles.analyticsLabel}>Korisnici</div>
                  {comparison.users_change !== null && comparison.users_change !== undefined && (
                    <span style={{
                      ...styles.analyticsChange,
                      background: comparison.users_change >= 0 ? '#dcfce7' : '#fee2e2',
                      color: comparison.users_change >= 0 ? '#16a34a' : '#dc2626'
                    }}>
                      {comparison.users_change >= 0 ? '+' : ''}{comparison.users_change}%
                    </span>
                  )}
                </div>
              )}
              {analytics.pageviews !== null && analytics.pageviews !== undefined && (
                <div style={styles.analyticsCard}>
                  <div style={styles.analyticsValue}>{analytics.pageviews.toLocaleString()}</div>
                  <div style={styles.analyticsLabel}>Pregledi Stranica</div>
                  {comparison.pageviews_change !== null && comparison.pageviews_change !== undefined && (
                    <span style={{
                      ...styles.analyticsChange,
                      background: comparison.pageviews_change >= 0 ? '#dcfce7' : '#fee2e2',
                      color: comparison.pageviews_change >= 0 ? '#16a34a' : '#dc2626'
                    }}>
                      {comparison.pageviews_change >= 0 ? '+' : ''}{comparison.pageviews_change}%
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Secondary Stats */}
            {hasSecondaryStats && (
              <div style={styles.secondaryStats}>
                {analytics.bounce_rate !== null && analytics.bounce_rate !== undefined && (
                  <div style={styles.secondaryStat}>
                    <div style={styles.secondaryStatValue}>{analytics.bounce_rate}%</div>
                    <div style={styles.secondaryStatLabel}>Bounce Rate</div>
                  </div>
                )}
                {analytics.avg_session_duration !== null && analytics.avg_session_duration !== undefined && (
                  <div style={styles.secondaryStat}>
                    <div style={styles.secondaryStatValue}>{formatDuration(analytics.avg_session_duration)}</div>
                    <div style={styles.secondaryStatLabel}>Prosječno Trajanje</div>
                  </div>
                )}
                {analytics.new_users_percentage !== null && analytics.new_users_percentage !== undefined && (
                  <div style={styles.secondaryStat}>
                    <div style={styles.secondaryStatValue}>{analytics.new_users_percentage}%</div>
                    <div style={styles.secondaryStatLabel}>Novi Korisnici</div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Summary */}
        {reportData.summary_text && (
          <>
            <h2 style={styles.sectionTitle}>📝 Sažetak Mjeseca</h2>
            <div style={styles.summaryBox}>
              <p style={styles.summaryText}>{reportData.summary_text}</p>
            </div>
          </>
        )}

        {/* Highlights & Recommendations */}
        {((reportData.highlights && reportData.highlights.length > 0) ||
          (reportData.recommendations && reportData.recommendations.length > 0)) && (
            <div style={styles.highlightsGrid}>
              {reportData.highlights && reportData.highlights.length > 0 && (
                <div style={styles.highlightBox}>
                  <h3 style={styles.highlightTitle}>✨ Istaknuto</h3>
                  <ul style={styles.highlightList}>
                    {reportData.highlights.map((item, i) => (
                      <li key={i} style={styles.highlightItem}>
                        <span style={styles.highlightNumber}>{i + 1}</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {reportData.recommendations && reportData.recommendations.length > 0 && (
                <div style={styles.recommendBox}>
                  <h3 style={styles.highlightTitle}>💡 Preporuke</h3>
                  <ul style={styles.highlightList}>
                    {reportData.recommendations.map((item, i) => (
                      <li key={i} style={styles.highlightItem}>
                        <span style={styles.recommendNumber}>{i + 1}</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

        {/* Footer */}
        <div style={styles.footer}>
          <div style={styles.footerLogo}>NineFold</div>
          <div style={styles.footerText}>
            {reportData.reference}<br />
            Generirano: {formatDate(new Date().toISOString())}
          </div>
        </div>
      </div>
    </>
  );
}
