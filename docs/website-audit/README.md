# Website Audit & Outreach Platform

## Project overview

The Website Audit & Outreach Platform is an internal Nice Guy Web Design system for auditing local-business websites, generating actionable recommendations, creating branded reports, and supporting personalized outreach.

Administrator-controlled workflow:

```text
Sign in
→ Create or select website record
→ Start audit run
→ Crawl website
→ Capture screenshots
→ Run Google PageSpeed (mobile + desktop)
→ Calculate Nice Guy metrics
→ Generate AI analysis (optional when configured)
→ Review results in dashboard
→ Publish public report
→ Generate PDF (optional)
→ Generate outreach draft (optional, manual send)
→ Create redesign demo (optional)
→ Track activity and audit history
```

Public customer touchpoints (no administrator access required):

```text
/work/website-audit          — marketing landing + request form (UI validation only)
/report/[token]              — published audit report (real data)
/demo-preview/[token]        — published redesign demo (real data)
```

Mock preview routes (design placeholders only — not used for live audits):

```text
/work/website-audit/report/[token]
/work/website-audit/demo/[token]
```

## Technology stack

| Layer | Technology |
|-------|------------|
| Application | Next.js App Router, React 19, TypeScript |
| Styling | Tailwind CSS, DaisyUI |
| Database | MongoDB Atlas, Mongoose |
| Crawl & screenshots | Playwright (Chromium) |
| Image storage | Cloudinary |
| Performance | Google PageSpeed Insights API v5 |
| AI | OpenAI (`gpt-4o-mini` default; configurable) |
| Email | Resend (outreach sending when enabled) |
| PDF | `@react-pdf/renderer` + Cloudinary storage |
| Auth | Signed HTTP-only session cookies (`AUTH_SECRET`) |
| Rate limiting | In-memory (development) / Upstash Redis (production) |

## Database architecture

Each major workflow uses its own MongoDB collection. Collection names are configurable via `.env` (see `.env.example`). Defaults include:

```text
website_collection
crawl_data
screenshots
google_metrics
niceguy_metrics
ai_summary
hero_suggestions
ai_metadata
activity_log
audit_runs
public_reports
pdf_reports
outreach_email_drafts
demo_projects
demo_generations
demo_assets
administrators
```

**Referencing rules**

- Every audit artifact includes `websiteId: ObjectId`.
- Crawl-derived artifacts include `crawlId: ObjectId`.
- All new audit work is tied to `auditRunId: ObjectId` so historical runs are never overwritten.

Models live in `src/models/`. Data access in `src/data/`. Orchestration in `src/services/`.

## Local development

```bash
npm install
npm run playwright:install
cp .env.example .env          # fill MongoDB, Cloudinary, PageSpeed, AUTH_SECRET, etc.
npm run dev:check             # non-secret preflight
npm run db:indexes:apply      # sync MongoDB indexes
npm run admin:create -- --email you@example.com --name "Your Name" --password "..."
npm run dev:seed-test-website # idempotent Nice Guy Web Design test record
npm run dev
```

Sign in at `/login`, then open `/dashboard`.

Deployment and production checks: `docs/deployment/`.

---

## Phase summary

| Phase | Name | Status |
|-------|------|--------|
| 1 | Project foundation | **Complete** |
| 2 | MongoDB & website CRUD | **Complete** |
| 3 | Playwright crawling | **Complete** |
| 4 | Screenshots & Cloudinary | **Complete** |
| 5 | Crawl & screenshot testing | **Complete** (automated + manual) |
| 6 | Google PageSpeed Insights | **Complete** |
| 7 | Nice Guy deterministic metrics | **Complete** |
| 8 | AI analysis | **Complete** (optional without API key) |
| 9 | Administrator dashboard | **Complete** |
| 10 | Public audit report | **Complete** |
| 11 | PDF report generation | **Complete** |
| 12 | Outreach email drafts | **Complete** (no auto-send) |
| 13 | Redesign demo | **Complete** |
| 14 | Activity timeline | **Complete** |
| 15 | Audit runs & history | **Complete** |
| 16 | Authentication | **Complete** |
| 17 | Rate limiting | **Complete** |
| 18 | Production deployment | **Complete** |

