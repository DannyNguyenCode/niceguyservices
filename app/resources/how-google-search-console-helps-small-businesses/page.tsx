import {
    SearchConsoleDesktop,
    SearchConsoleDesktopFooter,
    SearchConsoleMobile,
} from "@/components/resources/digital-craftsman/articles/search-console";
import { searchConsoleMeta } from "@/components/resources/digital-craftsman/articles/metas";
import { createArticleRoute } from "@/components/resources/digital-craftsman/createArticleRoute";

const { metadata, Page } = createArticleRoute({
    meta: searchConsoleMeta,
    mobile: <SearchConsoleMobile meta={searchConsoleMeta} />,
    desktop: <SearchConsoleDesktop meta={searchConsoleMeta} />,
    desktopFooter: <SearchConsoleDesktopFooter />,
});

export { metadata };
export default Page;
