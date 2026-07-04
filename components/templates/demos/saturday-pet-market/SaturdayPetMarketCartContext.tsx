"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSpmAuth } from "./SaturdayPetMarketAuthContext";
import { SPM_PATHS } from "./saturdayPetMarketConfig";
import { calcSpmCartTotals, type SpmProduct } from "./saturdayPetMarketData";

export type SpmCartItem = { product: SpmProduct; qty: number };

type SpmCartContextValue = {
  items: SpmCartItem[];
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: SpmProduct, qty?: number) => boolean;
  updateQty: (productId: string, qty: number) => boolean;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  maxAvailableQty: (product: SpmProduct, currentQty?: number) => number;
};

const SpmCartContext = createContext<SpmCartContextValue | null>(null);

function productStock(product: SpmProduct): number {
  const available = product.availableQuantity ?? product.quantity;
  return typeof available === "number" ? Math.max(0, available) : 0;
}

export function SpmCartProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isLoggedIn, hydrated } = useSpmAuth();
  const [items, setItems] = useState<SpmCartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!isLoggedIn) {
      setItems([]);
      setIsOpen(false);
    }
  }, [hydrated, isLoggedIn]);

  const maxAvailableQty = useCallback((product: SpmProduct, currentQty = 0) => {
    return Math.max(0, productStock(product) - currentQty);
  }, []);

  const addToCart = useCallback(
    (product: SpmProduct, qty = 1) => {
      if (!isLoggedIn) {
        router.push(SPM_PATHS.login);
        return false;
      }

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
    },
    [isLoggedIn, router],
  );

  const updateQty = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
      return true;
    }

    let ok = false;
    setItems((prev) =>
      prev.map((i) => {
        if (i.product.id !== productId) return i;
        const capped = Math.min(qty, productStock(i.product));
        ok = capped > 0;
        return capped > 0 ? { ...i, qty: capped } : i;
      }).filter((i) => i.qty > 0),
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

  const value = useMemo<SpmCartContextValue>(() => {
    const itemCount = items.reduce((n, i) => n + i.qty, 0);
    const { subtotal } = calcSpmCartTotals(items);
    return {
      items,
      itemCount,
      subtotal,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      toggleCart: () => setIsOpen((v) => !v),
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      maxAvailableQty,
    };
  }, [items, isOpen, addToCart, updateQty, removeFromCart, clearCart, maxAvailableQty]);

  return <SpmCartContext.Provider value={value}>{children}</SpmCartContext.Provider>;
}

export function useSpmCart() {
  const ctx = useContext(SpmCartContext);
  if (!ctx) throw new Error("useSpmCart must be used within SpmCartProvider");
  return ctx;
}
