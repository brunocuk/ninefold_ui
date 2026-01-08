// app/(crm-admin)/crm/prospects/page.jsx
// Prospects List with Tailwind CSS

'use client';

import { useEffect, useState } from 'react';
import { getAuthenticatedClient } from '@/lib/supabase';
import Link from 'next/link';
import {
  Mail,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  Target,
  Globe,
  Linkedin,
  Send,
  Search,
  MessageCircle,
  AlertCircle,
  Hash
} from 'lucide-react';

export default function ProspectsPage() {
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadProspects();
  }, [filter]);

  const loadProspects = async () => {
    setLoading(true);
    try {
      const supabase = getAuthenticatedClient();
      let query = supabase
        .from('prospects')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setProspects(data || []);
    } catch (error) {
      console.error('Error loading prospects:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    researched: { bg: 'bg-slate-500', text: 'Researched', icon: Search },
    'outreach-pending': { bg: 'bg-blue-500', text: 'Outreach Pending', icon: Mail },
    contacted: { bg: 'bg-purple-500', text: 'Contacted', icon: Send },
    responding: { bg: 'bg-[#00FF94]', text: 'Responding', icon: MessageCircle, textColor: 'text-black' },
    qualified: { bg: 'bg-green-500', text: 'Qualified', icon: CheckCircle },
    unresponsive: { bg: 'bg-amber-500', text: 'Unresponsive', icon: AlertCircle },
    disqualified: { bg: 'bg-red-500', text: 'Disqualified', icon: XCircle }
  };

  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig.researched;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 ${config.bg} ${config.textColor || 'text-white'} px-3 py-1.5 rounded-full text-xs font-bold`}>
        <Icon size={12} />
        {config.text}
      </span>
    );
  };

  const filterButtons = [
    { value: 'all', label: 'All', count: prospects.length },
    { value: 'researched', label: 'Researched', icon: Search },
    { value: 'outreach-pending', label: 'Outreach Pending', icon: Mail },
    { value: 'contacted', label: 'Contacted', icon: Send },
    { value: 'responding', label: 'Responding', icon: MessageCircle },
    { value: 'qualified', label: 'Qualified', icon: CheckCircle },
    { value: 'unresponsive', label: 'Unresponsive', icon: AlertCircle }
  ];

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-[#00FF94] to-[#00CC76] bg-clip-text text-transparent mb-2">
            Prospects
          </h1>
          <p className="text-gray-400">Manage your cold outreach pipeline</p>
        </div>
        <Link
          href="/crm/prospects/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#00FF94] text-black rounded-xl font-bold hover:shadow-lg hover:shadow-[#00FF94]/30 hover:-translate-y-0.5 transition-all"
        >
          <Target size={20} />
          Add Prospect
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
          <div className="text-2xl text-[#00FF94]">Loading prospects...</div>
        </div>
      ) : prospects.length === 0 ? (
        <div className="bg-[#1a1a1a] border-2 border-dashed border-[#2A2A2A] rounded-2xl p-20 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#00FF94]/10 flex items-center justify-center">
            <Target size={40} className="text-[#00FF94]" />
          </div>
          <h2 className="text-2xl font-bold mb-3">No prospects yet</h2>
          <p className="text-gray-400 text-lg mb-8">
            {filter === 'all'
              ? 'Add your first prospect to start your cold outreach campaign.'
              : `No prospects with status "${filter}".`}
          </p>
          {filter === 'all' && (
            <Link
              href="/crm/prospects/new"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#00FF94] text-black rounded-xl font-bold hover:shadow-lg hover:shadow-[#00FF94]/30 hover:-translate-y-0.5 transition-all"
            >
              <Target size={20} />
              Add First Prospect
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-5">
          {prospects.map((prospect) => (
            <Link
              key={prospect.id}
              href={`/crm/prospects/${prospect.id}`}
              className="block group bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#00FF94] hover:shadow-xl hover:shadow-[#00FF94]/10 hover:translate-x-1 transition-all duration-300"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-5">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{prospect.contact_name}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    {prospect.company && (
                      <span className="inline-flex items-center gap-1.5">
                        <Building2 size={14} className="text-[#00FF94]" />
                        {prospect.company}
                      </span>
                    )}
                    {prospect.primary_email && (
                      <span className="inline-flex items-center gap-1.5">
                        <Mail size={14} className="text-[#00FF94]" />
                        {prospect.primary_email}
                      </span>
                    )}
                    {prospect.linkedin_url && (
                      <span className="inline-flex items-center gap-1.5">
                        <Linkedin size={14} className="text-[#00FF94]" />
                        LinkedIn
                      </span>
                    )}
                    {prospect.website_url && (
                      <span className="inline-flex items-center gap-1.5">
                        <Globe size={14} className="text-[#00FF94]" />
                        Website
                      </span>
                    )}
                  </div>
                </div>
                {getStatusBadge(prospect.status)}
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                <div className="bg-[#0a0a0a] rounded-lg p-3">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">Outreach Attempts</div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#00FF94]">
                    <Hash size={14} />
                    {prospect.outreach_attempts || 0}
                  </div>
                </div>
                <div className="bg-[#0a0a0a] rounded-lg p-3">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">Last Contacted</div>
                  <div className="text-sm font-semibold text-[#00FF94]">
                    {prospect.last_contacted
                      ? new Date(prospect.last_contacted).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : 'Never'}
                  </div>
                </div>
                {prospect.industry && (
                  <div className="bg-[#0a0a0a] rounded-lg p-3">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">Industry</div>
                    <div className="text-sm font-semibold text-[#00FF94]">{prospect.industry}</div>
                  </div>
                )}
                {prospect.company_size && (
                  <div className="bg-[#0a0a0a] rounded-lg p-3">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">Company Size</div>
                    <div className="text-sm font-semibold text-[#00FF94]">{prospect.company_size}</div>
                  </div>
                )}
              </div>

              {/* Alternative Emails */}
              {(prospect.secondary_email || prospect.tertiary_email) && (
                <div className="mb-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Alternative Emails</div>
                  <div className="flex flex-wrap gap-3">
                    {prospect.secondary_email && (
                      <span className="inline-flex items-center gap-1.5 text-sm text-gray-400">
                        <Mail size={12} className="text-[#00FF94]" />
                        {prospect.secondary_email}
                      </span>
                    )}
                    {prospect.tertiary_email && (
                      <span className="inline-flex items-center gap-1.5 text-sm text-gray-400">
                        <Mail size={12} className="text-[#00FF94]" />
                        {prospect.tertiary_email}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Notes Preview */}
              {prospect.notes && (
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {prospect.notes.length > 150
                    ? prospect.notes.substring(0, 150) + '...'
                    : prospect.notes}
                </p>
              )}

              {/* Footer */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock size={12} />
                Added {new Date(prospect.created_at).toLocaleDateString('en-US', {
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
