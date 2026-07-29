// Capture high-res portfolio screenshots of a live site.
// Usage: node scripts/capture-site.mjs <url> <output-dir>
// Produces: hero-desktop.jpg, full-desktop.jpg, section-desktop.jpg, hero-mobile.jpg
// and prints real FCP/LCP metrics measured during load.

import puppeteer from 'puppeteer'
import fs from 'fs'

const URL = process.argv[2]
const OUT = process.argv[3]
if (!URL || !OUT) {
  console.error('Usage: node scripts/capture-site.mjs <url> <output-dir>')
  process.exit(1)
}
fs.mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch({ headless: 'new' })
const page = await browser.newPage()

// Collect real paint metrics during load
await page.evaluateOnNewDocument(() => {
  window.__lcp = 0
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) window.__lcp = entry.startTime
  }).observe({ type: 'largest-contentful-paint', buffered: true })
})

await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 })
await new Promise((r) => setTimeout(r, 3000))

// Dismiss cookie banner if present
for (const sel of ['.cky-btn-accept', '#onetrust-accept-btn-handler', '[id*="cookie"] button', 'button[class*="accept"]']) {
  try {
    const btn = await page.$(sel)
    if (btn) { await btn.click(); await new Promise((r) => setTimeout(r, 800)); break }
  } catch {}
}

const metrics = await page.evaluate(() => {
  const paint = performance.getEntriesByType('paint').find((p) => p.name === 'first-contentful-paint')
  return { fcp: paint ? Math.round(paint.startTime) : null, lcp: Math.round(window.__lcp) }
})
console.log('METRICS', JSON.stringify(metrics))

// 1. Desktop hero
await page.screenshot({ path: `${OUT}/hero-desktop.jpg`, type: 'jpeg', quality: 92 })

// Scroll through to trigger lazy content, then full page
await page.evaluate(async () => {
  await new Promise((resolve) => {
    let y = 0
    const step = setInterval(() => {
      window.scrollBy(0, 600)
      y += 600
      if (y > document.body.scrollHeight) { clearInterval(step); resolve() }
    }, 120)
  })
})
await new Promise((r) => setTimeout(r, 1500))
await page.evaluate(() => window.scrollTo(0, 0))
await new Promise((r) => setTimeout(r, 1000))

// 2. Full page (for the CSS scroll-pan trick)
await page.screenshot({ path: `${OUT}/full-desktop.jpg`, type: 'jpeg', quality: 88, fullPage: true })

// 3. Services / mid-page section
await page.evaluate(() => {
  const el = [...document.querySelectorAll('h2, section')].find((n) => /usluge|services/i.test(n.textContent))
  if (el) el.scrollIntoView({ block: 'start' })
})
await new Promise((r) => setTimeout(r, 1500))
await page.screenshot({ path: `${OUT}/section-desktop.jpg`, type: 'jpeg', quality: 92 })

// 4. Mobile hero
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3 })
await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 })
await new Promise((r) => setTimeout(r, 2500))
await page.screenshot({ path: `${OUT}/hero-mobile.jpg`, type: 'jpeg', quality: 92 })

// 5. Mobile mid-page
await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 1.6 }))
await new Promise((r) => setTimeout(r, 1500))
await page.screenshot({ path: `${OUT}/section-mobile.jpg`, type: 'jpeg', quality: 92 })

await browser.close()
console.log('DONE')
