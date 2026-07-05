import GeoArticleContent from "@/components/resources/digital-craftsman/GeoArticleContent";
import GeoDesktopLayout, {
    GeoDesktopFooter,
} from "@/components/resources/digital-craftsman/GeoDesktopLayout";
import { geoMeta } from "@/components/resources/digital-craftsman/articles/metas";
import {
    createArticleMetadata,
} from "@/components/resources/digital-craftsman/createArticleRoute";
import DigitalCraftsmanArticlePage from "@/components/resources/digital-craftsman/DigitalCraftsmanArticlePage";
import { GEO_FAQ_SCHEMA } from "@/components/resources/digital-craftsman/geoConfig";
import ArticleJsonLd, { articleJsonLdFromMeta } from "@/components/seo/ArticleJsonLd";
import ResourceArticleSupplementalJsonLd from "@/components/seo/ResourceArticleSupplementalJsonLd";

export const metadata = createArticleMetadata(geoMeta);

export default function UnderstandingGeoPage() {
    return (
        <>
            <ArticleJsonLd {...articleJsonLdFromMeta(geoMeta)} />
            <ResourceArticleSupplementalJsonLd
                pagePath={geoMeta.path}
                headline={geoMeta.headline}
                faq={GEO_FAQ_SCHEMA}
            />
            <DigitalCraftsmanArticlePage
                meta={geoMeta}
                mobile={<GeoArticleContent meta={geoMeta} />}
                desktop={<GeoDesktopLayout meta={geoMeta} />}
                desktopFooter={<GeoDesktopFooter />}
            />
        </>
    );
}
