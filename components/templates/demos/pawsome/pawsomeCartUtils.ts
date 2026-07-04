import type { PsCartItem } from "./PawsomeCartContext";

const FREE_SHIPPING_THRESHOLD = 75;
const SHIPPING_FLAT = 8.99;
const POINTS_REDEEM_VALUE = 10;
const POINTS_REDEEM_COST = 1000;

export function calcCartPointsEarned(items: PsCartItem[]): number {
  return items.reduce((s, i) => s + (i.product.points ?? 0) * i.qty, 0);
}

export function calcOrderTotals(
  items: PsCartItem[],
  options?: { redeemPoints?: boolean },
) {
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FLAT;
  const discount = options?.redeemPoints ? POINTS_REDEEM_VALUE : 0;
  const total = Math.max(0, subtotal + shipping - discount);
  const pointsEarned = calcCartPointsEarned(items);

  return { subtotal, shipping, discount, total, pointsEarned };
}

export function generateOrderId(): string {
  return `PP-${Math.floor(1000000 + Math.random() * 9000000)}`;
}

export { POINTS_REDEEM_COST, POINTS_REDEEM_VALUE, FREE_SHIPPING_THRESHOLD };
