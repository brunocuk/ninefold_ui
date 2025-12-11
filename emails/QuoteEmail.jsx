// emails/QuoteEmail.jsx
// Beautiful email template for sending quotes to clients

import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
    Hr,
  } from '@react-email/components';
  
  export default function QuoteEmail({
    clientName = 'Valued Client',
    quoteNumber = 'NF-20241211-001',
    quoteUrl = 'https://ninefold.eu/quote/123',
    totalAmount = 5000,
    projectOverview = 'Custom website development',
    validUntil = '30 days',
  }) {
    return (
      <Html>
        <Head />
        <Preview>Your project quote from NineFold - {quoteNumber}</Preview>
        <Body style={main}>
          <Container style={container}>
            {/* Logo */}
            <Section style={logoSection}>
              <Heading style={logo}>NineFold</Heading>
            </Section>
  
            {/* Main Content */}
            <Section style={content}>
              <Heading style={h1}>Your Project Quote</Heading>
              
              <Text style={text}>
                Hi {clientName},
              </Text>
  
              <Text style={text}>
                Thank you for considering NineFold for your project. We've prepared a detailed quote for your review.
              </Text>
  
              {/* Quote Summary Box */}
              <Section style={summaryBox}>
                <Text style={summaryLabel}>Quote Number</Text>
                <Text style={summaryValue}>{quoteNumber}</Text>
                
                <Hr style={summaryDivider} />
                
                <Text style={summaryLabel}>Project</Text>
                <Text style={summaryValue}>{projectOverview}</Text>
                
                <Hr style={summaryDivider} />
                
                <Text style={summaryLabel}>Total Investment</Text>
                <Text style={summaryAmount}>€{totalAmount.toLocaleString()}</Text>
              </Section>
  
              {/* CTA Button */}
              <Section style={buttonSection}>
                <Button style={button} href={quoteUrl}>
                  View Full Quote
                </Button>
              </Section>
  
              <Text style={smallText}>
                This quote is valid for {validUntil}. If you have any questions, feel free to reply to this email.
              </Text>
  
              {/* Footer */}
              <Hr style={hr} />
              
              <Text style={footer}>
                <strong>NineFold</strong><br />
                Premium Web Development<br />
                Zagreb, Croatia<br />
                <Link href="https://ninefold.eu" style={link}>ninefold.eu</Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  }
  
  // Styles
  const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  };
  
  const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px',
  };
  
  const logoSection = {
    padding: '32px 40px',
    backgroundColor: '#0F0F0F',
  };
  
  const logo = {
    color: '#00FF94',
    fontSize: '32px',
    fontWeight: '900',
    margin: '0',
    padding: '0',
  };
  
  const content = {
    padding: '40px 40px',
  };
  
  const h1 = {
    color: '#1a1a1a',
    fontSize: '28px',
    fontWeight: '700',
    lineHeight: '1.3',
    marginBottom: '24px',
  };
  
  const text = {
    color: '#484848',
    fontSize: '16px',
    lineHeight: '1.6',
    marginBottom: '16px',
  };
  
  const summaryBox = {
    backgroundColor: '#f8f9fa',
    border: '1px solid #e1e4e8',
    borderRadius: '8px',
    padding: '24px',
    margin: '32px 0',
  };
  
  const summaryLabel = {
    color: '#666',
    fontSize: '13px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    margin: '0 0 8px 0',
  };
  
  const summaryValue = {
    color: '#1a1a1a',
    fontSize: '16px',
    fontWeight: '500',
    margin: '0 0 16px 0',
  };
  
  const summaryAmount = {
    color: '#00FF94',
    fontSize: '32px',
    fontWeight: '900',
    margin: '0',
  };
  
  const summaryDivider = {
    borderColor: '#e1e4e8',
    margin: '16px 0',
  };
  
  const buttonSection = {
    margin: '32px 0',
    textAlign: 'center',
  };
  
  const button = {
    backgroundColor: '#00FF94',
    borderRadius: '8px',
    color: '#0F0F0F',
    fontSize: '16px',
    fontWeight: '700',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'inline-block',
    padding: '16px 40px',
  };
  
  const smallText = {
    color: '#666',
    fontSize: '14px',
    lineHeight: '1.6',
    marginTop: '32px',
  };
  
  const hr = {
    borderColor: '#e1e4e8',
    margin: '32px 0',
  };
  
  const footer = {
    color: '#666',
    fontSize: '14px',
    lineHeight: '1.6',
    textAlign: 'center',
  };
  
  const link = {
    color: '#00FF94',
    textDecoration: 'underline',
  };