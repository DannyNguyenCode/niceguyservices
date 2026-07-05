/** Content loaded from valley-interlocking-site-content.json (/about-valley-interlock). */
import { viPageContent } from "./valleyInterlockingSiteContent";

const _page = viPageContent("/about-valley-interlock") as any;

export const VI_ABOUT_PAGE: any = _page.VI_ABOUT_PAGE;
export const VI_ABOUT_CTA_AFTER_MISSION: any = _page.VI_ABOUT_CTA_AFTER_MISSION;
export const VI_ABOUT_CTA_BANNER: any = _page.VI_ABOUT_CTA_BANNER;

export type ViAboutCtaBannerContent = {
  readonly eyebrow?: string;
  readonly headline: string;
  readonly description: string;
  readonly cta: { readonly label: string; readonly url: string };
  readonly secondaryCta?: { readonly label: string; readonly url: string };
};
export type ViCtaBannerContent = ViAboutCtaBannerContent;
