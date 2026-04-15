// app/(crm-admin)/crm/quotes/builder/page.jsx
// Internal Quote Builder - Streamlined page to assemble quotes by clicking predefined packages

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/Toast';
import {
  ArrowLeft,
  Globe,
  Smartphone,
  Users,
  Mic,
  Camera,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Calculator,
  FileText,
  Plus,
  Minus
} from 'lucide-react';

import {
  WEB_PACKAGES,
  MAINTENANCE_TIERS,
  APP_PACKAGES,
  SOCIAL_PLANS,
  CONTENT_TYPES,
  PODCAST_STUDIO_PRICING,
  ADDITIONAL_PRICING,
  getMaintenanceTierForPackage,
  getPodcastStudioPrice,
  shouldWaiveOnboarding,
  DEFAULT_SERVICE_SELECTIONS
} from '@/lib/pricingConstants';

import {
  calculateQuoteFromSelections,
  generateQuoteData,
  validateSelections,
  formatCurrency
} from '@/lib/quoteCalculations';

export default function QuoteBuilderPage() {
  const router = useRouter();
  const toast = useToast();
  const [saving, setSaving] = useState(false);

  // Client Info
  const [clientInfo, setClientInfo] = useState({
    name: '',
    company: '',
    email: '',
    projectTitle: '',
    notes: ''
  });

  // Service Selections
  const [selections, setSelections] = useState({ ...DEFAULT_SERVICE_SELECTIONS });

  // Expanded sections
  const [expandedSections, setExpandedSections] = useState({
    webDevelopment: false,
    appDevelopment: false,
    socialMedia: false,
    podcastStudio: false,
    additionalServices: false
  });

  // Calculate quote whenever selections change
  const [quoteResult, setQuoteResult] = useState({ lineItems: { oneTime: [], monthly: [] }, summary: null });

  useEffect(() => {
    const result = calculateQuoteFromSelections(selections);
    setQuoteResult(result);
  }, [selections]);

  // Auto-update maintenance tier when web package changes
  useEffect(() => {
    if (selections.webDevelopment.enabled && selections.webDevelopment.package) {
      const tier = getMaintenanceTierForPackage(selections.webDevelopment.package);
      setSelections(prev => ({
        ...prev,
        webDevelopment: {
          ...prev.webDevelopment,
          maintenance: {
            ...prev.webDevelopment.maintenance,
            tier: tier.id
          }
        }
      }));
    }
  }, [selections.webDevelopment.package]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleService = (service) => {
    setSelections(prev => ({
      ...prev,
      [service]: {
        ...prev[service],
        enabled: !prev[service].enabled
      }
    }));
    // Auto-expand when enabling
    if (!selections[service]?.enabled) {
      setExpandedSections(prev => ({ ...prev, [service]: true }));
    }
  };

  const updateSelection = (service, field, value) => {
    setSelections(prev => ({
      ...prev,
      [service]: {
        ...prev[service],
        [field]: value
      }
    }));
  };

  const updateNestedSelection = (service, parent, field, value) => {
    setSelections(prev => ({
      ...prev,
      [service]: {
        ...prev[service],
        [parent]: {
          ...prev[service][parent],
          [field]: value
        }
      }
    }));
  };

  const updateContentQuantity = (contentType, quantity) => {
    setSelections(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        contentQuantities: {
          ...prev.socialMedia.contentQuantities,
          [contentType]: Math.max(0, quantity)
        }
      }
    }));
  };

  const updateCustomPlan = (field, value) => {
    setSelections(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        customPlan: {
          ...prev.socialMedia.customPlan,
          [field]: value
        }
      }
    }));
  };

  const updateCustomDeliverable = (contentType, weekly) => {
    setSelections(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        customPlan: {
          ...prev.socialMedia.customPlan,
          contentDeliverables: {
            ...prev.socialMedia.customPlan?.contentDeliverables,
            [contentType]: { weekly: Math.max(0, weekly) }
          }
        }
      }
    }));
  };

  const addCustomFeature = (feature) => {
    if (!feature.trim()) return;
    setSelections(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        customPlan: {
          ...prev.socialMedia.customPlan,
          features: [...(prev.socialMedia.customPlan?.features || []), feature.trim()]
        }
      }
    }));
  };

  const removeCustomFeature = (index) => {
    setSelections(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        customPlan: {
          ...prev.socialMedia.customPlan,
          features: prev.socialMedia.customPlan?.features?.filter((_, i) => i !== index) || []
        }
      }
    }));
  };

  const handleSubmit = async () => {
    // Validate
    const validation = validateSelections(selections);
    if (!validation.valid) {
      toast.error(validation.errors[0]);
      return;
    }

    if (!clientInfo.name) {
      toast.error('Unesite ime klijenta');
      return;
    }

    setSaving(true);

    try {
      const quoteData = generateQuoteData(selections, clientInfo);

      const { data, error } = await supabase
        .from('quotes')
        .insert([quoteData])
        .select()
        .single();

      if (error) throw error;

      toast.success('Ponuda kreirana!');
      router.push(`/crm/quotes/${data.id}`);
    } catch (error) {
      console.error('Error creating quote:', error);
      toast.error('Greška pri kreiranju ponude');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fadeIn pb-40">
      {/* Header */}
      <Link
        href="/crm/quotes"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00FF94] mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Natrag na ponude
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div className="mb-8">
            <h1 className="text-4xl font-black bg-gradient-to-r from-[#00FF94] to-[#00CC76] bg-clip-text text-transparent mb-2">
              Quote Builder
            </h1>
            <p className="text-gray-400">Brzo sastavi ponudu odabirom paketa</p>
          </div>

          {/* Client Info */}
          <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FileText size={20} className="text-[#00FF94]" />
              Podaci o klijentu
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Ime klijenta *</label>
                <input
                  type="text"
                  value={clientInfo.name}
                  onChange={(e) => setClientInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                  placeholder="Ivan Horvat"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Tvrtka</label>
                <input
                  type="text"
                  value={clientInfo.company}
                  onChange={(e) => setClientInfo(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                  placeholder="Tvrtka d.o.o."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={clientInfo.email}
                  onChange={(e) => setClientInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                  placeholder="ivan@tvrtka.hr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Naslov ponude</label>
                <input
                  type="text"
                  value={clientInfo.projectTitle}
                  onChange={(e) => setClientInfo(prev => ({ ...prev, projectTitle: e.target.value }))}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                  placeholder="Web stranica za Tvrtka d.o.o."
                />
              </div>
            </div>
          </div>

          {/* Web Development */}
          <ServiceCard
            title="Web Development"
            icon={<Globe size={24} />}
            enabled={selections.webDevelopment.enabled}
            expanded={expandedSections.webDevelopment}
            onToggle={() => toggleService('webDevelopment')}
            onExpand={() => toggleSection('webDevelopment')}
          >
            {/* Package Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-3">Odaberi paket</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.values(WEB_PACKAGES).map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    name={pkg.nameHr}
                    price={pkg.price}
                    description={pkg.description}
                    features={pkg.features}
                    selected={selections.webDevelopment.package === pkg.id}
                    onClick={() => updateSelection('webDevelopment', 'package', pkg.id)}
                  />
                ))}
              </div>
            </div>

            {/* Maintenance Toggle */}
            {selections.webDevelopment.package && (
              <div className="border-t border-[#2A2A2A] pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-white font-semibold">Održavanje i podrška</h4>
                    <p className="text-sm text-gray-500">Mjesečno održavanje web stranice</p>
                  </div>
                  <ToggleSwitch
                    enabled={selections.webDevelopment.maintenance.enabled}
                    onChange={(enabled) => updateNestedSelection('webDevelopment', 'maintenance', 'enabled', enabled)}
                  />
                </div>

                {selections.webDevelopment.maintenance.enabled && (
                  <div className="bg-[#0a0a0a] rounded-xl p-4">
                    {(() => {
                      const tier = MAINTENANCE_TIERS[selections.webDevelopment.maintenance.tier];
                      return tier ? (
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-white font-medium">{tier.nameHr}</span>
                            <span className="text-gray-500 ml-2">- {tier.description}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-[#00FF94] font-bold">{formatCurrency(tier.monthlyPrice)}/mj</div>
                            <div className="text-xs text-gray-500">{formatCurrency(tier.monthlyPrice * 12)}/god</div>
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>
            )}
          </ServiceCard>

          {/* App Development */}
          <ServiceCard
            title="App Development"
            icon={<Smartphone size={24} />}
            enabled={selections.appDevelopment.enabled}
            expanded={expandedSections.appDevelopment}
            onToggle={() => toggleService('appDevelopment')}
            onExpand={() => toggleSection('appDevelopment')}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.values(APP_PACKAGES).map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  name={pkg.nameHr}
                  price={pkg.price}
                  description={pkg.description}
                  features={pkg.features}
                  selected={selections.appDevelopment.package === pkg.id}
                  onClick={() => updateSelection('appDevelopment', 'package', pkg.id)}
                  isCustomPrice={pkg.id === 'enterprise'}
                />
              ))}
            </div>

            {selections.appDevelopment.package === 'enterprise' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">Custom cijena (EUR)</label>
                <input
                  type="number"
                  value={selections.appDevelopment.customPrice || ''}
                  onChange={(e) => updateSelection('appDevelopment', 'customPrice', Number(e.target.value))}
                  className="w-full max-w-xs px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                  placeholder="10000"
                />
              </div>
            )}
          </ServiceCard>

          {/* Social Media */}
          <ServiceCard
            title="Social Media Management"
            icon={<Users size={24} />}
            enabled={selections.socialMedia.enabled}
            expanded={expandedSections.socialMedia}
            onToggle={() => toggleService('socialMedia')}
            onExpand={() => toggleSection('socialMedia')}
          >
            {/* Plan Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-3">Odaberi plan</label>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Object.values(SOCIAL_PLANS).filter(p => p.id !== 'custom').map((plan) => (
                  <PackageCard
                    key={plan.id}
                    name={plan.nameHr}
                    price={plan.managementPrice}
                    priceLabel="/mj"
                    description={plan.description}
                    features={plan.features}
                    selected={selections.socialMedia.plan === plan.id}
                    onClick={() => updateSelection('socialMedia', 'plan', plan.id)}
                    highlight={`${plan.postsPerMonth} objava, max ${plan.maxPhotos} foto`}
                  />
                ))}
                {/* Custom Plan Card */}
                <PackageCard
                  name="Prilagođeni"
                  price={null}
                  priceLabel=""
                  description="Prilagođeni paket po vašim potrebama"
                  features={['Fleksibilni sadržaj', 'Prilagođene usluge', 'Custom cijena']}
                  selected={selections.socialMedia.plan === 'custom'}
                  onClick={() => updateSelection('socialMedia', 'plan', 'custom')}
                  isCustomPrice={true}
                  highlight="Potpuna kontrola"
                />
              </div>
            </div>

            {/* Custom Plan Configuration */}
            {selections.socialMedia.plan === 'custom' && (
              <div className="border-t border-[#2A2A2A] pt-6 mb-6">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Sparkles size={16} className="text-[#00FF94]" />
                  Prilagođeni paket - Konfiguracija
                </h4>

                {/* Custom Management Price */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Mjesečna cijena upravljanja (EUR) *</label>
                  <input
                    type="number"
                    value={selections.socialMedia.customPlan?.managementPrice || ''}
                    onChange={(e) => updateCustomPlan('managementPrice', Number(e.target.value) || null)}
                    className="w-full max-w-xs px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                    placeholder="450"
                  />
                </div>

                {/* Weekly Content Deliverables */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-3">Sadržaj tjedno (automatski se računa mjesečno × 4)</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.values(CONTENT_TYPES).map((content) => {
                      const weekly = selections.socialMedia.customPlan?.contentDeliverables?.[content.id]?.weekly || 0;
                      const monthly = weekly * 4;

                      return (
                        <div key={content.id} className="bg-[#0a0a0a] rounded-xl p-3">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm text-gray-300">{content.nameHr}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateCustomDeliverable(content.id, weekly - 1)}
                              className="w-8 h-8 rounded-lg bg-[#2A2A2A] text-white flex items-center justify-center hover:bg-[#3A3A3A] transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-white font-medium">{weekly}</span>
                            <button
                              onClick={() => updateCustomDeliverable(content.id, weekly + 1)}
                              className="w-8 h-8 rounded-lg bg-[#2A2A2A] text-white flex items-center justify-center hover:bg-[#3A3A3A] transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          {weekly > 0 && (
                            <div className="text-xs text-[#00FF94] mt-2">
                              {weekly}/tj = {monthly}/mj
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Features */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-3">Uključene usluge</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(selections.socialMedia.customPlan?.features || []).map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#00FF94]/10 border border-[#00FF94]/30 rounded-full text-sm text-[#00FF94]"
                      >
                        {feature}
                        <button
                          onClick={() => removeCustomFeature(index)}
                          className="ml-1 hover:text-white transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="newFeatureInput"
                      className="flex-1 max-w-xs px-4 py-2 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white text-sm focus:border-[#00FF94] focus:outline-none transition-colors"
                      placeholder="Nova usluga..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addCustomFeature(e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById('newFeatureInput');
                        addCustomFeature(input.value);
                        input.value = '';
                      }}
                      className="px-4 py-2 bg-[#2A2A2A] text-white rounded-xl hover:bg-[#3A3A3A] transition-colors text-sm"
                    >
                      Dodaj
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Content Production */}
            {selections.socialMedia.plan && (
              <div className="border-t border-[#2A2A2A] pt-6">
                <h4 className="text-white font-semibold mb-4">Produkcija sadržaja (mjesečno) - dodatna naplata</h4>
                <p className="text-sm text-gray-500 mb-4">
                  {selections.socialMedia.plan === 'custom'
                    ? 'Ako trebate dodatnu produkciju sadržaja uz prilagođeni paket, odaberite količine ispod.'
                    : 'Odaberite količine za dodatnu produkciju sadržaja.'}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.values(CONTENT_TYPES).map((content) => {
                    const quantity = selections.socialMedia.contentQuantities[content.id] || 0;
                    const plan = SOCIAL_PLANS[selections.socialMedia.plan];
                    const isCustomPlan = selections.socialMedia.plan === 'custom';
                    const maxPhotos = !isCustomPlan && content.id === 'fotografija' ? plan?.maxPhotos : null;

                    return (
                      <div key={content.id} className="bg-[#0a0a0a] rounded-xl p-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm text-gray-300">{content.nameHr}</span>
                          <span className="text-xs text-[#00FF94]">{formatCurrency(content.price)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateContentQuantity(content.id, quantity - 1)}
                            className="w-8 h-8 rounded-lg bg-[#2A2A2A] text-white flex items-center justify-center hover:bg-[#3A3A3A] transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-white font-medium">{quantity}</span>
                          <button
                            onClick={() => {
                              const newQty = quantity + 1;
                              if (maxPhotos && newQty > maxPhotos) {
                                toast.warning(`Max ${maxPhotos} fotografija za ${plan.nameHr} plan`);
                                return;
                              }
                              updateContentQuantity(content.id, newQty);
                            }}
                            className="w-8 h-8 rounded-lg bg-[#2A2A2A] text-white flex items-center justify-center hover:bg-[#3A3A3A] transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        {maxPhotos && (
                          <div className="text-xs text-gray-500 mt-1">Max: {maxPhotos}</div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Contract Length & Onboarding */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Trajanje ugovora</label>
                    <select
                      value={selections.socialMedia.contractLength}
                      onChange={(e) => updateSelection('socialMedia', 'contractLength', Number(e.target.value))}
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2A2A2A] rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-colors"
                    >
                      <option value={1}>1 mjesec</option>
                      <option value={3}>3 mjeseca</option>
                      <option value={6}>6 mjeseci (bez onboardinga)</option>
                      <option value={12}>12 mjeseci (bez onboardinga)</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <ToggleSwitch
                      enabled={selections.socialMedia.includeOnboarding && !shouldWaiveOnboarding(selections.socialMedia.contractLength)}
                      onChange={(enabled) => updateSelection('socialMedia', 'includeOnboarding', enabled)}
                      disabled={shouldWaiveOnboarding(selections.socialMedia.contractLength)}
                    />
                    <div>
                      <span className="text-white">Onboarding</span>
                      <span className="text-gray-500 ml-2">
                        {shouldWaiveOnboarding(selections.socialMedia.contractLength)
                          ? '(besplatno kod 6+ mjeseci)'
                          : `(${formatCurrency(ADDITIONAL_PRICING.onboarding.price)})`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ServiceCard>

          {/* Podcast Studio */}
          <ServiceCard
            title="Podcast Studio"
            icon={<Mic size={24} />}
            enabled={selections.podcastStudio.enabled}
            expanded={expandedSections.podcastStudio}
            onToggle={() => toggleService('podcastStudio')}
            onExpand={() => toggleSection('podcastStudio')}
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-3">Trajanje snimanja</label>
              <div className="flex flex-wrap gap-3">
                {Object.values(PODCAST_STUDIO_PRICING).map((duration) => (
                  <button
                    key={duration.id}
                    onClick={() => updateSelection('podcastStudio', 'duration', duration.id)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      selections.podcastStudio.duration === duration.id
                        ? 'bg-[#00FF94] text-black'
                        : 'bg-[#2A2A2A] text-white hover:bg-[#3A3A3A]'
                    }`}
                  >
                    {duration.nameHr}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-3">Broj shortova</label>
              <div className="flex flex-wrap gap-3">
                {[5, 10, 15].map((count) => {
                  const price = getPodcastStudioPrice(selections.podcastStudio.duration, count);
                  const isAvailable = price !== null;

                  return (
                    <button
                      key={count}
                      onClick={() => isAvailable && updateSelection('podcastStudio', 'shortsPackage', count)}
                      disabled={!isAvailable}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        selections.podcastStudio.shortsPackage === count
                          ? 'bg-[#00FF94] text-black'
                          : isAvailable
                            ? 'bg-[#2A2A2A] text-white hover:bg-[#3A3A3A]'
                            : 'bg-[#1a1a1a] text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      {count} shorts
                      {!isAvailable && <span className="ml-1 text-xs">(N/A)</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Display */}
            {selections.podcastStudio.duration && selections.podcastStudio.shortsPackage && (
              <div className="bg-[#0a0a0a] rounded-xl p-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Cijena po snimanju</span>
                  <span className="text-xl font-bold text-[#00FF94]">
                    {formatCurrency(getPodcastStudioPrice(selections.podcastStudio.duration, selections.podcastStudio.shortsPackage))}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Jednokratna cijena za jedno snimanje</p>
              </div>
            )}
          </ServiceCard>

          {/* Additional Services */}
          <ServiceCard
            title="Dodatne usluge"
            icon={<Camera size={24} />}
            enabled={selections.additionalFilmingDays > 0}
            expanded={expandedSections.additionalServices}
            onToggle={() => {
              if (selections.additionalFilmingDays === 0) {
                setSelections(prev => ({ ...prev, additionalFilmingDays: 1 }));
              } else {
                setSelections(prev => ({ ...prev, additionalFilmingDays: 0 }));
              }
            }}
            onExpand={() => toggleSection('additionalServices')}
          >
            <div className="flex items-center gap-4">
              <div>
                <span className="text-white">Dodatni dani snimanja</span>
                <span className="text-gray-500 ml-2">({formatCurrency(ADDITIONAL_PRICING.additionalFilmingDay.price)}/dan)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelections(prev => ({ ...prev, additionalFilmingDays: Math.max(0, prev.additionalFilmingDays - 1) }))}
                  className="w-10 h-10 rounded-xl bg-[#2A2A2A] text-white flex items-center justify-center hover:bg-[#3A3A3A] transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center text-xl font-bold text-white">{selections.additionalFilmingDays}</span>
                <button
                  onClick={() => setSelections(prev => ({ ...prev, additionalFilmingDays: prev.additionalFilmingDays + 1 }))}
                  className="w-10 h-10 rounded-xl bg-[#2A2A2A] text-white flex items-center justify-center hover:bg-[#3A3A3A] transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </ServiceCard>
        </div>

        {/* Sticky Sidebar - Quote Summary */}
        <div className="lg:w-[400px]">
          <div className="lg:sticky lg:top-8">
            <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Calculator size={20} className="text-[#00FF94]" />
                Pregled ponude
              </h2>

              {/* One-time fees */}
              {quoteResult.lineItems.oneTime.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Jednokratno</h3>
                  <div className="space-y-2">
                    {quoteResult.lineItems.oneTime.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-300">{item.name}</span>
                        <span className="text-white font-medium">{formatCurrency(item.price)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#2A2A2A] mt-3 pt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Međuzbroj</span>
                      <span className="text-white">{formatCurrency(quoteResult.summary?.oneTime?.subtotal || 0)}</span>
                    </div>
                    {quoteResult.summary?.oneTime?.discount > 0 && (
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-[#00FF94]">Bundle popust (10%)</span>
                        <span className="text-[#00FF94]">-{formatCurrency(quoteResult.summary.oneTime.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold mt-2">
                      <span className="text-white">Ukupno</span>
                      <span className="text-[#00FF94]">{formatCurrency(quoteResult.summary?.oneTime?.total || 0)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Monthly fees */}
              {quoteResult.lineItems.monthly.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Mjesečno</h3>
                  <div className="space-y-2">
                    {quoteResult.lineItems.monthly.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-300 truncate pr-2">{item.name}</span>
                        <span className="text-white font-medium whitespace-nowrap">{formatCurrency(item.monthlyPrice)}/mj</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#2A2A2A] mt-3 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-white">Mjesečno ukupno</span>
                      <span className="text-purple-400">{formatCurrency(quoteResult.summary?.monthly?.total || 0)}/mj</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>Godišnje</span>
                      <span>{formatCurrency((quoteResult.summary?.monthly?.total || 0) * 12)}/god</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Bundle discount notice */}
              {quoteResult.summary?.bundleDiscount?.eligible && (
                <div className="bg-[#00FF94]/10 border border-[#00FF94]/20 rounded-xl p-3 mb-6">
                  <div className="flex items-center gap-2 text-[#00FF94] text-sm">
                    <Sparkles size={16} />
                    <span>Bundle popust aktiviran! (-10%)</span>
                  </div>
                </div>
              )}

              {/* Empty state */}
              {quoteResult.lineItems.oneTime.length === 0 && quoteResult.lineItems.monthly.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Calculator size={40} className="mx-auto mb-3 opacity-50" />
                  <p>Odaberi usluge za izračun</p>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleSubmit}
                disabled={saving || (quoteResult.lineItems.oneTime.length === 0 && quoteResult.lineItems.monthly.length === 0)}
                className="w-full mt-4 px-6 py-4 bg-[#00FF94] text-black rounded-xl font-bold hover:shadow-lg hover:shadow-[#00FF94]/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none flex items-center justify-center gap-2"
              >
                {saving ? (
                  'Kreiram ponudu...'
                ) : (
                  <>
                    <FileText size={20} />
                    Generiraj ponudu
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

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

// Service Card Component
function ServiceCard({ title, icon, enabled, expanded, onToggle, onExpand, children }) {
  return (
    <div className={`bg-[#1a1a1a] border rounded-2xl overflow-hidden transition-all ${
      enabled ? 'border-[#00FF94]' : 'border-[#2A2A2A]'
    }`}>
      <div
        className="flex items-center justify-between p-5 cursor-pointer"
        onClick={onExpand}
      >
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            enabled ? 'bg-[#00FF94]/20 text-[#00FF94]' : 'bg-[#2A2A2A] text-gray-400'
          }`}>
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            {enabled && <span className="text-sm text-[#00FF94]">Aktivno</span>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ToggleSwitch enabled={enabled} onChange={onToggle} />
          <button className="text-gray-400 hover:text-white transition-colors">
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {expanded && enabled && (
        <div className="px-5 pb-5 border-t border-[#2A2A2A] pt-5">
          {children}
        </div>
      )}
    </div>
  );
}

// Package Card Component
function PackageCard({ name, price, priceLabel = '', description, features, selected, onClick, highlight, isCustomPrice }) {
  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all ${
        selected
          ? 'border-[#00FF94] bg-[#00FF94]/10'
          : 'border-[#2A2A2A] bg-[#0a0a0a] hover:border-[#3A3A3A]'
      }`}
    >
      {selected && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#00FF94] flex items-center justify-center">
          <Check size={14} className="text-black" />
        </div>
      )}
      <h4 className="text-lg font-bold text-white mb-1">{name}</h4>
      {highlight && (
        <div className="text-xs text-[#00FF94] mb-2">{highlight}</div>
      )}
      <div className="text-2xl font-black text-[#00FF94] mb-2">
        {isCustomPrice ? 'Custom' : (
          <>
            {formatCurrency(price)}
            <span className="text-sm font-normal text-gray-400">{priceLabel}</span>
          </>
        )}
      </div>
      <p className="text-sm text-gray-500 mb-3">{description}</p>
      {features && features.length > 0 && (
        <ul className="space-y-1">
          {features.slice(0, 4).map((feature, index) => (
            <li key={index} className="text-xs text-gray-400 flex items-start gap-2">
              <span className="text-[#00FF94] mt-0.5">•</span>
              {feature}
            </li>
          ))}
          {features.length > 4 && (
            <li className="text-xs text-gray-500">+{features.length - 4} više...</li>
          )}
        </ul>
      )}
    </div>
  );
}

// Toggle Switch Component
function ToggleSwitch({ enabled, onChange, disabled }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onChange(!enabled);
      }}
      disabled={disabled}
      className={`relative w-12 h-6 rounded-full transition-all ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${enabled ? 'bg-[#00FF94]' : 'bg-[#2A2A2A]'}`}
    >
      <div
        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-7' : 'translate-x-1'
        }`}
      />
    </button>
  );
}
