// app/(crm-admin)/crm/quote-maker/page.jsx
// Quote generator with payment link generation BEFORE quote creation

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { CreditCard, Loader2, Copy, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function QuoteMaker() {
  const router = useRouter();
  const toast = useToast();
  const [clients, setClients] = useState([]);
  const [leads, setLeads] = useState([]);
  const [saving, setSaving] = useState(false);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [linkGenerated, setLinkGenerated] = useState(false);
  const [sourceType, setSourceType] = useState('manual'); // 'manual', 'client', or 'lead'

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

  // Form state
  const [formData, setFormData] = useState({
    clientId: '',
    leadId: '',
    title: '',
    clientName: '',
    clientEmail: '',
    duration: '8 tjedana',
    projectOverview: '',
    objectives: ['', '', '', ''],
    paymentLink: '',
    revolutOrderId: '',
    
    // Scope
    designScope: ['Brand analysis and design direction', 'Custom UI/UX design', 'Wireframes and mockups', '2 runde revizija'],
    developmentScope: ['Custom frontend (React/Next.js)', 'Optimizacija za brzinu i SEO', 'Responzivan dizajn', 'Custom animations'],
    contentScope: ['Professional copywriting', 'On-page SEO optimization', 'Meta tags and structured data', 'Analytics setup'],
    testingScope: ['Cross-browser testing', 'Performance optimization', 'Security setup', 'Deployment and launch'],
    
    // Pricing - Dynamic line items
    items: [
      { name: 'Website Design + Development', description: '', price: 3200 }
    ],
    discountRate: 0.20,
    depositRate: 0.50, // Default 50% deposit

    // Maintenance & Support (optional)
    maintenanceEnabled: false,
    maintenancePrice: 150,
    maintenanceDescription: 'Monthly website maintenance including security updates, backups, performance monitoring, and up to 2 hours of content updates.',

    // Timeline
    timeline: [
      { week: 'Tjedan 1', phase: 'Istraživanje i planiranje', duration: '1 tjedan' },
      { week: 'Tjedan 2-4', phase: 'Dizajn', duration: '2-3 tjedna' },
      { week: 'Tjedan 5-8', phase: 'Development', duration: '3-4 tjedna' },
      { week: 'Tjedan 9', phase: 'Testiranje i lansiranje', duration: '1 tjedan' },
    ],
  });

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
    // Reset selection when changing source type
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

  // NEW: Generate Payment Link Function
  const handleGeneratePaymentLink = async () => {
    // Validation
    if (!formData.clientName) {
      toast.warning('Please enter a client name first');
      return;
    }
    
    if (!formData.clientEmail) {
      toast.warning('Please enter a client email first');
      return;
    }
    
    const total = calculateTotal();
    if (total <= 0) {
      toast.warning('Quote total must be greater than 0');
      return;
    }

    setGeneratingLink(true);
    setLinkGenerated(false);

    try {
      // Calculate deposit based on depositRate
      const depositAmount = total * formData.depositRate;
      const depositPercent = Math.round(formData.depositRate * 100);

      // Create Revolut payment link for deposit
      const response = await fetch('/api/quotes/create-payment-link-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(depositAmount * 100), // Convert to cents
          currency: 'EUR',
          clientEmail: formData.clientEmail,
          clientName: formData.clientName,
          description: `${depositPercent}% Deposit for ${formData.clientName} - ${formData.projectOverview.substring(0, 80)}`,
        }),
      });

      const data = await response.json();

      if (response.ok && data.checkout_url) {
        // Fill the payment link field
        setFormData({
          ...formData,
          paymentLink: data.checkout_url,
          revolutOrderId: data.order_id,
        });
        setLinkGenerated(true);
        console.log('Payment link generated:', data.checkout_url);
        console.log('Order ID saved:', data.order_id);
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
      // Calculate pricing
      const subtotal = calculateSubtotal();
      const discountAmount = subtotal * formData.discountRate;
      const total = subtotal - discountAmount;

      // Prepare quote data
      const quoteData = {
        // Link to client or lead if selected
        client_id: formData.clientId || null,
        lead_id: formData.leadId || null,
        
        // REQUIRED fields
        title: formData.title || null,
        client_name: formData.clientName,
        client_email: formData.clientEmail,
        project_overview: formData.projectOverview,
        duration: formData.duration,
        scope: [
          { number: "1", title: "Konzultacije i planiranje", items: formData.designScope.filter(item => item.trim() !== '') },
          { number: "2", title: "Dizajn korisničkog sučelja", items: formData.developmentScope.filter(item => item.trim() !== '') },
          { number: "3", title: "Development", items: formData.contentScope.filter(item => item.trim() !== '') },
          { number: "4", title: "Testiranje i objava", items: formData.testingScope.filter(item => item.trim() !== '') },
        ],
        timeline: formData.timeline,
        
        // Quote details
        reference: `NF-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${formData.clientName.substring(0, 3).toUpperCase()}`,
        quote_number: `NF-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${formData.clientName.substring(0, 3).toUpperCase()}`,
        status: 'draft',
        
        // Quote content (JSONB)
        quote_data: {
          clientName: formData.clientName,
          clientEmail: formData.clientEmail,
          reference: `NF-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${formData.clientName.substring(0, 3).toUpperCase()}`,
          date: new Date().toLocaleDateString('hr-HR'),
          duration: formData.duration,
          projectOverview: formData.projectOverview,
          objectives: formData.objectives.filter(obj => obj.trim() !== ''),
          paymentLink: formData.paymentLink,
          scope: [
            { number: "1", title: "Konzultacije i planiranje", items: formData.designScope.filter(item => item.trim() !== '') },
            { number: "2", title: "Dizajn korisničkog sučelja", items: formData.developmentScope.filter(item => item.trim() !== '') },
            { number: "3", title: "Development", items: formData.contentScope.filter(item => item.trim() !== '') },
            { number: "4", title: "Testiranje i objava", items: formData.testingScope.filter(item => item.trim() !== '') },
          ],
          timeline: formData.timeline,
        },
        
        // Pricing - with line items and deposit rate
        pricing: {
          items: formData.items.filter(item => item.name.trim() !== '' && item.price > 0),
          subtotal: subtotal,
          discountRate: formData.discountRate,
          discountAmount: discountAmount,
          total: total,
          depositRate: formData.depositRate,
          // Maintenance & Support (optional - not included in total)
          maintenance: formData.maintenanceEnabled ? {
            enabled: true,
            price: formData.maintenancePrice,
            description: formData.maintenanceDescription
          } : null,
        },
        
        // Store payment link in revolut_checkout_url if it's a Revolut link
        revolut_checkout_url: formData.paymentLink.includes('revolut.com') ? formData.paymentLink : null,
        revolut_order_id: formData.revolutOrderId || null,
        
        // Tracking
        view_count: 0,
        last_viewed_at: null
      };

      // Save to database
      const { data, error } = await supabase
        .from('quotes')
        .insert([quoteData])
        .select();

      if (error) throw error;

      const quoteId = data[0].id;

      // Navigate to quote detail page
      router.push(`/crm/quotes/${quoteId}`);
      
    } catch (error) {
      console.error('Error creating quote:', error);
      toast.error('Error creating quote: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] p-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Source Selection */}
            <section className="bg-[#1A1A1A] p-6 rounded-lg border border-[#2A2A2A]">
              <h2 className="text-xl font-bold text-[#00FF94] mb-4">Quote For</h2>

              {/* Source Type Tabs */}
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

              {/* Client Dropdown */}
              {sourceType === 'client' && (
                <div>
                  <label className="block text-[#8F8F8F] text-sm mb-2">
                    Select Client
                  </label>
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
                </div>
              )}

              {/* Lead Dropdown */}
              {sourceType === 'lead' && (
                <div>
                  <label className="block text-[#8F8F8F] text-sm mb-2">
                    Select Lead
                  </label>
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
                </div>
              )}

              {/* Manual Entry Message */}
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
                    placeholder="8 tjedana"
                  />
                </div>
                
                {/* Payment Link Section */}
                <div>
                  <label className="block text-[#8F8F8F] text-sm mb-2">Payment Link</label>
                  
                  {/* Generate Payment Link Button */}
                  <button
                    onClick={handleGeneratePaymentLink}
                    disabled={generatingLink || !formData.clientName || !formData.clientEmail || calculateTotal() <= 0}
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
                        Deposit Link Generated ({(formData.depositRate * 100).toFixed(0)}%)
                      </>
                    ) : (
                      <>
                        <CreditCard size={18} />
                        Generate Deposit Payment Link ({(formData.depositRate * 100).toFixed(0)}%)
                      </>
                    )}
                  </button>
                  
                  {/* Payment Link Input */}
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
                    
                    {/* Copy Button */}
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
                      ✓ Deposit payment link generated ({(formData.depositRate * 100).toFixed(0)}% of total)! This will be included in the quote.
                    </div>
                  )}

                  <p className="text-[#666] text-xs mt-2">
                    Generate a Revolut payment link for {(formData.depositRate * 100).toFixed(0)}% deposit or paste one manually
                  </p>
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

            {/* Pricing - Line Items */}
            <section className="bg-[#1A1A1A] p-6 rounded-lg border border-[#2A2A2A]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#00FF94]">Services / Line Items</h2>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-2 bg-[#00FF94] text-black px-3 py-2 rounded text-sm font-semibold hover:bg-[#00DD7F] transition-colors"
                >
                  <Plus size={16} />
                  Add Item
                </button>
              </div>

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
                      placeholder="Description (optional) - e.g., Custom design, responsive layout, 3 revision rounds..."
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
            </section>

            {/* Maintenance & Support (Optional) */}
            <section className="bg-[#1A1A1A] p-6 rounded-lg border border-[#2A2A2A]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-[#00FF94]">Maintenance & Support</h2>
                  <p className="text-[#666] text-xs mt-1">Optional recurring monthly service (not included in project total)</p>
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
                        placeholder="Describe what's included in the maintenance package..."
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
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3">
                    <p className="text-blue-400 text-xs">
                      <strong>Note:</strong> This is presented as a recommended monthly service, separate from the one-time project cost. It will NOT be included in the project subtotal or discount calculations.
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* Timeline */}
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

              <p className="text-[#666] text-xs mt-3">
                Definirajte faze projekta koje će se prikazati klijentu u ponudi
              </p>
            </section>

          </div>

          {/* Sidebar - Summary */}
          <div>
            <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#2A2A2A] sticky top-8">
              <h2 className="text-xl font-bold text-[#00FF94] mb-4">Quote Summary</h2>
              
              <div className="space-y-4 text-sm">
                {/* Line Items */}
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

                {/* Maintenance & Support (if enabled) */}
                {formData.maintenanceEnabled && formData.maintenancePrice > 0 && (
                  <div className="text-xs pt-3 mt-3 border-t border-[#2A2A2A]">
                    <div className="font-semibold text-white mb-2">Maintenance & Support (Optional):</div>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded p-2">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-400">Monthly Service:</span>
                        <span className="text-blue-400 font-bold">€{formData.maintenancePrice.toLocaleString()}/mo</span>
                      </div>
                      <div className="text-[10px] text-blue-400/70 mt-1">Recommended recurring service (separate from project)</div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleCreateQuote}
                disabled={!formData.clientName || !formData.projectOverview || saving}
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