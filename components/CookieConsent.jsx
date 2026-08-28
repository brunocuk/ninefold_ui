'use client'

// Custom cookie consent in the Mono design language. Replaces CookieYes.
// Implements Google Consent Mode v2: gtag loads with everything denied,
// then updates when the visitor chooses. GA4 + Google Ads load only if
// the IDs below are set.

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Public measurement IDs (safe to expose client-side)
const GA_ID = 'G-3ECD2LY9M0'
const ADS_ID = 'AW-18402494529'

// Google Ads conversion labels (Tools → Conversions)
const CONVERSION_LABELS = {
  booking: 'PyseCPTWteUcEMGQ_8ZE',  // Rezerviran poziv (Cal.com)
  contact: 'UvXtCPfWteUcEMGQ_8ZE',  // Poslana kontakt forma
}

const STORAGE_KEY = 'nf-consent'
const CONSENT_VERSION = 1

// No banner or tracking on internal / client-facing tool routes
const HIDDEN_PREFIXES = ['/crm', '/portal', '/quote', '/report', '/social-report', '/questionnaire']

const PANEL = '#0F0F0F'
const FG = '#F2F2F2'
const BG = '#080808'
const BODY = '#C9C9C9'
const MUTED = '#8E8E8E'
const LINE = 'rgba(255,255,255,0.07)'
const SIGNAL = '#00FF94'
const MONO = 'ui-monospace, Menlo, monospace'
const SANS = "'Space Grotesk', sans-serif"

function readConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed?.v !== CONSENT_VERSION) return null
    return parsed
  } catch {
    return null
  }
}

function gtag() {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(arguments)
}

function applyConsent(consent) {
  gtag('consent', 'update', {
    analytics_storage: consent.analytics ? 'granted' : 'denied',
    ad_storage: consent.ads ? 'granted' : 'denied',
    ad_user_data: consent.ads ? 'granted' : 'denied',
    ad_personalization: consent.ads ? 'granted' : 'denied',
  })
}

// Fire a Google Ads conversion, once per page load per key.
// Consent Mode governs what actually gets sent if the visitor declined ads.
const firedConversions = new Set()
export function trackConversion(key) {
  const label = CONVERSION_LABELS[key]
  if (!label || !ADS_ID || firedConversions.has(key)) return
  firedConversions.add(key)
  gtag('event', 'conversion', { send_to: `${ADS_ID}/${label}` })
  // GA4 copy of the same conversion (Web3Forms submits via JS, so GA4's
  // automatic form_submit never fires); used for audiences and reports
  if (GA_ID) gtag('event', 'generate_lead', { send_to: GA_ID, method: key })
}

let gtagLoaded = false
function loadGtag() {
  if (gtagLoaded || !GA_ID) return
  gtagLoaded = true
  gtag('js', new Date())
  gtag('config', GA_ID)
  if (ADS_ID) gtag('config', ADS_ID)
  const s = document.createElement('script')
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  s.async = true
  document.head.appendChild(s)
}

