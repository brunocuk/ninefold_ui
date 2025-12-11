// app/(crm-admin)/crm/quotes/[id]/page.jsx
// Quote Detail Page - View and manage quote in CRM (with email integration)

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
  
  // Email modal state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({
    email: '',
    name: '',
  });
  const [sending, setSending] = useState(false);

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
      
      // Pre-fill email form if client exists
      if (data.clients) {
        setEmailForm({
          email: data.clients.email || '',
          name: data.clients.company || data.clients.name || '',
        });
      }
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

  const sendQuoteEmail = async () => {
    if (!emailForm.email || !emailForm.name) {
      alert('Please enter both email and name');
      return;
    }

    setSending(true);
    try {
      const response = await fetch(`/api/quotes/${params.id}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientEmail: emailForm.email,
          recipientName: emailForm.name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      alert('Quote sent successfully! ✅');
      setShowEmailModal(false);
      
      // Reload quote to get updated status
      await loadQuote();
    } catch (error) {
      console.error('Error sending email:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setSending(false);
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
        color: 'white',
        padding: '6px 16px',
        borderRadius: '20px',
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
          margin-bottom: 40px;
        }

        .header-info h1 {
          font-size: 2rem;
          font-weight: 900;
          color: white;
          margin-bottom: 10px;
        }

        .client-link {
          color: #00FF94;
          text-decoration: none;
          font-size: 1rem;
          display: inline-block;
          margin-top: 8px;
        }

        .client-link:hover {
          text-decoration: underline;
        }

        .actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 12px 20px;
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

        .btn-primary:hover {
          background: #00DD7F;
          transform: translateY(-2px);
        }

        .btn-secondary {
          background: #3b82f6;
          color: white;
        }

        .btn-secondary:hover {
          background: #2563eb;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn-danger:hover {
          background: #dc2626;
        }

        /* Email Status */
        .email-status {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 30px;
        }

        .email-status-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: white;
          margin-bottom: 12px;
        }

        .email-status-text {
          color: #888;
          font-size: 0.95rem;
        }

        .email-status-sent {
          color: #00FF94;
          font-weight: 600;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s;
        }

        .modal {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 32px;
          max-width: 500px;
          width: 90%;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          color: #C4C4C4;
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          background: #0F0F0F;
          border: 1px solid #2A2A2A;
          border-radius: 8px;
          color: white;
          font-size: 1rem;
        }

        .form-input:focus {
          outline: none;
          border-color: #00FF94;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .btn-full {
          flex: 1;
        }

        /* Stats */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 25px;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 900;
          color: #00FF94;
          line-height: 1;
        }

        @media (max-width: 768px) {
          .header {
            flex-direction: column;
            gap: 20px;
          }

          .actions {
            width: 100%;
          }

          .btn {
            flex: 1;
          }
        }
      `}</style>

      <div className="quote-detail">
        <div className="breadcrumb">
          <Link href="/crm/quotes">← Back to Quotes</Link>
        </div>

        <div className="header">
          <div className="header-info">
            <h1>{quote.client_name}</h1>
            {client && (
              <Link href={`/crm/clients/${client.id}`} className="client-link">
                View Client Profile →
              </Link>
            )}
          </div>
          <div className="actions">
            {getStatusBadge(quote.status)}
            <button 
              onClick={() => setShowEmailModal(true)} 
              className="btn btn-primary"
              disabled={sending}
            >
              📧 Send Email
            </button>
            <a 
              href={`/quote/${params.id}`} 
              target="_blank" 
              className="btn btn-secondary"
            >
              👁️ Preview
            </a>
            <button onClick={deleteQuote} className="btn btn-danger">
              🗑️ Delete
            </button>
          </div>
        </div>

        {/* Email Status */}
        {quote.last_sent_at && (
          <div className="email-status">
            <div className="email-status-title">📬 Email Status</div>
            <div className="email-status-text">
              Last sent: <span className="email-status-sent">
                {new Date(quote.last_sent_at).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Value</div>
            <div className="stat-value">
              €{quote.pricing?.total?.toLocaleString() || 0}
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-label">Views</div>
            <div className="stat-value">{quote.view_count || 0}</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-label">Created</div>
            <div className="stat-value" style={{fontSize: '1.2rem'}}>
              {new Date(quote.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>

        {/* Rest of your existing quote details... */}
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="modal-overlay" onClick={() => setShowEmailModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Send Quote via Email</div>
            
            <div className="form-group">
              <label className="form-label">Recipient Email *</label>
              <input
                type="email"
                className="form-input"
                value={emailForm.email}
                onChange={(e) => setEmailForm({...emailForm, email: e.target.value})}
                placeholder="client@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Recipient Name *</label>
              <input
                type="text"
                className="form-input"
                value={emailForm.name}
                onChange={(e) => setEmailForm({...emailForm, name: e.target.value})}
                placeholder="Client Name"
                required
              />
            </div>

            <div className="modal-actions">
              <button 
                className="btn btn-secondary btn-full"
                onClick={() => setShowEmailModal(false)}
                disabled={sending}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary btn-full"
                onClick={sendQuoteEmail}
                disabled={sending}
              >
                {sending ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}