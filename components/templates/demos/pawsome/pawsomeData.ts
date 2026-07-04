import { PS_IMAGES } from "./pawsomeImages";

export type PsProduct = {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  match?: number;
  points?: number;
  badge?: string;
  badges?: string[];
  category?: string;
  subscribeSave?: boolean;
  lowStock?: boolean;
  availableQuantity?: number;
  stockQuantity?: number;
};

export const PS_PRODUCTS: PsProduct[] = [
  {
    id: "peak-vitality",
    name: "Peak Vitality Organic Kibble",
    description: "Grain-Free, Wild Salmon",
    shortDescription: "Grain-Free, Wild Salmon",
    price: 62.5,
    compareAtPrice: 84,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCiPhONXQqKRzO81L6Ay0F56TFNSbZe2lkbpt4tF3XPlERrZbUhuaHOt6Nskd504MsJQafAAm1r2FXE4kUY3rdOiE0be17l02_T8JPSPgbIVXqvKqPHbh1pKVvmc23d2lwh6hkh1OHMVJ2lv_P5DOyvjx0liIU3egiQ5_-nLf6PaXUQ1_KNsk5WdWYkBCO4ADcoqfPRMu8l_prjrS91Pe7pvWG6exOxzL564KocCCIaFEtHLzDETpvvO3_70tbdZThMWejv0ngPGeD5",
    points: 50,
    badge: "Top Rated",
    badges: ["Top Rated", "Subscribe & Save"],
    subscribeSave: true,
  },
  {
    id: "leather-collar",
    name: "Artisan Heritage Leather Collar",
    description: "Full Grain Tan",
    shortDescription: "Full Grain Tan",
    price: 120,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBrqypk6nSRdActPRXfZxdZDyeM95wGCLPYTyFddtkvEN1WPpgDKRTdvAjF-Abqackmo9lF1wMge9EtE2DA6uBGKw2jBhf4XcPFhLKCxs3F4y2cvuU2VGXlhv7OJnCr1xholrGdR3th20X9evYO-En-5IFftbg6RdD5Up86NiBdy-gazy0YIaX3C4huf126u0LawoWaZJOVjI-kj7VAMSVt9Deifiszx0g3bLL1X7Sqc8jlSMcauxulTkDcwzdPDL1OlWvZPfNGMw8e",
    points: 50,
  },
  {
    id: "cloud-drift-bed",
    name: "CloudDrift Orthopaedic Bed",
    description: "Memory Foam, Large",
    shortDescription: "Memory Foam, Large",
    price: 155,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBw86-GHayughtAR9Sq15HLvnDBVFqSmg5fnMw1cyFCIXB1KMS49uae_MZZfPX2Uw7M-TGpnWSpyy3oRZI2cHB8KkJ7kZhSVx1AgCjKuoXdWW4RNXBS5TAat39wm2IrsoK7fwChD5ykhq81OXZgU1gIpcCPDeBo_c1HbG97hFwE28lg6JbvidyWoc6uWUhyvadVaqsXBj-zmOXkBX3LAJCEqCSU3DxPu8LowsMcRxNhZToePOv0yg0dCRVghH3j3G3GdmkuBxa5yhnM",
    badges: ["Subscribe & Save"],
    subscribeSave: true,
  },
  {
    id: "activeflex",
    name: "ActiveFlex Joint Support",
    description: "120 Soft Chews",
    shortDescription: "120 Soft Chews",
    price: 45,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDRNGoQJmwZYHEnPYdiHhEw9WlqDjBRJ1hbqgjcVIQNtmFWU1Yvm98X7FbhzgFxK6qJp-8ltztNL1maVWNTiJezOxgtRXl7HEdO98PgcWhuoUC8wDc-t320VRC6opiQVxAP88O3ahMIem-a-eVFsqI2zk32yuc-Ef7Bf2eqji2BpPNSAkp2EUzVkVUtWgYVbrfB5gjqkBrlqwiTpeMv33yQY9RZvEHUNcM7KgeFH3Hefai7j_sXJUUuvtB2hlNhLSNRdKUJ8_wW-9Uy",
    lowStock: true,
  },
  {
    id: "pure-balance",
    name: "PureBalance Lean",
    description: "Targeted weight management with L-Carnitine.",
    price: 42,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC5EHjpZ2_83ouoCQAXJEQxSMSU0eM79mguqoRms762DOQFXwqbc_yvR0jd5aUJGKdwvw7IeWJzU-nXjnbu9k4UuwgwC5AjNyw539JZTQjX1Irf5BOLvKWML1J3-kfaGfaMVStzG3CB1HJlAhLI3E8EuNnYyyizzun1LvtiYKcvOb097S0g9WRh4SPu07HWLw-_t5b54okuiZPhrCpZ5qG52MNrgKVBrwM5aTH-FU92U61q0tzTSldkcjagCHOmcJ8qS9PQE8eWQymn",
    match: 98,
    points: 120,
  },
  {
    id: "omega-glow",
    name: "OmegaGlow Oil",
    description: "Wild-caught Alaskan salmon oil for skin & coat.",
    price: 28,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBL6d7raTPw7LpVAod-4nxBPdUlrOxixvrrobkvjdiG4zGvOfWVOZCTbLB-C7IBJgOZV1xlvryk2lKawvPZ6LTrX2U16wHq4CvWxaWtuaVgBFUZ3Z8VNj9QZvadFpqggagd9MXVHsVXStZx2wJ0K4PhrbejKAbqVDSI5HxarfTfo42MJTNoi8nwJi0ozrak5Y9-3DL45AOVaw_B5zBL1ZIldmfGQX7g-Wxvkv5XEZz9liST5Vm96L29qPCB-EPqI4OTA4eVgClcdoKW",
    match: 95,
    points: 80,
  },
  {
    id: "artisan-salmon",
    name: "Artisan Grain-Free Salmon",
    description:
      "Sustainably sourced Atlantic salmon paired with organic sweet potatoes for optimal digestion and skin health.",
    price: 84,
    image: PS_IMAGES.salmonProduct,
    points: 50,
    badge: "Best Seller",
    category: "Dog Food",
  },
];