---

# Phase 1 — Project Foundation

**Status:** Complete

### How it works

Establishes the public marketing surface and administrator dashboard shell. The landing page at `/work/website-audit` explains the audit methodology and includes a request form that validates URL and email client-side only — it does **not** create records or start audits. The dashboard at `/dashboard` provides navigation, website list/create/detail pages, and section placeholders that later phases wire to live data.

All audit admin UI uses shared Tailwind/DaisyUI patterns under `components/websiteAudit/` and `components/audit-dashboard/`. Sensitive routes use `noindex` metadata.

### Key paths

| Route | Purpose |
|-------|---------|
| `/work/website-audit` | Public landing + request form (UI only) |
| `/dashboard` | Administrator overview |
| `/dashboard/websites` | Website list |
| `/dashboard/websites/new` | Create website |
| `/dashboard/websites/[id]` | Website audit detail |

---

# Phase 2 — MongoDB Atlas and Website CRUD

**Status:** Complete

### How it works

Websites persist in `website_collection` via Mongoose. Creating a website normalizes the URL to a canonical domain (`normalizeWebsiteUrl`), blocks duplicate active domains, and initializes status fields (`crawlStatus`, `pageSpeedStatus`, `niceGuyStatus`, etc.).

Administrators manage records through dashboard forms (`WebsiteForm`) backed by server actions in `src/actions/websites.ts`. Soft delete sets `deletedAt`; deleted sites are excluded from default queries. Activity event `website-created` is logged on create.

### Key paths

- `src/models/Website.ts` — schema and indexes
- `src/data/websites.ts` — CRUD, `getWebsiteByNormalizedDomain`
- `src/lib/normalize-domain.ts` — URL normalization
- `src/lib/mongodb.ts` — connection pooling for Next.js

---

# Phase 3 — Playwright Website Crawling

**Status:** Complete

### How it works

Starting a crawl (from dashboard button or `POST /api/admin/websites/[id]/crawl`) creates a new **audit run**, then a `crawl_data` record. Playwright launches headless Chromium, validates the target URL (rejects localhost, private IPs, non-HTTP(S) protocols), and crawls same-origin pages using **BFS** up to `CRAWL_MAX_PAGES` (default 20) and `CRAWL_MAX_DEPTH` (default 3).

For each page the crawler stores title, meta, headings, buttons, forms, images, visible text, status code, and load time. Page types are classified (`home`, `about`, `contact`, `services`, `service-detail`, `other`). Links, emails, phones, and social URLs are aggregated. Failed non-homepage pages are recorded without aborting the whole crawl.

Duplicate active crawls per website are blocked. Results attach `websiteId` and `auditRunId`.

### Key paths

- `src/services/run-website-crawl.ts` — orchestration
- `src/services/website-crawler.ts` — Playwright crawl engine
- `src/lib/crawl-config.ts` — limits and viewports
- `src/lib/validate-public-url.ts` — SSRF protection
- `app/api/admin/websites/[id]/crawl/route.ts`

---

# Phase 4 — Screenshot Capture and Cloudinary Storage

**Status:** Complete

### How it works

After a successful crawl, Playwright captures screenshots for priority pages: **homepage**, **contact** (when found), and **website audit landing** (`/work/website-audit` when discovered), plus additional crawled pages within limits. Each page gets separate **desktop** (1440×1000) and **mobile** (390×844) viewport shots; homepage also gets full-page desktop/mobile captures.

Images upload to Cloudinary via server-side streams — binary data is never stored in MongoDB. Public IDs follow:

```text
{CLOUDINARY_AUDIT_FOLDER_PREFIX}/{environment}/{websiteId}/{auditRunId}/{page-slug}-{viewport}.png
```

Environment suffix is `development`, `preview`, or `production`. `overwrite: false` preserves prior audit assets. Screenshot metadata (public ID, secure URL, dimensions) saves to `screenshots` with `auditRunId`. Individual screenshot failures do not delete successful uploads.

### Key paths

