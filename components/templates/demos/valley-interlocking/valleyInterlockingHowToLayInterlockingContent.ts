import { VI_PATHS } from "./valleyInterlockingConfig";
import { VI_INTERLOCKING_SERVICE } from "./valleyInterlockingInterlockingContent";
import { VI_IMG } from "./valleyInterlockingImages";

const [, , , , , , howToLay, beddingSand] = VI_INTERLOCKING_SERVICE.sections;

export const VI_HOW_TO_LAY_INTERLOCKING_SLUG = "how-to-lay-interlocking-stones" as const;

export const VI_HOW_TO_LAY_INTERLOCKING_PATH = `${VI_PATHS.resources}/${VI_HOW_TO_LAY_INTERLOCKING_SLUG}` as const;

export const VI_HOW_TO_LAY_INTERLOCKING = {
  slug: VI_HOW_TO_LAY_INTERLOCKING_SLUG,
  path: VI_HOW_TO_LAY_INTERLOCKING_PATH,
  eyebrow: "Technical Blueprint 042",
  title: howToLay.heading,
  summary:
    "A professional-grade guide for residential and commercial paving. Follow these precision steps to ensure a foundation that lasts decades without shifting or drainage failure.",
  difficulty: "High",
  duration: "3–5 Days",
  readTime: "12 min read",
  category: "Installation Guides" as const,
  heroImage: VI_IMG.resources.featured,
  heroImageAlt:
    "A landscaping artisan precisely laying charcoal grey interlocking paving stones on a prepared gravel base.",
  layeringImage: VI_IMG.resources.article.layering,
  layeringImageAlt:
    "Technical cross-section visualization of interlocking paver base layers from geotextile to joint sand.",
  layeringTitle: "Technical Layering Visualization",
  layeringCaption:
    "Each layer from the geotextile fabric to the joint sand plays a critical role in the structural integrity of the final installation.",
  steps: [
    {
      number: "01",
      title: "Excavation & Stable Base",
      content: howToLay.content[0],
      proTip: "Always check for underground utilities before you break ground. Call 811.",
      image: VI_IMG.resources.article.excavation,
      imageAlt: "Construction crew excavating a residential backyard for paver base preparation.",
      layout: "border" as const,
    },
    {
      number: "02",
      title: "Soil Compaction",
      content: howToLay.content[1],
      bullets: [...howToLay.bullets],
      badge: "Density Check: 98%",
      image: VI_IMG.resources.article.compaction,
      imageAlt: "Plate compactor running over crushed stone base for soil compaction.",
      layout: "blueprint" as const,
    },
    {
      number: "03",
      title: "Base Filling",
      content: howToLay.content[2],
      icon: "layers" as const,
      image: VI_IMG.resources.article.baseFilling,
      imageAlt: "Crushed stone aggregate base being prepared for interlocking pavers.",
      layout: "card" as const,
    },
    {
      number: "04",
      title: "Surface Preparation",
      content: howToLay.content[3],
      icon: "straighten" as const,
      image: VI_IMG.resources.article.surfacePrep,
      imageAlt: "Leveled concrete sand bedding layer prepared for paver installation.",
      layout: "card" as const,
    },
  ],
  beddingSand: {
    title: beddingSand.heading,
    content: beddingSand.content,
    ctaLabel: "Get a Professional Quote",
    ctaHref: VI_PATHS.contact,
  },
  techSpecs: [
    { label: "Standard Paver Thickness", value: "60mm – 80mm" },
    { label: "Base Slope (Min)", value: '1/4" per foot' },
    { label: "Bedding Sand Type", value: "ASTM C33" },
    { label: "Joint Sand Type", value: "Polymeric" },
  ],
  relatedServices: [
    {
      title: "Patio Installation",
      subtitle: "Outdoor Living",
      description:
        "Extend interlocking craftsmanship to patios, walkways, and entertainment zones with patterns built for daily use.",
      href: VI_PATHS.patio,
    },
    {
      title: "Driveway Paving",
      subtitle: "Residential Hardscaping",
      description:
        "Apply the same interlocking base standards to driveways — engineered for vehicle loads, drainage, and lasting curb appeal.",
      href: VI_PATHS.driveway,
    },
    {
      title: "Landscape Lighting",
      subtitle: "Hardscape Accents",
      description:
        "Illuminate pavers, steps, and retaining walls to showcase texture and improve safety after dark.",
      href: VI_PATHS.lighting,
    },
  ],
  serviceSummary:
    "Professional interlocking starts with removing unstable soil, compacting the subgrade to the right depth, filling and compacting aggregate in lifts, and screeding a level bedding sand layer with proper drainage.",
  serviceStepTitles: [
    "Excavation & Stable Base",
    "Soil Compaction",
    "Base Filling",
    "Surface Preparation",
  ],
} as const;
