import siteContent from "./spark-frame-site-content.json";
import serviceDetailPagesJson from "./spark-frame-service-detail-pages.json";

export type LasNavKey = "services" | "projects" | "about" | "resources" | "contact";

export type LeaveASparkSiteContent = typeof siteContent;
export type LeaveASparkServiceDetailPages = typeof serviceDetailPagesJson;

export const LAS_SITE = siteContent.site;
export const LAS_NAV = siteContent.navigation;
export const LAS_CONTACT = siteContent.contact;
export const LAS_SOCIAL = siteContent.social;
export const LAS_FOOTER = siteContent.footer;
export const LAS_HOME = siteContent.home;
export const LAS_ABOUT = siteContent.about;
export const LAS_SERVICES_PAGE = siteContent.servicesPage;
export const LAS_PROJECTS_PAGE = siteContent.projectsPage;
export const LAS_CONTACT_PAGE = siteContent.contactPage;
export const LAS_RESOURCES_PAGE = siteContent.resourcesPage;

export const LAS_SERVICE_DETAILS = serviceDetailPagesJson;

export function lasServiceDetailSlugs(): string[] {
  return Object.keys(LAS_SERVICE_DETAILS);
}

export function lasServiceDetail(slug: string) {
  return LAS_SERVICE_DETAILS[slug as keyof typeof LAS_SERVICE_DETAILS] ?? null;
}

export function lasResourceArticle(slug: string) {
  return LAS_HOME.resources.items.find((item) => item.slug === slug) ?? null;
}

export function lasResourceSlugs(): string[] {
  return LAS_HOME.resources.items.map((item) => item.slug);
}
