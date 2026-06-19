import { REPORT_ASSISTANT_ACTION_PROPOSAL_DEFINITIONS } from "./report-assistant-action-proposal";
import { REPORT_ASSISTANT_PRESET_READ_TOOL_DEFINITIONS } from "./report-assistant-preset-library";
import { REPORT_ASSISTANT_PROJECT_READ_TOOL_DEFINITIONS } from "./report-assistant-project-read-contract";
import { REPORT_ASSISTANT_MCP_TOOL_DEFINITIONS } from "./report-assistant-tool-definitions";
import { WORKBENCH_V2_CALCULATOR_ASSISTANT_TOOL_DEFINITIONS } from "../workbench-rebuild/workbench-v2-calculator-assistant";

export type ReportAssistantCapabilityCategory =
  | "action_proposal"
  | "mcp_tool"
  | "preview_tool"
  | "read_tool"
  | "route";

export type ReportAssistantCapabilityAuthPolicy =
  | "none"
  | "owner_scope_required"
  | "session_when_configured";

export type ReportAssistantCapabilityProviderPolicy =
  | "local_calculator"
  | "local_only"
  | "model_provider_optional"
  | "research_provider_optional";

export type ReportAssistantCapabilityRendererKind =
  | "action_proposal_card"
  | "calculator_preview_card"
  | "error_card"
  | "finding_log_card"
  | "patch_proposal_card"
  | "project_read_card"
  | "query_answer_card"
  | "research_review_card"
  | "runtime_status_card"
  | "tool_result_card"
  | "wall_candidate_comparison_card";

export type ReportAssistantCapabilityResultKind =
  | "action_proposal"
  | "assembly_alternatives_review"
  | "calculator_preview"
  | "finding_log"
  | "patch_proposal"
  | "plausibility_review"
  | "preset_read"
  | "project_read"
  | "query_answer"
  | "runtime_status"
  | "tool_result"
  | "wall_candidate_comparison";

export type ReportAssistantCapabilityStalePolicy =
  | "assistant_context_signature"
  | "assistant_context_and_document_signature"
  | "none"
  | "snapshot_or_description_request"
  | "target_stale_guard";

export type ReportAssistantCapabilityRoute = {
  method: "GET" | "POST";
  pathname: `/api/report-assistant/${string}`;
};

export type ReportAssistantCapabilityContract = {
  authPolicy: ReportAssistantCapabilityAuthPolicy;
  category: ReportAssistantCapabilityCategory;
  description: string;
  exposedToModel: boolean;
  mutates: boolean;
  name: string;
  previewOnly: boolean;
  providerPolicy: ReportAssistantCapabilityProviderPolicy;
  rendererKind: ReportAssistantCapabilityRendererKind;
  requiredInputs: readonly string[];
  requiresConfirmation: boolean;
  resultKind: ReportAssistantCapabilityResultKind;
  route?: ReportAssistantCapabilityRoute;
  stalePolicy: ReportAssistantCapabilityStalePolicy;
};

type NonMutatingRuntimeToolCapability = ReportAssistantCapabilityContract & {
  mutates: false;
};

