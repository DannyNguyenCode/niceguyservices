import { redirect } from "next/navigation";
import { VI_PATHS } from "@/components/templates/demos/valley-interlocking/valleyInterlockingConfig";

export default function LegacyLawnCareServicesRedirect() {
  redirect(VI_PATHS.lawnCare);
}
