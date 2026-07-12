"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  HERO_LIGHT_TIMELINE,
  HERO_MOBILE_LIGHT_TIMELINE,
  type HeroRoomId,
  useIsTouchDevice,
  useCompactViewport,
  usePrefersReducedMotion,
} from "./leaveASparkMotion";
import { LAS_PALETTE as P } from "./leaveASparkPalette";

type CutawayHomeProps = {
  onSequenceComplete?: () => void;
  className?: string;
};

const ALL_ROOMS: HeroRoomId[] = [
  "panel",
  "kitchen",
  "living",
  "office",
  "bedroom",
  "garage",
  "exterior",
  "landscape",
];

function useLightingSequence(reduced: boolean, simplified: boolean, onComplete?: () => void) {
  const [lit, setLit] = useState<Set<HeroRoomId>>(() => (reduced ? new Set(ALL_ROOMS) : new Set(["panel"])));
  const [panelLed, setPanelLed] = useState(reduced);
  const [pulsePath, setPulsePath] = useState(reduced);

  useEffect(() => {
    const timeline = simplified ? HERO_MOBILE_LIGHT_TIMELINE : HERO_LIGHT_TIMELINE;

    if (reduced) {
      setLit(new Set(ALL_ROOMS));
      setPanelLed(true);
      setPulsePath(true);
      onComplete?.();
      return;
    }

    const timers: number[] = [];
    const schedule = (ms: number, fn: () => void) => {
      timers.push(window.setTimeout(fn, ms));
    };

    schedule(timeline.panelLed, () => setPanelLed(true));
    schedule(timeline.panelPulse, () => setPulsePath(true));

    const roomTimes: [HeroRoomId, number][] = [
      ["kitchen", timeline.kitchen],
      ["living", timeline.living],
      ["office", timeline.office],
      ["bedroom", timeline.bedroom],
      ["garage", timeline.garage],
      ["exterior", timeline.exterior],
      ["landscape", timeline.landscape],
    ];

    roomTimes.forEach(([room, time]) => {
      schedule(time, () => setLit((prev) => new Set([...prev, room])));
    });

    schedule(timeline.complete, () => onComplete?.());

    return () => timers.forEach(clearTimeout);
  }, [reduced, simplified, onComplete]);

  return { lit, panelLed, pulsePath };
}

function RoomGlow({ active, cx, cy, r, warm = "#f5c76b" }: { active: boolean; cx: number; cy: number; r: number; warm?: string }) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill={warm}
      opacity={active ? 0.35 : 0}
      style={{ transition: "opacity 0.6s ease" }}
    />
  );
}

function CircuitLine({
  d,
  active,
  pulse,
  delay = 0,
}: {
  d: string;
  active: boolean;
  pulse: boolean;
  delay?: number;
}) {
  return (
    <path
      d={d}
      className="las-circuit-line"
      stroke={active ? P.redPrimary : P.divider}
      strokeWidth={active ? 2 : 1}
      strokeDasharray={pulse && !active ? "6 8" : undefined}
      opacity={active ? 1 : pulse ? 0.35 : 0.15}
      style={{ transition: `stroke 0.5s ease ${delay}ms, opacity 0.5s ease` }}
    />
  );
}

