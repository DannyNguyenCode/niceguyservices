import { CP_PATHS } from "./companionPetConfig";

export type PetType = "dog" | "cat" | "bird" | "fish" | "small-pet";
export type ProductCategory = "food" | "wellness" | "toys" | "grooming" | "accessories";

export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  hoverImage: string;
  pet: PetType[];
  category: ProductCategory;
  dietary?: string[];
  age?: string[];
  health?: string[];
  loyaltyPoints: number;
  inStock: boolean;
  stockLevel: "high" | "low" | "out";
  availableQuantity?: number;
  stockQuantity?: number;
  badges?: string[];
  subscription?: boolean;
  recommended?: boolean;
  deal?: boolean;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  max?: number;
};

export type Resource = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  trending?: boolean;
  expert?: string;
};

export type Testimonial = {
  id: string;
  name: string;
  pet: string;
  quote: string;
  rating: number;
  avatar: string;
};

export const CP_LOYALTY = {
  level: "Gold Companion",
  levelNumber: 3,
  xp: 2840,
  xpToNext: 3500,
  points: 1240,
  streak: 4,
  monthlyGoal: 500,
  monthlyProgress: 340,
} as const;

export const CP_PET_PROFILE = {
  name: "Luna",
  type: "Golden Retriever",
  age: "3 years",
  avatar: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=200&h=200&fit=crop",
} as const;

export const CP_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Premium Grain-Free Salmon",
    brand: "WildCraft",
    price: 54.99,
    originalPrice: 64.99,
    rating: 4.8,
    reviewCount: 342,
    image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop",
    pet: ["dog"],
    category: "food",
    dietary: ["grain-free", "high-protein"],
    age: ["adult"],
    health: ["skin-coat"],
    loyaltyPoints: 55,
    inStock: true,
    stockLevel: "high",
    badges: ["Best Seller"],
    subscription: true,
    recommended: true,
    deal: true,
  },
  {
    id: "p2",
    name: "Calming Hemp Chews",
    brand: "SerenePaws",
    price: 28.99,
    rating: 4.6,
    reviewCount: 189,
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop",
    pet: ["dog", "cat"],
    category: "wellness",
    dietary: ["natural"],
    age: ["adult", "senior"],
    health: ["anxiety", "joint"],
    loyaltyPoints: 29,
    inStock: true,
    stockLevel: "high",
    badges: ["Wellness Pick"],
    subscription: true,
    recommended: true,
  },
  {
    id: "p3",
    name: "Interactive Puzzle Feeder",
    brand: "MindfulPet",
    price: 34.99,
    rating: 4.9,
    reviewCount: 521,
    image: "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=400&h=400&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop",
    pet: ["dog"],
    category: "toys",
    age: ["puppy", "adult"],
    loyaltyPoints: 35,
    inStock: true,
    stockLevel: "low",
    badges: ["Staff Pick"],
    recommended: true,
  },
  {
    id: "p4",
    name: "Organic Cat Pâté Variety",
    brand: "Whisker & Co",
    price: 42.99,
    rating: 4.7,
    reviewCount: 267,
    image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop",
    pet: ["cat"],
    category: "food",
    dietary: ["organic"],
    age: ["adult"],
    health: ["digestive"],
    loyaltyPoints: 43,
    inStock: true,
    stockLevel: "high",
    subscription: true,
  },
  {
    id: "p5",
    name: "Silicone Grooming Kit",
    brand: "PureCoat",
    price: 39.99,
    originalPrice: 49.99,
    rating: 4.5,
    reviewCount: 98,
    image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400&h=400&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=400&fit=crop",
    pet: ["dog", "cat"],
    category: "grooming",
    age: ["all"],
    loyaltyPoints: 40,
    inStock: true,
    stockLevel: "high",
    deal: true,
  },
  {
    id: "p6",
    name: "Smart Water Fountain",
    brand: "HydratePro",
    price: 79.99,
    rating: 4.8,
    reviewCount: 412,
    image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop",
    pet: ["cat", "dog", "bird"],
    category: "accessories",
    health: ["hydration"],
    loyaltyPoints: 80,
    inStock: true,
    stockLevel: "high",
    badges: ["Premium"],
    recommended: true,
  },
  {
    id: "p7",
    name: "Senior Joint Support",
    brand: "AgeWell",
    price: 45.99,
    rating: 4.4,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop",
    pet: ["dog"],
    category: "wellness",
    age: ["senior"],
    health: ["joint"],
    loyaltyPoints: 46,
    inStock: true,
    stockLevel: "high",
    subscription: true,
  },
  {
    id: "p8",
    name: "Feather Wand Play Set",
    brand: "Whisker & Co",
    price: 18.99,
    rating: 4.9,
    reviewCount: 634,
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop",
    pet: ["cat"],
    category: "toys",
    age: ["kitten", "adult"],
    loyaltyPoints: 19,
    inStock: true,
    stockLevel: "high",
    badges: ["Top Rated"],
  },
];

