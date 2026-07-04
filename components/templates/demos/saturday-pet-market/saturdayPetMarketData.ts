import { SPM_IMG } from "./saturdayPetMarketImages";
import { SPM_PATHS } from "./saturdayPetMarketConfig";

export const SPM_PRODUCT_CATEGORIES = ["food", "treats", "toys", "health", "grooming", "supplies"] as const;
export type SpmProductCategory = (typeof SPM_PRODUCT_CATEGORIES)[number];

export type SpmProduct = {
  id: string;
  name: string;
  brand: string;
  subtitle?: string;
  description?: string;
  categories: SpmProductCategory[];
  price: number;
  salePrice?: number;
  image: string;
  petType: "dogs" | "cats" | "birds";
  rating: number;
  reviews: number;
  petTypeLabel?: string;
  badge?: string;
  tag?: string;
  quantity?: number;
  /** Shelf stock before reservations (admin). */
  stockQuantity?: number;
  /** Customer-facing availability (stock minus active holds). */
  availableQuantity?: number;
};

export const SPM_FEATURED_PRODUCT: SpmProduct = {
  id: "peanut-butter-paws",
  name: "Artisanal Peanut Butter Paws",
  brand: "Bark Bakery Co.",
  subtitle: "Organic & Grain-Free",
  categories: ["treats", "food"],
  price: 14.99,
  image: SPM_IMG.product.main,
  petType: "dogs",
  rating: 4,
  reviews: 128,
};

export type SpmHomeSpecial = {
  product: SpmProduct;
  desc: string;
  badge: string;
  badgeClass: string;
};

export const SPM_HOME_SPECIALS: SpmHomeSpecial[] = [
  {
    product: {
      id: "home-kibble",
      name: "Premium Grain-Free Kibble",
      brand: "NEIGHBORHOOD NUTRITION",
      categories: ["food"],
      price: 42.99,
      image: SPM_IMG.home.saleKibble,
      petType: "dogs",
      rating: 4.7,
      reviews: 89,
    },
    desc: "A neighborhood favorite! High protein, ethically sourced, and pets love the taste.",
    badge: "LIMITED STOCK",
    badgeClass: "bg-[var(--spm-primary)]",
  },
  {
    product: {
      id: "home-squeakies",
      name: "Interactive Squeakies",
      brand: "PLAYFUL PAWS",
      categories: ["toys"],
      price: 12.5,
      image: SPM_IMG.home.saleSqueakies,
      petType: "dogs",
      rating: 4.9,
      reviews: 64,
    },
    desc: "Keep them busy for hours with our new collection of retro-styled plushies.",
    badge: "BUY 2 GET 1",
    badgeClass: "bg-[var(--spm-tertiary)]",
  },
  {
    product: {
      id: "home-biscuits",
      name: "Artisan Bakery Biscuits",
      brand: "BARK BAKERY CO.",
      categories: ["treats", "food"],
      price: 8.99,
      image: SPM_IMG.home.saleBiscuits,
      petType: "dogs",
      rating: 4.8,
      reviews: 112,
    },
    desc: "Baked fresh every morning in-store. Natural honey and pumpkin flavors.",
    badge: "LOCAL FAVORITE",
    badgeClass: "bg-[var(--spm-secondary)]",
  },
];

export const SPM_CART_SEED: SpmProduct[] = [
  {
    id: "star-biscuits",
    name: "Artisanal Star Biscuits",
    brand: "Bark Bakery Co.",
    subtitle: "Organic & Grain-Free",
    categories: ["treats", "food"],
    price: 12.99,
    image: SPM_IMG.cart.starBiscuits,
    petType: "dogs",
    rating: 4.8,
    reviews: 42,
  },
  {
    id: "braided-rope",
    name: "Tough-Tug Braided Rope",
    brand: "Playful Paws",
    subtitle: "Heavy Duty • Multi-Color",
    categories: ["toys"],
    price: 18.5,
    image: SPM_IMG.cart.braidedRope,
    petType: "dogs",
    rating: 4.9,
    reviews: 18,
  },
];

