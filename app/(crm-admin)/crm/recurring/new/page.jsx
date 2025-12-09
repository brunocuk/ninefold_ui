// app/(crm-admin)/crm/recurring/new/page.jsx
// Add New Recurring Contract

'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewContractPage() {
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    client_id: '',
    name: '',
    description: '',
    contract_type: 'maintenance',
    monthly_amount: '',
    billing_cycle: 'monthly',
    billing_day: 1,
    payment_method: '',
    start_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, company')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const calculateNextBillingDate = (startDate, billingDay, billingCycle) => {
    const start = new Date(startDate);
    
    if (billingCycle === 'yearly') {
      // Next billing is one year from start
      const nextYear = new Date(start);
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      return nextYear.toISOString().split('T')[0];
    }
    
    // Monthly billing
    const today = new Date();
    const nextBilling = new Date(today.getFullYear(), today.getMonth(), billingDay);
    
    // If billing day already passed this month, set to next month
    if (nextBilling < today) {
      nextBilling.setMonth(nextBilling.getMonth() + 1);
    }
    
    return nextBilling.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const nextBillingDate = calculateNextBillingDate(
        formData.start_date,
        formData.billing_day,
        formData.billing_cycle
      );

      const contractData = {
        client_id: formData.client_id,
        name: formData.name,
        description: formData.description || null,
        contract_type: formData.contract_type,
        monthly_amount: parseFloat(formData.monthly_amount),
        billing_cycle: formData.billing_cycle,
        billing_day: parseInt(formData.billing_day),
        payment_method: formData.payment_method || null,
        status: 'active',
        start_date: formData.start_date,
        next_billing_date: nextBillingDate,
        notes: formData.notes || null
      };

      const { error } = await supabase
        .from('recurring_contracts')
        .insert([contractData]);

      if (error) throw error;

      alert('Contract created successfully!');
      router.push('/crm/recurring');
    } catch (error) {
      console.error('Error creating contract:', error);
      alert('Error creating contract: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .new-contract-page {
          max-width: 800px;
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

        h1 {
          font-size: 2rem;
          font-weight: 900;
          color: white;
          margin-bottom: 40px;
        }

        .form {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 40px;
        }

        .form-section {
          margin-bottom: 40px;
        }

        .form-section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #00FF94;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #333;
        }

        .form-grid {
          display: grid;
          gap: 20px;
        }

        .form-grid.two-col {
          grid-template-columns: 1fr 1fr;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #C4C4C4;
        }

        .form-label.required::after {
          content: ' *';
          color: #00FF94;
        }

        .form-input,
        .form-select,
        .form-textarea {
          background: #0a0a0a;
          border: 1px solid #2A2A2A;
          border-radius: 8px;
          padding: 12px 16px;
          color: white;
          font-size: 1rem;
          transition: all 0.3s;
          font-family: inherit;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #00FF94;
          background: #0F0F0F;
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .form-hint {
          font-size: 0.85rem;
          color: #666;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid #333;
        }

        .btn {
          padding: 14px 28px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
          border: none;
          text-decoration: none;
          display: inline-block;
        }

        .btn-primary {
          background: #00FF94;
          color: #0F0F0F;
        }

        .btn-primary:hover:not(:disabled) {
          background: #00DD7F;
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0, 255, 148, 0.3);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: transparent;
          color: #8F8F8F;
          border: 1px solid #2A2A2A;
        }

        .btn-secondary:hover {
          background: #1a1a1a;
          color: white;
        }

        .type-selector {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .type-option {
          background: #0a0a0a;
          border: 2px solid #2A2A2A;
          border-radius: 8px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s;
          text-align: center;
        }

        .type-option:hover {
          border-color: #00FF94;
        }

        .type-option.selected {
          background: rgba(0, 255, 148, 0.1);
          border-color: #00FF94;
        }

        .type-icon {
          font-size: 2rem;
          margin-bottom: 8px;
        }

        .type-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: white;
        }

        @media (max-width: 768px) {
          .form {
            padding: 24px;
          }

          .form-grid.two-col {
            grid-template-columns: 1fr;
          }

          .type-selector {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="new-contract-page">
        <div className="breadcrumb">
          <Link href="/crm/recurring">← Back to Recurring Revenue</Link>
        </div>

        <h1>Add New Contract</h1>

        <form onSubmit={handleSubmit} className="form">
          {/* Client Selection */}
          <div className="form-section">
            <h3 className="section-title">Client Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label required">Client</label>
                <select
                  className="form-select"
                  value={formData.client_id}
                  onChange={(e) => setFormData({...formData, client_id: e.target.value})}
                  required
                >
                  <option value="">Select a client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.company || client.name}
                    </option>
                  ))}
                </select>
                <span className="form-hint">Choose which client this contract is for</span>
              </div>
            </div>
          </div>

          {/* Contract Details */}
          <div className="form-section">
            <h3 className="section-title">Contract Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label required">Contract Type</label>
                <div className="type-selector">
                  <div
                    className={`type-option ${formData.contract_type === 'maintenance' ? 'selected' : ''}`}
                    onClick={() => setFormData({...formData, contract_type: 'maintenance'})}
                  >
                    <div className="type-icon">🔧</div>
                    <div className="type-name">Maintenance</div>
                  </div>
                  <div
                    className={`type-option ${formData.contract_type === 'hosting' ? 'selected' : ''}`}
                    onClick={() => setFormData({...formData, contract_type: 'hosting'})}
                  >
                    <div className="type-icon">☁️</div>
                    <div className="type-name">Hosting</div>
                  </div>
                  <div
                    className={`type-option ${formData.contract_type === 'social_media' ? 'selected' : ''}`}
                    onClick={() => setFormData({...formData, contract_type: 'social_media'})}
                  >
                    <div className="type-icon">📱</div>
                    <div className="type-name">Social Media</div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label required">Contract Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Website Maintenance"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="What's included in this contract?"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="form-section">
            <h3 className="section-title">Pricing & Billing</h3>
            <div className="form-grid two-col">
              <div className="form-group">
                <label className="form-label required">Amount</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.monthly_amount}
                  onChange={(e) => setFormData({...formData, monthly_amount: e.target.value})}
                  placeholder="200"
                  step="0.01"
                  min="0"
                  required
                />
                <span className="form-hint">Enter the total amount (monthly or yearly)</span>
              </div>

              <div className="form-group">
                <label className="form-label required">Billing Cycle</label>
                <select
                  className="form-select"
                  value={formData.billing_cycle}
                  onChange={(e) => setFormData({...formData, billing_cycle: e.target.value})}
                  required
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              {formData.billing_cycle === 'monthly' && (
                <div className="form-group">
                  <label className="form-label">Billing Day</label>
                  <select
                    className="form-select"
                    value={formData.billing_day}
                    onChange={(e) => setFormData({...formData, billing_day: e.target.value})}
                  >
                    {Array.from({length: 28}, (_, i) => i + 1).map(day => (
                      <option key={day} value={day}>
                        {day}{day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'} of month
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select
                  className="form-select"
                  value={formData.payment_method}
                  onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
                >
                  <option value="">Select method</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="invoice">Invoice</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="form-section">
            <h3 className="section-title">Contract Period</h3>
            <div className="form-grid two-col">
              <div className="form-group">
                <label className="form-label required">Start Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="form-section">
            <h3 className="section-title">Additional Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-textarea"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="e.g., 50/50 split with partner company"
                />
                <span className="form-hint">Add any special terms or notes about this contract</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Contract'}
            </button>
            <Link href="/crm/recurring" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}