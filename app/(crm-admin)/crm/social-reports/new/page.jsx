// app/(crm-admin)/crm/social-reports/new/page.jsx
// Generate new social media report

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

const CROATIAN_MONTHS = [
  'Siječanj', 'Veljača', 'Ožujak', 'Travanj', 'Svibanj', 'Lipanj',
  'Srpanj', 'Kolovoz', 'Rujan', 'Listopad', 'Studeni', 'Prosinac'
];

const CONTENT_TYPES = [
  { key: 'fotografija', label: 'Fotografija', icon: '📷' },
  { key: 'talkingHead', label: 'Talking Head', icon: '🎤' },
  { key: 'videoCarousel', label: 'Video Carousel', icon: '🎬' },
  { key: 'staticCarousel', label: 'Static Carousel', icon: '🖼️' },
  { key: 'reel', label: 'Reel/Short', icon: '📱' },
  { key: 'story', label: 'Story', icon: '⏱️' },
];

const PLATFORMS = [
  { key: 'instagram', label: 'Instagram', color: '#E4405F', icon: '📸' },
  { key: 'facebook', label: 'Facebook', color: '#1877F2', icon: '👍' },
  { key: 'linkedin', label: 'LinkedIn', color: '#0A66C2', icon: '💼' },
  { key: 'tiktok', label: 'TikTok', color: '#000000', icon: '🎵' },
];

