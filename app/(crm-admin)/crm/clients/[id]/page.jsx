// app/(crm-admin)/crm/clients/[id]/page.jsx
// Client Detail Page with Tailwind CSS

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
  MapPin,
  Globe,
  Briefcase,
  DollarSign,
  FolderKanban,
  FileText,
  Plus,
  ExternalLink,
  Calendar,
  Users,
  Key,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import { createPortalUser, getPortalUsersByClient, deletePortalUser, generatePassword, updatePortalUserPassword } from '@/lib/portalAuth';

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const [client, setClient] = useState(null);
  const [projects, setProjects] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [portalUsers, setPortalUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const [showAddPortalUser, setShowAddPortalUser] = useState(false);
  const [portalUserForm, setPortalUserForm] = useState({ name: '', email: '', role: 'viewer' });
  const [creatingPortalUser, setCreatingPortalUser] = useState(false);
  const [newUserPassword, setNewUserPassword] = useState('');
  const [copiedPassword, setCopiedPassword] = useState(false);

  useEffect(() => {
    loadClientData();
  }, [params.id]);

  const loadClientData = async () => {
    try {
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', params.id)
        .single();

      if (clientError) throw clientError;
      setClient(clientData);
      setFormData(clientData);

      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', params.id)
        .order('created_at', { ascending: false });
      setProjects(projectsData || []);

      const { data: quotesData } = await supabase
        .from('quotes')
        .select('*')
        .eq('client_id', params.id)
        .order('created_at', { ascending: false });
      setQuotes(quotesData || []);

      // Load portal users
      const { data: portalUsersData } = await getPortalUsersByClient(params.id);
      setPortalUsers(portalUsersData || []);

    } catch (error) {
      console.error('Error loading client:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePortalUser = async (e) => {
    e.preventDefault();
    setCreatingPortalUser(true);

    const password = generatePassword();

    const { data, error } = await createPortalUser({
      email: portalUserForm.email,
      password,
      name: portalUserForm.name,
      client_id: params.id,
      role: portalUserForm.role,
    });

    if (error) {
      toast.error(error.message);
    } else {
      setNewUserPassword(password);
      setPortalUsers([...portalUsers, data]);
      toast.success('Portal korisnik kreiran!');
    }

    setCreatingPortalUser(false);
  };

  const handleDeletePortalUser = async (userId) => {
    if (!confirm('Jeste li sigurni da želite obrisati ovog korisnika?')) return;

    const { error } = await deletePortalUser(userId);
    if (error) {
      toast.error(error.message);
    } else {
      setPortalUsers(portalUsers.filter((u) => u.id !== userId));
      toast.success('Korisnik obrisan');
    }
  };

  const handleResetPassword = async (userId) => {
    const newPassword = generatePassword();
    const { error } = await updatePortalUserPassword(userId, newPassword);

    if (error) {
      toast.error(error.message);
    } else {
      setNewUserPassword(newPassword);
      toast.success('Lozinka resetirana!');
    }
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(newUserPassword);
    setCopiedPassword(true);
    setTimeout(() => setCopiedPassword(false), 2000);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('clients')
        .update(formData)
        .eq('id', params.id);

      if (error) throw error;
      setClient(formData);
      setEditing(false);
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Error updating client. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', params.id);

      if (error) throw error;
      router.push('/crm/clients');
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Error deleting client. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-2xl text-[#00FF94]">Loading client...</div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Client not found</h2>
        <Link href="/crm/clients" className="text-[#00FF94] hover:underline">
          ← Back to Clients
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl animate-fadeIn">
      {/* Breadcrumb */}
      <Link 
        href="/crm/clients" 
        className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00FF94] mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Clients
      </Link>

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
        <div className="flex-1">
          <h1 className="text-4xl font-black text-white mb-3">{client.name}</h1>
          {client.company && (
            <div className="flex items-center gap-2 text-[#00FF94] font-bold text-lg mb-4">
              <Building2 size={20} />
              {client.company}
            </div>
          )}
          <div className="flex flex-wrap gap-3 text-gray-400">
            {client.email && (
              <span className="inline-flex items-center gap-1.5">
                <Mail size={16} className="text-[#00FF94]" />
                {client.email}
              </span>
            )}
            {client.phone && (
              <span className="inline-flex items-center gap-1.5">
                <Phone size={16} className="text-[#00FF94]" />
                {client.phone}
              </span>
            )}
            {client.city && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={16} className="text-[#00FF94]" />
                {client.city}
              </span>
            )}
          </div>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-bold ${
          client.status === 'active' ? 'bg-[#00FF94] text-black' : 'bg-slate-500 text-white'
        }`}>
          {client.status}
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
            <Link
              href={`/quote-maker?client=${client.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2A2A2A] text-white rounded-xl font-bold hover:bg-[#3A3A3A] transition-all"
            >
              <FileText size={18} />
              Create Quote
            </Link>
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

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6 text-center">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Lifetime Value</div>
          <div className="text-3xl font-black text-[#00FF94]">
            €{(client.lifetime_value || 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6 text-center">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Total Projects</div>
          <div className="text-3xl font-black text-[#00FF94]">{projects.length}</div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6 text-center">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Quotes</div>
          <div className="text-3xl font-black text-[#00FF94]">{quotes.length}</div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6 text-center">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Client Since</div>
          <div className="text-lg font-black text-[#00FF94]">
            {new Date(client.created_at).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric'
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      {editing ? (
        <form onSubmit={handleUpdate}>
          <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-[#2A2A2A]">
              Edit Client
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Company</label>
                <input
                  type="text"
                  value={formData.company || ''}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Website</label>
                <input
                  type="url"
                  value={formData.website || ''}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Industry</label>
                <input
                  type="text"
                  value={formData.industry || ''}
                  onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">City</label>
                <input
                  type="text"
                  value={formData.city || ''}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Status</label>
                <select
                  value={formData.status || 'active'}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-400 mb-2">Notes</label>
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
                  setFormData(client);
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
          {/* Client Info */}
          <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-[#2A2A2A]">
              Client Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {client.website && (
                <div className="bg-[#0a0a0a] rounded-xl p-5">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Globe size={12} />
                    Website
                  </div>
                  <a 
                    href={client.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-[#00FF94] hover:underline flex items-center gap-1"
                  >
                    {client.website.replace(/^https?:\/\//, '')}
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}
              {client.industry && (
                <div className="bg-[#0a0a0a] rounded-xl p-5">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Briefcase size={12} />
                    Industry
                  </div>
                  <div className="text-sm font-bold text-[#00FF94]">{client.industry}</div>
                </div>
              )}
              {client.company_size && (
                <div className="bg-[#0a0a0a] rounded-xl p-5">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Company Size</div>
                  <div className="text-sm font-bold text-[#00FF94]">{client.company_size}</div>
                </div>
              )}
              {client.address && (
                <div className="bg-[#0a0a0a] rounded-xl p-5">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MapPin size={12} />
                    Address
                  </div>
                  <div className="text-sm font-bold text-[#00FF94]">{client.address}</div>
                </div>
              )}
            </div>
          </div>

          {/* Projects */}
          <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-8">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#2A2A2A]">
              <h3 className="text-2xl font-bold">Projects ({projects.length})</h3>
              <Link
                href="/crm/projects/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#00FF94] text-black rounded-lg text-sm font-bold hover:shadow-lg hover:shadow-[#00FF94]/30 transition-all"
              >
                <Plus size={16} />
                New
              </Link>
            </div>
            {projects.length === 0 ? (
              <p className="text-center text-gray-500 py-12 italic">No projects yet</p>
            ) : (
              <div className="space-y-3">
                {projects.map(project => (
                  <Link
                    key={project.id}
                    href={`/crm/projects/${project.id}`}
                    className="block bg-[#0a0a0a] border border-[#222] rounded-xl p-5 hover:border-[#00FF94] transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-semibold text-white mb-2">{project.name}</div>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <span className="inline-flex items-center gap-1">
                            <DollarSign size={14} className="text-[#00FF94]" />
                            €{project.total_value.toLocaleString()}
                          </span>
                          <span>• {project.status}</span>
                        </div>
                      </div>
                      <div className="text-[#00FF94] font-bold">{project.progress}%</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quotes */}
          <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-[#2A2A2A]">
              Quotes ({quotes.length})
            </h3>
            {quotes.length === 0 ? (
              <p className="text-center text-gray-500 py-12 italic">No quotes yet</p>
            ) : (
              <div className="space-y-3">
                {quotes.map(quote => (
                  <Link
                    key={quote.id}
                    href={`/ponuda/${quote.id}`}
                    target="_blank"
                    className="block bg-[#0a0a0a] border border-[#222] rounded-xl p-5 hover:border-[#00FF94] transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-semibold text-white mb-2">Quote {quote.id}</div>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <span className="inline-flex items-center gap-1">
                            <DollarSign size={14} className="text-[#00FF94]" />
                            €{quote.pricing.total.toLocaleString()}
                          </span>
                          <span>• {quote.status}</span>
                        </div>
                      </div>
                      <div className="text-gray-500 text-xs flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(quote.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          {client.notes && (
            <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-[#2A2A2A]">Notes</h3>
              <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">
                {client.notes}
              </p>
            </div>
          )}

          {/* Portal Access */}
          <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-8">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#2A2A2A]">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <Users size={24} className="text-[#00FF94]" />
                Portal Access
              </h3>
              <button
                onClick={() => {
                  setShowAddPortalUser(true);
                  setPortalUserForm({ name: '', email: client.email || '', role: 'viewer' });
                  setNewUserPassword('');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#00FF94] text-black rounded-lg text-sm font-bold hover:shadow-lg hover:shadow-[#00FF94]/30 transition-all"
              >
                <Plus size={16} />
                Add User
              </button>
            </div>

            {/* New User Password Display */}
            {newUserPassword && (
              <div className="mb-6 p-4 bg-[#00FF94]/10 border border-[#00FF94]/30 rounded-xl">
                <div className="text-sm text-[#00FF94] font-semibold mb-2">
                  Nova lozinka (spremite je sada - neće se više prikazati):
                </div>
                <div className="flex items-center gap-3">
                  <code className="flex-1 px-4 py-2 bg-[#0a0a0a] rounded-lg text-white font-mono">
                    {newUserPassword}
                  </code>
                  <button
                    onClick={copyPassword}
                    className="px-4 py-2 bg-[#2A2A2A] text-white rounded-lg hover:bg-[#3A3A3A] transition-colors flex items-center gap-2"
                  >
                    {copiedPassword ? <Check size={16} /> : <Copy size={16} />}
                    {copiedPassword ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}

            {/* Add User Form */}
            {showAddPortalUser && (
              <form onSubmit={handleCreatePortalUser} className="mb-6 p-4 bg-[#0a0a0a] rounded-xl border border-[#2A2A2A]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">Ime *</label>
                    <input
                      type="text"
                      value={portalUserForm.name}
                      onChange={(e) => setPortalUserForm({ ...portalUserForm, name: e.target.value })}
                      required
                      placeholder="Ivan Horvat"
                      className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#2A2A2A] rounded-lg text-white focus:border-[#00FF94] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">Email *</label>
                    <input
                      type="email"
                      value={portalUserForm.email}
                      onChange={(e) => setPortalUserForm({ ...portalUserForm, email: e.target.value })}
                      required
                      placeholder="ivan@firma.hr"
                      className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#2A2A2A] rounded-lg text-white focus:border-[#00FF94] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">Uloga</label>
                    <select
                      value={portalUserForm.role}
                      onChange={(e) => setPortalUserForm({ ...portalUserForm, role: e.target.value })}
                      className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#2A2A2A] rounded-lg text-white focus:border-[#00FF94] focus:outline-none"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={creatingPortalUser}
                    className="px-4 py-2 bg-[#00FF94] text-black rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {creatingPortalUser ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                    {creatingPortalUser ? 'Creating...' : 'Create User'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddPortalUser(false)}
                    className="px-4 py-2 bg-[#2A2A2A] text-white rounded-lg hover:bg-[#3A3A3A] transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Users List */}
            {portalUsers.length === 0 ? (
              <p className="text-center text-gray-500 py-12 italic">
                No portal users yet. Add a user to give them access to the client portal.
              </p>
            ) : (
              <div className="space-y-3">
                {portalUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-[#222] rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#00FF94] flex items-center justify-center text-black font-bold">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{user.name}</div>
                        <div className="text-sm text-gray-400 flex items-center gap-2">
                          <Mail size={12} />
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        user.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'
                      }`}>
                        {user.role}
                      </span>
                      {user.last_login_at && (
                        <span className="text-xs text-gray-500">
                          Last login: {new Date(user.last_login_at).toLocaleDateString()}
                        </span>
                      )}
                      <button
                        onClick={() => handleResetPassword(user.id)}
                        className="p-2 text-gray-400 hover:text-[#00FF94] hover:bg-[#00FF94]/10 rounded-lg transition-colors"
                        title="Reset Password"
                      >
                        <Key size={16} />
                      </button>
                      <button
                        onClick={() => handleDeletePortalUser(user.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Portal Link */}
            <div className="mt-6 pt-6 border-t border-[#2A2A2A]">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Client Portal URL:
                </div>
                <a
                  href="/portal/login"
                  target="_blank"
                  className="text-[#00FF94] hover:underline flex items-center gap-1 text-sm"
                >
                  {typeof window !== 'undefined' ? window.location.origin : ''}/portal/login
                  <ExternalLink size={14} />
                </a>
              </div>
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