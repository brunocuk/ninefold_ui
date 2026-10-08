// app/(crm-admin)/crm/quotes/maintenance/new/page.jsx
// Builder for recurring maintenance quotes with a client-selectable tier picker.
// Creates a quote_type 'monthly' quote with quote_data.maintenance (tiers, shared items, hourly rate).

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Loader2, Star } from 'lucide-react';
import { useToast } from '@/components/Toast';
import { COMPANIES } from '@/lib/pricingConstants';
import { MAINTENANCE_QUOTE_DEFAULTS } from '@/lib/maintenancePackages';

const linesToItems = (text) => text.split('\n').map(l => l.trim()).filter(Boolean);

export default function NewMaintenanceQuotePage() {
  const router = useRouter();
  const toast = useToast();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    issuerCompany: 'progmatiq',
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    clientOib: '',
    title: 'Održavanje web stranice',
    overview: '',
    hourlyRate: MAINTENANCE_QUOTE_DEFAULTS.hourlyRate,
    recommendedTier: MAINTENANCE_QUOTE_DEFAULTS.recommendedTier,
    tiers: MAINTENANCE_QUOTE_DEFAULTS.tiers.map(t => ({
      ...t,
      featuresText: t.features.join('\n')
    })),
    includedInAllText: MAINTENANCE_QUOTE_DEFAULTS.includedInAll.join('\n'),
    notIncludedText: MAINTENANCE_QUOTE_DEFAULTS.notIncluded.join('\n')
  });

  const updateTier = (index, field, value) => {
    setForm(prev => {
      const tiers = [...prev.tiers];
      tiers[index] = { ...tiers[index], [field]: value };
      return { ...prev, tiers };
    });
  };

  const handleCreate = async () => {
    if (!form.clientName.trim() || !form.clientEmail.trim()) {
      toast.warning('Ime i email klijenta su obavezni');
      return;
    }
    if (form.tiers.some(t => !t.name.trim() || !t.price || t.price <= 0)) {
      toast.warning('Svaki paket mora imati naziv i cijenu veću od 0');
      return;
    }

    setSaving(true);
    try {
      const tiers = form.tiers.map(t => ({
        id: t.id,
        name: t.name.trim(),
        hours: String(t.hours).trim(),
        hoursLabel: t.hoursLabel?.trim() || `${String(t.hours).trim()} sati rada mjesečno`,
        price: Number(t.price),
        tagline: t.tagline?.trim() || '',
        features: linesToItems(t.featuresText)
      }));

      const includedInAll = linesToItems(form.includedInAllText);
      const notIncluded = linesToItems(form.notIncludedText);
      const recommended = tiers.find(t => t.id === form.recommendedTier) || tiers[0];

      const scope = [
        { title: 'Uključeno u sve pakete', items: includedInAll },
        {
          title: 'Što nije uključeno',
          items: notIncluded.length > 0 ? notIncluded : [`Veće izmjene po satnici od ${form.hourlyRate} EUR/h uz procjenu unaprijed`]
        }
      ];

      const reference = `NF-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${form.clientName.substring(0, 3).toUpperCase()}`;
      const overview = form.overview.trim() || `Redovno tehničko održavanje za ${form.clientName}. Odaberite paket koji odgovara količini izmjena koje mjesečno trebate; osnovu (nadogradnje uz backup, nadzor i mjesečni izvještaj) dobivate u svakom paketu.`;

      const quoteRow = {
        client_id: null,
        lead_id: null,
        service_type: 'web_development',
        quote_type: 'monthly',
        services: null,
        monthly_price: recommended.price,
        issuer_company: form.issuerCompany,
        title: form.title.trim() || 'Održavanje web stranice',
        client_name: form.clientName.trim(),
        client_email: form.clientEmail.trim(),
        project_overview: overview,
        duration: 'Mjesečna usluga, bez vremenskog ograničenja',
        scope,
        timeline: [],
        reference,
        quote_number: reference,
        status: 'draft',
        quote_data: {
          clientName: form.clientName.trim(),
          clientEmail: form.clientEmail.trim(),
          clientAddress: form.clientAddress.trim() || null,
          clientOib: form.clientOib.trim() || null,
          reference,
          date: new Date().toLocaleDateString('hr-HR'),
          duration: 'Mjesečna usluga, bez vremenskog ograničenja',
          projectOverview: overview,
          objectives: [],
          paymentLink: '',
          scope,
          timeline: [],
          maintenance: {
            tiers,
            includedInAll,
            notIncluded,
            hourlyRate: Number(form.hourlyRate) || 0,
            recommendedTier: recommended.id,
            selectedTier: null
          }
        },
        pricing: { monthlyPrice: recommended.price, items: [], total: recommended.price },
        revolut_checkout_url: null,
        revolut_order_id: null,
        view_count: 0,
        last_viewed_at: null
      };

      const { data, error } = await supabase.from('quotes').insert([quoteRow]).select();
      if (error) throw error;

      toast.success('Ponuda održavanja kreirana');
      router.push(`/crm/quotes/${data[0].id}`);
    } catch (error) {
      console.error('Error creating maintenance quote:', error);
      toast.error('Greška pri kreiranju ponude: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full bg-[#080808] border border-white/[0.07] rounded-xl px-4 py-3 text-[#F2F2F2] placeholder-[#5C5C5C] focus:outline-none focus:border-white/25 transition-colors';
  const labelCls = 'block text-xs uppercase tracking-wider text-[#8E8E8E] mb-2 font-mono';

  return (
    <div className="animate-fadeIn max-w-4xl">
      <Link href="/crm/quotes" className="inline-flex items-center gap-2 text-[#8E8E8E] hover:text-[#F2F2F2] mb-6 transition-colors">
        <ArrowLeft size={18} />
        Natrag na ponude
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-medium text-[#F2F2F2] mb-2">Ponuda održavanja</h1>
        <p className="text-[#8E8E8E]">Recurring ponuda s tri paketa između kojih klijent sam bira na javnoj stranici</p>
      </div>

      {/* Issuer */}
      <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-medium text-[#F2F2F2] mb-4">Izdavatelj</h2>
        <div className="grid grid-cols-2 gap-3">
          {Object.values(COMPANIES).map(company => (
            <button
              key={company.id}
              type="button"
              onClick={() => setForm({ ...form, issuerCompany: company.id })}
              className={`p-4 rounded-xl border text-left transition-colors ${
                form.issuerCompany === company.id
                  ? 'border-[#00FF94]/40 bg-[#101210]'
                  : 'border-white/[0.07] hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${form.issuerCompany === company.id ? 'bg-[#00FF94]' : 'bg-white/20'}`}></span>
                <span className="text-[#F2F2F2] text-sm font-medium">{company.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Client */}
      <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-medium text-[#F2F2F2] mb-4">Klijent</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Naziv / Ime *</label>
            <input type="text" value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} placeholder="Firma d.o.o." className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Email *</label>
            <input type="email" value={form.clientEmail} onChange={e => setForm({ ...form, clientEmail: e.target.value })} placeholder="klijent@email.hr" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Adresa</label>
            <input type="text" value={form.clientAddress} onChange={e => setForm({ ...form, clientAddress: e.target.value })} placeholder="Ulica 1, 10000 Zagreb" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>OIB</label>
            <input type="text" value={form.clientOib} onChange={e => setForm({ ...form, clientOib: e.target.value })} placeholder="12345678901" className={inputCls} />
          </div>
        </div>
      </div>

      {/* Quote basics */}
      <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-medium text-[#F2F2F2] mb-4">Ponuda</h2>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Naslov</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Pregled usluge (prazno = automatski tekst)</label>
            <textarea value={form.overview} onChange={e => setForm({ ...form, overview: e.target.value })} rows={4} placeholder="Kratki opis: što održavamo, koje integracije, na što pazimo..." className={inputCls} />
          </div>
          <div className="max-w-[200px]">
            <label className={labelCls}>Satnica za dodatni rad (€/h)</label>
            <input type="number" value={form.hourlyRate} onChange={e => setForm({ ...form, hourlyRate: e.target.value })} className={inputCls} />
          </div>
        </div>
      </div>

      {/* Tiers */}
      <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-medium text-[#F2F2F2] mb-1">Paketi</h2>
        <p className="text-sm text-[#8E8E8E] mb-5">Klijent bira jedan od tri paketa na stranici ponude. Zvjezdica označava preporučeni.</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {form.tiers.map((tier, index) => (
            <div key={tier.id} className={`rounded-xl border p-4 ${form.recommendedTier === tier.id ? 'border-[#00FF94]/40' : 'border-white/[0.07]'}`}>
              <div className="flex items-center justify-between mb-3">
                <input
                  type="text"
                  value={tier.name}
                  onChange={e => updateTier(index, 'name', e.target.value)}
                  className="bg-transparent text-[#F2F2F2] font-medium focus:outline-none border-b border-transparent focus:border-white/25 w-28"
                />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, recommendedTier: tier.id })}
                  title="Označi kao preporučeni"
                  className={form.recommendedTier === tier.id ? 'text-[#00FF94]' : 'text-[#5C5C5C] hover:text-[#C9C9C9]'}
                >
                  <Star size={16} fill={form.recommendedTier === tier.id ? 'currentColor' : 'none'} />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className={labelCls}>Cijena €/mj</label>
                  <input type="number" value={tier.price} onChange={e => updateTier(index, 'price', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Sati rada (npr. 3 ili 10+)</label>
                  <input type="text" value={tier.hours} onChange={e => updateTier(index, 'hours', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Oznaka sati (prikaz)</label>
                  <input type="text" value={tier.hoursLabel} onChange={e => updateTier(index, 'hoursLabel', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Kratki opis</label>
                  <input type="text" value={tier.tagline} onChange={e => updateTier(index, 'tagline', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Featuri (jedan po retku)</label>
                  <textarea value={tier.featuresText} onChange={e => updateTier(index, 'featuresText', e.target.value)} rows={6} className={`${inputCls} text-sm`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shared sections */}
      <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-medium text-[#F2F2F2] mb-4">Zajedničke stavke</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Uključeno u sve pakete (jedan po retku)</label>
            <textarea value={form.includedInAllText} onChange={e => setForm({ ...form, includedInAllText: e.target.value })} rows={7} className={`${inputCls} text-sm`} />
          </div>
          <div>
            <label className={labelCls}>Što nije uključeno (jedan po retku)</label>
            <textarea value={form.notIncludedText} onChange={e => setForm({ ...form, notIncludedText: e.target.value })} rows={7} className={`${inputCls} text-sm`} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-16">
        <button
          onClick={handleCreate}
          disabled={saving}
          className="inline-flex items-center gap-2 px-8 py-3 bg-[#F2F2F2] text-[#080808] rounded-full font-medium hover:bg-white transition-all disabled:opacity-60"
        >
          {saving && <Loader2 size={18} className="animate-spin" />}
          {saving ? 'Kreiranje...' : 'Kreiraj ponudu'}
        </button>
        <span className="text-sm text-[#5C5C5C]">Revolut link se kreira tek kad klijent odabere paket</span>
      </div>
    </div>
  );
}
