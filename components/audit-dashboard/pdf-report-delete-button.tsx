"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function PdfReportDeleteButton({ pdfReportId }: { pdfReportId: string }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    return (
        <button
            type="button"
            className="btn btn-ghost btn-xs"
            disabled={isPending}
            onClick={() => {
                startTransition(async () => {
                    await fetch(`/api/admin/pdf-reports/${pdfReportId}`, { method: "DELETE" });
                    router.refresh();
                });
            }}
        >
            {isPending ? "Deleting…" : "Delete asset"}
        </button>
    );
}
