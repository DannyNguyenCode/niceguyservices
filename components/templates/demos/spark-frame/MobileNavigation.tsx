"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { SparkButton } from "./SparkButton";
import { LAS_NAV_ITEMS, isLasNavActive, type LasNavKey } from "./leaveASparkConfig";
import { LAS_SITE } from "./leaveASparkSiteContent";
import { mobileMenuItem, usePrefersReducedMotion } from "./leaveASparkMotion";

export function MobileNavigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="las-focus-ring flex min-h-11 min-w-11 items-center justify-center text-[var(--las-off-white)]"
        aria-label="Open menu"
        aria-expanded={open}
      >
        <Bars3Icon className="h-7 w-7" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] bg-[var(--las-bg-primary)]"
            initial={reduced ? false : { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }}
            animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
            exit={reduced ? undefined : { clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="las-container flex min-h-dvh flex-col py-6">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="las-focus-ring flex min-h-11 min-w-11 items-center justify-center text-[var(--las-off-white)]"
                  aria-label="Close menu"
                >
                  <XMarkIcon className="h-7 w-7" />
                </button>
              </div>
              <nav className="mt-8 flex flex-1 flex-col gap-2" aria-label="Mobile">
                {LAS_NAV_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.key}
                    custom={i}
                    variants={mobileMenuItem}
                    initial={reduced ? false : "hidden"}
                    animate="visible"
                  >
                    <Link
                      href={item.href}
                      className={`las-display las-focus-ring block py-4 text-[clamp(1.75rem,8vw,2.5rem)] ${
                        isLasNavActive(pathname, item.key as LasNavKey)
                          ? "text-[var(--las-red)]"
                          : "text-[var(--las-off-white)]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <SparkButton href={LAS_SITE.primaryCTA.href} fullWidth>
                {LAS_SITE.primaryCTA.label}
              </SparkButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
