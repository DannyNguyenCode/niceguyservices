import DigitalCraftsmanArticlePage from "./DigitalCraftsmanArticlePage";
import CustomVsTemplateMobile from "./CustomVsTemplateArticleContent";
import CustomVsTemplateDesktop, {
    CustomVsTemplateDesktopFooter,
} from "./CustomVsTemplateDesktopLayout";
import { customVsTemplateMeta } from "./articles/metas";

export default function CustomVsTemplateStandalonePage() {
    return (
        <DigitalCraftsmanArticlePage
            meta={customVsTemplateMeta}
            mobile={<CustomVsTemplateMobile meta={customVsTemplateMeta} />}
            desktop={<CustomVsTemplateDesktop meta={customVsTemplateMeta} />}
            desktopFooter={<CustomVsTemplateDesktopFooter />}
        />
    );
}
