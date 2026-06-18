export type ReportAssistantToolName =
  | "find_report_value_mentions"
  | "prepare_calculator_finding"
  | "preview_report_patch"
  | "research_acoustic_reference"
  | "resolve_report_metric_reference";

export type ReportAssistantToolDefinition = {
  description: string;
  mutates: false;
  name: ReportAssistantToolName;
  requiredInputs: readonly string[];
};

export const REPORT_ASSISTANT_MCP_TOOL_DEFINITIONS: readonly ReportAssistantToolDefinition[] = [
  {
    description: "Resolve a user-facing metric phrase against the current report assistant context without guessing.",
    mutates: false,
    name: "resolve_report_metric_reference",
    requiredInputs: ["context", "phrase"]
  },
  {
    description: "Validate a proposed report patch and return a preview without applying it.",
    mutates: false,
    name: "preview_report_patch",
    requiredInputs: ["context", "document", "patch"]
  },
  {
    description: "Find stale literal report value mentions that may need user-approved text edits.",
    mutates: false,
    name: "find_report_value_mentions",
    requiredInputs: ["context", "document", "patch"]
  },
  {
    description: "Run context-only or configured source-bounded plausibility review for one current report metric.",
    mutates: false,
    name: "research_acoustic_reference",
    requiredInputs: ["context", "review"]
  },
  {
    description: "Prepare a calculator review finding record without writing it to the JSONL queue.",
    mutates: false,
    name: "prepare_calculator_finding",
    requiredInputs: ["context", "finding"]
  }
];
