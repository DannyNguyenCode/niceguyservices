import { z } from "zod";

/** MongoDB ObjectId as string (serialized from Mongoose). */
export const objectIdSchema = z.string().min(1);

/** Foreign key to `website_collection`. */
export const websiteIdSchema = objectIdSchema;

export const nullableDateSchema = z.date().nullable();

export const scoreSchema = z.number().min(0).max(100);

export const nonNegativeIntSchema = z.number().int().min(0);

export const nonNegativeNumberSchema = z.number().min(0);
