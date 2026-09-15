import DigitalCraftsmanArticlePage from "./DigitalCraftsmanArticlePage";
import CustomVsTemplateMobile from "./CustomVsTemplateArticleContent";
import { customVsTemplateMeta } from "./articles/metas";

export default function CustomVsTemplateStandalonePage() {
    return (
        <DigitalCraftsmanArticlePage meta={customVsTemplateMeta}>
            <CustomVsTemplateMobile meta={customVsTemplateMeta} />
        </DigitalCraftsmanArticlePage>
    );
}
