import CustomVsTemplateMobile from "@/components/resources/digital-craftsman/CustomVsTemplateArticleContent";
import { customVsTemplateMeta } from "@/components/resources/digital-craftsman/articles/metas";
import { createArticleRoute } from "@/components/resources/digital-craftsman/createArticleRoute";

const { metadata, Page } = createArticleRoute({
    meta: customVsTemplateMeta,
    content: <CustomVsTemplateMobile meta={customVsTemplateMeta} />,
});

export { metadata };
export default Page;