const REPORT_ASSISTANT_ROUTE_CAPABILITIES = [
  {
    authPolicy: "owner_scope_required",
    category: "route",
    description: "Preview supported project/report/preset actions without applying them.",
    exposedToModel: false,
    mutates: false,
    name: "report_assistant_action_proposal_route",
    previewOnly: true,
    providerPolicy: "local_only",
    rendererKind: "action_proposal_card",
    requiredInputs: ["context", "document", "instruction"],
    requiresConfirmation: true,
    resultKind: "action_proposal",
    route: {
      method: "POST",
      pathname: "/api/report-assistant/action-proposal"
    },
    stalePolicy: "assistant_context_and_document_signature"
  },
  {
    authPolicy: "session_when_configured",
    category: "route",
    description: "Review possible assembly alternatives without changing report or calculator state.",
    exposedToModel: false,
    mutates: false,
    name: "report_assistant_assembly_alternatives_route",
    previewOnly: true,
    providerPolicy: "research_provider_optional",
    rendererKind: "research_review_card",
    requiredInputs: ["context", "document", "request"],
    requiresConfirmation: false,
    resultKind: "assembly_alternatives_review",
    route: {
      method: "POST",
      pathname: "/api/report-assistant/assembly-alternatives"
    },
    stalePolicy: "assistant_context_and_document_signature"
  },
  {
    authPolicy: "session_when_configured",
    category: "route",
    description: "Run preview-only calculator output from a Workbench snapshot or described wall stack.",
    exposedToModel: false,
    mutates: false,
    name: "report_assistant_calculator_preview_route",
    previewOnly: true,
    providerPolicy: "local_calculator",
    rendererKind: "calculator_preview_card",
    requiredInputs: ["snapshot or description"],
    requiresConfirmation: false,
    resultKind: "calculator_preview",
    route: {
      method: "POST",
      pathname: "/api/report-assistant/calculator-preview"
    },
    stalePolicy: "snapshot_or_description_request"
  },
  {
    authPolicy: "session_when_configured",
    category: "route",
    description: "Append a confirmed calculator review finding to the local review queue.",
    exposedToModel: false,
    mutates: true,
    name: "report_assistant_findings_route",
    previewOnly: false,
    providerPolicy: "local_only",
    rendererKind: "finding_log_card",
    requiredInputs: ["confirmed", "context", "finding"],
    requiresConfirmation: true,
    resultKind: "finding_log",
    route: {
      method: "POST",
      pathname: "/api/report-assistant/findings"
    },
    stalePolicy: "assistant_context_signature"
  },
  {
    authPolicy: "session_when_configured",
    category: "route",
    description: "Generate and validate a report patch proposal without applying it.",
    exposedToModel: false,
    mutates: false,
    name: "report_assistant_patch_route",
    previewOnly: true,
    providerPolicy: "model_provider_optional",
    rendererKind: "patch_proposal_card",
    requiredInputs: ["context", "document", "instruction"],
    requiresConfirmation: true,
    resultKind: "patch_proposal",
    route: {
      method: "POST",
      pathname: "/api/report-assistant/patch"
    },
    stalePolicy: "assistant_context_and_document_signature"
  },
  {
    authPolicy: "session_when_configured",
    category: "route",
    description: "Review one metric for plausibility without calibrating calculator behavior.",
    exposedToModel: false,
    mutates: false,
    name: "report_assistant_plausibility_route",
    previewOnly: true,
    providerPolicy: "research_provider_optional",
    rendererKind: "research_review_card",
    requiredInputs: ["context", "document", "review"],
    requiresConfirmation: false,
    resultKind: "plausibility_review",
    route: {
      method: "POST",
      pathname: "/api/report-assistant/plausibility"
    },
    stalePolicy: "assistant_context_and_document_signature"
  },
  {
    authPolicy: "owner_scope_required",
    category: "route",
    description: "Run owner-scoped project read tools without mutating saved project state.",
    exposedToModel: false,
    mutates: false,
    name: "report_assistant_project_read_route",
    previewOnly: false,
    providerPolicy: "local_only",
    rendererKind: "project_read_card",
    requiredInputs: ["action"],
    requiresConfirmation: false,
    resultKind: "project_read",
    route: {
      method: "POST",
      pathname: "/api/report-assistant/project-read"
    },
    stalePolicy: "none"
  },
  {
    authPolicy: "owner_scope_required",
    category: "route",
    description: "Answer read-only report/project/preset/calculator-preview queries.",
    exposedToModel: false,
    mutates: false,
    name: "report_assistant_query_route",
    previewOnly: false,
    providerPolicy: "local_calculator",
    rendererKind: "query_answer_card",
    requiredInputs: ["context", "instruction"],
    requiresConfirmation: false,
    resultKind: "query_answer",
    route: {
      method: "POST",
      pathname: "/api/report-assistant/query"
    },
    stalePolicy: "assistant_context_signature"
  },
  {
    authPolicy: "session_when_configured",
    category: "route",
    description: "Report assistant provider, tool, route, and action readiness without exposing credentials.",
    exposedToModel: false,
    mutates: false,
    name: "report_assistant_status_route",
    previewOnly: false,
    providerPolicy: "local_only",
    rendererKind: "runtime_status_card",
    requiredInputs: [],
    requiresConfirmation: false,
    resultKind: "runtime_status",
    route: {
      method: "GET",
      pathname: "/api/report-assistant/status"
    },
    stalePolicy: "none"
  }
] as const satisfies readonly ReportAssistantCapabilityContract[];

