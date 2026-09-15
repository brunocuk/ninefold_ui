// emails/MaintenanceReportEmail.jsx
// Mono email template for sending monthly maintenance reports - Croatian version

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

const MONO_FONT = '"SF Mono", Menlo, Consolas, "Courier New", monospace';

export default function MaintenanceReportEmail({
  clientName = 'Cijenjeni klijente',
  reportReference = 'MR-202602-KLIJENT',
  reportUrl = 'https://www.ninefold.eu/report/123',
  pdfUrl = 'https://www.ninefold.eu/api/maintenance-reports/123/pdf',
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

  // Lighthouse semaphore colors stay - green is a signal here
  const getScoreColor = (score) => {
    if (!score) return '#8E8E8E';
    if (score >= 90) return '#00FF94';
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
      <Preview>Mjesečni izvještaj održavanja · {periodDisplay} · Ninefold</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
              <tr>
                <td>
                  <Heading style={logo}>Ninefold</Heading>
                </td>
                <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>
                  <Text style={eyebrow}>
                    <span style={greenDot}>●</span>&nbsp;&nbsp;IZVJEŠTAJ
                  </Text>
                </td>
              </tr>
            </table>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={greeting}>Bok {clientName},</Text>

            <Text style={introText}>
              stigao je mjesečni izvještaj održavanja vaše web stranice za{' '}
              <strong style={introStrong}>{periodDisplay}</strong>. Unutra su
              rezultati Lighthouse analize i pregled prometa iz Google Analyticsa.
            </Text>

            {/* Report Card */}
            <Section style={reportCard}>
              <Text style={cardLabel}>REFERENCA IZVJEŠTAJA</Text>
              <Text style={cardValue}>{reportReference}</Text>

              <Hr style={cardDivider} />

              <Text style={cardLabel}>RAZDOBLJE</Text>
              <Text style={cardValue}>{periodDisplay}</Text>
            </Section>

            {/* Lighthouse Scores */}
            {hasLighthouse && (
              <Section style={metricSection}>
                <Text style={sectionLabel}>LIGHTHOUSE REZULTATI</Text>
                <table width="100%" cellPadding="0" cellSpacing="4" style={{ borderCollapse: 'separate' }}>
                  <tr>
                    {lighthouse.performance !== null && lighthouse.performance !== undefined && (
                      <td style={metricBox}>
                        <Text style={{ ...metricScore, color: getScoreColor(lighthouse.performance) }}>
                          {lighthouse.performance}
                        </Text>
                        <Text style={metricLabel}>PERFORMANCE</Text>
                      </td>
                    )}
                    {lighthouse.accessibility !== null && lighthouse.accessibility !== undefined && (
                      <td style={metricBox}>
                        <Text style={{ ...metricScore, color: getScoreColor(lighthouse.accessibility) }}>
                          {lighthouse.accessibility}
                        </Text>
                        <Text style={metricLabel}>ACCESSIBILITY</Text>
                      </td>
                    )}
                    {lighthouse.best_practices !== null && lighthouse.best_practices !== undefined && (
                      <td style={metricBox}>
                        <Text style={{ ...metricScore, color: getScoreColor(lighthouse.best_practices) }}>
                          {lighthouse.best_practices}
                        </Text>
                        <Text style={metricLabel}>BEST PRACTICES</Text>
                      </td>
                    )}
                    {lighthouse.seo !== null && lighthouse.seo !== undefined && (
                      <td style={metricBox}>
                        <Text style={{ ...metricScore, color: getScoreColor(lighthouse.seo) }}>
                          {lighthouse.seo}
                        </Text>
                        <Text style={metricLabel}>SEO</Text>
                      </td>
                    )}
                  </tr>
                </table>
              </Section>
            )}

            {/* Analytics Stats */}
            {hasAnalytics && (
              <Section style={metricSection}>
                <Text style={sectionLabel}>GOOGLE ANALYTICS</Text>
                <table width="100%" cellPadding="0" cellSpacing="4" style={{ borderCollapse: 'separate' }}>
                  <tr>
                    {analytics.sessions !== null && analytics.sessions !== undefined && (
                      <td style={metricBox}>
                        <Text style={analyticsValue}>{analytics.sessions.toLocaleString()}</Text>
                        <Text style={metricLabel}>SESIJE</Text>
                        {analyticsComparison.sessions_change !== null && analyticsComparison.sessions_change !== undefined && (
                          <Text style={{
                            ...analyticsChange,
                            color: analyticsComparison.sessions_change >= 0 ? '#00FF94' : '#ef4444'
                          }}>
                            {formatChange(analyticsComparison.sessions_change)}
                          </Text>
                        )}
                      </td>
                    )}
                    {analytics.users !== null && analytics.users !== undefined && (
                      <td style={metricBox}>
                        <Text style={analyticsValue}>{analytics.users.toLocaleString()}</Text>
                        <Text style={metricLabel}>KORISNICI</Text>
                        {analyticsComparison.users_change !== null && analyticsComparison.users_change !== undefined && (
                          <Text style={{
                            ...analyticsChange,
                            color: analyticsComparison.users_change >= 0 ? '#00FF94' : '#ef4444'
                          }}>
                            {formatChange(analyticsComparison.users_change)}
                          </Text>
                        )}
                      </td>
                    )}
                    {analytics.pageviews !== null && analytics.pageviews !== undefined && (
                      <td style={metricBox}>
                        <Text style={analyticsValue}>{analytics.pageviews.toLocaleString()}</Text>
                        <Text style={metricLabel}>PREGLEDI</Text>
                        {analyticsComparison.pageviews_change !== null && analyticsComparison.pageviews_change !== undefined && (
                          <Text style={{
                            ...analyticsChange,
                            color: analyticsComparison.pageviews_change >= 0 ? '#00FF94' : '#ef4444'
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
                Pregledaj izvještaj
              </Button>
            </Section>

            {/* PDF Download */}
            <Section style={pdfSection}>
              <Text style={pdfText}>
                Ili preuzmite PDF verziju:{' '}
                <Link href={pdfUrl} style={pdfLink}>Preuzmi PDF</Link>
              </Text>
            </Section>

            {/* Highlights */}
            {highlights.length > 0 && (
              <Section style={listSection}>
                <Text style={sectionLabel}>ISTAKNUTO OVAJ MJESEC</Text>
                <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                  {highlights.map((item, index) => (
                    <tr key={index}>
                      <td style={listNumberCell}>
                        <Text style={listNumber}>{index + 1}</Text>
                      </td>
                      <td style={listTextCell}>
                        <Text style={listText}>{item}</Text>
                      </td>
                    </tr>
                  ))}
                </table>
              </Section>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <Section style={listSection}>
                <Text style={sectionLabelPurple}>PREPORUKE</Text>
                <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                  {recommendations.map((item, index) => (
                    <tr key={index}>
                      <td style={listNumberCell}>
                        <Text style={listNumber}>{index + 1}</Text>
                      </td>
                      <td style={listTextCell}>
                        <Text style={listText}>{item}</Text>
                      </td>
                    </tr>
                  ))}
                </table>
              </Section>
            )}

            {/* Info Box */}
            <Section style={infoBox}>
              <Text style={infoText}>
                Ovaj izvještaj je dio vašeg paketa održavanja. Za pitanja ili
                posebne zahtjeve samo odgovorite na ovaj mail.
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Heading style={footerLogo}>Ninefold</Heading>
            <Text style={footerMeta}>ZAGREB · HRVATSKA</Text>
            <Text style={footerLinks}>
              <Link href="https://www.ninefold.eu" style={footerLink}>ninefold.eu</Link>
              <span style={footerDot}>·</span>
              <Link href="mailto:hello@ninefold.eu" style={footerLink}>hello@ninefold.eu</Link>
            </Text>
            <Text style={copyright}>© {new Date().getFullYear()} Ninefold. Sva prava pridržana.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles · Mono language: #080808 base, #0F0F0F panels, hairline borders,
// green only as signal (dot, Lighthouse semaphore, +/- changes), Preporuke muted purple
const main = {
  backgroundColor: '#080808',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  padding: '40px 0',
};

const container = {
  backgroundColor: '#0F0F0F',
  margin: '0 auto',
  maxWidth: '600px',
  borderRadius: '16px',
  border: '1px solid #242424',
  overflow: 'hidden',
};

const header = {
  padding: '28px 40px',
  borderBottom: '1px solid #1F1F1F',
};

const logo = {
  color: '#F2F2F2',
  fontSize: '22px',
  fontWeight: '500',
  margin: '0',
  padding: '0',
  letterSpacing: '-0.5px',
};

const eyebrow = {
  color: '#8E8E8E',
  fontFamily: MONO_FONT,
  fontSize: '11px',
  letterSpacing: '2px',
  margin: '0',
};

const greenDot = {
  color: '#00FF94',
  fontSize: '8px',
  verticalAlign: 'middle',
};

const content = {
  padding: '40px 40px 32px',
};

const greeting = {
  color: '#F2F2F2',
  fontSize: '18px',
  fontWeight: '500',
  marginBottom: '12px',
  marginTop: '0',
};

const introText = {
  color: '#C9C9C9',
  fontSize: '15px',
  lineHeight: '1.7',
  marginBottom: '32px',
  marginTop: '0',
};

const introStrong = {
  color: '#F2F2F2',
  fontWeight: '600',
};

const reportCard = {
  backgroundColor: '#080808',
  border: '1px solid #242424',
  borderRadius: '12px',
  padding: '24px 28px',
  marginBottom: '32px',
};

const cardLabel = {
  color: '#8E8E8E',
  fontFamily: MONO_FONT,
  fontSize: '10px',
  letterSpacing: '1.5px',
  margin: '0 0 6px 0',
};

const cardValue = {
  color: '#F2F2F2',
  fontSize: '16px',
  fontWeight: '500',
  margin: '0',
  lineHeight: '1.4',
};

const cardDivider = {
  borderColor: '#1F1F1F',
  margin: '18px 0',
};

const sectionLabel = {
  color: '#8E8E8E',
  fontFamily: MONO_FONT,
  fontSize: '10px',
  letterSpacing: '1.5px',
  margin: '0 0 14px 0',
};

const sectionLabelPurple = {
  color: '#C084FC',
  fontFamily: MONO_FONT,
  fontSize: '10px',
  letterSpacing: '1.5px',
  margin: '0 0 14px 0',
};

const metricSection = {
  marginBottom: '28px',
};

const metricBox = {
  textAlign: 'center',
  padding: '16px 8px',
  backgroundColor: '#080808',
  borderRadius: '10px',
  border: '1px solid #242424',
};

const metricScore = {
  fontSize: '28px',
  fontWeight: '600',
  margin: '0 0 6px 0',
  lineHeight: '1',
};

const metricLabel = {
  color: '#8E8E8E',
  fontFamily: MONO_FONT,
  fontSize: '9px',
  letterSpacing: '1px',
  margin: '0',
};

const analyticsValue = {
  color: '#F2F2F2',
  fontSize: '22px',
  fontWeight: '600',
  margin: '0 0 6px 0',
  lineHeight: '1',
};

const analyticsChange = {
  fontSize: '12px',
  fontWeight: '600',
  margin: '6px 0 0 0',
};

const buttonSection = {
  textAlign: 'center',
  marginBottom: '14px',
};

const primaryButton = {
  backgroundColor: '#F2F2F2',
  borderRadius: '999px',
  color: '#080808',
  fontSize: '15px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  padding: '16px 44px',
};

const pdfSection = {
  textAlign: 'center',
  marginBottom: '32px',
};

const pdfText = {
  color: '#8E8E8E',
  fontSize: '13px',
  margin: '0',
};

const pdfLink = {
  color: '#C9C9C9',
  fontWeight: '600',
  textDecoration: 'none',
};

const listSection = {
  border: '1px solid #242424',
  borderRadius: '12px',
  padding: '20px 24px',
  marginBottom: '20px',
};

const listNumberCell = {
  width: '32px',
  padding: '6px 0',
  verticalAlign: 'top',
};

const listNumber = {
  border: '1px solid #3A3A3A',
  color: '#C9C9C9',
  fontSize: '10px',
  fontWeight: '500',
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  display: 'inline-block',
  textAlign: 'center',
  lineHeight: '18px',
  margin: '0',
};

const listTextCell = {
  padding: '6px 0',
  verticalAlign: 'top',
};

const listText = {
  color: '#C9C9C9',
  fontSize: '14px',
  margin: '0',
  lineHeight: '1.5',
};

const infoBox = {
  border: '1px solid #242424',
  borderRadius: '12px',
  padding: '16px 20px',
  marginTop: '28px',
};

const infoText = {
  color: '#8E8E8E',
  fontSize: '13px',
  lineHeight: '1.6',
  margin: '0',
};

const footer = {
  borderTop: '1px solid #1F1F1F',
  padding: '32px 40px',
  textAlign: 'center',
};

const footerLogo = {
  color: '#F2F2F2',
  fontSize: '18px',
  fontWeight: '500',
  margin: '0 0 6px 0',
  letterSpacing: '-0.5px',
};

const footerMeta = {
  color: '#5C5C5C',
  fontFamily: MONO_FONT,
  fontSize: '10px',
  letterSpacing: '1.5px',
  margin: '0 0 18px 0',
};

const footerLinks = {
  margin: '0 0 14px 0',
  fontSize: '13px',
};

const footerLink = {
  color: '#C9C9C9',
  fontSize: '13px',
  textDecoration: 'none',
};

const footerDot = {
  color: '#5C5C5C',
  margin: '0 10px',
};

const copyright = {
  color: '#5C5C5C',
  fontSize: '11px',
  margin: '0',
};
