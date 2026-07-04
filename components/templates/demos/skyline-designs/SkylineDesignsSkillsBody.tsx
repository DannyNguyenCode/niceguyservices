"use client";

import {
  SD_DESIGN_UX,
  SD_MANAGEMENT_ITEMS,
  SD_STRATEGY_ITEMS,
  SD_TECH_SKILLS,
} from "./skylineDesignsData";
import { SD_IMG } from "./skylineDesignsImages";
import { SdContainer, SdIcon, SdImg } from "./SkylineDesignsShared";
import { useSdHeroParallax, useSdNavScroll, useSdReveal, useSdSkillBadgeFill } from "./useSdEffects";

export function SkylineDesignsSkillsBody() {
  useSdReveal();
  useSdNavScroll();
  useSdHeroParallax();
  useSdSkillBadgeFill();

  return (
    <main>
      <header className="sd-hero-parallax relative overflow-hidden px-[var(--sd-container-padding)] pt-48 pb-20 text-center">
        <SdContainer className="relative mx-auto max-w-4xl">
          <span className="sd-label-md mb-6 inline-block rounded-full bg-[var(--sd-secondary-container)] px-4 py-1 tracking-widest text-[var(--sd-on-secondary-container)] uppercase">
            Expertise
          </span>
          <h1 className="sd-display-xl mb-6 text-[var(--sd-primary)]">
            Mastering the Digital <br />
            <span className="text-[var(--sd-on-surface)]">Atmosphere</span>
          </h1>
          <p className="sd-body-lg mx-auto max-w-2xl leading-relaxed text-[var(--sd-on-surface-variant)]">
            Blending robust engineering with ethereal design to build experiences that feel as expansive as the skyline.
            My toolkit is optimized for performance, aesthetics, and human connection.
          </p>
        </SdContainer>
      </header>

      <SdContainer className="pb-40">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          <section className="sd-reveal lg:col-span-7">
            <div className="sd-glass-card sd-cloud-shadow h-full rounded-lg p-10 transition-all duration-500 hover:-translate-y-2">
              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--sd-primary)_10%,transparent)] text-[var(--sd-primary)]">
                  <SdIcon name="terminal" className="text-4xl" />
                </div>
                <div>
                  <h2 className="sd-headline-md text-[var(--sd-on-surface)]">Technical &amp; Development</h2>
                  <p className="sd-body-md text-[var(--sd-on-surface-variant)]">The architecture behind the clouds.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {SD_TECH_SKILLS.map((skill) => (
                  <div
                    key={skill.label}
                    className="sd-skill-badge flex cursor-default items-center gap-2 rounded-full border border-[var(--sd-surface-variant)] bg-white px-5 py-3 shadow-sm"
                  >
                    <SdIcon name={skill.icon} className="text-[var(--sd-primary)]" fill />
                    <span className="sd-label-md">{skill.label}</span>
                  </div>
                ))}
              </div>
              <div className="relative mt-12 h-40 w-full overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-[color-mix(in_srgb,var(--sd-primary)_10%,transparent)] to-transparent" />
                <SdImg
                  src={SD_IMG.skills.code}
                  alt="Clean code reflected in glass with soft sky blue light"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>
            </div>
          </section>

          <section className="sd-reveal lg:col-span-5">
            <div className="sd-cloud-shadow flex h-full flex-col justify-between rounded-lg border border-white/50 bg-[var(--sd-surface-container-low)] p-10 transition-all duration-500 hover:-translate-y-2">
              <div>
                <div className="mb-8 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--sd-secondary)_10%,transparent)] text-[var(--sd-secondary)]">
                    <SdIcon name="palette" className="text-4xl" />
                  </div>
                  <h2 className="sd-headline-md text-[var(--sd-on-surface)]">Design &amp; UX</h2>
                </div>
                <div className="space-y-6">
                  {SD_DESIGN_UX.map((item) => (
                    <div key={item.title} className="flex items-start gap-4">
                      <SdIcon name="check_circle" className="mt-1 text-[var(--sd-primary)]" />
                      <div>
                        <p className="font-bold text-[var(--sd-on-surface)]">{item.title}</p>
                        <p className="sd-body-md text-[var(--sd-on-surface-variant)]">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-10 flex -space-x-4">
                {["grid_view", "draw", "auto_awesome"].map((icon, i) => (
                  <div
                    key={icon}
                    className={`sd-glass-card flex h-16 w-16 items-center justify-center rounded-full border-4 border-white shadow-lg ${
                      i === 0 ? "-rotate-10" : i === 2 ? "rotate-10" : "-translate-y-5 z-10"
                    }`}
                  >
                    <SdIcon
                      name={icon}
                      className={i === 1 ? "text-[var(--sd-primary)]" : "text-[var(--sd-secondary)]"}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="sd-reveal lg:col-span-5">
            <div className="sd-cloud-shadow h-full rounded-lg bg-[var(--sd-primary)] p-10 text-[var(--sd-on-primary)] transition-all duration-500 hover:-translate-y-2">
              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                  <SdIcon name="insights" className="text-4xl" />
                </div>
                <h2 className="sd-headline-md">Strategy &amp; Marketing</h2>
              </div>
              <ul className="grid grid-cols-1 gap-4">
                {SD_STRATEGY_ITEMS.map((item) => (
                  <li
                    key={item}
                    className="group/item flex items-center justify-between rounded-xl bg-white/10 p-4 transition-colors hover:bg-white/20"
                  >
                    <span className="sd-label-md tracking-wider uppercase">{item}</span>
                    <SdIcon
                      name="arrow_forward"
                      className="opacity-0 transition-opacity group-hover/item:opacity-100"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="sd-reveal lg:col-span-7">
            <div className="sd-glass-card sd-cloud-shadow relative h-full overflow-hidden rounded-lg p-10 transition-all duration-500 hover:-translate-y-2">
              <div className="flex flex-col items-center gap-8 md:flex-row">
                <div className="flex-1">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--sd-secondary-container)] text-[var(--sd-on-secondary-container)]">
                      <SdIcon name="assignment_turned_in" className="text-4xl" />
                    </div>
                    <h2 className="sd-headline-md text-[var(--sd-on-surface)]">Management &amp; QA</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {SD_MANAGEMENT_ITEMS.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-2xl border border-[var(--sd-surface-variant)] bg-[var(--sd-surface-container)] p-4"
                      >
                        <h4 className="mb-1 font-bold text-[var(--sd-primary)]">{item.title}</h4>
                        <p className="sd-body-md text-[var(--sd-on-surface-variant)]">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="sd-animate-float relative aspect-square w-full overflow-hidden rounded-full md:w-1/3">
                  <SdImg
                    src={SD_IMG.skills.sphere}
                    alt="Abstract chrome and glass sphere floating in sky-blue space"
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </SdContainer>
    </main>
  );
}
