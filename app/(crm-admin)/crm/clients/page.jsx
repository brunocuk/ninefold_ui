// app/(crm-admin)/crm/clients/page.jsx
// Clients List with Tailwind CSS

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  DollarSign, 
  FolderKanban,
  CheckCircle,
  Pause,
  Users,
  Plus
} from 'lucide-react';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadClients();
  }, [filter]);

  const loadClients = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    active: { bg: 'bg-[#00FF94] text-black', text: 'Active', icon: CheckCircle },
    inactive: { bg: 'bg-slate-500 text-white', text: 'Inactive', icon: Pause },
    archived: { bg: 'bg-gray-700 text-gray-400', text: 'Archived', icon: Pause }
  };

  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig.active;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 ${config.bg} px-3 py-1.5 rounded-full text-xs font-bold`}>
        <Icon size={12} />
        {config.text}
      </span>
    );
  };

  const filterButtons = [
    { value: 'all', label: 'All', count: clients.length },
    { value: 'active', label: 'Active', icon: CheckCircle },
    { value: 'inactive', label: 'Inactive', icon: Pause }
  ];

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-[#00FF94] to-[#00CC76] bg-clip-text text-transparent mb-2">
            Clients
          </h1>
          <p className="text-gray-400">Manage your customer relationships</p>
        </div>
        <Link 
          href="/crm/clients/new" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#00FF94] text-black rounded-xl font-bold hover:shadow-lg hover:shadow-[#00FF94]/30 hover:-translate-y-0.5 transition-all"
        >
          <Plus size={20} />
          Add Client
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
          <div className="text-2xl text-[#00FF94]">Loading clients...</div>
        </div>
      ) : clients.length === 0 ? (
        <div className="bg-[#1a1a1a] border-2 border-dashed border-[#2A2A2A] rounded-2xl p-20 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#00FF94]/10 flex items-center justify-center">
            <Building2 size={40} className="text-[#00FF94]" />
          </div>
          <h2 className="text-2xl font-bold mb-3">No clients yet</h2>
          <p className="text-gray-400 text-lg mb-8">
            {filter === 'all'
              ? 'Add your first client or convert a lead to get started.'
              : `No ${filter} clients.`}
          </p>
          {filter === 'all' && (
            <div className="flex gap-3 justify-center">
              <Link
                href="/crm/clients/new"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#00FF94] text-black rounded-xl font-bold hover:shadow-lg hover:shadow-[#00FF94]/30 hover:-translate-y-0.5 transition-all"
              >
                <Plus size={20} />
                Add Client
              </Link>
              <Link
                href="/crm/leads"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#2A2A2A] text-white rounded-xl font-bold hover:bg-[#3A3A3A] transition-all"
              >
                <Users size={20} />
                View Leads
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-5">
          {clients.map((client) => (
            <Link
              key={client.id}
              href={`/crm/clients/${client.id}`}
              className="block group bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#00FF94] hover:shadow-xl hover:shadow-[#00FF94]/10 hover:translate-x-1 transition-all duration-300"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-5">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{client.name}</h3>
                  {client.company && (
                    <div className="flex items-center gap-2 text-[#00FF94] font-semibold mb-3">
                      <Building2 size={16} />
                      {client.company}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    {client.email && (
                      <span className="inline-flex items-center gap-1.5">
                        <Mail size={14} className="text-[#00FF94]" />
                        {client.email}
                      </span>
                    )}
                    {client.phone && (
                      <span className="inline-flex items-center gap-1.5">
                        <Phone size={14} className="text-[#00FF94]" />
                        {client.phone}
                      </span>
                    )}
                    {client.city && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={14} className="text-[#00FF94]" />
                        {client.city}
                      </span>
                    )}
                  </div>
                </div>
                {getStatusBadge(client.status)}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-[#0a0a0a] rounded-lg p-4 text-center">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Lifetime Value
                  </div>
                  <div className="text-xl font-black text-[#00FF94] flex items-center justify-center gap-1">
                    <DollarSign size={16} />
                    €{(client.lifetime_value || 0).toLocaleString()}
                  </div>
                </div>
                <div className="bg-[#0a0a0a] rounded-lg p-4 text-center">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Projects
                  </div>
                  <div className="text-xl font-black text-[#00FF94] flex items-center justify-center gap-1">
                    <FolderKanban size={16} />
                    {client.total_projects || 0}
                  </div>
                </div>
                {client.industry && (
                  <div className="bg-[#0a0a0a] rounded-lg p-4 text-center col-span-2 sm:col-span-1">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                      Industry
                    </div>
                    <div className="text-base font-bold text-[#00FF94]">
                      {client.industry}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-5 pt-5 border-t border-[#2A2A2A] text-xs text-gray-500">
                Client since {new Date(client.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric'
                })}
              </div>
            </Link>
          ))}
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