/**
 * Exports Valley Interlocking demo content to JSON organized by route,
 * with placeholder company data applied.
 *
 * Run: npx tsx scripts/build-valley-interlocking-site-json.ts
 */
import fs from "node:fs";
import path from "node:path";

import * as AboutContent from "../components/templates/demos/valley-interlocking/valleyInterlockingAboutContent";
import * as BackyardContent from "../components/templates/demos/valley-interlocking/valleyInterlockingBackyardContent";
import * as BackyardFaq from "../components/templates/demos/valley-interlocking/valleyInterlockingBackyardFaqContent";
import * as DrivewayContent from "../components/templates/demos/valley-interlocking/valleyInterlockingDrivewayContent";
import * as DrivewayFaq from "../components/templates/demos/valley-interlocking/valleyInterlockingDrivewayFaqContent";
import * as EdmontonContent from "../components/templates/demos/valley-interlocking/valleyInterlockingEdmontonContent";
import * as EdmontonFaq from "../components/templates/demos/valley-interlocking/valleyInterlockingEdmontonFaqContent";
import * as HowToLayContent from "../components/templates/demos/valley-interlocking/valleyInterlockingHowToLayInterlockingContent";
import * as InterlockingContent from "../components/templates/demos/valley-interlocking/valleyInterlockingInterlockingContent";
import * as InterlockingFaq from "../components/templates/demos/valley-interlocking/valleyInterlockingInterlockingFaqContent";
import * as LandscapingContent from "../components/templates/demos/valley-interlocking/valleyInterlockingLandscapingContent";
import * as LandscapingFaq from "../components/templates/demos/valley-interlocking/valleyInterlockingLandscapingFaqContent";
import * as LandscapeLightingInstallContent from "../components/templates/demos/valley-interlocking/valleyInterlockingLandscapeLightingInstallContent";
import * as LandscapePlanningContent from "../components/templates/demos/valley-interlocking/valleyInterlockingLandscapePlanningContent";
import * as BackyardDesignGuideContent from "../components/templates/demos/valley-interlocking/valleyInterlockingBackyardDesignGuideContent";
import * as DrivewayPavingGuideContent from "../components/templates/demos/valley-interlocking/valleyInterlockingDrivewayPavingGuideContent";
import * as LawnCareMaintenanceGuideContent from "../components/templates/demos/valley-interlocking/valleyInterlockingLawnCareMaintenanceGuideContent";
import * as PergolaBuildGuideContent from "../components/templates/demos/valley-interlocking/valleyInterlockingPergolaBuildGuideContent";
import * as PorchBuildGuideContent from "../components/templates/demos/valley-interlocking/valleyInterlockingPorchBuildGuideContent";
import * as PatioDesignGuideContent from "../components/templates/demos/valley-interlocking/valleyInterlockingPatioDesignGuideContent";
import * as LawnCareContent from "../components/templates/demos/valley-interlocking/valleyInterlockingLawnCareContent";
import * as LawnCareFaq from "../components/templates/demos/valley-interlocking/valleyInterlockingLawnCareFaqContent";
import * as LightingContent from "../components/templates/demos/valley-interlocking/valleyInterlockingLightingContent";
import * as LightingFaq from "../components/templates/demos/valley-interlocking/valleyInterlockingLightingFaqContent";
import * as PatioContent from "../components/templates/demos/valley-interlocking/valleyInterlockingPatioContent";
import * as PatioFaq from "../components/templates/demos/valley-interlocking/valleyInterlockingPatioFaqContent";
import * as PergolaContent from "../components/templates/demos/valley-interlocking/valleyInterlockingPergolaContent";
import * as PergolaFaq from "../components/templates/demos/valley-interlocking/valleyInterlockingPergolaFaqContent";
import * as PorchContent from "../components/templates/demos/valley-interlocking/valleyInterlockingPorchContent";
import * as PorchFaq from "../components/templates/demos/valley-interlocking/valleyInterlockingPorchFaqContent";
import * as TorontoContent from "../components/templates/demos/valley-interlocking/valleyInterlockingTorontoContent";
import * as TorontoFaq from "../components/templates/demos/valley-interlocking/valleyInterlockingTorontoFaqContent";
import {
  VI_BUSINESS_HOURS,
  VI_EMAIL,
  VI_FOOTER_HOURS,
  VI_FOOTER_QUICK_LINKS,
  VI_FOOTER_SERVICE_AREAS,
  VI_NAV_ITEMS,
  VI_NAV_SERVICES,
  VI_NOT_FOUND_LINKS,
  VI_OFFICES,
  VI_REVIEWS,
  VI_SITE_LINE1,
  VI_SITE_LINE2,
  VI_SOCIAL_LINKS,
  VI_TAGLINE,
  VI_DOMAIN,
} from "../components/templates/demos/valley-interlocking/valleyInterlockingConfig";
import * as Data from "../components/templates/demos/valley-interlocking/valleyInterlockingData";
import { VI_FAQS } from "../components/templates/demos/valley-interlocking/valleyInterlockingFaqContent";
import { VI_IMG } from "../components/templates/demos/valley-interlocking/valleyInterlockingImages";
import {
  VI_FEATURED_RESOURCE,
  VI_RESOURCE_ARTICLES,
  VI_RESOURCE_CATEGORIES,
} from "../components/templates/demos/valley-interlocking/valleyInterlockingResourcesData";
import * as Related from "../components/templates/demos/valley-interlocking/valleyInterlockingRelatedServices";
import { VI_PAGE_HERO } from "../components/templates/demos/valley-interlocking/valleyInterlockingHeroPreload";