export const SPM_SHOP_PRODUCTS: SpmProduct[] = [
  {
    id: "organic-peanut-bakes",
    name: "Organic Peanut Butter Bakes",
    brand: "KONG NUTRITION",
    description: "Salt-free, sugar-free, and organic. Perfect for filling puzzle toys.",
    categories: ["treats", "food"],
    price: 12.99,
    salePrice: 8.5,
    image: SPM_IMG.shop.peanutBakes,
    petType: "dogs",
    rating: 4.8,
    reviews: 124,
    badge: "SALE!",
  },
  {
    id: "neon-feather-wand",
    name: "Neon Feather Teaser Wand",
    brand: "FELINE FUN CO.",
    description: "Interactive wand with bright feathers to spark your cat's hunting instincts.",
    categories: ["toys"],
    price: 15,
    image: SPM_IMG.shop.featherWand,
    petType: "cats",
    rating: 5,
    reviews: 56,
    badge: "Best Seller",
  },
  {
    id: "sunflower-blend",
    name: "Premium Sunflower Blend",
    brand: "WILD WING GRAINS",
    description: "A nutritious mix of organic sunflower, millet, and flax seeds for small birds.",
    categories: ["food"],
    price: 24.99,
    image: SPM_IMG.shop.sunflower,
    petType: "birds",
    rating: 4.2,
    reviews: 31,
    subtitle: "Organic",
  },
  {
    id: "rubber-leash",
    name: "All-Weather Rubber Leash",
    brand: "AEROLEAD",
    description: "Durable rubber grip and reflective stitching for rainy morning walks.",
    categories: ["supplies", "grooming"],
    price: 22,
    image: SPM_IMG.shop.leash,
    petType: "dogs",
    rating: 4.9,
    reviews: 18,
    tag: "NEW",
  },
  {
    id: "puppy-sensitive",
    name: "Puppy Sensitive Skin & Stomach",
    brand: "PURINA PRO PLAN",
    description: "Gentle salmon and rice formula for growing pups with sensitive tummies.",
    categories: ["food"],
    price: 54.99,
    image: SPM_IMG.shop.puppyFood,
    petType: "dogs",
    rating: 4.7,
    reviews: 3400,
    subtitle: "Grain-Free",
  },
  {
    id: "cat-grass-kit",
    name: "Self-Growing Cat Grass Kit",
    brand: "GREEN WHISKER",
    description: "Organic wheatgrass kit that sprouts on your windowsill in under a week.",
    categories: ["health"],
    price: 12.5,
    image: SPM_IMG.shop.catGrass,
    petType: "cats",
    rating: 4.5,
    reviews: 89,
    subtitle: "Organic",
  },
];

export const SPM_EXTRA_FOOD_PRODUCTS: SpmProduct[] = [
  {
    id: "classic-chicken-kibble",
    name: "Classic Chicken Kibble",
    brand: "NEIGHBORHOOD NUTRITION",
    description: "Slow-roasted chicken recipe with sweet potato and garden peas.",
    categories: ["food"],
    price: 38.99,
    image: SPM_IMG.shop.chickenKibble,
    petType: "dogs",
    rating: 4.6,
    reviews: 214,
  },
  {
    id: "ocean-whitefish-cat",
    name: "Ocean Whitefish Entrée",
    brand: "MEOW KITCHEN",
    description: "Flaky whitefish in savory broth for picky feline diners.",
    categories: ["food"],
    price: 3.49,
    image: SPM_IMG.shop.catWhitefish,
    petType: "cats",
    rating: 4.8,
    reviews: 167,
    badge: "Best Seller",
  },
  {
    id: "senior-dog-stew",
    name: "Senior Comfort Stew",
    brand: "SILVER PAWS",
    description: "Soft bites in gravy formulated for dogs seven years and up.",
    categories: ["food"],
    price: 4.25,
    image: SPM_IMG.shop.seniorStew,
    petType: "dogs",
    rating: 4.7,
    reviews: 93,
  },
  {
    id: "rabbit-garden-greens",
    name: "Rabbit & Garden Greens",
    brand: "HOP & HARVEST",
    description: "Timothy hay blend with dried herbs for small herbivores.",
    categories: ["food"],
    price: 16.5,
    image: SPM_IMG.shop.rabbitGreens,
    petType: "dogs",
    rating: 4.5,
    reviews: 41,
    subtitle: "Locally Made",
  },
  {
    id: "finch-daily-mix",
    name: "Finch Daily Mix",
    brand: "FEATHER FRIENDS",
    description: "Canary seed, nyjer, and dried greens for songbirds.",
    categories: ["food"],
    price: 11.95,
    image: SPM_IMG.shop.finchMix,
    petType: "birds",
    rating: 4.4,
    reviews: 28,
    subtitle: "Organic",
  },
  {
    id: "raw-boost-topper",
    name: "Raw Boost Meal Topper",
    brand: "ROOT & BARK",
    description: "Freeze-dried beef crumble to sprinkle over any bowl.",
    categories: ["food"],
    price: 19.99,
    image: SPM_IMG.shop.mealTopper,
    petType: "dogs",
    rating: 4.9,
    reviews: 76,
  },
  {
    id: "pumpkin-puree-pouch",
    name: "Pumpkin Puree Pouch",
    brand: "PATCH PANTRY",
    description: "Single-ingredient pumpkin for digestion-friendly meal mixing.",
    categories: ["food"],
    price: 2.99,
    image: SPM_IMG.shop.pumpkinPouch,
    petType: "dogs",
    rating: 4.6,
    reviews: 132,
  },
  {
    id: "lamb-rice-formula",
    name: "Lamb & Rice Formula",
    brand: "MARKET SELECT",
    description: "Limited-ingredient dry food for sensitive stomachs.",
    categories: ["food"],
    price: 47.5,
    image: SPM_IMG.shop.lambRice,
    petType: "dogs",
    rating: 4.7,
    reviews: 288,
    subtitle: "Grain-Free",
  },
  {
    id: "morning-variety-pack",
    name: "Saturday Variety Pack",
    brand: "PET MARKET",
    description: "Twelve single-serve wet food cups — our staff favorites mix.",
    categories: ["food"],
    price: 28,
    salePrice: 22.5,
    image: SPM_IMG.shop.varietyPack,
    petType: "dogs",
    rating: 4.8,
    reviews: 55,
    badge: "SALE!",
  },
  {
    id: "salmon-pate-tins",
    name: "Wild Salmon Paté",
    brand: "PURRfect Herb",
    description: "Wild-caught salmon paté with no fillers or by-products.",
    categories: ["food"],
    price: 3.75,
    image: SPM_IMG.shop.salmonPate,
    petType: "cats",
    rating: 4.9,
    reviews: 201,
  },
];

