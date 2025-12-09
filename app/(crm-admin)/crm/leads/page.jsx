// app/crm/leads/page.jsx
// Leads List - View all leads

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadLeads();
  }, [filter]);

  const loadLeads = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      new: { bg: '#3b82f6', text: 'New' },
      contacted: { bg: '#8b5cf6', text: 'Contacted' },
      qualified: { bg: '#00FF94', text: 'Qualified' },
      'proposal-sent': { bg: '#f59e0b', text: 'Proposal Sent' },
      won: { bg: '#10b981', text: 'Won' },
      lost: { bg: '#ef4444', text: 'Lost' }
    };

    const style = styles[status] || styles.new;

    return (
      <span style={{
        background: style.bg,
        color: status === 'qualified' ? '#000' : '#fff',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '0.8rem',
        fontWeight: '700'
      }}>
        {style.text}
      </span>
    );
  };

  const getSourceIcon = (source) => {
    const icons = {
      website: '🌐',
      referral: '👥',
      linkedin: '💼',
      'cold-outreach': '📧'
    };
    return icons[source] || '📌';
  };

  return (
    <>
      <style jsx>{`
        .leads-page {
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
        }

        h1 {
          font-size: 2.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #00FF94 0%, #00CC76 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .btn-primary {
          background: #00FF94;
          color: #000;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 700;
          transition: all 0.3s;
          display: inline-block;
        }

        .btn-primary:hover {
          box-shadow: 0 0 20px rgba(0, 255, 148, 0.4);
          transform: translateY(-2px);
        }

        .filters {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 10px 20px;
          border: 2px solid #333;
          background: #1a1a1a;
          color: #888;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .filter-btn:hover {
          border-color: #00FF94;
          color: #00FF94;
        }

        .filter-btn.active {
          background: #00FF94;
          color: #000;
          border-color: #00FF94;
        }

        .leads-grid {
          display: grid;
          gap: 20px;
        }

        .lead-card {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 25px;
          transition: all 0.3s;
          cursor: pointer;
        }

        .lead-card:hover {
          border-color: #00FF94;
          box-shadow: 0 0 20px rgba(0, 255, 148, 0.1);
          transform: translateX(5px);
        }

        .lead-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 15px;
        }

        .lead-info h3 {
          font-size: 1.3rem;
          margin-bottom: 5px;
          color: white;
        }

        .lead-meta {
          font-size: 0.9rem;
          color: #888;
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .lead-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin: 20px 0;
        }

        .detail-item {
          background: #0a0a0a;
          padding: 12px;
          border-radius: 8px;
        }

        .detail-label {
          font-size: 0.8rem;
          color: #666;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-value {
          font-size: 1rem;
          font-weight: 600;
          color: #00FF94;
        }

        .lead-description {
          color: #aaa;
          line-height: 1.6;
          margin-top: 15px;
          font-size: 0.95rem;
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: #1a1a1a;
          border: 2px dashed #333;
          border-radius: 12px;
        }

        .empty-state h2 {
          font-size: 1.8rem;
          margin-bottom: 15px;
          color: white;
        }

        .empty-state p {
          color: #888;
          margin-bottom: 25px;
          font-size: 1.1rem;
        }

        .loading {
          text-align: center;
          padding: 60px;
          font-size: 1.2rem;
          color: #00FF94;
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 2rem;
          }

          .header {
            flex-direction: column;
            gap: 20px;
            align-items: flex-start;
          }

          .lead-details {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="leads-page">
        <div className="header">
          <div>
            <h1>Leads</h1>
            <p style={{color: '#888', marginTop: '5px'}}>
              Track and manage your sales pipeline
            </p>
          </div>
          <Link href="/crm/leads/new" className="btn-primary">
            + Add Lead
          </Link>
        </div>

        <div className="filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({leads.length})
          </button>
          <button
            className={`filter-btn ${filter === 'new' ? 'active' : ''}`}
            onClick={() => setFilter('new')}
          >
            🆕 New
          </button>
          <button
            className={`filter-btn ${filter === 'contacted' ? 'active' : ''}`}
            onClick={() => setFilter('contacted')}
          >
            📞 Contacted
          </button>
          <button
            className={`filter-btn ${filter === 'qualified' ? 'active' : ''}`}
            onClick={() => setFilter('qualified')}
          >
            ✓ Qualified
          </button>
          <button
            className={`filter-btn ${filter === 'proposal-sent' ? 'active' : ''}`}
            onClick={() => setFilter('proposal-sent')}
          >
            📄 Proposal Sent
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="empty-state">
            <div style={{fontSize: '4rem', marginBottom: '20px'}}>👥</div>
            <h2>No leads yet</h2>
            <p>
              {filter === 'all' 
                ? "Add your first lead to start tracking your sales pipeline."
                : `No leads with status "${filter}".`
              }
            </p>
            {filter === 'all' && (
              <Link href="/crm/leads/new" className="btn-primary">
                Add First Lead
              </Link>
            )}
          </div>
        ) : (
          <div className="leads-grid">
            {leads.map((lead) => (
              <Link
                key={lead.id}
                href={`/crm/leads/${lead.id}`}
                style={{textDecoration: 'none'}}
              >
                <div className="lead-card">
                  <div className="lead-header">
                    <div className="lead-info">
                      <h3>{lead.name}</h3>
                      <div className="lead-meta">
                        {lead.email && <span>📧 {lead.email}</span>}
                        {lead.phone && <span>📱 {lead.phone}</span>}
                        {lead.company && <span>🏢 {lead.company}</span>}
                      </div>
                    </div>
                    {getStatusBadge(lead.status)}
                  </div>

                  <div className="lead-details">
                    {lead.source && (
                      <div className="detail-item">
                        <div className="detail-label">Source</div>
                        <div className="detail-value">
                          {getSourceIcon(lead.source)} {lead.source}
                        </div>
                      </div>
                    )}
                    {lead.budget_range && (
                      <div className="detail-item">
                        <div className="detail-label">Budget</div>
                        <div className="detail-value">{lead.budget_range}</div>
                      </div>
                    )}
                    {lead.project_type && (
                      <div className="detail-item">
                        <div className="detail-label">Project Type</div>
                        <div className="detail-value">{lead.project_type}</div>
                      </div>
                    )}
                    {lead.timeline && (
                      <div className="detail-item">
                        <div className="detail-label">Timeline</div>
                        <div className="detail-value">{lead.timeline}</div>
                      </div>
                    )}
                  </div>

                  {lead.description && (
                    <div className="lead-description">
                      {lead.description.length > 150
                        ? lead.description.substring(0, 150) + '...'
                        : lead.description
                      }
                    </div>
                  )}

                  <div style={{
                    marginTop: '15px',
                    fontSize: '0.85rem',
                    color: '#666'
                  }}>
                    Added {new Date(lead.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}