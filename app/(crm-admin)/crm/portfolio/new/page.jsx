// app/(crm-admin)/crm/portfolio/new/page.jsx
// Create new portfolio project

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

const PROJECT_TYPES = [
  { id: 'video_production', label: 'Video', icon: '🎬', description: 'Video produkcija, spotovi, reklame' },
  { id: 'social_media', label: 'Social Media', icon: '📱', description: 'Upravljanje društvenim mrežama' },
  { id: 'web_development', label: 'Web', icon: '🌐', description: 'Web stranice i landing pages' },
  { id: 'web_app', label: 'Web App', icon: '💻', description: 'Web aplikacije i SaaS' },
  { id: 'mobile_app', label: 'Mobile App', icon: '📲', description: 'iOS i Android aplikacije' }
];

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

export default function NewPortfolioPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  // Form state
  const [formData, setFormData] = useState({
    // Basic Info
    title: '',
    slug: '',
    tagline: '',
    client_name: '',
    project_type: '',
    year: new Date().getFullYear().toString(),
    duration: '',

    // Content
    description: '',
    challenge: '',
    solution: '',

    // Media
    featured_image: '',
    hero_video: '',
    hero_image: '',
    gallery: [],
    accent_color: '#00FF94',

    // Results
    results: [{ metric: '', label: '' }],

    // Tags
    services: [],
    technologies: [],

    // Type-specific data
    type_data: {},

    // Sections
    sections: [],

    // Testimonial
    testimonial: { quote: '', author: '', role: '', company: '', image: '' },

    // Publishing
    published: false,
    featured: false,
    display_order: 0,
    live_site_url: '',
    related_projects: []
  });

  // Temp inputs for tags
  const [serviceInput, setServiceInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [galleryInput, setGalleryInput] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      // Auto-generate slug from title
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.client_name || !formData.project_type) {
      alert('Molimo popunite obavezna polja: Naziv, Klijent i Tip projekta');
      return;
    }

    setSaving(true);
    try {
      // Clean up empty results
      const cleanedResults = formData.results.filter(r => r.metric && r.label);

      // Clean up testimonial if empty
      const cleanedTestimonial = formData.testimonial.quote
        ? formData.testimonial
        : null;

      const { data, error } = await supabase
        .from('portfolio_projects')
        .insert({
          ...formData,
          results: cleanedResults,
          testimonial: cleanedTestimonial
        })
        .select()
        .single();

      if (error) throw error;

      router.push(`/crm/portfolio/${data.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Greška pri spremanju projekta: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

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
        .form-page {
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 16px;
        }

        h1 {
          font-size: 2rem;
          font-weight: 900;
          background: linear-gradient(135deg, #00FF94 0%, #00CC76 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 12px;
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
        }

        .btn-primary {
          background: #00FF94;
          color: #000;
        }

        .btn-primary:hover:not(:disabled) {
          box-shadow: 0 0 20px rgba(0, 255, 148, 0.4);
          transform: translateY(-2px);
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

        /* Form Sections */
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

        /* Type Selector Cards */
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

      <div className="form-page">
        <form onSubmit={handleSubmit}>
          <div className="header">
            <h1>Novi Projekt</h1>
            <div className="header-actions">
              <Link href="/crm/portfolio" className="btn btn-secondary">
                Odustani
              </Link>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Spremanje...' : 'Spremi Projekt'}
              </button>
            </div>
          </div>

          {/* Tabs */}
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
                    placeholder="Naziv projekta"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Slug (URL)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="naziv-projekta"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Tagline</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => handleInputChange('tagline', e.target.value)}
                    placeholder="Kratki opis projekta"
                  />
                </div>

                <div className="form-group">
                  <label>Klijent *</label>
                  <input
                    type="text"
                    value={formData.client_name}
                    onChange={(e) => handleInputChange('client_name', e.target.value)}
                    placeholder="Ime klijenta"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Godina</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    placeholder="2025"
                  />
                </div>

                <div className="form-group">
                  <label>Trajanje</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="6 tjedana"
                  />
                </div>

                <div className="form-group">
                  <label>URL Stranice</label>
                  <input
                    type="url"
                    value={formData.live_site_url}
                    onChange={(e) => handleInputChange('live_site_url', e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '24px' }}>
                <label>Tip Projekta *</label>
                <div className="type-grid">
                  {PROJECT_TYPES.map(type => (
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
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Detaljan opis projekta..."
                  />
                </div>

                <div className="form-group full-width">
                  <label>Izazov</label>
                  <textarea
                    value={formData.challenge}
                    onChange={(e) => handleInputChange('challenge', e.target.value)}
                    placeholder="Koji je bio izazov?"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Rješenje</label>
                  <textarea
                    value={formData.solution}
                    onChange={(e) => handleInputChange('solution', e.target.value)}
                    placeholder="Kako ste riješili izazov?"
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
                  <label>Glavna Slika (Thumbnail)</label>
                  <input
                    type="text"
                    value={formData.featured_image}
                    onChange={(e) => handleInputChange('featured_image', e.target.value)}
                    placeholder="/images/project/example.webp"
                  />
                  {formData.featured_image && (
                    <img src={formData.featured_image} alt="Preview" style={{ marginTop: '8px', maxHeight: '150px', borderRadius: '8px' }} />
                  )}
                </div>

                <div className="form-group">
                  <label>Hero Video</label>
                  <input
                    type="text"
                    value={formData.hero_video}
                    onChange={(e) => handleInputChange('hero_video', e.target.value)}
                    placeholder="/images/project/example-vid.mp4"
                  />
                </div>

                <div className="form-group">
                  <label>Hero Slika</label>
                  <input
                    type="text"
                    value={formData.hero_image}
                    onChange={(e) => handleInputChange('hero_image', e.target.value)}
                    placeholder="/images/project/example-hero.webp"
                  />
                </div>

                <div className="form-group">
                  <label>Boja Akcenta</label>
                  <div className="color-input">
                    <input
                      type="color"
                      value={formData.accent_color}
                      onChange={(e) => handleInputChange('accent_color', e.target.value)}
                    />
                    <input
                      type="text"
                      value={formData.accent_color}
                      onChange={(e) => handleInputChange('accent_color', e.target.value)}
                      placeholder="#00FF94"
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
              <p style={{ color: '#666', marginBottom: '16px' }}>Dodajte metrike i rezultate projekta (npr. "97/100" - "Lighthouse Performance")</p>

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
              <p style={{ color: '#666', marginBottom: '16px' }}>Dodajte tekstualne ili dvokolonske sekcije za detaljniji prikaz projekta.</p>

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
                          value={section.title}
                          onChange={(e) => updateSection(index, { title: e.target.value })}
                          placeholder="Naslov sekcije"
                          style={{ marginBottom: '12px' }}
                        />
                        <textarea
                          value={section.content}
                          onChange={(e) => updateSection(index, { content: e.target.value })}
                          placeholder="Sadržaj sekcije..."
                        />
                      </>
                    ) : (
                      <div className="form-grid form-grid-2">
                        <div>
                          <input
                            type="text"
                            value={section.left.title}
                            onChange={(e) => updateSection(index, { left: { ...section.left, title: e.target.value } })}
                            placeholder="Naslov lijeve kolone"
                            style={{ marginBottom: '8px' }}
                          />
                          <textarea
                            value={(section.left.items || []).join('\n')}
                            onChange={(e) => updateSection(index, { left: { ...section.left, items: e.target.value.split('\n') } })}
                            placeholder="Stavke (jedna po liniji)"
                            style={{ minHeight: '100px' }}
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={section.right.title}
                            onChange={(e) => updateSection(index, { right: { ...section.right, title: e.target.value } })}
                            placeholder="Naslov desne kolone"
                            style={{ marginBottom: '8px' }}
                          />
                          <textarea
                            value={(section.right.items || []).join('\n')}
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
                    value={formData.testimonial.quote}
                    onChange={(e) => handleTestimonialChange('quote', e.target.value)}
                    placeholder="Što je klijent rekao o projektu..."
                  />
                </div>

                <div className="form-group">
                  <label>Ime</label>
                  <input
                    type="text"
                    value={formData.testimonial.author}
                    onChange={(e) => handleTestimonialChange('author', e.target.value)}
                    placeholder="Ivan Horvat"
                  />
                </div>

                <div className="form-group">
                  <label>Pozicija</label>
                  <input
                    type="text"
                    value={formData.testimonial.role}
                    onChange={(e) => handleTestimonialChange('role', e.target.value)}
                    placeholder="CEO"
                  />
                </div>

                <div className="form-group">
                  <label>Tvrtka</label>
                  <input
                    type="text"
                    value={formData.testimonial.company}
                    onChange={(e) => handleTestimonialChange('company', e.target.value)}
                    placeholder="Tvrtka d.o.o."
                  />
                </div>

                <div className="form-group">
                  <label>Slika</label>
                  <input
                    type="text"
                    value={formData.testimonial.image}
                    onChange={(e) => handleTestimonialChange('image', e.target.value)}
                    placeholder="/testimonials/ivan.jpg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Type-Specific Tab */}
          {activeTab === 'type' && (
            <div className="form-section">
              <h2>Podaci Specifični za Tip</h2>

              {!formData.project_type && (
                <p style={{ color: '#666' }}>Odaberite tip projekta u "Osnovne Info" tabu.</p>
              )}

              {/* Video Production */}
              {formData.project_type === 'video_production' && (
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Showreel URL</label>
                    <input
                      type="text"
                      value={formData.type_data.showreelUrl || ''}
                      onChange={(e) => handleTypeDataChange('showreelUrl', e.target.value)}
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Video Embeds (JSON)</label>
                    <textarea
                      value={JSON.stringify(formData.type_data.videoEmbeds || [], null, 2)}
                      onChange={(e) => {
                        try {
                          handleTypeDataChange('videoEmbeds', JSON.parse(e.target.value));
                        } catch {}
                      }}
                      placeholder='[{"url": "https://youtube.com/...", "title": "Video 1"}]'
                    />
                  </div>
                </div>
              )}

              {/* Social Media */}
              {formData.project_type === 'social_media' && (
                <div className="form-grid form-grid-2">
                  <div className="form-group">
                    <label>Platforme (odvojene zarezom)</label>
                    <input
                      type="text"
                      value={(formData.type_data.platforms || []).join(', ')}
                      onChange={(e) => handleTypeDataChange('platforms', e.target.value.split(',').map(p => p.trim()))}
                      placeholder="Instagram, Facebook, TikTok"
                    />
                  </div>
                  <div className="form-group">
                    <label>Doseg Kampanje</label>
                    <input
                      type="number"
                      value={formData.type_data.campaignMetrics?.reach || ''}
                      onChange={(e) => handleTypeDataChange('campaignMetrics', { ...formData.type_data.campaignMetrics, reach: parseInt(e.target.value) })}
                      placeholder="100000"
                    />
                  </div>
                  <div className="form-group">
                    <label>Engagement</label>
                    <input
                      type="number"
                      value={formData.type_data.campaignMetrics?.engagement || ''}
                      onChange={(e) => handleTypeDataChange('campaignMetrics', { ...formData.type_data.campaignMetrics, engagement: parseInt(e.target.value) })}
                      placeholder="5000"
                    />
                  </div>
                </div>
              )}

              {/* Web Development */}
              {formData.project_type === 'web_development' && (
                <div className="form-grid form-grid-2">
                  <div className="form-group">
                    <label>Lighthouse Performance</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.type_data.lighthouse?.performance || ''}
                      onChange={(e) => handleTypeDataChange('lighthouse', { ...formData.type_data.lighthouse, performance: parseInt(e.target.value) })}
                      placeholder="97"
                    />
                  </div>
                  <div className="form-group">
                    <label>Lighthouse Accessibility</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.type_data.lighthouse?.accessibility || ''}
                      onChange={(e) => handleTypeDataChange('lighthouse', { ...formData.type_data.lighthouse, accessibility: parseInt(e.target.value) })}
                      placeholder="100"
                    />
                  </div>
                  <div className="form-group">
                    <label>Lighthouse Best Practices</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.type_data.lighthouse?.bestPractices || ''}
                      onChange={(e) => handleTypeDataChange('lighthouse', { ...formData.type_data.lighthouse, bestPractices: parseInt(e.target.value) })}
                      placeholder="100"
                    />
                  </div>
                  <div className="form-group">
                    <label>Lighthouse SEO</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.type_data.lighthouse?.seo || ''}
                      onChange={(e) => handleTypeDataChange('lighthouse', { ...formData.type_data.lighthouse, seo: parseInt(e.target.value) })}
                      placeholder="100"
                    />
                  </div>
                </div>
              )}

              {/* Web App */}
              {formData.project_type === 'web_app' && (
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Demo URL</label>
                    <input
                      type="text"
                      value={formData.type_data.demoUrl || ''}
                      onChange={(e) => handleTypeDataChange('demoUrl', e.target.value)}
                      placeholder="https://demo.example.com"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Features (JSON)</label>
                    <textarea
                      value={JSON.stringify(formData.type_data.features || [], null, 2)}
                      onChange={(e) => {
                        try {
                          handleTypeDataChange('features', JSON.parse(e.target.value));
                        } catch {}
                      }}
                      placeholder='[{"name": "Feature 1", "description": "Description"}]'
                    />
                  </div>
                </div>
              )}

              {/* Mobile App */}
              {formData.project_type === 'mobile_app' && (
                <div className="form-grid form-grid-2">
                  <div className="form-group">
                    <label>App Store URL</label>
                    <input
                      type="text"
                      value={formData.type_data.appStoreUrl || ''}
                      onChange={(e) => handleTypeDataChange('appStoreUrl', e.target.value)}
                      placeholder="https://apps.apple.com/..."
                    />
                  </div>
                  <div className="form-group">
                    <label>Play Store URL</label>
                    <input
                      type="text"
                      value={formData.type_data.playStoreUrl || ''}
                      onChange={(e) => handleTypeDataChange('playStoreUrl', e.target.value)}
                      placeholder="https://play.google.com/..."
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
                    value={formData.display_order}
                    onChange={(e) => handleInputChange('display_order', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit button at bottom */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <Link href="/crm/portfolio" className="btn btn-secondary">
              Odustani
            </Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Spremanje...' : 'Spremi Projekt'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
