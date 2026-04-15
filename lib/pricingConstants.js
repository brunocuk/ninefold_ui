// lib/pricingConstants.js
// Centralized pricing data for quote builder and questionnaire

// Web Development Packages
export const WEB_PACKAGES = {
  temelj: {
    id: 'temelj',
    name: 'Temelj',
    nameHr: 'Temelj',
    price: 1490,
    description: 'Osnovna web stranica za male biznise',
    features: [
      'Do 5 stranica',
      'Responzivni dizajn',
      'Kontakt forma',
      'SEO optimizacija',
      'SSL certifikat'
    ]
  },
  rast: {
    id: 'rast',
    name: 'Rast',
    nameHr: 'Rast',
    price: 2490,
    description: 'Profesionalna web stranica za rastuće biznise',
    features: [
      'Do 10 stranica',
      'Responzivni dizajn',
      'Kontakt forma',
      'SEO optimizacija',
      'SSL certifikat',
      'Blog/Novosti sekcija',
      'Google Analytics integracija',
      'Social media integracija'
    ]
  },
  vrhunac: {
    id: 'vrhunac',
    name: 'Vrhunac',
    nameHr: 'Vrhunac',
    price: 3990,
    description: 'Premium web stranica s naprednim funkcionalnostima',
    features: [
      'Do 20 stranica',
      'Responzivni dizajn',
      'Kontakt forma',
      'SEO optimizacija',
      'SSL certifikat',
      'Blog/Novosti sekcija',
      'Google Analytics integracija',
      'Social media integracija',
      'Newsletter integracija',
      'CMS sustav',
      'Multi-jezik podrška',
      'Napredne animacije'
    ]
  }
};

// Maintenance Tiers (paired with web packages)
export const MAINTENANCE_TIERS = {
  simple: {
    id: 'simple',
    name: 'Simple',
    nameHr: 'Jednostavno',
    monthlyPrice: 80,
    pairedWith: 'temelj',
    description: 'Osnovno održavanje',
    features: [
      'Mjesečne sigurnosne nadogradnje',
      'Backup podataka',
      'Email podrška',
      'Do 2 sata rada mjesečno'
    ]
  },
  mid: {
    id: 'mid',
    name: 'Mid',
    nameHr: 'Srednje',
    monthlyPrice: 135,
    pairedWith: 'rast',
    description: 'Standardno održavanje',
    features: [
      'Sve iz Simple paketa',
      'Prioritetna podrška',
      'Do 4 sata rada mjesečno',
      'Mjesečni izvještaji',
      'Optimizacija performansi'
    ]
  },
  extra: {
    id: 'extra',
    name: 'Extra',
    nameHr: 'Napredni',
    monthlyPrice: 200,
    pairedWith: 'vrhunac',
    description: 'Premium održavanje',
    features: [
      'Sve iz Mid paketa',
      'Do 8 sati rada mjesečno',
      '24/7 podrška',
      'Proaktivno praćenje',
      'A/B testiranje',
      'Mjesečni pozivi'
    ]
  }
};

// Get maintenance tier for a web package
export function getMaintenanceTierForPackage(packageId) {
  const tier = Object.values(MAINTENANCE_TIERS).find(t => t.pairedWith === packageId);
  return tier || MAINTENANCE_TIERS.simple;
}

// App Development Packages
export const APP_PACKAGES = {
  start: {
    id: 'start',
    name: 'Start',
    nameHr: 'Start',
    price: 2990,
    description: 'MVP aplikacija za validaciju ideje',
    features: [
      'Osnovna funkcionalnost',
      'Do 5 ekrana',
      'Jednostavna baza podataka',
      'Osnovna autentikacija',
      'Deployment'
    ]
  },
  sustav: {
    id: 'sustav',
    name: 'Sustav',
    nameHr: 'Sustav',
    price: 7200,
    description: 'Kompletna web aplikacija',
    features: [
      'Do 15 ekrana',
      'Napredna baza podataka',
      'Korisnički sustav',
      'Admin panel',
      'API integracije',
      'Automatizacije',
      'Dokumentacija'
    ]
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    nameHr: 'Enterprise',
    price: null, // Custom pricing
    description: 'Enterprise rješenje po mjeri',
    features: [
      'Neograničeni ekrani',
      'Kompleksne integracije',
      'Skalabilna arhitektura',
      'SLA podrška',
      'Dedicirani tim',
      'Kontinuirani razvoj'
    ]
  }
};

