export const VI_BASE = "/template/demo/hardscape-landscaping" as const;

export {
  VI_SITE,
  VI_SITE_LINE1,
  VI_SITE_LINE2,
  VI_TAGLINE,
  VI_EMAIL,
  VI_DOMAIN,
  VI_SOCIAL_LINKS,
  VI_OFFICES,
  VI_BUSINESS_HOURS,
  VI_FOOTER_HOURS,
  VI_REVIEWS,
  VI_FOOTER_SERVICE_AREAS,
  VI_NAV_ITEMS,
  VI_NAV_SERVICES,
  VI_FOOTER_QUICK_LINKS,
  VI_NOT_FOUND_LINKS,
  viDemoMetadataTitle,
  viDemoPageTitle,
  viRouteMetadata,
} from "./valleyInterlockingSiteContent";

import { VI_NAV_ITEMS, VI_OFFICES } from "./valleyInterlockingSiteContent";

/** Production SEO paths preserved under the demo base. */
export const VI_PATHS = {
  home: VI_BASE,
  about: `${VI_BASE}/about-valley-interlock`,
  services: `${VI_BASE}/our-services`,
  contact: `${VI_BASE}/contact-valley-interlock`,
  contactLegacy: `${VI_BASE}/contact-us`,
  toronto: `${VI_BASE}/valley-interlocking-landscaping-toronto`,
  edmonton: `${VI_BASE}/valley-interlocking-landscaping-edmonton`,
  locations: `${VI_BASE}/valley-interlocking-landscaping-toronto`,
  interlocking: `${VI_BASE}/interlocking-paving-stone-installation`,
  landscaping: `${VI_BASE}/landscaping-services`,
  lighting: `${VI_BASE}/landscape-lighting`,
  patio: `${VI_BASE}/patio-installation-services`,
  porch: `${VI_BASE}/porch-toronto`,
  pergolas: `${VI_BASE}/pergola-toronto`,
  driveway: `${VI_BASE}/driveway-paving`,
  lawnCare: `${VI_BASE}/lawn-care-turf-fitting-services`,
  lawnCareLegacy: `${VI_BASE}/lawn-care-services`,
  backyard: `${VI_BASE}/backyard-landscaping`,
  gallery: `${VI_BASE}/our-work-valley-interlock`,
  galleryLegacy: `${VI_BASE}/gallery`,
  /** Quote page disabled — all quote CTAs route to contact. */
  quote: `${VI_BASE}/contact-valley-interlock`,
  theTeam: `${VI_BASE}/the-team`,
  resources: `${VI_BASE}/resources`,
  howToLayInterlocking: `${VI_BASE}/resources/how-to-lay-interlocking-stones`,
  landscapePlanningGuide: `${VI_BASE}/resources/landscape-planning-guide`,
  landscapeLightingInstall: `${VI_BASE}/resources/how-to-install-landscape-lighting`,
  patioDesignGuide: `${VI_BASE}/resources/how-to-design-the-perfect-patio`,
  porchBuildGuide: `${VI_BASE}/resources/how-to-build-a-porch`,
  pergolaBuildGuide: `${VI_BASE}/resources/how-to-build-a-pergola`,
  drivewayPavingGuide: `${VI_BASE}/resources/how-to-choose-driveway-paving`,
  lawnCareMaintenanceGuide: `${VI_BASE}/resources/how-to-maintain-your-lawn`,
  backyardDesignGuide: `${VI_BASE}/resources/how-to-design-your-backyard`,
} as const;

export const VI_SERVICE_LINKS = {
  interlocking: VI_PATHS.interlocking,
  landscaping: VI_PATHS.landscaping,
  patio: VI_PATHS.patio,
  lighting: VI_PATHS.lighting,
  porch: VI_PATHS.porch,
  pergolas: VI_PATHS.pergolas,
  driveway: VI_PATHS.driveway,
  lawnCare: VI_PATHS.lawnCare,
  backyard: VI_PATHS.backyard,
  services: VI_PATHS.services,
} as const;

export type ViServiceLinkKey = keyof typeof VI_SERVICE_LINKS;

