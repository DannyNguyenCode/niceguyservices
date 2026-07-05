"use client";

import { HouseIllustration } from "./house-illustration";
import { serviceSlugToSystemId } from "./systems";

export function ServiceHeroIllustration({ slug }: { slug: string }) {
  const active = serviceSlugToSystemId(slug);

  return <HouseIllustration active={active} interactive={false} emphasizeDistribution={slug === "maintenance-plans"} />;
}
