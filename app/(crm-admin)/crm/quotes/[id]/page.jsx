// app/(crm-admin)/crm/quotes/[id]/page.jsx
// Quote Detail Page with Edit functionality

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
  X,
  Edit3,
  Save,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  FileText
} from 'lucide-react';

export default function QuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quote, setQuote] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    title: '',
    client_name: '',
    client_email: '',
    project_overview: '',
    duration: '',
    items: [],
    discountRate: 0,
    depositRate: 0.5,
    timeline: []
  });

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

      // Initialize edit form
      setEditForm({
        title: data.title || '',
        client_name: data.client_name || '',
        client_email: data.client_email || '',
        project_overview: data.project_overview || '',
        duration: data.duration || '',
        items: data.pricing?.items || [],
        discountRate: (data.pricing?.discountRate || 0) * 100,
        depositRate: (data.pricing?.depositRate || 0.5) * 100,
        timeline: data.timeline || []
      });

      if (data.clients) {
        setEmailForm({
          email: data.clients.email || data.client_email || '',
          name: data.clients.company || data.clients.name || data.client_name || '',
        });
      } else {
        setEmailForm({
          email: data.client_email || '',
          name: data.client_name || '',
        });
      }
    } catch (error) {
      console.error('Error loading quote:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      const subtotal = editForm.items.reduce((sum, item) => sum + (item.price || 0), 0);
      const discountAmount = subtotal * (editForm.discountRate / 100);
      const total = subtotal - discountAmount;

      const updateData = {
        title: editForm.title || null,
        client_name: editForm.client_name,
        client_email: editForm.client_email,
        project_overview: editForm.project_overview,
        duration: editForm.duration,
        timeline: editForm.timeline.filter(t => t.phase.trim() !== ''),
        pricing: {
          items: editForm.items.filter(item => item.name.trim() !== '' && item.price > 0),
          subtotal: subtotal,
          discountRate: editForm.discountRate / 100,
          discountAmount: discountAmount,
          total: total,
          depositRate: editForm.depositRate / 100
        }
      };

      const { error } = await supabase
        .from('quotes')
        .update(updateData)
        .eq('id', params.id);

      if (error) throw error;

      await loadQuote();
      setIsEditing(false);
      alert('Quote updated successfully!');
    } catch (error) {
      console.error('Error saving quote:', error);
      alert('Error saving quote: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const addItem = () => {
    setEditForm({
      ...editForm,
      items: [...editForm.items, { name: '', description: '', price: 0 }]
    });
  };

  const removeItem = (index) => {
    if (editForm.items.length > 1) {
      setEditForm({
        ...editForm,
        items: editForm.items.filter((_, i) => i !== index)
      });
    }
  };

  const updateItem = (index, field, value) => {
    const newItems = [...editForm.items];
    newItems[index] = { ...newItems[index], [field]: field === 'price' ? Number(value) : value };
    setEditForm({ ...editForm, items: newItems });
  };

  const addTimelinePhase = () => {
    setEditForm({
      ...editForm,
      timeline: [...editForm.timeline, { week: '', phase: '', duration: '' }]
    });
  };

  const removeTimelinePhase = (index) => {
    if (editForm.timeline.length > 1) {
      setEditForm({
        ...editForm,
        timeline: editForm.timeline.filter((_, i) => i !== index)
      });
    }
  };

  const updateTimelinePhase = (index, field, value) => {
    const newTimeline = [...editForm.timeline];
    newTimeline[index] = { ...newTimeline[index], [field]: value };
    setEditForm({ ...editForm, timeline: newTimeline });
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

      alert('Quote sent successfully!');
      setShowEmailModal(false);
      await loadQuote();
    } catch (error) {
      console.error('Error sending email:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setSending(false);
    }
  };

  const updateStatus = async (newStatus) => {
    if (!confirm(`Are you sure you want to mark this quote as "${newStatus}"?`)) {
      return;
    }

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ status: newStatus })
        .eq('id', params.id);

      if (error) throw error;
      setQuote({ ...quote, status: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    } finally {
      setUpdating(false);
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

  const calculateEditTotals = () => {
    const subtotal = editForm.items.reduce((sum, item) => sum + (item.price || 0), 0);
    const discountAmount = subtotal * (editForm.discountRate / 100);
    const total = subtotal - discountAmount;
    return { subtotal, discountAmount, total };
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
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2A2A2A] text-white rounded-xl font-bold hover:bg-[#3A3A3A] transition-all"
              >
                <Edit3 size={18} />
                Edit
              </button>
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
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2A2A2A] text-white rounded-xl font-bold hover:bg-[#3A3A3A] transition-all"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00FF94] text-black rounded-xl font-bold hover:shadow-lg hover:shadow-[#00FF94]/30 transition-all disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        /* Edit Mode */
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6">
            <h3 className="text-xl font-bold text-[#00FF94] mb-4">Osnovne informacije</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Naziv ponude</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  className="w-full bg-[#0F0F0F] text-white p-3 rounded-lg border border-[#2A2A2A] focus:border-[#00FF94] outline-none"
                  placeholder="npr. Web stranica + Mobile app"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Trajanje</label>
                <input
                  type="text"
                  value={editForm.duration}
                  onChange={(e) => setEditForm({...editForm, duration: e.target.value})}
                  className="w-full bg-[#0F0F0F] text-white p-3 rounded-lg border border-[#2A2A2A] focus:border-[#00FF94] outline-none"
                  placeholder="8 tjedana"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Ime klijenta *</label>
                <input
                  type="text"
                  value={editForm.client_name}
                  onChange={(e) => setEditForm({...editForm, client_name: e.target.value})}
                  className="w-full bg-[#0F0F0F] text-white p-3 rounded-lg border border-[#2A2A2A] focus:border-[#00FF94] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email klijenta *</label>
                <input
                  type="email"
                  value={editForm.client_email}
                  onChange={(e) => setEditForm({...editForm, client_email: e.target.value})}
                  className="w-full bg-[#0F0F0F] text-white p-3 rounded-lg border border-[#2A2A2A] focus:border-[#00FF94] outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-2">Pregled projekta</label>
                <textarea
                  value={editForm.project_overview}
                  onChange={(e) => setEditForm({...editForm, project_overview: e.target.value})}
                  className="w-full bg-[#0F0F0F] text-white p-3 rounded-lg border border-[#2A2A2A] focus:border-[#00FF94] outline-none h-32"
                />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#00FF94]">Stavke / Usluge</h3>
              <button
                onClick={addItem}
                className="flex items-center gap-2 bg-[#00FF94] text-black px-3 py-2 rounded text-sm font-semibold hover:bg-[#00DD7F] transition-colors"
              >
                <Plus size={16} />
                Dodaj stavku
              </button>
            </div>
            <div className="space-y-3">
              {editForm.items.map((item, index) => (
                <div key={index} className="bg-[#0F0F0F] p-4 rounded-lg border border-[#2A2A2A]">
                  <div className="flex gap-3 items-start mb-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(index, 'name', e.target.value)}
                      className="flex-1 bg-[#1A1A1A] text-white p-2 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none"
                      placeholder="Naziv usluge"
                    />
                    <input
                      type="number"
                      value={item.price || ''}
                      onChange={(e) => updateItem(index, 'price', e.target.value)}
                      className="w-28 bg-[#1A1A1A] text-white p-2 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none"
                      placeholder="Cijena"
                    />
                    <button
                      onClick={() => removeItem(index)}
                      disabled={editForm.items.length === 1}
                      className="p-2 text-gray-500 hover:text-red-500 disabled:opacity-30"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <textarea
                    value={item.description || ''}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    className="w-full bg-[#1A1A1A] text-white p-2 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none text-sm"
                    placeholder="Opis (opcionalno)"
                    rows={2}
                  />
                </div>
              ))}
            </div>

            {/* Discount & Deposit */}
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#2A2A2A]">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Popust (%)</label>
                <input
                  type="number"
                  value={editForm.discountRate}
                  onChange={(e) => setEditForm({...editForm, discountRate: Number(e.target.value)})}
                  className="w-full bg-[#0F0F0F] text-white p-3 rounded-lg border border-[#2A2A2A] focus:border-[#00FF94] outline-none"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Akontacija (%)</label>
                <input
                  type="number"
                  value={editForm.depositRate}
                  onChange={(e) => setEditForm({...editForm, depositRate: Math.min(100, Math.max(0, Number(e.target.value)))})}
                  className="w-full bg-[#0F0F0F] text-white p-3 rounded-lg border border-[#2A2A2A] focus:border-[#00FF94] outline-none"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            {/* Live Total Preview */}
            <div className="mt-4 pt-4 border-t border-[#2A2A2A] text-sm">
              <div className="flex justify-between text-gray-400 mb-1">
                <span>Međuzbroj:</span>
                <span>€{calculateEditTotals().subtotal.toLocaleString()}</span>
              </div>
              {editForm.discountRate > 0 && (
                <div className="flex justify-between text-[#00FF94] mb-1">
                  <span>Popust ({editForm.discountRate}%):</span>
                  <span>-€{calculateEditTotals().discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-white font-bold text-lg">
                <span>Ukupno:</span>
                <span className="text-[#00FF94]">€{calculateEditTotals().total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#00FF94]">Vremenski plan</h3>
              <button
                onClick={addTimelinePhase}
                className="flex items-center gap-2 bg-[#00FF94] text-black px-3 py-2 rounded text-sm font-semibold hover:bg-[#00DD7F] transition-colors"
              >
                <Plus size={16} />
                Dodaj fazu
              </button>
            </div>
            <div className="space-y-3">
              {editForm.timeline.map((phase, index) => (
                <div key={index} className="flex gap-3 items-center bg-[#0F0F0F] p-3 rounded-lg border border-[#2A2A2A]">
                  <div className="w-8 h-8 bg-[#00FF94] rounded flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    value={phase.week}
                    onChange={(e) => updateTimelinePhase(index, 'week', e.target.value)}
                    className="w-28 bg-[#1A1A1A] text-white p-2 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none text-sm"
                    placeholder="Tjedan"
                  />
                  <input
                    type="text"
                    value={phase.phase}
                    onChange={(e) => updateTimelinePhase(index, 'phase', e.target.value)}
                    className="flex-1 bg-[#1A1A1A] text-white p-2 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none text-sm"
                    placeholder="Naziv faze"
                  />
                  <input
                    type="text"
                    value={phase.duration}
                    onChange={(e) => updateTimelinePhase(index, 'duration', e.target.value)}
                    className="w-28 bg-[#1A1A1A] text-white p-2 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none text-sm"
                    placeholder="Trajanje"
                  />
                  <button
                    onClick={() => removeTimelinePhase(index)}
                    disabled={editForm.timeline.length === 1}
                    className="p-2 text-gray-500 hover:text-red-500 disabled:opacity-30"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* View Mode */
        <>
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

          {/* Status Actions */}
          <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-bold mb-4">Promijeni status</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => updateStatus('draft')}
                disabled={updating || quote.status === 'draft'}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  quote.status === 'draft' ? 'bg-gray-600 text-white' : 'bg-[#2A2A2A] text-gray-400 hover:bg-gray-600 hover:text-white'
                }`}
              >
                <FileText size={16} />
                Draft
              </button>
              <button
                onClick={() => updateStatus('sent')}
                disabled={updating || quote.status === 'sent'}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  quote.status === 'sent' ? 'bg-blue-500 text-white' : 'bg-[#2A2A2A] text-gray-400 hover:bg-blue-500 hover:text-white'
                }`}
              >
                <Send size={16} />
                Sent
              </button>
              <button
                onClick={() => updateStatus('viewed')}
                disabled={updating || quote.status === 'viewed'}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  quote.status === 'viewed' ? 'bg-purple-500 text-white' : 'bg-[#2A2A2A] text-gray-400 hover:bg-purple-500 hover:text-white'
                }`}
              >
                <Eye size={16} />
                Viewed
              </button>
              <button
                onClick={() => updateStatus('accepted')}
                disabled={updating || quote.status === 'accepted'}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  quote.status === 'accepted' ? 'bg-[#00FF94] text-black' : 'bg-[#2A2A2A] text-gray-400 hover:bg-[#00FF94] hover:text-black'
                }`}
              >
                <CheckCircle size={16} />
                Accepted
              </button>
              <button
                onClick={() => updateStatus('rejected')}
                disabled={updating || quote.status === 'rejected'}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  quote.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-[#2A2A2A] text-gray-400 hover:bg-red-500 hover:text-white'
                }`}
              >
                <XCircle size={16} />
                Rejected
              </button>
            </div>
          </div>

          {/* Project Overview */}
          {quote.project_overview && (
            <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold mb-4">Pregled projekta</h3>
              <p className="text-gray-400 leading-relaxed">{quote.project_overview}</p>
            </div>
          )}

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

          {/* Timeline */}
          {quote.timeline && quote.timeline.length > 0 && (
            <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold mb-4">Vremenski plan</h3>
              <div className="space-y-3">
                {quote.timeline.map((phase, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-[#0F0F0F] rounded-lg">
                    <div className="w-8 h-8 bg-[#00FF94] rounded flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <span className="text-[#00FF94] font-semibold mr-3">{phase.week}</span>
                      <span className="text-gray-300">{phase.phase}</span>
                    </div>
                    <span className="text-gray-500 text-sm">{phase.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

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
