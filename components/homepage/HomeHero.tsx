"use client";

import { useTheme } from "@/components/theme/ThemeProvider";
import { getSitePalette } from "@/lib/themes/sitePalette";
import { isDarkTheme } from "@/lib/themes/siteTheme";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import PixelCtaLink from "@/components/ui/PixelCtaLink";
import { ArrowRight, Sparkles } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & helpers                                                    */
/* ------------------------------------------------------------------ */

type Phase = "browser" | "headline" | "paragraph" | "ctas";
const PHASE_ORDER: Phase[] = ["browser", "headline", "paragraph", "ctas"];

type TargetPoint = { x: number; y: number; color: string };

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  phase: Phase;
  color: string;
  size: number;
  opacity: number;
  scale: number;
  arrived: boolean;
  bornAt: number;
  startDelay: number;
  arrivedAt: number;
  drift: number;
};

function drawPixelParticle(
  ctx: CanvasRenderingContext2D,
  p: Particle,
  alpha: number,
  isDark: boolean,
  fill: string,
  outline: string,
) {
  const a = alpha * p.opacity;
  if (a <= 0) return;

  const s = p.size * p.scale;
  const x = p.x - s / 2;
  const y = p.y - s / 2;

  ctx.globalAlpha = a;
  ctx.shadowBlur = 0;

  if (isDark) {
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 4;
    ctx.fillStyle = p.color;
    ctx.fillRect(x, y, s, s);
    return;
  }

  ctx.fillStyle = fill;
  ctx.fillRect(x, y, s, s);
  ctx.strokeStyle = outline;
  ctx.lineWidth = Math.max(0.5, s * 0.2);
  ctx.strokeRect(x, y, s, s);
}

function pointsFromRect(
  rect: { x: number; y: number; w: number; h: number },
  color: string,
  density = 22,
): TargetPoint[] {
  const pts: TargetPoint[] = [];
  const stepX = Math.max(6, rect.w / density);
  const stepY = Math.max(6, rect.h / Math.max(4, Math.round(density * (rect.h / rect.w))));
  for (let x = rect.x; x <= rect.x + rect.w; x += stepX) {
    pts.push({ x, y: rect.y, color });
    pts.push({ x, y: rect.y + rect.h, color });
  }
  for (let y = rect.y; y <= rect.y + rect.h; y += stepY) {
    pts.push({ x: rect.x, y, color });
    pts.push({ x: rect.x + rect.w, y, color });
  }
  return pts;
}

