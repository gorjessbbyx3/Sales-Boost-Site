# Edify Payment Processing - Landing Page

## Overview

This is a marketing/landing page website for **Edify Limited's Payment Processing** service. The site promotes a zero-fee payment processing terminal product ($500 one-time cost, no monthly or processing fees). Edify also offers free custom websites for businesses using their payment processor, premium website packages, and custom software solutions. It's built as a full-stack TypeScript application with a React frontend and Express backend, featuring an AI chatbot powered by Anthropic's Claude API and an admin config page. The site targets both standard and **high-risk merchants** (CBD, vape, firearms, nutraceuticals, etc.) and includes online-exclusive promo codes (FREETRIAL for 1 month free, SAVE200 for $300 start price).

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
- **Current Schema**: `users` table (id, username, password) and `ai_config` table (id, enabled, model, systemPrompt, welcomeMessage, maxTokens)
- **Connection**: Requires `DATABASE_URL` environment variable

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

### Key Design Decisions
1. **Monorepo structure** — Client, server, and shared code in one repo with path aliases for clean imports.
2. **In-memory storage as default** — The storage layer uses an interface pattern, making it easy to swap `MemStorage` for a `DatabaseStorage` class backed by Drizzle/PostgreSQL.
3. **Shared schema** — Database types and validation schemas are defined once in `shared/schema.ts` and used by both frontend and backend.
4. **shadcn/ui component library** — Components are copied into the project (not installed as a package), allowing full customization. Uses the "new-york" style variant.

## External Dependencies

- **PostgreSQL** — Required database (connection via `DATABASE_URL` env var)
- **Google Fonts** — Plus Jakarta Sans and Inter font families loaded via CDN
- **Replit Plugins** — `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner` for development experience on Replit
- **Radix UI** — Headless UI primitives powering shadcn/ui components
- **Anthropic Claude API** — Powers the AI chatbot (requires `ANTHROPIC_API_KEY` secret). Uses `@anthropic-ai/sdk` package.

### AI Chatbot System
- **Admin Config Page**: `/ai-config` — toggle agent on/off, select model, edit system prompt, set welcome message, configure max tokens
- **Chat Widget**: Floating chatbot bubble on landing page (only visible when AI is enabled via config)
- **API Routes**: `GET /api/ai-config`, `PATCH /api/ai-config`, `POST /api/chat`
- **Business Context**: The AI knows about Edify's payment processing, free websites (for payment processor customers only), premium website packages, and custom software solutions