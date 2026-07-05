import siteContent from "./power-pellet-electric-site-content.json";
import serviceDetailPagesJson from "./power-pellet-electric-service-detail-pages.json";

export type PpeSiteContent = typeof siteContent;

export const PPE_CONTENT = siteContent;

export const PPE_SITE = siteContent.site;
export const PPE_NAV = siteContent.navigation;
export const PPE_MOBILE_NAV = siteContent.mobileNavigation;
export const PPE_FOOTER_LINKS = siteContent.footerLinks;
export const PPE_HOME = siteContent.home;
export const PPE_SERVICES = siteContent.services;
export const PPE_ABOUT = siteContent.about;
export const PPE_CONTACT = siteContent.contact;
export const PPE_RESOURCES = siteContent.resources;
export const PPE_SERVICE_DETAIL_PAGES = serviceDetailPagesJson.serviceDetailPages;

export type PpeServiceDetailPage = (typeof PPE_SERVICE_DETAIL_PAGES)[number];

export function ppeServiceDetail(slug: string): PpeServiceDetailPage | undefined {
  return PPE_SERVICE_DETAIL_PAGES.find((page) => page.slug === slug);
}

export function ppeServiceDetailSlugs(): string[] {
  return PPE_SERVICE_DETAIL_PAGES.map((page) => page.slug);
}

export function ppeResourceArticle(slug: string) {
  return PPE_RESOURCES.articles.find((article) => article.href.endsWith(`/${slug}`));
}
