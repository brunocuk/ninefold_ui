'use client';

// Sales quotes list: own quotes only.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getSalesUser } from '@/lib/salesAuth';
import { formatEur } from '@/lib/salesPackages';
import {
  Panel, SectionLabel, StatusPill, QUOTE_STATUSES,
  FG, MUTED, SIGNAL, primaryBtn, formatDate,
} from '../ui';
import { Plus } from 'lucide-react';

export default function SalesQuotesPage() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const currentUser = await getSalesUser();
    if (!currentUser) return;

    const { data } = await supabase
      .from('quotes')
      .select('id, reference, client_name, status, payment_received, pricing, created_at, view_count')
      .eq('sales_user_id', currentUser.id)
      .order('created_at', { ascending: false });

    setQuotes(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return <p style={{ color: MUTED }}>Učitavanje...</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionLabel>Ponude</SectionLabel>
          <h1 className="mt-3 text-3xl font-medium" style={{ letterSpacing: '-0.02em' }}>
            Tvoje ponude
          </h1>
          <p className="mt-1" style={{ color: MUTED }}>
            {quotes.length} ukupno · {quotes.filter((q) => q.payment_received).length} plaćenih
          </p>
        </div>
        <Link
          href="/sales/quotes/new"
          className="flex items-center gap-2 px-6 py-3 text-sm transition-transform hover:scale-[1.02]"
          style={primaryBtn}
        >
          <Plus size={16} />
          Nova ponuda
        </Link>
      </div>

      {quotes.length === 0 ? (
        <Panel className="p-8 text-center">
          <p style={{ color: MUTED }}>Još nema ponuda. Složi prvu za minutu.</p>
          <Link
            href="/sales/quotes/new"
            className="mt-4 inline-flex items-center gap-2 px-6 py-3 text-sm"
            style={primaryBtn}
          >
            <Plus size={16} />
            Nova ponuda
          </Link>
        </Panel>
      ) : (
        <div className="flex flex-col gap-2.5">
          {quotes.map((q) => (
            <Link key={q.id} href={`/sales/quotes/${q.id}`}>
              <Panel className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-white/[0.06]">
                <div className="min-w-0">
                  <p className="truncate font-medium" style={{ color: FG }}>
                    {q.reference} · {q.client_name}
                  </p>
                  <p className="text-sm" style={{ color: MUTED }}>
                    {formatEur(q.pricing?.total)} · {formatDate(q.created_at)}
                    {q.view_count > 0 ? ` · pogledano ${q.view_count}x` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  {q.payment_received && (
                    <span
                      className="rounded-full px-3 py-1 text-[11px] font-medium"
                      style={{ background: 'rgba(0,255,148,0.1)', border: '1px solid rgba(0,255,148,0.3)', color: SIGNAL }}
                    >
                      Plaćeno
                    </span>
                  )}
                  <StatusPill map={QUOTE_STATUSES} value={q.status} />
                </div>
              </Panel>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
