import Link from "next/link";
import { VI_LANDSCAPE_LIGHTING_INSTALL } from "./valleyInterlockingLandscapeLightingInstallContent";
import { ViArticleRelatedServices } from "./ViArticleRelatedServices";
import { ViIcon } from "./ValleyInterlockingShared";

const article = VI_LANDSCAPE_LIGHTING_INSTALL;

export function ViLandscapeLightingInstallSidebar() {
  return (
    <aside className="flex flex-col gap-8">
      <div className="rounded-2xl border border-[var(--vi-outline-variant)] bg-[var(--vi-surface-container-low)] p-8 vi-ambient-shadow lg:sticky lg:top-24">
        <h3 className="vi-headline-lg mb-[var(--vi-stack-md)] border-b border-[var(--vi-outline-variant)] pb-2 text-[var(--vi-on-surface)]">
          Tech Specs
        </h3>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <span className="vi-caption font-bold uppercase text-[var(--vi-secondary)]">Difficulty</span>
            <div className="flex items-center gap-2">
              <ViIcon name="trending_up" className="text-[20px] text-[var(--vi-primary)]" />
              <span className="vi-label-md text-[var(--vi-on-surface)]">{article.difficulty}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="vi-caption font-bold uppercase text-[var(--vi-secondary)]">Duration</span>
            <div className="flex items-center gap-2">
              <ViIcon name="schedule" className="text-[20px] text-[var(--vi-primary)]" />
              <span className="vi-label-md text-[var(--vi-on-surface)]">{article.duration}</span>
            </div>
          </div>
          <div>
            <span className="vi-caption mb-4 block font-bold uppercase text-[var(--vi-secondary)]">
              Required Tools
            </span>
            <ul className="space-y-3">
              {article.requiredTools.map((tool) => (
                <li key={tool} className="vi-body-md flex items-center gap-3 text-[var(--vi-on-surface-variant)]">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--vi-primary)]" />
                  {tool}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-[var(--vi-tertiary)] p-6 text-[var(--vi-on-tertiary)] shadow-inner">
            <h4 className="vi-label-md mb-4 uppercase text-[var(--vi-tertiary-fixed)]">Project Readiness</h4>
            <div className="space-y-3">
              {article.readinessChecks.map((item) => (
                <div key={item} className="vi-caption flex items-center gap-3 font-medium">
                  <ViIcon name="check_circle" className="text-[18px] text-[var(--vi-tertiary-fixed)]" fill />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <ViArticleRelatedServices services={article.relatedServices} />
      </div>

      <div className="relative flex flex-col items-center overflow-hidden rounded-lg border border-[var(--vi-outline-variant)] p-8 text-center">
        <div className="absolute inset-0 z-0 bg-[color-mix(in_srgb,var(--vi-surface-variant)_50%,transparent)]" />
        <div className="relative z-10">
          <ViIcon name="electrical_services" className="mb-4 text-5xl text-[var(--vi-primary)]" />
          <h4 className="vi-headline-lg mb-4">Line voltage too complex?</h4>
          <p className="vi-body-md mb-6 text-[var(--vi-secondary)]">
            Our licensed partners can handle hardwired landscape lighting safely and to code.
          </p>
          <Link
            href={article.closing.ctaHref}
            className="vi-label-md block w-full bg-[var(--vi-primary)] py-4 uppercase tracking-widest text-[var(--vi-on-primary)] transition-all hover:shadow-xl"
          >
            Hire the Experts
          </Link>
        </div>
      </div>
    </aside>
  );
}
