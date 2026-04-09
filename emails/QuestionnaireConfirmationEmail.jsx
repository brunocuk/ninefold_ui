// emails/QuestionnaireConfirmationEmail.jsx
// Email sent to clients after submitting the questionnaire

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

export default function QuestionnaireConfirmationEmail({
  clientName = 'Cijenjeni klijente',
  selectedServices = [],
  estimatedMonthly = null,
  estimatedOneTime = null,
}) {
  return (
    <Html>
      <Head />
      <Preview>Zaprimili smo vaš upit | NineFold</Preview>
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
                    <Text style={headerBadge}>POTVRDA</Text>
                  </td>
                </tr>
              </table>
            </Section>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            {/* Success Icon */}
            <Section style={successIconSection}>
              <Text style={successIcon}>✓</Text>
            </Section>

            {/* Greeting */}
            <Heading style={mainHeading}>Hvala, {clientName}!</Heading>

            <Text style={introText}>
              Zaprimili smo vaš upit i već radimo na vašoj personaliziranoj ponudi.
              Očekujte naš odgovor unutar 24 sata.
            </Text>

            {/* Selected Services Card */}
            {selectedServices.length > 0 && (
              <Section style={servicesCard}>
                <Text style={cardTitle}>Vaš odabir usluga</Text>
                <Hr style={cardDivider} />
                {selectedServices.map((service, index) => (
                  <table key={index} width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                    <tr>
                      <td style={serviceRow}>
                        <Text style={serviceIcon}>→</Text>
                        <Text style={serviceName}>{service}</Text>
                      </td>
                    </tr>
                  </table>
                ))}

                {/* Estimated Pricing */}
                {(estimatedMonthly || estimatedOneTime) && (
                  <>
                    <Hr style={cardDivider} />
                    <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                      {estimatedOneTime && (
                        <tr>
                          <td style={priceRow}>
                            <Text style={priceLabel}>Jednokratno (procjena)</Text>
                            <Text style={priceValue}>{estimatedOneTime}</Text>
                          </td>
                        </tr>
                      )}
                      {estimatedMonthly && (
                        <tr>
                          <td style={priceRow}>
                            <Text style={priceLabel}>Mjesečno (procjena)</Text>
                            <Text style={priceValueGreen}>{estimatedMonthly}</Text>
                          </td>
                        </tr>
                      )}
                    </table>
                    <Text style={priceDisclaimer}>
                      * Konačna cijena bit će potvrđena u službenoj ponudi
                    </Text>
                  </>
                )}
              </Section>
            )}

            {/* What's Next Section */}
            <Section style={nextStepsSection}>
              <Heading style={h3}>Što dalje?</Heading>
              <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                <tr>
                  <td style={stepItem}>
                    <Text style={stepNumber}>1</Text>
                    <Text style={stepText}>Naš tim pregledava vaš upit</Text>
                  </td>
                </tr>
                <tr>
                  <td style={stepItem}>
                    <Text style={stepNumber}>2</Text>
                    <Text style={stepText}>Pripremamo detaljnu ponudu</Text>
                  </td>
                </tr>
                <tr>
                  <td style={stepItem}>
                    <Text style={stepNumber}>3</Text>
                    <Text style={stepText}>Kontaktirat ćemo vas unutar 24h</Text>
                  </td>
                </tr>
              </table>
            </Section>

            {/* Contact Info */}
            <Section style={contactBox}>
              <Text style={contactTitle}>Imate pitanja?</Text>
              <Text style={contactText}>
                Slobodno nas kontaktirajte bilo kada:
              </Text>
              <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                <tr>
                  <td style={contactRow}>
                    <Text style={contactIcon}>📧</Text>
                    <Link href="mailto:hello@ninefold.co" style={contactLink}>hello@ninefold.co</Link>
                  </td>
                </tr>
                <tr>
                  <td style={contactRow}>
                    <Text style={contactIcon}>📱</Text>
                    <Link href="https://instagram.com/ninefold.hr" style={contactLink}>@ninefold.hr</Link>
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
                    <Link href="https://ninefold.co" style={footerLink}>ninefold.co</Link>
                    <Text style={footerDot}>•</Text>
                    <Link href="mailto:hello@ninefold.co" style={footerLink}>hello@ninefold.co</Link>
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

const successIconSection = {
  textAlign: 'center',
  marginBottom: '24px',
};

const successIcon = {
  backgroundColor: '#00FF94',
  color: '#0A0A0A',
  fontSize: '32px',
  fontWeight: '700',
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  display: 'inline-block',
  lineHeight: '64px',
  textAlign: 'center',
  margin: '0',
};

const mainHeading = {
  color: '#1a1a1a',
  fontSize: '28px',
  fontWeight: '700',
  marginBottom: '16px',
  marginTop: '0',
  textAlign: 'center',
};

const introText = {
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '1.7',
  marginBottom: '32px',
  textAlign: 'center',
};

const servicesCard = {
  backgroundColor: '#fafafa',
  border: '1px solid #e8e8e8',
  borderRadius: '12px',
  padding: '28px',
  marginBottom: '32px',
};

const cardTitle = {
  color: '#1a1a1a',
  fontSize: '16px',
  fontWeight: '700',
  margin: '0 0 16px 0',
};

const cardDivider = {
  borderColor: '#e8e8e8',
  margin: '16px 0',
};

const serviceRow = {
  padding: '8px 0',
  display: 'flex',
  alignItems: 'center',
};

const serviceIcon = {
  color: '#00FF94',
  fontSize: '16px',
  fontWeight: '700',
  marginRight: '12px',
  marginTop: '0',
  marginBottom: '0',
  display: 'inline-block',
  width: '20px',
};

const serviceName = {
  color: '#1a1a1a',
  fontSize: '15px',
  margin: '0',
  display: 'inline-block',
};

const priceRow = {
  padding: '8px 0',
  display: 'flex',
  justifyContent: 'space-between',
};

const priceLabel = {
  color: '#666',
  fontSize: '14px',
  margin: '0',
  display: 'inline-block',
};

const priceValue = {
  color: '#1a1a1a',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
  display: 'inline-block',
  float: 'right',
};

const priceValueGreen = {
  color: '#00CC75',
  fontSize: '14px',
  fontWeight: '700',
  margin: '0',
  display: 'inline-block',
  float: 'right',
};

const priceDisclaimer = {
  color: '#888',
  fontSize: '12px',
  margin: '12px 0 0 0',
  fontStyle: 'italic',
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

const contactBox = {
  backgroundColor: '#f0f9f5',
  borderLeft: '4px solid #00FF94',
  borderRadius: '0 8px 8px 0',
  padding: '20px 24px',
  marginTop: '32px',
};

const contactTitle = {
  color: '#1a1a1a',
  fontSize: '16px',
  fontWeight: '700',
  margin: '0 0 8px 0',
};

const contactText = {
  color: '#4a4a4a',
  fontSize: '14px',
  margin: '0 0 16px 0',
};

const contactRow = {
  padding: '6px 0',
};

const contactIcon = {
  fontSize: '14px',
  marginRight: '10px',
  marginTop: '0',
  marginBottom: '0',
  display: 'inline-block',
};

const contactLink = {
  color: '#00CC75',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
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
