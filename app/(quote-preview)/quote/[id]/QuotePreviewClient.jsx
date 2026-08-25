// app/(quote-preview)/quote/[id]/QuotePreviewClient.jsx
// Quote Preview Client Component - Multi-service support with Project and Monthly quote types

'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { SERVICE_TYPES, getServiceType, getServiceBadgeColor } from '@/lib/serviceTemplates';

export default function QuotePreviewClient() {
  const params = useParams();
  const searchParams = useSearchParams();
  const isPdfMode = searchParams.get('pdf') === 'true';
  const [quoteData, setQuoteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  useEffect(() => {
    loadQuote();

    // Force hide header/footer
    const style = document.createElement('style');
    style.id = 'hide-header-footer';
    style.innerHTML = `
      body > header,
      body > footer,
      body > nav,
      #__next > header,
      #__next > footer,
      #__next > nav,
      [data-testid="header"],
      [data-testid="footer"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        height: 0 !important;
        overflow: hidden !important;
        position: absolute !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const styleEl = document.getElementById('hide-header-footer');
      if (styleEl) styleEl.remove();
    };
  }, [params.id, isPdfMode]);

  const loadQuote = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;

      if (data) {
        // Don't increment view count in PDF mode
        if (!isPdfMode) {
          await supabase
            .from('quotes')
            .update({
              view_count: (data.view_count || 0) + 1,
              last_viewed_at: new Date().toISOString()
            })
            .eq('id', params.id);
        }

        const formattedData = {
          title: data.title,
          clientName: data.client_name,
          reference: data.reference,
          date: new Date(data.created_at).toLocaleDateString('hr-HR'),
          duration: data.duration,
          projectOverview: data.project_overview,
          objectives: data.quote_data?.objectives || [],
          paymentLink: data.quote_data?.paymentLink || '',
          scope: data.scope,
          timeline: data.timeline,
          pricing: data.pricing,
          maintenance: data.pricing?.maintenance || null,
          // New fields for multi-service support
          serviceType: data.service_type || 'web_development',
          quoteType: data.quote_type || 'project',
          services: data.services || null,
          monthlyPrice: data.monthly_price || data.pricing?.monthlyPrice || 0,
          // Rich data from quote builder
          serviceSelections: data.service_selections || null,
          lineItems: data.quote_data?.lineItems || null
        };

        setQuoteData(formattedData);
      }
    } catch (error) {
      console.error('Error loading quote:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      const response = await fetch(`/api/quotes/${params.id}/pdf`);
      if (!response.ok) throw new Error('PDF generation failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      a.download = filenameMatch ? filenameMatch[1] : `Ponuda_${quoteData.reference || 'NF'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Greška pri generiranju PDF-a. Pokušajte ponovo.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <style jsx>{`
          .loading-screen {
            min-height: 100vh;
            background: #080808;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-top-color: #00FF94;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!quoteData) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#080808',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#F2F2F2',
        fontFamily: "'Space Grotesk', sans-serif",
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1 style={{fontSize: '3rem', marginBottom: '16px', fontWeight: '500', letterSpacing: '-0.02em'}}>404</h1>
        <p style={{color: '#8E8E8E'}}>Ponuda nije pronađena</p>
      </div>
    );
  }

  const isMonthly = quoteData.quoteType === 'monthly';
  const serviceInfo = getServiceType(quoteData.serviceType);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: #080808;
        }

        .quote-page {
          font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #080808;
          color: #F2F2F2;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }

        /* Top Navigation */
        .top-nav {
          position: sticky;
          top: 0;
          background: rgba(8, 8, 8, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          z-index: 100;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 18px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
        }

        .logo img {
          height: 16px;
          width: auto;
        }

        .nav-actions {
          display: flex;
          gap: 10px;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 22px;
          border-radius: 999px;
          font-family: inherit;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          text-decoration: none;
          transition: transform 0.15s ease, background 0.15s ease;
        }

        .btn-download {
          background: rgba(255, 255, 255, 0.06);
          color: #F2F2F2;
          border: 1px solid rgba(255, 255, 255, 0.07);
        }

        .btn-download:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .btn-download:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary,
        .btn-monthly {
          background: #F2F2F2;
          color: #080808;
        }

        .btn-primary:hover,
        .btn-monthly:hover {
          transform: scale(1.02);
        }

        .spinner-small {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(8, 8, 8, 0.2);
          border-top-color: #080808;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          display: inline-block;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Hero */
        .hero {
          max-width: 1200px;
          margin: 0 auto;
          padding: 90px 40px 50px;
        }

        .service-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.07);
          color: #8E8E8E !important;
          font-family: ui-monospace, Menlo, monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
        }

        .service-badge::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #00FF94;
          flex-shrink: 0;
        }

        .hero-title {
          margin-top: 26px;
          font-size: clamp(2.2rem, 5vw, 3.4rem);
          font-weight: 500;
          letter-spacing: -0.02em;
          line-height: 1.05;
          color: #F2F2F2;
          max-width: 800px;
        }

        .hero-title-monthly {
          color: #F2F2F2;
        }

        .hero-subtitle {
          margin-top: 14px;
          font-size: 1.05rem;
          color: #8E8E8E;
        }

        .meta-cards {
          margin-top: 40px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          max-width: 720px;
        }

        .meta-card,
        .meta-card-monthly {
          background: #0F0F0F;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          padding: 18px 20px;
        }

        .meta-label {
          font-family: ui-monospace, Menlo, monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #8E8E8E;
          margin-bottom: 8px;
        }

        .meta-value,
        .meta-value-monthly {
          font-size: 0.95rem;
          font-weight: 500;
          color: #F2F2F2;
        }

        /* Layout */
        .content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          padding: 10px 40px 90px;
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 48px;
          align-items: start;
        }

        .main-content {
          min-width: 0;
        }

        .section {
          margin-bottom: 56px;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: ui-monospace, Menlo, monospace;
          font-size: 11px;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #8E8E8E;
          margin-bottom: 20px;
        }

        .section-title::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #00FF94;
          flex-shrink: 0;
        }

        .text-large {
          font-size: 1.1rem;
          line-height: 1.65;
          color: #C9C9C9;
          max-width: 640px;
        }

        /* Service cards */
        .services-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }

        .service-card,
        .service-card-monthly {
          background: #0F0F0F;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 18px;
          padding: 22px;
        }

        .service-card-header {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .service-card-icon,
        .service-card-icon-monthly {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.07);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .service-card-title {
          font-weight: 500;
          color: #F2F2F2;
        }

        .service-card-subtitle {
          font-size: 13px;
          color: #8E8E8E;
          margin-top: 2px;
        }

        .service-card-price {
          font-family: ui-monospace, Menlo, monospace;
          font-size: 13px;
          color: #F2F2F2;
          margin-top: 6px;
        }

        .service-card-price-monthly {
          color: #C084FC;
        }

        .service-card-features {
          margin-top: 16px;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .feature-item {
          display: flex;
          gap: 9px;
          align-items: flex-start;
          font-size: 13.5px;
          color: #C9C9C9;
        }

        .feature-check {
          color: #00FF94;
          flex-shrink: 0;
        }

        .feature-check-monthly {
          color: #C084FC;
        }

        .content-grid {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .content-item {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 10px;
          font-size: 13px;
          color: #C9C9C9;
        }

        .content-item-name {
          color: #C9C9C9;
        }

        .content-item-quantity,
        .content-item-quantity-monthly {
          font-family: ui-monospace, Menlo, monospace;
          font-size: 12px;
          color: #8E8E8E;
        }

        .content-item-price {
          font-family: ui-monospace, Menlo, monospace;
          font-size: 12px;
          color: #8E8E8E;
        }

        /* Objectives */
        .objectives-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .objective-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          background: #0F0F0F;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 14px;
          padding: 16px 18px;
        }

        .check-icon {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(0, 255, 148, 0.12);
          color: #00FF94;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .check-icon-monthly {
          background: rgba(192, 132, 252, 0.12);
          color: #C084FC;
        }

        .objective-text {
          font-size: 14.5px;
          color: #C9C9C9;
          line-height: 1.5;
        }

        /* Scope */
        .scope-grid {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .scope-card,
        .scope-card-monthly {
          background: #0F0F0F;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 18px;
          padding: 24px;
        }

        .scope-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }

        .scope-number,
        .scope-number-monthly {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: ui-monospace, Menlo, monospace;
          font-size: 12px;
          color: #8E8E8E;
          flex-shrink: 0;
        }

        .scope-title {
          font-size: 1.05rem;
          font-weight: 500;
          color: #F2F2F2;
        }

        .scope-list,
        .scope-list-monthly {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .scope-list li {
          position: relative;
          padding-left: 16px;
          font-size: 14px;
          color: #C9C9C9;
          line-height: 1.5;
        }

        .scope-list li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.55em;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #00FF94;
        }

        .scope-list-monthly li::before {
          background: #C084FC;
        }

        /* Timeline */
        .timeline {
          background: #0F0F0F;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 18px;
          overflow: hidden;
        }

        .timeline-item {
          display: grid;
          grid-template-columns: 120px 1fr auto;
          gap: 16px;
          align-items: center;
          padding: 16px 22px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }

        .timeline-item:last-child {
          border-bottom: none;
        }

        .timeline-week {
          font-family: ui-monospace, Menlo, monospace;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #8E8E8E;
        }

        .timeline-phase {
          font-size: 14.5px;
          color: #F2F2F2;
        }

        .timeline-duration {
          font-family: ui-monospace, Menlo, monospace;
          font-size: 12px;
          color: #8E8E8E;
        }

        .timeline-note {
          margin-top: 14px;
          font-size: 13px;
          line-height: 1.6;
          color: #8E8E8E;
        }

        .timeline-note strong {
          color: #C9C9C9;
          font-weight: 500;
        }

        /* Sidebar / pricing */
        .sidebar {
          position: sticky;
          top: 92px;
        }

        .pricing-card,
        .pricing-card-monthly {
          background: #0F0F0F;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 20px;
          padding: 26px;
        }

        .pricing-header {
          padding-bottom: 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          margin-bottom: 18px;
        }

        .pricing-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: ui-monospace, Menlo, monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #8E8E8E;
          margin-bottom: 12px;
        }

        .pricing-label::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #00FF94;
          flex-shrink: 0;
        }

        .pricing-amount {
          font-size: 2.4rem;
          font-weight: 500;
          letter-spacing: -0.02em;
          color: #F2F2F2;
          line-height: 1;
        }

        .pricing-amount-monthly {
          color: #C084FC;
        }

        .pricing-period {
          font-size: 1rem;
          color: #8E8E8E;
          font-weight: 400;
        }

        .pricing-breakdown {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 18px;
        }

        .pricing-item-header {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          font-size: 14px;
          color: #F2F2F2;
        }

        .pricing-item-header span:last-child {
          font-family: ui-monospace, Menlo, monospace;
          font-size: 13px;
          color: #C9C9C9;
          flex-shrink: 0;
        }

        .pricing-item-desc {
          font-size: 12.5px;
          color: #8E8E8E;
          margin-top: 3px;
          line-height: 1.45;
        }

        .pricing-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: #C9C9C9;
        }

        .pricing-row span:last-child {
          font-family: ui-monospace, Menlo, monospace;
          font-size: 13px;
        }

        .pricing-row.subtotal {
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          color: #8E8E8E;
        }

        .pricing-row.discount {
          color: #00FF94;
        }

        .pricing-row.total {
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          font-weight: 500;
          color: #F2F2F2;
          font-size: 15.5px;
        }

        .pricing-row.total span:last-child {
          font-size: 15px;
        }

        .payment-terms,
        .payment-terms-monthly {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 14px;
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 18px;
        }

        .payment-term {
          display: flex;
          justify-content: space-between;
          font-size: 13.5px;
        }

        .payment-term-label {
          color: #8E8E8E;
        }

        .payment-term-value {
          font-family: ui-monospace, Menlo, monospace;
          font-size: 13px;
          color: #F2F2F2;
        }

        .payment-term:first-child .payment-term-value {
          color: #00FF94;
        }

        .payment-term-value-monthly,
        .payment-term:first-child .payment-term-value-monthly {
          color: #C084FC;
        }

        .monthly-items-section {
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          margin-bottom: 18px;
        }

        .monthly-section-title {
          font-family: ui-monospace, Menlo, monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #8E8E8E;
          margin-bottom: 10px;
        }

        .monthly-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
          padding: 7px 0;
        }

        .monthly-item-name {
          font-size: 13.5px;
          color: #F2F2F2;
        }

        .monthly-item-desc {
          font-size: 12px;
          color: #8E8E8E;
          margin-top: 2px;
          line-height: 1.45;
        }

        .monthly-item-price {
          font-family: ui-monospace, Menlo, monospace;
          font-size: 13px;
          color: #C084FC;
          flex-shrink: 0;
        }

        .billing-info {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 14px;
          padding: 16px 18px;
          margin-bottom: 18px;
        }

        .billing-info-title {
          font-family: ui-monospace, Menlo, monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #8E8E8E;
          margin-bottom: 7px;
        }

        .billing-info-text {
          font-size: 13px;
          color: #C9C9C9;
          line-height: 1.55;
        }

        .maintenance-section {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 14px;
          padding: 18px;
          margin-bottom: 18px;
        }

        .maintenance-header {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }

        .maintenance-badge {
          font-family: ui-monospace, Menlo, monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #00FF94;
          background: rgba(0, 255, 148, 0.1);
          border: 1px solid rgba(0, 255, 148, 0.25);
          padding: 3px 8px;
          border-radius: 999px;
        }

        .maintenance-title {
          font-size: 14px;
          font-weight: 500;
          color: #F2F2F2;
        }

        .maintenance-price {
          display: flex;
          justify-content: space-between;
          font-size: 13.5px;
          margin-bottom: 8px;
        }

        .maintenance-price-label {
          color: #8E8E8E;
        }

        .maintenance-price-value {
          font-family: ui-monospace, Menlo, monospace;
          font-size: 13px;
          color: #F2F2F2;
        }

        .maintenance-description {
          font-size: 12.5px;
          color: #C9C9C9;
          line-height: 1.5;
          margin-bottom: 8px;
        }

        .maintenance-note {
          font-size: 11.5px;
          color: #8E8E8E;
          line-height: 1.5;
        }

        .cta-button,
        .cta-button-monthly {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 15px 20px;
          border-radius: 999px;
          background: #F2F2F2;
          color: #080808;
          font-weight: 500;
          font-size: 14.5px;
          text-decoration: none;
          transition: transform 0.15s ease;
        }

        .cta-button:hover,
        .cta-button-monthly:hover {
          transform: scale(1.02);
        }

        /* Responsive */
        .mobile-show {
          display: none;
        }

        .mobile-hide {
          display: inline;
        }

        @media (max-width: 1024px) {
          .content-wrapper {
            grid-template-columns: 1fr;
            gap: 40px;
            padding: 10px 24px 70px;
          }

          .sidebar {
            position: static;
          }

          .hero {
            padding: 60px 24px 40px;
          }

          .nav-container {
            padding: 14px 20px;
          }

          .meta-cards {
            grid-template-columns: 1fr;
          }

          .objectives-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .btn {
            padding: 10px 16px;
            font-size: 13px;
          }

          .mobile-show {
            display: inline;
          }

          .mobile-hide {
            display: none;
          }

          .timeline-item {
            grid-template-columns: 1fr auto;
          }

          .timeline-week {
            grid-column: 1 / -1;
          }
        }
      `}</style>

      <div className={`quote-page ${isPdfMode ? 'pdf-mode' : ''}`}>
        {/* Top Navigation */}
        <nav className="top-nav">
          <div className="nav-container">
            <div className="logo"><img src="/ninefold-logo.svg" alt="Ninefold" /></div>
            <div className="nav-actions">
              {!isPdfMode && (
                <button
                  onClick={downloadPdf}
                  disabled={downloadingPdf}
                  className="btn btn-download"
                >
                  {downloadingPdf ? (
                    <>
                      <span className="spinner-small"></span>
                      Generiranje PDF-a...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Preuzmi PDF
                    </>
                  )}
                </button>
              )}
              {quoteData.paymentLink && (
                <a href={quoteData.paymentLink} className={`btn ${isMonthly ? 'btn-monthly' : 'btn-primary'}`}>
                  <span className="mobile-hide">
                    {isMonthly ? 'Prihvati ponudu i plati prvi mjesec' : 'Prihvati ponudu i plati akontaciju'}
                  </span>
                  <span className="mobile-show">
                    {isMonthly ? 'Prihvati i plati' : 'Prihvati i plati'}
                  </span>
                  <span> →</span>
                </a>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero">
          {/* Service Type Badge */}
          <div className={`service-badge ${isMonthly ? 'bg-purple-500/20 text-purple-400' : 'bg-[#00FF94]/20 text-[#00FF94]'}`}>
            <span>{serviceInfo.icon}</span>
            <span>{serviceInfo.nameHr}</span>
            {isMonthly && <span className="ml-2 px-2 py-0.5 bg-purple-500/30 rounded text-xs">Mjesečni</span>}
          </div>

          <h1 className={`hero-title ${isMonthly ? 'hero-title-monthly' : ''}`}>
            {quoteData.title || (isMonthly ? 'Mjesečna Ponuda' : 'Projektna Ponuda')}
          </h1>
          <p className="hero-subtitle">
            Pripremljeno za {quoteData.clientName}
          </p>

          <div className="meta-cards">
            <div className={`meta-card ${isMonthly ? 'meta-card-monthly' : ''}`}>
              <div className="meta-label">Referenca</div>
              <div className={`meta-value ${isMonthly ? 'meta-value-monthly' : ''}`}>{quoteData.reference}</div>
            </div>
            <div className={`meta-card ${isMonthly ? 'meta-card-monthly' : ''}`}>
              <div className="meta-label">Datum</div>
              <div className={`meta-value ${isMonthly ? 'meta-value-monthly' : ''}`}>{quoteData.date}</div>
            </div>
            <div className={`meta-card ${isMonthly ? 'meta-card-monthly' : ''}`}>
              <div className="meta-label">{isMonthly ? 'Tip' : 'Trajanje'}</div>
              <div className={`meta-value ${isMonthly ? 'meta-value-monthly' : ''}`}>
                {isMonthly ? 'Mjesečna usluga' : quoteData.duration}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="content-wrapper">
          <div className="main-content">
            {/* Overview */}
            <section className="section">
              <h2 className="section-title">Pregled {isMonthly ? 'Usluge' : 'Projekta'}</h2>
              <p className="text-large">{quoteData.projectOverview}</p>
            </section>

            {/* Services Included - Rich display from quote builder */}
            {quoteData.serviceSelections && (
              <section className="section">
                <h2 className="section-title">Uključene Usluge</h2>
                <div className="services-grid">
                  {/* Web Development */}
                  {quoteData.serviceSelections.webDevelopment?.enabled && quoteData.serviceSelections.webDevelopment?.package && (
                    <ServiceCard
                      icon="🌐"
                      title="Web Stranica"
                      subtitle={getWebPackageName(quoteData.serviceSelections.webDevelopment.package)}
                      price={getWebPackagePrice(quoteData.serviceSelections.webDevelopment.package)}
                      features={getWebPackageFeatures(quoteData.serviceSelections.webDevelopment.package)}
                      isMonthly={isMonthly}
                    />
                  )}

                  {/* App Development */}
                  {quoteData.serviceSelections.appDevelopment?.enabled && quoteData.serviceSelections.appDevelopment?.package && (
                    <ServiceCard
                      icon="📱"
                      title="Web Aplikacija"
                      subtitle={getAppPackageName(quoteData.serviceSelections.appDevelopment.package)}
                      price={getAppPackagePrice(quoteData.serviceSelections.appDevelopment.package, quoteData.serviceSelections.appDevelopment.customPrice)}
                      features={getAppPackageFeatures(quoteData.serviceSelections.appDevelopment.package)}
                      isMonthly={isMonthly}
                    />
                  )}

                  {/* Social Media */}
                  {quoteData.serviceSelections.socialMedia?.enabled && quoteData.serviceSelections.socialMedia?.plan && (
                    <ServiceCard
                      icon="📣"
                      title="Social Media Management"
                      subtitle={getSocialPlanName(quoteData.serviceSelections.socialMedia.plan, quoteData.serviceSelections.socialMedia.customPlan)}
                      price={getSocialPlanPrice(quoteData.serviceSelections.socialMedia.plan, quoteData.serviceSelections.socialMedia.customPlan)}
                      priceLabel="/mj"
                      features={getSocialPlanFeatures(quoteData.serviceSelections.socialMedia.plan, quoteData.serviceSelections.socialMedia.customPlan)}
                      isMonthly={true}
                      contentItems={getContentItems(quoteData.serviceSelections.socialMedia.contentQuantities)}
                      customDeliverables={quoteData.serviceSelections.socialMedia.plan === 'custom' ? getCustomDeliverables(quoteData.serviceSelections.socialMedia.customPlan) : null}
                    />
                  )}

                  {/* Podcast Studio */}
                  {quoteData.serviceSelections.podcastStudio?.enabled && (
                    <ServiceCard
                      icon="🎙️"
                      title="Podcast Studio"
                      subtitle={getPodcastDurationName(quoteData.serviceSelections.podcastStudio.duration)}
                      price={getPodcastPrice(quoteData.serviceSelections.podcastStudio.duration, quoteData.serviceSelections.podcastStudio.shortsPackage)}
                      features={[
                        `${quoteData.serviceSelections.podcastStudio.shortsPackage} short-form videa`,
                        'Profesionalna oprema',
                        'Post-produkcija',
                        'Korištenje studia'
                      ]}
                      isMonthly={isMonthly}
                    />
                  )}

                  {/* Maintenance (if enabled with web) */}
                  {quoteData.serviceSelections.webDevelopment?.maintenance?.enabled && (
                    <ServiceCard
                      icon="🛡️"
                      title="Održavanje i Podrška"
                      subtitle={getMaintenanceTierName(quoteData.serviceSelections.webDevelopment.maintenance.tier)}
                      price={getMaintenanceTierPrice(quoteData.serviceSelections.webDevelopment.maintenance.tier)}
                      priceLabel="/mj"
                      features={getMaintenanceTierFeatures(quoteData.serviceSelections.webDevelopment.maintenance.tier)}
                      isMonthly={true}
                    />
                  )}
                </div>
              </section>
            )}

            {/* Objectives */}
            {quoteData.objectives && quoteData.objectives.length > 0 && (
              <section className="section">
                <h2 className="section-title">Ciljevi</h2>
                <div className="objectives-grid">
                  {quoteData.objectives.map((obj, index) => (
                    <div key={index} className="objective-item">
                      <div className={`check-icon ${isMonthly ? 'check-icon-monthly' : ''}`}>✓</div>
                      <div className="objective-text">{obj}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Scope */}
            {quoteData.scope && quoteData.scope.length > 0 && (
              <section className="section">
                <h2 className="section-title">{isMonthly ? 'Što je Uključeno' : 'Opseg Rada'}</h2>
                <div className="scope-grid">
                  {quoteData.scope.map((section, index) => (
                    <div key={index} className={`scope-card ${isMonthly ? 'scope-card-monthly' : ''}`}>
                      <div className="scope-header">
                        <div className={`scope-number ${isMonthly ? 'scope-number-monthly' : ''}`}>{section.number}</div>
                        <h3 className="scope-title">{section.title}</h3>
                      </div>
                      <ul className={`scope-list ${isMonthly ? 'scope-list-monthly' : ''}`}>
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Timeline - Only for project quotes */}
            {!isMonthly && quoteData.timeline && quoteData.timeline.length > 0 && (
              <section className="section">
                <h2 className="section-title">Vremenski Plan</h2>
                <div className="timeline">
                  {quoteData.timeline.map((phase, index) => (
                    <div key={index} className="timeline-item">
                      <div className="timeline-week">{phase.week}</div>
                      <div className="timeline-phase">{phase.phase}</div>
                      <div className="timeline-duration">{phase.duration}</div>
                    </div>
                  ))}
                </div>
                <div className="timeline-note">
                  <strong>Napomena:</strong> Vremenski planovi su okvirni i mogu varirati ovisno o kompleksnosti specifičnih zahtjeva i brzini povratnih informacija tijekom razvoja. Svi projekti uključuju redovite update sastanke kako biste bili u tijeku sa svakim korakom napretka.
                </div>
              </section>
            )}
          </div>

          {/* Sidebar - Pricing */}
          <aside className="sidebar">
            <div className={`pricing-card ${isMonthly ? 'pricing-card-monthly' : ''}`}>
              <div className="pricing-header">
                <div className="pricing-label">{isMonthly ? 'Mjesečna Cijena' : 'Ukupna Investicija'}</div>
                <div className={`pricing-amount ${isMonthly ? 'pricing-amount-monthly' : ''}`}>
                  €{isMonthly ? quoteData.monthlyPrice?.toLocaleString() : quoteData.pricing?.total?.toLocaleString()}
                  {isMonthly && <span className="pricing-period">/mj</span>}
                </div>
              </div>

              {isMonthly ? (
                /* Monthly Quote Pricing */
                <>
                  {/* Monthly Items Breakdown */}
                  {quoteData.lineItems?.monthly && quoteData.lineItems.monthly.length > 0 && (
                    <div className="monthly-items-section">
                      <div className="monthly-section-title">Mjesečna stavke</div>
                      {quoteData.lineItems.monthly.map((item, index) => (
                        <div key={index} className="monthly-item">
                          <div>
                            <div className="monthly-item-name">{item.name}</div>
                            {item.description && (
                              <div className="monthly-item-desc">{item.description}</div>
                            )}
                          </div>
                          <div className="monthly-item-price">€{item.monthlyPrice?.toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className={`payment-terms payment-terms-monthly`}>
                    <div className="payment-term">
                      <span className="payment-term-label">Prvi mjesec</span>
                      <span className={`payment-term-value payment-term-value-monthly`}>
                        €{quoteData.monthlyPrice?.toLocaleString()}
                      </span>
                    </div>
                    <div className="payment-term">
                      <span className="payment-term-label">Plaćanje unaprijed za početak</span>
                    </div>
                  </div>

                  <div className="billing-info">
                    <div className="billing-info-title">Način naplate</div>
                    <div className="billing-info-text">
                      Nakon prvog mjeseca, naplata se vrši automatski svakog mjeseca. Uslugu možete otkazati u bilo kojem trenutku s 30 dana najave.
                    </div>
                  </div>
                </>
              ) : (
                /* Project Quote Pricing */
                <>
                  <div className="pricing-breakdown">
                    {quoteData.pricing?.items && quoteData.pricing.items.length > 0 && (
                      <>
                        {quoteData.pricing.items.map((item, index) => (
                          <div key={index} className="pricing-item">
                            <div className="pricing-item-header">
                              <span>{item.name}</span>
                              <span>€{item.price?.toLocaleString()}</span>
                            </div>
                            {item.description && (
                              <div className="pricing-item-desc">{item.description}</div>
                            )}
                          </div>
                        ))}
                      </>
                    )}
                    <div className="pricing-row subtotal">
                      <span>Međuzbroj</span>
                      <span>€{quoteData.pricing?.subtotal?.toLocaleString()}</span>
                    </div>
                    {quoteData.pricing?.discountRate > 0 && (
                      <div className="pricing-row discount">
                        <span>Popust ({(quoteData.pricing.discountRate * 100).toFixed(0)}%)</span>
                        <span>-€{quoteData.pricing.discountAmount?.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="pricing-row total">
                      <span>Ukupno</span>
                      <span>€{quoteData.pricing?.total?.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="payment-terms">
                    <div className="payment-term">
                      <span className="payment-term-label">{((quoteData.pricing?.depositRate ?? 0.5) * 100).toFixed(0)}% Akontacija</span>
                      <span className="payment-term-value">
                        €{(quoteData.pricing?.total * (quoteData.pricing?.depositRate ?? 0.5))?.toLocaleString()}
                      </span>
                    </div>
                    <div className="payment-term">
                      <span className="payment-term-label">{(100 - (quoteData.pricing?.depositRate ?? 0.5) * 100).toFixed(0)}% Po završetku</span>
                      <span className="payment-term-value">
                        €{(quoteData.pricing?.total * (1 - (quoteData.pricing?.depositRate ?? 0.5)))?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Monthly Items from Quote Builder */}
                  {quoteData.lineItems?.monthly && quoteData.lineItems.monthly.length > 0 && (
                    <div className="monthly-items-section">
                      <div className="monthly-section-title">Mjesečne Usluge</div>
                      {quoteData.lineItems.monthly.map((item, index) => (
                        <div key={index} className="monthly-item">
                          <div>
                            <div className="monthly-item-name">{item.name}</div>
                            {item.description && (
                              <div className="monthly-item-desc">{item.description}</div>
                            )}
                          </div>
                          <div className="monthly-item-price">€{item.monthlyPrice?.toLocaleString()}/mj</div>
                        </div>
                      ))}
                      <div className="pricing-row total" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(168, 85, 247, 0.3)' }}>
                        <span>Mjesečno ukupno</span>
                        <span style={{ color: '#A855F7' }}>€{quoteData.pricing?.monthlyPrice?.toLocaleString()}/mj</span>
                      </div>
                    </div>
                  )}

                  {/* Maintenance & Support (Optional) - only show if no monthly items */}
                  {quoteData.maintenance?.enabled && (!quoteData.lineItems?.monthly || quoteData.lineItems.monthly.length === 0) && (
                    <div className="maintenance-section">
                      <div className="maintenance-header">
                        <span className="maintenance-badge">Preporučeno</span>
                        <span className="maintenance-title">Održavanje i Podrška</span>
                      </div>
                      <div className="maintenance-price">
                        <span className="maintenance-price-label">Mjesečna usluga</span>
                        <span className="maintenance-price-value">€{quoteData.maintenance.price?.toLocaleString()}/mj</span>
                      </div>
                      {quoteData.maintenance.description && (
                        <div className="maintenance-description">
                          {quoteData.maintenance.description}
                        </div>
                      )}
                      <div className="maintenance-note">
                        Ova opcija nije uključena u cijenu projekta. Možete je aktivirati nakon završetka projekta.
                      </div>
                    </div>
                  )}
                </>
              )}

              {quoteData.paymentLink && (
                <a href={quoteData.paymentLink} className={`cta-button ${isMonthly ? 'cta-button-monthly' : ''}`}>
                  {isMonthly ? 'Prihvati ponudu i plati prvi mjesec →' : 'Prihvati ponudu i plati akontaciju →'}
                </a>
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

// Service Card Component for displaying package details
function ServiceCard({ icon, title, subtitle, price, priceLabel = '', features, isMonthly, contentItems, customDeliverables }) {
  return (
    <div className={`service-card ${isMonthly ? 'service-card-monthly' : ''}`}>
      <div className="service-card-header">
        <div className={`service-card-icon ${isMonthly ? 'service-card-icon-monthly' : ''}`}>
          {icon}
        </div>
        <div>
          <div className="service-card-title">{title}</div>
          <div className="service-card-subtitle">{subtitle}</div>
          {price > 0 && (
            <div className={`service-card-price ${isMonthly ? 'service-card-price-monthly' : ''}`}>
              €{price.toLocaleString()}{priceLabel}
            </div>
          )}
        </div>
      </div>

      {features && features.length > 0 && (
        <div className="service-card-features">
          {features.map((feature, index) => (
            <div key={index} className="feature-item">
              <span className={`feature-check ${isMonthly ? 'feature-check-monthly' : ''}`}>✓</span>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      )}

      {/* Custom Deliverables (weekly/monthly breakdown) */}
      {customDeliverables && customDeliverables.length > 0 && (
        <div className="content-grid" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #2A2A2A' }}>
          <div style={{ gridColumn: '1 / -1', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: '#8F8F8F', fontWeight: '600' }}>Sadržaj uključen u paket</span>
          </div>
          {customDeliverables.map((item, index) => (
            <div key={index} className="content-item">
              <div className={`content-item-quantity ${isMonthly ? 'content-item-quantity-monthly' : ''}`}>
                {item.monthly}×
              </div>
              <div className="content-item-name">{item.name}</div>
              <div className="content-item-price">{item.weekly}/tj = {item.monthly}/mj</div>
            </div>
          ))}
        </div>
      )}

      {contentItems && contentItems.length > 0 && (
        <div className="content-grid" style={{ marginTop: customDeliverables?.length > 0 ? '16px' : undefined }}>
          {customDeliverables?.length > 0 && (
            <div style={{ gridColumn: '1 / -1', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: '#8F8F8F', fontWeight: '600' }}>Dodatna produkcija</span>
            </div>
          )}
          {contentItems.map((item, index) => (
            <div key={index} className="content-item">
              <div className={`content-item-quantity ${isMonthly ? 'content-item-quantity-monthly' : ''}`}>
                {item.quantity}×
              </div>
              <div className="content-item-name">{item.name}</div>
              <div className="content-item-price">€{item.unitPrice}/kom</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper functions to get package details
// These mirror the data from pricingConstants.js

const WEB_PACKAGES_DATA = {
  temelj: {
    nameHr: 'Temelj',
    price: 1490,
    features: ['Do 5 stranica', 'Responzivni dizajn', 'Kontakt forma', 'SEO optimizacija', 'SSL certifikat']
  },
  rast: {
    nameHr: 'Rast',
    price: 2490,
    features: ['Do 10 stranica', 'Responzivni dizajn', 'Blog/Novosti sekcija', 'Google Analytics', 'Social media integracija']
  },
  vrhunac: {
    nameHr: 'Vrhunac',
    price: 3990,
    features: ['Do 20 stranica', 'CMS sustav', 'Multi-jezik podrška', 'Newsletter integracija', 'Napredne animacije']
  }
};

const APP_PACKAGES_DATA = {
  start: {
    nameHr: 'Start',
    price: 2990,
    features: ['Do 5 ekrana', 'Osnovna autentikacija', 'Jednostavna baza', 'Deployment']
  },
  sustav: {
    nameHr: 'Sustav',
    price: 7200,
    features: ['Do 15 ekrana', 'Admin panel', 'API integracije', 'Automatizacije', 'Dokumentacija']
  },
  enterprise: {
    nameHr: 'Enterprise',
    price: null,
    features: ['Neograničeni ekrani', 'Kompleksne integracije', 'Skalabilna arhitektura', 'SLA podrška']
  }
};

const SOCIAL_PLANS_DATA = {
  prisutnost: {
    nameHr: 'Prisutnost',
    price: 200,
    features: ['12 objava mjesečno', 'Do 4 fotografije', 'Community management', 'Mjesečni izvještaj']
  },
  momentum: {
    nameHr: 'Momentum',
    price: 350,
    features: ['20 objava mjesečno', 'Do 8 fotografija', 'Stories sadržaj', 'Strategija sadržaja']
  },
  dominacija: {
    nameHr: 'Dominacija',
    price: 500,
    features: ['40 objava mjesečno', 'Stories + Reels', 'Influencer koordinacija', 'Paid ads management']
  },
  custom: {
    nameHr: 'Prilagođeni',
    price: null,
    features: []
  }
};

const MAINTENANCE_TIERS_DATA = {
  simple: {
    nameHr: 'Jednostavno',
    price: 80,
    features: ['Sigurnosne nadogradnje', 'Backup podataka', 'Email podrška', 'Do 2h rada/mj']
  },
  mid: {
    nameHr: 'Srednje',
    price: 135,
    features: ['Prioritetna podrška', 'Do 4h rada/mj', 'Mjesečni izvještaji', 'Optimizacija performansi']
  },
  extra: {
    nameHr: 'Napredni',
    price: 200,
    features: ['Do 8h rada/mj', '24/7 podrška', 'Proaktivno praćenje', 'Mjesečni pozivi']
  }
};

const PODCAST_DURATIONS = {
  polaSata: { name: 'Pola sata', nameHr: 'Pola sata', packages: { 5: 150, 10: 250, 15: null } },
  sat: { name: 'Sat vremena', nameHr: 'Sat vremena', packages: { 5: 180, 10: 270, 15: 330 } },
  dvaSata: { name: 'Dva sata', nameHr: 'Dva sata', packages: { 5: 240, 10: 330, 15: 400 } }
};

const CONTENT_TYPES_DATA = {
  fotografija: { nameHr: 'Fotografija', price: 20 },
  talkingHead: { nameHr: 'Talking Head', price: 40 },
  shortFormPodcast: { nameHr: 'Kratki Podcast', price: 25 },
  videoCarousel: { nameHr: 'Video Carousel', price: 40 },
  journeyVlog: { nameHr: 'Journey Vlog', price: 50 },
  highlightReel: { nameHr: 'Highlight Reel', price: 60 },
  edit: { nameHr: 'Montaža', price: 80 },
  documentary: { nameHr: 'Dokumentarac', price: 150 },
  complexTalkingHead: { nameHr: 'Kompleksni Talking Head', price: 70 },
  netflixStyle: { nameHr: 'Netflix Stil', price: 100 },
  sketch: { nameHr: 'Sketch', price: 40 }
};

function getWebPackageName(packageId) {
  return WEB_PACKAGES_DATA[packageId]?.nameHr || packageId;
}

function getWebPackagePrice(packageId) {
  return WEB_PACKAGES_DATA[packageId]?.price || 0;
}

function getWebPackageFeatures(packageId) {
  return WEB_PACKAGES_DATA[packageId]?.features || [];
}

function getAppPackageName(packageId) {
  return APP_PACKAGES_DATA[packageId]?.nameHr || packageId;
}

function getAppPackagePrice(packageId, customPrice) {
  if (packageId === 'enterprise') return customPrice || 0;
  return APP_PACKAGES_DATA[packageId]?.price || 0;
}

function getAppPackageFeatures(packageId) {
  return APP_PACKAGES_DATA[packageId]?.features || [];
}

function getSocialPlanName(planId, customPlan) {
  if (planId === 'custom') return 'Prilagođeni';
  return SOCIAL_PLANS_DATA[planId]?.nameHr || planId;
}

function getSocialPlanPrice(planId, customPlan) {
  if (planId === 'custom') return customPlan?.managementPrice || 0;
  return SOCIAL_PLANS_DATA[planId]?.price || 0;
}

function getSocialPlanFeatures(planId, customPlan) {
  if (planId === 'custom') {
    return customPlan?.features?.length > 0 ? customPlan.features : ['Prilagođeni paket'];
  }
  return SOCIAL_PLANS_DATA[planId]?.features || [];
}

function getCustomDeliverables(customPlan) {
  if (!customPlan?.contentDeliverables) return [];
  return Object.entries(customPlan.contentDeliverables)
    .filter(([_, data]) => data.weekly > 0)
    .map(([contentId, data]) => ({
      name: CONTENT_TYPES_DATA[contentId]?.nameHr || contentId,
      weekly: data.weekly,
      monthly: data.weekly * 4
    }));
}

function getMaintenanceTierName(tierId) {
  return MAINTENANCE_TIERS_DATA[tierId]?.nameHr || tierId;
}

function getMaintenanceTierPrice(tierId) {
  return MAINTENANCE_TIERS_DATA[tierId]?.price || 0;
}

function getMaintenanceTierFeatures(tierId) {
  return MAINTENANCE_TIERS_DATA[tierId]?.features || [];
}

function getPodcastDurationName(durationId) {
  return PODCAST_DURATIONS[durationId]?.nameHr || durationId;
}

function getPodcastPrice(durationId, shortsPackage) {
  return PODCAST_DURATIONS[durationId]?.packages?.[shortsPackage] || 0;
}

function getContentItems(contentQuantities) {
  if (!contentQuantities) return [];

  return Object.entries(contentQuantities)
    .filter(([_, quantity]) => quantity > 0)
    .map(([contentId, quantity]) => ({
      name: CONTENT_TYPES_DATA[contentId]?.nameHr || contentId,
      quantity,
      unitPrice: CONTENT_TYPES_DATA[contentId]?.price || 0
    }));
}
