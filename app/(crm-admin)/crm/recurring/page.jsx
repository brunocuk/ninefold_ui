// app/(crm-admin)/crm/recurring/page.jsx
// Recurring Revenue Dashboard - Redesigned

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
        query = query.eq('status', filter);
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

  const getMRRByType = (type) => {
    return getContractsByType(type).reduce((sum, c) => sum + getMRRForContract(c), 0);
  };

  const getTotalMRR = () => {
    const mrr = calculateMRR();
    return mrr > 0 ? mrr : 1; // Prevent division by zero
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: { bg: 'rgba(0, 255, 148, 0.15)', border: '#00FF94', color: '#00FF94', text: 'Active' },
      paused: { bg: 'rgba(245, 158, 11, 0.15)', border: '#f59e0b', color: '#f59e0b', text: 'Paused' },
      cancelled: { bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444', color: '#ef4444', text: 'Cancelled' }
    };

    const style = styles[status] || styles.active;

    return (
      <span style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        color: style.color,
        padding: '6px 14px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '600',
        letterSpacing: '0.5px',
        textTransform: 'uppercase'
      }}>
        {style.text}
      </span>
    );
  };

  const getTypeConfig = (type) => {
    const configs = {
      maintenance: {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
        ),
        name: 'Maintenance',
        color: '#00FF94',
        bgColor: 'rgba(0, 255, 148, 0.1)'
      },
      hosting: {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
            <line x1="6" y1="6" x2="6.01" y2="6"/>
            <line x1="6" y1="18" x2="6.01" y2="18"/>
          </svg>
        ),
        name: 'Hosting',
        color: '#8B5CF6',
        bgColor: 'rgba(139, 92, 246, 0.1)'
      },
      social_media: {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        ),
        name: 'Social Media',
        color: '#F59E0B',
        bgColor: 'rgba(245, 158, 11, 0.1)'
      }
    };
    return configs[type] || { icon: null, name: type, color: '#888', bgColor: 'rgba(136, 136, 136, 0.1)' };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('hr-HR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getMRRForContract = (contract) => {
    if (contract.billing_cycle === 'yearly') {
      return contract.monthly_amount / 12;
    }
    return contract.monthly_amount;
  };

  const getNextBillingStatus = (date) => {
    const now = new Date();
    const billing = new Date(date);
    const diffDays = Math.ceil((billing - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: 'Overdue', color: '#ef4444' };
    if (diffDays <= 7) return { text: `${diffDays}d`, color: '#f59e0b' };
    if (diffDays <= 30) return { text: `${diffDays}d`, color: '#00FF94' };
    return { text: `${Math.ceil(diffDays / 7)}w`, color: '#888' };
  };

  const filterCounts = {
    all: contracts.length,
    active: contracts.filter(c => c.status === 'active').length,
    paused: contracts.filter(c => c.status === 'paused').length,
    cancelled: contracts.filter(c => c.status === 'cancelled').length
  };

  return (
    <>
      <style jsx global>{`
        .page {
          animation: fadeIn 0.4s ease-out;
          max-width: 1400px;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Header */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 48px;
          gap: 20px;
          flex-wrap: wrap;
        }

        .header-text h1 {
          font-size: 2rem;
          font-weight: 800;
          color: white;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .header-text p {
          color: #666;
          font-size: 1rem;
        }

        .btn-primary {
          background: #00FF94;
          color: #000;
          padding: 14px 28px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.95rem;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 255, 148, 0.3);
        }

        /* Stats Section */
        .stats-section {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
          margin-bottom: 48px;
        }

        @media (max-width: 1024px) {
          .stats-section {
            grid-template-columns: 1fr;
          }
        }

        .main-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        @media (max-width: 640px) {
          .main-stats {
            grid-template-columns: 1fr;
          }
        }

        .stat-card {
          background: linear-gradient(135deg, #1a1a1a 0%, #111 100%);
          border: 1px solid #2a2a2a;
          border-radius: 16px;
          padding: 28px;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #00FF94 0%, #00CC76 100%);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .stat-card:hover::before {
          opacity: 1;
        }

        .stat-card.highlight {
          grid-column: span 2;
          background: linear-gradient(135deg, rgba(0, 255, 148, 0.08) 0%, #111 100%);
          border-color: rgba(0, 255, 148, 0.2);
        }

        @media (max-width: 640px) {
          .stat-card.highlight {
            grid-column: span 1;
          }
        }

        .stat-card.highlight::before {
          opacity: 1;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          color: #00FF94;
          background: rgba(0, 255, 148, 0.1);
        }

        .stat-label {
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .stat-value {
          font-size: 2.2rem;
          font-weight: 800;
          color: white;
          letter-spacing: -1px;
          line-height: 1.1;
        }

        .stat-card.highlight .stat-value {
          color: #00FF94;
          font-size: 2.8rem;
        }

        .stat-sub {
          font-size: 0.85rem;
          color: #555;
          margin-top: 8px;
        }

        /* Breakdown Card */
        .breakdown-card {
          background: linear-gradient(135deg, #1a1a1a 0%, #111 100%);
          border: 1px solid #2a2a2a;
          border-radius: 16px;
          padding: 24px;
        }

        .breakdown-title {
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 24px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .breakdown-items {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .breakdown-item {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .breakdown-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .breakdown-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          color: #ccc;
          font-weight: 500;
        }

        .breakdown-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .breakdown-icon svg {
          width: 16px;
          height: 16px;
        }

        .breakdown-value {
          font-size: 0.95rem;
          font-weight: 700;
          color: white;
        }

        .breakdown-bar {
          height: 6px;
          background: #222;
          border-radius: 3px;
          overflow: hidden;
        }

        .breakdown-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.5s ease-out;
        }

        /* Contracts Section */
        .contracts-section {
          background: linear-gradient(135deg, #1a1a1a 0%, #111 100%);
          border: 1px solid #2a2a2a;
          border-radius: 20px;
          overflow: hidden;
        }

        .contracts-header {
          padding: 20px 24px;
          border-bottom: 1px solid #2a2a2a;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .contracts-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: white;
        }

        /* Filters */
        .filters {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 8px 16px;
          border: 1px solid transparent;
          background: #222;
          color: #888;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .filter-btn:hover {
          color: white;
          background: #2a2a2a;
        }

        .filter-btn.active {
          background: rgba(0, 255, 148, 0.15);
          color: #00FF94;
          border-color: rgba(0, 255, 148, 0.3);
        }

        .filter-count {
          font-size: 0.75rem;
          padding: 2px 6px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.1);
        }

        .filter-btn.active .filter-count {
          background: rgba(0, 255, 148, 0.2);
        }

        /* Contracts List */
        .contracts-list {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .contract-card {
          display: block;
          padding: 24px;
          border-radius: 16px;
          transition: all 0.2s;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
          background: #0a0a0a;
          border: 2px solid #333;
        }

        .contract-card:hover {
          background: #111;
          border-color: #00FF94;
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 255, 148, 0.1);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          gap: 16px;
        }

        .card-info {
          flex: 1;
          min-width: 0;
        }

        .contract-name {
          font-size: 1.15rem;
          font-weight: 700;
          color: white;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 6px;
          flex-wrap: wrap;
        }

        .contract-client {
          font-size: 0.9rem;
          color: #888;
        }

        .card-amount {
          text-align: right;
          flex-shrink: 0;
        }

        .amount-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: #00FF94;
          line-height: 1.2;
        }

        .amount-cycle {
          font-size: 0.8rem;
          color: #555;
          margin-top: 2px;
        }

        .card-bottom {
          display: flex;
          align-items: center;
          gap: 24px;
          padding-top: 16px;
          border-top: 1px solid #222;
          flex-wrap: wrap;
        }

        .type-badge {
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .type-badge svg {
          width: 16px;
          height: 16px;
        }

        .card-meta {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-left: auto;
        }

        @media (max-width: 640px) {
          .card-meta {
            margin-left: 0;
            width: 100%;
            justify-content: space-between;
            margin-top: 12px;
          }
        }

        .meta-item {
          text-align: center;
        }

        .meta-value {
          font-size: 0.95rem;
          font-weight: 600;
          color: white;
        }

        .meta-value.warning {
          color: #f59e0b;
        }

        .meta-value.danger {
          color: #ef4444;
        }

        .meta-value.success {
          color: #00FF94;
        }

        .meta-label {
          font-size: 0.7rem;
          color: #555;
          margin-top: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 80px 28px;
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          background: rgba(0, 255, 148, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: #00FF94;
        }

        .empty-state h2 {
          font-size: 1.3rem;
          margin-bottom: 12px;
          color: white;
          font-weight: 700;
        }

        .empty-state p {
          color: #666;
          margin-bottom: 28px;
          font-size: 1rem;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        .loading {
          text-align: center;
          padding: 80px 28px;
          color: #666;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #222;
          border-top-color: #00FF94;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="page">
        {/* Header */}
        <div className="header">
          <div className="header-text">
            <h1>Recurring Revenue</h1>
            <p>Track and manage your subscriptions</p>
          </div>
          <Link href="/crm/recurring/new" className="btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Contract
          </Link>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="main-stats">
            <div className="stat-card highlight">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div className="stat-label">Monthly Recurring Revenue</div>
              <div className="stat-value">{formatCurrency(calculateMRR())}</div>
              <div className="stat-sub">per month</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                  <polyline points="17 6 23 6 23 12"/>
                </svg>
              </div>
              <div className="stat-label">Annual Recurring Revenue</div>
              <div className="stat-value">{formatCurrency(calculateARR())}</div>
              <div className="stat-sub">projected yearly</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div className="stat-label">Active Contracts</div>
              <div className="stat-value">{getActiveContracts()}</div>
              <div className="stat-sub">paying clients</div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="breakdown-card">
            <div className="breakdown-title">Revenue by Type</div>
            <div className="breakdown-items">
              {['maintenance', 'hosting', 'social_media'].map(type => {
                const config = getTypeConfig(type);
                const mrr = getMRRByType(type);
                const percentage = (mrr / getTotalMRR()) * 100;
                const count = getContractsByType(type).length;

                return (
                  <div key={type} className="breakdown-item">
                    <div className="breakdown-header">
                      <div className="breakdown-label">
                        <div className="breakdown-icon" style={{ background: config.bgColor, color: config.color }}>
                          {config.icon}
                        </div>
                        {config.name}
                      </div>
                      <div className="breakdown-value">{formatCurrency(mrr)}</div>
                    </div>
                    <div className="breakdown-bar">
                      <div
                        className="breakdown-fill"
                        style={{
                          width: `${percentage}%`,
                          background: config.color
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Contracts Section */}
        <div className="contracts-section">
          <div className="contracts-header">
            <div className="contracts-title">All Contracts</div>
            <div className="filters">
              {[
                { key: 'all', label: 'All' },
                { key: 'active', label: 'Active' },
                { key: 'paused', label: 'Paused' },
                { key: 'cancelled', label: 'Cancelled' }
              ].map(f => (
                <button
                  key={f.key}
                  className={`filter-btn ${filter === f.key ? 'active' : ''}`}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                  <span className="filter-count">{filterCounts[f.key]}</span>
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="loading">
              <div className="loading-spinner" />
              Loading contracts...
            </div>
          ) : contracts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <h2>No contracts yet</h2>
              <p>Start tracking your recurring revenue by adding your first contract.</p>
              <Link href="/crm/recurring/new" className="btn-primary">
                Add First Contract
              </Link>
            </div>
          ) : (
            <div className="contracts-list">
              {contracts.map((contract) => {
                const clientName = contract.clients?.company || contract.clients?.name || 'Unknown Client';
                const typeConfig = getTypeConfig(contract.contract_type);
                const nextBilling = getNextBillingStatus(contract.next_billing_date);
                const nextBillingClass = nextBilling.color === '#ef4444' ? 'danger' : nextBilling.color === '#f59e0b' ? 'warning' : nextBilling.color === '#00FF94' ? 'success' : '';

                return (
                  <Link
                    key={contract.id}
                    href={`/crm/recurring/${contract.id}`}
                    className="contract-card"
                  >
                    <div className="card-top">
                      <div className="card-info">
                        <div className="contract-name">
                          {contract.name}
                          {getStatusBadge(contract.status)}
                        </div>
                        <div className="contract-client">{clientName}</div>
                      </div>
                      <div className="card-amount">
                        <div className="amount-value">{formatCurrency(getMRRForContract(contract))}</div>
                        <div className="amount-cycle">/month</div>
                      </div>
                    </div>

                    <div className="card-bottom">
                      <div
                        className="type-badge"
                        style={{
                          background: typeConfig.bgColor,
                          color: typeConfig.color
                        }}
                      >
                        {typeConfig.icon}
                        {typeConfig.name}
                      </div>

                      <div className="card-meta">
                        <div className="meta-item">
                          <div className={`meta-value ${nextBillingClass}`}>{nextBilling.text}</div>
                          <div className="meta-label">Next billing</div>
                        </div>
                        <div className="meta-item">
                          <div className="meta-value">
                            {new Date(contract.start_date).toLocaleDateString('en-US', {
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="meta-label">Started</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