const REPORT_ASSISTANT_MCP_TOOL_CAPABILITIES = REPORT_ASSISTANT_MCP_TOOL_DEFINITIONS.map((tool) => ({
  authPolicy: "session_when_configured",
  category: "mcp_tool",
  description: tool.description,
  exposedToModel: true,
  mutates: false,
  name: tool.name,
  previewOnly: true,
  providerPolicy: tool.name === "research_acoustic_reference" ? "research_provider_optional" : "local_only",
  rendererKind: "tool_result_card",
  requiredInputs: tool.requiredInputs,
  requiresConfirmation: false,
  resultKind: "tool_result",
  stalePolicy: "assistant_context_and_document_signature"
} as const satisfies ReportAssistantCapabilityContract));

const REPORT_ASSISTANT_PROJECT_READ_TOOL_CAPABILITIES = REPORT_ASSISTANT_PROJECT_READ_TOOL_DEFINITIONS.map((tool) => ({
  authPolicy: "owner_scope_required",
  category: "read_tool",
  description: tool.description,
  exposedToModel: true,
  mutates: false,
  name: tool.name,
  previewOnly: false,
  providerPolicy: "local_only",
  rendererKind: "project_read_card",
  requiredInputs: tool.requiredInputs,
  requiresConfirmation: false,
  resultKind: "project_read",
  stalePolicy: "none"
} as const satisfies ReportAssistantCapabilityContract));

const REPORT_ASSISTANT_PRESET_READ_TOOL_CAPABILITIES = REPORT_ASSISTANT_PRESET_READ_TOOL_DEFINITIONS.map((tool) => ({
  authPolicy: tool.name.includes("_user_") ? "owner_scope_required" : "session_when_configured",
  category: "read_tool",
  description: tool.description,
  exposedToModel: true,
  mutates: false,
  name: tool.name,
  previewOnly: false,
  providerPolicy: "local_only",
  rendererKind: "project_read_card",
  requiredInputs: tool.requiredInputs,
  requiresConfirmation: false,
  resultKind: "preset_read",
  stalePolicy: "none"
} as const satisfies ReportAssistantCapabilityContract));

const REPORT_ASSISTANT_CALCULATOR_TOOL_CAPABILITIES = WORKBENCH_V2_CALCULATOR_ASSISTANT_TOOL_DEFINITIONS.map((tool) => ({
  authPolicy: "session_when_configured",
  category: "preview_tool",
  description: tool.description,
  exposedToModel: true,
  mutates: false,
  name: tool.name,
  previewOnly: true,
  providerPolicy: "local_calculator",
  rendererKind: "calculator_preview_card",
  requiredInputs: tool.requiredInputs,
  requiresConfirmation: false,
  resultKind: "calculator_preview",
  stalePolicy: tool.name === "preview_workbench_v2_calculator_snapshot"
    ? "snapshot_or_description_request"
    : "assistant_context_signature"
} as const satisfies ReportAssistantCapabilityContract));

