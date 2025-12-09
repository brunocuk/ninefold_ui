// app/(crm-admin)/crm/quotes/page.jsx
// Quotes List - View all quotes (UPDATED LINKS)

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function QuotesPage() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadQuotes();
  }, [filter]);

  const loadQuotes = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('quotes')
        .select(`
          *,
          clients (
            name,
            company
          ),
          leads (
            name,
            company
          )
        `)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error('Error loading quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      draft: { bg: '#666', color: '#fff', text: 'Draft' },
      sent: { bg: '#3b82f6', color: '#fff', text: 'Sent' },
      viewed: { bg: '#8b5cf6', color: '#fff', text: 'Viewed' },
      accepted: { bg: '#00FF94', color: '#000', text: 'Accepted' },
      rejected: { bg: '#ef4444', color: '#fff', text: 'Rejected' }
    };

    const style = styles[status] || styles.draft;

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('hr-HR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <>
      <style jsx>{`
        .quotes-page {
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

        .quotes-grid {
          display: grid;
          gap: 20px;
        }

        .quote-card {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 25px;
          transition: all 0.3s;
          cursor: pointer;
        }

        .quote-card:hover {
          border-color: #00FF94;
          box-shadow: 0 0 20px rgba(0, 255, 148, 0.1);
          transform: translateX(5px);
        }

        .quote-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 15px;
        }

        .quote-info h3 {
          font-size: 1.3rem;
          margin-bottom: 5px;
          color: white;
        }

        .client-name {
          font-size: 1rem;
          color: #00FF94;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .quote-reference {
          font-size: 0.85rem;
          color: #666;
          font-family: 'Courier New', monospace;
        }

        .quote-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin: 20px 0;
        }

        .detail-item {
          background: #0a0a0a;
          padding: 12px;
          border-radius: 8px;
        }

        .detail-label {
          font-size: 0.75rem;
          color: #666;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-value {
          font-size: 1.1rem;
          font-weight: 700;
          color: #00FF94;
        }

        .quote-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #333;
          font-size: 0.85rem;
          color: #888;
        }

        .view-count {
          display: flex;
          align-items: center;
          gap: 5px;
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

      <div className="quotes-page">
        <div className="header">
          <div>
            <h1>Quotes</h1>
            <p style={{color: '#888', marginTop: '5px'}}>
              Manage proposals and track conversions
            </p>
          </div>
          <Link href="/crm/quotes/new" className="btn-primary">
            + Create Quote
          </Link>
        </div>

        <div className="filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({quotes.length})
          </button>
          <button
            className={`filter-btn ${filter === 'draft' ? 'active' : ''}`}
            onClick={() => setFilter('draft')}
          >
            📝 Draft
          </button>
          <button
            className={`filter-btn ${filter === 'sent' ? 'active' : ''}`}
            onClick={() => setFilter('sent')}
          >
            📤 Sent
          </button>
          <button
            className={`filter-btn ${filter === 'viewed' ? 'active' : ''}`}
            onClick={() => setFilter('viewed')}
          >
            👀 Viewed
          </button>
          <button
            className={`filter-btn ${filter === 'accepted' ? 'active' : ''}`}
            onClick={() => setFilter('accepted')}
          >
            ✅ Accepted
          </button>
          <button
            className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
            onClick={() => setFilter('rejected')}
          >
            ❌ Rejected
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading quotes...</div>
        ) : quotes.length === 0 ? (
          <div className="empty-state">
            <div style={{fontSize: '4rem', marginBottom: '20px'}}>📄</div>
            <h2>No quotes yet</h2>
            <p>
              {filter === 'all'
                ? "Create your first quote to get started."
                : `No quotes with status "${filter}".`
              }
            </p>
            {filter === 'all' && (
              <Link href="/crm/quotes/new" className="btn-primary">
                Create First Quote
              </Link>
            )}
          </div>
        ) : (
          <div className="quotes-grid">
            {quotes.map((quote) => {
              // Get client or lead name
              const clientName = quote.client_name || 
                                quote.clients?.company || 
                                quote.clients?.name || 
                                quote.leads?.company || 
                                quote.leads?.name || 
                                'Unknown Client';

              return (
                <Link
                  key={quote.id}
                  href={`/crm/quotes/${quote.id}`}
                  style={{textDecoration: 'none'}}
                >
                  <div className="quote-card">
                    <div className="quote-header">
                      <div className="quote-info">
                        <h3>Quote for {clientName}</h3>
                        <div className="client-name">
                          🏢 {clientName}
                        </div>
                        {(quote.quote_number || quote.reference) && (
                          <div className="quote-reference">
                            #{quote.quote_number || quote.reference}
                          </div>
                        )}
                      </div>
                      {getStatusBadge(quote.status)}
                    </div>

                    <div className="quote-details">
                      <div className="detail-item">
                        <div className="detail-label">Total Value</div>
                        <div className="detail-value">
                          {formatCurrency(quote.pricing?.total || 0)}
                        </div>
                      </div>
                      {quote.pricing?.discountRate > 0 && (
                        <div className="detail-item">
                          <div className="detail-label">Discount</div>
                          <div className="detail-value">
                            {(quote.pricing.discountRate * 100).toFixed(0)}%
                          </div>
                        </div>
                      )}
                      <div className="detail-item">
                        <div className="detail-label">Views</div>
                        <div className="detail-value">{quote.view_count || 0}</div>
                      </div>
                    </div>

                    <div className="quote-meta">
                      <div>
                        Created {new Date(quote.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      {quote.last_viewed_at && (
                        <div className="view-count">
                          👁️ Last viewed {new Date(quote.last_viewed_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}