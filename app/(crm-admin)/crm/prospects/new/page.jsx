// app/crm/prospects/new/page.jsx
// Add New Prospect Form

'use client';

import { useState } from 'react';
import { getAuthenticatedClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/Toast';

export default function NewProspectPage() {
  const router = useRouter();
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    contact_name: '',
    title: '',
    company: '',
    primary_email: '',
    secondary_email: '',
    tertiary_email: '',
    website_url: '',
    linkedin_url: '',
    status: 'researched',
    industry: '',
    company_size: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const supabase = getAuthenticatedClient();
      const { data, error } = await supabase
        .from('prospects')
        .insert([formData])
        .select();

      if (error) throw error;

      // Redirect to prospects list
      router.push('/crm/prospects');
    } catch (error) {
      console.error('Error creating prospect:', error);
      toast.error('Error creating prospect. Please try again.');
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
        .new-prospect-page {
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

      <div className="new-prospect-page">
        <div className="header">
          <div className="breadcrumb">
            <Link href="/crm/prospects">← Back to Prospects</Link>
          </div>
          <h1>Add New Prospect</h1>
          <p style={{color: '#888'}}>
            Add a new prospect to your cold outreach pipeline
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-card">
            {/* Contact Information */}
            <div className="form-section">
              <h3 className="section-title">Contact Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    Contact Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="contact_name"
                    value={formData.contact_name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="CEO, Founder, Marketing Director"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Company <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Acme Inc."
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Industry</label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    placeholder="SaaS, E-commerce, Healthcare"
                  />
                </div>

                <div className="form-group">
                  <label>Company Size</label>
                  <select
                    name="company_size"
                    value={formData.company_size}
                    onChange={handleChange}
                  >
                    <option value="">Select size...</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Email Addresses */}
            <div className="form-section">
              <h3 className="section-title">Email Addresses</h3>
              <div className="form-group">
                <label>
                  Primary Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  name="primary_email"
                  value={formData.primary_email}
                  onChange={handleChange}
                  placeholder="john@acme.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Secondary Email</label>
                <input
                  type="email"
                  name="secondary_email"
                  value={formData.secondary_email}
                  onChange={handleChange}
                  placeholder="john.doe@acme.com"
                />
                <div className="help-text">
                  Alternative email for A/B testing
                </div>
              </div>

              <div className="form-group">
                <label>Tertiary Email</label>
                <input
                  type="email"
                  name="tertiary_email"
                  value={formData.tertiary_email}
                  onChange={handleChange}
                  placeholder="jdoe@acme.com"
                />
                <div className="help-text">
                  Second alternative email
                </div>
              </div>
            </div>

            {/* Online Presence */}
            <div className="form-section">
              <h3 className="section-title">Online Presence</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Website URL</label>
                  <input
                    type="url"
                    name="website_url"
                    value={formData.website_url}
                    onChange={handleChange}
                    placeholder="https://example.com"
                  />
                </div>

                <div className="form-group">
                  <label>LinkedIn URL</label>
                  <input
                    type="url"
                    name="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>
            </div>

            {/* Outreach Details */}
            <div className="form-section">
              <h3 className="section-title">Outreach Details</h3>
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="researched">Researched</option>
                  <option value="outreach-pending">Outreach Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="responding">Responding</option>
                  <option value="qualified">Qualified</option>
                  <option value="unresponsive">Unresponsive</option>
                  <option value="disqualified">Disqualified</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Research notes, talking points, or outreach strategy..."
                />
                <div className="help-text">
                  Any additional information about the prospect, pain points, or outreach approach
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="form-actions">
              <Link href="/crm/prospects" className="btn btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Create Prospect'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
