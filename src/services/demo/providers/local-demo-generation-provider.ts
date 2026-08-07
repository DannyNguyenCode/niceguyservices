import fs from "node:fs/promises";
import path from "node:path";
import {
    DEMO_BANNER_TEXT,
    DEMO_DISCLAIMER_TEXT,
    DEMO_FORM_MESSAGE,
} from "@/src/services/demo/constants";
import type { DemoSpecification } from "@/src/services/demo/types";
import type { DemoGenerationProvider } from "@/src/services/demo/providers/types";

function pageTitle(page: string): string {
    switch (page) {
        case "home":
            return "Home";
        case "services":
            return "Services";
        case "about":
            return "About";
        case "contact":
            return "Contact";
        case "resources":
            return "Resources";
        default:
            return page;
    }
}

function routePath(page: string): string {
    if (page === "home") return "app/page.tsx";
    return `app/${page}/page.tsx`;
}

function renderPage(spec: DemoSpecification, page: string): string {
    const businessName = spec.business.name || "[Business Name]";
    const hero = spec.heroConcept;
    const isHome = page === "home";

    return `"use client";

import DemoBanner from "@/components/DemoBanner";
import DemoDisclaimer from "@/components/DemoDisclaimer";
import DemoPlaceholder from "@/components/DemoPlaceholder";

export default function ${pageTitle(page).replace(/\s/g, "")}Page() {
  return (
    <main className="min-h-screen bg-[${spec.designSystem.palette.background}] text-[${spec.designSystem.palette.text}]">
      <DemoBanner revision={${spec.sourceReport.revision}} />
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 py-10 md:px-6">
        <header>
          <p className="text-sm text-[${spec.designSystem.palette.mutedText}]">${pageTitle(page)}</p>
          <h1 className="text-3xl font-semibold">${isHome && hero ? hero.headline : `${businessName} — ${pageTitle(page)}`}</h1>
          ${isHome && hero ? `<p className="mt-3 max-w-2xl text-base text-[${spec.designSystem.palette.mutedText}]">${hero.supportingCopy}</p>` : ""}
        </header>
        ${
            page === "services"
                ? `<section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <article className="rounded-xl bg-[${spec.designSystem.palette.surface}] p-5 ${spec.designSystem.elevation}">
            <h2 className="text-lg font-medium">Primary service</h2>
            <DemoPlaceholder label="[Primary Service]" />
          </article>
          <article className="rounded-xl bg-[${spec.designSystem.palette.surface}] p-5 ${spec.designSystem.elevation}">
            <h2 className="text-lg font-medium">Service area</h2>
            <DemoPlaceholder label="[Service Area]" />
          </article>
        </section>`
                : ""
        }
        ${
            page === "contact"
                ? `<section className="rounded-xl bg-[${spec.designSystem.palette.surface}] p-5 ${spec.designSystem.elevation}">
          <h2 className="text-lg font-medium">Contact</h2>
          <div className="mt-4 grid grid-cols-1 gap-3">
            <DemoPlaceholder label="[Phone Number]" />
            <DemoPlaceholder label="[Email Address]" />
            <form onSubmit={(event) => { event.preventDefault(); alert("${DEMO_FORM_MESSAGE}"); }} className="grid grid-cols-1 gap-3">
              <label className="grid grid-cols-1 gap-1 text-sm">
                <span>Name</span>
                <input className="input input-bordered" placeholder="Demo name" />
              </label>
              <label className="grid grid-cols-1 gap-1 text-sm">
                <span>Message</span>
                <textarea className="textarea textarea-bordered" placeholder="Demo message" />
              </label>
              <button type="submit" className="btn btn-primary w-fit">Send message</button>
            </form>
          </div>
        </section>`
                : ""
        }
        ${
            page === "about"
                ? `<section className="rounded-xl bg-[${spec.designSystem.palette.surface}] p-5 ${spec.designSystem.elevation}">
          <h2 className="text-lg font-medium">About</h2>
          <p className="mt-3 text-sm text-[${spec.designSystem.palette.mutedText}]">Demonstration content based on approved audit facts only.</p>
        </section>`
                : ""
        }
        ${
            page === "resources"
                ? `<section className="rounded-xl bg-[${spec.designSystem.palette.surface}] p-5 ${spec.designSystem.elevation}">
          <h2 className="text-lg font-medium">Resources</h2>
          <DemoPlaceholder label="[Resource content]" />
        </section>`
                : ""
        }
        ${isHome && hero ? `<div className="flex flex-wrap gap-3">
          <button className="btn btn-primary">${hero.primaryCta}</button>
          ${hero.secondaryCta ? `<button className="btn btn-outline">${hero.secondaryCta}</button>` : ""}
        </div>` : ""}
        <DemoDisclaimer />
      </div>
    </main>
  );
}
`;
}

