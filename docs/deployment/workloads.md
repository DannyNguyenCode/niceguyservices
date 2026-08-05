# Deployment Workloads

This document classifies Website Audit platform workloads for Vercel (Node.js) deployment.

| Workload | Runtime | Duration | Memory | External services | Serverless safe | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Web application | Node.js / static | Short | Low | None | Yes | Marketing pages and App Router UI |
| Administrator dashboard | Node.js SSR | Short | Low | MongoDB | Yes | `noindex`, `private, no-store` |
| Public report rendering | Node.js SSR | Short | Low | MongoDB | Yes | Token route, rate limited, `noindex` |
| Public demo preview | Node.js SSR | Short | Low | MongoDB | Yes | Token route, rate limited, `noindex` |
| MongoDB CRUD | Node.js | Short | Low | MongoDB Atlas | Yes | Cached Mongoose connection |
| PageSpeed API requests | Node.js | Medium (up to 300s) | Medium | Google PageSpeed | Yes with limits | `maxDuration=300` on route |
| AI API requests | Node.js | Medium (up to 300s) | Medium | OpenAI / Anthropic | Yes with limits | Rate limited, schema validated |
| PDF generation | Node.js | Medium (up to 120s) | High | Playwright render + Cloudinary | Borderline | Use `maxDuration=120`; memory is managed by Active CPU billing |
| Playwright crawling | Node.js | Long (up to 300s) | High | Playwright Chromium | Borderline | May require dedicated worker if browser binaries exceed platform limits |
| Screenshot capture | Node.js | Long (during crawl) | High | Playwright + Cloudinary | Borderline | Part of crawl workflow |
| Cloudinary upload | Node.js | Short | Medium | Cloudinary | Yes | Environment-specific folders |
| Demo-generation orchestration | Node.js | Medium/long | Medium | Local/Cursor provider | Partial | Local provider needs writable workspace; not ideal on pure serverless |
| Background jobs | Node.js worker | Variable | High | MongoDB + providers | No | Use `INTERNAL_WORKER_SECRET` for trusted invocations |

## Playwright production strategy

1. **Primary:** Vercel Node.js function with `maxDuration=300`, Playwright-managed Chromium (memory is managed by Active CPU billing).
2. **Fallback:** Dedicated worker/container if browser launch fails on serverless (document and deploy separately).
3. **Do not** move crawl routes to Edge runtime.

## Demo generation production strategy

- `DEMO_GENERATION_PROVIDER=local` requires filesystem workspace and is best suited to a worker or non-serverless host.
- Preview deployments must not modify production repositories or consume uncontrolled AI budgets.

## Cache strategy

- Administrator routes/APIs: `private, no-store`
- Public token routes: `private, no-store`, `noindex`
- Marketing pages: default Next.js static caching

## Retry behavior

- Provider 429 responses are rate-limited and surfaced with retry guidance.
- Duplicate expensive jobs remain blocked by existing job-status checks.
- Stale `running` jobs should be reviewed manually or via a future revision-phase cleanup job.
