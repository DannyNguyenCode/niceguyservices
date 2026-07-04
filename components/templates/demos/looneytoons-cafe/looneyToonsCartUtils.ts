import type { LtCartItem, LtCompletedOrder } from "./LooneyToonsCartContext";
import { calcStarsEarned, LT_STAR_TIERS } from "./looneytoonsCafeRewardsData";

const LT_COMPLETED_ORDER_KEY = "lt-cafe-completed-order";

export function saveCompletedOrderToSession(order: LtCompletedOrder) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(LT_COMPLETED_ORDER_KEY, JSON.stringify(order));
}

export function readCompletedOrderFromSession(): LtCompletedOrder | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(LT_COMPLETED_ORDER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LtCompletedOrder;
  } catch {
    return null;
  }
}

export function clearCompletedOrderSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(LT_COMPLETED_ORDER_KEY);
}

export function calcOrderTotals(
  items: LtCartItem[],
  options?: { redeemStars?: number | null },
) {
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const tier = options?.redeemStars
    ? LT_STAR_TIERS.find((t) => t.stars === options.redeemStars)
    : undefined;
  const discount = tier?.discount ?? 0;
  const starsRedeemed = tier?.stars ?? 0;
  const total = Math.max(0, subtotal - discount);
  const starsEarned = calcStarsEarned(subtotal);

  return { subtotal, discount, total, starsEarned, starsRedeemed };
}

export function generateOrderId(): string {
  return `COMET-${Math.floor(1000 + Math.random() * 9000)}`;
}
