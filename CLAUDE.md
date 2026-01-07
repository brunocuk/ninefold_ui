# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ninefold is a full-stack Next.js application combining:
- **Marketing Website**: Public-facing web agency site with portfolio, blog, and services
- **CRM System**: Internal admin dashboard for managing clients, leads, quotes, projects, and recurring contracts
- **Quote Management**: Client-facing quote previews with PDF generation and Revolut payment integration

## Tech Stack

- **Framework**: Next.js 16.0.8 (App Router) + React 19.2.0
- **Database**: Supabase (PostgreSQL)
- **Styling**: TailwindCSS 3.4.18 with custom accent color `#00FF94` (electric green)
- **Payments**: Revolut Merchant API
- **Email**: Resend + React Email templates
- **PDF Generation**: Puppeteer (local) / @sparticuz/chromium (Vercel)
- **Animations**: Framer Motion, GSAP, Lenis smooth scrolling
- **Calendar**: react-big-calendar + moment
- **3D Graphics**: Three.js + React Three Fiber

## Development Commands

```bash
# Start development server (runs on localhost:3000)
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run ESLint
npm run lint
```

## Project Structure

```
app/
├── (crm-admin)/              # Route group: CRM admin section
│   ├── layout.jsx            # CRM layout with sidebar navigation
│   └── crm/
│       ├── page.jsx          # Dashboard with stats overview
│       ├── analytics/        # Analytics charts and metrics
│       ├── calendar/         # Scheduling system
│       ├── clients/          # Client CRUD (list, create, detail)
│       ├── leads/            # Lead tracking
│       ├── quotes/           # Quote management
│       ├── projects/         # Project management
│       └── recurring/        # Recurring contracts
├── (quote-preview)/          # Route group: Public quote preview
│   └── quote/[id]/           # Client-facing quote page
├── api/
│   ├── quotes/[id]/
│   │   ├── pdf/route.js              # PDF generation (Puppeteer)
│   │   ├── send/route.js             # Send quote via email (Resend)
│   │   └── create-payment-link/      # Revolut payment link creation
│   └── webhooks/
│       └── revolut/route.js          # Payment webhook handler (HMAC verification)
├── services/                 # Service landing pages (web dev, design, etc.)
├── blog/                     # Blog system
├── work/                     # Portfolio pages
└── layout.jsx                # Root layout (Header, Footer)

components/
├── sections/                 # Homepage sections (modular design)
│   ├── HeroSection.jsx
│   ├── FeaturesSection.jsx
│   ├── ProcessSection.jsx
│   └── [etc.]
├── Header.jsx
├── Footer.jsx
└── [UI components]

lib/
├── supabase.js              # Supabase client (anon key)
├── auth.js                  # Auth functions (REST API approach, localStorage)
└── useScrollAnimation.js    # Scroll animation hook

emails/                       # React Email templates
├── QuoteEmail.jsx
└── PaymentConfirmationEmail.jsx

content/
├── projects.js              # Portfolio projects data (890 lines)
└── blog.js                  # Blog posts data (1238 lines)
```

## Database Schema (Supabase)

Tables referenced in the codebase:
- `leads` - Lead tracking (status field)
- `clients` - Client management (status, lifetime_value fields)
- `quotes` - Quote management (client_name, reference, pricing, status, project_overview, revolut_order_id)
- `projects` - Project tracking (status, total_value, created_at)
- `recurring_contracts` - Recurring billing

## Key Architecture Patterns

### Route Groups
Uses Next.js route groups `(crm-admin)` and `(quote-preview)` for logical organization without affecting URLs.

### Authentication
- Custom REST-based auth in `lib/auth.js` using Supabase Auth API
- Session stored in `localStorage` (client-side only)
- Functions: `signIn()`, `signUp()`, `signOut()`, `getUser()`, `isAuthenticated()`
- **Important**: `getUser()` is client-side only (checks `window` existence)

### Supabase Client Usage
- **Public routes**: Use `lib/supabase.js` (anon key)
- **API routes**: Initialize with `createClient()` directly
  - Webhooks use `SUPABASE_SERVICE_ROLE_KEY` for elevated permissions
  - Other API routes use `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### PDF Generation
- **Local dev**: Uses `puppeteer` package
- **Production (Vercel)**: Uses `puppeteer-core` + `@sparticuz/chromium`
- Logic in `app/api/quotes/[id]/pdf/route.js` checks `process.env.VERCEL`
- Renders quote preview page to PDF via headless browser

### Payment Integration
- **Flow**: Create Revolut order → Generate payment link → Client pays → Webhook updates quote status
- **Webhook verification**: HMAC SHA256 signature validation (see `app/api/webhooks/revolut/route.js`)
- **Events handled**: `ORDER_COMPLETED`, `ORDER_AUTHORISED`, `ORDER_CANCELLED`, `ORDER_PAYMENT_DECLINED`, `ORDER_FAILED`
- Deposit calculation: 50% of quote pricing

### Email System
- React Email components in `emails/` directory
- Rendered to HTML using `@react-email/render`
- Sent via Resend API
- Quote emails include project overview and pricing

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_APP_URL
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
REVOLUT_MERCHANT_SECRET_KEY
REVOLUT_WEBHOOK_SECRET
REVOLUT_API_VERSION
```

## Styling Conventions

- **Accent color**: Electric green (`#00FF94`, `#00CC75`, `#33FFAA`)
- **Font**: Nohemi (custom font in `public/fonts/`)
- **Animations**:
  - `animate-float` - Floating effect (6s ease-in-out)
  - `animate-glow` - Glow effect for accent elements
- **Dark theme**: Pure black background with electric green accents

## Testing Quote System Locally

1. Create a quote in CRM (`/crm/quotes/new`)
2. Preview quote at `/quote/{id}`
3. Test PDF generation: `GET /api/quotes/{id}/pdf`
4. Test email sending: `POST /api/quotes/{id}/send`
5. Test payment link: `POST /api/quotes/{id}/create-payment-link`

## Important Code Patterns

### Client vs Server Components
- CRM admin pages are client components (`'use client'`) for interactivity
- Use `typeof window !== 'undefined'` checks for browser-only code
- Auth functions check window existence before accessing localStorage

### Supabase Queries
Standard pattern:
```javascript
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('field', value)
  .single();
```

### Error Handling
- API routes return appropriate HTTP status codes (404, 401, 500)
- UI displays error messages in red with error state handling
- Console logging in webhooks for debugging payment flows

### Content Management
- Blog posts and portfolio projects stored as JavaScript objects in `content/` directory
- No CMS - content is code-based for simplicity
- Images referenced from `public/images/`

## Common Gotchas

1. **Puppeteer in production**: Ensure `serverExternalPackages` is set in `next.config.mjs`
2. **Auth on server**: `getUser()` only works client-side - returns null on server
3. **Service role key**: Only use in API routes, never expose to client
4. **Webhook signatures**: Must verify HMAC SHA256 before processing Revolut webhooks
5. **Route groups**: Parentheses in folder names don't appear in URLs
