// lib/quoteCalculations.js
// Shared calculation logic for quote builder and questionnaire

import {
  WEB_PACKAGES,
  MAINTENANCE_TIERS,
  APP_PACKAGES,
  SOCIAL_PLANS,
  CONTENT_TYPES,
  PODCAST_STUDIO_PRICING,
  ADDITIONAL_PRICING,
  getMaintenanceTierForPackage,
  getPodcastStudioPrice,
  shouldWaiveOnboarding,
  calculateBundleDiscount
} from './pricingConstants';

/**
 * Calculate quote pricing from service selections
 * @param {Object} selections - Service selections object
 * @returns {Object} - { lineItems, summary }
 */
export function calculateQuoteFromSelections(selections) {
  const lineItems = {
    oneTime: [],
    monthly: []
  };

  let enabledServicesCount = 0;
  let oneTimeSubtotal = 0;
  let monthlySubtotal = 0;

  // Web Development
  if (selections.webDevelopment?.enabled && selections.webDevelopment?.package) {
    enabledServicesCount++;
    const pkg = WEB_PACKAGES[selections.webDevelopment.package];
    if (pkg) {
      lineItems.oneTime.push({
        category: 'webDevelopment',
        name: `Web Stranica - ${pkg.nameHr}`,
        description: pkg.description,
        price: pkg.price
      });
      oneTimeSubtotal += pkg.price;

      // Maintenance
      if (selections.webDevelopment.maintenance?.enabled) {
        const tier = selections.webDevelopment.maintenance.tier
          ? MAINTENANCE_TIERS[selections.webDevelopment.maintenance.tier]
          : getMaintenanceTierForPackage(selections.webDevelopment.package);

        if (tier) {
          lineItems.monthly.push({
            category: 'webDevelopment',
            name: `Održavanje - ${tier.nameHr}`,
            description: tier.description,
            monthlyPrice: tier.monthlyPrice,
            annualPrice: tier.monthlyPrice * 12
          });
          monthlySubtotal += tier.monthlyPrice;
        }
      }
    }
  }

  // App Development
  if (selections.appDevelopment?.enabled && selections.appDevelopment?.package) {
    enabledServicesCount++;
    const pkg = APP_PACKAGES[selections.appDevelopment.package];
    if (pkg) {
      const price = pkg.price || selections.appDevelopment.customPrice || 0;
      lineItems.oneTime.push({
        category: 'appDevelopment',
        name: `Aplikacija - ${pkg.nameHr}`,
        description: pkg.description,
        price: price
      });
      oneTimeSubtotal += price;
    }
  }

  // Social Media
  if (selections.socialMedia?.enabled && selections.socialMedia?.plan) {
    enabledServicesCount++;
    const plan = SOCIAL_PLANS[selections.socialMedia.plan];
    if (plan) {
      // Management fee
      lineItems.monthly.push({
        category: 'socialMedia',
        name: `Social Media Management - ${plan.nameHr}`,
        description: `${plan.postsPerMonth} objava mjesečno`,
        monthlyPrice: plan.managementPrice,
        annualPrice: plan.managementPrice * 12
      });
      monthlySubtotal += plan.managementPrice;

      // Content production
      const contentQuantities = selections.socialMedia.contentQuantities || {};
      let contentTotal = 0;
      const contentItems = [];

      Object.entries(contentQuantities).forEach(([contentTypeId, quantity]) => {
        if (quantity > 0) {
          const contentType = CONTENT_TYPES[contentTypeId];
          if (contentType) {
            // For photo content, respect the plan's max photos limit
            let actualQuantity = quantity;
            if (contentTypeId === 'fotografija') {
              actualQuantity = Math.min(quantity, plan.maxPhotos);
            }

            const itemTotal = contentType.price * actualQuantity;
            contentItems.push({
              name: contentType.nameHr,
              quantity: actualQuantity,
              unitPrice: contentType.price,
              total: itemTotal
            });
            contentTotal += itemTotal;
          }
        }
      });

      if (contentTotal > 0) {
        lineItems.monthly.push({
          category: 'socialMedia',
          name: 'Produkcija sadržaja',
          description: contentItems.map(i => `${i.quantity}x ${i.name}`).join(', '),
          monthlyPrice: contentTotal,
          annualPrice: contentTotal * 12,
          details: contentItems
        });
        monthlySubtotal += contentTotal;
      }

      // Onboarding
      const contractLength = selections.socialMedia.contractLength || 1;
      const includeOnboarding = selections.socialMedia.includeOnboarding !== false;

      if (includeOnboarding && !shouldWaiveOnboarding(contractLength)) {
        lineItems.oneTime.push({
          category: 'socialMedia',
          name: 'Onboarding',
          description: ADDITIONAL_PRICING.onboarding.description,
          price: ADDITIONAL_PRICING.onboarding.price
        });
        oneTimeSubtotal += ADDITIONAL_PRICING.onboarding.price;
      }
    }
  }

  // Podcast Studio (one-time per recording session)
  if (selections.podcastStudio?.enabled && selections.podcastStudio?.duration && selections.podcastStudio?.shortsPackage) {
    enabledServicesCount++;
    const duration = PODCAST_STUDIO_PRICING[selections.podcastStudio.duration];
    const price = getPodcastStudioPrice(selections.podcastStudio.duration, selections.podcastStudio.shortsPackage);

    if (duration && price) {
      lineItems.oneTime.push({
        category: 'podcastStudio',
        name: `Podcast Studio - ${duration.nameHr}`,
        description: `${selections.podcastStudio.shortsPackage} shorts uključeno`,
        price: price
      });
      oneTimeSubtotal += price;
    }
  }

  // Additional Filming Days
  if (selections.additionalFilmingDays > 0) {
    const filmingCost = selections.additionalFilmingDays * ADDITIONAL_PRICING.additionalFilmingDay.price;
    lineItems.monthly.push({
      category: 'additional',
      name: 'Dodatni dani snimanja',
      description: `${selections.additionalFilmingDays}x dan snimanja`,
      monthlyPrice: filmingCost,
      annualPrice: filmingCost * 12
    });
    monthlySubtotal += filmingCost;
  }

  // Calculate bundle discount
  const bundleDiscount = calculateBundleDiscount(enabledServicesCount, oneTimeSubtotal + (monthlySubtotal * 12));

  // Apply bundle discount to one-time fees
  let oneTimeDiscount = 0;
  if (bundleDiscount.eligible && oneTimeSubtotal > 0) {
    oneTimeDiscount = oneTimeSubtotal * bundleDiscount.rate;
  }

  // Calculate totals
  const summary = {
    enabledServicesCount,
    oneTime: {
      subtotal: oneTimeSubtotal,
      discount: oneTimeDiscount,
      discountRate: bundleDiscount.eligible ? bundleDiscount.rate : 0,
      total: oneTimeSubtotal - oneTimeDiscount
    },
    monthly: {
      subtotal: monthlySubtotal,
      total: monthlySubtotal
    },
    annual: {
      monthly: monthlySubtotal * 12,
      total: (oneTimeSubtotal - oneTimeDiscount) + (monthlySubtotal * 12)
    },
    bundleDiscount: bundleDiscount
  };

  return { lineItems, summary };
}

