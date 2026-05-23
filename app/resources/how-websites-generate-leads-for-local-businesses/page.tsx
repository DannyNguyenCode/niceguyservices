import WebsiteLeadsMobile from "@/components/resources/digital-craftsman/WebsiteLeadsArticleContent";
import WebsiteLeadsDesktop, {
    WebsiteLeadsDesktopFooter,
} from "@/components/resources/digital-craftsman/WebsiteLeadsDesktopLayout";
import { websiteLeadsMeta } from "@/components/resources/digital-craftsman/articles/metas";
import { createArticleRoute } from "@/components/resources/digital-craftsman/createArticleRoute";

const { metadata, Page } = createArticleRoute({
    meta: websiteLeadsMeta,
    mobile: <WebsiteLeadsMobile meta={websiteLeadsMeta} />,
    desktop: <WebsiteLeadsDesktop meta={websiteLeadsMeta} />,
    desktopFooter: <WebsiteLeadsDesktopFooter />,
});

export { metadata };
export default Page;
