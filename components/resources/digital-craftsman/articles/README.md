# Digital Craftsman resource articles

Shared layout for all standalone resource articles under `/resources/*`.

## Architecture

| Layer | Role |
|-------|------|
| `DigitalCraftsmanArticlePage` | Shell + mobile card + desktop 3-column grid |
| `article-ui/` | Reusable blocks (`DcH2`, `DcSection`, `DcTakeaways`, …) and shells |
| `articles/metas.ts` | SEO path, TOC, related guides, hero metadata |
| `*Mobile` / `*Desktop` | Article-specific body (sections only — no outer grid) |

## Add a new article

1. Add `yourSlugMeta` in `articles/metas.ts` (path, toc, related, dates, images).
2. Create content:
   - **Option A:** `articles/your-slug.tsx` using `article-ui` blocks (see `search-console.tsx`).
   - **Option B:** `YourSlugMobile.tsx` + `YourSlugDesktop.tsx` with section markup only.
3. Create `YourSlugStandalonePage.tsx`:

```tsx
import DigitalCraftsmanArticlePage from "../DigitalCraftsmanArticlePage";
import { yourSlugMeta } from "./metas";

export default function YourSlugStandalonePage() {
  return (
    <DigitalCraftsmanArticlePage
      meta={yourSlugMeta}
      mobile={<YourSlugMobile />}
      desktop={<YourSlugDesktop meta={yourSlugMeta} />}
      desktopFooter={<YourSlugDesktopFooter />}
    />
  );
}
```

4. Add `app/resources/your-slug/page.tsx` + `layout.tsx` (fonts layout):

```tsx
const { metadata, Page } = createArticleRoute({
  meta: yourSlugMeta,
  mobile: <YourSlugMobile meta={yourSlugMeta} />,
  desktop: <YourSlugDesktop meta={yourSlugMeta} />,
  desktopFooter: <YourSlugDesktopFooter />,
});
export { metadata };
export default Page;
```

`createArticleRoute` sets `alternates.canonical` to `absoluteUrl(meta.path)` automatically.
5. List on `app/(main)/resources/page.tsx` and `app/sitemap.ts`.

Route boilerplate (optional):

```tsx
import { createArticleMetadata, createArticleRoutePage } from "@/components/resources/digital-craftsman/createArticleRoute";
import YourSlugStandalonePage from "...";

export const metadata = createArticleMetadata(yourSlugMeta);
export default createArticleRoutePage({ meta: yourSlugMeta, ... }); // or render StandalonePage inside
```

Desktop content must **not** repeat the hero header — `DcDesktopArticleLayout` renders `DcDesktopHero` from `meta`.