- `src/services/screenshot-capture.ts` — Playwright capture
- `src/services/screenshot-targets.ts` — page selection
- `src/services/cloudinary-screenshot-storage.ts` — upload
- `src/lib/cloudinary-config.ts` — folder prefix and credentials

---

# Phase 5 — Crawl and Screenshot Integration Testing

**Status:** Complete

### How it works

Automated tests verify crawler utilities, URL validation, and Playwright setup. Manual end-to-end verification runs through the dashboard: create website → crawl → confirm crawl data, screenshots, activity events, and dashboard sections update without overwriting prior runs.

Safety tests reject localhost, loopback, private networks, and invalid protocols. Test commands:

```bash
npm run test:playwright
npm run playwright:check
npm run dev:check
```

Controlled development test site: `npm run dev:seed-test-website` (Nice Guy Web Design / `niceguyservices.vercel.app`).

---

# Phase 6 — Google PageSpeed Insights

**Status:** Complete

### How it works

After a completed crawl, administrators trigger PageSpeed via dashboard or `POST /api/admin/websites/[id]/pagespeed`. The service calls Google PageSpeed Insights v5 separately for **mobile** and **desktop** strategies — results are never averaged.

Each strategy saves a `google_metrics` document with Lighthouse scores, lab metrics, field data (when available), opportunities, diagnostics, and failed audits. Missing field data stays `null` and does not fail the run. Overall website `pageSpeedStatus` becomes `complete`, `partial`, or `failed` depending on strategy outcomes. Retries handle 429/5xx/timeouts with bounded backoff.

Prerequisite: completed crawl with reachable homepage. Rate limits apply via Phase 17 policies.

### Key paths

- `src/services/run-pagespeed-analysis.ts`
- `src/services/pagespeed-client.ts`, `pagespeed-parser.ts`
- `src/lib/pagespeed-config.ts`
- `app/api/admin/websites/[id]/pagespeed/route.ts`

---

# Phase 7 — Nice Guy Deterministic Metrics

**Status:** Complete

**Public methodology:** [`NICE_GUY_METRICS.md`](./NICE_GUY_METRICS.md) — client-facing guide to categories, weights, evidence, limitations, and what scores do not guarantee.

### How it works

Nice Guy scoring runs **without any AI provider**. `runNiceGuyAnalysis` reads saved crawl data and PageSpeed results, then applies transparent TypeScript rules (`niceguy-v2`) across seven weighted categories:

1. Business Clarity (15%)
2. Trust and Credibility Signals (10%)
3. Conversion Readiness (20%)
4. Usability and Accessibility (20%)
5. Brand and Visual Consistency (10%)
6. Content Completeness and Usefulness (10%)
7. Technical Foundation (15%)

Each category produces checks with evidence, points, coverage, and recommendations. Scores are 0–100. Missing PageSpeed or screenshot evidence is treated as unavailable — never coerced to zero or passed. Each run creates a new `niceguy_metrics` record linked to `auditRunId`. Historical `niceguy-v1` results remain readable.

### Key paths

- `src/services/run-niceguy-analysis.ts`
- `src/services/niceguy-scoring/calculate-niceguy-score.ts`
- `src/config/niceguy-scoring.ts`
- `npm run test:niceguy`

---

# Phase 8 — AI Analysis and Recommendations

**Status:** Complete (optional in development without API key)

### How it works

When `AI_API_KEY` or `OPENAI_API_KEY` is configured, `runAiAnalysis` builds a structured input from crawl evidence, screenshots, PageSpeed, and Nice Guy results. OpenAI generates:

- **Audit summary** (`ai_summary`) — executive summary, strengths, weaknesses, quick wins, priorities
- **Hero suggestions** (`hero_suggestions`) — headline/copy/CTA concepts with evidence links

`ai_metadata` stores provider, model, prompt version, and token usage internally — never exposed on public reports. AI **explains** deterministic scores; it does not change them. Output is Zod-validated. Without an API key, the stage reports unavailable and other audit stages continue.

### Key paths

- `src/services/run-ai-analysis.ts`
- `src/services/ai/generate-audit-analysis.ts`, `generate-hero-suggestions.ts`
- `src/lib/ai-config.ts`
- `app/api/admin/websites/[id]/ai-analysis/route.ts`