function Toggle({ on, disabled, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className="relative shrink-0 rounded-full transition-colors duration-300"
      style={{
        width: 36,
        height: 20,
        background: on ? SIGNAL : 'rgba(255,255,255,0.12)',
        opacity: disabled ? 0.55 : 1,
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      <span
        className="absolute top-[3px] block rounded-full transition-transform duration-300"
        style={{
          width: 14,
          height: 14,
          left: 3,
          background: on ? BG : FG,
          transform: on ? 'translateX(16px)' : 'none',
        }}
      />
    </button>
  )
}

export default function CookieConsent() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [analytics, setAnalytics] = useState(true)
  const [ads, setAds] = useState(true)

  const hidden = HIDDEN_PREFIXES.some((p) => pathname?.startsWith(p))

  // Consent Mode v2 defaults, queued before gtag.js loads
  useEffect(() => {
    if (hidden) return
    if (!window.__nfConsentInit) {
      window.__nfConsentInit = true
      gtag('consent', 'default', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        wait_for_update: 500,
      })
      gtag('set', 'ads_data_redaction', true)
      gtag('set', 'url_passthrough', true)
    }
    const saved = readConsent()
    if (saved) {
      applyConsent(saved)
      loadGtag()
    } else {
      setOpen(true)
      const t = setTimeout(() => setVisible(true), 900)
      return () => clearTimeout(t)
    }
  }, [hidden])

  // Footer "Postavke kolačića" reopens the banner
  useEffect(() => {
    const reopen = () => {
      const saved = readConsent()
      if (saved) {
        setAnalytics(!!saved.analytics)
        setAds(!!saved.ads)
      }
      setExpanded(true)
      setOpen(true)
      requestAnimationFrame(() => setVisible(true))
    }
    window.addEventListener('nf:cookie-settings', reopen)
    return () => window.removeEventListener('nf:cookie-settings', reopen)
  }, [])

  const save = (consent) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: CONSENT_VERSION, ...consent, ts: Date.now() }))
    applyConsent(consent)
    loadGtag()
    setVisible(false)
    setTimeout(() => { setOpen(false); setExpanded(false) }, 350)
  }

  if (!open || hidden) return null

  return (
    <div
      className="fixed z-[1250] bottom-4 inset-x-4 md:bottom-6 md:left-6 md:right-auto md:w-[400px]"
      style={{
        fontFamily: SANS,
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(16px)',
        transition: 'opacity .35s cubic-bezier(0.16,1,0.3,1), transform .35s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <div
        className="overflow-hidden rounded-[20px] p-5"
        style={{ background: PANEL, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}
      >
        <p className="flex items-center gap-2 text-[11px] uppercase" style={{ fontFamily: MONO, letterSpacing: '0.14em', color: MUTED }}>
          <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: SIGNAL }} />
          Kolačići
        </p>

        <p className="mt-3 text-sm leading-relaxed" style={{ color: BODY }}>
          Nužni kolačići drže stranicu na životu. Uz tvoje dopuštenje koristimo i analitiku posjeta te mjerenje
          oglasa. Biraš sam.{' '}
          <Link href="/cookie-policy" className="underline underline-offset-2 transition-colors hover:text-white" style={{ color: MUTED }}>
            Politika kolačića
          </Link>
        </p>

        {expanded && (
          <div className="mt-4 flex flex-col" style={{ borderTop: `1px solid ${LINE}` }}>
            {[
              { label: 'Nužni', desc: 'Sesija, sigurnost i pamćenje ovog odabira.', locked: true },
              { label: 'Analitika', desc: 'Google Analytics. Anonimna statistika posjeta.', on: analytics, set: setAnalytics },
              { label: 'Oglašavanje', desc: 'Google Ads. Mjerenje konverzija i remarketing.', on: ads, set: setAds },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-4 py-3" style={{ borderBottom: `1px solid ${LINE}` }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: FG }}>{row.label}</p>
                  <p className="mt-0.5 text-xs" style={{ color: MUTED }}>{row.desc}</p>
                </div>
                {row.locked ? (
                  <Toggle on disabled label="Nužni kolačići, uvijek aktivni" />
                ) : (
                  <Toggle on={row.on} onChange={() => row.set(!row.on)} label={row.label} />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {expanded ? (
            <button
              onClick={() => save({ analytics, ads })}
              className="rounded-full px-4 py-2 text-sm font-medium transition-transform hover:scale-[1.03]"
              style={{ background: FG, color: BG }}
            >
              Spremi odabir
            </button>
          ) : (
            <button
              onClick={() => save({ analytics: true, ads: true })}
              className="rounded-full px-4 py-2 text-sm font-medium transition-transform hover:scale-[1.03]"
              style={{ background: FG, color: BG }}
            >
              Prihvati sve
            </button>
          )}
          <button
            onClick={() => save({ analytics: false, ads: false })}
            className="rounded-full px-4 py-2 text-sm transition-colors hover:text-white"
            style={{ border: '1px solid rgba(255,255,255,0.14)', color: BODY }}
          >
            Samo nužni
          </button>
          {!expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="px-2 py-2 text-sm underline underline-offset-2 transition-colors hover:text-white"
              style={{ color: MUTED }}
            >
              Prilagodi
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
