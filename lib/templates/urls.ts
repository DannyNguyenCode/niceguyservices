/**
 * Canonical URLs for template routes. Re-exports site config in this monorepo;
 * when exporting `templates/` to a new Next project, replace with a local getSiteUrl.
 */
export { absoluteUrl, getSiteUrl } from "@/lib/siteConfig";
