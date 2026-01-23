// app/(crm-admin)/crm/prospects/[id]/page.jsx
// Prospect Detail Page with Tailwind CSS

'use client';

import { useEffect, useState } from 'react';
import { getAuthenticatedClient } from '@/lib/supabase';
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
  Globe,
  Linkedin,
  Send,
  Hash,
  Clock,
  Copy,
  ExternalLink,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function ProspectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const [prospect, setProspect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const [copied, setCopied] = useState('');

  useEffect(() => {
    loadProspect();
  }, [params.id]);

  const loadProspect = async () => {
    try {
      const supabase = getAuthenticatedClient();
      const { data, error } = await supabase
        .from('prospects')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setProspect(data);
      setFormData(data);
    } catch (error) {
      console.error('Error loading prospect:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const supabase = getAuthenticatedClient();
      const { error } = await supabase
        .from('prospects')
        .update({ ...formData, updated_at: new Date().toISOString() })
        .eq('id', params.id);

      if (error) throw error;

      setProspect({ ...formData, updated_at: new Date().toISOString() });
      setEditing(false);
    } catch (error) {
      console.error('Error updating prospect:', error);
      toast.error('Error updating prospect. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogOutreach = async () => {
    if (!confirm('Log a new outreach attempt? This will increment the counter and update timestamps.')) {
      return;
    }

    try {
      const now = new Date().toISOString();
      const updates = {
        outreach_attempts: (prospect.outreach_attempts || 0) + 1,
        last_contacted: now,
        updated_at: now
      };

      // Set first_contacted if this is the first outreach
      if (!prospect.first_contacted) {
        updates.first_contacted = now;
      }

      // Auto-update status from researched/pending to contacted
      if (prospect.status === 'outreach-pending' || prospect.status === 'researched') {
        updates.status = 'contacted';
      }

      const supabase = getAuthenticatedClient();
      const { error } = await supabase
        .from('prospects')
        .update(updates)
        .eq('id', params.id);

      if (error) throw error;

      // Reload prospect
      loadProspect();
    } catch (error) {
      console.error('Error logging outreach:', error);
      toast.error('Error logging outreach. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this prospect? This action cannot be undone.')) {
      return;
    }

    try {
      const supabase = getAuthenticatedClient();
      const { error } = await supabase
        .from('prospects')
        .delete()
        .eq('id', params.id);

      if (error) throw error;
      router.push('/crm/prospects');
    } catch (error) {
      console.error('Error deleting prospect:', error);
      toast.error('Error deleting prospect. Please try again.');
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-2xl text-[#00FF94]">Loading prospect...</div>
      </div>
    );
  }

  if (!prospect) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Prospect not found</h2>
        <Link href="/crm/prospects" className="text-[#00FF94] hover:underline">
          ← Back to Prospects
        </Link>
      </div>
    );
  }

  const statusColors = {
    researched: 'bg-slate-500',
    'outreach-pending': 'bg-blue-500',
    contacted: 'bg-purple-500',
    responding: 'bg-[#00FF94] text-black',
    qualified: 'bg-green-500',
    unresponsive: 'bg-amber-500',
    disqualified: 'bg-red-500'
  };

  return (
    <div className="max-w-5xl animate-fadeIn">
      {/* Breadcrumb */}
      <Link
        href="/crm/prospects"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00FF94] mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Prospects
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
        <div className="flex-1">
          <h1 className="text-4xl font-black text-white mb-3">{prospect.contact_name}</h1>
          <div className="flex flex-wrap gap-3 text-gray-400">
            {prospect.company && (
              <span className="inline-flex items-center gap-1.5">
                <Building2 size={16} className="text-[#00FF94]" />
                {prospect.company}
              </span>
            )}
            {prospect.primary_email && (
              <span className="inline-flex items-center gap-1.5">
                <Mail size={16} className="text-[#00FF94]" />
                {prospect.primary_email}
              </span>
            )}
            {prospect.linkedin_url && (
              <a
                href={prospect.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-[#00FF94] transition-colors"
              >
                <Linkedin size={16} className="text-[#00FF94]" />
                LinkedIn
              </a>
            )}
            {prospect.website_url && (
              <a
                href={prospect.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-[#00FF94] transition-colors"
              >
                <Globe size={16} className="text-[#00FF94]" />
                Website
              </a>
            )}
          </div>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-bold ${statusColors[prospect.status] || 'bg-gray-600'} text-white`}>
          {prospect.status}
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
            <button
              onClick={handleLogOutreach}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all"
            >
              <Send size={18} />
              Log Outreach
            </button>
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
              Edit Prospect
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Contact Name *
                </label>
                <input
                  type="text"
                  value={formData.contact_name || ''}
                  onChange={(e) => setFormData({...formData, contact_name: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Company *
                </label>
                <input
                  type="text"
                  value={formData.company || ''}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Industry
                </label>
                <input
                  type="text"
                  value={formData.industry || ''}
                  onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Company Size
                </label>
                <select
                  value={formData.company_size || ''}
                  onChange={(e) => setFormData({...formData, company_size: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                >
                  <option value="">Select...</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="500+">500+ employees</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Status
                </label>
                <select
                  value={formData.status || 'researched'}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                >
                  <option value="researched">Researched</option>
                  <option value="outreach-pending">Outreach Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="responding">Responding</option>
                  <option value="qualified">Qualified</option>
                  <option value="unresponsive">Unresponsive</option>
                  <option value="disqualified">Disqualified</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Primary Email *
                </label>
                <input
                  type="email"
                  value={formData.primary_email || ''}
                  onChange={(e) => setFormData({...formData, primary_email: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Secondary Email
                </label>
                <input
                  type="email"
                  value={formData.secondary_email || ''}
                  onChange={(e) => setFormData({...formData, secondary_email: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Tertiary Email
                </label>
                <input
                  type="email"
                  value={formData.tertiary_email || ''}
                  onChange={(e) => setFormData({...formData, tertiary_email: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  value={formData.website_url || ''}
                  onChange={(e) => setFormData({...formData, website_url: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={formData.linkedin_url || ''}
                  onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
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
                  setFormData(prospect);
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
          {/* Contact Information */}
          <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-[#2A2A2A]">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {prospect.title && (
                <div className="bg-[#0a0a0a] rounded-xl p-5">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Title</div>
                  <div className="text-lg font-bold text-[#00FF94]">{prospect.title}</div>
                </div>
              )}
              {prospect.industry && (
                <div className="bg-[#0a0a0a] rounded-xl p-5">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Industry</div>
                  <div className="text-lg font-bold text-[#00FF94]">{prospect.industry}</div>
                </div>
              )}
              {prospect.company_size && (
                <div className="bg-[#0a0a0a] rounded-xl p-5">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Company Size</div>
                  <div className="text-lg font-bold text-[#00FF94]">{prospect.company_size}</div>
                </div>
              )}
            </div>
          </div>

          {/* Email Addresses */}
          <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-[#2A2A2A]">
              Email Addresses
            </h3>
            <div className="space-y-4">
              {prospect.primary_email && (
                <div className="flex items-center justify-between bg-[#0a0a0a] rounded-xl p-5">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Primary Email</div>
                    <div className="text-lg font-bold text-[#00FF94]">{prospect.primary_email}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(prospect.primary_email, 'primary')}
                    className="p-3 bg-[#2A2A2A] rounded-lg hover:bg-[#00FF94] hover:text-black transition-colors"
                  >
                    {copied === 'primary' ? <CheckCircle size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              )}
              {prospect.secondary_email && (
                <div className="flex items-center justify-between bg-[#0a0a0a] rounded-xl p-5">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Secondary Email</div>
                    <div className="text-lg font-bold text-[#00FF94]">{prospect.secondary_email}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(prospect.secondary_email, 'secondary')}
                    className="p-3 bg-[#2A2A2A] rounded-lg hover:bg-[#00FF94] hover:text-black transition-colors"
                  >
                    {copied === 'secondary' ? <CheckCircle size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              )}
              {prospect.tertiary_email && (
                <div className="flex items-center justify-between bg-[#0a0a0a] rounded-xl p-5">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Tertiary Email</div>
                    <div className="text-lg font-bold text-[#00FF94]">{prospect.tertiary_email}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(prospect.tertiary_email, 'tertiary')}
                    className="p-3 bg-[#2A2A2A] rounded-lg hover:bg-[#00FF94] hover:text-black transition-colors"
                  >
                    {copied === 'tertiary' ? <CheckCircle size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Online Presence */}
          {(prospect.website_url || prospect.linkedin_url) && (
            <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-[#2A2A2A]">
                Online Presence
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {prospect.website_url && (
                  <div className="bg-[#0a0a0a] rounded-xl p-5">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Website</div>
                    <a
                      href={prospect.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-lg font-bold text-[#00FF94] hover:underline"
                    >
                      {prospect.website_url.replace(/^https?:\/\//, '')}
                      <ExternalLink size={16} />
                    </a>
                  </div>
                )}
                {prospect.linkedin_url && (
                  <div className="bg-[#0a0a0a] rounded-xl p-5">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">LinkedIn</div>
                    <a
                      href={prospect.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-lg font-bold text-[#00FF94] hover:underline"
                    >
                      View Profile
                      <ExternalLink size={16} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Outreach Tracking */}
          <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-[#2A2A2A]">
              Outreach Tracking
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-[#0a0a0a] rounded-xl p-5">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Total Attempts</div>
                <div className="flex items-center gap-2 text-lg font-bold text-[#00FF94]">
                  <Hash size={20} />
                  {prospect.outreach_attempts || 0}
                </div>
              </div>
              <div className="bg-[#0a0a0a] rounded-xl p-5">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">First Contacted</div>
                <div className="text-lg font-bold text-[#00FF94]">
                  {prospect.first_contacted
                    ? new Date(prospect.first_contacted).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'Not yet contacted'}
                </div>
              </div>
              <div className="bg-[#0a0a0a] rounded-xl p-5">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Last Contacted</div>
                <div className="text-lg font-bold text-[#00FF94]">
                  {prospect.last_contacted
                    ? new Date(prospect.last_contacted).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'Not yet contacted'}
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {prospect.notes && (
            <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-[#2A2A2A]">
                Notes
              </h3>
              <p className="text-gray-400 leading-relaxed text-lg whitespace-pre-wrap">
                {prospect.notes}
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
