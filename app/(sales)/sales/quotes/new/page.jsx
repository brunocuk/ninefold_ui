'use client';

// Sales quote builder: pick a package, add-ons, client info → standard quotes row.

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getSalesUser } from '@/lib/salesAuth';
import { SALES_PACKAGES, SALES_ADDONS, generateSalesQuoteData, formatEur } from '@/lib/salesPackages';
import {
  Panel, SectionLabel,
  FG, BODY, MUTED, LINE, SIGNAL, MONO, primaryBtn, inputStyle,
} from '../../ui';
import { ArrowLeft, Check, Loader2, Minus, Plus } from 'lucide-react';

function SalesQuoteNewInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const leadId = searchParams.get('lead');

  const [user, setUser] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState('standard');
  const [addons, setAddons] = useState({});
  const [client, setClient] = useState({ name: '', email: '', company: '', phone: '' });
  const [discount, setDiscount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function init() {
    const currentUser = await getSalesUser();
    if (!currentUser) return;
    setUser(currentUser);

    if (leadId) {
      const { data: lead } = await supabase
        .from('leads')
        .select('id, name, email, company, phone, sales_user_id')
        .eq('id', leadId)
        .single();
      if (lead && lead.sales_user_id === currentUser.id) {
        setClient({
          name: lead.name || '',
          email: lead.email || '',
          company: lead.company || '',
          phone: lead.phone || '',
        });
      }
    }
  }

  useEffect(() => {
    init();
  }, []);

  function toggleAddon(id) {
    const addon = SALES_ADDONS[id];
    setAddons((prev) => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = addon.countable ? 1 : 1;
      }
      return next;
    });
  }

  function changeCount(id, delta) {
    setAddons((prev) => {
      const count = Math.max(1, (prev[id] || 1) + delta);
      return { ...prev, [id]: count };
    });
  }

  const pkg = SALES_PACKAGES[selectedPackage];
  const discountRate = Math.min(Math.max(discount, 0), 30) / 100;
  const preview = generateSalesQuoteData(selectedPackage, addons, client, user, { discountRate });
  const total = preview?.pricing?.total || 0;
  const deposit = total * 0.5;
  const maintenanceSelected = Boolean(addons.maintenance);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!client.name.trim() || !client.email.trim()) {
      setError('Ime i email klijenta su obavezni.');
      return;
    }

    setSaving(true);

    const row = generateSalesQuoteData(
      selectedPackage,
      addons,
      { ...client, leadId },
      user,
      { discountRate }
    );

    // Generate the Revolut payment link before saving, same as the CRM builder,
    // so the public quote page shows the payment button right away.
    // If it fails, the quote is still created and the link can be generated
    // later from the quote detail page.
    try {
      const depositAmount = row.pricing.total * row.pricing.depositRate;
      const res = await fetch('/api/quotes/create-payment-link-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(depositAmount * 100),
          currency: 'EUR',
          clientEmail: client.email.trim(),
          clientName: client.name.trim(),
          description: `${Math.round(row.pricing.depositRate * 100)}% predujam - ${client.company || client.name}`,
        }),
      });
      const linkData = await res.json();
      if (res.ok && linkData.checkout_url) {
        row.quote_data = { ...row.quote_data, paymentLink: linkData.checkout_url };
        row.revolut_checkout_url = linkData.checkout_url;
        row.revolut_order_id = linkData.order_id;
        row.revolut_payment_state = 'PENDING';
      }
    } catch (linkError) {
      console.error('Error generating payment link:', linkError);
    }

    const { data, error: insertError } = await supabase
      .from('quotes')
      .insert(row)
      .select()
      .single();

    if (insertError) {
      console.error('Error creating quote:', insertError);
      setError('Greška pri izradi ponude. Pokušaj ponovo.');
      setSaving(false);
      return;
    }

    if (leadId) {
      await supabase.from('leads').update({ status: 'proposal-sent' }).eq('id', leadId);
    }

    router.push(`/sales/quotes/${data.id}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <Link href="/sales/quotes" className="flex items-center gap-2 text-sm transition-colors hover:text-white" style={{ color: MUTED }}>
        <ArrowLeft size={15} />
        Natrag na ponude
      </Link>

      <div>
        <SectionLabel>Nova ponuda</SectionLabel>
        <h1 className="mt-3 text-3xl font-medium" style={{ letterSpacing: '-0.02em' }}>
          Složi ponudu
        </h1>
        <p className="mt-1" style={{ color: MUTED }}>
          Odaberi paket, dodaj što treba, upiši klijenta. Gotovo za minutu.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Packages */}
        <div>
          <p className="mb-3 text-sm font-medium" style={{ color: BODY }}>1. Paket</p>
          {[
            ['web', 'Web stranice'],
            ['shop', 'Web shop'],
          ].map(([category, label], gi) => (
            <div key={category} className={gi > 0 ? 'mt-6' : undefined}>
              <p className="mb-3 text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>
                {label}
              </p>
              <div className="grid gap-4 lg:grid-cols-3">
                {Object.values(SALES_PACKAGES).filter((p) => p.category === category).map((p) => {
                  const active = selectedPackage === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPackage(p.id)}
                      className="rounded-2xl p-5 text-left transition-all"
                      style={{
                        background: '#0F0F0F',
                        border: `1px solid ${active ? 'rgba(0,255,148,0.4)' : LINE}`,
                        boxShadow: active ? '0 0 0 1px rgba(0,255,148,0.2)' : 'none',
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium" style={{ color: FG }}>{p.name}</p>
                        {active && <Check size={16} style={{ color: SIGNAL }} />}
                      </div>
                      <p className="mt-1 text-2xl font-medium" style={{ color: FG }}>{formatEur(p.price)}</p>
                      <p className="mt-1 text-[12px]" style={{ fontFamily: MONO, color: MUTED }}>{p.duration}</p>
                      <p className="mt-3 text-sm" style={{ color: MUTED }}>{p.tagline}</p>
                      <ul className="mt-4 flex flex-col gap-1.5">
                        {p.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-[13px]" style={{ color: BODY }}>
                            <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full" style={{ background: SIGNAL }} />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Add-ons */}
        <div>
          <p className="mb-3 text-sm font-medium" style={{ color: BODY }}>2. Dodaci</p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {Object.values(SALES_ADDONS).map((a) => {
              const selected = Boolean(addons[a.id]);
              return (
                <div
                  key={a.id}
                  onClick={() => toggleAddon(a.id)}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-4 py-3.5 transition-all"
                  style={{
                    background: selected ? 'rgba(255,255,255,0.07)' : '#0F0F0F',
                    border: `1px solid ${selected ? 'rgba(0,255,148,0.35)' : LINE}`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md"
                      style={{
                        background: selected ? SIGNAL : 'rgba(255,255,255,0.06)',
                        border: selected ? 'none' : `1px solid ${LINE}`,
                      }}
                    >
                      {selected && <Check size={13} color="#080808" strokeWidth={3} />}
                    </span>
                    <div>
                      <p className="text-sm" style={{ color: FG }}>{a.name}</p>
                      <p className="text-[12px]" style={{ color: MUTED }}>{a.description}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    {selected && a.countable && (
                      <span className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button type="button" onClick={() => changeCount(a.id, -1)} className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: 'rgba(255,255,255,0.08)', color: FG }}>
                          <Minus size={12} />
                        </button>
                        <span className="text-sm" style={{ color: FG, fontFamily: MONO }}>{addons[a.id]}</span>
                        <button type="button" onClick={() => changeCount(a.id, 1)} className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: 'rgba(255,255,255,0.08)', color: FG }}>
                          <Plus size={12} />
                        </button>
                      </span>
                    )}
                    <span className="text-sm" style={{ fontFamily: MONO, color: BODY }}>
                      {formatEur(a.price)}{a.recurring ? '/mj' : ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Client */}
        <div>
          <p className="mb-3 text-sm font-medium" style={{ color: BODY }}>3. Klijent</p>
          <Panel className="grid gap-3 p-5 sm:grid-cols-2">
            <input
              value={client.name}
              onChange={(e) => setClient({ ...client, name: e.target.value })}
              placeholder="Ime i prezime *"
              required
              className="rounded-xl px-4 py-3 text-sm outline-none focus:border-white/25"
              style={inputStyle}
            />
            <input
              type="email"
              value={client.email}
              onChange={(e) => setClient({ ...client, email: e.target.value })}
              placeholder="Email *"
              required
              className="rounded-xl px-4 py-3 text-sm outline-none focus:border-white/25"
              style={inputStyle}
            />
            <input
              value={client.company}
              onChange={(e) => setClient({ ...client, company: e.target.value })}
              placeholder="Tvrtka"
              className="rounded-xl px-4 py-3 text-sm outline-none focus:border-white/25"
              style={inputStyle}
            />
            <input
              value={client.phone}
              onChange={(e) => setClient({ ...client, phone: e.target.value })}
              placeholder="Telefon"
              className="rounded-xl px-4 py-3 text-sm outline-none focus:border-white/25"
              style={inputStyle}
            />
          </Panel>
        </div>

        {/* Discount + summary */}
        <Panel className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-sm font-medium" style={{ color: BODY }}>Popust (%)</p>
              <input
                type="number"
                min="0"
                max="30"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="mt-2 w-28 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/25"
                style={inputStyle}
              />
              <p className="mt-1.5 text-[11px]" style={{ fontFamily: MONO, color: MUTED }}>Maksimalno 30%</p>
            </div>

            <div className="text-right">
              {discountRate > 0 && (
                <p className="text-sm" style={{ color: MUTED }}>
                  {formatEur(preview?.pricing?.subtotal)} − {formatEur(preview?.pricing?.discountAmount)} popust
                </p>
              )}
              <p className="text-3xl font-medium" style={{ color: FG }}>{formatEur(total)}</p>
              <p className="mt-1 text-sm" style={{ color: SIGNAL }}>
                Predujam 50%: {formatEur(deposit)}
              </p>
              {maintenanceSelected && (
                <p className="mt-1 text-[12px]" style={{ fontFamily: MONO, color: MUTED }}>
                  + {formatEur(SALES_ADDONS.maintenance.price)}/mj održavanje
                </p>
              )}
            </div>
          </div>

          {error && <p className="mt-4 text-sm" style={{ color: '#F87171' }}>{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="mt-5 flex w-full items-center justify-center gap-2.5 px-7 py-4 text-sm transition-transform hover:scale-[1.01] sm:w-auto"
            style={primaryBtn}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            Izradi ponudu
          </button>
        </Panel>
      </form>
    </div>
  );
}

export default function SalesQuoteNewPage() {
  return (
    <Suspense fallback={<p style={{ color: '#8E8E8E' }}>Učitavanje...</p>}>
      <SalesQuoteNewInner />
    </Suspense>
  );
}
