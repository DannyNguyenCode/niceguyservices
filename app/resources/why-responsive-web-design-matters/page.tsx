import ResponsiveWebDesignDesktop, {
    ResponsiveWebDesignDesktopFooter,
} from "@/components/resources/digital-craftsman/ResponsiveWebDesignDesktopLayout";
import ResponsiveWebDesignMobile from "@/components/resources/digital-craftsman/ResponsiveWebDesignArticleContent";
import { responsiveWebDesignMeta } from "@/components/resources/digital-craftsman/articles/metas";
import { createArticleRoute } from "@/components/resources/digital-craftsman/createArticleRoute";

const { metadata, Page } = createArticleRoute({
    meta: responsiveWebDesignMeta,
    mobile: <ResponsiveWebDesignMobile meta={responsiveWebDesignMeta} />,
    desktop: <ResponsiveWebDesignDesktop meta={responsiveWebDesignMeta} />,
    desktopFooter: <ResponsiveWebDesignDesktopFooter />,
});

export { metadata };
export default Page;
