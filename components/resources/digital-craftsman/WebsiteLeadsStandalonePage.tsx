import DigitalCraftsmanArticlePage from "./DigitalCraftsmanArticlePage";
import WebsiteLeadsMobile from "./WebsiteLeadsArticleContent";
import WebsiteLeadsDesktop, {
    WebsiteLeadsDesktopFooter,
} from "./WebsiteLeadsDesktopLayout";
import { websiteLeadsMeta } from "./articles/metas";

export default function WebsiteLeadsStandalonePage() {
    return (
        <DigitalCraftsmanArticlePage
            meta={websiteLeadsMeta}
            mobile={<WebsiteLeadsMobile meta={websiteLeadsMeta} />}
            desktop={<WebsiteLeadsDesktop meta={websiteLeadsMeta} />}
            desktopFooter={<WebsiteLeadsDesktopFooter />}
        />
    );
}
