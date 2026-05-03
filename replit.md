# λechSavvy Payment Processing - Landing Page

## Overview

This is a marketing/landing page website for **λechSavvy's Payment Processing** service. The site promotes a zero-fee payment processing terminal with two pricing options: **Option 1** outright purchase at $399 ("Best Value") and **Option 2** 30-day risk-free trial with $599 purchase after trial ("No Commitment"). λechSavvy also offers free custom websites for businesses using their payment processor, premium website packages, and custom software solutions. It's built as a full-stack TypeScript application with a React frontend and Express backend, featuring an AI chatbot powered by Anthropic's Claude API and an admin config page. The site targets both standard and **high-risk merchants** (CBD, vape, firearms, nutraceuticals, etc.). Qualifications: minimum $5K-$10K monthly volume, 1-page trial agreement, only 4 trial spots per month.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side router)
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support)
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives, stored in `client/src/components/ui/`
- **Animations**: Framer Motion for scroll-based animations and transitions
- **Data Fetching**: TanStack React Query (though currently minimal API usage)
- **Fonts**: Plus Jakarta Sans and Inter (loaded from Google Fonts)
- **Build Tool**: Vite with React plugin
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend
- **Framework**: Express 5 on Node.js
- **Language**: TypeScript, executed via `tsx`
- **API Prefix**: All API routes should use `/api` prefix
- **Storage Pattern**: Interface-based storage (`IStorage`) with an in-memory implementation (`MemStorage`). This can be swapped to a database-backed implementation.
- **Build**: esbuild bundles server code to `dist/index.cjs` for production

### Database
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema Location**: `shared/schema.ts` — shared between frontend and backend
- **Schema Validation**: drizzle-zod generates Zod schemas from Drizzle table definitions
- **Migrations**: Output to `./migrations` directory
- **Push Command**: `npm run db:push` to sync schema to database
- **Current Schema**: `users`, `ai_config`, `clients` (extended with activeServices, onboardingStatus, nextBillingDate, domainName, hostingProvider, credentials, clientAssets as JSON text fields), `projects` (delivery tracker with milestones JSON, type, status pipeline, client linking), `leads`, `deals`, `tasks`, `files`, `equipment`, `partners`
- **Connection**: Requires `DATABASE_URL` environment variable
- **D1 Migrations**: The admin app's Cloudflare D1 database (`savvy-admin`) is migrated by `.github/workflows/deploy.yml`, which runs `script/reconcile-d1-migrations.mjs` *before* `wrangler d1 migrations apply`. The reconciler auto-stamps the `d1_migrations` ledger for any pending file whose schema work is already in the live DB, so we never have to hand-edit production again when the ledger drifts. New `.sql` files should use `CREATE TABLE/INDEX IF NOT EXISTS` and `INSERT OR IGNORE` / `ON CONFLICT DO NOTHING` (D1 supports those). D1 does **not** support `ADD COLUMN IF NOT EXISTS` — that's exactly what the reconciler exists to handle. Those rules are enforced in CI by `script/lint-migrations.mjs` (run via `.github/workflows/lint-migrations.yml` on PRs/pushes that touch `migrations/**`); the lint exits non-zero on bare `CREATE TABLE` / `CREATE INDEX` or plain `INSERT` seed data, and warns (non-fatally) on `ADD COLUMN IF NOT EXISTS`. Full runbook: `migrations/README.md`.

### Project Structure
```
client/           → React frontend (Vite)
  src/
    components/ui/  → shadcn/ui components
    pages/          → Route page components
    hooks/          → Custom React hooks
    lib/            → Utilities (queryClient, cn helper)
server/           → Express backend
  index.ts        → Server entry point
  routes.ts       → API route registration
  storage.ts      → Data access layer (interface + in-memory impl)
  vite.ts         → Vite dev server middleware
  static.ts       → Production static file serving
shared/           → Code shared between client and server
  schema.ts       → Drizzle database schema + Zod types
script/           → Build scripts
  build.ts        → Production build (Vite + esbuild)
```

### Development vs Production
- **Development**: `npm run dev` runs the Express server with Vite middleware for HMR. The Vite dev server handles frontend assets and hot module replacement.
- **Production**: `npm run build` builds the React app with Vite (output to `dist/public/`) and bundles the server with esbuild (output to `dist/index.cjs`). `npm start` runs the production bundle.

