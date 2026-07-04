"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { LtMenuProduct } from "./looneytoonsCafeData";
import { DEMO_STAR_BALANCE } from "./looneytoonsCafeRewardsData";
import { calcOrderTotals, generateOrderId, saveCompletedOrderToSession } from "./looneyToonsCartUtils";

export type LtCartItem = { product: LtMenuProduct; qty: number };

export type LtCompletedOrder = {
  id: string;
  items: LtCartItem[];
  subtotal: number;
  discount: number;
  total: number;
  starsEarned: number;
  starsRedeemed: number;
  starBalanceAfter: number;
  placedAt: string;
};

type LooneyToonsCartContextValue = {
  items: LtCartItem[];
  itemCount: number;
  subtotal: number;
  starBalance: number;
  completedOrder: LtCompletedOrder | null;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: LtMenuProduct, qty?: number) => void;
  updateQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  completeOrder: (options?: { redeemStars?: number | null }) => LtCompletedOrder | null;
};

const LooneyToonsCartContext = createContext<LooneyToonsCartContextValue | null>(null);

export function LooneyToonsCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<LtCartItem[]>([]);
  const [starBalance, setStarBalance] = useState(DEMO_STAR_BALANCE);
  const [completedOrder, setCompletedOrder] = useState<LtCompletedOrder | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = useCallback((product: LtMenuProduct, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + qty } : i,
        );
      }
      return [...prev, { product, qty }];
    });
    setIsOpen(true);
  }, []);

  const updateQty = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, qty } : i)),
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const completeOrder = useCallback(
    (options?: { redeemStars?: number | null }) => {
      if (items.length === 0) return null;
      const totals = calcOrderTotals(items, { redeemStars: options?.redeemStars });
      const starsRedeemed = totals.starsRedeemed;
      const starBalanceAfter = starBalance - starsRedeemed + totals.starsEarned;
      const order: LtCompletedOrder = {
        id: generateOrderId(),
        items: [...items],
        subtotal: totals.subtotal,
        discount: totals.discount,
        total: totals.total,
        starsEarned: totals.starsEarned,
        starsRedeemed,
        starBalanceAfter,
        placedAt: new Date().toISOString(),
      };
      setCompletedOrder(order);
      saveCompletedOrderToSession(order);
      setStarBalance(starBalanceAfter);
      setItems([]);
      setIsOpen(false);
      return order;
    },
    [items, starBalance],
  );

  const value = useMemo<LooneyToonsCartContextValue>(() => {
    const itemCount = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
    return {
      items,
      itemCount,
      subtotal,
      starBalance,
      completedOrder,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      toggleCart: () => setIsOpen((o) => !o),
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      completeOrder,
    };
  }, [
    items,
    starBalance,
    completedOrder,
    isOpen,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    completeOrder,
  ]);

  return (
    <LooneyToonsCartContext.Provider value={value}>{children}</LooneyToonsCartContext.Provider>
  );
}

export function useLooneyToonsCart() {
  const ctx = useContext(LooneyToonsCartContext);
  if (!ctx) {
    throw new Error("useLooneyToonsCart must be used within LooneyToonsCartProvider");
  }
  return ctx;
}
