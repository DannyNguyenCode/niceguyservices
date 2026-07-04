import type { ViCtaBannerContent } from "./valleyInterlockingAboutContent";

export const VI_SERVICE_AREAS = {
  toronto: {
    title: "Toronto & GTA",
    accent: "primary" as const,
    areas: [
      "Ajax",
      "Brampton",
      "Burlington",
      "Guelph",
      "Hamilton",
      "Markham",
      "Mississauga",
      "Newmarket",
      "Oakville",
      "Richmond Hill",
      "Toronto",
      "Vaughan",
    ],
  },
  edmonton: {
    title: "Edmonton Area",
    accent: "secondary" as const,
    areas: [
      "St. Albert",
      "Sherwood Park",
      "Stony Plain",
      "Spruce Grove",
      "Fort Saskatchewan",
      "Edgemont",
      "Beaumont",
      "Devon",
      "Leduc",
    ],
  },
} as const;

export const VI_GALLERY_ITEMS = [
  { title: "Interlock Driveway", category: "Hardscaping" },
  { title: "Backyard Patio", category: "Outdoor Living" },
  { title: "Stone Retaining Wall", category: "Hardscaping" },
  { title: "Landscape Lighting", category: "Lighting" },
  { title: "Front Porch", category: "Outdoor Living" },
  { title: "Garden Walkway", category: "Landscaping" },
  { title: "Pergola & Patio", category: "Outdoor Living" },
  { title: "Lawn & Turf", category: "Softscaping" },
  { title: "Pool Patio", category: "Outdoor Living" },
  { title: "Driveway Paving", category: "Hardscaping" },
  { title: "Front Yard Landscape", category: "Landscaping" },
  { title: "Outdoor Kitchen", category: "Outdoor Living" },
] as const;

export const VI_GALLERY_CTA = {
  headline: "Found Something You Love?",
  description:
    "Whether it is a small walkway or a complete estate overhaul, our team is ready to bring your vision to life with precision and care.",
  cta: {
    label: "Get A Custom Quote",
    url: "/get-a-quote/",
  },
} as const satisfies ViCtaBannerContent;

export const VI_TEAM_CTA = {
  headline: "Ready to meet your project lead?",
  description:
    "Request a free consultation and we will connect you with the right regional specialist for your property.",
  cta: {
    label: "Get A Quote",
    url: "/get-a-quote/",
  },
} as const satisfies ViCtaBannerContent;

export const VI_HOME_SERVICES_INTRO = {
  title: "Our Services",
  description:
    "At Valley Interlocking & Landscaping, we offer a comprehensive range of landscaping services designed to enhance your property's beauty and functionality. Whether you're in Toronto or Edmonton, you can expect the same exceptional quality and attention to detail.",
} as const;

export const VI_HOME_GET_INSPIRED_CTA = {
  headline: "Every Great Landscape Starts With a Conversation",
  description:
    "Tell us about your property, goals, and ideas. We'll guide you through the possibilities and recommend the best solution for your space and budget.",
  cta: {
    label: "Book a Consultation",
    url: "/get-a-quote/",
  },
} as const satisfies ViCtaBannerContent;

export const VI_SERVICES_CTA = {
  eyebrow: "Ready to Start Your Project?",
  headline: "Ready to transform your landscape?",
  description:
    "Schedule a site visit with our lead designers to discuss your vision and receive a comprehensive project estimate.",
  cta: {
    label: "Start My Project",
    url: "/contact-valley-interlock/",
  },
} as const satisfies ViCtaBannerContent;

