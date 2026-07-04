/** Responsive `sizes` hints for Next.js Image — keep in sync with layout breakpoints. */
export const SPM_IMAGE_SIZES = {
  productCard: "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw",
  productHero: "(max-width: 1024px) 100vw, 60vw",
  productThumb: "80px",
  productRecent: "128px",
  cartThumb: "64px",
  cartLine: "(max-width: 640px) 192px, 192px",
  recommendation: "(max-width: 768px) 50vw, 25vw",
  relatedProduct: "(max-width: 768px) 50vw, 25vw",
  homeSpecial: "(max-width: 768px) 100vw, 33vw",
  mascot: "256px",
} as const;

export type SpmImageVariant =
  | "productCard"
  | "productHero"
  | "productThumb"
  | "productRecent"
  | "cartThumb"
  | "cartLine"
  | "recommendation"
  | "relatedProduct";

type SpmImageVariantConfig = {
  frameClassName: string;
  sizes: string;
  width: number;
  height: number;
};

/** Fixed intrinsic dimensions + responsive frame classes per use case. */
export const SPM_IMAGE_VARIANTS: Record<SpmImageVariant, SpmImageVariantConfig> = {
  productCard: {
    frameClassName: "relative aspect-square w-full overflow-hidden",
    sizes: SPM_IMAGE_SIZES.productCard,
    width: 400,
    height: 400,
  },
  productHero: {
    frameClassName: "relative aspect-square w-full overflow-hidden",
    sizes: SPM_IMAGE_SIZES.productHero,
    width: 800,
    height: 800,
  },
  productThumb: {
    frameClassName: "relative h-20 w-20 shrink-0 overflow-hidden",
    sizes: SPM_IMAGE_SIZES.productThumb,
    width: 80,
    height: 80,
  },
  productRecent: {
    frameClassName: "relative h-32 w-32 shrink-0 overflow-hidden",
    sizes: SPM_IMAGE_SIZES.productRecent,
    width: 128,
    height: 128,
  },
  cartThumb: {
    frameClassName: "relative h-16 w-16 shrink-0 overflow-hidden",
    sizes: SPM_IMAGE_SIZES.cartThumb,
    width: 64,
    height: 64,
  },
  cartLine: {
    frameClassName: "relative h-48 w-full max-w-48 shrink-0 overflow-hidden",
    sizes: SPM_IMAGE_SIZES.cartLine,
    width: 192,
    height: 192,
  },
  recommendation: {
    frameClassName: "relative aspect-square w-full overflow-hidden",
    sizes: SPM_IMAGE_SIZES.recommendation,
    width: 320,
    height: 320,
  },
  relatedProduct: {
    frameClassName: "relative aspect-square w-full overflow-hidden",
    sizes: SPM_IMAGE_SIZES.relatedProduct,
    width: 280,
    height: 280,
  },
};

export function spmResponsiveImageClassName(responsive = true): string {
  return responsive ? "h-full w-full max-w-full object-cover" : "object-cover";
}
