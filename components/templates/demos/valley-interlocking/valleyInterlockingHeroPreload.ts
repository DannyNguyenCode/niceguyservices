import { VI_BASE, VI_PATHS } from "./valleyInterlockingConfig";
import { VI_IMG } from "./valleyInterlockingImages";

const GALLERY_HERO = VI_IMG.interlocking.gallery[0];

/** Canonical demo routes → LCP hero image for server preload and link prefetch. */
const VI_HERO_BY_PATH: Record<string, string> = {
  [VI_PATHS.about]: VI_IMG.about.hero,
  [VI_PATHS.services]: VI_IMG.services.hero,
  [VI_PATHS.gallery]: GALLERY_HERO,
  [VI_PATHS.toronto]: VI_IMG.toronto.hero,
  [VI_PATHS.edmonton]: VI_IMG.edmonton.hero,
  [VI_PATHS.interlocking]: VI_IMG.interlocking.hero,
  [VI_PATHS.landscaping]: VI_IMG.landscaping.hero,
  [VI_PATHS.lighting]: VI_IMG.lighting.hero,
  [VI_PATHS.patio]: VI_IMG.patio.hero,
  [VI_PATHS.porch]: VI_IMG.porch.hero,
  [VI_PATHS.pergolas]: VI_IMG.pergolas.hero,
  [VI_PATHS.driveway]: VI_IMG.driveway.hero,
  [VI_PATHS.lawnCare]: VI_IMG.lawnCare.hero,
  [VI_PATHS.backyard]: VI_IMG.backyard.hero,
  [VI_PATHS.theTeam]: VI_IMG.about.craftsman,
  [VI_PATHS.resources]: VI_IMG.resources.featured,
  [VI_PATHS.howToLayInterlocking]: VI_IMG.resources.featured,
  [VI_PATHS.landscapePlanningGuide]: VI_IMG.resources.planning.siteProgress,
  [VI_PATHS.landscapeLightingInstall]: VI_IMG.lighting.articleFeatured,
  [VI_PATHS.patioDesignGuide]: VI_IMG.patio.articleHero,
  [VI_PATHS.porchBuildGuide]: VI_IMG.porch.articleHero,
  [VI_PATHS.pergolaBuildGuide]: VI_IMG.pergolas.hero,
  [VI_PATHS.drivewayPavingGuide]: VI_IMG.driveway.hero,
  [VI_PATHS.lawnCareMaintenanceGuide]: VI_IMG.lawnCare.hero,
  [VI_PATHS.backyardDesignGuide]: VI_IMG.backyard.hero,
  [`${VI_BASE}/about`]: VI_IMG.about.hero,
  [`${VI_BASE}/services`]: VI_IMG.services.hero,
  [`${VI_BASE}/gallery`]: GALLERY_HERO,
};

export const VI_PAGE_HERO = {
  home: VI_IMG.home.hero,
  about: VI_IMG.about.hero,
  services: VI_IMG.services.hero,
  gallery: GALLERY_HERO,
  resources: VI_IMG.resources.featured,
} as const;

export function getViHeroPreloadUrl(pathname: string): string | undefined {
  const normalized = pathname.replace(/\/$/, "") || "/";
  const url = VI_HERO_BY_PATH[normalized];
  return url || undefined;
}

export function prefetchViHeroImage(pathname: string): void {
  if (typeof window === "undefined") return;
  const src = getViHeroPreloadUrl(pathname);
  if (!src) return;
  const img = new window.Image();
  img.decoding = "async";
  img.src = src;
}
