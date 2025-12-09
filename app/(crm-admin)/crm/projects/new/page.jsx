// app/crm/projects/new/page.jsx
// Add New Project Form

'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewProjectPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    client_id: '',
    name: '',
    description: '',
    project_type: '',
    total_value: '',
    paid_amount: 0,
    start_date: '',
    deadline: '',
    status: 'planning',
    progress: 0,
    repo_url: '',
    staging_url: '',
    production_url: '',
    notes: ''
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, company')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Convert total_value to number
      const projectData = {
        ...formData,
        total_value: parseFloat(formData.total_value),
        paid_amount: parseFloat(formData.paid_amount || 0)
      };

      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select();

      if (error) throw error;

      // Update client's total_projects count
      if (formData.client_id) {
        const { data: client } = await supabase
          .from('clients')
          .select('total_projects, lifetime_value')
          .eq('id', formData.client_id)
          .single();

        if (client) {
          await supabase
            .from('clients')
            .update({
              total_projects: (client.total_projects || 0) + 1,
              lifetime_value: (parseFloat(client.lifetime_value) || 0) + parseFloat(formData.total_value)
            })
            .eq('id', formData.client_id);
        }
      }

      // Redirect to project detail
      router.push(`/crm/projects/${data[0].id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project. Please try again.');
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
        .new-project-page {
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
          min-height: 100px;
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

        .alert {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          color: #92400e;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
      `}</style>

      <div className="new-project-page">
        <div className="header">
          <div className="breadcrumb">
            <Link href="/crm/projects">← Back to Projects</Link>
          </div>
          <h1>New Project</h1>
          <p style={{color: '#888'}}>
            Create a new project to track
          </p>
        </div>

        {clients.length === 0 && (
          <div className="alert">
            ⚠️ No active clients found. <Link href="/crm/clients/new" style={{color: '#92400e', fontWeight: '700'}}>Add a client first</Link>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-card">
            {/* Project Information */}
            <div className="form-section">
              <h3 className="section-title">Project Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    Client <span className="required">*</span>
                  </label>
                  <select
                    name="client_id"
                    value={formData.client_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select client...</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.company || client.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    Project Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Website Redesign"
                    required
                  />
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
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="planning">Planning</option>
                    <option value="design">Design</option>
                    <option value="development">Development</option>
                    <option value="testing">Testing</option>
                    <option value="deployed">Deployed</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Brief description of the project..."
                  />
                </div>
              </div>
            </div>

            {/* Financial Details */}
            <div className="form-section">
              <h3 className="section-title">Financial Details</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    Total Value <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    name="total_value"
                    value={formData.total_value}
                    onChange={handleChange}
                    placeholder="5000"
                    step="0.01"
                    min="0"
                    required
                  />
                  <div className="help-text">Total project value in EUR</div>
                </div>

                <div className="form-group">
                  <label>Amount Paid</label>
                  <input
                    type="number"
                    name="paid_amount"
                    value={formData.paid_amount}
                    onChange={handleChange}
                    placeholder="0"
                    step="0.01"
                    min="0"
                  />
                  <div className="help-text">Amount already received</div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="form-section">
              <h3 className="section-title">Timeline</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Progress (%)</label>
                  <input
                    type="number"
                    name="progress"
                    value={formData.progress}
                    onChange={handleChange}
                    min="0"
                    max="100"
                  />
                  <div className="help-text">0-100%</div>
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="form-section">
              <h3 className="section-title">Technical Details</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Repository URL</label>
                  <input
                    type="url"
                    name="repo_url"
                    value={formData.repo_url}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                  />
                </div>

                <div className="form-group">
                  <label>Staging URL</label>
                  <input
                    type="url"
                    name="staging_url"
                    value={formData.staging_url}
                    onChange={handleChange}
                    placeholder="https://staging.project.com"
                  />
                </div>

                <div className="form-group">
                  <label>Production URL</label>
                  <input
                    type="url"
                    name="production_url"
                    value={formData.production_url}
                    onChange={handleChange}
                    placeholder="https://project.com"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="form-section">
              <h3 className="section-title">Additional Notes</h3>
              <div className="form-group full-width">
                <label>Internal Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any internal notes, blockers, or important details..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="form-actions">
              <Link href="/crm/projects" className="btn btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving || clients.length === 0}
              >
                {saving ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}