function uniqueSpmProducts(products: SpmProduct[]): SpmProduct[] {
  const seen = new Set<string>();
  return products.filter((product) => {
    if (seen.has(product.id)) return false;
    seen.add(product.id);
    return true;
  });
}

/** Shop grid + home specials + featured PDP — source catalog for the search index. */
export const SPM_SEARCHABLE_PRODUCTS = uniqueSpmProducts([
  ...SPM_SHOP_PRODUCTS,
  ...SPM_EXTRA_FOOD_PRODUCTS,
  ...SPM_HOME_SPECIALS.map((special) => special.product),
  SPM_FEATURED_PRODUCT,
]);

/** Shown on empty search results — neighborly picks from the mockup. */
export const SPM_SEARCH_RECOMMENDATIONS: SpmProduct[] = [
  {
    id: "rec-biscuits",
    name: "Artisanal Bakery Biscuits",
    brand: "Bark Bakery",
    description: "Hand-pressed treats with cranberry and wild rosemary.",
    categories: ["treats", "food"],
    price: 12.99,
    image: SPM_IMG.search.recBiscuits,
    petType: "dogs",
    rating: 4.8,
    reviews: 112,
    badge: "Best Seller",
  },
  {
    id: "rec-tug",
    name: "Cotton Tug-o-War",
    brand: "Playful Paws",
    description: "Triple-braided durable cotton for the toughest chewers.",
    categories: ["toys"],
    price: 18.5,
    image: SPM_IMG.search.recTug,
    petType: "dogs",
    rating: 4.9,
    reviews: 64,
  },
  {
    id: "rec-kibble",
    name: "Vintage Grain-Free",
    brand: "Neighborhood Nutrition",
    description: "Small-batch ocean whitefish blend for sensitive kitties.",
    categories: ["food"],
    price: 24,
    image: SPM_IMG.search.recKibble,
    petType: "cats",
    rating: 4.7,
    reviews: 89,
  },
  {
    id: "rec-bed",
    name: "Plush Cloud Bed",
    brand: "Cozy Paws",
    description: "Ultra-soft recycled polyester filling for maximum naps.",
    categories: ["supplies"],
    price: 45.99,
    image: SPM_IMG.search.recBed,
    petType: "cats",
    rating: 4.6,
    reviews: 42,
    badge: "-15% Sale",
  },
];

export const SPM_RELATED_PRODUCTS = [
  { name: "Savory Bone Broth", price: 8.5, tag: "Organic", image: SPM_IMG.product.relatedBroth },
  { name: "Cotton Tug-o-War", price: 12, tag: "Tough", image: SPM_IMG.product.relatedTug },
  { name: "Variety Snacking Jar", price: 19.99, tag: "Assorted", image: SPM_IMG.product.relatedJar },
  { name: "Speckled Ceramic Bowl", price: 24, tag: "Durable", image: SPM_IMG.product.relatedBowl },
];

