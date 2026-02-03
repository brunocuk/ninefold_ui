// app/(crm-admin)/crm/reports/new/page.jsx
// Generate new maintenance report with Lighthouse & Analytics data

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

const CROATIAN_MONTHS = [
  'Siječanj', 'Veljača', 'Ožujak', 'Travanj', 'Svibanj', 'Lipanj',
  'Srpanj', 'Kolovoz', 'Rujan', 'Listopad', 'Studeni', 'Prosinac'
];

export default function NewReportPage() {
  const router = useRouter();
  const now = new Date();
  const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
  const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    contract_id: '',
    report_month: lastMonth + 1,
    report_year: lastMonthYear,
    summary_text: '',
    highlights: ['', '', ''],
    recommendations: ['', '', ''],
    // Lighthouse scores
    lighthouse: {
      performance: '',
      accessibility: '',
      best_practices: '',
      seo: '',
      lcp: '',
      cls: ''
    },
    // Analytics data
    analytics: {
      sessions: '',
      users: '',
      pageviews: '',
      bounce_rate: '',
      avg_session_duration: '',
      new_users_percentage: ''
    },
    analytics_comparison: {
      sessions_change: '',
      users_change: '',
      pageviews_change: ''
    }
  });

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    try {
      const { data, error } = await supabase
        .from('recurring_contracts')
        .select(`
          *,
          clients (
            id,
            name,
            company,
            email
          )
        `)
        .eq('contract_type', 'maintenance')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      setContracts(data || []);
    } catch (error) {
      console.error('Error loading contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => {
      const arr = [...prev[field]];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.contract_id || !formData.report_month || !formData.report_year) {
      alert('Molimo odaberite ugovor i razdoblje');
      return;
    }

    setGenerating(true);

    try {
      // Clean up numeric values
      const lighthouse = {
        performance: formData.lighthouse.performance ? parseFloat(formData.lighthouse.performance) : null,
        accessibility: formData.lighthouse.accessibility ? parseFloat(formData.lighthouse.accessibility) : null,
        best_practices: formData.lighthouse.best_practices ? parseFloat(formData.lighthouse.best_practices) : null,
        seo: formData.lighthouse.seo ? parseFloat(formData.lighthouse.seo) : null,
        lcp: formData.lighthouse.lcp ? parseFloat(formData.lighthouse.lcp) : null,
        cls: formData.lighthouse.cls ? parseFloat(formData.lighthouse.cls) : null
      };

      const analytics = {
        sessions: formData.analytics.sessions ? parseInt(formData.analytics.sessions) : null,
        users: formData.analytics.users ? parseInt(formData.analytics.users) : null,
        pageviews: formData.analytics.pageviews ? parseInt(formData.analytics.pageviews) : null,
        bounce_rate: formData.analytics.bounce_rate ? parseFloat(formData.analytics.bounce_rate) : null,
        avg_session_duration: formData.analytics.avg_session_duration ? parseFloat(formData.analytics.avg_session_duration) : null,
        new_users_percentage: formData.analytics.new_users_percentage ? parseFloat(formData.analytics.new_users_percentage) : null
      };

      const analytics_comparison = {
        sessions_change: formData.analytics_comparison.sessions_change ? parseFloat(formData.analytics_comparison.sessions_change) : null,
        users_change: formData.analytics_comparison.users_change ? parseFloat(formData.analytics_comparison.users_change) : null,
        pageviews_change: formData.analytics_comparison.pageviews_change ? parseFloat(formData.analytics_comparison.pageviews_change) : null
      };

      const response = await fetch('/api/maintenance-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contract_id: formData.contract_id,
          report_month: parseInt(formData.report_month),
          report_year: parseInt(formData.report_year),
          summary_text: formData.summary_text || null,
          highlights: formData.highlights.filter(h => h.trim()),
          recommendations: formData.recommendations.filter(r => r.trim()),
          lighthouse,
          analytics,
          analytics_comparison
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Greška pri generiranju izvještaja');
      }

      router.push(`/crm/reports/${result.data.id}`);
    } catch (error) {
      console.error('Error generating report:', error);
      alert(error.message);
    } finally {
      setGenerating(false);
    }
  };

  const selectedContract = contracts.find(c => c.id === formData.contract_id);
  const months = CROATIAN_MONTHS.map((name, i) => ({ value: i + 1, label: name }));
  const years = [2024, 2025, 2026, 2027];

  // Helper to get score color
  const getScoreColor = (score) => {
    if (!score) return '#666';
    const num = parseFloat(score);
    if (num >= 90) return '#00FF94';
    if (num >= 50) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#00FF94' }}>
        Učitavanje...
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .new-report-page {
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .header {
          margin-bottom: 40px;
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

        h1 {
          font-size: 2rem;
          font-weight: 900;
          background: linear-gradient(135deg, #00FF94 0%, #00CC76 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 10px;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 24px;
        }

        @media (max-width: 1200px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
        }

        .form-card {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 32px;
        }

        .form-section {
          margin-bottom: 32px;
        }

        .section-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid #333;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .section-title span {
          font-size: 1.2rem;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: #999;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-label.required::after {
          content: ' *';
          color: #ef4444;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 12px 16px;
          background: #0a0a0a;
          border: 1px solid #333;
          border-radius: 8px;
          color: #fff;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #00FF94;
        }

        .form-textarea {
          min-height: 100px;
          resize: vertical;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
        }

        .form-row-4 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .form-row-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        @media (max-width: 640px) {
          .form-row-4, .form-row-3 {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .list-inputs {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .list-input-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .list-input-row span {
          width: 24px;
          height: 24px;
          background: #333;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          color: #00FF94;
          flex-shrink: 0;
        }

        /* Score input styling */
        .score-input-wrapper {
          position: relative;
        }

        .score-input {
          width: 100%;
          padding: 12px 16px;
          padding-right: 40px;
          background: #0a0a0a;
          border: 1px solid #333;
          border-radius: 8px;
          color: #fff;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .score-input:focus {
          outline: none;
          border-color: #00FF94;
        }

        .score-suffix {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #666;
          font-size: 0.9rem;
        }

        .input-hint {
          font-size: 0.75rem;
          color: #666;
          margin-top: 4px;
        }

        /* Preview Card */
        .preview-card {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 24px;
          position: sticky;
          top: 20px;
        }

        .preview-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .preview-empty {
          text-align: center;
          padding: 40px 20px;
          color: #666;
        }

        .preview-contract {
          padding: 16px;
          background: #0a0a0a;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .preview-contract h4 {
          font-size: 1rem;
          color: #00FF94;
          margin-bottom: 6px;
        }

        .preview-contract p {
          font-size: 0.85rem;
          color: #888;
        }

        /* Lighthouse Preview */
        .lighthouse-preview {
          margin-bottom: 20px;
        }

        .lighthouse-scores {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .lighthouse-score {
          background: #0a0a0a;
          border-radius: 8px;
          padding: 12px;
          text-align: center;
        }

        .lighthouse-score-value {
          font-size: 1.5rem;
          font-weight: 900;
          line-height: 1.2;
        }

        .lighthouse-score-label {
          font-size: 0.7rem;
          color: #666;
          margin-top: 4px;
          text-transform: uppercase;
        }

        /* Analytics Preview */
        .analytics-preview {
          margin-bottom: 20px;
        }

        .analytics-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .analytics-stat {
          background: #0a0a0a;
          border-radius: 8px;
          padding: 12px;
          text-align: center;
        }

        .analytics-stat-value {
          font-size: 1.2rem;
          font-weight: 700;
          color: #3b82f6;
        }

        .analytics-stat-label {
          font-size: 0.7rem;
          color: #666;
          margin-top: 4px;
          text-transform: uppercase;
        }

        .analytics-stat-change {
          font-size: 0.75rem;
          margin-top: 4px;
        }

        .analytics-stat-change.positive {
          color: #00FF94;
        }

        .analytics-stat-change.negative {
          color: #ef4444;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #333;
        }

        .btn {
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
          border: none;
          text-decoration: none;
        }

        .btn-primary {
          background: #00FF94;
          color: #000;
        }

        .btn-primary:hover {
          box-shadow: 0 0 20px rgba(0, 255, 148, 0.4);
          transform: translateY(-2px);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .btn-secondary {
          background: #333;
          color: #fff;
        }

        .btn-secondary:hover {
          background: #444;
        }

        .section-subtitle {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 16px;
        }
      `}</style>

      <div className="new-report-page">
        <div className="header">
          <Link href="/crm/reports" className="back-link">
            ← Natrag na izvještaje
          </Link>
          <h1>Generiraj Izvještaj</h1>
          <p style={{ color: '#888' }}>Kreiraj mjesečni izvještaj održavanja za klijenta</p>
        </div>

        <div className="content-grid">
          <form onSubmit={handleSubmit} className="form-card">
            {/* Contract & Period Selection */}
            <div className="form-section">
              <h3 className="section-title"><span>📋</span> Ugovor i Razdoblje</h3>

              <div className="form-group">
                <label className="form-label required">Odaberi Ugovor</label>
                <select
                  name="contract_id"
                  value={formData.contract_id}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">-- Odaberi klijenta i ugovor --</option>
                  {contracts.map(contract => (
                    <option key={contract.id} value={contract.id}>
                      {contract.clients?.company || contract.clients?.name} - {contract.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label required">Mjesec</label>
                  <select
                    name="report_month"
                    value={formData.report_month}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    {months.map(month => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label required">Godina</label>
                  <select
                    name="report_year"
                    value={formData.report_year}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    {years.map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Lighthouse Scores */}
            <div className="form-section">
              <h3 className="section-title"><span>🚀</span> Lighthouse Rezultati</h3>
              <p className="section-subtitle">Unesite rezultate iz Google Lighthouse izvještaja (0-100)</p>

              <div className="form-row-4">
                <div className="form-group">
                  <label className="form-label">Performance</label>
                  <div className="score-input-wrapper">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.lighthouse.performance}
                      onChange={(e) => handleNestedChange('lighthouse', 'performance', e.target.value)}
                      className="score-input"
                      placeholder="0-100"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Accessibility</label>
                  <div className="score-input-wrapper">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.lighthouse.accessibility}
                      onChange={(e) => handleNestedChange('lighthouse', 'accessibility', e.target.value)}
                      className="score-input"
                      placeholder="0-100"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Best Practices</label>
                  <div className="score-input-wrapper">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.lighthouse.best_practices}
                      onChange={(e) => handleNestedChange('lighthouse', 'best_practices', e.target.value)}
                      className="score-input"
                      placeholder="0-100"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">SEO</label>
                  <div className="score-input-wrapper">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.lighthouse.seo}
                      onChange={(e) => handleNestedChange('lighthouse', 'seo', e.target.value)}
                      className="score-input"
                      placeholder="0-100"
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">LCP (Largest Contentful Paint)</label>
                  <div className="score-input-wrapper">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.lighthouse.lcp}
                      onChange={(e) => handleNestedChange('lighthouse', 'lcp', e.target.value)}
                      className="score-input"
                      placeholder="npr. 2.5"
                    />
                    <span className="score-suffix">s</span>
                  </div>
                  <div className="input-hint">Dobro: &lt;2.5s, Potrebno poboljšanje: 2.5-4s</div>
                </div>

                <div className="form-group">
                  <label className="form-label">CLS (Cumulative Layout Shift)</label>
                  <div className="score-input-wrapper">
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      value={formData.lighthouse.cls}
                      onChange={(e) => handleNestedChange('lighthouse', 'cls', e.target.value)}
                      className="score-input"
                      placeholder="npr. 0.1"
                    />
                  </div>
                  <div className="input-hint">Dobro: &lt;0.1, Potrebno poboljšanje: 0.1-0.25</div>
                </div>
              </div>
            </div>

            {/* Google Analytics */}
            <div className="form-section">
              <h3 className="section-title"><span>📊</span> Google Analytics</h3>
              <p className="section-subtitle">Podaci o prometu za odabrano razdoblje</p>

              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">Sesije</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.analytics.sessions}
                    onChange={(e) => handleNestedChange('analytics', 'sessions', e.target.value)}
                    className="form-input"
                    placeholder="npr. 1500"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Korisnici</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.analytics.users}
                    onChange={(e) => handleNestedChange('analytics', 'users', e.target.value)}
                    className="form-input"
                    placeholder="npr. 1200"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Pregledi Stranica</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.analytics.pageviews}
                    onChange={(e) => handleNestedChange('analytics', 'pageviews', e.target.value)}
                    className="form-input"
                    placeholder="npr. 4500"
                  />
                </div>
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">Bounce Rate</label>
                  <div className="score-input-wrapper">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={formData.analytics.bounce_rate}
                      onChange={(e) => handleNestedChange('analytics', 'bounce_rate', e.target.value)}
                      className="score-input"
                      placeholder="npr. 45"
                    />
                    <span className="score-suffix">%</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Prosj. Trajanje Sesije</label>
                  <div className="score-input-wrapper">
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={formData.analytics.avg_session_duration}
                      onChange={(e) => handleNestedChange('analytics', 'avg_session_duration', e.target.value)}
                      className="score-input"
                      placeholder="npr. 120"
                    />
                    <span className="score-suffix">s</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Novi Korisnici</label>
                  <div className="score-input-wrapper">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={formData.analytics.new_users_percentage}
                      onChange={(e) => handleNestedChange('analytics', 'new_users_percentage', e.target.value)}
                      className="score-input"
                      placeholder="npr. 65"
                    />
                    <span className="score-suffix">%</span>
                  </div>
                </div>
              </div>

              <h4 style={{ color: '#888', fontSize: '0.9rem', marginTop: '24px', marginBottom: '12px' }}>
                Usporedba s prethodnim mjesecom
              </h4>
              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">Sesije %</label>
                  <div className="score-input-wrapper">
                    <input
                      type="number"
                      step="0.1"
                      value={formData.analytics_comparison.sessions_change}
                      onChange={(e) => handleNestedChange('analytics_comparison', 'sessions_change', e.target.value)}
                      className="score-input"
                      placeholder="npr. +15 ili -5"
                    />
                    <span className="score-suffix">%</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Korisnici %</label>
                  <div className="score-input-wrapper">
                    <input
                      type="number"
                      step="0.1"
                      value={formData.analytics_comparison.users_change}
                      onChange={(e) => handleNestedChange('analytics_comparison', 'users_change', e.target.value)}
                      className="score-input"
                      placeholder="npr. +15 ili -5"
                    />
                    <span className="score-suffix">%</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Pregledi %</label>
                  <div className="score-input-wrapper">
                    <input
                      type="number"
                      step="0.1"
                      value={formData.analytics_comparison.pageviews_change}
                      onChange={(e) => handleNestedChange('analytics_comparison', 'pageviews_change', e.target.value)}
                      className="score-input"
                      placeholder="npr. +15 ili -5"
                    />
                    <span className="score-suffix">%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="form-section">
              <h3 className="section-title"><span>📝</span> Sažetak Mjeseca</h3>
              <div className="form-group">
                <label className="form-label">Pregled Aktivnosti</label>
                <textarea
                  name="summary_text"
                  value={formData.summary_text}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Kratki sažetak održavanja i aktivnosti provedenih tijekom mjeseca..."
                  rows={4}
                />
              </div>
            </div>

            {/* Highlights */}
            <div className="form-section">
              <h3 className="section-title"><span>✨</span> Istaknuto</h3>
              <p className="section-subtitle">Ključna postignuća i važne informacije za ovaj mjesec</p>
              <div className="list-inputs">
                {formData.highlights.map((highlight, i) => (
                  <div key={i} className="list-input-row">
                    <span>{i + 1}</span>
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) => handleArrayChange('highlights', i, e.target.value)}
                      className="form-input"
                      placeholder={`Istaknuta stavka ${i + 1}...`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="form-section">
              <h3 className="section-title"><span>💡</span> Preporuke</h3>
              <p className="section-subtitle">Preporuke za poboljšanja ili napomene za sljedeći mjesec</p>
              <div className="list-inputs">
                {formData.recommendations.map((rec, i) => (
                  <div key={i} className="list-input-row">
                    <span>{i + 1}</span>
                    <input
                      type="text"
                      value={rec}
                      onChange={(e) => handleArrayChange('recommendations', i, e.target.value)}
                      className="form-input"
                      placeholder={`Preporuka ${i + 1}...`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="form-actions">
              <Link href="/crm/reports" className="btn btn-secondary">
                Odustani
              </Link>
              <button type="submit" className="btn btn-primary" disabled={generating}>
                {generating ? 'Generiranje...' : 'Generiraj Izvještaj'}
              </button>
            </div>
          </form>

          {/* Preview Sidebar */}
          <div className="preview-card">
            <div className="preview-title">
              👁️ Pregled
            </div>

            {!formData.contract_id ? (
              <div className="preview-empty">
                Odaberi ugovor za pregled
              </div>
            ) : (
              <>
                <div className="preview-contract">
                  <h4>{selectedContract?.clients?.company || selectedContract?.clients?.name}</h4>
                  <p>{selectedContract?.name}</p>
                  <p style={{ marginTop: '8px' }}>
                    {CROATIAN_MONTHS[formData.report_month - 1]} {formData.report_year}
                  </p>
                </div>

                {/* Lighthouse Preview */}
                {(formData.lighthouse.performance || formData.lighthouse.accessibility ||
                  formData.lighthouse.best_practices || formData.lighthouse.seo) && (
                  <div className="lighthouse-preview">
                    <h4 style={{ fontSize: '0.85rem', color: '#888', marginBottom: '12px' }}>
                      🚀 Lighthouse
                    </h4>
                    <div className="lighthouse-scores">
                      {formData.lighthouse.performance && (
                        <div className="lighthouse-score">
                          <div className="lighthouse-score-value" style={{ color: getScoreColor(formData.lighthouse.performance) }}>
                            {formData.lighthouse.performance}
                          </div>
                          <div className="lighthouse-score-label">Performance</div>
                        </div>
                      )}
                      {formData.lighthouse.accessibility && (
                        <div className="lighthouse-score">
                          <div className="lighthouse-score-value" style={{ color: getScoreColor(formData.lighthouse.accessibility) }}>
                            {formData.lighthouse.accessibility}
                          </div>
                          <div className="lighthouse-score-label">Accessibility</div>
                        </div>
                      )}
                      {formData.lighthouse.best_practices && (
                        <div className="lighthouse-score">
                          <div className="lighthouse-score-value" style={{ color: getScoreColor(formData.lighthouse.best_practices) }}>
                            {formData.lighthouse.best_practices}
                          </div>
                          <div className="lighthouse-score-label">Best Practices</div>
                        </div>
                      )}
                      {formData.lighthouse.seo && (
                        <div className="lighthouse-score">
                          <div className="lighthouse-score-value" style={{ color: getScoreColor(formData.lighthouse.seo) }}>
                            {formData.lighthouse.seo}
                          </div>
                          <div className="lighthouse-score-label">SEO</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Analytics Preview */}
                {(formData.analytics.sessions || formData.analytics.users || formData.analytics.pageviews) && (
                  <div className="analytics-preview">
                    <h4 style={{ fontSize: '0.85rem', color: '#888', marginBottom: '12px' }}>
                      📊 Analytics
                    </h4>
                    <div className="analytics-stats">
                      {formData.analytics.sessions && (
                        <div className="analytics-stat">
                          <div className="analytics-stat-value">
                            {parseInt(formData.analytics.sessions).toLocaleString()}
                          </div>
                          <div className="analytics-stat-label">Sesije</div>
                          {formData.analytics_comparison.sessions_change && (
                            <div className={`analytics-stat-change ${parseFloat(formData.analytics_comparison.sessions_change) >= 0 ? 'positive' : 'negative'}`}>
                              {parseFloat(formData.analytics_comparison.sessions_change) >= 0 ? '+' : ''}{formData.analytics_comparison.sessions_change}%
                            </div>
                          )}
                        </div>
                      )}
                      {formData.analytics.users && (
                        <div className="analytics-stat">
                          <div className="analytics-stat-value">
                            {parseInt(formData.analytics.users).toLocaleString()}
                          </div>
                          <div className="analytics-stat-label">Korisnici</div>
                          {formData.analytics_comparison.users_change && (
                            <div className={`analytics-stat-change ${parseFloat(formData.analytics_comparison.users_change) >= 0 ? 'positive' : 'negative'}`}>
                              {parseFloat(formData.analytics_comparison.users_change) >= 0 ? '+' : ''}{formData.analytics_comparison.users_change}%
                            </div>
                          )}
                        </div>
                      )}
                      {formData.analytics.pageviews && (
                        <div className="analytics-stat">
                          <div className="analytics-stat-value">
                            {parseInt(formData.analytics.pageviews).toLocaleString()}
                          </div>
                          <div className="analytics-stat-label">Pregledi</div>
                          {formData.analytics_comparison.pageviews_change && (
                            <div className={`analytics-stat-change ${parseFloat(formData.analytics_comparison.pageviews_change) >= 0 ? 'positive' : 'negative'}`}>
                              {parseFloat(formData.analytics_comparison.pageviews_change) >= 0 ? '+' : ''}{formData.analytics_comparison.pageviews_change}%
                            </div>
                          )}
                        </div>
                      )}
                      {formData.analytics.bounce_rate && (
                        <div className="analytics-stat">
                          <div className="analytics-stat-value">
                            {formData.analytics.bounce_rate}%
                          </div>
                          <div className="analytics-stat-label">Bounce Rate</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
