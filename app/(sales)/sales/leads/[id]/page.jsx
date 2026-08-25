'use client';

// Sales lead detail: contact info, status, activity log, linked quotes.
// Guarded: only the owning salesperson can view it.

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getSalesUser } from '@/lib/salesAuth';
import { formatEur } from '@/lib/salesPackages';
import {
  Panel, SectionLabel, StatusPill, LEAD_STATUSES, QUOTE_STATUSES,
  FG, BODY, MUTED, LINE, SIGNAL, MONO, formatDate, primaryBtn, ghostBtn, inputStyle,
} from '../../ui';
import { ArrowLeft, Phone, Mail, Building2, FileText, Plus, Loader2, StickyNote } from 'lucide-react';

export default function SalesLeadDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [lead, setLead] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [noteType, setNoteType] = useState('call');
  const [saving, setSaving] = useState(false);

  async function load() {
    const currentUser = await getSalesUser();
    if (!currentUser) return;

    const { data } = await supabase
      .from('leads')
      .select('*')
      .eq('id', params.id)
      .single();

    if (!data || data.sales_user_id !== currentUser.id) {
      router.push('/sales/leads');
      return;
    }

    const { data: quoteRows } = await supabase
      .from('quotes')
      .select('id, reference, status, payment_received, pricing, created_at')
      .eq('lead_id', params.id)
      .eq('sales_user_id', currentUser.id)
      .order('created_at', { ascending: false });

    setLead(data);
    setQuotes(quoteRows || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [params.id]);

  async function handleStatusChange(status) {
    setLead({ ...lead, status });
    await supabase.from('leads').update({ status }).eq('id', lead.id);
  }

  async function handleAddActivity(e) {
    e.preventDefault();
    setSaving(true);

    const now = new Date().toISOString();
    const entry = { at: now, type: noteType, note: note.trim() };
    const contact_log = [...(lead.contact_log || []), entry];
    const updates = {
      contact_log,
      ...(noteType === 'call'
        ? { last_contacted_at: now, ...(lead.status === 'new' ? { status: 'contacted' } : {}) }
        : {}),
    };

    await supabase.from('leads').update(updates).eq('id', lead.id);
    setLead({ ...lead, ...updates });
    setNote('');
    setSaving(false);
  }

  if (loading) {
    return <p style={{ color: MUTED }}>Učitavanje...</p>;
  }

  const log = [...(lead.contact_log || [])].reverse();

  return (
    <div className="flex flex-col gap-6">
      <Link href="/sales/leads" className="flex items-center gap-2 text-sm transition-colors hover:text-white" style={{ color: MUTED }}>
        <ArrowLeft size={15} />
        Natrag na leadove
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionLabel>Lead</SectionLabel>
          <h1 className="mt-3 text-3xl font-medium" style={{ letterSpacing: '-0.02em' }}>
            {lead.name}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm" style={{ color: BODY }}>
            {lead.company && (
              <span className="flex items-center gap-1.5"><Building2 size={14} style={{ color: MUTED }} />{lead.company}</span>
            )}
            {lead.phone && (
              <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 transition-colors hover:text-white">
                <Phone size={14} style={{ color: MUTED }} />{lead.phone}
              </a>
            )}
            {lead.email && (
              <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 transition-colors hover:text-white">
                <Mail size={14} style={{ color: MUTED }} />{lead.email}
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={lead.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="rounded-full px-4 py-2.5 text-[13px] outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${LINE}`, color: BODY }}
          >
            {Object.entries(LEAD_STATUSES).map(([key, s]) => (
              <option key={key} value={key} style={{ background: '#0F0F0F' }}>{s.label}</option>
            ))}
          </select>
          <Link
            href={`/sales/quotes/new?lead=${lead.id}`}
            className="flex items-center gap-2 px-6 py-3 text-sm transition-transform hover:scale-[1.02]"
            style={primaryBtn}
          >
            <FileText size={15} />
            Izradi ponudu
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Activity */}
        <Panel className="p-6">
          <SectionLabel>Aktivnost</SectionLabel>

          <form onSubmit={handleAddActivity} className="mt-4 flex flex-col gap-3">
            <div className="flex gap-2">
              {[
                { key: 'call', label: 'Poziv', icon: Phone },
                { key: 'note', label: 'Bilješka', icon: StickyNote },
              ].map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setNoteType(t.key)}
                  className="flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] transition-colors"
                  style={
                    noteType === t.key
                      ? { background: FG, color: '#080808', fontWeight: 500 }
                      : { background: 'rgba(255,255,255,0.05)', color: MUTED, border: `1px solid ${LINE}` }
                  }
                >
                  <t.icon size={13} />
                  {t.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={noteType === 'call' ? 'Kako je prošao poziv? (opcionalno)' : 'Bilješka...'}
                className="flex-1 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/25"
                style={inputStyle}
              />
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-5 py-3 text-sm"
                style={primaryBtn}
              >
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
                Dodaj
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-col gap-2.5">
            {log.length === 0 ? (
              <p className="text-sm" style={{ color: MUTED }}>Još nema zabilježene aktivnosti.</p>
            ) : (
              log.map((entry, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between gap-3 rounded-xl px-4 py-3"
                  style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${LINE}` }}
                >
                  <div className="flex items-start gap-2.5">
                    {entry.type === 'call'
                      ? <Phone size={14} className="mt-0.5" style={{ color: SIGNAL }} />
                      : <StickyNote size={14} className="mt-0.5" style={{ color: MUTED }} />}
                    <div>
                      <p className="text-sm" style={{ color: FG }}>
                        {entry.type === 'call' ? 'Poziv' : 'Bilješka'}
                      </p>
                      {entry.note && <p className="text-sm" style={{ color: BODY }}>{entry.note}</p>}
                    </div>
                  </div>
                  <span className="shrink-0 text-[11px]" style={{ fontFamily: MONO, color: MUTED }}>
                    {new Date(entry.at).toLocaleString('hr-HR', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </Panel>

        {/* Quotes + meta */}
        <div className="flex flex-col gap-6">
          <Panel className="p-6">
            <SectionLabel>Ponude</SectionLabel>
            <div className="mt-4 flex flex-col gap-2.5">
              {quotes.length === 0 ? (
                <p className="text-sm" style={{ color: MUTED }}>Još nema ponuda za ovaj lead.</p>
              ) : (
                quotes.map((q) => (
                  <Link key={q.id} href={`/sales/quotes/${q.id}`}>
                    <div
                      className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-white/[0.07]"
                      style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${LINE}` }}
                    >
                      <div>
                        <p className="text-sm font-medium" style={{ color: FG }}>{q.reference}</p>
                        <p className="text-[12px]" style={{ color: MUTED }}>
                          {formatEur(q.pricing?.total)} · {formatDate(q.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {q.payment_received && (
                          <span className="text-[11px] font-medium" style={{ color: SIGNAL }}>Plaćeno</span>
                        )}
                        <StatusPill map={QUOTE_STATUSES} value={q.status} />
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </Panel>

          <Panel className="p-6">
            <SectionLabel>Detalji</SectionLabel>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.12em', color: MUTED }}>Status</p>
                <div className="mt-1.5"><StatusPill map={LEAD_STATUSES} value={lead.status} /></div>
              </div>
              <div>
                <p className="text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.12em', color: MUTED }}>Dodan</p>
                <p className="mt-1.5" style={{ color: BODY }}>{formatDate(lead.created_at)}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.12em', color: MUTED }}>Zadnji kontakt</p>
                <p className="mt-1.5" style={{ color: BODY }}>{lead.last_contacted_at ? formatDate(lead.last_contacted_at) : 'Nikad'}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.12em', color: MUTED }}>Pozivi</p>
                <p className="mt-1.5" style={{ color: BODY }}>{(lead.contact_log || []).filter((c) => c.type === 'call').length}</p>
              </div>
            </div>
            {lead.description && (
              <p className="mt-4 text-sm" style={{ color: BODY }}>{lead.description}</p>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
