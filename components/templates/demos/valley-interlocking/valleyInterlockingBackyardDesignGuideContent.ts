import { VI_PATHS } from "./valleyInterlockingConfig";
import { VI_IMG } from "./valleyInterlockingImages";

export const VI_BACKYARD_DESIGN_GUIDE_SLUG = "how-to-design-your-backyard" as const;

export const VI_BACKYARD_DESIGN_GUIDE_PATH = `${VI_PATHS.resources}/${VI_BACKYARD_DESIGN_GUIDE_SLUG}` as const;

export const VI_BACKYARD_DESIGN_GUIDE = {
  slug: VI_BACKYARD_DESIGN_GUIDE_SLUG,
  path: VI_BACKYARD_DESIGN_GUIDE_PATH,
  categoryLabel: "Design",
  subcategoryLabel: "Backyards",
  title: "How to Design Your Backyard: A Complete Planning Guide",
  serviceTitle: "How to Design Your Backyard",
  description:
    "Developing your backyard landscaping doesn't need to be overwhelming. When properly planned, your backyard becomes an extension of your home — a multipurpose space for entertaining, relaxing, and outdoor living that fits your lifestyle and budget.",
  readTime: "8 min read",
  category: "Design Trends" as const,
  author: {
    name: "Valley Interlocking Team",
    role: "Backyard Design Specialists",
  },
  heroImage: VI_IMG.backyard.hero,
  heroImageAlt: "Professionally landscaped backyard with outdoor living and planting areas.",
  heroCaption: "A good plan turns any backyard — large or small — into usable outdoor living space.",
  figureBreak: {
    image: VI_IMG.backyard.plan,
    alt: "Landscaping design plan for a residential backyard layout.",
  },
  navSections: [
    { label: "Define Your Lifestyle", href: "#lifestyle" },
    { label: "Front & Backyard", href: "#front-back" },
    { label: "Entertainment Spaces", href: "#entertainment" },
    { label: "Low Maintenance", href: "#low-maintenance" },
    { label: "Small Backyards", href: "#small-backyards" },
  ],
  lifestyle: {
    id: "lifestyle",
    number: "01",
    title: "Define Your Lifestyle",
    body: "When you start designing your backyard landscape, you need to first ask yourself what type of lifestyle you have. If you don't enjoy spending much time outside in your backyard, a low maintenance option will be your best choice. If you enjoy having a green thumb, then you will have more landscaping options with plants and trees. As backyards have become extensions of your property, when properly landscaped they can add outdoor living space for you and family and friends to enjoy.",
  },
  lifestyleCard: {
    id: "lifestyle-plan",
    title: "Start With a Plan",
    body: "When you have a good plan and design, your backyard can become a multipurpose space for entertaining and relaxing. Developing your backyard landscaping doesn't need to be overwhelming — the right approach begins with understanding how you want to use the space.",
  },
  investmentCard: {
    id: "lifestyle-investment",
    title: "Think Long Term",
    body: "Landscaping your backyard or front yard is an investment that you need to nurture so it can grow. Your backyard can become the highlight of your home — holding regular gatherings with family and friends or spending time alone relaxing.",
  },
  frontBack: {
    id: "front-back",
    number: "02",
    title: "Front Yards and Backyards",
    body: "Your backyard space plays a key role — larger spaces will allow you to have outdoor entertainment areas or gazebos or pergolas, whereas smaller backyards you may only have enough space for a vertical garden. Front yards and backyards shouldn't be ignored. In most cases, people pay more attention to the interior of their home than the exterior, but designing landscaping for your home is just as important as designing any other part of the home.",
    items: [
      {
        label: "Backyard Focus",
        detail:
          "Larger lots support entertainment zones, pergolas, and pools. Smaller lots call for creative solutions like vertical gardens and compact decking.",
      },
      {
        label: "Front Yard Curb Appeal",
        detail:
          "Use walkways or an eco-friendly garden to create a beautiful and welcoming landscape that enhances your whole property.",
      },
      {
        label: "Plant Selection",
        detail:
          "Choose the appropriate plants and flowers to complement your aesthetics and improve the overall appeal of your home.",
      },
    ],
  },
  entertainment: {
    id: "entertainment",
    number: "03",
    title: "Create Entertainment Space",
    body: "With your backyard, you have multiple options to create entertainment space for family and friends complete with outdoor kitchens, grillers, fire pits, pool, and a hot tub. If that's not your style you can create a setting that will attract wildlife where you can sit and relax in peace. When it comes to gardens, most people don't have the time to spend looking after them and the added cost of water trying to grow lush green grass and exotic plants — so balance ambition with how much upkeep you're willing to commit to.",
    features: [
      "Outdoor Kitchens",
      "Outdoor Grills",
      "Fire Pits",
      "Swimming Pools",
      "Hot Tubs",
      "Wildlife Gardens",
      "Relaxation Spaces",
      "Entertainment Areas",
    ],
  },
  lowMaintenance: {
    id: "low-maintenance",
    number: "04",
    title: "Low-Maintenance Backyard Options",
    body: "A low maintenance backyard is one that doesn't have a lawn. Decking is a great option — you have various choices of material from composite decking to hardwoods, and you can build in seating and wood planter boxes for plants. It's also a great way to increase your living space and add an outdoor entertainment area. A combination of decking and a pergola adds that extra living space and a perfect place for alfresco dining.",
    options: [
      "Composite Decking",
      "Hardwood Decking",
      "Built-In Seating",
      "Planter Boxes",
      "Pergolas",
      "Tiles",
      "Pavers",
      "Concrete",
      "Natural Stone Pavers",
      "Vertical Gardens",
    ],
    materialsNote:
      "If you're not a fan of decking, you have other options with tiles, pavers or concrete. Tiling or pavers are a simple solution when you prefer not to have grass. Natural stone pavers are also a great choice. If you still want a bit of greenery, you can use planter boxes or vertical gardens. Selecting the right plants for your home is just as important as getting the look right — mistakes commonly made are not doing proper research into what are the best plants for your climate and environment.",
  },
  smallBackyards: {
    id: "small-backyards",
    number: "05",
    title: "Designing Small Backyards",
    body: "Small backyards don't have to be cramped spaces — they can be an intimate and private space for you to enjoy. Using strategic planning and a little know-how you can increase the presence of your small backyard. With smaller lot sizes our homes are getting smaller backyards than what we once used to have. With many urban lots now being small, we need to be creative when creating a private space.",
    ideas: [
      "Vertical Gardens",
      "Timber Fencing",
      "Mixed Material Fencing",
      "Water Features",
      "Natural Stone",
      "Paving",
      "Composite Decking",
      "Private Garden Retreats",
      "Noise Reduction Landscaping",
    ],
    tips: [
      "Consider how big plants will grow and whether they will outgrow the area.",
      "Check shade and sunlight requirements before planting.",
      "Avoid tall fencing that makes a small backyard feel claustrophobic — quality timber and mixed materials create contrast without shrinking the space.",
      "Vertical gardens maximize limited space, are easy to maintain, dampen outside noise, and look amazing with the right plant selection.",
      "Incorporate water features, paving, natural stone, or a small composite deck to create your private oasis.",
    ],
    ctaLabel: "Get a Quote",
    ctaHref: VI_PATHS.contact,
  },
  professional: {
    id: "professional",
    title: "Professional Backyard Design",
    body: "If your time is limited, consider the team at Valley Interlock Landscaping to help manage your garden and landscaping for you. If you can't maintain your backyard, professionals like Valley Interlocking & Landscaping can help you design and build a space that fits your lifestyle — whether that's a full entertainment zone or a low-maintenance retreat you'll actually use.",
  },
  sidebarServices: [
    {
      subtitle: "Design & Build",
      title: "Landscaping Services",
      href: VI_PATHS.landscaping,
    },
    {
      subtitle: "Outdoor Living",
      title: "Patio Installation",
      href: VI_PATHS.patio,
    },
    {
      subtitle: "Shade & Structure",
      title: "Pergolas & Gazebos",
      href: VI_PATHS.pergolas,
    },
  ],
  featuredPartner: {
    quote: "Your backyard should work as hard as the rest of your home.",
    name: "Valley Interlocking & Landscaping",
    description:
      "The trusted choice for backyard design, outdoor living builds, and landscape projects across Toronto and Edmonton.",
    href: VI_PATHS.contact,
  },
  conclusion:
    "The right backyard design starts with your lifestyle — then layers in entertainment zones, low-maintenance materials, or small-space solutions for an outdoor space you'll love year-round.",
  closing: {
    primaryLabel: "Get a Professional Quote",
    primaryHref: VI_PATHS.contact,
    secondaryLabel: "View Backyard Services",
    secondaryHref: VI_PATHS.backyard,
  },
  relatedServices: [
    {
      title: "Landscaping Services",
      subtitle: "Design & Build",
      description:
        "Integrate your backyard into a full landscape plan — from planting beds and walkways to seasonal design updates.",
      href: VI_PATHS.landscaping,
    },
    {
      title: "Patio Installation",
      subtitle: "Outdoor Living",
      description:
        "Add a stone or paver patio for dining, lounging, and entertainment zones that flow from your backyard design.",
      href: VI_PATHS.patio,
    },
    {
      title: "Pergolas & Gazebos",
      subtitle: "Shade & Structure",
      description:
        "Define outdoor living areas with pergolas, shade structures, and architectural detail over decking or patios.",
      href: VI_PATHS.pergolas,
    },
  ],
  serviceSummary:
    "From defining your lifestyle and planning front and backyard spaces to entertainment zones, low-maintenance materials, and small backyard ideas — follow this guide to design a backyard that fits how you live.",
  serviceStepTitles: [
    "Define Your Lifestyle",
    "Front & Backyard",
    "Entertainment Spaces",
    "Low-Maintenance Options",
    "Small Backyard Ideas",
  ],
} as const;
