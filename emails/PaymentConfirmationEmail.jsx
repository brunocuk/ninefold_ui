// emails/payment-confirmation-email.jsx
// Payment Confirmation Email Template for NineFold

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
  
  export const PaymentConfirmationEmail = ({
    clientName = 'Valued Client',
    quoteNumber = 'QUOTE-2025-001',
    amount = '€5,000.00',
    paymentDate = 'December 11, 2025',
    quoteUrl = 'https://ninefold.eu/quote/xxx',
    projectDescription = 'Website Development',
  }) => {
    return (
      <Html>
        <Head />
        <Preview>Payment Received - Thank You! 🎉</Preview>
        <Body style={main}>
          <Container style={container}>
            {/* Header with NineFold Logo */}
            <Section style={header}>
              <Text style={logo}>NineFold</Text>
            </Section>
  
            {/* Success Badge */}
            <Section style={successBadge}>
              <Text style={checkmark}>✓</Text>
              <Heading style={h1}>Payment Received!</Heading>
            </Section>
  
            {/* Main Content */}
            <Section style={content}>
              <Text style={paragraph}>
                Dear {clientName},
              </Text>
              
              <Text style={paragraph}>
                Great news! We've successfully received your payment. Thank you for your trust in NineFold.
              </Text>
  
              {/* Payment Details Card */}
              <Section style={detailsCard}>
                <Row>
                  <Column>
                    <Text style={label}>Quote Number</Text>
                    <Text style={value}>{quoteNumber}</Text>
                  </Column>
                  <Column align="right">
                    <Text style={label}>Amount Paid</Text>
                    <Text style={valueAmount}>{amount}</Text>
                  </Column>
                </Row>
                
                <Hr style={divider} />
                
                <Row>
                  <Column>
                    <Text style={label}>Payment Date</Text>
                    <Text style={value}>{paymentDate}</Text>
                  </Column>
                  <Column align="right">
                    <Text style={label}>Project</Text>
                    <Text style={value}>{projectDescription}</Text>
                  </Column>
                </Row>
              </Section>
  
              {/* Next Steps */}
              <Section style={nextStepsSection}>
                <Heading as="h2" style={h2}>
                  What's Next?
                </Heading>
                <Text style={paragraph}>
                  Our team is excited to get started on your project. Here's what happens next:
                </Text>
                <table style={list}>
                  <tr>
                    <td style={bullet}>1.</td>
                    <td style={listItem}>
                      <Text style={listText}>
                        <strong>Kickoff Meeting:</strong> We'll schedule a project kickoff call within the next 2 business days
                      </Text>
                    </td>
                  </tr>
                  <tr>
                    <td style={bullet}>2.</td>
                    <td style={listItem}>
                      <Text style={listText}>
                        <strong>Timeline Confirmation:</strong> We'll confirm the project timeline and key milestones
                      </Text>
                    </td>
                  </tr>
                  <tr>
                    <td style={bullet}>3.</td>
                    <td style={listItem}>
                      <Text style={listText}>
                        <strong>Regular Updates:</strong> You'll receive weekly progress updates throughout the project
                      </Text>
                    </td>
                  </tr>
                </table>
              </Section>
  
              {/* CTA Button */}
              <Section style={buttonContainer}>
                <Link href={quoteUrl} style={button}>
                  View Your Quote
                </Link>
              </Section>
  
              {/* Contact Info */}
              <Section style={contactSection}>
                <Text style={contactHeading}>
                  Have questions? We're here to help!
                </Text>
                <Text style={contactText}>
                  Email: <Link href="mailto:bruno@ninefold.eu" style={link}>bruno@ninefold.eu</Link>
                </Text>
                <Text style={contactText}>
                  Website: <Link href="https://ninefold.eu" style={link}>ninefold.eu</Link>
                </Text>
              </Section>
  
              {/* Thank You */}
              <Hr style={thanksHr} />
              <Text style={thanksText}>
                Thank you for choosing NineFold. We're committed to delivering exceptional results and look forward to bringing your vision to life.
              </Text>
            </Section>
  
            {/* Footer */}
            <Section style={footer}>
              <Text style={footerText}>
                © {new Date().getFullYear()} NineFold. All rights reserved.
              </Text>
              <Text style={footerText}>
                High-performance web development agency • Zagreb, Croatia
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  };
  
  export default PaymentConfirmationEmail;
  
  // Styles
  const main = {
    backgroundColor: '#f6f6f6',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  };
  
  const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '0',
    marginBottom: '64px',
    maxWidth: '600px',
  };
  
  const header = {
    padding: '32px 40px',
    backgroundColor: '#0F0F0F',
  };
  
  const logo = {
    color: '#00FF94',
    fontSize: '28px',
    fontWeight: '900',
    margin: '0',
    letterSpacing: '-0.5px',
  };
  
  const successBadge = {
    padding: '40px 40px 32px',
    textAlign: 'center',
    backgroundColor: '#F0FDF4',
  };
  
  const checkmark = {
    fontSize: '48px',
    margin: '0 0 16px',
    lineHeight: '1',
    color: '#00FF94',
  };
  
  const h1 = {
    color: '#0F0F0F',
    fontSize: '32px',
    fontWeight: '900',
    margin: '0',
    lineHeight: '1.2',
  };
  
  const h2 = {
    color: '#0F0F0F',
    fontSize: '24px',
    fontWeight: '700',
    margin: '0 0 16px',
  };
  
  const content = {
    padding: '0 40px 40px',
  };
  
  const paragraph = {
    color: '#4B5563',
    fontSize: '16px',
    lineHeight: '26px',
    margin: '0 0 16px',
  };
  
  const detailsCard = {
    backgroundColor: '#F9FAFB',
    borderRadius: '12px',
    padding: '24px',
    margin: '32px 0',
    border: '1px solid #E5E7EB',
  };
  
  const label = {
    color: '#6B7280',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    margin: '0 0 4px',
  };
  
  const value = {
    color: '#0F0F0F',
    fontSize: '16px',
    fontWeight: '600',
    margin: '0',
  };
  
  const valueAmount = {
    color: '#00FF94',
    fontSize: '24px',
    fontWeight: '900',
    margin: '0',
  };
  
  const divider = {
    borderColor: '#E5E7EB',
    margin: '16px 0',
  };
  
  const nextStepsSection = {
    margin: '32px 0',
  };
  
  const list = {
    width: '100%',
    margin: '16px 0',
  };
  
  const bullet = {
    color: '#00FF94',
    fontSize: '20px',
    fontWeight: '900',
    paddingRight: '12px',
    verticalAlign: 'top',
    paddingTop: '4px',
  };
  
  const listItem = {
    paddingBottom: '12px',
  };
  
  const listText = {
    color: '#4B5563',
    fontSize: '16px',
    lineHeight: '26px',
    margin: '0',
  };
  
  const buttonContainer = {
    textAlign: 'center',
    margin: '32px 0',
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
    padding: '14px 32px',
  };
  
  const contactSection = {
    backgroundColor: '#F9FAFB',
    borderRadius: '12px',
    padding: '24px',
    margin: '32px 0',
    textAlign: 'center',
  };
  
  const contactHeading = {
    color: '#0F0F0F',
    fontSize: '16px',
    fontWeight: '700',
    margin: '0 0 12px',
  };
  
  const contactText = {
    color: '#4B5563',
    fontSize: '14px',
    margin: '8px 0',
  };
  
  const link = {
    color: '#00FF94',
    textDecoration: 'none',
    fontWeight: '600',
  };
  
  const thanksHr = {
    borderColor: '#E5E7EB',
    margin: '32px 0 24px',
  };
  
  const thanksText = {
    color: '#6B7280',
    fontSize: '15px',
    lineHeight: '24px',
    fontStyle: 'italic',
    textAlign: 'center',
    margin: '0',
  };
  
  const footer = {
    padding: '32px 40px',
    backgroundColor: '#F9FAFB',
    borderTop: '1px solid #E5E7EB',
  };
  
  const footerText = {
    color: '#9CA3AF',
    fontSize: '12px',
    lineHeight: '20px',
    textAlign: 'center',
    margin: '4px 0',
  };