"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { LasSectionHeading } from "./LasSectionHeading";
import { TextureOverlay } from "./TextureOverlays";
import { LAS_HOME } from "./leaveASparkSiteContent";
import { sectionReveal, usePrefersReducedMotion } from "./leaveASparkMotion";

export function HiddenCraftSection() {
  const { behindWalls } = LAS_HOME;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  useEffect(() => {
    if (inView && !reduced) setRevealed(true);
  }, [inView, reduced]);

  return (
    <section ref={ref} className="las-section-py">
      <div className="las-container">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="relative min-w-0">
            <TextureOverlay className="las-comic-panel overflow-hidden border-[4px] border-[var(--las-off-white)] bg-[var(--las-surface-raised)] p-6" grain halftone>
              <svg viewBox="0 0 400 320" className="h-auto w-full" role="img" aria-label="Cross-section of a wall revealing conduit and wiring behind finished drywall">
                {/* Finished wall surface */}
                <rect x="20" y="20" width="360" height="280" fill="#2a2826" rx="2" />
                <rect x="40" y="40" width="320" height="240" fill="#3d3a36" />
                {/* Drywall texture lines */}
                <line x1="40" y1="100" x2="360" y2="100" stroke="#4a4743" strokeWidth="1" opacity="0.5" />
                <line x1="40" y1="180" x2="360" y2="180" stroke="#4a4743" strokeWidth="1" opacity="0.5" />

                {/* Hidden wiring layer — mask reveal */}
                <g className={`las-wall-reveal-mask ${revealed ? "is-revealed" : ""}`}>
                  <rect x="40" y="40" width="320" height="240" fill="#1a1815" opacity="0.85" />
                  <rect x="80" y="60" width="16" height="200" fill="#333" stroke="#555" rx="2" />
                  <rect x="200" y="80" width="60" height="40" fill="#222" stroke="#D71920" strokeWidth="1.5" rx="2" />
                  <rect x="280" y="140" width="50" height="35" fill="#222" stroke="#D71920" strokeWidth="1.5" rx="2" />
                  <path
                    d="M96 80 L96 200 M96 140 L200 140 L200 100 M230 120 L280 157"
                    stroke="#D71920"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <circle cx="96" cy="140" r="5" fill="#F1222A" />
                  <circle cx="230" cy="120" r="4" fill="#F1222A" />
                  <text x="210" y="75" fill="#888" fontSize="9" fontFamily="monospace">
                    J-BOX
                  </text>
                  <text x="70" y="55" fill="#888" fontSize="9" fontFamily="monospace">
                    CONDUIT
                  </text>
                </g>

                {/* Outlet on surface */}
                <rect x="300" y="200" width="24" height="32" fill="#4a4743" stroke="#666" rx="1" />
              </svg>
            </TextureOverlay>
          </div>

          <motion.div className="min-w-0" variants={sectionReveal} initial="hidden" animate={inView ? "visible" : "hidden"}>
            <LasSectionHeading title={behindWalls.title} accent={behindWalls.titleAccent} body={behindWalls.body} />
            <ul className="mt-8 flex flex-col gap-6">
              {behindWalls.points.map((point) => (
                <li key={point.title} className="border-l-2 border-[var(--las-red)] pl-4">
                  <h3 className="las-display text-[clamp(1rem,2vw,1.25rem)] text-[var(--las-off-white)]">{point.title}</h3>
                  <p className="las-body mt-1 text-[0.9375rem] leading-relaxed text-[var(--las-muted)]">{point.description}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
