import { parseLooneyTunesProductsQuery } from "./parse-query";
import type { LooneyTunesProductSearchQuery } from "@/lib/templates/db/looney-tunes";

export function buildLooneyTunesProductsQueryFromUrl(url: string): LooneyTunesProductSearchQuery {
  const { searchParams } = new URL(url);
  return parseLooneyTunesProductsQuery(searchParams);
}
