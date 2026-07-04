/** Server component — hints the browser to fetch the route LCP hero early. */
export function ViHeroPreload({ src }: { src: string }) {
  if (!src) return null;
  return <link rel="preload" as="image" href={src} fetchPriority="high" />;
}