---

# Phase 9 — Administrator Audit Dashboard

**Status:** Complete

### How it works

`/dashboard/websites/[id]` is the single audit control center. `getWebsiteAuditDashboard` assembles website metadata, latest crawl/screenshots/PageSpeed/Nice Guy/AI results, readiness flags, and warnings.

**Stage actions** run in order: Crawl → PageSpeed → Nice Guy → AI. Buttons disable when prerequisites are missing or a stage is already running. Sections show live status, scores, evidence, screenshots (Cloudinary URLs), and errors without clearing prior successful data on failure.

Additional dashboard sections (wired in later phases): public reports, PDFs, outreach drafts, demo projects, activity timeline, audit history/compare.

### Key paths

- `app/dashboard/websites/[id]/page.tsx`
- `src/services/get-website-audit-dashboard.ts`
- `components/audit-dashboard/*`

---

# Phase 10 — Public Audit Report

**Status:** Complete

### How it works

Administrators build a **draft** public report from completed audit data (`POST /api/admin/websites/[id]/reports`). Publishing (`POST /api/admin/reports/[reportId]/publish`) generates a 32-byte random token, stores only its SHA-256 hash, unpublishes other reports for the same website, and sets `publicPath` to `/report/{token}`.

Visitors open `/report/[token]` — no login required. `PublicReportView` renders public-safe snapshot data: branding, scores, screenshots, strengths, recommendations, methodology, and contact CTA. Draft, revoked, and expired reports return a generic unavailable page. Pages are `noindex` and rate-limited (Phase 17).

**Not** the mock route at `/work/website-audit/report/[token]` (static mock data for design preview).

### Key paths

- `app/report/[token]/page.tsx`
- `src/services/public-reports/publish-public-report.ts`
- `src/services/public-reports/build-public-report-snapshot.ts`
- `components/public-report/public-report-view.tsx`

---

# Phase 11 — PDF Report Generation

**Status:** Complete

### How it works

From a published public report, administrators generate a branded PDF (`POST /api/admin/reports/[reportId]/pdf`). The service renders `PublicReportView` in PDF mode via `@react-pdf/renderer`, uploads the file to Cloudinary (`pdf_reports` collection), and links the PDF to the source `auditRunId`. Prior PDF versions are preserved. Download via administrator API; PDF content mirrors public-safe report data.

### Key paths

- `src/services/pdf-reports/generate-pdf-report.ts`
- `app/api/admin/reports/[reportId]/pdf/route.ts`
- `app/api/admin/pdf-reports/[pdfReportId]/download/route.ts`

---

# Phase 12 — Outreach Email Drafts

**Status:** Complete (manual approval; no automatic sending)

### How it works

`generateOutreachEmail` uses AI to draft a personalized message from public report findings (`POST /api/admin/reports/[reportId]/outreach`). Drafts save to `outreach_email_drafts` with subject, body, evidence references, and strategy metadata. Administrators review, edit, approve, reject, or regenerate — **sending via Resend requires explicit action** and is not triggered automatically by the platform.

Validation prevents unsupported claims and requires evidence-backed findings.

### Key paths

- `src/services/outreach/generate-outreach-email.ts`
- `app/api/admin/reports/[reportId]/outreach/route.ts`
- `app/api/admin/outreach/[draftId]/*`

---

# Phase 13 — Optional Redesign Demo

**Status:** Complete

### How it works

From a published report, administrators create a **demo project** that generates a preview website concept from audit evidence. Approved demos receive an unguessable preview token. Visitors open `/demo-preview/[token]` — a standalone preview with demo disclaimer; forms do not submit real data.

Demo assets, generations, and projects link to `websiteId` and `auditRunId`. Publish/unpublish/archive flows are administrator-only.

**Not** the mock route at `/work/website-audit/demo/[token]`.

### Key paths

- `app/demo-preview/[token]/page.tsx`
- `src/services/demo/create-demo-project.ts`
- `app/api/admin/reports/[reportId]/demo-project/route.ts`

---

# Phase 14 — Activity Timeline

