import type { SiteColorMode } from "@/lib/themes/siteTheme";
import {
    getSitePalette,
    SITE_PALETTE_FALLBACK,
    type SitePaletteColors,
} from "@/lib/themes/sitePalette";

export const HOME_PIXEL_PALETTE = SITE_PALETTE_FALLBACK;

export function getHomePixelPalette(mode: SiteColorMode): SitePaletteColors {
    return getSitePalette(mode);
}
