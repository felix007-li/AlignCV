## Project Overview

**AlignCV**  is a multi-tenant resume builder with AI-powered suggestions, template management, and Stripe payment integration. Built with Angular 17+ frontend and Node/Express backend, featuring MDX-based SEO content pipeline and multi-locale support.

## Architecture

### Frontend (Angular 17+)
- **Framework**: Angular standalone components, Tailwind CSS
- **State Management**: NGXS with slices for `auth`, `resume`, `jd`, `checkout`, `ui`
- **i18n**: Multi-locale support (`en`, `es-MX`, `es-AR`, `es-CL`, `pt-BR`, `fr-CA`)
- **Key Routes**:
  - `/app/resume/:id/editor` - Resume editor interface
  - `/app/cover-letter/:id/editor` - Cover letter editor
  - `/pricing` - Pricing page with A/B testing
  - `/l/:locale/:kind/:sub/:slug` - SEO content pages

**Core Components**:
- `LeftEditor` (`src/app/ui/left-editor/`) - Section-based editing with AI suggestions
- `PreviewPane` (`src/app/ui/preview-pane/`) - Real-time A4/Letter preview with token-based styling
- `StylePanel` (`src/app/ui/style-panel/`) - Single-line toolbar (Templates/Font/Size/LineHeight/Palette)
- `paywall-modal` (`src/app/components/paywall-modal/`) - Pricing modal with A/B variants

### Backend (Node/Express)
- Simple Express server with Stripe integration
- Routes: `/api/stripe/create-checkout-session`, `/api/stripe/webhook`
- Planned services: AI suggestions, JD parsing, resume import (see docs/backend/10-backend-architecture.md)

### NGXS State Pattern
State slices defined in `docs/frontend/03-frontend-ngxs-state.md`:
- `AuthState` - User authentication and plan status
- `ResumeEditorState` - Current resume sections, selections, dirty state
- `JdState` - Job description parsing (language detection, keywords, match scoring)
- `CheckoutState` - Pricing plans, Stripe session management
- `UiState` - Template tokens (font, fontSize, lineHeight, palette) converted to CSS vars via `tokensToCssVars()`

## Development Commands

### Root Level
```bash
npm run dev              # Run both frontend and backend concurrently
make dev-all            # Same as npm run dev
make build-all          # Build FE + BE + compile MDX + generate prerender routes
```

### Frontend (frontend/)
```bash
npm run start           # Dev server on port 4200
npm run build           # Production build
npm run build:prod      # Explicit production build
npm run typecheck       # TypeScript type checking
```

### Backend (backend/)
```bash
npm run dev             # Development with tsx watch
npm run start           # Production server with node
npm run build           # TypeScript compilation

## Content & SEO Pipeline

### MDX Precompilation
MDX content in `content/**/*.mdx` is compiled to JSON slices with frontmatter containing:
- `templateId` - Associated resume template
- `seo_route` - SEO-friendly route
- `route` - CTA target route for editor

**Build Flow**:
```bash
# 1. Compile MDX to JSON
node scripts/mdx-to-json.mjs --in content --out dist-mdx/json

# 2. Generate prerender route list
node scripts/generate-prerender-routes.mjs --in dist-mdx/json --out dist-mdx/prerender/routes.txt

# 3. Merge routes into angular.json
node scripts/merge-prerender-routes.mjs --routes dist-mdx/prerender/routes.txt --angular frontend/angular.json

# 4. Build and prerender
ng run <project>:prerender
```

### SafeMarkdownService
SSR/browser-universal service using DOMPurify sanitization, highlight.js, and markdown-it for secure MDX rendering.

## Payment Integration (Stripe)

### Pricing Tiers
- **14-Day Pass**: $0.00
- **Monthly**: $2.99/month (subscription mode)
- Multi-currency support: USD, CAD, MXN, BRL, CLP, ARS

### Environment Variables
Required backend configuration:
- `STRIPE_SECRET` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Webhook signing secret
- `PRICE_PASS_14D_USD`, `PRICE_PASS_14D_CAD` - 14-day pass price IDs
- `PRICE_MONTHLY_USD`, `PRICE_MONTHLY_CAD` - Monthly subscription price IDs
- `APP_BASE_URL` - Frontend URL for redirects

### Webhook Events
Backend handles:
- `checkout.session.completed` - Primary completion event
- `invoice.paid` - Subscription payment confirmation
- `customer.subscription.updated`, `customer.subscription.deleted` - Subscription lifecycle

All webhooks require signature verification via `stripe.webhooks.constructEvent()`.

## Analytics & A/B Testing

Events pushed to `window.dataLayer`:
- Navigation: `nav_click`
- Editor: `editor_section_apply_suggestion`, `template_switch`
- Import: `import_resume_success` (source: pdf/docx/linkedin)
- Checkout: `checkout_open`, `checkout_success`
- SEO: `mdx_page_view`

A/B test variants for paywall: `pass14-$0.99` vs `student-$1.99` (configurable by region/device).

## AI Features

### AI Suggestions
- **Interface**: `AiSuggestionProvider` with `suggest()` method
- **Input**: Section text, industry, JD keywords
- **Output**: Array of 3 suggestions with `{id, text, toneTag}`
- **Providers**: Claude/OpenAI with fallback to keyword-based templates

### Job Description Parsing
- `DetectLang` - Language detection (es/pt/fr/en) via rules + lightweight model
- `ExtractKeywords` - TF-IDF + industry dictionaries for LATAM/FR-CA
- Match scoring: `overlap(keywords, resumeTokens)`
