// lib/salesPackages.js
// Predefined website packages and add-ons for the sales module (/sales).
// generateSalesQuoteData() produces a standard quotes-table row, so the existing
// quote preview (/quote/[id]), PDF, email and Revolut payment link work unchanged.

export const SALES_PACKAGES = {
  start: {
    id: 'start',
    name: 'Start',
    category: 'web',
    price: 897,
    duration: '2-3 tjedna',
    tagline: 'Za male biznise koji trebaju profesionalan web, brzo i bez komplikacija.',
    features: [
      'Do 4 stranice (Naslovnica, O nama, Usluge, Kontakt)',
      'Responzivni dizajn (mobitel, tablet, računalo)',
      'Kontakt forma',
      'Osnovna SEO optimizacija',
      'SSL certifikat',
      'Google Maps integracija',
      'Postavljanje hostinga i domene',
    ],
  },
  standard: {
    id: 'standard',
    name: 'Standard',
    category: 'web',
    price: 1997,
    duration: '3-5 tjedana',
    tagline: 'Za biznise koji žele web koji aktivno dovodi klijente.',
    features: [
      'Do 8 stranica',
      'Dizajn po mjeri',
      'Blog / Novosti sekcija',
      'Kontakt forma + newsletter prijava',
      'Napredna SEO optimizacija',
      'Google Analytics postavljanje',
      'Osnovni copywriting tekstova',
      'Povezivanje društvenih mreža',
    ],
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    category: 'web',
    price: 3997,
    duration: '5-8 tjedana',
    tagline: 'Kompletno digitalno rješenje za biznise koji misle ozbiljno.',
    features: [
      'Do 15 stranica',
      'Premium dizajn i animacije',
      'CMS: samostalno uređivanje sadržaja',
      'Napredni SEO + Google Search Console',
      'Blog / Novosti sekcija',
      'Integracije (rezervacije, newsletter)',
      'Priprema za višejezičnost',
      'Prioritetna podrška 30 dana nakon lansiranja',
    ],
  },
  shopMini: {
    id: 'shopMini',
    name: 'Mini Web Shop',
    category: 'shop',
    price: 1497,
    duration: '3-4 tjedna',
    tagline: 'Za početak online prodaje, do 15 proizvoda.',
    features: [
      'Do 15 proizvoda',
      'Online plaćanje karticama',
      'Responzivni dizajn (mobitel, tablet, računalo)',
      'Upravljanje narudžbama',
      'Osnovna SEO optimizacija',
      'SSL certifikat',
      'Postavljanje hostinga i domene',
    ],
  },
  shopStandard: {
    id: 'shopStandard',
    name: 'Web Shop',
    category: 'shop',
    price: 2997,
    duration: '4-6 tjedana',
    tagline: 'Za ozbiljniju online prodaju s većim katalogom.',
    features: [
      'Do 50 proizvoda',
      'Online plaćanje karticama',
      'Dizajn po mjeri',
      'Upravljanje narudžbama i zalihama',
      'Više načina plaćanja (kartice, virman, pouzeće)',
      'Napredna SEO optimizacija',
      'Google Analytics postavljanje',
      'Edukacija za vođenje shopa',
    ],
  },
};

export const SALES_ADDONS = {
  extraPage: {
    id: 'extraPage',
    name: 'Dodatna stranica',
    description: 'Dodatna stranica uz opseg odabranog paketa',
    price: 90,
    recurring: false,
    countable: true,
  },
  copywriting: {
    id: 'copywriting',
    name: 'Copywriting tekstova',
    description: 'Profesionalno pisanje tekstova, do 5 stranica',
    price: 250,
    recurring: false,
  },
  logoRefresh: {
    id: 'logoRefresh',
    name: 'Osvježavanje loga',
    description: 'Redizajn postojećeg loga u modernom izdanju',
    price: 220,
    recurring: false,
  },
  gbp: {
    id: 'gbp',
    name: 'Google Business Profile',
    description: 'Postavljanje i optimizacija Google poslovnog profila',
    price: 120,
    recurring: false,
  },
  seoStarter: {
    id: 'seoStarter',
    name: 'SEO Starter paket',
    description: 'Istraživanje ključnih riječi + on-page optimizacija',
    price: 290,
    recurring: false,
  },
  booking: {
    id: 'booking',
    name: 'Online rezervacije',
    description: 'Integracija sustava za online rezervacije',
    price: 240,
    recurring: false,
  },
  miniShop: {
    id: 'miniShop',
    name: 'Mini web shop',
    description: 'Web trgovina do 10 proizvoda s online plaćanjem',
    price: 490,
    recurring: false,
  },
  multilingual: {
    id: 'multilingual',
    name: 'Dodatni jezik',
    description: 'Prijevod i verzija stranice na dodatnom jeziku',
    price: 350,
    recurring: false,
  },
  photography: {
    id: 'photography',
    name: 'Profesionalno fotografiranje',
    description: 'Pola dana fotografiranja prostora, tima i usluga',
    price: 250,
    recurring: false,
  },
  maintenance: {
    id: 'maintenance',
    name: 'Mjesečno održavanje',
    description: 'Ažuriranja, sigurnosne zakrpe, sitne izmjene sadržaja i podrška',
    price: 60,
    recurring: true,
  },
};

