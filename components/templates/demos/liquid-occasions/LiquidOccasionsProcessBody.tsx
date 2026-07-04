"use client";

import Link from "next/link";
import { useEffect } from "react";
import { LoContainer, LoFooter, LoIcon, LoImg, LoNav } from "./LiquidOccasionsShared";
import { LO_PATHS } from "./liquidOccasionsConfig";
import { LO_IMAGES } from "./liquidOccasionsImages";
import { useLoReveal } from "./useLoReveal";

export function LiquidOccasionsProcessBody() {
  useLoReveal(".lo-scroll-reveal", "visible");

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const masks = document.querySelectorAll<HTMLElement>(".lo-organic-image-mask");
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      masks.forEach((mask) => {
        mask.style.transform = `translate(${x}px, ${y}px)`;
      });
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <>
      <LoNav ctaVariant="container" />
      <header className="relative overflow-hidden px-[var(--lo-gutter)] pb-32 pt-48 text-center">
        <div className="relative z-20 mx-auto max-w-4xl">
          <span className="lo-label mb-6 inline-block rounded-full bg-[var(--lo-secondary-container)] px-4 py-1 text-[var(--lo-on-secondary-fixed)]">
            Our Process
          </span>
          <h1 className="lo-display mb-8">The Fluid Path to Extraordinary</h1>
          <p className="lo-body-lg mx-auto max-w-2xl text-[var(--lo-on-surface-variant)]">
            We believe planning shouldn&apos;t be a hurdle, but a curated journey. Every event flows through
            five distinct stages, guided by our signature yellow path.
          </p>
        </div>
      </header>

      <main className="relative">
        <div className="pointer-events-none absolute left-1/2 top-0 z-10 h-full w-full -translate-x-1/2">
          <svg className="h-full w-full overflow-visible" fill="none" viewBox="0 0 1440 5000" aria-hidden>
            <path
              className="lo-liquid-path"
              d="M720 0 C 720 200, 100 400, 100 800 C 100 1200, 1340 1400, 1340 1800 C 1340 2200, 100 2400, 100 2800 C 100 3200, 1340 3400, 1340 3800 C 1340 4200, 720 4400, 720 5000"
              stroke="#fdd815"
              strokeWidth="4"
            />
          </svg>
        </div>

        <section className="lo-scroll-reveal relative z-20 py-[var(--lo-section-gap)]" id="step-1">
          <LoContainer className="flex flex-col items-center gap-16 md:flex-row">
            <div className="w-full md:w-1/2">
              <StepBadge num="01" />
              <h2 className="lo-headline-lg mb-6 text-[var(--lo-primary)]">Dream</h2>
              <p className="lo-body-lg mb-8 text-[var(--lo-on-surface-variant)]">
                Every masterpiece begins with a whisper of an idea. In the Discovery phase, we dive deep
                into your vision, establishing a budget and a core aesthetic that anchors the entire journey.
              </p>
              <TagRow tags={["Discovery", "Budgeting", "Vision Board"]} variant="high" />
            </div>
            <div className="w-full md:w-1/2">
              <LoImg
                src={LO_IMAGES.process.dream}
                alt="Dreamy editorial image of a woman in a sun-drenched garden"
                width={600}
                height={600}
                className="lo-organic-image-mask aspect-square w-full shadow-2xl"
              />
            </div>
          </LoContainer>
        </section>

        <div className="pointer-events-none relative -mb-32 -mt-32 h-64 overflow-hidden">
          <svg className="absolute bottom-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 1440 320" aria-hidden>
            <path
              d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,149.3C672,149,768,203,864,218.7C960,235,1056,213,1152,186.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              fill="var(--lo-surface-container-low)"
            />
          </svg>
        </div>

        <section className="lo-scroll-reveal relative z-20 bg-[var(--lo-surface-container-low)] py-[var(--lo-section-gap)]" id="step-2">
          <LoContainer className="flex flex-col items-center gap-16 md:flex-row-reverse">
            <div className="w-full md:w-1/2">
              <StepBadge num="02" />
              <h2 className="lo-headline-lg mb-6 text-[var(--lo-primary)]">Design</h2>
              <p className="lo-body-lg mb-8 text-[var(--lo-on-surface-variant)]">
                We translate dreams into physical blueprints. Selecting the perfect venue and curating a
                guest experience that flows logically and emotionally through the space.
              </p>
              <TagRow tags={["Theme", "Venue", "Experience"]} variant="highest" />
            </div>
            <div className="group w-full md:w-1/2">
              <div className="relative">
                <LoImg
                  src={LO_IMAGES.process.design}
                  alt="Minimalist luxury event venue interior"
                  width={600}
                  height={600}
                  className="aspect-square w-full rounded-full object-cover shadow-2xl transition-transform duration-700 group-hover:scale-95"
                />
                <div className="absolute -bottom-10 -right-10 flex h-48 w-48 rotate-12 items-center justify-center rounded-full bg-[var(--lo-primary)] p-8 text-center text-[var(--lo-on-primary)] shadow-xl lo-headline-md">
                  Curated Details
                </div>
              </div>
            </div>
          </LoContainer>
        </section>

        <section className="lo-scroll-reveal relative z-20 py-[var(--lo-section-gap)]" id="step-3">
          <LoContainer>
            <div className="lo-scroll-reveal mx-auto mb-20 max-w-2xl text-center">
              <StepBadge num="03" centered />
              <h2 className="lo-headline-lg mb-6 text-[var(--lo-primary)]">Prepare</h2>
              <p className="lo-body-lg text-[var(--lo-on-surface-variant)]">
                Precision meets passion. We handle the heavy lifting—securing world-class vendors,
                managing complex logistics, and building ironclad timelines that allow for liquid
                flexibility.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                { icon: "handshake", title: "Vendors", desc: "Sourcing only the elite artisans who match your vision perfectly." },
                { icon: "local_shipping", title: "Logistics", desc: "Flawless coordination of arrival, installation, and flow.", offset: true },
                { icon: "schedule", title: "Timelines", desc: "A minute-by-minute narrative ensuring everything hits its mark." },
              ].map((card) => (
                <div
                  key={card.title}
                  className={`rounded-xl bg-[var(--lo-surface-container)] p-10 text-center transition-all duration-500 hover:shadow-2xl ${card.offset ? "md:translate-y-12" : ""}`}
                >
                  <LoIcon name={card.icon} className="mb-6 text-[48px] text-[var(--lo-primary)]" />
                  <h4 className="lo-headline-md mb-4">{card.title}</h4>
                  <p className="text-[var(--lo-on-surface-variant)]">{card.desc}</p>
                </div>
              ))}
            </div>
          </LoContainer>
        </section>

        <section className="lo-scroll-reveal relative z-20 overflow-hidden py-[var(--lo-section-gap)]" id="step-4">
          <LoContainer className="flex flex-col items-center gap-16 md:flex-row">
            <div className="w-full md:w-1/2">
              <StepBadge num="04" />
              <h2 className="lo-headline-lg mb-6 text-[var(--lo-primary)]">Deliver</h2>
              <p className="lo-body-lg mb-8 text-[var(--lo-on-surface-variant)]">
                Our team is the invisible engine on the day of your event. From managing staff to
                troubleshooting the unexpected, we ensure the mechanics are invisible so the magic can be
                felt.
              </p>
              <ul className="space-y-4">
                {["Live Event Coordination", "Staff Leadership", "Crisis Mitigation"].map((item) => (
                  <li key={item} className="flex items-center gap-4">
                    <LoIcon name="check_circle" className="text-[var(--lo-secondary)]" />
                    <span className="lo-body-md">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full md:w-1/2">
              <div className="relative">
                <LoImg
                  src={LO_IMAGES.process.deliver}
                  alt="Luxury event in progress with professional staff"
                  width={600}
                  height={750}
                  className="aspect-[4/5] w-full rounded-xl object-cover shadow-2xl"
                />
                <div className="absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/20 backdrop-blur-md animate-pulse">
                  <LoIcon name="motion_mode" className="text-5xl text-white" />
                </div>
              </div>
            </div>
          </LoContainer>
        </section>

        <section className="lo-scroll-reveal relative z-20 mb-32 py-[var(--lo-section-gap)]" id="step-5">
          <LoContainer>
            <div className="flex flex-col items-center rounded-[4rem] bg-[var(--lo-primary)] p-12 text-center text-[var(--lo-on-primary)] shadow-3xl md:p-24">
              <div className="relative mb-8 inline-block">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--lo-on-primary)] text-[var(--lo-primary)] shadow-lg lo-headline-md font-bold">
                  05
                </div>
              </div>
              <h2 className="lo-display mb-8">Celebrate</h2>
              <p className="lo-body-lg mb-12 max-w-2xl opacity-90">
                The culmination of the journey. We handle the teardown and memory-making, so you can
                inhabit the moment fully. Your extraordinary event, expertly executed.
              </p>
              <div className="grid w-full max-w-4xl grid-cols-1 gap-12 md:grid-cols-3">
                {[
                  { val: "100%", label: "EXECUTION RATE" },
                  { val: "0", label: "STRESS VECTORS" },
                  { val: "∞", label: "MEMORIES MADE" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="lo-display mb-2 font-bold">{stat.val}</div>
                    <div className="lo-label opacity-70">{stat.label}</div>
                  </div>
                ))}
              </div>
              <Link
                href={LO_PATHS.journey}
                className="lo-headline-md mt-16 rounded-full bg-white px-10 py-4 text-[var(--lo-primary)] transition-transform hover:scale-105"
              >
                Start Your Journey
              </Link>
            </div>
          </LoContainer>
        </section>
      </main>

      <LoFooter />
    </>
  );
}

function StepBadge({ num, centered }: { num: string; centered?: boolean }) {
  return (
    <div className={`relative mb-8 inline-block ${centered ? "mx-auto" : ""}`}>
      <div className="absolute -inset-4 rounded-full bg-[color-mix(in_srgb,var(--lo-secondary-container)_20%,transparent)] blur-xl" />
      <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-[var(--lo-secondary-container)] bg-[var(--lo-surface)] text-[var(--lo-primary)] shadow-lg lo-headline-md font-bold">
        {num}
      </div>
    </div>
  );
}

function TagRow({ tags, variant }: { tags: string[]; variant: "high" | "highest" }) {
  const bg =
    variant === "high"
      ? "bg-[var(--lo-surface-container-high)]"
      : "bg-[var(--lo-surface-container-highest)]";
  return (
    <div className="flex flex-wrap gap-3">
      {tags.map((tag) => (
        <span key={tag} className={`lo-label rounded-full px-4 py-2 ${bg}`}>
          {tag}
        </span>
      ))}
    </div>
  );
}