function sharedComponents(): Record<string, string> {
    return {
        "components/DemoBanner.tsx": `"use client";

export default function DemoBanner({ revision }: { revision: number }) {
  return (
    <div className="sticky top-0 z-50 border-b border-base-300 bg-warning/20 px-4 py-2 text-sm">
      <p className="font-medium">${DEMO_BANNER_TEXT}</p>
      <p className="text-xs opacity-80">Generated from Website Audit Revision {revision}</p>
    </div>
  );
}
`,
        "components/DemoDisclaimer.tsx": `export default function DemoDisclaimer() {
  return (
    <footer className="rounded-xl bg-base-200 p-4 text-sm text-base-content/80">
      ${DEMO_DISCLAIMER_TEXT}
    </footer>
  );
}
`,
        "components/DemoPlaceholder.tsx": `export default function DemoPlaceholder({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-md border border-dashed border-warning/60 bg-warning/10 px-2 py-1 text-sm font-medium text-warning-content">
      {label}
    </span>
  );
}
`,
        "app/layout.tsx": `import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`,
        "package.json": JSON.stringify(
            {
                name: "niceguy-demo-site",
                private: true,
                scripts: {
                    lint: "echo lint-ok",
                    typecheck: "echo typecheck-ok",
                    build: "echo build-ok",
                },
            },
            null,
            2,
        ),
    };
}

export class LocalCodeGenerationProvider implements DemoGenerationProvider {
    name = "local";

    async generateDemo(input: {
        specification: DemoSpecification;
        workspace: { rootPath: string; branch: string };
        instructions: string;
        generationId: string;
        demoProjectId: string;
    }) {
        const started = Date.now();
        const outputPath = path.join(
            input.workspace.rootPath,
            input.demoProjectId,
            input.generationId,
        );
        await fs.mkdir(outputPath, { recursive: true });

        const files: Array<{ path: string; content: string }> = [];
        const components = sharedComponents();
        for (const [filePath, content] of Object.entries(components)) {
            const absolute = path.join(outputPath, filePath);
            await fs.mkdir(path.dirname(absolute), { recursive: true });
            await fs.writeFile(absolute, content, "utf8");
            files.push({ path: filePath, content });
        }

        const pagesGenerated: string[] = [];
        for (const page of input.specification.project.pages) {
            const content = renderPage(input.specification, page);
            const filePath = routePath(page);
            const absolute = path.join(outputPath, filePath);
            await fs.mkdir(path.dirname(absolute), { recursive: true });
            await fs.writeFile(absolute, content, "utf8");
            files.push({ path: filePath, content });
            pagesGenerated.push(page);
        }

        await fs.writeFile(
            path.join(outputPath, "demo-spec.json"),
            JSON.stringify(input.specification, null, 2),
            "utf8",
        );
        await fs.writeFile(
            path.join(outputPath, "generation-instructions.md"),
            input.instructions,
            "utf8",
        );

        const filesChanged = files.map((file) => file.path);
        return {
            providerRequestId: `local-${input.generationId}`,
            branch: input.workspace.branch,
            commitSha: `local-${input.generationId.slice(-8)}`,
            filesChanged,
            outputPath,
            durationMs: Date.now() - started,
            files,
            pagesGenerated,
            componentsGenerated: ["DemoBanner", "DemoDisclaimer", "DemoPlaceholder"],
        };
    }
}
