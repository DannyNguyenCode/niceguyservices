# Production background audit execution (Vercel)

This application runs on Vercel. Production and Preview audits are **not** executed
inline from `Save and Start Audit` by default. They are queued as `AuditJob` records
and executed by a protected worker endpoint.

Local development still defaults to synchronous execution for faster iteration
(`AUDIT_SYNC_EXECUTION` defaults to true outside production/preview).

## Required environment variables (production)

| Variable | Purpose |
| --- | --- |
| `INTERNAL_WORKER_SECRET` | Authenticates `/api/internal/audit-worker` via `x-internal-worker-secret` |
| `CRON_SECRET` | Optional; Vercel Cron may send `Authorization: Bearer <CRON_SECRET>` |
| `CURSOR_AUTOMATION_WEBHOOK_URL` | Cursor Automation webhook |
| `CURSOR_AUTOMATION_AUTH_TOKEN` | Cursor Automation webhook auth |
| `CURSOR_ANALYSIS_CALLBACK_SECRET` | Signs/verifies callback tokens (never sent to Cursor) |
| `AUDIT_PACKAGE_SIGNING_SECRET` | Signs package URLs |
| `APP_PUBLIC_URL` | Public HTTPS base for package + callback URLs |

`VERCEL_AUTOMATION_BYPASS_SECRET` is **Preview-only**. Production must never require or attach it.

Legacy `AI_API_KEY` / `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` are **not** required for the Cursor audit pipeline.

## Vercel dashboard / project steps

1. Deploy this branch so `vercel.json` includes:
   - Cron: `0 3 * * *` → `/api/internal/audit-worker` (once daily; Hobby-compatible recovery/safety net)
   - Function: `app/api/internal/audit-worker/route.ts` with `maxDuration: 300`
2. In the Vercel project, set `INTERNAL_WORKER_SECRET` (long random value).
3. Optionally set `CRON_SECRET` (Vercel can auto-inject cron auth when configured).
4. Confirm plan limits allow 300s functions if crawls are long.
5. Do **not** set `AUDIT_SYNC_EXECUTION=true` in Preview or Production. Leave it unset (defaults to `false`) or explicitly set `AUDIT_SYNC_EXECUTION=false`. Public submissions always use `forceAsync` and schedule a worker kick even if sync mode is accidentally enabled — but production should still run asynchronously.
6. Audits start immediately via `after()` / `scheduleAuditWorkerKick()` — they do not wait for the daily cron. On a plan that supports minute crons, change the schedule back to `* * * * *` for frequent recovery.
7. Customer progress polls `GET /api/public/audits/[statusToken]/status` using an opaque hashed status token issued at submit time.

## Manual stage actions (admin dashboard)

### Manual Run Crawl

```text
Run Crawl
→ startAuditJob (crawl + screenshots configuration only)
→ AuditRun created/reused
→ AuditJob created/reused (idempotency key + active-job guard)
→ scheduleAuditWorkerKick (forceAsync in production)
→ worker claims job
→ crawl executes
→ required desktop + mobile screenshots persist
→ dashboard shows queued/processing/complete/failed
```

Manual crawl does **not** create an orphaned queued `CrawlData` without an `AuditJob`.
It reuses the existing durable worker architecture. Repeated clicks reuse an active job
for the same website/configuration instead of spawning duplicates.

Screenshot stage completion requires at least one usable desktop and one usable mobile
screenshot. Partial viewport success preserves valid shots and allows retries of the
missing viewport without duplicating completed Cloudinary uploads.

### Manual Run PageSpeed

```text
Run PageSpeed
→ create/update mobile + desktop GoogleMetric records
→ mobile and desktop execute concurrently (Promise.allSettled)
→ both records persist for success, partial success, or failure
→ dashboard revalidates/refreshes for every persisted outcome
```

Failed metrics store safe admin error codes such as:

- `PAGESPEED_CONFIGURATION_ERROR`
- `PAGESPEED_RATE_LIMIT`
- `PAGESPEED_TIMEOUT`
- `PAGESPEED_NETWORK_ERROR`
- `PAGESPEED_URL_ERROR`
- `PAGESPEED_PROVIDER_ERROR`

The dashboard shows queued/processing/failed states distinctly from “No results yet.”


## Local development

- Default sync execution remains enabled outside production.
- `npm run worker:audit` / `worker:audit:once` still work for traditional worker loops.
