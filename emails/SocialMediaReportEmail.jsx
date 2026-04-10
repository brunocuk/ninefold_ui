// emails/SocialMediaReportEmail.jsx
// Premium email template for sending monthly social media reports - Croatian version

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';

export default function SocialMediaReportEmail({
  clientName = 'Cijenjeni klijente',
  reportReference = 'SMR-202604-KLIJENT',
  reportUrl = 'https://ninefold.eu/social-report/123',
  pdfUrl = 'https://ninefold.eu/api/social-media-reports/123/pdf',
  periodDisplay = 'Travanj 2026',
  // Platform data
  platforms = {},
  // Content
  contentDelivered = {},
  contentPlanned = {},
  postsPublished = 0,
  // Totals
  totalReach = 0,
  totalEngagement = 0,
  followerGrowth = 0,
  avgEngagementRate = null,
  // Top posts
  topPosts = [],
  // Paid Ads
  paidAdsEnabled = false,
  paidAdsSpend = null,
  paidAdsImpressions = null,
  paidAdsClicks = null,
  // Highlights & Recommendations
  highlights = [],
  recommendations = [],
}) {
  const hasPlatforms = Object.keys(platforms).length > 0;
  const hasTopPosts = topPosts.length > 0;

  const platformLabels = {
    instagram: 'Instagram',
    facebook: 'Facebook',
    linkedin: 'LinkedIn',
    tiktok: 'TikTok'
  };

  const platformColors = {
    instagram: '#E4405F',
    facebook: '#1877F2',
    linkedin: '#0A66C2',
    tiktok: '#000000'
  };

  return (
    <Html>
      <Head />
      <Preview>Mjesečni izvještaj društvenih mreža - {periodDisplay} | NineFold</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with gradient accent */}
          <Section style={header}>
            <Section style={accentBar} />
            <Section style={logoSection}>
              <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                <tr>
                  <td>
                    <Heading style={logo}>NineFold</Heading>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Text style={headerBadge}>SOCIAL MEDIA</Text>
                  </td>
                </tr>
              </table>
            </Section>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            {/* Greeting */}
            <Text style={greeting}>Poštovani/a {clientName},</Text>

            <Text style={introText}>
              S zadovoljstvom Vam dostavljamo mjesečni izvještaj aktivnosti na društvenim mrežama
              za <strong style={{ color: '#E4405F' }}>{periodDisplay}</strong>.
              Izvještaj uključuje pregled objavljenog sadržaja, metrike po platformama i analizu najboljih objava.
            </Text>

            {/* Report Card */}
            <Section style={reportCard}>
              <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                <tr>
                  <td style={cardRow}>
                    <Text style={cardIcon}>📊</Text>
                    <div>
                      <Text style={cardLabel}>Referenca izvještaja</Text>
                      <Text style={cardValue}>{reportReference}</Text>
                    </div>
                  </td>
                </tr>
              </table>
              <Hr style={cardDivider} />
              <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                <tr>
                  <td style={cardRow}>
                    <Text style={cardIcon}>📅</Text>
                    <div>
                      <Text style={cardLabel}>Razdoblje</Text>
                      <Text style={cardValue}>{periodDisplay}</Text>
                    </div>
                  </td>
                </tr>
              </table>
            </Section>

            {/* Key Metrics */}
            <Section style={metricsSection}>
              <Heading style={sectionTitle}>📈 Ključne Metrike</Heading>
              <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                <tr>
                  <td style={metricBox}>
                    <Text style={metricValue}>{postsPublished}</Text>
                    <Text style={metricLabel}>Objave</Text>
                  </td>
                  <td style={metricBox}>
                    <Text style={metricValue}>{totalReach.toLocaleString()}</Text>
                    <Text style={metricLabel}>Doseg</Text>
                  </td>
                  <td style={metricBox}>
                    <Text style={metricValue}>{totalEngagement.toLocaleString()}</Text>
                    <Text style={metricLabel}>Engagement</Text>
                  </td>
                  <td style={metricBox}>
                    <Text style={{
                      ...metricValue,
                      color: followerGrowth >= 0 ? '#00CC75' : '#ef4444'
                    }}>
                      {followerGrowth >= 0 ? '+' : ''}{followerGrowth}
                    </Text>
                    <Text style={metricLabel}>Rast</Text>
                  </td>
                </tr>
              </table>
              {avgEngagementRate && (
                <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse', marginTop: '16px' }}>
                  <tr>
                    <td style={{ textAlign: 'center' }}>
                      <Text style={{ ...metricValue, fontSize: '28px', color: '#00CC75' }}>
                        {avgEngagementRate}%
                      </Text>
                      <Text style={metricLabel}>Prosječni Engagement Rate</Text>
                    </td>
                  </tr>
                </table>
              )}
            </Section>

            {/* Platform Breakdown */}
            {hasPlatforms && (
              <Section style={platformSection}>
                <Heading style={sectionTitle}>📱 Platforme</Heading>
                <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                  {Object.entries(platforms).map(([key, data]) => {
                    if (!data) return null;
                    return (
                      <tr key={key}>
                        <td style={platformRow}>
                          <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                            <tr>
                              <td style={{ width: '120px' }}>
                                <Text style={{
                                  ...platformName,
                                  color: platformColors[key] || '#888'
                                }}>
                                  {platformLabels[key] || key}
                                </Text>
                              </td>
                              <td>
                                <Text style={platformStat}>
                                  <strong>{(data.followers || 0).toLocaleString()}</strong> pratitelja
                                  {data.follower_change && (
                                    <span style={{
                                      marginLeft: '8px',
                                      color: data.follower_change >= 0 ? '#00CC75' : '#ef4444'
                                    }}>
                                      ({data.follower_change >= 0 ? '+' : ''}{data.follower_change})
                                    </span>
                                  )}
                                </Text>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                {data.engagement_rate && (
                                  <Text style={platformEngRate}>{data.engagement_rate}% eng.</Text>
                                )}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    );
                  })}
                </table>
              </Section>
            )}

            {/* CTA Button */}
            <Section style={buttonSection}>
              <Button style={primaryButton} href={reportUrl}>
                Pregledaj cijeli izvještaj →
              </Button>
            </Section>

            {/* PDF Download */}
            <Section style={pdfSection}>
              <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                <tr>
                  <td style={{ textAlign: 'center' }}>
                    <Text style={pdfText}>
                      Ili preuzmite PDF verziju:{' '}
                      <Link href={pdfUrl} style={pdfLink}>
                        Preuzmi PDF →
                      </Link>
                    </Text>
                  </td>
                </tr>
              </table>
            </Section>

            {/* Highlights */}
            {highlights.length > 0 && (
              <Section style={highlightSection}>
                <Heading style={h3}>✨ Istaknuto ovaj mjesec</Heading>
                <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                  {highlights.map((item, index) => (
                    <tr key={index}>
                      <td style={highlightItem}>
                        <Text style={highlightNumber}>{index + 1}</Text>
                        <Text style={highlightText}>{item}</Text>
                      </td>
                    </tr>
                  ))}
                </table>
              </Section>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <Section style={recommendSection}>
                <Heading style={h3}>💡 Preporuke</Heading>
                <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                  {recommendations.map((item, index) => (
                    <tr key={index}>
                      <td style={recommendItem}>
                        <Text style={recommendNumber}>{index + 1}</Text>
                        <Text style={highlightText}>{item}</Text>
                      </td>
                    </tr>
                  ))}
                </table>
              </Section>
            )}

            {/* Info Box */}
            <Section style={infoBox}>
              <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                <tr>
                  <td style={{ width: '24px', verticalAlign: 'top', paddingRight: '12px' }}>
                    <Text style={infoIcon}>ℹ️</Text>
                  </td>
                  <td>
                    <Text style={infoText}>
                      Ovaj izvještaj je automatski generiran kao dio Vašeg paketa upravljanja društvenim mrežama.
                      Za sva pitanja ili posebne zahtjeve, slobodno odgovorite na ovaj email
                      ili nas kontaktirajte direktno.
                    </Text>
                  </td>
                </tr>
              </table>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Section style={footerContent}>
              <Heading style={footerLogo}>NineFold</Heading>
              <Text style={footerTagline}>Vaš partner za digitalni marketing</Text>

              <Hr style={footerDivider} />

              <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                <tr>
                  <td style={{ textAlign: 'center' }}>
                    <Link href="https://ninefold.eu" style={footerLink}>ninefold.eu</Link>
                    <Text style={footerDot}>•</Text>
                    <Link href="mailto:hello@ninefold.eu" style={footerLink}>hello@ninefold.eu</Link>
                  </td>
                </tr>
              </table>

              <Text style={footerAddress}>Zagreb, Hrvatska</Text>
              <Text style={copyright}>© {new Date().getFullYear()} NineFold. Sva prava pridržana.</Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f0f0f0',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  padding: '40px 0',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  maxWidth: '600px',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
};

