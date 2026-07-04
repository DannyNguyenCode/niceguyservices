import { VI_PATHS } from "./valleyInterlockingConfig";
import { VI_IMG } from "./valleyInterlockingImages";

export const VI_PORCH_BUILD_GUIDE_SLUG = "how-to-build-a-porch" as const;

export const VI_PORCH_BUILD_GUIDE_PATH = `${VI_PATHS.resources}/${VI_PORCH_BUILD_GUIDE_SLUG}` as const;

export const VI_PORCH_BUILD_GUIDE = {
  slug: VI_PORCH_BUILD_GUIDE_SLUG,
  path: VI_PORCH_BUILD_GUIDE_PATH,
  categoryLabel: "Architecture",
  subcategoryLabel: "Outdoor Spaces",
  title: "How to Build a Porch: An Architect's Guide to Timeless Design",
  serviceTitle: "How to Build a Porch",
  description:
    "Creating the perfect porch begins long before the first board is nailed. It requires a thoughtful synthesis of your lifestyle goals and the unique characteristics of your home's location to maximize both beauty and utility.",
  readTime: "8 min read",
  category: "Installation Guides" as const,
  author: {
    name: "Valley Interlocking Team",
    role: "Porch Design Specialists",
  },
  heroImage: VI_IMG.porch.articleHero,
  heroImageAlt:
    "A sprawling wrap-around porch with white wood railings, natural stone flooring, and warm ambient lighting in a lush garden at dusk.",
  heroCaption: "A classic wraparound design optimizes natural light and ventilation.",
  figureBreak: {
    image: VI_IMG.porch.articleMaterials,
    alt: "Close-up of premium ipe wood decking and precision-cut stone steps on a modern porch in crisp morning light.",
  },
  navSections: [
    { label: "Defining Purpose", href: "#purpose" },
    { label: "Location Strategy", href: "#location" },
    { label: "Size & Proportion", href: "#size" },
    { label: "Materials Guide", href: "#materials" },
    { label: "Permits & Budget", href: "#permits" },
  ],
  purpose: {
    id: "purpose",
    number: "01",
    title: "Define the Purpose",
    body: "The first step in any successful build is defining the \"why.\" Is your porch a morning coffee sanctuary, a grand entrance for guests, or an expansive space for summer entertaining? Defining its primary function dictates the structural requirements and final aesthetic. For professional execution, we recommend consulting experts like Valley Interlocking & Landscaping to ensure your vision aligns with structural integrity.",
  },
  location: {
    id: "location",
    number: "02",
    title: "Strategic Location & Orientation",
    body: "Orientation is paramount. A south-facing porch will be bathed in sun all day, requiring potentially more shade solutions, while a north-facing orientation offers a cool retreat. Consider the views you want to preserve and the privacy you wish to maintain from the street or neighbors.",
  },
  sizeCard: {
    id: "size",
    title: "Size & Proportion",
    body: "The scale of the porch must complement the home's architecture. Too small, and it feels like an afterthought; too large, and it can overwhelm the facade. A minimum depth of 8 feet is recommended for functional seating.",
  },
  seasonalCard: {
    id: "seasonal",
    title: "Seasonal Usage",
    body: "Consider climate-specific features such as ceiling fans for summer humidity or integrated heating elements and screens for the cooler months to extend the life of the space.",
  },
  materials: {
    id: "materials",
    number: "03",
    title: "Material Selection",
    body: "Longevity is the hallmark of luxury. Choosing durable, low-maintenance materials like composite decking, natural stone, or rot-resistant hardwoods ensures your investment stands the test of time.",
    items: [
      {
        label: "Foundation",
        detail: "Concrete piers or masonry footings for permanent stability.",
      },
      {
        label: "Flooring",
        detail: "Ipe, cedar, or premium interlocking pavers from specialists like Valley Interlocking & Landscaping.",
      },
      {
        label: "Details",
        detail: "Powder-coated aluminum or classic wrought iron railings.",
      },
    ],
  },
  permits: {
    id: "permits",
    title: "Budgets & Permits",
    body: "Never overlook the legalities. Most porches require structural permits and must adhere to local zoning setbacks. Budgeting should include a 15% contingency for site preparation and unforeseen architectural adjustments.",
    ctaLabel: "Download Planning Checklist",
    ctaHref: VI_PATHS.contact,
  },
  sidebarServices: [
    {
      subtitle: "Expert Consultation",
      title: "Landscape Architecture",
      href: VI_PATHS.landscaping,
    },
    {
      subtitle: "Construction",
      title: "Hardscape Installation",
      href: VI_PATHS.interlocking,
    },
    {
      subtitle: "Design-Build",
      title: "Custom Porch Design",
      href: VI_PATHS.porch,
    },
  ],
  featuredPartner: {
    quote: "Precision in every joint, beauty in every stone.",
    name: "Valley Interlocking & Landscaping",
    description: "The premier choice for sophisticated porch foundations and complex hardscaping projects.",
    href: VI_PATHS.contact,
  },
  conclusion:
    "A well-planned porch extends your living space, boosts curb appeal, and creates a welcoming entry — built right for how you live and the seasons where you are.",
  closing: {
    primaryLabel: "Get a Professional Quote",
    primaryHref: VI_PATHS.contact,
    secondaryLabel: "View Porch Services",
    secondaryHref: VI_PATHS.porch,
  },
  relatedServices: [
    {
      title: "Pergola Installation",
      subtitle: "Outdoor Structures",
      description:
        "Pair your porch with a pergola for added shade, architectural interest, and defined outdoor living zones.",
      href: VI_PATHS.pergolas,
    },
    {
      title: "Patio Installation",
      subtitle: "Outdoor Living",
      description:
        "Connect porch and patio areas with cohesive hardscaping for dining, lounging, and year-round entertaining.",
      href: VI_PATHS.patio,
    },
    {
      title: "Landscaping Services",
      subtitle: "Design & Build",
      description:
        "Integrate your porch into a full landscape plan — from planting beds and walkways to lighting and seasonal care.",
      href: VI_PATHS.landscaping,
    },
  ],
  serviceSummary:
    "From defining how you'll use the space and choosing the right orientation to selecting materials, planning proportions, and securing permits — follow this architect's guide to build a porch that fits your home and lifestyle.",
  serviceStepTitles: [
    "Defining Purpose",
    "Location Strategy",
    "Size & Proportion",
    "Materials Guide",
    "Permits & Budget",
  ],
} as const;
