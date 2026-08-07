# Nice Guy Cursor Audit Agent

This folder defines the contract between the Nice Guy Website Audit application and the Cursor Automation analysis worker.

**Contract version:** `1.1`

**Full implementation guide:** [`docs/cursor-automation-analysis.md`](../docs/cursor-automation-analysis.md)

- `audit-package.schema.json` — normalized evidence package (v1.1) Cursor retrieves over HTTPS
- `audit-result.schema.json` — structured callback JSON (v1.1) Cursor posts to the callback endpoint
- `analysis-instructions.md` — agent prompt for the Cursor Automation prompt field
- `examples/` — sanitized fixtures used by tests and manual verification

## Key files in the application

| Responsibility | Path |
|---|---|
| Provider boundary | `src/services/cursor-analysis/providers/` |
| Package builder | `src/services/cursor-analysis/build-cursor-audit-package.ts` |
| Readiness validation | `src/services/cursor-analysis/readiness.ts` |
| Signed package tokens | `src/services/cursor-analysis/package-token.ts` |
| Callback token signing | `src/services/cursor-analysis/callback-token.ts` |
| Callback authentication | `src/services/cursor-analysis/callback-auth.ts` |
| Trigger orchestration | `src/services/cursor-analysis/request-cursor-analysis.ts` |
| Stale recovery | `src/services/cursor-analysis/recover-stale-analyses.ts` |
| State machine | `src/services/cursor-analysis/state-machine.ts` |
| Result contract | `src/services/cursor-analysis/result-contract.ts` |
| Runtime schemas | `src/services/cursor-analysis/schemas.ts` |

Runtime validation lives in `src/services/cursor-analysis/schemas.ts`.

## Local testing with mock provider

```bash
AI_ANALYSIS_PROVIDER=mock
APP_PUBLIC_URL=https://audit.example.com
AUDIT_PACKAGE_SIGNING_SECRET=local-dev-signing-secret
CURSOR_ANALYSIS_CALLBACK_SECRET=local-dev-callback-secret
```

Run tests: `npm run test:unit -- tests/cursor-analysis.test.ts`
