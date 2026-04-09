// app/(quote-preview)/questionnaire/page.jsx
// Public Client Questionnaire - Ninefold branded with GSAP animations

'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { gsap } from 'gsap';
import {
  Globe,
  Smartphone,
  Users,
  Mic,
  ArrowRight,
  ArrowLeft,
  Check,
  Send,
  Plus,
  Minus,
  HelpCircle
} from 'lucide-react';

import {
  WEB_PACKAGES,
  APP_PACKAGES,
  SOCIAL_PLANS,
  PODCAST_STUDIO_PRICING,
  getMaintenanceTierForPackage,
  getPodcastStudioPrice,
  DEFAULT_SERVICE_SELECTIONS
} from '@/lib/pricingConstants';

import {
  calculateQuoteFromSelections,
  formatCurrency
} from '@/lib/quoteCalculations';

// Content types for questionnaire - ALL types with preview media
const QUESTIONNAIRE_CONTENT_TYPES = [
  { id: 'fotografija', name: 'Fotografija', price: 20, isPhoto: true, preview: '/images/content/fotografija.jpg', previewType: 'image' },
  { id: 'talkingHead', name: 'Talking Head', price: 40, preview: '/images/content/talking-head.mp4', previewType: 'video' },
  { id: 'shortFormPodcast', name: 'Kratki Podcast', price: 25, preview: '/images/content/short-form-podcast.mp4', previewType: 'video' },
  { id: 'videoCarousel', name: 'Video Carousel', price: 40, preview: '/images/content/video-carousel.mp4', previewType: 'video' },
  { id: 'journeyVlog', name: 'Journey Vlog', price: 50, preview: '/images/content/journey-vlog.mp4', previewType: 'video' },
  { id: 'highlightReel', name: 'Highlight Reel', price: 60, preview: '/images/content/highlight-reel.mp4', previewType: 'video' },
  { id: 'edit', name: 'Montaža', price: 80, preview: '/images/content/edit.mp4', previewType: 'video' },
  { id: 'documentary', name: 'Dokumentarac', price: 150, preview: '/images/content/documentary.mp4', previewType: 'video' },
  { id: 'complexTalkingHead', name: 'Kompleksni Talking Head', price: 70, preview: '/images/content/complex-talking-head.mp4', previewType: 'video' },
  { id: 'netflixStyle', name: 'Netflix Stil', price: 100, preview: '/images/content/netflix-style.mp4', previewType: 'video' },
  { id: 'sketch', name: 'Sketch', price: 40, preview: '/images/content/sketch.mp4', previewType: 'video' }
];

// Service options
const SERVICE_OPTIONS = [
  { id: 'socialMedia', name: 'Društvene Mreže', description: 'Upravljanje i produkcija sadržaja', icon: Users },
  { id: 'webDevelopment', name: 'Web Stranica', description: 'Moderna i funkcionalna web stranica', icon: Globe },
  { id: 'appDevelopment', name: 'Aplikacija', description: 'Web aplikacija po mjeri', icon: Smartphone },
  { id: 'podcastStudio', name: 'Podcast Studio', description: 'Snimanje i produkcija podcasta', icon: Mic }
];

