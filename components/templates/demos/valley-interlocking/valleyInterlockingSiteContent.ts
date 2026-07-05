import { loadViSiteContentDocument } from "./valleyInterlockingContentRegistry";

export type { ViRegisteredContentJson } from "./valleyInterlockingContentRegistry";
export {
  listViRegisteredContentJsonFiles,
  VI_CONTENT_REGISTRY,
} from "./valleyInterlockingContentRegistry";
export { VI_ACTIVE_CONTENT_JSON } from "./valleyInterlockingContentConfig";

const { filename: VI_LOADED_CONTENT_JSON, document: siteContentJson } = loadViSiteContentDocument();

export type ViSiteContentDocument = typeof siteContentJson;

/** Which JSON file is currently loaded (from config / env / registry). */
export const VI_LOADED_CONTENT_JSON_FILE = VI_LOADED_CONTENT_JSON;

export const VI_SITE_CONTENT = siteContentJson;

const { site } = siteContentJson;
const shared = siteContentJson.shared as any;
const pages = siteContentJson.pages as any;

export function viPageContent<R extends keyof typeof pages>(_route: R): any {
  return pages[_route];
}

export const VI_SITE_LINE1 = site.name.line1;
export const VI_SITE_LINE2 = site.name.line2;
export const VI_TAGLINE = site.tagline;
export const VI_EMAIL = site.email;
export const VI_DOMAIN = site.domain;
export const VI_SOCIAL_LINKS = site.social;
export const VI_OFFICES = site.offices;
export const VI_BUSINESS_HOURS = site.businessHours;
export const VI_FOOTER_HOURS = site.footerHours;
export const VI_REVIEWS = site.reviews;
export const VI_FOOTER_SERVICE_AREAS = site.footerServiceAreas;
export const VI_NAV_ITEMS = site.nav.items;
export const VI_NAV_SERVICES = site.nav.services;
export const VI_FOOTER_QUICK_LINKS = site.footerQuickLinks;
export const VI_NOT_FOUND_LINKS = site.notFoundLinks;

export const VI_IMG = shared.images;
export const VI_PAGE_HERO = shared.heroPreload;
export const VI_FAQS = shared.homeFaqs;
export const VI_RESOURCE_CATEGORIES = shared.resourceCategories;
export const VI_FEATURED_RESOURCE = shared.featuredResource;
export const VI_RESOURCE_ARTICLES = shared.resourceArticles;

export const VI_HOME_PAGE = pages["/"];
export const VI_CONTACT_PAGE = pages["/contact-valley-interlock"];
export const VI_TEAM_PAGE = pages["/the-team"];
export const VI_GALLERY_PAGE = pages["/our-work-valley-interlock"];

export const VI_SITE = `${site.name.line1} ${site.name.line2}`;

export function viDemoMetadataTitle(title: string): string {
  return title.includes("(demo)") ? title : `${title} (demo)`;
}

export function viDemoPageTitle(pageTitle: string): string {
  return `${pageTitle} | ${VI_SITE} (demo)`;
}

export function viRouteMetadata<R extends keyof typeof pages>(
  route: R,
): { title: string; description?: string } {
  const meta = pages[route]?.metadata;
  if (!meta) {
    return { title: viDemoMetadataTitle(VI_SITE) };
  }
  return {
    title: viDemoMetadataTitle(meta.title),
    description: meta.description,
  };
}

/** Shared lists used across multiple routes (from JSON shared.data). */
export const {
  VI_SERVICE_AREAS,
  VI_GALLERY_ITEMS,
  VI_GALLERY_CTA,
  VI_TEAM_CTA,
  VI_HOME_SERVICES_INTRO,
  VI_HOME_GET_INSPIRED_CTA,
  VI_SERVICES_CTA,
  VI_HOME_SERVICES,
  VI_PROCESS_STEPS,
  VI_SERVICES_MASONRY,
  VI_ALL_ASPECTS_COVERED,
  VI_ASPECT_ICONS,
  VI_ABOUT_SERVICES,
  VI_ABOUT_PROMISES,
  VI_TORONTO_GTA,
  VI_TORONTO_SERVICES,
  VI_TORONTO_PROCESS,
  VI_EDMONTON_CLIMATE,
  VI_EDMONTON_SERVICES,
  VI_EDMONTON_REGIONS,
  VI_EDMONTON_TESTIMONIALS,
  VI_CUSTOMER_TESTIMONIALS_SECTION,
  VI_PATIO_MATERIALS,
  VI_PATIO_ROOFING,
  VI_LAWN_SERVICES,
  VI_DRIVEWAY_MATERIALS,
  VI_DRIVEWAY_ROI,
  VI_PERGOLA_STYLES,
  VI_LANDSCAPING_FAQ,
  VI_BACKYARD_PHASES,
  VI_LIGHTING_TECHNIQUES,
  VI_QUOTE_LOCATIONS,
  VI_QUOTE_SERVICES,
  VI_QUOTE_NEXT_STEPS,
} = shared.data;

export const {
  VI_BACKYARD_RELATED_SERVICES,
  VI_LAWN_CARE_RELATED_SERVICES,
  VI_DRIVEWAY_RELATED_SERVICES,
  VI_INTERLOCKING_RELATED_SERVICES,
  VI_LANDSCAPING_RELATED_SERVICES,
  VI_LIGHTING_RELATED_SERVICES,
  VI_PATIO_RELATED_SERVICES,
  VI_PERGOLA_RELATED_SERVICES,
  VI_PORCH_RELATED_SERVICES,
  VI_RELATED_SERVICES_BY_PATH,
} = shared.relatedServices;
