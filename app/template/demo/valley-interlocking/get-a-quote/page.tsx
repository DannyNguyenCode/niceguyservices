import { redirect } from "next/navigation";
import { VI_PATHS } from "@/components/templates/demos/valley-interlocking/valleyInterlockingConfig";

// Quote page disabled — original implementation preserved below.
// import type { Metadata } from "next";
// import { ValleyInterlockingQuoteBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingQuoteBody";
//
// export const metadata: Metadata = {
//   title: "Get A Quote | Valley Interlocking & Landscaping (demo)",
//   description: "Request a personalized quote for your premium landscaping and interlocking project.",
// };
//
// export default function ValleyInterlockingQuotePage() {
//   return <ValleyInterlockingQuoteBody />;
// }

/** Forwards legacy /get-a-quote visits to the contact page. */
export default function ValleyInterlockingQuotePage() {
  redirect(VI_PATHS.contact);
}
