'use client';

// Sales quote detail: action hub after creating a quote.
// Open preview, send by email, generate Revolut payment link, track status.

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getSalesUser } from '@/lib/salesAuth';
import { formatEur } from '@/lib/salesPackages';
import {
  Panel, SectionLabel, StatusPill, QUOTE_STATUSES,
  FG, BODY, MUTED, LINE, SIGNAL, MONO, formatDate, primaryBtn, ghostBtn,
} from '../../ui';
import { ArrowLeft, ExternalLink, Mail, CreditCard, Copy, Check, Loader2 } from 'lucide-react';

export default function SalesQuoteDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    load();
  }, [params.id]);

  async function load() {
    const currentUser = await getSalesUser();
    if (!currentUser) return;

    const { data } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', params.id)
      .single();

    if (!data || data.sales_user_id !== currentUser.id) {
      router.push('/sales/quotes');
      return;
    }

    setQuote(data);
    setLoading(false);
  }

  async function handleSend() {
    setSending(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/quotes/${quote.id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: quote.client_email,
          recipientName: quote.client_name,
        }),
      });
      if (!res.ok) throw new Error('Send failed');
      setMessage({ type: 'ok', text: `Ponuda poslana na ${quote.client_email}` });
      setQuote({ ...quote, status: quote.status === 'draft' ? 'sent' : quote.status });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'err', text: 'Greška pri slanju emaila. Pokušaj ponovo.' });
    } finally {
      setSending(false);
    }
  }

  async function handlePaymentLink() {
    setGenerating(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/quotes/${quote.id}/create-payment-link`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok || !data.checkout_url) throw new Error(data.error || 'Failed');
      setQuote({ ...quote, revolut_checkout_url: data.checkout_url, revolut_payment_state: 'PENDING' });
      setMessage({ type: 'ok', text: 'Link za plaćanje je spreman.' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'err', text: 'Greška pri generiranju linka za plaćanje.' });
    } finally {
      setGenerating(false);
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(quote.revolut_checkout_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return <p style={{ color: MUTED }}>Učitavanje...</p>;
  }

  const total = quote.pricing?.total || 0;
  const depositRate = quote.pricing?.depositRate ?? 0.5;
  const deposit = total * depositRate;

  return (
    <div className="flex flex-col gap-6">
      <Link href="/sales/quotes" className="flex items-center gap-2 text-sm transition-colors hover:text-white" style={{ color: MUTED }}>
        <ArrowLeft size={15} />
        Natrag na ponude
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionLabel>Ponuda</SectionLabel>
          <h1 className="mt-3 text-3xl font-medium" style={{ letterSpacing: '-0.02em' }}>
            {quote.reference}
          </h1>
          <p className="mt-1" style={{ color: MUTED }}>
            {quote.client_name}{quote.client_email ? ` · ${quote.client_email}` : ''} · {formatDate(quote.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          {quote.payment_received && (
            <span
              className="rounded-full px-3 py-1.5 text-[12px] font-medium"
              style={{ background: 'rgba(0,255,148,0.1)', border: '1px solid rgba(0,255,148,0.3)', color: SIGNAL }}
            >
              Plaćeno
            </span>
          )}
          <StatusPill map={QUOTE_STATUSES} value={quote.status} />
        </div>
      </div>

      {/* Summary */}
      <Panel className="p-6">
        <div className="flex flex-col gap-3">
          {(quote.pricing?.items || []).map((item, i) => (
            <div key={i} className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm" style={{ color: FG }}>{item.name}</p>
                {item.description && <p className="text-[12px]" style={{ color: MUTED }}>{item.description}</p>}
              </div>
              <p className="shrink-0 text-sm" style={{ fontFamily: MONO, color: BODY }}>{formatEur(item.price)}</p>
            </div>
          ))}
          {quote.pricing?.discountAmount > 0 && (
            <div className="flex items-center justify-between text-sm" style={{ color: MUTED }}>
              <p>Popust ({Math.round((quote.pricing.discountRate || 0) * 100)}%)</p>
              <p style={{ fontFamily: MONO }}>−{formatEur(quote.pricing.discountAmount)}</p>
            </div>
          )}
          <div className="flex items-center justify-between border-t pt-3" style={{ borderColor: LINE }}>
            <p className="font-medium" style={{ color: FG }}>Ukupno</p>
            <p className="text-xl font-medium" style={{ color: FG }}>{formatEur(total)}</p>
          </div>
          <div className="flex items-center justify-between text-sm">
            <p style={{ color: MUTED }}>Predujam ({Math.round(depositRate * 100)}%)</p>
            <p style={{ fontFamily: MONO, color: SIGNAL }}>{formatEur(deposit)}</p>
          </div>
          {quote.pricing?.maintenance?.enabled && (
            <div className="flex items-center justify-between text-sm">
              <p style={{ color: MUTED }}>Mjesečno održavanje</p>
              <p style={{ fontFamily: MONO, color: BODY }}>{formatEur(quote.pricing.maintenance.price)}/mj</p>
            </div>
          )}
        </div>
      </Panel>

      {message && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={
            message.type === 'ok'
              ? { background: 'rgba(0,255,148,0.07)', border: '1px solid rgba(0,255,148,0.25)', color: SIGNAL }
              : { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#F87171' }
          }
        >
          {message.text}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <a
          href={`/quote/${quote.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3.5 text-sm transition-transform hover:scale-[1.02]"
          style={primaryBtn}
        >
          <ExternalLink size={15} />
          Otvori ponudu
        </a>
        <button
          onClick={handleSend}
          disabled={sending || !quote.client_email}
          className="flex items-center gap-2 px-6 py-3.5 text-sm transition-colors hover:bg-white/10"
          style={ghostBtn}
        >
          {sending ? <Loader2 size={15} className="animate-spin" /> : <Mail size={15} />}
          Pošalji e-mailom
        </button>
        {!quote.revolut_checkout_url && (
          <button
            onClick={handlePaymentLink}
            disabled={generating}
            className="flex items-center gap-2 px-6 py-3.5 text-sm transition-colors hover:bg-white/10"
            style={ghostBtn}
          >
            {generating ? <Loader2 size={15} className="animate-spin" /> : <CreditCard size={15} />}
            Generiraj link za plaćanje
          </button>
        )}
      </div>

      {/* Payment link */}
      {quote.revolut_checkout_url && (
        <Panel className="p-5">
          <SectionLabel>Link za plaćanje predujma</SectionLabel>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <code
              className="min-w-0 flex-1 truncate rounded-xl px-4 py-3 text-[13px]"
              style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${LINE}`, color: BODY, fontFamily: MONO }}
            >
              {quote.revolut_checkout_url}
            </code>
            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-5 py-3 text-sm transition-colors hover:bg-white/10"
              style={ghostBtn}
            >
              {copied ? <Check size={15} style={{ color: SIGNAL }} /> : <Copy size={15} />}
              {copied ? 'Kopirano' : 'Kopiraj'}
            </button>
          </div>
          <p className="mt-2.5 text-[12px]" style={{ color: MUTED }}>
            Pošalji klijentu ovaj link, čim plati predujam, tvoja provizija se automatski bilježi.
          </p>
        </Panel>
      )}
    </div>
  );
}
