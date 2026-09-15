import DigitalCraftsmanArticlePage from "./DigitalCraftsmanArticlePage";
import { SearchConsoleMobile } from "./articles/search-console";
import { searchConsoleMeta } from "./articles/metas";

export default function SearchConsoleStandalonePage() {
    return (
        <DigitalCraftsmanArticlePage meta={searchConsoleMeta}>
            <SearchConsoleMobile meta={searchConsoleMeta} />
        </DigitalCraftsmanArticlePage>
    );
}
