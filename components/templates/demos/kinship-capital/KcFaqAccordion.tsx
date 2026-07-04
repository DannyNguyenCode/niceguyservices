"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import { KcIcon } from "./KinshipCapitalShared";

export function KcFaqAccordionItem({
  id,
  question,
  answer,
  isOpen,
  onToggle,
}: {
  id: string;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: (id: string) => void;
}) {
  const baseId = useId();
  const buttonId = `${baseId}-btn`;
  const panelId = `${baseId}-panel`;
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useLayoutEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const measure = () => setContentHeight(node.scrollHeight);

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [answer]);

  return (
    <article
      className={`kc-faq-accordion rounded-2xl border border-[var(--kc-outline-variant)] bg-[var(--kc-surface-container-lowest)] transition-shadow duration-300 hover:shadow-md ${
        isOpen ? "kc-faq-accordion-open" : ""
      }`}
    >
      <button
        id={buttonId}
        type="button"
        className="flex w-full cursor-pointer items-center justify-between gap-4 p-6 text-left"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => onToggle(id)}
      >
        <span className="kc-headline-md text-[var(--kc-on-surface)]">{question}</span>
        <KcIcon
          name="expand_more"
          className={`kc-faq-chevron shrink-0 text-[var(--kc-outline)] ${isOpen ? "kc-faq-chevron-open" : ""}`}
        />
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        aria-hidden={!isOpen}
        className="kc-faq-panel overflow-hidden"
        style={{ maxHeight: isOpen ? contentHeight : 0 }}
      >
        <div ref={contentRef}>
          <div className="border-t border-[color-mix(in_srgb,var(--kc-outline-variant)_30%,transparent)] px-6 pb-6 pt-4">
            <p className="kc-body-md leading-relaxed text-[var(--kc-on-surface-variant)]">{answer}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
