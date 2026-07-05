/**
 * Generates thin re-export stubs for Valley Interlocking content modules from JSON.
 * Run after updating valley-interlocking-site-content.json:
 *   npx tsx scripts/sync-valley-interlocking-from-json.ts
 */
import fs from "node:fs";
import path from "node:path";

import siteContent from "../components/templates/demos/valley-interlocking/valley-interlocking-site-content.json";

const VI_DIR = path.join(
  process.cwd(),
  "components/templates/demos/valley-interlocking",
);

type RouteMap = {
  file: string;
  route: keyof typeof siteContent.pages;
  exportKeys: string[];
  typeExports?: boolean;
};

const ROUTES: RouteMap[] = [
  {
    file: "valleyInterlockingAboutContent.ts",
    route: "/about-valley-interlock",
    exportKeys: ["VI_ABOUT_PAGE", "VI_ABOUT_CTA_AFTER_MISSION", "VI_ABOUT_CTA_BANNER"],
    typeExports: true,
  },
  {
    file: "valleyInterlockingTorontoContent.ts",
    route: "/valley-interlocking-landscaping-toronto",
    exportKeys: ["VI_TORONTO_LOCATION", "VI_TORONTO_SERVICES_CTA", "VI_TORONTO_FINAL_CTA"],
  },
  {
    file: "valleyInterlockingTorontoFaqContent.ts",
    route: "/valley-interlocking-landscaping-toronto",
    exportKeys: ["VI_TORONTO_FAQ_PAGE", "VI_TORONTO_FAQS"],
  },
  {
    file: "valleyInterlockingEdmontonContent.ts",
    route: "/valley-interlocking-landscaping-edmonton",
    exportKeys: ["VI_EDMONTON_LOCATION", "VI_EDMONTON_SERVICES_CTA", "VI_EDMONTON_FINAL_CTA"],
  },
  {
    file: "valleyInterlockingEdmontonFaqContent.ts",
    route: "/valley-interlocking-landscaping-edmonton",
    exportKeys: ["VI_EDMONTON_FAQ_PAGE", "VI_EDMONTON_FAQS"],
  },
  {
    file: "valleyInterlockingInterlockingContent.ts",
    route: "/interlocking-paving-stone-installation",
    exportKeys: [
      "VI_INTERLOCKING_SERVICE",
      "VI_INTERLOCKING_BENEFITS_CTA",
      "VI_INTERLOCKING_QUALITIES_CTA",
    ],
  },
  {
    file: "valleyInterlockingInterlockingFaqContent.ts",
    route: "/interlocking-paving-stone-installation",
    exportKeys: ["VI_INTERLOCKING_FAQ_PAGE", "VI_INTERLOCKING_FAQS"],
  },
  {
    file: "valleyInterlockingLandscapingContent.ts",
    route: "/landscaping-services",
    exportKeys: ["VI_LANDSCAPING_SERVICE", "VI_LANDSCAPING_OPTIONS_CTA", "VI_LANDSCAPING_SECOND_CTA"],
  },
  {
    file: "valleyInterlockingLandscapingFaqContent.ts",
    route: "/landscaping-services",
    exportKeys: ["VI_LANDSCAPING_FAQ_PAGE", "VI_LANDSCAPING_FAQS"],
  },
  {
    file: "valleyInterlockingLightingContent.ts",
    route: "/landscape-lighting",
    exportKeys: [
      "VI_LIGHTING_BODY_COPY",
      "VI_LIGHTING_SERVICE",
      "VI_LIGHTING_LED_CTA",
      "VI_LIGHTING_CTA",
    ],
  },
  {
    file: "valleyInterlockingLightingFaqContent.ts",
    route: "/landscape-lighting",
    exportKeys: ["VI_LIGHTING_FAQ_PAGE", "VI_LIGHTING_FAQS"],
  },
  {
    file: "valleyInterlockingPatioContent.ts",
    route: "/patio-installation-services",
    exportKeys: ["VI_PATIO_CTA", "VI_PATIO_DESIGN_CTA", "VI_PATIO_SERVICE"],
  },
  {
    file: "valleyInterlockingPatioFaqContent.ts",
    route: "/patio-installation-services",
    exportKeys: ["VI_PATIO_FAQ_PAGE", "VI_PATIO_FAQS"],
  },
  {
    file: "valleyInterlockingPorchContent.ts",
    route: "/porch-toronto",
    exportKeys: ["VI_PORCH_STYLES_CTA", "VI_PORCH_BUILD_CTA", "VI_PORCH_SERVICE"],
  },
  {
    file: "valleyInterlockingPorchFaqContent.ts",
    route: "/porch-toronto",
    exportKeys: ["VI_PORCH_FAQ_PAGE", "VI_PORCH_FAQS"],
  },
  {
    file: "valleyInterlockingPergolaContent.ts",
    route: "/pergola-toronto",
    exportKeys: ["VI_PERGOLA_SERVICE", "VI_PERGOLA_DESIGNED_CTA", "VI_PERGOLA_BUILD_CTA"],
  },
  {
    file: "valleyInterlockingPergolaFaqContent.ts",
    route: "/pergola-toronto",
    exportKeys: ["VI_PERGOLA_FAQ_PAGE", "VI_PERGOLA_FAQS"],
  },
  {
    file: "valleyInterlockingDrivewayContent.ts",
    route: "/driveway-paving",
    exportKeys: ["VI_DRIVEWAY_SERVICE", "VI_DRIVEWAY_BENEFITS_CTA", "VI_DRIVEWAY_MAINTENANCE_CTA"],
  },
  {
    file: "valleyInterlockingDrivewayFaqContent.ts",
    route: "/driveway-paving",
    exportKeys: ["VI_DRIVEWAY_FAQ_PAGE", "VI_DRIVEWAY_FAQS"],
  },
  {
    file: "valleyInterlockingLawnCareContent.ts",
    route: "/lawn-care-turf-fitting-services",
    exportKeys: [
      "VI_LAWN_CARE_SERVICE",
      "VI_LAWN_CARE_101",
      "VI_LAWN_CARE_101_CTA",
      "VI_LAWN_CARE_CTA",
    ],
  },
  {
    file: "valleyInterlockingLawnCareFaqContent.ts",
    route: "/lawn-care-turf-fitting-services",
    exportKeys: ["VI_LAWN_CARE_FAQ_PAGE", "VI_LAWN_CARE_FAQS"],
  },
  {
    file: "valleyInterlockingBackyardContent.ts",
    route: "/backyard-landscaping",
    exportKeys: [
      "VI_BACKYARD_SERVICE",
      "VI_BACKYARD_OUTDOOR_LIVING_CTA",
      "VI_BACKYARD_SMALL_BACKYARD_CTA",
    ],
  },
  {
    file: "valleyInterlockingBackyardFaqContent.ts",
    route: "/backyard-landscaping",
    exportKeys: ["VI_BACKYARD_FAQ_PAGE", "VI_BACKYARD_FAQS"],
  },
  {
    file: "valleyInterlockingHowToLayInterlockingContent.ts",
    route: "/resources/how-to-lay-interlocking-stones",
    exportKeys: [
      "VI_HOW_TO_LAY_INTERLOCKING",
      "VI_HOW_TO_LAY_INTERLOCKING_PATH",
      "VI_HOW_TO_LAY_INTERLOCKING_SLUG",
    ],
  },
  {
    file: "valleyInterlockingLandscapePlanningContent.ts",
    route: "/resources/landscape-planning-guide",
    exportKeys: [
      "VI_LANDSCAPE_PLANNING",
      "VI_LANDSCAPE_PLANNING_PATH",
      "VI_LANDSCAPE_PLANNING_SLUG",
    ],
  },
  {
    file: "valleyInterlockingLandscapeLightingInstallContent.ts",
    route: "/resources/how-to-install-landscape-lighting",
    exportKeys: [
      "VI_LANDSCAPE_LIGHTING_INSTALL",
      "VI_LANDSCAPE_LIGHTING_INSTALL_PATH",
      "VI_LANDSCAPE_LIGHTING_INSTALL_SLUG",
    ],
  },
  {
    file: "valleyInterlockingPatioDesignGuideContent.ts",
    route: "/resources/how-to-design-the-perfect-patio",
    exportKeys: ["VI_PATIO_DESIGN_GUIDE", "VI_PATIO_DESIGN_GUIDE_PATH", "VI_PATIO_DESIGN_GUIDE_SLUG"],
  },
  {
    file: "valleyInterlockingPorchBuildGuideContent.ts",
    route: "/resources/how-to-build-a-porch",
    exportKeys: ["VI_PORCH_BUILD_GUIDE", "VI_PORCH_BUILD_GUIDE_PATH", "VI_PORCH_BUILD_GUIDE_SLUG"],
  },
  {
    file: "valleyInterlockingPergolaBuildGuideContent.ts",
    route: "/resources/how-to-build-a-pergola",
    exportKeys: [
      "VI_PERGOLA_BUILD_GUIDE",
      "VI_PERGOLA_BUILD_GUIDE_PATH",
      "VI_PERGOLA_BUILD_GUIDE_SLUG",
    ],
  },
  {
    file: "valleyInterlockingDrivewayPavingGuideContent.ts",
    route: "/resources/how-to-choose-driveway-paving",
    exportKeys: [
      "VI_DRIVEWAY_PAVING_GUIDE",
      "VI_DRIVEWAY_PAVING_GUIDE_PATH",
      "VI_DRIVEWAY_PAVING_GUIDE_SLUG",
    ],
  },
  {
    file: "valleyInterlockingLawnCareMaintenanceGuideContent.ts",
    route: "/resources/how-to-maintain-your-lawn",
    exportKeys: [
      "VI_LAWN_CARE_MAINTENANCE_GUIDE",
      "VI_LAWN_CARE_MAINTENANCE_GUIDE_PATH",
      "VI_LAWN_CARE_MAINTENANCE_GUIDE_SLUG",
    ],
  },
  {
    file: "valleyInterlockingBackyardDesignGuideContent.ts",
    route: "/resources/how-to-design-your-backyard",
    exportKeys: [
      "VI_BACKYARD_DESIGN_GUIDE",
      "VI_BACKYARD_DESIGN_GUIDE_PATH",
      "VI_BACKYARD_DESIGN_GUIDE_SLUG",
    ],
  },
];

