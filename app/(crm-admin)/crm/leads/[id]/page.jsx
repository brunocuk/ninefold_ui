// app/(crm-admin)/crm/leads/[id]/page.jsx
// Lead Detail Page with Tailwind CSS

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Building2,
  Trash2,
  Save,
  X,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Briefcase,
  Clock,
  User,
  FileText,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import { generateQuoteData, calculateQuoteFromSelections, formatCurrency } from '@/lib/quoteCalculations';

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const [generatingQuote, setGeneratingQuote] = useState(false);

  useEffect(() => {
    loadLead();
  }, [params.id]);

  const loadLead = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setLead(data);
      setFormData(data);
    } catch (error) {
      console.error('Error loading lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('leads')
        .update(formData)
        .eq('id', params.id);

      if (error) throw error;

      setLead(formData);
      setEditing(false);
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error('Error updating lead. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleConvertToClient = async () => {
    if (!confirm('Convert this lead to a client? This will create a new client record.')) {
      return;
    }

    try {
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .insert([{
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          company: lead.company,
          lead_id: lead.id
        }])
        .select()
        .single();

      if (clientError) throw clientError;

      await supabase
        .from('leads')
        .update({ 
          status: 'won',
          converted_at: new Date().toISOString()
        })
        .eq('id', params.id);

      router.push(`/crm/clients/${client.id}`);
    } catch (error) {
      console.error('Error converting lead:', error);
      toast.error('Error converting lead. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', params.id);

      if (error) throw error;
      router.push('/crm/leads');
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast.error('Error deleting lead. Please try again.');
    }
  };

  const handleGenerateQuoteFromSelections = async () => {
    if (!lead.service_selections) {
      toast.error('Ovaj lead nema spremljene odabire usluga');
      return;
    }

    setGeneratingQuote(true);

    try {
      const clientInfo = {
        name: lead.name,
        company: lead.company,
        email: lead.email,
        projectTitle: `Ponuda za ${lead.company || lead.name}`
      };

      const quoteData = generateQuoteData(lead.service_selections, clientInfo);

      // Link quote to lead
      quoteData.lead_id = lead.id;

      const { data: quote, error } = await supabase
        .from('quotes')
        .insert([quoteData])
        .select()
        .single();

      if (error) throw error;

      toast.success('Ponuda kreirana iz odabira!');
      router.push(`/crm/quotes/${quote.id}`);
    } catch (error) {
      console.error('Error generating quote:', error);
      toast.error('Greška pri kreiranju ponude');
    } finally {
      setGeneratingQuote(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-2xl text-[#00FF94]">Loading lead...</div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-medium mb-4">Lead not found</h2>
        <Link href="/crm/leads" className="text-[#00FF94] hover:underline">
          ← Back to Leads
        </Link>
      </div>
    );
  }

  const statusColors = {
    new: 'bg-blue-500',
    contacted: 'bg-purple-500',
    qualified: 'bg-[#F2F2F2] text-[#080808]',
    'proposal-sent': 'bg-amber-500',
    won: 'bg-green-500',
    lost: 'bg-red-500'
  };

  return (
    <div className="max-w-5xl animate-fadeIn">
      {/* Breadcrumb */}
      <Link 
        href="/crm/leads" 
        className="inline-flex items-center gap-2 text-[#8E8E8E] hover:text-[#F2F2F2] mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Leads
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
        <div className="flex-1">
          <h1 className="text-4xl font-medium text-[#F2F2F2] mb-3">{lead.name}</h1>
          <div className="flex flex-wrap gap-3 text-[#8E8E8E]">
            {lead.email && (
              <span className="inline-flex items-center gap-1.5">
                <Mail size={16} className="text-[#00FF94]" />
                {lead.email}
              </span>
            )}
            {lead.phone && (
              <span className="inline-flex items-center gap-1.5">
                <Phone size={16} className="text-[#00FF94]" />
                {lead.phone}
              </span>
            )}
            {lead.company && (
              <span className="inline-flex items-center gap-1.5">
                <Building2 size={16} className="text-[#00FF94]" />
                {lead.company}
              </span>
            )}
          </div>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-bold ${statusColors[lead.status] || 'bg-gray-600'} text-[#F2F2F2]`}>
          {lead.status}
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        {!editing && (
          <>
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F2F2F2] text-[#080808] rounded-full font-medium hover:-translate-y-0.5 transition-all"
            >
              <Edit size={18} />
              Edit
            </button>
            {lead.status !== 'won' && lead.status !== 'lost' && (
              <button
                onClick={handleConvertToClient}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.06] text-[#F2F2F2] rounded-xl font-bold hover:bg-white/[0.1] transition-all"
              >
                <Building2 size={18} />
                Convert to Client
              </button>
            )}
            {lead.service_selections && (
              <button
                onClick={handleGenerateQuoteFromSelections}
                disabled={generatingQuote}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-500 text-[#F2F2F2] rounded-xl font-bold hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50"
              >
                <Sparkles size={18} />
                {generatingQuote ? 'Kreiram...' : 'Generiraj ponudu iz odabira'}
              </button>
            )}
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 text-[#F2F2F2] rounded-xl font-bold hover:bg-red-600 transition-all"
            >
              <Trash2 size={18} />
              Delete
            </button>
          </>
        )}
      </div>

      {/* Content */}
      {editing ? (
        <form onSubmit={handleUpdate}>
          <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-2xl p-8">
            <h3 className="text-2xl font-medium mb-6 pb-4 border-b border-white/[0.07]">
              Edit Lead
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-[#8E8E8E] mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-[#080808] border border-white/[0.07] rounded-xl text-[#F2F2F2] focus:border-white/25 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#8E8E8E] mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-[#080808] border border-white/[0.07] rounded-xl text-[#F2F2F2] focus:border-white/25 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#8E8E8E] mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-[#080808] border border-white/[0.07] rounded-xl text-[#F2F2F2] focus:border-white/25 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#8E8E8E] mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company || ''}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full px-4 py-3 bg-[#080808] border border-white/[0.07] rounded-xl text-[#F2F2F2] focus:border-white/25 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#8E8E8E] mb-2">
                  Status
                </label>
                <select
                  value={formData.status || 'new'}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-3 bg-[#080808] border border-white/[0.07] rounded-xl text-[#F2F2F2] focus:border-white/25 focus:outline-none transition-colors"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="proposal-sent">Proposal Sent</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#8E8E8E] mb-2">
                  Source
                </label>
                <select
                  value={formData.source || ''}
                  onChange={(e) => setFormData({...formData, source: e.target.value})}
                  className="w-full px-4 py-3 bg-[#080808] border border-white/[0.07] rounded-xl text-[#F2F2F2] focus:border-white/25 focus:outline-none transition-colors"
                >
                  <option value="website">Website</option>
                  <option value="referral">Referral</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="cold-outreach">Cold Outreach</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#8E8E8E] mb-2">
                  Budget Range
                </label>
                <select
                  value={formData.budget_range || ''}
                  onChange={(e) => setFormData({...formData, budget_range: e.target.value})}
                  className="w-full px-4 py-3 bg-[#080808] border border-white/[0.07] rounded-xl text-[#F2F2F2] focus:border-white/25 focus:outline-none transition-colors"
                >
                  <option value="">Select...</option>
                  <option value="under-5k">Under €5,000</option>
                  <option value="5k-10k">€5,000 - €10,000</option>
                  <option value="10k-20k">€10,000 - €20,000</option>
                  <option value="20k+">€20,000+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#8E8E8E] mb-2">
                  Project Type
                </label>
                <select
                  value={formData.project_type || ''}
                  onChange={(e) => setFormData({...formData, project_type: e.target.value})}
                  className="w-full px-4 py-3 bg-[#080808] border border-white/[0.07] rounded-xl text-[#F2F2F2] focus:border-white/25 focus:outline-none transition-colors"
                >
                  <option value="">Select...</option>
                  <option value="website">Website</option>
                  <option value="web-app">Web Application</option>
                  <option value="e-commerce">E-commerce</option>
                  <option value="redesign">Redesign</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#8E8E8E] mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 bg-[#080808] border border-white/[0.07] rounded-xl text-[#F2F2F2] focus:border-white/25 focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="flex gap-3 pt-6 border-t border-white/[0.07]">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#F2F2F2] text-[#080808] rounded-full font-medium hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setFormData(lead);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.06] text-[#F2F2F2] rounded-xl font-bold hover:bg-white/[0.1] transition-all"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {/* Lead Information */}
          <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-2xl p-8">
            <h3 className="text-2xl font-medium mb-6 pb-4 border-b border-white/[0.07]">
              Lead Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="bg-[#080808] rounded-xl p-5">
                <div className="text-xs text-[#6E6E6E] uppercase tracking-wider mb-2">Source</div>
                <div className="text-lg font-bold text-[#00FF94]">{lead.source || 'N/A'}</div>
              </div>
              <div className="bg-[#080808] rounded-xl p-5">
                <div className="text-xs text-[#6E6E6E] uppercase tracking-wider mb-2">Budget Range</div>
                <div className="text-lg font-bold text-[#00FF94]">{lead.budget_range || 'N/A'}</div>
              </div>
              <div className="bg-[#080808] rounded-xl p-5">
                <div className="text-xs text-[#6E6E6E] uppercase tracking-wider mb-2">Project Type</div>
                <div className="text-lg font-bold text-[#00FF94]">{lead.project_type || 'N/A'}</div>
              </div>
              <div className="bg-[#080808] rounded-xl p-5">
                <div className="text-xs text-[#6E6E6E] uppercase tracking-wider mb-2">Timeline</div>
                <div className="text-lg font-bold text-[#00FF94]">{lead.timeline || 'N/A'}</div>
              </div>
              <div className="bg-[#080808] rounded-xl p-5">
                <div className="text-xs text-[#6E6E6E] uppercase tracking-wider mb-2">Created</div>
                <div className="text-lg font-bold text-[#00FF94]">
                  {new Date(lead.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Project Description */}
          {lead.description && (
            <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-2xl p-8">
              <h3 className="text-2xl font-medium mb-6 pb-4 border-b border-white/[0.07]">
                Project Description
              </h3>
              <p className="text-[#8E8E8E] leading-relaxed text-lg whitespace-pre-wrap">
                {lead.description}
              </p>
            </div>
          )}

          {/* Service Selections from Questionnaire */}
          {lead.service_selections && (
            <div className="bg-[#0F0F0F] border border-purple-500/30 rounded-2xl p-8">
              <h3 className="text-2xl font-medium mb-6 pb-4 border-b border-white/[0.07] flex items-center gap-3">
                <Sparkles size={24} className="text-purple-400" />
                Odabiri iz upitnika
              </h3>
              <ServiceSelectionsDisplay selections={lead.service_selections} />
            </div>
          )}
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

// Component to display service selections from questionnaire
function ServiceSelectionsDisplay({ selections }) {
  const quoteResult = calculateQuoteFromSelections(selections);

  return (
    <div className="space-y-4">
      {/* One-time items */}
      {quoteResult.lineItems.oneTime.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-[#8E8E8E] uppercase tracking-wider mb-3">Jednokratno</h4>
          <div className="space-y-2">
            {quoteResult.lineItems.oneTime.map((item, index) => (
              <div key={index} className="flex justify-between items-center bg-[#080808] rounded-lg p-3">
                <span className="text-[#C9C9C9]">{item.name}</span>
                <span className="text-[#00FF94] font-bold">{formatCurrency(item.price)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/[0.07]">
            <span className="text-[#F2F2F2] font-semibold">Ukupno jednokratno</span>
            <span className="text-[#00FF94] font-bold text-lg">{formatCurrency(quoteResult.summary?.oneTime?.total || 0)}</span>
          </div>
        </div>
      )}

      {/* Monthly items */}
      {quoteResult.lineItems.monthly.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-[#8E8E8E] uppercase tracking-wider mb-3">Mjesečno</h4>
          <div className="space-y-2">
            {quoteResult.lineItems.monthly.map((item, index) => (
              <div key={index} className="flex justify-between items-center bg-[#080808] rounded-lg p-3">
                <span className="text-[#C9C9C9]">{item.name}</span>
                <span className="text-purple-400 font-bold">{formatCurrency(item.monthlyPrice)}/mj</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/[0.07]">
            <span className="text-[#F2F2F2] font-semibold">Ukupno mjesečno</span>
            <span className="text-purple-400 font-bold text-lg">{formatCurrency(quoteResult.summary?.monthly?.total || 0)}/mj</span>
          </div>
        </div>
      )}

      {/* Bundle discount */}
      {quoteResult.summary?.bundleDiscount?.eligible && (
        <div className="mt-4 bg-[#00FF94]/10 border border-[#00FF94]/20 rounded-lg p-3">
          <div className="flex items-center gap-2 text-[#00FF94] text-sm">
            <Sparkles size={16} />
            <span>Bundle popust aktiviran (-10%)</span>
          </div>
        </div>
      )}
    </div>
  );
}