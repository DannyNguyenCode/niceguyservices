import { VI_PATHS } from "./valleyInterlockingConfig";
import {
  VI_FEATURED_RESOURCE,
  VI_RESOURCE_ARTICLES,
  VI_RESOURCE_CATEGORIES,
} from "./valleyInterlockingSiteContent";

export { VI_RESOURCE_CATEGORIES, VI_FEATURED_RESOURCE, VI_RESOURCE_ARTICLES };

export type ViResourceCategory = (typeof VI_RESOURCE_CATEGORIES)[number];

export type ViResourceArticle = (typeof VI_RESOURCE_ARTICLES)[number];

export function viResourceArticlePath(slug: string): string {
  return `${VI_PATHS.resources}/${slug}`;
}