function buildModule({ file, route, exportKeys, typeExports }: RouteMap): string {
  const page = siteContent.pages[route] as Record<string, unknown>;
  const missing = exportKeys.filter((key) => page[key] === undefined);
  if (missing.length > 0) {
    throw new Error(`${file}: missing keys in JSON for ${route}: ${missing.join(", ")}`);
  }

  const lines = [
    `/** Content loaded from valley-interlocking-site-content.json (${route}). */`,
    `import { viPageContent } from "./valleyInterlockingSiteContent";`,
    "",
    `const _page = viPageContent("${route}") as any;`,
    "",
    ...exportKeys.map((key) => `export const ${key}: any = _page.${key};`),
  ];

  if (typeExports) {
    lines.push(
      "",
      "export type ViAboutCtaBannerContent = {",
      "  readonly eyebrow?: string;",
      "  readonly headline: string;",
      "  readonly description: string;",
      "  readonly cta: { readonly label: string; readonly url: string };",
      "  readonly secondaryCta?: { readonly label: string; readonly url: string };",
      "};",
      "export type ViCtaBannerContent = ViAboutCtaBannerContent;",
    );
  }

  lines.push("");
  return lines.join("\n");
}

for (const entry of ROUTES) {
  fs.writeFileSync(path.join(VI_DIR, entry.file), buildModule(entry), "utf8");
  console.log(`Updated ${entry.file}`);
}

