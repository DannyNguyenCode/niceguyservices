# Nice Guy Cursor Audit Agent

This folder defines the contract between the Nice Guy Website Audit application and the Cursor Automation analysis worker.

**Full implementation guide:** [`docs/cursor-automation-analysis.md`](../docs/cursor-automation-analysis.md)

- `audit-package.schema.json` — normalized evidence package Cursor retrieves over HTTPS
- `audit-result.schema.json` — structured JSON Cursor posts to the callback endpoint
- `analysis-instructions.md` — agent prompt for the Cursor Automation prompt field
- `examples/` — sanitized fixtures used by tests and manual verification

Runtime validation lives in `src/services/cursor-analysis/schemas.ts`.
