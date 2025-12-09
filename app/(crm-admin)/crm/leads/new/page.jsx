// app/crm/leads/new/page.jsx
// Add New Lead Form

'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewLeadPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: 'website',
    status: 'new',
    budget_range: '',
    project_type: '',
    description: '',
    timeline: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([formData])
        .select();

      if (error) throw error;

      // Redirect to leads list
      router.push('/crm/leads');
    } catch (error) {
      console.error('Error creating lead:', error);
      alert('Error creating lead. Please try again.');
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <style jsx>{`
        .new-lead-page {
          max-width: 800px;
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .header {
          margin-bottom: 30px;
        }

        h1 {
          font-size: 2.5rem;
          font-weight: 900;
          margin-bottom: 10px;
          background: linear-gradient(135deg, #00FF94 0%, #00CC76 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .breadcrumb {
          color: #888;
          font-size: 0.9rem;
        }

        .breadcrumb a {
          color: #00FF94;
          text-decoration: none;
        }

        .breadcrumb a:hover {
          text-decoration: underline;
        }

        .form-card {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 30px;
        }

        .form-section {
          margin-bottom: 30px;
        }

        .section-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: white;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #333;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        label {
          display: block;
          margin-bottom: 8px;
          color: #aaa;
          font-weight: 600;
          font-size: 0.9rem;
        }

        label .required {
          color: #ef4444;
          margin-left: 3px;
        }

        input,
        select,
        textarea {
          width: 100%;
          padding: 12px 15px;
          background: #0a0a0a;
          border: 1px solid #333;
          border-radius: 8px;
          color: white;
          font-size: 1rem;
          transition: all 0.3s;
          font-family: inherit;
        }

        input:focus,
        select:focus,
        textarea:focus {
          outline: none;
          border-color: #00FF94;
          box-shadow: 0 0 0 3px rgba(0, 255, 148, 0.1);
        }

        textarea {
          min-height: 120px;
          resize: vertical;
        }

        .form-actions {
          display: flex;
          gap: 15px;
          justify-content: flex-end;
          margin-top: 30px;
          padding-top: 30px;
          border-top: 1px solid #333;
        }

        .btn {
          padding: 12px 30px;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          text-decoration: none;
          display: inline-block;
          border: none;
          font-size: 1rem;
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
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #333;
          color: white;
        }

        .btn-secondary:hover {
          background: #444;
        }

        .help-text {
          font-size: 0.85rem;
          color: #666;
          margin-top: 5px;
        }
      `}</style>

      <div className="new-lead-page">
        <div className="header">
          <div className="breadcrumb">
            <Link href="/crm/leads">← Back to Leads</Link>
          </div>
          <h1>Add New Lead</h1>
          <p style={{color: '#888'}}>
            Add a new lead to your sales pipeline
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-card">
            {/* Basic Information */}
            <div className="form-section">
              <h3 className="section-title">Basic Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+385 99 123 4567"
                  />
                </div>

                <div className="form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Acme Inc."
                  />
                </div>
              </div>
            </div>

            {/* Lead Details */}
            <div className="form-section">
              <h3 className="section-title">Lead Details</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Source</label>
                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                  >
                    <option value="website">Website</option>
                    <option value="referral">Referral</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="cold-outreach">Cold Outreach</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal-sent">Proposal Sent</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Budget Range</label>
                  <select
                    name="budget_range"
                    value={formData.budget_range}
                    onChange={handleChange}
                  >
                    <option value="">Select budget...</option>
                    <option value="under-5k">Under €5,000</option>
                    <option value="5k-10k">€5,000 - €10,000</option>
                    <option value="10k-20k">€10,000 - €20,000</option>
                    <option value="20k+">€20,000+</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Project Type</label>
                  <select
                    name="project_type"
                    value={formData.project_type}
                    onChange={handleChange}
                  >
                    <option value="">Select type...</option>
                    <option value="website">Website</option>
                    <option value="web-app">Web Application</option>
                    <option value="e-commerce">E-commerce</option>
                    <option value="redesign">Redesign</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Timeline</label>
                  <input
                    type="text"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    placeholder="e.g., 2-3 months, ASAP"
                  />
                  <div className="help-text">
                    When does the lead need the project completed?
                  </div>
                </div>
              </div>
            </div>

            {/* Project Description */}
            <div className="form-section">
              <h3 className="section-title">Project Description</h3>
              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell us about the project, requirements, goals, etc."
                />
                <div className="help-text">
                  Any additional information about the lead or project
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="form-actions">
              <Link href="/crm/leads" className="btn btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Create Lead'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}