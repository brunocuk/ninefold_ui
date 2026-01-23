// app/crm/clients/new/page.jsx
// Add New Client Form

'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/Toast';

export default function NewClientPage() {
  const router = useRouter();
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    industry: '',
    company_size: '',
    address: '',
    city: '',
    country: 'Croatia',
    status: 'active',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([formData])
        .select();

      if (error) throw error;

      // Redirect to client detail
      router.push(`/crm/clients/${data[0].id}`);
    } catch (error) {
      console.error('Error creating client:', error);
      toast.error('Error creating client. Please try again.');
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
        .new-client-page {
          max-width: 900px;
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

      <div className="new-client-page">
        <div className="header">
          <div className="breadcrumb">
            <Link href="/crm/clients">← Back to Clients</Link>
          </div>
          <h1>Add New Client</h1>
          <p style={{color: '#888'}}>
            Create a new client record
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
                    placeholder="john@company.com"
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

                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://company.com"
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Business Details */}
            <div className="form-section">
              <h3 className="section-title">Business Details</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Industry</label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    placeholder="e.g., Technology, Real Estate"
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
                    <option value="solo">Solo / Freelancer</option>
                    <option value="2-10">2-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201+">201+ employees</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="form-section">
              <h3 className="section-title">Location</h3>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street address"
                  />
                </div>

                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Zagreb"
                  />
                </div>

                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Croatia"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="form-section">
              <h3 className="section-title">Additional Notes</h3>
              <div className="form-group full-width">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any additional information about this client..."
                />
                <div className="help-text">
                  Internal notes, preferences, important details, etc.
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="form-actions">
              <Link href="/crm/clients" className="btn btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? 'Creating...' : 'Create Client'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}