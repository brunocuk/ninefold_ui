// app/crm/clients/[id]/page.jsx
// Client Detail Page - View client with related projects and quotes

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [client, setClient] = useState(null);
  const [projects, setProjects] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadClientData();
  }, [params.id]);

  const loadClientData = async () => {
    try {
      // Load client
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', params.id)
        .single();

      if (clientError) throw clientError;

      setClient(clientData);
      setFormData(clientData);

      // Load related projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', params.id)
        .order('created_at', { ascending: false });

      setProjects(projectsData || []);

      // Load related quotes
      const { data: quotesData } = await supabase
        .from('quotes')
        .select('*')
        .eq('client_id', params.id)
        .order('created_at', { ascending: false });

      setQuotes(quotesData || []);

    } catch (error) {
      console.error('Error loading client:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('clients')
        .update(formData)
        .eq('id', params.id);

      if (error) throw error;

      setClient(formData);
      setEditing(false);
    } catch (error) {
      console.error('Error updating client:', error);
      alert('Error updating client. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', params.id);

      if (error) throw error;

      router.push('/crm/clients');
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('Error deleting client. Please try again.');
    }
  };

  if (loading) {
    return (
      <div style={{textAlign: 'center', padding: '100px 0'}}>
        <div style={{fontSize: '1.5rem', color: '#00FF94'}}>Loading client...</div>
      </div>
    );
  }

  if (!client) {
    return (
      <div style={{textAlign: 'center', padding: '100px 0'}}>
        <h2 style={{color: 'white'}}>Client not found</h2>
        <Link href="/crm/clients" style={{color: '#00FF94'}}>← Back to Clients</Link>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .client-detail {
          max-width: 1200px;
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
          color: white;
          margin-bottom: 10px;
        }

        .company-name {
          font-size: 1.2rem;
          color: #00FF94;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .contact-info {
          color: #888;
          font-size: 0.95rem;
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

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }

        .stat-label {
          font-size: 0.8rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 900;
          color: #00FF94;
        }

        .content-grid {
          display: grid;
          gap: 20px;
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
          display: flex;
          justify-content: space-between;
          align-items: center;
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

        .list-item {
          background: #0a0a0a;
          border: 1px solid #222;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 10px;
          transition: all 0.3s;
          cursor: pointer;
        }

        .list-item:hover {
          border-color: #00FF94;
        }

        .empty-message {
          text-align: center;
          color: #666;
          padding: 40px;
          font-style: italic;
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
          min-height: 100px;
          resize: vertical;
        }
      `}</style>

      <div className="client-detail">
        <div className="breadcrumb">
          <Link href="/crm/clients">← Back to Clients</Link>
        </div>

        <div className="header">
          <div>
            <h1>{client.name}</h1>
            {client.company && <div className="company-name">🏢 {client.company}</div>}
            <div className="contact-info">
              {client.email} {client.phone && `• ${client.phone}`}
              {client.city && ` • ${client.city}`}
            </div>
          </div>
          <span 
            className="status-badge"
            style={{
              background: client.status === 'active' ? '#00FF94' : '#64748b',
              color: client.status === 'active' ? '#000' : '#fff'
            }}
          >
            {client.status}
          </span>
        </div>

        <div className="actions">
          {!editing && (
            <>
              <button onClick={() => setEditing(true)} className="btn btn-primary">
                ✏️ Edit
              </button>
              <Link href={`/quote-maker?client=${client.id}`} className="btn btn-secondary">
                📝 Create Quote
              </Link>
              <button onClick={handleDelete} className="btn btn-danger">
                🗑️ Delete
              </button>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{marginTop: '30px'}}>
          <div className="stat-card">
            <div className="stat-label">Lifetime Value</div>
            <div className="stat-value">€{(client.lifetime_value || 0).toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Projects</div>
            <div className="stat-value">{projects.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Quotes</div>
            <div className="stat-value">{quotes.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Client Since</div>
            <div className="stat-value" style={{fontSize: '1.2rem'}}>
              {new Date(client.created_at).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric'
              })}
            </div>
          </div>
        </div>

        {editing ? (
          <form onSubmit={handleUpdate}>
            <div className="card">
              <h3 className="card-title">Edit Client</h3>
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
                  <label>Website</label>
                  <input
                    type="url"
                    value={formData.website || ''}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Industry</label>
                  <input
                    type="text"
                    value={formData.industry || ''}
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={formData.city || ''}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status || 'active'}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              <div className="form-group" style={{marginTop: '20px'}}>
                <label>Notes</label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
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
                    setFormData(client);
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
            {/* Client Info */}
            <div className="card">
              <h3 className="card-title">Client Information</h3>
              <div className="info-grid">
                {client.website && (
                  <div className="info-item">
                    <div className="info-label">Website</div>
                    <div className="info-value">
                      <a href={client.website} target="_blank" style={{color: '#00FF94'}}>
                        {client.website}
                      </a>
                    </div>
                  </div>
                )}
                {client.industry && (
                  <div className="info-item">
                    <div className="info-label">Industry</div>
                    <div className="info-value">{client.industry}</div>
                  </div>
                )}
                {client.company_size && (
                  <div className="info-item">
                    <div className="info-label">Company Size</div>
                    <div className="info-value">{client.company_size}</div>
                  </div>
                )}
                {client.address && (
                  <div className="info-item">
                    <div className="info-label">Address</div>
                    <div className="info-value">{client.address}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Projects */}
            <div className="card">
              <h3 className="card-title">
                <span>Projects ({projects.length})</span>
                <Link href="/crm/projects/new" className="btn btn-primary" style={{fontSize: '0.85rem', padding: '8px 16px'}}>
                  + New
                </Link>
              </h3>
              {projects.length === 0 ? (
                <div className="empty-message">No projects yet</div>
              ) : (
                projects.map(project => (
                  <Link key={project.id} href={`/crm/projects/${project.id}`} style={{textDecoration: 'none'}}>
                    <div className="list-item">
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                        <div>
                          <div style={{color: 'white', fontWeight: '600', marginBottom: '5px'}}>
                            {project.name}
                          </div>
                          <div style={{color: '#888', fontSize: '0.9rem'}}>
                            €{project.total_value.toLocaleString()} • {project.status}
                          </div>
                        </div>
                        <div style={{color: '#00FF94', fontSize: '0.85rem'}}>
                          {project.progress}%
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* Quotes */}
            <div className="card">
              <h3 className="card-title">Quotes ({quotes.length})</h3>
              {quotes.length === 0 ? (
                <div className="empty-message">No quotes yet</div>
              ) : (
                quotes.map(quote => (
                  <Link key={quote.id} href={`/ponuda/${quote.id}`} target="_blank" style={{textDecoration: 'none'}}>
                    <div className="list-item">
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                        <div>
                          <div style={{color: 'white', fontWeight: '600', marginBottom: '5px'}}>
                            Quote {quote.id}
                          </div>
                          <div style={{color: '#888', fontSize: '0.9rem'}}>
                            €{quote.pricing.total.toLocaleString()} • {quote.status}
                          </div>
                        </div>
                        <div style={{color: '#666', fontSize: '0.85rem'}}>
                          {new Date(quote.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* Notes */}
            {client.notes && (
              <div className="card">
                <h3 className="card-title">Notes</h3>
                <p style={{color: '#aaa', lineHeight: '1.8', whiteSpace: 'pre-wrap'}}>
                  {client.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}