import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { LasSectionHeading } from "./LasSectionHeading";
import { TextureOverlay } from "./TextureOverlays";
import { LAS_HOME, LAS_SERVICES_PAGE } from "./leaveASparkSiteContent";
import { lasServicePath } from "./leaveASparkConfig";

export function LeaveASparkServicesBody() {
  return (
    <main className="pt-[5rem]">
      <TextureOverlay className="las-container las-section-py" grain ink>
        <LasSectionHeading
          title={LAS_SERVICES_PAGE.title}
          accent={LAS_SERVICES_PAGE.titleAccent}
          body={LAS_SERVICES_PAGE.intro}
          className="mb-10"
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {LAS_HOME.servicePanels.items.map((item) => (
            <Link
              key={item.slug}
              href={lasServicePath(item.slug)}
              className="las-edge-current las-comic-panel group flex gap-4 border-[3px] border-[var(--las-divider)] bg-[var(--las-surface-raised)] p-4 transition-transform hover:-translate-y-1"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden">
                <Image src={item.image} alt="" fill className="object-cover" sizes="96px" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="las-display text-[clamp(1rem,2vw,1.25rem)] group-hover:text-[var(--las-red)]">{item.title}</h2>
                <p className="las-body mt-1 text-[0.875rem] text-[var(--las-muted)]">{item.description}</p>
                <span className="las-label mt-2 inline-flex items-center gap-1 text-[var(--las-red)]">
                  Learn more <ArrowRightIcon className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </TextureOverlay>
    </main>
  );
}