function moduleExports(mod: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(mod).filter(
      ([key, value]) => !key.startsWith("__") && typeof value !== "function",
    ),
  );
}

const PLACEHOLDER_REPLACEMENTS: [string, string][] = [
  ["Valley Interlocking & Landscaping", "Demo Hardscape Co."],
  ["Valley Interlock & Landscaping", "Demo Hardscape Co."],
  ["Valley Interlock Landscaping", "Demo Hardscape Co."],
  ["Valley Interlocking", "Demo Hardscape Co."],
  ["Valley Interlock", "Demo Hardscape Co."],
  ["valleyinterlocklandscaping", "demohardscapeco"],
  ["valleyinterlock.com", "demo-hardscape.example"],
  ["info@valleyinterlock.com", "hello@demo-hardscape.example"],
  ["info@demo-hardscape.example", "hello@demo-hardscape.example"],
  ["https://valleyinterlock.com", "https://demo-hardscape.example"],
  ["(647) 571-4680", "(555) 010-0200"],
  ["tel:+16475714680", "tel:+15550100200"],
  ["+16475714680", "+15550100200"],
  ["(780) 202-6100", "(555) 010-0201"],
  ["tel:+17802026100", "tel:+15550100201"],
  ["+17802026100", "+15550100201"],
  ["3701 Chesswood Dr, Suite 308", "100 Placeholder Boulevard, Suite 100"],
  ["North York, ON M3J 2P6", "Sampleville, ON A1A 1A1"],
  ["6307 Elston Gate, Suite 504", "200 Example Street, Suite 200"],
  ["Edmonton, AB T6M 1L8", "Demoville, AB B2B 2B2"],
  ["Toronto Office", "East Regional Office"],
  ["Edmonton Office", "West Regional Office"],
  ["Toronto, Canada", "East Region, Demo Country"],
  ["Edmonton, Canada", "West Region, Demo Country"],
  ["View Toronto Office", "View East Regional Office"],
  ["View Edmonton Office", "View West Regional Office"],
  ["Toronto & GTA", "East Region & Metro"],
  ["Toronto Area", "East Region"],
  ["Edmonton Area", "West Region"],
  ["Toronto / GTA", "East Region / Metro"],
  ["Explore Toronto", "Explore East Region"],
  ["Explore Edmonton", "Explore West Region"],
  ["About Valley Interlock", "About Demo Hardscape Co."],
  ["Why Homeowners Choose Valley Interlock", "Why Homeowners Choose Demo Hardscape Co."],
  ["Sherwood Park", "Sample Town A"],
  ["St. Albert", "Sample Town B"],
  ["Windermere", "Sample Town C"],
  ["Mississauga", "Metro Place 1"],
  ["Oakville", "Metro Place 2"],
  ["Vaughan", "Metro Place 3"],
  ["Ajax", "Metro Place 4"],
  ["Brampton", "Metro Place 5"],
  ["Burlington", "Metro Place 6"],
  ["Guelph", "Metro Place 7"],
  ["Richmond Hill", "Metro Place 8"],
  ["Hamilton", "Metro Place 9"],
  ["Markham", "Metro Place 10"],
  ["Newmarket", "Metro Place 11"],
  ["Edgemont", "West Place 1"],
  ["Beaumont", "West Place 2"],
  ["Stony Plain", "West Place 3"],
  ["Devon", "West Place 4"],
  ["Spruce Grove", "West Place 5"],
  ["Leduc", "West Place 6"],
  ["Fort Saskatchewan", "West Place 7"],
  ["647-571-4680", "555-010-0200"],
  ["780-202-6100", "555-010-0201"],
  ["Valley built", "Demo Hardscape Co. built"],
  ["Toronto and Edmonton", "the East and West regions"],
  ["Toronto or Edmonton", "either regional office"],
  ["Toronto's", "the East Region's"],
  ["Edmonton's", "the West Region's"],
  [" in Toronto", " in the East Region"],
  [" in Edmonton", " in the West Region"],
  ["Toronto property", "East Region property"],
  ["Toronto Location", "East Region Location"],
  ["Demo Hardscape Co. Toronto", "Demo Hardscape Co. East Region"],
  ["Demo Hardscape Co. Edmonton", "Demo Hardscape Co. West Region"],
  ["Services - Toronto", "Services - East Region"],
  ["Services - Edmonton", "Services - West Region"],
  ["Bringing Excellence to Edmonton", "Bringing Excellence to the West Region"],
  ["from Toronto to the Edmonton", "from the East Region to the West Region"],
  ["Toronto community", "East Region community"],
  ["Edmonton community", "West Region community"],
  ["Edmonton Homeowner", "West Region Homeowner"],
  ["Edmonton Resident", "West Region Resident"],
  ["neighbourhoods in Toronto", "neighbourhoods in the East Region"],
  ["Whether you're in Toronto or Edmonton", "Whether you're in the East or West region"],
  ["Toronto,", "East Region,"],
  ["Toronto ", "East Region "],
  ["Edmonton ", "West Region "],
  ["Toronto", "East Metro"],
  ["Edmonton", "West Metro"],
];

