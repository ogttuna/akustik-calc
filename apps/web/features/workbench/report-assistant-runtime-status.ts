import { REPORT_ASSISTANT_FINDINGS_RELATIVE_PATH } from "./report-assistant-finding";
import { getReportAssistantModelSettings, type ReportAssistantModelProvider } from "./report-assistant-model";
import { getReportAssistantPlausibilityResearchSettings } from "./report-assistant-plausibility-research";
import { REPORT_ASSISTANT_MCP_TOOL_DEFINITIONS } from "./report-assistant-tools";

export type ReportAssistantProviderRuntimeStatus = {
  apiKeyConfigured: boolean;
  configured: boolean;
  endpoint?: {
    origin: string;
    pathname: string;
  };
  model?: string;
  provider?: ReportAssistantModelProvider | "research_provider";
  proxyKeyConfigured?: boolean;
  readinessWarnings?: readonly string[];
  timeoutMs?: number;
};

export type ReportAssistantRuntimeStatus = {
  findingsQueuePath: string;
  generatedAtIso: string;
  modelProvider: ReportAssistantProviderRuntimeStatus;
  mutatingToolsExposed: false;
  researchProvider: ReportAssistantProviderRuntimeStatus;
  tools: readonly {
    description: string;
    mutates: false;
    name: string;
    requiredInputs: readonly string[];
  }[];
};

function summarizeEndpoint(endpoint: string): ReportAssistantProviderRuntimeStatus["endpoint"] {
  const url = new URL(endpoint);

  return {
    origin: url.origin,
    pathname: url.pathname
  };
}

function providerStatus(input: {
  apiKey?: string;
  endpoint?: string;
  model?: string;
  provider?: ReportAssistantModelProvider | "research_provider";
  proxyKey?: string;
  timeoutMs?: number;
} | null): ReportAssistantProviderRuntimeStatus {
  if (!input) {
    return {
      apiKeyConfigured: false,
      configured: false
    };
  }

  return {
    apiKeyConfigured: Boolean(input.apiKey),
    configured: true,
    endpoint: input.endpoint ? summarizeEndpoint(input.endpoint) : undefined,
    model: input.model,
    provider: input.provider,
    proxyKeyConfigured: Boolean(input.proxyKey),
    readinessWarnings: readinessWarnings(input),
    timeoutMs: input.timeoutMs
  };
}

function readinessWarnings(input: {
  endpoint?: string;
  provider?: ReportAssistantModelProvider | "research_provider";
}): string[] {
  if (input.provider !== "system_llm_gemini_proxy" || !input.endpoint) {
    return [];
  }

  const endpoint = new URL(input.endpoint);
  const warnings: string[] = [];
  if (!endpoint.pathname.endsWith("/gemini-proxy")) {
    warnings.push("system_llm_gemini_proxy endpoint should end with /gemini-proxy.");
  }

  return warnings;
}

export function getReportAssistantRuntimeStatus(input?: {
  env?: Record<string, string | undefined>;
  now?: () => Date;
}): ReportAssistantRuntimeStatus {
  const env = input?.env ?? process.env;
  const now = input?.now ?? (() => new Date());
  const modelSettings = getReportAssistantModelSettings(env);
  const researchSettings = getReportAssistantPlausibilityResearchSettings(env);

  return {
    findingsQueuePath: REPORT_ASSISTANT_FINDINGS_RELATIVE_PATH,
    generatedAtIso: now().toISOString(),
    modelProvider: providerStatus(modelSettings),
    mutatingToolsExposed: false,
    researchProvider: providerStatus(researchSettings ? { ...researchSettings, provider: "research_provider" } : null),
    tools: REPORT_ASSISTANT_MCP_TOOL_DEFINITIONS.map((tool) => ({
      description: tool.description,
      mutates: false,
      name: tool.name,
      requiredInputs: tool.requiredInputs
    }))
  };
}
