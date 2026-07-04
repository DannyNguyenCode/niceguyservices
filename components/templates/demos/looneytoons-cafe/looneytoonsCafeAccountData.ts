import { formatLtPrice } from "./looneytoonsCafeData";

export type LtAccountOrder = {
  id: string;
  date: string;
  items: string;
  total: number;
  status: string;
};

export type LtAccountContact = {
  id: string;
  label: string;
  lines: string[];
  primary?: boolean;
  icon: "mail" | "phone" | "location_on";
};

export const LT_ACCOUNT_DEMO = {
  starBalance: 125,
  punchCount: 4,
  punchTotal: 8,
  nextRewardHint: "One more visit unlocks a free pastry",
  memberSince: "2024",
} as const;

export const LT_ORDER_HISTORY: LtAccountOrder[] = [
  {
    id: "COMET-4821",
    date: "Jun 12, 2026",
    items: "Latte, Iced Matcha",
    total: 18.63,
    status: "Picked up",
  },
  {
    id: "COMET-4790",
    date: "Jun 4, 2026",
    items: "Cappuccino, Banana Iced Matcha",
    total: 22.85,
    status: "Picked up",
  },
  {
    id: "COMET-4755",
    date: "May 28, 2026",
    items: "Turkey Chipotle, Cold Brew",
    total: 24.63,
    status: "Picked up",
  },
];

export const LT_CONTACT_INFO: LtAccountContact[] = [
  {
    id: "email",
    label: "Email",
    lines: ["member@cometcup.demo"],
    primary: true,
    icon: "mail",
  },
  {
    id: "phone",
    label: "Phone",
    lines: ["(555) 019-8844"],
    icon: "phone",
  },
  {
    id: "pickup",
    label: "Preferred pickup",
    lines: ["Inkwell Pier kiosk", "88 Inkwell Pier, Rubberhose, RH"],
    icon: "location_on",
  },
];

export function formatLtOrderTotal(total: number): string {
  return formatLtPrice(total);
}