export function formatSpmPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function calcSpmCartTotals(items: { product: SpmProduct; qty: number }[]) {
  const subtotal = items.reduce((sum, i) => sum + (i.product.salePrice ?? i.product.price) * i.qty, 0);
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;
  return { subtotal, tax, total, shippingFree: true };
}

export const SPM_ACCOUNT_USER = {
  name: "Charlie",
  punchCount: 6,
  punchTotal: 10,
  nextPunchHint: "Buy any bag of Kibble",
};

export const SPM_REWARDS_PERKS = [
  "10% Off Every Store Purchase",
  "Early Access to Fresh Deliveries",
  "Birthday Treats for Your Best Friend",
  "1 Paws Point per $1 spent",
  "Exclusive Saturday Morning event invites",
  "Free local delivery on punch-card milestones",
] as const;

export const SPM_REWARDS_STEPS = [
  {
    icon: "person_add",
    title: "Join the Pack",
    body: "Create your free Rewards Club account in under a minute — no plastic card required.",
  },
  {
    icon: "shopping_bag",
    title: "Shop & Punch",
    body: "Earn a digital punch with qualifying purchases and collect Paws Points on every dollar.",
  },
  {
    icon: "redeem",
    title: "Redeem Treats",
    body: "Trade 100 Paws Points for $10 in market credit, or unlock member-only weekend specials.",
  },
] as const;

export const SPM_SAVED_CARTS = [
  { name: "Monthly Cat Refill", items: 3, total: 42.5 },
  { name: "Puppy Birthday Box", items: 5, total: 12.99 },
];

export const SPM_ORDER_HISTORY = [
  { id: "PM-88291", date: "Oct 24, 1991", items: "Bulk Bully Sticks (x2)...", total: 64.2, status: "DELIVERED" as const },
  { id: "PM-87902", date: "Oct 12, 1991", items: "Whimsical Chew Toy...", total: 18.45, status: "DELIVERED" as const },
];

export const SPM_SAVED_ADDRESSES = [
  {
    id: "home",
    label: "Home Sweet Home",
    icon: "home",
    primary: true,
    lines: ["123 Barker Avenue, Apt 4B", "Pawsington, CA 90210"],
  },
  {
    id: "office",
    label: "The Office",
    icon: "work",
    primary: false,
    lines: ["456 Corporate Treats Plaza", "Pawsington, CA 90210"],
  },
];

export const SPM_COMMUNITY_STATS = [
  { icon: "volunteer_activism", value: "$45k+", label: "Raised for Rescues" },
  { icon: "pets", value: "1,200", label: "Pets Adopted" },
  { icon: "restaurant", value: "15 Tons", label: "Kibble Donated" },
  { icon: "location_city", value: "24", label: "Local Partners" },
];

export const SPM_RESOURCE_ARTICLES = [
  {
    title: "The Ultimate First-Week Checklist for New Dog Parents",
    category: "NEW PET OWNERS",
    categoryClass: "bg-[var(--spm-primary)] text-[var(--spm-on-primary)]",
    readTime: "12 min read",
    excerpt:
      "Bringing home your first puppy is a whirlwind of joy and chew marks. Here's exactly how to prep your home and heart for the first seven days.",
    image: SPM_IMG.resources.featured,
    featured: true,
  },
  {
    title: "Decoding Labels: What's Actually in Their Kibble?",
    category: "NUTRITION",
    categoryClass: "bg-[var(--spm-tertiary)] text-[var(--spm-on-tertiary)]",
    readTime: "8 min read",
    excerpt: "Learn how to spot filler ingredients and find the protein-rich fuels your cats and dogs really crave.",
    image: SPM_IMG.resources.nutrition,
  },
  {
    title: "The Positive Reinforcement Revolution",
    category: "TRAINING",
    categoryClass: "bg-[var(--spm-secondary-container)] text-[var(--spm-on-secondary-container)]",
    readTime: "15 min read",
    excerpt: "Why snacks and praise are more effective than old-school discipline techniques for lifelong habits.",
    image: SPM_IMG.resources.training,
  },
  {
    title: "Seasonal Allergies: Is Your Pet Just Itchy?",
    category: "HEALTH",
    categoryClass: "bg-[var(--spm-primary-container)] text-[var(--spm-on-primary-container)]",
    readTime: "5 min read",
    excerpt: "How to identify common skin triggers during the spring and fall seasons and what you can do at home.",
    image: SPM_IMG.resources.health,
  },
];