const header = {
  backgroundColor: '#0A0A0A',
};

const accentBar = {
  height: '4px',
  background: 'linear-gradient(90deg, #E4405F 0%, #3b82f6 50%, #00FF94 100%)',
};

const logoSection = {
  padding: '32px 40px',
};

const logo = {
  color: '#00FF94',
  fontSize: '28px',
  fontWeight: '800',
  margin: '0',
  padding: '0',
  letterSpacing: '-0.5px',
};

const headerBadge = {
  color: '#E4405F',
  fontSize: '12px',
  fontWeight: '700',
  letterSpacing: '2px',
  margin: '0',
  padding: '8px 16px',
  border: '1px solid #E4405F',
  borderRadius: '4px',
  display: 'inline-block',
};

const content = {
  padding: '48px 40px',
};

const greeting = {
  color: '#1a1a1a',
  fontSize: '20px',
  fontWeight: '600',
  marginBottom: '16px',
  marginTop: '0',
};

const introText = {
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '1.7',
  marginBottom: '32px',
};

const reportCard = {
  backgroundColor: '#fafafa',
  border: '1px solid #e8e8e8',
  borderRadius: '12px',
  padding: '28px',
  marginBottom: '24px',
};

const cardRow = {
  display: 'flex',
  alignItems: 'flex-start',
  padding: '8px 0',
};