// Social Media Plans
export const SOCIAL_PLANS = {
  prisutnost: {
    id: 'prisutnost',
    name: 'Prisutnost',
    nameHr: 'Prisutnost',
    managementPrice: 200,
    postsPerMonth: 12,
    maxPhotos: 4,
    description: 'Osnovna prisutnost na društvenim mrežama',
    features: [
      '12 objava mjesečno',
      'Do 4 fotografije po objavi',
      'Community management',
      'Mjesečni izvještaj'
    ]
  },
  momentum: {
    id: 'momentum',
    name: 'Momentum',
    nameHr: 'Momentum',
    managementPrice: 350,
    postsPerMonth: 20,
    maxPhotos: 8,
    description: 'Aktivna prisutnost s više sadržaja',
    features: [
      '20 objava mjesečno',
      'Do 8 fotografija po objavi',
      'Community management',
      'Stories sadržaj',
      'Mjesečni izvještaj',
      'Strategija sadržaja'
    ]
  },
  dominacija: {
    id: 'dominacija',
    name: 'Dominacija',
    nameHr: 'Dominacija',
    managementPrice: 500,
    postsPerMonth: 40,
    maxPhotos: 12,
    description: 'Dominantna prisutnost s premium sadržajem',
    features: [
      '40 objava mjesečno',
      'Do 12 fotografija po objavi',
      'Community management',
      'Stories + Reels',
      'Tjedni izvještaji',
      'Strategija sadržaja',
      'Influencer koordinacija',
      'Paid ads management'
    ]
  },
  custom: {
    id: 'custom',
    name: 'Custom',
    nameHr: 'Prilagođeni',
    managementPrice: null, // Set by user
    postsPerMonth: null,   // Calculated from deliverables
    maxPhotos: null,       // No limit for custom
    description: 'Prilagođeni paket po vašim potrebama',
    features: [] // Set by user
  }
};

// Content Types (for social media content production)
export const CONTENT_TYPES = {
  fotografija: {
    id: 'fotografija',
    name: 'Fotografija',
    nameHr: 'Fotografija',
    price: 20,
    description: 'Profesionalna fotografija'
  },
  talkingHead: {
    id: 'talkingHead',
    name: 'Talking Head',
    nameHr: 'Talking Head',
    price: 40,
    description: 'Video s govornikom'
  },
  shortFormPodcast: {
    id: 'shortFormPodcast',
    name: 'Short Form Podcast',
    nameHr: 'Kratki Podcast',
    price: 25,
    description: 'Kratak podcast clip'
  },
  videoCarousel: {
    id: 'videoCarousel',
    name: 'Video Carousel',
    nameHr: 'Video Carousel',
    price: 40,
    description: 'Carousel video format'
  },
  journeyVlog: {
    id: 'journeyVlog',
    name: 'Journey Vlog',
    nameHr: 'Journey Vlog',
    price: 50,
    description: 'Vlog stil video'
  },
  highlightReel: {
    id: 'highlightReel',
    name: 'Highlight Reel',
    nameHr: 'Highlight Reel',
    price: 60,
    description: 'Highlight montaža'
  },
  edit: {
    id: 'edit',
    name: 'Edit',
    nameHr: 'Montaža',
    price: 80,
    description: 'Profesionalna montaža'
  },
  documentary: {
    id: 'documentary',
    name: 'Documentary',
    nameHr: 'Dokumentarac',
    price: 150,
    description: 'Dokumentarni stil'
  },
  complexTalkingHead: {
    id: 'complexTalkingHead',
    name: 'Complex Talking Head',
    nameHr: 'Kompleksni Talking Head',
    price: 70,
    description: 'Napredni talking head video'
  },
  netflixStyle: {
    id: 'netflixStyle',
    name: 'Netflix Style',
    nameHr: 'Netflix Stil',
    price: 100,
    description: 'Premium produkcija'
  },
  sketch: {
    id: 'sketch',
    name: 'Sketch',
    nameHr: 'Sketch',
    price: 40,
    description: 'Kratki komični sketch'
  }
};

