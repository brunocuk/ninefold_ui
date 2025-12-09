// app/crm/clients/page.jsx
// Clients List - View all clients

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadClients();
  }, [filter]);

  const loadClients = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: { bg: '#00FF94', color: '#000', text: 'Active' },
      inactive: { bg: '#64748b', color: '#fff', text: 'Inactive' },
      archived: { bg: '#1a1a1a', color: '#666', text: 'Archived' }
    };

    const style = styles[status] || styles.active;

    return (
      <span style={{
        background: style.bg,
        color: style.color,
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '0.8rem',
        fontWeight: '700'
      }}>
        {style.text}
      </span>
    );
  };

  return (
    <>
      <style jsx>{`
        .clients-page {
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

        .clients-grid {
          display: grid;
          gap: 20px;
        }

        .client-card {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 25px;
          transition: all 0.3s;
          cursor: pointer;
        }

        .client-card:hover {
          border-color: #00FF94;
          box-shadow: 0 0 20px rgba(0, 255, 148, 0.1);
          transform: translateX(5px);
        }

        .client-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 15px;
        }

        .client-info h3 {
          font-size: 1.3rem;
          margin-bottom: 5px;
          color: white;
        }

        .client-company {
          font-size: 1rem;
          color: #00FF94;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .client-meta {
          font-size: 0.9rem;
          color: #888;
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .client-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin: 20px 0;
        }

        .stat-item {
          background: #0a0a0a;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #666;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 900;
          color: #00FF94;
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
        }
      `}</style>

      <div className="clients-page">
        <div className="header">
          <div>
            <h1>Clients</h1>
            <p style={{color: '#888', marginTop: '5px'}}>
              Manage your customer relationships
            </p>
          </div>
          <Link href="/crm/clients/new" className="btn-primary">
            + Add Client
          </Link>
        </div>

        <div className="filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({clients.length})
          </button>
          <button
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            ✅ Active
          </button>
          <button
            className={`filter-btn ${filter === 'inactive' ? 'active' : ''}`}
            onClick={() => setFilter('inactive')}
          >
            ⏸️ Inactive
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading clients...</div>
        ) : clients.length === 0 ? (
          <div className="empty-state">
            <div style={{fontSize: '4rem', marginBottom: '20px'}}>🏢</div>
            <h2>No clients yet</h2>
            <p>
              {filter === 'all'
                ? "Add your first client or convert a lead to get started."
                : `No ${filter} clients.`
              }
            </p>
            {filter === 'all' && (
              <div style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
                <Link href="/crm/clients/new" className="btn-primary">
                  Add Client
                </Link>
                <Link 
                  href="/crm/leads" 
                  className="btn-primary"
                  style={{background: '#333', color: 'white'}}
                >
                  View Leads
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="clients-grid">
            {clients.map((client) => (
              <Link
                key={client.id}
                href={`/crm/clients/${client.id}`}
                style={{textDecoration: 'none'}}
              >
                <div className="client-card">
                  <div className="client-header">
                    <div className="client-info">
                      <h3>{client.name}</h3>
                      {client.company && (
                        <div className="client-company">🏢 {client.company}</div>
                      )}
                      <div className="client-meta">
                        {client.email && <span>📧 {client.email}</span>}
                        {client.phone && <span>📱 {client.phone}</span>}
                        {client.city && <span>📍 {client.city}</span>}
                      </div>
                    </div>
                    {getStatusBadge(client.status)}
                  </div>

                  <div className="client-stats">
                    <div className="stat-item">
                      <div className="stat-label">Lifetime Value</div>
                      <div className="stat-value">
                        €{(client.lifetime_value || 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-label">Projects</div>
                      <div className="stat-value">{client.total_projects || 0}</div>
                    </div>
                    {client.industry && (
                      <div className="stat-item">
                        <div className="stat-label">Industry</div>
                        <div className="stat-value" style={{fontSize: '1rem'}}>
                          {client.industry}
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{
                    marginTop: '15px',
                    fontSize: '0.85rem',
                    color: '#666'
                  }}>
                    Client since {new Date(client.created_at).toLocaleDateString('en-US', {
                      month: 'short',
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