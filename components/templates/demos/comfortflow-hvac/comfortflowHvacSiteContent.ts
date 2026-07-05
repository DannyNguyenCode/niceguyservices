import siteContent from "./comfortflow-hvac-site-content.json";
import servicePagesJson from "./comfortflow-hvac-service-pages.json";

export type CfhSiteContent = typeof siteContent;

export const CFH_SITE = siteContent.site;
export const CFH_NAV = siteContent.navigation;
export const CFH_FOOTER = siteContent.footer;
export const CFH_HOME = siteContent.home;
export const CFH_ABOUT = siteContent.about;
export const CFH_CONTACT = siteContent.contact;
export const CFH_RESOURCES = siteContent.resources;

export const CFH_SERVICE_PAGES = servicePagesJson.servicePages;

export type CfhServicePage = (typeof CFH_SERVICE_PAGES)[number];
export type CfhResourceArticleSlug = keyof typeof siteContent.resourceArticles;

export function cfhResourceArticle(slug: string) {
  return siteContent.resourceArticles[slug as CfhResourceArticleSlug];
}

export function cfhResourceSlugs(): string[] {
  return Object.keys(siteContent.resourceArticles);
}

export function cfhServicePage(slug: string): CfhServicePage | undefined {
  return CFH_SERVICE_PAGES.find((page) => page.slug === slug);
}

export function cfhServiceSlugs(): string[] {
  return CFH_SERVICE_PAGES.map((page) => page.slug);
}
