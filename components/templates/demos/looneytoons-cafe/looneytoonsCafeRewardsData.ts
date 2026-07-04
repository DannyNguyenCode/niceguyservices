import { LT_CAFE_IMAGES } from "./looneytoonsCafeImages";

/** Demo starting balance — matches rewards page copy. */
export const DEMO_STAR_BALANCE = 125;

/** 1 star for every $1 spent (rewards page). */
export const STARS_PER_DOLLAR = 1;

/** Elite tier cap for progress bar (400 stars on rewards page). */
export const STAR_ELITE_THRESHOLD = 400;

export type LtStarTier = {
  stars: number;
  label: string;
  items: string[];
  discount: number;
  chip: string;
  img: string;
  alt: string;
  dark: boolean;
  elite: boolean;
};

export const LT_STAR_TIERS: LtStarTier[] = [
  {
    stars: 100,
    label: "100 STARS",
    items: ["Pastry", "Brewed coffee", "Tea"],
    discount: 5,
    chip: "bg-[#dde2f4]",
    img: LT_CAFE_IMAGES.menuFlatWhite,
    alt: "Coffee cup",
    dark: false,
    elite: false,
  },
  {
    stars: 200,
    label: "200 STARS",
    items: ["Handcrafted drink", "Americano", "Booster shot"],
    discount: 8,
    chip: "bg-[#d4daec] text-[#151c28]",
    img: LT_CAFE_IMAGES.menuMatcha,
    alt: "Specialty drink",
    dark: true,
    elite: false,
  },
  {
    stars: 300,
    label: "300 STARS",
    items: ["Morning fuel item", "Smoothie", "Snack pack"],
    discount: 12,
    chip: "bg-[#dde2f4]",
    img: LT_CAFE_IMAGES.menuMangoMatcha,
    alt: "Food bowl",
    dark: false,
    elite: false,
  },
  {
    stars: 400,
    label: "400 STARS",
    items: ["Any full bowl", "Any sandwich"],
    discount: 15,
    chip: "bg-[#151c28] text-[#f9f9ff]",
    img: LT_CAFE_IMAGES.menuTurkey,
    alt: "Sandwich",
    dark: true,
    elite: true,
  },
];

export function calcStarsEarned(subtotal: number): number {
  return Math.floor(subtotal * STARS_PER_DOLLAR);
}

export function calcStarProgressPercent(balance: number): number {
  return Math.min(100, Math.round((balance / STAR_ELITE_THRESHOLD) * 100));
}

export function getRedeemableTiers(balance: number): LtStarTier[] {
  return LT_STAR_TIERS.filter((tier) => balance >= tier.stars);
}
