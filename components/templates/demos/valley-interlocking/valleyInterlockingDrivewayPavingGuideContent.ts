import { VI_PATHS } from "./valleyInterlockingConfig";
import { VI_IMG } from "./valleyInterlockingImages";

export const VI_DRIVEWAY_PAVING_GUIDE_SLUG = "how-to-choose-driveway-paving" as const;

export const VI_DRIVEWAY_PAVING_GUIDE_PATH = `${VI_PATHS.resources}/${VI_DRIVEWAY_PAVING_GUIDE_SLUG}` as const;

export const VI_DRIVEWAY_PAVING_GUIDE = {
  slug: VI_DRIVEWAY_PAVING_GUIDE_SLUG,
  path: VI_DRIVEWAY_PAVING_GUIDE_PATH,
  categoryLabel: "Hardscaping",
  subcategoryLabel: "Driveways",
  title: "How to Choose the Right Driveway Paving for Your Home",
  serviceTitle: "How to Choose Your Driveway Paving",
  description:
    "With a wide range of materials and styles to choose from, the right driveway balances visual appeal, durability, and ease of maintenance. This guide helps you compare paving stone, asphalt, concrete, and block curbing — and understand what makes a quality installation last.",
  readTime: "8 min read",
  category: "Installation Guides" as const,
  author: {
    name: "Valley Interlocking Team",
    role: "Driveway Paving Specialists",
  },
  heroImage: VI_IMG.driveway.hero,
  heroImageAlt:
    "Luxury suburban driveway with natural stone paving, charcoal block curbing, and manicured landscaping.",
  heroCaption: "The best driveway material depends on your budget, climate, and how you use the space.",
  figureBreak: {
    image: VI_IMG.driveway.pavingStones,
    alt: "Close-up of interlocking paving stones on a residential driveway with crisp edges and varied tones.",
  },
  navSections: [
    { label: "Assess Your Priorities", href: "#priorities" },
    { label: "Compare Materials", href: "#materials" },
    { label: "Concrete Options", href: "#concrete" },
    { label: "Quality Installation", href: "#installation" },
    { label: "Maintenance & Value", href: "#maintenance" },
  ],
  priorities: {
    id: "priorities",
    number: "01",
    title: "Assess Your Priorities",
    body: "Enhance your home's curb appeal and create a lasting impression with a well-designed and durable driveway. As the first thing visitors see when approaching your home, a well-maintained driveway, along with a beautiful compound and lush lawn, sets the stage for a visually appealing and welcoming environment. Before choosing a material, consider your budget, how much maintenance you are willing to do, the look you want to achieve, and whether resale value is a priority. You can customize your driveway to strike the perfect balance between visual appeal, durability, and ease of maintenance.",
  },
  versatilityCard: {
    id: "versatility",
    title: "Versatility & Aesthetics",
    body: "Choose from a vast array of colors, patterns, and materials. Whether you want an intricate interlocking design or a simple, elegant asphalt finish, the options are limitless to match your home's aesthetic.",
  },
  functionalityCard: {
    id: "functionality",
    title: "Functionality & Daily Use",
    body: "A professionally installed driveway provides a stable, level surface for vehicles and pedestrians alike. It ensures safe access to your home and prevents mud or debris from being tracked inside.",
  },
  materials: {
    id: "materials",
    number: "02",
    title: "Compare Paving Materials",
    body: "Each driveway surface has distinct strengths. Paving stone offers the highest upfront quality and design flexibility. Asphalt is a popular choice for an attractive finish at a lower initial cost. Block curbing adds definition and helps separate lawn from pavement. Understanding trade-offs helps you choose what suits your needs best.",
    items: [
      {
        label: "Paving Stone",
        detail:
          "The most expensive type of driveway but of high quality and cheaper to maintain. More flexible — individual stones can be replaced or flipped easier than other types of paving. Available in different colors, sizes, and shapes.",
      },
      {
        label: "Asphalt Driveways",
        detail:
          "Common for homeowners who want an attractive and beautiful driveway. Maintenance is higher — a new black seal coat every 2–3 years. Durability is lower than concrete and it is affected by weather.",
      },
      {
        label: "Block Curbing",
        detail:
          "Creates an impressive outline around driveways and serves as the barrier between your lawn and driveway. Provides a finished look to your landscaping and helps prevent weeds from growing toward your pavement.",
      },
    ],
  },
  concrete: {
    id: "concrete",
    number: "03",
    title: "Concrete Driveway Options",
    body: "Concrete driveways are the most common types of driveways for homeowners because they are the most affordable. Their cost makes them appealing to many homeowners. When it comes to durability, concrete can crack over time, and repairs can be expensive — so choosing the right concrete finish matters.",
    options: [
      {
        label: "Plain Concrete",
        detail:
          "The cheapest type of driveway paving. Plain in color and best for homeowners with a limited budget who want a durable driveway.",
      },
      {
        label: "Exposed Aggregate Concrete",
        detail:
          "Uses materials such as granite, which need to be polished to be attractive. Pigments can be added to provide new texture, color, or design to the driveway.",
      },
    ],
  },
  installation: {
    id: "installation",
    number: "04",
    title: "Key Elements for a Quality Driveway",
    body: "No matter which material you choose, professional installation determines how long your driveway lasts. These three factors separate a driveway that holds up for decades from one that buckles, cracks, or crumbles within a few seasons.",
    items: [
      {
        label: "A Suitable Foundation",
        detail:
          "A strong foundation is the first factor to consider. For durable driveways, there must be a sub-grade and a strong aggregate base. If your home sits on soft wet clay, the contractor must remove it and replace it with a durable stone base. Failure to do that may lead to buckling, crumbling, cracking, and ever-increasing deterioration.",
      },
      {
        label: "Good Drainage",
        detail:
          "Water is the number one threat to driveways, especially concrete and asphalt. Water must be drained away from the edges. Without excellent drainage, water seeps into crevices, freezes, thaws, and expands — causing crumbling, potholes, and cracks.",
      },
      {
        label: "Proper Supplies",
        detail:
          "If the wrong pavement mix is used, future problems are likely. Most driveways are vulnerable to oxidation and weathering, especially asphalt. A perfect mix should contain fewer air voids and result in excellent aggregate finishing that looks darker and smoother.",
      },
    ],
    figureImage: VI_IMG.driveway.keyElements,
    figureAlt: "Interlocking driveway and stairs with landscape design at the front of a house.",
  },
  maintenance: {
    id: "maintenance",
    number: "05",
    title: "Maintenance & Long-Term Value",
    body: "After the driveway is paved and completed, the work is not done. Driveways require regular maintenance all year round for them to last longer. Maintenance includes daily sweeping of debris, seal coating, regular power washing, crack repair, and more. Consult driveway professionals for advice on proper maintenance practices for your chosen material.",
    benefits: [
      {
        label: "Affordable Long-Term Value",
        detail:
          "While it is an investment, a new driveway offers excellent long-term value. It reduces maintenance costs over time and significantly increases the resale value of your property.",
      },
      {
        label: "Reflect Light",
        detail:
          "Lighter colored materials, such as specific concrete or stone finishes, reflect more light — improving visibility and safety around your home entrance during evening hours.",
      },
      {
        label: "Simple Maintenance",
        detail:
          "Modern paving materials are designed for easy upkeep. Most driveways only require occasional sweeping and rinsing to maintain their pristine look for years to come.",
      },
    ],
    ctaLabel: "Request a Design Consultation",
    ctaHref: VI_PATHS.contact,
  },
  professional: {
    id: "professional",
    title: "Hire a Licensed Professional",
    body: "It's highly recommended to hire a bonded, licensed, and insured pavement contractor for proper construction practice and ethical workmanship. Professionals guarantee a proper job since they are trained and experienced. They will also offer the best advice on driveway paving materials to choose depending on your lawn and your budget. Installing driveway paving is one of the greatest ways of adding value to your home, especially if you are looking to rent or sell it in the future. No matter the material you choose, always opt for professional installation for quality results that will look good both today and in the future.",
  },
  sidebarServices: [
    {
      subtitle: "Hardscaping",
      title: "Interlocking & Paving",
      href: VI_PATHS.interlocking,
    },
    {
      subtitle: "Outdoor Living",
      title: "Patio Installation",
      href: VI_PATHS.patio,
    },
    {
      subtitle: "Ambience & Safety",
      title: "Landscape Lighting",
      href: VI_PATHS.lighting,
    },
  ],
  featuredPartner: {
    quote: "Precision in every joint, durability in every layer.",
    name: "Valley Interlocking & Landscaping",
    description:
      "The trusted choice for driveway paving, interlocking installation, and hardscape projects across Toronto and Edmonton.",
    href: VI_PATHS.contact,
  },
  conclusion:
    "The right driveway paving material depends on your budget, maintenance preferences, and how you want your home to look and perform — built on a solid foundation with professional installation for lasting results.",
  closing: {
    primaryLabel: "Get a Professional Quote",
    primaryHref: VI_PATHS.contact,
    secondaryLabel: "View Driveway Services",
    secondaryHref: VI_PATHS.driveway,
  },
  relatedServices: [
    {
      title: "Interlocking & Paving",
      subtitle: "Hardscaping",
      description:
        "Extend the same professional base standards from your driveway to walkways, patios, and retaining walls.",
      href: VI_PATHS.interlocking,
    },
    {
      title: "Patio Installation",
      subtitle: "Outdoor Living",
      description:
        "Match your driveway materials and patterns to a cohesive patio and outdoor entertainment area.",
      href: VI_PATHS.patio,
    },
    {
      title: "Landscape Lighting",
      subtitle: "Curb Appeal & Safety",
      description:
        "Illuminate your driveway edges, walkways, and entry for visibility and dramatic curb appeal after dark.",
      href: VI_PATHS.lighting,
    },
  ],
  serviceSummary:
    "Compare paving stone, asphalt, and concrete options — then weigh foundation, drainage, maintenance, and long-term value to choose the driveway paving best suited to your home and budget.",
  serviceStepTitles: [
    "Assess Your Priorities",
    "Compare Paving Materials",
    "Concrete Options",
    "Quality Installation",
    "Maintenance & Value",
  ],
} as const;
