// lib/serviceTemplates.js
// Service templates for multi-service quote system

export const SERVICE_TYPES = {
  web_development: {
    id: 'web_development',
    name: 'Web/App Development',
    nameHr: 'Web / App Razvoj',
    icon: '💻',
    defaultScope: [
      {
        number: "1",
        title: "Konzultacije i planiranje",
        items: ['Analiza potreba i ciljeva', 'Definiranje funkcionalnosti', 'Tehnička specifikacija', 'Plan projekta']
      },
      {
        number: "2",
        title: "Dizajn korisničkog sučelja",
        items: ['Wireframes i mockups', 'UI/UX dizajn', 'Responzivni dizajn', '2 runde revizija']
      },
      {
        number: "3",
        title: "Development",
        items: ['Frontend development', 'Backend development', 'Integracije', 'Optimizacija performansi']
      },
      {
        number: "4",
        title: "Testiranje i objava",
        items: ['QA testiranje', 'Cross-browser testiranje', 'Deployment', 'Obuka korisnika']
      },
    ],
    defaultTimeline: [
      { week: 'Tjedan 1', phase: 'Istraživanje i planiranje', duration: '1 tjedan' },
      { week: 'Tjedan 2-4', phase: 'Dizajn', duration: '2-3 tjedna' },
      { week: 'Tjedan 5-8', phase: 'Development', duration: '3-4 tjedna' },
      { week: 'Tjedan 9', phase: 'Testiranje i lansiranje', duration: '1 tjedan' },
    ],
    defaultLineItems: [
      { name: 'Website Design + Development', description: '', price: 0 }
    ],
    defaultDuration: '8 tjedana'
  },

  filming_video: {
    id: 'filming_video',
    name: 'Filming / Video Production',
    nameHr: 'Snimanje / Video Produkcija',
    icon: '🎬',
    defaultScope: [
      {
        number: "1",
        title: "Pre-produkcija",
        items: ['Kreativni brief', 'Storyboard', 'Scenarij', 'Planiranje lokacija']
      },
      {
        number: "2",
        title: "Produkcija",
        items: ['Snimanje', 'Režija', 'Osvjetljenje', 'Audio snimanje']
      },
      {
        number: "3",
        title: "Post-produkcija",
        items: ['Montaža', 'Color grading', 'Sound design', 'Grafike i efekti']
      },
      {
        number: "4",
        title: "Finalizacija",
        items: ['Revizije', 'Export u različitim formatima', 'Dostava finalnih materijala']
      },
    ],
    defaultTimeline: [
      { week: 'Tjedan 1', phase: 'Pre-produkcija', duration: '1 tjedan' },
      { week: 'Tjedan 2', phase: 'Produkcija (snimanje)', duration: '1 tjedan' },
      { week: 'Tjedan 3-4', phase: 'Post-produkcija', duration: '2 tjedna' },
    ],
    defaultLineItems: [
      { name: 'Video produkcija', description: '', price: 0 }
    ],
    defaultDuration: '4 tjedna'
  },

  marketing: {
    id: 'marketing',
    name: 'Marketing',
    nameHr: 'Marketing',
    icon: '📊',
    defaultScope: [
      {
        number: "1",
        title: "Strategija",
        items: ['Analiza tržišta', 'Definiranje ciljne publike', 'Konkurentska analiza', 'Marketing strategija']
      },
      {
        number: "2",
        title: "Kampanje",
        items: ['Planiranje kampanja', 'Kreativni koncepti', 'Ad copy', 'Vizualni materijali']
      },
      {
        number: "3",
        title: "Implementacija",
        items: ['Postavljanje kampanja', 'A/B testiranje', 'Optimizacija', 'Praćenje metrika']
      },
      {
        number: "4",
        title: "Reporting",
        items: ['Analiza rezultata', 'ROI izvještaji', 'Preporuke za poboljšanje']
      },
    ],
    defaultTimeline: [
      { week: 'Tjedan 1', phase: 'Strategija i planiranje', duration: '1 tjedan' },
      { week: 'Tjedan 2', phase: 'Kreacija i priprema', duration: '1 tjedan' },
      { week: 'Tjedan 3-4', phase: 'Implementacija i optimizacija', duration: '2 tjedna' },
    ],
    defaultLineItems: [
      { name: 'Marketing kampanja', description: '', price: 0 }
    ],
    defaultDuration: '4 tjedna'
  },

  social_media: {
    id: 'social_media',
    name: 'Social Media Management',
    nameHr: 'Upravljanje Društvenim Mrežama',
    icon: '📱',
    defaultScope: [
      {
        number: "1",
        title: "Strategija",
        items: ['Audit postojećih profila', 'Content strategija', 'Kalendar objava', 'Tonalitet i vizualni stil']
      },
      {
        number: "2",
        title: "Kreiranje sadržaja",
        items: ['Copywriting', 'Grafički dizajn', 'Video content', 'Stories i Reels']
      },
      {
        number: "3",
        title: "Community management",
        items: ['Odgovaranje na poruke', 'Moderacija komentara', 'Engagement aktivnosti']
      },
      {
        number: "4",
        title: "Analitika",
        items: ['Mjesečni izvještaji', 'Praćenje metrika', 'Optimizacija strategije']
      },
    ],
    defaultTimeline: [
      { week: 'Tjedan 1', phase: 'Onboarding i strategija', duration: '1 tjedan' },
      { week: 'Tjedan 2+', phase: 'Kontinuirano upravljanje', duration: 'Ongoing' },
    ],
    defaultLineItems: [
      { name: 'Social Media Management', description: 'Mjesečna usluga', price: 0 }
    ],
    defaultDuration: 'Mjesečna usluga'
  },

  branding: {
    id: 'branding',
    name: 'Branding',
    nameHr: 'Branding',
    icon: '🎨',
    defaultScope: [
      {
        number: "1",
        title: "Istraživanje",
        items: ['Brand discovery', 'Konkurentska analiza', 'Definiranje brand persone', 'Ciljana publika']
      },
      {
        number: "2",
        title: "Strategija",
        items: ['Brand positioning', 'Tone of voice', 'Brand values', 'Brand story']
      },
      {
        number: "3",
        title: "Vizualni identitet",
        items: ['Logo dizajn', 'Paleta boja', 'Tipografija', 'Ikonografija']
      },
      {
        number: "4",
        title: "Brand knjiga",
        items: ['Smjernice za korištenje', 'Primjeri primjene', 'Digital assets']
      },
    ],
    defaultTimeline: [
      { week: 'Tjedan 1', phase: 'Istraživanje i strategija', duration: '1 tjedan' },
      { week: 'Tjedan 2-3', phase: 'Dizajn vizualnog identiteta', duration: '2 tjedna' },
      { week: 'Tjedan 4', phase: 'Brand knjiga i finalizacija', duration: '1 tjedan' },
    ],
    defaultLineItems: [
      { name: 'Branding paket', description: '', price: 0 }
    ],
    defaultDuration: '4 tjedna'
  },

  agency_package: {
    id: 'agency_package',
    name: 'Agency Package',
    nameHr: 'Agencijski Paket',
    icon: '🚀',
    // Agency package uses combined scope from selected services
    defaultScope: [],
    defaultTimeline: [],
    defaultLineItems: [],
    defaultDuration: ''
  }
};