### Page Structure (Feb 2026)
- **/** — Home page: Hero (video background), two product cards (terminal + online), How It Works, Pricing Preview, CTA
- **/pricing** — Detailed pricing comparison
- **/services** — Services overview (zero-fee processing, online package, high-risk, same-day setup)
- **/faq** — FAQ accordion, "Will My Customers Accept This?" psychology section, customer reviews/testimonials
- **/online-processing** — Online payment gateway, website portfolio by industry, case study
- **/high-risk** — High-risk merchant solutions (industries served, why choose us)
- **/contact** — Schedule a Call form with phone/email sidebar
- **/connect** — Connect with TechSavvy page: embedded AI chat, schedule a call form, online presence services showcase
- **/how-it-works** — Dedicated How It Works detail page (also integrated into home)
- **/our-work** — Web design portfolio detail page
- **/ai-config** — Admin AI chatbot configuration

### Key Design Decisions
1. **Monorepo structure** — Client, server, and shared code in one repo with path aliases for clean imports.
2. **In-memory storage as default** — The storage layer uses an interface pattern, making it easy to swap `MemStorage` for a `DatabaseStorage` class backed by Drizzle/PostgreSQL.
3. **Shared schema** — Database types and validation schemas are defined once in `shared/schema.ts` and used by both frontend and backend.
4. **shadcn/ui component library** — Components are copied into the project (not installed as a package), allowing full customization. Uses the "new-york" style variant.
5. **Vite async config** — `vite.config.ts` uses an async factory function; `server/vite.ts` resolves it before spreading into `createViteServer`.

## External Dependencies

- **PostgreSQL** — Required database (connection via `DATABASE_URL` env var)
- **Google Fonts** — Plus Jakarta Sans and Inter font families loaded via CDN
- **Replit Plugins** — `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner` for development experience on Replit
- **Radix UI** — Headless UI primitives powering shadcn/ui components
- **Anthropic Claude API** — Powers the AI chatbot (requires `ANTHROPIC_API_KEY` secret). Uses `@anthropic-ai/sdk` package.

### Admin Dashboard (subdomain: admin.*)
- **Tabs**: Overview, Tasks, Pipeline (Leads), Follow-Up, Deals, Clients, Projects, Inbox, Playbooks, Analytics, 90-Day Plan, Finances, Autopilot, AI Tools, Marketing Studio, Files, Equipment, Partners, Settings
- **Client Management**: 4-tab form (Details, Services, Credentials, Assets & Info) with active services tracking, onboarding status, domain/hosting info, stored login credentials, and client assets/reference data
- **Project Delivery Tracker**: Milestone-based project tracking with status pipeline (not-started → discovery → in-progress → review → revision → launched → complete), project types (website, crm, branding, ads, email, social, payments, custom), client linking, assignee management
- **Pipeline Stages**: new → contacted → qualified → discovery-call → statement-requested → statement-received → analysis-delivered → proposal-sent → negotiation → won/lost/nurture
- **Frontend types**: `client/src/pages/admin/types.ts`, constants: `client/src/pages/admin/constants.ts`

### AI Chatbot System
- **Admin Config Page**: `/ai-config` — toggle agent on/off, select model, edit system prompt, set welcome message, configure max tokens
- **Chat Widget**: Floating chatbot bubble on landing page (only visible when AI is enabled via config)
- **API Routes**: `GET /api/ai-config`, `PATCH /api/ai-config`, `POST /api/chat`
- **Business Context**: The AI knows about λechSavvy's payment processing, free websites (for payment processor customers only), premium website packages, and custom software solutions
### Email Inbox: Attachments, Forward, Sign (Apr 2026)
- Inbound Cloudflare email worker (`worker/email-worker/`, `tight-fog-5031`) extracts ALL attachment types via PostalMime, uploads each to R2 `FILES_BUCKET` (`techsavvy-assets`), and writes an `email_attachments` row. Inbound is capped at 25MB/file, 50MB/email, 20 attachments, with executable extensions (exe/bat/scr/etc) blocked.
- D1 schema additions in `migrations/0023_email_attachments.sql`: `email_attachments` table + `clients.client_assets` JSON column.
- Pages Function (`functions/api/[[route]].ts`) endpoints (all admin + per-mailbox ACL):
  - `GET /api/email/attachments/:id/download` — auth-gated proxy stream from R2 (never exposes raw R2 URL to the browser; use `?dl=1` to force download).
  - `POST /api/email/messages/:id/forward` — forwards via Resend with optional original attachments.
  - `POST /api/email/attachments/:id/save-to-files` — copies into `admin_files`.
  - `POST /api/email/attachments/:id/save-to-client/:clientId` — appends to `clients.client_assets`.
  - `POST /api/email/attachments/:id/sign` — accepts a signed PDF (base64), uploads to R2, registers as new attachment + admin file in "Signed Documents".
