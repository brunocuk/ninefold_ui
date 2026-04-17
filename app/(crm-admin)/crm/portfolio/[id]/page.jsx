// app/(crm-admin)/crm/portfolio/[id]/page.jsx
// Portfolio project detail/edit page

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { use } from 'react';

const PROJECT_TYPES = {
  video_production: { label: 'Video', color: '#E4405F' },
  social_media: { label: 'Social Media', color: '#1877F2' },
  web_development: { label: 'Web', color: '#00FF94' },
  web_app: { label: 'Web App', color: '#8b5cf6' },
  mobile_app: { label: 'Mobile App', color: '#FF6B6B' }
};

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[čćžšđ]/g, c => ({ č: 'c', ć: 'c', ž: 'z', š: 's', đ: 'd' }[c] || c))
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export default function PortfolioDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEditMode = searchParams.get('edit') === 'true';

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(initialEditMode);
  const [activeTab, setActiveTab] = useState('basic');

  // Form state (copy of project for editing)
  const [formData, setFormData] = useState(null);

  // Temp inputs for tags
  const [serviceInput, setServiceInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [galleryInput, setGalleryInput] = useState('');

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setProject(data);
      setFormData({
        ...data,
        results: data.results || [{ metric: '', label: '' }],
        services: data.services || [],
        technologies: data.technologies || [],
        gallery: data.gallery || [],
        sections: data.sections || [],
        testimonial: data.testimonial || { quote: '', author: '', role: '', company: '', image: '' },
        type_data: data.type_data || {}
      });
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'title') {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  const handleTypeDataChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      type_data: { ...prev.type_data, [field]: value }
    }));
  };

  const handleTestimonialChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      testimonial: { ...prev.testimonial, [field]: value }
    }));
  };

  // Results management
  const addResult = () => {
    setFormData(prev => ({
      ...prev,
      results: [...prev.results, { metric: '', label: '' }]
    }));
  };

  const updateResult = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      results: prev.results.map((r, i) => i === index ? { ...r, [field]: value } : r)
    }));
  };

  const removeResult = (index) => {
    setFormData(prev => ({
      ...prev,
      results: prev.results.filter((_, i) => i !== index)
    }));
  };

  // Tags management
  const addService = () => {
    if (serviceInput.trim() && !formData.services.includes(serviceInput.trim())) {
      setFormData(prev => ({ ...prev, services: [...prev.services, serviceInput.trim()] }));
      setServiceInput('');
    }
  };

  const removeService = (service) => {
    setFormData(prev => ({ ...prev, services: prev.services.filter(s => s !== service) }));
  };

  const addTech = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData(prev => ({ ...prev, technologies: [...prev.technologies, techInput.trim()] }));
      setTechInput('');
    }
  };

  const removeTech = (tech) => {
    setFormData(prev => ({ ...prev, technologies: prev.technologies.filter(t => t !== tech) }));
  };

  // Gallery management
  const addGalleryItem = () => {
    if (galleryInput.trim()) {
      setFormData(prev => ({ ...prev, gallery: [...prev.gallery, { url: galleryInput.trim(), caption: '' }] }));
      setGalleryInput('');
    }
  };

  const removeGalleryItem = (index) => {
    setFormData(prev => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== index) }));
  };

  // Sections management
  const addSection = (type) => {
    const newSection = type === 'text'
      ? { type: 'text', title: '', content: '' }
      : { type: 'two-column', left: { title: '', items: [] }, right: { title: '', items: [] } };

    setFormData(prev => ({ ...prev, sections: [...prev.sections, newSection] }));
  };

  const updateSection = (index, data) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((s, i) => i === index ? { ...s, ...data } : s)
    }));
  };

  const removeSection = (index) => {
    setFormData(prev => ({ ...prev, sections: prev.sections.filter((_, i) => i !== index) }));
  };

  const handleSave = async () => {
    if (!formData.title || !formData.client_name || !formData.project_type) {
      alert('Molimo popunite obavezna polja: Naziv, Klijent i Tip projekta');
      return;
    }

    setSaving(true);
    try {
      const cleanedResults = formData.results.filter(r => r.metric && r.label);
      const cleanedTestimonial = formData.testimonial?.quote ? formData.testimonial : null;

      const { error } = await supabase
        .from('portfolio_projects')
        .update({
          ...formData,
          results: cleanedResults,
          testimonial: cleanedTestimonial
        })
        .eq('id', id);

      if (error) throw error;

      setProject({ ...formData, results: cleanedResults, testimonial: cleanedTestimonial });
      setEditMode(false);
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Greška pri spremanju: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Jeste li sigurni da želite obrisati "${project.title}"?`)) return;

    try {
      const { error } = await supabase
        .from('portfolio_projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      router.push('/crm/portfolio');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Greška pri brisanju');
    }
  };

  const cancelEdit = () => {
    setFormData({
      ...project,
      results: project.results || [{ metric: '', label: '' }],
      services: project.services || [],
      technologies: project.technologies || [],
      gallery: project.gallery || [],
      sections: project.sections || [],
      testimonial: project.testimonial || { quote: '', author: '', role: '', company: '', image: '' },
      type_data: project.type_data || {}
    });
    setEditMode(false);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: '#00FF94' }}>
        Učitavanje projekta...
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <h2 style={{ color: '#fff', marginBottom: '16px' }}>Projekt nije pronađen</h2>
        <Link href="/crm/portfolio" style={{ color: '#00FF94' }}>Natrag na listu</Link>
      </div>
    );
  }

  const typeStyle = PROJECT_TYPES[project.project_type] || PROJECT_TYPES.web_development;

  const tabs = [
    { id: 'basic', label: 'Osnovne Info' },
    { id: 'content', label: 'Sadržaj' },
    { id: 'media', label: 'Mediji' },
    { id: 'results', label: 'Rezultati' },
    { id: 'sections', label: 'Sekcije' },
    { id: 'testimonial', label: 'Testimonial' },
    { id: 'type', label: 'Tip-Specifično' },
    { id: 'publish', label: 'Objava' }
  ];

  return (
    <>
      <style jsx global>{`
        .detail-page {
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .header-info h1 {
          font-size: 2rem;
          font-weight: 900;
          color: #fff;
          margin: 0 0 8px 0;
        }

        .header-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .type-badge {
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .header-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          border: none;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
        }

        .btn-primary {
          background: #00FF94;
          color: #000;
        }

        .btn-primary:hover:not(:disabled) {
          box-shadow: 0 0 20px rgba(0, 255, 148, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: transparent;
          color: #888;
          border: 1px solid #333;
        }

        .btn-secondary:hover {
          border-color: #00FF94;
          color: #fff;
        }

        .btn-danger {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .btn-danger:hover {
          background: rgba(239, 68, 68, 0.3);
        }

        /* Tabs */
        .tabs {
          display: flex;
          gap: 4px;
          background: #1a1a1a;
          padding: 6px;
          border-radius: 12px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .tab {
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          background: transparent;
          color: #888;
          border: none;
        }

        .tab:hover {
          color: #fff;
        }

        .tab.active {
          background: #00FF94;
          color: #000;
        }

        /* View Mode Sections */
        .view-section {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .view-section h2 {
          font-size: 1.2rem;
          color: #fff;
          margin: 0 0 20px 0;
          padding-bottom: 12px;
          border-bottom: 1px solid #333;
        }

        .view-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }

        .view-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .view-item label {
          font-size: 0.75rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .view-item span {
          color: #fff;
          font-weight: 500;
        }

        .view-item span.highlight {
          color: #00FF94;
        }

        .view-text {
          color: #888;
          line-height: 1.6;
        }

        .tags-display {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tag-display {
          padding: 4px 10px;
          background: rgba(0, 255, 148, 0.1);
          border: 1px solid rgba(0, 255, 148, 0.3);
          border-radius: 6px;
          font-size: 0.8rem;
          color: #00FF94;
        }

        .results-display {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 16px;
        }

        .result-display {
          padding: 16px;
          background: #0a0a0a;
          border: 1px solid #333;
          border-radius: 8px;
          text-align: center;
        }

        .result-display .metric {
          font-size: 1.5rem;
          font-weight: 900;
          color: #00FF94;
        }

        .result-display .label {
          font-size: 0.75rem;
          color: #888;
          margin-top: 4px;
        }

        .thumbnail-preview {
          max-width: 300px;
          border-radius: 8px;
          margin-top: 12px;
        }

        /* Form Sections (Edit Mode) */
        .form-section {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .form-section h2 {
          font-size: 1.2rem;
          color: #fff;
          margin: 0 0 20px 0;
          padding-bottom: 12px;
          border-bottom: 1px solid #333;
        }

        .form-grid {
          display: grid;
          gap: 20px;
        }

        .form-grid-2 {
          grid-template-columns: repeat(2, 1fr);
        }

        .form-grid-3 {
          grid-template-columns: repeat(3, 1fr);
        }

        @media (max-width: 768px) {
          .form-grid-2, .form-grid-3 {
            grid-template-columns: 1fr;
          }
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        label {
          font-size: 0.85rem;
          color: #888;
          font-weight: 600;
        }

        input, textarea, select {
          padding: 12px 16px;
          background: #0a0a0a;
          border: 1px solid #333;
          border-radius: 8px;
          color: #fff;
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: #00FF94;
          box-shadow: 0 0 0 3px rgba(0, 255, 148, 0.1);
        }

        textarea {
          min-height: 120px;
          resize: vertical;
        }

        /* Type Cards */
        .type-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 12px;
        }

        .type-card {
          padding: 20px;
          background: #0a0a0a;
          border: 2px solid #333;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s;
          text-align: center;
        }

        .type-card:hover {
          border-color: #666;
        }

        .type-card.selected {
          border-color: #00FF94;
          background: rgba(0, 255, 148, 0.05);
        }

        .type-card .icon {
          font-size: 2rem;
          margin-bottom: 8px;
        }

        .type-card .label {
          font-weight: 700;
          color: #fff;
          margin-bottom: 4px;
        }

        .type-card .desc {
          font-size: 0.75rem;
          color: #666;
        }

        /* Tags */
        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 12px;
        }

        .tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(0, 255, 148, 0.1);
          border: 1px solid rgba(0, 255, 148, 0.3);
          border-radius: 6px;
          font-size: 0.85rem;
          color: #00FF94;
        }

        .tag button {
          background: none;
          border: none;
          color: #00FF94;
          cursor: pointer;
          padding: 0;
          font-size: 1rem;
          line-height: 1;
        }

        .tag-input-group {
          display: flex;
          gap: 8px;
        }

        .tag-input-group input {
          flex: 1;
        }

        .btn-add {
          padding: 12px 16px;
          background: rgba(0, 255, 148, 0.2);
          border: 1px solid rgba(0, 255, 148, 0.3);
          color: #00FF94;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        .btn-add:hover {
          background: rgba(0, 255, 148, 0.3);
        }

        .btn-remove {
          padding: 8px 12px;
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
          border-radius: 8px;
          cursor: pointer;
        }

        .btn-remove:hover {
          background: rgba(239, 68, 68, 0.3);
        }

        /* Results List */
        .results-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .result-item {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .result-item input {
          flex: 1;
        }

        /* Sections Builder */
        .sections-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .section-item {
          background: #0a0a0a;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 16px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .section-type {
          font-size: 0.75rem;
          color: #00FF94;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .add-section-btns {
          display: flex;
          gap: 8px;
          margin-top: 16px;
        }

        /* Toggle */
        .toggle-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .toggle {
          width: 48px;
          height: 26px;
          background: #333;
          border-radius: 13px;
          position: relative;
          cursor: pointer;
          transition: background 0.3s;
        }

        .toggle.active {
          background: #00FF94;
        }

        .toggle::after {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          background: #fff;
          border-radius: 50%;
          top: 3px;
          left: 3px;
          transition: transform 0.3s;
        }

        .toggle.active::after {
          transform: translateX(22px);
        }

        /* Gallery */
        .gallery-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }

        .gallery-item {
          position: relative;
          aspect-ratio: 16/9;
          background: #0a0a0a;
          border: 1px solid #333;
          border-radius: 8px;
          overflow: hidden;
        }

        .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .gallery-item button {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 24px;
          height: 24px;
          background: rgba(239, 68, 68, 0.9);
          border: none;
          border-radius: 50%;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Color Picker */
        .color-input {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .color-input input[type="color"] {
          width: 48px;
          height: 48px;
          padding: 0;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .color-input input[type="text"] {
          flex: 1;
        }
      `}</style>

      <div className="detail-page">
        <div className="header">
          <div className="header-info">
            <h1>{project.title}</h1>
            <div className="header-meta">
              <span className="type-badge" style={{ background: typeStyle.color, color: '#000' }}>
                {typeStyle.label}
              </span>
              <span
                className="status-badge"
                style={{
                  background: project.published ? '#00FF94' : '#6b7280',
                  color: project.published ? '#000' : '#fff'
                }}
              >
                {project.published ? 'Objavljeno' : 'Nacrt'}
              </span>
              {project.featured && (
                <span className="status-badge" style={{ background: '#FFD700', color: '#000' }}>
                  Istaknuto
                </span>
              )}
            </div>
          </div>

          <div className="header-actions">
            <Link href="/crm/portfolio" className="btn btn-secondary">
              Natrag
            </Link>
            {project.published && (
              <a
                href={`/work/${project.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                Pregledaj
              </a>
            )}
            {!editMode ? (
              <>
                <button className="btn btn-primary" onClick={() => setEditMode(true)}>
                  Uredi
                </button>
                <button className="btn btn-danger" onClick={handleDelete}>
                  Obriši
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-secondary" onClick={cancelEdit}>
                  Odustani
                </button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? 'Spremanje...' : 'Spremi'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Edit Mode */}
        {editMode && formData && (
          <>
            <div className="tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="form-section">
                <h2>Osnovne Informacije</h2>
                <div className="form-grid form-grid-2">
                  <div className="form-group">
                    <label>Naziv projekta *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Slug (URL)</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Tagline</label>
                    <input
                      type="text"
                      value={formData.tagline || ''}
                      onChange={(e) => handleInputChange('tagline', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Klijent *</label>
                    <input
                      type="text"
                      value={formData.client_name}
                      onChange={(e) => handleInputChange('client_name', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Godina</label>
                    <input
                      type="text"
                      value={formData.year || ''}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Trajanje</label>
                    <input
                      type="text"
                      value={formData.duration || ''}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>URL Stranice</label>
                    <input
                      type="url"
                      value={formData.live_site_url || ''}
                      onChange={(e) => handleInputChange('live_site_url', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '24px' }}>
                  <label>Tip Projekta *</label>
                  <div className="type-grid">
                    {[
                      { id: 'video_production', label: 'Video', icon: '🎬', description: 'Video produkcija' },
                      { id: 'social_media', label: 'Social Media', icon: '📱', description: 'Društvene mreže' },
                      { id: 'web_development', label: 'Web', icon: '🌐', description: 'Web stranice' },
                      { id: 'web_app', label: 'Web App', icon: '💻', description: 'Web aplikacije' },
                      { id: 'mobile_app', label: 'Mobile App', icon: '📲', description: 'Mobilne aplikacije' }
                    ].map(type => (
                      <div
                        key={type.id}
                        className={`type-card ${formData.project_type === type.id ? 'selected' : ''}`}
                        onClick={() => handleInputChange('project_type', type.id)}
                      >
                        <div className="icon">{type.icon}</div>
                        <div className="label">{type.label}</div>
                        <div className="desc">{type.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Content Tab */}
            {activeTab === 'content' && (
              <div className="form-section">
                <h2>Sadržaj</h2>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Opis</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Izazov</label>
                    <textarea
                      value={formData.challenge || ''}
                      onChange={(e) => handleInputChange('challenge', e.target.value)}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Rješenje</label>
                    <textarea
                      value={formData.solution || ''}
                      onChange={(e) => handleInputChange('solution', e.target.value)}
                    />
                  </div>
                </div>

                {/* Services */}
                <div className="form-group" style={{ marginTop: '24px' }}>
                  <label>Usluge</label>
                  <div className="tags-container">
                    {formData.services.map(service => (
                      <span key={service} className="tag">
                        {service}
                        <button type="button" onClick={() => removeService(service)}>×</button>
                      </span>
                    ))}
                  </div>
                  <div className="tag-input-group">
                    <input
                      type="text"
                      value={serviceInput}
                      onChange={(e) => setServiceInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                      placeholder="Web Design, SEO, Video..."
                    />
                    <button type="button" className="btn-add" onClick={addService}>Dodaj</button>
                  </div>
                </div>

                {/* Technologies */}
                <div className="form-group" style={{ marginTop: '24px' }}>
                  <label>Tehnologije</label>
                  <div className="tags-container">
                    {formData.technologies.map(tech => (
                      <span key={tech} className="tag">
                        {tech}
                        <button type="button" onClick={() => removeTech(tech)}>×</button>
                      </span>
                    ))}
                  </div>
                  <div className="tag-input-group">
                    <input
                      type="text"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                      placeholder="React, Next.js, Figma..."
                    />
                    <button type="button" className="btn-add" onClick={addTech}>Dodaj</button>
                  </div>
                </div>
              </div>
            )}

            {/* Media Tab */}
            {activeTab === 'media' && (
              <div className="form-section">
                <h2>Mediji</h2>
                <div className="form-grid form-grid-2">
                  <div className="form-group">
                    <label>Glavna Slika</label>
                    <input
                      type="text"
                      value={formData.featured_image || ''}
                      onChange={(e) => handleInputChange('featured_image', e.target.value)}
                    />
                    {formData.featured_image && (
                      <img src={formData.featured_image} alt="Preview" style={{ marginTop: '8px', maxHeight: '150px', borderRadius: '8px' }} />
                    )}
                  </div>
                  <div className="form-group">
                    <label>Hero Video</label>
                    <input
                      type="text"
                      value={formData.hero_video || ''}
                      onChange={(e) => handleInputChange('hero_video', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Hero Slika</label>
                    <input
                      type="text"
                      value={formData.hero_image || ''}
                      onChange={(e) => handleInputChange('hero_image', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Boja Akcenta</label>
                    <div className="color-input">
                      <input
                        type="color"
                        value={formData.accent_color || '#00FF94'}
                        onChange={(e) => handleInputChange('accent_color', e.target.value)}
                      />
                      <input
                        type="text"
                        value={formData.accent_color || '#00FF94'}
                        onChange={(e) => handleInputChange('accent_color', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Gallery */}
                <div className="form-group" style={{ marginTop: '24px' }}>
                  <label>Galerija</label>
                  {formData.gallery.length > 0 && (
                    <div className="gallery-list">
                      {formData.gallery.map((item, index) => (
                        <div key={index} className="gallery-item">
                          <img src={item.url} alt={`Gallery ${index + 1}`} />
                          <button type="button" onClick={() => removeGalleryItem(index)}>×</button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="tag-input-group">
                    <input
                      type="text"
                      value={galleryInput}
                      onChange={(e) => setGalleryInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGalleryItem())}
                      placeholder="URL slike"
                    />
                    <button type="button" className="btn-add" onClick={addGalleryItem}>Dodaj</button>
                  </div>
                </div>
              </div>
            )}

            {/* Results Tab */}
            {activeTab === 'results' && (
              <div className="form-section">
                <h2>Rezultati</h2>
                <div className="results-list">
                  {formData.results.map((result, index) => (
                    <div key={index} className="result-item">
                      <input
                        type="text"
                        value={result.metric}
                        onChange={(e) => updateResult(index, 'metric', e.target.value)}
                        placeholder="97/100"
                        style={{ maxWidth: '150px' }}
                      />
                      <input
                        type="text"
                        value={result.label}
                        onChange={(e) => updateResult(index, 'label', e.target.value)}
                        placeholder="Lighthouse Performance"
                      />
                      <button type="button" className="btn-remove" onClick={() => removeResult(index)}>×</button>
                    </div>
                  ))}
                </div>
                <button type="button" className="btn-add" onClick={addResult} style={{ marginTop: '16px' }}>
                  + Dodaj Rezultat
                </button>
              </div>
            )}

            {/* Sections Tab */}
            {activeTab === 'sections' && (
              <div className="form-section">
                <h2>Dodatne Sekcije</h2>
                <div className="sections-list">
                  {formData.sections.map((section, index) => (
                    <div key={index} className="section-item">
                      <div className="section-header">
                        <span className="section-type">
                          {section.type === 'text' ? 'Tekst' : 'Dvije Kolone'}
                        </span>
                        <button type="button" className="btn-remove" onClick={() => removeSection(index)}>×</button>
                      </div>
                      {section.type === 'text' ? (
                        <>
                          <input
                            type="text"
                            value={section.title || ''}
                            onChange={(e) => updateSection(index, { title: e.target.value })}
                            placeholder="Naslov sekcije"
                            style={{ marginBottom: '12px' }}
                          />
                          <textarea
                            value={section.content || ''}
                            onChange={(e) => updateSection(index, { content: e.target.value })}
                            placeholder="Sadržaj sekcije..."
                          />
                        </>
                      ) : (
                        <div className="form-grid form-grid-2">
                          <div>
                            <input
                              type="text"
                              value={section.left?.title || ''}
                              onChange={(e) => updateSection(index, { left: { ...section.left, title: e.target.value } })}
                              placeholder="Naslov lijeve kolone"
                              style={{ marginBottom: '8px' }}
                            />
                            <textarea
                              value={(section.left?.items || []).join('\n')}
                              onChange={(e) => updateSection(index, { left: { ...section.left, items: e.target.value.split('\n') } })}
                              placeholder="Stavke (jedna po liniji)"
                              style={{ minHeight: '100px' }}
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              value={section.right?.title || ''}
                              onChange={(e) => updateSection(index, { right: { ...section.right, title: e.target.value } })}
                              placeholder="Naslov desne kolone"
                              style={{ marginBottom: '8px' }}
                            />
                            <textarea
                              value={(section.right?.items || []).join('\n')}
                              onChange={(e) => updateSection(index, { right: { ...section.right, items: e.target.value.split('\n') } })}
                              placeholder="Stavke (jedna po liniji)"
                              style={{ minHeight: '100px' }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="add-section-btns">
                  <button type="button" className="btn-add" onClick={() => addSection('text')}>
                    + Tekst Sekcija
                  </button>
                  <button type="button" className="btn-add" onClick={() => addSection('two-column')}>
                    + Dvije Kolone
                  </button>
                </div>
              </div>
            )}

            {/* Testimonial Tab */}
            {activeTab === 'testimonial' && (
              <div className="form-section">
                <h2>Testimonial</h2>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Citat</label>
                    <textarea
                      value={formData.testimonial?.quote || ''}
                      onChange={(e) => handleTestimonialChange('quote', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Ime</label>
                    <input
                      type="text"
                      value={formData.testimonial?.author || ''}
                      onChange={(e) => handleTestimonialChange('author', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Pozicija</label>
                    <input
                      type="text"
                      value={formData.testimonial?.role || ''}
                      onChange={(e) => handleTestimonialChange('role', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Tvrtka</label>
                    <input
                      type="text"
                      value={formData.testimonial?.company || ''}
                      onChange={(e) => handleTestimonialChange('company', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Slika</label>
                    <input
                      type="text"
                      value={formData.testimonial?.image || ''}
                      onChange={(e) => handleTestimonialChange('image', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Type-Specific Tab */}
            {activeTab === 'type' && (
              <div className="form-section">
                <h2>Podaci Specifični za Tip</h2>

                {formData.project_type === 'video_production' && (
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>Showreel URL</label>
                      <input
                        type="text"
                        value={formData.type_data?.showreelUrl || ''}
                        onChange={(e) => handleTypeDataChange('showreelUrl', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {formData.project_type === 'social_media' && (
                  <div className="form-grid form-grid-2">
                    <div className="form-group">
                      <label>Platforme</label>
                      <input
                        type="text"
                        value={(formData.type_data?.platforms || []).join(', ')}
                        onChange={(e) => handleTypeDataChange('platforms', e.target.value.split(',').map(p => p.trim()))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Doseg</label>
                      <input
                        type="number"
                        value={formData.type_data?.campaignMetrics?.reach || ''}
                        onChange={(e) => handleTypeDataChange('campaignMetrics', { ...formData.type_data.campaignMetrics, reach: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                )}

                {formData.project_type === 'web_development' && (
                  <div className="form-grid form-grid-2">
                    <div className="form-group">
                      <label>Lighthouse Performance</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.type_data?.lighthouse?.performance || ''}
                        onChange={(e) => handleTypeDataChange('lighthouse', { ...formData.type_data.lighthouse, performance: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Lighthouse Accessibility</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.type_data?.lighthouse?.accessibility || ''}
                        onChange={(e) => handleTypeDataChange('lighthouse', { ...formData.type_data.lighthouse, accessibility: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Lighthouse Best Practices</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.type_data?.lighthouse?.bestPractices || ''}
                        onChange={(e) => handleTypeDataChange('lighthouse', { ...formData.type_data.lighthouse, bestPractices: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Lighthouse SEO</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.type_data?.lighthouse?.seo || ''}
                        onChange={(e) => handleTypeDataChange('lighthouse', { ...formData.type_data.lighthouse, seo: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                )}

                {formData.project_type === 'mobile_app' && (
                  <div className="form-grid form-grid-2">
                    <div className="form-group">
                      <label>App Store URL</label>
                      <input
                        type="text"
                        value={formData.type_data?.appStoreUrl || ''}
                        onChange={(e) => handleTypeDataChange('appStoreUrl', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Play Store URL</label>
                      <input
                        type="text"
                        value={formData.type_data?.playStoreUrl || ''}
                        onChange={(e) => handleTypeDataChange('playStoreUrl', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {formData.project_type === 'web_app' && (
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>Demo URL</label>
                      <input
                        type="text"
                        value={formData.type_data?.demoUrl || ''}
                        onChange={(e) => handleTypeDataChange('demoUrl', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Publish Tab */}
            {activeTab === 'publish' && (
              <div className="form-section">
                <h2>Objava</h2>
                <div className="form-grid form-grid-3">
                  <div className="form-group">
                    <label>Status</label>
                    <div className="toggle-group">
                      <div
                        className={`toggle ${formData.published ? 'active' : ''}`}
                        onClick={() => handleInputChange('published', !formData.published)}
                      />
                      <span style={{ color: formData.published ? '#00FF94' : '#888' }}>
                        {formData.published ? 'Objavljeno' : 'Nacrt'}
                      </span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Istaknuto</label>
                    <div className="toggle-group">
                      <div
                        className={`toggle ${formData.featured ? 'active' : ''}`}
                        onClick={() => handleInputChange('featured', !formData.featured)}
                      />
                      <span style={{ color: formData.featured ? '#00FF94' : '#888' }}>
                        {formData.featured ? 'Da' : 'Ne'}
                      </span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Redoslijed prikaza</label>
                    <input
                      type="number"
                      value={formData.display_order || 0}
                      onChange={(e) => handleInputChange('display_order', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* View Mode */}
        {!editMode && (
          <>
            {/* Basic Info */}
            <div className="view-section">
              <h2>Osnovne Informacije</h2>
              <div className="view-grid">
                <div className="view-item">
                  <label>Klijent</label>
                  <span>{project.client_name}</span>
                </div>
                <div className="view-item">
                  <label>Godina</label>
                  <span>{project.year || '-'}</span>
                </div>
                <div className="view-item">
                  <label>Trajanje</label>
                  <span>{project.duration || '-'}</span>
                </div>
                <div className="view-item">
                  <label>Slug</label>
                  <span className="highlight">/work/{project.slug}</span>
                </div>
                {project.live_site_url && (
                  <div className="view-item">
                    <label>Web stranica</label>
                    <a href={project.live_site_url} target="_blank" rel="noopener noreferrer" style={{ color: '#00FF94' }}>
                      {project.live_site_url}
                    </a>
                  </div>
                )}
              </div>
              {project.tagline && (
                <p className="view-text" style={{ marginTop: '16px' }}>
                  <strong>Tagline:</strong> {project.tagline}
                </p>
              )}
            </div>

            {/* Content */}
            {(project.description || project.challenge || project.solution) && (
              <div className="view-section">
                <h2>Sadržaj</h2>
                {project.description && (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px' }}>Opis</label>
                    <p className="view-text">{project.description}</p>
                  </div>
                )}
                {project.challenge && (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px' }}>Izazov</label>
                    <p className="view-text">{project.challenge}</p>
                  </div>
                )}
                {project.solution && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px' }}>Rješenje</label>
                    <p className="view-text">{project.solution}</p>
                  </div>
                )}
              </div>
            )}

            {/* Services & Tech */}
            {((project.services && project.services.length > 0) || (project.technologies && project.technologies.length > 0)) && (
              <div className="view-section">
                <h2>Usluge & Tehnologije</h2>
                {project.services && project.services.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px' }}>Usluge</label>
                    <div className="tags-display">
                      {project.services.map((s, i) => (
                        <span key={i} className="tag-display">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px' }}>Tehnologije</label>
                    <div className="tags-display">
                      {project.technologies.map((t, i) => (
                        <span key={i} className="tag-display" style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Results */}
            {project.results && project.results.length > 0 && (
              <div className="view-section">
                <h2>Rezultati</h2>
                <div className="results-display">
                  {project.results.map((r, i) => (
                    <div key={i} className="result-display">
                      <div className="metric">{r.metric}</div>
                      <div className="label">{r.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Media */}
            <div className="view-section">
              <h2>Mediji</h2>
              <div className="view-grid">
                {project.featured_image && (
                  <div className="view-item">
                    <label>Glavna Slika</label>
                    <img src={project.featured_image} alt="Featured" className="thumbnail-preview" />
                  </div>
                )}
                {project.hero_video && (
                  <div className="view-item">
                    <label>Hero Video</label>
                    <span>{project.hero_video}</span>
                  </div>
                )}
                {project.hero_image && (
                  <div className="view-item">
                    <label>Hero Slika</label>
                    <span>{project.hero_image}</span>
                  </div>
                )}
                <div className="view-item">
                  <label>Boja Akcenta</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: project.accent_color || '#00FF94' }} />
                    <span>{project.accent_color || '#00FF94'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            {project.testimonial && project.testimonial.quote && (
              <div className="view-section">
                <h2>Testimonial</h2>
                <blockquote style={{ borderLeft: '4px solid #00FF94', paddingLeft: '16px', margin: 0, fontStyle: 'italic', color: '#888' }}>
                  "{project.testimonial.quote}"
                </blockquote>
                <p style={{ marginTop: '12px', color: '#fff' }}>
                  — {project.testimonial.author}, {project.testimonial.role} @ {project.testimonial.company}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
