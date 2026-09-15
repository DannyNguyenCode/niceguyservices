import {
    SearchConsoleMobile,
} from "@/components/resources/digital-craftsman/articles/search-console";
import { searchConsoleMeta } from "@/components/resources/digital-craftsman/articles/metas";
import { createArticleRoute } from "@/components/resources/digital-craftsman/createArticleRoute";

const { metadata, Page } = createArticleRoute({
    meta: searchConsoleMeta,
    content: <SearchConsoleMobile meta={searchConsoleMeta} />,
});

export { metadata };
export default Page;
