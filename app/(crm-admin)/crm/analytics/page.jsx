// app/(crm-admin)/crm/analytics/page.jsx
// Analytics Dashboard - Business metrics and insights

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(searchParams.get('range') || 'this_year');
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    mrr: 0,
    arr: 0,
    pipelineValue: 0,
    conversionRate: 0,
    avgQuoteValue: 0,
    newLeads: 0,
    activeProjects: 0,
    quotesSent: 0,
    quotesAccepted: 0,
  });
  const [revenueByMonth, setRevenueByMonth] = useState([]);
  const [quotesByStatus, setQuotesByStatus] = useState({});
  const [leadsBySource, setLeadsBySource] = useState({});

  // Date range options
  const dateRangeOptions = [
    { value: 'this_month', label: 'This Month' },
    { value: 'this_quarter', label: 'This Quarter' },
    { value: 'this_year', label: 'This Year' },
    { value: 'all_time', label: 'All Time' },
  ];

  // Get date range boundaries
  const getDateRange = (range) => {
    const now = new Date();
    let start = null;

    switch (range) {
      case 'this_month':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'this_quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        start = new Date(now.getFullYear(), quarter * 3, 1);
        break;
      case 'this_year':
        start = new Date(now.getFullYear(), 0, 1);
        break;
      case 'all_time':
      default:
        start = null;
        break;
    }

    return { start, end: now };
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    router.push(`/crm/analytics?range=${range}`, { scroll: false });
  };

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      // Get all data
      const [projectsData, quotesData, leadsData, contractsData] = await Promise.all([
        supabase.from('projects').select('*'),
        supabase.from('quotes').select('*'),
        supabase.from('leads').select('*'),
        supabase.from('recurring_contracts').select('*'),
      ]);

      const projects = projectsData.data || [];
      const quotes = quotesData.data || [];
      const leads = leadsData.data || [];
      const contracts = contractsData.data || [];

      // Calculate metrics
      calculateMetrics(projects, quotes, leads, contracts);
      calculateRevenueByMonth(projects);
      calculateQuotesByStatus(quotes);
      calculateLeadsBySource(leads);

    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (projects, quotes, leads, contracts) => {
    const { start: rangeStart } = getDateRange(dateRange);

    // Filter helper
    const isInRange = (dateStr) => {
      if (!rangeStart) return true; // all_time
      return new Date(dateStr) >= rangeStart;
    };

    // Total revenue from projects in range
    const totalRevenue = projects
      .filter(p => isInRange(p.created_at))
      .reduce((sum, p) => sum + (p.total_value || p.budget || 0), 0);

    // MRR and ARR from recurring contracts (always current, not filtered)
    const mrr = contracts
      .filter(c => c.status === 'active')
      .reduce((sum, c) => {
        if (c.billing_cycle === 'yearly') {
          return sum + (c.monthly_amount / 12);
        }
        return sum + c.monthly_amount;
      }, 0);
    const arr = mrr * 12;

    // Pipeline value (all active quotes, not filtered by date)
    const pipelineValue = quotes
      .filter(q => ['draft', 'sent', 'viewed'].includes(q.status))
      .reduce((sum, q) => sum + (q.pricing?.total || 0), 0);

    // Conversion rate (filtered by range)
    const quotesInRange = quotes.filter(q => isInRange(q.created_at));
    const sentQuotes = quotesInRange.filter(q => ['sent', 'viewed', 'accepted'].includes(q.status)).length;
    const acceptedQuotes = quotesInRange.filter(q => q.status === 'accepted').length;
    const conversionRate = sentQuotes > 0 ? (acceptedQuotes / sentQuotes) * 100 : 0;

    // Average quote value (all quotes)
    const avgQuoteValue = quotes.length > 0
      ? quotes.reduce((sum, q) => sum + (q.pricing?.total || 0), 0) / quotes.length
      : 0;

    // New leads in range
    const newLeads = leads.filter(l => isInRange(l.created_at)).length;

    // Active projects (current state, not filtered)
    const activeProjects = projects.filter(p =>
      p.status === 'in_progress'
    ).length;

    // Quotes sent in range
    const quotesSent = quotes.filter(q =>
      q.last_sent_at && isInRange(q.last_sent_at)
    ).length;

    // Quotes accepted in range
    const quotesAccepted = quotes.filter(q =>
      q.status === 'accepted' && isInRange(q.updated_at)
    ).length;

    setMetrics({
      totalRevenue,
      mrr,
      arr,
      pipelineValue,
      conversionRate,
      avgQuoteValue,
      newLeads,
      activeProjects,
      quotesSent,
      quotesAccepted,
    });
  };

  const calculateRevenueByMonth = (projects) => {
    const revenueMap = {};

    // Use created_at and total_value for all projects
    projects.forEach(p => {
      if (p.created_at) {
        const date = new Date(p.created_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        revenueMap[monthKey] = (revenueMap[monthKey] || 0) + (p.total_value || p.budget || 0);
      }
    });

    // Get last 12 months for better trend visibility
    const months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        revenue: revenueMap[monthKey] || 0,
      });
    }

    setRevenueByMonth(months);
  };

  const calculateQuotesByStatus = (quotes) => {
    const statusCount = {
      draft: 0,
      sent: 0,
      viewed: 0,
      accepted: 0,
      rejected: 0,
    };

    quotes.forEach(q => {
      if (statusCount.hasOwnProperty(q.status)) {
        statusCount[q.status]++;
      }
    });

    setQuotesByStatus(statusCount);
  };

  const calculateLeadsBySource = (leads) => {
    const sourceCount = {};
    
    leads.forEach(l => {
      const source = l.source || 'unknown';
      sourceCount[source] = (sourceCount[source] || 0) + 1;
    });

    setLeadsBySource(sourceCount);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('hr-HR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Chart data
  const revenueChartData = {
    labels: revenueByMonth.map(m => m.month),
    datasets: [
      {
        label: 'Revenue',
        data: revenueByMonth.map(m => m.revenue),
        borderColor: '#00FF94',
        backgroundColor: 'rgba(0, 255, 148, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const quoteStatusChartData = {
    labels: ['Draft', 'Sent', 'Viewed', 'Accepted', 'Rejected'],
    datasets: [
      {
        data: [
          quotesByStatus.draft || 0,
          quotesByStatus.sent || 0,
          quotesByStatus.viewed || 0,
          quotesByStatus.accepted || 0,
          quotesByStatus.rejected || 0,
        ],
        backgroundColor: [
          '#666',
          '#3b82f6',
          '#8b5cf6',
          '#00FF94',
          '#ef4444',
        ],
      },
    ],
  };

  const leadSourceChartData = {
    labels: Object.keys(leadsBySource),
    datasets: [
      {
        data: Object.values(leadsBySource),
        backgroundColor: [
          '#00FF94',
          '#3b82f6',
          '#8b5cf6',
          '#f59e0b',
          '#ef4444',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#C4C4C4',
        },
      },
    },
    scales: {
      y: {
        ticks: { color: '#8F8F8F' },
        grid: { color: '#2A2A2A' },
      },
      x: {
        ticks: { color: '#8F8F8F' },
        grid: { color: '#2A2A2A' },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#C4C4C4',
        },
      },
    },
  };

  if (loading) {
    return (
      <div style={{textAlign: 'center', padding: '100px 0'}}>
        <div style={{fontSize: '1.5rem', color: '#00FF94'}}>Loading analytics...</div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .analytics-page {
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        h1 {
          font-size: 2.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #00FF94 0%, #00DD7F 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 10px;
        }

        .subtitle {
          color: #888;
          margin-bottom: 0;
        }

        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }

        .date-range-picker {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .range-btn {
          padding: 10px 18px;
          border: 1px solid transparent;
          background: #1a1a1a;
          color: #888;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .range-btn:hover {
          color: white;
          background: #222;
          border-color: #333;
        }

        .range-btn.active {
          background: rgba(0, 255, 148, 0.15);
          color: #00FF94;
          border-color: rgba(0, 255, 148, 0.3);
        }

        /* Metrics Grid */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .metric-card {
          background: #1a1a1a;
          border: 1px solid #2A2A2A;
          border-radius: 12px;
          padding: 24px;
          transition: all 0.3s;
        }

        .metric-card:hover {
          border-color: #00FF94;
          transform: translateY(-4px);
        }

        .metric-card.filtered {
          position: relative;
        }

        .metric-card.filtered::after {
          content: '';
          position: absolute;
          top: 8px;
          right: 8px;
          width: 6px;
          height: 6px;
          background: #00FF94;
          border-radius: 50%;
        }

        .metric-label {
          font-size: 0.85rem;
          color: #8F8F8F;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .metric-value {
          font-size: 2.5rem;
          font-weight: 900;
          color: #00FF94;
          line-height: 1;
        }

        .metric-sub {
          font-size: 0.9rem;
          color: #666;
          margin-top: 8px;
        }

        /* Charts */
        .charts-grid {
          display: grid;
          gap: 30px;
          margin-bottom: 40px;
        }

        .chart-card {
          background: #1a1a1a;
          border: 1px solid #2A2A2A;
          border-radius: 12px;
          padding: 30px;
        }

        .chart-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: white;
          margin-bottom: 20px;
        }

        .chart-container {
          height: 300px;
        }

        .charts-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }

        @media (max-width: 1024px) {
          .charts-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="analytics-page">
        <div className="header-row">
          <div>
            <h1>Analytics Dashboard</h1>
            <p className="subtitle">Track your business performance and growth</p>
          </div>
          <div className="date-range-picker">
            {dateRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleDateRangeChange(option.value)}
                className={`range-btn ${dateRange === option.value ? 'active' : ''}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="metrics-grid">
          <div className="metric-card filtered">
            <div className="metric-label">Revenue</div>
            <div className="metric-value">{formatCurrency(metrics.totalRevenue)}</div>
            <div className="metric-sub">From projects</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">MRR</div>
            <div className="metric-value">{formatCurrency(metrics.mrr)}</div>
            <div className="metric-sub">Monthly recurring</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">ARR</div>
            <div className="metric-value">{formatCurrency(metrics.arr)}</div>
            <div className="metric-sub">Annual recurring</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Pipeline Value</div>
            <div className="metric-value">{formatCurrency(metrics.pipelineValue)}</div>
            <div className="metric-sub">Active quotes</div>
          </div>

          <div className="metric-card filtered">
            <div className="metric-label">Conversion Rate</div>
            <div className="metric-value">{metrics.conversionRate.toFixed(1)}%</div>
            <div className="metric-sub">Quote acceptance</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Avg Quote Value</div>
            <div className="metric-value">{formatCurrency(metrics.avgQuoteValue)}</div>
            <div className="metric-sub">All quotes</div>
          </div>

          <div className="metric-card filtered">
            <div className="metric-label">New Leads</div>
            <div className="metric-value">{metrics.newLeads}</div>
            <div className="metric-sub">In period</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Active Projects</div>
            <div className="metric-value">{metrics.activeProjects}</div>
            <div className="metric-sub">In progress</div>
          </div>

          <div className="metric-card filtered">
            <div className="metric-label">Quotes Sent</div>
            <div className="metric-value">{metrics.quotesSent}</div>
            <div className="metric-sub">In period</div>
          </div>

          <div className="metric-card filtered">
            <div className="metric-label">Quotes Won</div>
            <div className="metric-value">{metrics.quotesAccepted}</div>
            <div className="metric-sub">In period</div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-grid">
          {/* Revenue Trend */}
          <div className="chart-card">
            <div className="chart-title">Revenue Trend (Last 12 Months)</div>
            <div className="chart-container">
              <Line data={revenueChartData} options={chartOptions} />
            </div>
          </div>

          {/* Quote Status & Lead Sources */}
          <div className="charts-row">
            <div className="chart-card">
              <div className="chart-title">Quotes by Status</div>
              <div className="chart-container">
                <Doughnut data={quoteStatusChartData} options={doughnutOptions} />
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-title">Lead Sources</div>
              <div className="chart-container">
                <Doughnut data={leadSourceChartData} options={doughnutOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}