export const VI_HOME_SERVICES = [
  {
    title: "Interlocking Stone",
    description:
      "Enhance your driveways, walkways, and patios with our durable and attractive interlocking stone solutions.",
    imageKey: "interlockingStone" as const,
    imageAlt: "stone interlocking patio with stone firepit and stone bench",
    linkKey: "interlocking" as const,
    gridClass: "md:col-span-2 md:row-span-1",
  },
  {
    title: "Landscape Design",
    description:
      "Our expert designers will work with you to create a custom landscape plan that complements your style and enhances your property's value.",
    imageKey: "landscapeDesign" as const,
    imageAlt: "front interlocking walkway and stairs with landscape design",
    linkKey: "landscaping" as const,
    gridClass: "md:col-span-1 md:row-span-2",
  },
  {
    title: "Gardens and Planting",
    description:
      "From vibrant flower beds to lush greenery, we design and install gardens that bring colour and life to your outdoor spaces.",
    imageKey: "gardensPlanting" as const,
    imageAlt: "stone pathway with landscaping plants on either side of walkway",
    linkKey: "landscaping" as const,
    gridClass: "md:col-span-1 md:row-span-2",
  },
  {
    title: "Retaining Walls",
    description:
      "Our sturdy and stylish retaining walls provide both functional support and aesthetic appeal to your landscape.",
    imageKey: "retainingWalls" as const,
    imageAlt: "stone interlocking patio with stone firepit and stone bench",
    linkKey: "interlocking" as const,
    gridClass: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Outdoor Living Spaces",
    description:
      "Create the perfect outdoor oasis with our custom-built patios, fire pits, and outdoor kitchens.",
    imageKey: "outdoorLivingSpaces" as const,
    imageAlt: "front interlocking walkway and stairs with landscape design",
    linkKey: "patio" as const,
    gridClass: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Landscape Lighting",
    description:
      "Illuminate your outdoor areas with our professionally installed landscape lighting solutions.",
    imageKey: "landscapeLighting" as const,
    imageAlt: "stone pathway with landscaping plants on either side of walkway",
    linkKey: "lighting" as const,
    gridClass: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Structural Steel",
    description:
      "Offering reliable and dependable structural and miscellaneous steel installations for all types of projects",
    imageKey: "structuralSteel" as const,
    imageAlt: "stone pathway with landscaping plants on either side of walkway",
    linkKey: "services" as const,
    gridClass: "md:col-span-2 md:row-span-1",
  },
] as const;

export const VI_PROCESS_STEPS = [
  { step: "01", icon: "edit_note", title: "CONSULTATION", description: "We meet on-site to understand your vision, needs, and lifestyle." },
  { step: "02", icon: "architecture", title: "DESIGN & 3D", description: "Detailed blueprints and 3D renderings to visualize the end result." },
  { step: "03", icon: "construction", title: "CONSTRUCTION", description: "Professional excavation and precision stone laying by experts." },
  { step: "04", icon: "landscape", title: "FINAL REVEAL", description: "A completed oasis that adds immense value to your property." },
] as const;

/** Nine image cards in row groups of three; masonry alternates large-left / large-right per row. */
export const VI_SERVICES_MASONRY = [
  {
    slug: "hardscaping",
    title: "Hardscaping",
    subtitle: "Interlocking, patios, and driveways engineered for durability.",
    icon: "architecture",
    linkKey: "interlocking" as const,
    imageKey: "hardscaping" as const,
    gradient:
      "from-[color-mix(in_srgb,var(--vi-primary)_80%,transparent)] via-[color-mix(in_srgb,var(--vi-primary)_20%,transparent)] to-transparent",
  },
  {
    slug: "softscaping",
    title: "Softscaping",
    subtitle: "Garden Design & Planting",
    linkKey: "landscaping" as const,
    imageKey: "softscaping" as const,
    gradient: "from-[color-mix(in_srgb,var(--vi-tertiary)_80%,transparent)] to-transparent",
  },
  {
    slug: "outdoor-living",
    title: "Outdoor Living",
    subtitle: "Kitchens & Entertainment",
    linkKey: "patio" as const,
    imageKey: "outdoorLiving" as const,
    gradient: "from-[color-mix(in_srgb,var(--vi-secondary)_80%,transparent)] to-transparent",
  },
  {
    slug: "structural",
    title: "Structural",
    subtitle: "Walls & Foundations",
    linkKey: "porch" as const,
    imageKey: "structural" as const,
    gradient: "from-[color-mix(in_srgb,var(--vi-on-surface-variant)_90%,transparent)] to-transparent",
  },
  {
    slug: "maintenance",
    title: "Maintenance & Turf",
    subtitle: "Lawn care and seasonal upkeep",
    linkKey: "lawnCare" as const,
    imageKey: "maintenance" as const,
    gradient: "from-[color-mix(in_srgb,var(--vi-primary)_70%,transparent)] to-transparent",
  },
  {
    slug: "lighting",
    title: "Landscape Lighting",
    subtitle: "Outdoor illumination & ambiance",
    linkKey: "lighting" as const,
    imageKey: "lighting" as const,
    gradient: "from-[color-mix(in_srgb,var(--vi-secondary)_85%,transparent)] to-transparent",
  },
  {
    slug: "driveway",
    title: "Driveway Paving",
    subtitle: "Interlock & asphalt solutions",
    linkKey: "driveway" as const,
    imageKey: "driveway" as const,
    gradient: "from-[color-mix(in_srgb,var(--vi-primary)_80%,transparent)] to-transparent",
  },
  {
    slug: "pergolas",
    title: "Pergolas",
    subtitle: "Shade structures & covered patios",
    linkKey: "pergolas" as const,
    imageKey: "pergolas" as const,
    gradient: "from-[color-mix(in_srgb,var(--vi-tertiary)_80%,transparent)] to-transparent",
  },
  {
    slug: "backyard",
    title: "Backyard Landscaping",
    subtitle: "Full-yard design & build",
    linkKey: "backyard" as const,
    imageKey: "backyard" as const,
    gradient: "from-[color-mix(in_srgb,var(--vi-on-surface-variant)_90%,transparent)] to-transparent",
  },
] as const;

