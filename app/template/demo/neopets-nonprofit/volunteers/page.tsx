import type { Metadata } from "next";
import { NeopetsVolunteersBody } from "@/components/experience-templates/neopets-nonprofit/NeopetsVolunteersBody";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Volunteers & Donations — Toronto Adopt-A-Pet (demo)",
  alternates: {
    canonical: absoluteUrl("/template/demo/neopets-nonprofit/volunteers"),
  },
};

export default function NeopetsVolunteersPage() {
  return <NeopetsVolunteersBody />;
}
