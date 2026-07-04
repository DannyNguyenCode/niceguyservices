import { LT_CAFE_IMAGES } from "./looneytoonsCafeImages";

export type LtMenuBadge = {
  text: string;
  className: string;
  rotate?: string;
  side: "left" | "right";
};

export type LtMenuProduct = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  alt: string;
  badge?: LtMenuBadge;
};

export const LT_MENU_PRODUCTS: LtMenuProduct[] = [
  {
    id: "flat-white",
    name: "Flat White",
    price: 5.95,
    description: "Micro-foam steamed milk poured over a double shot of our signature house roast.",
    image: LT_CAFE_IMAGES.menuFlatWhite,
    alt: "Flat white coffee with latte art",
  },
  {
    id: "iced-matcha",
    name: "Iced Matcha Latte",
    price: 7.95,
    description: "Premium ceremonial grade matcha whisked to perfection and served over ice.",
    image: LT_CAFE_IMAGES.menuMatcha,
    alt: "Iced matcha latte",
  },
  {
    id: "banana-matcha",
    name: "Banana Iced Matcha",
    price: 8.95,
    description: "Our signature matcha with a sweet, creamy banana-milk fusion.",
    image: LT_CAFE_IMAGES.menuBananaMatcha,
    alt: "Banana iced matcha",
    badge: {
      text: "BARISTA'S CHOICE",
      className: "bg-[#5d5f5f] text-white",
      rotate: "-rotate-[5deg]",
      side: "left",
    },
  },
  {
    id: "mango-matcha",
    name: "Mango Iced Matcha",
    price: 8.75,
    description: "A tropical twist on a classic, featuring real Alphonso mango purée.",
    image: LT_CAFE_IMAGES.menuMangoMatcha,
    alt: "Mango iced matcha",
  },
  {
    id: "turkey-chipotle",
    name: "Turkey Chipotle",
    price: 13.95,
    description: "Roasted turkey breast, spicy chipotle aioli, and fresh greens on sourdough.",
    image: LT_CAFE_IMAGES.menuTurkey,
    alt: "Turkey chipotle sandwich",
    badge: {
      text: "HOT ITEM",
      className: "bg-[#ba1a1a] text-white",
      rotate: "rotate-[5deg]",
      side: "right",
    },
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    price: 5.95,
    description: "Equal parts espresso, steamed milk, and rich foam. Simple and sophisticated.",
    image: LT_CAFE_IMAGES.menuCappuccino,
    alt: "Cappuccino",
  },
];

export function formatLtPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}
