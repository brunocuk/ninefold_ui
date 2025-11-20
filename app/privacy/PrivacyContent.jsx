// app/privacy/PrivacyContent.jsx

'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'

export default function PrivacyContent() {
  const [heroRef, heroInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  const lastUpdated = 'January 18, 2025'

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative py-32 bg-[#0F0F0F] overflow-hidden">
        
        {/* Subtle noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Gradient glow in background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-[#00CC78]/20 via-[#00FF94]/10 to-transparent rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 lg:px-12">
          
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2 text-sm text-[#88939D] mb-8"
          >
            <Link href="/" className="hover:text-[#00FF94] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white">Privacy Policy</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          >
            Privacy Policy
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg text-[#88939D]"
          >
            Last updated: {lastUpdated}
          </motion.p>
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94] to-transparent opacity-30" />
      </section>

      {/* Content Section */}
      <section className="relative py-24 bg-[#0F0F0F]">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          
          <div className="prose prose-invert prose-lg max-w-none">
            
            {/* Introduction */}
            <div className="mb-12">
              <p className="text-[#88939D] leading-relaxed mb-6">
                NineFold (operated by Progmatiq v.l. Bruno Čukić, hereinafter "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>
              <p className="text-[#88939D] leading-relaxed">
                By using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree with the terms of this Privacy Policy, please do not access or use our services.
              </p>
            </div>

            {/* Company Information */}
            <div className="mb-12 p-6 bg-[#1a1a1a] border-2 border-[#00FF94]/20 rounded-xl">
              <h2 className="text-2xl font-bold text-white mb-4">Company Information</h2>
              <div className="text-[#88939D] space-y-2">
                <p><strong className="text-white">Legal Name:</strong> Progmatiq v.l. Bruno Čukić</p>
                <p><strong className="text-white">Trading Name:</strong> NineFold</p>
                <p><strong className="text-white">Address:</strong> Poljačka ul. 56, 10000 Zagreb, Croatia</p>
                <p><strong className="text-white">Email:</strong> hello@ninefold.eu</p>
              </div>
            </div>

            {/* Section 1 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">1. Information We Collect</h2>
              
              <h3 className="text-2xl font-bold text-white mb-4">1.1 Personal Information</h3>
              <p className="text-[#88939D] leading-relaxed mb-4">
                We may collect personally identifiable information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc list-inside text-[#88939D] space-y-2 mb-6 ml-4">
                <li>Fill out contact forms on our website</li>
                <li>Subscribe to our newsletter or marketing communications</li>
                <li>Request a quote or consultation</li>
                <li>Engage our services</li>
              </ul>
              <p className="text-[#88939D] leading-relaxed mb-6">
                This information may include:
              </p>
              <ul className="list-disc list-inside text-[#88939D] space-y-2 mb-6 ml-4">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Company name</li>
                <li>Project details and requirements</li>
              </ul>

              <h3 className="text-2xl font-bold text-white mb-4">1.2 Automatically Collected Information</h3>
              <p className="text-[#88939D] leading-relaxed mb-4">
                When you visit our website, we may automatically collect certain information about your device and usage patterns, including:
              </p>
              <ul className="list-disc list-inside text-[#88939D] space-y-2 mb-6 ml-4">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website addresses</li>
                <li>Date and time of visits</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">2. How We Use Your Information</h2>
              <p className="text-[#88939D] leading-relaxed mb-4">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc list-inside text-[#88939D] space-y-2 mb-6 ml-4">
                <li>To respond to your inquiries and provide customer support</li>
                <li>To process and fulfill service requests</li>
                <li>To send you information about our services, updates, and promotional materials (with your consent)</li>
                <li>To improve our website and services</li>
                <li>To analyze website usage and optimize user experience</li>
                <li>To comply with legal obligations</li>
                <li>To prevent fraud and ensure website security</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">3. Legal Basis for Processing (GDPR)</h2>
              <p className="text-[#88939D] leading-relaxed mb-4">
                Under the General Data Protection Regulation (GDPR), we process your personal data based on the following legal grounds:
              </p>
              <ul className="list-disc list-inside text-[#88939D] space-y-2 mb-6 ml-4">
                <li><strong className="text-white">Consent:</strong> You have given explicit consent for us to process your personal data for specific purposes (e.g., marketing communications)</li>
                <li><strong className="text-white">Contract Performance:</strong> Processing is necessary to fulfill a contract with you or take steps at your request before entering into a contract</li>
                <li><strong className="text-white">Legitimate Interests:</strong> Processing is necessary for our legitimate business interests, such as improving our services and website functionality</li>
                <li><strong className="text-white">Legal Obligation:</strong> Processing is necessary to comply with legal requirements</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">4. Cookies and Tracking Technologies</h2>
              <p className="text-[#88939D] leading-relaxed mb-4">
                We use cookies and similar tracking technologies to enhance your browsing experience and analyze website traffic. For detailed information about the cookies we use, please refer to our <Link href="/cookie-policy" className="text-[#00FF94] hover:underline">Cookie Policy</Link>.
              </p>
              <p className="text-[#88939D] leading-relaxed">
                You can control cookie settings through your browser preferences. Please note that disabling cookies may affect the functionality of our website.
              </p>
            </div>

            {/* Section 5 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">5. Data Sharing and Disclosure</h2>
              <p className="text-[#88939D] leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-[#88939D] space-y-2 mb-6 ml-4">
                <li><strong className="text-white">Service Providers:</strong> We may share data with trusted third-party service providers who assist us in operating our website and delivering services (e.g., hosting providers, email services, analytics tools)</li>
                <li><strong className="text-white">Legal Requirements:</strong> We may disclose information if required by law, court order, or governmental regulation</li>
                <li><strong className="text-white">Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity</li>
              </ul>
              <p className="text-[#88939D] leading-relaxed">
                All third-party service providers are required to maintain the confidentiality and security of your personal information.
              </p>
            </div>

            {/* Section 6 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">6. Data Retention</h2>
              <p className="text-[#88939D] leading-relaxed">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. When your data is no longer needed, we will securely delete or anonymize it.
              </p>
            </div>

            {/* Section 7 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">7. Your Rights Under GDPR</h2>
              <p className="text-[#88939D] leading-relaxed mb-4">
                If you are a resident of the European Economic Area (EEA), you have the following rights regarding your personal data:
              </p>
              <ul className="list-disc list-inside text-[#88939D] space-y-2 mb-6 ml-4">
                <li><strong className="text-white">Right of Access:</strong> Request a copy of the personal data we hold about you</li>
                <li><strong className="text-white">Right to Rectification:</strong> Request correction of inaccurate or incomplete data</li>
                <li><strong className="text-white">Right to Erasure:</strong> Request deletion of your personal data ("right to be forgotten")</li>
                <li><strong className="text-white">Right to Restrict Processing:</strong> Request limitation on how we use your data</li>
                <li><strong className="text-white">Right to Data Portability:</strong> Request transfer of your data to another service provider</li>
                <li><strong className="text-white">Right to Object:</strong> Object to processing of your data for certain purposes</li>
                <li><strong className="text-white">Right to Withdraw Consent:</strong> Withdraw consent for data processing at any time</li>
              </ul>
              <p className="text-[#88939D] leading-relaxed">
                To exercise any of these rights, please contact us at hello@ninefold.eu. We will respond to your request within 30 days.
              </p>
            </div>

            {/* Section 8 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">8. Data Security</h2>
              <p className="text-[#88939D] leading-relaxed mb-4">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc list-inside text-[#88939D] space-y-2 mb-6 ml-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure servers and databases</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication</li>
                <li>Employee training on data protection</li>
              </ul>
              <p className="text-[#88939D] leading-relaxed">
                However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
              </p>
            </div>

            {/* Section 9 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">9. International Data Transfers</h2>
              <p className="text-[#88939D] leading-relaxed">
                Your information may be transferred to and processed in countries outside of Croatia and the European Economic Area. When we transfer data internationally, we ensure appropriate safeguards are in place, such as standard contractual clauses approved by the European Commission.
              </p>
            </div>

            {/* Section 10 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">10. Children's Privacy</h2>
              <p className="text-[#88939D] leading-relaxed">
                Our services are not intended for individuals under the age of 16. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately so we can delete it.
              </p>
            </div>

            {/* Section 11 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">11. Third-Party Links</h2>
              <p className="text-[#88939D] leading-relaxed">
                Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
              </p>
            </div>

            {/* Section 12 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">12. Changes to This Privacy Policy</h2>
              <p className="text-[#88939D] leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on this page with a new "Last Updated" date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
              </p>
            </div>

            {/* Section 13 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">13. Contact Us</h2>
              <p className="text-[#88939D] leading-relaxed mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="p-6 bg-[#1a1a1a] border-2 border-[#88939D]/20 rounded-xl">
                <p className="text-[#88939D] mb-2">
                  <strong className="text-white">Progmatiq v.l. Bruno Čukić (NineFold)</strong>
                </p>
                <p className="text-[#88939D] mb-2">Poljačka ul. 56, 10000 Zagreb, Croatia</p>
                <p className="text-[#88939D] mb-2">Email: hello@ninefold.eu</p>
              </div>
            </div>

            {/* Supervisory Authority */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">14. Right to Lodge a Complaint</h2>
              <p className="text-[#88939D] leading-relaxed mb-4">
                If you believe your data protection rights have been violated, you have the right to lodge a complaint with the Croatian Data Protection Authority (Agencija za zaštitu osobnih podataka):
              </p>
              <div className="p-6 bg-[#1a1a1a] border-2 border-[#88939D]/20 rounded-xl">
                <p className="text-[#88939D] mb-2">
                  <strong className="text-white">Agencija za zaštitu osobnih podataka (AZOP)</strong>
                </p>
                <p className="text-[#88939D] mb-2">Martićeva 14, 10000 Zagreb, Croatia</p>
                <p className="text-[#88939D] mb-2">Phone: +385 1 4609 000</p>
                <p className="text-[#88939D]">Website: azop.hr</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Bottom gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#00FF94] to-transparent opacity-30" />
    </div>
  )
}