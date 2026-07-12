"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { LasSectionHeading } from "./LasSectionHeading";
import { HalftoneCorner } from "./TextureOverlays";
import { LAS_HOME } from "./leaveASparkSiteContent";
import { lasServicePath } from "./leaveASparkConfig";
import { cardLift, residualTrail, usePrefersReducedMotion } from "./leaveASparkMotion";

export function ServicePanelsSection() {
  const { servicePanels } = LAS_HOME;
  const reduced = usePrefersReducedMotion();

  return (
    <section className="bg-[var(--las-bg-secondary)] las-section-py">
      <div className="las-container">
        <LasSectionHeading
          title={servicePanels.title}
          accent={servicePanels.titleAccent}
          body={servicePanels.body}
          className="mb-10"
        />
        <div className="las-service-grid">
          {servicePanels.items.map((item) => (
            <ServicePanelCard key={item.slug} item={item} reduced={reduced} />
          ))}
        </div>
      </div>
    </section>
  );
}

type ServiceItem = (typeof LAS_HOME.servicePanels.items)[number];

function ServicePanelCard({ item, reduced }: { item: ServiceItem; reduced: boolean }) {
  const [trailing, setTrailing] = useState(false);
  const isLight = item.variant === "light";
  const colSpan = item.span.col === 2 ? "las-panel-span-2-col" : "";
  const rowSpan = item.span.row === 2 ? "las-panel-span-2-row" : "";

  return (
    <motion.div
      className={`min-w-0 ${colSpan} ${rowSpan}`}
      initial={false}
      whileHover={reduced ? undefined : "hover"}
      whileTap={reduced ? undefined : "tap"}
      variants={cardLift}
      onHoverStart={() => {
        setTrailing(true);
        window.setTimeout(() => setTrailing(false), 150);
      }}
      transition={{ duration: residualTrail.duration, ease: residualTrail.ease }}
    >
      <Link
        href={lasServicePath(item.slug)}
        className={`las-edge-current las-comic-panel group relative flex h-full min-h-[180px] flex-col overflow-hidden border-[3px] border-[var(--las-bg-primary)] sm:min-h-[200px] ${
          trailing ? "is-trailing" : ""
        } ${isLight ? "las-comic-panel--light" : "las-comic-panel--dark"}`}
      >
        <HalftoneCorner position="br" className="absolute inset-0 z-10 pointer-events-none" />
        <div className="relative aspect-[4/3] w-full overflow-hidden md:aspect-auto md:flex-1">
          <Image
            src={item.image}
            alt=""
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>
        <div className="relative z-[2] flex items-end justify-between gap-3 p-4">
          <div>
            <h3 className="las-display text-[clamp(1.1rem,2.5vw,1.5rem)]">{item.title}</h3>
            <p className={`las-body mt-1 text-[0.8125rem] leading-snug ${isLight ? "text-[#444]" : "text-[var(--las-muted)]"}`}>
              {item.description}
            </p>
          </div>
          <ArrowRightIcon
            className="h-5 w-5 shrink-0 text-[var(--las-red)] transition-transform group-hover:translate-x-1"
            aria-hidden
          />
        </div>
      </Link>
    </motion.div>
  );
}