function applyPlaceholders(value: string): string {
  let out = value;
  for (const [from, to] of PLACEHOLDER_REPLACEMENTS) {
    out = out.split(from).join(to);
  }
  return out;
}

function deepPlaceholder<T>(input: T): T {
  if (typeof input === "string") {
    return applyPlaceholders(input) as T;
  }
  if (Array.isArray(input)) {
    return input.map((item) => deepPlaceholder(item)) as T;
  }
  if (input !== null && typeof input === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(input)) {
      out[key] = deepPlaceholder(val);
    }
    return out as T;
  }
  return input;
}

const HOME_PAGE = {
  metadata: {
    title: "Demo Hardscape Co. | Premium Outdoor Craftsmanship",
    description:
      "Demo template for a hardscape and landscaping company — interlocking, patios, lighting, and full-yard design in placeholder regional markets.",
  },
  hero: {
    headline: "Beautiful Outdoor Spaces Start Here.",
    subhead:
      "Welcome to Demo Hardscape Co. – Your Premier Landscaping Experts, specializing in enduring stone work and bespoke garden designs.",
    heroImageAlt: "Interlocking stone driveway installation by Demo Hardscape Co.",
    ctas: [
      { label: "Explore East Region", pathKey: "toronto" },
      { label: "Explore West Region", pathKey: "edmonton" },
    ],
  },
  locationsSection: {
    heading: "Serving Our Local Communities",
    cards: [
      {
        title: "East Region & Metro",
        description:
          "Custom interlocking and landscape construction for placeholder regional properties.",
        imageKey: "home.toronto",
        alt: "Aerial view of a residential neighborhood with interlocking driveways",
        pathKey: "toronto",
      },
      {
        title: "West Region & Area",
        description: "Hardy, beautiful outdoor living spaces designed for varied climates.",
        imageKey: "home.edmonton",
        alt: "Estate with limestone retaining walls and grand patio staircase",
        pathKey: "edmonton",
      },
    ],
  },
};

const CONTACT_PAGE = {
  metadata: {
    title: "Contact Demo Hardscape Co.",
    description: "Reach our demo regional offices to discuss your outdoor project.",
  },
  hero: {
    headline: "Get in Touch",
    subhead:
      "Transforming your outdoor living space begins with a conversation. Reach out to our expert team in the East or West region to discuss your vision.",
  },
};

const TEAM_PAGE = {
  metadata: {
    title: "Our Team | Demo Hardscape Co.",
    description: "Meet the craftspeople behind Demo Hardscape Co.",
  },
  hero: {
    headline: "Meet Our Team",
    subhead:
      "Certified craftspeople and designers serving the East and West regions — dedicated to transforming outdoor spaces with precision, care, and lasting quality.",
    heroImageAlt: "Skilled Demo Hardscape Co. landscaper at work",
    sectionImageAlt: "Demo Hardscape Co. landscaping crew at work on a residential project",
  },
};

const GALLERY_PAGE = {
  metadata: {
    title: "Gallery | Demo Hardscape Co.",
    description: Data.VI_GALLERY_CTA.description,
  },
  hero: {
    headlineLines: ["See What's Possible", "For Your Home."],
    subhead:
      "A showcase of completed landscaping, interlocking, driveway, patio, pool, porch, pergola, and outdoor living projects across the East and West regions.",
    heroImageAlt: "Completed Demo Hardscape Co. landscaping project",
  },
};