/**
 * Generate a quotes-table row from a sales package selection.
 *
 * @param {string} packageId - key of SALES_PACKAGES
 * @param {object} addonSelection - { [addonId]: count } (count is 1 for non-countable addons)
 * @param {object} clientInfo - { name, email, company, phone, leadId }
 * @param {object} salesUser - session user from getSalesUser()
 * @param {object} options - { discountRate: 0-1 }
 * @returns {object|null} row ready for supabase.from('quotes').insert()
 */
export function generateSalesQuoteData(packageId, addonSelection, clientInfo, salesUser, { discountRate = 0 } = {}) {
  const pkg = SALES_PACKAGES[packageId];
  if (!pkg) return null;

  const isShop = pkg.category === 'shop';
  const productLabel = isShop ? 'Web shop' : 'Web stranica';

  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const reference = `NF-${dateStr}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  const items = [
    {
      name: `${productLabel} · ${pkg.name}`,
      description: pkg.tagline,
      price: pkg.price,
    },
  ];

  let maintenance;
  const addonScopeItems = [];

  Object.entries(addonSelection || {}).forEach(([addonId, count]) => {
    const addon = SALES_ADDONS[addonId];
    if (!addon || !count) return;

    if (addon.recurring) {
      // Recurring addon maps to pricing.maintenance so it stays out of the
      // one-time total and the Revolut deposit
      maintenance = {
        enabled: true,
        price: addon.price,
        description: addon.description,
      };
      return;
    }

    const qty = addon.countable ? count : 1;
    items.push({
      name: qty > 1 ? `${addon.name} (${qty}x)` : addon.name,
      description: addon.description,
      price: addon.price * qty,
    });
    addonScopeItems.push(qty > 1 ? `${addon.name} (${qty}x)` : addon.name);
  });

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const discountAmount = Math.round(subtotal * discountRate * 100) / 100;
  const total = Math.round((subtotal - discountAmount) * 100) / 100;

  const scope = [
    {
      number: '1',
      title: `${productLabel} · paket ${pkg.name}`,
      items: pkg.features,
    },
  ];
  if (addonScopeItems.length > 0) {
    scope.push({
      number: '2',
      title: 'Dodatne usluge',
      items: addonScopeItems,
    });
  }

  const clientRef = clientInfo.company || clientInfo.name || 'klijenta';

  return {
    client_id: null,
    lead_id: clientInfo.leadId || null,
    client_name: clientInfo.name || '',
    client_email: clientInfo.email || '',
    quote_number: reference,
    reference,
    title: `Ponuda za ${clientRef}`,
    status: 'draft',
    service_type: 'web_development',
    quote_type: 'project',
    issuer_company: 'progmatiq',
    sales_user_id: salesUser?.id || null,
    project_overview: `Ova ponuda obuhvaća izradu ${isShop ? 'profesionalnog web shopa' : 'profesionalne web stranice'} (paket ${pkg.name}) za ${clientRef}. Uključuje profesionalnu podršku i redovitu komunikaciju tijekom trajanja projekta.`,
    duration: pkg.duration,
    scope,
    timeline: [
      { week: 'Tjedan 1', phase: 'Planiranje i priprema sadržaja', duration: '1 tjedan' },
      { week: 'Tjedan 2', phase: 'Dizajn', duration: '1 tjedan' },
      { week: 'Tjedan 3-4', phase: 'Izrada i implementacija', duration: '2 tjedna' },
      { week: 'Zadnji tjedan', phase: 'Testiranje i lansiranje', duration: '1 tjedan' },
    ],
    pricing: {
      items,
      subtotal,
      discountRate,
      discountAmount,
      total,
      depositRate: 0.5,
      ...(maintenance ? { maintenance } : {}),
    },
    quote_data: {
      objectives: [
        isShop ? 'Izgraditi moderan i funkcionalan web shop' : 'Izgraditi modernu i funkcionalnu web stranicu',
        'Osigurati profesionalan online nastup',
        ...(maintenance ? ['Osigurati kontinuirano održavanje i podršku'] : []),
      ],
    },
  };
}

/**
 * Format a number as EUR currency (hr-HR locale)
 */
export function formatEur(amount) {
  return new Intl.NumberFormat('hr-HR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount || 0);
}
