import { HeroSection } from "./HeroSection";
import { ServicePanelsSection } from "./ServicePanelsSection";
import { HiddenCraftSection } from "./HiddenCraftSection";
import { FeaturedProjectSection } from "./FeaturedProjectSection";
import { CircuitProcessSection } from "./CircuitProcessSection";
import { TrustReviewsSection } from "./TrustReviewsSection";
import { ResourcesSection } from "./ResourcesSection";
import { FaqSection } from "./FaqSection";
import { FinalCTASection } from "./FinalCTASection";

export function LeaveASparkHomeBody() {
  return (
    <main id="las-main-content">
      <HeroSection />
      <ServicePanelsSection />
      <HiddenCraftSection />
      <FeaturedProjectSection />
      <CircuitProcessSection />
      <TrustReviewsSection />
      <ResourcesSection />
      <FaqSection />
      <FinalCTASection />
    </main>
  );
}
