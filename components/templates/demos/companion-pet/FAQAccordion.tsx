"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FAQItem = { q: string; a: string };

type FAQAccordionProps = {
  items: FAQItem[];
};

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.q} className="cp-card overflow-hidden rounded-2xl">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : i)}
            >
              <span className="text-sm font-semibold text-[var(--cp-charcoal)]">{item.q}</span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-[var(--cp-slate)] transition-transform ${open ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>
            <div className={`cp-faq-panel ${open ? "cp-faq-panel-open" : ""}`}>
              <div className="cp-faq-panel-inner">
                <p className="px-5 pb-4 text-sm leading-7 text-[var(--cp-slate)]">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