function pointsFromText(
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  fontSize: number,
  fontFamily: string,
  step = 5,
  opts: { letterSpacing?: number; lineHeightPx?: number; fontWeight?: number } = {},
): Array<{ x: number; y: number }> {
  if (typeof document === "undefined") return [];
  const canvas = document.createElement("canvas");
  const dpr = 2;
  const weight = opts.fontWeight ?? 800;
  const lineHeight = opts.lineHeightPx ?? fontSize * 1.02;
  const ctx = canvas.getContext("2d")!;
  const applyFont = () => {
    ctx.font = `${weight} ${fontSize}px ${fontFamily}`;
    if ("letterSpacing" in ctx && opts.letterSpacing != null) {
      (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
        `${opts.letterSpacing}px`;
    }
  };
  applyFont();

  const lines: string[] = [];
  for (const forced of text.split("\n")) {
    const words = forced.split(" ");
    let line = "";
    for (const w of words) {
      const test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = w;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
  }

  const totalHeight = lines.length * lineHeight;
  canvas.width = Math.ceil(maxWidth * dpr);
  canvas.height = Math.ceil(totalHeight * dpr);
  ctx.scale(dpr, dpr);
  ctx.fillStyle = "#000";
  ctx.textBaseline = "top";
  applyFont();
  lines.forEach((l, i) => ctx.fillText(l, 0, i * lineHeight));

  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const out: Array<{ x: number; y: number }> = [];
  for (let py = 0; py < canvas.height; py += step * dpr) {
    for (let px = 0; px < canvas.width; px += step * dpr) {
      const idx = (py * canvas.width + px) * 4 + 3;
      if (img.data[idx] > 128) {
        out.push({ x: x + px / dpr, y: y + py / dpr });
      }
    }
  }
  return out;
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`;
}

function accentFromElement(el: HTMLElement): string {
  const cs = window.getComputedStyle(el);
  if (cs.borderTopColor && cs.borderTopColor !== "rgba(0, 0, 0, 0)") {
    return cs.borderTopColor;
  }
  return cs.color;
}

function withColor(
  pts: Array<{ x: number; y: number }>,
  color: string,
): TargetPoint[] {
  return pts.map((p) => ({ ...p, color }));
}

function rand(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function transformOffsetY(el: Element): number {
  const t = window.getComputedStyle(el).transform;
  if (!t || t === "none") return 0;
  return new DOMMatrix(t).m42;
}

function fontOptsFromComputed(cs: CSSStyleDeclaration) {
  const fs = parseFloat(cs.fontSize);
  const ls = parseFloat(cs.letterSpacing);
  const lh = parseFloat(cs.lineHeight);
  const weight = parseInt(cs.fontWeight, 10) || 800;
  return {
    fontSize: fs,
    fontFamily: cs.fontFamily,
    fontWeight: weight,
    letterSpacing: Number.isNaN(ls) ? undefined : ls,
    lineHeightPx: Number.isNaN(lh) ? undefined : lh,
    step: Math.max(4, Math.round(fs / 10)),
  };
}

function pointsFromTextNode(
  node: Text,
  wrapRect: DOMRect,
  dy: number,
  color: string,
  font: ReturnType<typeof fontOptsFromComputed>,
): TargetPoint[] {
  const range = document.createRange();
  range.selectNodeContents(node);
  const rects = Array.from(range.getClientRects()).filter((r) => r.width > 0);
  const text = (node.textContent ?? "").trim();
  if (!text || rects.length === 0) return [];

  const out: TargetPoint[] = [];
  for (const rect of rects) {
    out.push(
      ...withColor(
        pointsFromText(
          text,
          rect.left - wrapRect.left,
          rect.top - wrapRect.top - dy,
          rect.width,
          font.fontSize,
          font.fontFamily,
          font.step,
          {
            letterSpacing: font.letterSpacing,
            lineHeightPx: font.lineHeightPx,
            fontWeight: font.fontWeight,
          },
        ),
        color,
      ),
    );
  }
  return out;
}

function pointsFromHeadlineElement(
  el: HTMLElement,
  wrapRect: DOMRect,
): TargetPoint[] {
  const dy = transformOffsetY(el);
  const cs = window.getComputedStyle(el);
  const baseFont = fontOptsFromComputed(cs);
  const defaultColor = cs.color;
  const out: TargetPoint[] = [];

  for (const child of el.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      out.push(
        ...pointsFromTextNode(child as Text, wrapRect, dy, defaultColor, baseFont),
      );
      continue;
    }
    if (!(child instanceof HTMLElement) || child.tagName === "BR") continue;

    const spanCs = window.getComputedStyle(child);
    const font = fontOptsFromComputed(spanCs);
    const r = child.getBoundingClientRect();
    out.push(
      ...withColor(
        pointsFromText(
          (child.textContent ?? "").trim(),
          r.left - wrapRect.left,
          r.top - wrapRect.top - dy,
          r.width,
          font.fontSize,
          font.fontFamily,
          font.step,
          {
            letterSpacing: font.letterSpacing,
            lineHeightPx: font.lineHeightPx,
            fontWeight: font.fontWeight,
          },
        ),
        spanCs.color,
      ),
    );
  }

  return out;
}

function pointsFromParagraphElement(
  el: HTMLElement,
  wrapRect: DOMRect,
  step = 6,
): TargetPoint[] {
  const cs = window.getComputedStyle(el);
  const fs = parseFloat(cs.fontSize);
  const color = cs.color;
  const dy = transformOffsetY(el);

  const range = document.createRange();
  range.selectNodeContents(el);
  const lineRects = Array.from(range.getClientRects()).filter((r) => r.width > 10 && r.height > 0);

  const pts: TargetPoint[] = [];
  for (const rect of lineRects) {
    for (let x = rect.left + step / 2; x < rect.right - step; x += step) {
      pts.push({
        x: x - wrapRect.left,
        y: rect.top - wrapRect.top - dy + Math.min(fs * 0.45, rect.height * 0.55),
        color,
      });
    }
  }
  return pts;
}

function pointsFromBrowserImage(
  container: HTMLElement,
  wrapRect: DOMRect,
  step = 5,
  isDark = false,
  pageBg = "#071729",
): TargetPoint[] {
  try {
    const img = container.querySelector("img");
    if (!img || !img.complete || img.naturalWidth === 0) return [];

    const cr = container.getBoundingClientRect();
    const w = Math.round(cr.width);
    const h = Math.round(cr.height);
    if (w < 1 || h < 1) return [];

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, w, h);

    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    const fitScale = Math.min(w / nw, h / nh);
    const dw = nw * fitScale;
    const dh = nh * fitScale;
    const dx = (w - dw) / 2;
    const dy = (h - dh) / 2;

    if (isDark) {
      ctx.fillStyle = pageBg;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "screen";
    }

    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.globalCompositeOperation = "source-over";

    const data = ctx.getImageData(0, 0, w, h).data;
    const dyReveal = transformOffsetY(container);
    const pts: TargetPoint[] = [];

    for (let py = 0; py < h; py += step) {
      for (let px = 0; px < w; px += step) {
        const i = (py * w + px) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        if (a > 90 && r + g + b > 80) {
          pts.push({
            x: cr.left - wrapRect.left + px,
            y: cr.top - wrapRect.top - dyReveal + py,
            color: rgbToHex(r, g, b),
          });
        }
      }
    }
    return pts;
  } catch {
    return [];
  }
}

function capPoints(pts: TargetPoint[], max = 1200) {
  if (pts.length <= max) return pts;
  const stride = Math.ceil(pts.length / max);
  return pts.filter((_, i) => i % stride === 0);
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function HomeHero() {
  const { theme } = useTheme();
  const PALETTE = getSitePalette(theme);

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const browserRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [revealed, setRevealed] = useState<Record<Phase, boolean>>({
    browser: false,
    headline: false,
    paragraph: false,
    ctas: false,
  });
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setRevealed({ browser: true, headline: true, paragraph: true, ctas: true });
      setAnimationComplete(true);
      return;
    }

    let cancelled = false;
    let raf = 0;

    setRevealed({
      browser: false,
      headline: false,
      paragraph: false,
      ctas: false,
    });
    setAnimationComplete(false);

    const run = async () => {
      await document.fonts.ready;

      const browserImg = browserRef.current?.querySelector("img");
      if (browserImg && !browserImg.complete) {
        await new Promise<void>((resolve) => {
          browserImg.addEventListener("load", () => resolve(), { once: true });
          browserImg.addEventListener("error", () => resolve(), { once: true });
        });
      }

      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

      if (cancelled || !wrapRef.current || !canvasRef.current) return;

      const wrap = wrapRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const resize = () => {
        const r = wrap.getBoundingClientRect();
        canvas.width = r.width * dpr;
        canvas.height = r.height * dpr;
        canvas.style.width = r.width + "px";
        canvas.style.height = r.height + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      resize();

      const wrapRect = wrap.getBoundingClientRect();
      const getLocal = (el: Element) => {
        const r = el.getBoundingClientRect();
        const dy = transformOffsetY(el);
        return {
          x: r.left - wrapRect.left,
          y: r.top - wrapRect.top - dy,
          w: r.width,
          h: r.height,
        };
      };

      const logoRect = { x: 40, y: 40, w: 120, h: 40 };
      const source = { x: logoRect.x + logoRect.w / 2, y: logoRect.y + logoRect.h / 2 };

      const isDark = isDarkTheme(theme);
      const pageBg = isDark ? PALETTE.navy : "#f2f6f9";
      const particleCap = isDark ? 1200 : 550;
      const pixelFill = PALETTE.primary;
      const pixelOutline = PALETTE.navy;

      const targets: Record<Phase, TargetPoint[]> = {
        browser: [],
        headline: [],
        paragraph: [],
        ctas: [],
      };

      if (browserRef.current) {
        targets.browser = pointsFromBrowserImage(
          browserRef.current,
          wrapRect,
          isDark ? 5 : 7,
          isDark,
          pageBg,
        );
        if (targets.browser.length === 0) {
          const r = getLocal(browserRef.current);
          targets.browser.push(...pointsFromRect(r, PALETTE.primary, 36));
        }
        if (targets.browser.length === 0) {
          setRevealed((prev) => ({ ...prev, browser: true }));
        }
      }

      if (headlineRef.current) {
        targets.headline = pointsFromHeadlineElement(headlineRef.current, wrapRect);
      }

      if (paragraphRef.current) {
        targets.paragraph = pointsFromParagraphElement(paragraphRef.current, wrapRect);
      }

      if (ctaRef.current) {
        Array.from(ctaRef.current.children).forEach((el) => {
          if (!(el instanceof HTMLElement)) return;
          const r = getLocal(el);
          targets.ctas.push(...pointsFromRect(r, accentFromElement(el), 30));
        });
      }

      const phaseTiming: Record<Phase, { start: number; duration: number }> = {
        browser: { start: 0, duration: 450 },
        headline: { start: 350, duration: 400 },
        paragraph: { start: 650, duration: 250 },
        ctas: { start: 800, duration: 250 },
      };

      const now = performance.now();
      const particles: Particle[] = [];

      (PHASE_ORDER as Phase[]).forEach((phase) => {
        const timing = phaseTiming[phase];
        const capped = capPoints(targets[phase], particleCap);
        capped.forEach((p, i) => {
          const staggered = timing.start + (i / Math.max(1, capped.length)) * timing.duration;
          particles.push({
            x: source.x + rand(-6, 6),
            y: source.y + rand(-6, 6),
            vx: 0,
            vy: 0,
            tx: p.x,
            ty: p.y,
            phase,
            color: p.color,
            size: isDark ? rand(2, 3.4) : rand(1.6, 2.6),
            opacity: isDark ? 1 : rand(0.48, 0.92),
            scale: isDark ? 1 : rand(0.82, 1.12),
            arrived: false,
            bornAt: now,
            startDelay: staggered,
            arrivedAt: 0,
            drift: rand(0, Math.PI * 2),
          });
        });
      });

      const browserBounds = browserRef.current ? getLocal(browserRef.current) : null;

      const ambient: Particle[] = [];
      const ambientCount = isDark ? 40 : 14;
      for (let i = 0; i < ambientCount; i++) {
        const maxX = browserBounds ? Math.max(80, browserBounds.x - 24) : wrapRect.width * 0.55;
        ambient.push({
          x: rand(0, maxX),
          y: rand(0, wrapRect.height),
          vx: rand(-0.1, 0.1),
          vy: rand(-0.05, 0.05),
          tx: 0,
          ty: 0,
          phase: "browser",
          color: i % 3 === 0 ? PALETTE.primary : PALETTE.accent,
          size: isDark ? rand(1.2, 2) : rand(1, 1.6),
          opacity: isDark ? 0.35 : rand(0.22, 0.42),
          scale: isDark ? 1 : rand(0.85, 1.05),
          arrived: true,
          bornAt: now,
          startDelay: 0,
          arrivedAt: now + 1400,
          drift: rand(0, Math.PI * 2),
        });
      }

      const revealedPhases = new Set<Phase>();
      let allRevealedAt = 0;
      const start = performance.now();

      const tick = (t: number) => {
        if (cancelled) return;
        const elapsed = t - start;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const arrivedByPhase: Record<Phase, { total: number; done: number }> = {
          browser: { total: 0, done: 0 },
          headline: { total: 0, done: 0 },
          paragraph: { total: 0, done: 0 },
          ctas: { total: 0, done: 0 },
        };

        const glowAlpha = allRevealedAt > 0
          ? Math.max(0, 1 - (elapsed - allRevealedAt) / 600)
          : Math.max(0, 1 - Math.max(0, elapsed - 3500) / 1200);
        if (isDark && glowAlpha > 0.01) {
          ctx.globalAlpha = glowAlpha;
          const glow = ctx.createRadialGradient(source.x, source.y, 0, source.x, source.y, 90);
          glow.addColorStop(0, "rgba(96,196,227,0.28)");
          glow.addColorStop(1, "rgba(96,196,227,0)");
          ctx.fillStyle = glow;
          ctx.fillRect(source.x - 90, source.y - 90, 180, 180);
          ctx.globalAlpha = 1;
        }

        for (const p of particles) {
          const phase = p.phase;

          arrivedByPhase[phase].total++;

          if (elapsed < p.startDelay) continue;

          if (!p.arrived) {
            const dx = p.tx - p.x;
            const dy = p.ty - p.y;
            const dist = Math.hypot(dx, dy);
            const ax = dx * 0.09 + Math.cos(p.drift + elapsed * 0.003) * 0.08;
            const ay = dy * 0.09 + Math.sin(p.drift + elapsed * 0.003) * 0.08;
            p.vx = p.vx * 0.78 + ax;
            p.vy = p.vy * 0.78 + ay;
            p.x += p.vx;
            p.y += p.vy;
            if (dist < 2) {
              p.arrived = true;
              p.arrivedAt = t;
              p.x = p.tx;
              p.y = p.ty;
            }
          } else {
            arrivedByPhase[phase].done++;
            if (revealedPhases.has(phase)) {
              const age = (t - p.arrivedAt - 200) / 800;
              if (age > 0) {
                p.x += Math.cos(p.drift) * 0.4 * age;
                p.y += Math.sin(p.drift) * 0.4 * age - 0.05;
                if (age > 1) continue;
              }
            }
          }

          const revealAlpha = revealedPhases.has(phase)
            ? Math.max(0, 1 - (t - p.arrivedAt - 200) / 800)
            : 1;
          if (revealAlpha <= 0) continue;

          drawPixelParticle(ctx, p, revealAlpha, isDark, pixelFill, pixelOutline);
        }
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        for (const p of ambient) {
          if (elapsed < 1250) continue;
          if (
            browserBounds &&
            p.x >= browserBounds.x - 8 &&
            p.x <= browserBounds.x + browserBounds.w + 8 &&
            p.y >= browserBounds.y - 8 &&
            p.y <= browserBounds.y + browserBounds.h + 8
          ) {
            continue;
          }
          p.x += p.vx;
          p.y += p.vy;
          p.drift += 0.01;
          p.vx += Math.cos(p.drift) * 0.002;
          p.vy += Math.sin(p.drift) * 0.002;
          if (p.x < 0 || p.x > wrapRect.width) p.vx *= -1;
          if (p.y < 0 || p.y > wrapRect.height) p.vy *= -1;
          drawPixelParticle(ctx, p, 1, isDark, pixelFill, pixelOutline);
        }
        ctx.globalAlpha = 1;

        for (const phase of PHASE_ORDER) {
          if (revealedPhases.has(phase)) continue;
          const s = arrivedByPhase[phase];
          if (s.total > 0 && s.done / s.total > 0.85) {
            revealedPhases.add(phase);
            setRevealed((prev) => ({ ...prev, [phase]: true }));
            if (revealedPhases.size === PHASE_ORDER.length && !allRevealedAt) {
              allRevealedAt = elapsed;
            }
          }
        }

        if (elapsed > 5000) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          setRevealed({
            browser: true,
            headline: true,
            paragraph: true,
            ctas: true,
          });
          setAnimationComplete(true);
          return;
        }
        raf = requestAnimationFrame(tick);
      };

      raf = requestAnimationFrame(tick);

      const onResize = () => resize();
      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
      };
    };

    let cleanupResize: (() => void) | undefined;
    run().then((cleanup) => {
      cleanupResize = cleanup;
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      cleanupResize?.();
    };
  }, [theme]);

  return (
    <div ref={wrapRef} className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 ng-grid-bg opacity-60" />
      <div className="pointer-events-none absolute -top-40 left-1/2 hidden h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-40 blur-3xl dark:block"
           style={{ background: "radial-gradient(closest-side, var(--ng-hero-glow), transparent)" }} />

      <section
        className="relative z-10 mx-auto grid max-w-[1400px] grid-cols-1 items-start gap-14 px-6 pb-24 pt-8 lg:grid-cols-12 lg:gap-6 lg:px-10 lg:pt-14"
        aria-labelledby="home-hero-heading"
      >
        <div className="lg:col-span-5">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[color:var(--ng-border)] bg-white/60 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--ng-heading)] backdrop-blur dark:bg-white/5">
            <Sparkles className="h-3 w-3" aria-hidden />
            Websites, pixel by pixel
          </div>

          <h1
            id="home-hero-heading"
            ref={headlineRef}
            className="font-pixel text-[44px] font-extrabold capitalize leading-[0.98] tracking-tight text-[color:var(--ng-heading)] sm:text-[54px] lg:text-[64px]"
          >
            We Build{" "}
            <span className="pixel-word ng-pixel-word-highlight">Websites</span>
            <br />
            That Grow{" "}
            <span className="pixel-word ng-pixel-word-base">Businesses</span>
          </h1>

          <p
            ref={paragraphRef}
            className="mt-6 max-w-lg text-[16px] leading-relaxed text-[color:var(--ng-body)]"
          >
            A tiny Toronto studio obsessed with craft. We build fast, thoughtful
            websites that convert visitors into customers — one deliberate
            decision at a time.
          </p>

          <div
            ref={ctaRef}
            className="mt-10 flex flex-wrap items-center gap-4 sm:gap-5"
          >
            <PixelCtaLink
              href="/contact"
              color="var(--ng-btn-coral)"
              className="group"
            >
              Start your project
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </PixelCtaLink>
            <PixelCtaLink
              href="/work"
              color="var(--ng-btn-sky)"
              className="group"
            >
              See our work
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </PixelCtaLink>
          </div>
        </div>

        <div className="relative z-10 lg:col-span-7">
          <p className="sr-only">
            Decorative pixel-art browser window illustrating how a website is assembled step by step.
          </p>
          <div
            ref={browserRef}
            aria-hidden
            className={`relative mx-auto aspect-[5/4] w-full overflow-hidden rounded-2xl home-hero-browser motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out lg:mx-0 lg:ml-auto lg:w-[min(100%,580px)] xl:w-[min(100%,640px)] ${revealed.browser ? "motion-safe:translate-y-0 motion-safe:opacity-100" : "motion-safe:translate-y-2 motion-safe:opacity-0"}`}
          >
            <Image
              src="/pixel-browser.png"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="pixel-browser-mockup"
              priority
              unoptimized
            />
          </div>
        </div>
      </section>

      <canvas
        ref={canvasRef}
        className={`pointer-events-none absolute inset-0 z-30 transition-opacity duration-500 ${animationComplete ? "opacity-0" : "opacity-100"}`}
        aria-hidden
      />
    </div>
  );
}
