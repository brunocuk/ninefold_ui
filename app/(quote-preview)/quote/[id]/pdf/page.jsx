// app/(quote-preview)/quote/[id]/pdf/page.jsx
// Dedicated PDF Template for Quotes - Professional Invoice Style

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function QuotePdfTemplate() {
  const params = useParams();
  const [quoteData, setQuoteData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuote();

    // Hide header, footer, and cookie consent from root layout
    const style = document.createElement('style');
    style.id = 'hide-layout-elements';
    style.innerHTML = `
      body > header,
      body > footer,
      body > nav,
      #__next > header,
      #__next > footer,
      #__next > nav,
      [data-testid="header"],
      [data-testid="footer"],
      header,
      footer,
      /* CookieYes banner elements */
      .cky-consent-container,
      .cky-consent-bar,
      .cky-btn-revisit-wrapper,
      #cky-consent,
      [data-cky-tag],
      .cky-overlay {
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
      const styleEl = document.getElementById('hide-layout-elements');
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
      setQuoteData(data);
    } catch (error) {
      console.error('Error loading quote:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'white',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      }}>
        <p>Učitavanje...</p>
      </div>
    );
  }

  if (!quoteData) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'white',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      }}>
        <p>Ponuda nije pronađena</p>
      </div>
    );
  }

  const pricing = quoteData.pricing || {};
  const items = pricing.items || [];
  const subtotal = pricing.subtotal || 0;
  const discountRate = pricing.discountRate || 0;
  const discountAmount = pricing.discountAmount || 0;
  const total = pricing.total || 0;
  const depositRate = pricing.depositRate || 0.5;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('hr-HR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('hr-HR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount) + ' €';
  };

  // Styles
  const styles = {
    document: {
      width: '210mm',
      minHeight: '297mm',
      padding: '15mm 20mm',
      background: 'white',
      position: 'relative',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: '11px',
      lineHeight: '1.5',
      color: '#1a1a1a',
      boxSizing: 'border-box'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '30px',
      paddingBottom: '20px',
      borderBottom: '1px solid #e5e5e5'
    },
    logo: {
      width: '50px',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    companyInfo: {
      textAlign: 'right'
    },
    companyName: {
      fontSize: '14px',
      fontWeight: '700',
      color: '#1a1a1a',
      marginBottom: '2px'
    },
    companyOwner: {
      fontSize: '10px',
      color: '#666',
      marginBottom: '8px'
    },
    companyDetails: {
      fontSize: '10px',
      color: '#666',
      lineHeight: '1.6'
    },
    documentTitle: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1a1a1a',
      marginBottom: '30px',
      marginTop: '0'
    },
    infoSection: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '40px',
      marginBottom: '40px'
    },
    infoBlockTitle: {
      fontSize: '10px',
      fontWeight: '600',
      color: '#666',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '12px',
      marginTop: '0'
    },
    infoRow: {
      display: 'flex',
      marginBottom: '6px'
    },
    infoLabel: {
      fontSize: '10px',
      fontWeight: '600',
      color: '#1a1a1a',
      minWidth: '100px'
    },
    infoValue: {
      fontSize: '10px',
      color: '#444'
    },
    clientName: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#1a1a1a',
      marginBottom: '8px'
    },
    itemsSection: {
      marginBottom: '30px'
    },
    itemsHeader: {
      display: 'grid',
      gridTemplateColumns: '1fr 80px 100px 100px',
      gap: '15px',
      padding: '12px 0',
      borderBottom: '2px solid #1a1a1a',
      fontSize: '10px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    itemsHeaderRight: {
      textAlign: 'right'
    },
    itemRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 80px 100px 100px',
      gap: '15px',
      padding: '15px 0',
      borderBottom: '1px solid #e5e5e5',
      alignItems: 'start'
    },
    itemName: {
      fontWeight: '500',
      color: '#1a1a1a',
      marginBottom: '4px'
    },
    itemDescription: {
      fontSize: '10px',
      color: '#666',
      marginTop: '4px'
    },
    itemValue: {
      fontSize: '11px',
      color: '#444',
      textAlign: 'right'
    },
    totalsSection: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: '40px'
    },
    totalsBox: {
      width: '280px'
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '8px 0',
      fontSize: '11px'
    },
    totalRowSubtotal: {
      borderBottom: '1px solid #e5e5e5'
    },
    totalRowDiscount: {
      color: '#00CC76'
    },
    totalRowGrand: {
      borderTop: '2px solid #1a1a1a',
      marginTop: '8px',
      paddingTop: '12px',
      fontSize: '14px',
      fontWeight: '700'
    },
    totalLabel: {
      color: '#666'
    },
    totalLabelGrand: {
      color: '#1a1a1a'
    },
    totalValue: {
      fontWeight: '600'
    },
    paymentSection: {
      background: '#f8f8f8',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '40px'
    },
    paymentTitle: {
      fontSize: '11px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '15px',
      color: '#1a1a1a'
    },
    paymentRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '8px 0',
      fontSize: '11px',
      borderBottom: '1px solid #e5e5e5'
    },
    paymentRowLast: {
      borderBottom: 'none'
    },
    paymentLabel: {
      color: '#666'
    },
    paymentValue: {
      fontWeight: '600',
      color: '#00CC76'
    },
    notesSection: {
      marginBottom: '40px'
    },
    notesTitle: {
      fontSize: '10px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '10px',
      color: '#1a1a1a'
    },
    notesText: {
      fontSize: '10px',
      color: '#666',
      lineHeight: '1.7'
    },
    signatureSection: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '60px'
    },
    signatureBox: {
      textAlign: 'center',
      width: '200px'
    },
    signatureLine: {
      borderTop: '1px solid #1a1a1a',
      paddingTop: '10px',
      marginTop: '50px'
    },
    signatureLabel: {
      fontSize: '10px',
      color: '#666'
    },
    signatureName: {
      fontSize: '11px',
      fontWeight: '600',
      color: '#1a1a1a'
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { background: white; }
        @page { size: A4; margin: 0; }
      `}</style>

      <div style={styles.document}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>
            <img src="/favicon.ico" alt="Ninefold" width="40" height="40" style={{ borderRadius: '8px' }} />
          </div>
          <div style={styles.companyInfo}>
            <div style={styles.companyName}>PROGMATIQ, VL. BRUNO ČUKIĆ</div>
            <div style={styles.companyDetails}>
              Glavna 12, 10360 Sesvete, Croatia<br />
              www.ninefold.eu hello@ninefold.eu +385913333447<br />
              <strong style={{ color: '#1a1a1a' }}>OIB</strong> 50299147291
            </div>
          </div>
        </div>

        {/* Document Title */}
        <h1 style={styles.documentTitle}>PONUDA {quoteData.reference}</h1>

        {/* Info Section */}
        <div style={styles.infoSection}>
          <div>
            <h3 style={styles.infoBlockTitle}>Klijent</h3>
            <div style={styles.clientName}>{quoteData.client_name}</div>
            {quoteData.quote_data?.clientAddress && (
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>ADRESA</span>
                <span style={styles.infoValue}>{quoteData.quote_data.clientAddress}</span>
              </div>
            )}
            {quoteData.quote_data?.clientOib && (
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>OIB:</span>
                <span style={styles.infoValue}>{quoteData.quote_data.clientOib}</span>
              </div>
            )}
          </div>
          <div>
            <h3 style={styles.infoBlockTitle}>Datum izdavanja</h3>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>DATUM PONUDE</span>
              <span style={styles.infoValue}>{formatDate(quoteData.created_at)}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>VRIJEDI DO</span>
              <span style={styles.infoValue}>{formatDate(new Date(new Date(quoteData.created_at).getTime() + 30 * 24 * 60 * 60 * 1000))}</span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div style={styles.itemsSection}>
          <div style={styles.itemsHeader}>
            <span>NAZIV I OPIS</span>
            <span style={styles.itemsHeaderRight}>KOL</span>
            <span style={styles.itemsHeaderRight}>CIJENA</span>
            <span style={styles.itemsHeaderRight}>UKUPNO</span>
          </div>
          {items.map((item, index) => (
            <div key={index} style={styles.itemRow}>
              <div>
                <div style={styles.itemName}>{index + 1}. {item.name}</div>
                {item.description && (
                  <div style={styles.itemDescription}>{item.description}</div>
                )}
              </div>
              <span style={styles.itemValue}>1 kom</span>
              <span style={styles.itemValue}>{formatCurrency(item.price)}</span>
              <span style={styles.itemValue}>{formatCurrency(item.price)}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div style={styles.totalsSection}>
          <div style={styles.totalsBox}>
            <div style={{ ...styles.totalRow, ...styles.totalRowSubtotal }}>
              <span style={styles.totalLabel}>Međuzbroj</span>
              <span style={styles.totalValue}>{formatCurrency(subtotal)}</span>
            </div>
            {discountRate > 0 && (
              <div style={{ ...styles.totalRow, ...styles.totalRowDiscount }}>
                <span>Popust ({(discountRate * 100).toFixed(0)}%)</span>
                <span style={styles.totalValue}>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div style={{ ...styles.totalRow, ...styles.totalRowGrand }}>
              <span style={styles.totalLabelGrand}>Ukupno za plaćanje</span>
              <span style={styles.totalValue}>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Payment Terms */}
        <div style={styles.paymentSection}>
          <div style={styles.paymentTitle}>Uvjeti plaćanja</div>
          <div style={styles.paymentRow}>
            <span style={styles.paymentLabel}>{(depositRate * 100).toFixed(0)}% Akontacija (prije početka rada)</span>
            <span style={styles.paymentValue}>{formatCurrency(total * depositRate)}</span>
          </div>
          <div style={{ ...styles.paymentRow, ...styles.paymentRowLast }}>
            <span style={styles.paymentLabel}>{(100 - depositRate * 100).toFixed(0)}% Po završetku projekta</span>
            <span style={styles.paymentValue}>{formatCurrency(total * (1 - depositRate))}</span>
          </div>
        </div>

        {/* Notes */}
        <div style={styles.notesSection}>
          <div style={styles.notesTitle}>Napomena</div>
          <div style={styles.notesText}>
            Vremenski planovi su okvirni i mogu varirati ovisno o kompleksnosti specifičnih zahtjeva i brzini povratnih informacija tijekom razvoja.
            Svi projekti uključuju redovite update sastanke kako biste bili u tijeku sa svakim korakom napretka.
            Ponuda vrijedi 30 dana od datuma izdavanja.
          </div>
        </div>

        {/* Signature */}
        <div style={styles.signatureSection}>
          <div style={styles.signatureBox}>
            <div style={styles.signatureLine}>
              <div style={styles.signatureLabel}>VLASNIK</div>
              <div style={styles.signatureName}>Bruno Cukic</div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
