"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { VI_PATHS } from "./valleyInterlockingConfig";
import { VI_GALLERY_CTA, VI_GALLERY_ITEMS } from "./valleyInterlockingData";
import { VI_IMG } from "./valleyInterlockingImages";
import { ViAboutCtaBanner } from "./ViAboutCtaBanner";
import { ViContainer, ViIcon, ViImg, ViHeroContentPanel, VI_HERO_CTA_PRIMARY, VI_HERO_CTA_SECONDARY } from "./ValleyInterlockingShared";
import { useViFocusTrap, useViNavScroll } from "./useViEffects";

const GALLERY_IMAGES = [...VI_IMG.interlocking.gallery, VI_IMG.lighting.galleryMain, VI_IMG.lighting.galleryWall, VI_IMG.lighting.galleryPool];

const GALLERY_TILE_ASPECTS = [
  "aspect-[4/3]",
  "aspect-[3/4]",
  "aspect-[5/4]",
  "aspect-square",
  "aspect-[16/10]",
  "aspect-[4/5]",
] as const;

function galleryImageForIndex(index: number): string {
  return GALLERY_IMAGES[index % GALLERY_IMAGES.length];
}

function galleryTileAspect(index: number): (typeof GALLERY_TILE_ASPECTS)[number] {
  return GALLERY_TILE_ASPECTS[index % GALLERY_TILE_ASPECTS.length];
}

export function ValleyInterlockingGalleryBody() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useViNavScroll();
  useViFocusTrap(dialogRef, activeIndex !== null);

  const close = useCallback(() => setActiveIndex(null), []);
  const showPrev = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i + VI_GALLERY_ITEMS.length - 1) % VI_GALLERY_ITEMS.length));
  }, []);
  const showNext = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i + 1) % VI_GALLERY_ITEMS.length));
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [activeIndex, close, showNext, showPrev]);

  const activeItem = activeIndex !== null ? VI_GALLERY_ITEMS[activeIndex] : null;

  return (
    <main className="pt-[var(--vi-nav-height)]">
      <section className="vi-hero-under-nav vi-hero-under-nav--compact relative flex h-[min(870px,100dvh)] items-center overflow-hidden">
        <div className="vi-hero-backdrop absolute inset-0 z-0">
          <ViImg
            src={galleryImageForIndex(0)}
            alt="Completed Valley Interlocking landscaping project"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="vi-hero-tint" aria-hidden="true" />
        </div>
        <ViContainer className="relative z-10 flex w-full items-center">
          <ViHeroContentPanel>
            <h1 className="vi-display-lg mb-6 leading-tight">
              <span className="block">See What&apos;s Possible</span>
              <span className="block">For Your Home.</span>
            </h1>
            <p className="vi-body-lg mb-8">
              A showcase of completed landscaping, interlocking, driveway, patio, pool, porch, pergola, and outdoor
              living projects across Toronto and Edmonton.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={VI_PATHS.contact} className={VI_HERO_CTA_PRIMARY}>
                Contact Us
              </Link>
              <Link href={VI_PATHS.services} className={VI_HERO_CTA_SECONDARY}>
                View Our Services
              </Link>
            </div>
          </ViHeroContentPanel>
        </ViContainer>
      </section>

      <section className="bg-[var(--vi-background)] py-[var(--vi-stack-lg)]">
        <ViContainer>
          <div className="vi-masonry">
            {VI_GALLERY_ITEMS.map((item, index) => (
              <button
                key={item.title}
                type="button"
                className={`vi-masonry-item group relative block w-full overflow-hidden rounded-lg text-left vi-ambient-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--vi-primary)] ${galleryTileAspect(index)}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`View ${item.title}`}
              >
                <ViImg
                  src={galleryImageForIndex(index)}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1023px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--vi-primary)_85%,transparent)] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <span className="vi-label-sm mb-1 block opacity-80">{item.category}</span>
                  <span className="vi-headline-md font-bold">{item.title}</span>
                </div>
                <span className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[var(--vi-primary)] opacity-0 transition-opacity group-hover:opacity-100">
                  <ViIcon name="zoom_in" />
                </span>
              </button>
            ))}
          </div>
        </ViContainer>
      </section>

      <ViAboutCtaBanner content={VI_GALLERY_CTA} />

      {activeItem && activeIndex !== null ? (
        <div
          ref={dialogRef}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeItem.title} project photo`}
          onClick={close}
        >
          <button
            type="button"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            onClick={close}
            aria-label="Close gallery viewer"
          >
            <ViIcon name="close" />
          </button>
          <button
            type="button"
            className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            aria-label="Previous image"
          >
            <ViIcon name="chevron_left" />
          </button>
          <button
            type="button"
            className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            aria-label="Next image"
          >
            <ViIcon name="chevron_right" />
          </button>
          <figure className="relative max-h-[85vh] max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <ViImg
              src={galleryImageForIndex(activeIndex)}
              alt={activeItem.title}
              width={1200}
              height={800}
              className="max-h-[85vh] w-auto rounded-lg object-contain"
            />
            <figcaption className="mt-4 text-center text-white">
              <span className="vi-label-sm block opacity-70">{activeItem.category}</span>
              <span className="vi-headline-md">{activeItem.title}</span>
            </figcaption>
          </figure>
        </div>
      ) : null}
    </main>
  );
}