export function CutawayHome({ onSequenceComplete, className = "" }: CutawayHomeProps) {
  const reduced = usePrefersReducedMotion();
  const touch = useIsTouchDevice();
  const compact = useCompactViewport();
  const containerRef = useRef<HTMLDivElement>(null);
  const simplified = touch || compact;
  const { lit, panelLed, pulsePath } = useLightingSequence(reduced, simplified, onSequenceComplete);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 });
  const rotateX = useTransform(springY, [0, 1], [0.5, -0.5]);
  const rotateY = useTransform(springX, [0, 1], [-0.5, 0.5]);
  const shadowX = useTransform(springX, [0, 1], [4, 12]);
  const shadowY = useTransform(springY, [0, 1], [4, 12]);
  const dynamicShadow = useTransform([shadowX, shadowY], ([x, y]) => `${x}px ${y}px 0 #050505`);

  const onMouseMove = (e: React.MouseEvent) => {
    if (touch || reduced || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const isLit = (room: HeroRoomId) => lit.has(room);

  const roomBrightness = useMemo(
    () => ({
      kitchen: isLit("kitchen") ? 1 : 0.25,
      living: isLit("living") ? 1 : 0.22,
      office: isLit("office") ? 1 : 0.22,
      bedroom: isLit("bedroom") ? 1 : 0.2,
      garage: isLit("garage") ? 1 : 0.18,
      basement: isLit("panel") ? 0.45 : 0.15,
    }),
    [lit],
  );

  return (
    <motion.div
      ref={containerRef}
      className={`relative max-w-full ${className}`}
      onMouseMove={onMouseMove}
      style={
        touch || reduced
          ? undefined
          : {
              rotateX,
              rotateY,
              transformPerspective: 1200,
            }
      }
    >
      <motion.div
        className="las-comic-panel las-comic-frame-clip relative overflow-hidden border-[3px] border-[var(--las-off-white)] bg-[var(--las-bg-secondary)] sm:border-[4px]"
        style={
          touch || reduced
            ? { boxShadow: "10px 10px 0 #050505" }
            : { boxShadow: dynamicShadow }
        }
      >
        <div className="las-halftone-corner las-halftone-corner--br pointer-events-none absolute inset-0 z-10 opacity-30" aria-hidden />
        <svg
          viewBox="0 0 900 680"
          className="h-auto w-full"
          role="img"
          aria-label="Cutaway illustration of a modern home showing electrical systems, rooms, EV charger, solar panels, and wiring paths"
        >
          <defs>
            <linearGradient id="lasNightSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0a0a12" />
              <stop offset="1" stopColor="#111118" />
            </linearGradient>
            <linearGradient id="lasWarmLight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f5d9a0" stopOpacity="0.9" />
              <stop offset="1" stopColor="#e8a84c" stopOpacity="0.4" />
            </linearGradient>
            <filter id="lasSoftGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Sky & ground */}
          <rect width="900" height="680" fill="url(#lasNightSky)" />
          <rect x="0" y="560" width="900" height="120" fill="#0d0d0d" />
          <ellipse cx="450" cy="600" rx="380" ry="30" fill="#151515" opacity="0.6" />

          {/* House shell */}
          <path d="M120 200 L450 80 L780 200 L780 520 L120 520 Z" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="2" />
          <path d="M120 200 L450 80 L780 200" fill="none" stroke="#333" strokeWidth="3" />

          {/* Solar panels */}
          <g opacity={isLit("exterior") ? 1 : 0.5} style={{ transition: "opacity 0.6s" }}>
            <rect x="280" y="115" width="80" height="40" fill="#1e2a3a" stroke="#3a4a5a" transform="rotate(-8 320 135)" />
            <rect x="380" y="108" width="90" height="42" fill="#1e2a3a" stroke="#3a4a5a" transform="rotate(-6 425 129)" />
            <rect x="490" y="112" width="75" height="38" fill="#1e2a3a" stroke="#3a4a5a" transform="rotate(-5 528 131)" />
          </g>

          {/* Garage wing */}
          <rect
            x="620"
            y="340"
            width="160"
            height="180"
            fill={roomBrightness.garage > 0.5 ? "#2a2520" : "#141414"}
            stroke="#333"
            style={{ transition: "fill 0.6s" }}
          />
          <RoomGlow active={isLit("garage")} cx={700} cy={400} r={70} />

          {/* EV Charger */}
          <g opacity={isLit("garage") ? 1 : 0.3} style={{ transition: "opacity 0.5s" }}>
            <rect x="720" y="380" width="24" height="50" fill="#222" stroke="#444" rx="2" />
            <rect x="726" y="390" width="12" height="8" fill={P.redPrimary} className={isLit("garage") ? "las-panel-led-breathe" : ""} />
            <path d="M744 410 L760 410" stroke={P.redBright} strokeWidth="2" />
          </g>

          {/* Main floor rooms */}
          <rect
            x="140"
            y="360"
            width="180"
            height="150"
            fill={roomBrightness.kitchen > 0.5 ? "#2d2820" : "#161616"}
            stroke="#333"
            style={{ transition: "fill 0.6s" }}
          />
          <RoomGlow active={isLit("kitchen")} cx={230} cy={430} r={55} />
          <text x="155" y="385" fill="#666" fontSize="11" fontFamily="sans-serif">
            KITCHEN
          </text>

          <rect
            x="330"
            y="360"
            width="200"
            height="150"
            fill={roomBrightness.living > 0.5 ? "#2a2620" : "#151515"}
            stroke="#333"
            style={{ transition: "fill 0.6s" }}
          />
          <RoomGlow active={isLit("living")} cx={430} cy={430} r={65} />
          <text x="345" y="385" fill="#666" fontSize="11" fontFamily="sans-serif">
            LIVING
          </text>

          <rect
            x="540"
            y="360"
            width="70"
            height="150"
            fill={roomBrightness.office > 0.5 ? "#252830" : "#141418"}
            stroke="#333"
            style={{ transition: "fill 0.6s" }}
          />
          <RoomGlow active={isLit("office")} cx={575} cy={430} r={40} />
          <text x="548" y="385" fill="#666" fontSize="9" fontFamily="sans-serif">
            OFFICE
          </text>

          {/* Upper floor bedroom */}
          <rect
            x="330"
            y="230"
            width="280"
            height="120"
            fill={roomBrightness.bedroom > 0.5 ? "#282420" : "#131313"}
            stroke="#333"
            style={{ transition: "fill 0.6s" }}
          />
          <RoomGlow active={isLit("bedroom")} cx={470} cy={290} r={60} />
          <text x="345" y="255" fill="#666" fontSize="11" fontFamily="sans-serif">
            BEDROOM
          </text>

          {/* Basement / panel */}
          <rect
            x="140"
            y="520"
            width="620"
            height="40"
            fill={roomBrightness.basement > 0.3 ? "#1a1815" : "#0e0e0e"}
            stroke="#333"
            style={{ transition: "fill 0.6s" }}
          />
          <rect x="160" y="528" width="50" height="24" fill="#222" stroke="#444" />
          <circle
            cx="185"
            cy="540"
            r="4"
            fill={panelLed ? P.redBright : P.redDeep}
            opacity={panelLed ? 1 : 0.3}
            className={panelLed ? "las-panel-led-breathe" : ""}
          />
          <text x="220" y="545" fill="#555" fontSize="10" fontFamily="sans-serif">
            MAIN PANEL
          </text>

          {/* Generator */}
          <g opacity={isLit("garage") ? 0.9 : 0.35} style={{ transition: "opacity 0.5s" }}>
            <rect x="800" y="480" width="50" height="35" fill="#222" stroke="#444" rx="2" />
            <rect x="808" y="488" width="8" height="6" fill="#333" />
          </g>

          {/* Window glows */}
          {[
            { x: 170, y: 400, on: isLit("kitchen") },
            { x: 380, y: 400, on: isLit("living") },
            { x: 400, y: 270, on: isLit("bedroom") },
            { x: 660, y: 400, on: isLit("garage") },
          ].map((w, i) => (
            <rect
              key={i}
              x={w.x}
              y={w.y}
              width="28"
              height="22"
              fill="url(#lasWarmLight)"
              opacity={w.on ? 0.85 : 0.05}
              filter="url(#lasSoftGlow)"
              style={{ transition: "opacity 0.6s" }}
            />
          ))}

          {/* Exterior wall lights */}
          <g opacity={isLit("exterior") ? 1 : 0.2} style={{ transition: "opacity 0.6s" }}>
            <circle cx="130" cy="350" r="6" fill="#f5c76b" filter="url(#lasSoftGlow)" />
            <circle cx="770" cy="320" r="6" fill="#f5c76b" filter="url(#lasSoftGlow)" />
          </g>

          {/* Landscape / pathway lights */}
          <g opacity={isLit("landscape") ? 1 : 0.15} style={{ transition: "opacity 0.6s" }}>
            {[200, 350, 500, 650].map((x) => (
              <circle key={x} cx={x} cy={575} r="4" fill="#e8b84a" filter="url(#lasSoftGlow)" />
            ))}
            <path d="M150 580 Q450 560 750 580" stroke="#2a2a2a" strokeWidth="8" fill="none" />
          </g>

          {/* Circuit paths from panel */}
          <g aria-hidden>
            <CircuitLine d="M185 528 L185 480 L230 480 L230 430" active={isLit("kitchen")} pulse={pulsePath} />
            <CircuitLine d="M185 528 L185 480 L430 480 L430 430" active={isLit("living")} pulse={pulsePath} delay={100} />
            <CircuitLine d="M185 528 L185 480 L575 480 L575 430" active={isLit("office")} pulse={pulsePath} delay={200} />
            <CircuitLine d="M185 528 L185 350 L470 350 L470 290" active={isLit("bedroom")} pulse={pulsePath} delay={300} />
            <CircuitLine d="M185 528 L185 500 L700 500 L700 400" active={isLit("garage")} pulse={pulsePath} delay={400} />
            <CircuitLine d="M700 400 L760 350 L770 320" active={isLit("exterior")} pulse={pulsePath} delay={500} />
            <CircuitLine d="M185 528 L350 570 L500 575" active={isLit("landscape")} pulse={pulsePath} delay={600} />
          </g>

          {/* Furniture hints */}
          <rect x="360" y="450" width="60" height="20" fill="#3a3530" opacity={isLit("living") ? 0.8 : 0.3} rx="2" />
          <rect x="160" y="460" width="40" height="30" fill="#3a3530" opacity={isLit("kitchen") ? 0.8 : 0.3} rx="2" />
          <rect x="400" y="310" width="80" height="25" fill="#3a3530" opacity={isLit("bedroom") ? 0.8 : 0.3} rx="2" />
        </svg>

        {/* Red accent mark */}
        <div className="pointer-events-none absolute right-3 top-3 h-8 w-1 bg-[var(--las-red)]" aria-hidden />
        <div className="pointer-events-none absolute bottom-4 left-4 h-1 w-12 bg-[var(--las-red-deep)]" aria-hidden />
      </motion.div>

      {/* Offset panel layer — hidden on narrow screens to prevent horizontal overflow */}
      <div
        className="las-cutaway-offset pointer-events-none absolute -left-3 -top-3 -z-10 h-full w-full border-[3px] border-[var(--las-red-deep)] opacity-40 las-comic-frame-clip"
        aria-hidden
      />
    </motion.div>
  );
}
