import "server-only";

import mongoose from "mongoose";
import { connectToDatabase } from "@/src/lib/mongodb";
import { ActivityLog } from "@/src/models/ActivityLog";

function assertObjectId(id: string): mongoose.Types.ObjectId | null {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return new mongoose.Types.ObjectId(id);
}

/**
 * True when an automatic audit-complete PDF email was already logged for this report.
 */
export async function hasAutoAuditPdfReadyEmailBeenSent(input: {
    websiteId: string;
    publicReportId: string;
}): Promise<boolean> {
    await connectToDatabase();
    const websiteObjectId = assertObjectId(input.websiteId);
    if (!websiteObjectId) return false;

    const existing = await ActivityLog.findOne({
        websiteId: websiteObjectId,
        type: "email-sent",
        "metadata.trigger": "auto_audit_complete",
        "metadata.publicReportId": input.publicReportId,
    })
        .select({ _id: 1 })
        .lean();

    return Boolean(existing);
}