export default function NewSocialReportPage() {
  const router = useRouter();
  const now = new Date();
  const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
  const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeSection, setActiveSection] = useState('basics');

  const [formData, setFormData] = useState({
    contract_id: '',
    report_month: lastMonth + 1,
    report_year: lastMonthYear,
    // Content tracking
    content_delivered: {},
    content_planned: {},
    posts_published: '',
    // Platform metrics
    platforms: {
      instagram: { followers: '', follower_change: '', posts: '', reach: '', impressions: '', engagement: '', engagement_rate: '' },
      facebook: { followers: '', follower_change: '', posts: '', reach: '', impressions: '', engagement: '', engagement_rate: '' },
      linkedin: { followers: '', follower_change: '', posts: '', reach: '', impressions: '', engagement: '', engagement_rate: '' },
      tiktok: { followers: '', follower_change: '', posts: '', views: '', engagement: '', engagement_rate: '' },
    },
    // Top posts
    top_posts: [
      { platform: 'instagram', type: 'reel', reach: '', engagement: '', description: '' },
      { platform: 'instagram', type: 'post', reach: '', engagement: '', description: '' },
      { platform: 'instagram', type: 'story', reach: '', engagement: '', description: '' },
    ],
    // Paid ads
    paid_ads_enabled: false,
    paid_ads_spend: '',
    paid_ads_impressions: '',
    paid_ads_clicks: '',
    paid_ads_conversions: '',
    // Narrative
    summary_text: '',
    highlights: ['', '', ''],
    recommendations: ['', '', ''],
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
        .eq('contract_type', 'social_media')
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleContentChange = (section, key, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handlePlatformChange = (platform, field, value) => {
    setFormData(prev => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        [platform]: {
          ...prev.platforms[platform],
          [field]: value
        }
      }
    }));
  };

  const handleTopPostChange = (index, field, value) => {
    setFormData(prev => {
      const newTopPosts = [...prev.top_posts];
      newTopPosts[index] = { ...newTopPosts[index], [field]: value };
      return { ...prev, top_posts: newTopPosts };
    });
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => {
      const arr = [...prev[field]];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const calculateTotals = () => {
    let totalReach = 0;
    let totalImpressions = 0;
    let totalEngagement = 0;
    let followerGrowth = 0;
    let engagementRates = [];

    for (const platform of PLATFORMS) {
      const p = formData.platforms[platform.key];
      if (p) {
        totalReach += parseInt(p.reach) || 0;
        totalImpressions += parseInt(p.impressions) || parseInt(p.views) || 0;
        totalEngagement += parseInt(p.engagement) || 0;
        followerGrowth += parseInt(p.follower_change) || 0;
        if (p.engagement_rate) engagementRates.push(parseFloat(p.engagement_rate));
      }
    }

    const avgEngagementRate = engagementRates.length > 0
      ? (engagementRates.reduce((a, b) => a + b, 0) / engagementRates.length).toFixed(2)
      : null;

    return { totalReach, totalImpressions, totalEngagement, followerGrowth, avgEngagementRate };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.contract_id || !formData.report_month || !formData.report_year) {
      alert('Molimo odaberite ugovor i razdoblje');
      return;
    }

    setGenerating(true);

    try {
      const totals = calculateTotals();

      // Clean up content data
      const contentDelivered = {};
      const contentPlanned = {};
      for (const ct of CONTENT_TYPES) {
        if (formData.content_delivered[ct.key]) {
          contentDelivered[ct.key] = parseInt(formData.content_delivered[ct.key]) || 0;
        }
        if (formData.content_planned[ct.key]) {
          contentPlanned[ct.key] = parseInt(formData.content_planned[ct.key]) || 0;
        }
      }

      // Clean up platform data
      const platforms = {};
      for (const platform of PLATFORMS) {
        const p = formData.platforms[platform.key];
        const hasData = Object.values(p).some(v => v !== '');
        if (hasData) {
          platforms[platform.key] = {
            followers: p.followers ? parseInt(p.followers) : null,
            follower_change: p.follower_change ? parseInt(p.follower_change) : null,
            posts: p.posts ? parseInt(p.posts) : null,
            reach: p.reach ? parseInt(p.reach) : null,
            impressions: p.impressions ? parseInt(p.impressions) : null,
            views: p.views ? parseInt(p.views) : null,
            engagement: p.engagement ? parseInt(p.engagement) : null,
            engagement_rate: p.engagement_rate ? parseFloat(p.engagement_rate) : null,
          };
        }
      }

      // Clean up top posts
      const topPosts = formData.top_posts
        .filter(tp => tp.description || tp.reach || tp.engagement)
        .map(tp => ({
          platform: tp.platform,
          type: tp.type,
          reach: tp.reach ? parseInt(tp.reach) : null,
          engagement: tp.engagement ? parseInt(tp.engagement) : null,
          description: tp.description || null,
        }));

      const response = await fetch('/api/social-media-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contract_id: formData.contract_id,
          report_month: parseInt(formData.report_month),
          report_year: parseInt(formData.report_year),
          content_delivered: contentDelivered,
          content_planned: contentPlanned,
          posts_published: formData.posts_published ? parseInt(formData.posts_published) : 0,
          platforms,
          total_reach: totals.totalReach,
          total_impressions: totals.totalImpressions,
          total_engagement: totals.totalEngagement,
          avg_engagement_rate: totals.avgEngagementRate ? parseFloat(totals.avgEngagementRate) : null,
          follower_growth: totals.followerGrowth,
          top_posts: topPosts,
          paid_ads_enabled: formData.paid_ads_enabled,
          paid_ads_spend: formData.paid_ads_spend ? parseFloat(formData.paid_ads_spend) : null,
          paid_ads_impressions: formData.paid_ads_impressions ? parseInt(formData.paid_ads_impressions) : null,
          paid_ads_clicks: formData.paid_ads_clicks ? parseInt(formData.paid_ads_clicks) : null,
          paid_ads_conversions: formData.paid_ads_conversions ? parseInt(formData.paid_ads_conversions) : null,
          summary_text: formData.summary_text || null,
          highlights: formData.highlights.filter(h => h.trim()),
          recommendations: formData.recommendations.filter(r => r.trim()),
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Greška pri generiranju izvještaja');
      }

      router.push(`/crm/social-reports/${result.data.id}`);
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
  const totals = calculateTotals();

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
          background: linear-gradient(135deg, #E4405F 0%, #3b82f6 50%, #00FF94 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 10px;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 350px;
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

        /* Section Navigation */
        .section-nav {
          display: flex;
          gap: 8px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        .section-nav-btn {
          padding: 10px 16px;
          background: #0a0a0a;
          border: 1px solid #333;
          border-radius: 8px;
          color: #888;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .section-nav-btn:hover {
          border-color: #00FF94;
          color: #00FF94;
        }

        .section-nav-btn.active {
          background: rgba(0, 255, 148, 0.1);
          border-color: #00FF94;
          color: #00FF94;
        }

        .form-section {
          margin-bottom: 32px;
          display: none;
        }

        .form-section.active {
          display: block;
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

        .form-row-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        @media (max-width: 640px) {
          .form-row-3, .form-row-2 {
            grid-template-columns: 1fr;
          }
        }

        /* Content Grid */
        .content-grid-inputs {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
        }

        .content-item {
          background: #0a0a0a;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 12px;
        }

        .content-item-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          font-size: 0.85rem;
          color: #fff;
        }

        .content-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .content-input {
          padding: 8px;
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 6px;
          color: #fff;
          font-size: 0.85rem;
          width: 100%;
        }

        .content-input:focus {
          outline: none;
          border-color: #00FF94;
        }

        .content-input-label {
          font-size: 0.7rem;
          color: #666;
          text-align: center;
          margin-top: 4px;
        }

        /* Platform Card */
        .platform-card {
          background: #0a0a0a;
          border: 1px solid #333;
          border-radius: 12px;
          margin-bottom: 16px;
          overflow: hidden;
        }

        .platform-header {
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .platform-header:hover {
          background: #1a1a1a;
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

        .platform-toggle {
          color: #666;
          transition: transform 0.2s;
        }

        .platform-toggle.open {
          transform: rotate(180deg);
        }

        .platform-content {
          padding: 0 16px 16px;
          display: none;
        }

        .platform-content.open {
          display: block;
        }

        .platform-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 12px;
        }

        /* Top Posts */
        .top-post-card {
          background: #0a0a0a;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 12px;
        }

        .top-post-header {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
        }

        @media (max-width: 640px) {
          .top-post-header {
            grid-template-columns: 1fr 1fr;
          }
        }

        /* Checkbox */
        .checkbox-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #0a0a0a;
          border: 1px solid #333;
          border-radius: 8px;
          cursor: pointer;
        }

        .checkbox-wrapper input {
          width: 20px;
          height: 20px;
          accent-color: #00FF94;
        }

        .checkbox-label {
          color: #fff;
          font-weight: 500;
        }

        /* List Inputs */
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
          color: #E4405F;
          margin-bottom: 6px;
        }

        .preview-contract p {
          font-size: 0.85rem;
          color: #888;
        }

        .preview-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-bottom: 16px;
        }

        .preview-stat {
          background: #0a0a0a;
          border-radius: 8px;
          padding: 12px;
          text-align: center;
        }

        .preview-stat-value {
          font-size: 1.3rem;
          font-weight: 700;
          color: #00FF94;
        }

        .preview-stat-label {
          font-size: 0.7rem;
          color: #666;
          margin-top: 4px;
          text-transform: uppercase;
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
          <Link href="/crm/social-reports" className="back-link">
            ← Natrag na izvještaje
          </Link>
          <h1>Generiraj Social Media Izvještaj</h1>
          <p style={{ color: '#888' }}>Kreiraj mjesečni izvještaj društvenih mreža za klijenta</p>
        </div>

        <div className="content-grid">
          <form onSubmit={handleSubmit} className="form-card">
            {/* Section Navigation */}
            <div className="section-nav">
              <button type="button" className={`section-nav-btn ${activeSection === 'basics' ? 'active' : ''}`} onClick={() => setActiveSection('basics')}>
                📋 Osnove
              </button>
              <button type="button" className={`section-nav-btn ${activeSection === 'content' ? 'active' : ''}`} onClick={() => setActiveSection('content')}>
                📝 Sadržaj
              </button>
              <button type="button" className={`section-nav-btn ${activeSection === 'platforms' ? 'active' : ''}`} onClick={() => setActiveSection('platforms')}>
                📊 Platforme
              </button>
              <button type="button" className={`section-nav-btn ${activeSection === 'top_posts' ? 'active' : ''}`} onClick={() => setActiveSection('top_posts')}>
                ⭐ Top Objave
              </button>
              <button type="button" className={`section-nav-btn ${activeSection === 'paid_ads' ? 'active' : ''}`} onClick={() => setActiveSection('paid_ads')}>
                💰 Oglasi
              </button>
              <button type="button" className={`section-nav-btn ${activeSection === 'summary' ? 'active' : ''}`} onClick={() => setActiveSection('summary')}>
                📄 Sažetak
              </button>
            </div>

            {/* Basics Section */}
            <div className={`form-section ${activeSection === 'basics' ? 'active' : ''}`}>
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
                {contracts.length === 0 && (
                  <p style={{ color: '#f59e0b', fontSize: '0.85rem', marginTop: '8px' }}>
                    Nema aktivnih social media ugovora. Kreirajte ugovor s tipom "social_media" u sekciji Recurring.
                  </p>
                )}
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

            {/* Content Section */}
            <div className={`form-section ${activeSection === 'content' ? 'active' : ''}`}>
              <h3 className="section-title"><span>📝</span> Isporučeni Sadržaj</h3>
              <p className="section-subtitle">Usporedi planirani i isporučeni sadržaj</p>

              <div className="content-grid-inputs">
                {CONTENT_TYPES.map(ct => (
                  <div key={ct.key} className="content-item">
                    <div className="content-item-header">
                      <span>{ct.icon}</span>
                      {ct.label}
                    </div>
                    <div className="content-inputs">
                      <div>
                        <input
                          type="number"
                          min="0"
                          value={formData.content_planned[ct.key] || ''}
                          onChange={(e) => handleContentChange('content_planned', ct.key, e.target.value)}
                          className="content-input"
                          placeholder="0"
                        />
                        <div className="content-input-label">Plan</div>
                      </div>
                      <div>
                        <input
                          type="number"
                          min="0"
                          value={formData.content_delivered[ct.key] || ''}
                          onChange={(e) => handleContentChange('content_delivered', ct.key, e.target.value)}
                          className="content-input"
                          placeholder="0"
                        />
                        <div className="content-input-label">Isporučeno</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="form-group" style={{ marginTop: '20px' }}>
                <label className="form-label">Ukupno Objavljenih Postova</label>
                <input
                  type="number"
                  name="posts_published"
                  value={formData.posts_published}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="npr. 24"
                  min="0"
                />
              </div>
            </div>

            {/* Platforms Section */}
            <div className={`form-section ${activeSection === 'platforms' ? 'active' : ''}`}>
              <h3 className="section-title"><span>📊</span> Metrike Po Platformi</h3>
              <p className="section-subtitle">Unesi statistiku za svaku aktivnu platformu</p>

              {PLATFORMS.map(platform => (
                <PlatformCard
                  key={platform.key}
                  platform={platform}
                  data={formData.platforms[platform.key]}
                  onChange={(field, value) => handlePlatformChange(platform.key, field, value)}
                />
              ))}
            </div>

            {/* Top Posts Section */}
            <div className={`form-section ${activeSection === 'top_posts' ? 'active' : ''}`}>
              <h3 className="section-title"><span>⭐</span> Top Objave</h3>
              <p className="section-subtitle">Izdvoji najbolje objave ovog mjeseca</p>

              {formData.top_posts.map((post, index) => (
                <div key={index} className="top-post-card">
                  <div className="top-post-header">
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Platforma</label>
                      <select
                        value={post.platform}
                        onChange={(e) => handleTopPostChange(index, 'platform', e.target.value)}
                        className="form-select"
                      >
                        {PLATFORMS.map(p => (
                          <option key={p.key} value={p.key}>{p.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Tip</label>
                      <select
                        value={post.type}
                        onChange={(e) => handleTopPostChange(index, 'type', e.target.value)}
                        className="form-select"
                      >
                        <option value="post">Post</option>
                        <option value="reel">Reel</option>
                        <option value="story">Story</option>
                        <option value="carousel">Carousel</option>
                        <option value="video">Video</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Doseg</label>
                      <input
                        type="number"
                        value={post.reach}
                        onChange={(e) => handleTopPostChange(index, 'reach', e.target.value)}
                        className="form-input"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Engagement</label>
                      <input
                        type="number"
                        value={post.engagement}
                        onChange={(e) => handleTopPostChange(index, 'engagement', e.target.value)}
                        className="form-input"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Opis</label>
                    <input
                      type="text"
                      value={post.description}
                      onChange={(e) => handleTopPostChange(index, 'description', e.target.value)}
                      className="form-input"
                      placeholder="Kratki opis sadržaja..."
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Paid Ads Section */}
            <div className={`form-section ${activeSection === 'paid_ads' ? 'active' : ''}`}>
              <h3 className="section-title"><span>💰</span> Plaćeni Oglasi</h3>

              <label className="checkbox-wrapper">
                <input
                  type="checkbox"
                  name="paid_ads_enabled"
                  checked={formData.paid_ads_enabled}
                  onChange={handleChange}
                />
                <span className="checkbox-label">Uključi sekciju plaćenih oglasa</span>
              </label>

              {formData.paid_ads_enabled && (
                <div style={{ marginTop: '20px' }}>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Potrošnja (EUR)</label>
                      <input
                        type="number"
                        name="paid_ads_spend"
                        value={formData.paid_ads_spend}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="npr. 500"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Impresije</label>
                      <input
                        type="number"
                        name="paid_ads_impressions"
                        value={formData.paid_ads_impressions}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="npr. 50000"
                        min="0"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Klikovi</label>
                      <input
                        type="number"
                        name="paid_ads_clicks"
                        value={formData.paid_ads_clicks}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="npr. 1500"
                        min="0"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Konverzije</label>
                      <input
                        type="number"
                        name="paid_ads_conversions"
                        value={formData.paid_ads_conversions}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="npr. 50"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Summary Section */}
            <div className={`form-section ${activeSection === 'summary' ? 'active' : ''}`}>
              <h3 className="section-title"><span>📄</span> Sažetak Mjeseca</h3>

              <div className="form-group">
                <label className="form-label">Pregled Aktivnosti</label>
                <textarea
                  name="summary_text"
                  value={formData.summary_text}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Kratki sažetak social media aktivnosti tijekom mjeseca..."
                  rows={4}
                />
              </div>

              <h4 style={{ color: '#00FF94', marginBottom: '16px', fontSize: '0.95rem' }}>✨ Istaknuto</h4>
              <div className="list-inputs" style={{ marginBottom: '24px' }}>
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

              <h4 style={{ color: '#3b82f6', marginBottom: '16px', fontSize: '0.95rem' }}>💡 Preporuke</h4>
              <div className="list-inputs">
                {formData.recommendations.map((rec, i) => (
                  <div key={i} className="list-input-row">
                    <span style={{ background: '#3b82f6', color: '#fff' }}>{i + 1}</span>
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
              <Link href="/crm/social-reports" className="btn btn-secondary">
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

                <div className="preview-stats">
                  <div className="preview-stat">
                    <div className="preview-stat-value">{formData.posts_published || 0}</div>
                    <div className="preview-stat-label">Objave</div>
                  </div>
                  <div className="preview-stat">
                    <div className="preview-stat-value">{totals.totalReach.toLocaleString()}</div>
                    <div className="preview-stat-label">Doseg</div>
                  </div>
                  <div className="preview-stat">
                    <div className="preview-stat-value">{totals.totalEngagement.toLocaleString()}</div>
                    <div className="preview-stat-label">Engagement</div>
                  </div>
                  <div className="preview-stat">
                    <div className="preview-stat-value" style={{ color: totals.followerGrowth >= 0 ? '#00FF94' : '#ef4444' }}>
                      {totals.followerGrowth >= 0 ? '+' : ''}{totals.followerGrowth}
                    </div>
                    <div className="preview-stat-label">Rast Pratitelja</div>
                  </div>
                </div>

                {totals.avgEngagementRate && (
                  <div style={{ textAlign: 'center', padding: '12px', background: '#0a0a0a', borderRadius: '8px' }}>
                    <div style={{ color: '#00FF94', fontSize: '1.5rem', fontWeight: '700' }}>
                      {totals.avgEngagementRate}%
                    </div>
                    <div style={{ color: '#666', fontSize: '0.75rem', marginTop: '4px' }}>
                      PROSJEČNI ENGAGEMENT RATE
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

// Platform Card Component
function PlatformCard({ platform, data, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const isTikTok = platform.key === 'tiktok';

  return (
    <div className="platform-card">
      <div className="platform-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="platform-icon" style={{ background: platform.color }}>
          {platform.icon}
        </div>
        <div className="platform-name">{platform.label}</div>
        <svg
          className={`platform-toggle ${isOpen ? 'open' : ''}`}
          width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      <div className={`platform-content ${isOpen ? 'open' : ''}`}>
        <div className="platform-metrics">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Pratitelji</label>
            <input
              type="number"
              value={data.followers}
              onChange={(e) => onChange('followers', e.target.value)}
              className="form-input"
              placeholder="0"
              min="0"
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Promjena</label>
            <input
              type="number"
              value={data.follower_change}
              onChange={(e) => onChange('follower_change', e.target.value)}
              className="form-input"
              placeholder="+/-"
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Objave</label>
            <input
              type="number"
              value={data.posts}
              onChange={(e) => onChange('posts', e.target.value)}
              className="form-input"
              placeholder="0"
              min="0"
            />
          </div>
          {!isTikTok ? (
            <>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Doseg</label>
                <input
                  type="number"
                  value={data.reach}
                  onChange={(e) => onChange('reach', e.target.value)}
                  className="form-input"
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Impresije</label>
                <input
                  type="number"
                  value={data.impressions}
                  onChange={(e) => onChange('impressions', e.target.value)}
                  className="form-input"
                  placeholder="0"
                  min="0"
                />
              </div>
            </>
          ) : (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Pregledi</label>
              <input
                type="number"
                value={data.views}
                onChange={(e) => onChange('views', e.target.value)}
                className="form-input"
                placeholder="0"
                min="0"
              />
            </div>
          )}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Engagement</label>
            <input
              type="number"
              value={data.engagement}
              onChange={(e) => onChange('engagement', e.target.value)}
              className="form-input"
              placeholder="0"
              min="0"
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Eng. Rate %</label>
            <input
              type="number"
              step="0.01"
              value={data.engagement_rate}
              onChange={(e) => onChange('engagement_rate', e.target.value)}
              className="form-input"
              placeholder="0.00"
              min="0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
