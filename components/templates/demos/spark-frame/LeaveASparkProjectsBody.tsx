import Image from "next/image";
import { LasSectionHeading } from "./LasSectionHeading";
import { TextureOverlay } from "./TextureOverlays";
import { LAS_PROJECTS_PAGE } from "./leaveASparkSiteContent";

export function LeaveASparkProjectsBody() {
  return (
    <main className="pt-[5rem]">
      <TextureOverlay className="las-container las-section-py" grain ink>
        <LasSectionHeading
          title={LAS_PROJECTS_PAGE.title}
          accent={LAS_PROJECTS_PAGE.titleAccent}
          body={LAS_PROJECTS_PAGE.intro}
          className="mb-10"
        />
        <div className="flex flex-col gap-10">
          {LAS_PROJECTS_PAGE.projects.map((project, i) => (
            <article
              key={project.slug}
              className={`las-comic-panel grid grid-cols-1 overflow-hidden border-[3px] border-[var(--las-off-white)] sm:border-[4px] lg:grid-cols-2 ${
                i % 2 === 1 ? "lg:[direction:rtl]" : ""
              }`}
            >
              <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[280px]">
                <Image
                  src={project.image}
                  alt={`${project.title} — ${project.category} project in ${project.location}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className={`flex flex-col justify-center bg-[var(--las-surface-raised)] p-5 sm:p-6 lg:p-8 ${i % 2 === 1 ? "lg:[direction:ltr]" : ""}`}>
                <span className="las-label text-[var(--las-red)]">{project.category}</span>
                <h2 className="las-display mt-2 text-[clamp(1.25rem,3vw,1.75rem)]">{project.title}</h2>
                <p className="las-body mt-2 text-[var(--las-muted)]">{project.location}</p>
                <p className="las-body mt-4 text-[0.9375rem] leading-relaxed text-[var(--las-muted)]">
                  <strong className="text-[var(--las-off-white)]">Scope:</strong> {project.scope}
                </p>
              </div>
            </article>
          ))}
        </div>
      </TextureOverlay>
    </main>
  );
}
