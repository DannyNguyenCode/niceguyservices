"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LasSectionHeading } from "./LasSectionHeading";
import { LAS_HOME } from "./leaveASparkSiteContent";
import { lasPath } from "./leaveASparkConfig";

export function FeaturedProjectSection() {
  const project = LAS_HOME.featuredProject;
  const [hovered, setHovered] = useState(false);

  return (
    <section className="bg-[var(--las-bg-secondary)] las-section-py">
      <div className="las-container">
        <LasSectionHeading
          title={project.title}
          accent={project.titleAccent}
          className="mb-10"
        />
        <div className="relative">
          <div className="las-comic-panel relative overflow-hidden border-[4px] border-[var(--las-off-white)] bg-[var(--las-bg-primary)]">
            <div className="relative aspect-[16/9] w-full md:aspect-[21/9]">
              <Image
                src={project.image}
                alt={`Featured project: ${project.category} in ${project.location}`}
                fill
                className={`object-cover transition-[filter] duration-300 ${hovered ? "brightness-110 contrast-105" : ""}`}
                sizes="(max-width: 1024px) 100vw, 80vw"
              />
              {hovered && (
                <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
                  <path
                    d="M40 80 L200 80 L350 200"
                    stroke="#F1222A"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="8 6"
                    className="las-ambient-pulse"
                  />
                </svg>
              )}
            </div>
          </div>

          <div
            className="relative z-10 mx-4 -mt-6 w-[calc(100%-2rem)] max-w-lg border-[3px] border-[var(--las-bg-primary)] bg-[var(--las-off-white)] p-5 text-[var(--las-bg-primary)] shadow-[6px_6px_0_#050505] sm:p-6 md:absolute md:bottom-8 md:left-8 md:mx-0 md:mt-0 md:w-auto md:shadow-[8px_8px_0_#050505]"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <span className="las-label inline-block bg-[var(--las-red)] px-2 py-0.5 text-[var(--las-off-white)]">
              {project.tag}
            </span>
            <p className="las-label mt-3 text-[#666]">{project.category}</p>
            <h3 className="las-display mt-1 text-[clamp(1.25rem,3vw,1.75rem)]">{project.location}</h3>
            <p className="las-body mt-2 text-[0.875rem] leading-relaxed text-[#444]">
              <strong className="text-[var(--las-bg-primary)]">Scope:</strong> {project.scope}
            </p>
            <p className="las-body mt-2 text-[0.875rem] leading-relaxed text-[#444]">{project.outcome}</p>
            <Link
              href={lasPath(project.href)}
              className="las-focus-ring las-label mt-4 inline-flex items-center gap-2 text-[var(--las-red)] hover:text-[var(--las-red-deep)]"
            >
              View project details →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
