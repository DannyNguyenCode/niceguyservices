import { notFound } from "next/navigation";

/** Unknown paths under this demo use the themed not-found page. */
export default function ValleyInterlockingCatchAll() {
  notFound();
}
