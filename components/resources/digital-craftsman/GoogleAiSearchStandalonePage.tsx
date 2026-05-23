import DigitalCraftsmanArticlePage from "./DigitalCraftsmanArticlePage";
import GoogleAiSearchMobile from "./GoogleAiSearchArticleContent";
import GoogleAiSearchDesktop, {
    GoogleAiSearchDesktopFooter,
} from "./GoogleAiSearchDesktopLayout";
import { googleAiSearchMeta } from "./articles/metas";

export default function GoogleAiSearchStandalonePage() {
    return (
        <DigitalCraftsmanArticlePage
            meta={googleAiSearchMeta}
            mobile={<GoogleAiSearchMobile meta={googleAiSearchMeta} />}
            desktop={<GoogleAiSearchDesktop meta={googleAiSearchMeta} />}
            desktopFooter={<GoogleAiSearchDesktopFooter />}
        />
    );
}