const cardIcon = {
  fontSize: '20px',
  marginRight: '16px',
  marginTop: '0',
  marginBottom: '0',
  display: 'inline-block',
  width: '28px',
};

const cardLabel = {
  color: '#888',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  margin: '0 0 4px 0',
};

const cardValue = {
  color: '#1a1a1a',
  fontSize: '16px',
  fontWeight: '500',
  margin: '0',
  lineHeight: '1.4',
};

const cardDivider = {
  borderColor: '#e8e8e8',
  margin: '16px 0',
};

const sectionTitle = {
  color: '#1a1a1a',
  fontSize: '16px',
  fontWeight: '700',
  marginBottom: '16px',
  marginTop: '0',
};

// Metrics styles
const metricsSection = {
  marginBottom: '24px',
};

const metricBox = {
  textAlign: 'center',
  padding: '16px 8px',
  backgroundColor: '#fafafa',
  borderRadius: '8px',
  border: '1px solid #e8e8e8',
};

const metricValue = {
  fontSize: '24px',
  fontWeight: '800',
  color: '#E4405F',
  margin: '0 0 4px 0',
  lineHeight: '1',
};

const metricLabel = {
  color: '#888',
  fontSize: '11px',
  fontWeight: '600',
  textTransform: 'uppercase',
  margin: '0',
};

// Platform styles
const platformSection = {
  marginBottom: '32px',
};

const platformRow = {
  padding: '12px 16px',
  backgroundColor: '#fafafa',
  borderRadius: '8px',
  marginBottom: '8px',
};

