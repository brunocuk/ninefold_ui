// emails/QuoteEmail.jsx
// Premium email template for sending quotes to clients - Croatian version

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

export default function QuoteEmail({
  clientName = 'Cijenjeni klijente',
  quoteNumber = 'NF-20241211-001',
  quoteUrl = 'https://ninefold.eu/quote/123',
  projectOverview = 'Izrada web stranice',
  validUntil = '30 dana',
}) {
  return (
    <Html>
      <Head />
      <Preview>Ponuda za Vaš projekt - {quoteNumber} | NineFold</Preview>
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
                    <Text style={headerBadge}>PONUDA</Text>
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
              Zahvaljujemo Vam na ukazanom povjerenju. S zadovoljstvom Vam dostavljamo
              ponudu za Vaš projekt. Detalje možete pregledati klikom na gumb ispod.
            </Text>

            {/* Quote Card */}
            <Section style={quoteCard}>
              {/* Quote Number Row */}
              <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                <tr>
                  <td style={cardRow}>
                    <Text style={cardIcon}>📋</Text>
                    <div>
                      <Text style={cardLabel}>Broj ponude</Text>
                      <Text style={cardValue}>{quoteNumber}</Text>
                    </div>
                  </td>
                </tr>
              </table>

              <Hr style={cardDivider} />

              {/* Project Row */}
              <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                <tr>
                  <td style={cardRow}>
                    <Text style={cardIcon}>🎯</Text>
                    <div>
                      <Text style={cardLabel}>Projekt</Text>
                      <Text style={cardValue}>{projectOverview}</Text>
                    </div>
                  </td>
                </tr>
              </table>
            </Section>

            {/* CTA Button */}
            <Section style={buttonSection}>
              <Button style={primaryButton} href={quoteUrl}>
                Pregledaj ponudu →
              </Button>
            </Section>

            {/* Info Box */}
            <Section style={infoBox}>
              <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                <tr>
                  <td style={{ width: '24px', verticalAlign: 'top', paddingRight: '12px' }}>
                    <Text style={infoIcon}>ℹ️</Text>
                  </td>
                  <td>
                    <Text style={infoText}>
                      Ova ponuda vrijedi <strong>{validUntil}</strong> od datuma slanja.
                      Za sva pitanja slobodno odgovorite na ovaj email ili nas kontaktirajte
                      putem telefona.
                    </Text>
                  </td>
                </tr>
              </table>
            </Section>

            {/* What's Next Section */}
            <Section style={nextStepsSection}>
              <Heading style={h3}>Sljedeći koraci</Heading>
              <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                <tr>
                  <td style={stepItem}>
                    <Text style={stepNumber}>1</Text>
                    <Text style={stepText}>Pregledajte detalje ponude</Text>
                  </td>
                </tr>
                <tr>
                  <td style={stepItem}>
                    <Text style={stepNumber}>2</Text>
                    <Text style={stepText}>Kontaktirajte nas za eventualne izmjene</Text>
                  </td>
                </tr>
                <tr>
                  <td style={stepItem}>
                    <Text style={stepNumber}>3</Text>
                    <Text style={stepText}>Prihvatite ponudu i uplatite akontaciju</Text>
                  </td>
                </tr>
              </table>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Section style={footerContent}>
              <Heading style={footerLogo}>NineFold</Heading>
              <Text style={footerTagline}>Slow websites lose customers.</Text>

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

const quoteCard = {
  backgroundColor: '#fafafa',
  border: '1px solid #e8e8e8',
  borderRadius: '12px',
  padding: '28px',
  marginBottom: '32px',
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

const buttonSection = {
  textAlign: 'center',
  marginBottom: '32px',
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

const infoBox = {
  backgroundColor: '#f0f9f5',
  borderLeft: '4px solid #00FF94',
  borderRadius: '0 8px 8px 0',
  padding: '16px 20px',
  marginBottom: '32px',
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

const nextStepsSection = {
  marginTop: '40px',
  paddingTop: '32px',
  borderTop: '1px solid #e8e8e8',
};

const h3 = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: '700',
  marginBottom: '20px',
  marginTop: '0',
};

const stepItem = {
  padding: '10px 0',
  display: 'flex',
  alignItems: 'center',
};

const stepNumber = {
  backgroundColor: '#0A0A0A',
  color: '#00FF94',
  fontSize: '12px',
  fontWeight: '700',
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  display: 'inline-block',
  textAlign: 'center',
  lineHeight: '24px',
  marginRight: '14px',
  marginTop: '0',
  marginBottom: '0',
};

const stepText = {
  color: '#4a4a4a',
  fontSize: '15px',
  margin: '0',
  display: 'inline-block',
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
