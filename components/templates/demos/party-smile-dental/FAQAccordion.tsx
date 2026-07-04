"use client";

import { useId, useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import type { PsdFaqItem } from "./partySmileDentalData";

const HELP_TILE_COLORS = [
  "bg-[#3b82f6]",
  "bg-[#ef4444]",
  "bg-[#eab308]",
  "bg-[#22c55e]",
] as const;

type FAQAccordionProps = {
  items: PsdFaqItem[];
  /** Game-board help tiles (home). Default keeps a clean accordion for the FAQ page. */
  variant?: "default" | "help-tile";
};

export function FAQAccordion({ items, variant = "default" }: FAQAccordionProps) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const isHelpTile = variant === "help-tile";

  return (
    <div className={`flex flex-col ${isHelpTile ? "gap-4" : "gap-3"}`}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;
        const accent = HELP_TILE_COLORS[index % HELP_TILE_COLORS.length];

        return (
          <article
            key={item.question}
            className={
              isHelpTile
                ? `psd-help-tile overflow-hidden rounded-2xl border-2 border-[#1a1a1a] bg-white psd-tile-shadow ${isOpen ? "psd-help-tile-open" : ""}`
                : "overflow-hidden rounded-2xl border-2 border-[#1a1a1a] bg-white psd-tile-shadow psd-tile-lift"
            }
          >
            <button
              id={buttonId}
              type="button"
              className={`flex w-full items-start gap-4 px-5 py-4 text-left font-black text-[#1a1a1a] ${
                isHelpTile ? "hover:bg-[#fffef8]" : ""
              }`}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              {isHelpTile ? (
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#1a1a1a] ${accent} text-sm font-black text-white`}
                  aria-hidden
                >
                  {index + 1}
                </span>
              ) : (
                <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#3b82f6]" aria-hidden />
              )}
              <span className="min-w-0 flex-1 pt-0.5 text-base leading-snug md:text-lg">{item.question}</span>
              <ChevronDown
                className={`mt-1 h-5 w-5 shrink-0 text-[#525252] transition-transform duration-300 ease-out ${
                  isOpen ? "rotate-180" : ""
                }`}
                aria-hidden
              />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`psd-faq-panel ${isOpen ? "psd-faq-panel-open" : ""}`}
              data-open={isOpen}
            >
              <div className="psd-faq-panel-inner">
                <div
                  className={`border-t-2 px-5 pb-5 pt-0 text-sm leading-7 text-[#525252] ${
                    isHelpTile ? "border-[#1a1a1a]/10 bg-[#fffef8]" : "border-[#f0f0f0]"
                  }`}
                >
                  <p className={isHelpTile ? "pt-4" : "py-4"}>{item.answer}</p>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
