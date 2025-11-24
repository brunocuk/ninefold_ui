// app/cookie-policy/CookiePolicyContent.jsx

'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'

export default function CookiePolicyContent() {
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
            <span className="text-white">Cookie Policy</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          >
            Cookie Policy
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
                This Cookie Policy explains how NineFold, operated by Progmatiq v.l. Bruno Čukić ("we," "us," or "our"), uses cookies and similar technologies when you visit our website. This policy should be read in conjunction with our <Link href="/privacy" className="text-[#00FF94] hover:underline">Privacy Policy</Link>.
              </p>
              <p className="text-[#88939D] leading-relaxed">
                By using our website, you consent to the use of cookies as described in this policy. You can manage your cookie preferences at any time through your browser settings or our cookie consent banner.
              </p>
            </div>

            {/* Company Information */}
            <div className="mb-12 p-6 bg-[#1a1a1a] border-2 border-[#00FF94]/20 rounded-xl">
              <h2 className="text-2xl font-bold text-white mb-4">Company Information</h2>
              <div className="text-[#88939D] space-y-2">
                <p><strong className="text-white">Legal Name:</strong> Progmatiq v.l. Bruno Čukić</p>
                <p><strong className="text-white">Trading Name:</strong> NineFold</p>
                <p><strong className="text-white">Address:</strong> Glavna ul. 12, 10360 Zagreb, Croatia</p>
                <p><strong className="text-white">Email:</strong> hello@ninefold.eu</p>
              </div>
            </div>

            {/* Section 1 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">1. What Are Cookies?</h2>
              <p className="text-[#88939D] leading-relaxed mb-6">
                Cookies are small text files that are placed on your device (computer, smartphone, tablet) when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and deliver information to website owners.
              </p>
              <p className="text-[#88939D] leading-relaxed mb-6">
                Cookies can be "persistent" (remain on your device until deleted or until they expire) or "session" (deleted when you close your browser). They can also be "first-party" (set by the website you're visiting) or "third-party" (set by a different domain).
              </p>
            </div>

            {/* Section 2 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">2. How We Use Cookies</h2>
              <p className="text-[#88939D] leading-relaxed mb-4">
                We use cookies for the following purposes:
              </p>
              <ul className="list-disc list-inside text-[#88939D] space-y-2 mb-6 ml-4">
                <li><strong className="text-white">Essential cookies:</strong> Required for basic website functionality</li>
                <li><strong className="text-white">Analytics cookies:</strong> Help us understand how visitors use our website</li>
                <li><strong className="text-white">Functionality cookies:</strong> Remember your preferences and settings</li>
                <li><strong className="text-white">Marketing cookies:</strong> Track your activity for advertising purposes (with your consent)</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">3. Types of Cookies We Use</h2>
              
              <h3 className="text-2xl font-bold text-white mb-4">3.1 Strictly Necessary Cookies</h3>
              <p className="text-[#88939D] leading-relaxed mb-4">
                These cookies are essential for our website to function properly. They enable core functionality such as security, network management, and accessibility. Without these cookies, certain services cannot be provided.
              </p>
              <div className="overflow-x-auto mb-8">
                <table className="w-full border-2 border-[#88939D]/20 rounded-xl">
                  <thead className="bg-[#1a1a1a]">
                    <tr>
                      <th className="p-4 text-left text-white border-b-2 border-[#88939D]/20">Cookie Name</th>
                      <th className="p-4 text-left text-white border-b-2 border-[#88939D]/20">Purpose</th>
                      <th className="p-4 text-left text-white border-b-2 border-[#88939D]/20">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#88939D]/20">
                      <td className="p-4 text-[#88939D]">cookie_consent</td>
                      <td className="p-4 text-[#88939D]">Stores your cookie preferences</td>
                      <td className="p-4 text-[#88939D]">1 year</td>
                    </tr>
                    <tr className="border-b border-[#88939D]/20">
                      <td className="p-4 text-[#88939D]">session_id</td>
                      <td className="p-4 text-[#88939D]">Maintains your session state</td>
                      <td className="p-4 text-[#88939D]">Session</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">3.2 Analytics and Performance Cookies</h3>
              <p className="text-[#88939D] leading-relaxed mb-4">
                These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website's performance and user experience.
              </p>
              <div className="overflow-x-auto mb-8">
                <table className="w-full border-2 border-[#88939D]/20 rounded-xl">
                  <thead className="bg-[#1a1a1a]">
                    <tr>
                      <th className="p-4 text-left text-white border-b-2 border-[#88939D]/20">Cookie Name</th>
                      <th className="p-4 text-left text-white border-b-2 border-[#88939D]/20">Provider</th>
                      <th className="p-4 text-left text-white border-b-2 border-[#88939D]/20">Purpose</th>
                      <th className="p-4 text-left text-white border-b-2 border-[#88939D]/20">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#88939D]/20">
                      <td className="p-4 text-[#88939D]">_ga</td>
                      <td className="p-4 text-[#88939D]">Google Analytics</td>
                      <td className="p-4 text-[#88939D]">Distinguishes unique users</td>
                      <td className="p-4 text-[#88939D]">2 years</td>
                    </tr>
                    <tr className="border-b border-[#88939D]/20">
                      <td className="p-4 text-[#88939D]">_gid</td>
                      <td className="p-4 text-[#88939D]">Google Analytics</td>
                      <td className="p-4 text-[#88939D]">Distinguishes unique users</td>
                      <td className="p-4 text-[#88939D]">24 hours</td>
                    </tr>
                    <tr className="border-b border-[#88939D]/20">
                      <td className="p-4 text-[#88939D]">_gat</td>
                      <td className="p-4 text-[#88939D]">Google Analytics</td>
                      <td className="p-4 text-[#88939D]">Throttles request rate</td>
                      <td className="p-4 text-[#88939D]">1 minute</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">3.3 Functionality Cookies</h3>
              <p className="text-[#88939D] leading-relaxed mb-4">
                These cookies enable our website to remember choices you make (such as your language preference or the region you're in) and provide enhanced, more personalized features.
              </p>
              <div className="overflow-x-auto mb-8">
                <table className="w-full border-2 border-[#88939D]/20 rounded-xl">
                  <thead className="bg-[#1a1a1a]">
                    <tr>
                      <th className="p-4 text-left text-white border-b-2 border-[#88939D]/20">Cookie Name</th>
                      <th className="p-4 text-left text-white border-b-2 border-[#88939D]/20">Purpose</th>
                      <th className="p-4 text-left text-white border-b-2 border-[#88939D]/20">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#88939D]/20">
                      <td className="p-4 text-[#88939D]">language_preference</td>
                      <td className="p-4 text-[#88939D]">Stores your language choice</td>
                      <td className="p-4 text-[#88939D]">1 year</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">3.4 Marketing and Targeting Cookies</h3>
              <p className="text-[#88939D] leading-relaxed mb-4">
                These cookies may be set through our website by our advertising partners. They may be used to build a profile of your interests and show you relevant advertisements on other websites. These cookies require your explicit consent.
              </p>
              <div className="overflow-x-auto mb-8">
                <table className="w-full border-2 border-[#88939D]/20 rounded-xl">
                  <thead className="bg-[#1a1a1a]">
                    <tr>
                      <th className="p-4 text-left text-white border-b-2 border-[#88939D]/20">Cookie Name</th>
                      <th className="p-4 text-left text-white border-b-2 border-[#88939D]/20">Provider</th>
                      <th className="p-4 text-left text-white border-b-2 border-[#88939D]/20">Purpose</th>
                      <th className="p-4 text-left text-white border-b-2 border-[#88939D]/20">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#88939D]/20">
                      <td className="p-4 text-[#88939D]">_fbp</td>
                      <td className="p-4 text-[#88939D]">Facebook</td>
                      <td className="p-4 text-[#88939D]">Tracks visits for advertising</td>
                      <td className="p-4 text-[#88939D]">3 months</td>
                    </tr>
                    <tr className="border-b border-[#88939D]/20">
                      <td className="p-4 text-[#88939D]">IDE</td>
                      <td className="p-4 text-[#88939D]">Google</td>
                      <td className="p-4 text-[#88939D]">Advertising personalization</td>
                      <td className="p-4 text-[#88939D]">1 year</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 4 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">4. Third-Party Cookies</h2>
              <p className="text-[#88939D] leading-relaxed mb-4">
                We use services from third-party providers that may set cookies on your device. These third parties have their own privacy policies:
              </p>
              <ul className="list-disc list-inside text-[#88939D] space-y-2 mb-6 ml-4">
                <li><strong className="text-white">Google Analytics:</strong> For website analytics and performance monitoring (<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#00FF94] hover:underline">Privacy Policy</a>)</li>
                <li><strong className="text-white">Google Fonts:</strong> For typography and design (<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#00FF94] hover:underline">Privacy Policy</a>)</li>
                <li><strong className="text-white">Vercel:</strong> For website hosting and performance (<a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#00FF94] hover:underline">Privacy Policy</a>)</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">5. Managing Your Cookie Preferences</h2>
              
              <h3 className="text-2xl font-bold text-white mb-4">5.1 Cookie Consent Banner</h3>
              <p className="text-[#88939D] leading-relaxed mb-6">
                When you first visit our website, you'll see a cookie consent banner that allows you to accept or reject non-essential cookies. You can change your preferences at any time by clicking the "Cookie Settings" link in our website footer.
              </p>

              <h3 className="text-2xl font-bold text-white mb-4">5.2 Browser Settings</h3>
              <p className="text-[#88939D] leading-relaxed mb-4">
                You can control and manage cookies through your browser settings. Most browsers allow you to:
              </p>
              <ul className="list-disc list-inside text-[#88939D] space-y-2 mb-6 ml-4">
                <li>View what cookies are stored and delete them individually</li>
                <li>Block third-party cookies</li>
                <li>Block cookies from specific websites</li>
                <li>Block all cookies from being set</li>
                <li>Delete all cookies when you close your browser</li>
              </ul>
              <p className="text-[#88939D] leading-relaxed mb-6">
                Please note that deleting or blocking cookies may impact your experience on our website and may prevent you from using certain features.
              </p>

              <h3 className="text-2xl font-bold text-white mb-4">5.3 Browser-Specific Instructions</h3>
              <p className="text-[#88939D] leading-relaxed mb-4">
                For instructions on managing cookies in specific browsers:
              </p>
              <ul className="list-disc list-inside text-[#88939D] space-y-2 mb-6 ml-4">
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-[#00FF94] hover:underline">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer" className="text-[#00FF94] hover:underline">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-[#00FF94] hover:underline">Safari</a></li>
                <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-[#00FF94] hover:underline">Microsoft Edge</a></li>
              </ul>
            </div>

            {/* Section 6 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">6. Do Not Track Signals</h2>
              <p className="text-[#88939D] leading-relaxed mb-6">
                Some browsers include a "Do Not Track" (DNT) feature that signals to websites that you do not want your online activities tracked. Currently, there is no industry standard for how to respond to DNT signals. Our website does not currently respond to DNT browser signals or mechanisms.
              </p>
            </div>

            {/* Section 7 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">7. Updates to This Cookie Policy</h2>
              <p className="text-[#88939D] leading-relaxed mb-6">
                We may update this Cookie Policy from time to time to reflect changes in our practices, technologies, legal requirements, or for other operational reasons. We will notify you of any material changes by posting the updated policy on this page with a new "Last Updated" date.
              </p>
            </div>

            {/* Section 8 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">8. Your Rights Under GDPR</h2>
              <p className="text-[#88939D] leading-relaxed mb-4">
                Under the General Data Protection Regulation (GDPR), you have the right to:
              </p>
              <ul className="list-disc list-inside text-[#88939D] space-y-2 mb-6 ml-4">
                <li>Be informed about how cookies are used on our website</li>
                <li>Give or withdraw consent for non-essential cookies</li>
                <li>Access information about the cookies we use</li>
                <li>Object to the use of certain cookies</li>
              </ul>
            </div>

            {/* Contact */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">9. Contact Us</h2>
              <p className="text-[#88939D] leading-relaxed mb-4">
                If you have any questions about our use of cookies or this Cookie Policy, please contact us:
              </p>
              <div className="p-6 bg-[#1a1a1a] border-2 border-[#88939D]/20 rounded-xl">
                <p className="text-[#88939D] mb-2">
                  <strong className="text-white">Progmatiq v.l. Bruno Čukić (NineFold)</strong>
                </p>
                <p className="text-[#88939D] mb-2">Glavna ul. 12, 10360 Zagreb, Croatia</p>
                <p className="text-[#88939D]">Email: hello@ninefold.eu</p>
              </div>
            </div>

            {/* More Information */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">10. More Information</h2>
              <p className="text-[#88939D] leading-relaxed mb-4">
                For more information about cookies and how they work, visit:
              </p>
              <ul className="list-disc list-inside text-[#88939D] space-y-2 mb-6 ml-4">
                <li><a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-[#00FF94] hover:underline">All About Cookies</a></li>
                <li><a href="https://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer" className="text-[#00FF94] hover:underline">Your Online Choices</a></li>
                <li><a href="https://ico.org.uk/for-the-public/online/cookies/" target="_blank" rel="noopener noreferrer" className="text-[#00FF94] hover:underline">ICO - Cookies</a></li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Bottom gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#00FF94] to-transparent opacity-30" />
    </div>
  )
}