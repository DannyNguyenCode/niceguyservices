import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { LasSectionHeading } from "./LasSectionHeading";
import { HalftoneCorner } from "./TextureOverlays";
import { LAS_HOME } from "./leaveASparkSiteContent";
import { lasResourcePath } from "./leaveASparkConfig";

export function ResourcesSection() {
  const { resources } = LAS_HOME;

  return (
    <section className="las-section-py">
      <div className="las-container">
        <LasSectionHeading
          title={resources.title}
          accent={resources.titleAccent}
          className="mb-10"
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resources.items.map((item, i) => (
            <Link
              key={item.slug}
              href={lasResourcePath(item.slug)}
              className={`las-edge-current las-comic-panel group relative flex flex-col border-[3px] border-[var(--las-bg-primary)] bg-[var(--las-off-white)] p-4 text-[var(--las-bg-primary)] sm:p-5 ${
                i % 3 === 1 ? "lg:mt-4" : ""
              }`}
            >
              <HalftoneCorner position="tl" className="pointer-events-none absolute inset-0" />
              <p className="las-label text-[#888]">{item.readTime}</p>
              <h3 className="las-display mt-2 text-[clamp(1rem,2vw,1.2rem)] leading-tight group-hover:text-[var(--las-red)]">
                {item.title}
              </h3>
              <p className="las-body mt-2 flex-1 text-[0.875rem] leading-relaxed text-[#555]">{item.excerpt}</p>
              <span className="las-label mt-4 inline-flex items-center gap-1 text-[var(--las-red)]">
                Read article <ArrowRightIcon className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
