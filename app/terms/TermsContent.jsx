// app/terms/TermsContent.jsx

'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'

export default function TermsContent() {
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
            <span className="text-white">Terms and Conditions</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          >
            Terms and Conditions
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
                These Terms and Conditions ("Terms") govern your access to and use of the services provided by NineFold, operated by Progmatiq v.l. Bruno Čukić ("we," "us," or "our"). By accessing our website or engaging our services, you agree to be bound by these Terms.
              </p>
              <p className="text-[#88939D] leading-relaxed">
                Please read these Terms carefully before using our services. If you do not agree with any part of these Terms, you must not use our services.
              </p>
            </div>

            {/* Company Information */}
            <div className="mb-12 p-6 bg-[#1a1a1a] border-2 border-[#00FF94]/20 rounded-xl">
              <h2 className="text-2xl font-bold text-white mb-4">Company Information</h2>
              <div className="text-[#88939D] space-y-2">
                <p><strong className="text-white">Legal Name:</strong> Progmatiq v.l. Bruno Čukić</p>
                <p><strong className="text-white">Trading Name:</strong> NineFold</p>
                <p><strong className="text-white">Address:</strong> Glavna ul. 12, 10000 Zagreb, Croatia</p>
                <p><strong className="text-white">Email:</strong> hello@ninefold.eu</p>
              </div>
            </div>

            {/* Section 1 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">1. Definitions</h2>
              <p className="text-[#88939D] leading-relaxed mb-4">
                For the purposes of these Terms:
              </p>
              <ul className="list-disc list-inside text-[#88939D] space-y-2 mb-6 ml-4">
                <li><strong className="text-white">"Client"</strong> refers to any individual or entity that engages our services</li>
                <li><strong className="text-white">"Services"</strong> refers to web development, design, photography, videography, and related digital services provided by NineFold</li>
                <li><strong className="text-white">"Website"</strong> refers to the NineFold website accessible at ninefold.eu and any associated subdomains</li>
                <li><strong className="text-white">"Deliverables"</strong> refers to work products, files, code, designs, or other materials created as part of our services</li>
                <li><strong className="text-white">"Agreement"</strong> refers to any service contract, proposal, or statement of work between us and the Client</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">2. Services</h2>
              
              <h3 className="text-2xl font-bold text-white mb-4">2.1 Scope of Services</h3>
              <p className="text-[#88939D] leading-relaxed mb-6">
                We provide professional web development and design services including, but not limited to, website design and development, web applications, e-commerce solutions, Shopify development, SEO optimization, photography, and videography. The specific scope of services for each project will be defined in a separate Agreement.
              </p>

              <h3 className="text-2xl font-bold text-white mb-4">2.2 Service Execution</h3>
              <p className="text-[#88939D] leading-relaxed mb-6">
                We will execute services with reasonable skill and care, in accordance with industry standards. While we strive to meet agreed timelines, project deadlines are estimates and may be subject to change based on project complexity, client responsiveness, and unforeseen circumstances.
              </p>

              <h3 className="text-2xl font-bold text-white mb-4">2.3 Client Responsibilities</h3>
              <p className="text-[#88939D] leading-relaxed mb-4">
                The Client agrees to:
              </p>
              <ul className="list-disc list-inside text-[#88939D] space-y-2 mb-6 ml-4">
                <li>Provide accurate and complete information necessary for project execution</li>
                <li>Respond to requests for feedback and approvals in a timely manner</li>
                <li>Provide access to necessary systems, accounts, and resources</li>
                <li>Pay agreed fees according to the payment schedule</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">3. Fees and Payment</h2>
              
              <h3 className="text-2xl font-bold text-white mb-4">3.1 Pricing</h3>
              <p className="text-[#88939D] leading-relaxed mb-6">
                Fees for services will be outlined in the Agreement. Unless otherwise specified, all prices are quoted in Euros (EUR) and exclude applicable taxes.
              </p>

              <h3 className="text-2xl font-bold text-white mb-4">3.2 Payment Terms</h3>
              <p className="text-[#88939D] leading-relaxed mb-4">
                Standard payment terms are as follows:
              </p>
              <ul className="list-disc list-inside text-[#88939D] space-y-2 mb-6 ml-4">
                <li>50% deposit due upon signing the Agreement</li>
                <li>Remaining 50% due upon project completion or according to agreed milestones</li>
                <li>Invoices are payable within 14 days of issuance</li>
                <li>Late payments may incur interest charges of 1.5% per month</li>
              </ul>

              <h3 className="text-2xl font-bold text-white mb-4">3.3 Additional Work</h3>
              <p className="text-[#88939D] leading-relaxed mb-6">
                Any work requested beyond the agreed scope will be charged separately at our standard hourly rates or as agreed in writing.
              </p>

              <h3 className="text-2xl font-bold text-white mb-4">3.4 Third-Party Costs</h3>
              <p className="text-[#88939D] leading-relaxed mb-6">
                The Client is responsible for third-party costs including, but not limited to, domain registration, hosting fees, premium plugins, stock images, and software licenses unless otherwise agreed.
              </p>
            </div>

            {/* Section 4 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">4. Intellectual Property</h2>
              
              <h3 className="text-2xl font-bold text-white mb-4">4.1 Ownership of Deliverables</h3>
              <p className="text-[#88939D] leading-relaxed mb-6">
                Upon full payment of all fees, the Client will own the final deliverables created specifically for the Client as part of the project. This includes custom designs, code, and content created exclusively for the Client.
              </p>

              <h3 className="text-2xl font-bold text-white mb-4">4.2 Retained Rights</h3>
              <p className="text-[#88939D] leading-relaxed mb-4">
                We retain ownership of:
              </p>
              <ul className="list-disc list-inside text-[#88939D] space-y-2 mb-6 ml-4">
                <li>Pre-existing intellectual property, tools, libraries, and frameworks</li>
                <li>General methodologies, processes, and know-how</li>
                <li>Reusable code components and templates developed independently</li>
              </ul>

              <h3 className="text-2xl font-bold text-white mb-4">4.3 Portfolio Rights</h3>
              <p className="text-[#88939D] leading-relaxed mb-6">
                We reserve the right to display completed projects in our portfolio and marketing materials unless otherwise agreed in writing. We will not disclose confidential business information without permission.
              </p>

              <h3 className="text-2xl font-bold text-white mb-4">4.4 Third-Party Materials</h3>
              <p className="text-[#88939D] leading-relaxed mb-6">
                The Client is responsible for ensuring they have proper rights and licenses for any third-party materials (images, fonts, content, etc.) provided for use in the project.
              </p>
            </div>

            {/* Section 5 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">5. Revisions and Changes</h2>
              
              <h3 className="text-2xl font-bold text-white mb-4">5.1 Included Revisions</h3>
              <p className="text-[#88939D] leading-relaxed mb-6">
                Each project includes a specified number of revision rounds as outlined in the Agreement. Revisions must be requested within the project timeline.
              </p>

              <h3 className="text-2xl font-bold text-white mb-4">5.2 Additional Revisions</h3>
              <p className="text-[#88939D] leading-relaxed mb-6">
                Revisions beyond the agreed scope or requested after project completion will be charged at our standard hourly rate.
              </p>

              <h3 className="text-2xl font-bold text-white mb-4">5.3 Scope Changes</h3>
              <p className="text-[#88939D] leading-relaxed mb-6">
                Significant changes to project scope may result in timeline adjustments and additional fees. All scope changes must be agreed in writing.
              </p>
            </div>

            {/* Section 6 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">6. Warranties and Disclaimers</h2>
              
              <h3 className="text-2xl font-bold text-white mb-4">6.1 Service Warranty</h3>
              <p className="text-[#88939D] leading-relaxed mb-6">
                We warrant that services will be performed with reasonable skill and care in accordance with industry standards. We will correct any defects in workmanship reported within 30 days of project delivery at no additional charge.
              </p>

              <h3 className="text-2xl font-bold text-white mb-4">6.2 Disclaimer</h3>
              <p className="text-[#88939D] leading-relaxed mb-4">
                Except as expressly stated in these Terms:
              </p>
              <ul className="list-disc list-inside text-[#88939D] space-y-2 mb-6 ml-4">
                <li>We provide services "as is" without warranties of any kind</li>
                <li>We do not guarantee specific results, traffic, sales, or rankings</li>
                <li>We are not responsible for third-party services, plugins, or platforms</li>
                <li>We do not warrant uninterrupted or error-free service delivery</li>
              </ul>

              <h3 className="text-2xl font-bold text-white mb-4">6.3 Third-Party Services</h3>
              <p className="text-[#88939D] leading-relaxed mb-6">
                We are not responsible for issues arising from third-party services, hosting providers, or external platforms beyond our control.
              </p>
            </div>

            {/* Section 7 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">7. Limitation of Liability</h2>
              <p className="text-[#88939D] leading-relaxed mb-4">
                To the maximum extent permitted by law:
              </p>
              <ul className="list-disc list-inside text-[#88939D] space-y-2 mb-6 ml-4">
                <li>Our total liability for any claim shall not exceed the amount paid by the Client for the specific services giving rise to the claim</li>
                <li>We shall not be liable for indirect, incidental, consequential, or punitive damages</li>
                <li>We shall not be liable for loss of profits, revenue, data, or business opportunities</li>
                <li>We shall not be liable for delays or failures due to circumstances beyond our reasonable control</li>
              </ul>
            </div>

            {/* Section 8 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">8. Confidentiality</h2>
              <p className="text-[#88939D] leading-relaxed mb-6">
                We will maintain the confidentiality of any proprietary or confidential information shared by the Client during the course of our engagement. This obligation does not apply to information that is publicly available, independently developed, or required to be disclosed by law.
              </p>
            </div>

            {/* Section 9 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">9. Termination</h2>
              
              <h3 className="text-2xl font-bold text-white mb-4">9.1 Termination by Client</h3>
              <p className="text-[#88939D] leading-relaxed mb-6">
                The Client may terminate services at any time with written notice. Upon termination, the Client remains responsible for payment of all work completed to date, plus any non-refundable expenses incurred.
              </p>

              <h3 className="text-2xl font-bold text-white mb-4">9.2 Termination by Us</h3>
              <p className="text-[#88939D] leading-relaxed mb-4">
                We may terminate services if:
              </p>
              <ul className="list-disc list-inside text-[#88939D] space-y-2 mb-6 ml-4">
                <li>The Client fails to make payments according to agreed terms</li>
                <li>The Client breaches these Terms or the Agreement</li>
                <li>The Client engages in abusive or inappropriate behavior</li>
                <li>Continuing services would violate applicable laws or our policies</li>
              </ul>

              <h3 className="text-2xl font-bold text-white mb-4">9.3 Effect of Termination</h3>
              <p className="text-[#88939D] leading-relaxed mb-6">
                Upon termination, we will provide the Client with work completed to date upon receipt of payment for services rendered. We reserve the right to retain copies of work for our records and portfolio use.
              </p>
            </div>

            {/* Section 10 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">10. Maintenance and Support</h2>
              <p className="text-[#88939D] leading-relaxed mb-6">
                Unless specifically included in the Agreement, ongoing maintenance and support are not included in project fees. We offer separate maintenance packages for post-launch support, updates, and hosting management.
              </p>
            </div>

            {/* Section 11 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">11. Force Majeure</h2>
              <p className="text-[#88939D] leading-relaxed mb-6">
                We shall not be liable for delays or failures in performance resulting from circumstances beyond our reasonable control, including but not limited to acts of God, natural disasters, war, terrorism, labor disputes, government actions, or internet service disruptions.
              </p>
            </div>

            {/* Section 12 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">12. Governing Law and Jurisdiction</h2>
              <p className="text-[#88939D] leading-relaxed mb-6">
                These Terms shall be governed by and construed in accordance with the laws of Croatia. Any disputes arising from these Terms or our services shall be subject to the exclusive jurisdiction of the courts of Zagreb, Croatia.
              </p>
            </div>

            {/* Section 13 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">13. Changes to Terms</h2>
              <p className="text-[#88939D] leading-relaxed mb-6">
                We reserve the right to modify these Terms at any time. Updated Terms will be posted on our website with a new "Last Updated" date. Continued use of our services after changes constitutes acceptance of the modified Terms.
              </p>
            </div>

            {/* Section 14 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">14. Severability</h2>
              <p className="text-[#88939D] leading-relaxed mb-6">
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect.
              </p>
            </div>

            {/* Section 15 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">15. Entire Agreement</h2>
              <p className="text-[#88939D] leading-relaxed mb-6">
                These Terms, together with any specific Agreement for services, constitute the entire agreement between the Client and NineFold and supersede all prior agreements, understandings, and communications.
              </p>
            </div>

            {/* Contact */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">16. Contact Information</h2>
              <p className="text-[#88939D] leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="p-6 bg-[#1a1a1a] border-2 border-[#88939D]/20 rounded-xl">
                <p className="text-[#88939D] mb-2">
                  <strong className="text-white">Progmatiq v.l. Bruno Čukić (NineFold)</strong>
                </p>
                <p className="text-[#88939D] mb-2">Glavna ul. 12, 10000 Zagreb, Croatia</p>
                <p className="text-[#88939D]">Email: hello@ninefold.eu</p>
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