export const PS_SHOP_DOG_PRODUCTS: PsProduct[] = [
  PS_PRODUCTS.find((p) => p.id === "peak-vitality")!,
  PS_PRODUCTS.find((p) => p.id === "activeflex")!,
  PS_PRODUCTS.find((p) => p.id === "leather-collar")!,
  PS_PRODUCTS.find((p) => p.id === "cloud-drift-bed")!,
];

export const PS_LUNA_RECOMMENDATIONS = PS_PRODUCTS.filter((p) =>
  ["pure-balance", "omega-glow", "activeflex", "peak-vitality"].includes(p.id),
);

export const PS_ACCOUNT_PETS = [
  {
    name: "Luna",
    species: "Cat",
    detail: "Silver Tabby • 2 Years",
    progress: 75,
    progressLabel: "Nutrition Plan Progress",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBUdyMSYl1ryHT6PiQbnWMABlORUkCMtKf-hdFvRFTDpJaXZsQzWKpcaX5xbUBWlRh49SgZrmtteWvNo1orVoh4aTvdbwsmsWcH2UufIm6Ws5DOr-13TvEqu1nttU7lCCN_FnWEI_OcaVBMLgvNWX-23spFz3qnzYA50u3p7TEfjfu_7p1t2HIl9hBRmfpSZmCjOK7sUdPykoS1PHxIlD_S5fKkyn53rDqw-ZduIkjjf7puZwbrfKX2LMKnZOgYZX5CU6scV-yB2kln",
    hrefKey: "shopLuna" as const,
  },
  {
    name: "Max",
    species: "Dog",
    detail: "Golden Retriever • 4 Months",
    progress: 50,
    progressLabel: "Training Milestone",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBlZOg7XakH4ZUwKD20PBfUP6PzUAXgqhL-1YTdJrD02D3i2YbSvPdO6NDr-VruGBrT7TGiMGmAHrxPxAEvbhDxUk4Ojh8medafHwCzskCU9cmoQGchg_uTgEBH0Cnd8jmxWcuGR8I0h-KXlvzLphgGxxrh-_W0hkhXKJSgqQH09Oe2ZR-jffqvYb6e4H6YMrg2_6Ed3xqC5vTlqWDxqmkCrhhdypkxUERHT6xCU-cJmkSRKaiRD5XT4yKV8NIhTz6u0l2EURWVhGuy",
    hrefKey: "shop" as const,
  },
];

