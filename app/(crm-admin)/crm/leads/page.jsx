// app/(crm-admin)/crm/leads/page.jsx
// Leads List with Tailwind CSS

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { 
  Mail, 
  Phone, 
  Building2, 
  Clock, 
  CheckCircle, 
  XCircle,
  Sparkles,
  UserPlus,
  Globe,
  Users as UsersIcon,
  Linkedin,
  Send
} from 'lucide-react';

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadLeads();
  }, [filter]);

  const loadLeads = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    new: { bg: 'bg-blue-500', text: 'New', icon: Sparkles },
    contacted: { bg: 'bg-purple-500', text: 'Contacted', icon: Phone },
    qualified: { bg: 'bg-[#00FF94]', text: 'Qualified', icon: CheckCircle, textColor: 'text-black' },
    'proposal-sent': { bg: 'bg-amber-500', text: 'Proposal Sent', icon: Send },
    won: { bg: 'bg-green-500', text: 'Won', icon: CheckCircle },
    lost: { bg: 'bg-red-500', text: 'Lost', icon: XCircle }
  };

  const sourceIcons = {
    website: Globe,
    referral: UsersIcon,
    linkedin: Linkedin,
    'cold-outreach': Send
  };

  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig.new;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 ${config.bg} ${config.textColor || 'text-white'} px-3 py-1.5 rounded-full text-xs font-bold`}>
        <Icon size={12} />
        {config.text}
      </span>
    );
  };

  const getSourceIcon = (source) => {
    const Icon = sourceIcons[source] || Globe;
    return <Icon size={16} className="text-[#00FF94]" />;
  };

  const filterButtons = [
    { value: 'all', label: 'All', count: leads.length },
    { value: 'new', label: 'New', icon: Sparkles },
    { value: 'contacted', label: 'Contacted', icon: Phone },
    { value: 'qualified', label: 'Qualified', icon: CheckCircle },
    { value: 'proposal-sent', label: 'Proposal Sent', icon: Send }
  ];

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-[#00FF94] to-[#00CC76] bg-clip-text text-transparent mb-2">
            Leads
          </h1>
          <p className="text-gray-400">Track and manage your sales pipeline</p>
        </div>
        <Link 
          href="/crm/leads/new" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#00FF94] text-black rounded-xl font-bold hover:shadow-lg hover:shadow-[#00FF94]/30 hover:-translate-y-0.5 transition-all"
        >
          <UserPlus size={20} />
          Add Lead
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
          <div className="text-2xl text-[#00FF94]">Loading leads...</div>
        </div>
      ) : leads.length === 0 ? (
        <div className="bg-[#1a1a1a] border-2 border-dashed border-[#2A2A2A] rounded-2xl p-20 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#00FF94]/10 flex items-center justify-center">
            <UserPlus size={40} className="text-[#00FF94]" />
          </div>
          <h2 className="text-2xl font-bold mb-3">No leads yet</h2>
          <p className="text-gray-400 text-lg mb-8">
            {filter === 'all'
              ? 'Add your first lead to start tracking your sales pipeline.'
              : `No leads with status "${filter}".`}
          </p>
          {filter === 'all' && (
            <Link
              href="/crm/leads/new"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#00FF94] text-black rounded-xl font-bold hover:shadow-lg hover:shadow-[#00FF94]/30 hover:-translate-y-0.5 transition-all"
            >
              <UserPlus size={20} />
              Add First Lead
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-5">
          {leads.map((lead) => (
            <Link
              key={lead.id}
              href={`/crm/leads/${lead.id}`}
              className="block group bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#00FF94] hover:shadow-xl hover:shadow-[#00FF94]/10 hover:translate-x-1 transition-all duration-300"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-5">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{lead.name}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    {lead.email && (
                      <span className="inline-flex items-center gap-1.5">
                        <Mail size={14} className="text-[#00FF94]" />
                        {lead.email}
                      </span>
                    )}
                    {lead.phone && (
                      <span className="inline-flex items-center gap-1.5">
                        <Phone size={14} className="text-[#00FF94]" />
                        {lead.phone}
                      </span>
                    )}
                    {lead.company && (
                      <span className="inline-flex items-center gap-1.5">
                        <Building2 size={14} className="text-[#00FF94]" />
                        {lead.company}
                      </span>
                    )}
                  </div>
                </div>
                {getStatusBadge(lead.status)}
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                {lead.source && (
                  <div className="bg-[#0a0a0a] rounded-lg p-3">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">Source</div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#00FF94]">
                      {getSourceIcon(lead.source)}
                      {lead.source}
                    </div>
                  </div>
                )}
                {lead.budget_range && (
                  <div className="bg-[#0a0a0a] rounded-lg p-3">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">Budget</div>
                    <div className="text-sm font-semibold text-[#00FF94]">{lead.budget_range}</div>
                  </div>
                )}
                {lead.project_type && (
                  <div className="bg-[#0a0a0a] rounded-lg p-3">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">Project Type</div>
                    <div className="text-sm font-semibold text-[#00FF94]">{lead.project_type}</div>
                  </div>
                )}
                {lead.timeline && (
                  <div className="bg-[#0a0a0a] rounded-lg p-3">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">Timeline</div>
                    <div className="text-sm font-semibold text-[#00FF94]">{lead.timeline}</div>
                  </div>
                )}
              </div>

              {/* Description */}
              {lead.description && (
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {lead.description.length > 150
                    ? lead.description.substring(0, 150) + '...'
                    : lead.description}
                </p>
              )}

              {/* Footer */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock size={12} />
                Added {new Date(lead.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
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