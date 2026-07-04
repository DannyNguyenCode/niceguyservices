"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ViIcon } from "./ValleyInterlockingShared";

function GoogleMark() {
  return (
    <span className="vi-label-md font-bold tracking-tight" aria-hidden>
      <span className="text-[#4285F4]">G</span>
      <span className="text-[#EA4335]">o</span>
      <span className="text-[#FBBC05]">o</span>
      <span className="text-[#4285F4]">g</span>
      <span className="text-[#34A853]">l</span>
      <span className="text-[#EA4335]">e</span>
    </span>
  );
}

function PlaceholderLines() {
  return (
    <div className="space-y-2" aria-hidden>
      <div className="h-3 w-full rounded-full bg-[var(--vi-surface-container-high)]" />
      <div className="h-3 w-[92%] rounded-full bg-[var(--vi-surface-container-high)]" />
      <div className="h-3 w-[78%] rounded-full bg-[var(--vi-surface-container-high)]" />
    </div>
  );
}

function ReviewPlaceholderCard({ index }: { index: number }) {
  return (
    <article
      className="rounded-lg border border-[var(--vi-outline-variant)] bg-white p-4 shadow-sm"
      aria-label={`Google review placeholder ${index + 1}`}
    >
      <div className="mb-3 flex" aria-hidden>
        {Array.from({ length: 5 }).map((_, star) => (
          <ViIcon key={star} name="star" className="text-[var(--vi-secondary)]" fill />
        ))}
      </div>
      <PlaceholderLines />
      <p className="vi-label-md mt-4 text-[var(--vi-primary)]">Google Review</p>
    </article>
  );
}

export function ViGoogleReviewGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }, (_, index) => (
        <ReviewPlaceholderCard key={index} index={index} />
      ))}
    </div>
  );
}

export function ViGoogleReviewCarousel({ slideCount = 6 }: { slideCount?: number }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateButtons = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateButtons();
    el.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);
    return () => {
      el.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, [updateButtons]);

  const scroll = (direction: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-vi-review-card]");
    const amount = (card?.offsetWidth ?? 320) + 24;
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  return (
    <div>
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Google review highlights"
      >
        {Array.from({ length: slideCount }, (_, index) => (
          <article
            key={index}
            data-vi-review-card
            className="flex min-w-[min(100%,20rem)] shrink-0 snap-start flex-col rounded-lg border border-[var(--vi-outline-variant)] bg-white p-6 vi-ambient-shadow sm:min-w-[22rem]"
            aria-label={`Google review placeholder ${index + 1}`}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <GoogleMark />
              <span className="rounded-full bg-[var(--vi-surface-container-low)] px-3 py-1 vi-label-sm text-[var(--vi-on-surface-variant)]">
                Verified
              </span>
            </div>
            <div className="mb-4 flex" aria-hidden>
              {Array.from({ length: 5 }).map((_, star) => (
                <ViIcon key={star} name="star" className="text-[var(--vi-secondary)]" fill />
              ))}
            </div>
            <PlaceholderLines />
            <div className="mt-6 flex items-center gap-3 border-t border-[var(--vi-outline-variant)] pt-4">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--vi-primary-fixed)] vi-label-md font-bold text-[var(--vi-primary)]"
                aria-hidden
              >
                G
              </div>
              <div>
                <p className="vi-label-md text-[var(--vi-on-surface)]">Google Review</p>
                <p className="vi-label-sm text-[var(--vi-on-surface-variant)]">Placeholder review card</p>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={() => scroll(-1)}
          disabled={!canPrev}
          aria-label="Previous reviews"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--vi-outline-variant)] bg-white text-[var(--vi-primary)] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ViIcon name="chevron_left" />
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          disabled={!canNext}
          aria-label="Next reviews"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--vi-outline-variant)] bg-white text-[var(--vi-primary)] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ViIcon name="chevron_right" />
        </button>
      </div>
    </div>
  );
}
