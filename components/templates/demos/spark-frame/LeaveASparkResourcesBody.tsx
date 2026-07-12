import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { LasSectionHeading } from "./LasSectionHeading";
import { TextureOverlay } from "./TextureOverlays";
import { LAS_HOME, LAS_RESOURCES_PAGE } from "./leaveASparkSiteContent";
import { lasResourcePath } from "./leaveASparkConfig";

export function LeaveASparkResourcesBody() {
  return (
    <main className="pt-[5rem]">
      <TextureOverlay className="las-container las-section-py" grain ink>
        <LasSectionHeading
          title={LAS_RESOURCES_PAGE.title}
          accent={LAS_RESOURCES_PAGE.titleAccent}
          body={LAS_RESOURCES_PAGE.intro}
          className="mb-10"
        />
        <ul className="flex flex-col gap-4">
          {LAS_HOME.resources.items.map((item) => (
            <li key={item.slug}>
              <Link
                href={lasResourcePath(item.slug)}
                className="las-edge-current las-comic-panel group flex items-center justify-between gap-4 border-[3px] border-[var(--las-divider)] bg-[var(--las-surface-raised)] p-5 transition-transform hover:-translate-y-0.5"
              >
                <div>
                  <p className="las-label text-[var(--las-muted)]">{item.readTime}</p>
                  <h2 className="las-display mt-1 text-[clamp(1rem,2.5vw,1.3rem)] group-hover:text-[var(--las-red)]">
                    {item.title}
                  </h2>
                  <p className="las-body mt-1 text-[0.875rem] text-[var(--las-muted)]">{item.excerpt}</p>
                </div>
                <ArrowRightIcon className="h-5 w-5 shrink-0 text-[var(--las-red)]" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </TextureOverlay>
    </main>
  );
}
