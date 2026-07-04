export const VI_BASE = "/template/demo/valley-interlocking" as const;

export const VI_SITE_LINE1 = "Valley Interlocking";
export const VI_SITE_LINE2 = "& Landscaping";
export const VI_SITE = `${VI_SITE_LINE1} ${VI_SITE_LINE2}`;
export const VI_TAGLINE = "Premium outdoor craftsmanship";
export const VI_EMAIL = "info@valleyinterlock.com";
export const VI_DOMAIN = "https://valleyinterlock.com";

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
  return VI_SERVICE_PAGE_PATHS.some((href) => path === href);
}

export function isViLocationPath(pathname: string): boolean {
  const path = pathname.replace(/\/$/, "") || "/";
  return path === VI_PATHS.toronto || path === VI_PATHS.edmonton;
}

export type ViNavKey = "home" | "about" | "locations" | "services" | "gallery" | "resources" | "contact" | "quote";

export const VI_NAV_ITEMS: { key: ViNavKey; href: string; label: string }[] = [
  { key: "home", href: VI_PATHS.home, label: "Home" },
  { key: "about", href: VI_PATHS.about, label: "About" },
  { key: "locations", href: VI_PATHS.locations, label: "Locations" },
  { key: "services", href: VI_PATHS.services, label: "Services" },
  { key: "gallery", href: VI_PATHS.gallery, label: "Gallery" },
  { key: "resources", href: VI_PATHS.resources, label: "Resources" },
  { key: "contact", href: VI_PATHS.contact, label: "Contact Us" },
  { key: "quote", href: VI_PATHS.quote, label: "Get A Quote" },
];

/** Individual service pages shown in the nav dropdown (hub is the Services nav label). */
export const VI_NAV_SERVICES: { label: string; href: string }[] = [
  { label: "Interlocking & Paving", href: VI_PATHS.interlocking },
  { label: "Landscaping", href: VI_PATHS.landscaping },
  { label: "Landscape Lighting", href: VI_PATHS.lighting },
  { label: "Patio", href: VI_PATHS.patio },
  { label: "Porch", href: VI_PATHS.porch },
  { label: "Pergolas", href: VI_PATHS.pergolas },
  { label: "Driveway Paving", href: VI_PATHS.driveway },
  { label: "Lawn Care & Turf", href: VI_PATHS.lawnCare },
  { label: "Backyard Landscaping", href: VI_PATHS.backyard },
];

export const VI_NOT_FOUND_LINKS: { label: string; href: string }[] = [
  { label: "Home", href: VI_PATHS.home },
  { label: "About", href: VI_PATHS.about },
  { label: "Toronto", href: VI_PATHS.toronto },
  { label: "Edmonton", href: VI_PATHS.edmonton },
  { label: "Services", href: VI_PATHS.services },
  { label: "Gallery", href: VI_PATHS.gallery },
  { label: "Resources", href: VI_PATHS.resources },
  { label: "Contact Us", href: VI_PATHS.contact },
  { label: "Get A Quote", href: VI_PATHS.quote },
];

export function isViNavActive(pathname: string, key: ViNavKey): boolean {
  const path = pathname.replace(/\/$/, "") || "/";
  if (key === "locations") return isViLocationPath(path);
  if (key === "gallery") return path === VI_PATHS.gallery || path === VI_PATHS.galleryLegacy;
  if (key === "resources") return path === VI_PATHS.resources || path.startsWith(`${VI_PATHS.resources}/`);
  if (key === "services") return path === VI_PATHS.services || isViServicePath(path);
  if (key === "quote") return path === VI_PATHS.quote;
  const href = VI_NAV_ITEMS.find((item) => item.key === key)?.href ?? VI_BASE;
  const target = href.replace(/\/$/, "") || "/";
  if (target === VI_BASE) return path === VI_BASE;
  return path === target;
}

export const VI_OFFICES = [
  {
    id: "toronto",
    name: "Toronto Office",
    address: ["3701 Chesswood Dr, Suite 308", "North York, ON M3J 2P6"],
    phone: "(647) 571-4680",
    phoneHref: "tel:+16475714680",
    email: VI_EMAIL,
    mapLabel: "View Toronto Office",
    mapLocation: "Toronto, Canada",
  },
  {
    id: "edmonton",
    name: "Edmonton Office",
    address: ["6307 Elston Gate, Suite 504", "Edmonton, AB T6M 1L8"],
    phone: "(780) 202-6100",
    phoneHref: "tel:+17802026100",
    email: VI_EMAIL,
    mapLabel: "View Edmonton Office",
    mapLocation: "Edmonton, Canada",
  },
] as const;

export const VI_PRIMARY_PHONE = VI_OFFICES[0].phone;
export const VI_PRIMARY_PHONE_HREF = VI_OFFICES[0].phoneHref;

export const VI_SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/valleyinterlocklandscaping",
  instagram: "https://www.instagram.com/valleyinterlocklandscaping",
} as const;

export const VI_FOOTER_HOURS = [
  { day: "Monday", hours: "8:30 am – 4:30 pm" },
  { day: "Tuesday", hours: "8:30 am – 4:30 pm" },
  { day: "Wednesday", hours: "8:30 am – 4:30 pm" },
  { day: "Thursday", hours: "8:30 am – 4:30 pm" },
  { day: "Friday", hours: "8:30 am – 4:30 pm" },
  { day: "Saturday", hours: "8:30 am – 2:30 pm" },
  { day: "Sunday", hours: "Closed" },
] as const;

export const VI_BUSINESS_HOURS = VI_FOOTER_HOURS;

export const VI_REVIEWS = {
  source: "Google",
  ratingLabel: "Excellent",
  rating: 5,
  reviewCount: 42,
} as const;

export const VI_FOOTER_SERVICE_AREAS = {
  toronto: {
    title: "Toronto Area",
    areas: [
      "Ajax",
      "Mississauga",
      "Brampton",
      "Newmarket",
      "Burlington",
      "Oakville",
      "Guelph",
      "Richmond Hill",
      "Hamilton",
      "Toronto",
      "Markham",
      "Vaughan",
    ],
  },
  edmonton: {
    title: "Edmonton",
    areas: [
      "St. Albert",
      "Edgemont",
      "Sherwood Park",
      "Beaumont",
      "Stony Plain",
      "Devon",
      "Spruce Grove",
      "Leduc",
      "Fort Saskatchewan",
    ],
  },
} as const;

export const VI_FOOTER_QUICK_LINKS = VI_NAV_ITEMS.filter((item) => item.key !== "quote");
