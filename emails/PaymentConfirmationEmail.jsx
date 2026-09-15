// emails/PaymentConfirmationEmail.jsx
// Mono payment confirmation email - Croatian version

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
  Row,
  Column,
} from '@react-email/components';

const MONO_FONT = '"SF Mono", Menlo, Consolas, "Courier New", monospace';

export const PaymentConfirmationEmail = ({
  clientName = 'Cijenjeni klijente',
  quoteNumber = 'NF-20260101-001',
  amount = '2.450 €',
  paymentDate = '15. rujna 2026.',
  quoteUrl = 'https://www.ninefold.eu/quote/xxx',
  projectDescription = 'Izrada web stranice',
}) => {
  return (
    <Html>
      <Head />
      <Preview>Uplata zaprimljena · {quoteNumber} · Ninefold</Preview>
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
                    <span style={greenDot}>●</span>&nbsp;&nbsp;UPLATA ZAPRIMLJENA
                  </Text>
                </td>
              </tr>
            </table>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>Uplata je sjela, krećemo</Heading>

            <Text style={paragraph}>Bok {clientName},</Text>

            <Text style={paragraph}>
              uspješno smo zaprimili vašu uplatu. Hvala na povjerenju, projekt
              time službeno kreće.
            </Text>

            {/* Payment Details Card */}
            <Section style={detailsCard}>
              <Row>
                <Column>
                  <Text style={label}>BROJ PONUDE</Text>
                  <Text style={value}>{quoteNumber}</Text>
                </Column>
                <Column align="right">
                  <Text style={label}>UPLAĆENI IZNOS</Text>
                  <Text style={valueAmount}>{amount}</Text>
                </Column>
              </Row>

              <Hr style={divider} />

              <Row>
                <Column>
                  <Text style={label}>DATUM UPLATE</Text>
                  <Text style={value}>{paymentDate}</Text>
                </Column>
                <Column align="right">
                  <Text style={label}>PROJEKT</Text>
                  <Text style={value}>{projectDescription}</Text>
                </Column>
              </Row>
            </Section>

            {/* Next steps */}
            <Section style={nextStepsSection}>
              <Text style={sectionLabel}>SLJEDEĆI KORACI</Text>
              <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                {[
                  'Javljamo se u roku 2 radna dana za kickoff poziv',
                  'Potvrđujemo rokove i ključne milestoneove',
                  'Tijekom projekta dobivate redovite statuse napretka',
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

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Link href={quoteUrl} style={button}>
                Pregledaj ponudu
              </Link>
            </Section>

            {/* Contact */}
            <Section style={infoBox}>
              <Text style={infoText}>
                Imate pitanja? Samo odgovorite na ovaj mail ili nam pišite na{' '}
                <Link href="mailto:hello@ninefold.eu" style={inlineLink}>hello@ninefold.eu</Link>.
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
};

export default PaymentConfirmationEmail;

// Styles · Mono language: #080808 base, #0F0F0F panels, hairline borders,
// text never pure white, green #00FF94 only as signal (dot + paid amount)
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

const h1 = {
  color: '#F2F2F2',
  fontSize: '24px',
  fontWeight: '500',
  margin: '0 0 24px',
  lineHeight: '1.3',
};

const paragraph = {
  color: '#C9C9C9',
  fontSize: '15px',
  lineHeight: '1.7',
  margin: '0 0 14px',
};

const detailsCard = {
  backgroundColor: '#080808',
  border: '1px solid #242424',
  borderRadius: '12px',
  padding: '24px 28px',
  margin: '28px 0 32px',
};

const label = {
  color: '#8E8E8E',
  fontFamily: MONO_FONT,
  fontSize: '10px',
  letterSpacing: '1.5px',
  margin: '0 0 6px',
};

const value = {
  color: '#F2F2F2',
  fontSize: '16px',
  fontWeight: '500',
  margin: '0',
};

const valueAmount = {
  color: '#00FF94',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0',
};

const divider = {
  borderColor: '#1F1F1F',
  margin: '18px 0',
};

const nextStepsSection = {
  margin: '0 0 32px',
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

const buttonContainer = {
  textAlign: 'center',
  margin: '0 0 32px',
};

const button = {
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
