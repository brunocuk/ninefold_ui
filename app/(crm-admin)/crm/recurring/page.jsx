// app/(crm-admin)/crm/recurring/page.jsx
// Recurring Revenue Dashboard

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function RecurringRevenuePage() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadContracts();
  }, [filter]);

  const loadContracts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('recurring_contracts')
        .select(`
          *,
          clients (
            id,
            name,
            company
          )
        `)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        if (filter === 'type') {
          // Will be handled by buttons
        } else {
          query = query.eq('status', filter);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      setContracts(data || []);
    } catch (error) {
      console.error('Error loading contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMRR = () => {
    return contracts
      .filter(c => c.status === 'active')
      .reduce((total, contract) => {
        if (contract.billing_cycle === 'yearly') {
          return total + (contract.monthly_amount / 12);
        }
        return total + contract.monthly_amount;
      }, 0);
  };

  const calculateARR = () => {
    return calculateMRR() * 12;
  };

  const getActiveContracts = () => {
    return contracts.filter(c => c.status === 'active').length;
  };

  const getContractsByType = (type) => {
    return contracts.filter(c => c.contract_type === type && c.status === 'active');
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
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '0.8rem',
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

  const getMRRForContract = (contract) => {
    if (contract.billing_cycle === 'yearly') {
      return contract.monthly_amount / 12;
    }
    return contract.monthly_amount;
  };

  return (
    <>
      <style jsx>{`
        .recurring-page {
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .header {
          margin-bottom: 40px;
        }

        h1 {
          font-size: 2.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #00FF94 0%, #00CC76 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 10px;
        }

        .header-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
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

        /* Stats Cards */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 30px;
          transition: all 0.3s;
        }

        .stat-card:hover {
          border-color: #00FF94;
          transform: translateY(-4px);
        }

        .stat-label {
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 900;
          color: #00FF94;
          line-height: 1;
        }

        .stat-sub {
          font-size: 0.9rem;
          color: #888;
          margin-top: 8px;
        }

        /* Type Breakdown */
        .type-breakdown {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 40px;
        }

        .type-breakdown h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 20px;
        }

        .type-grid {
          display: grid;
          gap: 15px;
        }

        .type-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background: #0a0a0a;
          border-radius: 8px;
          border: 1px solid #2A2A2A;
        }

        .type-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .type-icon {
          font-size: 1.5rem;
        }

        .type-details h3 {
          font-size: 1rem;
          font-weight: 600;
          color: white;
          margin-bottom: 4px;
        }

        .type-details p {
          font-size: 0.85rem;
          color: #666;
        }

        .type-value {
          text-align: right;
        }

        .type-amount {
          font-size: 1.3rem;
          font-weight: 700;
          color: #00FF94;
        }

        .type-count {
          font-size: 0.85rem;
          color: #666;
          margin-top: 4px;
        }

        /* Filters */
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

        /* Contracts List */
        .contracts-grid {
          display: grid;
          gap: 16px;
        }

        .contract-card {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 25px;
          transition: all 0.3s;
          cursor: pointer;
          text-decoration: none;
          display: block;
        }

        .contract-card:hover {
          border-color: #00FF94;
          transform: translateX(5px);
        }

        .contract-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 15px;
        }

        .contract-info h3 {
          font-size: 1.2rem;
          color: white;
          margin-bottom: 8px;
        }

        .contract-client {
          font-size: 0.95rem;
          color: #00FF94;
          font-weight: 600;
        }

        .contract-type {
          font-size: 0.85rem;
          color: #666;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 4px;
        }

        .contract-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #333;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail-label {
          font-size: 0.75rem;
          color: #666;
          text-transform: uppercase;
        }

        .detail-value {
          font-size: 1rem;
          font-weight: 700;
          color: white;
        }

        .detail-value.amount {
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
      `}</style>

      <div className="recurring-page">
        <div className="header">
          <h1>Recurring Revenue</h1>
          <p style={{color: '#888'}}>Track monthly maintenance and subscriptions</p>
          
          <div className="header-actions">
            <div></div>
            <Link href="/crm/recurring/new" className="btn-primary">
              + Add Contract
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Monthly Recurring Revenue</div>
            <div className="stat-value">{formatCurrency(calculateMRR())}</div>
            <div className="stat-sub">Per month</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-label">Annual Recurring Revenue</div>
            <div className="stat-value">{formatCurrency(calculateARR())}</div>
            <div className="stat-sub">Per year</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-label">Active Contracts</div>
            <div className="stat-value">{getActiveContracts()}</div>
            <div className="stat-sub">Paying clients</div>
          </div>
        </div>

        {/* Type Breakdown */}
        <div className="type-breakdown">
          <h2>Revenue by Type</h2>
          <div className="type-grid">
            <div className="type-item">
              <div className="type-info">
                <div className="type-icon">🔧</div>
                <div className="type-details">
                  <h3>Website Maintenance</h3>
                  <p>{getContractsByType('maintenance').length} contracts</p>
                </div>
              </div>
              <div className="type-value">
                <div className="type-amount">
                  {formatCurrency(
                    getContractsByType('maintenance')
                      .reduce((sum, c) => sum + getMRRForContract(c), 0)
                  )}
                </div>
                <div className="type-count">per month</div>
              </div>
            </div>

            <div className="type-item">
              <div className="type-info">
                <div className="type-icon">☁️</div>
                <div className="type-details">
                  <h3>Hosting</h3>
                  <p>{getContractsByType('hosting').length} contracts</p>
                </div>
              </div>
              <div className="type-value">
                <div className="type-amount">
                  {formatCurrency(
                    getContractsByType('hosting')
                      .reduce((sum, c) => sum + getMRRForContract(c), 0)
                  )}
                </div>
                <div className="type-count">per month</div>
              </div>
            </div>

            <div className="type-item">
              <div className="type-info">
                <div className="type-icon">📱</div>
                <div className="type-details">
                  <h3>Social Media</h3>
                  <p>{getContractsByType('social_media').length} contracts</p>
                </div>
              </div>
              <div className="type-value">
                <div className="type-amount">
                  {formatCurrency(
                    getContractsByType('social_media')
                      .reduce((sum, c) => sum + getMRRForContract(c), 0)
                  )}
                </div>
                <div className="type-count">per month</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Contracts
          </button>
          <button
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={`filter-btn ${filter === 'paused' ? 'active' : ''}`}
            onClick={() => setFilter('paused')}
          >
            Paused
          </button>
          <button
            className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled
          </button>
        </div>

        {/* Contracts List */}
        {loading ? (
          <div className="loading">Loading contracts...</div>
        ) : contracts.length === 0 ? (
          <div className="empty-state">
            <div style={{fontSize: '4rem', marginBottom: '20px'}}>💰</div>
            <h2>No recurring contracts yet</h2>
            <p>Start tracking your monthly revenue by adding your first contract.</p>
            <Link href="/crm/recurring/new" className="btn-primary">
              Add First Contract
            </Link>
          </div>
        ) : (
          <div className="contracts-grid">
            {contracts.map((contract) => {
              const clientName = contract.clients?.company || contract.clients?.name || 'Unknown Client';
              
              return (
                <Link
                  key={contract.id}
                  href={`/crm/recurring/${contract.id}`}
                  className="contract-card"
                >
                  <div className="contract-header">
                    <div className="contract-info">
                      <h3>{contract.name}</h3>
                      <div className="contract-client">🏢 {clientName}</div>
                      <div className="contract-type">
                        {getTypeIcon(contract.contract_type)} {getTypeName(contract.contract_type)}
                      </div>
                    </div>
                    {getStatusBadge(contract.status)}
                  </div>

                  <div className="contract-details">
                    <div className="detail-item">
                      <div className="detail-label">Amount</div>
                      <div className="detail-value amount">
                        {formatCurrency(contract.monthly_amount)}
                        {contract.billing_cycle === 'yearly' ? '/year' : '/month'}
                      </div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">MRR</div>
                      <div className="detail-value amount">
                        {formatCurrency(getMRRForContract(contract))}/mo
                      </div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Next Billing</div>
                      <div className="detail-value">
                        {new Date(contract.next_billing_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Started</div>
                      <div className="detail-value">
                        {new Date(contract.start_date).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
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