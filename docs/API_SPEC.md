# AlignCV API Spec (stub)
- `GET /api/resumes` → ResumeDoc[]
- `POST /api/resumes` { title, template } → ResumeDoc
- `GET /api/covers` → CoverDoc[]
- `POST /api/covers` { title, resumeId?, template } → CoverDoc
- `POST /api/checkout/session` { plan: 'day14'|'monthly' } → { sessionId }
- `POST /api/auth/login` { provider } → { token }
- `GET /api/profile` → { name, email, plan, expiresAt }
