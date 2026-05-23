import DigitalCraftsmanArticlePage from "./DigitalCraftsmanArticlePage";
import {
    SearchConsoleDesktop,
    SearchConsoleDesktopFooter,
    SearchConsoleMobile,
} from "./articles/search-console";
import { searchConsoleMeta } from "./articles/metas";

export default function SearchConsoleStandalonePage() {
    return (
        <DigitalCraftsmanArticlePage
            meta={searchConsoleMeta}
            mobile={<SearchConsoleMobile meta={searchConsoleMeta} />}
            desktop={<SearchConsoleDesktop meta={searchConsoleMeta} />}
            desktopFooter={<SearchConsoleDesktopFooter />}
        />
    );
}
