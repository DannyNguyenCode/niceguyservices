import { SparkButton } from "./SparkButton";
import { LasSectionHeading } from "./LasSectionHeading";
import { TextureOverlay } from "./TextureOverlays";
import { LAS_ABOUT } from "./leaveASparkSiteContent";

export function LeaveASparkAboutBody() {
  return (
    <main className="pt-[5rem]">
      <TextureOverlay className="las-container las-section-py" grain ink>
        <LasSectionHeading title={LAS_ABOUT.title} accent={LAS_ABOUT.titleAccent} body={LAS_ABOUT.intro} />
        <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {LAS_ABOUT.values.map((value) => (
            <li
              key={value.title}
              className="las-comic-panel border-[3px] border-[var(--las-off-white)] bg-[var(--las-surface-raised)] p-6"
            >
              <h3 className="las-display text-[clamp(1.1rem,2.5vw,1.35rem)] text-[var(--las-red)]">{value.title}</h3>
              <p className="las-body mt-3 text-[0.9375rem] leading-relaxed text-[var(--las-muted)]">{value.body}</p>
            </li>
          ))}
        </ul>
        <p className="las-body mt-10 max-w-2xl text-[0.9375rem] text-[var(--las-muted)]">{LAS_ABOUT.teamNote}</p>
        <div className="mt-8">
          <SparkButton href="/contact">Get a Free Quote</SparkButton>
        </div>
      </TextureOverlay>
    </main>
  );
}
