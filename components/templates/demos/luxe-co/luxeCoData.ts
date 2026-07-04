import type { LcSectionId } from "./luxeCoConfig";
import { LC_SECTIONS } from "./luxeCoConfig";
import { LC_IMAGES } from "./luxeCoImages";

export const LC_HERO_STATS = [
  { label: "Avg. Days on Market", value: "18" },
  { label: "Median Sold Price", value: "$1.2M" },
  { label: "Buyer Demand", value: "High" },
] as const;

export const LC_LIFESTYLES = [
  {
    id: "urban",
    title: "Urban Living",
    description:
      "Walkable streets, transit access, and vibrant city energy for professionals who want it all nearby.",
    image: LC_IMAGES.lifestyleUrban,
    cta: "Explore Urban Areas",
  },
  {
    id: "family",
    title: "Family Communities",
    description:
      "Tree-lined blocks, strong schools, and parks where neighbors know each other and kids grow up together.",
    image: LC_IMAGES.lifestyleFamily,
    cta: "Find Family Neighborhoods",
  },
  {
    id: "waterfront",
    title: "Waterfront Homes",
    description:
      "Harbor views, marina access, and coastal calm for buyers who measure quality of life in sunsets.",
    image: LC_IMAGES.lifestyleWaterfront,
    cta: "View Waterfront Listings",
  },
  {
    id: "investment",
    title: "Investment Properties",
    description:
      "Data-backed opportunities in emerging corridors with rental demand and long-term appreciation potential.",
    image: LC_IMAGES.lifestyleInvestment,
    cta: "Review Investment Data",
  },
] as const;

export const LC_NEIGHBORHOODS = [
  {
    id: "chelsea",
    name: "Chelsea",
    avgPrice: "$2.1M",
    tag: "Urban Living",
    image: LC_IMAGES.neighborhoodChelsea,
    coords: "40.7465° N",
    indicators: [
      { icon: "directions_transit", label: "Transit" },
      { icon: "school", label: "Schools" },
      { icon: "park", label: "Parks" },
    ],
    featured: true,
  },
  {
    id: "tribeca",
    name: "Tribeca",
    avgPrice: "$3.4M",
    tag: "Cultural Hub",
    image: LC_IMAGES.neighborhoodTribeca,
    coords: "40.7163° N",
    indicators: [
      { icon: "restaurant", label: "Dining" },
      { icon: "museum", label: "Culture" },
      { icon: "directions_walk", label: "Walkable" },
    ],
    featured: false,
  },
  {
    id: "west-village",
    name: "West Village",
    avgPrice: "$2.8M",
    tag: "Historic Charm",
    image: LC_IMAGES.neighborhoodWestVillage,
    coords: "40.7336° N",
    indicators: [
      { icon: "local_cafe", label: "Cafés" },
      { icon: "park", label: "Parks" },
      { icon: "directions_transit", label: "Transit" },
    ],
    featured: false,
  },
  {
    id: "brooklyn-heights",
    name: "Brooklyn Heights",
    avgPrice: "$1.9M",
    tag: "Family Nest",
    image: LC_IMAGES.neighborhoodBrooklynHeights,
    coords: "40.6962° N",
    indicators: [
      { icon: "school", label: "Schools" },
      { icon: "water", label: "Waterfront" },
      { icon: "directions_walk", label: "Walkable" },
    ],
    featured: false,
  },
] as const;

export const LC_PROPERTIES = [
  {
    id: "glass-house",
    name: "The Glass House",
    price: "$4,250,000",
    neighborhood: "Chelsea",
    beds: 4,
    baths: 3,
    sqft: "3,200",
    image: LC_IMAGES.propertyGlassHouse,
    tag: "New Listing",
    featured: true,
  },
  {
    id: "garden-residence",
    name: "Garden Residence",
    price: "$2,875,000",
    neighborhood: "West Village",
    beds: 3,
    baths: 2,
    sqft: "2,400",
    image: LC_IMAGES.propertyGarden,
    tag: "Featured",
    featured: false,
  },
  {
    id: "lakeside-retreat",
    name: "Lakeside Retreat",
    price: "$3,150,000",
    neighborhood: "Brooklyn Heights",
    beds: 5,
    baths: 4,
    sqft: "4,100",
    image: LC_IMAGES.propertyLakeside,
    tag: "Exclusive",
    featured: false,
  },
] as const;

