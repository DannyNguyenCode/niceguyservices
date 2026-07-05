import Link from "next/link";
import { VI_LANDSCAPE_PLANNING } from "./valleyInterlockingLandscapePlanningContent";
import { ViArticleRelatedServices } from "./ViArticleRelatedServices";
import { ViIcon } from "./ValleyInterlockingShared";
const article = VI_LANDSCAPE_PLANNING;

export function ViLandscapePlanningSidebar() {
  return (
    <aside className="w-full space-y-[var(--vi-stack-md)] lg:w-80">
      <div className="space-y-[var(--vi-stack-md)] lg:sticky lg:top-24">
        <div className="rounded-lg border border-dashed border-[var(--vi-outline)] bg-[var(--vi-surface-container-high)] p-4">
          <p className="vi-caption mb-3 font-bold uppercase text-[var(--vi-on-surface)]">Guide Overview</p>
          <ol className="space-y-2">
            {article.serviceStepTitles.map((title: any, index: any) => (
              <li key={title} className="vi-caption flex gap-2 text-[var(--vi-on-surface-variant)]">
                <span className="vi-step-number font-bold text-[var(--vi-primary)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {title}
              </li>
            ))}
          </ol>
        </div>

        <div className="hidden lg:block">
          <ViArticleRelatedServices services={article.relatedServices} />
        </div>

        <div className="rounded-lg bg-[var(--vi-primary)] p-6 text-[var(--vi-on-primary)]">
          <h4 className="vi-headline-md mb-2 text-lg">Need Clarity?</h4>
          <p className="vi-caption mb-4 opacity-90">
            Speak with our team about your landscape plan, timelines, and next steps.
          </p>
          <Link
            href={article.cta.primaryHref}
            className="vi-label-md flex w-full items-center justify-center gap-2 rounded bg-[var(--vi-on-primary)] py-2 text-sm text-[var(--vi-primary)] transition-colors hover:bg-[var(--vi-surface)]"
          >
            Schedule Consultation
            <ViIcon name="arrow_forward" className="text-[18px]" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
