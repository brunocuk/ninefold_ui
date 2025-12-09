// app/crm/page.jsx
// CRM Dashboard - Overview with Stats

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function CRMDashboard() {
  const [stats, setStats] = useState({
    leads: { total: 0, new: 0, qualified: 0 },
    clients: { total: 0, active: 0 },
    quotes: { total: 0, pending: 0, accepted: 0 },
    projects: { total: 0, active: 0 },
    revenue: { total: 0, thisMonth: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Load all data
      const [leadsRes, clientsRes, quotesRes, projectsRes] = await Promise.all([
        supabase.from('leads').select('status'),
        supabase.from('clients').select('status, lifetime_value'),
        supabase.from('quotes').select('status, pricing'),
        supabase.from('projects').select('status, total_value, created_at')
      ]);

      const leads = leadsRes.data || [];
      const clients = clientsRes.data || [];
      const quotes = quotesRes.data || [];
      const projects = projectsRes.data || [];

      // Calculate stats
      const leadsNew = leads.filter(l => l.status === 'new').length;
      const leadsQualified = leads.filter(l => l.status === 'qualified').length;
      const clientsActive = clients.filter(c => c.status === 'active').length;
      const quotesPending = quotes.filter(q => ['sent', 'viewed'].includes(q.status)).length;
      const quotesAccepted = quotes.filter(q => q.status === 'accepted').length;
      const projectsActive = projects.filter(p => 
        ['planning', 'design', 'development', 'testing'].includes(p.status)
      ).length;

      // Revenue
      const totalRevenue = clients.reduce((sum, c) => 
        sum + (parseFloat(c.lifetime_value) || 0), 0
      );

      const thisMonth = new Date();
      thisMonth.setDate(1);
      const monthlyRevenue = projects
        .filter(p => new Date(p.created_at) >= thisMonth)
        .reduce((sum, p) => sum + parseFloat(p.total_value || 0), 0);

      setStats({
        leads: { total: leads.length, new: leadsNew, qualified: leadsQualified },
        clients: { total: clients.length, active: clientsActive },
        quotes: { total: quotes.length, pending: quotesPending, accepted: quotesAccepted },
        projects: { total: projects.length, active: projectsActive },
        revenue: { total: totalRevenue, thisMonth: monthlyRevenue }
      });

      setLoading(false);
    } catch (error) {
      console.error('Error loading stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{textAlign: 'center', padding: '100px 0'}}>
        <div style={{fontSize: '1.5rem', color: '#00FF94'}}>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .dashboard {
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
          margin-bottom: 10px;
          background: linear-gradient(135deg, #00FF94 0%, #00CC76 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          color: #888;
          font-size: 1rem;
        }

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
          padding: 25px;
          transition: all 0.3s;
          cursor: pointer;
          text-decoration: none;
          color: white;
          display: block;
        }

        .stat-card:hover {
          border-color: #00FF94;
          box-shadow: 0 0 30px rgba(0, 255, 148, 0.15);
          transform: translateY(-2px);
        }

        .stat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 15px;
        }

        .stat-icon {
          font-size: 2rem;
        }

        .stat-trend {
          font-size: 0.85rem;
          color: #00FF94;
          font-weight: 600;
        }

        .stat-label {
          color: #888;
          font-size: 0.9rem;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 900;
          color: #00FF94;
          margin-bottom: 10px;
          line-height: 1;
        }

        .stat-meta {
          font-size: 0.85rem;
          color: #666;
          display: flex;
          gap: 15px;
        }

        .stat-meta span {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .quick-actions {
          margin-top: 50px;
        }

        h2 {
          font-size: 1.5rem;
          margin-bottom: 20px;
          color: white;
          font-weight: 700;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 15px;
        }

        .action-card {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 25px 20px;
          text-align: center;
          transition: all 0.3s;
          cursor: pointer;
          text-decoration: none;
          color: white;
          display: block;
        }

        .action-card:hover {
          background: #00FF94;
          color: #000;
          border-color: #00FF94;
          transform: translateY(-2px);
        }

        .action-icon {
          font-size: 2.5rem;
          margin-bottom: 12px;
        }

        .action-label {
          font-weight: 600;
          font-size: 0.95rem;
        }

        .empty-state {
          background: #1a1a1a;
          border: 2px dashed #333;
          border-radius: 12px;
          padding: 60px 20px;
          text-align: center;
          margin-top: 20px;
        }

        .empty-state h3 {
          font-size: 1.3rem;
          margin-bottom: 10px;
          color: white;
        }

        .empty-state p {
          color: #888;
          margin-bottom: 20px;
        }

        .btn {
          background: #00FF94;
          color: #000;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          display: inline-block;
          font-weight: 700;
          transition: all 0.3s;
        }

        .btn:hover {
          box-shadow: 0 0 20px rgba(0, 255, 148, 0.4);
          transform: translateY(-2px);
        }
      `}</style>

      <div className="dashboard">
        <div className="header">
          <h1>Dashboard</h1>
          <p className="subtitle">Welcome back! Here's your business overview.</p>
        </div>

        {stats.leads.total === 0 && stats.clients.total === 0 ? (
          <div className="empty-state">
            <div className="stat-icon" style={{fontSize: '4rem', marginBottom: '20px'}}>🚀</div>
            <h3>Welcome to NineFold CRM!</h3>
            <p>Get started by adding your first lead or client.</p>
            <div style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
              <Link href="/crm/leads/new" className="btn">
                Add First Lead
              </Link>
              <Link href="/crm/clients/new" className="btn" style={{background: '#333', color: 'white'}}>
                Add Client
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="stats-grid">
              <Link href="/crm/leads" className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon">👥</div>
                </div>
                <div className="stat-label">Leads</div>
                <div className="stat-value">{stats.leads.total}</div>
                <div className="stat-meta">
                  <span>🆕 {stats.leads.new} new</span>
                  <span>✓ {stats.leads.qualified} qualified</span>
                </div>
              </Link>

              <Link href="/crm/clients" className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon">🏢</div>
                </div>
                <div className="stat-label">Clients</div>
                <div className="stat-value">{stats.clients.total}</div>
                <div className="stat-meta">
                  <span>✅ {stats.clients.active} active</span>
                </div>
              </Link>

              <Link href="/crm/quotes" className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon">📄</div>
                </div>
                <div className="stat-label">Quotes</div>
                <div className="stat-value">{stats.quotes.total}</div>
                <div className="stat-meta">
                  <span>⏳ {stats.quotes.pending} pending</span>
                  <span>✓ {stats.quotes.accepted} accepted</span>
                </div>
              </Link>

              <Link href="/crm/projects" className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon">🚀</div>
                </div>
                <div className="stat-label">Projects</div>
                <div className="stat-value">{stats.projects.total}</div>
                <div className="stat-meta">
                  <span>🔥 {stats.projects.active} active</span>
                </div>
              </Link>

              <div className="stat-card" style={{cursor: 'default'}}>
                <div className="stat-header">
                  <div className="stat-icon">💰</div>
                </div>
                <div className="stat-label">Total Revenue</div>
                <div className="stat-value">€{stats.revenue.total.toLocaleString()}</div>
                <div className="stat-meta">
                  <span>📊 €{stats.revenue.thisMonth.toLocaleString()} this month</span>
                </div>
              </div>
            </div>

            <div className="quick-actions">
              <h2>Quick Actions</h2>
              <div className="actions-grid">
                <Link href="/crm/leads/new" className="action-card">
                  <div className="action-icon">➕</div>
                  <div className="action-label">Add Lead</div>
                </Link>

                <Link href="/quote-maker" className="action-card">
                  <div className="action-icon">📝</div>
                  <div className="action-label">Create Quote</div>
                </Link>

                <Link href="/crm/projects/new" className="action-card">
                  <div className="action-icon">🚀</div>
                  <div className="action-label">New Project</div>
                </Link>

                <Link href="/crm/clients/new" className="action-card">
                  <div className="action-icon">🏢</div>
                  <div className="action-label">Add Client</div>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}