export const VI_ALL_ASPECTS_COVERED = {
  heading: "All Aspects Covered",
  items: ["Eco Friendly", "Ethical", "Maintained", "Groundwork", "Safety", "Clean & Tidy"],
} as const;

export const VI_ASPECT_ICONS: Record<string, string> = {
  "Eco Friendly": "eco",
  Ethical: "gavel",
  Maintained: "verified",
  Groundwork: "foundation",
  Safety: "security",
  "Clean & Tidy": "cleaning_services",
};

export const VI_ABOUT_SERVICES = [
  {
    icon: "grid_view",
    title: "Artistic Interlocking",
    description: "Custom driveways, patios, and walkways that combine structural durability with timeless patterns.",
    linkKey: "interlocking" as const,
  },
  {
    icon: "grass",
    title: "Softscaping & Flora",
    description: "Expert plant selection and garden design that thrives in the local ecosystem with minimal maintenance.",
    linkKey: "landscaping" as const,
  },
  {
    icon: "foundation",
    title: "Retaining Walls",
    description: "Engineering solutions for grade changes that add dimension and utility to sloped landscapes.",
    linkKey: "interlocking" as const,
  },
] as const;

export const VI_ABOUT_PROMISES = [
  {
    icon: "handshake",
    title: "A Personal Connection",
    description:
      "We don't just send a crew; we bring a team of dedicated craftsmen who treat your property with the same reverence as their own homes.",
  },
  {
    icon: "shield_lock",
    title: "The Integrity Promise",
    description:
      "Our word is as solid as our foundations. Transparent pricing, realistic timelines, and uncompromising quality are the bedrock of our business.",
  },
  {
    icon: "palette",
    title: "Tailored Aesthetics",
    description:
      "Every project is a unique collaboration. We listen first, then design, ensuring the final result reflects your personal style.",
  },
] as const;

export const VI_TORONTO_GTA = VI_SERVICE_AREAS.toronto.areas;

export const VI_TORONTO_SERVICES = [
  {
    title: "Interlocking Stone Solutions",
    icon: "grid_view",
    imageKey: "interlocking" as const,
    linkKey: "interlocking" as const,
    description:
      "Engineered for durability and seasonal transitions. Our interlocking systems provide structural integrity while elevating your property's curb appeal with natural slate and granite textures.",
    tags: ["Natural Stone", "Permeable", "Modern"],
  },
  {
    title: "Custom Landscape Design",
    icon: "architecture",
    imageKey: "landscape" as const,
    linkKey: "landscaping" as const,
    description:
      "Visionary planning for sophisticated outdoor living. We integrate water features, custom fire elements, and horticultural excellence to create functional art pieces in your backyard.",
    tags: ["Bespoke Layouts", "Lighting Systems", "Artisan Grade"],
  },
] as const;

export const VI_TORONTO_PROCESS = [
  { title: "01. Consultation", description: "An on-site analysis of your Toronto property to discuss vision, drainage, and structural possibilities." },
  { title: "02. Design", description: "CAD-driven blueprints and 3D visualizations that translate your aspirations into technical precision." },
  { title: "03. Execution", description: "Our master craftsmen break ground, utilizing premium materials to build your landscape with surgical accuracy." },
  { title: "04. Review", description: "A comprehensive walkthrough ensuring every detail aligns with our 5-star quality standard." },
] as const;

export const VI_EDMONTON_CLIMATE = [
  { icon: "ac_unit", title: "Deep-Base Engineering", description: "We utilize over-excavated bases with reinforced aggregate layers to prevent heaving during Northern Alberta's extreme temperature swings." },
  { icon: "water_drop", title: "Permeable Solutions", description: "Smart drainage systems designed to handle rapid spring snowmelt, protecting your home's foundation and your landscape's integrity." },
  { icon: "architecture", title: "Arctic-Grade Materials", description: "We exclusively source pavers and stone with high density and low absorption rates to resist cracking and salt damage." },
] as const;

