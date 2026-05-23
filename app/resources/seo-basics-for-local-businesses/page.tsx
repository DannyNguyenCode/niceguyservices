import LocalSeoBasicsDesktop, {
    LocalSeoBasicsDesktopFooter,
} from "@/components/resources/digital-craftsman/LocalSeoBasicsDesktopLayout";
import LocalSeoBasicsMobile from "@/components/resources/digital-craftsman/LocalSeoBasicsArticleContent";
import { seoBasicsMeta } from "@/components/resources/digital-craftsman/articles/metas";
import { createArticleRoute } from "@/components/resources/digital-craftsman/createArticleRoute";

const { metadata, Page } = createArticleRoute({
    meta: seoBasicsMeta,
    mobile: <LocalSeoBasicsMobile meta={seoBasicsMeta} />,
    desktop: <LocalSeoBasicsDesktop meta={seoBasicsMeta} />,
    desktopFooter: <LocalSeoBasicsDesktopFooter />,
});

export { metadata };
export default Page;
