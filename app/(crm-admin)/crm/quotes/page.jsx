// app/(crm-admin)/crm/quotes/page.jsx
// Quotes List with Service Type and Quote Type Filters

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
  FileText,
  Building2,
  DollarSign,
  Eye,
  Plus,
  FileEdit,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Filter,
  RefreshCw
} from 'lucide-react';
import { SERVICE_TYPES, getServiceType, getServiceBadgeColor } from '@/lib/serviceTemplates';

export default function QuotesPage() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all');
  const [quoteTypeFilter, setQuoteTypeFilter] = useState('all');

  useEffect(() => {
    loadQuotes();
  }, [statusFilter, serviceTypeFilter, quoteTypeFilter]);

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

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (serviceTypeFilter !== 'all') {
        query = query.eq('service_type', serviceTypeFilter);
      }

      if (quoteTypeFilter !== 'all') {
        query = query.eq('quote_type', quoteTypeFilter);
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

  const clearFilters = () => {
    setStatusFilter('all');
    setServiceTypeFilter('all');
    setQuoteTypeFilter('all');
  };

  const hasActiveFilters = statusFilter !== 'all' || serviceTypeFilter !== 'all' || quoteTypeFilter !== 'all';

  const statusConfig = {
    draft: { bg: 'bg-gray-600', text: 'Draft', icon: FileEdit },
    sent: { bg: 'bg-blue-500', text: 'Sent', icon: Send },
    viewed: { bg: 'bg-purple-500', text: 'Viewed', icon: Eye },
    accepted: { bg: 'bg-[#00FF94] text-black', text: 'Accepted', icon: CheckCircle },
    rejected: { bg: 'bg-red-500', text: 'Rejected', icon: XCircle }
  };

  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig.draft;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 ${config.bg} text-white px-3 py-1.5 rounded-full text-xs font-bold`}>
        <Icon size={12} />
        {config.text}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('hr-HR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const statusButtons = [
    { value: 'all', label: 'All' },
    { value: 'draft', label: 'Draft', icon: FileEdit },
    { value: 'sent', label: 'Sent', icon: Send },
    { value: 'viewed', label: 'Viewed', icon: Eye },
    { value: 'accepted', label: 'Accepted', icon: CheckCircle },
    { value: 'rejected', label: 'Rejected', icon: XCircle }
  ];

  const serviceTypeOptions = [
    { value: 'all', label: 'Sve usluge' },
    ...Object.values(SERVICE_TYPES).map(s => ({
      value: s.id,
      label: `${s.icon} ${s.nameHr}`
    }))
  ];

  const quoteTypeOptions = [
    { value: 'all', label: 'Svi tipovi' },
    { value: 'project', label: '📋 Projekt' },
    { value: 'monthly', label: '🔄 Mjesečni' }
  ];

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-[#00FF94] to-[#00CC76] bg-clip-text text-transparent mb-2">
            Quotes
          </h1>
          <p className="text-gray-400">Manage proposals and track conversions</p>
        </div>
        <Link
          href="/crm/quotes/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#00FF94] text-black rounded-xl font-bold hover:shadow-lg hover:shadow-[#00FF94]/30 hover:-translate-y-0.5 transition-all"
        >
          <Plus size={20} />
          Create Quote
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Filter size={18} />
            <span className="text-sm font-semibold">Filteri</span>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-xs text-[#00FF94] hover:underline"
            >
              <RefreshCw size={12} />
              Očisti filtere
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="mb-4">
          <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">Status</label>
          <div className="flex flex-wrap gap-2">
            {statusButtons.map((btn) => {
              const Icon = btn.icon;
              return (
                <button
                  key={btn.value}
                  onClick={() => setStatusFilter(btn.value)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === btn.value
                      ? 'bg-[#00FF94] text-black'
                      : 'bg-[#2A2A2A] text-gray-400 hover:bg-[#3A3A3A] hover:text-white'
                  }`}
                >
                  {Icon && <Icon size={12} />}
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Service Type and Quote Type Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">Vrsta usluge</label>
            <select
              value={serviceTypeFilter}
              onChange={(e) => setServiceTypeFilter(e.target.value)}
              className="w-full bg-[#2A2A2A] text-white p-2.5 rounded-lg border border-[#3A3A3A] focus:border-[#00FF94] outline-none text-sm"
            >
              {serviceTypeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">Tip ponude</label>
            <select
              value={quoteTypeFilter}
              onChange={(e) => setQuoteTypeFilter(e.target.value)}
              className="w-full bg-[#2A2A2A] text-white p-2.5 rounded-lg border border-[#3A3A3A] focus:border-[#00FF94] outline-none text-sm"
            >
              {quoteTypeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-2xl text-[#00FF94]">Loading quotes...</div>
        </div>
      ) : quotes.length === 0 ? (
        <div className="bg-[#1a1a1a] border-2 border-dashed border-[#2A2A2A] rounded-2xl p-20 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#00FF94]/10 flex items-center justify-center">
            <FileText size={40} className="text-[#00FF94]" />
          </div>
          <h2 className="text-2xl font-bold mb-3">No quotes found</h2>
          <p className="text-gray-400 text-lg mb-8">
            {hasActiveFilters
              ? 'No quotes match the current filters.'
              : 'Create your first quote to get started.'}
          </p>
          {hasActiveFilters ? (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#2A2A2A] text-white rounded-xl font-bold hover:bg-[#3A3A3A] transition-all"
            >
              <RefreshCw size={18} />
              Clear Filters
            </button>
          ) : (
            <Link
              href="/crm/quotes/new"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#00FF94] text-black rounded-xl font-bold hover:shadow-lg hover:shadow-[#00FF94]/30 hover:-translate-y-0.5 transition-all"
            >
              <Plus size={20} />
              Create First Quote
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-5">
          {quotes.map((quote) => {
            const clientName = quote.client_name ||
                              quote.clients?.company ||
                              quote.clients?.name ||
                              quote.leads?.company ||
                              quote.leads?.name ||
                              'Unknown Client';

            const serviceInfo = getServiceType(quote.service_type || 'web_development');
            const isMonthly = quote.quote_type === 'monthly';

            return (
              <Link
                key={quote.id}
                href={`/crm/quotes/${quote.id}`}
                className="block group bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#00FF94] hover:shadow-xl hover:shadow-[#00FF94]/10 hover:translate-x-1 transition-all duration-300"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-5">
                  <div className="flex-1">
                    {/* Service Type & Quote Type Badges */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        isMonthly ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {isMonthly ? '🔄 Mjesečni' : '📋 Projekt'}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#2A2A2A] text-gray-300`}>
                        {serviceInfo.icon} {serviceInfo.nameHr}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">
                      {quote.title || `Quote for ${clientName}`}
                    </h3>
                    <div className="flex items-center gap-2 text-[#00FF94] font-semibold mb-3">
                      <Building2 size={16} />
                      {clientName}
                    </div>
                    {(quote.quote_number || quote.reference) && (
                      <div className="text-sm text-gray-500 font-mono">
                        #{quote.quote_number || quote.reference}
                      </div>
                    )}
                  </div>
                  {getStatusBadge(quote.status)}
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
                  <div className="bg-[#0a0a0a] rounded-lg p-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                      {isMonthly ? 'Mjesečno' : 'Total Value'}
                    </div>
                    <div className={`text-lg font-black flex items-center gap-1 ${isMonthly ? 'text-purple-400' : 'text-[#00FF94]'}`}>
                      <DollarSign size={16} />
                      {isMonthly
                        ? formatCurrency(quote.monthly_price || quote.pricing?.monthlyPrice || 0)
                        : formatCurrency(quote.pricing?.total || 0)
                      }
                      {isMonthly && <span className="text-sm">/mj</span>}
                    </div>
                  </div>

                  {!isMonthly && quote.pricing?.discountRate > 0 && (
                    <div className="bg-[#0a0a0a] rounded-lg p-4">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                        Discount
                      </div>
                      <div className="text-lg font-black text-[#00FF94]">
                        {(quote.pricing.discountRate * 100).toFixed(0)}%
                      </div>
                    </div>
                  )}

                  <div className="bg-[#0a0a0a] rounded-lg p-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                      Views
                    </div>
                    <div className="text-lg font-black text-[#00FF94] flex items-center gap-1">
                      <Eye size={16} />
                      {quote.view_count || 0}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-5 border-t border-[#2A2A2A] text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    Created {new Date(quote.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  {quote.last_viewed_at && (
                    <div className="flex items-center gap-1.5">
                      <Eye size={12} />
                      Last viewed {new Date(quote.last_viewed_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
