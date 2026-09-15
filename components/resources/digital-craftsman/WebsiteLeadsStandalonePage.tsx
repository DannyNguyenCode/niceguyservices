import DigitalCraftsmanArticlePage from "./DigitalCraftsmanArticlePage";
import WebsiteLeadsMobile from "./WebsiteLeadsArticleContent";
import { websiteLeadsMeta } from "./articles/metas";

export default function WebsiteLeadsStandalonePage() {
    return (
        <DigitalCraftsmanArticlePage meta={websiteLeadsMeta}>
            <WebsiteLeadsMobile meta={websiteLeadsMeta} />
        </DigitalCraftsmanArticlePage>
    );
}