- Frontend (`client/src/components/inbox/EmailAttachments.tsx`) renders chips with view/download/save-to-files/save-to-client/sign actions and a Forward dialog. Client-side PDF signing uses `pdf-lib` + a signature canvas pad.
- All auth-gated attachment endpoints go through `authorizeAttachment()` which joins to the thread and enforces the same per-mailbox account ACL used by `GET /api/email/threads/:id`.
- DEPLOY NOTE: both the main admin worker (`mojo-luna-955c`, via `wrangler-workers.toml`) and the email worker (`tight-fog-5031`, via `worker/email-worker/wrangler.toml`) deploy automatically from `.github/workflows/deploy.yml` on every push to `main`. No manual `wrangler deploy` step is needed for either worker.
- QA NOTE: the email worker exposes two `WORKER_KEY`-gated test endpoints — `POST /test-inbound` (inject a synthetic inbound email + attachments through the same `persistInbound()` code path used by live mail; never forwards, never auto-replies) and `POST /test-cleanup` (deletes only `source = email_inbound_test` rows + their R2 objects). End-to-end QA driver lives at `script/qa-email-attachments.mjs`; full procedure (scripted + real-SMTP fallback) is in `script/QA_EMAIL_ATTACHMENTS.md`. Run after any change to `worker/email-worker/index.js`, the `/api/email/...` handlers in `functions/api/[[route]].ts`, or `migrations/0023_email_attachments.sql`.

### Cmd-K Palette + Send Later + AI Statement Review + Merge Tags (May 2026)
- D1 schema additions in `migrations/0026_scheduled_drafts.sql`: `email_drafts.scheduled_for` + `scheduled_status` with composite index. Mirrored in `shared/schema.ts`.
- **Send Later**: composer footer has a `Send Later` button that opens a datetime picker dialog. `POST /api/email/schedule` (session-gated) writes a pending row in `email_drafts`. The email worker (`worker/email-worker/index.js`) registers a `scheduled()` handler that runs every minute (per `worker/email-worker/wrangler.toml` `triggers.crons = ["* * * * *"]`) and POSTs to the new `POST /api/email/flush-scheduled` endpoint with `X-Worker-Key` (matched against `env.WORKER_KEY`). Flush picks up due rows, marks them `sending` to avoid double-send, calls Resend, and on success creates the matching `email_threads` + `email_messages` rows and flips the draft to `sent`. New **Scheduled** folder in the inbox sidebar lists pending sends; the X button cancels.
- **AI Statement Review**: composer footer has an `AI Statement Review` button opening a dialog that takes a business/contact name plus PDF upload OR pasted text. `POST /api/ai/statement-review` (session-gated) calls Anthropic `claude-sonnet-4-20250514` with the document/text and returns an HTML body that drops straight into the composer (subject auto-fills if empty).
- **Cmd-K Command Palette**: `client/src/components/CommandPalette.tsx` (cmdk-based) wired into `AdminPage` with a global `Cmd/Ctrl+K` listener. `GET /api/search/global?q=…` (session-gated, ACL-aware for inbox threads) searches leads, clients, threads, and tasks; falls back to a "Go to" page list for navigation when there's no query.
- **Email template merge tags**: `mergeCtxFor(email)` looks up a lead by recipient address and substitutes `{{name}}`, `{{firstName}}`, `{{business}}`, `{{vertical}}` in both the compose-dialog template loader and the templates manager "Use" button. Falls back to email local-part for the name when no matching lead exists.
- **Production setup notes**: D1 — apply migration with `npx wrangler d1 execute savvy-admin --remote --file=migrations/0026_scheduled_drafts.sql`. Worker — `wrangler deploy` will pick up the new cron trigger; ensure `WORKER_KEY` is set on both the Pages app and the worker (matching value), and `INTERNAL_API_URL` defaults to `https://admin.techsavvyhawaii.com` in `wrangler.toml`.

