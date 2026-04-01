// app/(quote-preview)/quote/[id]/page.jsx
// Quote Preview - Multi-service support with Project and Monthly quote types

'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { SERVICE_TYPES, getServiceType, getServiceBadgeColor } from '@/lib/serviceTemplates';

export default function QuotePreview() {
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
          monthlyPrice: data.monthly_price || data.pricing?.monthlyPrice || 0
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
            background: #0F0F0F;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .spinner {
            width: 50px;
            height: 50px;
            border: 3px solid #1a1a1a;
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
        background: '#0F0F0F',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1 style={{fontSize: '3rem', marginBottom: '20px', fontWeight: '900'}}>404</h1>
        <p style={{color: '#8F8F8F'}}>Ponuda nije pronađena</p>
      </div>
    );
  }

  const isMonthly = quoteData.quoteType === 'monthly';
  const serviceInfo = getServiceType(quoteData.serviceType);

  return (
    <>
      <style jsx>{`
        @import url('https://api.fontshare.com/v2/css?f[]=nohemi@400,500,600,700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: #0F0F0F;
        }

        .quote-page {
          font-family: 'Nohemi', sans-serif;
          background: #0F0F0F;
          color: #fff;
          min-height: 100vh;
        }

        /* Top Navigation */
        .top-nav {
          position: sticky;
          top: 0;
          background: rgba(15, 15, 15, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #1a1a1a;
          z-index: 100;
          animation: slide-down 0.6s ease-out;
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 24px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
        }

        .nav-actions {
          display: flex;
          gap: 12px;
        }

        .btn {
          padding: 12px 24px;
          border-radius: 100px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
          border: none;
          font-family: 'Nohemi', sans-serif;
        }

        .btn-secondary {
          background: transparent;
          color: #8F8F8F;
          border: 1px solid #2A2A2A;
        }

        .btn-secondary:hover {
          background: #1a1a1a;
          color: #fff;
          border-color: #00FF94;
        }

        .btn-primary {
          background: #00FF94;
          color: #0F0F0F;
          font-weight: 700;
        }

        .btn-primary:hover {
          background: #00DD7F;
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0, 255, 148, 0.3);
        }

        .btn-monthly {
          background: #A855F7;
          color: white;
        }

        .btn-monthly:hover {
          background: #9333EA;
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(168, 85, 247, 0.3);
        }

        .btn-download {
          background: transparent;
          color: #fff;
          border: 1px solid #2A2A2A;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-download:hover {
          background: #1a1a1a;
          border-color: #00FF94;
        }

        .btn-download:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner-small {
          width: 16px;
          height: 16px;
          border: 2px solid #2A2A2A;
          border-top-color: #00FF94;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        /* PDF Mode Styles */
        .pdf-mode .top-nav {
          display: none;
        }

        .pdf-mode .sidebar {
          position: static;
        }

        .pdf-mode .hero {
          padding: 40px 40px;
        }

        .pdf-mode .content-wrapper {
          padding: 40px;
        }

        .pdf-mode .section {
          margin-bottom: 40px;
        }

        .pdf-mode .pricing-card {
          break-inside: avoid;
        }

        @media print {
          .top-nav {
            display: none !important;
          }
          .sidebar {
            position: static !important;
          }
        }

        /* Hero Section */
        .hero {
          max-width: 1400px;
          margin: 0 auto;
          padding: 80px 40px;
          animation: fade-in-up 0.8s ease-out;
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .service-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .hero-title {
          font-size: clamp(3rem, 7vw, 5rem);
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 24px;
          background: linear-gradient(135deg, #fff 0%, #00FF94 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-title-monthly {
          background: linear-gradient(135deg, #fff 0%, #A855F7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: #8F8F8F;
          margin-bottom: 48px;
          max-width: 600px;
        }

        .meta-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }

        .meta-card {
          background: #1a1a1a;
          border: 1px solid #2A2A2A;
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s ease;
        }

        .meta-card:hover {
          border-color: #00FF94;
          transform: translateY(-4px);
        }

        .meta-card-monthly:hover {
          border-color: #A855F7;
        }

        .meta-label {
          font-size: 0.85rem;
          color: #8F8F8F;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .meta-value {
          font-size: 1.1rem;
          color: #00FF94;
          font-weight: 700;
        }

        .meta-value-monthly {
          color: #A855F7;
        }

        /* Main Content */
        .content-wrapper {
          max-width: 1400px;
          margin: 0 auto;
          padding: 60px 40px;
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 60px;
        }

        .main-content {
          animation: fade-in-up 1s ease-out backwards;
          animation-delay: 0.2s;
        }

        .section {
          margin-bottom: 80px;
        }

        .section-title {
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 32px;
        }

        .text-large {
          font-size: 1.15rem;
          line-height: 1.8;
          color: #C4C4C4;
        }

        /* Objectives */
        .objectives-grid {
          display: grid;
          gap: 16px;
        }

        .objective-item {
          background: #1a1a1a;
          border: 1px solid #2A2A2A;
          border-radius: 12px;
          padding: 20px 24px;
          display: flex;
          align-items: start;
          gap: 16px;
          transition: all 0.3s ease;
        }

        .objective-item:hover {
          border-color: #00FF94;
          background: rgba(0, 255, 148, 0.05);
        }

        .check-icon {
          width: 24px;
          height: 24px;
          background: #00FF94;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0F0F0F;
          font-weight: 900;
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .check-icon-monthly {
          background: #A855F7;
        }

        .objective-text {
          color: #C4C4C4;
          line-height: 1.6;
        }

        /* Scope Cards */
        .scope-grid {
          display: grid;
          gap: 24px;
        }

        .scope-card {
          background: #1a1a1a;
          border: 1px solid #2A2A2A;
          border-radius: 16px;
          padding: 32px;
          transition: all 0.3s ease;
        }

        .scope-card:hover {
          border-color: #00FF94;
          transform: translateX(8px);
        }

        .scope-card-monthly:hover {
          border-color: #A855F7;
        }

        .scope-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .scope-number {
          width: 48px;
          height: 48px;
          background: #00FF94;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 900;
          color: #0F0F0F;
        }

        .scope-number-monthly {
          background: #A855F7;
        }

        .scope-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #fff;
        }

        .scope-list {
          list-style: none;
          display: grid;
          gap: 12px;
        }

        .scope-list li {
          color: #8F8F8F;
          padding-left: 24px;
          position: relative;
          line-height: 1.6;
        }

        .scope-list li::before {
          content: '→';
          position: absolute;
          left: 0;
          color: #00FF94;
          font-weight: 700;
        }

        .scope-list-monthly li::before {
          color: #A855F7;
        }

        /* Timeline */
        .timeline {
          display: grid;
          gap: 16px;
        }

        .timeline-item {
          background: #1a1a1a;
          border: 1px solid #2A2A2A;
          border-radius: 12px;
          padding: 24px;
          display: grid;
          grid-template-columns: 140px 1fr 120px;
          gap: 24px;
          align-items: center;
          transition: all 0.3s ease;
        }

        .timeline-item:hover {
          border-color: #00FF94;
          background: rgba(0, 255, 148, 0.03);
        }

        .timeline-week {
          font-weight: 700;
          color: #00FF94;
        }

        .timeline-phase {
          color: #C4C4C4;
        }

        .timeline-duration {
          color: #8F8F8F;
          text-align: right;
          font-size: 0.9rem;
        }

        .timeline-note {
          margin-top: 32px;
          padding: 20px 24px;
          background: rgba(0, 255, 148, 0.05);
          border: 1px solid rgba(0, 255, 148, 0.15);
          border-radius: 12px;
          font-size: 0.9rem;
          line-height: 1.7;
          color: #8F8F8F;
        }

        .timeline-note strong {
          color: #00FF94;
        }

        /* Sidebar */
        .sidebar {
          position: sticky;
          top: 120px;
          height: fit-content;
          animation: fade-in-up 1s ease-out backwards;
          animation-delay: 0.4s;
        }

        .pricing-card {
          background: #1a1a1a;
          border: 1px solid #2A2A2A;
          border-radius: 24px;
          padding: 40px;
          position: relative;
          overflow: hidden;
        }

        .pricing-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #00FF94 0%, #00DD7F 100%);
        }

        .pricing-card-monthly::before {
          background: linear-gradient(90deg, #A855F7 0%, #9333EA 100%);
        }

        .pricing-header {
          margin-bottom: 32px;
        }

        .pricing-label {
          font-size: 0.9rem;
          color: #8F8F8F;
          margin-bottom: 12px;
          font-weight: 600;
        }

        .pricing-amount {
          font-size: 3.5rem;
          font-weight: 900;
          color: #00FF94;
          line-height: 1;
        }

        .pricing-amount-monthly {
          color: #A855F7;
        }

        .pricing-period {
          font-size: 1.2rem;
          color: #8F8F8F;
          font-weight: 500;
        }

        .pricing-breakdown {
          margin-bottom: 24px;
        }

        .pricing-item {
          padding: 16px 0;
          border-bottom: 1px solid #2A2A2A;
        }

        .pricing-item-header {
          display: flex;
          justify-content: space-between;
          color: #C4C4C4;
          font-weight: 500;
        }

        .pricing-item-desc {
          margin-top: 8px;
          font-size: 0.85rem;
          color: #8F8F8F;
          line-height: 1.5;
        }

        .pricing-row {
          display: flex;
          justify-content: space-between;
          padding: 16px 0;
          border-bottom: 1px solid #2A2A2A;
          color: #8F8F8F;
        }

        .pricing-row:last-child {
          border-bottom: none;
        }

        .pricing-row.subtotal {
          color: #C4C4C4;
        }

        .pricing-row.discount {
          color: #00FF94;
        }

        .pricing-row.total {
          border-top: 2px solid #2A2A2A;
          padding-top: 24px;
          margin-top: 8px;
          font-size: 1.2rem;
          font-weight: 700;
          color: #fff;
        }

        .payment-terms {
          background: rgba(0, 255, 148, 0.05);
          border: 1px solid rgba(0, 255, 148, 0.2);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .payment-terms-monthly {
          background: rgba(168, 85, 247, 0.05);
          border-color: rgba(168, 85, 247, 0.2);
        }

        .payment-term {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
        }

        .payment-term:first-child {
          border-bottom: 1px solid rgba(0, 255, 148, 0.2);
          padding-bottom: 12px;
          margin-bottom: 12px;
        }

        .payment-terms-monthly .payment-term:first-child {
          border-color: rgba(168, 85, 247, 0.2);
        }

        .payment-term-label {
          color: #8F8F8F;
          font-size: 0.9rem;
        }

        .payment-term-value {
          color: #00FF94;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .payment-term-value-monthly {
          color: #A855F7;
        }

        /* Maintenance Section */
        .maintenance-section {
          background: rgba(59, 130, 246, 0.08);
          border: 1px solid rgba(59, 130, 246, 0.25);
          border-radius: 12px;
          padding: 24px;
          margin-top: 24px;
        }

        .maintenance-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .maintenance-badge {
          background: rgba(59, 130, 246, 0.2);
          color: #60A5FA;
          padding: 4px 10px;
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .maintenance-title {
          font-size: 1rem;
          font-weight: 700;
          color: #60A5FA;
        }

        .maintenance-price {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .maintenance-price-label {
          color: #93C5FD;
          font-size: 0.9rem;
        }

        .maintenance-price-value {
          color: #60A5FA;
          font-weight: 700;
          font-size: 1.3rem;
        }

        .maintenance-description {
          color: #93C5FD;
          font-size: 0.85rem;
          line-height: 1.6;
          padding-top: 12px;
          border-top: 1px solid rgba(59, 130, 246, 0.2);
        }

        .maintenance-note {
          margin-top: 12px;
          padding: 10px 12px;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 8px;
          font-size: 0.75rem;
          color: #93C5FD;
        }

        .cta-button {
          width: 100%;
          padding: 18px;
          margin-top: 24px;
          background: #00FF94;
          color: #0F0F0F;
          border: none;
          border-radius: 100px;
          font-family: 'Nohemi', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: block;
          text-align: center;
        }

        .cta-button:hover {
          background: #00DD7F;
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 255, 148, 0.4);
        }

        .cta-button-monthly {
          background: #A855F7;
        }

        .cta-button-monthly:hover {
          background: #9333EA;
          box-shadow: 0 8px 30px rgba(168, 85, 247, 0.4);
        }

        /* Monthly billing info */
        .billing-info {
          margin-top: 16px;
          padding: 16px;
          background: rgba(168, 85, 247, 0.1);
          border: 1px solid rgba(168, 85, 247, 0.2);
          border-radius: 12px;
        }

        .billing-info-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: #A855F7;
          margin-bottom: 8px;
        }

        .billing-info-text {
          font-size: 0.8rem;
          color: #C4B5FD;
          line-height: 1.5;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .content-wrapper {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .sidebar {
            position: static;
          }

          .nav-container {
            padding: 20px;
          }

          .hero {
            padding: 60px 20px;
          }

          .content-wrapper {
            padding: 40px 20px;
          }

          .timeline-item {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .timeline-duration {
            text-align: left;
          }
        }

        @media (max-width: 640px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .meta-cards {
            grid-template-columns: 1fr;
          }

          .nav-container {
            flex-direction: column;
            gap: 16px;
            padding: 16px;
          }

          .logo {
            font-size: 1.25rem;
          }

          .nav-actions {
            flex-direction: column;
            width: 100%;
            gap: 10px;
          }

          .btn {
            padding: 12px 16px;
            font-size: 0.85rem;
            width: 100%;
            text-align: center;
            justify-content: center;
          }

          .btn-download {
            justify-content: center;
          }

          .btn-primary {
            white-space: nowrap;
          }

          .mobile-hide {
            display: none;
          }

          .mobile-show {
            display: inline;
          }
        }

        .mobile-show {
          display: none;
        }

        .mobile-hide {
          display: inline;
        }
      `}</style>

      <div className={`quote-page ${isPdfMode ? 'pdf-mode' : ''}`}>
        {/* Top Navigation */}
        <nav className="top-nav">
          <div className="nav-container">
            <div className="logo">NineFold</div>
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
                      <span className="payment-term-label">{((quoteData.pricing?.depositRate || 0.5) * 100).toFixed(0)}% Akontacija</span>
                      <span className="payment-term-value">
                        €{(quoteData.pricing?.total * (quoteData.pricing?.depositRate || 0.5))?.toLocaleString()}
                      </span>
                    </div>
                    <div className="payment-term">
                      <span className="payment-term-label">{(100 - (quoteData.pricing?.depositRate || 0.5) * 100).toFixed(0)}% Po završetku</span>
                      <span className="payment-term-value">
                        €{(quoteData.pricing?.total * (1 - (quoteData.pricing?.depositRate || 0.5)))?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Maintenance & Support (Optional) */}
                  {quoteData.maintenance?.enabled && (
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
