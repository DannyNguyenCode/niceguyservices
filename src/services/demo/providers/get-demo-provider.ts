import type { DemoGenerationProvider } from "@/src/services/demo/providers/types";
import { LocalCodeGenerationProvider } from "@/src/services/demo/providers/local-demo-generation-provider";
import { getDemoGenerationProviderName } from "@/src/services/demo/env";

export class CursorCloudAgentProvider implements DemoGenerationProvider {
    name = "cursor-cloud-agent";

    async generateDemo(): Promise<never> {
        throw new Error("DEMO_PROVIDER_NOT_CONFIGURED");
    }
}

export function getDemoGenerationProvider(): DemoGenerationProvider {
    const providerName = getDemoGenerationProviderName();
    if (providerName === "cursor-cloud-agent") {
        return new CursorCloudAgentProvider();
    }
    return new LocalCodeGenerationProvider();
}
