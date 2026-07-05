import { redirect } from "next/navigation";
import { VI_PATHS } from "@/components/templates/demos/valley-interlocking/valleyInterlockingConfig";

export default function LegacyPergolasRedirect() {
  redirect(VI_PATHS.pergolas);
}
