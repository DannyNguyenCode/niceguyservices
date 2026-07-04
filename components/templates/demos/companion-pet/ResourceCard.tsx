"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Resource } from "./companionPetData";
import { CP_PATHS } from "./companionPetConfig";

type ResourceCardProps = {
  resource: Resource;
};

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <Link
      href={CP_PATHS.resources}
      className="cp-card group flex flex-col rounded-2xl p-5 transition-shadow hover:shadow-lg"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-[var(--cp-blue-muted)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--cp-blue)]">
          {resource.category}
        </span>
        {resource.trending ? (
          <span className="text-[10px] font-medium text-[var(--cp-orange)]">Trending</span>
        ) : null}
      </div>
      <h3 className="mt-3 text-base font-semibold text-[var(--cp-charcoal)] group-hover:text-[var(--cp-blue)]">
        {resource.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-[var(--cp-slate)]">{resource.excerpt}</p>
      <div className="mt-4 flex items-center justify-between text-xs text-[var(--cp-slate)]">
        <span>{resource.readTime} read</span>
        {resource.expert ? <span className="truncate">{resource.expert}</span> : null}
      </div>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--cp-blue)]">
        Read article
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}
