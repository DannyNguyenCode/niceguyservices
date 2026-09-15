import DigitalCraftsmanArticlePage from "./DigitalCraftsmanArticlePage";
import GoogleAiSearchMobile from "./GoogleAiSearchArticleContent";
import { googleAiSearchMeta } from "./articles/metas";

export default function GoogleAiSearchStandalonePage() {
    return (
        <DigitalCraftsmanArticlePage meta={googleAiSearchMeta}>
            <GoogleAiSearchMobile meta={googleAiSearchMeta} />
        </DigitalCraftsmanArticlePage>
    );
}
