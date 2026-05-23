import GoogleAiSearchMobile from "@/components/resources/digital-craftsman/GoogleAiSearchArticleContent";
import GoogleAiSearchDesktop, {
    GoogleAiSearchDesktopFooter,
} from "@/components/resources/digital-craftsman/GoogleAiSearchDesktopLayout";
import { googleAiSearchMeta } from "@/components/resources/digital-craftsman/articles/metas";
import { createArticleRoute } from "@/components/resources/digital-craftsman/createArticleRoute";

const { metadata, Page } = createArticleRoute({
    meta: googleAiSearchMeta,
    mobile: <GoogleAiSearchMobile meta={googleAiSearchMeta} />,
    desktop: <GoogleAiSearchDesktop meta={googleAiSearchMeta} />,
    desktopFooter: <GoogleAiSearchDesktopFooter />,
});

export { metadata };
export default Page;
