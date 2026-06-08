'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
  Receipt,
  Plus,
  Download,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Euro,
  Search,
  Filter,
} from 'lucide-react';

const STATUS_CONFIG = {
  unpaid: { bg: '#FEF3C7', color: '#D97706', label: 'Neplaćeno' },
  paid: { bg: '#D1FAE5', color: '#059669', label: 'Plaćeno' },
  overdue: { bg: '#FEE2E2', color: '#DC2626', label: 'Dospjelo' },
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterClient, setFilterClient] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [invoicesRes, clientsRes] = await Promise.all([
      supabase
        .from('invoices')
        .select('*, clients(name, company)')
        .order('issue_date', { ascending: false }),
      supabase
        .from('clients')
        .select('id, name, company')
        .order('name'),
    ]);

    setInvoices(invoicesRes.data || []);
    setClients(clientsRes.data || []);
    setLoading(false);
  };

  const handleDownload = async (invoice) => {
    const { data, error } = await supabase.storage
      .from('invoices')
      .createSignedUrl(invoice.file_path, 3600);

    if (error) {
      console.error('Error creating signed URL:', error);
      alert('Greška pri preuzimanju datoteke');
      return;
    }

    window.open(data.signedUrl, '_blank');
  };

  // Filter invoices
  const filteredInvoices = invoices.filter((inv) => {
    if (filterClient && inv.client_id !== filterClient) return false;
    if (filterStatus && inv.status !== filterStatus) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const clientName = (inv.clients?.company || inv.clients?.name || '').toLowerCase();
      return inv.invoice_number.toLowerCase().includes(query) || clientName.includes(query);
    }
    return true;
  });

  // Calculate stats
  const totalInvoices = invoices.length;
  const unpaidAmount = invoices
    .filter((inv) => inv.status === 'unpaid')
    .reduce((sum, inv) => sum + Number(inv.amount), 0);
  const overdueCount = invoices.filter((inv) => inv.status === 'overdue').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-2xl text-[#00FF94]">Učitavanje...</div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">Fakture</h1>
          <p className="text-gray-400">Upravljanje fakturama i dijeljenje s klijentima</p>
        </div>
        <Link
          href="/crm/invoices/new"
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#00FF94] text-black rounded-xl font-bold hover:shadow-lg hover:shadow-[#00FF94]/30 transition-all"
        >
          <Plus size={18} />
          Nova faktura
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#00FF94]/10 flex items-center justify-center">
              <Receipt size={24} className="text-[#00FF94]" />
            </div>
            <div>
              <div className="text-3xl font-bold text-white">{totalInvoices}</div>
              <div className="text-sm text-gray-400">Ukupno faktura</div>
            </div>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <Clock size={24} className="text-yellow-500" />
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-500">€{unpaidAmount.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Neplaćeno</div>
            </div>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
              <AlertCircle size={24} className="text-red-500" />
            </div>
            <div>
              <div className="text-3xl font-bold text-red-500">{overdueCount}</div>
              <div className="text-sm text-gray-400">Dospjelih</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Pretraži po broju fakture ili klijentu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white placeholder:text-gray-500 focus:border-[#00FF94] focus:outline-none"
              />
            </div>
          </div>

          {/* Client Filter */}
          <select
            value={filterClient}
            onChange={(e) => setFilterClient(e.target.value)}
            className="px-4 py-2.5 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none"
          >
            <option value="">Svi klijenti</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.company || client.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <div className="flex gap-2">
            {['', 'unpaid', 'paid', 'overdue'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  filterStatus === status
                    ? 'bg-[#00FF94] text-black'
                    : 'bg-[#0a0a0a] border border-[#2A2A2A] text-gray-400 hover:border-[#00FF94]'
                }`}
              >
                {status === '' ? 'Sve' : STATUS_CONFIG[status].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Invoice List */}
      {filteredInvoices.length === 0 ? (
        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-12 text-center">
          <Receipt size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Nema faktura</h3>
          <p className="text-gray-400 mb-6">
            {invoices.length === 0
              ? 'Dodajte prvu fakturu klikom na "Nova faktura"'
              : 'Nema faktura koje odgovaraju filterima'}
          </p>
          {invoices.length === 0 && (
            <Link
              href="/crm/invoices/new"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#00FF94] text-black rounded-xl font-bold hover:shadow-lg hover:shadow-[#00FF94]/30 transition-all"
            >
              <Plus size={18} />
              Nova faktura
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl overflow-hidden">
          {filteredInvoices.map((invoice, index) => {
            const status = STATUS_CONFIG[invoice.status];
            const clientName = invoice.clients?.company || invoice.clients?.name || 'Nepoznat klijent';

            return (
              <Link
                key={invoice.id}
                href={`/crm/invoices/${invoice.id}`}
                className={`flex items-center gap-4 p-5 hover:bg-[#222] transition-colors ${
                  index < filteredInvoices.length - 1 ? 'border-b border-[#2A2A2A]' : ''
                }`}
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-[#00FF94]/10 flex items-center justify-center flex-shrink-0">
                  <Receipt size={24} className="text-[#00FF94]" />
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-white font-semibold">{invoice.invoice_number}</h3>
                    <span
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                      style={{ background: status.bg, color: status.color }}
                    >
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{clientName}</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(invoice.issue_date).toLocaleDateString('hr-HR')}
                    </span>
                    {invoice.status !== 'paid' && (
                      <span className={`flex items-center gap-1 ${invoice.status === 'overdue' ? 'text-red-500' : ''}`}>
                        Dospijeće: {new Date(invoice.due_date).toLocaleDateString('hr-HR')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right flex-shrink-0">
                  <div className="text-xl font-bold text-white">€{Number(invoice.amount).toLocaleString()}</div>
                </div>

                {/* Download Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDownload(invoice);
                  }}
                  className="w-10 h-10 rounded-lg bg-[#2A2A2A] text-gray-400 flex items-center justify-center hover:bg-[#00FF94] hover:text-black transition-all flex-shrink-0"
                >
                  <Download size={18} />
                </button>
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
