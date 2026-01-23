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
  User
} from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});

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
        <h2 className="text-2xl font-bold mb-4">Lead not found</h2>
        <Link href="/crm/leads" className="text-[#00FF94] hover:underline">
          ← Back to Leads
        </Link>
      </div>
    );
  }

  const statusColors = {
    new: 'bg-blue-500',
    contacted: 'bg-purple-500',
    qualified: 'bg-[#00FF94] text-black',
    'proposal-sent': 'bg-amber-500',
    won: 'bg-green-500',
    lost: 'bg-red-500'
  };

  return (
    <div className="max-w-5xl animate-fadeIn">
      {/* Breadcrumb */}
      <Link 
        href="/crm/leads" 
        className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00FF94] mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Leads
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
        <div className="flex-1">
          <h1 className="text-4xl font-black text-white mb-3">{lead.name}</h1>
          <div className="flex flex-wrap gap-3 text-gray-400">
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
        <span className={`px-4 py-2 rounded-full text-sm font-bold ${statusColors[lead.status] || 'bg-gray-600'} text-white`}>
          {lead.status}
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        {!editing && (
          <>
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00FF94] text-black rounded-xl font-bold hover:shadow-lg hover:shadow-[#00FF94]/30 hover:-translate-y-0.5 transition-all"
            >
              <Edit size={18} />
              Edit
            </button>
            {lead.status !== 'won' && lead.status !== 'lost' && (
              <button
                onClick={handleConvertToClient}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2A2A2A] text-white rounded-xl font-bold hover:bg-[#3A3A3A] transition-all"
              >
                <Building2 size={18} />
                Convert to Client
              </button>
            )}
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all"
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
          <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-[#2A2A2A]">
              Edit Lead
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company || ''}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Status
                </label>
                <select
                  value={formData.status || 'new'}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
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
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Source
                </label>
                <select
                  value={formData.source || ''}
                  onChange={(e) => setFormData({...formData, source: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                >
                  <option value="website">Website</option>
                  <option value="referral">Referral</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="cold-outreach">Cold Outreach</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Budget Range
                </label>
                <select
                  value={formData.budget_range || ''}
                  onChange={(e) => setFormData({...formData, budget_range: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                >
                  <option value="">Select...</option>
                  <option value="under-5k">Under €5,000</option>
                  <option value="5k-10k">€5,000 - €10,000</option>
                  <option value="10k-20k">€10,000 - €20,000</option>
                  <option value="20k+">€20,000+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Project Type
                </label>
                <select
                  value={formData.project_type || ''}
                  onChange={(e) => setFormData({...formData, project_type: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
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
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="flex gap-3 pt-6 border-t border-[#2A2A2A]">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#00FF94] text-black rounded-xl font-bold hover:shadow-lg hover:shadow-[#00FF94]/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#2A2A2A] text-white rounded-xl font-bold hover:bg-[#3A3A3A] transition-all"
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
          <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-[#2A2A2A]">
              Lead Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="bg-[#0a0a0a] rounded-xl p-5">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Source</div>
                <div className="text-lg font-bold text-[#00FF94]">{lead.source || 'N/A'}</div>
              </div>
              <div className="bg-[#0a0a0a] rounded-xl p-5">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Budget Range</div>
                <div className="text-lg font-bold text-[#00FF94]">{lead.budget_range || 'N/A'}</div>
              </div>
              <div className="bg-[#0a0a0a] rounded-xl p-5">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Project Type</div>
                <div className="text-lg font-bold text-[#00FF94]">{lead.project_type || 'N/A'}</div>
              </div>
              <div className="bg-[#0a0a0a] rounded-xl p-5">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Timeline</div>
                <div className="text-lg font-bold text-[#00FF94]">{lead.timeline || 'N/A'}</div>
              </div>
              <div className="bg-[#0a0a0a] rounded-xl p-5">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Created</div>
                <div className="text-lg font-bold text-[#00FF94]">
                  {new Date(lead.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Project Description */}
          {lead.description && (
            <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-[#2A2A2A]">
                Project Description
              </h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                {lead.description}
              </p>
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