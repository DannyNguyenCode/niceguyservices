"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type PixelImageRevealProps = {
    src: string;
    alt: string;
    className?: string;
    sizes?: string;
};

const BLOCKS = 12;

export default function PixelImageReveal({
    src,
    alt,
    className = "",
    sizes = "(max-width: 768px) 100vw, 50vw",
}: PixelImageRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting) {
                    setInView(true);
                    obs.disconnect();
                }
            },
            { threshold: 0.2 },
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div ref={ref} className={`relative overflow-hidden ${className}`}>
            <Image
                src={src}
                alt={alt}
                fill
                sizes={sizes}
                className={`object-cover transition-[filter,transform] duration-700 motion-reduce:transition-none ${inView ? "blur-0 scale-100" : "scale-105 blur-md motion-reduce:blur-0 motion-reduce:scale-100"}`}
            />
            {!inView ? (
                <div
                    className="pointer-events-none absolute inset-0 grid motion-reduce:hidden"
                    style={{ gridTemplateColumns: `repeat(${BLOCKS}, 1fr)` }}
                    aria-hidden
                >
                    {Array.from({ length: BLOCKS * BLOCKS }).map((_, i) => (
                        <span
                            key={i}
                            className="bg-primary/25"
                            style={{ opacity: 0.35 + (i % 5) * 0.08 }}
                        />
                    ))}
                </div>
            ) : null}
        </div>
    );
}