export const QUOTE_TYPES = {
  project: {
    id: 'project',
    name: 'Project',
    nameHr: 'Projekt',
    description: 'One-time project with deposit + final payment'
  },
  monthly: {
    id: 'monthly',
    name: 'Monthly',
    nameHr: 'Mjesečni',
    description: 'Recurring monthly billing'
  }
};

// Get service type by ID
export function getServiceType(id) {
  return SERVICE_TYPES[id] || SERVICE_TYPES.web_development;
}

// Get all service types as array
export function getAllServiceTypes() {
  return Object.values(SERVICE_TYPES);
}

// Get selectable service types for agency package (exclude agency_package itself)
export function getSelectableServiceTypes() {
  return Object.values(SERVICE_TYPES).filter(s => s.id !== 'agency_package');
}

// Combine multiple services for agency package
export function combineServicesForAgencyPackage(serviceIds) {
  const combinedScope = [];
  const combinedTimeline = [];
  const combinedLineItems = [];

  let scopeNumber = 1;
  let timelineWeek = 1;

  serviceIds.forEach(serviceId => {
    const service = SERVICE_TYPES[serviceId];
    if (!service || service.id === 'agency_package') return;

    // Add scope sections with updated numbers
    service.defaultScope.forEach(section => {
      combinedScope.push({
        ...section,
        number: String(scopeNumber),
        title: `${service.nameHr}: ${section.title}`
      });
      scopeNumber++;
    });

    // Add timeline phases
    service.defaultTimeline.forEach(phase => {
      combinedTimeline.push({
        ...phase,
        week: `Tjedan ${timelineWeek}`,
        phase: `${service.nameHr}: ${phase.phase}`
      });
      timelineWeek++;
    });

    // Add line items
    service.defaultLineItems.forEach(item => {
      combinedLineItems.push({
        ...item,
        name: `${service.nameHr}: ${item.name}`
      });
    });
  });

  return {
    scope: combinedScope,
    timeline: combinedTimeline,
    lineItems: combinedLineItems
  };
}

// Get service badge color
export function getServiceBadgeColor(serviceId) {
  const colors = {
    web_development: 'bg-blue-500',
    filming_video: 'bg-purple-500',
    marketing: 'bg-orange-500',
    social_media: 'bg-pink-500',
    branding: 'bg-yellow-500',
    agency_package: 'bg-gradient-to-r from-[#00FF94] to-[#00CC76]'
  };
  return colors[serviceId] || 'bg-gray-500';
}

// Get quote type badge color
export function getQuoteTypeBadgeColor(quoteType) {
  return quoteType === 'monthly' ? 'bg-purple-500' : 'bg-blue-500';
}
