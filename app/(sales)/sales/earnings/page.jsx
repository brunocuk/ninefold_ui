'use client';

// Sales earnings: commission rows + totals for the logged-in salesperson.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getSalesUser } from '@/lib/salesAuth';
import { formatEur } from '@/lib/salesPackages';
import {
  Panel, SectionLabel,
  FG, BODY, MUTED, LINE, SIGNAL, MONO, formatDate,
} from '../ui';

export default function SalesEarningsPage() {
  const [user, setUser] = useState(null);
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const currentUser = await getSalesUser();
    if (!currentUser) return;
    setUser(currentUser);

    const { data } = await supabase
      .from('sales_commissions')
      .select('*, quote:quotes(id, reference, client_name)')
      .eq('sales_user_id', currentUser.id)
      .order('created_at', { ascending: false });

    setCommissions(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return <p style={{ color: MUTED }}>Učitavanje...</p>;
  }

  const payable = commissions.filter((c) => c.status === 'payable').reduce((s, c) => s + Number(c.amount), 0);
  const paid = commissions.filter((c) => c.status === 'paid').reduce((s, c) => s + Number(c.amount), 0);
  const total = payable + paid;
  const ratePercent = Math.round(Number(user?.commission_rate ?? 0.2) * 100);

  const totals = [
    { label: 'Za isplatu', value: formatEur(payable), color: SIGNAL },
    { label: 'Isplaćeno', value: formatEur(paid), color: FG },
    { label: 'Ukupno zarađeno', value: formatEur(total), color: FG },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <SectionLabel>Zarada</SectionLabel>
        <h1 className="mt-3 text-3xl font-medium" style={{ letterSpacing: '-0.02em' }}>
          Tvoja zarada
        </h1>
        <p className="mt-1" style={{ color: MUTED }}>
          Provizija {ratePercent}% na svaku uplatu koja legne.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {totals.map((t) => (
          <Panel key={t.label} className="p-5">
            <p className="text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.12em', color: MUTED }}>
              {t.label}
            </p>
            <p className="mt-2 text-2xl font-medium" style={{ color: t.color }}>{t.value}</p>
          </Panel>
        ))}
      </div>

      {commissions.length === 0 ? (
        <Panel className="p-8 text-center">
          <p style={{ color: MUTED }}>
            Još nema provizija. Čim klijent plati predujam po tvojoj ponudi, ovdje se pojavi tvoj dio.
          </p>
        </Panel>
      ) : (
        <div className="flex flex-col gap-2.5">
          {commissions.map((c) => (
            <Panel key={c.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <Link
                  href={`/sales/quotes/${c.quote?.id}`}
                  className="truncate font-medium transition-colors hover:text-white"
                  style={{ color: FG }}
                >
                  {c.quote?.reference || 'Ponuda'} · {c.quote?.client_name || ''}
                </Link>
                <p className="text-sm" style={{ color: MUTED }}>
                  {c.kind === 'deposit' ? 'Predujam' : 'Ostatak'} · {formatEur(c.base_amount)} × {Math.round(Number(c.rate) * 100)}% · {formatDate(c.created_at)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-lg font-medium" style={{ fontFamily: MONO, color: FG }}>
                  {formatEur(c.amount)}
                </p>
                <span
                  className="rounded-full px-3 py-1 text-[11px] font-medium"
                  style={
                    c.status === 'paid'
                      ? { background: 'rgba(255,255,255,0.06)', border: `1px solid ${LINE}`, color: BODY }
                      : { background: 'rgba(0,255,148,0.1)', border: '1px solid rgba(0,255,148,0.3)', color: SIGNAL }
                  }
                >
                  {c.status === 'paid' ? `Isplaćeno ${c.paid_at ? formatDate(c.paid_at) : ''}` : 'Za isplatu'}
                </span>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
