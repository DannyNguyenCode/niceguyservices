import type { ReactNode } from "react";

type TextureProps = {
  children?: ReactNode;
  className?: string;
};

export function TextureGrain({ children, className = "" }: TextureProps) {
  return (
    <div className={`las-texture-grain ${className}`} aria-hidden={false}>
      {children}
    </div>
  );
}

export function HalftoneCorner({
  children,
  className = "",
  position = "br",
}: TextureProps & { position?: "tl" | "br" }) {
  return (
    <div className={`las-halftone-corner las-halftone-corner--${position} ${className}`}>{children}</div>
  );
}

export function InkSpeckOverlay({ className = "" }: { className?: string }) {
  return <div className={`las-ink-speck pointer-events-none absolute inset-0 ${className}`} aria-hidden />;
}

export function TechnicalGrid({ className = "" }: { className?: string }) {
  return <div className={`las-technical-grid pointer-events-none absolute inset-0 ${className}`} aria-hidden />;
}

export function RedEnergyGlow({
  children,
  className = "",
  active = false,
}: TextureProps & { active?: boolean }) {
  return (
    <div className={`las-red-energy-glow ${active ? "is-active" : ""} ${className}`}>{children}</div>
  );
}

export function TextureOverlay({
  children,
  className = "",
  grain = true,
  halftone = false,
  ink = true,
  grid = false,
}: TextureProps & { grain?: boolean; halftone?: boolean; ink?: boolean; grid?: boolean }) {
  const inner = (
    <div className={`relative ${className}`}>
      {ink && <InkSpeckOverlay />}
      {grid && <TechnicalGrid />}
      {halftone && (
        <>
          <div className="las-halftone-corner las-halftone-corner--tl pointer-events-none absolute inset-0" aria-hidden />
          <div className="las-halftone-corner las-halftone-corner--br pointer-events-none absolute inset-0" aria-hidden />
        </>
      )}
      <div className="relative z-[2]">{children}</div>
    </div>
  );
  return grain ? <TextureGrain>{inner}</TextureGrain> : inner;
}
