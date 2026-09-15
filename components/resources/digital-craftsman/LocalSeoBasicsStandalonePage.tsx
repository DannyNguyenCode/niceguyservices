import DigitalCraftsmanArticlePage from "./DigitalCraftsmanArticlePage";
import LocalSeoBasicsMobile from "./LocalSeoBasicsArticleContent";
import { seoBasicsMeta } from "./articles/metas";

export default function LocalSeoBasicsStandalonePage() {
    return (
        <DigitalCraftsmanArticlePage meta={seoBasicsMeta}>
            <LocalSeoBasicsMobile meta={seoBasicsMeta} />
        </DigitalCraftsmanArticlePage>
    );
}
