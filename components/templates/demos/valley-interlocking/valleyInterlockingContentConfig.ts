/**
 * Active Valley Interlocking content pack (JSON filename).
 *
 * To use a different copy pack:
 * 1. Add your JSON file beside the others in this folder.
 * 2. Register it in `valleyInterlockingContentRegistry.ts`.
 * 3. Set the filename here (or set NEXT_PUBLIC_VI_CONTENT_JSON / VI_CONTENT_JSON).
 */
export const VI_ACTIVE_CONTENT_JSON = "valley-interlocking-site-content.json" as const;

export type ViContentJsonFilename = typeof VI_ACTIVE_CONTENT_JSON | (string & {});
