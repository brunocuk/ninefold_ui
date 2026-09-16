// app/(crm-admin)/crm/analytics/page.jsx
// Analitika: novac, prodajni lijevak, akcijske liste i trend naplate

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FileText, UserX, Eye, EyeOff, ChevronRight } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const MONO = { fontFamily: 'ui-monospace, Menlo, monospace' };

const RANGE_OPTIONS = [
  { value: 'this_month', label: 'Ovaj mjesec' },
  { value: 'this_quarter', label: 'Kvartal' },
  { value: 'this_year', label: 'Godina' },
  { value: 'all_time', label: 'Sve' },
];

// Lijevak: redoslijed statusa leada. "lost" se prikazuje odvojeno.
const LEAD_STAGE_INDEX = { new: 0, contacted: 1, qualified: 2, 'proposal-sent': 3, won: 4 };
const LEAD_STAGES = [
  { key: 'new', label: 'Novi leadovi' },
  { key: 'contacted', label: 'Kontaktirani' },
  { key: 'qualified', label: 'Kvalificirani' },
  { key: 'proposal-sent', label: 'Poslana ponuda' },
  { key: 'won', label: 'Dobiveni' },
];

const SOURCE_LABELS = {
  website: 'Web stranica',
  referral: 'Preporuka',
  linkedin: 'LinkedIn',
  'cold-outreach': 'Hladni kontakt',
  unknown: 'Nepoznato',
};

const DAY_MS = 24 * 60 * 60 * 1000;

function getRangeStart(range) {
  const now = new Date();
  switch (range) {
    case 'this_month':
      return new Date(now.getFullYear(), now.getMonth(), 1);
    case 'this_quarter':
      return new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
    case 'this_year':
      return new Date(now.getFullYear(), 0, 1);
    default:
      return null;
  }
}

// Datum odluke o ponudi: uplata je najpouzdanija, inace zadnja izmjena
function quoteDecidedAt(quote) {
  return new Date(quote.payment_received_at || quote.updated_at || quote.created_at);
}

function quoteWasOpened(quote) {
  return (quote.view_count || 0) > 0 || ['viewed', 'accepted', 'rejected'].includes(quote.status);
}

