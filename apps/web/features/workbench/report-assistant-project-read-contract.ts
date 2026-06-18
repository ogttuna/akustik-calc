export type ReportAssistantProjectReadToolName =
  | "list_projects"
  | "read_project_summary"
  | "list_project_assemblies"
  | "read_project_assembly_snapshot"
  | "list_project_reports"
  | "read_project_report_document"
  | "list_project_report_revisions"
  | "read_project_report_revision";

export type ReportAssistantProjectReadToolDefinition = {
  description: string;
  mutates: false;
  name: ReportAssistantProjectReadToolName;
  requiredInputs: readonly string[];
};

export const REPORT_ASSISTANT_PROJECT_READ_TOOL_DEFINITIONS: readonly ReportAssistantProjectReadToolDefinition[] = [
  {
    description: "List accessible saved project summaries without report bodies or assembly snapshots.",
    mutates: false,
    name: "list_projects",
    requiredInputs: []
  },
  {
    description: "Read one saved project summary by explicit project id.",
    mutates: false,
    name: "read_project_summary",
    requiredInputs: ["projectId"]
  },
  {
    description: "List saved layer-combination summaries for one explicit project id.",
    mutates: false,
    name: "list_project_assemblies",
    requiredInputs: ["projectId"]
  },
  {
    description: "Read one saved layer-combination snapshot by explicit project and assembly ids.",
    mutates: false,
    name: "read_project_assembly_snapshot",
    requiredInputs: ["projectId", "assemblyId"]
  },
  {
    description: "List saved report summaries for one explicit project id.",
    mutates: false,
    name: "list_project_reports",
    requiredInputs: ["projectId"]
  },
  {
    description: "Read the current saved report document by explicit project and report ids.",
    mutates: false,
    name: "read_project_report_document",
    requiredInputs: ["projectId", "reportId"]
  },
  {
    description: "List saved report revision summaries by explicit project and report ids.",
    mutates: false,
    name: "list_project_report_revisions",
    requiredInputs: ["projectId", "reportId"]
  },
  {
    description: "Read one saved report revision document by explicit project, report, and revision ids.",
    mutates: false,
    name: "read_project_report_revision",
    requiredInputs: ["projectId", "reportId", "revisionId"]
  }
];
