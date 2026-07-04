"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Product } from "./companionPetData";
import type { CartItem } from "./CartDrawer";
import { CompanionPetTopBar } from "./CompanionPetTopBar";
import { CompanionPetHeader } from "./CompanionPetHeader";
import { CompanionPetBottomNav } from "./CompanionPetBottomNav";
import { CompanionPetAuthProvider } from "./CompanionPetAuthContext";

type CartContextValue = {
  items: CartItem[];
  addToCart: (product: Product, qty?: number) => boolean;
  updateQty: (productId: string, qty: number) => boolean;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  openCart: () => void;
  maxAvailableQty: (product: Product, currentQty?: number) => number;
};

const CartContext = createContext<CartContextValue | null>(null);

function productStock(product: Product): number {
  const available = product.availableQuantity ?? (product.inStock ? 99 : 0);
  return typeof available === "number" ? Math.max(0, available) : 0;
}

export function useCompanionPetCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCompanionPetCart must be used within CompanionPetShell");
  return ctx;
}

export function CompanionPetShell({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const maxAvailableQty = useCallback((product: Product, currentQty = 0) => {
    return Math.max(0, productStock(product) - currentQty);
  }, []);

  const addToCart = useCallback((product: Product, qty = 1) => {
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

    if (added) setCartOpen(true);
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
    setCartOpen(false);
  }, []);

  const cartCount = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);

  const value = useMemo(
    () => ({
      items,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      cartCount,
      openCart: () => setCartOpen(true),
      maxAvailableQty,
    }),
    [items, addToCart, updateQty, removeFromCart, clearCart, cartCount, maxAvailableQty],
  );

  return (
    <CompanionPetAuthProvider>
      <CartContext.Provider value={value}>
      <div className="sticky top-0 z-50">
        <CompanionPetTopBar />
        <CompanionPetHeader
          cartItems={items}
          onUpdateCartQty={updateQty}
          cartOpen={cartOpen}
          onCartOpenChange={setCartOpen}
        />
      </div>
      <div className="min-w-0 flex-1 pb-20 md:pb-0">{children}</div>
      <CompanionPetBottomNav cartCount={cartCount} onCartClick={() => setCartOpen(true)} />
    </CartContext.Provider>
    </CompanionPetAuthProvider>
  );
}
