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
5. Do **not** set `AUDIT_SYNC_EXECUTION=true` in production unless deliberately debugging.
6. Audits start immediately via `after()` / `scheduleAuditWorkerKick()` — they do not wait for the daily cron. On a plan that supports minute crons, change the schedule back to `* * * * *` for frequent recovery.

## Execution flow

1. Admin/public start creates Website + AuditRun + queued AuditJob.
2. Request returns after scheduling work (`after()` kick + cron).
3. Worker claims one queued job atomically and runs a dependency-aware
   concurrent pipeline:
   - preflight
   - crawl (+ screenshots capture) **in parallel with** PageSpeed mobile/desktop
   - Nice Guy Metrics after crawl completes (may overlap remaining PageSpeed)
   - evidence barrier → Cursor trigger (exactly once)
4. After Cursor webhook acceptance, the job parks as `waiting_for_external` and the function ends.
5. Cursor callback authenticates, validates, persists result, marks AI complete, resumes finalize + report draft.

## Local development

- Default sync execution remains enabled outside production.
- `npm run worker:audit` / `worker:audit:once` still work for traditional worker loops.
