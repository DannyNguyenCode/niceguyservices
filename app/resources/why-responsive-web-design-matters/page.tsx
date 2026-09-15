import ResponsiveWebDesignMobile from "@/components/resources/digital-craftsman/ResponsiveWebDesignArticleContent";
import { responsiveWebDesignMeta } from "@/components/resources/digital-craftsman/articles/metas";
import { createArticleRoute } from "@/components/resources/digital-craftsman/createArticleRoute";

const { metadata, Page } = createArticleRoute({
    meta: responsiveWebDesignMeta,
    content: <ResponsiveWebDesignMobile meta={responsiveWebDesignMeta} />,
});

export { metadata };
export default Page;
