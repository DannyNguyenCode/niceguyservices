import mongoose from "mongoose";
import { InvalidObjectIdError } from "@/src/lib/errors/audit-platform-error";

export function assertObjectId(value: string, label: string): void {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new InvalidObjectIdError(label);
    }
}

export function isValidObjectId(value: string): boolean {
    return mongoose.Types.ObjectId.isValid(value);
}
