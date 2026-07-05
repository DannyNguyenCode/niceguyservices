import { HR_IMAGES } from "@/components/templates/demos/home-restoration/homeRestorationImages";
import { LC_IMAGES } from "@/components/templates/demos/luxe-co/luxeCoImages";
import { LT_CAFE_IMAGES } from "@/components/templates/demos/looneytoons-cafe/looneytoonsCafeImages";
import { LUMINA_IMAGES } from "@/components/templates/demos/lumina-landscapes/luminaImages";
import { PMR_IMAGES } from "@/components/templates/demos/pawsmatch-rescue/pawsMatchRescueImages";
import { NEOPETS_IMAGES } from "@/components/templates/demos/neopets-nonprofit/neopetsImages";
import { SC_IMG } from "@/components/templates/demos/starlight-command/starlightImages";
import { EG_IMG } from "@/components/templates/demos/evergreen-alpine/evergreenImages";
import { SPM_IMG } from "@/components/templates/demos/saturday-pet-market/saturdayPetMarketImages";
import { KC_IMG } from "@/components/templates/demos/kinship-capital/kinshipCapitalImages";
import { SD_IMG } from "@/components/templates/demos/skyline-designs/skylineDesignsImages";
import { VI_IMG } from "@/components/templates/demos/valley-interlocking/valleyInterlockingImages";
import { PPE_IMG } from "@/components/templates/demos/power-pellet-electric/powerPelletElectricImages";
import { CFH_IMG } from "@/components/templates/demos/comfortflow-hvac/comfortflowHvacImages";
import { TMNT_IMAGES } from "@/components/templates/demos/tmnt-construction/tmntConfig";

export type DemoHeroMeta = {
  src: string;
  alt: string;
};

/** Home-page hero art per demo slug — keep in sync with each template’s home body. */
export const DEMO_HERO_BY_SLUG: Record<string, DemoHeroMeta> = {
  "neopets-nonprofit": {
    src: NEOPETS_IMAGES.homeHero,
    alt: "Happy adopted pets with people — Toronto Adopt-A-Pet demo hero",
  },
  "tmnt-trades": {
    src: TMNT_IMAGES.v2HomeHero,
    alt: "Luxury stone interlocking driveway at dusk with dramatic lighting",
  },
  "looneytunes-services": {
    src: LT_CAFE_IMAGES.heroCup,
    alt: "Stylized ceramic coffee cup on a minimalist table — cafe demo hero",
  },
  "starlight-command": {
    src: SC_IMG.homeHero,
    alt: "Toronto skyline at dusk with industrial styling (demo)",
  },
  "evergreen-alpine": {
    src: EG_IMG.heroAfter,
    alt: "Transformed residential property with interlocking patio and manicured lawn",
  },
  "lumina-landscapes": {
    src: LUMINA_IMAGES.hero,
    alt: "Cinematic luxury outdoor living space at dusk — Lumina Landscapes demo hero",
  },
  "pawsmatch-rescue": {
    src: PMR_IMAGES.hero,
    alt: "Friendly golden retriever in warm sunlight — PawsMatch Rescue demo hero",
  },
  "luxe-co": {
    src: LC_IMAGES.hero,
    alt: "Cinematic luxury home with pool at dusk — LUXE & CO. real estate demo hero",
  },
  "home-restoration": {
    src: HR_IMAGES.hero,
    alt: "Sunlit minimalist interior with architectural arches — Home Restoration demo hero",
  },
  "kinship-capital": {
    src: KC_IMG.home.hero,
    alt: "Professional financial advisors meeting with clients in a modern office — Kinship & Capital demo hero",
  },
  "saturday-pet-market": {
    src: SPM_IMG.home.hero,
    alt: "Nostalgic neighborhood pet store storefront at golden hour — Saturday Pet Market demo hero",
  },
  "skyline-designs": {
    src: SD_IMG.home.hero,
    alt: "Toronto web designer in a bright studio with CN Tower skyline — Skyline Designs demo hero",
  },
  "hardscape-landscaping": {
    src: VI_IMG.home.hero,
    alt: "Luxurious residential backyard with interlocking stone and outdoor fire pit — Demo Hardscape Co. demo hero",
  },
  "power-pellet-electric": {
    src: PPE_IMG.panelCloseup,
    alt: "Organized electrical panel with neon yellow arcade lighting — Power Pellet Electric demo hero",
  },
  "comfortflow-hvac": {
    src: CFH_IMG.networkMap,
    alt: "Smart home HVAC network map with connected comfort nodes — ComfortFlow HVAC demo hero",
  },
};
