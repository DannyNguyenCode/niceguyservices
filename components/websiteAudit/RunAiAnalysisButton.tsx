"use client";



import { useRouter } from "next/navigation";

import { useState, useTransition } from "react";

import { runAiAnalysisAction } from "@/src/actions/ai";

import { ACTIVE_CURSOR_ANALYSIS_STATUSES } from "@/src/services/cursor-analysis/constants";

import type { AnalysisReadiness } from "@/src/services/cursor-analysis/readiness";

import type { SerializableAuditRunAnalysis } from "@/src/services/cursor-analysis/types";



type RunAiAnalysisButtonProps = {

    websiteId: string;

    auditRunId?: string | null;

    canRun?: boolean;

    cursorAnalysisConfigured?: boolean;

    cursorAnalysis?: SerializableAuditRunAnalysis | null;

    cursorReadiness?: AnalysisReadiness;

};



export default function RunAiAnalysisButton({

    websiteId,

    auditRunId,

    canRun = true,

    cursorAnalysisConfigured = false,

    cursorAnalysis,

    cursorReadiness,

}: RunAiAnalysisButtonProps) {

    const router = useRouter();

    const [message, setMessage] = useState<string | null>(null);

    const [isSuccess, setIsSuccess] = useState(false);

    const [isPending, startTransition] = useTransition();



    const cursorActive = Boolean(

        cursorAnalysis && ACTIVE_CURSOR_ANALYSIS_STATUSES.includes(cursorAnalysis.status),

    );

    const cursorReady = Boolean(cursorReadiness?.ready && auditRunId);

    const canRetry =

        cursorAnalysis?.status === "failed" || cursorAnalysis?.status === "retry_pending";



    const isProcessing = isPending || cursorActive;



    const hasResults =

        cursorAnalysis?.status === "completed" || cursorAnalysis?.status === "failed";



    const label = isProcessing

        ? "Triggering analysis..."

        : hasResults

          ? canRetry

              ? "Retry analysis"

              : "Regenerate analysis"

          : "Generate analysis";



    const isDisabled = isProcessing || !canRun || !auditRunId || !cursorReady;



    function handleClick() {

        setMessage(null);

        setIsSuccess(false);



        startTransition(async () => {

            const result = await runAiAnalysisAction(websiteId, auditRunId);

            setIsSuccess(result.ok);

            setMessage(

                result.message ??

                    (result.ok ? "Analysis triggered." : "Analysis failed."),

            );

            if (result.ok) {

                router.refresh();

            }

        });

    }



    return (

        <div className="flex flex-col gap-3">

            <button

                type="button"

                className="btn btn-primary btn-sm"

                onClick={handleClick}

                disabled={isDisabled}

            >

                {label}

            </button>

            {cursorAnalysis?.attempt ? (

                <p className="text-xs text-base-content/60">Attempt {cursorAnalysis.attempt}</p>

            ) : null}

            {cursorReadiness && !cursorReadiness.ready ? (

                <div className="text-sm text-base-content/70">

                    <p>Missing inputs for analysis:</p>

                    <ul className="mt-2 list-disc pl-5">

                        {cursorReadiness.blockers.map((item) => (

                            <li key={item.code}>{item.message}</li>

                        ))}

                    </ul>

                </div>

            ) : null}

            {!cursorAnalysisConfigured ? (

                <p className="text-sm text-base-content/70">

                    Cursor analysis environment variables are not fully configured on this

                    deployment.

                </p>

            ) : null}

            {message ? (

                <p

                    className={`text-sm ${isSuccess ? "text-success" : "text-error"}`}

                    role="status"

                >

                    {message}

                </p>

            ) : null}

        </div>

    );

}

