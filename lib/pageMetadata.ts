import type { Metadata } from "next";
import { absoluteUrl, BUSINESS } from "@/lib/siteConfig";

export const DEFAULT_OG_IMAGE = {
    url: "/og-image.png",
    width: 1200,
    height: 630,
    alt: "Nice Guy Web Design — Toronto small business websites",
} as const;

export function brandedDocumentTitle(pageTitle: string): string {
    return `${pageTitle} | ${BUSINESS.name}`;
}

export function brandNameCount(title: string): number {
    return title.match(/Nice Guy Web Design/g)?.length ?? 0;
}

export type CreatePageMetadataInput = {
    title: string;
    description: string;
    path: string;
    /**
     * When true, `title` is the full document title (custom suffix or brand
     * already included) and the root title template is skipped.
     */
    absoluteTitle?: boolean;
    ogType?: "website" | "article";
    ogImage?: {
        url: string;
        alt: string;
        width?: number;
        height?: number;
    };
};

export function createPageMetadata({
    title,
    description,
    path,
    absoluteTitle = false,
    ogType = "website",
    ogImage,
}: CreatePageMetadataInput): Metadata {
    const fullTitle = absoluteTitle ? title : brandedDocumentTitle(title);

    const pageUrl = absoluteUrl(path);
    const image = ogImage
        ? [
              {
                  url: ogImage.url,
                  alt: ogImage.alt,
                  width: ogImage.width ?? 1200,
                  height: ogImage.height ?? 630,
              },
          ]
        : [DEFAULT_OG_IMAGE];

    return {
        title: absoluteTitle ? { absolute: fullTitle } : title,
        description,
        alternates: {
            canonical: pageUrl,
        },
        openGraph: {
            type: ogType,
            locale: "en_CA",
            url: pageUrl,
            siteName: BUSINESS.name,
            title: fullTitle,
            description,
            images: image,
        },
        twitter: {
            card: "summary_large_image",
            title: fullTitle,
            description,
            images: [image[0].url],
        },
    };
}