fs.writeFileSync(
  path.join(VI_DIR, "valleyInterlockingFaqContent.ts"),
  `/** Home FAQ — loaded from valley-interlocking-site-content.json. */\nexport { VI_FAQS } from "./valleyInterlockingSiteContent";\n`,
  "utf8",
);

fs.writeFileSync(
  path.join(VI_DIR, "valleyInterlockingData.ts"),
  `/** Shared Valley demo lists — loaded from valley-interlocking-site-content.json. */\nexport {\n  VI_SERVICE_AREAS,\n  VI_GALLERY_ITEMS,\n  VI_GALLERY_CTA,\n  VI_TEAM_CTA,\n  VI_HOME_SERVICES_INTRO,\n  VI_HOME_GET_INSPIRED_CTA,\n  VI_SERVICES_CTA,\n  VI_HOME_SERVICES,\n  VI_PROCESS_STEPS,\n  VI_SERVICES_MASONRY,\n  VI_ALL_ASPECTS_COVERED,\n  VI_ASPECT_ICONS,\n  VI_ABOUT_SERVICES,\n  VI_ABOUT_PROMISES,\n  VI_TORONTO_GTA,\n  VI_TORONTO_SERVICES,\n  VI_TORONTO_PROCESS,\n  VI_EDMONTON_CLIMATE,\n  VI_EDMONTON_SERVICES,\n  VI_EDMONTON_REGIONS,\n  VI_EDMONTON_TESTIMONIALS,\n  VI_CUSTOMER_TESTIMONIALS_SECTION,\n  VI_PATIO_MATERIALS,\n  VI_PATIO_ROOFING,\n  VI_LAWN_SERVICES,\n  VI_DRIVEWAY_MATERIALS,\n  VI_DRIVEWAY_ROI,\n  VI_PERGOLA_STYLES,\n  VI_LANDSCAPING_FAQ,\n  VI_BACKYARD_PHASES,\n  VI_LIGHTING_TECHNIQUES,\n  VI_QUOTE_LOCATIONS,\n  VI_QUOTE_SERVICES,\n  VI_QUOTE_NEXT_STEPS,\n} from "./valleyInterlockingSiteContent";\n`,
  "utf8",
);

fs.writeFileSync(
  path.join(VI_DIR, "valleyInterlockingImages.ts"),
  `/** Image URLs — loaded from valley-interlocking-site-content.json. */\nexport { VI_IMG } from "./valleyInterlockingSiteContent";\n`,
  "utf8",
);

console.log("Updated shared re-export modules");
