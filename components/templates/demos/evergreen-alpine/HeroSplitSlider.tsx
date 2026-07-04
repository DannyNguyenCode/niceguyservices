"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type HeroSplitSliderProps = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
};

export function HeroSplitSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
}: HeroSplitSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [containerWidth, setContainerWidth] = useState(0);
  const dragging = useRef(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    observer.observe(node);
    setContainerWidth(node.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, []);

  const updatePosition = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    setPosition((x / rect.width) * 100);
  }, []);

  const onPointerDown = useCallback(() => {
    dragging.current = true;
  }, []);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      updatePosition(e.clientX);
    },
    [updatePosition],
  );

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full select-none touch-none"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <Image
        src={beforeSrc}
        alt={beforeAlt}
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />

      <div
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <div className="relative h-full" style={{ width: containerWidth || "100%" }}>
          <Image
            src={afterSrc}
            alt={afterAlt}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      </div>

      <div
        className="absolute inset-y-0 z-10 w-4 -translate-x-1/2 cursor-ew-resize"
        style={{ left: `${position}%` }}
        onPointerDown={onPointerDown}
        role="slider"
        aria-label="Compare property before and after transformation"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setPosition((p) => Math.max(p - 5, 0));
          if (e.key === "ArrowRight") setPosition((p) => Math.min(p + 5, 100));
        }}
      >
        <div className="mx-auto h-full w-0.5 bg-[#012d1d]" aria-hidden />
      </div>
    </div>
  );
}
