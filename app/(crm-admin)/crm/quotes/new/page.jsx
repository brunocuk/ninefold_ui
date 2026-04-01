// app/(crm-admin)/crm/quotes/new/page.jsx
// Quote generator with multi-service support and monthly quotes

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { CreditCard, Loader2, Copy, CheckCircle, Plus, Trash2, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useToast } from '@/components/Toast';
import {
  SERVICE_TYPES,
  QUOTE_TYPES,
  getServiceType,
  getAllServiceTypes,
  getSelectableServiceTypes,
  combineServicesForAgencyPackage
} from '@/lib/serviceTemplates';

export default function QuoteMaker() {
  const router = useRouter();
  const toast = useToast();
  const [clients, setClients] = useState([]);
  const [leads, setLeads] = useState([]);
  const [saving, setSaving] = useState(false);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [linkGenerated, setLinkGenerated] = useState(false);
  const [sourceType, setSourceType] = useState('manual');

  // Step management
  const [step, setStep] = useState(1); // 1 = service selection, 2 = quote details

  // Service type selection
  const [selectedServiceType, setSelectedServiceType] = useState('web_development');
  const [quoteType, setQuoteType] = useState('project'); // 'project' or 'monthly'
  const [selectedAgencyServices, setSelectedAgencyServices] = useState([]); // for agency package
  const [agencyPricingMode, setAgencyPricingMode] = useState('combined'); // 'combined' or 'separate'

  // Load clients and leads on mount
  useEffect(() => {
    loadClients();
    loadLeads();
  }, []);

  const loadClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, company, email')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const loadLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('id, name, company, email, status')
        .in('status', ['new', 'contacted', 'qualified'])
        .order('name');

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error loading leads:', error);
    }
  };

  // Get initial form data based on service type
  const getInitialFormData = (serviceTypeId, isMonthly = false) => {
    const service = getServiceType(serviceTypeId);

    return {
      clientId: '',
      leadId: '',
      title: '',
      clientName: '',
      clientEmail: '',
      duration: service.defaultDuration || '',
      projectOverview: '',
      objectives: ['', '', '', ''],
      paymentLink: '',
      revolutOrderId: '',

      // Dynamic scope from service template
      scope: JSON.parse(JSON.stringify(service.defaultScope)),

      // Pricing - Dynamic line items
      items: JSON.parse(JSON.stringify(service.defaultLineItems)),
      discountRate: 0.20,
      depositRate: 0.50,

      // Monthly quote specific
      monthlyPrice: 0,

      // Maintenance & Support (optional)
      maintenanceEnabled: false,
      maintenancePrice: 150,
      maintenanceDescription: 'Monthly website maintenance including security updates, backups, performance monitoring, and up to 2 hours of content updates.',

      // Timeline
      timeline: JSON.parse(JSON.stringify(service.defaultTimeline)),
    };
  };

  // Form state
  const [formData, setFormData] = useState(getInitialFormData('web_development'));

  // Handle service type change
  const handleServiceTypeChange = (serviceTypeId) => {
    setSelectedServiceType(serviceTypeId);

    if (serviceTypeId === 'agency_package') {
      // For agency package, don't load template yet - wait for service selection
      setSelectedAgencyServices([]);
    } else {
      // Load service template
      const newFormData = getInitialFormData(serviceTypeId, quoteType === 'monthly');
      setFormData({
        ...formData,
        scope: newFormData.scope,
        timeline: newFormData.timeline,
        items: newFormData.items,
        duration: newFormData.duration,
      });
    }
  };

  // Handle agency service toggle
  const toggleAgencyService = (serviceId) => {
    setSelectedAgencyServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  // Apply agency package selection
  const applyAgencyPackage = () => {
    if (selectedAgencyServices.length === 0) {
      toast.warning('Odaberite barem jednu uslugu');
      return;
    }

    const combined = combineServicesForAgencyPackage(selectedAgencyServices);

    if (agencyPricingMode === 'separate') {
      setFormData({
        ...formData,
        scope: combined.scope,
        timeline: combined.timeline,
        items: combined.lineItems,
        duration: '',
      });
    } else {
      // Combined pricing - single line item
      setFormData({
        ...formData,
        scope: combined.scope,
        timeline: combined.timeline,
        items: [{ name: 'Agencijski paket', description: selectedAgencyServices.map(id => getServiceType(id).nameHr).join(', '), price: 0 }],
        duration: '',
      });
    }
  };

  // Proceed to step 2
  const proceedToDetails = () => {
    if (selectedServiceType === 'agency_package') {
      if (selectedAgencyServices.length === 0) {
        toast.warning('Odaberite barem jednu uslugu za agencijski paket');
        return;
      }
      applyAgencyPackage();
    }
    setStep(2);
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.price || 0), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal - (subtotal * formData.discountRate);
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', description: '', price: 0 }]
    });
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData({
        ...formData,
        items: formData.items.filter((_, i) => i !== index)
      });
    }
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: field === 'price' ? Number(value) : value };
    setFormData({ ...formData, items: newItems });
  };

  // Scope management
  const addScopeSection = () => {
    setFormData({
      ...formData,
      scope: [...formData.scope, { number: String(formData.scope.length + 1), title: '', items: [''] }]
    });
  };

  const removeScopeSection = (index) => {
    if (formData.scope.length > 1) {
      const newScope = formData.scope.filter((_, i) => i !== index).map((section, i) => ({
        ...section,
        number: String(i + 1)
      }));
      setFormData({ ...formData, scope: newScope });
    }
  };

  const updateScopeSection = (index, field, value) => {
    const newScope = [...formData.scope];
    newScope[index] = { ...newScope[index], [field]: value };
    setFormData({ ...formData, scope: newScope });
  };

  const addScopeItem = (sectionIndex) => {
    const newScope = [...formData.scope];
    newScope[sectionIndex].items = [...newScope[sectionIndex].items, ''];
    setFormData({ ...formData, scope: newScope });
  };

  const removeScopeItem = (sectionIndex, itemIndex) => {
    const newScope = [...formData.scope];
    if (newScope[sectionIndex].items.length > 1) {
      newScope[sectionIndex].items = newScope[sectionIndex].items.filter((_, i) => i !== itemIndex);
      setFormData({ ...formData, scope: newScope });
    }
  };

  const updateScopeItem = (sectionIndex, itemIndex, value) => {
    const newScope = [...formData.scope];
    newScope[sectionIndex].items[itemIndex] = value;
    setFormData({ ...formData, scope: newScope });
  };

  // Timeline management
  const addTimelinePhase = () => {
    setFormData({
      ...formData,
      timeline: [...formData.timeline, { week: '', phase: '', duration: '' }]
    });
  };

  const removeTimelinePhase = (index) => {
    if (formData.timeline.length > 1) {
      setFormData({
        ...formData,
        timeline: formData.timeline.filter((_, i) => i !== index)
      });
    }
  };

  const updateTimelinePhase = (index, field, value) => {
    const newTimeline = [...formData.timeline];
    newTimeline[index] = { ...newTimeline[index], [field]: value };
    setFormData({ ...formData, timeline: newTimeline });
  };

  const handleSourceTypeChange = (type) => {
    setSourceType(type);
    setFormData({
      ...formData,
      clientId: '',
      leadId: '',
      clientName: type === 'manual' ? '' : formData.clientName,
      clientEmail: type === 'manual' ? '' : formData.clientEmail
    });
  };

  const handleClientSelect = (e) => {
    const clientId = e.target.value;
    const client = clients.find(c => c.id === clientId);

    if (client) {
      setFormData({
        ...formData,
        clientId: clientId,
        leadId: '',
        clientName: client.company || client.name,
        clientEmail: client.email || ''
      });
    } else {
      setFormData({
        ...formData,
        clientId: '',
        clientName: '',
        clientEmail: ''
      });
    }
  };

  const handleLeadSelect = (e) => {
    const leadId = e.target.value;
    const lead = leads.find(l => l.id === leadId);

    if (lead) {
      setFormData({
        ...formData,
        leadId: leadId,
        clientId: '',
        clientName: lead.company || lead.name,
        clientEmail: lead.email || ''
      });
    } else {
      setFormData({
        ...formData,
        leadId: '',
        clientName: '',
        clientEmail: ''
      });
    }
  };

  // Generate Payment Link Function
  const handleGeneratePaymentLink = async () => {
    if (!formData.clientName) {
      toast.warning('Please enter a client name first');
      return;
    }

    if (!formData.clientEmail) {
      toast.warning('Please enter a client email first');
      return;
    }

    const isMonthly = quoteType === 'monthly';
    const paymentAmount = isMonthly ? formData.monthlyPrice : calculateTotal() * formData.depositRate;

    if (paymentAmount <= 0) {
      toast.warning(isMonthly ? 'Monthly price must be greater than 0' : 'Quote total must be greater than 0');
      return;
    }

    setGeneratingLink(true);
    setLinkGenerated(false);

    try {
      const description = isMonthly
        ? `First Month - ${formData.clientName}`
        : `${(formData.depositRate * 100).toFixed(0)}% Deposit for ${formData.clientName} - ${formData.projectOverview.substring(0, 80)}`;

      const response = await fetch('/api/quotes/create-payment-link-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(paymentAmount * 100),
          currency: 'EUR',
          clientEmail: formData.clientEmail,
          clientName: formData.clientName,
          description: description,
        }),
      });

      const data = await response.json();

      if (response.ok && data.checkout_url) {
        setFormData({
          ...formData,
          paymentLink: data.checkout_url,
          revolutOrderId: data.order_id,
        });
        setLinkGenerated(true);
      } else {
        throw new Error(data.error || 'Failed to generate payment link');
      }
    } catch (error) {
      console.error('Error generating payment link:', error);
      toast.error('Error generating payment link: ' + error.message);
    } finally {
      setGeneratingLink(false);
    }
  };

  const handleCreateQuote = async () => {
    setSaving(true);

    try {
      const isMonthly = quoteType === 'monthly';
      const subtotal = calculateSubtotal();
      const discountAmount = subtotal * formData.discountRate;
      const total = subtotal - discountAmount;

      // Filter scope to remove empty items
      const cleanedScope = formData.scope.map(section => ({
        ...section,
        items: section.items.filter(item => item.trim() !== '')
      })).filter(section => section.title.trim() !== '' || section.items.length > 0);

      const quoteData = {
        client_id: formData.clientId || null,
        lead_id: formData.leadId || null,

        // Service and quote type
        service_type: selectedServiceType,
        quote_type: quoteType,
        services: selectedServiceType === 'agency_package' ? selectedAgencyServices : null,
        monthly_price: isMonthly ? formData.monthlyPrice : null,

        title: formData.title || null,
        client_name: formData.clientName,
        client_email: formData.clientEmail,
        project_overview: formData.projectOverview,
        duration: formData.duration,
        scope: cleanedScope,
        timeline: isMonthly ? [] : formData.timeline.filter(t => t.phase.trim() !== ''),

        reference: `NF-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${formData.clientName.substring(0, 3).toUpperCase()}`,
        quote_number: `NF-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${formData.clientName.substring(0, 3).toUpperCase()}`,
        status: 'draft',

        quote_data: {
          clientName: formData.clientName,
          clientEmail: formData.clientEmail,
          reference: `NF-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${formData.clientName.substring(0, 3).toUpperCase()}`,
          date: new Date().toLocaleDateString('hr-HR'),
          duration: formData.duration,
          projectOverview: formData.projectOverview,
          objectives: formData.objectives.filter(obj => obj.trim() !== ''),
          paymentLink: formData.paymentLink,
          scope: cleanedScope,
          timeline: isMonthly ? [] : formData.timeline.filter(t => t.phase.trim() !== ''),
        },

        pricing: isMonthly ? {
          monthlyPrice: formData.monthlyPrice,
          items: formData.items.filter(item => item.name.trim() !== ''),
          total: formData.monthlyPrice,
        } : {
          items: formData.items.filter(item => item.name.trim() !== '' && item.price > 0),
          subtotal: subtotal,
          discountRate: formData.discountRate,
          discountAmount: discountAmount,
          total: total,
          depositRate: formData.depositRate,
          maintenance: formData.maintenanceEnabled ? {
            enabled: true,
            price: formData.maintenancePrice,
            description: formData.maintenanceDescription
          } : null,
        },

        revolut_checkout_url: formData.paymentLink.includes('revolut.com') ? formData.paymentLink : null,
        revolut_order_id: formData.revolutOrderId || null,

        view_count: 0,
        last_viewed_at: null
      };

      const { data, error } = await supabase
        .from('quotes')
        .insert([quoteData])
        .select();

      if (error) throw error;

      const quoteId = data[0].id;
      router.push(`/crm/quotes/${quoteId}`);

    } catch (error) {
      console.error('Error creating quote:', error);
      toast.error('Error creating quote: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const serviceTypes = getAllServiceTypes();
  const selectableServices = getSelectableServiceTypes();

  // Step 1: Service Selection
  if (step === 1) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-black text-white mb-2">Nova Ponuda</h1>
          <p className="text-gray-400 mb-8">Odaberi vrstu usluge i tip ponude</p>

          {/* Service Type Selection */}
          <section className="bg-[#1A1A1A] p-6 rounded-lg border border-[#2A2A2A] mb-6">
            <h2 className="text-xl font-bold text-[#00FF94] mb-4">Vrsta usluge</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {serviceTypes.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => handleServiceTypeChange(service.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedServiceType === service.id
                      ? 'border-[#00FF94] bg-[#00FF94]/10'
                      : 'border-[#2A2A2A] hover:border-[#3A3A3A] bg-[#0F0F0F]'
                  }`}
                >
                  <div className="text-3xl mb-2">{service.icon}</div>
                  <div className="font-bold text-white text-sm">{service.nameHr}</div>
                  <div className="text-xs text-gray-500">{service.name}</div>
                  {selectedServiceType === service.id && (
                    <div className="mt-2">
                      <Check size={16} className="text-[#00FF94]" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Agency Package - Service Selection */}
            {selectedServiceType === 'agency_package' && (
              <div className="mt-6 pt-6 border-t border-[#2A2A2A]">
                <h3 className="text-lg font-bold text-white mb-4">Odaberi usluge za paket</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {selectableServices.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => toggleAgencyService(service.id)}
                      className={`p-3 rounded-lg border transition-all text-left ${
                        selectedAgencyServices.includes(service.id)
                          ? 'border-[#00FF94] bg-[#00FF94]/10'
                          : 'border-[#2A2A2A] hover:border-[#3A3A3A] bg-[#0F0F0F]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{service.icon}</span>
                        <span className="text-sm font-semibold text-white">{service.nameHr}</span>
                        {selectedAgencyServices.includes(service.id) && (
                          <Check size={14} className="text-[#00FF94] ml-auto" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {selectedAgencyServices.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-3">Način prikaza cijena</h4>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setAgencyPricingMode('combined')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          agencyPricingMode === 'combined'
                            ? 'bg-[#00FF94] text-black'
                            : 'bg-[#2A2A2A] text-gray-400 hover:bg-[#3A3A3A]'
                        }`}
                      >
                        Jedna ukupna cijena
                      </button>
                      <button
                        type="button"
                        onClick={() => setAgencyPricingMode('separate')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          agencyPricingMode === 'separate'
                            ? 'bg-[#00FF94] text-black'
                            : 'bg-[#2A2A2A] text-gray-400 hover:bg-[#3A3A3A]'
                        }`}
                      >
                        Zasebne stavke po usluzi
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Quote Type Selection */}
          <section className="bg-[#1A1A1A] p-6 rounded-lg border border-[#2A2A2A] mb-6">
            <h2 className="text-xl font-bold text-[#00FF94] mb-4">Tip ponude</h2>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setQuoteType('project')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all text-left ${
                  quoteType === 'project'
                    ? 'border-[#00FF94] bg-[#00FF94]/10'
                    : 'border-[#2A2A2A] hover:border-[#3A3A3A] bg-[#0F0F0F]'
                }`}
              >
                <div className="text-2xl mb-2">📋</div>
                <div className="font-bold text-white">Projekt</div>
                <div className="text-xs text-gray-500">Jednokratni projekt s akontacijom</div>
              </button>

              <button
                type="button"
                onClick={() => setQuoteType('monthly')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all text-left ${
                  quoteType === 'monthly'
                    ? 'border-[#00FF94] bg-[#00FF94]/10'
                    : 'border-[#2A2A2A] hover:border-[#3A3A3A] bg-[#0F0F0F]'
                }`}
              >
                <div className="text-2xl mb-2">🔄</div>
                <div className="font-bold text-white">Mjesečni paket</div>
                <div className="text-xs text-gray-500">Recurring mjesečna naplata</div>
              </button>
            </div>
          </section>

          {/* Continue Button */}
          <button
            onClick={proceedToDetails}
            disabled={selectedServiceType === 'agency_package' && selectedAgencyServices.length === 0}
            className="w-full bg-[#00FF94] text-black font-bold py-4 rounded-lg hover:bg-[#00DD7F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Nastavi
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Quote Details
  return (
    <div className="min-h-screen bg-[#0F0F0F] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => setStep(1)}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00FF94] mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Natrag na odabir usluge
        </button>

        {/* Service Type Badge */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">{getServiceType(selectedServiceType).icon}</span>
          <div>
            <h1 className="text-2xl font-black text-white">{getServiceType(selectedServiceType).nameHr}</h1>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
              quoteType === 'monthly' ? 'bg-purple-500 text-white' : 'bg-blue-500 text-white'
            }`}>
              {quoteType === 'monthly' ? 'Mjesečni paket' : 'Projekt'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">

            {/* Source Selection */}
            <section className="bg-[#1A1A1A] p-6 rounded-lg border border-[#2A2A2A]">
              <h2 className="text-xl font-bold text-[#00FF94] mb-4">Quote For</h2>

              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => handleSourceTypeChange('manual')}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    sourceType === 'manual'
                      ? 'bg-[#00FF94] text-black'
                      : 'bg-[#2A2A2A] text-[#8F8F8F] hover:bg-[#3A3A3A]'
                  }`}
                >
                  Manual Entry
                </button>
                <button
                  type="button"
                  onClick={() => handleSourceTypeChange('client')}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    sourceType === 'client'
                      ? 'bg-[#00FF94] text-black'
                      : 'bg-[#2A2A2A] text-[#8F8F8F] hover:bg-[#3A3A3A]'
                  }`}
                >
                  Client ({clients.length})
                </button>
                <button
                  type="button"
                  onClick={() => handleSourceTypeChange('lead')}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    sourceType === 'lead'
                      ? 'bg-[#00FF94] text-black'
                      : 'bg-[#2A2A2A] text-[#8F8F8F] hover:bg-[#3A3A3A]'
                  }`}
                >
                  Lead ({leads.length})
                </button>
              </div>

              {sourceType === 'client' && (
                <select
                  value={formData.clientId}
                  onChange={handleClientSelect}
                  className="w-full bg-[#0F0F0F] text-white p-3 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none"
                >
                  <option value="">-- Select a client --</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.company || client.name} {client.email ? `(${client.email})` : ''}
                    </option>
                  ))}
                </select>
              )}

              {sourceType === 'lead' && (
                <select
                  value={formData.leadId}
                  onChange={handleLeadSelect}
                  className="w-full bg-[#0F0F0F] text-white p-3 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none"
                >
                  <option value="">-- Select a lead --</option>
                  {leads.map(lead => (
                    <option key={lead.id} value={lead.id}>
                      {lead.company || lead.name} {lead.email ? `(${lead.email})` : ''} - {lead.status}
                    </option>
                  ))}
                </select>
              )}

              {sourceType === 'manual' && (
                <p className="text-[#666] text-sm">
                  Enter client details manually in the form below
                </p>
              )}
            </section>

            {/* Quote Title */}
            <section className="bg-[#1A1A1A] p-6 rounded-lg border border-[#2A2A2A]">
              <h2 className="text-xl font-bold text-[#00FF94] mb-4">Naziv Ponude</h2>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-[#0F0F0F] text-white p-3 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none"
                placeholder="npr. Web stranica + Mobile aplikacija, Redizajn web shopa..."
              />
              <p className="text-[#666] text-xs mt-2">
                Interni naziv ponude za lakše prepoznavanje (neće se prikazati klijentu)
              </p>
            </section>

            {/* Client Info */}
            <section className="bg-[#1A1A1A] p-6 rounded-lg border border-[#2A2A2A]">
              <h2 className="text-xl font-bold text-[#00FF94] mb-4">Client Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[#8F8F8F] text-sm mb-2">Client Name *</label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                    className={`w-full bg-[#0F0F0F] text-white p-3 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none ${(formData.clientId || formData.leadId) ? 'opacity-60' : ''}`}
                    placeholder="DI plan"
                    disabled={!!(formData.clientId || formData.leadId)}
                  />
                </div>
                <div>
                  <label className="block text-[#8F8F8F] text-sm mb-2">Client Email *</label>
                  <input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
                    className={`w-full bg-[#0F0F0F] text-white p-3 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none ${(formData.clientId || formData.leadId) ? 'opacity-60' : ''}`}
                    placeholder="client@company.com"
                    disabled={!!(formData.clientId || formData.leadId)}
                  />
                  <p className="text-[#666] text-xs mt-1">Required for payment link generation</p>
                </div>
                <div>
                  <label className="block text-[#8F8F8F] text-sm mb-2">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full bg-[#0F0F0F] text-white p-3 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none"
                    placeholder={quoteType === 'monthly' ? 'Mjesečna usluga' : '8 tjedana'}
                  />
                </div>

                {/* Payment Link Section */}
                <div>
                  <label className="block text-[#8F8F8F] text-sm mb-2">Payment Link</label>

                  <button
                    onClick={handleGeneratePaymentLink}
                    disabled={generatingLink || !formData.clientName || !formData.clientEmail || (quoteType === 'monthly' ? formData.monthlyPrice <= 0 : calculateTotal() <= 0)}
                    className="w-full bg-[#2A2A2A] text-white p-3 rounded border border-[#3A3A3A] hover:bg-[#3A3A3A] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-3"
                  >
                    {generatingLink ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Generating Payment Link...
                      </>
                    ) : linkGenerated ? (
                      <>
                        <CheckCircle size={18} className="text-[#00FF94]" />
                        {quoteType === 'monthly' ? 'First Month Link Generated' : `Deposit Link Generated (${(formData.depositRate * 100).toFixed(0)}%)`}
                      </>
                    ) : (
                      <>
                        <CreditCard size={18} />
                        {quoteType === 'monthly' ? 'Generate First Month Payment Link' : `Generate Deposit Payment Link (${(formData.depositRate * 100).toFixed(0)}%)`}
                      </>
                    )}
                  </button>

                  <div className="relative">
                    <input
                      type="url"
                      value={formData.paymentLink}
                      onChange={(e) => {
                        setFormData({...formData, paymentLink: e.target.value});
                        setLinkGenerated(false);
                      }}
                      className="w-full bg-[#0F0F0F] text-white p-3 pr-12 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none text-sm"
                      placeholder="Click 'Generate' button above or paste link manually"
                    />

                    {formData.paymentLink && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(formData.paymentLink);
                          toast.success('Payment link copied to clipboard!');
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-[#2A2A2A] rounded transition-all"
                        title="Copy to clipboard"
                      >
                        <Copy size={16} className="text-gray-400" />
                      </button>
                    )}
                  </div>

                  {linkGenerated && (
                    <div className="mt-2 p-2 bg-[#00FF94]/10 border border-[#00FF94]/20 rounded text-xs text-[#00FF94]">
                      {quoteType === 'monthly'
                        ? '✓ First month payment link generated! This will be included in the quote.'
                        : `✓ Deposit payment link generated (${(formData.depositRate * 100).toFixed(0)}% of total)! This will be included in the quote.`
                      }
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Project Overview */}
            <section className="bg-[#1A1A1A] p-6 rounded-lg border border-[#2A2A2A]">
              <h2 className="text-xl font-bold text-[#00FF94] mb-4">Project Overview *</h2>
              <textarea
                value={formData.projectOverview}
                onChange={(e) => setFormData({...formData, projectOverview: e.target.value})}
                className="w-full bg-[#0F0F0F] text-white p-3 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none h-32"
                placeholder="Opišite projekt i potrebe klijenta..."
              />
            </section>

            {/* Objectives */}
            <section className="bg-[#1A1A1A] p-6 rounded-lg border border-[#2A2A2A]">
              <h2 className="text-xl font-bold text-[#00FF94] mb-4">Project Objectives</h2>
              <div className="space-y-3">
                {formData.objectives.map((obj, index) => (
                  <input
                    key={index}
                    type="text"
                    value={obj}
                    onChange={(e) => {
                      const newObjectives = [...formData.objectives];
                      newObjectives[index] = e.target.value;
                      setFormData({...formData, objectives: newObjectives});
                    }}
                    className="w-full bg-[#0F0F0F] text-white p-3 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none"
                    placeholder={`Objective ${index + 1}`}
                  />
                ))}
              </div>
            </section>

            {/* Scope of Work - Dynamic */}
            <section className="bg-[#1A1A1A] p-6 rounded-lg border border-[#2A2A2A]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#00FF94]">{quoteType === 'monthly' ? 'Što je uključeno' : 'Opseg rada'}</h2>
                <button
                  type="button"
                  onClick={addScopeSection}
                  className="flex items-center gap-2 bg-[#00FF94] text-black px-3 py-2 rounded text-sm font-semibold hover:bg-[#00DD7F] transition-colors"
                >
                  <Plus size={16} />
                  Dodaj sekciju
                </button>
              </div>

              <div className="space-y-6">
                {formData.scope.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="bg-[#0F0F0F] p-4 rounded-lg border border-[#2A2A2A]">
                    <div className="flex gap-3 items-start mb-4">
                      <div className="w-10 h-10 bg-[#00FF94] rounded-lg flex items-center justify-center text-black font-bold flex-shrink-0">
                        {section.number}
                      </div>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateScopeSection(sectionIndex, 'title', e.target.value)}
                        className="flex-1 bg-[#1A1A1A] text-white p-2 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none font-semibold"
                        placeholder="Naziv sekcije"
                      />
                      <button
                        type="button"
                        onClick={() => removeScopeSection(sectionIndex)}
                        disabled={formData.scope.length === 1}
                        className="p-2 text-[#8F8F8F] hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="space-y-2 ml-12">
                      {section.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex gap-2 items-center">
                          <span className="text-[#00FF94]">→</span>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => updateScopeItem(sectionIndex, itemIndex, e.target.value)}
                            className="flex-1 bg-[#1A1A1A] text-white p-2 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none text-sm"
                            placeholder="Stavka"
                          />
                          <button
                            type="button"
                            onClick={() => removeScopeItem(sectionIndex, itemIndex)}
                            disabled={section.items.length === 1}
                            className="p-1 text-[#8F8F8F] hover:text-red-500 transition-colors disabled:opacity-30"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addScopeItem(sectionIndex)}
                        className="text-[#00FF94] text-sm hover:underline ml-4"
                      >
                        + Dodaj stavku
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Pricing - Line Items */}
            <section className="bg-[#1A1A1A] p-6 rounded-lg border border-[#2A2A2A]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#00FF94]">{quoteType === 'monthly' ? 'Mjesečna cijena' : 'Services / Line Items'}</h2>
                {quoteType !== 'monthly' && (
                  <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-2 bg-[#00FF94] text-black px-3 py-2 rounded text-sm font-semibold hover:bg-[#00DD7F] transition-colors"
                  >
                    <Plus size={16} />
                    Add Item
                  </button>
                )}
              </div>

              {quoteType === 'monthly' ? (
                <div>
                  <label className="block text-[#8F8F8F] text-sm mb-2">Mjesečna cijena (EUR) *</label>
                  <input
                    type="number"
                    value={formData.monthlyPrice || ''}
                    onChange={(e) => setFormData({...formData, monthlyPrice: Number(e.target.value)})}
                    className="w-full bg-[#0F0F0F] text-white p-3 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none text-2xl font-bold"
                    placeholder="0"
                  />
                  <p className="text-[#666] text-xs mt-2">
                    Link za plaćanje će se generirati za prvi mjesec
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {formData.items.map((item, index) => (
                      <div key={index} className="bg-[#0F0F0F] p-4 rounded-lg border border-[#2A2A2A]">
                        <div className="flex gap-3 items-start mb-3">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => updateItem(index, 'name', e.target.value)}
                              className="w-full bg-[#1A1A1A] text-white p-3 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none"
                              placeholder="Service name (e.g., Website Development)"
                            />
                          </div>
                          <div className="w-32">
                            <input
                              type="number"
                              value={item.price || ''}
                              onChange={(e) => updateItem(index, 'price', e.target.value)}
                              className="w-full bg-[#1A1A1A] text-white p-3 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none"
                              placeholder="Price"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            disabled={formData.items.length === 1}
                            className="p-3 text-[#8F8F8F] hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <textarea
                          value={item.description || ''}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          className="w-full bg-[#1A1A1A] text-white p-3 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none text-sm resize-none"
                          placeholder="Description (optional)"
                          rows={2}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-[#2A2A2A]">
                    <div>
                      <label className="block text-[#8F8F8F] text-sm mb-2">Discount (%)</label>
                      <input
                        type="number"
                        value={formData.discountRate * 100}
                        onChange={(e) => setFormData({...formData, discountRate: Number(e.target.value) / 100})}
                        className="w-full bg-[#0F0F0F] text-white p-3 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none"
                        placeholder="20"
                      />
                    </div>
                    <div>
                      <label className="block text-[#8F8F8F] text-sm mb-2">Deposit (%)</label>
                      <input
                        type="number"
                        value={formData.depositRate * 100}
                        onChange={(e) => setFormData({...formData, depositRate: Math.min(100, Math.max(0, Number(e.target.value))) / 100})}
                        className="w-full bg-[#0F0F0F] text-white p-3 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none"
                        placeholder="50"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                </>
              )}
            </section>

            {/* Maintenance & Support - Only for project quotes */}
            {quoteType !== 'monthly' && (
              <section className="bg-[#1A1A1A] p-6 rounded-lg border border-[#2A2A2A]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-[#00FF94]">Maintenance & Support</h2>
                    <p className="text-[#666] text-xs mt-1">Optional recurring monthly service</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, maintenanceEnabled: !formData.maintenanceEnabled})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.maintenanceEnabled ? 'bg-[#00FF94]' : 'bg-[#2A2A2A]'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.maintenanceEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {formData.maintenanceEnabled && (
                  <div className="space-y-4 mt-4 pt-4 border-t border-[#2A2A2A]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-[#8F8F8F] text-sm mb-2">Description</label>
                        <textarea
                          value={formData.maintenanceDescription}
                          onChange={(e) => setFormData({...formData, maintenanceDescription: e.target.value})}
                          className="w-full bg-[#0F0F0F] text-white p-3 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none h-20 text-sm"
                          placeholder="What's included..."
                        />
                      </div>
                      <div>
                        <label className="block text-[#8F8F8F] text-sm mb-2">Monthly Price (€)</label>
                        <input
                          type="number"
                          value={formData.maintenancePrice}
                          onChange={(e) => setFormData({...formData, maintenancePrice: Number(e.target.value)})}
                          className="w-full bg-[#0F0F0F] text-white p-3 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none"
                          placeholder="150"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Timeline - Only for project quotes */}
            {quoteType !== 'monthly' && (
              <section className="bg-[#1A1A1A] p-6 rounded-lg border border-[#2A2A2A]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-[#00FF94]">Vremenski Plan</h2>
                  <button
                    type="button"
                    onClick={addTimelinePhase}
                    className="flex items-center gap-2 bg-[#00FF94] text-black px-3 py-2 rounded text-sm font-semibold hover:bg-[#00DD7F] transition-colors"
                  >
                    <Plus size={16} />
                    Dodaj fazu
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.timeline.map((phase, index) => (
                    <div key={index} className="bg-[#0F0F0F] p-4 rounded-lg border border-[#2A2A2A]">
                      <div className="flex gap-3 items-start">
                        <div className="w-10 h-10 bg-[#00FF94] rounded-lg flex items-center justify-center text-black font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 grid grid-cols-3 gap-3">
                          <input
                            type="text"
                            value={phase.week}
                            onChange={(e) => updateTimelinePhase(index, 'week', e.target.value)}
                            className="bg-[#1A1A1A] text-white p-2 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none text-sm"
                            placeholder="Tjedan 1-2"
                          />
                          <input
                            type="text"
                            value={phase.phase}
                            onChange={(e) => updateTimelinePhase(index, 'phase', e.target.value)}
                            className="bg-[#1A1A1A] text-white p-2 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none text-sm"
                            placeholder="Naziv faze"
                          />
                          <input
                            type="text"
                            value={phase.duration}
                            onChange={(e) => updateTimelinePhase(index, 'duration', e.target.value)}
                            className="bg-[#1A1A1A] text-white p-2 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none text-sm"
                            placeholder="Trajanje"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeTimelinePhase(index)}
                          disabled={formData.timeline.length === 1}
                          className="p-2 text-[#8F8F8F] hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Sidebar - Summary */}
          <div>
            <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#2A2A2A] sticky top-8">
              <h2 className="text-xl font-bold text-[#00FF94] mb-4">Quote Summary</h2>

              <div className="space-y-4 text-sm">
                {quoteType === 'monthly' ? (
                  /* Monthly Quote Summary */
                  <>
                    <div className="border-t border-[#2A2A2A] pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-bold text-lg">Mjesečno</span>
                        <span className="text-[#00FF94] font-bold text-2xl">€{(formData.monthlyPrice || 0).toLocaleString()}/mj</span>
                      </div>
                    </div>

                    <div className="text-xs text-[#8F8F8F] pt-2 border-t border-[#2A2A2A] mt-2">
                      <div className="font-semibold text-white mb-1">Način plaćanja:</div>
                      <div className="bg-purple-500/10 border border-purple-500/20 rounded p-2 mb-1">
                        <div className="flex justify-between items-center">
                          <span className="text-purple-400 font-semibold">Prvi mjesec:</span>
                          <span className="text-purple-400 font-bold">€{(formData.monthlyPrice || 0).toLocaleString()}</span>
                        </div>
                        <div className="text-[10px] text-purple-400/70 mt-1">Plaćanje unaprijed za početak suradnje</div>
                      </div>
                      <div className="text-[10px] text-[#666] mt-1">Svaki sljedeći mjesec se naplaćuje automatski</div>
                    </div>
                  </>
                ) : (
                  /* Project Quote Summary */
                  <>
                    {formData.items.filter(item => item.name.trim() !== '').map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-[#8F8F8F] truncate pr-2">{item.name || 'Unnamed'}</span>
                        <span className="text-white">€{(item.price || 0).toLocaleString()}</span>
                      </div>
                    ))}

                    {formData.items.filter(item => item.name.trim() !== '').length === 0 && (
                      <div className="text-[#666] text-xs">No items added yet</div>
                    )}

                    <div className="border-t border-[#2A2A2A] pt-2 mt-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-[#8F8F8F]">Subtotal</span>
                        <span className="text-white">€{calculateSubtotal().toLocaleString()}</span>
                      </div>
                      {formData.discountRate > 0 && (
                        <div className="flex justify-between text-xs mt-1">
                          <span className="text-[#00FF94]">Discount ({(formData.discountRate * 100).toFixed(0)}%)</span>
                          <span className="text-[#00FF94]">-€{(calculateSubtotal() * formData.discountRate).toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-[#2A2A2A] pt-4 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-bold text-lg">Total</span>
                        <span className="text-[#00FF94] font-bold text-2xl">€{calculateTotal().toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="text-xs text-[#8F8F8F] pt-2 border-t border-[#2A2A2A] mt-2">
                      <div className="font-semibold text-white mb-1">Payment Structure:</div>
                      <div className="bg-[#00FF94]/10 border border-[#00FF94]/20 rounded p-2 mb-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[#00FF94] font-semibold">{(formData.depositRate * 100).toFixed(0)}% Deposit:</span>
                          <span className="text-[#00FF94] font-bold">€{(calculateTotal() * formData.depositRate).toLocaleString()}</span>
                        </div>
                        <div className="text-[10px] text-[#00FF94]/70 mt-1">Required to start project</div>
                      </div>
                      <div className="flex justify-between">
                        <span>{(100 - formData.depositRate * 100).toFixed(0)}% Final Payment:</span>
                        <span>€{(calculateTotal() * (1 - formData.depositRate)).toLocaleString()}</span>
                      </div>
                      <div className="text-[10px] text-[#666] mt-1">Due upon project completion</div>
                    </div>

                    {formData.maintenanceEnabled && formData.maintenancePrice > 0 && (
                      <div className="text-xs pt-3 mt-3 border-t border-[#2A2A2A]">
                        <div className="font-semibold text-white mb-2">Maintenance (Optional):</div>
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded p-2">
                          <div className="flex justify-between items-center">
                            <span className="text-blue-400">Monthly:</span>
                            <span className="text-blue-400 font-bold">€{formData.maintenancePrice.toLocaleString()}/mo</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <button
                onClick={handleCreateQuote}
                disabled={!formData.clientName || !formData.projectOverview || saving || (quoteType === 'monthly' && formData.monthlyPrice <= 0)}
                className="w-full bg-[#00FF94] text-black font-bold py-4 rounded mt-6 hover:bg-[#00DD7F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Creating Quote...' : 'Create Quote'}
              </button>

              <p className="text-xs text-[#8F8F8F] mt-3 text-center">
                Quote will be saved and you'll be redirected to the details page
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
