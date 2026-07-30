# Production Deployment Checklist

## Before deployment

- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm test` passes
- [ ] `npm run build` passes with production environment variables
- [ ] `npm run deploy:check` passes in production mode
- [ ] MongoDB Atlas backup enabled
- [ ] Production database name configured (`MONGODB_DB_NAME`)
- [ ] Preview database is separate from production
- [ ] `npm run db:indexes:apply` reviewed/applied
- [ ] Required migrations reviewed (`docs/deployment/migrations.md`)
- [ ] `APP_URL` / `NEXT_PUBLIC_SITE_URL` use the production domain (HTTPS)
- [ ] `RATE_LIMIT_PROVIDER=redis` with Upstash credentials configured
- [ ] `RATE_LIMIT_BYPASS_MODE=disabled`
- [ ] `AUTH_SECRET` configured (Phase 16 authentication must be enabled)
- [ ] Cloudinary production folder configured
- [ ] Google PageSpeed API key configured (server-only)
- [ ] AI provider key configured (server-only)
- [ ] `PDF_RENDER_SECRET` configured
- [ ] Playwright strategy confirmed (`docs/deployment/workloads.md`)
- [ ] Custom domain DNS + SSL verified on Vercel

## During deployment

- [ ] Apply safe migrations (if needed)
- [ ] Deploy indexes
- [ ] Deploy application to production branch (`main`)
- [ ] Verify `/api/health`
- [ ] Verify internal readiness with `INTERNAL_WORKER_SECRET`
- [ ] Review deployment logs for secret leakage

## After deployment

- [ ] Administrator login/logout (once Phase 16 auth is enabled)
- [ ] Dashboard loads over HTTPS
- [ ] Create/select smoke-test website
- [ ] Start crawl and verify audit run
- [ ] Verify screenshot upload to Cloudinary production folder
- [ ] Run PageSpeed mobile + desktop
- [ ] Run Nice Guy metrics
- [ ] Run AI analysis
- [ ] Publish public report and open valid token URL
- [ ] Verify invalid token returns generic response
- [ ] Generate and download PDF
- [ ] Generate outreach draft
- [ ] Generate demo preview (if enabled)
- [ ] Review activity timeline and audit history
- [ ] Trigger safe rate-limit test and verify 429 guidance
- [ ] Confirm dashboard/API responses are `noindex` and `no-store`
- [ ] `npm run smoke:production -- --base-url https://your-domain`

## Rollback

1. Identify failed release in Vercel.
2. Roll back to previous deployment.
3. Verify database compatibility (migrations are not automatically reversed).
4. Restore MongoDB from Atlas backup only if required.
5. Re-run smoke tests.
6. Record incident and add follow-up items to `docs/final-revisions.md`.

## Administrator recovery

Use controlled database/deployment access to reset administrator credentials.

Do not add a public password-reset flow in Phase 18.

## Secret rotation

Document whether rotation invalidates sessions, public tokens, preview tokens, and internal worker access before rotating:

- `AUTH_SECRET`
- `RATE_LIMIT_HASH_SECRET`
- `RATE_LIMIT_REDIS_TOKEN`
- `PDF_RENDER_SECRET`
- `INTERNAL_WORKER_SECRET`
- Cloudinary / PageSpeed / AI API keys
