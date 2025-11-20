// app/contact/ContactContent.jsx

'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'

const contactInfo = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: 'Email',
    value: 'hello@ninefold.eu',
    link: 'mailto:hello@ninefold.eu',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: 'Location',
    value: 'Poljačka ul. 56, Zagreb',
    link: null,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'Response Time',
    value: 'Within 24 hours',
    link: null,
  },
]

const socialLinks = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/ninefoldeu/', icon: 'LI' },
  { name: 'Instagram', href: 'https://www.instagram.com/ninefold_eu/', icon: 'IG' },
  { name: 'Dribbble', href: 'https://dribbble.com', icon: 'DR' },
]

const budgetOptions = [
  'Less than €3,000',
  '€3,000 - €6,000',
  '€6,000 - €10,000',
  '€10,000 - €25,000',
  '€25,000+',
  'Not sure yet',
]

export default function ContactContent() {
  const [heroRef, heroInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  const [formRef, formInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    budget: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: '55bd9170-5a04-47a7-a2a4-f6eeb07fb66d',
          name: formData.name,
          email: formData.email,
          company: formData.company || 'Not provided',
          budget: formData.budget || 'Not specified',
          message: formData.message,
          subject: `New Contact Form Submission from ${formData.name}`,
          from_name: 'Webframe Contact Form',
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSubmitStatus('success')
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            company: '',
            budget: '',
            message: '',
          })
          setSubmitStatus(null)
        }, 5000)
      } else {
        setSubmitStatus('error')
        console.error('Form submission error:', data)
      }
    } catch (error) {
      setSubmitStatus('error')
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center bg-[#0F0F0F] overflow-hidden">
        
        {/* Subtle noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Gradient glow in background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-[#00CC78]/20 via-[#00FF94]/10 to-transparent rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-20">
          
          <div className="max-w-5xl">
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8"
            >
              <span className="inline-block px-4 py-2 bg-[#00FF94]/10 border border-[#00FF94]/30 rounded-full text-[#00FF94] text-sm font-mono uppercase tracking-wider">
                Get in Touch
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[1.05] tracking-tight mb-8"
            >
              <span className="block text-white">
                Let's build
              </span>
              <span className="block text-white">
                something{' '}
                <span className="text-[#00FF94]">great</span>.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-xl md:text-2xl text-[#88939D] leading-relaxed max-w-3xl"
            >
              Have a project in mind? We'd love to hear about it. Fill out the form below 
              and we'll get back to you within 24 hours.
            </motion.p>
          </div>
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94] to-transparent opacity-30" />
      </section>

      {/* Contact Form Section */}
      <section ref={formRef} className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
        
        {/* Subtle gradient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none" />

        {/* Noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            
            {/* Left Side - Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Contact Info Cards */}
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, y: 40 }}
                    animate={formInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ 
                      duration: 0.8, 
                      delay: 0.2 + index * 0.1,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    className="group relative"
                  >
                    <div className="relative p-6 lg:p-8 rounded-2xl bg-transparent border-2 border-[#88939D]/20 transition-all duration-300 hover:border-[#00FF94] overflow-hidden">
                      
                      {/* Hover gradient background */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/5 via-[#00CC78]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={false}
                      />

                      <div className="relative z-10 flex items-start gap-4">
                        <div className="text-[#00FF94] mt-1">
                          {info.icon}
                        </div>
                        <div>
                          <p className="text-[#88939D] text-sm mb-2 uppercase tracking-wider font-mono">
                            {info.label}
                          </p>
                          {info.link ? (
                            <a
                              href={info.link}
                              className="text-white hover:text-[#00FF94] transition-colors text-lg font-medium"
                            >
                              {info.value}
                            </a>
                          ) : (
                            <p className="text-white text-lg font-medium">
                              {info.value}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Bottom gradient line accent */}
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Office Hours */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={formInView ? { opacity: 1, y: 0 } : {}}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.5,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="group relative"
              >
                <div className="relative p-6 lg:p-8 rounded-2xl bg-transparent border-2 border-[#00FF94]/30 overflow-hidden">
                  
                  {/* Background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/5 via-[#00CC78]/5 to-transparent" />

                  <div className="relative z-10">
                    <h3 className="text-[#00FF94] text-sm uppercase tracking-wider font-mono mb-4">
                      Office Hours
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#88939D]">Monday - Friday</span>
                        <span className="text-white font-medium">9:00 - 17:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#88939D]">Weekend</span>
                        <span className="text-white font-medium">By appointment</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={formInView ? { opacity: 1, y: 0 } : {}}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.6,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                <p className="text-[#88939D] text-sm uppercase tracking-wider font-mono mb-4">
                  Follow Us
                </p>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={formInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ 
                        duration: 0.6, 
                        delay: 0.7 + index * 0.05,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 flex items-center justify-center rounded-xl bg-transparent border-2 border-[#88939D]/20 text-[#88939D] hover:border-[#00FF94] hover:text-[#00FF94] hover:bg-[#00FF94]/10 transition-all text-xs font-bold"
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Side - Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={formInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.8, 
                delay: 0.4,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="lg:col-span-3"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#88939D] mb-2 uppercase tracking-wider font-mono">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 bg-transparent border-2 border-[#88939D]/20 rounded-xl text-white placeholder-[#88939D] focus:border-[#00FF94] focus:outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#88939D] mb-2 uppercase tracking-wider font-mono">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 bg-transparent border-2 border-[#88939D]/20 rounded-xl text-white placeholder-[#88939D] focus:border-[#00FF94] focus:outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-[#88939D] mb-2 uppercase tracking-wider font-mono">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-transparent border-2 border-[#88939D]/20 rounded-xl text-white placeholder-[#88939D] focus:border-[#00FF94] focus:outline-none transition-all"
                    placeholder="Your Company"
                  />
                </div>

                {/* Budget */}
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-[#88939D] mb-2 uppercase tracking-wider font-mono">
                    Project Budget
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-transparent border-2 border-[#88939D]/20 rounded-xl text-white focus:border-[#00FF94] focus:outline-none transition-all appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%2388939D' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                    }}
                  >
                    <option value="" className="bg-[#0F0F0F]">Select a budget range</option>
                    {budgetOptions.map((option) => (
                      <option key={option} value={option} className="bg-[#0F0F0F]">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#88939D] mb-2 uppercase tracking-wider font-mono">
                    Project Details *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-4 bg-transparent border-2 border-[#88939D]/20 rounded-xl text-white placeholder-[#88939D] focus:border-[#00FF94] focus:outline-none transition-all resize-none"
                    placeholder="Tell us about your project, goals, and timeline..."
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group relative w-full px-8 py-5 rounded-xl font-bold text-lg overflow-hidden transition-all ${
                    isSubmitting
                      ? 'bg-[#88939D] cursor-not-allowed'
                      : submitStatus === 'success'
                      ? 'bg-gradient-to-r from-green-500 to-green-600'
                      : submitStatus === 'error'
                      ? 'bg-gradient-to-r from-red-500 to-red-600'
                      : 'bg-gradient-to-r from-[#00FF94] to-[#00CC78]'
                  } text-black`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </>
                    ) : submitStatus === 'success' ? (
                      <>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Message Sent!
                      </>
                    ) : submitStatus === 'error' ? (
                      <>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Failed - Try Again
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </>
                    )}
                  </span>
                </motion.button>

                {/* Success/Error Message */}
                {submitStatus === 'success' && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-green-500 text-sm"
                  >
                    Thanks for reaching out! We'll get back to you within 24 hours.
                  </motion.p>
                )}
                {submitStatus === 'error' && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-red-500 text-sm"
                  >
                    Something went wrong. Please try again or email us directly at hello@ninefold.eu
                  </motion.p>
                )}

                <p className="text-sm text-[#88939D] text-center">
                  By submitting this form, you agree to our privacy policy.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="relative py-24 lg:py-32 bg-[#0F0F0F] overflow-hidden">
        
        {/* Subtle gradient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#00CC78]/10 via-[#00FF94]/5 to-transparent rounded-full blur-[120px] pointer-events-none" />

        {/* Noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden border-2 border-[#88939D]/20"
          >
            {/* Google Maps Embed */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2781.057866583254!2d15.914419476950988!3d45.810099471081756!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4765d1309bbba9e3%3A0xd45dda7df121b3!2sPolja%C4%8Dka%20ul.%2056%2C%2010000%2C%20Zagreb!5e0!3m2!1sen!2shr!4v1763542818229!5m2!1sen!2shr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale invert-[0.9] contrast-[0.8] brightness-[1.2] opacity-90"
              title="Webframe & NineFold Office Location in Zagreb"
            />
          </motion.div>
        </div>
      </section>

      {/* Bottom gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#00FF94] to-transparent opacity-30" />
    </div>
  )
}