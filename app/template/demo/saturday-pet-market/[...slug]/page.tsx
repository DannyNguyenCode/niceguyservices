import { notFound } from "next/navigation";

/** Unknown paths under this demo (e.g. /register) use the themed not-found page. */
export default function SaturdayPetMarketCatchAll() {
  notFound();
}
