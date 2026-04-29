// app/(crm-admin)/crm/recurring/[id]/page.jsx
// Contract Detail Page - Redesigned with paid_periods as single source of truth

'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/Toast';

// Helper: Get all expected periods from start date to now + 3 months
function getExpectedPeriods(startDate, billingCycle, endDate = null) {
  const periods = [];
  const now = new Date();
  const futureLimit = new Date(now);
  futureLimit.setMonth(futureLimit.getMonth() + 3); // Show 3 months ahead

  const end = endDate ? new Date(Math.min(new Date(endDate), futureLimit)) : futureLimit;
  const start = new Date(startDate);
  const current = new Date(start.getFullYear(), start.getMonth(), 1);

  while (current <= end) {
    const key = billingCycle === 'yearly'
      ? current.getFullYear().toString()
      : `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;

    const label = billingCycle === 'yearly'
      ? current.getFullYear().toString()
      : current.toLocaleDateString('en-US', { month: 'short' });

    periods.push({
      key,
      label,
      year: current.getFullYear(),
      date: new Date(current),
      isPast: current < new Date(now.getFullYear(), now.getMonth(), 1),
      isCurrent: billingCycle === 'yearly'
        ? current.getFullYear() === now.getFullYear()
        : current.getFullYear() === now.getFullYear() && current.getMonth() === now.getMonth(),
    });

    if (billingCycle === 'yearly') {
      current.setFullYear(current.getFullYear() + 1);
    } else {
      current.setMonth(current.getMonth() + 1);
    }
  }
  return periods;
}

// Helper: Get overdue periods (past expected but not paid)
function getOverduePeriods(periods, paidPeriods) {
  return periods.filter(p => (p.isPast || p.isCurrent) && !paidPeriods.includes(p.key));
}

// Helper: Get next due period (first unpaid that's not in the future)
function getNextDuePeriod(periods, paidPeriods) {
  const overdue = getOverduePeriods(periods, paidPeriods);
  if (overdue.length > 0) return overdue[0];
  // If no overdue, find next upcoming unpaid
  return periods.find(p => !paidPeriods.includes(p.key)) || null;
}

export default function ContractDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
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

  // Memoized calculations
  const periods = useMemo(() => {
    if (!contract) return [];
    return getExpectedPeriods(contract.start_date, contract.billing_cycle, contract.end_date);
  }, [contract?.start_date, contract?.billing_cycle, contract?.end_date]);

  const paidPeriods = useMemo(() => contract?.paid_periods || [], [contract?.paid_periods]);

  const overduePeriods = useMemo(() => {
    return getOverduePeriods(periods, paidPeriods);
  }, [periods, paidPeriods]);

  const nextDue = useMemo(() => {
    return getNextDuePeriod(periods, paidPeriods);
  }, [periods, paidPeriods]);

  const totalCollected = useMemo(() => {
    return paidPeriods.length * (contract?.monthly_amount || 0);
  }, [paidPeriods, contract?.monthly_amount]);

  // Group periods by year for display
  const periodsByYear = useMemo(() => {
    const grouped = {};
    periods.forEach(period => {
      if (!grouped[period.year]) {
        grouped[period.year] = [];
      }
      grouped[period.year].push(period);
    });
    return grouped;
  }, [periods]);

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('recurring_contracts')
        .update({ status: newStatus })
        .eq('id', params.id);

      if (error) throw error;

      setContract({ ...contract, status: newStatus });
      toast.success('Status updated successfully!');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error updating status');
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
      toast.error('Error deleting contract');
    }
  };

  const togglePeriodPaid = async (periodKey) => {
    const currentPaidPeriods = contract?.paid_periods || [];
    let newPaidPeriods;

    if (currentPaidPeriods.includes(periodKey)) {
      // Remove from paid
      newPaidPeriods = currentPaidPeriods.filter(p => p !== periodKey);
    } else {
      // Add to paid
      newPaidPeriods = [...currentPaidPeriods, periodKey].sort();
    }

    try {
      const { error } = await supabase
        .from('recurring_contracts')
        .update({ paid_periods: newPaidPeriods })
        .eq('id', params.id);

      if (error) throw error;

      setContract({
        ...contract,
        paid_periods: newPaidPeriods
      });

      toast.success(currentPaidPeriods.includes(periodKey) ? 'Marked as unpaid' : 'Marked as paid');
    } catch (error) {
      console.error('Error updating paid periods:', error);
      toast.error('Error updating payment status');
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
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 25px;
        }

        .stat-card.alert {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.3);
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

        .stat-value.danger {
          color: #ef4444;
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

        /* Payment Tracker - Year Groups */
        .payment-tracker {
          margin-top: 20px;
        }

        .year-group {
          margin-bottom: 24px;
        }

        .year-group:last-child {
          margin-bottom: 0;
        }

        .year-label {
          font-size: 1rem;
          font-weight: 700;
          color: #666;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #2a2a2a;
        }

        .payment-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 10px;
        }

        .period-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 14px 10px;
          background: #0a0a0a;
          border: 2px solid #333;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .period-btn:hover {
          border-color: #555;
          transform: translateY(-2px);
        }

        .period-btn.paid {
          background: rgba(0, 255, 148, 0.1);
          border-color: #00FF94;
        }

        .period-btn.paid .period-label {
          color: #00FF94;
        }

        .period-btn.paid .period-status {
          color: #00FF94;
        }

        .period-btn.overdue {
          background: rgba(239, 68, 68, 0.1);
          border-color: #ef4444;
        }

        .period-btn.overdue .period-label {
          color: #ef4444;
        }

        .period-btn.overdue .period-status {
          color: #ef4444;
        }

        .period-btn.current {
          border-width: 3px;
        }

        .period-btn.future {
          opacity: 0.5;
        }

        .period-btn.future .period-status {
          color: #666;
        }

        .period-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #ccc;
        }

        .period-status {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .payment-legend {
          display: flex;
          gap: 20px;
          padding-top: 20px;
          margin-top: 20px;
          border-top: 1px solid #333;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: #888;
        }

        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 4px;
          border: 2px solid;
        }

        .legend-dot.paid {
          background: rgba(0, 255, 148, 0.2);
          border-color: #00FF94;
        }

        .legend-dot.overdue {
          background: rgba(239, 68, 68, 0.2);
          border-color: #ef4444;
        }

        .legend-dot.future {
          background: transparent;
          border-color: #555;
        }

        /* Quick Stats Row */
        .quick-stats {
          display: flex;
          gap: 24px;
          padding: 20px;
          background: #0a0a0a;
          border-radius: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .quick-stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .quick-stat-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: #00FF94;
        }

        .quick-stat-value.danger {
          color: #ef4444;
        }

        .quick-stat-label {
          font-size: 0.75rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
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
            <div className="stat-label">Total Collected</div>
            <div className="stat-value">{formatCurrency(totalCollected)}</div>
            <div className="stat-sub">{paidPeriods.length} {contract.billing_cycle === 'yearly' ? 'years' : 'months'} paid</div>
          </div>

          <div className={`stat-card ${overduePeriods.length > 0 ? 'alert' : ''}`}>
            <div className="stat-label">Overdue</div>
            <div className={`stat-value ${overduePeriods.length > 0 ? 'danger' : ''}`}>
              {overduePeriods.length}
            </div>
            <div className="stat-sub">
              {overduePeriods.length > 0
                ? `${formatCurrency(overduePeriods.length * contract.monthly_amount)} owed`
                : 'All caught up!'
              }
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Next Due</div>
            <div className="stat-value" style={{fontSize: '1.5rem', color: nextDue ? (overduePeriods.includes(nextDue) ? '#ef4444' : '#00FF94') : '#888'}}>
              {nextDue ? nextDue.label : 'N/A'}
            </div>
            <div className="stat-sub">
              {nextDue ? nextDue.year : ''}
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
          {/* Payment Tracker - Main Feature */}
          <div className="card">
            <h3 className="card-title">Payment Tracker</h3>
            <p style={{color: '#888', fontSize: '0.9rem', marginBottom: '20px'}}>
              Click on any {contract.billing_cycle === 'yearly' ? 'year' : 'month'} to toggle paid status
            </p>

            <div className="payment-tracker">
              {Object.keys(periodsByYear).sort().map((year) => (
                <div key={year} className="year-group">
                  <div className="year-label">{year}</div>
                  <div className="payment-grid">
                    {periodsByYear[year].map((period) => {
                      const paid = paidPeriods.includes(period.key);
                      const isOverdue = (period.isPast || period.isCurrent) && !paid;
                      const isFuture = !period.isPast && !period.isCurrent;

                      return (
                        <button
                          key={period.key}
                          onClick={() => togglePeriodPaid(period.key)}
                          className={`period-btn ${paid ? 'paid' : ''} ${isOverdue ? 'overdue' : ''} ${isFuture ? 'future' : ''} ${period.isCurrent ? 'current' : ''}`}
                          title={paid ? 'Paid - click to mark unpaid' : 'Unpaid - click to mark paid'}
                        >
                          <span className="period-label">{period.label}</span>
                          <span className="period-status">
                            {paid ? (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            ) : isOverdue ? (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                              </svg>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/>
                              </svg>
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="payment-legend">
              <div className="legend-item">
                <span className="legend-dot paid"></span>
                <span>Paid</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot overdue"></span>
                <span>Overdue</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot future"></span>
                <span>Upcoming</span>
              </div>
            </div>
          </div>

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

          {/* Timeline */}
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
        </div>
      </div>
    </>
  );
}
