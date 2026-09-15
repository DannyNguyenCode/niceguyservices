import GoogleAiSearchMobile from "@/components/resources/digital-craftsman/GoogleAiSearchArticleContent";
import { googleAiSearchMeta } from "@/components/resources/digital-craftsman/articles/metas";
import { createArticleRoute } from "@/components/resources/digital-craftsman/createArticleRoute";

const { metadata, Page } = createArticleRoute({
    meta: googleAiSearchMeta,
    content: <GoogleAiSearchMobile meta={googleAiSearchMeta} />,
});

export { metadata };
export default Page;
