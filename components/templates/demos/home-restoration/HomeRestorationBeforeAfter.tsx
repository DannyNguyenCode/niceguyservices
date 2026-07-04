"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

type BeforeAfterItem = {
  id: string;
  title: string;
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
};

type HomeRestorationBeforeAfterProps = {
  items: readonly BeforeAfterItem[];
};

function BeforeAfterSlider({ item }: { item: BeforeAfterItem }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const dragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    updatePosition(e.clientX);
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 5));
    if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 5));
  };

  return (
    <div className="hr-card overflow-hidden p-1">
      <p className="hr-display mb-3 px-4 pt-3 text-lg text-[var(--hr-charcoal)]" style={{ fontFamily: "var(--font-hr-display), serif" }}>
        {item.title}
      </p>
      <div
        ref={containerRef}
        className="hr-ba-slider relative aspect-[4/3] w-full"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <Image
          src={item.after}
          alt={item.afterAlt}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover"
        />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Image
            src={item.before}
            alt={item.beforeAlt}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover"
          />
        </div>

        <span className="hr-label absolute left-4 top-4 z-20 rounded-full bg-black/50 px-3 py-1 text-white backdrop-blur-sm">
          Before
        </span>
        <span className="hr-label absolute right-4 top-4 z-20 rounded-full bg-[var(--hr-gold)]/90 px-3 py-1 text-white">
          After
        </span>

        <div
          className="hr-ba-handle"
          style={{ left: `${position}%`, transform: "translateX(-50%)" }}
          role="slider"
          aria-label={`Compare before and after for ${item.title}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onKeyDown={onKeyDown}
        />
      </div>
      <p className="px-4 py-3 text-center text-xs text-[var(--hr-charcoal-light)]">
        Drag to compare · Use arrow keys for precision
      </p>
    </div>
  );
}

export function HomeRestorationBeforeAfter({ items }: HomeRestorationBeforeAfterProps) {
  const reduce = useReducedMotion();

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) =>
        reduce ? (
          <BeforeAfterSlider key={item.id} item={item} />
        ) : (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
          >
            <BeforeAfterSlider item={item} />
          </motion.div>
        ),
      )}
    </div>
  );
}
