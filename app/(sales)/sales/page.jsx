'use client';

// Sales dashboard: pipeline stats, unpaid commission, recent leads.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getSalesUser } from '@/lib/salesAuth';
import { formatEur } from '@/lib/salesPackages';
import {
  Panel, SectionLabel, StatusPill, LEAD_STATUSES, QUOTE_STATUSES,
  FG, MUTED, SIGNAL, MONO, timeAgo, primaryBtn,
} from './ui';
import { Plus, ArrowRight } from 'lucide-react';

export default function SalesDashboard() {
  const [user, setUser] = useState(null);
  const [leads, setLeads] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [payable, setPayable] = useState(0);
  const [loading, setLoading] = useState(true);

  async function load() {
    const currentUser = await getSalesUser();
    if (!currentUser) return;
    setUser(currentUser);

    const [leadsRes, quotesRes, commRes] = await Promise.all([
      supabase
        .from('leads')
        .select('id, name, company, status, created_at, last_contacted_at')
        .eq('sales_user_id', currentUser.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('quotes')
        .select('id, status, payment_received, pricing')
        .eq('sales_user_id', currentUser.id),
      supabase
        .from('sales_commissions')
        .select('amount, status')
        .eq('sales_user_id', currentUser.id),
    ]);

    setLeads(leadsRes.data || []);
    setQuotes(quotesRes.data || []);
    setPayable(
      (commRes.data || [])
        .filter((c) => c.status === 'payable')
        .reduce((sum, c) => sum + Number(c.amount), 0)
    );
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return <p style={{ color: MUTED }}>Učitavanje...</p>;
  }

  const activeLeads = leads.filter((l) => !['won', 'lost'].includes(l.status)).length;
  const sentQuotes = quotes.filter((q) => q.status !== 'draft').length;
  const paidQuotes = quotes.filter((q) => q.payment_received).length;
  const conversion = sentQuotes > 0 ? Math.round((paidQuotes / sentQuotes) * 100) : 0;

  const stats = [
    { label: 'Aktivni leadovi', value: activeLeads },
    { label: 'Poslane ponude', value: sentQuotes },
    { label: 'Plaćene ponude', value: paidQuotes },
    { label: 'Konverzija', value: `${conversion}%` },
  ];

  const firstName = user?.name?.split(' ')[0] || '';

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionLabel>Pregled</SectionLabel>
          <h1 className="mt-3 text-3xl font-medium" style={{ letterSpacing: '-0.02em' }}>
            Bok, {firstName}.
          </h1>
          <p className="mt-1" style={{ color: MUTED }}>
            Evo kako stoji tvoja prodaja.
          </p>
        </div>
        <Link
          href="/sales/leads"
          className="flex items-center gap-2 px-6 py-3 text-sm transition-transform hover:scale-[1.02]"
          style={primaryBtn}
        >
          <Plus size={16} />
          Novi lead
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map((s) => (
          <Panel key={s.label} className="p-5">
            <p className="text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.12em', color: MUTED }}>
              {s.label}
            </p>
            <p className="mt-2 text-2xl font-medium" style={{ color: FG }}>{s.value}</p>
          </Panel>
        ))}
        <Panel className="p-5" style={{ borderColor: 'rgba(0,255,148,0.25)' }}>
          <p className="text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.12em', color: MUTED }}>
            Za isplatu
          </p>
          <p className="mt-2 text-2xl font-medium" style={{ color: SIGNAL }}>{formatEur(payable)}</p>
        </Panel>
      </div>

      {/* Recent leads */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <SectionLabel>Zadnji leadovi</SectionLabel>
          <Link href="/sales/leads" className="flex items-center gap-1 text-sm transition-colors hover:text-white" style={{ color: MUTED }}>
            Svi leadovi <ArrowRight size={14} />
          </Link>
        </div>

        {leads.length === 0 ? (
          <Panel className="p-8 text-center">
            <p style={{ color: MUTED }}>Još nema leadova. Vrijeme je za prvi poziv.</p>
            <Link
              href="/sales/leads"
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 text-sm"
              style={primaryBtn}
            >
              <Plus size={16} />
              Dodaj lead
            </Link>
          </Panel>
        ) : (
          <div className="flex flex-col gap-2.5">
            {leads.slice(0, 5).map((lead) => (
              <Link key={lead.id} href={`/sales/leads/${lead.id}`}>
                <Panel className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-white/[0.06]">
                  <div className="min-w-0">
                    <p className="truncate font-medium" style={{ color: FG }}>{lead.name}</p>
                    <p className="truncate text-sm" style={{ color: MUTED }}>
                      {lead.company || 'Bez tvrtke'}
                      {lead.last_contacted_at ? ` · zvano ${timeAgo(lead.last_contacted_at)}` : ''}
                    </p>
                  </div>
                  <StatusPill map={LEAD_STATUSES} value={lead.status} />
                </Panel>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