export const LC_MARKET_INSIGHTS = [
  {
    id: "pricing",
    title: "Pricing Strategy",
    description:
      "We analyze comparable sales, days on market, and seasonal demand to position your offer or listing with confidence — not optimism.",
    icon: "analytics",
  },
  {
    id: "competition",
    title: "Buyer Competition",
    description:
      "Real-time insight into multiple-offer environments, pre-approval strength, and negotiation windows so you move at the right moment.",
    icon: "groups",
  },
  {
    id: "trends",
    title: "Neighborhood Trends",
    description:
      "Block-by-block shifts in inventory, new development, and lifestyle amenities that affect long-term value and daily living.",
    icon: "trending_up",
  },
] as const;

export const LC_BUYING_STEPS = [
  { step: "01", title: "Discover", description: "Define lifestyle fit, budget, and neighborhood priorities with guided market context." },
  { step: "02", title: "Tour", description: "Curated property visits focused on how you will actually live — not just square footage." },
  { step: "03", title: "Offer", description: "Data-backed offer strategy with clear terms, contingencies, and competitive positioning." },
  { step: "04", title: "Close", description: "Coordinated inspections, financing, and closing support through possession day." },
] as const;

export const LC_SELLING_STEPS = [
  { step: "01", title: "Evaluate", description: "Comprehensive market analysis and property assessment to set a realistic, strategic price." },
  { step: "02", title: "Prepare", description: "Staging guidance, photography, and pre-listing improvements that maximize first impressions." },
  { step: "03", title: "Market", description: "Targeted exposure across premium channels with narrative-driven listing presentation." },
  { step: "04", title: "Sell", description: "Offer review, negotiation, and closing coordination through a successful transfer." },
] as const;

export const LC_TESTIMONIALS = [
  {
    id: "sarah-mark",
    name: "Sarah & Mark D.",
    location: "Greenwich Village",
    image: LC_IMAGES.testimonialSarah,
    goal: "Downsize from suburban home while staying walkable to culture and dining.",
    challenge: "Competitive market with limited inventory in their preferred blocks.",
    result: "Secured a pre-war co-op off-market within three weeks of starting their search.",
    rating: 5,
  },
  {
    id: "james",
    name: "James R.",
    location: "Tribeca",
    image: LC_IMAGES.testimonialMark,
    goal: "Sell a loft quickly without compromising on price in a shifting market.",
    challenge: "Property needed positioning beyond standard MLS presentation.",
    result: "Listed at $2.1M, received four offers, and closed 8% above initial projections.",
    rating: 5,
  },
  {
    id: "elena",
    name: "Elena V.",
    location: "Brooklyn Heights",
    image: LC_IMAGES.testimonialElena,
    goal: "Find a family home with strong schools and a real backyard.",
    challenge: "Balancing budget constraints with non-negotiable school district requirements.",
    result: "Matched to a brownstone on a quiet tree-lined street — first tour, first offer accepted.",
    rating: 5,
  },
] as const;

export const LC_CONTACT = {
  email: "hello@luxeco.demo",
  phone: "(212) 555-0142",
  address: "48 Mercer Street, New York, NY",
} as const;

export const LC_SOCIAL_LINKS = [
  { name: "Instagram", icon: "photo_camera", href: "#" },
  { name: "LinkedIn", icon: "work", href: "#" },
  { name: "Email", icon: "mail", href: `mailto:${LC_CONTACT.email}` },
] as const;

export const LC_FOOTER_NAV = {
  services: [
    { label: "Buy", section: LC_SECTIONS.roadmap },
    { label: "Sell", section: LC_SECTIONS.roadmap },
    { label: "Neighborhood Guides", section: LC_SECTIONS.neighborhoods },
    { label: "Market Reports", section: LC_SECTIONS.market },
  ],
  company: [
    { label: "About", section: LC_SECTIONS.hero },
    { label: "Our Team", section: LC_SECTIONS.contact },
    { label: "Careers", section: LC_SECTIONS.contact },
    { label: "Press", section: LC_SECTIONS.contact },
  ],
  resources: [
    { label: "Listings", section: LC_SECTIONS.properties },
    { label: "Lifestyle Match", section: LC_SECTIONS.lifestyle },
    { label: "Client Stories", section: LC_SECTIONS.testimonials },
    { label: "Book Consultation", section: LC_SECTIONS.contact },
  ],
} as const satisfies Record<
  string,
  readonly { label: string; section: LcSectionId }[]
>;

export const LC_FOOTER_LEGAL = [
  { label: "Privacy", section: LC_SECTIONS.contact },
  { label: "Terms", section: LC_SECTIONS.contact },
  { label: "Accessibility", section: LC_SECTIONS.contact },
  { label: "Disclosures", section: LC_SECTIONS.contact },
] as const;
