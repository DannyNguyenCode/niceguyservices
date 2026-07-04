"use client";

import { usePawsomeCart } from "./PawsomeCartContext";
import { PsIcon } from "./PawsomeShared";

type PawsomeCartButtonProps = {
  className?: string;
};

export function PawsomeCartButton({ className = "" }: PawsomeCartButtonProps) {
  const { openCart, itemCount } = usePawsomeCart();

  return (
    <button
      type="button"
      onClick={openCart}
      className={`relative rounded-full p-2 text-[var(--ps-primary)] transition-colors hover:bg-[var(--ps-surface-container-high)] active:scale-[0.98] ${className}`}
      aria-label={`Shopping bag${itemCount > 0 ? `, ${itemCount} items` : ""}`}
    >
      <PsIcon name="shopping_bag" />
      {itemCount > 0 ? (
        <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--ps-secondary)] px-1 text-[10px] font-bold text-[var(--ps-on-secondary)]">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      ) : null}
    </button>
  );
}
