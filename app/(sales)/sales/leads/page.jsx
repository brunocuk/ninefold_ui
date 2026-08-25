'use client';

// Sales leads: own leads only, quick add, status change, call logging.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getSalesUser } from '@/lib/salesAuth';
import {
  Panel, SectionLabel, StatusPill, LEAD_STATUSES,
  FG, BODY, MUTED, LINE, MONO, timeAgo, primaryBtn, ghostBtn, inputStyle,
} from '../ui';
import { Plus, Phone, Loader2, X } from 'lucide-react';

const EMPTY_FORM = { name: '', company: '', phone: '', email: '' };

export default function SalesLeadsPage() {
  const [user, setUser] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    const currentUser = await getSalesUser();
    if (!currentUser) return;
    setUser(currentUser);

    const { data } = await supabase
      .from('leads')
      .select('id, name, company, phone, email, status, created_at, last_contacted_at, contact_log')
      .eq('sales_user_id', currentUser.id)
      .order('created_at', { ascending: false });

    setLeads(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    setError('');

    const { data, error: insertError } = await supabase
      .from('leads')
      .insert({
        name: form.name.trim(),
        company: form.company.trim() || null,
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
        status: 'new',
        source: 'sales-outreach',
        project_type: 'website',
        sales_user_id: user.id,
      })
      .select()
      .single();

    setSaving(false);
    if (insertError) {
      setError('Greška pri spremanju. Pokušaj ponovo.');
      return;
    }

    setLeads([data, ...leads]);
    setForm(EMPTY_FORM);
    setShowAdd(false);
  }

  async function handleStatusChange(lead, status) {
    setLeads(leads.map((l) => (l.id === lead.id ? { ...l, status } : l)));
    await supabase.from('leads').update({ status }).eq('id', lead.id);
  }

  async function handleLogCall(lead) {
    const now = new Date().toISOString();
    const entry = { at: now, type: 'call', note: '' };
    const contact_log = [...(lead.contact_log || []), entry];
    const updates = {
      contact_log,
      last_contacted_at: now,
      ...(lead.status === 'new' ? { status: 'contacted' } : {}),
    };

    setLeads(leads.map((l) => (l.id === lead.id ? { ...l, ...updates } : l)));
    await supabase.from('leads').update(updates).eq('id', lead.id);
  }

  if (loading) {
    return <p style={{ color: MUTED }}>Učitavanje...</p>;
  }

  const filtered = leads.filter((l) => {
    if (filter === 'active') return !['won', 'lost'].includes(l.status);
    if (filter === 'all') return true;
    return l.status === filter;
  });

  const filters = [
    { key: 'active', label: 'Aktivni' },
    { key: 'all', label: 'Svi' },
    ...Object.entries(LEAD_STATUSES).map(([key, s]) => ({ key, label: s.label })),
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionLabel>Leadovi</SectionLabel>
          <h1 className="mt-3 text-3xl font-medium" style={{ letterSpacing: '-0.02em' }}>
            Tvoji leadovi
          </h1>
          <p className="mt-1" style={{ color: MUTED }}>
            {leads.length} ukupno · {leads.filter((l) => !['won', 'lost'].includes(l.status)).length} aktivnih
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-6 py-3 text-sm transition-transform hover:scale-[1.02]"
          style={showAdd ? ghostBtn : primaryBtn}
        >
          {showAdd ? <X size={16} /> : <Plus size={16} />}
          {showAdd ? 'Odustani' : 'Novi lead'}
        </button>
      </div>

      {/* Quick add */}
      {showAdd && (
        <Panel className="p-5">
          <form onSubmit={handleAdd} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ime i prezime *"
              required
              className="rounded-xl px-4 py-3 text-sm outline-none focus:border-white/25"
              style={inputStyle}
            />
            <input
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="Tvrtka"
              className="rounded-xl px-4 py-3 text-sm outline-none focus:border-white/25"
              style={inputStyle}
            />
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Telefon"
              className="rounded-xl px-4 py-3 text-sm outline-none focus:border-white/25"
              style={inputStyle}
            />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              className="rounded-xl px-4 py-3 text-sm outline-none focus:border-white/25"
              style={inputStyle}
            />
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 px-6 py-3 text-sm"
              style={primaryBtn}
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              Spremi
            </button>
          </form>
          {error && <p className="mt-3 text-sm" style={{ color: '#F87171' }}>{error}</p>}
        </Panel>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="rounded-full px-4 py-2 text-[13px] transition-colors"
            style={
              filter === f.key
                ? { background: FG, color: '#080808', fontWeight: 500 }
                : { background: 'rgba(255,255,255,0.05)', color: MUTED, border: `1px solid ${LINE}` }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <Panel className="p-8 text-center">
          <p style={{ color: MUTED }}>Nema leadova u ovom filteru.</p>
        </Panel>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filtered.map((lead) => (
            <Panel key={lead.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
              <Link href={`/sales/leads/${lead.id}`} className="min-w-0 flex-1">
                <p className="truncate font-medium transition-colors hover:text-white" style={{ color: FG }}>
                  {lead.name}
                </p>
                <p className="truncate text-sm" style={{ color: MUTED }}>
                  {[lead.company, lead.phone].filter(Boolean).join(' · ') || 'Bez detalja'}
                </p>
                <p className="text-[11px]" style={{ fontFamily: MONO, color: MUTED }}>
                  {lead.last_contacted_at
                    ? `Zvano ${timeAgo(lead.last_contacted_at)} (${(lead.contact_log || []).filter((c) => c.type === 'call').length}x)`
                    : 'Još nije zvano'}
                </p>
              </Link>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => handleLogCall(lead)}
                  title="Zabilježi poziv"
                  className="flex items-center gap-1.5 px-4 py-2 text-[13px] transition-colors hover:bg-white/10"
                  style={ghostBtn}
                >
                  <Phone size={14} />
                  Zvao sam
                </button>
                <select
                  value={lead.status}
                  onChange={(e) => handleStatusChange(lead, e.target.value)}
                  className="rounded-full px-3 py-2 text-[13px] outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${LINE}`, color: BODY }}
                >
                  {Object.entries(LEAD_STATUSES).map(([key, s]) => (
                    <option key={key} value={key} style={{ background: '#0F0F0F' }}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <StatusPill map={LEAD_STATUSES} value={lead.status} />
              </div>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
