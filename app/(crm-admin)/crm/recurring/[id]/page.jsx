// app/(crm-admin)/crm/recurring/[id]/page.jsx
// Contract Detail Page

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ContractDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [contract, setContract] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadContract();
  }, [params.id]);

  const loadContract = async () => {
    try {
      const { data, error } = await supabase
        .from('recurring_contracts')
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
      setContract(data);
      setClient(data.clients);
    } catch (error) {
      console.error('Error loading contract:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('recurring_contracts')
        .update({ status: newStatus })
        .eq('id', params.id);

      if (error) throw error;
      
      setContract({ ...contract, status: newStatus });
      alert('Status updated successfully!');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    } finally {
      setUpdating(false);
    }
  };

  const deleteContract = async () => {
    if (!confirm('Are you sure you want to delete this contract? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('recurring_contracts')
        .delete()
        .eq('id', params.id);

      if (error) throw error;
      
      router.push('/crm/recurring');
    } catch (error) {
      console.error('Error deleting contract:', error);
      alert('Error deleting contract');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: { bg: '#00FF94', color: '#000', text: 'Active' },
      paused: { bg: '#f59e0b', color: '#000', text: 'Paused' },
      cancelled: { bg: '#ef4444', color: '#fff', text: 'Cancelled' }
    };

    const style = styles[status] || styles.active;

    return (
      <span style={{
        background: style.bg,
        color: style.color,
        padding: '8px 16px',
        borderRadius: '12px',
        fontSize: '0.9rem',
        fontWeight: '700'
      }}>
        {style.text}
      </span>
    );
  };

  const getTypeIcon = (type) => {
    const icons = {
      maintenance: '🔧',
      hosting: '☁️',
      social_media: '📱'
    };
    return icons[type] || '📦';
  };

  const getTypeName = (type) => {
    const names = {
      maintenance: 'Website Maintenance',
      hosting: 'Hosting',
      social_media: 'Social Media'
    };
    return names[type] || type;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('hr-HR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getMRR = () => {
    if (contract.billing_cycle === 'yearly') {
      return contract.monthly_amount / 12;
    }
    return contract.monthly_amount;
  };

  const getARR = () => {
    return getMRR() * 12;
  };

  if (loading) {
    return (
      <div style={{textAlign: 'center', padding: '100px 0'}}>
        <div style={{fontSize: '1.5rem', color: '#00FF94'}}>Loading contract...</div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div style={{textAlign: 'center', padding: '100px 0'}}>
        <h2 style={{color: 'white'}}>Contract not found</h2>
        <Link href="/crm/recurring" style={{color: '#00FF94'}}>← Back to Recurring Revenue</Link>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .contract-detail {
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
          margin-bottom: 40px;
        }

        .header-info h1 {
          font-size: 2rem;
          font-weight: 900;
          color: white;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .type-badge {
          font-size: 2rem;
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

        .btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn-danger:hover {
          background: #dc2626;
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

        .stat-sub {
          font-size: 0.9rem;
          color: #888;
          margin-top: 8px;
        }

        /* Content Grid */
        .content-grid {
          display: grid;
          gap: 30px;
        }

        .card {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 30px;
        }

        .card-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: white;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 2px solid #333;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .info-label {
          font-size: 0.85rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-value {
          font-size: 1.1rem;
          font-weight: 600;
          color: white;
        }

        .info-value.highlight {
          color: #00FF94;
          font-size: 1.3rem;
          font-weight: 700;
        }

        .notes-box {
          background: #0a0a0a;
          border: 1px solid #2A2A2A;
          border-radius: 8px;
          padding: 20px;
          color: #C4C4C4;
          line-height: 1.6;
          white-space: pre-wrap;
        }

        .notes-box:empty::before {
          content: 'No notes added';
          color: #666;
          font-style: italic;
        }

        /* Status Actions */
        .status-section {
          background: rgba(0, 255, 148, 0.05);
          border: 1px solid rgba(0, 255, 148, 0.2);
          border-radius: 12px;
          padding: 25px;
        }

        .status-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
          flex-wrap: wrap;
        }

        .status-btn {
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

        .status-btn:hover:not(.active) {
          border-color: #00FF94;
          color: #00FF94;
        }

        .status-btn.active {
          background: #00FF94;
          color: #000;
          border-color: #00FF94;
        }

        .status-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
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

      <div className="contract-detail">
        <div className="breadcrumb">
          <Link href="/crm/recurring">← Back to Recurring Revenue</Link>
        </div>

        <div className="header">
          <div className="header-info">
            <h1>
              <span className="type-badge">{getTypeIcon(contract.contract_type)}</span>
              {contract.name}
            </h1>
            {client && (
              <Link href={`/crm/clients/${client.id}`} className="client-link">
                🏢 {client.company || client.name} →
              </Link>
            )}
          </div>
          <div className="actions">
            {getStatusBadge(contract.status)}
            <button onClick={deleteContract} className="btn btn-danger">
              🗑️ Delete
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Monthly Revenue</div>
            <div className="stat-value">{formatCurrency(getMRR())}</div>
            <div className="stat-sub">MRR</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-label">Annual Revenue</div>
            <div className="stat-value">{formatCurrency(getARR())}</div>
            <div className="stat-sub">ARR</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-label">Next Billing</div>
            <div className="stat-value" style={{fontSize: '1.5rem'}}>
              {new Date(contract.next_billing_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </div>
            <div className="stat-sub">
              {new Date(contract.next_billing_date).toLocaleDateString('en-US', {
                year: 'numeric'
              })}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Contract Age</div>
            <div className="stat-value" style={{fontSize: '1.5rem'}}>
              {Math.floor((new Date() - new Date(contract.start_date)) / (1000 * 60 * 60 * 24 * 30))}
            </div>
            <div className="stat-sub">months</div>
          </div>
        </div>

        {/* Content */}
        <div className="content-grid">
          {/* Status Management */}
          <div className="card">
            <div className="status-section">
              <h3 className="card-title" style={{borderBottom: 'none', marginBottom: '15px'}}>
                Change Status
              </h3>
              <p style={{color: '#888', fontSize: '0.95rem', marginBottom: '15px'}}>
                Current status: <strong style={{color: '#00FF94'}}>{contract.status}</strong>
              </p>
              <div className="status-actions">
                <button
                  className={`status-btn ${contract.status === 'active' ? 'active' : ''}`}
                  onClick={() => updateStatus('active')}
                  disabled={updating || contract.status === 'active'}
                >
                  ✓ Active
                </button>
                <button
                  className={`status-btn ${contract.status === 'paused' ? 'active' : ''}`}
                  onClick={() => updateStatus('paused')}
                  disabled={updating || contract.status === 'paused'}
                >
                  ⏸ Paused
                </button>
                <button
                  className={`status-btn ${contract.status === 'cancelled' ? 'active' : ''}`}
                  onClick={() => updateStatus('cancelled')}
                  disabled={updating || contract.status === 'cancelled'}
                >
                  ✕ Cancelled
                </button>
              </div>
            </div>
          </div>

          {/* Contract Details */}
          <div className="card">
            <h3 className="card-title">Contract Details</h3>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">Service Type</div>
                <div className="info-value">{getTypeName(contract.contract_type)}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Amount</div>
                <div className="info-value highlight">
                  {formatCurrency(contract.monthly_amount)}
                  {contract.billing_cycle === 'yearly' ? '/year' : '/month'}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">Billing Cycle</div>
                <div className="info-value">
                  {contract.billing_cycle === 'monthly' ? 'Monthly' : 'Yearly'}
                </div>
              </div>
              {contract.billing_cycle === 'monthly' && (
                <div className="info-item">
                  <div className="info-label">Billing Day</div>
                  <div className="info-value">
                    {contract.billing_day}
                    {contract.billing_day === 1 ? 'st' : 
                     contract.billing_day === 2 ? 'nd' : 
                     contract.billing_day === 3 ? 'rd' : 'th'} of month
                  </div>
                </div>
              )}
              {contract.payment_method && (
                <div className="info-item">
                  <div className="info-label">Payment Method</div>
                  <div className="info-value">
                    {contract.payment_method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="card">
            <h3 className="card-title">Timeline</h3>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">Start Date</div>
                <div className="info-value">
                  {new Date(contract.start_date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">Next Billing Date</div>
                <div className="info-value highlight">
                  {new Date(contract.next_billing_date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
              {contract.last_billed_date && (
                <div className="info-item">
                  <div className="info-label">Last Billed</div>
                  <div className="info-value">
                    {new Date(contract.last_billed_date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              )}
              {contract.end_date && (
                <div className="info-item">
                  <div className="info-label">End Date</div>
                  <div className="info-value">
                    {new Date(contract.end_date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {contract.description && (
            <div className="card">
              <h3 className="card-title">Description</h3>
              <div className="notes-box">{contract.description}</div>
            </div>
          )}

          {/* Notes */}
          <div className="card">
            <h3 className="card-title">Notes</h3>
            <div className="notes-box">{contract.notes}</div>
          </div>

          {/* Financial Tracking */}
          <div className="card">
            <h3 className="card-title">Financial Summary</h3>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">Total Billed</div>
                <div className="info-value">{formatCurrency(contract.total_billed)}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Total Paid</div>
                <div className="info-value highlight">{formatCurrency(contract.total_paid)}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Outstanding</div>
                <div className="info-value">
                  {formatCurrency(contract.total_billed - contract.total_paid)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}