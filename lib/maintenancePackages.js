// lib/maintenancePackages.js
// Default tiers for recurring maintenance quotes (quote_type 'monthly' + quote_data.maintenance)
// Used by /crm/quotes/maintenance/new. Everything is editable per quote in the builder.

export const MAINTENANCE_QUOTE_DEFAULTS = {
  hourlyRate: 40,
  recommendedTier: 'standard',
  tiers: [
    {
      id: 'osnovni',
      name: 'Osnovni',
      hours: '3',
      hoursLabel: '3 sata rada mjesečno',
      price: 160,
      tagline: 'Za stranice i shopove kojima je najvažnija stabilnost',
      features: [
        'Do 3 sata rada mjesečno na izmjenama',
        'Sve nadogradnje uz backup prije svake izmjene',
        'Nadzor dostupnosti stranice',
        'Odgovor na upite unutar 48h radnim danom'
      ]
    },
    {
      id: 'standard',
      name: 'Standard',
      hours: '5',
      hoursLabel: '5 sati rada mjesečno',
      price: 240,
      tagline: 'Za stranice koje se redovito mijenjaju i rastu',
      features: [
        'Do 5 sati rada mjesečno na izmjenama',
        'Sve nadogradnje uz backup prije svake izmjene',
        'Nadzor dostupnosti stranice i integracija',
        'Prioritetna podrška, odgovor unutar 24h',
        'Optimizacija brzine po potrebi'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      hours: '10+',
      hoursLabel: '10 i više sati rada mjesečno',
      price: 420,
      tagline: 'Za aktivne stranice u stalnom razvoju',
      features: [
        'Minimalno 10 sati rada mjesečno na izmjenama',
        'Sve nadogradnje uz backup prije svake izmjene',
        'Nadzor dostupnosti stranice i integracija',
        'Prioritetna podrška, odgovor isti radni dan',
        'Mjesečni poziv i plan izmjena za sljedeći mjesec',
        'Savjetovanje oko novih funkcionalnosti'
      ]
    }
  ],
  includedInAll: [
    'Redovite nadogradnje sustava i svih dodataka',
    'Puni backup stranice i baze prije svake izmjene',
    'Nadzor dostupnosti stranice',
    'Mjesečni izvještaj o svemu napravljenom',
    'Podrška putem emaila i telefona'
  ],
  notIncluded: [
    'Veće izmjene i nove funkcionalnosti izvan uključenih sati (po satnici, uz procjenu i odobrenje unaprijed)',
    'Troškovi hostinga, domene i licenci trećih strana',
    'Izrada novog dizajna ili redizajn stranice'
  ]
};

// Normalize a tiers config coming from quote_data, with safe fallbacks
export function getTierById(maintenanceConfig, tierId) {
  return maintenanceConfig?.tiers?.find(t => t.id === tierId) || null;
}
