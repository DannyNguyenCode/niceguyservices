"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CP_MEGA_CATEGORIES, CP_PRODUCTS } from "./companionPetData";
import { CP_PATHS } from "./companionPetConfig";

type MegaMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function MegaMenu({ open, onClose }: MegaMenuProps) {
  const featured = CP_PRODUCTS.slice(0, 2);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 lg:absolute lg:inset-auto lg:top-full lg:left-0 lg:right-0 lg:h-auto"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed inset-x-4 top-32 z-50 mx-auto max-w-4xl rounded-2xl border border-[var(--cp-border)] bg-white p-6 shadow-xl lg:absolute lg:inset-x-auto lg:left-0 lg:right-0 lg:top-full lg:mt-0 lg:max-w-none lg:rounded-none lg:border-x-0 lg:border-b lg:shadow-lg"
          >
            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--cp-slate)]">Categories</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {CP_MEGA_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.label}
                      href={cat.href}
                      onClick={onClose}
                      className="cp-card flex items-start gap-3 rounded-xl p-4 transition-colors hover:bg-[var(--cp-warm-gray)]"
                    >
                      <span className="material-symbols-outlined text-[var(--cp-blue)]" aria-hidden>
                        {cat.icon}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[var(--cp-charcoal)]">{cat.label}</p>
                        <p className="text-xs text-[var(--cp-slate)]">{cat.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--cp-slate)]">Featured</p>
                <ul className="mt-4 space-y-3">
                  {featured.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={CP_PATHS.shop}
                        onClick={onClose}
                        className="flex items-center gap-3 rounded-xl p-2 hover:bg-[var(--cp-warm-gray)]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{p.name}</p>
                          <p className="text-xs text-[var(--cp-orange)]">${p.price.toFixed(2)}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href={CP_PATHS.resources}
                  onClick={onClose}
                  className="mt-4 block text-sm font-medium text-[var(--cp-blue)] hover:underline"
                >
                  Pet care guides →
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
