// app/(crm-admin)/crm/quote-maker/page.jsx
// Quote generator - saves to Supabase database (FIXED)

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function QuoteMaker() {
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [saving, setSaving] = useState(false);

  // Load clients on mount
  useEffect(() => {
    loadClients();
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

  // Form state
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    clientEmail: '',
    duration: '8 tjedana',
    projectOverview: '',
    objectives: ['', '', '', ''],
    paymentLink: '',
    
    // Scope
    designScope: ['Brand analysis and design direction', 'Custom UI/UX design', 'Wireframes and mockups', '2 runde revizija'],
    developmentScope: ['Custom frontend (React/Next.js)', 'Optimizacija za brzinu i SEO', 'Responzivan dizajn', 'Custom animations'],
    contentScope: ['Professional copywriting', 'On-page SEO optimization', 'Meta tags and structured data', 'Analytics setup'],
    testingScope: ['Cross-browser testing', 'Performance optimization', 'Security setup', 'Deployment and launch'],
    
    // Pricing
    designPrice: 1200,
    developmentPrice: 2000,
    contentPrice: 800,
    seoPrice: 400,
    discountRate: 0.20,
    
    // Timeline
    timeline: [
      { week: 'Tjedan 1', phase: 'Istraživanje i planiranje', duration: '1 tjedan' },
      { week: 'Tjedan 2-4', phase: 'Dizajn', duration: '2-3 tjedna' },
      { week: 'Tjedan 5-8', phase: 'Development', duration: '3-4 tjedna' },
      { week: 'Tjedan 9', phase: 'Testiranje i lansiranje', duration: '1 tjedan' },
    ],
  });

  const calculateSubtotal = () => {
    return formData.designPrice + formData.developmentPrice + formData.contentPrice + formData.seoPrice;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal - (subtotal * formData.discountRate);
  };

  const handleClientSelect = (e) => {
    const clientId = e.target.value;
    const client = clients.find(c => c.id === clientId);
    
    if (client) {
      setFormData({
        ...formData,
        clientId: clientId,
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

  const handlePreview = async () => {
    setSaving(true);

    try {
      // Calculate pricing
      const subtotal = calculateSubtotal();
      const discountAmount = subtotal * formData.discountRate;
      const total = subtotal - discountAmount;

      // Prepare quote data
      const quoteData = {
        // Link to client if selected
        client_id: formData.clientId || null,
        lead_id: null,
        
        // REQUIRED fields
        client_name: formData.clientName,
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
        
        // Pricing
        pricing: {
          subtotal: subtotal,
          discountRate: formData.discountRate,
          discountAmount: discountAmount,
          total: total,
        },
        
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

      // Also save to sessionStorage for the preview page
      sessionStorage.setItem(`quote_${quoteId}`, JSON.stringify({
        ...quoteData.quote_data,
        pricing: quoteData.pricing
      }));
      
      // Open preview in new tab
      window.open(`/quote/${quoteId}`, '_blank');
      
      // Show success message
      alert('Quote created successfully!');
      
    } catch (error) {
      console.error('Error creating quote:', error);
      alert('Error creating quote: ' + error.message);
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
            
            {/* Client Selection */}
            <section className="bg-[#1A1A1A] p-6 rounded-lg border border-[#2A2A2A]">
              <h2 className="text-xl font-bold text-[#00FF94] mb-4">Select Client</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[#8F8F8F] text-sm mb-2">
                    Existing Client (Optional)
                  </label>
                  <select
                    value={formData.clientId}
                    onChange={handleClientSelect}
                    className="w-full bg-[#0F0F0F] text-white p-3 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none"
                  >
                    <option value="">-- New Client / Manual Entry --</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.company || client.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-[#666] text-xs mt-2">
                    Select an existing client or enter details manually below
                  </p>
                </div>
              </div>
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
                    className="w-full bg-[#0F0F0F] text-white p-3 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none"
                    placeholder="DI plan"
                    disabled={!!formData.clientId}
                  />
                </div>
                <div>
                  <label className="block text-[#8F8F8F] text-sm mb-2">Client Email</label>
                  <input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
                    className="w-full bg-[#0F0F0F] text-white p-3 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none"
                    placeholder="client@company.com"
                    disabled={!!formData.clientId}
                  />
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
                <div>
                  <label className="block text-[#8F8F8F] text-sm mb-2">Payment Link (Optional)</label>
                  <input
                    type="url"
                    value={formData.paymentLink}
                    onChange={(e) => setFormData({...formData, paymentLink: e.target.value})}
                    className="w-full bg-[#0F0F0F] text-white p-3 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none"
                    placeholder="https://pay.ninefold.eu/client-name"
                  />
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

            {/* Pricing */}
            <section className="bg-[#1A1A1A] p-6 rounded-lg border border-[#2A2A2A]">
              <h2 className="text-xl font-bold text-[#00FF94] mb-4">Pricing</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#8F8F8F] text-sm mb-2">Design</label>
                  <input
                    type="number"
                    value={formData.designPrice}
                    onChange={(e) => setFormData({...formData, designPrice: Number(e.target.value)})}
                    className="w-full bg-[#0F0F0F] text-white p-3 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#8F8F8F] text-sm mb-2">Development</label>
                  <input
                    type="number"
                    value={formData.developmentPrice}
                    onChange={(e) => setFormData({...formData, developmentPrice: Number(e.target.value)})}
                    className="w-full bg-[#0F0F0F] text-white p-3 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#8F8F8F] text-sm mb-2">Content</label>
                  <input
                    type="number"
                    value={formData.contentPrice}
                    onChange={(e) => setFormData({...formData, contentPrice: Number(e.target.value)})}
                    className="w-full bg-[#0F0F0F] text-white p-3 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#8F8F8F] text-sm mb-2">SEO</label>
                  <input
                    type="number"
                    value={formData.seoPrice}
                    onChange={(e) => setFormData({...formData, seoPrice: Number(e.target.value)})}
                    className="w-full bg-[#0F0F0F] text-white p-3 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[#8F8F8F] text-sm mb-2">Discount (%)</label>
                  <input
                    type="number"
                    value={formData.discountRate * 100}
                    onChange={(e) => setFormData({...formData, discountRate: Number(e.target.value) / 100})}
                    className="w-full bg-[#0F0F0F] text-white p-3 rounded border border-[#2A2A2A] focus:border-[#00FF94] outline-none"
                    placeholder="20"
                  />
                </div>
              </div>
            </section>

          </div>

          {/* Sidebar - Summary */}
          <div>
            <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#2A2A2A] sticky top-8">
              <h2 className="text-xl font-bold text-[#00FF94] mb-4">Quote Summary</h2>
              
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#8F8F8F]">Design</span>
                  <span className="text-white">€{formData.designPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8F8F8F]">Development</span>
                  <span className="text-white">€{formData.developmentPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8F8F8F]">Content</span>
                  <span className="text-white">€{formData.contentPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8F8F8F]">SEO</span>
                  <span className="text-white">€{formData.seoPrice.toLocaleString()}</span>
                </div>
                
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
                
                <div className="text-xs text-[#8F8F8F] pt-2">
                  <div>50% Deposit: €{(calculateTotal() * 0.5).toLocaleString()}</div>
                  <div>50% Final: €{(calculateTotal() * 0.5).toLocaleString()}</div>
                </div>
              </div>

              <button
                onClick={handlePreview}
                disabled={!formData.clientName || !formData.projectOverview || saving}
                className="w-full bg-[#00FF94] text-black font-bold py-4 rounded mt-6 hover:bg-[#00DD7F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Creating...' : 'Create & Preview Quote'}
              </button>
              
              <p className="text-xs text-[#8F8F8F] mt-3 text-center">
                Saves to database and opens preview
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}