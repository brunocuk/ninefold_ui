// emails/QuoteEmail.jsx
// Mono email template for sending quotes to clients - Croatian version

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

export default function QuoteEmail({
  clientName = 'Cijenjeni klijente',
  quoteNumber = 'NF-20241211-001',
  quoteUrl = 'https://www.ninefold.eu/quote/123',
  projectOverview = 'Izrada web stranice',
  validUntil = '30 dana',
}) {
  return (
    <Html>
      <Head />
      <Preview>Ponuda {quoteNumber} · Ninefold</Preview>
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
                    <span style={greenDot}>●</span>&nbsp;&nbsp;PONUDA
                  </Text>
                </td>
              </tr>
            </table>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={greeting}>Bok {clientName},</Text>

            <Text style={introText}>
              hvala na povjerenju. Ponuda za vaš projekt je spremna, sve detalje
              možete pregledati na linku ispod.
            </Text>

            {/* Quote Card */}
            <Section style={quoteCard}>
              <Text style={cardLabel}>BROJ PONUDE</Text>
              <Text style={cardValue}>{quoteNumber}</Text>

              <Hr style={cardDivider} />

              <Text style={cardLabel}>PROJEKT</Text>
              <Text style={cardValue}>{projectOverview}</Text>
            </Section>

            {/* CTA Button */}
            <Section style={buttonSection}>
              <Button style={primaryButton} href={quoteUrl}>
                Pregledaj ponudu
              </Button>
            </Section>

            {/* Validity note */}
            <Section style={infoBox}>
              <Text style={infoText}>
                Ponuda vrijedi <strong style={infoStrong}>{validUntil}</strong> od
                datuma slanja. Za pitanja ili izmjene samo odgovorite na ovaj mail.
              </Text>
            </Section>

            {/* Next steps */}
            <Section style={nextStepsSection}>
              <Text style={sectionLabel}>SLJEDEĆI KORACI</Text>
              <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                {[
                  'Pregledajte detalje ponude',
                  'Javite nam se za eventualne izmjene',
                  'Prihvatite ponudu i uplatite avans',
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
// text never pure white, green #00FF94 only as signal
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

const quoteCard = {
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

const buttonSection = {
  textAlign: 'center',
  marginBottom: '32px',
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

const infoBox = {
  border: '1px solid #242424',
  borderRadius: '12px',
  padding: '16px 20px',
  marginBottom: '36px',
};

const infoText = {
  color: '#8E8E8E',
  fontSize: '13px',
  lineHeight: '1.6',
  margin: '0',
};

const infoStrong = {
  color: '#C9C9C9',
  fontWeight: '600',
};

const nextStepsSection = {
  paddingTop: '28px',
  borderTop: '1px solid #1F1F1F',
};

const sectionLabel = {
  color: '#8E8E8E',
  fontFamily: MONO_FONT,
  fontSize: '10px',
  letterSpacing: '1.5px',
  margin: '0 0 16px 0',
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