export function viMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Map production JSON paths to canonical demo routes. */
const VI_JSON_PATH_MAP: Record<string, string> = {
  "/": VI_PATHS.home,
  "/about-valley-interlock": VI_PATHS.about,
  "/about": VI_PATHS.about,
  "/our-services": VI_PATHS.services,
  "/services": VI_PATHS.services,
  "/contact-valley-interlock": VI_PATHS.contact,
  "/contact-us": VI_PATHS.contact,
  "/contact": VI_PATHS.contact,
  "/valley-interlocking-landscaping-toronto": VI_PATHS.toronto,
  "/valley-interlocking-landscaping-edmonton": VI_PATHS.edmonton,
  "/interlocking-paving-stone-installation": VI_PATHS.interlocking,
  "/landscaping-services": VI_PATHS.landscaping,
  "/landscape-lighting": VI_PATHS.lighting,
  "/patio-installation-services": VI_PATHS.patio,
  "/porch-toronto": VI_PATHS.porch,
  "/pergola-toronto": VI_PATHS.pergolas,
  "/driveway-paving": VI_PATHS.driveway,
  "/lawn-care-turf-fitting-services": VI_PATHS.lawnCare,
  "/lawn-care-services": VI_PATHS.lawnCare,
  "/backyard-landscaping": VI_PATHS.backyard,
  "/our-work-valley-interlock": VI_PATHS.gallery,
  "/gallery": VI_PATHS.gallery,
  "/get-a-quote": VI_PATHS.contact,
  "/the-team": VI_PATHS.theTeam,
  "/resources": VI_PATHS.resources,
  "/resources/how-to-lay-interlocking-stones": VI_PATHS.howToLayInterlocking,
  "/resources/landscape-planning-guide": VI_PATHS.landscapePlanningGuide,
  "/resources/how-to-install-landscape-lighting": VI_PATHS.landscapeLightingInstall,
  "/resources/how-to-design-the-perfect-patio": VI_PATHS.patioDesignGuide,
  "/resources/how-to-build-a-porch": VI_PATHS.porchBuildGuide,
  "/resources/how-to-build-a-pergola": VI_PATHS.pergolaBuildGuide,
  "/resources/how-to-choose-driveway-paving": VI_PATHS.drivewayPavingGuide,
  "/resources/how-to-maintain-your-lawn": VI_PATHS.lawnCareMaintenanceGuide,
  "/resources/how-to-design-your-backyard": VI_PATHS.backyardDesignGuide,
};

/** Map production JSON service URLs to demo routes. */
export function viJsonServicePath(path: string): string {
  const trimmed = path.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const normalized = trimmed.replace(/\/$/, "") || "/";
  return VI_JSON_PATH_MAP[normalized] ?? `${VI_BASE}${normalized.startsWith("/") ? normalized : `/${normalized}`}`;
}

export const VI_SERVICE_DETAIL_PATHS: Record<string, string> = {
  hardscaping: VI_PATHS.interlocking,
  "outdoor-living": VI_PATHS.patio,
  maintenance: VI_PATHS.lawnCare,
  softscaping: VI_PATHS.landscaping,
  structural: VI_PATHS.porch,
};

export const VI_SERVICE_PAGE_PATHS = [
  VI_PATHS.interlocking,
  VI_PATHS.landscaping,
  VI_PATHS.lighting,
  VI_PATHS.patio,
  VI_PATHS.porch,
  VI_PATHS.pergolas,
  VI_PATHS.driveway,
  VI_PATHS.lawnCare,
  VI_PATHS.backyard,
] as const;

export function isViServicePath(pathname: string): boolean {
  const path = pathname.replace(/\/$/, "") || "/";
  return VI_SERVICE_PAGE_PATHS.some((href: any) => path === href);
}

export function isViLocationPath(pathname: string): boolean {
  const path = pathname.replace(/\/$/, "") || "/";
  return path === VI_PATHS.toronto || path === VI_PATHS.edmonton;
}

export type ViNavKey = "home" | "about" | "locations" | "services" | "gallery" | "resources" | "contact" | "quote";

export function isViNavActive(pathname: string, key: ViNavKey): boolean {
  const path = pathname.replace(/\/$/, "") || "/";
  if (key === "locations") return isViLocationPath(path);
  if (key === "gallery") return path === VI_PATHS.gallery || path === VI_PATHS.galleryLegacy;
  if (key === "resources") return path === VI_PATHS.resources || path.startsWith(`${VI_PATHS.resources}/`);
  if (key === "services") return path === VI_PATHS.services || isViServicePath(path);
  if (key === "quote") return path === VI_PATHS.quote;
  const href = VI_NAV_ITEMS.find((item: any) => item.key === key)?.href ?? VI_BASE;
  const target = href.replace(/\/$/, "") || "/";
  if (target === VI_BASE) return path === VI_BASE;
  return path === target;
}

export const VI_PRIMARY_PHONE = VI_OFFICES[0].phone;
export const VI_PRIMARY_PHONE_HREF = VI_OFFICES[0].phoneHref;
