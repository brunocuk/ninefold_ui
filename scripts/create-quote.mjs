#!/usr/bin/env node
// scripts/create-quote.mjs
// CLI tool for creating quotes programmatically
// Usage: node scripts/create-quote.mjs

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Service type templates
const SERVICE_TEMPLATES = {
  web_development: {
    icon: '💻',
    nameHr: 'Web / App Razvoj',
    defaultDuration: '8 tjedana'
  },
  mobile_app: {
    icon: '📱',
    nameHr: 'Mobilna Aplikacija',
    defaultDuration: '10 tjedana'
  },
  filming_video: {
    icon: '🎬',
    nameHr: 'Video Produkcija',
    defaultDuration: '4 tjedna'
  },
  social_media: {
    icon: '📱',
    nameHr: 'Social Media Management',
    defaultDuration: 'Mjesečna usluga'
  },
  branding: {
    icon: '🎨',
    nameHr: 'Branding',
    defaultDuration: '4 tjedna'
  },
  marketing: {
    icon: '📊',
    nameHr: 'Marketing',
    defaultDuration: '4 tjedna'
  }
};

async function createQuote(quoteInput) {
  const {
    clientName,
    clientEmail = '',
    title = null,
    projectOverview,
    serviceType = 'web_development',
    quoteType = 'project', // 'project' or 'monthly'
    items = [], // [{ name: 'Website', description: '', price: 2000 }]
    monthlyPrice = null,
    discountRate = 0.20,
    depositRate = 0.50,
    duration = null,
    scope = [],
    timeline = [],
    maintenanceEnabled = false,
    maintenancePrice = 150
  } = quoteInput;

  // Generate reference
  const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const clientPrefix = clientName.substring(0, 3).toUpperCase();
  const reference = `NF-${dateStr}-${clientPrefix}`;

  // Calculate pricing
  const subtotal = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const discountAmount = subtotal * discountRate;
  const total = subtotal - discountAmount;

  const isMonthly = quoteType === 'monthly';

  const quoteData = {
    service_type: serviceType,
    quote_type: quoteType,
    monthly_price: isMonthly ? monthlyPrice : null,

    title: title,
    client_name: clientName,
    client_email: clientEmail,
    project_overview: projectOverview,
    duration: duration || SERVICE_TEMPLATES[serviceType]?.defaultDuration || '',
    scope: scope,
    timeline: isMonthly ? [] : timeline,

    reference: reference,
    quote_number: reference,
    status: 'draft',

    quote_data: {
      clientName: clientName,
      clientEmail: clientEmail,
      reference: reference,
      date: new Date().toLocaleDateString('hr-HR'),
      duration: duration || SERVICE_TEMPLATES[serviceType]?.defaultDuration || '',
      projectOverview: projectOverview,
      objectives: [],
      paymentLink: '',
      scope: scope,
      timeline: isMonthly ? [] : timeline,
    },

    pricing: isMonthly ? {
      monthlyPrice: monthlyPrice,
      items: items,
      total: monthlyPrice,
    } : {
      items: items,
      subtotal: subtotal,
      discountRate: discountRate,
      discountAmount: discountAmount,
      total: total,
      depositRate: depositRate,
      maintenance: maintenanceEnabled ? {
        enabled: true,
        price: maintenancePrice,
        description: 'Monthly maintenance including security updates, backups, and support.'
      } : null,
    },

    view_count: 0,
    last_viewed_at: null
  };

  const { data, error } = await supabase
    .from('quotes')
    .insert([quoteData])
    .select();

  if (error) {
    throw error;
  }

  return data[0];
}

// Export for use as module
export { createQuote };

// If run directly, check for quote data passed as argument
const args = process.argv.slice(2);

if (args.length > 0 && args[0] === '--json') {
  // Read JSON from stdin
  let jsonInput = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk) => {
    jsonInput += chunk;
  });
  process.stdin.on('end', async () => {
    try {
      const quoteInput = JSON.parse(jsonInput);
      const quote = await createQuote(quoteInput);
      console.log('\n✅ Quote created successfully!\n');
      console.log(`📋 Reference: ${quote.reference}`);
      console.log(`👤 Client: ${quote.client_name}`);
      console.log(`💰 Total: €${quote.pricing?.total?.toLocaleString() || quote.pricing?.monthlyPrice?.toLocaleString() + '/mo'}`);
      console.log(`🔗 Preview: ${process.env.NEXT_PUBLIC_APP_URL}/quote/${quote.id}`);
      console.log(`📝 Edit: ${process.env.NEXT_PUBLIC_APP_URL}/crm/quotes/${quote.id}`);
      console.log('\n');
    } catch (err) {
      console.error('❌ Error creating quote:', err.message);
      process.exit(1);
    }
  });
} else if (args.length > 0) {
  // Direct JSON argument
  try {
    const quoteInput = JSON.parse(args[0]);
    createQuote(quoteInput).then(quote => {
      console.log('\n✅ Quote created successfully!\n');
      console.log(`📋 Reference: ${quote.reference}`);
      console.log(`👤 Client: ${quote.client_name}`);
      console.log(`💰 Total: €${quote.pricing?.total?.toLocaleString() || quote.pricing?.monthlyPrice?.toLocaleString() + '/mo'}`);
      console.log(`🔗 Preview: ${process.env.NEXT_PUBLIC_APP_URL}/quote/${quote.id}`);
      console.log(`📝 Edit: ${process.env.NEXT_PUBLIC_APP_URL}/crm/quotes/${quote.id}`);
      console.log('\n');
    }).catch(err => {
      console.error('❌ Error creating quote:', err.message);
      process.exit(1);
    });
  } catch (err) {
    console.error('❌ Invalid JSON:', err.message);
    process.exit(1);
  }
} else {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                  NINEFOLD QUOTE CREATOR                       ║
╠══════════════════════════════════════════════════════════════╣
║  Usage:                                                       ║
║    node scripts/create-quote.mjs '<JSON>'                     ║
║                                                               ║
║  Or pipe JSON:                                                ║
║    echo '{"clientName":"Test"}' | node scripts/create-quote.mjs --json ║
║                                                               ║
║  Required fields:                                             ║
║    - clientName                                               ║
║    - projectOverview                                          ║
║    - items (for project) or monthlyPrice (for monthly)        ║
║                                                               ║
║  Service types:                                               ║
║    web_development, mobile_app, filming_video,                ║
║    social_media, branding, marketing                          ║
╚══════════════════════════════════════════════════════════════╝
  `);
}
