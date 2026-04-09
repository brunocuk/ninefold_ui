// app/(quote-preview)/quote/[id]/twitter-image.jsx
// Dynamic Twitter card image for quote previews

import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';
export const alt = 'NineFold Ponuda';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Service type icons and colors
const serviceConfig = {
  web_development: { icon: '🌐', color: '#00FF94', label: 'Web Development' },
  ui_ux_design: { icon: '🎨', color: '#A855F7', label: 'UI/UX Dizajn' },
  branding: { icon: '✨', color: '#F59E0B', label: 'Branding' },
  digital_marketing: { icon: '📈', color: '#3B82F6', label: 'Digital Marketing' },
  consulting: { icon: '💼', color: '#10B981', label: 'Konzalting' },
  maintenance: { icon: '🔧', color: '#6366F1', label: 'Održavanje' },
};

export default async function Image({ params }) {
  const { id } = await params;

  // Fetch quote data
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  let quote = null;
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select('title, client_name, reference, pricing, monthly_price, quote_type, service_type')
      .eq('id', id)
      .single();

    if (!error) {
      quote = data;
    }
  } catch (e) {
    console.error('Error fetching quote for Twitter image:', e);
  }

  const isMonthly = quote?.quote_type === 'monthly';
  const service = serviceConfig[quote?.service_type] || serviceConfig.web_development;
  const accentColor = isMonthly ? '#A855F7' : service.color;
  const price = isMonthly ? quote?.monthly_price : quote?.pricing?.total;
  const title = quote?.title || 'Poslovna Ponuda';
  const clientName = quote?.client_name || 'Klijent';
  const reference = quote?.reference || '';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0F0F0F',
          padding: '60px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}99 100%)`,
          }}
        />

        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          {/* Logo */}
          <div
            style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span style={{ color: accentColor }}>●</span>
            NineFold
          </div>

          {/* Service badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: `${accentColor}20`,
              padding: '12px 24px',
              borderRadius: '100px',
              fontSize: '18px',
              color: accentColor,
              fontWeight: 600,
            }}
          >
            <span>{service.icon}</span>
            <span>{service.label}</span>
            {isMonthly && (
              <span
                style={{
                  marginLeft: '8px',
                  padding: '4px 12px',
                  backgroundColor: `${accentColor}30`,
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              >
                Mjesečno
              </span>
            )}
          </div>
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
          {/* Title */}
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.1,
              marginBottom: '24px',
              maxWidth: '900px',
            }}
          >
            {title}
          </h1>

          {/* Client name */}
          <p
            style={{
              fontSize: '28px',
              color: '#8F8F8F',
              marginBottom: '40px',
            }}
          >
            Pripremljeno za{' '}
            <span style={{ color: accentColor, fontWeight: 600 }}>{clientName}</span>
          </p>

          {/* Price and reference */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            {price && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <span style={{ fontSize: '18px', color: '#8F8F8F', marginBottom: '8px' }}>
                  {isMonthly ? 'Mjesečna cijena' : 'Ukupna investicija'}
                </span>
                <span style={{ fontSize: '48px', fontWeight: 900, color: accentColor }}>
                  €{price.toLocaleString()}
                  {isMonthly && <span style={{ fontSize: '24px', color: '#8F8F8F' }}>/mj</span>}
                </span>
              </div>
            )}

            {reference && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  paddingLeft: '40px',
                  borderLeft: '2px solid #2A2A2A',
                }}
              >
                <span style={{ fontSize: '18px', color: '#8F8F8F', marginBottom: '8px' }}>
                  Referenca
                </span>
                <span style={{ fontSize: '24px', fontWeight: 600, color: '#ffffff' }}>
                  {reference}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '30px',
            borderTop: '1px solid #2A2A2A',
          }}
        >
          <span style={{ fontSize: '16px', color: '#8F8F8F' }}>
            ninefold.agency
          </span>
          <span style={{ fontSize: '16px', color: '#8F8F8F' }}>
            Kliknite za pregled ponude →
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
