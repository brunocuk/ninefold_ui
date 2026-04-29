# Ninefold Roadmap

*Our shared todo list. What we're building next.*

---

## 1. Blog CMS

**Goal:** Manage blog posts from the CRM instead of editing `content/blog.js`

**Status:** Not started

### Database
- [ ] Create `blog_posts` table in Supabase

### CRM Pages
- [ ] `/crm/blog` - List all posts (drafts & published)
- [ ] `/crm/blog/new` - Create new post
- [ ] `/crm/blog/[id]` - Edit existing post
- [ ] Add "Blog" to CRM sidebar navigation

### Editor Features
- [ ] Rich text editor (TipTap recommended)
- [ ] Image upload to Supabase Storage
- [ ] Auto-generate slug from title
- [ ] Preview before publishing

### Public Pages
- [ ] Update `/blog` to fetch from database
- [ ] Update `/blog/[slug]` for individual posts

### Migration
- [ ] Script to migrate `content/blog.js` to database

---

## 2. Portfolio CMS ✓ DONE

**Goal:** Showcase all types of work from the CRM

**Status:** Completed April 17, 2026

### What was built:
- [x] Database: `portfolio_projects` table with type-specific JSONB columns
- [x] CRM: `/crm/portfolio` - List with filters by project type
- [x] CRM: `/crm/portfolio/new` - Create form with 8 tabbed sections
- [x] CRM: `/crm/portfolio/[id]` - View/edit detail page
- [x] 5 project types: video_production, social_media, web_development, web_app, mobile_app
- [x] Type-specific displays (video embeds, platform metrics, app store buttons)
- [x] Migration script moved all 8 existing projects to database
- [x] Public `/work` page fetches from Supabase

---

## 3. Client Portal ✓ DONE (Testing Phase)

**Goal:** Give clients a portal to view projects, approve content, submit requests, communicate

**Status:** Built, needs testing and potential style updates

### Database ✓
- [x] `portal_users` - Client login credentials
- [x] `content_items` - Social media content for approval
- [x] `website_change_requests` - Client-submitted requests
- [x] `portal_messages` - Communication thread
- [x] `project_milestones` - Project progress tracking

### Portal Pages ✓
- [x] `/portal/login` - Dark split design, casual copy
- [x] `/portal` - Dashboard with stats, content preview, messages, CTA
- [x] `/portal/content` - Content calendar view
- [x] `/portal/content/[id]` - Content detail with approve/revision
- [x] `/portal/projects` - Projects list
- [x] `/portal/projects/[id]` - Project detail with milestones
- [x] `/portal/requests` - Change requests list
- [x] `/portal/requests/new` - Submit new request
- [x] `/portal/reports` - View reports
- [x] `/portal/invoices` - Quotes and payment history
- [x] `/portal/messages` - Communication thread

### API Routes ✓
- [x] `/api/portal/auth` - Login/logout
- [x] `/api/portal/content/[id]/approve` - Approve content
- [x] `/api/portal/content/[id]/revision` - Request revision
- [x] `/api/portal/requests` - Submit requests
- [x] `/api/portal/messages` - Send messages

### CRM Integration ✓
- [x] `/crm/content` - Manage content for clients
- [x] `/crm/content/new` - Create new content
- [x] `/crm/change-requests` - View/manage client requests
- [x] Portal access section on client detail page

### Features ✓
- [x] Light/dark theme with system preference detection
- [x] Theme toggle button
- [x] Dark sidebar, light content area
- [x] Responsive design

### Still To Do
- [ ] Test all portal pages thoroughly
- [ ] Update other portal pages to match dashboard design
- [ ] Email notifications (optional, can add later)

---

## Notes

*Add notes here as we work through these...*

- April 10, 2025: Created this roadmap. Starting with planning phase.
- April 17, 2026: Portfolio CMS completed. All 8 projects migrated to database.
- April 17, 2026: Website copy overhaul - rewrote all copy to match authentic brand voice.
- April 29, 2026: Client Portal built - all pages, API routes, CRM integration complete. Dashboard redesigned with light/dark theme support.
