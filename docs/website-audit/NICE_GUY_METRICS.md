# Nice Guy Metrics — Methodology & Rating Guide

**Version:** `niceguy-v2`  
**Rubric date:** August 4, 2026  
**Maintained by:** Nice Guy Web Design

This document explains how the Website Audit platform calculates scores, what each category measures, and what the results do **not** guarantee. It is written for clients, partners, and anyone reviewing an audit report who wants to understand where the numbers come from.

---

## What Nice Guy Metrics is

Nice Guy Metrics is a **deterministic, evidence-based website screening system**. During an audit we:

1. Crawl the website with a headless browser (Playwright)
2. Capture performance data (Google PageSpeed / Lighthouse, when configured)
3. Run **67 automated checks** across **7 categories**
4. Score each check using transparent rules and store the evidence behind every result

Some visual observations may be **AI-assisted** in future releases; when used, they are labelled separately with model and confidence metadata. The current `niceguy-v2` release is primarily **deterministic** — rules applied to crawl text, DOM structure, forms, links, images, and PageSpeed data.

### What this is not

Nice Guy Metrics is **not**:

- A guarantee of accessibility (WCAG) conformance
- A legal compliance or privacy audit
- Proof of search ranking or SEO performance
- Proof that a business is trustworthy, licensed, or legitimate
- A prediction of conversion rate or revenue impact
- A substitute for moderated usability testing with real users

Results reflect **only the pages and resources successfully inspected during that audit run**.

---

## How the overall score is calculated

### Category weights (v2)

| Category | Weight | What it measures |
|----------|--------|------------------|
| **Business Clarity** | 15% | Can a visitor understand the offer, audience, and next step? |
| **Conversion Readiness** | 20% | Can a visitor start an appropriate action with manageable friction? |
| **Trust and Credibility Signals** | 10% | What observable trust signals were detected (not whether they are true)? |
| **Usability and Accessibility** | 20% | Task-supporting structure and interaction accessibility from DOM evidence |
| **Brand and Visual Consistency** | 10% | Identity and visual consistency (screenshot-assisted where available) |
| **Content Completeness and Usefulness** | 10% | Decision-support content, not raw word count |
| **Technical Foundation** | 15% | Performance, crawl health, HTTPS, Lighthouse technical screens |

### Per-category scoring

Each category contains multiple **checks**. Every check has:

- A **weight** (importance within the category)
- A **status** (see below)
- **Points awarded** based on status and weight
- **Evidence** (what was found during the crawl)

For each category:

```
qualityScore = earnedPoints ÷ applicableMeasuredPoints × 100
evidenceCoverage = applicableMeasuredPoints ÷ applicablePossiblePoints × 100
```

- **Applicable possible** excludes checks marked `not_applicable` (irrelevant to the detected business type)
- **Applicable measured** includes `passed`, `partial`, `failed`, and `not_detected`
- **Unavailable** checks reduce coverage but are **not** treated as website failures

The **overall score** is a weighted average of category quality scores, using configured category weights.

### Complete vs preliminary score

A score is labelled **complete** only when all of the following are met:

- Overall evidence coverage ≥ **70%**
- Business Clarity, Conversion Readiness, and Technical Foundation each ≥ **60%** coverage
- Homepage crawl succeeded
- Primary screenshots are available when visual scoring is included

Otherwise the report shows:

> **Preliminary result — insufficient evidence for a complete score**

The numeric score is still calculated internally, but coverage blockers are listed so you know what was missing (e.g. no mobile screenshot, incomplete PageSpeed data).

---

## Check statuses

| Status | Meaning |
|--------|---------|
| **Passed** | Check applied and met the threshold |
| **Partial** | Check applied; some evidence found but not fully satisfactory |
| **Failed** | Check applied; evidence indicates a clear shortcoming |
| **Not detected** | Source was inspected, but qualifying evidence was not found during the audit |
| **Not applicable** | Irrelevant to this website type; excluded from scoring |
| **Unavailable** | Could not be evaluated reliably (missing data, failed inspection) — reduces coverage, not a site failure |

### Language we use

