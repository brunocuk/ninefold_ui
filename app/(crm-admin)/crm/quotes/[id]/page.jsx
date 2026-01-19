// app/(crm-admin)/crm/quotes/[id]/page.jsx
// Quote Detail Page with Tailwind CSS

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,
  Mail,
  Eye,
  Trash2,
  ExternalLink,
  DollarSign,
  Calendar,
  Send,
  X
} from 'lucide-react';

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
      await loadQuote();
    } catch (error) {
      console.error('Error sending email:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setSending(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      draft: 'bg-gray-600',
      sent: 'bg-blue-500',
      viewed: 'bg-purple-500',
      accepted: 'bg-[#00FF94] text-black',
      rejected: 'bg-red-500'
    };

    return (
      <span className={`${colors[status] || 'bg-gray-600'} text-white px-4 py-3 rounded-full text-sm font-bold`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-2xl text-[#00FF94]">Loading quote...</div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Quote not found</h2>
        <Link href="/crm/quotes" className="text-[#00FF94] hover:underline">
          ← Back to Quotes
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn max-w-5xl">
      {/* Breadcrumb */}
      <Link 
        href="/crm/quotes" 
        className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00FF94] mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Quotes
      </Link>

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
        <div className="flex-1">
          {quote.title && (
            <p className="text-[#00FF94] text-sm font-semibold mb-2">{quote.title}</p>
          )}
          <h1 className="text-4xl font-black text-white mb-4">{quote.client_name}</h1>
          {client && (
            <Link 
              href={`/crm/clients/${client.id}`} 
              className="inline-flex items-center gap-2 text-[#00FF94] hover:underline font-semibold"
            >
              View Client Profile
              <ExternalLink size={16} />
            </Link>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          {getStatusBadge(quote.status)}
          <button 
            onClick={() => setShowEmailModal(true)} 
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00FF94] text-black rounded-xl font-bold hover:shadow-lg hover:shadow-[#00FF94]/30 hover:-translate-y-0.5 transition-all"
            disabled={sending}
          >
            <Mail size={18} />
            Send Email
          </button>
          <a 
            href={`/quote/${params.id}`} 
            target="_blank"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all"
          >
            <Eye size={18} />
            Preview
          </a>
          <button 
            onClick={deleteQuote} 
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      {/* Email Status */}
      {quote.last_sent_at && (
        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#00FF94]/10 flex items-center justify-center">
              <Send size={20} className="text-[#00FF94]" />
            </div>
            <h3 className="text-xl font-bold">Email Status</h3>
          </div>
          <p className="text-gray-400">
            Last sent: <span className="text-[#00FF94] font-semibold">
              {new Date(quote.last_sent_at).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })}
            </span>
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6 text-center">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Total Value</div>
          <div className="text-3xl font-black text-[#00FF94] flex items-center justify-center gap-2">
            <DollarSign size={24} />
            €{quote.pricing?.total?.toLocaleString() || 0}
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6 text-center">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Views</div>
          <div className="text-3xl font-black text-[#00FF94] flex items-center justify-center gap-2">
            <Eye size={24} />
            {quote.view_count || 0}
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6 text-center">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Created</div>
          <div className="text-xl font-black text-[#00FF94] flex items-center justify-center gap-2">
            <Calendar size={20} />
            {new Date(quote.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">Pricing Breakdown</h3>

        {/* Line Items */}
        {quote.pricing?.items && quote.pricing.items.length > 0 && (
          <div className="space-y-3 mb-4">
            {quote.pricing.items.map((item, index) => (
              <div key={index} className="py-3 border-b border-[#2A2A2A]">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">{item.name}</span>
                  <span className="text-white font-semibold">€{item.price.toLocaleString()}</span>
                </div>
                {item.description && (
                  <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-400">
            <span>Subtotal</span>
            <span>€{quote.pricing?.subtotal?.toLocaleString() || 0}</span>
          </div>
          {quote.pricing?.discountRate > 0 && (
            <div className="flex justify-between text-[#00FF94]">
              <span>Discount ({(quote.pricing.discountRate * 100).toFixed(0)}%)</span>
              <span>-€{quote.pricing.discountAmount?.toLocaleString() || 0}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-[#2A2A2A]">
            <span>Total</span>
            <span className="text-[#00FF94]">€{quote.pricing?.total?.toLocaleString() || 0}</span>
          </div>
        </div>

        {/* Payment Structure */}
        <div className="mt-6 pt-4 border-t border-[#2A2A2A]">
          <h4 className="text-sm font-semibold text-gray-400 mb-3">Payment Structure</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#00FF94]/10 border border-[#00FF94]/20 rounded-xl p-4">
              <div className="text-xs text-[#00FF94]/70 mb-1">
                {((quote.pricing?.depositRate || 0.5) * 100).toFixed(0)}% Deposit
              </div>
              <div className="text-xl font-bold text-[#00FF94]">
                €{(quote.pricing?.total * (quote.pricing?.depositRate || 0.5))?.toLocaleString() || 0}
              </div>
            </div>
            <div className="bg-[#2A2A2A] rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">
                {(100 - (quote.pricing?.depositRate || 0.5) * 100).toFixed(0)}% On Completion
              </div>
              <div className="text-xl font-bold text-white">
                €{(quote.pricing?.total * (1 - (quote.pricing?.depositRate || 0.5)))?.toLocaleString() || 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fadeIn"
          onClick={() => setShowEmailModal(false)}
        >
          <div 
            className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-8 max-w-md w-[90%]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Send Quote via Email</h3>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Recipient Email *
                </label>
                <input
                  type="email"
                  value={emailForm.email}
                  onChange={(e) => setEmailForm({...emailForm, email: e.target.value})}
                  placeholder="client@example.com"
                  required
                  className="w-full px-4 py-3 bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  value={emailForm.name}
                  onChange={(e) => setEmailForm({...emailForm, name: e.target.value})}
                  placeholder="Client Name"
                  required
                  className="w-full px-4 py-3 bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setShowEmailModal(false)}
                disabled={sending}
                className="flex-1 px-6 py-3 bg-[#2A2A2A] text-white rounded-xl font-bold hover:bg-[#3A3A3A] transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={sendQuoteEmail}
                disabled={sending}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#00FF94] text-black rounded-xl font-bold hover:shadow-lg hover:shadow-[#00FF94]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
                {sending ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </div>
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