// Podcast Studio Pricing Grid
// Rows: duration (polaSata, sat, dvaSata)
// Columns: shorts package (5, 10, 15)
export const PODCAST_STUDIO_PRICING = {
  polaSata: {
    id: 'polaSata',
    name: 'Pola sata',
    nameHr: 'Pola sata',
    durationMinutes: 30,
    packages: {
      5: 150,
      10: 250,
      15: null // Not available
    }
  },
  sat: {
    id: 'sat',
    name: 'Sat vremena',
    nameHr: 'Sat vremena',
    durationMinutes: 60,
    packages: {
      5: 180,
      10: 270,
      15: 330
    }
  },
  dvaSata: {
    id: 'dvaSata',
    name: 'Dva sata',
    nameHr: 'Dva sata',
    durationMinutes: 120,
    packages: {
      5: 240,
      10: 330,
      15: 400
    }
  }
};

// Get podcast studio price
export function getPodcastStudioPrice(duration, shortsPackage) {
  const durationData = PODCAST_STUDIO_PRICING[duration];
  if (!durationData) return null;
  return durationData.packages[shortsPackage] || null;
}

// Additional Pricing Constants
export const ADDITIONAL_PRICING = {
  onboarding: {
    price: 400,
    waiveAtMonths: 6, // Waived if contract is 6+ months
    description: 'Jednokratna naknada za onboarding'
  },
  additionalFilmingDay: {
    price: 200,
    description: 'Dodatni dan snimanja'
  },
  bundleDiscount: {
    rate: 0.10, // 10% discount
    minServices: 2, // Minimum services to qualify
    description: '10% popust na 2+ usluge'
  }
};

// Calculate if onboarding should be waived
export function shouldWaiveOnboarding(contractLengthMonths) {
  return contractLengthMonths >= ADDITIONAL_PRICING.onboarding.waiveAtMonths;
}

// Calculate bundle discount eligibility
export function calculateBundleDiscount(enabledServicesCount, subtotal) {
  if (enabledServicesCount >= ADDITIONAL_PRICING.bundleDiscount.minServices) {
    return {
      eligible: true,
      rate: ADDITIONAL_PRICING.bundleDiscount.rate,
      amount: subtotal * ADDITIONAL_PRICING.bundleDiscount.rate
    };
  }
  return { eligible: false, rate: 0, amount: 0 };
}

// Get all packages as arrays for UI
export function getAllWebPackages() {
  return Object.values(WEB_PACKAGES);
}

export function getAllMaintenanceTiers() {
  return Object.values(MAINTENANCE_TIERS);
}

export function getAllAppPackages() {
  return Object.values(APP_PACKAGES);
}

export function getAllSocialPlans() {
  return Object.values(SOCIAL_PLANS);
}

export function getAllContentTypes() {
  return Object.values(CONTENT_TYPES);
}

export function getAllPodcastDurations() {
  return Object.values(PODCAST_STUDIO_PRICING);
}

// Default service selections structure
export const DEFAULT_SERVICE_SELECTIONS = {
  webDevelopment: {
    enabled: false,
    package: null,
    maintenance: {
      enabled: false,
      tier: null
    }
  },
  appDevelopment: {
    enabled: false,
    package: null,
    customPrice: null
  },
  socialMedia: {
    enabled: false,
    plan: null,
    customPlan: {
      managementPrice: null,
      contentDeliverables: {},
      features: [
        'Community management',
        'Strategija sadržaja',
        'Mjesečni izvještaji'
      ]
    },
    contentQuantities: {},
    contractLength: 1,
    includeOnboarding: true
  },
  podcastStudio: {
    enabled: false,
    duration: null,
    shortsPackage: null
  },
  additionalFilmingDays: 0
};
