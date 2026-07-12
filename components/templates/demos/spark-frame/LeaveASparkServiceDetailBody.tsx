import { SparkButton } from "./SparkButton";
import { LasSectionHeading } from "./LasSectionHeading";
import { TextureOverlay } from "./TextureOverlays";
import { lasServiceDetail } from "./leaveASparkSiteContent";
import { lasPath } from "./leaveASparkConfig";

export function LeaveASparkServiceDetailBody({ slug }: { slug: string }) {
  const detail = lasServiceDetail(slug);
  if (!detail) return null;

  return (
    <main className="pt-[5rem]">
      <TextureOverlay className="las-container las-section-py" grain ink>
        <p className="las-label text-[var(--las-red)]">{detail.powerLabel}</p>
        <LasSectionHeading title={detail.title} className="mt-2" body={detail.intro} />
        <div className="mt-10 flex flex-col gap-8">
          {detail.sections.map((section) => (
            <section key={section.heading} className="border-l-2 border-[var(--las-red)] pl-5">
              <h2 className="las-display text-[clamp(1.1rem,2.5vw,1.4rem)]">{section.heading}</h2>
              <p className="las-body mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-[var(--las-muted)]">{section.body}</p>
            </section>
          ))}
        </div>
        <div className="mt-10">
          <SparkButton href={lasPath(detail.cta.href)}>{detail.cta.label}</SparkButton>
        </div>
      </TextureOverlay>
    </main>
  );
}
