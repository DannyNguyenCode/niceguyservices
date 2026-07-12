import Link from "next/link";
import { SparkButton } from "./SparkButton";
import { TextureOverlay } from "./TextureOverlays";
import { lasResourceArticle } from "./leaveASparkSiteContent";
import { lasPath } from "./leaveASparkConfig";

const ARTICLE_BODIES: Record<string, string[]> = {
  "when-to-replace-electrical-panel": [
    "Electrical panels typically last 25–40 years, but age alone is not the only factor. Federal Pacific and Zinsco panels are widely considered safety risks and should be evaluated by a licensed electrician.",
    "Frequent breaker trips, buzzing sounds, warm panel covers, and visible corrosion are warning signs. If you are planning an EV charger, heat pump, or major renovation, your existing panel may not have the capacity.",
    "A professional assessment includes load calculations, inspection of bus bars and connections, and a clear recommendation for upgrade scope and timeline.",
  ],
  "ev-charger-readiness": [
    "Level 2 home charging typically requires a dedicated 240V circuit on a 40–60 amp breaker. Your panel must have sufficient capacity after accounting for existing loads.",
    "Distance from the panel to the garage affects conduit run cost. Load management devices can help when panel capacity is tight without a full upgrade.",
    "Permits and inspection are required for permanent EV charger installations in most jurisdictions — plan for both in your timeline.",
  ],
  "outdated-wiring-warning-signs": [
    "Flickering lights when appliances start, discolored outlet plates, and a persistent burning smell near switches warrant immediate professional attention.",
    "Knob-and-tube wiring lacks grounding and is incompatible with modern insulation practices. Aluminum branch circuit wiring requires special termination methods.",
    "If your home was built before 1970 and has never been rewired, schedule an inspection before major renovations.",
  ],
  "how-surge-protection-works": [
    "Surge protectors divert voltage spikes away from sensitive equipment. Type 1 devices install at the service entrance; Type 2 install at the panel.",
    "Point-of-use strips protect individual devices but cannot shield hardwired equipment like HVAC controls or refrigerators.",
    "A layered approach — panel-level plus point-of-use for high-value electronics — provides the most comprehensive protection.",
  ],
  "generator-sizing-basics": [
    "Generator sizing starts with listing essential circuits: refrigeration, heat, sump pump, selected lighting, and communication equipment.",
    "A 7–10 kW portable unit may cover basics; whole-home standby systems range from 14–22 kW depending on square footage and fuel type.",
    "Transfer switches are mandatory for safe generator operation — never backfeed a generator directly into household wiring.",
  ],
};

export function LeaveASparkResourceArticleBody({ slug }: { slug: string }) {
  const article = lasResourceArticle(slug);
  if (!article) return null;

  const paragraphs = ARTICLE_BODIES[slug] ?? [article.excerpt];

  return (
    <main className="pt-[5rem]">
      <TextureOverlay className="las-container las-section-py" grain ink>
        <Link href={lasPath("/resources")} className="las-label las-focus-ring text-[var(--las-red)]">
          ← All resources
        </Link>
        <p className="las-label mt-6 text-[var(--las-muted)]">{article.readTime}</p>
        <h1 className="las-display mt-2 max-w-3xl text-[clamp(1.75rem,4vw,2.75rem)] leading-tight">{article.title}</h1>
        <article className="mt-8 max-w-2xl">
          {paragraphs.map((p, i) => (
            <p key={i} className="las-body mb-5 text-[0.9375rem] leading-relaxed text-[var(--las-muted)]">
              {p}
            </p>
          ))}
        </article>
        <div className="mt-8">
          <SparkButton href="/contact">Discuss Your Project</SparkButton>
        </div>
      </TextureOverlay>
    </main>
  );
}
