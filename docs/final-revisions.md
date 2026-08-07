# Final Revision Items

Improvements discovered during Phase 18 that are **outside** the documented 18-phase roadmap.

## Security and authentication

- Complete Phase 16 administrator authentication (sessions, secure cookies, protected dashboard/API routes, login UI).
- Wire `enforceLoginRateLimits()` into the sign-in route once auth exists.
- Add MFA for administrator accounts.
- Add middleware route protection for `/dashboard` and `/api/admin/*`.

## Infrastructure

- Dedicated Playwright crawl worker if Vercel serverless browser launch is unreliable.
- Job queue for long-running demo generation when `DEMO_GENERATION_PROVIDER=local`.
- Stale-job sweeper for `running` crawl/PageSpeed/AI/PDF/demo records.
- External error monitoring provider (Sentry/Datadog) with secret sanitization.

## Product (explicitly out of scope for Phases 1–18)

- CRM functionality
- Automated outreach campaigns and email sending
- Billing, subscriptions, client accounts, team workspaces
- Client portal
- Advanced analytics dashboard
- New AI/report/demo/crawl/scoring features

## UX and operations

- Dashboard UX cleanup for rate-limit and job-status panels.
- Interactive audit comparison picker.
- Production administrator onboarding without bootstrap credentials in environment.
- CSP strict enforcement after report-only validation.

## Deployment follow-ups

- Configure Vercel preview environment variables pointing to preview database.
- Set up external uptime monitoring for `/api/health`.
- Document Atlas point-in-time recovery drill.
- Add `scripts/change-administrator-password.ts` when Phase 16 auth lands.