export const VI_EDMONTON_SERVICES = [
  { title: "Premium Interlocking", subtitle: "Driveways, patios, and walkways engineered for Edmonton's sub-zero winters.", imageKey: "interlock" as const, badge: "Signature Service", large: true, linkKey: "interlocking" as const },
  { title: "Retaining Walls", subtitle: "Engineered gravity walls and decorative terracing.", imageKey: "retaining" as const, badge: undefined, large: false, linkKey: "interlocking" as const },
  { title: "Deck & Fence", subtitle: "Custom wood and composite structures built to last.", imageKey: "deckFence" as const, badge: undefined, large: false, linkKey: "porch" as const },
  { title: "Softscaping & Planting", subtitle: "Hardy local species selection for vibrant, low-maintenance curb appeal.", imageKey: "softscaping" as const, badge: undefined, large: true, linkKey: "landscaping" as const },
] as const;

export const VI_EDMONTON_REGIONS = VI_SERVICE_AREAS.edmonton.areas;

export const VI_EDMONTON_TESTIMONIALS = [
  { quote: "The retaining wall Valley built for our sloped backyard in Sherwood Park is rock solid. It survived the last two brutal winters without a single stone shifting. Professional and punctual.", name: "Sarah M.", location: "Sherwood Park Resident" },
  { quote: "Our new driveway in St. Albert is the talk of the block. The team's attention to detail with the interlocking pattern was incredible. They really understand the local soil conditions.", name: "James R.", location: "St. Albert Resident" },
  { quote: "We had our deck and fencing done by Valley Interlocking this summer in Windermere. The craftsmanship is top-tier. They even helped with some custom softscaping to match.", name: "David K.", location: "Edmonton Homeowner" },
] as const;

export const VI_CUSTOMER_TESTIMONIALS_SECTION = {
  heading: "Customer Testimonials",
  description:
    "Real feedback from homeowners who trust Valley Interlocking & Landscaping with their driveways, patios, and full-yard transformations.",
  testimonials: VI_EDMONTON_TESTIMONIALS,
} as const;

export const VI_PATIO_MATERIALS = [
  { name: "Brick", subtitle: "Timeless & Durable", imageKey: "brick" as const },
  { name: "Flagstone", subtitle: "Organic Mosaic", imageKey: "flagstone" as const },
  { name: "Natural Stone", subtitle: "Luxury Statement", imageKey: "naturalStone" as const },
  { name: "Concrete", subtitle: "Modern Utility", imageKey: "concrete" as const },
] as const;

export const VI_PATIO_ROOFING = [
  { icon: "horizontal_rule", title: "Flat Roof", description: "A sleek, minimalist profile ideal for modern homes. Offers a clean silhouette and can be integrated with lighting and heating elements.", features: ["Modern Aesthetics", "Cost-Effective"] },
  { icon: "change_history", title: "Gable Roof", description: "Classic pitched design that maximizes airflow and height. Perfect for creating a grand, open-air room feel with vaulted ceilings.", features: ["Superior Airflow", "Architectural Focus"] },
  { icon: "architecture", title: "Curved Roof", description: "A unique, organic shape that adds softness to the landscape. Excellent for contemporary designs seeking a softer visual transition.", features: ["High Design Appeal", "Custom Sculpting"] },
] as const;

export const VI_LAWN_SERVICES = [
  { icon: "precision_manufacturing", title: "Lawn Mowing", description: "Professional striping and height optimization based on your specific grass species and seasonal conditions.", imageKey: "mowing" as const, large: true },
  { icon: "eco", title: "Fertilization", description: "Custom nutrient mapping to ensure deep-root health and seasonal resilience using organic-first compounds.", tags: ["Organic", "Seasonal"], large: false },
  { icon: "shield", title: "Weed Prevention", description: "Targeted pre-emergent and post-emergent solutions that protect your turf without compromising ecological balance.", large: false },
  { icon: "water_drop", title: "Irrigation", description: "Smart-monitoring systems that optimize water usage based on soil moisture levels and local weather forecasts.", imageKey: "irrigation" as const, large: true },
] as const;


export const VI_DRIVEWAY_MATERIALS = [
  { title: "Paving Stones", imageKey: "pavingStones" as const, description: "The gold standard for durability and curb appeal. These interlocking systems distribute weight and flex with soil movement.", features: ["80-year lifespan", "Crack-resistant flex", "Infinite design patterns"] },
  { title: "Premium Asphalt", imageKey: "asphalt" as const, description: "A cost-effective, sleek, and durable solution. Best suited for long driveways where performance meets budget.", features: ["Quick installation (1-2 days)", "Smooth, quiet surface", "Easy snow removal"] },
  { title: "Block Curbing", imageKey: "blockCurbing" as const, description: "Crucial for structural containment. We use heavy-duty blocks to prevent lateral shifting and define boundaries.", features: ["Prevents edge crumbling", "Directs water runoff", "Architectural accent"] },
] as const;