- ✅ “Evidence detected” / “Measured fact”
- ✅ “Not detected during crawl”
- ✅ “Could not be evaluated”
- ✅ “Potential issue — human review recommended”
- ❌ “This business is trustworthy / untrustworthy”
- ❌ “WCAG compliant”
- ❌ “Will increase conversions”
- ❌ “Will improve search ranking”

Only checks with **passed** status and **positive points** appear as **strengths**. Partial, failed, and relevant not-detected checks become **issues** or **recommendations**.

---

## Research baseline

Scores are informed by publicly available guidance from:

| Source | Used for |
|--------|----------|
| [W3C WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/) | Text alternatives, labels, headings, target size, menu patterns |
| [Nielsen Norman Group](https://www.nngroup.com/) | Homepage clarity, scannable writing, form cognitive load, consistency |
| [Baymard Institute](https://baymard.com/) | Checkout and form research (where e-commerce applies) |
| [Competition Bureau Canada](https://competition-bureau.canada.ca/) | Claim, testimonial, and misleading representation awareness |
| [Google Web Vitals](https://web.dev/articles/vitals) | LCP, INP, CLS field thresholds |
| [Chrome Lighthouse](https://developer.chrome.com/docs/lighthouse/overview) | Performance, accessibility, best practices, SEO screens |
| [Google Search Central](https://developers.google.com/search/docs) | Title, meta, canonical, robots, sitemap guidance |

Research informs **rubric design**. It does **not** mean an automated pass equals certification, compliance, or business outcomes.

---

## Category details

### 1. Business Clarity (15%)

**Purpose:** Measure whether an intended visitor can determine what the business offers, who it serves, where it operates (when relevant), why it matters, and what to do next.

| Check | Weight | What we look for |
|-------|--------|------------------|
| Primary offer clarity | 20% | Specific product/service in hero, H1, and supporting copy — not slogans alone |
| Intended-customer clarity | 12% | Explicit audience, problem, or use case (N/A for inherently universal offers) |
| Service/product scope | 15% | Named offerings with understandable boundaries; `/services` route alone is insufficient |
| Location/service-area clarity | 10% | City, address, or service area for local/healthcare/hospitality businesses |
| Differentiation and value | 15% | Concrete benefits, process, qualifications — not generic adjectives alone |
| Primary action clarity | 12% | Dominant CTA label communicates intent |
| Business identity clarity | 8% | Visible, consistent business name |
| Expectation-setting | 8% | Response time, booking steps, or what to prepare — not generic “contact us” |

**Evidence sources:** Crawled visible text, headings, buttons, page classification. Metadata and JSON-LD alone do not pass checks.

---

### 2. Conversion Readiness (20%)

**Purpose:** Evaluate whether a visitor can identify and begin an appropriate action with understandable expectations.

| Check | Weight | What we look for |
|-------|--------|------------------|
| Primary CTA prominence | 18% | Visible, distinguishable primary action on homepage |
| CTA destination continuity | 12% | Label intent aligns with destination page discovered in crawl |
| Conversion-path availability | 12% | Form, phone, email, booking, or other valid path by business type |
| Form readiness and labelling | 15% | Labelled fields; placeholder-only labels do not receive full credit |
| Friction proportionality | 10% | Field count and steps proportionate to task |
| Outcome expectations | 10% | What happens after submission or booking |
| Risk/objection information | 8% | Pricing method, returns, privacy context near decision points when relevant |
| CTA consistency by intent | 6% | Equivalent actions use consistent labels |
| Mobile conversion-path usability | 6% | Primary action reachable at mobile viewport |
| Feedback/error readiness | 3% | Validation structures inspectable without submitting forms |

**Safety rule:** The audit **never submits forms**, places calls, sends email, or causes business side effects.

---

### 3. Trust and Credibility Signals (10%)

**Purpose:** Record **observable signals** that may help visitors evaluate legitimacy. We never declare a business trustworthy or untrustworthy.

| Check | Weight | What we look for |
|-------|--------|------------------|
| Verifiable business identity | 15% | Meaningful About content and consistent identity |
| Contact transparency | 12% | Actionable contact path with clear labels |
| Specific proof evidence | 15% | Case studies, portfolios, certifications, named work |
| Testimonials/reviews integrity | 12% | Attributable quotes; placeholder text flagged |
| Qualifications and expertise | 10% | Named professionals and credentials when industry requires |
| Policy transparency | 12% | Useful visible policy content when transactions apply |
| Claim substantiation hygiene | 10% | Superlatives without qualification flagged for review |
| External presence connection | 6% | Intentional links to official profiles |
| Operational consistency | 5% | Cross-page contradictions (copyright year alone is not freshness) |
| Secure-decision context | 3% | Payment provider context near sensitive fields (HTTPS scored in Technical) |

---

### 4. Usability and Accessibility (20%)

**Purpose:** Task-supporting structure and interaction accessibility from browser evidence. **Not** a WCAG conformance audit. **Not** a usability test with real users.

| Check | Weight | What we look for |
|-------|--------|------------------|
| Information architecture | 15% | Important pages discoverable from crawl relationships |
| Primary-navigation quality | 20% | Nav controls with visible or accessible labels |
| Mobile task usability | 15% | Critical tasks usable at mobile viewport |
| Interaction accessibility | 15% | Named, focusable critical controls |
| Image accessibility | 10% | Purpose-appropriate alt text; decorative `alt=""` accepted |
| Page structure and scanability | 10% | Heading hierarchy supports scanning |
| Link and button clarity | 5% | No empty critical controls |
| Form interaction usability | 5% | Labels, required indicators, field geometry |
| Feedback and error communication | 3% | Validation patterns without triggering submissions |
| Cross-device task continuity | 2% | Essential tasks available across viewports |

**Note:** Lighthouse accessibility, CLS, TBT, and PageSpeed performance are scored in **Technical Foundation**, not here.

---

### 5. Brand and Visual Consistency (10%)

**Purpose:** Recognizable identity and consistency of hierarchy, components, colours, typography, and cross-device presentation.

| Check | Weight | What we look for |
|-------|--------|------------------|
| Brand identity consistency | 15% | Business name alignment across titles and pages |
| Visual hierarchy consistency | 15% | Heading, copy, and CTA emphasis (screenshot-assisted) |
| Logo usage quality | 10% | Visible logo with accessible naming context |
| CTA-system consistency | 10% | Equivalent intent classes use consistent labels |
| Contact-detail integrity | 5% | Normalized contact values when present |
| Imagery consistency | 10% | Broken or placeholder images |
| Design-system consistency | 15% | Comparable component styling (screenshot-assisted) |
| Colour-palette consistency | 5% | Role-based colour continuity |
| Typography consistency | 5% | Font family and role continuity |
| Spacing/component rhythm | 5% | Section gaps and padding rhythm |
| Desktop/mobile continuity | 5% | Brand recognizable across viewports |

**Requirement:** Visual checks need screenshots. Without them, affected checks are marked **unavailable** and reduce coverage.

---

### 6. Content Completeness and Usefulness (10%)

**Purpose:** Useful decision-support information — **not** word count or keyword density.

| Check | Weight | What we look for |
|-------|--------|------------------|
| Homepage decision-support | 20% | Offer, audience, outcomes, proof, next step in main content |
| Service-detail usefulness | 20% | Specific descriptions, scope, outcomes, process |
| About credibility content | 10% | Meaningful identity and experience |
| Contact expectation clarity | 10% | Methods, hours, response expectations |
| Search-snippet completeness | 10% | Descriptive title and meta on indexable pages |
| Descriptive section headings | 5% | Headings communicate subject when scanned |
| Main-content similarity | 10% | Duplicate content across important pages |
| Date integrity | 5% | Meaningful dates on time-sensitive content only |
| Content integrity | 5% | No placeholder, token, or template text |
| Content-to-intent alignment | 3% | Title, heading, and body align |
| Important-detail completeness | 2% | Business-type-specific details |

**Removed in v2:** “Freshness” scoring based on copyright year or words like “latest” — these do not prove currency.

---

### 7. Technical Foundation (15%)

**Purpose:** Performance, crawl health, transport security, and Lighthouse technical screens.

| Check | Weight | Thresholds |
|-------|--------|------------|
| Mobile performance | 15% | Lighthouse: 90–100 pass, 50–89 partial, 0–49 fail |
| Desktop performance | 10% | Same thresholds |
| Automated accessibility screen | 10% | Same thresholds; **not WCAG conformance** |
| Best-practice screen | 5% | Same thresholds; **not a security audit** |
| Technical SEO screen | 5% | Same thresholds; **not ranking prediction** |
| Field performance (CrUX) | 15% | LCP ≤2.5s good; INP ≤200ms good; CLS ≤0.1 good |
| Lab layout stability (CLS) | 5% | ≤0.1 pass, ≤0.25 partial, >0.25 fail |
| Lab main-thread blocking (TBT) | 5% | ≤200ms pass, ≤600ms partial, >600ms fail |
| Transport security | 5% | HTTPS on final homepage URL |
| Crawl/response integrity | 10% | Homepage success, failed pages, crawl completion |
| Indexability/canonical | 5% | Visible metadata signals |
| Robots/sitemap discoverability | 3% | Expanded in future crawl capture |
| Mobile viewport | 2% | Viewport configuration |
| Resource-loading integrity | 5% | Critical resource failures within crawl scope |

**v2 fix:** A Lighthouse score of 20 is **failed**, not passed. Low scores never appear as strengths.

---

## Business type applicability

The scorer detects a likely business type from crawl evidence:

`local_service` · `professional_service` · `ecommerce` · `restaurant_hospitality` · `healthcare` · `portfolio` · `nonprofit` · `saas` · `informational_publisher` · `unknown`

Type-specific checks (e.g. location for local services, credentials for healthcare) are marked **not applicable** when irrelevant. Low-confidence detection uses conservative shared checks; type-dependent requirements may be **unavailable** rather than assumed.

---

## Evidence and audit inputs

| Input | Used for |
|-------|----------|
| **Playwright crawl** | Visible text, headings, buttons, forms, images, links, page types, HTTP status |
| **PageSpeed (mobile + desktop)** | Lighthouse scores, lab CLS/TBT, CrUX field data when available |
| **Screenshots** | Visual hierarchy, design system, brand continuity (when captured) |
| **Stored website record** | Business name, industry, location for cross-checking |

Evidence is tied to the same `websiteId` and `auditRunId`. Scorers do **not** re-crawl during scoring.

### Preview vs production

On Vercel preview deployments:

- MongoDB and Cloudinary use **separate** database/folder paths from production
- Crawl results stay in the preview database unless env vars point both environments at the same database

---

## Version history

| Version | Status | Notes |
|---------|--------|-------|
| `niceguy-v1` | Preserved | Historical audits remain readable; 56 checks, simpler confidence model |
| `niceguy-v2` | **Current** | 67 checks, evidence coverage, business-type applicability, complete-score gate, fixed technical thresholds |

When comparing audits across versions, treat scores as **not directly comparable**. The dashboard shows the scoring version on each result.

---

## Limitations requiring human review

Even a complete Nice Guy score should be reviewed by a human for:

- **Comprehension and persuasion** — whether messaging actually resonates with the target audience
- **Legal and regulatory compliance** — privacy law, advertising standards, professional licensing
- **WCAG conformance** — full accessibility audit with assistive technology testing
- **Security** — penetration testing, dependency vulnerabilities, server configuration
- **Conversion analytics** — funnel completion rates, A/B test results
- **Visual design quality** — subjective aesthetic and brand judgment
- **Claim verification** — whether testimonials, certifications, and statistics are accurate

Nice Guy Metrics surfaces **where to look** and **what was detected**. Your team decides what to act on.

---

## Questions?

For questions about a specific audit result, contact the Nice Guy Web Design team. For implementation details, see the developer documentation in [`README.md`](./README.md).

**Disclaimer:** Nice Guy Metrics is a deterministic and evidence-based website screening system. Some visual observations may be AI-assisted and are labelled separately. Results reflect the pages and resources successfully inspected during this audit and are not a guarantee of accessibility, legal compliance, search ranking, business credibility, or conversion performance.
