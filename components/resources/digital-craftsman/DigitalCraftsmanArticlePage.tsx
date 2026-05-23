import type { ReactNode } from "react";
import DigitalCraftsmanArticleShell from "./DigitalCraftsmanArticleShell";
import type { DcArticleMeta } from "./types";
import { DcDesktopArticleLayout } from "./article-ui/DcDesktopArticleLayout";
import { DcMobileArticleShell } from "./article-ui/DcMobileArticleShell";

export type DigitalCraftsmanArticlePageProps = {
    meta: DcArticleMeta;
    mobile: ReactNode;
    desktop: ReactNode;
    desktopFooter?: ReactNode;
};

/**
 * Standard layout for all Digital Craftsman resource articles.
 * Wraps mobile (card) and desktop (3-column) views in the shared shell.
 */
export default function DigitalCraftsmanArticlePage({
    meta,
    mobile,
    desktop,
    desktopFooter,
}: DigitalCraftsmanArticlePageProps) {
    return (
        <DigitalCraftsmanArticleShell>
            <DcMobileArticleShell>{mobile}</DcMobileArticleShell>
            <DcDesktopArticleLayout meta={meta} footer={desktopFooter}>
                {desktop}
            </DcDesktopArticleLayout>
        </DigitalCraftsmanArticleShell>
    );
}