**Status:** Complete

### How it works

An append-only `activity_log` records audit lifecycle events: crawl, screenshots, PageSpeed, scoring, AI, reports, PDF, outreach, demo, administrator notes, and rate-limit triggers. Each entry includes `websiteId`, optional `crawlId`/`auditRunId`, event type, severity, title, description, actor, and concise metadata (no secrets, no raw API dumps).

The dashboard timeline supports filtering, pagination, and administrator notes (`POST /api/admin/websites/[id]/activity/notes`).

### Key paths

- `src/services/activity/create-activity-event.ts`
- `src/data/activity-logs.ts`
- `components/audit-dashboard/activity-timeline.tsx`
- `src/constants/activity-events.ts`

---

# Phase 15 — Audit Runs and Historical Comparison

**Status:** Complete

### How it works

Every crawl starts a new `audit_runs` document with incrementing `auditNumber`, stage tracking (`crawl` → `screenshots` → `pagespeed` → `niceguy` → `ai` → `complete`), and references to all child resources. Only one active run per website at a time; historical runs are immutable.

The dashboard shows audit history, supports viewing past runs via `?auditRunId=`, and compares two completed runs (`GET /api/admin/websites/[id]/audits/compare`). Comparison highlights score deltas, PageSpeed changes, and content differences. `finalizeAuditRun` marks completion and updates website summary fields.

### Key paths

- `src/models/AuditRun.ts`
- `src/services/audit-history/create-audit-run.ts`, `finalize-audit-run.ts`, `compare-audit-runs.ts`
- `app/dashboard/websites/[id]/audits/`
- `app/api/admin/websites/[id]/audits/route.ts`

---

# Phase 16 — Authentication and Authorization

**Status:** Complete

### How it works

When `AUTH_SECRET` is set, administrator access requires a signed HTTP-only session cookie (`ngwd_admin_session`). Administrators are stored in the `administrators` collection with scrypt-hashed passwords.

- `/login` — email/password form
- `POST /api/auth/login` — creates session
- `POST /api/auth/logout` — clears session
- `middleware.ts` — redirects unauthenticated `/dashboard` and `/api/admin` requests to login
- Server actions and API routes enforce auth via `guardAdministratorReadRoute` / `guardAdministratorWriteRoute`

Public routes (`/report/[token]`, `/demo-preview/[token]`, `/work/website-audit`) remain accessible without login. Create the first administrator:

```bash
npm run admin:create -- --email you@example.com --name "Your Name" --password "..." --role owner
```

Without `AUTH_SECRET`, dashboard access is open (development only — not for production).

### Key paths

- `src/models/Administrator.ts`
- `src/services/auth/administrator-session.ts`
- `app/login/page.tsx`
- `middleware.ts`

---

# Phase 17 — Rate Limiting and Abuse Prevention

**Status:** Complete

### How it works

Centralized rate limiting in `src/services/rate-limit/` protects expensive operations and public token routes. Policies cover crawl, PageSpeed, AI, PDF, demo, public report views, administrator read/write, and login (ready when login rate limits are wired).

| Environment | Provider |
|-------------|----------|
| Development / test | In-memory (`RATE_LIMIT_PROVIDER=memory`) |
| Production | Upstash Redis (required) |

Service boundaries call `enforceAdministratorActionRateLimit` before external API usage. Public report/demo pages use `enforcePublicReportViewRateLimit`. Exceeded limits return `429` with `Retry-After`. UI shows `RateLimitAlert` on dashboard actions.

Identity hashing uses `RATE_LIMIT_HASH_SECRET`. Internal workers can bypass limits with `INTERNAL_WORKER_SECRET` header.

### Key paths

- `src/services/rate-limit/` — providers, policies, enforcement
- `src/config/env.ts` — rate-limit configuration
- `npm run test:rate-limit`

---

# Phase 18 — Production Deployment and Monitoring

**Status:** Complete

### How it works

Production readiness includes environment validation (`src/config/app-env.ts`), canonical URL helpers, sanitized MongoDB logging, health endpoints, security headers, and deployment scripts.

