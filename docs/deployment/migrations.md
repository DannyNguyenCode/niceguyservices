# Migration Manifest

Migrations are **never** run automatically on application startup.

## Activity log migration

- **Script:** `scripts/migrate-activity-log.ts`
- **Purpose:** Normalize legacy activity-log records for the Phase 14 timeline.
- **Dry run:** `npx tsx scripts/migrate-activity-log.ts`
- **Apply:** `npx tsx scripts/migrate-activity-log.ts --apply`
- **Collections:** `activity_log`
- **Rollback:** Restore from MongoDB backup; migration is additive.
- **Idempotent:** Yes (skips already-migrated records).

## Audit history migration

- **Script:** `scripts/migrate-audit-history.ts`
- **Purpose:** Create `audit_runs` containers and link legacy crawl/metric/report references.
- **Dry run:** `npx tsx scripts/migrate-audit-history.ts`
- **Apply:** `npx tsx scripts/migrate-audit-history.ts --apply`
- **Collections:** `audit_runs`, `website_collection`, `crawl_data`, metrics, reports, drafts, demos
- **Rollback:** Restore from backup; do not delete `audit_runs` in production without review.
- **Idempotent:** Yes for websites that already have audit runs.

## Database indexes

- **Script:** `scripts/sync-indexes.ts`
- **Dry run:** `npm run db:indexes`
- **Apply:** `npm run db:indexes:apply`
- **Rollback:** Manual index review in Atlas; script does not drop indexes automatically.

## Recommended production sequence

```text
Backup database
→ npm run db:indexes:apply
→ npx tsx scripts/migrate-activity-log.ts --apply (if needed)
→ npx tsx scripts/migrate-audit-history.ts --apply (if needed)
→ npm run deploy:check
→ Deploy application
→ npm run smoke:production -- --base-url https://your-domain
```

## Environment separation

| Environment | Suggested database name |
| --- | --- |
| development | `niceguy_audit_dev` |
| test | `niceguy_audit_test` |
| preview | `niceguy_audit_preview` |
| production | `niceguy_audit_production` |

Preview deployments must not write to the production database unless explicitly approved.