export const SPM_STORE_LOCATIONS = [
  {
    id: "downtown",
    name: "Downtown Market",
    address: "124 Heritage Lane, Old Town",
    rating: 4.9,
    badge: "Original Spot",
    badgeClass: "bg-[var(--spm-secondary)] text-[var(--spm-on-secondary)]",
    hoursTitle: "Hours of Joy",
    hoursTitleClass: "text-[var(--spm-secondary-fixed-dim)]",
    hoursBorder: "border-[var(--spm-secondary)]",
    hours: ["Mon - Sat: 8am — 9pm", "Sunday: 10am — 6pm"],
    stats: [
      { icon: "pets", label: "150+ Adopted", fill: true },
      { icon: "volunteer_activism", label: "12k Meals Donated", fill: true },
    ],
    image: SPM_IMG.locations.downtown,
    pinClass: "bg-[var(--spm-secondary)] text-[var(--spm-on-secondary)]",
    pinPosition: { top: "20%", left: "30%" },
  },
  {
    id: "village",
    name: "The Village Corner",
    address: "442 West Maple Ave, Suburbia",
    rating: 4.8,
    badge: "Grooming On-Site",
    badgeClass: "bg-[var(--spm-tertiary)] text-[var(--spm-on-tertiary)]",
    hoursTitle: "Store Schedule",
    hoursTitleClass: "text-[var(--spm-tertiary-fixed-dim)]",
    hoursBorder: "border-[var(--spm-tertiary)]",
    hours: ["Daily: 9am — 8pm"],
    stats: [
      { icon: "soap", label: "500+ Grooms", fill: true },
      { icon: "favorite", label: "5 Local Partners", fill: true },
    ],
    image: SPM_IMG.locations.village,
    pinClass: "bg-[var(--spm-tertiary)] text-[var(--spm-on-tertiary)]",
    pinPosition: { top: "60%", left: "70%" },
  },
  {
    id: "hillside",
    name: "Hillside Pantry",
    address: "88 Oak Ridge, The Bluffs",
    rating: 5.0,
    hoursTitle: "Open To All",
    hoursTitleClass: "text-[var(--spm-primary-fixed-dim)]",
    hoursBorder: "border-[var(--spm-primary)]",
    hours: ["Mon - Fri: 10am — 7pm", "Sat: 9am — 5pm"],
    stats: [
      { icon: "cake", label: "Pet Bakery", fill: true },
      { icon: "groups", label: "Weekly Meetups", fill: true },
    ],
    image: SPM_IMG.locations.hillside,
    pinClass: "bg-[var(--spm-primary)] text-[var(--spm-on-primary)]",
    pinPosition: { top: "40%", left: "55%" },
  },
] as const;

export const SPM_CONTACT_OPTIONS = [
  { id: "general", icon: "help_center", label: "General Question", iconClass: "bg-[var(--spm-primary-container)] text-[var(--spm-on-primary-container)]" },
  { id: "order", icon: "inventory_2", label: "Order Support", iconClass: "bg-[var(--spm-tertiary-container)] text-[var(--spm-on-tertiary-container)]" },
  { id: "events", icon: "celebration", label: "Community Events", iconClass: "bg-[var(--spm-primary-fixed)] text-[var(--spm-on-primary-fixed-variant)]" },
  { id: "vendor", icon: "storefront", label: "Vendor Inquiry", iconClass: "bg-[var(--spm-secondary-fixed)] text-[var(--spm-on-secondary-fixed-variant)]" },
] as const;

export const SPM_FAQ_DELIVERY = [
  {
    title: "Do you offer same-day delivery?",
    body: "Yes! For neighbors within a 10-mile radius, orders placed before 12 PM are delivered the same afternoon in our vintage teal truck.",
    cta: "READ MORE",
  },
  {
    title: "How does local pickup work?",
    body: "Choose 'Curbside' at checkout. Pull up to the striped awning, ring our brass bell, and we'll bring your pet's treats right to your car door!",
    cta: "VIEW LOCATIONS",
    href: SPM_PATHS.locations,
  },
  {
    title: "What is your return policy?",
    body: "We want every tail to wag! Returns are accepted within 30 days. Unused goods get a full refund; opened food is donated to our local shelter partners.",
    badge: "30 DAYS",
    wide: true,
  },
] as const;