| Endpoint | Access | Purpose |
|----------|--------|---------|
| `GET /api/health` | Public | Liveness (`status`, `service`, `environment`, `timestamp`) |
| `GET /api/internal/health` | `INTERNAL_WORKER_SECRET` | Deep check (MongoDB, Cloudinary, PageSpeed, AI, PDF, rate limits) |

`middleware.ts` applies security headers, request IDs, `noindex` for admin/report routes, and auth gates. `vercel.json` sets function timeouts for long-running routes (crawl, PageSpeed, AI, PDF). CI runs via `.github/workflows/ci.yml`.

Scripts:

```bash
npm run deploy:check
npm run db:indexes:apply
npm run smoke:production
npm run build
```

Documentation: `docs/deployment/production-checklist.md`, `workloads.md`, `migrations.md`.

### Key paths

- `middleware.ts`, `vercel.json`
- `scripts/deploy-check.ts`, `sync-indexes.ts`, `production-smoke-test.ts`
- `src/lib/application-url.ts`, `request-id.ts`, `safe-log.ts`

---

## Architecture principles

**Separate collections** — Each workflow has its own collection for independent reruns, partial failures, and historical records.

**MongoDB as source of truth** — External systems (Cloudinary, Google, OpenAI) provide assets and scores; MongoDB links them to `websiteId` and `auditRunId`.

**Deterministic scores before AI** — Nice Guy metrics are calculated in TypeScript. AI summarizes and prioritizes; it does not alter scores.

**Preserve history** — New runs create new records. Never overwrite crawls, metrics, reports, or assets from prior audit runs.

**Partial failure support** — A failed screenshot, PageSpeed strategy, or AI call does not erase successful sibling results.

**Server-side security** — Playwright, API keys, MongoDB writes, PDF generation, and scoring orchestration stay server-only.

**Production protection** — Administrator auth, rate limits, URL validation, SSRF blocking, manual outreach approval, and `noindex` on sensitive routes.

---

## Quick reference — administrator API routes

| Method | Route | Phase |
|--------|-------|-------|
| `POST` | `/api/admin/websites/[id]/crawl` | 3–4 |
| `POST` | `/api/admin/websites/[id]/pagespeed` | 6 |
| `POST` | `/api/admin/websites/[id]/niceguy-analysis` | 7 |
| `POST` | `/api/admin/websites/[id]/ai-analysis` | 8 |
| `POST` | `/api/admin/websites/[id]/reports` | 10 |
| `POST` | `/api/admin/reports/[reportId]/publish` | 10 |
| `POST` | `/api/admin/reports/[reportId]/pdf` | 11 |
| `POST` | `/api/admin/reports/[reportId]/outreach` | 12 |
| `POST` | `/api/admin/reports/[reportId]/demo-project` | 13 |
| `GET` | `/api/admin/websites/[id]/activity` | 14 |
| `POST` | `/api/admin/websites/[id]/activity/notes` | 14 |
| `GET/POST` | `/api/admin/websites/[id]/audits` | 15 |
| `GET` | `/api/admin/websites/[id]/audits/compare` | 15 |
| `POST` | `/api/auth/login` | 16 |
| `POST` | `/api/auth/logout` | 16 |
| `GET` | `/api/health` | 18 |

## Quick reference — tests

```bash
npm run test:dev-setup
npm run test:rate-limit
npm run test:deployment
npm run test:playwright
npm run test:pagespeed
npm run test:niceguy
npm run test:ai
npm run test:dashboard
npm run test:reports
npm run test:pdf
npm run test:outreach
npm run test:demo
npm run test:activity
npm run test:audit
```

## Quick reference — key paths

| Area | Location |
|------|----------|
| Dashboard UI | `app/dashboard/websites/` |
| Public report | `app/report/[token]/` |
| Demo preview | `app/demo-preview/[token]/` |
| Audit components | `components/websiteAudit/`, `components/audit-dashboard/` |
| Mongoose models | `src/models/` |
| Data access | `src/data/` |
| Services | `src/services/` |
| Schemas | `src/schemas/` |
| Environment | `.env.example` |
| Deployment docs | `docs/deployment/` |
