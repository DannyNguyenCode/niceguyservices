<p align="center">
  <img src="public/niceguywebdesignlogo.png" alt="Nice Guy Web Design logo" width="300" />
</p>

<h1 align="center">Nice Guy Web Design</h1>

<p align="center">
  <strong>Custom websites and internal audit tools for Toronto small businesses</strong><br />
  <em>Repository: <code>nice-guy-web-design</code> · Next.js full-stack application</em>
</p>

<p align="center">
  <a href="https://nextjs.org">Next.js 16</a> ·
  <a href="https://www.mongodb.com/atlas">MongoDB Atlas</a> ·
  <a href="https://playwright.dev">Playwright</a> ·
  <a href="https://tailwindcss.com">Tailwind CSS</a>
</p>

---

## About this project

**Nice Guy Web Design** is the official web platform for a Toronto-based web design studio founded by **Danny Nguyen**. The site markets custom website services to local small businesses while also powering an internal **Website Audit & Outreach Platform** used to research prospects, evaluate websites, and support personalized client outreach.

### Why it was created

Local businesses often have outdated websites that hurt visibility, trust, and lead generation — but they rarely receive clear, actionable feedback in plain language. This project was built to:

1. **Present the studio professionally** — showcase services, pricing, portfolio demos, and resources for Toronto and GTA small businesses.
2. **Automate website audits** — crawl prospect sites, capture screenshots, run Google PageSpeed, and score websites with transparent, evidence-based rules.
3. **Support outreach at scale** — eventually generate reports, PDFs, and personalized emails backed by real audit data instead of generic sales copy.
4. **Serve as a living portfolio** — host interactive demo templates across industries (HVAC, landscaping, dental, pet retail, restaurants, and more).

### Purpose

| Audience | Purpose |
|---|---|
| **Prospective clients** | Learn about services, view pricing, browse work, read resources, and contact the studio |
| **Administrator (studio)** | Manage website records, run audits, review scores, and track outreach in the dashboard |
| **Future clients (public reports)** | Receive shareable audit summaries and optional redesign demos |

---

## Website summary

The public marketing site at the site root offers:

- **Homepage** — value proposition for Toronto small businesses, service highlights, pricing teaser, FAQ, and contact CTA
- **Services** — custom builds, SEO-ready structure, performance, and ongoing support
- **Pricing** — Starter Website ($250 one-time), Hosting & Reports ($10/mo), Growth & Optimization ($200/mo)
- **Work & portfolio** — featured projects and a library of branded demo templates
- **Website Audit** — public landing page for the audit offering (reports and demos planned)
- **Resources** — SEO and web design articles for local businesses
- **About** — studio background and founder story
- **Contact** — general contact, business intake, and portfolio intake forms

The **admin dashboard** at `/dashboard` is a separate internal area for managing prospect websites and running the audit pipeline (crawl → screenshots → PageSpeed → Nice Guy scoring).

> **Logo assets:** Light and dark logos are served from `public/niceguywebdesignlogo.png` and `public/niceguywebdesignlogodark.png` (see `lib/siteConfig.ts`). Add these files to `public/` if they are not already in your local clone.

---

## Technology stack

### Frontend

| Technology | Role |
|---|---|
| **Next.js 16** | App Router, server components, API routes, SSR/SSG |
| **React 19** | UI components and client interactivity |
| **TypeScript** | Type safety across the codebase |
| **Tailwind CSS 4** | Utility-first styling |
| **DaisyUI** | Component classes (badges, buttons, cards, tabs) |
| **Framer Motion** | Animations on select pages |
| **MUI + Emotion** | Material UI in specific template/demo areas |
| **Heroicons / Lucide React** | Icon sets |
| **react-social-icons** | Social profile links |

### Backend