export default function QuestionnairePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [selections, setSelections] = useState({ ...DEFAULT_SERVICE_SELECTIONS });
  const [contactInfo, setContactInfo] = useState({ name: '', company: '', email: '', phone: '' });

  // Refs for GSAP
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const cardsRef = useRef([]);

  // Build dynamic steps
  const steps = useMemo(() => {
    const dynamicSteps = [{ id: 'services', title: 'Odaberi usluge', type: 'services' }];
    if (selectedServices.includes('socialMedia')) {
      dynamicSteps.push(
        { id: 'social-plan', title: 'Odaberi plan', type: 'social-plan' },
        { id: 'social-content', title: 'Dodaj sadržaj', type: 'social-content' }
      );
    }
    if (selectedServices.includes('webDevelopment')) {
      dynamicSteps.push({ id: 'web-package', title: 'Web paket', type: 'web-package' });
    }
    if (selectedServices.includes('appDevelopment')) {
      dynamicSteps.push({ id: 'app-package', title: 'App paket', type: 'app-package' });
    }
    if (selectedServices.includes('podcastStudio')) {
      dynamicSteps.push({ id: 'podcast', title: 'Podcast', type: 'podcast' });
    }
    dynamicSteps.push(
      { id: 'contact', title: 'Kontakt', type: 'contact' },
      { id: 'summary', title: 'Pregled', type: 'summary' }
    );
    return dynamicSteps;
  }, [selectedServices]);

  // Hide website chrome
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'questionnaire-styles';
    style.innerHTML = `
      body > header, body > footer, body > nav,
      .gradual-blur, .gradual-blur-page { display: none !important; }
      body { background: #000 !important; }
    `;
    document.head.appendChild(style);
    return () => document.getElementById('questionnaire-styles')?.remove();
  }, []);

  // GSAP animations on step change
  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    }
    // Animate cards with stagger
    if (cardsRef.current.length > 0) {
      gsap.fromTo(cardsRef.current.filter(Boolean),
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
      );
    }
  }, [currentStep]);

  // Auto-update maintenance tier
  useEffect(() => {
    if (selections.webDevelopment.enabled && selections.webDevelopment.package) {
      const tier = getMaintenanceTierForPackage(selections.webDevelopment.package);
      setSelections(prev => ({
        ...prev,
        webDevelopment: { ...prev.webDevelopment, maintenance: { ...prev.webDevelopment.maintenance, tier: tier.id } }
      }));
    }
  }, [selections.webDevelopment.package]);

  // Calculate totals
  const quoteResult = calculateQuoteFromSelections(selections);
  const totalMonthly = quoteResult.summary?.monthly?.total || 0;
  const totalOneTime = quoteResult.summary?.oneTime?.total || 0;

  // Content stats
  const selectedPlan = selections.socialMedia.plan ? SOCIAL_PLANS[selections.socialMedia.plan] : null;
  const contentQuantities = selections.socialMedia.contentQuantities || {};
  const totalContentCount = Object.values(contentQuantities).reduce((sum, qty) => sum + qty, 0);
  const photoCount = contentQuantities.fotografija || 0;
  const maxPosts = selectedPlan?.postsPerMonth || 0;
  const maxPhotos = selectedPlan?.maxPhotos || 0;

  const toggleService = (serviceId) => {
    setSelectedServices(prev =>
      prev.includes(serviceId) ? prev.filter(id => id !== serviceId) : [...prev, serviceId]
    );
    setSelections(prev => ({ ...prev, [serviceId]: { ...prev[serviceId], enabled: !prev[serviceId]?.enabled } }));
  };

  const updateSelection = (service, field, value) => {
    setSelections(prev => ({ ...prev, [service]: { ...prev[service], [field]: value } }));
  };

  const updateContentQuantity = (contentType, delta) => {
    const currentQty = contentQuantities[contentType] || 0;
    const newQty = Math.max(0, currentQty + delta);
    const isPhoto = contentType === 'fotografija';
    const newTotalCount = totalContentCount - currentQty + newQty;

    if (isPhoto && newQty > maxPhotos) return;
    if (newTotalCount > maxPosts) return;

    setSelections(prev => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, contentQuantities: { ...prev.socialMedia.contentQuantities, [contentType]: newQty } }
    }));
  };

  const goNext = () => {
    if (currentStep < steps.length - 1) {
      cardsRef.current = [];
      setCurrentStep(prev => prev + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      cardsRef.current = [];
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceed = () => {
    const step = steps[currentStep];
    if (step.type === 'services') return selectedServices.length > 0;
    if (step.type === 'social-plan') return !!selections.socialMedia.plan;
    if (step.type === 'social-content') return totalContentCount === maxPosts;
    if (step.type === 'contact') return contactInfo.name.trim() && contactInfo.email.trim();
    return true;
  };

  const handleSubmit = async () => {
    if (!contactInfo.name.trim() || !contactInfo.email.trim()) {
      setError('Molimo unesite ime i email');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/questionnaire/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactInfo, serviceSelections: selections })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Greška');
      router.push('/questionnaire/thank-you');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNeedHelp = () => {
    window.location.href = 'mailto:hello@ninefold.co?subject=Trebam pomoć s odabirom usluga';
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white">
      {/* Price Box */}
      <div className="fixed top-24 right-6 z-50 hidden lg:block">
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl overflow-hidden w-[260px] shadow-2xl shadow-black/50">
          {/* Header */}
          <div className="bg-[#111] px-5 py-4 border-b border-[#1a1a1a]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-[#666]">Vaša ponuda</span>
              <div className="w-2 h-2 rounded-full bg-[#00FF94] animate-pulse" />
            </div>
          </div>

          {/* Content */}
          <div className="px-5 py-4">
            {/* Selected services */}
            {selectedServices.length > 0 ? (
              <div className="space-y-3 mb-4">
                {selectedServices.map(serviceId => {
                  const service = SERVICE_OPTIONS.find(s => s.id === serviceId);
                  const Icon = service?.icon;
                  let price = null;
                  let isMonthly = false;

                  if (serviceId === 'socialMedia' && selections.socialMedia.plan) {
                    const plan = SOCIAL_PLANS[selections.socialMedia.plan];
                    price = plan?.managementPrice || 0;
                    // Add content prices
                    const contentTotal = Object.entries(contentQuantities).reduce((sum, [id, qty]) => {
                      const ct = QUESTIONNAIRE_CONTENT_TYPES.find(c => c.id === id);
                      return sum + (ct?.price || 0) * qty;
                    }, 0);
                    price += contentTotal;
                    isMonthly = true;
                  } else if (serviceId === 'webDevelopment' && selections.webDevelopment.package) {
                    price = WEB_PACKAGES[selections.webDevelopment.package]?.price;
                  } else if (serviceId === 'appDevelopment' && selections.appDevelopment.package) {
                    price = APP_PACKAGES[selections.appDevelopment.package]?.price;
                  } else if (serviceId === 'podcastStudio' && selections.podcastStudio.duration && selections.podcastStudio.shortsPackage) {
                    price = getPodcastStudioPrice(selections.podcastStudio.duration, selections.podcastStudio.shortsPackage);
                    isMonthly = false; // One-time per session
                  }

                  return (
                    <div key={serviceId} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-[#00FF94]/10 flex items-center justify-center">
                          {Icon && <Icon size={12} className="text-[#00FF94]" />}
                        </div>
                        <span className="text-xs text-[#888]">{service?.name}</span>
                      </div>
                      {price !== null && (
                        <span className="text-xs font-medium text-white">
                          {formatCurrency(price)}{isMonthly && '/mj'}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-[#444] text-center py-4">Odaberite usluge</p>
            )}

            {/* Divider */}
            {(totalMonthly > 0 || totalOneTime > 0) && (
              <div className="border-t border-[#222] pt-4 space-y-2">
                {totalOneTime > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#666]">Jednokratno</span>
                    <span className="font-semibold text-white">{formatCurrency(totalOneTime)}</span>
                  </div>
                )}
                {totalMonthly > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#666]">Mjesečno</span>
                    <span className="font-bold text-[#00FF94]">{formatCurrency(totalMonthly)}/mj</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-[#111]">
            <div
              className="h-full bg-gradient-to-r from-[#00FF94] to-[#00cc7a] transition-all duration-700 ease-out"
              style={{ width: `${Math.min(100, ((totalMonthly + totalOneTime) / 1000) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-sm border-b border-[#111]">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <Image src="/ninefold.svg" alt="Ninefold" width={120} height={20} />
            <div className="flex items-center gap-6">
              <span className="text-sm text-[#666]">Korak {currentStep + 1}/{steps.length}</span>
              <button
                onClick={handleNeedHelp}
                className="flex items-center gap-2 px-4 py-2 text-sm text-[#00FF94] border border-[#00FF94]/30 rounded-full hover:bg-[#00FF94]/10 transition-all"
              >
                <HelpCircle size={16} />
                Trebam pomoć
              </button>
            </div>
          </div>
          {/* Progress */}
          <div className="mt-4 h-[2px] bg-[#222] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00FF94] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-48 px-6">
        <div ref={contentRef} className="max-w-4xl mx-auto">

          {/* Services Step */}
          {currentStepData.type === 'services' && (
            <div>
              <div className="text-center mb-16">
                <p className="text-[#00FF94] text-sm uppercase tracking-widest mb-4">Korak 1</p>
                <h1 className="text-5xl md:text-6xl font-bold mb-4">Što vas zanima?</h1>
                <p className="text-xl text-[#888]">Odaberite usluge koje želite istražiti</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {SERVICE_OPTIONS.map((service, i) => {
                  const Icon = service.icon;
                  const isSelected = selectedServices.includes(service.id);
                  return (
                    <button
                      key={service.id}
                      ref={el => cardsRef.current[i] = el}
                      onClick={() => toggleService(service.id)}
                      className={`group relative p-8 rounded-2xl border text-left transition-all duration-300 ${
                        isSelected
                          ? 'border-[#00FF94] bg-[#00FF94]/5'
                          : 'border-[#222] bg-[#0a0a0a] hover:border-[#333]'
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-colors ${
                        isSelected ? 'bg-[#00FF94] text-black' : 'bg-[#111] text-[#666] group-hover:text-white'
                      }`}>
                        <Icon size={28} />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                      <p className="text-[#666] text-sm">{service.description}</p>
                      {isSelected && (
                        <div className="absolute top-6 right-6 w-6 h-6 bg-[#00FF94] rounded-full flex items-center justify-center">
                          <Check size={14} className="text-black" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Social Plan Step */}
          {currentStepData.type === 'social-plan' && (
            <div>
              <div className="text-center mb-16">
                <p className="text-[#00FF94] text-sm uppercase tracking-widest mb-4">Social Media</p>
                <h1 className="text-5xl md:text-6xl font-bold mb-4">Odaberite plan</h1>
                <p className="text-xl text-[#888]">Koliko aktivno želite biti prisutni?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {Object.values(SOCIAL_PLANS).map((plan, i) => {
                  const isSelected = selections.socialMedia.plan === plan.id;
                  const isPopular = i === 1;
                  return (
                    <button
                      key={plan.id}
                      ref={el => cardsRef.current[i] = el}
                      onClick={() => {
                        updateSelection('socialMedia', 'plan', plan.id);
                        updateSelection('socialMedia', 'contentQuantities', {});
                      }}
                      className={`relative p-6 rounded-2xl border text-left transition-all duration-300 ${
                        isSelected
                          ? 'border-[#00FF94] bg-[#00FF94]/5'
                          : 'border-[#222] bg-[#0a0a0a] hover:border-[#333]'
                      }`}
                    >
                      {isPopular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#00FF94] text-black text-xs font-bold rounded-full">
                          Popularno
                        </div>
                      )}
                      <h3 className="text-lg font-semibold mb-2">{plan.nameHr}</h3>
                      <div className="text-3xl font-bold text-[#00FF94] mb-4">
                        {formatCurrency(plan.managementPrice)}
                        <span className="text-base font-normal text-[#666]">/mj</span>
                      </div>
                      <div className="space-y-2 text-sm text-[#888]">
                        <p>{plan.postsPerMonth} objava mjesečno</p>
                        <p>Max {plan.maxPhotos} fotografija</p>
                      </div>
                      {isSelected && (
                        <div className="absolute top-4 right-4 w-5 h-5 bg-[#00FF94] rounded-full flex items-center justify-center">
                          <Check size={12} className="text-black" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Social Content Step */}
          {currentStepData.type === 'social-content' && selectedPlan && (
            <div>
              <div className="text-center mb-8">
                <p className="text-[#00FF94] text-sm uppercase tracking-widest mb-4">Sadržaj</p>
                <h1 className="text-5xl md:text-6xl font-bold mb-4">Kreirajte mix</h1>
                <p className="text-xl text-[#888]">Dodajte sadržaj za {maxPosts} objava</p>
              </div>

              {/* Progress Counter */}
              <div className="max-w-2xl mx-auto mb-10">
                <div className="bg-[#0a0a0a] border border-[#222] rounded-2xl p-5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-[#888]">Objave dodane</span>
                    <span className={`text-lg font-bold ${totalContentCount === maxPosts ? 'text-[#00FF94]' : 'text-white'}`}>
                      {totalContentCount} / {maxPosts}
                    </span>
                  </div>
                  <div className="h-2 bg-[#222] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00FF94] rounded-full transition-all duration-300"
                      style={{ width: `${(totalContentCount / maxPosts) * 100}%` }}
                    />
                  </div>
                  {totalContentCount === maxPosts && (
                    <p className="mt-3 text-sm text-[#00FF94] flex items-center gap-2">
                      <Check size={16} /> Sve objave dodane
                    </p>
                  )}
                  {photoCount > 0 && (
                    <p className="mt-2 text-xs text-[#666]">Fotografije: {photoCount}/{maxPhotos}</p>
                  )}
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
                {QUESTIONNAIRE_CONTENT_TYPES.map((content, i) => {
                  const quantity = contentQuantities[content.id] || 0;
                  const isPhoto = content.isPhoto;
                  const atPhotoLimit = isPhoto && photoCount >= maxPhotos;
                  const atTotalLimit = totalContentCount >= maxPosts;
                  const canAdd = !atTotalLimit && (!isPhoto || !atPhotoLimit);

                  return (
                    <div
                      key={content.id}
                      ref={el => cardsRef.current[i] = el}
                      className={`group rounded-2xl border overflow-hidden transition-all ${
                        quantity > 0 ? 'border-[#00FF94] bg-[#00FF94]/5' : 'border-[#222] bg-[#0a0a0a] hover:border-[#333]'
                      }`}
                    >
                      {/* Preview Media */}
                      <div className="relative aspect-[4/5] bg-[#111] overflow-hidden">
                        {content.previewType === 'video' ? (
                          <video
                            src={content.preview}
                            className="w-full h-full object-cover"
                            muted
                            loop
                            playsInline
                            onMouseEnter={(e) => e.target.play()}
                            onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                            poster={content.preview.replace('.mp4', '-thumb.jpg')}
                          />
                        ) : (
                          <img
                            src={content.preview}
                            alt={content.name}
                            className="w-full h-full object-cover"
                          />
                        )}

                        {/* Overlay with quantity badge */}
                        {quantity > 0 && (
                          <div className="absolute top-3 right-3 w-8 h-8 bg-[#00FF94] rounded-full flex items-center justify-center text-black font-bold text-sm shadow-lg">
                            {quantity}
                          </div>
                        )}

                        {/* Play indicator for videos */}
                        {content.previewType === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                              <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Info & Controls */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold truncate">{content.name}</span>
                          <span className="text-sm font-bold text-[#00FF94] whitespace-nowrap ml-2">{content.price} €</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateContentQuantity(content.id, -1)}
                            disabled={quantity === 0}
                            className="flex-1 h-10 rounded-lg bg-[#1a1a1a] border border-[#333] flex items-center justify-center hover:border-[#444] disabled:opacity-30 transition-all"
                          >
                            <Minus size={18} />
                          </button>
                          <span className="w-10 text-center text-lg font-bold">{quantity}</span>
                          <button
                            onClick={() => updateContentQuantity(content.id, 1)}
                            disabled={!canAdd}
                            className={`flex-1 h-10 rounded-lg flex items-center justify-center transition-all ${
                              canAdd
                                ? 'bg-[#00FF94] text-black hover:bg-[#00cc7a]'
                                : 'bg-[#111] text-[#333] cursor-not-allowed border border-[#222]'
                            }`}
                          >
                            <Plus size={18} />
                          </button>
                        </div>

                        {isPhoto && (
                          <p className="text-xs text-[#666] mt-2 text-center">Max: {maxPhotos}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Web Package Step */}
          {currentStepData.type === 'web-package' && (
            <div>
              <div className="text-center mb-16">
                <p className="text-[#00FF94] text-sm uppercase tracking-widest mb-4">Web Development</p>
                <h1 className="text-5xl md:text-6xl font-bold mb-4">Odaberite paket</h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {Object.values(WEB_PACKAGES).map((pkg, i) => {
                  const isSelected = selections.webDevelopment.package === pkg.id;
                  return (
                    <button
                      key={pkg.id}
                      ref={el => cardsRef.current[i] = el}
                      onClick={() => updateSelection('webDevelopment', 'package', pkg.id)}
                      className={`relative p-6 rounded-2xl border text-left transition-all ${
                        isSelected ? 'border-[#00FF94] bg-[#00FF94]/5' : 'border-[#222] bg-[#0a0a0a] hover:border-[#333]'
                      }`}
                    >
                      <h3 className="text-lg font-semibold mb-2">{pkg.nameHr}</h3>
                      <div className="text-3xl font-bold text-[#00FF94] mb-3">{formatCurrency(pkg.price)}</div>
                      <p className="text-sm text-[#666] mb-4">{pkg.description}</p>
                      <ul className="space-y-1 text-sm text-[#888]">
                        {pkg.features.slice(0, 4).map((f, j) => (
                          <li key={j} className="flex items-center gap-2">
                            <Check size={12} className="text-[#00FF94]" />{f}
                          </li>
                        ))}
                      </ul>
                      {isSelected && (
                        <div className="absolute top-4 right-4 w-5 h-5 bg-[#00FF94] rounded-full flex items-center justify-center">
                          <Check size={12} className="text-black" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* App Package Step */}
          {currentStepData.type === 'app-package' && (
            <div>
              <div className="text-center mb-16">
                <p className="text-[#00FF94] text-sm uppercase tracking-widest mb-4">App Development</p>
                <h1 className="text-5xl md:text-6xl font-bold mb-4">Odaberite paket</h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {Object.values(APP_PACKAGES).map((pkg, i) => {
                  const isSelected = selections.appDevelopment.package === pkg.id;
                  return (
                    <button
                      key={pkg.id}
                      ref={el => cardsRef.current[i] = el}
                      onClick={() => updateSelection('appDevelopment', 'package', pkg.id)}
                      className={`relative p-6 rounded-2xl border text-left transition-all ${
                        isSelected ? 'border-[#00FF94] bg-[#00FF94]/5' : 'border-[#222] bg-[#0a0a0a] hover:border-[#333]'
                      }`}
                    >
                      <h3 className="text-lg font-semibold mb-2">{pkg.nameHr}</h3>
                      <div className="text-3xl font-bold text-[#00FF94] mb-3">
                        {pkg.price ? formatCurrency(pkg.price) : 'Po dogovoru'}
                      </div>
                      <p className="text-sm text-[#666]">{pkg.description}</p>
                      {isSelected && (
                        <div className="absolute top-4 right-4 w-5 h-5 bg-[#00FF94] rounded-full flex items-center justify-center">
                          <Check size={12} className="text-black" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Podcast Step */}
          {currentStepData.type === 'podcast' && (
            <div>
              <div className="text-center mb-16">
                <p className="text-[#00FF94] text-sm uppercase tracking-widest mb-4">Podcast Studio</p>
                <h1 className="text-5xl md:text-6xl font-bold mb-4">Konfigurirajte studio</h1>
              </div>

              <div className="max-w-2xl mx-auto space-y-8">
                <div>
                  <p className="text-sm text-[#888] mb-4">Trajanje snimanja</p>
                  <div className="flex flex-wrap gap-3">
                    {Object.values(PODCAST_STUDIO_PRICING).map((d, i) => (
                      <button
                        key={d.id}
                        ref={el => cardsRef.current[i] = el}
                        onClick={() => updateSelection('podcastStudio', 'duration', d.id)}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${
                          selections.podcastStudio.duration === d.id
                            ? 'bg-[#00FF94] text-black'
                            : 'bg-[#111] border border-[#222] hover:border-[#333]'
                        }`}
                      >
                        {d.nameHr}
                      </button>
                    ))}
                  </div>
                </div>

                {selections.podcastStudio.duration && (
                  <div>
                    <p className="text-sm text-[#888] mb-4">Broj shortova</p>
                    <div className="flex flex-wrap gap-3">
                      {[5, 10, 15].map((count) => {
                        const price = getPodcastStudioPrice(selections.podcastStudio.duration, count);
                        const available = price !== null;
                        return (
                          <button
                            key={count}
                            onClick={() => available && updateSelection('podcastStudio', 'shortsPackage', count)}
                            disabled={!available}
                            className={`px-6 py-3 rounded-xl font-medium transition-all ${
                              selections.podcastStudio.shortsPackage === count
                                ? 'bg-[#00FF94] text-black'
                                : available
                                  ? 'bg-[#111] border border-[#222] hover:border-[#333]'
                                  : 'bg-[#0a0a0a] text-[#333] cursor-not-allowed'
                            }`}
                          >
                            {count} shorts {price && `· ${formatCurrency(price)}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contact Step */}
          {currentStepData.type === 'contact' && (
            <div>
              <div className="text-center mb-16">
                <p className="text-[#00FF94] text-sm uppercase tracking-widest mb-4">Zadnji korak</p>
                <h1 className="text-5xl md:text-6xl font-bold mb-4">Vaši podaci</h1>
                <p className="text-xl text-[#888]">Kako vas možemo kontaktirati?</p>
              </div>

              <div className="max-w-md mx-auto space-y-4">
                {[
                  { label: 'Ime i prezime *', key: 'name', placeholder: 'Ivan Horvat' },
                  { label: 'Tvrtka', key: 'company', placeholder: 'Tvrtka d.o.o.' },
                  { label: 'Email *', key: 'email', placeholder: 'ivan@tvrtka.hr', type: 'email' },
                  { label: 'Telefon', key: 'phone', placeholder: '+385 91 234 5678', type: 'tel' }
                ].map((field, i) => (
                  <div key={field.key} ref={el => cardsRef.current[i] = el}>
                    <label className="block text-sm text-[#888] mb-2">{field.label}</label>
                    <input
                      type={field.type || 'text'}
                      value={contactInfo[field.key]}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, [field.key]: e.target.value }))}
                      className="w-full px-5 py-4 bg-[#0a0a0a] border border-[#222] rounded-xl text-white placeholder-[#444] focus:border-[#00FF94] focus:outline-none transition-colors"
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary Step */}
          {currentStepData.type === 'summary' && (
            <div>
              <div className="text-center mb-16">
                <p className="text-[#00FF94] text-sm uppercase tracking-widest mb-4">Pregled</p>
                <h1 className="text-5xl md:text-6xl font-bold mb-4">Vaša ponuda</h1>
              </div>

              {error && (
                <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="max-w-2xl mx-auto space-y-4">
                {/* Contact */}
                <div ref={el => cardsRef.current[0] = el} className="p-6 bg-[#0a0a0a] border border-[#222] rounded-2xl">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Send size={18} className="text-[#00FF94]" /> Vaši podaci
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <p><span className="text-[#666]">Ime:</span> {contactInfo.name}</p>
                    <p><span className="text-[#666]">Email:</span> {contactInfo.email}</p>
                    {contactInfo.company && <p><span className="text-[#666]">Tvrtka:</span> {contactInfo.company}</p>}
                    {contactInfo.phone && <p><span className="text-[#666]">Tel:</span> {contactInfo.phone}</p>}
                  </div>
                </div>

                {/* One-time */}
                {quoteResult.lineItems.oneTime.length > 0 && (
                  <div ref={el => cardsRef.current[1] = el} className="p-6 bg-[#0a0a0a] border border-[#222] rounded-2xl">
                    <h3 className="font-semibold mb-4">Jednokratno</h3>
                    {quoteResult.lineItems.oneTime.map((item, i) => (
                      <div key={i} className="flex justify-between py-2 border-b border-[#222] last:border-0 text-sm">
                        <span className="text-[#888]">{item.name}</span>
                        <span className="font-semibold text-[#00FF94]">{formatCurrency(item.price)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-4 mt-2 border-t border-[#333]">
                      <span className="font-semibold">Ukupno</span>
                      <span className="text-xl font-bold text-[#00FF94]">{formatCurrency(totalOneTime)}</span>
                    </div>
                  </div>
                )}

                {/* Monthly */}
                {quoteResult.lineItems.monthly.length > 0 && (
                  <div ref={el => cardsRef.current[2] = el} className="p-6 bg-[#0a0a0a] border border-[#222] rounded-2xl">
                    <h3 className="font-semibold mb-4">Mjesečno</h3>
                    {quoteResult.lineItems.monthly.map((item, i) => (
                      <div key={i} className="flex justify-between py-2 border-b border-[#222] last:border-0 text-sm">
                        <span className="text-[#888]">{item.name}</span>
                        <span className="font-semibold">{formatCurrency(item.monthlyPrice)}/mj</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-4 mt-2 border-t border-[#333]">
                      <span className="font-semibold">Ukupno mjesečno</span>
                      <span className="text-xl font-bold text-[#00FF94]">{formatCurrency(totalMonthly)}/mj</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black via-black to-transparent pt-16 pb-8">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          {currentStep > 0 && (
            <button
              onClick={goBack}
              className="px-6 py-4 bg-[#111] border border-[#222] rounded-xl font-medium hover:border-[#333] transition-all flex items-center gap-2"
            >
              <ArrowLeft size={18} /> Natrag
            </button>
          )}
          <div className="flex-1" />
          {currentStep < steps.length - 1 ? (
            <button
              onClick={goNext}
              disabled={!canProceed()}
              className={`px-8 py-4 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                canProceed()
                  ? 'bg-[#00FF94] text-black hover:bg-[#00cc7a]'
                  : 'bg-[#222] text-[#666] cursor-not-allowed'
              }`}
            >
              Nastavi <ArrowRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting || !canProceed()}
              className="px-8 py-4 bg-[#00FF94] text-black rounded-xl font-semibold hover:bg-[#00cc7a] transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? 'Šaljem...' : 'Pošalji upit'} <Send size={18} />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
