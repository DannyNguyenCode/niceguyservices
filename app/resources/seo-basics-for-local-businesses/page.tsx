import LocalSeoBasicsMobile from "@/components/resources/digital-craftsman/LocalSeoBasicsArticleContent";
import { seoBasicsMeta } from "@/components/resources/digital-craftsman/articles/metas";
import { createArticleRoute } from "@/components/resources/digital-craftsman/createArticleRoute";

const { metadata, Page } = createArticleRoute({
    meta: seoBasicsMeta,
    content: <LocalSeoBasicsMobile meta={seoBasicsMeta} />,
});

export { metadata };
export default Page;