export const VI_DRIVEWAY_ROI = [
  { title: "Curb Appeal Boost", description: "First impressions matter. Professional paving can increase property valuation by up to 15%." },
  { title: "Low Lifecycle Cost", description: "Interlocking stones require minimal maintenance compared to concrete, which is prone to costly crack repairs." },
  { title: "Climate Resilience", description: "Designed to withstand extreme freeze-thaw cycles without surface upheaval or spalling." },
] as const;

export const VI_PERGOLA_STYLES = [
  { title: "Motorized Louvred", imageKey: "louvred" as const, description: "Ultimate control. Rotate the slats up to 140 degrees to catch the breeze, block the sun, or create a completely waterproof seal during rain.", tags: ["All-Weather", "Smart Home Compatible"] },
  { title: "Fabric Retractable", imageKey: "retractable" as const, description: "The elegance of a canopy with the flexibility of a convertible. Choose from over 100 premium Sunbrella fabrics for a tailored look.", tags: ["Soft Lighting", "UV Protection"] },
  { title: "Architectural Pitched", imageKey: "pitched" as const, description: "A permanent architectural statement. Gabled or pitched roofs provide higher vertical clearance and a sense of traditional grandeur.", tags: ["Integrated Drainage", "Heater Ready"] },
] as const;

export const VI_LANDSCAPING_FAQ = [
  { question: "What is the typical timeline for a custom design plan?", answer: "Our comprehensive design process typically takes 3-6 weeks. This includes a site survey, conceptual drafting, 3D modeling, and two rounds of revisions with the client to ensure every detail matches your vision." },
  { question: "How do you handle project scheduling during the season?", answer: "We operate on a first-come, first-served basis with priority given to clients who complete their design plans in the winter or early spring. Construction typically begins in late April and continues through November, weather permitting." },
  { question: "Do you provide ongoing maintenance for your designs?", answer: "While we specialize in design and installation, we offer 'First Year Care' packages to ensure your new living landscape establishes itself correctly. We also provide a network of vetted maintenance partners for long-term care." },
] as const;

export const VI_BACKYARD_PHASES = [
  { icon: "design_services", title: "Phase 1: Spatial Mapping", description: "We analyze your property's topography and light patterns to define functional zones for lounging, dining, and solitude." },
  { icon: "foundation", title: "Phase 2: Structural Foundation", description: "Installation of sub-frame systems and drainage layers using precision laser leveling for enduring stability." },
  { icon: "potted_plant", title: "Phase 3: Softscape Curation", description: "Integrating vertical gardens and low-water plantings that provide year-round texture and screening." },
] as const;

export const VI_LIGHTING_TECHNIQUES = [
  { icon: "arrow_upward", title: "Uplighting", description: "Creating dramatic silhouettes by positioning fixtures at the base of architectural features or specimen trees to highlight texture and height.", accent: "secondary" as const },
  { icon: "arrow_downward", title: "Downlighting", description: "Also known as \"Moonlighting,\" this technique places lights high up in trees to cast a soft, natural glow over patios and lawns.", accent: "primary" as const },
  { icon: "texture", title: "Crosslighting", description: "By illuminating a subject from two or more sides, we eliminate harsh shadows and reveal the 3D form of sculptures and focal points.", accent: "tertiary" as const },
] as const;

export const VI_QUOTE_LOCATIONS = [
  { id: "gta", label: "Toronto / GTA", detail: "Service area includes Mississauga, Oakville, Vaughan" },
  { id: "edmonton", label: "Edmonton Area", detail: "Service area includes St. Albert, Sherwood Park" },
] as const;

export const VI_QUOTE_SERVICES = [
  "Interlocking",
  "Landscaping",
  "Patios",
  "Porches",
  "Pergolas",
  "Lighting",
  "Driveways",
  "Lawn Care",
] as const;

export const VI_QUOTE_NEXT_STEPS = [
  { icon: "send", title: "1. Submit Request", description: "We'll review your details within 24 hours." },
  { icon: "call", title: "2. Consultation", description: "We'll schedule a brief discovery call to discuss your vision." },
  { icon: "location_on", title: "3. Site Visit", description: "Our designers visit your property for precise measurements." },
  { icon: "description", title: "4. Detailed Quote", description: "You'll receive a comprehensive transparent estimate." },
  { icon: "check_circle", title: "5. Project Start", description: "Once approved, we break ground on your masterpiece.", highlight: true },
] as const;
