import DigitalCraftsmanArticlePage from "./DigitalCraftsmanArticlePage";
import LocalSeoBasicsMobile from "./LocalSeoBasicsArticleContent";
import LocalSeoBasicsDesktop, {
    LocalSeoBasicsDesktopFooter,
} from "./LocalSeoBasicsDesktopLayout";
import { seoBasicsMeta } from "./articles/metas";

export default function LocalSeoBasicsStandalonePage() {
    return (
        <DigitalCraftsmanArticlePage
            meta={seoBasicsMeta}
            mobile={<LocalSeoBasicsMobile meta={seoBasicsMeta} />}
            desktop={<LocalSeoBasicsDesktop meta={seoBasicsMeta} />}
            desktopFooter={<LocalSeoBasicsDesktopFooter />}
        />
    );
}
