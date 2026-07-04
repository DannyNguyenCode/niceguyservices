"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { PetMarketShopperIdentity } from "@/lib/templates/pet-market-checkout/shopper-identity";
import type { PsProduct } from "./pawsomeData";
import { calcOrderTotals } from "./pawsomeCartUtils";

export type PsCartItem = { product: PsProduct; qty: number };

export type PsCompletedOrder = {
  id: string;
  confirmationNumber: string;
  items: PsCartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  pointsEarned: number;
  redeemPoints: boolean;
  placedAt: string;
  orderedBy: string;
  isGuest: boolean;
};

type PawsomeCartContextValue = {
  items: PsCartItem[];
  itemCount: number;
  subtotal: number;
  completedOrder: PsCompletedOrder | null;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: PsProduct, qty?: number) => boolean;
  updateQty: (productId: string, qty: number) => boolean;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  setCompletedOrder: (order: PsCompletedOrder | null) => void;
  maxAvailableQty: (product: PsProduct, currentQty?: number) => number;
};

const PawsomeCartContext = createContext<PawsomeCartContextValue | null>(null);

function productStock(product: PsProduct): number {
  const available = product.availableQuantity;
  if (typeof available === "number") return Math.max(0, available);
  return product.lowStock ? 5 : 99;
}

export function PawsomeCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<PsCartItem[]>([]);
  const [completedOrder, setCompletedOrder] = useState<PsCompletedOrder | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const maxAvailableQty = useCallback((product: PsProduct, currentQty = 0) => {
    return Math.max(0, productStock(product) - currentQty);
  }, []);

  const addToCart = useCallback((product: PsProduct, qty = 1) => {
    const stock = productStock(product);
    if (stock <= 0) return false;

    let added = false;
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      const currentQty = existing?.qty ?? 0;
      const nextQty = Math.min(currentQty + qty, stock);
      if (nextQty <= currentQty) return prev;

      added = true;
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, product, qty: nextQty } : i,
        );
      }
      return [...prev, { product, qty: Math.min(qty, stock) }];
    });

    if (added) setIsOpen(true);
    return added;
  }, []);

  const updateQty = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
      return true;
    }

    let ok = false;
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.product.id !== productId) return i;
          const capped = Math.min(qty, productStock(i.product));
          ok = capped > 0;
          return capped > 0 ? { ...i, qty: capped } : i;
        })
        .filter((i) => i.qty > 0),
    );
    return ok;
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setIsOpen(false);
  }, []);

  const value = useMemo<PawsomeCartContextValue>(() => {
    const itemCount = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
    return {
      items,
      itemCount,
      subtotal,
      completedOrder,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      toggleCart: () => setIsOpen((o) => !o),
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      setCompletedOrder,
      maxAvailableQty,
    };
  }, [items, completedOrder, isOpen, addToCart, updateQty, removeFromCart, clearCart, maxAvailableQty]);

  return (
    <PawsomeCartContext.Provider value={value}>{children}</PawsomeCartContext.Provider>
  );
}

export function usePawsomeCart() {
  const ctx = useContext(PawsomeCartContext);
  if (!ctx) {
    throw new Error("usePawsomeCart must be used within PawsomeCartProvider");
  }
  return ctx;
}

export function buildPsCompletedOrder(
  items: PsCartItem[],
  confirmationNumber: string,
  options?: { redeemPoints?: boolean; shopper?: PetMarketShopperIdentity },
): PsCompletedOrder {
  const totals = calcOrderTotals(items, { redeemPoints: options?.redeemPoints });
  const shopper = options?.shopper;
  return {
    id: confirmationNumber,
    confirmationNumber,
    items: [...items],
    subtotal: totals.subtotal,
    shipping: totals.shipping,
    discount: totals.discount,
    total: totals.total,
    pointsEarned: totals.pointsEarned,
    redeemPoints: Boolean(options?.redeemPoints),
    placedAt: new Date().toISOString(),
    orderedBy: shopper?.displayName ?? "Guest",
    isGuest: shopper?.isGuest ?? true,
  };
}
