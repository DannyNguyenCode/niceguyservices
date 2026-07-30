import { NextResponse } from "next/server";
import { createActivityLog } from "@/src/data/activity-logs";
import { getDemoProjectById, updateDemoProject } from "@/src/data/demo-projects";
import { getDemoGenerationsForProject } from "@/src/data/demo-generations";
import { getDemoAssetsForProject } from "@/src/data/demo-assets";
import { getDemoReadiness } from "@/src/services/demo/load-demo-readiness";
import { getPublicReportById } from "@/src/data/public-reports";
import { buildDemoSpec } from "@/src/services/demo/build-demo-spec";
import { getWebsiteById } from "@/src/data/websites";
import { updateDemoProjectSchema } from "@/src/services/demo/schemas";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ demoProjectId: string }> };

export async function GET(_request: Request, context: RouteContext) {
    const { demoProjectId } = await context.params;
    const project = await getDemoProjectById(demoProjectId);
    if (!project) {
        return NextResponse.json(
            { success: false, error: { code: "DEMO_NOT_FOUND", message: "Demo project not found." } },
            { status: 404 },
        );
    }

    const [generations, assets, report, website] = await Promise.all([
        getDemoGenerationsForProject(project.id),
        getDemoAssetsForProject(project.id),
        getPublicReportById(project.publicReportId),
        getWebsiteById(project.websiteId),
    ]);

    const readiness = report
        ? await getDemoReadiness({
              publicReportId: report.id,
              websiteActive: Boolean(website && !website.deletedAt),
              demoProjectId: project.id,
              selectedPages: project.configuration.pages,
              contentPolicySelected: Boolean(project.contentPolicy.mode),
          })
        : null;

    const specification = report
        ? buildDemoSpec({
              project,
              report,
              assets,
              businessFacts: { email: website?.businessEmail ?? null },
          })
        : null;

    return NextResponse.json({
        success: true,
        project,
        generations,
        assets,
        readiness,
        specification,
    });
}

export async function PATCH(request: Request, context: RouteContext) {
    const { demoProjectId } = await context.params;

    let body: Record<string, unknown> = {};
    try {
        body = (await request.json()) as Record<string, unknown>;
    } catch {
        body = {};
    }

    const parsed = updateDemoProjectSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            {
                success: false,
                error: { code: "DEMO_SCHEMA_VALIDATION_FAILED", message: "Invalid update payload." },
            },
            { status: 400 },
        );
    }

    const existing = await getDemoProjectById(demoProjectId);
    if (!existing) {
        return NextResponse.json(
            { success: false, error: { code: "DEMO_NOT_FOUND", message: "Demo project not found." } },
            { status: 404 },
        );
    }

    const updated = await updateDemoProject(demoProjectId, {
        ...parsed.data,
        editedHeroConcept: parsed.data.editedHeroConcept
            ? {
                  ...parsed.data.editedHeroConcept,
                  secondaryCta: parsed.data.editedHeroConcept.secondaryCta ?? null,
              }
            : parsed.data.editedHeroConcept,
    });
    if (!updated) {
        return NextResponse.json(
            { success: false, error: { code: "DEMO_SAVE_FAILED", message: "Unable to update demo project." } },
            { status: 500 },
        );
    }

    await createActivityLog({
        websiteId: updated.websiteId,
        type: "demo-project-updated",
        description: "Demo project specification updated.",
        metadata: { demoProjectId: updated.id },
    });

    return NextResponse.json({ success: true, project: updated });
}
