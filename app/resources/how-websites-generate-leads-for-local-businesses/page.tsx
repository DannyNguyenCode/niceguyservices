import WebsiteLeadsMobile from "@/components/resources/digital-craftsman/WebsiteLeadsArticleContent";
import { websiteLeadsMeta } from "@/components/resources/digital-craftsman/articles/metas";
import { createArticleRoute } from "@/components/resources/digital-craftsman/createArticleRoute";

const { metadata, Page } = createArticleRoute({
    meta: websiteLeadsMeta,
    content: <WebsiteLeadsMobile meta={websiteLeadsMeta} />,
});

export { metadata };
export default Page;