export const CP_ACHIEVEMENTS: Achievement[] = [
  { id: "a1", title: "First Purchase", description: "Complete your first order", icon: "shopping_bag", unlocked: true },
  { id: "a2", title: "Wellness Warrior", description: "Buy 3 wellness products", icon: "favorite", unlocked: true, progress: 3, max: 3 },
  { id: "a3", title: "Streak Master", description: "4-week purchase streak", icon: "local_fire_department", unlocked: true, progress: 4, max: 4 },
  { id: "a4", title: "Referral Champion", description: "Refer 2 friends", icon: "group", unlocked: false, progress: 1, max: 2 },
  { id: "a5", title: "Platinum Path", description: "Reach Platinum tier", icon: "workspace_premium", unlocked: false, progress: 2840, max: 5000 },
  { id: "a6", title: "Nutrition Expert", description: "Read 5 nutrition guides", icon: "menu_book", unlocked: false, progress: 2, max: 5 },
];

export const CP_RESOURCES: Resource[] = [
  { id: "r1", title: "Complete Guide to Grain-Free Diets", excerpt: "Understanding when grain-free makes sense for your pet's health and nutrition needs.", category: "Nutrition", readTime: "8 min", trending: true, expert: "Dr. Sarah Chen, DVM" },
  { id: "r2", title: "Managing Pet Anxiety Naturally", excerpt: "Evidence-based approaches to calming supplements, routines, and environmental changes.", category: "Wellness", readTime: "6 min", expert: "Dr. Marcus Webb" },
  { id: "r3", title: "Puppy Nutrition Timeline", excerpt: "Month-by-month feeding guide from weaning through adulthood.", category: "Nutrition", readTime: "10 min", trending: true },
  { id: "r4", title: "Senior Pet Care Essentials", excerpt: "Joint support, cognitive health, and comfort strategies for aging companions.", category: "Wellness", readTime: "7 min" },
  { id: "r5", title: "Reading Pet Food Labels", excerpt: "Decode ingredients, guaranteed analysis, and marketing claims.", category: "Education", readTime: "5 min" },
  { id: "r6", title: "Hydration & Kidney Health", excerpt: "Why water intake matters and how to encourage healthy drinking habits.", category: "Health", readTime: "4 min", expert: "Dr. Sarah Chen, DVM" },
];

export const CP_TESTIMONIALS: Testimonial[] = [
  { id: "t1", name: "Emily R.", pet: "Luna · Golden Retriever", quote: "The rewards system actually makes reordering feel rewarding. Luna's wellness plan is perfectly curated.", rating: 5, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop" },
  { id: "t2", name: "James K.", pet: "Mochi · British Shorthair", quote: "Premium quality without the hassle. The subscription saves time and the loyalty perks add up fast.", rating: 5, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" },
  { id: "t3", name: "Priya S.", pet: "Cooper · Labrador", quote: "The resource center helped me understand Cooper's dietary needs. Shopping feels informed, not overwhelming.", rating: 5, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop" },
];

export const CP_FAQS = [
  { q: "How does the Companion Rewards program work?", a: "Earn points on every purchase, unlock tier benefits, and track achievements. Points can be redeemed at checkout for discounts on future orders." },
  { q: "Can I manage subscriptions from my account?", a: "Yes. Pause, skip, or modify delivery frequency anytime from your account dashboard. Changes apply to your next scheduled shipment." },
  { q: "Do you offer personalized product recommendations?", a: "Your pet profile powers tailored suggestions based on species, age, dietary needs, and purchase history — updated as you shop." },
  { q: "What is your return policy?", a: "Unopened items can be returned within 30 days. Wellness products include a satisfaction guarantee — contact support for details." },
];

export const CP_MEGA_CATEGORIES = [
  { label: "Dog", href: CP_PATHS.shop, icon: "pets", desc: "Food, wellness & gear" },
  { label: "Cat", href: CP_PATHS.shop, icon: "cruelty_free", desc: "Nutrition & enrichment" },
  { label: "Wellness", href: CP_PATHS.shop, icon: "health_and_safety", desc: "Supplements & care" },
  { label: "Nutrition Guides", href: CP_PATHS.resources, icon: "menu_book", desc: "Expert resources" },
] as const;

export const CP_FILTER_GROUPS = {
  pet: ["dog", "cat", "bird", "fish", "small-pet"] as PetType[],
  category: ["food", "wellness", "toys", "grooming", "accessories"] as ProductCategory[],
  brand: ["WildCraft", "SerenePaws", "MindfulPet", "Whisker & Co", "PureCoat", "HydratePro", "AgeWell"],
  dietary: ["grain-free", "organic", "natural", "high-protein"],
  age: ["puppy", "kitten", "adult", "senior", "all"],
  health: ["anxiety", "joint", "digestive", "skin-coat", "hydration"],
} as const;

export const CP_RECENT_ORDERS = [
  { id: "ORD-4821", date: "May 18, 2026", total: 83.98, status: "Delivered", items: 2 },
  { id: "ORD-4793", date: "Apr 30, 2026", total: 54.99, status: "Delivered", items: 1 },
  { id: "ORD-4756", date: "Apr 12, 2026", total: 112.97, status: "Delivered", items: 3 },
];

export const CP_ACTIVITY = [
  { id: "act1", label: "Earned 55 points", detail: "Premium Grain-Free Salmon", time: "2 days ago" },
  { id: "act2", label: "Achievement unlocked", detail: "Wellness Warrior", time: "1 week ago" },
  { id: "act3", label: "Subscription renewed", detail: "Calming Hemp Chews", time: "2 weeks ago" },
  { id: "act4", label: "Referral bonus pending", detail: "Invite a friend", time: "3 weeks ago" },
];
