"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PS_PATHS } from "./pawsomeConfig";
import { PsIcon, PsPageWrap, PsPrimaryButton } from "./PawsomeShared";

const headline = { fontFamily: "var(--font-ps-headline)" } as const;

type Particle = { id: number; x: number; y: number; size: number; delay: number };

export function PawsomeReviewSuccessBody() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const seeded = useRef(false);

  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    setParticles(
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 6 + Math.random() * 10,
        delay: Math.random() * 2,
      })),
    );
  }, []);

  return (
    <main className="relative min-h-[70vh] overflow-hidden pb-12 pt-24 md:pt-28">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute animate-bounce rounded-full bg-[var(--ps-on-tertiary-container)] opacity-40"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${2.5 + p.delay}s`,
            }}
          />
        ))}
      </div>

      <PsPageWrap className="relative max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--ps-tertiary-fixed)] shadow-[var(--ps-shadow-lg)]">
          <PsIcon name="military_tech" filled className="text-5xl text-[var(--ps-on-tertiary-container)]" />
        </div>
        <h1 className="text-3xl font-bold text-[var(--ps-primary)]" style={headline}>
          Thanks for sharing!
        </h1>
        <p className="mt-3 text-[var(--ps-on-surface-variant)]">
          +50 Pawsome Points added to your balance. Luna&apos;s review helps the community.
        </p>
        <div className="mt-8 rounded-xl bg-[var(--ps-surface-container-lowest)] p-6 shadow-[var(--ps-shadow)]">
          <p className="text-4xl font-bold text-[var(--ps-secondary)]" style={headline}>
            1,300
          </p>
          <p className="text-sm text-[var(--ps-on-surface-variant)]">New points balance (demo)</p>
        </div>
        <div className="mt-8 flex flex-col gap-3">
          <PsPrimaryButton href={PS_PATHS.rewards}>View rewards</PsPrimaryButton>
          <Link
            href={PS_PATHS.home}
            className="text-sm font-semibold text-[var(--ps-secondary)] hover:underline"
          >
            Back to home
          </Link>
        </div>
      </PsPageWrap>
    </main>
  );
}