const REPORT_ASSISTANT_LOCAL_PREVIEW_CAPABILITIES = [
  {
    authPolicy: "session_when_configured",
    category: "preview_tool",
    description: "Compare bounded wall layer-stack candidates with preview-only calculator-backed rows.",
    exposedToModel: false,
    mutates: false,
    name: "report_assistant_wall_candidate_comparison_preview",
    previewOnly: true,
    providerPolicy: "local_calculator",
    rendererKind: "wall_candidate_comparison_card",
    requiredInputs: ["instruction"],
    requiresConfirmation: false,
    resultKind: "wall_candidate_comparison",
    stalePolicy: "snapshot_or_description_request"
  },
  {
    authPolicy: "session_when_configured",
    category: "preview_tool",
    description: "Preview applying a ready assistant layer-stack draft to the unsaved Workbench calculator draft.",
    exposedToModel: false,
    mutates: false,
    name: "report_assistant_workbench_apply_proposal",
    previewOnly: true,
    providerPolicy: "local_only",
    rendererKind: "action_proposal_card",
    requiredInputs: ["layerStackDraft", "targetWorkbenchSnapshotSignature"],
    requiresConfirmation: true,
    resultKind: "action_proposal",
    stalePolicy: "target_stale_guard"
  }
] as const satisfies readonly ReportAssistantCapabilityContract[];

const REPORT_ASSISTANT_ACTION_PROPOSAL_CAPABILITIES = REPORT_ASSISTANT_ACTION_PROPOSAL_DEFINITIONS.map((action) => ({
  authPolicy: "owner_scope_required",
  category: "action_proposal",
  description: action.description,
  exposedToModel: false,
  mutates: false,
  name: action.name,
  previewOnly: true,
  providerPolicy: "local_only",
  rendererKind: "action_proposal_card",
  requiredInputs: ["context", "document", "instruction"],
  requiresConfirmation: true,
  resultKind: "action_proposal",
  route: {
    method: "POST",
    pathname: "/api/report-assistant/action-proposal"
  },
  stalePolicy: "target_stale_guard"
} as const satisfies ReportAssistantCapabilityContract));

export const REPORT_ASSISTANT_CAPABILITY_REGISTRY: readonly ReportAssistantCapabilityContract[] = [
  ...REPORT_ASSISTANT_ROUTE_CAPABILITIES,
  ...REPORT_ASSISTANT_MCP_TOOL_CAPABILITIES,
  ...REPORT_ASSISTANT_PROJECT_READ_TOOL_CAPABILITIES,
  ...REPORT_ASSISTANT_PRESET_READ_TOOL_CAPABILITIES,
  ...REPORT_ASSISTANT_CALCULATOR_TOOL_CAPABILITIES,
  ...REPORT_ASSISTANT_LOCAL_PREVIEW_CAPABILITIES,
  ...REPORT_ASSISTANT_ACTION_PROPOSAL_CAPABILITIES
];

export function getReportAssistantRouteCapabilities(): readonly ReportAssistantCapabilityContract[] {
  return REPORT_ASSISTANT_CAPABILITY_REGISTRY.filter((capability) => capability.category === "route");
}

export function getReportAssistantActionProposalCapabilities(): readonly ReportAssistantCapabilityContract[] {
  return REPORT_ASSISTANT_CAPABILITY_REGISTRY.filter((capability) => capability.category === "action_proposal");
}

export function getReportAssistantRuntimeToolCapabilities(): readonly NonMutatingRuntimeToolCapability[] {
  return REPORT_ASSISTANT_CAPABILITY_REGISTRY.filter((capability): capability is NonMutatingRuntimeToolCapability =>
    capability.exposedToModel &&
    capability.mutates === false &&
    (
      capability.category === "mcp_tool" ||
      capability.category === "preview_tool" ||
      capability.category === "read_tool"
    )
  );
}

export function hasReportAssistantMutatingModelTool(): boolean {
  return REPORT_ASSISTANT_CAPABILITY_REGISTRY.some((capability) => capability.exposedToModel && capability.mutates);
}
