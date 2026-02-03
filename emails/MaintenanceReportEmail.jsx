// emails/MaintenanceReportEmail.jsx
// Premium email template for sending monthly maintenance reports - Croatian version

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

export default function MaintenanceReportEmail({
  clientName = 'Cijenjeni klijente',
  reportReference = 'MR-202602-KLIJENT',
  reportUrl = 'https://ninefold.eu/report/123',
  pdfUrl = 'https://ninefold.eu/api/maintenance-reports/123/pdf',
  periodDisplay = 'Veljača 2026',
  // Lighthouse data
  lighthouse = {},
  // Analytics data
  analytics = {},
  analyticsComparison = {},
  // Highlights & Recommendations
  highlights = [],
  recommendations = [],
}) {
  const hasLighthouse = lighthouse.performance || lighthouse.accessibility || lighthouse.best_practices || lighthouse.seo;
  const hasAnalytics = analytics.sessions || analytics.users || analytics.pageviews;

  const getScoreColor = (score) => {
    if (!score) return '#888';
    if (score >= 90) return '#00CC75';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const formatChange = (value) => {
    if (value === null || value === undefined) return null;
    return value >= 0 ? `+${value}%` : `${value}%`;
  };

  return (
    <Html>
      <Head />
      <Preview>Mjesečni izvještaj održavanja - {periodDisplay} | NineFold</Preview>
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
                    <Text style={headerBadge}>IZVJEŠTAJ</Text>
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
              S zadovoljstvom Vam dostavljamo mjesečni izvještaj održavanja Vaše web stranice
              za <strong style={{ color: '#00FF94' }}>{periodDisplay}</strong>.
              Izvještaj uključuje rezultate Lighthouse analize i pregled prometa iz Google Analyticsa.
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

            {/* Lighthouse Scores */}
            {hasLighthouse && (
              <Section style={lighthouseSection}>
                <Heading style={sectionTitle}>🚀 Lighthouse Rezultati</Heading>
                <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                  <tr>
                    {lighthouse.performance !== null && lighthouse.performance !== undefined && (
                      <td style={lighthouseBox}>
                        <Text style={{ ...lighthouseScore, color: getScoreColor(lighthouse.performance) }}>
                          {lighthouse.performance}
                        </Text>
                        <Text style={lighthouseLabel}>Performance</Text>
                      </td>
                    )}
                    {lighthouse.accessibility !== null && lighthouse.accessibility !== undefined && (
                      <td style={lighthouseBox}>
                        <Text style={{ ...lighthouseScore, color: getScoreColor(lighthouse.accessibility) }}>
                          {lighthouse.accessibility}
                        </Text>
                        <Text style={lighthouseLabel}>Accessibility</Text>
                      </td>
                    )}
                    {lighthouse.best_practices !== null && lighthouse.best_practices !== undefined && (
                      <td style={lighthouseBox}>
                        <Text style={{ ...lighthouseScore, color: getScoreColor(lighthouse.best_practices) }}>
                          {lighthouse.best_practices}
                        </Text>
                        <Text style={lighthouseLabel}>Best Practices</Text>
                      </td>
                    )}
                    {lighthouse.seo !== null && lighthouse.seo !== undefined && (
                      <td style={lighthouseBox}>
                        <Text style={{ ...lighthouseScore, color: getScoreColor(lighthouse.seo) }}>
                          {lighthouse.seo}
                        </Text>
                        <Text style={lighthouseLabel}>SEO</Text>
                      </td>
                    )}
                  </tr>
                </table>
              </Section>
            )}

            {/* Analytics Stats */}
            {hasAnalytics && (
              <Section style={analyticsSection}>
                <Heading style={sectionTitle}>📊 Google Analytics</Heading>
                <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                  <tr>
                    {analytics.sessions !== null && analytics.sessions !== undefined && (
                      <td style={analyticsBox}>
                        <Text style={analyticsValue}>{analytics.sessions.toLocaleString()}</Text>
                        <Text style={analyticsLabel}>Sesije</Text>
                        {analyticsComparison.sessions_change !== null && analyticsComparison.sessions_change !== undefined && (
                          <Text style={{
                            ...analyticsChange,
                            color: analyticsComparison.sessions_change >= 0 ? '#00CC75' : '#ef4444'
                          }}>
                            {formatChange(analyticsComparison.sessions_change)}
                          </Text>
                        )}
                      </td>
                    )}
                    {analytics.users !== null && analytics.users !== undefined && (
                      <td style={analyticsBox}>
                        <Text style={analyticsValue}>{analytics.users.toLocaleString()}</Text>
                        <Text style={analyticsLabel}>Korisnici</Text>
                        {analyticsComparison.users_change !== null && analyticsComparison.users_change !== undefined && (
                          <Text style={{
                            ...analyticsChange,
                            color: analyticsComparison.users_change >= 0 ? '#00CC75' : '#ef4444'
                          }}>
                            {formatChange(analyticsComparison.users_change)}
                          </Text>
                        )}
                      </td>
                    )}
                    {analytics.pageviews !== null && analytics.pageviews !== undefined && (
                      <td style={analyticsBox}>
                        <Text style={analyticsValue}>{analytics.pageviews.toLocaleString()}</Text>
                        <Text style={analyticsLabel}>Pregledi</Text>
                        {analyticsComparison.pageviews_change !== null && analyticsComparison.pageviews_change !== undefined && (
                          <Text style={{
                            ...analyticsChange,
                            color: analyticsComparison.pageviews_change >= 0 ? '#00CC75' : '#ef4444'
                          }}>
                            {formatChange(analyticsComparison.pageviews_change)}
                          </Text>
                        )}
                      </td>
                    )}
                  </tr>
                </table>
              </Section>
            )}

            {/* CTA Button */}
            <Section style={buttonSection}>
              <Button style={primaryButton} href={reportUrl}>
                Pregledaj izvještaj →
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
                      Ovaj izvještaj je automatski generiran kao dio Vašeg paketa održavanja.
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
              <Text style={footerTagline}>Vaš partner za održavanje web stranica</Text>

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
  background: 'linear-gradient(90deg, #00FF94 0%, #00CC75 50%, #00FF94 100%)',
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
  color: '#00FF94',
  fontSize: '12px',
  fontWeight: '700',
  letterSpacing: '2px',
  margin: '0',
  padding: '8px 16px',
  border: '1px solid #00FF94',
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

// Lighthouse styles
const lighthouseSection = {
  marginBottom: '24px',
};

const lighthouseBox = {
  textAlign: 'center',
  padding: '16px 12px',
  backgroundColor: '#fafafa',
  borderRadius: '8px',
  border: '1px solid #e8e8e8',
};

const lighthouseScore = {
  fontSize: '32px',
  fontWeight: '800',
  margin: '0 0 4px 0',
  lineHeight: '1',
};

const lighthouseLabel = {
  color: '#888',
  fontSize: '11px',
  fontWeight: '600',
  textTransform: 'uppercase',
  margin: '0',
};

// Analytics styles
const analyticsSection = {
  marginBottom: '32px',
};

const analyticsBox = {
  textAlign: 'center',
  padding: '16px 12px',
  backgroundColor: '#fafafa',
  borderRadius: '8px',
  border: '1px solid #e8e8e8',
};

const analyticsValue = {
  color: '#3b82f6',
  fontSize: '24px',
  fontWeight: '800',
  margin: '0 0 4px 0',
  lineHeight: '1',
};

const analyticsLabel = {
  color: '#888',
  fontSize: '11px',
  fontWeight: '600',
  textTransform: 'uppercase',
  margin: '0 0 6px 0',
};

const analyticsChange = {
  fontSize: '12px',
  fontWeight: '700',
  margin: '0',
};

const buttonSection = {
  textAlign: 'center',
  marginBottom: '16px',
};

const primaryButton = {
  backgroundColor: '#00FF94',
  borderRadius: '10px',
  color: '#0A0A0A',
  fontSize: '16px',
  fontWeight: '700',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  padding: '18px 48px',
  boxShadow: '0 4px 14px rgba(0, 255, 148, 0.3)',
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
  color: '#00CC75',
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
  backgroundColor: '#f0f9f5',
  borderLeft: '4px solid #00FF94',
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
