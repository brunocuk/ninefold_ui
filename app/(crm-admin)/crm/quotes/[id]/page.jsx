// app/(crm-admin)/crm/quotes/[id]/page.jsx
// Quote Detail Page - View and manage quote in CRM

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function QuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quote, setQuote] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadQuote();
  }, [params.id]);

  const loadQuote = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          clients (
            id,
            name,
            company,
            email
          )
        `)
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setQuote(data);
      setClient(data.clients);
    } catch (error) {
      console.error('Error loading quote:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ status: newStatus })
        .eq('id', params.id);

      if (error) throw error;
      
      setQuote({ ...quote, status: newStatus });
      alert('Status updated successfully!');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    } finally {
      setUpdating(false);
    }
  };

  const deleteQuote = async () => {
    if (!confirm('Are you sure you want to delete this quote? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', params.id);

      if (error) throw error;
      
      router.push('/crm/quotes');
    } catch (error) {
      console.error('Error deleting quote:', error);
      alert('Error deleting quote');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      draft: { bg: '#666', text: 'Draft' },
      sent: { bg: '#3b82f6', text: 'Sent' },
      viewed: { bg: '#8b5cf6', text: 'Viewed' },
      accepted: { bg: '#00FF94', text: 'Accepted' },
      rejected: { bg: '#ef4444', text: 'Rejected' }
    };

    const style = styles[status] || styles.draft;

    return (
      <span style={{
        background: style.bg,
        color: status === 'accepted' ? '#000' : '#fff',
        padding: '8px 16px',
        borderRadius: '12px',
        fontSize: '0.9rem',
        fontWeight: '700'
      }}>
        {style.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={{textAlign: 'center', padding: '100px 0'}}>
        <div style={{fontSize: '1.5rem', color: '#00FF94'}}>Loading quote...</div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div style={{textAlign: 'center', padding: '100px 0'}}>
        <h2 style={{color: 'white'}}>Quote not found</h2>
        <Link href="/crm/quotes" style={{color: '#00FF94'}}>← Back to Quotes</Link>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .quote-detail {
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
          font-size: 2rem;
          font-weight: 900;
          color: white;
          margin-bottom: 10px;
        }

        .quote-reference {
          font-size: 1rem;
          color: #666;
          font-family: 'Courier New', monospace;
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

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin: 30px 0;
        }

        .stat-card {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 20px;
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
        }

        .info-item {
          background: #0a0a0a;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 15px;
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
          color: white;
        }

        .scope-section {
          margin-bottom: 20px;
        }

        .scope-title {
          font-weight: 600;
          color: #00FF94;
          margin-bottom: 10px;
        }

        .scope-items {
          list-style: none;
          padding-left: 0;
        }

        .scope-items li {
          padding: 8px 0;
          color: #aaa;
          border-bottom: 1px solid #222;
        }

        .status-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 20px;
        }

        .status-btn {
          padding: 8px 16px;
          border: 2px solid #333;
          background: #1a1a1a;
          color: #888;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .status-btn:hover {
          border-color: #00FF94;
          color: #00FF94;
        }

        .status-btn.active {
          background: #00FF94;
          color: #000;
          border-color: #00FF94;
        }
      `}</style>

      <div className="quote-detail">
        <div className="breadcrumb">
          <Link href="/crm/quotes">← Back to Quotes</Link>
        </div>

        <div className="header">
          <div>
            <h1>Quote for {quote.client_name}</h1>
            <div className="quote-reference">#{quote.quote_number || quote.reference}</div>
            {client && (
              <Link 
                href={`/crm/clients/${client.id}`}
                style={{color: '#00FF94', fontSize: '0.95rem', marginTop: '10px', display: 'inline-block'}}
              >
                🏢 View Client Profile →
              </Link>
            )}
          </div>
          {getStatusBadge(quote.status)}
        </div>

        <div className="actions">
          <a 
            href={`/quote/${quote.id}`} 
            target="_blank"
            className="btn btn-primary"
          >
            👁️ View Client Preview
          </a>
          <button onClick={deleteQuote} className="btn btn-danger">
            🗑️ Delete Quote
          </button>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Value</div>
            <div className="stat-value">€{quote.pricing.total.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Views</div>
            <div className="stat-value">{quote.view_count || 0}</div>
          </div>
          {quote.last_viewed_at && (
            <div className="stat-card">
              <div className="stat-label">Last Viewed</div>
              <div className="stat-value" style={{fontSize: '1.2rem'}}>
                {new Date(quote.last_viewed_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>
          )}
          <div className="stat-card">
            <div className="stat-label">Created</div>
            <div className="stat-value" style={{fontSize: '1.2rem'}}>
              {new Date(quote.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          </div>
        </div>

        <div className="content-grid">
          {/* Status Management */}
          <div className="card">
            <h3 className="card-title">Change Status</h3>
            <div className="status-actions">
              <button
                className={`status-btn ${quote.status === 'draft' ? 'active' : ''}`}
                onClick={() => updateStatus('draft')}
                disabled={updating}
              >
                📝 Draft
              </button>
              <button
                className={`status-btn ${quote.status === 'sent' ? 'active' : ''}`}
                onClick={() => updateStatus('sent')}
                disabled={updating}
              >
                📤 Sent
              </button>
              <button
                className={`status-btn ${quote.status === 'viewed' ? 'active' : ''}`}
                onClick={() => updateStatus('viewed')}
                disabled={updating}
              >
                👀 Viewed
              </button>
              <button
                className={`status-btn ${quote.status === 'accepted' ? 'active' : ''}`}
                onClick={() => updateStatus('accepted')}
                disabled={updating}
              >
                ✅ Accepted
              </button>
              <button
                className={`status-btn ${quote.status === 'rejected' ? 'active' : ''}`}
                onClick={() => updateStatus('rejected')}
                disabled={updating}
              >
                ❌ Rejected
              </button>
            </div>
          </div>

          {/* Project Overview */}
          <div className="card">
            <h3 className="card-title">Project Overview</h3>
            <p style={{color: '#aaa', lineHeight: '1.8'}}>
              {quote.project_overview}
            </p>
          </div>

          {/* Scope */}
          <div className="card">
            <h3 className="card-title">Scope of Work</h3>
            {quote.scope.map((section, index) => (
              <div key={index} className="scope-section">
                <div className="scope-title">
                  {section.number}. {section.title}
                </div>
                <ul className="scope-items">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="card">
            <h3 className="card-title">Timeline</h3>
            {quote.timeline.map((phase, index) => (
              <div key={index} className="info-item">
                <div className="info-label">{phase.week}</div>
                <div className="info-value">{phase.phase}</div>
                <div style={{color: '#666', fontSize: '0.9rem', marginTop: '5px'}}>
                  {phase.duration}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div className="card">
            <h3 className="card-title">Pricing</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span style={{color: '#888'}}>Subtotal</span>
                <span style={{color: 'white', fontWeight: '600'}}>
                  €{quote.pricing.subtotal.toLocaleString()}
                </span>
              </div>
              {quote.pricing.discountRate > 0 && (
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{color: '#00FF94'}}>
                    Discount ({(quote.pricing.discountRate * 100).toFixed(0)}%)
                  </span>
                  <span style={{color: '#00FF94', fontWeight: '600'}}>
                    -€{quote.pricing.discountAmount.toLocaleString()}
                  </span>
                </div>
              )}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '15px',
                borderTop: '2px solid #333',
                fontSize: '1.5rem'
              }}>
                <span style={{color: 'white', fontWeight: '700'}}>Total</span>
                <span style={{color: '#00FF94', fontWeight: '900'}}>
                  €{quote.pricing.total.toLocaleString()}
                </span>
              </div>
              <div style={{
                marginTop: '15px',
                padding: '15px',
                background: '#0a0a0a',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#666'
              }}>
                <div>50% Deposit: €{(quote.pricing.total * 0.5).toLocaleString()}</div>
                <div>50% Final: €{(quote.pricing.total * 0.5).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}