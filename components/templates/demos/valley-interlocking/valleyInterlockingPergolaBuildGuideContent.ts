import { VI_PATHS } from "./valleyInterlockingConfig";
import { VI_IMG } from "./valleyInterlockingImages";

export const VI_PERGOLA_BUILD_GUIDE_SLUG = "how-to-build-a-pergola" as const;

export const VI_PERGOLA_BUILD_GUIDE_PATH = `${VI_PATHS.resources}/${VI_PERGOLA_BUILD_GUIDE_SLUG}` as const;

export const VI_PERGOLA_BUILD_GUIDE = {
  slug: VI_PERGOLA_BUILD_GUIDE_SLUG,
  path: VI_PERGOLA_BUILD_GUIDE_PATH,
  categoryLabel: "Architecture",
  subcategoryLabel: "Outdoor Structures",
  title: "How to Build a Pergola: A Complete Planning & Design Guide",
  serviceTitle: "How to Build a Pergola",
  description:
    "A pergola can transform your backyard into an outdoor entertainment area — but success starts with careful planning. From choosing the right location and size to selecting materials, roofing, flooring, and permits, this guide walks you through every decision before you build.",
  readTime: "7 min read",
  category: "Installation Guides" as const,
  author: {
    name: "Valley Interlocking Team",
    role: "Pergola Design Specialists",
  },
  heroImage: VI_IMG.pergolas.hero,
  heroImageAlt:
    "A wooden pergola over an interlocking stone patio with outdoor seating and landscaped garden surroundings.",
  heroCaption: "A well-placed pergola defines outdoor living without overwhelming your backyard.",
  figureBreak: {
    image: VI_IMG.pergolas.louvred,
    alt: "Louvred pergola with adjustable shade slats over a backyard patio in warm afternoon light.",
  },
  navSections: [
    { label: "Location Selection", href: "#location" },
    { label: "Size & Proportion", href: "#size" },
    { label: "Permits & Budget", href: "#permits" },
    { label: "Material Selection", href: "#materials" },
    { label: "Roofing & Flooring", href: "#roofing" },
  ],
  location: {
    id: "location",
    number: "01",
    title: "Choose the Right Location",
    body: "You need to carefully plan where the best location will be for your new pergola. As your pergola will be free-standing, the location can be either next to your home or stand alone in your garden. If you choose to have your pergola set back in your backyard, you'll have greater flexibility with design and style — it won't have to match your home or distract from it, having its very own personality. Attached pergolas create a seamless transition from indoor to outdoor living, while freestanding structures work well as focal points deeper in the yard.",
  },
  attachedVsFreestanding: {
    id: "attached",
    title: "Attached vs. Freestanding",
    body: "An attached pergola extends your home's living space and can provide shade near doors and windows. A freestanding pergola offers more design freedom and can be positioned to frame a view, define a dining zone, or create a garden retreat away from the house.",
  },
  sizeCard: {
    id: "size",
    title: "Size & Proportion",
    body: "Pergolas generally don't tend to take up a lot of space, but you'll still want one that has an adequate amount of room for you to use practically without overwhelming your backyard. Visualizing helps you determine how big it will be before you start building — mark out the size of your potential pergola with stake posts. Using Valley Interlock to help you design and build your pergola, we'll be able to advise you on the best pergola for your backyard and where the optimum location for it is.",
  },
  visualizationCard: {
    id: "visualization",
    title: "Stake-Out Visualization",
    body: "Before committing to materials or permits, use stakes and string to outline the footprint on your property. Walk through the space, test furniture placement, and check sight lines from inside the home. This simple step prevents costly changes mid-build.",
  },
  permits: {
    id: "permits",
    number: "02",
    title: "Permits & Budget Planning",
    body: "Your pergola could be exempt from building permits depending on the size and location. Whilst this is no guarantee, you should always check with your local city's building authority to make sure you apply for any necessary permits before you start building. Setting a budget is critical, as it's extremely easy to get carried away designing your pergola with exotic materials. You'll need to choose your structure material, roofing options, and then the type of flooring. With the endless options, the costs can quickly add up and blow out your budget.",
    ctaLabel: "Talk With Our Team",
    ctaHref: VI_PATHS.contact,
  },
  materials: {
    id: "materials",
    number: "03",
    title: "Material Selection",
    body: "Pergolas are available in a variety of designs, styles, and configurations. Valley Interlocking & Landscaping has the expertise and experience to show you all of your options and help you create the perfect pergola for your backyard.",
    items: [
      {
        label: "Powder-Coated Aluminum",
        detail: "Lightweight, strong, and available in over 20 colour options using modern powder-coating technology.",
      },
      {
        label: "PVC & Composite",
        detail: "Low-maintenance alternatives to wood that resist rot, insects, and weathering with minimal upkeep.",
      },
      {
        label: "Cedar & Redwood",
        detail: "Natural wood options prized for warmth and character; cedar and redwood offer natural rot resistance.",
      },
      {
        label: "Pressure-Treated Wood",
        detail: "An affordable structural choice when properly sealed and maintained for Canadian freeze-thaw cycles.",
      },
    ],
  },
  roofing: {
    id: "roofing",
    number: "04",
    title: "Roofing & Flooring Options",
    body: "With a correctly designed pergola in your backyard, you can have enough shade to make warm afternoons enjoyable whilst reading a book or entertaining. You could also add a retractable shade cover to offer protection from the elements. Roofing and flooring choices should be planned together — interlocking pavers, natural stone, or composite decking each pair differently with open-beam, louvred, or retractable roof systems.",
    options: [
      "Traditional open-beam roof",
      "Retractable fabric canopy",
      "Adjustable louvre slats",
      "Shed, pitched, or curved roof styles",
      "Interlocking stone or paver flooring",
      "Composite or wood deck surfaces",
    ],
  },
  futurePlanning: {
    id: "future",
    number: "05",
    title: "Future Landscaping & Expansion",
    body: "You should also factor your long-term plans into your new pergola design. This could just be a starting point, and you could choose to add landscaping in the future. The key to a successful pergola design is good planning. Dedicate some time to visiting the team at Valley Interlocking & Landscaping, and having them talk you through your design options and material selections.",
    planningConsiderations: [
      "Location selection",
      "Attached vs freestanding pergola",
      "Size planning",
      "Stake-out visualization",
      "Building permit requirements",
      "Budget planning",
      "Material selection",
      "Roofing options",
      "Flooring options",
      "Future landscaping plans",
      "Long-term expansion considerations",
    ],
  },
  sidebarServices: [
    {
      subtitle: "Outdoor Living",
      title: "Patio Installation",
      href: VI_PATHS.patio,
    },
    {
      subtitle: "Outdoor Structures",
      title: "Porch Construction",
      href: VI_PATHS.porch,
    },
    {
      subtitle: "Ambience & Safety",
      title: "Landscape Lighting",
      href: VI_PATHS.lighting,
    },
  ],
  featuredPartner: {
    quote: "Shade, structure, and style — built to fit your backyard.",
    name: "Valley Interlocking & Landscaping",
    description:
      "The trusted choice for custom pergola design, hardscape integration, and outdoor living projects across Toronto and Edmonton.",
    href: VI_PATHS.contact,
  },
  conclusion:
    "A well-planned pergola extends your outdoor season, adds architectural interest, and creates a defined space for entertaining — built right for how you live and the seasons where you are.",
  closing: {
    primaryLabel: "Get a Professional Quote",
    primaryHref: VI_PATHS.contact,
    secondaryLabel: "View Pergola Services",
    secondaryHref: VI_PATHS.pergolas,
  },
  relatedServices: [
    {
      title: "Patio Installation",
      subtitle: "Outdoor Living",
      description:
        "Pair your pergola with a stone or paver patio for a complete outdoor dining and entertainment zone.",
      href: VI_PATHS.patio,
    },
    {
      title: "Porch Construction",
      subtitle: "Outdoor Structures",
      description:
        "Connect a porch and pergola for layered shade, defined entryways, and cohesive architectural detail.",
      href: VI_PATHS.porch,
    },
    {
      title: "Landscape Lighting",
      subtitle: "Ambience & Safety",
      description:
        "Illuminate pergola posts, beams, and surrounding pathways to extend outdoor use well after sunset.",
      href: VI_PATHS.lighting,
    },
  ],
  serviceSummary:
    "From choosing the right location and sizing your structure to selecting materials, roofing, flooring, and securing permits — follow this guide to plan and build a pergola that fits your backyard and budget.",
  serviceStepTitles: [
    "Location Selection",
    "Size & Proportion",
    "Permits & Budget",
    "Material Selection",
    "Roofing & Flooring",
  ],
} as const;
