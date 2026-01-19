// app/(quote-preview)/ponuda/[id]/page.jsx
// Quote Preview - Authentic NineFold Branding

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function QuotePreview() {
  const params = useParams();
  const [quoteData, setQuoteData] = useState(null);
  const [loading, setLoading] = useState(true);

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
  }, [params.id]);

  const loadQuote = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;

      if (data) {
        await supabase
          .from('quotes')
          .update({
            view_count: (data.view_count || 0) + 1,
            last_viewed_at: new Date().toISOString()
          })
          .eq('id', params.id);

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
          pricing: data.pricing
        };

        setQuoteData(formattedData);
      }
    } catch (error) {
      console.error('Error loading quote:', error);
    } finally {
      setLoading(false);
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

        .payment-term-label {
          color: #8F8F8F;
          font-size: 0.9rem;
        }

        .payment-term-value {
          color: #00FF94;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .cta-button {
          width: 100%;
          padding: 18px;
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

          .btn {
            padding: 10px 20px;
            font-size: 0.9rem;
          }

          .nav-actions {
            flex-direction: column;
            width: 100%;
          }

          .btn-secondary,
          .btn-primary {
            width: 100%;
          }
        }
      `}</style>

      <div className="quote-page">
        {/* Top Navigation */}
        <nav className="top-nav">
          <div className="nav-container">
            <div className="logo">NineFold</div>
            <div className="nav-actions">
              <a
                href={`/api/quotes/${params.id}/pdf`}
                className="btn btn-secondary"
                download
              >
                📄 Preuzmi PDF
              </a>
              {quoteData.paymentLink && (
                <a href={quoteData.paymentLink} className="btn btn-primary">
                  Prihvati ponudu i plati akontaciju →
                </a>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero">
          <h1 className="hero-title">{quoteData.title || 'Projektna Ponuda'}</h1>
          <p className="hero-subtitle">
            Pripremljeno za {quoteData.clientName}
          </p>

          <div className="meta-cards">
            <div className="meta-card">
              <div className="meta-label">Referenca</div>
              <div className="meta-value">{quoteData.reference}</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">Datum</div>
              <div className="meta-value">{quoteData.date}</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">Trajanje</div>
              <div className="meta-value">{quoteData.duration}</div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="content-wrapper">
          <div className="main-content">
            {/* Overview */}
            <section className="section">
              <h2 className="section-title">Pregled Projekta</h2>
              <p className="text-large">{quoteData.projectOverview}</p>
            </section>

            {/* Objectives */}
            {quoteData.objectives && quoteData.objectives.length > 0 && (
              <section className="section">
                <h2 className="section-title">Ciljevi</h2>
                <div className="objectives-grid">
                  {quoteData.objectives.map((obj, index) => (
                    <div key={index} className="objective-item">
                      <div className="check-icon">✓</div>
                      <div className="objective-text">{obj}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Scope */}
            <section className="section">
              <h2 className="section-title">Opseg Rada</h2>
              <div className="scope-grid">
                {quoteData.scope.map((section, index) => (
                  <div key={index} className="scope-card">
                    <div className="scope-header">
                      <div className="scope-number">{section.number}</div>
                      <h3 className="scope-title">{section.title}</h3>
                    </div>
                    <ul className="scope-list">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Timeline */}
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
          </div>

          {/* Sidebar - Pricing */}
          <aside className="sidebar">
            <div className="pricing-card">
              <div className="pricing-header">
                <div className="pricing-label">Ukupna Investicija</div>
                <div className="pricing-amount">
                  €{quoteData.pricing.total.toLocaleString()}
                </div>
              </div>

              <div className="pricing-breakdown">
                {/* Line Items */}
                {quoteData.pricing.items && quoteData.pricing.items.length > 0 && (
                  <>
                    {quoteData.pricing.items.map((item, index) => (
                      <div key={index} className="pricing-item">
                        <div className="pricing-item-header">
                          <span>{item.name}</span>
                          <span>€{item.price.toLocaleString()}</span>
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
                  <span>€{quoteData.pricing.subtotal.toLocaleString()}</span>
                </div>
                {quoteData.pricing.discountRate > 0 && (
                  <div className="pricing-row discount">
                    <span>Popust ({(quoteData.pricing.discountRate * 100).toFixed(0)}%)</span>
                    <span>-€{quoteData.pricing.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="pricing-row total">
                  <span>Ukupno</span>
                  <span>€{quoteData.pricing.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="payment-terms">
                <div className="payment-term">
                  <span className="payment-term-label">{((quoteData.pricing.depositRate || 0.5) * 100).toFixed(0)}% Akontacija</span>
                  <span className="payment-term-value">
                    €{(quoteData.pricing.total * (quoteData.pricing.depositRate || 0.5)).toLocaleString()}
                  </span>
                </div>
                <div className="payment-term">
                  <span className="payment-term-label">{(100 - (quoteData.pricing.depositRate || 0.5) * 100).toFixed(0)}% Po završetku</span>
                  <span className="payment-term-value">
                    €{(quoteData.pricing.total * (1 - (quoteData.pricing.depositRate || 0.5))).toLocaleString()}
                  </span>
                </div>
              </div>

              {quoteData.paymentLink && (
                <a href={quoteData.paymentLink} className="cta-button">
                  Prihvati ponudu i plati akontaciju →
                </a>
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}