const platformName = {
  fontSize: '14px',
  fontWeight: '700',
  margin: '0',
};

const platformStat = {
  fontSize: '14px',
  color: '#4a4a4a',
  margin: '0',
};

const platformEngRate = {
  fontSize: '13px',
  color: '#00CC75',
  fontWeight: '600',
  margin: '0',
};

const buttonSection = {
  textAlign: 'center',
  marginBottom: '16px',
};

const primaryButton = {
  backgroundColor: '#E4405F',
  borderRadius: '10px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '700',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  padding: '18px 48px',
  boxShadow: '0 4px 14px rgba(228, 64, 95, 0.3)',
};

const pdfSection = {
  marginBottom: '32px',
};

const pdfText = {
  color: '#888',
  fontSize: '14px',
  margin: '0',
};

const pdfLink = {
  color: '#E4405F',
  fontWeight: '600',
  textDecoration: 'none',
};

const highlightSection = {
  backgroundColor: '#f0fdf4',
  borderLeft: '4px solid #00FF94',
  borderRadius: '0 8px 8px 0',
  padding: '20px 24px',
  marginBottom: '20px',
};

const recommendSection = {
  backgroundColor: '#eff6ff',
  borderLeft: '4px solid #3b82f6',
  borderRadius: '0 8px 8px 0',
  padding: '20px 24px',
  marginBottom: '20px',
};

const h3 = {
  color: '#1a1a1a',
  fontSize: '16px',
  fontWeight: '700',
  marginBottom: '16px',
  marginTop: '0',
};

const highlightItem = {
  padding: '8px 0',
  display: 'flex',
  alignItems: 'flex-start',
};

const recommendItem = {
  padding: '8px 0',
  display: 'flex',
  alignItems: 'flex-start',
};

const highlightNumber = {
  backgroundColor: '#00CC75',
  color: '#ffffff',
  fontSize: '11px',
  fontWeight: '700',
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  display: 'inline-block',
  textAlign: 'center',
  lineHeight: '20px',
  marginRight: '12px',
  marginTop: '0',
  marginBottom: '0',
  flexShrink: '0',
};

const recommendNumber = {
  backgroundColor: '#3b82f6',
  color: '#ffffff',
  fontSize: '11px',
  fontWeight: '700',
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  display: 'inline-block',
  textAlign: 'center',
  lineHeight: '20px',
  marginRight: '12px',
  marginTop: '0',
  marginBottom: '0',
  flexShrink: '0',
};

const highlightText = {
  color: '#4a4a4a',
  fontSize: '14px',
  margin: '0',
  lineHeight: '1.5',
};

const infoBox = {
  backgroundColor: '#fef3f3',
  borderLeft: '4px solid #E4405F',
  borderRadius: '0 8px 8px 0',
  padding: '16px 20px',
  marginTop: '32px',
};

const infoIcon = {
  fontSize: '16px',
  margin: '0',
};

const infoText = {
  color: '#4a4a4a',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
};

const footer = {
  backgroundColor: '#0A0A0A',
  padding: '40px',
};

const footerContent = {
  textAlign: 'center',
};

const footerLogo = {
  color: '#00FF94',
  fontSize: '24px',
  fontWeight: '800',
  margin: '0 0 8px 0',
  letterSpacing: '-0.5px',
};

const footerTagline = {
  color: '#888',
  fontSize: '14px',
  margin: '0 0 24px 0',
  fontStyle: 'italic',
};

const footerDivider = {
  borderColor: '#333',
  margin: '24px 0',
};

const footerLink = {
  color: '#ffffff',
  fontSize: '14px',
  textDecoration: 'none',
};

const footerDot = {
  color: '#555',
  margin: '0 12px',
  display: 'inline',
};

const footerAddress = {
  color: '#666',
  fontSize: '13px',
  margin: '16px 0 8px 0',
};

const copyright = {
  color: '#555',
  fontSize: '12px',
  margin: '0',
};
