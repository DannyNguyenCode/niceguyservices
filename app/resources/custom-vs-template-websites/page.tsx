import CustomVsTemplateMobile from "@/components/resources/digital-craftsman/CustomVsTemplateArticleContent";
import CustomVsTemplateDesktop, {
    CustomVsTemplateDesktopFooter,
} from "@/components/resources/digital-craftsman/CustomVsTemplateDesktopLayout";
import { customVsTemplateMeta } from "@/components/resources/digital-craftsman/articles/metas";
import { createArticleRoute } from "@/components/resources/digital-craftsman/createArticleRoute";

const { metadata, Page } = createArticleRoute({
    meta: customVsTemplateMeta,
    mobile: <CustomVsTemplateMobile meta={customVsTemplateMeta} />,
    desktop: <CustomVsTemplateDesktop meta={customVsTemplateMeta} />,
    desktopFooter: <CustomVsTemplateDesktopFooter />,
});

export { metadata };
export default Page;