export const PS_ACCOUNT_ACTIVITY = [
  {
    id: "order-88219",
    icon: "payments",
    iconTone: "secondary" as const,
    borderTone: "secondary" as const,
    title: "Order #88219 - Confirmed",
    detail: "2 items • Delivered to 123 Pet Lane",
    when: "Yesterday",
  },
  {
    id: "vax-reminder",
    icon: "medical_services",
    iconTone: "tertiary" as const,
    borderTone: "tertiary" as const,
    title: "Max's Vaccination Reminder",
    detail: "Scheduled for October 20th",
    when: "3 days ago",
  },
];

export const PS_POINTS = {
  balance: 1250,
  tier: "Silver",
  nextTier: "Gold",
  pointsToNext: 250,
  progress: 75,
};

export const PS_ORDERS = [
  {
    id: "88219",
    pet: "Luna",
    date: "Oct 10, 2024",
    points: 150,
    status: "In Transit",
    eta: "Arriving Tomorrow",
    progress: 75,
    image: PS_IMAGES.lunaCat,
  },
  {
    id: "87542",
    pet: "Max",
    date: "Oct 1, 2024",
    points: 85,
    status: "Delivered",
    deliveredTo: "123 Pet Lane",
    image: PS_IMAGES.maxDog,
  },
];

export const PS_SUBSCRIPTIONS = [
  {
    id: "luna-salmon",
    pet: "Luna",
    label: "Luna's Nutrition Plan",
    product: "Artisan Grain-Free Salmon",
    image: PS_IMAGES.salmonPackaging,
    frequency: "Every 4 weeks",
    nextDate: "Oct 24, 2024",
    status: "Arriving in 4 days",
    streak: "8 Months",
    savings: "$12.40",
  },
  {
    id: "oliver-dental",
    pet: "Oliver",
    label: "Oliver's Wellness",
    product: "Advanced Dental Cleanse Chews",
    image: PS_IMAGES.dentalChews,
    frequency: "Every 8 weeks",
    nextDate: "Nov 12, 2024",
  },
];

export const PS_RESOURCES = [
  {
    title: "The Raw Food Guide: Benefits & Risks",
    category: "Nutrition Lab",
    readTime: "12 min read",
    points: 50,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAxlqnkRk0pvl0eqP65PBAL6OaBK3A0K86U_U6WTXpmh1p5qrIosPSlQme6Zg3P5nv94z7vOSGrm72FpKkVy4yWHSwwtYRC4-NFELUQNDLp1aCkPlGRw0X3Z6G_HgwFlpHXV85cxB6dJB-oUbpj-bajOFMnsBQYRtOwgCS5-JXsNxk2AmpNn9U3GzwOvPUaA9xy5VUP_5cP0_dpt7Pr5YN03SxBlUjoMW4QkLc4dkbEplyvllblW79g3wDXkIqf7dSdLIw_dyDBHCGZ",
  },
  {
    title: "Positive Reinforcement for Senior Cats",
    category: "Expert Training",
    readTime: "8 min read",
    points: 50,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDZfHW8I_yYV0PjNp9kNw_Q1o3-3BwpCTWJBZMlLIsjfWjj_aRNjy2LtIIE4rSXDavSoF5EgVYaM1aytCXQUg-13xYxG_LD9v1UvcfoqaHy25LPHxTZ5DVsnWj9Vnd818mXju9Ud0zusFz_wzLm03hX-RepUxGyYAzCfj5mOYwEGduf6RonrUVD0tLxCj92KOKsIFSdEA2Pyr-VOn4Nc-JY-rdzuMEI4ZQijd7Pt0qNBW3fYDwb6z7RGzPbvljg8P05U7NDxVKC6mhQ",
  },
  {
    title: "De-stressing Your Pet During Fireworks",
    category: "Behavior",
    readTime: "15 min read",
    points: 50,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAU4BnbZw2vKlqZoM-CkFcRPKtwRIG5DM5ypiN5Rh8-T9PSoLGk2kDdhPsDJltlH1nYiJgPX4CkEy5GKPoJ3zovDj1SbQflrAN3SOtyWaoYy5oRlQwDmPHn2USy_bipcL_gF-9WfzLdlemZcB0R15T-qNgNNqeKvrH80dDd3WCqUxpISvQci8CbUghLj3OLazfmdCDigV7RG8eVjumaxGRVZ6sqCKPLA-PjYfQNMM4NR4mHOavYynMmelIoTctBqGlNF5i9ik76KPeI",
  },
];
