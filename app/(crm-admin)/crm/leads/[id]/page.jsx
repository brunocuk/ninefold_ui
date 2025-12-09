// app/crm/leads/[id]/page.jsx
// Lead Detail Page - View and Edit Individual Lead

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadLead();
  }, [params.id]);

  const loadLead = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;

      setLead(data);
      setFormData(data);
    } catch (error) {
      console.error('Error loading lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('leads')
        .update(formData)
        .eq('id', params.id);

      if (error) throw error;

      setLead(formData);
      setEditing(false);
    } catch (error) {
      console.error('Error updating lead:', error);
      alert('Error updating lead. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleConvertToClient = async () => {
    if (!confirm('Convert this lead to a client? This will create a new client record.')) {
      return;
    }

    try {
      // Create client from lead
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .insert([{
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          company: lead.company,
          lead_id: lead.id
        }])
        .select()
        .single();

      if (clientError) throw clientError;

      // Update lead status to won
      await supabase
        .from('leads')
        .update({ 
          status: 'won',
          converted_at: new Date().toISOString()
        })
        .eq('id', params.id);

      // Redirect to client
      router.push(`/crm/clients/${client.id}`);
    } catch (error) {
      console.error('Error converting lead:', error);
      alert('Error converting lead. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', params.id);

      if (error) throw error;

      router.push('/crm/leads');
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Error deleting lead. Please try again.');
    }
  };

  if (loading) {
    return (
      <div style={{textAlign: 'center', padding: '100px 0'}}>
        <div style={{fontSize: '1.5rem', color: '#00FF94'}}>Loading lead...</div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div style={{textAlign: 'center', padding: '100px 0'}}>
        <h2 style={{color: 'white'}}>Lead not found</h2>
        <Link href="/crm/leads" style={{color: '#00FF94'}}>← Back to Leads</Link>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .lead-detail {
          max-width: 1000px;
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .breadcrumb {
          color: #888;
          font-size: 0.9rem;
          margin-bottom: 20px;
        }

        .breadcrumb a {
          color: #00FF94;
          text-decoration: none;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 30px;
        }

        h1 {
          font-size: 2.5rem;
          font-weight: 900;
          margin-bottom: 10px;
          color: white;
        }

        .status-badge {
          padding: 8px 16px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          text-decoration: none;
          display: inline-block;
          border: none;
          font-size: 0.95rem;
        }

        .btn-primary {
          background: #00FF94;
          color: #000;
        }

        .btn-secondary {
          background: #333;
          color: white;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn:hover {
          transform: translateY(-2px);
        }

        .content-grid {
          display: grid;
          gap: 20px;
          margin-top: 30px;
        }

        .card {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 25px;
        }

        .card-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: white;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #333;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .info-item {
          background: #0a0a0a;
          padding: 15px;
          border-radius: 8px;
        }

        .info-label {
          font-size: 0.8rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 5px;
        }

        .info-value {
          font-size: 1.1rem;
          font-weight: 600;
          color: #00FF94;
        }

        .form-group {
          margin-bottom: 20px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          color: #aaa;
          font-weight: 600;
          font-size: 0.9rem;
        }

        input, select, textarea {
          width: 100%;
          padding: 12px 15px;
          background: #0a0a0a;
          border: 1px solid #333;
          border-radius: 8px;
          color: white;
          font-size: 1rem;
          font-family: inherit;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #00FF94;
        }

        textarea {
          min-height: 120px;
          resize: vertical;
        }
      `}</style>

      <div className="lead-detail">
        <div className="breadcrumb">
          <Link href="/crm/leads">← Back to Leads</Link>
        </div>

        <div className="header">
          <div>
            <h1>{lead.name}</h1>
            <div style={{color: '#888', marginTop: '10px'}}>
              {lead.email} {lead.phone && `• ${lead.phone}`}
              {lead.company && ` • ${lead.company}`}
            </div>
          </div>
          <span 
            className="status-badge"
            style={{
              background: lead.status === 'qualified' ? '#00FF94' : 
                         lead.status === 'won' ? '#10b981' :
                         lead.status === 'lost' ? '#ef4444' : '#3b82f6',
              color: ['qualified', 'won'].includes(lead.status) ? '#000' : '#fff'
            }}
          >
            {lead.status}
          </span>
        </div>

        <div className="actions">
          {!editing && (
            <>
              <button onClick={() => setEditing(true)} className="btn btn-primary">
                ✏️ Edit
              </button>
              {lead.status !== 'won' && lead.status !== 'lost' && (
                <button onClick={handleConvertToClient} className="btn btn-secondary">
                  🏢 Convert to Client
                </button>
              )}
              <button onClick={handleDelete} className="btn btn-danger">
                🗑️ Delete
              </button>
            </>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleUpdate}>
            <div className="card" style={{marginTop: '30px'}}>
              <h3 className="card-title">Edit Lead</h3>

              <div className="info-grid">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    value={formData.company || ''}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status || 'new'}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal-sent">Proposal Sent</option>
                    <option value="won">Won</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Source</label>
                  <select
                    value={formData.source || ''}
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                  >
                    <option value="website">Website</option>
                    <option value="referral">Referral</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="cold-outreach">Cold Outreach</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Budget Range</label>
                  <select
                    value={formData.budget_range || ''}
                    onChange={(e) => setFormData({...formData, budget_range: e.target.value})}
                  >
                    <option value="">Select...</option>
                    <option value="under-5k">Under €5,000</option>
                    <option value="5k-10k">€5,000 - €10,000</option>
                    <option value="10k-20k">€10,000 - €20,000</option>
                    <option value="20k+">€20,000+</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Project Type</label>
                  <select
                    value={formData.project_type || ''}
                    onChange={(e) => setFormData({...formData, project_type: e.target.value})}
                  >
                    <option value="">Select...</option>
                    <option value="website">Website</option>
                    <option value="web-app">Web Application</option>
                    <option value="e-commerce">E-commerce</option>
                    <option value="redesign">Redesign</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{marginTop: '20px'}}>
                <label>Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div style={{display: 'flex', gap: '10px', marginTop: '30px'}}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setFormData(lead);
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="content-grid">
            <div className="card">
              <h3 className="card-title">Lead Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">Source</div>
                  <div className="info-value">{lead.source || 'N/A'}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Budget Range</div>
                  <div className="info-value">{lead.budget_range || 'N/A'}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Project Type</div>
                  <div className="info-value">{lead.project_type || 'N/A'}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Timeline</div>
                  <div className="info-value">{lead.timeline || 'N/A'}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Created</div>
                  <div className="info-value">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {lead.description && (
              <div className="card">
                <h3 className="card-title">Project Description</h3>
                <p style={{color: '#aaa', lineHeight: '1.8'}}>
                  {lead.description}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}