/**
 * Generate quote data for Supabase from selections
 * @param {Object} selections - Service selections
 * @param {Object} clientInfo - Client information
 * @returns {Object} - Quote record data
 */
export function generateQuoteData(selections, clientInfo) {
  const { lineItems, summary } = calculateQuoteFromSelections(selections);

  // Determine quote type based on what's selected
  const hasMonthlyServices = lineItems.monthly.length > 0;
  const hasOneTimeServices = lineItems.oneTime.length > 0;

  // Generate reference number
  const now = new Date();
  const reference = `NF-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  // Build pricing items for the quote
  const pricingItems = lineItems.oneTime.map(item => ({
    name: item.name,
    description: item.description,
    price: item.price
  }));

  // Determine primary service type
  let serviceType = 'web_development';
  if (selections.appDevelopment?.enabled) serviceType = 'web_development';
  if (selections.socialMedia?.enabled) serviceType = 'social_media';
  if (selections.podcastStudio?.enabled) serviceType = 'filming_video';

  // Build scope sections
  const scope = buildScopeFromSelections(selections);

  // Build project overview
  const projectOverview = buildProjectOverview(selections, clientInfo);

  return {
    client_name: clientInfo.name || '',
    reference: reference,
    title: clientInfo.projectTitle || `Ponuda za ${clientInfo.company || clientInfo.name}`,
    status: 'draft',
    service_type: serviceType,
    quote_type: hasMonthlyServices ? 'monthly' : 'project',
    monthly_price: summary.monthly.total,
    project_overview: projectOverview,
    scope: scope,
    pricing: {
      items: pricingItems,
      subtotal: summary.oneTime.subtotal,
      discountRate: summary.oneTime.discountRate,
      discountAmount: summary.oneTime.discount,
      total: summary.oneTime.total,
      monthlyPrice: summary.monthly.total,
      depositRate: 0.5
    },
    service_selections: selections,
    duration: hasOneTimeServices ? '4-8 tjedana' : 'Mjesečna usluga',
    timeline: hasOneTimeServices ? buildDefaultTimeline() : [],
    quote_data: {
      objectives: buildObjectives(selections),
      lineItems: lineItems
    }
  };
}

/**
 * Build scope sections from selections
 */
function buildScopeFromSelections(selections) {
  const scope = [];
  let sectionNumber = 1;

  if (selections.webDevelopment?.enabled) {
    const pkg = WEB_PACKAGES[selections.webDevelopment.package];
    scope.push({
      number: String(sectionNumber++),
      title: 'Web Development',
      items: pkg?.features || ['Responzivni dizajn', 'SEO optimizacija', 'Deployment']
    });
  }

  if (selections.appDevelopment?.enabled) {
    const pkg = APP_PACKAGES[selections.appDevelopment.package];
    scope.push({
      number: String(sectionNumber++),
      title: 'App Development',
      items: pkg?.features || ['Razvoj aplikacije', 'Testiranje', 'Deployment']
    });
  }

  if (selections.socialMedia?.enabled) {
    const plan = SOCIAL_PLANS[selections.socialMedia.plan];
    scope.push({
      number: String(sectionNumber++),
      title: 'Social Media Management',
      items: plan?.features || ['Upravljanje profilima', 'Community management', 'Mjesečni izvještaji']
    });
  }

  if (selections.podcastStudio?.enabled) {
    const duration = PODCAST_STUDIO_PRICING[selections.podcastStudio.duration];
    scope.push({
      number: String(sectionNumber++),
      title: 'Podcast Studio',
      items: [
        `Snimanje u trajanju ${duration?.nameHr || 'po dogovoru'}`,
        `${selections.podcastStudio.shortsPackage || 5} short-form videa`,
        'Profesionalna oprema',
        'Post-produkcija'
      ]
    });
  }

  return scope;
}

/**
 * Build project overview text
 */
function buildProjectOverview(selections, clientInfo) {
  const parts = [];

  if (selections.webDevelopment?.enabled) {
    const pkg = WEB_PACKAGES[selections.webDevelopment.package];
    parts.push(`izradu profesionalne web stranice (${pkg?.nameHr || 'paket'})`);
  }

  if (selections.appDevelopment?.enabled) {
    const pkg = APP_PACKAGES[selections.appDevelopment.package];
    parts.push(`razvoj web aplikacije (${pkg?.nameHr || 'paket'})`);
  }

  if (selections.socialMedia?.enabled) {
    const plan = SOCIAL_PLANS[selections.socialMedia.plan];
    parts.push(`upravljanje društvenim mrežama (${plan?.nameHr || 'plan'})`);
  }

  if (selections.podcastStudio?.enabled) {
    parts.push('korištenje podcast studia s produkcijom short-form sadržaja');
  }

  if (parts.length === 0) {
    return 'Ponuda za digitalne usluge.';
  }

  const clientRef = clientInfo.company || clientInfo.name || 'klijenta';
  return `Ova ponuda obuhvaća ${parts.join(', ')} za ${clientRef}. Sve usluge uključuju profesionalnu podršku i redovitu komunikaciju tijekom trajanja projekta.`;
}

/**
 * Build objectives from selections
 */
function buildObjectives(selections) {
  const objectives = [];

  if (selections.webDevelopment?.enabled) {
    objectives.push('Izgraditi modernu i funkcionalnu web stranicu');
    if (selections.webDevelopment.maintenance?.enabled) {
      objectives.push('Osigurati kontinuirano održavanje i podršku');
    }
  }

  if (selections.appDevelopment?.enabled) {
    objectives.push('Razviti skalabilnu web aplikaciju');
  }

  if (selections.socialMedia?.enabled) {
    objectives.push('Unaprijediti prisutnost na društvenim mrežama');
    objectives.push('Povećati engagement i doseg');
  }

  if (selections.podcastStudio?.enabled) {
    objectives.push('Producirati kvalitetan video sadržaj');
  }

  return objectives;
}

/**
 * Build default timeline
 */
function buildDefaultTimeline() {
  return [
    { week: 'Tjedan 1', phase: 'Planiranje i strategija', duration: '1 tjedan' },
    { week: 'Tjedan 2-3', phase: 'Dizajn i priprema', duration: '2 tjedna' },
    { week: 'Tjedan 4-6', phase: 'Implementacija', duration: '3 tjedna' },
    { week: 'Tjedan 7-8', phase: 'Testiranje i lansiranje', duration: '2 tjedna' }
  ];
}

/**
 * Validate service selections
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
export function validateSelections(selections) {
  const errors = [];

  // Check if at least one service is enabled
  const hasAnyService =
    selections.webDevelopment?.enabled ||
    selections.appDevelopment?.enabled ||
    selections.socialMedia?.enabled ||
    selections.podcastStudio?.enabled ||
    selections.additionalFilmingDays > 0;

  if (!hasAnyService) {
    errors.push('Odaberite barem jednu uslugu');
  }

  // Validate web development
  if (selections.webDevelopment?.enabled && !selections.webDevelopment?.package) {
    errors.push('Odaberite web paket');
  }

  // Validate app development
  if (selections.appDevelopment?.enabled) {
    if (!selections.appDevelopment?.package) {
      errors.push('Odaberite app paket');
    }
    if (selections.appDevelopment.package === 'enterprise' && !selections.appDevelopment.customPrice) {
      errors.push('Unesite cijenu za Enterprise paket');
    }
  }

  // Validate social media
  if (selections.socialMedia?.enabled && !selections.socialMedia?.plan) {
    errors.push('Odaberite social media plan');
  }

  // Validate podcast studio
  if (selections.podcastStudio?.enabled) {
    if (!selections.podcastStudio?.duration) {
      errors.push('Odaberite trajanje snimanja');
    }
    if (!selections.podcastStudio?.shortsPackage) {
      errors.push('Odaberite paket shortova');
    }
    // Check if combination is valid
    const price = getPodcastStudioPrice(
      selections.podcastStudio.duration,
      selections.podcastStudio.shortsPackage
    );
    if (price === null && selections.podcastStudio.duration && selections.podcastStudio.shortsPackage) {
      errors.push('Ova kombinacija trajanja i shortova nije dostupna');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('hr-HR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}
