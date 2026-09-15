import type { ReactNode } from "react";
import DigitalCraftsmanArticleShell from "./DigitalCraftsmanArticleShell";
import type { DcArticleMeta } from "./types";
import { DcResponsiveArticleLayout } from "./article-ui/DcResponsiveArticleLayout";

export type DigitalCraftsmanArticlePageProps = {
    meta: DcArticleMeta;
    children: ReactNode;
};

/**
 * Standard layout for all Digital Craftsman resource articles.
 * Renders one semantic article tree; responsive chrome is CSS-only.
 */
export default function DigitalCraftsmanArticlePage({
    meta,
    children,
}: DigitalCraftsmanArticlePageProps) {
    return (
        <DigitalCraftsmanArticleShell>
            <DcResponsiveArticleLayout meta={meta}>{children}</DcResponsiveArticleLayout>
        </DigitalCraftsmanArticleShell>
    );
}
