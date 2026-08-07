import { Schema } from "mongoose";

export const WEBSITE_MODEL_NAME = "Website";

/**
 * Foreign key to `website_collection` (`Website` model).
 * Pair with `indexWebsiteForeignKey()` on the schema.
 */
export const websiteForeignKey = {
    type: Schema.Types.ObjectId,
    required: true,
    ref: WEBSITE_MODEL_NAME,
};

/** Standard index on websiteId for lookups by website. */
export function indexWebsiteForeignKey(schema: Schema): void {
    schema.index({ websiteId: 1 });
}

/** Unique index — one document per website (1:1 child collections). */
export function indexWebsiteForeignKeyUnique(schema: Schema): void {
    schema.index({ websiteId: 1 }, { unique: true });
}

/** Activity log index — many entries per website, newest first. */
export function indexWebsiteForeignKeyActivityLog(schema: Schema): void {
    schema.index({ websiteId: 1, createdAt: -1 });
}
