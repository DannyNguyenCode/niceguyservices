"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { LasSectionHeading } from "./LasSectionHeading";
import { LAS_HOME } from "./leaveASparkSiteContent";
import { usePrefersReducedMotion } from "./leaveASparkMotion";

export function CircuitProcessSection() {
  const { process } = LAS_HOME;
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lineScale = useTransform(scrollYProgress, [0.1, 0.7], [0, 1]);
  const progressWidth = useTransform(lineScale, (s) => `${s * 90}%`);

  return (
    <section ref={ref} className="las-section-py las-process-circuit">
      <div className="las-container">
        <LasSectionHeading title={process.title} accent={process.titleAccent} className="mb-12" />

        <div className="hidden lg:block">
          <div className="relative">
            <div className="absolute left-[5%] right-[5%] top-3 h-0.5 bg-[var(--las-divider)]" aria-hidden />
            <motion.div
              className="absolute left-[5%] top-3 h-0.5 origin-left bg-[var(--las-red)]"
              style={{ width: reduced ? "90%" : progressWidth }}
              aria-hidden
            />
            <ol className="relative hidden grid-cols-5 gap-4 lg:grid">
              {process.steps.map((step, i) => (
                <ProcessNode key={step.id} step={step} index={i} inView={inView || reduced} vertical={false} />
              ))}
            </ol>
          </div>
        </div>

        <ol className="flex flex-col gap-0 lg:hidden">
          {process.steps.map((step, i) => (
            <div key={step.id} className="relative flex gap-4">
              {i < process.steps.length - 1 && (
                <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-[var(--las-divider)]" aria-hidden />
              )}
              <ProcessNode step={step} index={i} inView={inView || reduced} vertical />
            </div>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ProcessNode({
  step,
  index,
  inView,
  vertical = false,
}: {
  step: (typeof LAS_HOME.process.steps)[number];
  index: number;
  inView: boolean;
  vertical?: boolean;
}) {
  const active = inView;

  return (
    <li className={`list-none min-w-0 ${vertical ? "flex gap-4 pb-8" : "text-center lg:text-center"}`}>
      <motion.div
        className={`relative z-10 mx-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
          active ? "border-[var(--las-red)] bg-[var(--las-red)]" : "border-[var(--las-divider)] bg-[var(--las-surface-soft)]"
        }`}
        initial={{ scale: 0.8, opacity: 0.5 }}
        animate={active ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: index * 0.15, duration: 0.3 }}
      >
        <span className="h-2 w-2 rounded-full bg-[var(--las-off-white)]" aria-hidden />
      </motion.div>
      <div className={vertical ? "pt-0" : "mt-6"}>
        <p className="las-label text-[var(--las-red)]">0{index + 1}</p>
        <h3 className="las-display mt-1 text-[clamp(0.95rem,2vw,1.15rem)]">{step.title}</h3>
        <p className="las-body mt-2 text-[0.8125rem] leading-relaxed text-[var(--las-muted)]">{step.description}</p>
      </div>
    </li>
  );
}
