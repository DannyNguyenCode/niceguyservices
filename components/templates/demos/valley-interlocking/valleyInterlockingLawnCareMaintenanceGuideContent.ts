import { VI_PATHS } from "./valleyInterlockingConfig";
import { VI_IMG } from "./valleyInterlockingImages";

export const VI_LAWN_CARE_MAINTENANCE_GUIDE_SLUG = "how-to-maintain-your-lawn" as const;

export const VI_LAWN_CARE_MAINTENANCE_GUIDE_PATH =
  `${VI_PATHS.resources}/${VI_LAWN_CARE_MAINTENANCE_GUIDE_SLUG}` as const;

export const VI_LAWN_CARE_MAINTENANCE_GUIDE = {
  slug: VI_LAWN_CARE_MAINTENANCE_GUIDE_SLUG,
  path: VI_LAWN_CARE_MAINTENANCE_GUIDE_PATH,
  categoryLabel: "Maintenance",
  subcategoryLabel: "Lawn Care",
  title: "How to Maintain Your Lawn: A Complete Turf Care Guide",
  serviceTitle: "How to Maintain Your Lawn",
  description:
    "Lawn care is an important part of maintaining beautiful-looking grass. From watering and mowing to fertilization, weed prevention, and seasonal prep — this guide covers the practices that keep Canadian lawns healthy, dense, and green year-round.",
  readTime: "8 min read",
  category: "Maintenance" as const,
  author: {
    name: "Valley Interlocking Team",
    role: "Lawn Care & Turf Specialists",
  },
  heroImage: VI_IMG.lawnCare.hero,
  heroImageAlt: "Manicured emerald green lawn surrounding a luxury modern estate at golden hour.",
  heroCaption: "Consistent care — not occasional effort — is what separates a tired lawn from turf that thrives.",
  figureBreak: {
    image: VI_IMG.lawnCare.mowing,
    alt: "Professional lawn mowing on a healthy residential turf with crisp edging.",
  },
  navSections: [
    { label: "Watering Strategy", href: "#watering" },
    { label: "Mowing Techniques", href: "#mowing" },
    { label: "Fertilization", href: "#fertilization" },
    { label: "Weeds & Edging", href: "#weeds" },
    { label: "Seasonal Prep", href: "#seasonal" },
  ],
  watering: {
    id: "watering",
    number: "01",
    title: "Watering Strategy",
    body: "A good soaking once or twice a week is extremely beneficial for your lawn. Avoid giving your lawn light daily sprinklings, as this can cause your grass to have shallow roots and risk drying out. Infrequent, deep watering encourages roots to grow deeper into the soil, creating drought-resistant turf. Frequent shallow sprays lead to weak roots and fungal issues.",
  },
  wateringCard: {
    id: "watering-timing",
    title: "When to Water",
    body: "Watering at times when the moisture is more likely to soak into the soil rather than evaporate from the heat is critical. Early mornings or late in the evening are the best times to water your lawn. The more established your lawn is, the less water it will require.",
  },
  shallowVsDeepCard: {
    id: "watering-depth",
    title: "Deep vs. Shallow",
    body: "Water deeply once or twice per week rather than sprinkling lightly every day. Deep watering builds stronger root systems that survive heat, drought, and seasonal stress far better than surface-level moisture.",
  },
  mowing: {
    id: "mowing",
    number: "02",
    title: "Mowing Techniques",
    body: "Using the proper lawn mowing techniques will help benefit your turf. Having professionals regularly trim your lawn using a lawnmower will provide you with long-lasting benefits. To have a strong lawn, you'll need to mow it often. The trick is getting your grass to the right height — once you achieve this, the healthy grass shoots flourish.",
    tips: [
      "Mow early in the morning, usually just after the dew has dried on the grass.",
      "Let the height of your grass dictate your mowing frequency.",
      "Use a back-and-forth pattern, overlapping the previous pass by half a mower width.",
      "Do not cut more than one-third of the grass height — cutting too low can significantly damage the roots.",
      "Cutting the lawn to the same height regularly improves even growth and consistent nutrient levels.",
    ],
  },
  mowingBenefits: {
    id: "mowing-benefits",
    title: "Why Regular Mowing Matters",
    body: "A common problem with lawns is uneven growth. By cutting the lawn to the same height regularly, the overall growth will be improved. Even lawns provide your whole yard with consistent levels of nutrients. The more often your grass is mowed the healthier it will become, with a better quality lawn. A yard that is regularly mowed and maintained will recover faster.",
  },
  fertilization: {
    id: "fertilization",
    number: "03",
    title: "Fertilization & Feeding",
    body: "We can provide a comprehensive lawn treatment designed specifically to fit your lawn. It can include quarterly fertilization to ensure healthy new growth. The best time to start your lawn fertilizer program is the beginning of spring, using a nitrogen, phosphate, and potassium mix. Fertilize your lawn properly, and you'll soon have healthy, dense grass that's a deep green color.",
    items: [
      {
        label: "Spring Start",
        detail: "Begin your fertilizer program at the start of spring to fuel new growth after winter dormancy.",
      },
      {
        label: "NPK Balance",
        detail: "Use a nitrogen, phosphate, and potassium mix tailored to your grass type and soil conditions.",
      },
      {
        label: "Quarterly Programs",
        detail: "Consistent seasonal feeding supports thick canopy growth and long-term turf health.",
      },
    ],
  },
  weeds: {
    id: "weeds",
    number: "04",
    title: "Weed Prevention & Grass Edging",
    body: "Weed prevention and edging work together to keep your lawn looking sharp. A comprehensive lawn treatment designed for your property can include quarterly fertilization alongside targeted weed control. Valley Interlock Landscaping, using specialized equipment, will edge all of your paths, outdoor entertainment areas, and driveways, making sure your lawn doesn't grow anywhere it shouldn't be.",
    items: [
      {
        label: "Weed Prevention",
        detail: "Start prevention programs in spring alongside fertilization to stop weeds before they establish.",
      },
      {
        label: "Grass Edging",
        detail: "Clean edges along paths, patios, and driveways define your lawn and prevent encroachment into hardscape areas.",
      },
    ],
  },
  seasonal: {
    id: "seasonal",
    number: "05",
    title: "Seasonal Prep & Lawn Repair",
    body: "You will need to prepare your lawn for the winter. No matter how well you've maintained your grass over the summer months, when autumn arrives your lawn will more than likely look tired and worn out. This is usually because your lawn has extracted all the nutrients from the soil and suffered from the toll the heat has played with it during summer. Fall is the critical window — relieve soil compaction through aeration and introduce premium seed varieties to thicken the canopy before winter dormancy.",
    repair: {
      title: "Lawn Repair",
      body: "Best carried out in spring or autumn when the weather is cooler. Once your lawn is repaired, regular mowing is advisable, with the required fertilizer program starting in spring and summer. Spring is the best time to spend time getting your lawn into shape — mowing, feeding with fertilizer, and dealing with any bare patches, weeds, and moss.",
    },
    tips: [
      "Water deeply once or twice per week",
      "Avoid daily light watering",
      "Prepare lawn for winter",
      "Mow regularly",
      "Do not cut more than one-third of grass height",
      "Maintain consistent mowing height",
      "Follow seasonal fertilization schedules",
    ],
    ctaLabel: "Get Your Lawn Care Quote",
    ctaHref: VI_PATHS.contact,
  },
  professional: {
    id: "professional",
    title: "Professional Lawn Care",
    body: "Keeping up with regular lawn care is vital if you're looking to have a healthy lawn. Serious lawn maintenance requires a lot of commitment and plenty of time — most weekends spent mowing, fertilizing, or watering. Using lawn care professionals like Valley Interlock, you're guaranteed to have your lawn and yard taken care of consistently, showing up the same time each week or month, always making sure your lawn looks pristine. At Valley Interlock Landscaping we pride ourselves on providing a professional, friendly and superior landscaping service. Our techniques, machinery and application technology allows us to supply and apply premium quality products transforming your property.",
  },
  sidebarServices: [
    {
      subtitle: "Design & Build",
      title: "Landscaping Services",
      href: VI_PATHS.landscaping,
    },
    {
      subtitle: "Full-Yard Design",
      title: "Backyard Landscaping",
      href: VI_PATHS.backyard,
    },
    {
      subtitle: "Hardscaping",
      title: "Interlocking & Paving",
      href: VI_PATHS.interlocking,
    },
  ],
  featuredPartner: {
    quote: "Exceptional landscapes aren't just built — they are curated.",
    name: "Valley Interlocking & Landscaping",
    description:
      "The trusted choice for lawn care, turf fitting, and year-round landscape maintenance across Toronto and Edmonton.",
    href: VI_PATHS.contact,
  },
  conclusion:
    "Beautiful grass comes from consistent watering, proper mowing, seasonal feeding, and timely repair — maintained year-round for a lawn that complements your entire property.",
  closing: {
    primaryLabel: "Get a Professional Quote",
    primaryHref: VI_PATHS.contact,
    secondaryLabel: "View Lawn Care Services",
    secondaryHref: VI_PATHS.lawnCare,
  },
  relatedServices: [
    {
      title: "Landscaping Services",
      subtitle: "Design & Build",
      description:
        "Integrate lawn care into a full landscape plan — from planting beds and walkways to seasonal design updates.",
      href: VI_PATHS.landscaping,
    },
    {
      title: "Backyard Landscaping",
      subtitle: "Full-Yard Design",
      description:
        "Transform rear yards into entertainment zones with healthy turf, planting beds, and outdoor living spaces.",
      href: VI_PATHS.backyard,
    },
    {
      title: "Interlocking & Paving",
      subtitle: "Hardscaping",
      description:
        "Pair crisp lawn edging with interlocking walkways, driveways, and patios for a polished property finish.",
      href: VI_PATHS.interlocking,
    },
  ],
  serviceSummary:
    "From deep watering and proper mowing to fertilization, weed prevention, edging, and seasonal prep — follow this guide to maintain a healthy, beautiful lawn year-round.",
  serviceStepTitles: [
    "Watering Strategy",
    "Mowing Techniques",
    "Fertilization",
    "Weeds & Edging",
    "Seasonal Prep",
  ],
} as const;
