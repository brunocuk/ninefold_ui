// emails/QuestionnaireConfirmationEmail.jsx
// Mono confirmation email sent to clients after submitting the questionnaire

import {
  Body,
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

export default function QuestionnaireConfirmationEmail({
  clientName = 'Cijenjeni klijente',
  selectedServices = [],
  estimatedMonthly = null,
  estimatedOneTime = null,
}) {
  return (
    <Html>
      <Head />
      <Preview>Zaprimili smo vaš upit · Ninefold</Preview>
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
                    <span style={greenDot}>●</span>&nbsp;&nbsp;UPIT ZAPRIMLJEN
                  </Text>
                </td>
              </tr>
            </table>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={mainHeading}>Hvala, {clientName}!</Heading>

            <Text style={introText}>
              Zaprimili smo vaš upit i već radimo na vašoj personaliziranoj
              ponudi. Očekujte naš odgovor unutar 24 sata.
            </Text>

            {/* Selected Services Card */}
            {selectedServices.length > 0 && (
              <Section style={servicesCard}>
                <Text style={cardLabel}>VAŠ ODABIR USLUGA</Text>
                {selectedServices.map((service, index) => (
                  <table key={index} width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                    <tr>
                      <td style={serviceDotCell}>
                        <Text style={serviceDot}>●</Text>
                      </td>
                      <td style={serviceNameCell}>
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
                          <td>
                            <Text style={priceLabel}>Jednokratno (procjena)</Text>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <Text style={priceValue}>{estimatedOneTime}</Text>
                          </td>
                        </tr>
                      )}
                      {estimatedMonthly && (
                        <tr>
                          <td>
                            <Text style={priceLabel}>Mjesečno (procjena)</Text>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <Text style={priceValueMonthly}>{estimatedMonthly}</Text>
                          </td>
                        </tr>
                      )}
                    </table>
                    <Text style={priceDisclaimer}>
                      Konačna cijena bit će potvrđena u službenoj ponudi.
                    </Text>
                  </>
                )}
              </Section>
            )}

            {/* Next steps */}
            <Section style={nextStepsSection}>
              <Text style={sectionLabel}>SLJEDEĆI KORACI</Text>
              <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                {[
                  'Pregledavamo vaš upit',
                  'Pripremamo detaljnu ponudu',
                  'Javljamo vam se unutar 24 sata',
                ].map((step, i) => (
                  <tr key={i}>
                    <td style={stepNumberCell}>
                      <Text style={stepNumber}>{i + 1}</Text>
                    </td>
                    <td style={stepTextCell}>
                      <Text style={stepText}>{step}</Text>
                    </td>
                  </tr>
                ))}
              </table>
            </Section>

            {/* Contact */}
            <Section style={infoBox}>
              <Text style={infoText}>
                Imate pitanja? Pišite nam na{' '}
                <Link href="mailto:hello@ninefold.eu" style={inlineLink}>hello@ninefold.eu</Link>
                {' '}ili na WhatsApp{' '}
                <Link href="https://wa.me/385915469266" style={inlineLink}>+385 91 546 9266</Link>.
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
// green #00FF94 only as signal, monthly amounts muted purple like the quote page
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

const mainHeading = {
  color: '#F2F2F2',
  fontSize: '24px',
  fontWeight: '500',
  margin: '0 0 14px',
  lineHeight: '1.3',
};

const introText = {
  color: '#C9C9C9',
  fontSize: '15px',
  lineHeight: '1.7',
  margin: '0 0 32px',
};

const servicesCard = {
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
  margin: '0 0 14px',
};

const cardDivider = {
  borderColor: '#1F1F1F',
  margin: '16px 0',
};

const serviceDotCell = {
  width: '20px',
  padding: '6px 0',
  verticalAlign: 'middle',
};

const serviceDot = {
  color: '#00FF94',
  fontSize: '7px',
  margin: '0',
};

const serviceNameCell = {
  padding: '6px 0',
  verticalAlign: 'middle',
};

const serviceName = {
  color: '#F2F2F2',
  fontSize: '14px',
  margin: '0',
};

const priceLabel = {
  color: '#8E8E8E',
  fontSize: '13px',
  margin: '6px 0',
};

const priceValue = {
  color: '#F2F2F2',
  fontSize: '14px',
  fontWeight: '600',
  margin: '6px 0',
};

const priceValueMonthly = {
  color: '#C084FC',
  fontSize: '14px',
  fontWeight: '600',
  margin: '6px 0',
};

const priceDisclaimer = {
  color: '#5C5C5C',
  fontSize: '12px',
  margin: '12px 0 0',
};

const nextStepsSection = {
  paddingTop: '28px',
  borderTop: '1px solid #1F1F1F',
  marginBottom: '32px',
};

const sectionLabel = {
  color: '#8E8E8E',
  fontFamily: MONO_FONT,
  fontSize: '10px',
  letterSpacing: '1.5px',
  margin: '0 0 16px',
};

const stepNumberCell = {
  width: '36px',
  padding: '8px 0',
  verticalAlign: 'middle',
};

const stepNumber = {
  border: '1px solid #3A3A3A',
  color: '#C9C9C9',
  fontSize: '11px',
  fontWeight: '500',
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  display: 'inline-block',
  textAlign: 'center',
  lineHeight: '22px',
  margin: '0',
};

const stepTextCell = {
  padding: '8px 0',
  verticalAlign: 'middle',
};

const stepText = {
  color: '#C9C9C9',
  fontSize: '14px',
  margin: '0',
};

const infoBox = {
  border: '1px solid #242424',
  borderRadius: '12px',
  padding: '16px 20px',
};

const infoText = {
  color: '#8E8E8E',
  fontSize: '13px',
  lineHeight: '1.6',
  margin: '0',
};

const inlineLink = {
  color: '#C9C9C9',
  textDecoration: 'none',
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
  margin: '0 0 6px',
  letterSpacing: '-0.5px',
};

const footerMeta = {
  color: '#5C5C5C',
  fontFamily: MONO_FONT,
  fontSize: '10px',
  letterSpacing: '1.5px',
  margin: '0 0 18px',
};

const footerLinks = {
  margin: '0 0 14px',
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
