// app/(crm-admin)/crm/quotes/page.jsx
// Quotes List with Tailwind CSS

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
  Calendar
} from 'lucide-react';

export default function QuotesPage() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadQuotes();
  }, [filter]);

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

      if (filter !== 'all') {
        query = query.eq('status', filter);
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

  const filterButtons = [
    { value: 'all', label: 'All', count: quotes.length },
    { value: 'draft', label: 'Draft', icon: FileEdit },
    { value: 'sent', label: 'Sent', icon: Send },
    { value: 'viewed', label: 'Viewed', icon: Eye },
    { value: 'accepted', label: 'Accepted', icon: CheckCircle },
    { value: 'rejected', label: 'Rejected', icon: XCircle }
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
      <div className="flex flex-wrap gap-3 mb-8">
        {filterButtons.map((btn) => {
          const Icon = btn.icon;
          return (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 font-semibold transition-all ${
                filter === btn.value
                  ? 'bg-[#00FF94] text-black border-[#00FF94]'
                  : 'bg-[#1a1a1a] text-gray-400 border-[#2A2A2A] hover:border-[#00FF94] hover:text-[#00FF94]'
              }`}
            >
              {Icon && <Icon size={16} />}
              {btn.label}
              {btn.value === 'all' && ` (${btn.count})`}
            </button>
          );
        })}
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
          <h2 className="text-2xl font-bold mb-3">No quotes yet</h2>
          <p className="text-gray-400 text-lg mb-8">
            {filter === 'all'
              ? 'Create your first quote to get started.'
              : `No quotes with status "${filter}".`}
          </p>
          {filter === 'all' && (
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

            return (
              <Link
                key={quote.id}
                href={`/crm/quotes/${quote.id}`}
                className="block group bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#00FF94] hover:shadow-xl hover:shadow-[#00FF94]/10 hover:translate-x-1 transition-all duration-300"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-5">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      Quote for {clientName}
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
                      Total Value
                    </div>
                    <div className="text-lg font-black text-[#00FF94] flex items-center gap-1">
                      <DollarSign size={16} />
                      {formatCurrency(quote.pricing?.total || 0)}
                    </div>
                  </div>
                  
                  {quote.pricing?.discountRate > 0 && (
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