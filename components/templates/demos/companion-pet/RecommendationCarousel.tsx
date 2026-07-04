"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "./companionPetData";
import { ProductCard } from "./ProductCard";

type RecommendationCarouselProps = {
  products: Product[];
};

export function RecommendationCarousel({ products }: RecommendationCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  };

  return (
    <div className="relative mt-8">
      <div className="absolute -top-12 right-0 hidden gap-2 sm:flex">
        <button
          type="button"
          onClick={() => scroll("left")}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--cp-border)] bg-white"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => scroll("right")}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--cp-border)] bg-white"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scrollbar-hide"
      >
        {products.map((p) => (
          <motion.div key={p.id} className="w-64 shrink-0 snap-start sm:w-72">
            <ProductCard product={p} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
