import { redirect } from "next/navigation";
import { SPM_PATHS } from "@/components/templates/demos/saturday-pet-market/saturdayPetMarketConfig";

/** Legacy `/product` URL — send shoppers to the catalog. */
export default function SaturdayPetMarketProductIndexPage() {
  redirect(SPM_PATHS.shop);
}
