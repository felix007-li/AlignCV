# AlignCV Backend

Production-ready Fastify backend for AlignCV resume builder with Stripe payments, AI suggestions, and resume management.

## Features

- **Authentication**: JWT-based auth with access/refresh tokens
- **Stripe Integration**: Complete checkout and webhook handling for 6 currencies
- **AI Suggestions**: Claude/OpenAI integration with fallback
- **JD Analysis**: Language detection, keyword extraction, match scoring
- **Resume Import**: PDF/DOCX parsing
- **Resume CRUD**: Full resume lifecycle management
- **Database**: PostgreSQL with Prisma ORM
- **Logging**: Structured logging with Pino
- **Error Handling**: Comprehensive error handling with custom error classes

## Architecture

```
src/
├── modules/
│   ├── auth/               # JWT authentication
│   ├── billing/            # Stripe checkout + webhooks
│   ├── ai/                 # AI suggestions (Claude/OpenAI/fallback)
│   ├── jd/                 # Job description analysis
│   ├── importer/           # Resume import (PDF/DOCX)
│   └── resume/             # Resume CRUD
├── shared/
│   ├── config/             # Environment validation
│   ├── database/           # Prisma client + schema
│   ├── middleware/         # Global middleware
│   └── utils/              # Errors, logger, response helpers
└── index.ts                # Fastify server entry
```

## Prerequisites

- Node.js 20+
- PostgreSQL 14+
- Stripe account with price IDs configured
- (Optional) Anthropic or OpenAI API key

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Setup database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio
npm run prisma:studio
```

### 4. Start development server

```bash
npm run dev
```

Server runs on http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Stripe Checkout
- `POST /api/checkout/session` - Create checkout session
- `GET /api/checkout/session/:sessionId` - Get session details

### Stripe Webhooks
- `POST /api/stripe/webhook` - Handle all Stripe events (signature verified)

### AI Suggestions
- `POST /api/ai/suggest` - Generate AI-powered resume suggestions

### Job Description Analysis
- `POST /api/jd/detect` - Detect language
- `POST /api/jd/keywords` - Extract keywords
- `POST /api/jd/analyze` - Full analysis with match scoring

### Resume Import
- `POST /api/import/resume` - Upload and parse PDF/DOCX
- `POST /api/import/linkedin` - Parse LinkedIn PDF export

### Resume Management
- `GET /api/resumes` - List user resumes (paginated)
- `POST /api/resumes` - Create resume
- `GET /api/resumes/:id` - Get resume by ID
- `PATCH /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume (soft delete)

### Health
- `GET /health` - Health check (includes DB status)
- `GET /` - API info

## Environment Variables

See `.env.example` for complete list. Critical variables:

```bash
# Database
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=<32+ char secret>
JWT_REFRESH_SECRET=<32+ char secret>

# Stripe
STRIPE_SECRET=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
PRICE_PASS_14D_USD=price_...
PRICE_MONTHLY_USD=price_...
# ... (6 currencies each)

# AI (at least one)
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# App
APP_BASE_URL=http://localhost:4200
```

## Stripe Configuration

### 1. Create Price IDs

In Stripe Dashboard:
1. Create products for "14-Day Pass" and "Monthly Subscription"
2. Add prices for each currency: USD, CAD, MXN, BRL, CLP, ARS
3. Copy price IDs to `.env`

### 2. Setup Webhook

1. Go to Developers > Webhooks
2. Add endpoint: `https://your-domain.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `invoice.paid`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copy signing secret to `STRIPE_WEBHOOK_SECRET`

## Deployment

### Fly.io

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Deploy
flyctl launch
flyctl secrets set DATABASE_URL=postgresql://...
flyctl secrets set JWT_SECRET=...
# ... (set all secrets from .env)
flyctl deploy
```

### Docker

```bash
# Build
docker build -t aligncv-backend .

# Run
docker run -p 8080:8080 --env-file .env aligncv-backend
```

## Development

```bash
# Type checking
npm run typecheck

# Build
npm run build

# Start production
npm start

# Database migrations
npm run prisma:migrate

# Prisma Studio (GUI)
npm run prisma:studio
```

## Security Practices

- All Stripe webhooks verify signatures
- JWT tokens stored securely, refresh tokens in DB
- File uploads limited to 15MB
- API keys never logged
- Input validation with Zod
- Error messages sanitized in production

## Testing

```bash
# Test Stripe webhook locally with Stripe CLI
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Trigger test events
stripe trigger checkout.session.completed
```

## Architecture Decisions

See `docs/backend/` for detailed architectural documentation:
- `10-backend-architecture.md` - Overall architecture
- `11-backend-apis.md` - API design
- `12-backend-stripe-payments.md` - Stripe integration
- `13-backend-ai-suggestions-jd.md` - AI features

## License

UNLICENSED - Private project