const siteContent = deepPlaceholder({
  site: {
    name: { line1: VI_SITE_LINE1, line2: VI_SITE_LINE2 },
    tagline: VI_TAGLINE,
    email: VI_EMAIL,
    domain: VI_DOMAIN,
    social: VI_SOCIAL_LINKS,
    offices: VI_OFFICES,
    businessHours: VI_BUSINESS_HOURS,
    footerHours: VI_FOOTER_HOURS,
    reviews: VI_REVIEWS,
    footerServiceAreas: VI_FOOTER_SERVICE_AREAS,
    nav: { items: VI_NAV_ITEMS, services: VI_NAV_SERVICES },
    footerQuickLinks: VI_FOOTER_QUICK_LINKS,
    notFoundLinks: VI_NOT_FOUND_LINKS,
  },
  shared: {
    images: VI_IMG,
    heroPreload: VI_PAGE_HERO,
    homeFaqs: VI_FAQS,
    data: { ...Data },
    relatedServices: { ...Related },
    resourceCategories: VI_RESOURCE_CATEGORIES,
    featuredResource: VI_FEATURED_RESOURCE,
    resourceArticles: VI_RESOURCE_ARTICLES,
  },
  pages: {
    "/": HOME_PAGE,
    "/about-valley-interlock": {
      metadata: {
        title: "About Demo Hardscape Co.",
        description: AboutContent.VI_ABOUT_PAGE.name,
      },
      ...moduleExports(AboutContent),
    },
    "/the-team": TEAM_PAGE,
    "/our-services": {
      metadata: {
        title: "Our Services | Demo Hardscape Co.",
        description: Data.VI_SERVICES_CTA.description,
      },
    },
    "/our-work-valley-interlock": GALLERY_PAGE,
    "/contact-valley-interlock": CONTACT_PAGE,
    "/valley-interlocking-landscaping-toronto": {
      ...moduleExports(TorontoContent),
      ...moduleExports(TorontoFaq),
    },
    "/valley-interlocking-landscaping-edmonton": {
      ...moduleExports(EdmontonContent),
      ...moduleExports(EdmontonFaq),
    },
    "/interlocking-paving-stone-installation": {
      ...moduleExports(InterlockingContent),
      ...moduleExports(InterlockingFaq),
    },
    "/landscaping-services": {
      ...moduleExports(LandscapingContent),
      ...moduleExports(LandscapingFaq),
    },
    "/landscape-lighting": {
      ...moduleExports(LightingContent),
      ...moduleExports(LightingFaq),
    },
    "/patio-installation-services": {
      ...moduleExports(PatioContent),
      ...moduleExports(PatioFaq),
    },
    "/porch-toronto": {
      ...moduleExports(PorchContent),
      ...moduleExports(PorchFaq),
    },
    "/pergola-toronto": {
      ...moduleExports(PergolaContent),
      ...moduleExports(PergolaFaq),
    },
    "/driveway-paving": {
      ...moduleExports(DrivewayContent),
      ...moduleExports(DrivewayFaq),
    },
    "/lawn-care-turf-fitting-services": {
      ...moduleExports(LawnCareContent),
      ...moduleExports(LawnCareFaq),
    },
    "/backyard-landscaping": {
      ...moduleExports(BackyardContent),
      ...moduleExports(BackyardFaq),
    },
    "/resources": {
      metadata: {
        title: "Resources | Demo Hardscape Co.",
        description: "Installation guides, maintenance tips, and design resources.",
      },
    },
    "/resources/how-to-lay-interlocking-stones": moduleExports(HowToLayContent),
    "/resources/landscape-planning-guide": moduleExports(LandscapePlanningContent),
    "/resources/how-to-install-landscape-lighting": moduleExports(LandscapeLightingInstallContent),
    "/resources/how-to-design-the-perfect-patio": moduleExports(PatioDesignGuideContent),
    "/resources/how-to-build-a-porch": moduleExports(PorchBuildGuideContent),
    "/resources/how-to-build-a-pergola": moduleExports(PergolaBuildGuideContent),
    "/resources/how-to-choose-driveway-paving": moduleExports(DrivewayPavingGuideContent),
    "/resources/how-to-maintain-your-lawn": moduleExports(LawnCareMaintenanceGuideContent),
    "/resources/how-to-design-your-backyard": moduleExports(BackyardDesignGuideContent),
  },
});

const outPath = path.join(
  process.cwd(),
  "components/templates/demos/valley-interlocking/valley-interlocking-site-content.json",
);

fs.writeFileSync(outPath, `${JSON.stringify(siteContent, null, 2)}\n`, "utf8");
console.log(`Wrote ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
