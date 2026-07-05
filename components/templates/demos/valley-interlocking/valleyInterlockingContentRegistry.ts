import placeholderContent from "./valley-interlocking-site-content.json";
import { VI_ACTIVE_CONTENT_JSON, type ViContentJsonFilename } from "./valleyInterlockingContentConfig";

/** Register every JSON pack here. The bundler only includes files listed in this map. */
export const VI_CONTENT_REGISTRY = {
  "valley-interlocking-site-content.json": placeholderContent,
} as const satisfies Record<string, typeof placeholderContent>;

export type ViRegisteredContentJson = keyof typeof VI_CONTENT_REGISTRY;

function resolveContentFilename(): ViContentJsonFilename {
  const fromEnv =
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_VI_CONTENT_JSON?.trim()) ||
    (typeof process !== "undefined" && process.env.VI_CONTENT_JSON?.trim()) ||
    "";

  return (fromEnv || VI_ACTIVE_CONTENT_JSON) as ViContentJsonFilename;
}

export function loadViSiteContentDocument() {
  const filename = resolveContentFilename();
  const document = VI_CONTENT_REGISTRY[filename as ViRegisteredContentJson];

  if (!document) {
    const registered = Object.keys(VI_CONTENT_REGISTRY).join(", ");
    throw new Error(
      `Valley Interlocking content JSON "${filename}" is not registered. Registered files: ${registered}`,
    );
  }

  return { filename, document };
}

export function listViRegisteredContentJsonFiles(): ViRegisteredContentJson[] {
  return Object.keys(VI_CONTENT_REGISTRY) as ViRegisteredContentJson[];
}