### Outlook-Grade Inbox Upgrade (Apr 2026)
- D1 schema additions in `migrations/0025_cc_bcc_drafts.sql`: `email_messages.cc_emails` + `bcc_emails`, `email_drafts` table, `email_signatures` table. Mirrored in `shared/schema.ts`.
- Inbound email worker (`worker/email-worker/index.js`) now extracts CC recipients via PostalMime and writes to `email_messages.cc_emails` (with a graceful fallback if the column is missing on legacy DBs).
- `functions/api/[[route]].ts`:
  - `POST /api/email/send` accepts `cc[]` / `bcc[]` arrays, forwards them to Resend, and persists to `email_messages.cc_emails` / `bcc_emails`.
  - `GET/POST/PATCH/DELETE /api/email/drafts` — full server-side draft CRUD scoped to the session user.
  - `GET /api/email/search?q=…` — server-side search across subject, body, contact, sender, recipient, and CC, honoring per-mailbox ACL.
  - `POST /api/email/threads/:id/auto-draft` — Anthropic-powered AI draft generator that drafts a reply for the latest inbound message (writes to `email_drafts` + returns body for inline use).
  - `mapMessage()` now returns `ccEmails` / `bccEmails` so the read view can render CC chips.
- Inbox UI (`client/src/pages/ai-config.tsx`):
  - **Composer**: TipTap rich text editor (`client/src/components/inbox/RichTextEditor.tsx`), collapsible Cc/Bcc fields, multi-file attachment upload (base64, capped at 20 MB/file), 2-second debounced draft auto-save with status indicator.
  - **Reply box**: same TipTap editor + Cc/Bcc + attachments. Adds **Reply All** button that seeds Cc with the original CC list (minus the active sender). Adds **AI Draft** button that calls the Anthropic endpoint and pre-fills the reply body for editing before send.
  - **Read view**: each message shows inline Cc chips when the message had CC recipients.
  - **Sidebar**: new **Drafts** folder with live count from the drafts query; clicking a draft restores it into the composer.
  - **Search bar**: debounced (300 ms) inbox-wide search field above the folder layout, with a clear button.
  - **Email Settings dialog**: new **Email Addresses** panel for adding/editing/deleting sender addresses, picking color, and setting display name (multi-address-per-user is enforced server-side via `email_accounts.owner_id`; the UI now lets admins manage the assignments).
- TipTap deps: `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-placeholder`, `@tiptap/extension-underline`.
- Architectural note: rejected the `cloudflare/agentic-inbox` Hono + Durable Objects + Workers AI stack; only the TipTap composer pattern + auto-draft idea were lifted. Anthropic powers all AI here for parity with the rest of the platform.

### Pipeline ↔ Outreach Map Sync + Lead Enrichment (Apr 2026)
- D1 schema additions in `migrations/0024_lead_outreach_sync.sql`: `leads.outreach_business_id` (INTEGER) and `outreach_businesses.lead_id` (TEXT) with indexes.
- Bidirectional sync helpers in `functions/api/[[route]].ts` (`syncLeadToOutreach` / `syncOutreachToLead`):
  - Pipeline lead → outreach map mirror runs on POST/PATCH `/api/leads` and POST `/api/leads/public`. Only sources `direct`, `contact-form`, `lead-magnet`, `outreach`, `outreach-reply` are mirrored — partner referrals and statement reviews stay pipeline-only.
  - Outreach business → pipeline lead mirror runs on POST/PATCH `/api/outreach-businesses` (new lead's source = `outreach`).
  - DELETE on either side unlinks (sets the FK to NULL) instead of cascading — the counterpart row is preserved.
  - Address edits invalidate the geocode (`geocoded=0, lat=NULL, lng=NULL`) so the geocoder will re-resolve.
- Backfill endpoint `POST /api/admin/sync-leads-outreach` (admin-gated) walks orphan rows in both tables and creates the missing cross-links.
- Enrichment endpoints (admin-gated, Anthropic web search tool `web_search_20250305` + Nominatim):
  - `POST /api/leads/:id/enrich` — single-lead enrichment. Always applied to empty fields only; if address fills, the linked outreach business is re-geocoded.
  - `POST /api/admin/enrich-incomplete-leads` (body `{ limit: 1-10 }`, default 5) — bulk. Only auto-applies HIGH-confidence updates to empty fields; medium/low surface as suggestions in the response.
- UI in `client/src/pages/ai-config.tsx` LeadsTab: per-row purple Sparkles button on incomplete leads (Enrich), and toolbar buttons `Bulk Enrich (N)` + `Sync Map`.