// Prvi kontakt s leadom: prvi zapis iz contact_log ako postoji, inace last_contacted_at
function leadFirstContactAt(lead) {
  const log = Array.isArray(lead.contact_log) ? lead.contact_log : [];
  for (const entry of log) {
    const raw = entry?.date || entry?.at || entry?.created_at || entry?.timestamp;
    if (raw) {
      const d = new Date(raw);
      if (!isNaN(d)) return d;
    }
  }
  return lead.last_contacted_at ? new Date(lead.last_contacted_at) : null;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('hr-HR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function formatDays(days) {
  if (days == null) return '·';
  const rounded = Math.round(days * 10) / 10;
  return `${rounded} ${rounded === 1 ? 'dan' : 'dana'}`;
}

export default function AnalyticsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(searchParams.get('range') || 'this_month');
  const [data, setData] = useState(null);

  const handleRangeChange = (range) => {
    setDateRange(range);
    router.push(`/crm/analytics?range=${range}`, { scroll: false });
  };

  const loadAnalytics = useCallback(async () => {
    try {
      const [quotesRes, leadsRes, invoicesRes, contractsRes] = await Promise.all([
        supabase.from('quotes').select('id, client_name, title, status, pricing, quote_type, view_count, last_viewed_at, last_sent_at, payment_received, payment_received_at, created_at, updated_at'),
        supabase.from('leads').select('id, name, company, status, source, created_at, last_contacted_at, contact_log'),
        supabase.from('invoices').select('id, amount, status, issue_date, due_date'),
        supabase.from('recurring_contracts').select('id, status, monthly_amount, billing_cycle, paid_periods'),
      ]);
      setData({
        quotes: quotesRes.data || [],
        leads: leadsRes.data || [],
        invoices: invoicesRes.data || [],
        contracts: contractsRes.data || [],
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
      setData({ quotes: [], leads: [], invoices: [], contracts: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  if (loading || !data) {
    return (
      <div className="text-center py-32">
        <div className="text-xs uppercase tracking-[0.14em] text-[#8E8E8E]" style={MONO}>
          Učitavanje analitike...
        </div>
      </div>
    );
  }

  const { quotes, leads, invoices, contracts } = data;
  const now = new Date();
  const rangeStart = getRangeStart(dateRange);
  const inRange = (date) => {
    if (!date) return false;
    if (!rangeStart) return true;
    return new Date(date) >= rangeStart;
  };

  // ---------- 1. NOVAC ----------

  // Ugovoreno: jednokratne ponude prihvacene u periodu (mjesecne iskljucene, one su MRR)
  const wonQuotes = quotes.filter(
    (q) => q.status === 'accepted' && q.quote_type !== 'monthly' && inRange(quoteDecidedAt(q))
  );
  const bookedTotal = wonQuotes.reduce((sum, q) => sum + (q.pricing?.total || 0), 0);
  const avgDealValue = wonQuotes.length ? bookedTotal / wonQuotes.length : null;

  // Naplaceno fakturama u periodu (po datumu izdavanja, status placeno)
  const paidInvoices = invoices.filter((i) => i.status === 'paid' && inRange(i.issue_date));
  const paidInvoicesTotal = paidInvoices.reduce((sum, i) => sum + Number(i.amount || 0), 0);

  // Avansi preko Revoluta u periodu
  const deposits = quotes.filter((q) => q.payment_received && inRange(q.payment_received_at));
  const depositsTotal = deposits.reduce((sum, q) => {
    const depositRate = q.pricing?.depositRate ?? 0.5;
    return sum + (q.pricing?.total || 0) * depositRate;
  }, 0);

  // Otvoreno za naplatu: trenutno stanje, ne ovisi o periodu
  const openInvoices = invoices.filter((i) => i.status === 'unpaid' || i.status === 'overdue');
  const openTotal = openInvoices.reduce((sum, i) => sum + Number(i.amount || 0), 0);
  const overdueInvoices = invoices.filter(
    (i) => i.status === 'overdue' || (i.status === 'unpaid' && i.due_date && new Date(i.due_date) < now)
  );
  const overdueTotal = overdueInvoices.reduce((sum, i) => sum + Number(i.amount || 0), 0);

  // MRR iz aktivnih ugovora (godisnji: monthly_amount drzi godisnji iznos)
  const activeContracts = contracts.filter((c) => c.status === 'active');
  const mrr = activeContracts.reduce(
    (sum, c) => sum + (c.billing_cycle === 'yearly' ? (c.monthly_amount || 0) / 12 : c.monthly_amount || 0),
    0
  );

  // ---------- 2. LIJEVAK ----------

  const leadsInRange = leads.filter((l) => inRange(l.created_at));
  const lostLeads = leadsInRange.filter((l) => l.status === 'lost');
  const funnelStages = LEAD_STAGES.map((stage, idx) => {
    const count = leadsInRange.filter((l) => {
      if (l.status === 'lost') return idx <= 1 && (idx === 0 || leadFirstContactAt(l));
      return (LEAD_STAGE_INDEX[l.status] ?? 0) >= idx;
    }).length;
    return { ...stage, count };
  });
  const funnelBase = funnelStages[0].count;

  // Lijevak ponuda u periodu (po datumu kreiranja)
  const quotesInRange = quotes.filter((q) => inRange(q.created_at));
  const sentQuotes = quotesInRange.filter(
    (q) => q.last_sent_at || ['sent', 'viewed', 'accepted', 'rejected'].includes(q.status)
  );
  const openedQuotes = sentQuotes.filter(quoteWasOpened);
  const acceptedInRange = quotesInRange.filter((q) => q.status === 'accepted');

  // Win rate: samo odlucene ponude, one koje cekaju ne ulaze u racun
  const decidedInRange = quotes.filter(
    (q) => ['accepted', 'rejected'].includes(q.status) && inRange(quoteDecidedAt(q))
  );
  const decidedAccepted = decidedInRange.filter((q) => q.status === 'accepted').length;
  const winRate = decidedInRange.length ? (decidedAccepted / decidedInRange.length) * 100 : null;

  // Izvori leadova: koliko ih dode i koliko ih zavrsi kao posao
  const sourceMap = {};
  leadsInRange.forEach((l) => {
    const key = l.source || 'unknown';
    if (!sourceMap[key]) sourceMap[key] = { total: 0, won: 0 };
    sourceMap[key].total += 1;
    if (l.status === 'won') sourceMap[key].won += 1;
  });
  const sources = Object.entries(sourceMap)
    .map(([key, v]) => ({ key, label: SOURCE_LABELS[key] || key, ...v }))
    .sort((a, b) => b.won - a.won || b.total - a.total);

  // ---------- 3. ZA AKCIJU ----------

  const staleQuotes = quotes
    .filter((q) => ['sent', 'viewed'].includes(q.status) && q.last_sent_at)
    .map((q) => ({ ...q, daysWaiting: Math.floor((now - new Date(q.last_sent_at)) / DAY_MS) }))
    .filter((q) => q.daysWaiting >= 5)
    .sort((a, b) => b.daysWaiting - a.daysWaiting)
    .slice(0, 8);

  const staleLeads = leads
    .filter((l) => ['new', 'contacted', 'qualified', 'proposal-sent'].includes(l.status))
    .map((l) => {
      const lastTouch = l.last_contacted_at ? new Date(l.last_contacted_at) : new Date(l.created_at);
      return { ...l, daysSilent: Math.floor((now - lastTouch) / DAY_MS), neverContacted: !l.last_contacted_at };
    })
    .filter((l) => l.daysSilent >= 7)
    .sort((a, b) => b.daysSilent - a.daysSilent)
    .slice(0, 8);

  // ---------- 4. TREND ----------

  const months = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      year: String(d.getFullYear()),
      label: d.toLocaleDateString('hr-HR', { month: 'short' }).replace('.', ''),
      invoiced: 0,
      depositsAmt: 0,
      recurring: 0,
    });
  }
  const monthByKey = Object.fromEntries(months.map((m) => [m.key, m]));

  invoices.forEach((i) => {
    if (i.status !== 'paid' || !i.issue_date) return;
    const m = monthByKey[i.issue_date.slice(0, 7)];
    if (m) m.invoiced += Number(i.amount || 0);
  });

  quotes.forEach((q) => {
    if (!q.payment_received || !q.payment_received_at) return;
    const m = monthByKey[q.payment_received_at.slice(0, 7)];
    if (m) m.depositsAmt += (q.pricing?.total || 0) * (q.pricing?.depositRate ?? 0.5);
  });

  contracts.forEach((c) => {
    const periods = Array.isArray(c.paid_periods) ? c.paid_periods : [];
    periods.forEach((p) => {
      if (typeof p !== 'string') return;
      if (p.length === 7) {
        const m = monthByKey[p];
        if (m) m.recurring += c.monthly_amount || 0;
      } else if (p.length === 4) {
        // Godisnja uplata: rasporedi na 12 mjeseci te godine
        months.forEach((m) => {
          if (m.year === p) m.recurring += (c.monthly_amount || 0) / 12;
        });
      }
    });
  });

  const trendChartData = {
    labels: months.map((m) => m.label),
    datasets: [
      { label: 'Fakture', data: months.map((m) => Math.round(m.invoiced)), backgroundColor: '#F2F2F2', stack: 'cash', borderRadius: 3 },
      { label: 'Avansi', data: months.map((m) => Math.round(m.depositsAmt)), backgroundColor: '#6E6E6E', stack: 'cash', borderRadius: 3 },
      { label: 'Recurring', data: months.map((m) => Math.round(m.recurring)), backgroundColor: '#00FF94', stack: 'cash', borderRadius: 3 },
    ],
  };

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: { color: '#8E8E8E', boxWidth: 10, boxHeight: 10, font: { size: 11 } },
      },
      tooltip: {
        callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${formatCurrency(ctx.raw)}` },
      },
    },
    scales: {
      x: { stacked: true, ticks: { color: '#8E8E8E', font: { size: 11 } }, grid: { display: false } },
      y: { stacked: true, ticks: { color: '#6E6E6E', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
    },
  };

  // Brzina: prosjecno vrijeme od slanja ponude do odluke i od leada do prvog kontakta
  const decisionDurations = decidedInRange
    .filter((q) => q.last_sent_at)
    .map((q) => (quoteDecidedAt(q) - new Date(q.last_sent_at)) / DAY_MS)
    .filter((d) => d >= 0);
  const avgDecisionDays = decisionDurations.length
    ? decisionDurations.reduce((a, b) => a + b, 0) / decisionDurations.length
    : null;

  const contactDurations = leadsInRange
    .map((l) => {
      const first = leadFirstContactAt(l);
      return first ? (first - new Date(l.created_at)) / DAY_MS : null;
    })
    .filter((d) => d != null && d >= 0);
  const avgContactDays = contactDurations.length
    ? contactDurations.reduce((a, b) => a + b, 0) / contactDurations.length
    : null;

  const rangeLabel = RANGE_OPTIONS.find((o) => o.value === dateRange)?.label || '';

  const SectionTitle = ({ children }) => (
    <h2 className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.14em] text-[#8E8E8E] mb-5" style={MONO}>
      {children}
    </h2>
  );

  const MetricCard = ({ label, value, sub, subClass }) => (
    <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-2xl p-6">
      <div className="text-[11px] uppercase tracking-[0.14em] text-[#8E8E8E] mb-3" style={MONO}>{label}</div>
      <div className="text-3xl font-medium text-[#F2F2F2] leading-none">{value}</div>
      {sub && <div className={`text-sm mt-2.5 ${subClass || 'text-[#6E6E6E]'}`}>{sub}</div>}
    </div>
  );

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-start justify-between gap-5 flex-wrap mb-10">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-[5px] h-[5px] rounded-full bg-[#00FF94]" />
            <span className="text-[11px] uppercase tracking-[0.14em] text-[#8E8E8E]" style={MONO}>
              Analitika · {rangeLabel}
            </span>
          </div>
          <h1 className="text-4xl font-medium mb-2 text-[#F2F2F2]">Analitika</h1>
          <p className="text-[#8E8E8E]">Novac, lijevak i što napraviti danas.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {RANGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleRangeChange(option.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                dateRange === option.value
                  ? 'bg-white/[0.08] border-white/[0.16] text-[#F2F2F2]'
                  : 'bg-transparent border-white/[0.07] text-[#8E8E8E] hover:text-[#F2F2F2] hover:border-white/[0.16]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Novac */}
      <div className="mb-10">
        <SectionTitle>Novac</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          <MetricCard
            label="Ugovoreno"
            value={formatCurrency(bookedTotal)}
            sub={`${wonQuotes.length} ${wonQuotes.length === 1 ? 'prihvaćena ponuda' : 'prihvaćenih ponuda'} u periodu`}
          />
          <MetricCard
            label="Naplaćeno fakturama"
            value={formatCurrency(paidInvoicesTotal)}
            sub={`${paidInvoices.length} ${paidInvoices.length === 1 ? 'plaćena faktura' : 'plaćenih faktura'} u periodu`}
          />
          <MetricCard
            label="Avansi · Revolut"
            value={formatCurrency(depositsTotal)}
            sub={`${deposits.length} ${deposits.length === 1 ? 'uplata' : 'uplata'} u periodu`}
          />
          <MetricCard
            label="Otvoreno za naplatu"
            value={formatCurrency(openTotal)}
            sub={overdueTotal > 0 ? `${formatCurrency(overdueTotal)} u kašnjenju` : 'ništa u kašnjenju'}
            subClass={overdueTotal > 0 ? 'text-red-400' : 'text-[#6E6E6E]'}
          />
          <MetricCard
            label="MRR"
            value={formatCurrency(mrr)}
            sub={`${activeContracts.length} aktivnih ugovora · ARR ${formatCurrency(mrr * 12)}`}
          />
          <MetricCard
            label="Prosjek po poslu"
            value={avgDealValue != null ? formatCurrency(avgDealValue) : '·'}
            sub="prihvaćene jednokratne ponude"
          />
        </div>
      </div>

      {/* 2. Lijevak */}
      <div className="mb-10">
        <SectionTitle>Prodajni lijevak</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Leadovi */}
          <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-2xl p-6">
            <div className="text-[11px] uppercase tracking-[0.14em] text-[#8E8E8E] mb-5" style={MONO}>
              Leadovi u periodu
            </div>
            {funnelBase === 0 ? (
              <p className="text-[#6E6E6E] text-sm">Nema leadova u odabranom periodu.</p>
            ) : (
              <div className="space-y-4">
                {funnelStages.map((stage, idx) => {
                  const pct = funnelBase ? (stage.count / funnelBase) * 100 : 0;
                  const isLast = idx === funnelStages.length - 1;
                  return (
                    <div key={stage.key}>
                      <div className="flex items-baseline justify-between mb-1.5">
                        <span className="text-sm text-[#C9C9C9]">{stage.label}</span>
                        <span className="text-sm text-[#F2F2F2] font-medium">
                          {stage.count}
                          <span className="text-[#6E6E6E] font-normal ml-2">{Math.round(pct)}%</span>
                        </span>
                      </div>
                      <div className="h-[3px] bg-white/[0.05] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isLast ? 'bg-[#00FF94]' : 'bg-white/40'}`}
                          style={{ width: `${Math.max(pct, stage.count > 0 ? 2 : 0)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                {lostLeads.length > 0 && (
                  <div className="pt-2 text-sm text-[#6E6E6E]">
                    Izgubljeno: <span className="text-red-400">{lostLeads.length}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Ponude */}
          <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-2xl p-6 flex flex-col">
            <div className="text-[11px] uppercase tracking-[0.14em] text-[#8E8E8E] mb-5" style={MONO}>
              Ponude u periodu
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <div className="text-2xl font-medium text-[#F2F2F2]">{sentQuotes.length}</div>
                <div className="text-xs text-[#6E6E6E] mt-1">poslano</div>
              </div>
              <div>
                <div className="text-2xl font-medium text-[#F2F2F2]">{openedQuotes.length}</div>
                <div className="text-xs text-[#6E6E6E] mt-1">otvoreno</div>
              </div>
              <div>
                <div className="text-2xl font-medium text-[#00FF94]">{acceptedInRange.length}</div>
                <div className="text-xs text-[#6E6E6E] mt-1">prihvaćeno</div>
              </div>
            </div>
            <div className="border-t border-white/[0.07] pt-5 mb-6">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-[#C9C9C9]">Win rate</span>
                <span className="text-2xl font-medium text-[#F2F2F2]">
                  {winRate != null ? `${winRate.toFixed(0)}%` : '·'}
                </span>
              </div>
              <p className="text-xs text-[#6E6E6E] mt-1">
                samo odlučene ponude · one koje čekaju ne ulaze u račun
              </p>
            </div>
            {/* Izvori */}
            <div className="mt-auto">
              <div className="text-[11px] uppercase tracking-[0.14em] text-[#8E8E8E] mb-3" style={MONO}>
                Izvori
              </div>
              {sources.length === 0 ? (
                <p className="text-[#6E6E6E] text-sm">Nema podataka o izvorima.</p>
              ) : (
                <div className="space-y-2">
                  {sources.map((s) => (
                    <div key={s.key} className="flex items-baseline justify-between text-sm">
                      <span className="text-[#C9C9C9]">{s.label}</span>
                      <span className="text-[#8E8E8E]">
                        {s.total} {s.total === 1 ? 'lead' : 'leadova'}
                        {s.won > 0 && <span className="text-[#00FF94] ml-2">{s.won} dobiveno</span>}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Za akciju */}
      <div className="mb-10">
        <SectionTitle>Za akciju danas</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Ponude bez odgovora */}
          <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-2xl p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <FileText size={14} className="text-[#8E8E8E]" />
              <span className="text-[11px] uppercase tracking-[0.14em] text-[#8E8E8E]" style={MONO}>
                Ponude bez odgovora · 5+ dana
              </span>
            </div>
            {staleQuotes.length === 0 ? (
              <p className="text-[#6E6E6E] text-sm">Sve poslane ponude su svježe. Nema follow-upa za danas.</p>
            ) : (
              <div className="space-y-1">
                {staleQuotes.map((q) => (
                  <Link
                    key={q.id}
                    href={`/crm/quotes/${q.id}`}
                    className="flex items-center justify-between gap-3 -mx-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors group"
                  >
                    <div className="min-w-0">
                      <div className="text-sm text-[#F2F2F2] truncate">{q.client_name || q.title}</div>
                      <div className="flex items-center gap-2 text-xs text-[#6E6E6E] mt-0.5">
                        <span>{formatCurrency(q.pricing?.total)}</span>
                        <span>·</span>
                        {quoteWasOpened(q) ? (
                          <span className="flex items-center gap-1">
                            <Eye size={11} /> otvorena {q.view_count || 1}x
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-amber-400/80">
                            <EyeOff size={11} /> nije otvorena
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-[#8E8E8E]" style={MONO}>{q.daysWaiting}d</span>
                      <ChevronRight size={14} className="text-[#5C5C5C] group-hover:text-[#F2F2F2] transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Leadovi bez kontakta */}
          <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-2xl p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <UserX size={14} className="text-[#8E8E8E]" />
              <span className="text-[11px] uppercase tracking-[0.14em] text-[#8E8E8E]" style={MONO}>
                Leadovi bez kontakta · 7+ dana
              </span>
            </div>
            {staleLeads.length === 0 ? (
              <p className="text-[#6E6E6E] text-sm">Svi aktivni leadovi su nedavno kontaktirani.</p>
            ) : (
              <div className="space-y-1">
                {staleLeads.map((l) => (
                  <Link
                    key={l.id}
                    href={`/crm/leads/${l.id}`}
                    className="flex items-center justify-between gap-3 -mx-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors group"
                  >
                    <div className="min-w-0">
                      <div className="text-sm text-[#F2F2F2] truncate">
                        {l.name}{l.company ? ` · ${l.company}` : ''}
                      </div>
                      <div className="text-xs text-[#6E6E6E] mt-0.5">
                        {SOURCE_LABELS[l.source] || l.source || 'nepoznat izvor'}
                        {l.neverContacted && <span className="text-amber-400/80 ml-2">nikad kontaktiran</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-[#8E8E8E]" style={MONO}>{l.daysSilent}d</span>
                      <ChevronRight size={14} className="text-[#5C5C5C] group-hover:text-[#F2F2F2] transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Trend */}
      <div className="mb-10">
        <SectionTitle>Trend naplate · zadnjih 12 mjeseci</SectionTitle>
        <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-2xl p-6">
          <div className="h-[300px]">
            <Bar data={trendChartData} options={trendOptions} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
          <MetricCard
            label="Ponuda do odluke"
            value={formatDays(avgDecisionDays)}
            sub="prosjek od slanja do prihvaćanja ili odbijanja"
          />
          <MetricCard
            label="Lead do prvog kontakta"
            value={formatDays(avgContactDays)}
            sub="prosjek za leadove iz odabranog perioda"
          />
        </div>
      </div>
    </div>
  );
}