| Technology | Role |
|---|---|
| **Next.js API Routes** | REST endpoints for contact forms, admin actions, and demo backends |
| **Next.js Server Actions** | Form submissions and dashboard triggers (crawl, PageSpeed, scoring) |
| **Node.js runtime** | Server-side execution for Playwright, MongoDB, and external APIs |
| **Playwright** | Headless browser crawling and screenshot capture |
| **Cloudinary SDK** | Server-side screenshot uploads |
| **Google PageSpeed Insights API v5** | Mobile and desktop Lighthouse analysis |
| **Resend** | Transactional email (contact forms, future outreach) |
| **Zod** | Runtime validation for forms and MongoDB document shapes |
| **server-only** | Prevents server modules from bundling into client code |

### Database

| Technology | Role |
|---|---|
| **MongoDB Atlas** | Cloud-hosted document database |
| **Mongoose 9** | ODM models, schemas, indexes, and queries |
| **mongodb** (driver) | Low-level driver where needed |

**Collections** used by the audit platform:

```text
website_collection · crawl_data · screenshots · google_metrics
niceguy_metrics · activity_log · ai_summary · hero_suggestions
outreach_email · pdf · demo · ai_metadata
```

### Libraries & dependencies (full list)

| Package | Category |
|---|---|
| `next`, `react`, `react-dom` | Core framework |
| `typescript` | Language |
| `mongoose`, `mongodb` | Database |
| `zod` | Validation |
| `server-only` | Server boundary |
| `playwright`, `@playwright/test` | Crawling & E2E tests |
| `cloudinary` | Image storage |
| `resend` | Email |
| `@react-pdf/renderer` | PDF generation (planned) |
| `tailwindcss`, `daisyui`, `@tailwindcss/postcss` | Styling |
| `@mui/material-nextjs`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled` | UI (select demos) |
| `framer-motion` | Animation |
| `@heroicons/react`, `lucide-react` | Icons |
| `react-social-icons` | Social links |
| `eslint`, `eslint-config-next` | Linting |



## Key routes

### Public site

| Route | Description |
|---|---|
| `/` | Homepage |
| `/services` | Services |
| `/pricing` | Pricing |
| `/work` | Featured work |
| `/work/website-audit` | Audit landing page |
| `/resources` | Articles and guides |
| `/about` | About the studio |
| `/contact` | Contact forms |

### Admin dashboard

| Route | Description |
|---|---|
| `/dashboard` | Overview |
| `/dashboard/websites` | Website list |
| `/dashboard/websites/[id]` | Audit detail |

### Admin API (prototype)

| Method | Route |
|---|---|
| `POST` | `/api/admin/websites/[id]/crawl` |
| `POST` | `/api/admin/websites/[id]/pagespeed` |
| `POST` | `/api/admin/websites/[id]/niceguy-analysis` |

---

## Website Audit Platform

Internal tool for auditing local-business websites. Current capabilities:

- Website CRUD with MongoDB persistence
- Playwright crawling with SSRF-safe URL validation
- Cloudinary screenshots (desktop + mobile)
- Google PageSpeed (mobile + desktop)
- Nice Guy deterministic scoring (`niceguy-v1`, seven categories)
- Activity logging

**Full phase documentation:** [docs/website-audit/README.md](docs/website-audit/README.md)

---

## Scripts & testing

| Command | Description |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run test:pagespeed` | PageSpeed parser tests |
| `npm run test:niceguy` | Nice Guy scoring tests |
| `npm run test:playwright` | Playwright smoke tests |

---

## Security

- API keys and database credentials are **server-only** (no `NEXT_PUBLIC_` prefix).
- The crawler blocks private networks and unsafe URLs (SSRF protection).
- Admin routes require authentication before production (TODO in code).
- `.env` is gitignored.

---

## Contact

| | |
|---|---|
| **Studio** | Nice Guy Web Design |
| **Founder** | Danny Nguyen |
| **Location** | Toronto, ON · Greater Toronto Area |
| **Phone** | (647) 760-3458 |
| **Email** | gbnguyenw@gmail.com |
| **LinkedIn** | [gia-bao-danny-nguyen](https://www.linkedin.com/in/gia-bao-danny-nguyen/) |
| **GitHub** | [DannyNguyenCode](https://github.com/DannyNguyenCode) |

---

## License

Private — all rights reserved.
